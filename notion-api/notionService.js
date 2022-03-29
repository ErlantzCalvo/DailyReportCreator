import { Client } from "@notionhq/client"
import dotenv from "dotenv"
dotenv.config()

const notion = new Client({ auth: process.env.NOTION_API_KEY })

export async function getTasks() {
    let databaseId = process.env.NOTION_PAGE_ID
    var response = notion.databases.query({ database_id: databaseId }).then(response =>{
      return response
    }).catch(error => {
      console.error("Error: " + error)
      process.exit(1)
    })
    return response
  }

export async function getTaskContent(taskId) {
    const response = await notion.blocks.children.list({ block_id: taskId });
    let tasks = []
    for(let i= 0; i< response.results.length; i++){
      // if the object is an item of todo list
      if(response.results[i].type ==="to_do"){
        let newObj = {}
        newObj[response.results[i].to_do.rich_text[0].plain_text] = response.results[i].to_do.checked
        tasks.push(newObj)
      }
    }
    return tasks
  }
