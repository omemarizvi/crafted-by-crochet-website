# Current EmailJS Setup - Order Details

## Overview
EmailJS is already configured and working to send order details when "Place Order" is clicked.

## Current Configuration

### EmailJS Service Details
- **Service ID**: `service_59mtpje`
- **Template ID**: `template_g6rxkwq`
- **Public Key**: `J-A4XDkOM-wayz2AS`
- **Recipient**: `craftedbycrochet@gmail.com`

### What Happens When "Place Order" is Clicked

1. **Form Validation** → Checks all required fields are filled
2. **Order Data Creation** → Collects customer details and cart items
3. **Email Content Generation** → Creates formatted email with:
   - Customer details (name, email, phone, address)
   - Order details (items, quantities, prices)
   - Total amount
   - Order ID for tracking
   - Payment instructions
4. **EmailJS Send** → Sends email using configured service
5. **Success/Error Handling** → Shows appropriate messages

### Email Template Variables Used

The following variables are sent to your EmailJS template:
- `{{customer_name}}` - Customer's full name
- `{{customer_email}}` - Customer's email address
- `{{customer_phone}}` - Customer's phone number
- `{{customer_address}}` - Customer's shipping address
- `{{order_details}}` - Formatted list of items and quantities
- `{{total_amount}}` - Total order amount
- `{{order_time}}` - Order timestamp
- `{{order_id}}` - Unique order identifier
- `{{message}}` - Complete email content

### Email Content Sent

```
New Order Received! 🛍️

CUSTOMER DETAILS:
Name: [Customer Name]
Email: [Customer Email]
Phone: [Customer Phone]
Address: [Customer Address]

ORDER DETAILS:
[Items with quantities and prices]

TOTAL AMOUNT: Rs [Total]

ORDER TIME: [Timestamp]

Order ID: [Unique ID]

PAYMENT INSTRUCTIONS FOR CUSTOMER:
✅ Order confirmed! Please follow these steps to complete your payment:

1. BANK TRANSFER DETAILS:
   - Account Name: Crafted by Crochet
   - Account Number: [Your Bank Account Number]
   - Bank: [Your Bank Name]
   - Amount: Rs [Amount]
   - Reference: Order-[Order ID]

2. PAYMENT CONFIRMATION:
   📧 After making the transfer, reply to this email with:
   - Your payment screenshot
   - Bank transfer reference number
   - Any additional notes

3. ORDER DISPATCH:
   ⏰ Your order will be dispatched within 2-3 business days after payment confirmation.

📞 Need help? Contact us at: craftedbycrochet@gmail.com
```

## Current EmailJS Template Setup

Your EmailJS template should be set up as:

**Template Type**: Plain Text

**Template Content**:
```
Subject: New Order - {{customer_name}} - {{order_time}}

{{message}}
```

## Testing the Setup

1. **Place a test order** on your website
2. **Fill in all required fields**
3. **Click "Place Order"**
4. **Check your email** at `craftedbycrochet@gmail.com`
5. **Verify email contains** all order details and payment instructions

## Troubleshooting

If emails are not being received:

1. **Check EmailJS Dashboard** → Verify service and template IDs
2. **Check browser console** → Look for any JavaScript errors
3. **Verify template setup** → Ensure template uses `{{message}}` variable
4. **Check spam folder** → Emails might be filtered
5. **Test with simple template** → Use just `{{message}}` in template

## Next Steps

1. **Update bank details** → Replace placeholders in email content
2. **Test order process** → Verify emails are received
3. **Monitor email delivery** → Check for any issues

The EmailJS integration is fully functional and ready to use!
