var top_papers = 5;
var top_preprints = 5;

function create_email_(range, range_preprints) {
  var ts = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Papers");
  var ts_preprint = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("PrePrints");
  range = range.sort(function(a,b) {// Order spreadsheet according to column 5 (Relevance) 
    return b[4]-a[4]
    });

  range_preprints = range_preprints.sort(function(a,b) {// Order spreadsheet according to column 5 (Relevance) 
    return b[4]-a[4]
    });
  
  // Write email
  var emailAddress = 'your.email@gmail.com';
  var today = new Date();
  var subject = 'Sassafras Summary - ' + today;
  var message = "";
  message += "There were " + range.length + "(" + ts.getLastRow() + ") new papers published this week and " + range_preprints.length + "(" + ts_preprint.getLastRow() + ") new preprints. <br>";
  message += "<br>--- Here are the top "+ Math.min(top_papers,range.length) +" published papers of the week: <br>";
  // Adding Top 5 published papers
  for (var i = 0; i < Math.min(top_papers,range.length); ++i) {
    var row = range[i];
    
    message += '<a href="'+row[2]+'">'+ row[0] +'</a><br>'; // Title with hyperlink to PDF
    message += row[1] + "<br>"; // Author + Journal
    message += "Relevance:" + row[4] + "<br>"; // Relevance
    message += "<br>";
    }
  message += "<br>--- Here are the top "+Math.min(top_preprints,range_preprints.length)+" preprints of the week: <br>";
    // Adding Top 5 preprints 
  for (var i = 0; i < Math.min(top_preprints,range_preprints.length); ++i) {
    var row = range_preprints[i];
    
    message += '<a href="'+row[2]+'">'+ row[0] +'</a><br>'; // Title with hyperlink to PDF
    message += row[1] + "<br>"; // Author + Journal
    message += "Relevance:" + row[4] + "<br>"; // Relevance
    message += "<br>";
    }
  // Send Alert Email.
  var options = {};
    options.htmlBody = message; // Turn the string to html to allow for hyperlink and breaks
  MailApp.sendEmail(emailAddress, subject, '', options);
}
