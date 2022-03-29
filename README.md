# DailyReportCreator
Create daily reports automatically from your Notion task page. Project aimed to reduce the workload when making the daily work report.

# Example
Having the following Notion Scrum-like ToDo page
![Notion To do page](https://github.com/ErlantzCalvo/DailyReportCreator/blob/main/media/notion_example.png?raw=true)

This project creates the following report:

<img src="https://github.com/ErlantzCalvo/DailyReportCreator/blob/main/media/output_example.png?raw=true" alt="Generated report" width="800"/>

# Installation
Clone the repo:<br>
`git clone https://github.com/ErlantzCalvo/DailyReportCreator`

Place in the folder: <br>
`cd DailyReportCreator`

Install the dependencies:<br>
`npm install`

# Setup
In order to run the project, you must have a Notion [API key.](https://www.notion.so/my-integrations) If you don't know how to create the mentioned key, take a look at their [well explained documentation](https://developers.notion.com/docs/getting-started).

Once you have the API key, add it to the `.env` file located in the project's root folder, replacing the field *<API_KEY>* by your key. The next step is to get the ID of the page you want to track/be reported. It is also explained in the documentiation but, in short, if you are using Notion in the browser, the page ID is the string located between <workpace name>/<Page ID>?v=...:

```
  https://www.notion.so/myworkspace/a8aec43384f447ed84390e8e42c2e089?v=...
                                    |--------- Database ID ---------|
```
If you are using the Notion desktop app, you can get the previous link in the top-right part of it, in the share button -> Copy link.
Once you have the ID of the page you want to track, place it in the `.env` file, replacing the _\<Page ID\>_ field. 
  
***Note:*** Remember to give your API key, at least, read acces of the page you want to track as shown in the [documentation](https://developers.notion.com/docs/getting-started#step-1-create-an-integration)
  
# Run 
If everything is correctly set up, you can the app running the following command:<br>
`npm start`
  
Or <br>
`node index.js [options]`
  
  
### Options
-c or --to-clipboard : Copy the resulting report to the clipboard. <br>
-h or --help : Display the available options.
