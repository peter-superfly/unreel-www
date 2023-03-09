import { Fragment, useState } from "react";
import { setCookie, deleteCookie } from 'cookies-next';
import { AiFillEdit } from "react-icons/ai";
import { HiRefresh } from "react-icons/hi";
import { MdLogin } from "react-icons/md"
import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import Link from "next/link";

const RightSideBar = (props) => {

  const router = useRouter();
  const { user, error, isLoading } = useUser();
  const profile = user?.profile;

  const { block_id } = router.query;
  const [showProfile, setShowProfile] = useState(false);

  return (
    <Fragment>
      <div className="flex h-16 justify-end border-b px-0 md:px-2">
          <div className="flex items-center p-2">
            <p className="uppercase m-0 text-xl font-bold">
              {user?.nickname}
            </p>
          </div>
          <div className="flex items-center p-2">
            <div aria-haspopup="true" className="cursor-pointer w-full flex items-center justify-end relative">
              {showProfile ? (
                <ul className="px-4 border-r bg-black absolute rounded z-40 right-0 shadow mt-40 ">
                  <li className="p-2 cursor-pointer text-white text-sm flex items-center focus:outline-none">
                    <span>
                      <Link href="/api/auth/logout">
                        <a>Logout</a>
                      </Link>
                    </span>
                  </li>
                </ul>
              ) : (
                ""
              )}
              {!user ? (
                <Link href="/api/auth/login">
                  <a className="flex justify-center font-bold">Login <MdLogin size={25} /></a>
                </Link>
              ) : (
                <img
                  className="user-image h-10 w-10 object-cover"
                  src={user?.picture} alt="User"
                  onClick={() => setShowProfile(!showProfile)}
                />
              )}

            </div>
          </div>
        <div className="comment-section">
          {/* Todo comment section */}
        </div>
      </div>
    </Fragment>
  )
}

export default RightSideBar;