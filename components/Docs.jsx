import React from "react";
import NotionBody from "@/components/Notion/NotionUser";
import Head from "next/head";
import _ from "lodash";
import { get_page_title } from "@/lib/utils";
import { useRouter } from "next/router";

function Docs(props) {
  const { pages, is_comments_enabled } = props;
  const router = useRouter();
  let { block_id } = router.query;
  let new_block_id;
  if (block_id) {
    let blockid_array = block_id.split("-");
    new_block_id = blockid_array.slice(-1).join("");
  }

  let titles = _.map(pages, (p, i) => {
    return get_page_title(p);
  });

  function extractTitle(child) {
    for (let i = 0; i < Object.keys(child).length; i++) {
      if (child[i].id == new_block_id) {
        return child[i].name;
      }

      if (Object.keys(child[i].children).length > 0) {
        const temp = extractTitle(child[i].children);
        if (temp) {
          return temp;
        }
      }
    }
  }

  let title;
  if(props.menu){
    title = extractTitle(props.menu);
  }
  

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="">
        <NotionBody pages={pages} />
      </div>
    </>
  );
}

export default Docs;
