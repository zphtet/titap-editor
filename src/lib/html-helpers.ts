export function decodeHtml(html: string): string {
    const tempTextArea = document.createElement('textarea');
    tempTextArea.innerHTML = html;
    return tempTextArea.value;
}

export function encodeHtml(str: string): string {
    const tempTextArea = document.createElement('textarea');
    tempTextArea.textContent = str;
    return tempTextArea.innerHTML;
}

export function replaceMarkersWithEditableDiv(
    htmlEncodedStr: string,
    className?: string,
    startMarker: string = '<<',
    endMarker: string = '>>'
): string {
    const decoded = decodeHtml(htmlEncodedStr);

    // Escape special characters in the custom markers for use in a RegExp
    const escapedStartMarker = startMarker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const escapedEndMarker = endMarker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Construct the regular expression dynamically
    const regex = new RegExp(`${escapedStartMarker}(.+?)${escapedEndMarker}`, 'g');

    let divCounter = 0; // To generate unique IDs for each editable div

    // Define common styles once to avoid repetition
    const defaultStyle = "display:inline-block; min-width:60px; border-bottom:1px dotted #888; background:#f0f0f0; padding:2px 4px; border-radius:3px; font-family: 'Inter', sans-serif;";

    const processedHtml = decoded.replace(regex, (match, p1) => {
        const safeContent = encodeHtml(p1); // Ensure content inside the div is HTML-safe
        // Generate a unique ID for each editable div. This is crucial for later selection.
        const uniqueId = `editable-marker-${Date.now()}-${divCounter++}`; 

        if (className) {
            return `<div contenteditable="true" class="${className}" data-marker="${safeContent}" data-editable-id="${uniqueId}">${safeContent}</div>`;
        } else {
            return `<div contenteditable="true" style="${defaultStyle}" data-marker="${safeContent}" data-editable-id="${uniqueId}">${safeContent}</div>`;
        }
    });

    return processedHtml;
} 