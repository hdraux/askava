export type MinLevel = 1 | 2 | 3;
export type SequenceTag = "Step 1" | "Step 2" | "Step 3";

export interface PromptEntry {
  id: string;
  name: string;
  minLevel: MinLevel;
  sequenceTag: SequenceTag;
  when: string;
  note: string;
  text: string;
}

export const PROMPT_LIBRARY: PromptEntry[] = [
  {
    id: "self-critique",
    name: "Self-critique",
    minLevel: 1,
    sequenceTag: "Step 1",
    when:
      "Run first on almost any output. Asks the model to argue against itself — surfaces weaknesses it wouldn't otherwise volunteer.",
    note:
      "A model that produces no meaningful critique is either very confident or evasive — both are informative.",
    text: `Now make the strongest possible case against it. What are the most significant errors, weaknesses, faulty assumptions, or alternative interpretations that could undermine your conclusion? Be specific.`,
  },
  {
    id: "confidence",
    name: "Confidence elicitation",
    minLevel: 1,
    sequenceTag: "Step 1",
    when:
      "Use when you want to know where the weak spots are before acting. Particularly useful when you have no source to check against.",
    note:
      "Pay attention to what the model flags — and also to what it doesn't. Overconfidence on a specific claim is itself a signal.",
    text: `Go through the output and flag every claim or figure you are least confident about. For each one, explain why you are uncertain, note where information may have been hallucinated, and tell me which parts I should double-check before acting on this.`,
  },
  {
    id: "assumption",
    name: "Assumption audit",
    minLevel: 2,
    sequenceTag: "Step 2",
    when:
      "Use when the output involves reasoning or recommendations. Reveals what the model took for granted that you didn't explicitly state.",
    note:
      "The most dangerous assumptions are the ones that sound reasonable. Ask a colleague to review the list — they'll spot the ones you've also taken for granted.",
    text: `List every assumption you made that I did not explicitly tell you. For each one, state what you assumed, and indicate which assumptions are most uncertain or could most affect the accuracy of the conclusion.`,
  },
  {
    id: "variation",
    name: "Prompt variation",
    minLevel: 2,
    sequenceTag: "Step 2",
    when:
      "Use when you're unsure if the output reflects the question or just the phrasing. A rephrased answer that differs significantly is a warning sign.",
    note:
      "Best run in a fresh conversation so prior context doesn't anchor the new response. Note differences — don't just look for agreement.",
    text: `Without referring back to that specific text, answer the same underlying question again from a completely different angle — rephrase the reasoning and structure your response independently. Then briefly note any meaningful differences between the two answers and explain why they occurred.`,
  },
  {
    id: "chain",
    name: "Chain of thought",
    minLevel: 3,
    sequenceTag: "Step 3",
    when:
      "Use for any output involving calculations, multi-step reasoning, or logical inference. Makes every step visible so you can check each one.",
    note:
      "If a step can't be reconstructed clearly, that's the step most likely to contain an error. Focus your manual checks there.",
    text: `Now reconstruct your full reasoning step by step — from the information you started with to the conclusion you reached. Show every logical link and intermediate calculation so each step can be checked independently.`,
  },
  {
    id: "known-answer",
    name: "Known-answer test",
    minLevel: 3,
    sequenceTag: "Step 3",
    when:
      "Use when you have at least one fact in the output whose correct answer you already know. Lets you calibrate overall reliability from a verified anchor.",
    note:
      "If the model gets the known answer wrong, treat the rest of the output with extra scepticism. If it gets it right, that's partial — not full — reassurance.",
    text: `I have included at least one item in this output whose correct answer I already know. Identify which items you are most confident about and state your answers — I will check them against what I know to assess overall reliability. If you cannot identify a clear known-answer anchor, flag any data points you are treating as absolute facts.`,
  },
  {
    id: "source",
    name: "Source verification",
    minLevel: 3,
    sequenceTag: "Step 3",
    when:
      "Use when you have source material the AI was meant to draw from. Catches what was dropped, added, or subtly changed in meaning.",
    note:
      "Side-by-side comparison is the key output. Look especially for paraphrases that shift meaning — these are harder to catch than outright additions.",
    text: `Compare this output against the source material it was based on. Identify anything that was dropped, added (including hallucinated facts not in the source), or changed in meaning — even subtly. Quote the original and your version side by side where there is a discrepancy.`,
  },
  {
    id: "rule",
    name: "Rule-based check",
    minLevel: 3,
    sequenceTag: "Step 3",
    when:
      "Use when the output was meant to follow specific rules, policies, or formatting criteria. Evaluates compliance criterion by criterion.",
    note:
      "Define the rules explicitly in your follow-up if needed. Vague criteria produce vague compliance assessments.",
    text: `Evaluate this output against the policy, rules, formatting constraints, or criteria it was meant to apply. For each rule or criterion, state whether the output complies, and flag any violations, deviations, or edge cases where the rules were applied incorrectly.`,
  },
  {
    id: "computational",
    name: "Computational check",
    minLevel: 3,
    sequenceTag: "Step 3",
    when:
      "Use for any output containing numbers, calculations, or quantitative analysis. Redoes every calculation from scratch.",
    note:
      "Always provide the source data when running this prompt — the model needs it to redo the work. If the inputs aren't clear, that's the first thing to flag.",
    text: `Redo every calculation from scratch, showing each step. Explicitly state the inputs used, the method applied, and the results. Compare with the original and flag any step where the inputs, method, or arithmetic may be incorrect.`,
  },
];
