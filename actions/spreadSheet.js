'use server';

import { google } from 'googleapis';

export async function appendToSheet(data) {
  const { GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID } = process.env;

  const auth = new google.auth.JWT(
    GOOGLE_SERVICE_ACCOUNT_EMAIL,
    null,
    GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/spreadsheets']
  );

  const sheets = google.sheets({ version: 'v4', auth });

  const range = 'Sheet1!A:C';

  // Define the request body for appending data
  const resource = {
    values: data, // Ensure `data` is a 2D array
  };

  try {
    // Make the API call to append data
    await sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SHEET_ID,
      range,
      valueInputOption: 'RAW',
      resource,
    });

    console.log('Data appended successfully');
  } catch (error) {
    console.error('Error appending data to spreadsheet:', error);
  }
}
