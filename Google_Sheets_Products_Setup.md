# Google Sheets Products Integration Setup

## Step 1: Create Products Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Crafted by Crochet Products"
4. Add these column headers in row 1:
   - A: ID
   - B: Name
   - C: Category
   - D: Price
   - E: Stock
   - F: Description
   - G: Image (Base64 encoded)
   - H: Created At
   - I: Updated At

## Step 2: Create Google Apps Script for Products
1. In your Google Sheet, go to **Extensions** → **Apps Script**
2. Delete the default code and paste this:

```javascript
function doGet(e) {
  try {
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Get all data from the sheet
    const data = sheet.getDataRange().getValues();
    
    // Skip header row and convert to objects
    const products = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[0]) { // Only include rows with ID
        products.push({
          id: parseInt(row[0]),
          name: row[1],
          category: row[2],
          price: parseFloat(row[3]),
          stock: parseInt(row[4]),
          description: row[5],
          image: row[6],
          createdAt: row[7],
          updatedAt: row[8]
        });
      }
    }
    
    // Return products as JSON
    return ContentService
      .createTextOutput(JSON.stringify({success: true, products: products}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    if (data.action === 'add') {
      // Add new product
      const newId = getNextId(sheet);
      const now = new Date().toISOString();
      
      sheet.appendRow([
        newId,
        data.name,
        data.category,
        data.price,
        data.stock,
        data.description,
        data.image,
        now,
        now
      ]);
      
      return ContentService
        .createTextOutput(JSON.stringify({success: true, id: newId}))
        .setMimeType(ContentService.MimeType.JSON);
        
    } else if (data.action === 'update') {
      // Update existing product
      const rows = sheet.getDataRange().getValues();
      for (let i = 1; i < rows.length; i++) {
        if (parseInt(rows[i][0]) === data.id) {
          const now = new Date().toISOString();
          sheet.getRange(i + 1, 1, 1, 9).setValues([[
            data.id,
            data.name,
            data.category,
            data.price,
            data.stock,
            data.description,
            data.image,
            rows[i][7], // Keep original createdAt
            now // Update updatedAt
          ]]);
          break;
        }
      }
      
      return ContentService
        .createTextOutput(JSON.stringify({success: true}))
        .setMimeType(ContentService.MimeType.JSON);
        
    } else if (data.action === 'delete') {
      // Delete product
      const rows = sheet.getDataRange().getValues();
      for (let i = 1; i < rows.length; i++) {
        if (parseInt(rows[i][0]) === data.id) {
          sheet.deleteRow(i + 1);
          break;
        }
      }
      
      return ContentService
        .createTextOutput(JSON.stringify({success: true}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getNextId(sheet) {
  const data = sheet.getDataRange().getValues();
  let maxId = 0;
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] && parseInt(data[i][0]) > maxId) {
      maxId = parseInt(data[i][0]);
    }
  }
  return maxId + 1;
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
1. Open `js/products.js`
2. Add the Google Script URL at the top:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
   ```

## Step 5: Test
1. Add a product from the admin panel
2. Check your Google Sheet - the product should appear automatically
3. Visit the main website - the product should be visible to everyone
4. If it doesn't work, check the browser console for errors

## Troubleshooting
- Make sure the Google Apps Script is deployed as a web app
- Ensure "Anyone" has access to the web app
- Check that the column headers match exactly
- Verify the script URL is correct in the JavaScript file
- Test both GET (load products) and POST (add/update/delete) operations
