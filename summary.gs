function create_email() {
  var ts = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Papers");
  var ts_preprint = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("PrePrints");
  var range = ts.getDataRange()
  range.sort({column: 5, ascending: false}) // Order spreadsheet according to column 5 (Relevance) 
  // Write email
  var emailRange = ts.getRange(2, 1, 10, 5); // Get values to create email body (StartRow, StartColumns, numRows, numCols)
  var firstRow = ts.getRange(1, 1, 1, 5).getValues(); // Get values of first row to add later
  var emailAddress = 'alice.patania@gmail.com';//'your.email@gmail.com';
  var today = new Date();
  
  var subject = 'Sassafras Summary - ' + today;
  var message = "";
  message += "There were " + ts.getLastRow() + " new papers published this week and " + ts_preprint.getLastRow() + " new preprints. <br>Here are the top 10 published papers: <br><br>";
  var data = emailRange.getValues();
  for (var i = 0; i < data.length; ++i) {
    var row = data[i];
    
    //message += row[0] + "<br>" // Title
    message += '<a href="'+row[2]+'">'+ row[0] +'</a><br>'; // Title with hyperlink to PDF
    message += row[1] + "<br>"; // Author + Journal
    //message += row[2] + "<br>" // Link
    //message += row[3] + "<br>" // Date
    message += "Relevance:" + row[4] + "<br>"; // Relevance
    message += "<br><br>";
    }
  // Send Alert Email.
  var options = {};
    options.htmlBody = message; // Turn the string to html to allow for hyperlink and breaks
  MailApp.sendEmail(emailAddress, subject, '', options);
}
