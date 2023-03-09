import algoliasearch from "algoliasearch";
import memCache from 'memory-cache';
import { appDocs, wikiPage } from "@/lib/constant";

import { getDocType } from "../utils";

const appId = process.env.ALGOLIA_APP_ID;
const serverApiKey = process.env.ALGOLIA_SERVER_API_KEY;
const clientApiKey = process.env.ALGOLIA_CLIENT_API_KEY;

export const algoliaServer = algoliasearch(appId, serverApiKey);
export const algoliaClient = algoliasearch(appId, clientApiKey);

export const saveObject = async (index, id, data) => {
  try {
    const type = getDocType(data);
    if(type) {
      const serverIndex = algoliaServer.initIndex(index);
      const result = await serverIndex.saveObject({
        ...data,
        objectID: id,
        updatedAt: Date.now(),
        type: type
      });
      return result;
    }
  } catch (error) {
    console.log("Algolia Error: saveObject", error);
    return null;
  }
};

export const saveMenu = async (index, id, data) => {
  try {
    const serverIndex = algoliaServer.initIndex(index);
    const result = await serverIndex.saveObject({
      ...data,
      objectID: id,
      updatedAt: Date.now()
    });
    return result;
  } catch (error) {
    console.log("Algolia Error: saveObject", error);
    return null;
  }
};

export const save = async (index, id, data) => {
  try {
    const serverIndex = algoliaServer.initIndex(index);
    if(id) {
      data['objectID'] = id
    }
    const result = await serverIndex.saveObject({
      ...data,
      updatedAt: Date.now()
    }, {autoGenerateObjectIDIfNotExist: true});
    return result;
  } catch (error) {
    console.log("Algolia Error: save", error);
    return null;
  }
};

export const getObject = async (index, id) => {
  try {
    const clientIndex = algoliaClient.initIndex(index);
    const result = await clientIndex.getObject(id);
    return result;
  } catch (error) {
    console.log("Algolia Error: getObject", error);
    return null;
  }
};

export const getFilterdObjects = async (index, key, value) => {
  try {
    const clientIndex = algoliaClient.initIndex(index);
    const result = await clientIndex.search('', { filters: `${key}:${value}`});
    return result.hits;
  } catch (error) {
    console.log(error)
  }
 
}

export const getObjects = async (index) => {
  try {
    const clientIndex = algoliaClient.initIndex(index);
    const result = await clientIndex.search();
    return result;
  } catch (error) {
    console.log("Algolia Error: getObjects", error);
    return null;
  }
};

export const getNavMenu = async (pageName) => {
  const wikiBaseMenu = {...wikiPage.baseManu, children: [] };
  const VertexBaseMenu = {...appDocs.baseManu, children: []}
  const pages = { appDocs: appDocs, wikiPage: wikiPage }
  const rootId = pages[pageName].baseManu.id
  let menu = memCache.get(rootId);
  if(menu) {
    return menu;
  } else {
    let newMenu = await getObject('menus', rootId);
    if(newMenu) {
      delete newMenu.objectID;
      const newMenuData = Object.values(newMenu);
      pages[pageName].baseManu.children = newMenuData;
      let updatedMenu = null;
      if(pageName === 'appDocs') {
        updatedMenu = [pages[pageName].baseManu, wikiBaseMenu];
      }
      if(pageName === 'wikiPage') {
        updatedMenu = [pages[pageName].baseManu, VertexBaseMenu];
      }
      memCache.put(rootId, updatedMenu);
      return updatedMenu;
    } else {
      return pages[pageName].baseManu;
    }
  }
}
