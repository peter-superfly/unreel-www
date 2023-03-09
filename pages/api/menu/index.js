import { getChildPages } from "@/lib/notion";
import memCache from 'memory-cache';
import { saveMenu, getObject } from "@/lib/algolia";

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      const ids = '';
      return await getMenu(ids);
    case 'PUT':
      const { id, path } = req.body;
      return await updateMenu(id, path);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function getMenu(id, path) {
    const response  = await getObject('menus', id);
    return res.status(200).json(response);
  }

  async function updateMenu(id, path) {
    const response  = await getChildPages(id, path);
    await saveMenu('menus', id, response);
    memCache.del(id);
    return res.status(200).json(response);
  }

}