
import * as notionService from "./notion-api/notionService.js"
import clipboard from 'clipboardy';
import { writeDailyReportTableInHTML } from "./generators/table-generator.js";
import classifyTasks from "./classifiers/task-classifier.js";
import writeDailyReport from "./generators/plain-text-generator.js";
import htmlOpener from "./utils/html-opener.js";

const args = process.argv.slice(2)

function producePlainTextReport(tasks, copyToClipboard = false) {
  let report = writeDailyReport(tasks)
  if (copyToClipboard) clipboard.writeSync(report)
  return report
}

function produceHTMLReport(tasks) {
  let htmlPath = writeDailyReportTableInHTML(tasks)
  htmlOpener(htmlPath)
  return htmlPath
}

async function createDailyReport() {
  // We get all the tasks (i.e. ToDo, Doing and Done)
  var tasks = await notionService.getTasks()
  // we separate them by their status
  let classifiedTasks = await classifyTasks(tasks)

  let report = null;
  if(args.includes('--table')){
    produceHTMLReport(classifiedTasks)
    report = "The daily report table has been generated and opened in your default browser."
  } else {
    report = producePlainTextReport(classifiedTasks, args.includes('-c') || args.includes('--to-clipboard'))
  }
  
  console.log(report)
}

if(args.includes("-h") || args.includes("--help")){
  console.log("Usage: node index.js <options>\n")
  console.log("Options:\n")
  console.log("-c: Copy the resulting report to your clipboard.\n")
  console.log("-h: Show help.\n")
  console.log("--help: Show help.\n")
  console.log("--to-clipboard: Copy the resulting report to your clipboard.\n")
  console.log("--table: Creates an HTML table report.\n")
  process.exit(0)
}

createDailyReport()
