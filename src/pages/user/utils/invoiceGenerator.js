import { toast } from 'react-hot-toast';
import logger from '../../../utils/logger';
import { WHATSAPP_SUPPORT_NUMBER } from '../constants';

/**
 * Generate and download invoice for an order
 */
export const generateInvoice = (order, user, calculateTotalAmount) => {
    if (!order || !user) {
        toast.error("Cannot generate invoice: Missing order or user data.");
        return;
    }

    const toastId = toast.loading("Generating invoice...");
    
    try {
        const orderIdShort = order.id ? order.id.substring(0, 8) : 'N/A';
        const orderTotal = calculateTotalAmount(order).toFixed(2);
        const itemsHTML = order.cartItems?.map(item => `
            <tr>
                <td>${item.title || 'N/A'}</td>
                <td class="capitalize">${item.category || 'N/A'}</td>
                <td>रु ${Number(item.price).toFixed(2) || '0.00'}</td>
                <td class="text-center">${item.quantity || 0}</td>
                <td class="text-right">रु ${(Number(item.price || 0) * Number(item.quantity || 0)).toFixed(2)}</td>
            </tr>
        `).join('') || '<tr><td colspan="5" class="text-center">No items found</td></tr>';

        const invoiceHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Invoice #${orderIdShort}</title>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
            <style>
                body { font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 20px; font-size: 14px; line-height: 1.6; color: #111827; background-color: #f9fafb; }
                .container { max-width: 800px; margin: 20px auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #e5e7eb; }
                .logo-section .logo { font-size: 24px; font-weight: bold; color: #3b82f6; margin-bottom: 5px; }
                .logo-section p { font-size: 12px; color: #6b7280; margin: 0; }
                .invoice-meta { text-align: right; }
                .invoice-title { font-size: 28px; font-weight: bold; color: #111827; margin-bottom: 8px; }
                .invoice-meta p { margin: 3px 0; font-size: 13px; color: #4b5563; }
                .invoice-meta p strong { color: #1f2937; }
                .details-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px; margin-bottom: 40px; }
                .customer-info, .shipping-info { margin-bottom: 0; }
                .section-title { font-size: 16px; font-weight: 600; color: #111827; margin-bottom: 15px; padding-bottom: 5px; border-bottom: 1px solid #e5e7eb; }
                .info-block p { margin: 4px 0; font-size: 14px; color: #374151; }
                .info-block p strong { font-weight: 500; color: #111827; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 13px; }
                th { background-color: #f3f4f6; text-align: left; padding: 10px 8px; font-weight: 600; border-bottom: 2px solid #e5e7eb; }
                td { padding: 10px 8px; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
                tbody tr:last-child td { border-bottom: none; }
                .summary-box { background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 20px; }
                .summary-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
                .summary-row span:first-child { color: #4b5563; }
                .summary-row span:last-child { font-weight: 500; color: #1f2937; }
                .summary-total { font-size: 16px; font-weight: 600; padding-top: 10px; margin-top: 10px; border-top: 1px solid #e5e7eb; }
                .summary-total span:last-child { font-size: 18px; }
                .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center; }
                .whatsapp-support { margin: 20px 0; padding: 15px; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; text-align: center; }
                .whatsapp-support p { margin: 8px 0; font-size: 13px; }
                .whatsapp-link { display: inline-block; color: #16a34a; font-weight: bold; text-decoration: none; margin-top: 10px; padding: 8px 15px; border: 1px solid #16a34a; border-radius: 6px; transition: all 0.3s; }
                .whatsapp-link:hover { background-color: #16a34a; color: white; }
                .badge { display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; line-height: 1; text-transform: capitalize; }
                .status-delivered { background-color: #D1FAE5; color: #065F46; }
                .status-pending { background-color: #FEF3C7; color: #92400E; }
                .status-cancelled { background-color: #FEE2E2; color: #991B1B; }
                .status-refunded { background-color: #EDE9FE; color: #5B21B6; }
                .text-right { text-align: right; }
                .text-center { text-align: center; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="invoice-header">
                    <div class="logo-section">
                        <div class="logo">Digital Shop Nepal</div>
                        <p>Kathmandu, Nepal</p>
                        <p>+9779807677391</p>
                    </div>
                    <div class="invoice-meta">
                        <h1 class="invoice-title">INVOICE</h1>
                        <p><strong>Order #:</strong> ${orderIdShort}</p>
                        <p><strong>Date:</strong> ${new Date(order.date || Date.now()).toLocaleDateString()}</p>
                        <p><strong>Status:</strong> <span class="badge status-${order.status || 'unknown'}">${order.status || 'N/A'}</span></p>
                    </div>
                </div>

                <div class="details-grid">
                    <div class="customer-info info-block">
                        <h3 class="section-title">Customer Details</h3>
                        <p><strong>Name:</strong> ${user?.name || 'N/A'}</p>
                        <p><strong>Email:</strong> ${user?.email || 'N/A'}</p>
                    </div>

                    <div class="shipping-info info-block">
                        <h3 class="section-title">Shipping Details</h3>
                        <p><strong>Address:</strong> ${order.shippingAddress || 'Not specified'}</p>
                        <p><strong>Phone:</strong> ${order.phoneNumber || 'Not specified'}</p>
                        <p><strong>Payment:</strong> <span class="capitalize">${order.paymentMethod || 'Not specified'}</span></p>
                    </div>
                </div>

                <h3 class="section-title">Order Items</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Category</th>
                            <th>Unit Price</th>
                            <th class="text-center">Qty</th>
                            <th class="text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHTML}
                    </tbody>
                </table>

                <div style="display: flex; justify-content: flex-end;">
                   <div class="summary-box" style="width: 100%; max-width: 350px;">
                        <div class="summary-row">
                            <span>Subtotal:</span>
                            <span>रु ${orderTotal}</span>
                        </div>
                        <div class="summary-row">
                            <span>Shipping:</span>
                            <span>रु 0.00</span>
                        </div>
                        <div class="summary-row">
                            <span>Tax (0%):</span>
                            <span>रु 0.00</span>
                        </div>
                        <div class="summary-row summary-total">
                            <span>Total:</span>
                            <span>रु ${orderTotal}</span>
                        </div>
                    </div>
                 </div>

                <div class="footer">
                    <div class="whatsapp-support">
                        <p>Thank you for your purchase! We appreciate your business ❤️</p>
                        <p>If you have any questions about your order or don't receive updates within 30 minutes, our support team is happy to help:</p>
                        <a href="https://wa.me/${WHATSAPP_SUPPORT_NUMBER.replace('+', '')}" target="_blank" rel="noopener noreferrer" class="whatsapp-link">
                            WhatsApp Support: ${WHATSAPP_SUPPORT_NUMBER}
                        </a>
                    </div>
                    <p>© ${new Date().getFullYear()} Digital Shop Nepal. All rights reserved.</p>
                    <p style="margin-top: 10px;">This is a computer-generated invoice. No signature required.</p>
                </div>
            </div>
        </body>
        </html>
        `;

        const blob = new Blob([invoiceHTML], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice_${orderIdShort}.html`;
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast.success("Invoice downloaded!", { id: toastId });
    } catch (error) {
        toast.error("Failed to generate invoice", { id: toastId });
        logger.error("Invoice generation error", { error: error.message });
    }
};

