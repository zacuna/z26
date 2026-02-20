# Troubleshooting

## "localhost is not loading" / Can't open http://localhost:3000

The app is running when the dev server says **Ready** and shows `http://127.0.0.1:3000`. If your **own** browser (Chrome, Safari, etc.) still can’t load the page, the server is likely running in a different environment than your machine (e.g. Cursor’s sandbox or a remote session).

**Fix: run the dev server on your machine**

1. Open **Terminal.app** (or iTerm) on your Mac — a terminal that is clearly on your computer, not only inside Cursor.
2. Go to the project folder:
   ```bash
   cd /Users/zachacuna/Documents/Z26
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. When you see **Ready**, open in your browser:
   - **http://localhost:3000** or
   - **http://127.0.0.1:3000**

If it still doesn’t load:

- **Check the port:** If 3000 is in use, Next.js may use 3001, 3002, etc. Use the URL printed in the terminal (e.g. `http://127.0.0.1:3001`).
- **Try 127.0.0.1:** Some setups resolve `localhost` differently; use **http://127.0.0.1:3000**.
- **Disable VPN/proxies** that might block or redirect localhost.

## "EMFILE: too many open files"

Raise the file descriptor limit (macOS):

```bash
ulimit -n 10240
```

Then run `npm run dev` again. You can add this to your shell profile if it keeps happening.

## Dev server crashes with `uv_interface_addresses`

The dev script is set to use `--hostname 127.0.0.1` to avoid this. If you still see it, try:

- Using Node 20 LTS instead of Node 24.
- Running `npm run dev` from Terminal.app instead of Cursor’s terminal.

## `__webpack_modules__[moduleId] is not a function` (Runtime TypeError)

This usually means a stale or corrupted webpack module cache.

**Fix:**

1. Stop the dev server (Ctrl+C).
2. Clear the build cache and restart:
   ```bash
   npm run dev:clean
   ```
   Or manually:
   ```bash
   rm -rf .next
   npm run dev
   ```
3. Hard-refresh the browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows) or open the app in an incognito/private window.

If it still happens, try the Turbopack dev server (different bundler):

```bash
npm run dev:turbo
```

Then open the URL shown in the terminal (e.g. http://127.0.0.1:3000).
