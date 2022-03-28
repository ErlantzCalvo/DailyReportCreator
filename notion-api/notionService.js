import { Client } from "@notionhq/client"
import dotenv from "dotenv"
dotenv.config()

const notion = new Client({ auth: process.env.NOTION_API_KEY })
const databaseId = process.env.NOTION_PAGE_ID

export async function getTasks() {
    return notion.databases.query({ database_id: databaseId })
  
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
