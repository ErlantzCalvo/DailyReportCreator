
import config from './config.json' assert {type: "json"}
import * as notionService from "./notion-api/notionService.js"
import * as cliProgress from "cli-progress"
import clipboard from 'clipboardy';

const args = process.argv.slice(2)

async function classifyTasks(tasks){
  console.log("Nº of tasks: " + tasks.results.length)
  var classifiedTasks = {}
  var bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.rect);
  bar1.start(tasks.results.length, 0, {
    clearOnComplete: true
  })
  await Promise.all(tasks.results.map(async(result) => {
    await notionService.getTaskContent(result.id).then(taskContent =>{
      bar1.increment()
      let newTask = {}
      newTask[result.properties.Name.title[0].plain_text] = taskContent
  
      if(classifiedTasks.hasOwnProperty(result.properties.Status.select.name)){
        classifiedTasks[result.properties.Status.select.name].push(newTask)
      }else{
        classifiedTasks[result.properties.Status.select.name] = [newTask]
      }

    })
  }))
  bar1.stop()
  return classifiedTasks
}


function writeDailyReport(tasks){
  if(Object.keys(tasks).length===0) return "No tasks have been found"

  let report = config.Texts.BeginningOfMessage
  
  // First write the finished tasks
  let i = 0
  if (config.FinishedTasks in tasks)
    for(; i < tasks[config.FinishedTasks].length; i++){
      let taskName = Object.keys(tasks[config.FinishedTasks][i])[0]
      report += `\n${i+1}) ${taskName} --> ${config.Texts.CurrentStatusFinished}\n`
      for(let subtask of tasks[config.FinishedTasks][i][taskName]){
        report += `\t- ${Object.keys(subtask)[0]} --> ${(subtask[Object.keys(subtask)[0]])? `${config.Texts.CurrentStatusFinished}\n`: `${config.Texts.CurrentStatusDoing}\n`}` 
      }
    }

    // Second, write the Currently active tasks
  if(config.DoingTasks in tasks)
    for(let j=0; j < (tasks[config.DoingTasks].length ); j++){
      let taskName = Object.keys(tasks[config.DoingTasks][j])[0]
      report += `\n${i+j+1}) ${taskName} --> ${config.Texts.CurrentStatusDoing}\n`
      for(let subtask of tasks[config.DoingTasks][j][taskName]){
        report += `\t- ${Object.keys(subtask)[0]} --> ${(subtask[Object.keys(subtask)[0]])? `${config.Texts.CurrentStatusFinished}\n`: `${config.Texts.CurrentStatusDoing}\n`}` 
      }
    }

    // finally, write the pending tasks
  if(config.PendingTasks in tasks){
    report += config.Texts.PendingTasksBeginning
    for(let i = 0; i < (tasks[config.PendingTasks].length); i++){
      let taskName = Object.keys(tasks[config.PendingTasks][i])[0]
      report += `- ${taskName}\n` 
      for(let subtask of tasks[config.PendingTasks][i][taskName]){
        report += `\t${Object.keys(subtask)[0]}\n`
      }
    }
  }

  return report
}

async function createDailyReport() {
  // We get all the tasks (ToDo, Doing and Done)
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


