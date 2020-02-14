var testin = false; // Debugging true for debugging
var num_columns = 4;
// Modified version of the code from: https://gist.github.com/oshliaer/70e04a67f1f5fd96a708
// To work with Google Scholar Alerts

function getStatusCode_(url){
  Logger.log(url);
   var options = {
     'muteHttpExceptions': true,
     'followRedirects': false
   };   
   var url_trimmed = url.trim();   
   var response = UrlFetchApp.fetch(url_trimmed, options);
   return response.getResponseCode();
}

function getEmails_(q) {
    var emails = [];
    var threads = GmailApp.search(q);// Searches for unread messages with the google scholar label
    for (var i in threads) {
        var msgs = threads[i].getMessages();
        for (var j in msgs) {
            var listpapers = msgs[j].getPlainBody().split(/\n\n \n/)[0]; // separates Google Scholar signature from the body
            var subject = msgs[j].getSubject(); // gets the Google Scholar Alert search query
            var date = msgs[j].getDate(); // gets the email date
            var papers = listpapers.split(/\r?\n\n/); // creates an array with the text describing each paper
            var numpapers = papers.length;
            for (var k = 0; k < numpapers; k++) {
              var title = papers[k].split('<')[0];// the title is everything before the link to google scholar
//              Logger.log("------------------------------------------------------------------");
//              Logger.log(title);
              if (title.match(/\[CITATION\]/g)){
                continue // ignore the titles that are only a scholar citation link
              }
              title = title.replace('*',''); // if there are any * denoting the found search query for the google scholar alert in the title are removed
              title = title.replace('*','');
              title = title.replace('[HTML] ',''); //
              title = title.replace('[PDF] ',''); // any indication on the format of the paper is removed from the title
              title = title.replace(/\r?\n|\r/g,''); // all linebreaks are removed from the title
              var lines = papers[k].split(/\r?\n/);
              var numlines = lines.length;
              var paper = []
              paper.push(title)
              for (var l = 0; l < numlines; l++) {
                var line = lines[l];
                if (line.indexOf('<') == 0) { // the first line to contain a hyperlink is the link to the article
                  paper.push(lines[l+1]); // the line right after is the list of authors
                  var scholar_url = line.replace('<','').replace('>','');
                  scholar_url = scholar_url.replace(/http:\/\/scholar\.google\.(com|it)\/scholar_url\?url=/g,'');
                  var url = scholar_url.split('&');
                  if (getStatusCode_(url[0]) == 404) {
                    paper.push("https://www.google.com/search?q="+title.replace(' ','+'));
                    } else {
                    paper.push(url[0]);
                    }
                  break;
                } else {
                  continue
                }
              }
              if (date_not_query) {
               paper.push(date); 
              } else { 
               paper.push(subject);//after the title and author [Google Scholar Alert search query] is added to the paper info being saved
              }
              // HOTFIX
              if (paper.length < num_columns) {
                for (var fix = 0; fix < num_columns-paper.length; fix++) {
                  paper.push('something went wrong here')
                }
                } else {
                paper = paper.slice(0,num_columns)
                }
               // END HOTFIX
              emails.push(paper); // the paper is added to the list
         }
         
        }
        if (!testin){
          if (del_emails) {
            threads[i].moveToTrash() // the message is moved to Trash
          } else {
            threads[i].markRead() // the message is marked as read so it will not pop up again
          }
        }
    }
    return emails;
}

function appendData_(sheet, array2d) {
 if (del_past) {
  var firstRow = sheet.getRange(1, 1, 1, num_columns+1).getValues(); // Get values of first row to add later
  sheet.clearContents(); // Clean spreadsheet
  sheet.getRange(1, 1, 1, num_columns+1).setValues(firstRow);
    }
 if (date_separator) { //Adding a line with today's time stamp before the new update
  var today = new Date();
  sheet.getRange(sheet.getLastRow() + 1, 1).setValue(today);
 }
  sheet.getRange(sheet.getLastRow() + 1, 1, array2d.length, array2d[0].length).setValues(array2d);
}

function Comparator_(a, b) {
   return a[0].localeCompare(b[0]);
 }
 
