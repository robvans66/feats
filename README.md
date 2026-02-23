# Feats

Feats is a Nuxt 4 app for tracking completed bicycle rides and planned routes.

It is a personal project to have a simple tool to keep track of my rides and routes. It is not intended to be a full-featured application, but rather a simple and easy-to-use tool for myself and anyone else who might find it useful. I use multiple bicycle platforms and thought it would be handy to have a centralized place to have an overview of all my rides and routes.

Quick start

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Open http://localhost:3000 in your browser.

What I changed

- Server: added `server/db` and API endpoints under `server/api` for `rides`, `routes`, and `stats` (Better-SQLite3 backing store).
- Client: pages `pages/index.vue` (Rides) and `pages/routes.vue` (Routes) use NuxtUI `Table` and perform server-side pagination/filtering/sorting.
- UI: added `components/Spinner.vue`, `components/Toast.vue` transitions, and a global loading composable at `composables/useGlobalLoading.ts`.

Notes

- DB file is created at `{UserPath}.feats/db/feats.db` and seeded when the app starts if empty.
- If `git push` fails, ensure your repository has a remote configured and you have permissions.

Commands

- Run tests / smoke checks (manual):

```bash
curl -sS "http://localhost:3000/api/rides?page=0&pageSize=5"
curl -sS "http://localhost:3000/api/routes?page=0&pageSize=5"
curl -sS "http://localhost:3000/api/stats"
```
