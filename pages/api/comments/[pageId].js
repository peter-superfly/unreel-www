import { getFilterdObjects } from "@/lib/algolia";

export default async function handler(req, res) {
  if(req.method === 'GET') {
    const { pageId } = req.query;
    const response  = await getFilterdObjects('comments', 'pageId', pageId);
    
    return res.status(200).json(response);
  } else {
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}