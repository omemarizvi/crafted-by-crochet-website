# EmailJS Setup Guide for Order Notifications

## Overview
EmailJS is a free service that allows you to send emails directly from client-side JavaScript without needing a backend server. Perfect for your crochet website's order notifications!

## Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Set Up Email Service
1. **Add Email Service:**
   - Go to "Email Services" in your EmailJS dashboard
   - Click "Add New Service"
   - Choose your email provider (Gmail, Outlook, etc.)
   - Follow the setup instructions for your email provider
   - Note down your **Service ID**

## Step 3: Create Email Template
1. **Create Template:**
   - Go to "Email Templates" in your EmailJS dashboard
   - Click "Create New Template"
   - Use this template for order notifications:

```
Subject: New Order Received - Order #{{order_id}}

Dear Admin,

You have received a new order for your crochet items:

Order Details:
- Order ID: {{order_id}}
- Date: {{order_date}}
- Customer: {{customer_name}}
- Email: {{customer_email}}
- Phone: {{customer_phone}}
- Shipping Address: {{shipping_address}}

Items Ordered:
{{order_items}}

Total Amount: Rs {{total_amount}}
Payment Method: {{payment_method}}

Payment Screenshot: {{payment_screenshot}}

Please process this order and contact the customer if needed.

Best regards,
Your Crochet Website
```

2. **Save the template** and note down your **Template ID**

## Step 4: Get Public Key
1. Go to "Account" → "General"
2. Copy your **Public Key**

## Step 5: Update Your Website
1. **Add EmailJS Script to HTML:**
   Add this to both `index.html` and `admin.html` before the closing `</body>` tag:

```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
<script>
    emailjs.init('YOUR_PUBLIC_KEY'); // Replace with your public key
</script>
```

2. **Update Order Service:**
   In `js/order-service.js`, replace these placeholders:
   - `YOUR_SERVICE_ID` → Your EmailJS Service ID
   - `YOUR_TEMPLATE_ID` → Your EmailJS Template ID  
   - `YOUR_PUBLIC_KEY` → Your EmailJS Public Key

## Step 6: Test the Setup
1. Place a test order on your website
2. Check your email for the notification
3. Verify the payment screenshot is included

## Free Plan Limits
- **200 emails per month** (perfect for a small business)
- **2 email templates**
- **1 email service**

## Benefits
✅ **Free** - No monthly costs  
✅ **Easy setup** - No backend server needed  
✅ **Reliable** - Professional email delivery  
✅ **Secure** - Your email credentials stay safe  
✅ **Automatic** - Emails sent when orders are placed  

## Alternative: Firebase Functions (Advanced)
If you need more emails or want server-side processing, you can use Firebase Functions with Nodemailer, but EmailJS is perfect for your current needs.

## Troubleshooting
- **Emails not sending:** Check your Service ID, Template ID, and Public Key
- **Template variables not working:** Make sure variable names match exactly
- **Images not showing:** Payment screenshots will be URLs, not embedded images
- **Spam folder:** Check your spam folder for test emails

## Next Steps
1. Set up EmailJS account
2. Configure email service and template
3. Update your website with the credentials
4. Test with a sample order
5. Go live with automatic order notifications!
