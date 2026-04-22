# LLM Output Verification Advisor

A deterministic, client-side tool that recommends how to verify an LLM output based on:
- task type
- intended use
- impact if wrong
- evidence availability

It uses no model calls, no backend, and no storage.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy to Cloudflare Pages

- Push this repo to GitHub
- In Cloudflare Pages, connect the repo
- Build command: `npm run build`
- Output directory: `dist`

## Notes

The app is fully client-side and deterministic.
