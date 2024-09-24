import { inter } from "@/utilities/fonts";
import "./globals.css";
import Header from "@/components/Header";
import Providers from "@/components/Providers";

export const metadata = {
	title: "Numer Calculator",
	description: "Numerical Methods",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${inter.className} antialiased bg-[#F7F7F7]`}>
				<Providers>
					<Header></Header>
					{children}
				</Providers>
			</body>
		</html>
	);
}
