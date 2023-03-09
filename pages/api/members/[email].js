const { Client } = require("@notionhq/client");

export default async function handler(req, res) {
  const notion1 = new Client({ auth: process.env.NOTION_SECRET_KEY });
  const userEmail = req.query["email"];

  try {
    const response = await notion1.users.list();
    const members = response.results;
    let result = false;
    members.map((d) => {
      if (d.person?.email === userEmail) {
        result = true;
      }
    });
    res.status(200).end(JSON.stringify(result));
  } catch (error) {
    console.error(error);
    res.status(400).end(JSON.stringify(error.message));
  }
}
