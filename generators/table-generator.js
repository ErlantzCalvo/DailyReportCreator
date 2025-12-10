import config from '../config.json' with {type: "json"}
import {readFileSync, writeFileSync} from "node:fs";

function createDailyReportTable(tasks) {
  if(Object.keys(tasks).length===0) return "No tasks have been found"

  const headers = ['Componente', 'Tarea', 'Estado', 'Prioridad'];
  let table = "<table>\n<thead>\n<tr>\n";
  for (const header of headers) {
    table += `<th>${header}</th>\n`;
  }
  table += "</tr>\n</thead>\n<tbody>\n";
  
  let tasksStatuses = Object.keys(config.TasksStatus);
  for(let status of tasksStatuses) {
    let statusText = config.TasksStatus[status]
      for(let i = 0; i < tasks[statusText].length; i++){
        let task = tasks[statusText][i]
        let row = `<tr><td>${task.project}</td>`;
        row += `<td>${task.name}${getSubtasksHTML(task.subTasks)}</td>`;
        row += `<td>${config.Texts[status+'Status'] || ''}</td>`;
        row += `<td>${config.PriorityLevels[task.priority] || ''}</td></tr>\n`;
        table += row;
    }
  }

  table += "</tbody>\n</table>";

  return table;
}

function getSubtasksHTML(subTasks) {
    if(subTasks.length === 0) return "";
    let subtasksHTML = "<ul>\n";
    for(let subtask of subTasks){
        let status = Object.values(subtask)[0] ? "✅" : "";
        subtasksHTML += `<li>${Object.keys(subtask)[0]} ${status}</li>\n`;
    }
    subtasksHTML += "</ul>\n";
    return subtasksHTML;
}

export function writeDailyReportTableInHTML(tasks) {
    const PATH_OUTPUT = './output/dailyReport.html';
    const tableHTML = createDailyReportTable(tasks);
    let htmlTemplate = readFileSync('views/table-report.html', 'utf-8');
    htmlTemplate = htmlTemplate.replace('{{DAILY_REPORT_TABLE}}', tableHTML);
    writeFileSync(PATH_OUTPUT, htmlTemplate);
    return PATH_OUTPUT;
}