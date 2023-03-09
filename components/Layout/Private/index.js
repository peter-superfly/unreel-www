import React, {
  Fragment,
  useState,
  useRef,
  useEffect,
  useContext,
} from "react";
import _ from "lodash";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0";
import { deleteCookie } from "cookies-next";
import RightSideBar from "./SideBar/Right";
import LeftSideBar from "./SideBar/Left";
import Image from "next/image";
import { Menu } from "@/components/Svg";

import { AiFillEdit } from "react-icons/ai";
import { HiRefresh } from "react-icons/hi";
import { MdClose } from "react-icons/md";
import { useRouter } from "next/router";
import { setCookie } from "cookies-next";

import AlgoliaSearch from "@/components/Search";

import { PrivateLayoutProvider } from "./context";

import { VertexModel } from "@/components/Shared/Model";
import { GlobalContext } from "@/lib/context/global";

import { getMember } from "@/lib/services/notionEditService";
import { appDocs, wikiPage } from "@/lib/constant";

const PrivateLayout = ({ children }) => {
  const { globalData, setGlobalData } = useContext(GlobalContext);
  const [showLeftMenu, setShowLeftMenu] = useState(false);
  const [showRightMenu, setShowRightMenu] = useState(false);
  const [menu, setManu] = useState([]);
  const [showMenu, setShowMenu] = useState(true);
  const [showSearch, setShowSearch] = useState(false);

  const boxRef = useRef();

  if (!_.isEqual(menu, children.props.menu)) {
    setManu(children.props.menu);
    setShowMenu(false);
  }

  useEffect(() => {
    setShowMenu(true);
  }, [menu]);

  deleteCookie("requestAction");
  const { user } = useUser();
  const profile = user?.profile;
  const router = useRouter();
  let { block_id } = router.query;
  if (!block_id) {
    if (router.asPath === "/docs") {
      block_id = appDocs.block_id;
    }
    if (router.asPath === "/wiki") {
      block_id = wikiPage.block_id;
    }
  }

  function handleAction() {
    setGlobalData({
      ...globalData,
      model: {
        show: false,
      },
    });
    window.open(globalData.model.payload.url, "_blank");
  }

  function editAction() {
    if (user?.profile) {
      getMember(`/api/members/${user?.email}`).then((member) => {
        let url = "",
          body = "";
        if (member) {
          url = `${process.env.NEXT_PUBLIC_NOTION_REDIRECT_BASE_URL}/${block_id}`;
          body = "You are being redirected to Vertex Notion WorkSpace";
        } else {
          url = `${process.env.NEXT_PUBLIC_NOTION_REDIRECT_URL}/${process.env.NEXT_PUBLIC_NOTION_REDIRECT_INVITE_TOKEN}`;
          body = "You are invited to Vertex notion Workspace";
        }
        setGlobalData({
          ...globalData,
          model: {
            show: true,
            btnCancel: "Cancel",
            btnSuccess: "Ok",
            body: body,
            payload: {
              url: url,
            },
          },
        });
      });
    } else {
      router.push("/api/auth/login");
    }
  }

  function refreshPage() {
    setCookie("requestAction", "refresh");
    window.location.reload();
  }

  function handleSearchModel(status) {
    setShowSearch(status);
    setShowLeftMenu(false);
  }

  const contexData = {
    setShowLeftMenu: setShowLeftMenu,
    setShowSearch: setShowSearch,
  };

  return (
    <PrivateLayoutProvider value={contexData}>
      <Fragment>
        <nav className="private-nav w-full px-6 items-center flex bg-white shadow lg:hidden border-b">
          <div className="w-full">
            <button
              onClick={() => setShowLeftMenu(!showLeftMenu)}
              data-menu="leftMenu"
            >
              <Menu />
            </button>
          </div>
          <div className="w-full">
            <Link href="/">
              <a>
                <Image src={"/logo.svg"} width={256} height={144} />
              </a>
            </Link>
          </div>
          <div className="w-full flex justify-end">
            <button
              onClick={() => setShowRightMenu(!showRightMenu)}
              data-menu="rightMenu"
            >
              <Menu />
            </button>
          </div>
        </nav>
        <div className="flex flex-no-wrap">
          <div className="app-left-sidebar absolute sm:relative shadow flex-col hidden lg:flex">
            {showMenu && <LeftSideBar menu={children.props.menu} />}
          </div>
          {showLeftMenu && (
            <div
              ref={boxRef}
              className="app-left-sidebar absolute shadow flex-col transition duration-150 ease-in-out"
            >
              <LeftSideBar menu={children.props.menu} />
            </div>
          )}

          <div
            className={`mx-auto ${
              showLeftMenu
                ? "app-main-container-menu-open"
                : "app-main-container"
            }`}
          >
            <div
              className="w-full h-full"
              onClick={() => {
                setShowLeftMenu(false);
              }}
            >
              {children}

              <div className="flex flex-col justify-end items-end floating-action-button">
                {profile?.role === "beta" && (
                  <button onClick={refreshPage}>
                    <HiRefresh size={30} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="app-right-sidebar absolute sm:relative shadow flex-col hidden lg:flex">
            <RightSideBar menu={children.props.menu} />
          </div>
          {showRightMenu && (
            <div className="app-right-sidebar absolute shadow flex-col   transition duration-150 ease-in-out">
              <RightSideBar menu={children.props.menu} />
            </div>
          )}
        </div>

        <div>
          {showSearch && (
            <div className="search-model justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-999">
              <div className="relative w-auto my-6 model-min-width">
                <div className="search border rounded-lg shadow-lg relative flex flex-col w-full bg-white">
                  <div className="flex items-start justify-end px-4 pt-3 border-b">
                    <p
                      className="m-0 pb-2"
                      onClick={() => {
                        handleSearchModel(false);
                      }}
                    >
                      {" "}
                      <MdClose size={30} />
                    </p>
                  </div>
                  <div className="relative p-5 flex-auto">
                    <AlgoliaSearch handleSearchModel={handleSearchModel} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <VertexModel handleAction={handleAction} />
      </Fragment>
    </PrivateLayoutProvider>
  );
};

export default PrivateLayout;
