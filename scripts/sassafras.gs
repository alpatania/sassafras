var SEARCH_QUERY = "label:scholar-articles is:unread"; //  CHANGE THIS TO YOUR OWN SCHOLAR ALERTS SEARCH QUERY
var del_emails = false; // Deletes the Google Scholar email as it reads their content otherwise it just marks them as "read"
var send_summary = true; // Sends and email summary of the current top 10 papers in your 
var date_not_query = true; // Adds the date of the email instead of the subject of the google alert
var date_separator = false; // Adds a separator before writing the new papers' list in the GoogleSheet
var del_past = false; // Deletes past list of papers before adding the new one

function saveEmails(){
    var array2d = getEmails_(SEARCH_QUERY);//creates variable with the output of getEmails_
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet_Papers = ss.getSheetByName('Papers'); //source sheet
    var sheet_Preprints = ss.getSheetByName('PrePrints'); //source sheet
    
    // Creating the sheets if they are not present
    if (!sheet_Papers) {
     ss.insertSheet('Papers'); // if the papers sheet does not exists it creates them
     sheet_Papers = ss.getSheetByName('Papers');
     sheet_Papers.appendRow(['Title','Authors - Journal', 'Link', 'Date', 'Count']);
     sheet_Papers.setFrozenRows(1);
    }
    if (!sheet_Preprints) {
     ss.insertSheet('PrePrints'); // if the preprints sheet does not exists it creates them
     sheet_Preprints = ss.getSheetByName('PrePrints');
     sheet_Preprints.appendRow(['Title','Authors - Journal', 'Link', 'Date', 'Count']);
     sheet_Preprints.setFrozenRows(1);
    }
    
    Logger.log('-----Number of Scraped articles----');
    Logger.log(array2d.length);
    
    var newPapers = [];
    var newPreprints = [];
    
    if (array2d.length > 0) {//if the variable is not empty deletes repetitions and counts them
    
      if (array2d.length > 1) {
        array2d = array2d.sort(Comparator_); // sort the papers' list just created by title alphabetically
        
        var paperold = array2d[0]; // gets the first paper alphabetically
        var countpaperold = 0; // counter of multiplicity of titles
       
        Logger.log('------Counting Duplicates----')
        for (var i = 0; i < array2d.length; i++){ // Goes through the sorted list 
            var paper = array2d[i];
            if (paperold[0] === paper[0]){ // compares each paper title with the title at previous line - strict match char by char
               countpaperold++; // if the title is already present increases the counter
            } else {
               paperold.push(countpaperold); // if the title is not present appends the counter to the previous title's data
               if (paperold[2].match(/(bio|a)rxiv\.org|preprint/g)){ // and adds the previous title with its counter to the correct sheet
                 newPreprints.push(paperold); // preprints if the link is to ArXiv or Biorxiv
               } else {
                 newPapers.push(paperold); // papers otherwise
               }
               var paperold = paper; // Updates the title to be matched to the present one
               var countpaperold = 1; // and resets the counter
            }
         } // closing the for loop
         // Adding the last paper scraped
         if (paperold[2].match(/(bio|a)rxiv\.org|preprint/g)){ // and adds the previous title with its counter to the correct sheet
             paperold.push(countpaperold); // if the title is not present appends the counter to the previous title's data
             newPreprints.push(paperold); // preprints if the link is to ArXiv or Biorxiv
         }
         } else {
             paperold.push(countpaperold); // if the title is not present appends the counter to the previous title's data
             newPapers.push(paperold); // papers otherwise
         }
     } else {
       Logger.log('No new papers this week');
     }
             
      // Adding papers to SpreadSheet
      if (newPapers.length > 0) {
        appendData_(sheet_Papers, newPapers);//runs appendData_ to the papers sheet
        }
      if (newPreprints.length > 0) {
        appendData_(sheet_Preprints, newPreprints);//runs appendData_ to the preprint sheet
        }
    
    // After all is said and done send the summary email
    if (array2d.length>0){
      if (send_summary) {
        create_email_(newPapers, newPreprints);}
      }
}
