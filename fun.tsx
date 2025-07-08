import React, { useEffect, useRef, useCallback, useState } from 'react';
import ReactHtmlParser from 'react-html-parser'; // Import ReactHtmlParser

// --- Helper Function: replaceMarkersWithEditableDiv (from previous interactions) ---
// This function transforms the input HTML string to include contenteditable divs
// with unique IDs and data-marker attributes.
export function replaceMarkersWithEditableDiv(htmlEncodedStr, className, startMarker = '<<', endMarker = '>>') {
    // Re-use a single textarea element for encoding/decoding to avoid repeated DOM creation
    const tempTextArea = document.createElement('textarea');

    function decodeHtml(html) {
        tempTextArea.innerHTML = html;
        return tempTextArea.value;
    }

    function encodeHtml(str) {
        tempTextArea.textContent = str;
        return tempTextArea.innerHTML;
    }

    const decoded = decodeHtml(htmlEncodedStr);

    // Escape special characters in the custom markers for use in a RegExp
    const escapedStartMarker = startMarker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const escapedEndMarker = endMarker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Construct the regular expression dynamically
    const regex = new RegExp(${escapedStartMarker}\\$(.+?)${escapedEndMarker}, 'g');

    let divCounter = 0; // To generate unique IDs for each editable div

    // Define common styles once to avoid repetition
    const defaultStyle = "display:inline-block; min-width:60px; border-bottom:1px dotted #888; background:#f0f0f0; padding:2px 4px; border-radius:3px; font-family: 'Inter', sans-serif;";

    const processedHtml = decoded.replace(regex, (match, p1) => {
        const safeContent = encodeHtml(p1); // Ensure content inside the div is HTML-safe
        // Generate a unique ID for each editable div. This is crucial for later selection.
        const uniqueId = editable-marker-${Date.now()}-${divCounter++}; 

        if (className) {
            return <div contenteditable="true" class="${className}" data-marker="${safeContent}" data-editable-id="${uniqueId}">${safeContent}</div>;
        } else {
            return <div contenteditable="true" style="${defaultStyle}" data-marker="${safeContent}" data-editable-id="${uniqueId}">${safeContent}</div>;
        }
    });

    return processedHtml; // Returns only the HTML string
}
// --- End Helper Function ---

// Helper function to decode HTML from data-marker attributes for the callback
function decodeHtmlForCallback(html) {
    const tempTextArea = document.createElement('textarea');
    tempTextArea.innerHTML = html;
    return tempTextArea.value;
}

/**
 * A React component that takes an HTML string, replaces marked sections with editable divs,
 * and attaches a callback function to their input events.
 *
 * @param {object} props - The component props.
 * @param {string} props.htmlEncodedStr - The initial HTML string containing markers.
 * @param {string} [props.className] - Optional CSS class to apply to editable divs.
 * @param {string} [props.startMarker='<<'] - The custom start marker for editable sections.
 * @param {string} [props.endMarker='>>'] - The custom end marker for editable sections.
 * @param {function(object): void} [props.onUpdateCallback] - Callback function triggered on content update.
 * Receives an object: { element: HTMLElement, marker: string, updatedContent: string }.
 */
const TemplateText = ({
    children,
    className,
    startMarker = '<<',
    endMarker = '>>',
    onUpdateCallback
}) => {
    const [processedHtml, setProcessedHtml] = useState('');
    const containerRef = useRef(null);

    const memoizedOnUpdateCallback = useCallback((updateData) => {
        if (typeof onUpdateCallback === 'function') {
            onUpdateCallback(updateData);
        }
    }, [onUpdateCallback]);

    // Effect to generate the processed HTML string from children.
    // This runs when children or marker props change.
    useEffect(() => {
        // Ensure children is treated as a string for parsing
        const htmlStringFromChildren = typeof children === 'string' ? children : String(children);

        const html = replaceMarkersWithEditableDiv(
            htmlStringFromChildren, // Pass children as the HTML string
            className,
            startMarker,
            endMarker
        );
        setProcessedHtml(html);
    }, [children, className, startMarker, endMarker]); // Depend on children prop

    // Effect to attach and clean up event listeners to the editable divs.
    // (This remains unchanged from previous versions)
    useEffect(() => {
        const containerElement = containerRef.current;
        if (!containerElement) {
            console.warn("EditableHtmlContent: Container ref not attached. Cannot set up listeners.");
            return;
        }

        const editableDivs = containerElement.querySelectorAll('[data-editable-id]');
        const attachedListeners = [];

        editableDivs.forEach(div => {
            if (div._editableListenerAttached_) {
                return;
            }

            const originalMarkerValueEncoded = div.getAttribute('data-marker');
            const originalMarkerValueDecoded = decodeHtmlForCallback(originalMarkerValueEncoded);

            const handleInput = (event) => {
                memoizedOnUpdateCallback({
                    element: div,
                    marker: originalMarkerValueDecoded,
                    updatedContent: div.textContent
                });
            };

            div.addEventListener('input', handleInput);
            attachedListeners.push({ div, handler: handleInput });
            div._editableListenerAttached_ = true;
        });

        return () => {
            attachedListeners.forEach(({ div, handler }) => {
                div.removeEventListener('input', handler);
                delete div._editableListenerAttached_;
            });
        };
    }, [processedHtml, memoizedOnUpdateCallback]);

    return (
        <div
            ref={containerRef}
            className="font-inter"
            data-name={}
        >
            {ReactHtmlParser(processedHtml)}
        </div>
    );
};

export default TemplateText;