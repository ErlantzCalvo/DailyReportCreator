import * as notionService from "../notion-api/notionService.js"
import * as cliProgress from "cli-progress";

export default async function classifyTasks(tasks){
  console.log("Nº of tasks: " + tasks.results.length)

  var classifiedTasks = {}
  var progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.rect);
  
  let tasksContent = tasks.results.map(result => {
    return notionService.getTaskContent(result.id);
  })
  
  progressBar.start(tasks.results.length, 0, {
    clearOnComplete: true
  })
  tasksContent = await Promise.all(tasksContent);
  for(let i in tasksContent) {
    progressBar.increment();

    const task = tasks.results[i];
    let newTask = {
        id: task.id,
        project: task.properties.Project.multi_select[0]?.name || 'Otro',
        name: task.properties.Name.title[0]?.plain_text,
        priority: task.properties.Priority.select?.name || 'Media',
        subTasks: tasksContent[i]
    };

    if(classifiedTasks.hasOwnProperty(tasks.results[i].properties.Status.select?.name)) {
        classifiedTasks[tasks.results[i].properties.Status.select?.name].push(newTask)
      } else {
        classifiedTasks[tasks.results[i].properties.Status.select?.name] = [newTask]
      }
  }

  progressBar.stop()
  return classifiedTasks
}
