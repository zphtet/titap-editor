import { TemplateText } from "../lib/util";

// Add styles to your CSS file or use a CSS-in-JS solution
const styles = `
.editable-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 2rem;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.editable-field {
    line-height: 1.6;
    font-size: 16px;
    color: #333;
}

.editable-field p {
    margin-bottom: 1rem;
}

.editable-field [data-marker] {
    background-color: #f0f7ff;
    padding: 2px 6px;
    border-radius: 4px;
    color: #0066cc;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.editable-field [data-marker]:hover {
    background-color: #e1efff;
}
`;

const EditableComponent = () => {
    const htmlEncodedStr = `
    <p>Dear &lt;&lt;customer_name&gt;&gt;,</p>
    <p>Thank you for your purchase on &lt;&lt;purchase_date&gt;&gt;.</p>
    <p>Your order number is <b>&lt;&lt;order_id&gt;&gt;</b>.</p>
    <p>Total amount: $&lt;&lt;order_total&gt;&gt; USD</p>
    <p>Shipping address: &lt;&lt;shipping_address&gt;&gt;</p>
    <p>We hope to see you again soon!</p>
    <p>Best regards,<br/> &lt;&lt;company_name&gt;&gt; team</p>
    `;
    
    const handleUpdate = (data: { marker: string; updatedContent: string }) => {
        console.log('Field updated:', data.marker, 'New value:', data.updatedContent);
    };

    return (
        <>
            <style>{styles}</style>
            <div className="editable-container">
                <TemplateText 
                    className="editable-field"
                    onUpdateCallback={handleUpdate}
                >
                    {htmlEncodedStr}
                </TemplateText>
            </div>
        </>
    );
};

export default EditableComponent;