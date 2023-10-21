import "~/styles/globals.css";
import { Providers } from "~/utils/provider";
export const metadata = {
	title: "Webauthn Demo",
	description: "Webauthn Demo",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className="dark">
			<body className="min-h-screen">
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
