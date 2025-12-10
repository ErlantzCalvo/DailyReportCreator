import config from '../config.json' with {type: "json"}

export default function writeDailyReport(tasks){
  if(Object.keys(tasks).length===0) return "No tasks have been found"

  let report = config.Texts.BeginningOfMessage
  
  let tasksStatuses = Object.keys(config.TasksStatus);
  let taskNum=0;
  for(let status of tasksStatuses) {
    let statusText = config.TasksStatus[status]
    if (statusText in tasks && status !== 'PendingTasks')
    for(let i = 0; i < tasks[statusText].length; i++, taskNum++){
      let task = tasks[statusText][i]
      report += `\n${taskNum+1}) ${task.name} →  ${config.Texts[status+'Status'] || ''}\n`
      for(let subtask of task.subTasks){
        report += `      - ${Object.keys(subtask)[0]} → ${(subtask[Object.keys(subtask)[0]])? `${config.Texts.FinishedTasksStatus}\n`: `${config.Texts.DoingTasksStatus}\n`}` 
      }
    }
  }

  //finally, write the pending tasks
  if(config.TasksStatus.PendingTasks in tasks){
    report += config.Texts.PendingTasksBeginning
    for(let i = 0; i < (tasks[config.TasksStatus.PendingTasks].length); i++){
      let task = tasks[config.TasksStatus.PendingTasks][i]
      report += `- ${task.name}\n` 
      for(let subtask of task.subTasks){
        if(!Object.values(subtask)[0])
          report += `      ${Object.keys(subtask)[0]}\n`
      }
    }
  }

  report += config.Texts.Farewell

  return report
}