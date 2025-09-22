# Embedded Google Form Setup for Payment Screenshots

## Overview
This embeds a Google Form directly into your checkout page, allowing customers to upload payment screenshots without leaving your website. You'll receive all submissions through Google Forms.

## How It Works
1. **Customer places order** → Fills out order details
2. **Receives email** → With payment instructions and Order ID
3. **Makes payment** → Bank transfer
4. **Uploads screenshot** → Using embedded form on your website
5. **You get notification** → Email alert with uploaded image

## Step 1: Create Google Form

### 1.1 Go to Google Forms
Visit: https://forms.google.com/

### 1.2 Create New Form
1. Click "Blank" to create a new form
2. Title: "Payment Screenshot Upload"

### 1.3 Add Form Fields

**Question 1: Order ID**
- Type: Short answer
- Question: "Order ID *"
- Description: "Enter your Order ID from the confirmation email"
- Required: Yes

**Question 2: Customer Name**
- Type: Short answer
- Question: "Your Full Name *"
- Required: Yes

**Question 3: Customer Email**
- Type: Short answer
- Question: "Your Email Address *"
- Description: "The same email you used for the order"
- Required: Yes

**Question 4: Payment Amount**
- Type: Short answer
- Question: "Amount Paid (Rs) *"
- Description: "Enter the exact amount you transferred"
- Required: Yes

**Question 5: Payment Screenshot**
- Type: File upload
- Question: "Upload Payment Screenshot *"
- Description: "Screenshot or photo of your bank transfer confirmation"
- Required: Yes
- File types: Images only
- Maximum file size: 10 MB

**Question 6: Bank Transfer Reference**
- Type: Short answer
- Question: "Bank Transfer Reference/Transaction ID"
- Description: "Reference number from your bank transfer (optional)"
- Required: No

### 1.4 Form Settings
1. Click Settings gear icon
2. Check "Collect email addresses"
3. Uncheck "Limit to 1 response"

## Step 2: Get Embed Code

### 2.1 Get Embed Link
1. Click "Send" button in Google Forms
2. Click the embed icon (</>) 
3. Copy the form ID from the embed code

### 2.2 Form ID Location
The embed code will look like this:
```html
<iframe src="https://docs.google.com/forms/d/e/1ABC2DEF3GHI4JKL5MNO6PQR7STU8VWX9YZ/viewform?embedded=true" 
        width="640" 
        height="2000" 
        frameborder="0" 
        marginheight="0" 
        marginwidth="0">Loading…</iframe>
```

The form ID is: `1ABC2DEF3GHI4JKL5MNO6PQR7STU8VWX9YZ`

## Step 3: Update Your Website

### 3.1 Replace Form ID
In your `index.html` file, find this line:
```html
<iframe src="https://docs.google.com/forms/d/e/YOUR_GOOGLE_FORM_ID/viewform?embedded=true"
```

Replace `YOUR_GOOGLE_FORM_ID` with your actual form ID.

### 3.2 Example
If your form ID is `1ABC2DEF3GHI4JKL5MNO6PQR7STU8VWX9YZ`, the line should be:
```html
<iframe src="https://docs.google.com/forms/d/e/1ABC2DEF3GHI4JKL5MNO6PQR7STU8VWX9YZ/viewform?embedded=true"
```

## Step 4: Set Up Notifications

### 4.1 Email Notifications
1. In Google Forms, click "Responses" tab
2. Click the three dots menu (⋮)
3. Select "Get email notifications for new responses"
4. Enter your email: craftedbycrochet@gmail.com

### 4.2 Google Sheets Integration (Optional)
1. Click "Responses" tab
2. Click "Create Spreadsheet"
3. This creates a Google Sheet with all form responses

## Step 5: Test the Integration

### 5.1 Test Order Process
1. Place a test order on your website
2. Check the email received
3. Verify the embedded form appears correctly
4. Test uploading an image through the embedded form

### 5.2 Check Notifications
1. Submit a test form with an image
2. Check if you receive the email notification
3. Verify the image is attached in the email

## Benefits
✅ **Seamless experience** - Customers stay on your website
✅ **Image upload support** - Google handles file storage
✅ **Professional appearance** - Embedded in your checkout
✅ **Mobile friendly** - Works on all devices
✅ **Email notifications** - Instant alerts for new submissions
✅ **Organized data** - All submissions in Google Sheets
✅ **No technical issues** - Google handles everything

## Customer Experience
1. Customer fills order details → Places order
2. Receives email with payment instructions and Order ID
3. Makes bank transfer
4. Returns to your website → Embedded form is right there
5. Uploads payment screenshot with Order ID
6. You get email notification with the image

## Troubleshooting
- **Form not loading**: Check if the form ID is correct
- **No email notifications**: Check spam folder and notification settings
- **Image upload issues**: Ensure file is under 10MB and is an image
- **Mobile issues**: The form is responsive and should work on mobile

This approach gives you the best user experience - customers can upload payment screenshots without leaving your website!
