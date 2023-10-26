import { getAuth } from "~/utils/query";
import WebAuthnLogin, { SignOutButton } from "./WebauthnLogin";

export default async function IndexPage() {
	const auth = await getAuth();
	return (
		<main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
			<div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
				<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
					<span className="text-[hsl(280,100%,70%)]">Webauthn</span> Demo
				</h1>
				{auth === null && <WebAuthnLogin />}
				{auth && (
					<div>
						<h3>Welcome!</h3>
						<p>You are logged in as {auth.user.email}</p>
						<div className="mt-2 text-center">
							<SignOutButton />
						</div>
					</div>
				)}
			</div>
		</main>
	);
}
