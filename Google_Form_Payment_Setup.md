# Google Form Payment Screenshot Setup

## Overview
This approach uses a Google Form for customers to upload their payment screenshots after placing an order. This is cleaner, more professional, and avoids EmailJS issues.

## How It Works

1. **Customer places order** → Receives email with payment instructions
2. **Customer makes payment** → Transfers money to your bank account
3. **Customer uploads proof** → Uses Google Form to submit payment screenshot
4. **You receive notification** → Google Form sends you the uploaded image

## Step 1: Create Google Form

### 1.1 Go to Google Forms
Visit: https://forms.google.com/

### 1.2 Create New Form
1. Click "Blank" to create a new form
2. Title: "Payment Screenshot Upload - Crafted by Crochet"

### 1.3 Add Form Fields

**Question 1: Order ID**
- Type: Short answer
- Question: "Order ID *"
- Required: Yes

**Question 2: Customer Email**
- Type: Short answer
- Question: "Your Email Address *"
- Required: Yes

**Question 3: Customer Name**
- Type: Short answer
- Question: "Your Name *"
- Required: Yes

**Question 4: Payment Screenshot**
- Type: File upload
- Question: "Upload Payment Screenshot *"
- Required: Yes
- File types: Images only
- Maximum file size: 10 MB

**Question 5: Payment Amount**
- Type: Short answer
- Question: "Amount Paid (Rs) *"
- Required: Yes

**Question 6: Bank Transfer Reference**
- Type: Short answer
- Question: "Bank Transfer Reference/Transaction ID"
- Required: No

### 1.4 Form Settings
1. Click the Settings gear icon
2. Check "Collect email addresses"
3. Check "Limit to 1 response" (optional)

### 1.5 Get Form Link
1. Click "Send" button
2. Copy the form link (looks like: https://forms.gle/XXXXXXXXXX)

## Step 2: Update Your Website

### 2.1 Update Email Template
Replace `[YOUR_GOOGLE_FORM_ID]` in the email content with your actual Google Form link.

### 2.2 Update Bank Details
Replace the placeholder bank details in the email with your actual information:
- `[Your Bank Account Number]`
- `[Your Bank Name]`

## Step 3: Test the Process

### 3.1 Test Order
1. Place a test order on your website
2. Check the email received
3. Verify the Google Form link works

### 3.2 Test Payment Upload
1. Use the Google Form link from the email
2. Upload a test image
3. Check if you receive the form response

## Step 4: Set Up Form Notifications

### 4.1 Email Notifications
1. In Google Forms, click "Responses" tab
2. Click the three dots menu
3. Select "Get email notifications for new responses"
4. Enter your email: craftedbycrochet@gmail.com

### 4.2 Google Sheets Integration (Optional)
1. Click "Responses" tab
2. Click "Create Spreadsheet"
3. This creates a Google Sheet with all form responses
4. You can track all payments in one place

## Benefits of This Approach

✅ **Professional Process** - Customers follow clear steps
✅ **No EmailJS Issues** - No corruption or size limits
✅ **Organized Data** - All payments in Google Sheets
✅ **Email Notifications** - Instant alerts for new payments
✅ **File Storage** - Google handles file storage and organization
✅ **Mobile Friendly** - Works on all devices
✅ **Secure** - Google's infrastructure handles security

## Email Template for Customers

The customer will receive an email like this:

```
New Order Received! 🛍️

CUSTOMER DETAILS:
Name: John Doe
Email: john@example.com
Phone: +1234567890
Address: 123 Main St

ORDER DETAILS:
Rose x2 - Rs 1000.00
Sunflower Keychain x1 - Rs 500.00

TOTAL AMOUNT: Rs 2500.00

ORDER TIME: 12/15/2024, 3:45:23 PM

Order ID: 1702658723456

PAYMENT INSTRUCTIONS FOR CUSTOMER:
✅ Order confirmed! Please follow these steps to complete your payment:

1. BANK TRANSFER DETAILS:
   - Account Name: Crafted by Crochet
   - Account Number: 1234567890
   - Bank: ABC Bank
   - Amount: Rs 2500.00
   - Reference: Order-1702658723456

2. UPLOAD PAYMENT PROOF:
   📎 Google Form: https://forms.gle/your-actual-form-id
   - Upload your payment screenshot
   - Enter Order ID: 1702658723456
   - Enter your email: john@example.com

3. ORDER DISPATCH:
   ⏰ Your order will be dispatched within 2-3 business days after payment confirmation.

📞 Need help? Contact us at: craftedbycrochet@gmail.com
```

## Managing Payments

### Daily Workflow
1. **Check email notifications** for new form responses
2. **Verify payments** match order amounts
3. **Update order status** (paid/dispatched)
4. **Contact customer** if payment doesn't match

### Google Sheets Tracking
If you set up Google Sheets integration, you'll have:
- Order ID
- Customer details
- Payment amount
- Uploaded screenshot
- Submission timestamp

## Troubleshooting

### Customer Can't Upload
- Check file size (max 10MB)
- Ensure it's an image file
- Try different browser/device

### No Email Notifications
- Check spam folder
- Verify notification settings in Google Forms
- Test with a sample submission

This approach is much more professional and reliable than trying to embed images in emails!
