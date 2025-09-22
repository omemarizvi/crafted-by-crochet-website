# EmailJS Template Fix - "Recipients address is empty" Error

## The Problem
You're getting this error:
```
POST https://api.emailjs.com/api/v1.0/email/send 422 (Unprocessable Content)
The recipients address is empty
```

## The Solution
The EmailJS template needs to be configured with a **hardcoded recipient email** in the template itself.

## Step-by-Step Fix:

### 1. Go to EmailJS Dashboard
Visit: https://dashboard.emailjs.com/

### 2. Navigate to Email Templates
- Click on "Email Templates" in the sidebar
- Find your template (template_g6rxkwq)

### 3. Edit the Template
In the template editor, you need to set:

**To Email:** `craftedbycrochet@gmail.com` (hardcoded)

**Template Content:**
```
Subject: New Order - {{customer_name}} - {{order_time}}

New Order Received! 🛍️

CUSTOMER DETAILS:
Name: {{customer_name}}
Email: {{customer_email}}
Phone: {{customer_phone}}
Address: {{customer_address}}

ORDER DETAILS:
{{order_details}}

TOTAL AMOUNT: {{total_amount}}

ORDER TIME: {{order_time}}

PAYMENT: Transfer screenshot attached

PAYMENT SCREENSHOT:
{{payment_screenshot}}

---
Please contact the customer to confirm the order and arrange delivery.

Best regards,
DIY Crafts Website
```

### 4. Template Variables to Include:
Make sure these variables are defined in your template:
- `{{customer_name}}`
- `{{customer_email}}`
- `{{customer_phone}}`
- `{{customer_address}}`
- `{{order_details}}`
- `{{total_amount}}`
- `{{order_time}}`
- `{{payment_screenshot}}` (Base64 encoded image)

### 5. Save the Template
Click "Save" after making changes.

### 6. Test the Template
Use the "Test" button in the EmailJS dashboard to verify it works.

## Alternative Quick Fix:
If you want to keep using the current template, you can also:

1. Go to your EmailJS service settings
2. Set a default "To Email" address
3. Make sure the service is properly configured

## Current Code Configuration:
The code is now sending:
- `to_email: 'craftedbycrochet@gmail.com'` (in template params)
- `reply_to: customer.email` (customer's email for replies)
- All the customer and order details

The template should use `{{to_email}}` or have a hardcoded recipient address.
