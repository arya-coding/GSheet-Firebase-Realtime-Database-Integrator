# GSheet-Firebase-Realtime-Database-Integrator

A simple, easy-to-use Google Apps Script solution that synchronizes data between Google Sheets and Firebase Realtime Database, enabling real-time collaboration, data management, and analytics. 

Code forked from Vaibhav Gehani ([Link]([url](https://enappd.com/blog/integrating-google-sheets-with-firebase-realtime-database/182/)))

## Features

- Synchronize data between Google Sheets and Firebase Realtime Database
- Real-time updates for changes in either platform
**- Import specific sheets from a spreadsheet**
**- Display a progress status"**
- Customizable data mapping for various use cases
**- Automatic triggers on sheet changes -> Made it optionnal**
- User authentication and access control support

## Prerequisites

- A Google Sheets document
- A Firebase project with Realtime Database enabled

## Getting Started

1. **Create a new Google Sheets document** and set up your sheet(s) with the desired structure and data.
2. **Create a new Google Apps Script project**:
   - In your Google Sheets document, click on `Extensions` > `Apps Script`.
   - This will open the Apps Script editor. Copy the provided code into the `Code.gs` file.
3. **Update the environment variables**:
   - Replace the `spreadsheetID` and `firebaseUrl` variables in the `getEnvironment()` function with your own Google Sheets document ID and Firebase Realtime Database URL.
4. **Add the FirebaseApp library to your project**:
   - Click on `Resources` > `Libraries...` in the Apps Script editor.
   - Add the library with ID `1hguuhS4U2_tiTohGwphq7xphjPqLeqJqE3gvWJMY9F6U9q3nqjveNQNz` and the latest version.
5. **Update your sheet names**:
   - In the `initialize()` function, update the `sheetsToImport` array with the names of the sheets you want to sync with Firebase Realtime Database.
6. **Enable Google Sheets API**:
   - In the Apps Script editor, click on `Resources` > `Advanced Google Services`.
   - Scroll down to `Google Sheets API` and toggle it on.
7. **Configure OAuth 2.0 authentication**:
   - In the Apps Script editor, click on `Resources` > `Cloud Platform project`.
   - Click on the blue project ID link to open the Google Cloud Platform Console.
   - Click on `Navigation menu` > `APIs & Services` > `Credentials`.
   - Click on `Create credentials` > `OAuth 2.0 Client ID`.
   - Select `Web application` as the application type, and give it a name.
   - In the `Authorized redirect URIs` field, add `https://script.google.com/macros/d/{SCRIPT_ID}/usercallback`, replacing `{SCRIPT_ID}` with your actual script ID (found in the Apps Script editor URL).
   - Click `Create` and take note of the generated `Client ID` and `Client Secret`.
   - Back in the Apps Script editor, click on `File` > `Project properties` > `Script properties`.
   - Add two new properties: `client_id` with the value of your `Client ID`, and `client_secret` with the value of your `Client Secret`.
8. **Run the script**:
   - In the Apps Script editor, click on the `Select function` dropdown and choose `onOpen`.
   - Click the `Run` button (play icon) to execute the script.
   - Go back to your Google Sheets document and you will see a new menu item called `Firebase Sync`.
