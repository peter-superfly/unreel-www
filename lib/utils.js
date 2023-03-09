import { getLS } from "./ls";
import _ from "lodash";

export function get_site_info({ host }) {
  let isSSR = typeof window === "undefined";
  let hostname = isSSR ? host : window.location.hostname;
  let is_dropshop_domain = hostname.match(/seller.dropshop.(cc|dev)/g);
  let is_seller = false;

  if (!isSSR) {
    is_seller =
      is_dropshop_domain || window.location.origin === "http://localhost:3000";
  }

  return { isSSR, is_seller };
}

export function get_page_title(blocks) {
  const response = { title: "", page_icon: "🎯", id: "" };
  try {
    let { block } = blocks;
    let block_values = _.map(block, (elem, idx) => elem["value"]);
    let title = _.find(block_values, { type: "page", parent_table: "space" });
    response.title = title?.properties?.title[0][0] || "";
    response.page_icon = title?.format?.page_icon || "🎯";
    response.id = title?.id || "";
    return response;
  } catch (error) {
    console.log("Page title error", error);
    return response;
  }
}

export function getTimeDifference(pastTime) {
  try {
    if (!pastTime) pastTime = Date.now();
    const currentTime = Date.now();
    const milliseconds = currentTime - pastTime;
    const seconds = Math.round(milliseconds / 1000);
    const minutes = Math.round(seconds / 60);
    const hour = Math.round(minutes / 60);

    return {
      milliseconds: milliseconds,
      seconds: seconds,
      minutes: minutes,
      hour: hour,
    };
  } catch (error) {
    return {};
  }
}

export const getDocType = (page) => {
  let type = "";
  try {
    const docs = {
      "51e15122-d889-4a7e-8cfa-91488957649a": "docs",
      "8ef7f461-1e4a-4b76-9812-167833aa83bd": "wiki",
    };

    let pageId = page.raw.page.id;
    let hasParent = true;

    while (hasParent) {
      const block = page.block[pageId];
      pageId = block?.value?.parent_id;
      if (!pageId) {
        type = docs[block?.value?.id];
        hasParent = false;
      }
    }
  } catch (error) {
    console.log(error);
  }
  return type;
};

export const getBlockid = (id) => {
  let block_id = id;
  let blockid_array = block_id.split("-");
  let new_block = blockid_array.slice(-1);
  let blockIDData = new_block[0].split("");
  blockIDData.splice(8, 0, "-");
  blockIDData.splice(13, 0, "-");
  blockIDData.splice(18, 0, "-");
  blockIDData.splice(23, 0, "-");
  block_id = blockIDData.join("");

  return block_id;
};
