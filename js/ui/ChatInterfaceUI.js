/**
 * UI-related components and methods for the ChatInterface
 */

import {htmlUnescape, sanitizeUrl} from '../utils/JsonUtils.js';

/**
 * Creates a selector label element
 * @param {string} label - The label text
 * @returns {HTMLElement} The label element
 */
export function makeSelectorLabel(label) {
    const labelDiv = document.createElement('span');
    labelDiv.textContent = " " + label + " ";
    return labelDiv;
}

/**
 * Creates selectors for site and generate mode
 * @param {Object} chatInterface - The chat interface instance
 */
export function createSelectors(chatInterface) {
    // Create selectors
    const selector = document.createElement('div');
    chatInterface.selector = selector;
    selector.className = 'site-selector';

    // Create site selector
    const siteSelect = document.createElement('select');
    chatInterface.siteSelect = siteSelect;
    getSites().forEach(site => {
        const option = document.createElement('option');
        option.value = site;
        option.textContent = site;
        siteSelect.appendChild(option);
    });
    selector.appendChild(makeSelectorLabel("Site"));
    selector.appendChild(siteSelect);
    siteSelect.addEventListener('change', () => {
        chatInterface.resetChatState();
    });

    const generateModeSelect = document.createElement('select');
    chatInterface.generateModeSelect = generateModeSelect;
    selector.appendChild(makeSelectorLabel("Mode"));
    getGenerateModes().forEach(mode => {
        const option = document.createElement('option');
        option.value = mode;
        option.textContent = mode;
        generateModeSelect.appendChild(option);
    });
    generateModeSelect.addEventListener('change', () => {
        chatInterface.generate_mode = generateModeSelect.value;
        chatInterface.resetChatState();
    });
    selector.appendChild(generateModeSelect);

    // Create clear chat icon
    const clearIcon = document.createElement('span');
    clearIcon.innerHTML = '<img src="/html/clear.jpeg" width="16" height="16" style="vertical-align: middle; cursor: pointer; margin-left: 8px;">';
    clearIcon.title = "Clear chat history";
    clearIcon.addEventListener('click', () => {
        chatInterface.resetChatState();
    });
    selector.appendChild(clearIcon);

    // Create debug icon
    const debugIcon = document.createElement('span');
    debugIcon.innerHTML = '<img src="/html/debug.png" width="16" height="16" style="vertical-align: middle; cursor: pointer; margin-left: 8px;">';
    debugIcon.title = "Debug";
    debugIcon.addEventListener('click', () => {
        if (chatInterface.debug_mode) {
            chatInterface.debug_mode = false;
            chatInterface.bubble.innerHTML = '';
            chatInterface.resortResults(chatInterface);
        } else {
            chatInterface.debug_mode = true;
            chatInterface.bubble.innerHTML = chatInterface.createDebugString();
        }
    });
    selector.appendChild(debugIcon);

    const contextUrlDiv = document.createElement('div');
    contextUrlDiv.id = 'context_url_div';
    contextUrlDiv.style.display = 'none';
    contextUrlDiv.style.marginTop = '8px';

    const contextUrlInput = document.createElement('input');
    contextUrlInput.type = 'text';
    contextUrlInput.id = 'context_url';
    contextUrlInput.placeholder = 'Enter Context URL';
    contextUrlInput.style.width = '200px';

    contextUrlDiv.appendChild(makeSelectorLabel("Context URL"));
    contextUrlDiv.appendChild(contextUrlInput);
    selector.appendChild(contextUrlDiv);
    chatInterface.context_url = contextUrlInput;

    chatInterface.container.appendChild(selector);
}

/**
 * Creates the chat interface UI
 * @param {Object} chatInterface - The chat interface instance
 * @param {string} display_mode - The display mode (dropdown or full)
 */
export function createInterface(chatInterface, display_mode = "dropdown") {
    // Create main container
    chatInterface.container = document.getElementById('chat-container');

    if (display_mode == "dropdown") {
        createSelectors(chatInterface);
    }
    // Create messages area
    chatInterface.messagesArea = document.createElement('div');
    chatInterface.messagesArea.className = (display_mode == "dropdown" ? 'messages' : 'messages_full');

    // Create input area
    chatInterface.inputArea = document.createElement('div');
    chatInterface.inputArea.className = (display_mode == "dropdown" ? 'input-area' : 'input-area_full');

    // Create input field
    chatInterface.input = document.createElement('textarea');
    chatInterface.input.className = 'message-input';
    chatInterface.input.placeholder = 'Type your message...';

    // Create send button
    chatInterface.sendButton = document.createElement('button');
    chatInterface.sendButton.className = 'send-button';
    chatInterface.sendButton.textContent = 'Send';

    // Assemble the interface
    chatInterface.inputArea.appendChild(chatInterface.input);
    chatInterface.inputArea.appendChild(chatInterface.sendButton);
    chatInterface.container.appendChild(chatInterface.messagesArea);
    chatInterface.container.appendChild(chatInterface.inputArea);
}

/**
 * Binds event handlers to UI elements
 * @param {Object} chatInterface - The chat interface instance
 */
export function bindEvents(chatInterface) {
    // Send message on button click
    chatInterface.sendButton.addEventListener('click', () => chatInterface.sendMessage());

    // Send message on Enter (but allow Shift+Enter for new lines)
    chatInterface.input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            chatInterface.sendMessage();
        }
    });
}

/**
 * Creates an HTML element for an intermediate message
 * @param {string} message - The message text
 * @returns {HTMLElement} The message element
 */
export function createIntermediateMessageHtml(message) {
    const container = document.createElement('div');
    container.className = 'intermediate-container';
    container.textContent = message;
    return container;
}

/**
 * Creates an HTML element for a memory message
 * @param {string} itemToRemember - The item to remember
 * @param {Object} chatInterface - The chat interface instance
 * @returns {HTMLElement|null} The message element or null
 */
export function memoryMessage(itemToRemember, chatInterface) {
    if (itemToRemember) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `remember-message`;
        messageDiv.textContent = itemToRemember;
        chatInterface.thisRoundRemembered = messageDiv;
        chatInterface.bubble.appendChild(messageDiv);
        return messageDiv;
    }
    return null;
}

/**
 * Creates an HTML element for an ask user message
 * @param {string} message - The message text
 * @param {Object} chatInterface - The chat interface instance
 */
export function askUserMessage(message, chatInterface) {
    console.log("askUserMessage", message);
    const messageDiv = document.createElement('div');
    messageDiv.className = `ask-user-message`;
    messageDiv.textContent = message;
    chatInterface.bubble.appendChild(messageDiv);
}

/**
 * Creates an HTML element for a site is irrelevant to query message
 * @param {string} message - The message text
 * @param {Object} chatInterface - The chat interface instance
 */
export function siteIsIrrelevantToQuery(message, chatInterface) {
    console.log("siteIsIrrelevantToQuery", message);
    const messageDiv = document.createElement('div');
    messageDiv.className = `site-is-irrelevant-to-query`;
    messageDiv.textContent = message;
    chatInterface.bubble.appendChild(messageDiv);
}

/**
 * Creates an HTML element for an item details message
 * @param {string} itemDetails - The item details
 * @param {Object} chatInterface - The chat interface instance
 * @returns {HTMLElement|null} The message element or null
 */
export function itemDetailsMessage(itemDetails, chatInterface) {
    if (itemDetails) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `item-details-message`;
        messageDiv.textContent = itemDetails;
        chatInterface.thisRoundRemembered = messageDiv;
        chatInterface.bubble.appendChild(messageDiv);
        return messageDiv;
    }
    return null;
}

/**
 * Creates an HTML element for a span with specific styling
 * @param {string} content - The content text
 * @returns {HTMLElement} The span element
 */
export function makeAsSpan(content) {
    const span = document.createElement('span');
    span.textContent = content;
    span.style.fontSize = '0.85em';
    return span;
}

/**
 * Adds an explanation to an item
 * @param {Object} item - The item object
 * @param {HTMLElement} contentDiv - The content div to add the explanation to
 * @param {boolean} force - Whether to force adding the explanation
 * @returns {HTMLElement} The details div
 */
export function possiblyAddExplanation(item, contentDiv, force = false) {
    const detailsDiv = document.createElement('div');
    contentDiv.appendChild(document.createElement('br'));
    const expl_span = makeAsSpan(item.explanation);
    expl_span.className = 'item-details-message';
    detailsDiv.appendChild(expl_span);
    contentDiv.appendChild(detailsDiv);
    return detailsDiv;
}

/**
 * Adds type-specific content to an item
 * @param {Object} item - The item object
 * @param {HTMLElement} contentDiv - The content div to add the content to
 */
export function typeSpecificContent(item, contentDiv) {
    const houseTypes = ["SingleFamilyResidence", "Apartment", "Townhouse", "House", "Condominium", "RealEstateListing"];
    if (!item.schema_object) {
        return;
    }
    const objType = item.schema_object['@type'];
    if (objType == "PodcastEpisode") {
        possiblyAddExplanation(item, contentDiv, true);
        return;
    }
    if (houseTypes.includes(objType)) {
        const detailsDiv = possiblyAddExplanation(item, contentDiv, true);
        const price = item.schema_object.price;
        const address = item.schema_object.address;
        const numBedrooms = item.schema_object.numberOfRooms;
        const numBathrooms = item.schema_object.numberOfBathroomsTotal;
        const sqft = item.schema_object.floorSize?.value;
        let priceValue = price;
        if (typeof price === 'object') {
            priceValue = price.price || price.value || price;
            priceValue = Math.round(priceValue / 100000) * 100000;
            priceValue = priceValue.toLocaleString('en-US');
        }

        if (address?.streetAddress && address?.addressLocality) {
            detailsDiv.appendChild(makeAsSpan(address.streetAddress + ", " + address.addressLocality));
            detailsDiv.appendChild(document.createElement('br'));
        }

        if (numBedrooms && numBathrooms && sqft) {
            detailsDiv.appendChild(makeAsSpan(`${numBedrooms} bedrooms, ${numBathrooms} bathrooms, ${sqft} sqft`));
            detailsDiv.appendChild(document.createElement('br'));
        }

        if (priceValue) {
            detailsDiv.appendChild(makeAsSpan(`Listed at ${priceValue}`));
        }
    }
}

/**
 * Gets the name of an item
 * @param {Object} item - The item object
 * @returns {string} The item name
 */
export function getItemName(item) {
    if (item.name) {
        return item.name;
    } else if (item.schema_object && item.schema_object.keywords) {
        return item.schema_object.keywords;
    }
    return item.url;
}

/**
 * Creates an HTML element for a JSON item
 * @param {Object} item - The item object
 * @param {Object} chatInterface - The chat interface instance
 * @returns {HTMLElement} The item element
 */
export function createJsonItemHtml(item, chatInterface) {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.marginBottom = '1em';
    container.style.gap = '1em';

    // Left content div (title + description)
    const contentDiv = document.createElement('div');
    contentDiv.style.flex = '1';

    // Title row with link and question mark
    const titleRow = document.createElement('div');
    titleRow.style.display = 'flex';
    titleRow.style.alignItems = 'center';
    titleRow.style.gap = '0.5em';
    titleRow.style.marginBottom = '0.5em';

    // Title/link
    const titleLink = document.createElement('a');
    // Use sanitizeUrl for URL attributes and add additional security measures
    const sanitizedUrl = item.url ? sanitizeUrl(item.url) : '#';
    titleLink.href = sanitizedUrl;
    // Add rel="noopener noreferrer" for external links
    if (sanitizedUrl !== '#' && !sanitizedUrl.startsWith(window.location.origin)) {
        titleLink.rel = "noopener noreferrer";
        // Optional: Open external links in new tab
        titleLink.target = "_blank";
    }
    const itemName = getItemName(item);
    titleLink.textContent = htmlUnescape(`${itemName}`);
    titleLink.style.fontWeight = '600';
    titleLink.style.textDecoration = 'none';
    titleLink.style.color = '#2962ff';
    titleRow.appendChild(titleLink);

    // info icon
    const infoIcon = document.createElement('span');
    const imgElement = document.createElement('img');
    imgElement.src = sanitizeUrl('static/images/info.png');
    imgElement.width = 16;
    imgElement.height = 16;
    imgElement.alt = 'Info';
    infoIcon.appendChild(imgElement);
    infoIcon.style.fontSize = '0.5em';
    infoIcon.style.position = 'relative';

    // Create popup element
    infoIcon.title = `${item.explanation || ''} (score=${item.score || 0}) (Ranking time=${item.time || 0})`;
    titleRow.appendChild(infoIcon);

    contentDiv.appendChild(titleRow);

    // Description
    const description = document.createElement('div');
    description.textContent = item.description || '';
    description.style.fontSize = '0.9em';
    contentDiv.appendChild(description);

    if (chatInterface.display_mode == "nlwebsearch") {
        // visible url
        const visibleUrl = document.createElement("div");
        const visibleUrlLink = document.createElement("a");
        // Use sanitizeUrl for URL attributes and add security attributes
        const sanitizedSiteUrl = item.siteUrl ? sanitizeUrl(item.siteUrl) : '#';
        visibleUrlLink.href = sanitizedSiteUrl;
        // Add rel="noopener noreferrer" for external links
        if (sanitizedSiteUrl !== '#' && !sanitizedSiteUrl.startsWith(window.location.origin)) {
            visibleUrlLink.rel = "noopener noreferrer";
            visibleUrlLink.target = "_blank";
        }
        // Sanitize the site text content to prevent XSS
        visibleUrlLink.textContent = htmlUnescape(item.site || '');
        visibleUrlLink.style.fontSize = "0.9em";
        visibleUrlLink.style.textDecoration = "none";
        visibleUrlLink.style.color = "#2962ff";
        visibleUrlLink.style.fontWeight = "500";
        visibleUrlLink.style.padding = "8px 0";
        visibleUrlLink.style.display = "inline-block";
        contentDiv.appendChild(visibleUrlLink);
    }
    typeSpecificContent(item, contentDiv);

    // Feedback icons
    const feedbackDiv = document.createElement('div');
    feedbackDiv.style.display = 'flex';
    feedbackDiv.style.gap = '0.5em';
    feedbackDiv.style.marginTop = '0.5em';

    const thumbsUp = document.createElement('span');
    thumbsUp.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="#D3D3D3">
    <path d="M2 20h2c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1H2v11zm19.83-7.12c.11-.25.17-.52.17-.8V11c0-1.1-.9-2-2-2h-5.5l.92-4.65c.05-.22.02-.46-.08-.66-.23-.45-.52-.86-.88-1.22L14 2 7.59 8.41C7.21 8.79 7 9.3 7 9.83v7.84C7 18.95 8.05 20 9.34 20h8.11c.7 0 1.36-.37 1.72-.97l2.66-6.15z"/>
  </svg>`;
    thumbsUp.style.fontSize = '0.8em';
    thumbsUp.style.cursor = 'pointer';

    const thumbsDown = document.createElement('span');
    thumbsDown.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="#D3D3D3">
    <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"/>
  </svg>`;
    thumbsDown.style.fontSize = '0.8em';
    thumbsDown.style.cursor = 'pointer';

    feedbackDiv.appendChild(thumbsUp);
    feedbackDiv.appendChild(thumbsDown);
    contentDiv.appendChild(feedbackDiv);

    container.appendChild(contentDiv);

    // Check for image in schema object
    if (item.schema_object) {
        const imgURL = chatInterface.extractImage(item.schema_object);
        if (imgURL) {
            const imageDiv = document.createElement('div');
            const img = document.createElement('img');
            // Sanitize URL and verify it's an acceptable image URL
            const sanitizedUrl = sanitizeUrl(imgURL);
            if (sanitizedUrl !== '#') {
                img.src = sanitizedUrl;
                img.width = 80;
                img.height = 80;
                img.style.objectFit = 'cover';
                img.alt = 'Item image';
                // Add onerror handler to handle broken images
                img.onerror = function () {
                    this.style.display = 'none';
                };
                imageDiv.appendChild(img);
                container.appendChild(imageDiv);
            }
        }
    }

    return container;
}

/**
 * Creates an HTML element for insufficient results
 * @param {Object} chatInterface - The chat interface instance
 * @returns {HTMLElement} The message element
 */
export function createInsufficientResultsHtml(chatInterface) {
    const container = document.createElement('div');
    container.className = 'intermediate-container';
    container.appendChild(document.createElement('br'));
    if (chatInterface.currentItems.length > 0) {
        container.textContent = "I couldn't find any more results that are relevant to your query.";
    } else {
        container.textContent = "I couldn't find any results that are relevant to your query.";
    }
    container.appendChild(document.createElement('br'));
    return container;
}

/**
 * Handles the first message from the server
 * @param {Object} event - The event object
 * @param {Object} chatInterface - The chat interface instance
 */
export function handleFirstMessage(event, chatInterface) {
    chatInterface.dotsStillThere = false;
    chatInterface.messagesArea.removeChild(chatInterface.messagesArea.lastChild);
}

/**
 * Possibly annotates the user query with decontextualized query
 * @param {Object} chatInterface - The chat interface instance
 * @param {string} decontextualizedQuery - The decontextualized query
 */
export function possiblyAnnotateUserQuery(chatInterface, decontextualizedQuery) {
    const msgDiv = chatInterface.lastUserMessageDiv;
    if (msgDiv) {
        // Uncomment if needed
        // msgDiv.innerHTML = chatInterface.currentMessage + "<br><span class=\"decontextualized-query\">" + decontextualizedQuery + "</span>";
    }
}

/**
 * Resorts the results based on score
 * @param {Object} chatInterface - The chat interface instance
 */
export function resortResults(chatInterface) {
    if (chatInterface.currentItems.length > 0) {
        chatInterface.currentItems.sort((a, b) => b[0].score - a[0].score);
        // Clear existing children
        while (chatInterface.bubble.firstChild) {
            chatInterface.bubble.removeChild(chatInterface.bubble.firstChild);
        }
        if (chatInterface.thisRoundRemembered) {
            chatInterface.bubble.appendChild(chatInterface.thisRoundRemembered);
        }
        if (chatInterface.sourcesMessage) {
            chatInterface.bubble.appendChild(chatInterface.sourcesMessage);
        }
        if (chatInterface.thisRoundSummary) {
            chatInterface.bubble.appendChild(chatInterface.thisRoundSummary);
        }
        // Add sorted domItems back to bubble
        for (const [item, domItem] of chatInterface.currentItems) {
            chatInterface.bubble.appendChild(domItem);
        }
    }
}

/**
 * Returns the list of available sites
 * @returns {string[]} The list of sites
 */
export function getSites() {
    return ['imdb', 'nytimes', 'alltrails', 'allbirds', 'seriouseats', 'npr podcasts', 'backcountry', 'bc_product', 'neurips', 'zillow',
        'tripadvisor', 'woksoflife', 'cheftariq', 'hebbarskitchen', 'latam_recipes', 'spruce', 'med podcast', 'all'];
}

/**
 * Returns the list of available generate modes
 * @returns {string[]} The list of generate modes
 */
export function getGenerateModes() {
    return ['list', 'summarize', 'generate'];
}