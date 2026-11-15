# Bloom & Co

A tiny demo plant shop (React + Vite front end, Express API) used in
[Flawsnap](https://flawsnap.com) video tutorials: report a bug from the site, then
let an AI coding agent read the report over MCP and fix it.

> **This shop has bugs on purpose.** It exists to be reported and fixed on camera.
> Nothing is for sale.

## Run it

```bash
npm install
cp .env.example .env   # add your Flawsnap project key to show the widget
npm run dev            # API on :3001, shop on http://localhost:5173
npm test
```

Leave `VITE_FLAWSNAP_KEY` empty to run the shop without the widget (for example,
to report bugs with the Flawsnap Chrome extension instead). Set
`VITE_ENV_LABEL=Staging` to show a banner.

## Follow along

1. Add the widget (your project key in `.env`) and report a bug from the shop.
2. Connect your agent to Flawsnap: <https://flawsnap.com/docs/mcp>.
3. Ask it: *"What's in my Flawsnap queue? Start on the top one."*

## Licence

MIT
