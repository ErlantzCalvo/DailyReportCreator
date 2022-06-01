
import config from './config.json' assert {type: "json"}
import * as notionService from "./notion-api/notionService.js"
import * as cliProgress from "cli-progress"
import clipboard from 'clipboardy';

const args = process.argv.slice(2)

async function classifyTasks(tasks){
  console.log("Nº of tasks: " + tasks.results.length)

  var classifiedTasks = {}
  var progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.rect);
  
  let tasksContent = tasks.results.map(result => {
    return notionService.getTaskContent(result.id);
  })
  
  progressBar.start(tasks.results.length, 0, {
    clearOnComplete: true
  })
  let results = await Promise.all(tasksContent);
  for(let i in results) {
    progressBar.increment();

    let newTask = {};
    newTask[tasks.results[i].properties.Name.title[0].plain_text] = results[i];

    if(classifiedTasks.hasOwnProperty(tasks.results[i].properties.Status.select.name)) {
        classifiedTasks[tasks.results[i].properties.Status.select.name].push(newTask)
      } else {
        classifiedTasks[tasks.results[i].properties.Status.select.name] = [newTask]
      }
  }

  progressBar.stop()
  return classifiedTasks
}


function writeDailyReport(tasks){
  if(Object.keys(tasks).length===0) return "No tasks have been found"

  let report = config.Texts.BeginningOfMessage
  
  let tasksStatuses = Object.keys(config.TasksStatus);
  let taskNum=0;
  for(let status of tasksStatuses) {
    let statusText = config.TasksStatus[status]
    if (statusText in tasks && status !== 'PendingTasks')
    for(let i = 0; i < tasks[statusText].length; i++, taskNum++){
      let taskName = Object.keys(tasks[statusText][i])[0]
      report += `\n${taskNum+1}) ${taskName} --> ${config.Texts[status+'Status'] || ''}\n`
      for(let subtask of tasks[statusText][i][taskName]){
        report += `      - ${Object.keys(subtask)[0]} --> ${(subtask[Object.keys(subtask)[0]])? `${config.Texts.FinishedTasksStatus}\n`: `${config.Texts.DoingTasksStatus}\n`}` 
      }
    }
  }


  //finally, write the pending tasks
  if(config.TasksStatus.PendingTasks in tasks){
    report += config.Texts.PendingTasksBeginning
    for(let i = 0; i < (tasks[config.TasksStatus.PendingTasks].length); i++){
      let taskName = Object.keys(tasks[config.TasksStatus.PendingTasks][i])[0]
      report += `- ${taskName}\n` 
      for(let subtask of tasks[config.TasksStatus.PendingTasks][i][taskName]){
        if(!Object.values(subtask)[0])
          report += `      ${Object.keys(subtask)[0]}\n`
      }
    }
  }

  report += config.Texts.Farewell

  return report
}

async function createDailyReport() {
  // We get all the tasks (i.e. ToDo, Doing and Done)
  var tasks = await notionService.getTasks()

  // we separate them by their status
  let classifiedTasks = await classifyTasks(tasks)

  let report = writeDailyReport(classifiedTasks)
  if(args.includes('-c') || args.includes('--to-clipboard'))
    clipboard.writeSync(report)
  console.log(report)
  
}

if(args.includes("-h") || args.includes("--help")){
  console.log("Usage: node index.js <options>\n")
  console.log("Options:\n")
  console.log("-c: Copy the resulting report to your clipboard.\n")
  console.log("-h: Show help.\n")
  console.log("--help: Show help.\n")
  console.log("--to-clipboard: Copy the resulting report to your clipboard.\n")
  process.exit(0)
}
createDailyReport()


