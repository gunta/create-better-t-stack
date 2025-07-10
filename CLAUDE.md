# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

create-better-t-stack is a TypeScript scaffolding CLI tool that generates full-stack TypeScript projects with various technology combinations. It's a monorepo using Turborepo and Bun workspaces.

## Essential Commands

### Development
```bash
bun dev              # Run all dev servers (CLI + web)
bun dev:cli          # Develop CLI only
bun dev:web          # Develop website only
```

### Building & Testing
```bash
bun build            # Build all packages
bun check            # Run biome linting/formatting checks
bun format           # Auto-format code with biome
bun test             # Run tests (in apps/cli directory)
```

### Publishing
```bash
bun publish-packages # Build and publish CLI to npm
```

### Git Commits
Before committing, ensure code passes checks:
```bash
bun check            # Biome will check linting and formatting
```

## Architecture Overview

### Monorepo Structure
- `apps/cli/` - The scaffolding CLI tool
- `apps/web/` - Documentation website (Next.js + Fumadocs)
- `packages/` - Shared packages (currently empty)

### CLI Architecture Flow
1. **Command Parsing** → `trpc-cli` handles commands with Zod validation
2. **User Prompts** → Interactive prompts using `@clack/prompts`
3. **Template Processing** → Handlebars templates with conditional logic
4. **Project Generation** → Layer templates, install deps, setup git

### Template System
Templates are organized by feature in `apps/cli/templates/`:
- `base/` - Core project structure
- `frontend/` - React, Vue, Svelte, Solid, React Native options
- `backend/` - Hono, Express, Fastify, Elysia, Next.js API
- `db/` - Database configurations and schemas
- `auth/`, `api/`, `addons/`, `examples/` - Feature templates

Templates use Handlebars (`.hbs`) with helpers: `eq`, `and`, `or`, `includes`

### Key Files for CLI Development
- `apps/cli/src/index.ts` - Entry point and command definitions
- `apps/cli/src/commands/init.ts` - Main project creation logic
- `apps/cli/src/commands/add.ts` - Add features to existing projects
- `apps/cli/src/validation.ts` - Compatibility validation rules
- `apps/cli/src/constants.ts` - Dependency versions and defaults
- `apps/cli/src/types.ts` - TypeScript types and schemas

### Configuration
- **Code Style**: Biome with tabs, double quotes, sorted Tailwind classes
- **Node Version**: Requires Node.js 22 (see `.nvmrc`)
- **Package Manager**: Bun preferred, but npm/pnpm supported
- **Git Hooks**: Husky runs lint-staged on pre-commit

### Adding New Features
1. Add templates to appropriate directory under `apps/cli/templates/`
2. Update types in `apps/cli/src/types.ts`
3. Add validation rules in `apps/cli/src/validation.ts`
4. Update prompts in relevant command files
5. Update dependency versions in `apps/cli/src/constants.ts`

### Project Config
Generated projects include `bts.jsonc` file tracking:
- Selected tech stack (frontend, backend, database, ORM, etc.)
- Enabled addons and features
- Used by `add` command to detect existing configuration

### Testing Changes
When developing CLI features:
1. Run `bun dev:cli` to watch for changes
2. Test CLI with: `bunx apps/cli init test-project`
3. Use `--yes` flag for default options
4. Check generated project structure and files

### Important Conventions
- Always create monorepo structure with `apps/` directory
- Templates can reference ProjectConfig variables via Handlebars
- Special filename handling: `_gitignore` → `.gitignore`
- Validation ensures only compatible tech combinations
- Frontend supports multiple targets (web + native)