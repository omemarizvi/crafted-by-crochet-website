# Quick EmailJS Setup for Payment Screenshots

## The Easiest Solution

Since the code now sends both plain text and HTML content, here's the **simplest** way to set up your EmailJS template:

### Step 1: Go to EmailJS Dashboard
Visit: https://dashboard.emailjs.com/

### Step 2: Edit Your Template
1. Click "Email Templates"
2. Find your template (`template_g6rxkwq`)
3. Click "Edit"

### Step 3: Use This Simple Template
**Template Type:** HTML

**Template Content:**
```html
{{html_content}}
```

**That's it!** 

### Step 4: Save and Test
1. Click "Save"
2. Test with a sample order
3. Check your email - the payment screenshot should appear as an actual image!

## How It Works

The code now creates a complete HTML email with:
- ✅ **Professional styling** (purple header, organized sections)
- ✅ **All customer details** (name, email, phone, address)
- ✅ **Complete order summary** (items, quantities, prices)
- ✅ **Payment screenshot embedded** as an actual image
- ✅ **Order ID** for reference
- ✅ **Responsive design** (works on mobile)

## Template Variables Available

If you want to customize further, these variables are available:
- `{{customer_name}}`
- `{{customer_email}}`
- `{{customer_phone}}`
- `{{customer_address}}`
- `{{order_details}}`
- `{{total_amount}}`
- `{{order_time}}`
- `{{order_id}}`
- `{{payment_screenshot}}`
- `{{html_content}}` ← **Use this for complete email**
- `{{message}}` ← Plain text version

## Testing

1. **Place a test order** on your website
2. **Upload a payment screenshot**
3. **Check your email** - you should see:
   - Professional HTML email layout
   - Customer details clearly displayed
   - Order summary with items and prices
   - **Payment screenshot as an actual image** (not Base64 text)
   - Order ID for reference

## Troubleshooting

If images don't show:
1. Check that template type is set to "HTML" (not "Plain Text")
2. Make sure you're using `{{html_content}}` in your template
3. Test with a small image first
4. Check your email client (Gmail, Outlook, etc.) supports HTML emails

## Benefits

- ✅ **No more reaching out to customers** for payment screenshots
- ✅ **Professional email appearance** with proper formatting
- ✅ **Payment proof included** directly in the email
- ✅ **Order tracking** with unique Order IDs
- ✅ **Mobile-friendly** responsive design
- ✅ **Complete order information** in one place
