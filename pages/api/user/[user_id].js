import { getObject } from "@/lib/algolia";

export default async function handler(req, res) {
  let { user_id } = req.query;
  let response = {};

  async function fetchPage(user_id, action) {
    console.log(user_id, action)
    try {
      return await getObject("pages", user_id);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  if (req.method === "GET") {
    response = await fetchPage(user_id, "get");
  } else {
    response = { error: "Method not allowed" };
  }
  res.status(200).json(response);
}