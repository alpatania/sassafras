# S.A.S.S.A.F.R.A.S.
A simple automatic scholar sorter appropriate for researchers and scientists (credit for the awesome acronym goes to ![Thomas Varley](https://github.com/ThosV))

This is a small script that looks for **unread Google Scholar Alerts** emails in your Gmail account and saves each paper in a Google Spreadsheet as:
Title/ Authors - Journal/ Google Scholar link/ GoogleScholar Alert/ number of Alerts that contained the paper

![Gmail alerts](gmail_GSalerts.png)
![Google sheet](gsheet_GSalerts.png)

# How to run it:
1. Open a new Google Sheet
2. Go to **Tools > Script Editor**
3. Copy paste the .gs file
4. Change the **SEARCH_QUERY** variable so that it can detect your unread Google Scholar Alerts *(the script will automatically mark them as read after saving them)*
5. Run the **save_email** function
