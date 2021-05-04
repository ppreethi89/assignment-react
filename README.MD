API
----

This has the API logic which handles unzip, process and preparing data using dictionary that is being used by front end.
This has 3 endpoints in one route inputAPI.js
1. /Files - POST method - that will post zip file sent by the client and extracts all CSV's from it and saves them. Sends Cookie with dynamic filename, which will help client to call other functions and to avoid preprocessing again.

2. ./topfilenames - POST method - client will send date, month, year and cookie filename. 
From the filename specified, this populates the top 5 filenames.

3. ./topusernames - POST method - client will send date, month, year and cookie filename. 
From the filename specified, this populates the top 5 usernames.

CLIENT
-------

This has the REACT frontend where user can upload the ZIP, view the trends for daywise or hourwise records. This also gives an option for the client to view the trend for the date they select. The UI is based on Dark theme of Material UI.

1. src/API folder has below files
    a. topfiles.js - which calls API endpoint to get top 5 filenames.
    b. topusers.js - which calls API endpoint to get top 5 usernames.

2. src/Styles folder has two JS files that controls styling of frontend elements.

3. Dashboard.js - has main logic and uses Material UI AppBar.
    Shows two menus, one for hourly reporting and another for daywise reporting. 
    Both the views have 3 widgets,
    a. To show trend of activities (for every day of a month / for every hour of a day)
    b. Top 5 usernames
    c. Top 5 filenames

4. App.js - renders the Dashboard file.
5. index.js - sets dark theme for UI.

TO RUN the project:
-------------------

1. First run api, go to that path in terminal, and enter below commands.
    npm install
    npm start

2. Then run client, go to that path in terminal, and enter below commands.
    npm install
    npm start

SCREENGRABS:
-------------
![image](https://user-images.githubusercontent.com/33653648/117057326-4fbcd700-aceb-11eb-889f-2fae81495e96.png)

![image](https://user-images.githubusercontent.com/33653648/117057390-62371080-aceb-11eb-9902-9489a054f1a7.png)

![image](https://user-images.githubusercontent.com/33653648/117057436-6fec9600-aceb-11eb-8900-e9348b6e5750.png)


