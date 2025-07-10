import path from "node:path";
import { log, spinner } from "@clack/prompts";
import consola from "consola";
import fs from "fs-extra";
import { globby } from "globby";
import pc from "picocolors";
import { PKG_ROOT } from "../../constants";
import type { ProjectConfig } from "../../types";
import { addPackageDependency } from "../../utils/add-package-deps";
import { processTemplate } from "../../utils/template-processor";

export async function setupMintlify(config: ProjectConfig): Promise<void> {
	const { projectDir } = config;
	const s = spinner();

	try {
		s.start("Setting up Mintlify docs...");

		// Create docs directory
		const docsDir = path.join(projectDir, "apps/docs");
		await fs.ensureDir(docsDir);

		// Copy Mintlify templates
		const templateDir = path.join(PKG_ROOT, "templates/addons/mintlify");
		const templateFiles = await globby("**/*", {
			cwd: templateDir,
			dot: true,
			onlyFiles: true,
		});

		for (const file of templateFiles) {
			const srcPath = path.join(templateDir, file);
			let destFile = file;

			// Remove .hbs extension if present
			if (destFile.endsWith(".hbs")) {
				destFile = destFile.slice(0, -4);
			}

			const destPath = path.join(docsDir, destFile);
			await fs.ensureDir(path.dirname(destPath));

			if (srcPath.endsWith(".hbs")) {
				await processTemplate(srcPath, destPath, config);
			} else {
				await fs.copy(srcPath, destPath);
			}
		}

		// Add Mintlify to devDependencies
		await addPackageDependency({
			devDependencies: ["mintlify"],
			projectDir: docsDir,
		});

		// Create package.json for docs app
		const docsPackageJson = {
			name: "@apps/docs",
			version: "0.0.0",
			private: true,
			scripts: {
				dev: "mintlify dev",
				build: "mintlify build",
				preview: "mintlify preview",
			},
			devDependencies: {
				mintlify: "latest",
			},
		};

		await fs.writeJson(path.join(docsDir, "package.json"), docsPackageJson, {
			spaces: 2,
		});

		// Update root package.json scripts if needed
		const rootPackageJsonPath = path.join(projectDir, "package.json");
		if (await fs.pathExists(rootPackageJsonPath)) {
			const rootPackageJson = await fs.readJson(rootPackageJsonPath);

			// Add docs scripts if they don't exist
			if (!rootPackageJson.scripts["docs:dev"]) {
				rootPackageJson.scripts["docs:dev"] = "pnpm --filter @apps/docs dev";
			}
			if (!rootPackageJson.scripts["docs:build"]) {
				rootPackageJson.scripts["docs:build"] =
					"pnpm --filter @apps/docs build";
			}
			if (!rootPackageJson.scripts["docs:preview"]) {
				rootPackageJson.scripts["docs:preview"] =
					"pnpm --filter @apps/docs preview";
			}

			await fs.writeJson(rootPackageJsonPath, rootPackageJson, { spaces: 2 });
		}

		// Create additional structure for essentials
		const essentialsDir = path.join(docsDir, "essentials");
		await fs.ensureDir(essentialsDir);

		// Create placeholder files for essentials
		const essentialFiles = [
			{
				name: "markdown.mdx",
				title: "Markdown",
				description: "Learn how to use Markdown in Mintlify",
			},
			{
				name: "code.mdx",
				title: "Code Blocks",
				description: "Display code with syntax highlighting",
			},
			{
				name: "images.mdx",
				title: "Images",
				description: "Add and optimize images",
			},
			{
				name: "settings.mdx",
				title: "Settings",
				description: "Configure your documentation",
			},
			{
				name: "navigation.mdx",
				title: "Navigation",
				description: "Structure your documentation",
			},
			{
				name: "reusable-snippets.mdx",
				title: "Reusable Snippets",
				description: "Create reusable content snippets",
			},
		];

		for (const file of essentialFiles) {
			const content = `---
title: '${file.title}'
description: '${file.description}'
---

# ${file.title}

${file.description}

<Note>
  This is a placeholder page. Replace this content with your actual documentation.
</Note>`;

			await fs.writeFile(path.join(essentialsDir, file.name), content);
		}

		// Create API reference endpoint examples
		const apiEndpointDir = path.join(docsDir, "api-reference/endpoint");
		await fs.ensureDir(apiEndpointDir);

		const endpointFiles = [
			{
				name: "get.mdx",
				method: "GET",
				title: "Get User",
				path: "/users/{id}",
			},
			{
				name: "create.mdx",
				method: "POST",
				title: "Create User",
				path: "/users",
			},
			{
				name: "update.mdx",
				method: "PUT",
				title: "Update User",
				path: "/users/{id}",
			},
			{
				name: "delete.mdx",
				method: "DELETE",
				title: "Delete User",
				path: "/users/{id}",
			},
		];

		for (const file of endpointFiles) {
			const content = `---
title: '${file.title}'
api: '${file.method} ${file.path}'
description: 'This endpoint ${file.method === "GET" ? "retrieves" : file.method === "POST" ? "creates" : file.method === "PUT" ? "updates" : "deletes"} a user'
---

<Note>
  This is a placeholder API endpoint. Replace this with your actual API documentation.
</Note>

## Request

<ParamField path="id" type="string" required>
  The ID of the user
</ParamField>

## Response

<ResponseField name="id" type="string">
  The user's unique identifier
</ResponseField>

<ResponseField name="name" type="string">
  The user's full name
</ResponseField>

<ResponseField name="email" type="string">
  The user's email address
</ResponseField>

<RequestExample>
\`\`\`bash cURL
curl --request ${file.method} \\
  --url https://api.example.com${file.path} \\
  --header 'Authorization: Bearer YOUR_API_KEY'
\`\`\`
</RequestExample>

<ResponseExample>
\`\`\`json Response
{
  "id": "user_123456",
  "name": "John Doe",
  "email": "john@example.com"
}
\`\`\`
</ResponseExample>`;

			await fs.writeFile(path.join(apiEndpointDir, file.name), content);
		}

		// Create images directory
		const imagesDir = path.join(docsDir, "images");
		await fs.ensureDir(imagesDir);

		s.stop("Mintlify docs setup successfully!");

		log.info(
			`${pc.green("✓")} Mintlify documentation has been set up in ${pc.cyan("apps/docs")}`,
		);
		log.info(`
${pc.yellow("To start the documentation server:")}
  ${pc.cyan("pnpm docs:dev")}

${pc.yellow("To build the documentation:")}
  ${pc.cyan("pnpm docs:build")}

${pc.yellow("To preview the built documentation:")}
  ${pc.cyan("pnpm docs:preview")}

${pc.cyan("Learn more:")} ${pc.underline("https://mintlify.com/docs")}
		`);
	} catch (error) {
		s.stop(pc.red("Failed to set up Mintlify docs"));
		if (error instanceof Error) {
			consola.error(pc.red(error.message));
		}
		throw error;
	}
}
