# RPC in Nyte.js

Nyte.js provides a **built-in, type-safe RPC system** that lets your frontend call backend functions **directly**, without manually creating APIs, routes, or HTTP clients.

This is one of Nyte.js’ **core differentiators**:
you write **normal backend functions**, expose them intentionally, and consume them on the frontend **as if they were local async functions** — fully typed and secure.

---

## How it works (conceptually)

* **Backend**

    * Write regular TypeScript functions.
    * Explicitly register them with `Expose()`.
    * Nothing is auto-exposed.

* **Frontend**

    * Import exposed server functions using `importServer()`.
    * Functions are **fully typed** and **always async**.
    * Calls are transported securely through Nyte’s internal RPC layer.

> ⚠️ **Important:**
> Calling `Expose()` does **NOT** mean your function becomes a public HTTP endpoint.
>
> Exposed functions are **only accessible through Nyte’s RPC runtime**, not via URLs, REST, or direct web access.

---

## Why this is powerful

- This system is powerful because it removes the need to create routes every time a new function is added. You simply define the function and call it securely from the frontend.

---

## Backend: exposing functions

Place your RPC functions inside a backend file
(example: `/src/backend/helper.ts`).

```ts
// src/backend/helper.ts
import os from "os";
import Expose from "nyte/rpc";
import type { NyteRequest } from "nyte";

type DiagnosticsInput = {
    message?: string;
};

type DiagnosticsResult = {
    hostname: string;
    platform: string;
    message?: string;
    ip?: string;
};

function getOSName() {
    switch (os.platform()) {
        case "win32":
            return "Windows";
        case "linux":
            return "Linux";
        case "darwin":
            return "macOS";
        default:
            return `Unknown (${os.platform()})`;
    }
}

// You can optionally receive the request as a second argument.
// This gives you access to IP, headers, auth info, etc.
export async function getServerDiagnostics(
    input: DiagnosticsInput,
    _req?: NyteRequest
): Promise<DiagnosticsResult> {
    return {
        hostname: os.hostname(),
        platform: getOSName(),
        message: input.message,
        ip: _req?.ip
    };
}

export function getPackageVersion() {
    // Simple example — could also read from package.json
    return "1.0.0";
}

// Explicitly expose only what you want available to the frontend
Expose(getServerDiagnostics, getPackageVersion);
```

### Key points (backend)

* Functions are **normal TypeScript functions**
* `Expose()` is **explicit and intentional**
* No routes, controllers, or HTTP handlers
* Optional `NyteRequest` gives access to request context
* If it’s not passed to `Expose()`, it **cannot be called**

---

## Frontend: importing and calling server functions

On the frontend, use `importServer()` to load the exposed functions.

```tsx
import { importServer } from "nyte/react";

const {
    getServerDiagnostics,
    getPackageVersion
} = importServer("../../backend/helper");

export default function Example() {
    async function run() {
        // All RPC calls are async on the client
        const version = await getPackageVersion();

        const diagnostics = await getServerDiagnostics("Hello from the client");

        console.log({ version, diagnostics });
    }

    return <button onClick={() => void run()}>Call server</button>;
}
```

### Key points (frontend)

* Imported functions behave like normal async functions
* Types are inferred automatically from the backend
* No fetch, no axios, no manual API contracts
* Serialization and transport are handled internally by Nyte

---

## Security model

Nyte’s RPC system is designed to be **secure by default**:

*  Functions are **not exposed via HTTP routes**
*  Only explicitly exposed functions are callable
*  Symbols and internal metadata prevent spoofing
*  Request context is controlled and server-only
*  Client cannot discover or call arbitrary server code

> In short:
> **Expose ≠ public API endpoint**

---

## Notes & best practices

* Treat all imported RPC functions as **always async**
* Keep RPC logic small and focused
* Use `_req?: NyteRequest` only when you need request data
* Never expose internal-only or unsafe functions
* Think of RPC as **“server functions, safely callable from the client”**
