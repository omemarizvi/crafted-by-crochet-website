# Google Sheets Integration Setup

## Step 1: Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Crafted by Crochet Orders"
4. Add these column headers in row 1:
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

## Step 2: Create Google Apps Script
1. In your Google Sheet, go to **Extensions** → **Apps Script**
2. Delete the default code and paste this:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Add the order data to the sheet
    sheet.appendRow([
      data.timestamp,
      data.orderId,
      data.customerName,
      data.customerEmail,
      data.customerPhone,
      data.shippingAddress,
      data.items,
      data.totalAmount,
      data.paymentMethod,
      data.transferScreenshot,
      data.status
    ]);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## Step 3: Deploy the Script
1. Click **Deploy** → **New Deployment**
2. Choose **Web app** as the type
3. Set **Execute as**: Me
4. Set **Who has access**: Anyone
5. Click **Deploy**
6. Copy the **Web App URL** (it will look like: `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`)

## Step 4: Update the Website
1. Open `js/cart.js`
2. Find the line: `const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';`
3. Replace `YOUR_SCRIPT_ID` with your actual script ID from step 3

## Step 5: Test
1. Place a test order on your website
2. Check your Google Sheet - the order should appear automatically
3. If it doesn't work, check the browser console for errors

## Troubleshooting
- Make sure the Google Apps Script is deployed as a web app
- Ensure "Anyone" has access to the web app
- Check that the column headers match exactly
- Verify the script URL is correct in the JavaScript file

## Manual Entry Fallback
If the automatic integration doesn't work, the system will show an alert with all order details that you can copy and paste into your Google Sheet manually.
