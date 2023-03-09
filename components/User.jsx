import React from "react";
import NotionBody from "@/components/Notion/NotionBody";
import Head from "next/head";

function Docs(props) {
  const { pages } = props;

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
