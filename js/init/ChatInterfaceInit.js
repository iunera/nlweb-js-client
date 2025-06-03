/**
 * Initialization script for the ChatInterface
 */

import ChatInterface from '../core/ChatInterface.js';

// Make ChatInterface available globally
window.ChatInterface = ChatInterface;

// Single global chat interface instance
let chatInterface = null;

/**
 * Finds or creates the chat interface
 * @param {string} site - The site to search
 * @param {string} display_mode - The display mode (dropdown or full)
 * @param {string} generate_mode - The generate mode (list, summarize, generate)
 * @param {string} apiEndpoint - The API endpoint for the chat
 * @returns {ChatInterface} The chat interface instance
 */
function findChatInterface(site = '', display_mode = 'nlwebsearch', generate_mode = 'generate', apiEndpoint = null) {
    // Use the configured API endpoint if not provided
    if (!apiEndpoint) {
        apiEndpoint = window.chatApiEndpoint || 'http://localhost:8000/ask';
    }

    if (chatInterface) {
        return chatInterface;
    }
    chatInterface = new ChatInterface(site, display_mode, generate_mode, apiEndpoint);
    return chatInterface;
}

// Make findChatInterface available globally
window.findChatInterface = findChatInterface;

/**
 * Handles a search query
 */
function handleSearch() {
    const searchInput = document.getElementById('ai-search-input');
    const chatContainer = document.getElementById('chat-container');

    const query = searchInput.value.trim();
    chatContainer.style.display = 'block';

    // Find or create the chat interface
    const chat = findChatInterface();

    // Clear the search input
    searchInput.value = '';

    // Send the query to the chat interface
    chat.sendMessage(query);
}

// Initialize the chat interface when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('ai-search-input');
    const searchButton = document.getElementById('ai-search-button');
    const closeIcon = document.getElementById('close-icon');

    // Add event listeners
    if (searchButton) {
        searchButton.addEventListener('click', handleSearch);
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }

    if (closeIcon) {
        closeIcon.addEventListener('click', () => {
            const chatContainer = document.getElementById('chat-container');
            if (chatContainer) {
                chatContainer.style.display = 'none';
            }
        });
    }
});

export {findChatInterface};
