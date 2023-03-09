import React, { Fragment, useState, useContext} from "react";
import { useUser } from "@auth0/nextjs-auth0";
import LinkTree from "@/components/Common/LinkTree";
import { HiRefresh } from "react-icons/hi";
import { MdOutlineHelp, MdManageSearch, MdClose } from "react-icons/md";

import Loader from "@/components/Common/Loader";
import { PrivateLayoutContext } from "../../context";

import Image from "next/image";
import axios from "axios";
import Link from "next/link";

import { useRouter } from "next/router";

const LeftSideBar = (props) => {
  const { user } = useUser();
  const profile = user?.profile;
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const privateLayoutContext = useContext(PrivateLayoutContext)

  const updateMenu = () => {
    setLoading(true);
    let path = "docs";
    if (props.menu[0].link === "/wiki") path = "wiki";

    axios.put("/api/menu", { id: props.menu[0].id, path: path }).then((data) => {
      setLoading(false);
      router.push(`/${path}`);
    });
  };

  function handleSearchModel(status) {
    console.log(status)
    privateLayoutContext.setShowSearch(status);
    privateLayoutContext.setShowLeftMenu(false);
  }
 
  return (
    <Fragment>
      <div className="h-18 justify-center px-24 w-full items-center border-b lg:flex hidden">
        <Link href={"/"}>
          <a>
            <Image
              src={"/logo.svg"}
              alt="Vertex logo"
              width={256}
              height={144}
            ></Image>
          </a>
        </Link>
      </div>
          <div className="app-left-side-menu flex justify-start mt-4 w-full px-4">
            <div className="side-nav-search-btn-section">
              <button onClick={ () => handleSearchModel(true)} data-menu='search'> <MdManageSearch size={30} /> </button>
            </div>
            <LinkTree {...props} />
          </div>
          {profile?.role === "beta" && (
            <div className="flex mx-auto py-3 justify-between border-t">
              <button
                onClick={updateMenu}
                className="app-icon-btn inline-flex"
              >
                <HiRefresh size={25} />{" "}
                {loading ? (
                  <Loader />
                ) : (
                  <span className="ml-2">Refresh Menu</span>
                )}
              </button>
              <button className="ml-4">
                <MdOutlineHelp size={30} />
              </button>
            </div>
          )}

    </Fragment>
  );
};

export default LeftSideBar;
