import { cancel, isCancel, select } from "@clack/prompts";
import pc from "picocolors";
import { DEFAULT_CONFIG } from "../constants";
import type { AuthProvider, Backend } from "../types";

export async function getAuthChoice(
	auth: AuthProvider | undefined,
	hasDatabase: boolean,
	backend?: Backend,
): Promise<AuthProvider> {
	if (!hasDatabase && backend !== "convex") return "none";

	if (auth !== undefined) return auth;

	const options =
		backend === "convex"
			? [
					{
						value: "convex-auth",
						label: "Convex Auth",
						hint: "Built-in Convex authentication",
					},
					{
						value: "clerk",
						label: "Clerk",
						hint: "Clerk + Convex integration",
					},
					{ value: "none", label: "None", hint: "No authentication" },
				]
			: [
					{
						value: "better-auth",
						label: "Better Auth",
						hint: "Modern authentication with built-in providers",
					},
					{
						value: "clerk",
						label: "Clerk",
						hint: "Complete user management solution",
					},
					{ value: "none", label: "None", hint: "No authentication" },
				];

	const response = await select({
		message: "Choose an authentication provider:",
		options,
		initialValue: backend === "convex" ? "convex-auth" : DEFAULT_CONFIG.auth,
	});

	if (isCancel(response)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	return response as AuthProvider;
}
