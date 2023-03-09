import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_SECRET_KEY });

import { saveObject } from '../algolia';

const getChildren = async (block_id, page_size=50, start_cursor) => {
  try {
    let payload = { 
      page_size: page_size,
      block_id: block_id
    };
    if(start_cursor) { payload['start_cursor'] = start_cursor } 
    return await notion.blocks.children.list(payload);
  } catch (error) {
    console.log(error);
    return { results: [], has_more: false, next_cursor: null };
  }
}

const getAllChildren = async (block_id, type) => {
  try {
    let fetchNext = true;
    let start_cursor = '';
    let response = [];
    while (fetchNext) {
      const res = await getChildren(block_id, 5, start_cursor);
      response = [...response, ...res.results];
      fetchNext = res.has_more
      start_cursor = res.next_cursor
    }
    if(type) {
      response = response.filter(r => r.type === type);
    }
    return response;
  } catch (error) {
    console.log(error);
    return [];
  }
}

const mapAllChild = async (pages) => {
  try {
    for(let i = 0; i < pages.length; i++ ) {
      if(pages[i].has_children) {
        pages[i]['children'] = await getAllChildren(pages[i].id, 'child_page')
        await mapAllChild(pages[i]['children'])
      }
    }
    return pages;
  } catch (error) {
    console.log(error);
    return [];
  }
}

const mapMenuData = (items, path) => {
  return items.map(item => {
    const title = item?.child_page?.title.split(" ").join('-').replace("/", "-");
    const id = item.id.replace(/-/g, "");
    item = Object.assign({}, {
      id: id,
      name: item?.child_page?.title || '',
      link: `/${path}/${title}-${id}`,
      public: true,
      children: item.children
    })
    if (item.children) {
      item.children = mapMenuData(item.children, path)
    }
    return item
  })
}

const getChildPages = async (block_id, path) => {
  const pages = await getAllChildren(block_id, 'child_page')
  const response = await mapAllChild(pages);
  const result = mapMenuData(response, path);
  return result;
}

export {
  getAllChildren,
  getChildren,
  getChildPages
}