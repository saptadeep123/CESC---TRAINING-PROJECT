# CESC---TRAINING-PROJECT

TITLE:
ENTRY MODULE FOR ENERGY ACCOUNTING AND AUDIT SYSTEM

SALIENT FEATURES:
This project is made for editing the energy audit pages and downloading them as Excel sheets for presentation at the end of each quarter.

In this project there are TWO tables 1.EA_CONS_CNSP_HDR  AND  2.EA_CONS_CNSP_DTL.

EA_CONS_CNSP_HDR store hard coded fixed information which are to be displayed when the page loads.  
The values entered by the user against the fixed information are stored in the the detail table , EA_CONS_CNSP_DTL.

Login/Sign-up  page is designed to permit the editor to edit the audit pages..

Date selection page  is designed for the editor to select the quarter start and end dates and also allows the editor to select the page he/she wants to edit. After selecting the dates and the page the editor clicks fetch data to view the page.

Consumer Details Table Page brings the data from the database and shows it to the user in a table format . User can edit consumer count and total consumption fields and click to submit to save the changes to the database. 


Other features are listed below:-

1)In Login/Sign-up page all the fields are mandatory if any field is empty the page pops an alert which states that “All fields are mandatory”.
2)In Date selection page user have to select both the dates correctly to view the data for that date range.
3)The data from database table is accessed through server as follows:
a)First the editor enters the date range.
b)If data for the entered date range exist in EA_CONS_CNSP_DTL then the data is fetched from the database and shown on screen , if it does not exist then all the data of EA_CONS_CNSP_HDR is first copied to EA_CONS_CNSP_DTL then that copied data is shown to the user for that date range.
c)The editor can edit the data and can save the changes to the database
The editor can also download the data in Excel format for submission.
