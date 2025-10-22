interface MessageEmailData {
  customerEmail: string;
  customerName: string;
  subject: string;
  message: string;
}

// Send message email from admin dashboard
export const sendMessageEmail = async (messageData: MessageEmailData) => {
  try {
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">📧 Message from Jersey Store</h2>
        <p>Hi ${messageData.customerName},</p>
        <div style="background-color: #f8f9fa; padding: 20px; border-left: 4px solid #007bff; margin: 20px 0; border-radius: 4px;">
          ${messageData.message.replace(/\n/g, '<br>')}
        </div>
        <p>Best regards,<br><strong>Jersey Store Team</strong></p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="font-size: 12px; color: #666; text-align: center;">This message was sent from Jersey Store Admin Dashboard</p>
      </div>
    `;

    // Using Web3Forms (free service)
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_key: '8c5f4d2e-1a3b-4c5d-8e9f-1a2b3c4d5e6f', // Free key
        from_email: 'jayanivetha84@gmail.com',
        to_email: messageData.customerEmail,
        subject: messageData.subject,
        message: emailContent,
        from_name: 'Jersey Store'
      })
    });

    if (response.ok) {
      console.log('Message email sent successfully');
      return true;
    } else {
      throw new Error('Failed to send email');
    }
  } catch (error) {
    console.error('Error sending message email:', error);
    return false;
  }
};

// Alternative using EmailJS
export const sendMessageEmailJS = async (messageData: MessageEmailData) => {
  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: 'gmail',
        template_id: 'template_message',
        user_id: 'your_public_key',
        template_params: {
          from_email: 'jayanivetha84@gmail.com',
          to_email: messageData.customerEmail,
          subject: messageData.subject,
          customer_name: messageData.customerName,
          message: messageData.message,
          from_name: 'Jersey Store'
        }
      })
    });

    return response.ok;
  } catch (error) {
    console.error('Error sending message email:', error);
    return false;
  }
};