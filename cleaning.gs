var labels = [
  [/thisisyourRegEx1/ig, 'Sheet_name1'],
  [/thisisyourRegEx2/ig, 'Sheet_name2'],
  [/thisisyourRegEx3/ig, 'Sheet_name3'],
  [/thisisyourRegEx4/ig, 'Sheet_name4']
  ];


function labeling_(sheet_name, rx){

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Papers'); //source sheet
  var testrange = sheet.getRange('A:A' );//range to check
  var testvalue = testrange.getValues();
  
  var csh = ss.getSheetByName(sheet_name); //destination sheet
  if (!csh) {
         ss.insertSheet(sheet_name); // if the papers sheet does not exists it creates them
        }
  var data = [];
  var j =[];

  //Condition check in A:A; If true copy the same row to data array
  for (i=1; i<testvalue.length;i++) {
  var teststring = testvalue[i];
    if ( teststring[0].match(rx) ) {
    data.push.apply(data,sheet.getRange(i+1,1,1,7).getValues());
    //Copy matched ROW numbers to j
    j.push(i);
   }
 }
 
 if (data.length>0){
    //Copy data array to destination sheet
     csh.getRange(csh.getLastRow()+1,1,data.length,data[0].length).setValues(data);
    
  //Delete matched rows in the source sheet
    for (i=0;i<j.length;i++){
    var k = j[i]+1;
    sheet.deleteRow(k);
  
    //Alter j to account for deleted rows
      if (!(i == j.length-1)) {
      j[i+1] = j[i+1]-i-1;
      }
  
    }
  }
}

function run_labels(){
  for (r=0; r<labels.length; r++) {
    var rx = labels[r][0];
    var sheetname = labels[r][1];
    labeling_(sheetname, rx);
  }
  
}

// custom menu function
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom Menu')
      .addItem('Save Data','saveEmails')
      .addItem('Reorganize Papers','run_labels')
      .addItem('Tag Pre-prints','run_tags')
      .addToUi();
}

function tagging_(sheet_name, rx){

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Preprints'); //source sheet
  var testrange = sheet.getRange('A:A' );//range to check
  var testvalue = testrange.getValues();
  
  var csh = ss.getSheetByName(sheet_name); //destination sheet

  //Condition check in A:A; If true copy the same row to data array
  for (i=1; i<testvalue.length;i++) {
  var teststring = testvalue[i];
    if ( teststring[0].match(rx) ) {
    var cell = sheet.getRange(i+1,6);
    if (cell.isBlank()) {
        cell.setValue(sheet_name);
    }
   }
 }
}

function run_tags(){
  for (r=0; r<labels.length; r++) {
    var rx = labels[r][0];
    var sheetname = labels[r][1];
    tagging_(sheetname, rx);
  }
  
}
