"use client";
import {
	startRegistration,
	startAuthentication,
} from "@simplewebauthn/browser";
import { signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "~/@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/@/components/ui/card";
import SuperJSON from "superjson";
import { Input } from "~/@/components/ui/input";
import { Label } from "~/@/components/ui/label";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "~/@/components/ui/tabs";
import { trpc } from "~/utils/apiApp";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

export type EmailFieldProps = {
	email: string;
	setEmail: (email: string) => void;
};
const EmailField = ({ email, setEmail }: EmailFieldProps) => (
	<div className="space-y-1">
		<Label htmlFor="email">Email</Label>
		<Input
			id="email"
			type="email"
			value={email}
			onChange={(e) => setEmail(e.target.value)}
		/>
	</div>
);

export const SignOutButton = () => (
	<Button onClick={() => void signOut()}>Sign Out</Button>
);

const WebuthnLogin = () => {
	const [email, setEmail] = useState("");
	const [isAwaitingWebauthn, setIsAwaitingWebauthn] = useState(false);
	const { mutate, error, isLoading } =
		trpc.webauthn.generateRegistrationOptions.useMutation({
			onSuccess: async ({ operation, options }) => {
				const registrationPromise =
					operation === "registration"
						? startRegistration(options)
						: startAuthentication(options);

				setIsAwaitingWebauthn(true);
				const result = await registrationPromise;
				await signIn("webauthn", {
					email,
					payload: SuperJSON.stringify(result),
				});
				setIsAwaitingWebauthn(false);
			},
		});
	const errorDisplay = error && (
		<div className="text-red-500">{error.message}</div>
	);
	return (
		<>
			<Tabs defaultValue="register" className="min-w-[30%]">
				<TabsList className="grid  w-full grid-cols-2">
					<TabsTrigger value="signin">Sign In</TabsTrigger>
					<TabsTrigger value="register">Register</TabsTrigger>
				</TabsList>
				<TabsContent value="register">
					<Card>
						<CardHeader>
							<CardTitle>Register</CardTitle>
							<CardDescription>
								Register with a passkey or a FIDO2 Security Key
								{errorDisplay}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2">
							<EmailField email={email} setEmail={setEmail} />
							<Button
								disabled={isLoading}
								onClick={() => mutate({ email, operation: "registration" })}>
								Register
							</Button>
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="signin">
					<Card>
						<CardHeader>
							<CardTitle>Sign In</CardTitle>
							<CardDescription>
								Sign In with a passkey or a FIDO2 Security Key
							</CardDescription>
							{errorDisplay}
						</CardHeader>
						<CardContent className="space-y-2">
							<EmailField email={email} setEmail={setEmail} />
							<Button
								disabled={isLoading}
								onClick={() => mutate({ email, operation: "login" })}>
								Sign In
							</Button>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
			<Dialog open={isLoading}>
				<DialogContent>
					<DialogHeader>
						{isAwaitingWebauthn ? (
							<>
								<DialogTitle>
									Follow the Instructions on your device
								</DialogTitle>
								<DialogDescription>
									You will be prompted to authenticate with your device
								</DialogDescription>
							</>
						) : (
							<>
								<DialogTitle>Loading</DialogTitle>
								<DialogDescription>
									Getting ready to authenticate you...
								</DialogDescription>
							</>
						)}
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default WebuthnLogin;
