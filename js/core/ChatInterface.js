/**
 * ChatInterface - Main class for the chat interface
 */

import ManagedEventSource from './ManagedEventSource.js';
import {jsonLdToHtml, quickHash} from '../utils/JsonUtils.js';
import * as UI from '../ui/ChatInterfaceUI.js';

/**
 * ChatInterface class - Handles the chat interface and communication with the server
 */
class ChatInterface {
    /**
     * Creates a new ChatInterface instance
     * @param {string} site - The site to search
     * @param {string} display_mode - The display mode (dropdown or full)
     * @param {string} generate_mode - The generate mode (list, summarize, generate)
     * @param {string} apiEndpoint - The API endpoint for the chat
     */
    constructor(site = null, display_mode = "dropdown", generate_mode = "list", apiEndpoint = "/ask") {
        if (site) {
            this.site = site;
        }
        // Store API endpoint
        this.apiEndpoint = apiEndpoint;
        // Parse URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('query');
        const prevMessagesStr = urlParams.get('prev');
        const contextUrl = urlParams.get('context_url');
        const url_generate_mode = urlParams.get('generate_mode');
        if (url_generate_mode) {
            this.generate_mode = url_generate_mode;
        }
        this.generate_mode = generate_mode;
        this.display_mode = display_mode;

        this.prevMessages = prevMessagesStr ? JSON.parse(decodeURIComponent(prevMessagesStr)) : [];
        UI.createInterface(this, display_mode);
        UI.bindEvents(this);
        this.eventSource = null;
        this.dotsStillThere = false;
        this.resetChatState();
        // Add message if query parameter exists
        if (query) {
            this.sendMessage(decodeURIComponent(query));
        }
    }

    /**
     * Resets the chat state
     */
    resetChatState() {
        this.messagesArea.innerHTML = '';
        this.messages = [];
        this.prevMessages = [];
        this.currentMessage = [];
        this.currentItems = [];
        this.itemToRemember = [];
        this.thisRoundSummary = null;
    }

    /**
     * Sends a message to the server
     * @param {string} query - The query to send
     */
    sendMessage(query = null) {
        const message = query || this.input.value.trim();
        if (!message) return;

        // Add user message
        this.addMessage(message, 'user');
        this.currentMessage = message;
        this.input.value = '';

        // Simulate assistant response
        this.getResponse(message);
    }

    /**
     * Adds a message to the chat
     * @param {string} content - The message content
     * @param {string} sender - The sender (user or assistant)
     */
    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        if (sender == "user") {
            this.lastUserMessageDiv = messageDiv;
            const scrollDiv = document.createElement('span');
            scrollDiv.id = quickHash(content.toString());
            messageDiv.appendChild(scrollDiv);
            messageDiv.appendChild(document.createElement('br'));
            messageDiv.appendChild(document.createElement('br'));
            this.scrollDiv = scrollDiv;
        }
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        let parsedContent;
        try {
            parsedContent = JSON.parse(content);
        } catch (e) {
            parsedContent = content;
        }

        // Replace innerHTML with safer DOM manipulation
        if (Array.isArray(parsedContent)) {
            // Clear any existing content
            while (bubble.firstChild) {
                bubble.removeChild(bubble.firstChild);
            }

            // Append each item
            parsedContent.forEach(obj => {
                const itemElement = this.createJsonItemHtml(obj);
                bubble.appendChild(itemElement);

                // Add line breaks between items if not the last one
                if (parsedContent.indexOf(obj) < parsedContent.length - 1) {
                    bubble.appendChild(document.createElement('br'));
                    bubble.appendChild(document.createElement('br'));
                }
            });
        } else {
            bubble.textContent = content;
        }

        messageDiv.appendChild(bubble);
        this.messagesArea.appendChild(messageDiv);
        this.messagesArea.scrollTop = this.messagesArea.scrollHeight;

        this.messages.push({content, sender});

        this.currentMessage = "";
    }

    /**
     * Extracts an image from a schema object
     * @param {Object} schema_object - The schema object
     * @returns {string|null} The image URL or null
     */
    extractImage(schema_object) {
        if (schema_object && schema_object.image) {
            return this.extractImageInternal(schema_object.image);
        }
        return null;
    }

    /**
     * Extracts an image URL from an image object
     * @param {Object|string} image - The image object or URL
     * @returns {string|null} The image URL or null
     */
    extractImageInternal(image) {
        if (typeof image === 'string') {
            return image;
        } else if (typeof image === 'object' && image.url) {
            return image.url;
        } else if (typeof image === 'object' && image.contentUrl) {
            return image.contentUrl;
        } else if (image instanceof Array) {
            if (image[0] && typeof image[0] === 'string') {
                return image[0];
            } else if (image[0] && typeof image[0] === 'object') {
                return this.extractImageInternal(image[0]);
            }
        }
        return null;
    }

    /**
     * Creates an HTML element for a JSON item
     * @param {Object} item - The item object
     * @returns {HTMLElement} The item element
     */
    createJsonItemHtml(item) {
        return UI.createJsonItemHtml(item, this);
    }

    /**
     * Creates an HTML element for an intermediate message
     * @param {string} message - The message text
     * @returns {HTMLElement} The message element
     */
    createIntermediateMessageHtml(message) {
        return UI.createIntermediateMessageHtml(message);
    }

    /**
     * Creates an HTML element for a memory message
     * @param {string} itemToRemember - The item to remember
     * @param {Object} chatInterface - The chat interface instance
     * @returns {HTMLElement|null} The message element or null
     */
    memoryMessage(itemToRemember, chatInterface) {
        return UI.memoryMessage(itemToRemember, chatInterface);
    }

    /**
     * Creates an HTML element for an ask user message
     * @param {string} message - The message text
     * @param {Object} chatInterface - The chat interface instance
     */
    askUserMessage(message, chatInterface) {
        UI.askUserMessage(message, chatInterface);
    }

    /**
     * Creates an HTML element for a site is irrelevant to query message
     * @param {string} message - The message text
     * @param {Object} chatInterface - The chat interface instance
     */
    siteIsIrrelevantToQuery(message, chatInterface) {
        UI.siteIsIrrelevantToQuery(message, chatInterface);
    }

    /**
     * Creates an HTML element for an item details message
     * @param {string} itemDetails - The item details
     * @param {Object} chatInterface - The chat interface instance
     * @returns {HTMLElement|null} The message element or null
     */
    itemDetailsMessage(itemDetails, chatInterface) {
        return UI.itemDetailsMessage(itemDetails, chatInterface);
    }

    /**
     * Resorts the results based on score
     * @param {Object} chatInterface - The chat interface instance
     */
    resortResults(chatInterface) {
        UI.resortResults(chatInterface);
    }

    /**
     * Creates an HTML element for insufficient results
     * @returns {HTMLElement} The message element
     */
    createInsufficientResultsHtml() {
        return UI.createInsufficientResultsHtml(this);
    }

    /**
     * Handles the first message from the server
     * @param {Object} event - The event object
     */
    handleFirstMessage(event) {
        UI.handleFirstMessage(event, this);
    }

    /**
     * Possibly annotates the user query with decontextualized query
     * @param {Object} chatInterface - The chat interface instance
     * @param {string} decontextualizedQuery - The decontextualized query
     */
    possiblyAnnotateUserQuery(chatInterface, decontextualizedQuery) {
        UI.possiblyAnnotateUserQuery(chatInterface, decontextualizedQuery);
    }

    /**
     * Gets a response from the server
     * @param {string} message - The message to send
     */
    async getResponse(message) {
        // Add loading state
        const loadingDots = '...';
        this.addMessage(loadingDots, 'assistant');
        this.dotsStillThere = true;

        try {
            console.log("generate_mode", this.generate_mode);
            const selectedSite = this.site || (this.siteSelect && this.siteSelect.value ? this.siteSelect.value : '');
            const prev = JSON.stringify(this.prevMessages);
            const generate_mode = this.generate_mode;
            const context_url = this.context_url && this.context_url.value ? this.context_url.value : '';
            // Generate a unique query ID based on query arguments and current timestamp
            const timestamp = new Date().getTime();
            const queryId = `query_${timestamp}_${Math.floor(Math.random() * 1000)}`;
            console.log("Generated query ID:", queryId);

            // Add the query ID to the request parameters
            const queryParams = new URLSearchParams();
            queryParams.append('query_id', queryId);
            queryParams.append('query', message);
            if (selectedSite) {
                queryParams.append('site', selectedSite);
            }
            queryParams.append('generate_mode', generate_mode);
            queryParams.append('prev', prev);
            queryParams.append('item_to_remember', this.itemToRemember || '');
            queryParams.append('context_url', context_url);

            const queryString = queryParams.toString();
            const url = `${this.apiEndpoint}?${queryString}`;
            console.log("url", url);
            this.eventSource = new ManagedEventSource(url);
            this.eventSource.query_id = queryId;
            this.eventSource.connect(this);
            this.prevMessages.push(message);

        } catch (error) {
            console.error('Error fetching response:', error);
        }
    }

    /**
     * Creates a debug string for the current items
     * @returns {string} The debug string
     */
    createDebugString() {
        return jsonLdToHtml(this.currentItems);
    }

    /**
     * Clears the chat history
     */
    clearHistory() {
        this.messagesArea.innerHTML = "";
        this.messages = [];
        this.prevMessages = [];
    }
}

export default ChatInterface;