var SEARCH_QUERY = "label:scholar-articles is:unread"; //  CHANGE THIS TO YOUR OWN SCHOLAR ALERTS SEARCH QUERY
 
// Modified version of the code from: https://gist.github.com/oshliaer/70e04a67f1f5fd96a708
// To work with Google Scholar Alerts

function getEmails_(q) {
    var emails = [];
    var threads = GmailApp.search(q);// Searches for unread messages with the google scholar label
    for (var i in threads) {
        var msgs = threads[i].getMessages();
        for (var j in msgs) {
            var listpapers = msgs[j].getPlainBody().split(/\r?\n\n/)[0]; // separates Google Scholar signature from the body
            var subject = msgs[j].getSubject(); // gets the Google Scholar Alert search query
            listpapers = listpapers.replace(/(\[image: Google\+\]).*?(>\n)/g,'newpaper\n'); //creates a signal for recognizing a new paper
            var papers = listpapers.split(/\r?newpaper\n/); // creates an array with the text describing each paper
            var numpapers = papers.length;
            for (var k = 0; k < numpapers; k++) {
              var title = papers[k].split('<')[0];// the title is everything before the link to google scholar
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
                  paper.push(line.replace('<','').replace('>',''));
                  break;
                } else {
                  continue
                }
              }
              paper.push(subject); //after the title and author the Google Scholar Alert search query is added to the paper info being saved
              emails.push(paper); // the paper is added to the list
         }
         
        }
        msgs.markRead() // the message is marked as read so it will not pop up again
    }
    return emails;
}

function appendData_(sheet, array2d) {
  sheet.getRange(sheet.getLastRow() + 1, 1, array2d.length, array2d[0].length).setValues(array2d);
}

function Comparator_(a, b) {
   return a[0].localeCompare(b[0]);
 }
 
function saveEmails() {
    var array2d = getEmails_(SEARCH_QUERY);//creates variable with the output of getEmails_
    if (array2d) {//if the variable is not empty deletes repetitions and counts them
      var newData = [];
      array2d = array2d.sort(Comparator_);
      var paperold = array2d[0];
      var countpaperold = 0;
      for (var i = 0; i < array2d.length; i++){
          var paper = array2d[i];
          if (paperold[0] === paper[0]){
             countpaperold = countpaperold+1;
          } else {
             paperold.push(countpaperold);
             newData.push(paperold);
             var paperold = paper;
             var countpaperold = 1;
          }
       }
      appendData_(SpreadsheetApp.getActiveSheet(), newData);//runs appendData_ to the active spreadsheet - BUG: this does not seem to work if there is more than one Sheet in the Spreadsheet. Why?
    }
}
