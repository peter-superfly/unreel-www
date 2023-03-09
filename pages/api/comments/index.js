import { save, getObject } from "@/lib/algolia";

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return await getComments();
    case 'POST':
      return await postComment(req.body);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getComments() {
    const comments = []
    return res.status(200).json(comments);
  }

  async function postComment(payload) {
    if(payload.comment && payload.blockId && payload.pageId) {
      const response = await save('comments', null, payload);
      return res.status(200).json(response);
    } else {
      return res.status(400).end(`Invalid payload!`)
    }
  }
}