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
<h2>New Order Received! 🛍️</h2>

<h3>CUSTOMER DETAILS:</h3>
<p><strong>Name:</strong> {{customer_name}}</p>
<p><strong>Email:</strong> {{customer_email}}</p>
<p><strong>Phone:</strong> {{customer_phone}}</p>
<p><strong>Address:</strong> {{customer_address}}</p>

<h3>ORDER DETAILS:</h3>
<p>{{order_details}}</p>

<h3>TOTAL AMOUNT:</h3>
<p><strong>Rs {{total_amount}}</strong></p>

<h3>ORDER TIME:</h3>
<p>{{order_time}}</p>

<h3>PAYMENT:</h3>
<p>Transfer screenshot uploaded</p>

<h3>PAYMENT SCREENSHOT:</h3>
<img src="{{payment_screenshot}}" alt="Payment Screenshot" style="max-width: 500px; height: auto; border: 1px solid #ddd; border-radius: 8px;">

<hr>
<p>Please contact the customer to confirm the order and arrange delivery.</p>
<p>Best regards,<br>DIY Crafts Website</p>
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
