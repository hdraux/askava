# Askava (Ask AVA)

A deterministic, client-side tool that helps you decide how carefully to verify an AI output. Answer four questions about your task and context; get a risk-calibrated verification plan with ready-to-copy prompts.

**[askava.com](https://askava.com)** — runs entirely in the browser, no backend, no data storage.

---

## What it does

AVA asks four questions:

1. What kind of task did the AI do?
2. What will you use this output for?
3. What happens if the output is wrong?
4. Can you check this output against a source?

It computes a risk score and returns a verification level (0–4) with one prompt per step, chosen for your task type. The same inputs always produce the same output.

---

## Core principle

> Verification should be proportional to use and risk, not uniform.

A personal brainstorm needs no verification. A regulatory submission needs formal sign-off. Most verification advice is either too lax or too uniform. AVA calibrates the recommendation to the actual stakes.

---

## How the score is calculated

Each answer contributes points to a risk score.

### Task type

| Task | Points |
|---|---|
| Content generation | +0 |
| Summarisation | +0 |
| Information lookup | +0 |
| Translation | +0 |
| Classification / labelling | +1 |
| Coding assistance | +1 |
| Data analysis | +1 |
| Policy interpretation | +2 |

### Intended use

| Use | Points |
|---|---|
| Personal only | +0 |
| Internal draft | +1 |
| Decision support | +2 |
| External / operational | +3 |
| Regulatory / high-stakes | +4 |

### Impact if wrong

| Impact | Points |
|---|---|
| Low | +0 |
| Medium | +1 |
| High | +2 |

### Evidence availability

| Evidence | Points |
|---|---|
| Clear source | +0 |
| Partial source | +1 |
| No source | +2 |

### Verification levels

| Level | Name | Score |
|---|---|---|
| 0 | Use freely | 0 |
| 1 | Quick check | 1–2 |
| 2 | Grounded verification | 3–5 |
| 3 | Independent review | 6–7 |
| 4 | Formal control | 8+ |

---

## How the method is chosen

Level sets the depth. Task type determines which prompts are shown.

For each level, AVA selects one prompt per step from a fixed task-method table. Task determines the primary method at Step 3; evidence determines which variant is used when alternatives exist.

| Task | Step 1 | Step 2 | Step 3 |
|---|---|---|---|
| Content generation | Self-critique | Assumption audit | Source verification or known-answer test |
| Summarisation | Self-critique | Prompt variation | Source verification |
| Information lookup | Confidence elicitation | Prompt variation | Known-answer test or source verification |
| Data analysis | Confidence elicitation | Assumption audit | Computational check |
| Policy interpretation | Confidence elicitation | Assumption audit | Rule-based check |
| Translation | Self-critique | Prompt variation | Source verification or known-answer test |
| Coding assistance | Self-critique | Assumption audit | Rule-based check |
| Classification / labelling | Self-critique | Assumption audit | Known-answer test or source verification |

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| Styling | Plain CSS |
| Deployment | Cloudflare Pages |
| Persistence | None (localStorage for first-run modal only) |
| Backend | None |

---

## Running locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Output goes to `dist/`. Deploy to Cloudflare Pages with build command `npm run build` and output directory `dist`.

---

## Project structure

```
src/
├── components/         UI components including the wizard and drawers
│   └── steps/          Individual question step components
├── lib/                Scoring, evaluation, and prompt selection logic
└── config/             Scoring, escalation, recommendation, and task-method matrix (JSON)
```

Scoring is fully deterministic. All logic lives in `src/lib/` and reads from static JSON configs in `src/config/`. No runtime API calls.

---

## Further reading

**Practical**
- [Arize: The Definitive Guide to LLM Evaluation](https://arize.com/llm-evaluation/) — when exact-match checking works and when it does not
- [LangSmith: Evaluation Concepts](https://docs.langchain.com/langsmith/evaluation) — how to define what can be measured before designing evaluation
- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework) — a widely used framework for proportional, risk-based AI oversight that informed AVA's overall approach

**Research**
- [Kadavath et al. (2022): Language Models (Mostly) Know What They Know](https://arxiv.org/abs/2207.05221) — model confidence can sometimes provide a useful signal about uncertainty
- [Wei et al. (2022): Chain-of-Thought Prompting Elicits Reasoning in Large Language Models](https://arxiv.org/abs/2201.11903) — prompting for step-by-step reasoning can improve performance and provide intermediate steps to inspect

---

## Licence

MIT
