import { Fragment, useState } from "react";
import Image from "next/image";
import Link from 'next/link'
import { Menu } from "@/components/Svg";
import { FaExternalLinkAlt } from "react-icons/fa";
import { AiOutlineGithub } from "react-icons/ai";
import { SiTwitter } from "react-icons/si";


const PublicHeader = () => {
	const [mobileMenu, setMobileMenu] = useState(false);
	return (
		<Fragment>
			<nav className="grid gap-2 grid-cols-3 px-4">
				<div className="public-logo-section">
					<Image src={'/logo.svg'} alt="Vertext logo" width={256} height={144}></Image>
				</div>
				<div className="hidden lg:flex items-center justify-end">
					<ul className="flex">
						<li className="cursor-pointer h-full flex items-center text-lg text-gry-800 mr-10 tracking-normal"><Link href="/wiki"><a>Wiki</a></Link></li>
					</ul>
				</div>
				<div></div>
				<div className="flex justify-end lg:hidden">
					<button onClick={() => setMobileMenu(!mobileMenu)}>
						<Menu />
					</button>
				</div>
			</nav>
			{
				mobileMenu && (
					<div className="app-side-menu p-4 h-full w-full shadow flex-col flex lg:hidden">
						<div>
							<div className="flex flex-col space-y-4">
								<Link href="/wiki"><a>Wiki</a></Link>
							</div>
						</div>
					</div>
				)
			}

		</Fragment>
	)
}


export default PublicHeader;