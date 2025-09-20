# Simple Order Integration Setup

## Option 1: Formspree (Recommended - Works Immediately)

### Step 1: Create Formspree Account
1. Go to [Formspree.io](https://formspree.io)
2. Sign up for a free account
3. Create a new form
4. Copy the form endpoint URL (looks like: `https://formspree.io/f/your-form-id`)

### Step 2: Update the Code
1. Open `js/cart.js`
2. Find this line: `const response = await fetch('https://formspree.io/f/xpwgkqyv', {`
3. Replace `xpwgkqyv` with your actual form ID from Formspree

### Step 3: Test
1. Place a test order
2. Check your Formspree dashboard - orders will appear there
3. You can set up email notifications to get orders sent to your email

## Option 2: Google Sheets (More Advanced)

### Step 1: Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet named "Crafted by Crochet Orders"
3. Add these headers in row 1:
   - A: Timestamp
   - B: Order ID  
   - C: Customer Name
   - D: Customer Email
   - E: Customer Phone
   - F: Shipping Address
   - G: Items
   - H: Total Amount
   - I: Payment Method
   - J: Transfer Screenshot
   - K: Status

### Step 2: Create Google Apps Script
1. In your Google Sheet, go to **Extensions** → **Apps Script**
2. Delete default code and paste this:

```javascript
function doGet(e) {
  return doPost(e);
}

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    let data;
    
    // Handle both GET and POST requests
    if (e.parameter) {
      // GET request - data comes from URL parameters
      data = e.parameter;
    } else if (e.postData) {
      // POST request - data comes from request body
      data = JSON.parse(e.postData.contents);
    } else {
      throw new Error('No data received');
    }
    
    // Add the order to the sheet
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.orderId || 'N/A',
      data.customerName || 'N/A',
      data.customerEmail || 'N/A',
      data.customerPhone || 'N/A',
      data.shippingAddress || 'N/A',
      data.items || 'N/A',
      data.totalAmount || 'N/A',
      data.paymentMethod || 'N/A',
      data.transferScreenshot || 'N/A',
      data.status || 'Pending'
    ]);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({success: true, message: 'Order added successfully'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error processing order:', error);
    return ContentService
      .createTextOutput(JSON.stringify({error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Step 3: Deploy Script
1. Click **Deploy** → **New Deployment**
2. Choose **Web app**
3. Set **Execute as**: Me
4. Set **Who has access**: Anyone
5. Click **Deploy**
6. Copy the **Web App URL**

### Step 4: Update Website
1. Open `js/cart.js`
2. Find: `const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';`
3. Replace `YOUR_SCRIPT_ID` with your actual script ID

## Option 3: Email Integration (Simplest)

### Step 1: Use Built-in Fallback
The system already has a fallback that shows order details in an alert. You can:
1. Copy the order details from the alert
2. Paste them into your preferred system (email, spreadsheet, etc.)

### Step 2: Set Up Email Notifications
1. Use the order details from the alert
2. Send them to craftedbycrochet@gmail.com manually
3. Or set up a simple email forwarding system

## Current Status
- ✅ Orders are saved to localStorage (visible in admin panel)
- ✅ No duplicate orders
- ✅ Order details are displayed for manual entry
- ⚠️ Automatic Google Sheets integration needs setup
- ⚠️ Formspree integration needs form ID update

## Quick Test
1. Place a test order
2. Check the browser console for any error messages
3. The order should appear in the admin panel
4. You should see an alert with order details for manual entry
