import React, { Fragment } from "react";
import Docs from "@/components/Docs";
import { state_while_reval, maxage } from '@/lib/constant';
import { fetchData } from "@/lib/request";


const IndexPage = (props) => {
  if (props?.pages) {
    return <Docs className={"theme-verde"} {...props} />;
  }
  else {
    return <Fragment></Fragment>
  }
};

export async function getServerSideProps({ req, res, query }) {

  const requestAction = req.cookies?.requestAction

  res.setHeader(
    "Cache-Control",
    `public, s-maxage=${maxage}, stale-while-revalidate=${state_while_reval}`
  );

  let { block_id } = query;

  if (block_id === "favicon.svg") {
    return { props: {} };
  } else {

    const blockIdArray = block_id.split('-');
    block_id = blockIdArray[blockIdArray.length - 1];
   
    const option = {
      method: requestAction ? 'PUT' : 'GET'
    }

    const pages = await fetchData(req, 'api/block', block_id, option)
  
    if (!pages) {
      return {
        notFound: true,
      };
    }
  
    return {
      props: { pages },
    };
  }
}

IndexPage.layout = 'Private';

export default IndexPage;
