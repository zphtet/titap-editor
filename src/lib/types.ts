export interface UpdateCallbackData {
    element: HTMLElement;
    marker: string;
    updatedContent: string;
}

export interface TemplateTextProps {
    children: React.ReactNode;
    className?: string;
    startMarker?: string;
    endMarker?: string;
    onUpdateCallback?: (data: UpdateCallbackData) => void;
}

export interface EditableHTMLElement extends HTMLElement {
    _editableListenerAttached_?: boolean;
} 