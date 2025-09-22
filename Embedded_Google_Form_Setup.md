# Embedded Google Form for Complete Order Process

## Overview
This approach embeds a Google Form directly into your website, allowing customers to:
- Fill out order details
- Upload payment screenshots
- Submit everything in one form

## Benefits
✅ **Complete order process** in one form
✅ **Image upload support** - Google handles file storage
✅ **Professional appearance** - Embedded in your website
✅ **No EmailJS issues** - Google handles everything
✅ **Mobile friendly** - Works on all devices
✅ **Automatic notifications** - Email alerts for new orders

## Step 1: Create Google Form

### 1.1 Go to Google Forms
Visit: https://forms.google.com/

### 1.2 Create New Form
1. Click "Blank" to create a new form
2. Title: "Order Form - Crafted by Crochet"

### 1.3 Add Form Fields

**Section 1: Customer Information**
- **Full Name** (Short answer, Required)
- **Email Address** (Short answer, Required)
- **Phone Number** (Short answer, Required)
- **Shipping Address** (Paragraph, Required)

**Section 2: Order Details**
- **Order Items** (Paragraph, Required)
  - Instructions: "Please list the items you want to order with quantities"
- **Total Amount** (Short answer, Required)
  - Instructions: "Enter the total amount for your order"

**Section 3: Payment**
- **Payment Screenshot** (File upload, Required)
  - Instructions: "Upload screenshot of your payment transfer"
  - File types: Images only
  - Maximum file size: 10 MB
- **Bank Transfer Reference** (Short answer)
  - Instructions: "Enter your bank transfer reference/transaction ID"

**Section 4: Additional Notes**
- **Special Instructions** (Paragraph)
  - Instructions: "Any special delivery instructions or notes"

### 1.4 Form Settings
1. Click the Settings gear icon
2. Check "Collect email addresses"
3. Check "Limit to 1 response" (optional)

## Step 2: Get Embed Code

### 2.1 Get Embed Link
1. Click "Send" button in Google Forms
2. Click the embed icon (</>) 
3. Copy the embed code

### 2.2 Modify Embed Code
The embed code will look like this:
```html
<iframe src="https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform?embedded=true" 
        width="640" 
        height="2000" 
        frameborder="0" 
        marginheight="0" 
        marginwidth="0">Loading…</iframe>
```

## Step 3: Replace Checkout Form

### 3.1 Update HTML
Replace the current checkout form with the embedded Google Form.

### 3.2 Add to index.html
Add the Google Form embed code in place of the current checkout form.

## Step 4: Style the Embedded Form

### 4.1 CSS Styling
Add CSS to make the embedded form look good on your website.

### 4.2 Responsive Design
Ensure the form works well on mobile devices.

## Step 5: Set Up Notifications

### 5.1 Email Notifications
1. In Google Forms, click "Responses" tab
2. Click the three dots menu
3. Select "Get email notifications for new responses"
4. Enter your email: craftedbycrochet@gmail.com

### 5.2 Google Sheets Integration
1. Click "Responses" tab
2. Click "Create Spreadsheet"
3. This creates a Google Sheet with all orders

## Alternative: Hybrid Approach

You can also keep the current checkout form for order details and add a separate Google Form just for payment uploads:

1. **Current checkout form** → Collects order details, sends email
2. **Email includes Google Form link** → For payment screenshot upload
3. **Best of both worlds** → Professional order process + reliable payment collection

## Implementation Options

### Option A: Full Google Form Replacement
- Replace entire checkout process with Google Form
- Customers fill everything in one form
- You get all data in Google Sheets

### Option B: Hybrid Approach (Recommended)
- Keep current checkout for order details
- Add Google Form link in email for payment upload
- Maintains your current design while adding payment capability

### Option C: Two-Step Process
- Step 1: Order details form (current)
- Step 2: Payment upload form (Google Form)
- Both embedded in your website

## Example Implementation

Here's how the hybrid approach would work:

1. **Customer fills order form** → Name, email, items, address
2. **Receives email** → With payment instructions and Google Form link
3. **Makes payment** → Bank transfer
4. **Uploads proof** → Via Google Form embedded in your website
5. **You get notification** → Email alert with all details

## Next Steps

1. **Decide on approach** → Full replacement, hybrid, or two-step
2. **Create Google Form** → With appropriate fields
3. **Get embed code** → From Google Forms
4. **Update website** → Add embedded form or link
5. **Test process** → Ensure everything works smoothly
6. **Set up notifications** → Email alerts for new orders

Would you like me to implement any of these approaches for you?
