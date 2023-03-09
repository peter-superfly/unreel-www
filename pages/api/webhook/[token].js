import { getObjects, saveObject } from "@/lib/algolia";
import { getTimeDifference } from "@/lib/utils";
import { NotionCompatAPI } from "notion-compat";

const { Client } = require("@notionhq/client");
const notion = new NotionCompatAPI(
  new Client({ auth: process.env.NOTION_SECRET_KEY })
);

export default async function handler(req, res) {
  const { token } = req.query;
  try {
    if (token !== process.env.WEBHOOK_TOKEN) {
      res.status(401).end(JSON.stringify({ message: "Unauthorized" }));
    } else {
      const algoliaObject = await getObjects("pages");
      const pages = algoliaObject.hits;
      const ids = [];
      for (let i = 0; i < pages.length; i++) {
        // const timeDiff = getTimeDifference(pages[i].updatedAt);
        // if (timeDiff?.minutes > 50) {
        // }
        const notionObject = await notion.getPage(pages[i].objectID);
        ids.push({
          block_id: pages[i].objectID
        })
        await saveObject("pages", pages[i].objectID, notionObject);
      }
  
      res.status(200).end(JSON.stringify({ message: "Success", data: ids }));
    }
  } catch (error) {
    res.status(400).end(JSON.stringify({ message: "Failed!" }));
  }
}
