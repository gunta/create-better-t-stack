import path from "node:path";
import consola from "consola";
import fs from "fs-extra";
import pc from "picocolors";
import type { ProjectConfig } from "../../types";
import { addPackageDependency } from "../../utils/add-package-deps";

export async function setupAuth(config: ProjectConfig): Promise<void> {
	const { auth, frontend, backend, projectDir } = config;
	if (backend === "convex" || auth === "none") {
		return;
	}

	const serverDir = path.join(projectDir, "apps/server");
	const clientDir = path.join(projectDir, "apps/web");
	const nativeDir = path.join(projectDir, "apps/native");

	const clientDirExists = await fs.pathExists(clientDir);
	const nativeDirExists = await fs.pathExists(nativeDir);
	const serverDirExists = await fs.pathExists(serverDir);

	try {
		if (auth === "better-auth") {
			if (serverDirExists) {
				await addPackageDependency({
					dependencies: ["better-auth"],
					projectDir: serverDir,
				});
			}

			const hasWebFrontend = frontend.some((f) =>
				[
					"react-router",
					"tanstack-router",
					"tanstack-start",
					"next",
					"nuxt",
					"svelte",
					"solid",
				].includes(f),
			);

			if (hasWebFrontend && clientDirExists) {
				await addPackageDependency({
					dependencies: ["better-auth"],
					projectDir: clientDir,
				});
			}

			if (
				(frontend.includes("native-nativewind") ||
					frontend.includes("native-unistyles")) &&
				nativeDirExists
			) {
				await addPackageDependency({
					dependencies: ["better-auth", "@better-auth/expo"],
					projectDir: nativeDir,
				});
				if (serverDirExists) {
					await addPackageDependency({
						dependencies: ["@better-auth/expo"],
						projectDir: serverDir,
					});
				}
			}
		} else if (auth === "clerk") {
			if (serverDirExists && backend !== "convex") {
				await addPackageDependency({
					dependencies: ["@clerk/backend"],
					projectDir: serverDir,
				});
			}

			const hasReact = frontend.some((f) =>
				["react-router", "tanstack-router", "tanstack-start"].includes(f),
			);
			const hasNext = frontend.includes("next");
			const hasNative =
				frontend.includes("native-nativewind") ||
				frontend.includes("native-unistyles");

			if (hasNext && clientDirExists) {
				await addPackageDependency({
					dependencies: ["@clerk/nextjs", "@clerk/themes"],
					projectDir: clientDir,
				});
			} else if (hasReact && clientDirExists) {
				await addPackageDependency({
					dependencies: ["@clerk/clerk-react", "@clerk/themes"],
					projectDir: clientDir,
				});
			}

			if (hasNative && nativeDirExists) {
				await addPackageDependency({
					dependencies: ["@clerk/clerk-expo"],
					projectDir: nativeDir,
				});
			}

			// Add Clerk + Convex integration if backend is convex
			if (backend === "convex") {
				const backendDir = path.join(projectDir, "packages/backend");
				if (await fs.pathExists(backendDir)) {
					await addPackageDependency({
						dependencies: ["@clerk/convex"],
						projectDir: backendDir,
					});
				}
			}
		} else if (auth === "convex-auth") {
			// Add Convex Auth dependencies
			if (backend === "convex") {
				const backendDir = path.join(projectDir, "packages/backend");
				if (await fs.pathExists(backendDir)) {
					await addPackageDependency({
						dependencies: ["@convex-dev/auth"],
						projectDir: backendDir,
					});
				}

				// Add @convex-dev/auth to web clients
				if (clientDirExists) {
					await addPackageDependency({
						dependencies: ["@convex-dev/auth"],
						projectDir: clientDir,
					});
				}

				// Add @convex-dev/auth to native clients
				if (nativeDirExists) {
					await addPackageDependency({
						dependencies: [
							"@convex-dev/auth",
							"@react-native-async-storage/async-storage",
						],
						projectDir: nativeDir,
					});
				}
			}
		}
	} catch (error) {
		consola.error(pc.red("Failed to configure authentication dependencies"));
		if (error instanceof Error) {
			consola.error(pc.red(error.message));
		}
	}
}

export function generateAuthSecret(length = 32): string {
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let result = "";
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}
