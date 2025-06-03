/**
 * Utility functions for JSON handling and rendering
 */

/**
 * Converts JSON-LD to formatted HTML for display
 * @param {Object|string} jsonLd - The JSON-LD object or string to format
 * @returns {string} HTML representation of the JSON-LD
 */
export function jsonLdToHtml(jsonLd) {
    // Helper function to escape HTML special characters
    const escapeHtml = (str) => {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    };

    // Helper function to format a single value
    const formatValue = (value, indent) => {
        const spaces = '  '.repeat(indent);

        if (value === null) {
            return `<span class="null">null</span>`;
        }

        switch (typeof value) {
            case 'string':
                // Special handling for URLs and IRIs in JSON-LD
                if (value.startsWith('http://') || value.startsWith('https://')) {
                    return `<span class="string url">"${escapeHtml(value)}"</span>`;
                }
                return `<span class="string">"${escapeHtml(value)}"</span>`;
            case 'number':
                return `<span class="number">${value}</span>`;
            case 'boolean':
                return `<span class="boolean">${value}</span>`;
            case 'object':
                if (Array.isArray(value)) {
                    if (value.length === 0) return '[]';
                    const items = value.map(item =>
                        `${spaces}  ${formatValue(item, indent + 1)}`
                    ).join(',\n');
                    return `[\n${items}\n${spaces}]`;
                }
                return formatObject(value, indent);
        }
    };

    // Helper function to format an object
    const formatObject = (obj, indent = 0) => {
        const spaces = '  '.repeat(indent);

        if (Object.keys(obj).length === 0) return '{}';

        const entries = Object.entries(obj).map(([key, value]) => {
            // Special handling for JSON-LD keywords (starting with @)
            const keySpan = key.startsWith('@')
                ? `<span class="keyword">"${escapeHtml(key)}"</span>`
                : `<span class="key">"${escapeHtml(key)}"</span>`;

            return `${spaces}  ${keySpan}: ${formatValue(value, indent + 1)}`;
        });

        return `{\n${entries.join(',\n')}\n${spaces}}`;
    };

    // Main formatting logic
    try {
        const parsed = (typeof jsonLd === 'string') ? JSON.parse(jsonLd) : jsonLd;
        const formatted = formatObject(parsed);

        // Return complete HTML with styling
        return `<pre class="json-ld"><code>${formatted}</code></pre>
<style>
.json-ld {
    background-color: #f5f5f5;
    padding: 1em;
    border-radius: 4px;
    font-family: monospace;
    line-height: 1.5;
}
.json-ld .keyword { color: #e91e63; }
.json-ld .key { color: #2196f3; }
.json-ld .string { color: #4caf50; }
.json-ld .string.url { color: #9c27b0; }
.json-ld .number { color: #ff5722; }
.json-ld .boolean { color: #ff9800; }
.json-ld .null { color: #795548; }
</style>`;
    } catch (error) {
        return `<pre class="json-ld error">Error: ${error.message}</pre>`;
    }
}

/**
 * Sanitizes a URL to prevent XSS attacks
 * @param {string} url - The URL to sanitize
 * @returns {string} A sanitized URL or '#' if the URL is invalid
 */
export function sanitizeUrl(url) {
    // Return a safe default if input is null, undefined, or not a string
    if (!url || typeof url !== 'string') return '#';

    // Remove leading and trailing whitespace
    const trimmedUrl = url.trim();

    try {
        // Check for dangerous protocols using a more comprehensive approach
        const dangerousProtocols = /^(javascript|data|vbscript|file):/i;
        if (dangerousProtocols.test(trimmedUrl)) {
            return '#';
        }

        // Try to parse the URL - this will throw for malformed URLs
        const parsedUrl = new URL(trimmedUrl, window.location.origin);

        // Only allow specific protocols
        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
            return '#';
        }

        // Return the sanitized URL
        return parsedUrl.toString();
    } catch (e) {
        // If URL parsing fails or any other error occurs, return a safe default
        console.warn("Invalid URL detected and sanitized:", url);
        return '#';
    }
}

/**
 * Safely unescapes HTML entities in a string
 * @param {string} str - The string to unescape
 * @returns {string} The unescaped string
 */
export function htmlUnescape(str) {
    // Return empty string for null/undefined values
    if (!str) return '';

    // Check if input is a string
    if (typeof str !== 'string') {
        return String(str);
    }

    // Use the browser's built-in text decoder functionality
    // This safely decodes HTML entities without execution risks
    const textarea = document.createElement('textarea');
    textarea.textContent = str;
    return textarea.value;
}

/**
 * Generates a quick hash for a string
 * @param {string} string - The string to hash
 * @returns {number} A numeric hash
 */
export function quickHash(string) {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
        const char = string.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32-bit integer
    }
    return hash;
}