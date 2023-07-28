var changedRanges = {};

function getEnvironment() {
  var environment = {
    spreadsheetID: YOUR_GSHEET_ID_URL",
    firebaseUrl: "https://YOURAPPNAME-default-rtdb.europe-west1.firebasedatabase.app/",
    enableOnChangeTrigger: false, // Set this to true to enable onChange trigger, or false to disable it
  };
  return environment;
}

function createSpreadsheetEditTrigger(sheetID) {
  var triggers = ScriptApp.getProjectTriggers();
  var triggerExists = false;
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getTriggerSourceId() == sheetID) {
      triggerExists = true;
      break;
    }
  }

  if (!triggerExists) {
    var spreadsheet = SpreadsheetApp.openById(sheetID);
    ScriptApp.newTrigger("importSheet")
      .forSpreadsheet(spreadsheet)
      .onChange()
      .create();
  }
}

function deleteTriggers() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
}

function initialize(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // Display a message indicating that the script is running
  ss.toast("Syncing sheets to Firebase...", "Status", -1);
  
  var environment = getEnvironment();
  var sheetsToImport = ["data"]; // Add the names of the sheets you want to import
  if (environment.enableOnChangeTrigger) {
    createSpreadsheetEditTrigger(environment.spreadsheetID);
    if (e && e.changeType === "EDIT") {
      importChangedRanges(getEnvironment().spreadsheetID, sheetsToImport);
    } else {
      importSelectedSheets(getEnvironment().spreadsheetID, sheetsToImport);
    }
  } else {
    deleteTriggers();
    importSelectedSheets(getEnvironment().spreadsheetID, sheetsToImport);
  }
}



function syncChangedCells(e) {
  var sheetName = e.source.getSheetName();
  if (!changedRanges[sheetName]) {
    changedRanges[sheetName] = [];
  }
  changedRanges[sheetName].push(e.range);
}

function importSelectedSheets(sheetID, sheetsToImport, e) {
  var ss = SpreadsheetApp.openById(sheetID);
  SpreadsheetApp.setActiveSpreadsheet(ss);
  var sheets = ss.getSheets();

  for (var i = 0; i < sheets.length; i++) {
    if (sheetsToImport.includes(sheets[i].getName())) {
      if (e && e.changeType === "EDIT" && e.source.getSheetName() === sheets[i].getName()) {
        importSheet(sheets[i], sheetsToImport, { range: e.range });
      } else {
        importSheet(sheets[i], sheetsToImport);
      }
      SpreadsheetApp.setActiveSheet(sheets[i]);
    }
  }
}


function importChangedRanges(sheetID, sheetsToImport) {
  var ss = SpreadsheetApp.openById(sheetID);
  SpreadsheetApp.setActiveSpreadsheet(ss);
  var sheets = ss.getSheets();

  for (var i = 0; i < sheets.length; i++) {
    if (sheetsToImport.includes(sheets[i].getName())) {
      var sheet = sheets[i];
      var sheetName = sheet.getName();
      var range = ss.getActiveRange();
      importSheet(sheet, sheetsToImport, { range: range });
    }
  }
}


function onOpen() {
  var spreadsheet = SpreadsheetApp.getActive();
  var menuItems = [
    {
      name: 'Sync Sheets to Firebase',
      functionName:
        getEnvironment().enableOnChangeTrigger ? 'importSelectedSheets' : 'importChangedRanges',
    },
  ];
  spreadsheet.addMenu('Firebase Sync', menuItems);
}

function assign(obj, keyPath, value) {
  lastKeyIndex = keyPath.length - 1;
  for (var i = 0; i < lastKeyIndex; ++i) {
    key = keyPath[i];
    if (!(key in obj)) obj[key] = {};
    obj = obj[key];
  }
  obj[keyPath[lastKeyIndex]] = value;
}
function importSheet(sheet, sheetsToImport, options) {
  options = options || {};

  if (!sheetsToImport.includes(sheet.getName())) {
    return;
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = SpreadsheetApp.getActiveSheet();
  var name = sheet.getName();
  var dataRange = options.range || sheet.getDataRange();
  var data = dataRange.getValues();
  var valuesUpdated = 0;

  Logger.log("Importing sheet: " + name);

  var dataToImport = {};

  for (var i = 1; i < data.length; i++) {
    dataToImport[data[i][0]] = {};
    for (var j = 0; j < data[0].length; j++) {
      assign(dataToImport[data[i][0]], data[0][j].split("__"), data[i][j]);
    }

    // Count the number of updated values
if (options.range && options.range.getSheet().getName() === sheet.getName() && e.oldValue != e.value) {
      valuesUpdated++;
    }
  }

  var token = ScriptApp.getOAuthToken();

// Replace XXX by your project name
  var firebaseUrl = getEnvironment().firebaseUrl + "XXXX/";
  Logger.log("Writing data to Firebase Realtime Database: " + JSON.stringify(dataToImport));
  var base = FirebaseApp.getDatabaseByUrl(firebaseUrl, token);
  base.setData("", dataToImport);
  Logger.log("Data successfully written to Firebase Realtime Database");

  // Show the number of updated values in the toast message
  if (valuesUpdated > 0) {
   // ss.toast("Sync completed! Updated " + valuesUpdated + " value(s).", "Status", 3);
   ss.toast("Sync completed!" , "Status", 3);
  } else {
    ss.toast("Sync completed!" , "Status", 3);
  }
}
