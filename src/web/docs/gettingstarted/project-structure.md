# Project Structure

Understanding how Nyte.js organizes your files is essential for building clean, efficient, and scalable applications.

This guide explains the folder structure, special files, and conventions used throughout the framework.

---

## Overview

A typical Nyte.js project follows this structure:


```
my-project/
├── src/
│   ├── web/
│   │   ├── layout.tsx
│   │   ├── notFound.tsx
│   │   ├── globals.css
│   │   ├── routes/
│   │   │   ├── index.tsx
│   │   │   ├── about.tsx
│   │   │   └── blog/
│   │   │       └── [id].tsx
│   │   └── components/
│   │       └── Header.tsx
│   ├── backend/
│   │   └── routes/
│   │       ├── api.ts
│   │       └── users.ts
│   └── instrumentation.ts
├── public/
│   ├── favicon.ico
│   └── images/
├── nyte.config.ts
├── tsconfig.json
└── package.json
```



---

## Root Directories

### `/src`

The main source directory where all application logic lives, including frontend, backend, and startup logic.

### `/public`

Static assets served directly by the server. Files inside this folder are accessible from the root URL.

Examples:

- `public/logo.png` → `http://localhost:3000/logo.png`
- `public/images/hero.jpg` → `http://localhost:3000/images/hero.jpg`

---

## Web Directory

The `/src/web` directory contains all frontend-related code.

### `/src/web/routes`

This directory contains your frontend route modules (pages).

Nyte.js uses the folder/file structure as a convention to help you *organize* routes (including dynamic segments with square brackets), but you still need to **register/export** each route configuration (e.g. a `RouteConfig`) so the router can load it.

| File                         | Route           |
|------------------------------|-----------------|
| `routes/index.tsx`           | `/`             |
| `routes/about.tsx`           | `/about`        |
| `routes/blog/index.tsx`      | `/blog`         |
| `routes/blog/[id].tsx`       | `/blog/:id`     |
| `routes/user/profile.tsx`    | `/user/profile` |

To learn how to register routes (patterns, dynamic params, metadata, etc.), see the **Routing** guide: `/getting-started/routing`.

---

### `/src/web/layout.tsx`

The root layout that wraps every page in your application.

This file is used to define:

- Global metadata such as title and description
- Shared UI elements like headers and footers
- Global providers, themes, and contexts
- Global styles

Key points:

- The layout component receives `children`
- You can export a `metadata` object for SEO
- This layout wraps all frontend pages

---

### `/src/web/notFound.tsx`

The custom 404 page rendered when a route does not exist.

Shown when:

- A user navigates to a URL that does not match any route
- Example: `/page-that-does-not-exist`

You can fully customize this page with your own UI and branding.

---


### `/src/web/globals.css`

Global styles applied to the entire application.

This file is imported in `layout.tsx` and typically includes resets, typography, color variables, and base styles.

---

## Backend Directory

The `/src/backend` directory contains all server-side logic.

### `/src/backend/routes`

Defines your backend API routes.

Each file exports handlers for HTTP methods such as GET, POST, PUT, DELETE, and PATCH.

File-to-route mapping examples:

- `backend/routes/api.ts` → `/api/api`
- `backend/routes/users.ts` → `/api/users`
- `backend/routes/auth/login.ts` → `/api/auth/login`

Supported HTTP methods:

- GET for retrieving data
- POST for creating resources
- PUT for full updates
- PATCH for partial updates
- DELETE for removing resources

Each HTTP method is exported as a named function from the route file.

---

## Server-Only Imports

### `importServer()`

Nyte.js provides the `importServer()` utility to safely import server-only code.

Important rules:

- `importServer()` can only be used inside `/src/backend`
- It must never be used in `/src/web`
- Code imported with `importServer()` is guaranteed to never be bundled or executed on the client

This makes it ideal for:

- Database access
- Authentication logic
- Secrets and environment variables
- Heavy server-only dependencies

Using `importServer()` ensures a strict separation between frontend and backend and prevents accidental data leaks to the client.

---

## Instrumentation File

### `/src/nyteweb.ts`

This special file runs once when your Nyte.js application starts.

Common use cases:

- Initialize database connections
- Register global middleware
- Configure logging
- Set up background jobs
- Load environment-based configuration

Key details:

- Must export a default function
- Can be asynchronous
- Runs before any routes are loaded
- Executes in both development and production

This is the ideal place for one-time application setup logic.

---

## Configuration Files

### `nyte.config.ts`

The main configuration file for Nyte.js, located at the project root.

Used to:

- Configure server behavior
- Register plugins and middleware
- Control runtime and build settings
- Customize development and production behavior

Any server-level customization belongs here.

---

### `tsconfig.json`

TypeScript configuration file.

Required configuration:

```json
{
  "compilerOptions": {
    "types": ["nyte/global"]
  }
}
```

Including `nyte/global` is required for Nyte.js global types.

---

### `package.json`

Defines project dependencies and scripts.

Example scripts:

```json
{
  "scripts": {
    "dev": "nyte dev",
    "start": "nyte start"
  }
}
```

* dev starts the development server with hot reload
* start runs the application in production mode
