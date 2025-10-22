// Simple email service using Formspree (free and reliable)

interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: Array<{
    name: string;
    size: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  paymentMethod: string;
  notes?: string;
}

interface MessageEmailData {
  customerEmail: string;
  customerName: string;
  subject: string;
  message: string;
}

export const sendOrderEmails = async (orderData: OrderEmailData) => {
  try {
    const itemsList = orderData.items.map(item => 
      `${item.name} (Size: ${item.size}) - Qty: ${item.quantity} x ₹${item.price}`
    ).join('\n');

    // Send to admin using Formspree
    const adminFormData = new FormData();
    adminFormData.append('_replyto', 'jayanivetha84@gmail.com');
    adminFormData.append('_subject', `New Order - #${orderData.orderNumber}`);
    adminFormData.append('order_number', orderData.orderNumber);
    adminFormData.append('customer_name', orderData.customerName);
    adminFormData.append('customer_email', orderData.customerEmail);
    adminFormData.append('customer_phone', orderData.customerPhone);
    adminFormData.append('shipping_address', orderData.shippingAddress);
    adminFormData.append('items', itemsList);
    adminFormData.append('total_amount', orderData.totalAmount.toString());
    adminFormData.append('payment_method', orderData.paymentMethod);
    adminFormData.append('notes', orderData.notes || 'N/A');

    await fetch('https://formspree.io/f/xpwzgqpb', {
      method: 'POST',
      body: adminFormData,
      headers: {
        'Accept': 'application/json'
      }
    });

    console.log('Order notification sent to admin');
    return true;
  } catch (error) {
    console.error('Error sending order emails:', error);
    return false;
  }
};

// Send order status update email
export const sendOrderStatusEmail = async (orderData: { orderNumber: string; customerName: string; customerEmail: string; orderStatus: string; trackingNumber?: string }) => {
  try {
    const statusFormData = new FormData();
    statusFormData.append('_replyto', 'jayanivetha84@gmail.com');
    statusFormData.append('_subject', `Order Update - #${orderData.orderNumber}`);
    statusFormData.append('customer_name', orderData.customerName);
    statusFormData.append('customer_email', orderData.customerEmail);
    statusFormData.append('order_number', orderData.orderNumber);
    statusFormData.append('order_status', orderData.orderStatus);
    if (orderData.trackingNumber) {
      statusFormData.append('tracking_number', orderData.trackingNumber);
    }

    await fetch('https://formspree.io/f/xpwzgqpb', {
      method: 'POST',
      body: statusFormData,
      headers: {
        'Accept': 'application/json'
      }
    });

    return true;
  } catch (error) {
    console.error('Error sending status email:', error);
    return false;
  }
};