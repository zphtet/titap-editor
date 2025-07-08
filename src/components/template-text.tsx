import React, { useEffect, useRef, useCallback, useState } from 'react';
import parse from 'html-react-parser';
import { replaceMarkersWithEditableDiv, decodeHtml } from '../lib/html-helpers';
import type { UpdateCallbackData, TemplateTextProps, EditableHTMLElement } from '../lib/types';

const TemplateText: React.FC<TemplateTextProps> = ({
    children,
    className,
    startMarker = '<<',
    endMarker = '>>',
    onUpdateCallback
}) => {
    const [processedHtml, setProcessedHtml] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const memoizedOnUpdateCallback = useCallback((updateData: UpdateCallbackData) => {
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
            htmlStringFromChildren,
            className,
            startMarker,
            endMarker
        );
        setProcessedHtml(html);
    }, [children, className, startMarker, endMarker]);

    // Effect to attach and clean up event listeners to the editable divs.
    useEffect(() => {
        const containerElement = containerRef.current;
        if (!containerElement) {
            console.warn("EditableHtmlContent: Container ref not attached. Cannot set up listeners.");
            return;
        }

        const editableDivs = containerElement.querySelectorAll('[data-editable-id]');
        const attachedListeners: Array<{ div: EditableHTMLElement; handler: (e: Event) => void }> = [];

        editableDivs.forEach((div) => {
            const divElement = div as EditableHTMLElement;
            if (divElement._editableListenerAttached_) {
                return;
            }

            const originalMarkerValueEncoded = divElement.getAttribute('data-marker') || '';
            const originalMarkerValueDecoded = decodeHtml(originalMarkerValueEncoded);

            const handleInput = () => {
                memoizedOnUpdateCallback({
                    element: divElement,
                    marker: originalMarkerValueDecoded,
                    updatedContent: divElement.textContent || ''
                });
            };

            divElement.addEventListener('input', handleInput);
            attachedListeners.push({ div: divElement, handler: handleInput });
            divElement._editableListenerAttached_ = true;
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
        >
            {parse(processedHtml)}
        </div>
    );
};

export default TemplateText; 