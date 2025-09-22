# EmailJS Setup Guide for Order Notifications

This guide will help you set up EmailJS to automatically send order notifications to `craftedbycrochet@gmail.com` when customers place orders.

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Add Email Service

1. In your EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. Note down your **Service ID** (e.g., `service_xxxxxxx`)

## Step 3: Create Email Template

1. Go to **Email Templates**
2. Click **Create New Template**
3. Use this template content:

**Template ID**: `order_notification` (or any name you prefer)

**Subject**: `New Order - {{order_date}}`

**Content**:
```
New Order Received!

Order Details:
{{order_details}}

Total: {{total_amount}}

Order Time: {{order_time}}

Please contact the customer to confirm the order and arrange delivery.

Best regards,
DIY Crafts Website
```

4. Save the template and note down the **Template ID**

## Step 4: Get Your Public Key

1. Go to **Account** → **General**
2. Find your **Public Key** (starts with `user_`)

## Step 5: Update Your Website

1. Open `js/cart.js`
2. Find these lines and replace with your actual values:

```javascript
// Replace these with your actual EmailJS credentials
emailjs.init('YOUR_EMAILJS_PUBLIC_KEY');  // Replace with your Public Key
await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams);  // Replace with your Service ID and Template ID
```

3. Save the file and push to GitHub

## Step 6: Test the System

1. Visit your live website
2. Add items to cart
3. Proceed to checkout
4. Check if you receive an email at `craftedbycrochet@gmail.com`

## Troubleshooting

- **No emails received**: Check spam folder
- **Template errors**: Verify template variables match exactly
- **Service errors**: Ensure email service is properly configured
- **Public key issues**: Double-check the public key format

## Free Plan Limits

EmailJS free plan includes:
- 200 emails per month
- Basic templates
- Standard support

This should be sufficient for a small craft business.

## Alternative: Manual Order Processing

If you prefer not to use EmailJS, the system will still work with manual order processing:
- Customers can place orders
- You'll see order details in the alert popup
- You can manually contact customers for confirmation

The website will continue to function normally even without EmailJS configured.