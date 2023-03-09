import React, { useCallback, useContext } from "react";
import Link from "next/link";
import Tree, { useTreeState } from "react-hyper-tree";
import { PrivateLayoutContext } from "../Layout/Private/context";
import Loader from "@/components/Common/Loader";

let data = {}

const LinkTree = (props) => {
  const privateLayoutContext = useContext( PrivateLayoutContext );

  if(props?.menu) {
    data = props?.menu;
  } else {
   return <Loader />
  }

  const renderNode = useCallback(
    ({ node }) => (
      <Link href={`${node.data.link}`}>
        <a>
          <div className="tree-node" key={node.data.title}>
            <div className="titles">
              <div className="node-title" onClick={() => privateLayoutContext.setShowLeftMenu(false)}>{node.data.name}</div>
              {node.data.title && (
                <div className="node-subtitle">{node.data.title}</div>
              )}
            </div>
          </div>
        </a>
      </Link>
    ),
    []
  );

  const { required, handlers } = useTreeState({
    data,
    id: "your_tree_id",
    defaultOpened: true,
  });

  return <Tree {...required} {...handlers} renderNode={renderNode} />;
};

export default  LinkTree;