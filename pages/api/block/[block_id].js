import _ from "lodash";
import { getObject, saveObject } from "@/lib/algolia";
import { NotionCompatAPI } from "notion-compat";

const { Client } = require("@notionhq/client");
const notion = new NotionCompatAPI(
  new Client({ auth: process.env.NOTION_SECRET_KEY })
);

export default async function handler(req, res) {
  let { block_id } = req.query;
  let response = {};

  if (block_id === "favicon.png") {
    res.status(404).json({ message: "Data not found!" });
  }

  async function fetchPage(block_id, action) {
    try {
      let recordMap = {};
      const algoliaObject = await getObject("pages", block_id);
      if (!algoliaObject || action === "update") {
        const notionObject = await notion.getPage(block_id);
        recordMap = notionObject;
        if (!algoliaObject) {
          console.log("Saving data to algolia!.........");
          await saveObject("pages", block_id, recordMap);
        } else {
          await saveObject("pages", block_id, recordMap);
          delete algoliaObject.objectID;
          delete algoliaObject.updatedAt;
          delete algoliaObject.type;
          if (!_.isEqual(notionObject, algoliaObject)) {
            // To Do = Create New Version with previous data "algoliaObject"
          }
        }
      } else {
        recordMap = algoliaObject;
      }
      return recordMap;
    } catch (error) {
      console.error(error);
      return recordMap;
    }
  }

  if (req.method === "GET") {
    response = await fetchPage(block_id, "get");
  }

  if (req.method === "PUT") {
    response = await fetchPage(block_id, "update");
  }
  res.status(200).json(response);
}