"use client";

import { MouseEvent, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { GiHamburgerMenu } from "react-icons/gi";
import { RiCloseLargeLine } from "react-icons/ri";
import { FaAngleDown } from "react-icons/fa6";
import { montserrat } from "@/utilities/fonts";
import { usePathname } from "next/navigation";
import Link from "next/link";
import methods from "@/data/methods";

export default function Header() {
	const [showNav, setShowNav] = useState<boolean>(false);
	const [showSections, setShowSections] = useState<{ [key: string]: boolean }>(
		{}
	);

	const toggleNav = () => {
		setShowNav((prev) => !prev);
	};

	const pathname = usePathname();

	const toggleSections = (e: MouseEvent<HTMLHeadElement>, title: string) => {
		setShowSections((prev) => {
			console.log(prev);
			return {
				...prev,
				[title]: prev[title] === undefined ? true : !prev[title],
			};
		});
	};
	return (
		<header className="flex p-5 justify-center items-center bg-white ">
			<div className="flex item">
				<GiHamburgerMenu onClick={toggleNav} color="#C65D21" size="32px" />

				<nav
					id="nav"
					className={`fixed z-50 top-0 left-0 h-full bg-white pt-5 w-full overflow-y-scroll  lg:w-4/12 2xl:w-2/12 ${
						showNav ? "" : "hidden"
					}`}
				>
					<RiCloseLargeLine
						size="32px"
						className="ml-5 select-none"
						color="#141312"
						onClick={toggleNav}
					></RiCloseLargeLine>
					<ul className="mt-5">
						{methods.map((e) => (
							<li key={e.title}>
								<div
									onClick={(event) => toggleSections(event, e.title)}
									className="px-5 py-2 flex justify-between items-center hover:bg-[#F0F4F8] cursor-default"
								>
									<h2 className="text-2xl font-bold  text-[#C65D21]">
										{e.title.toUpperCase()}
									</h2>
									<FaAngleDown
										size={"16px"}
										color="#515151"
										className={`${
											showSections[e.title] === undefined
												? "rotate-90"
												: showSections[e.title] === false
												? "rotate-90"
												: ""
										}`}
									></FaAngleDown>
								</div>
								<ul
									className={`flex flex-col text-[#334E68] transition ${
										showSections[e.title] === undefined
											? "hidden"
											: showSections[e.title] === false
											? "hidden"
											: ""
									}`}
								>
									{e.sublinks.map((a) => (
										<Link
											onClick={toggleNav}
											href={a.url}
											key={uuidv4()}
											className="pl-8 pr-5 py-2 hover:bg-[#F0F4F8] cursor-pointer"
										>
											{a.name.toUpperCase()}
										</Link>
									))}
								</ul>
							</li>
						))}
					</ul>
				</nav>
			</div>

			<div
				className={`flex-grow grid place-content-center text-2xl font-bold ${montserrat.className} `}
			>
				<h1 className="relative content w-fit after:content-[''] after:w-full after:h-1 after:absolute after:bottom-0 after:left-0 after:bg-[#8C3D10]">
					{pathname}
				</h1>
			</div>
			<div className="w-8"></div>
		</header>
	);
}
