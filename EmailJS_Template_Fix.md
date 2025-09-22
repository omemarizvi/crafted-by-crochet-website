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

**Template Content (Plain Text):**
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

PAYMENT: Transfer screenshot uploaded

PAYMENT SCREENSHOT:
The customer has uploaded a payment screenshot. Please contact them directly to verify payment.

---
Please contact the customer to confirm the order and arrange delivery.

Best regards,
DIY Crafts Website
```

**Template Content (HTML - For Image Display):**
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background-color: #8B5A8C; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .section { margin-bottom: 20px; }
        .screenshot { max-width: 100%; height: auto; border: 2px solid #ddd; border-radius: 8px; margin: 10px 0; }
        .order-id { background-color: #f0f0f0; padding: 10px; border-radius: 5px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🛍️ New Order Received!</h1>
    </div>
    
    <div class="content">
        <div class="section">
            <h2>CUSTOMER DETAILS:</h2>
            <p><strong>Name:</strong> {{customer_name}}</p>
            <p><strong>Email:</strong> {{customer_email}}</p>
            <p><strong>Phone:</strong> {{customer_phone}}</p>
            <p><strong>Address:</strong> {{customer_address}}</p>
        </div>
        
        <div class="section">
            <h2>ORDER DETAILS:</h2>
            <p>{{order_details}}</p>
        </div>
        
        <div class="section">
            <h2>TOTAL AMOUNT:</h2>
            <p><strong>Rs {{total_amount}}</strong></p>
        </div>
        
        <div class="section">
            <h2>ORDER TIME:</h2>
            <p>{{order_time}}</p>
        </div>
        
        {{#if payment_screenshot}}
        <div class="section">
            <h2>PAYMENT SCREENSHOT:</h2>
            <p>✅ Payment screenshot attached below:</p>
            <div class="order-id">Order ID: {{order_id}}</div>
            <img src="{{payment_screenshot}}" alt="Payment Screenshot" class="screenshot">
        </div>
        {{/if}}
        
        <hr>
        <p>Please contact the customer to confirm the order and arrange delivery.</p>
        <p><strong>Best regards,<br>DIY Crafts Website</strong></p>
    </div>
</body>
</html>
```

**Alternative Simple HTML Template:**
```html
{{html_content}}
```

**Note:** The code now sends both `{{message}}` (plain text) and `{{html_content}}` (HTML with embedded image). You can use either template approach.

### 4. Template Variables to Include:
Make sure these variables are defined in your template:
- `{{customer_name}}`
- `{{customer_email}}`
- `{{customer_phone}}`
- `{{customer_address}}`
- `{{order_details}}`
- `{{total_amount}}`
- `{{order_time}}`
- `{{order_id}}` (Unique order identifier)
- `{{payment_screenshot}}` (Base64 encoded image data URI)
- `{{html_content}}` (Complete HTML email content with embedded image)
- `{{message}}` (Plain text email content)

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
