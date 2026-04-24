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

export interface PromptVariant {
  text: string;
  where: string;
  whyHere: string;
}

export interface GeneralPromptEntry extends PromptEntry {
  inConversation: PromptVariant;
  freshConversation: PromptVariant;
}

export const PROMPT_LIBRARY: GeneralPromptEntry[] = [
  {
    id: "self-critique",
    name: "Self-critique",
    minLevel: 1,
    sequenceTag: "Step 1",
    when: "Run first on almost any output. Asks the model to argue against itself, and can surface weaknesses that were not explicit in the original answer.",
    note: "A weak critique is still useful, but ambiguous: it may reflect confidence, poor instruction following, or limited ability to evaluate the answer.",
    text: `Now make the strongest possible case against it. What are the most significant errors, weaknesses, faulty assumptions, or alternative interpretations that could undermine your conclusion? Be specific.`,
    inConversation: {
      where: "In the original conversation",
      whyHere: "The model can critique with full knowledge of what it generated and the reasoning behind it.",
      text: `Now make the strongest possible case against it. What are the most significant errors, weaknesses, faulty assumptions, or alternative interpretations that could undermine your conclusion? Be specific.`,
    },
    freshConversation: {
      where: "In a new conversation or a different model",
      whyHere: "A fresh session removes any tendency to defend prior output; a different model may identify different weaknesses.",
      text: `I'm going to paste an AI-generated output below. Make the strongest possible case against it. What are the most significant errors, weaknesses, faulty assumptions, or alternative interpretations that could undermine its conclusion? Be specific.

[PASTE OUTPUT HERE]`,
    },
  },

  {
    id: "confidence",
    name: "Confidence elicitation",
    minLevel: 1,
    sequenceTag: "Step 1",
    when: "Use as a first check when you have no source to check against, but not a substitute for external verification.",
    note: "Pay attention to what the model flags, and also to what it doesn't. Overconfidence on a specific claim is a warning sign.",
    text: `Go through the output and flag every claim or figure you are least confident about. For each one, explain why you are uncertain, note where information may have been hallucinated, and tell me which parts I should double-check before acting on this.`,
    inConversation: {
      where: "In the original conversation",
      whyHere: "The model can rate confidence with direct access to what it was drawing on when it generated each claim.",
      text: `Go through the output and flag every claim or figure you are least confident about. For each one, explain why you are uncertain, note where information may have been hallucinated, and tell me which parts I should double-check before acting on this.`,
    },
    freshConversation: {
      where: "In a new conversation or a different model",
      whyHere: "A different model gives an independent confidence read, which may diverge meaningfully from the original.",
      text: `I'm going to paste an AI-generated output below. Flag every claim or figure that is least reliable. For each one, explain why it may be uncertain, note where information may have been hallucinated, and identify which parts should be double-checked before acting on this.

[PASTE OUTPUT HERE]`,
    },
  },

  {
    id: "assumption",
    name: "Assumption audit",
    minLevel: 2,
    sequenceTag: "Step 2",
    when: "Use when the output involves reasoning or recommendations. Can expose assumptions the model may have filled in without being told explicitly.",
    note: "The most dangerous assumptions are the ones that sound reasonable. Ask a colleague to review the list; they'll spot the ones you've also taken for granted.",
    text: `List every assumption you made that I did not explicitly tell you. For each one, state what you assumed, and indicate which assumptions are most uncertain or could most affect the accuracy of the conclusion.`,
    inConversation: {
      where: "In the original conversation",
      whyHere: "The model can surface assumptions it made during generation that do not appear in the output text.",
      text: `List every assumption you made that I did not explicitly tell you. For each one, state what you assumed, and indicate which assumptions are most uncertain or could most affect the accuracy of the conclusion.`,
    },
    freshConversation: {
      where: "In a new conversation or a different model",
      whyHere: "A model reading the output cold may identify assumptions the original model treated as invisible because they were baked into the question.",
      text: `I'm going to paste an AI-generated output below. List every assumption it appears to have made that was not explicitly stated in the question. For each one, state what was assumed, and indicate which assumptions are most uncertain or could most affect the accuracy of the conclusion.

[PASTE OUTPUT HERE]`,
    },
  },

  {
    id: "variation",
    name: "Prompt variation",
    minLevel: 2,
    sequenceTag: "Step 2",
    when: "Use when you're unsure if the output reflects the question or just the phrasing. Meaningful differences can be a warning sign, especially when the task should yield a stable answer.",
    note: "Best run in a fresh conversation so prior context doesn't anchor the new response. Note differences; don't just look for agreement.",
    text: `I'm going to paste an AI-generated output below. Without being told what question produced it, describe what it appears to be answering. Then write an alternative framing of that question and describe how you would expect the answer to differ if that framing had been used instead.

[PASTE OUTPUT HERE]`,
    inConversation: {
      where: "In the original conversation, then compare",
      whyHere: "Ask the model to re-answer using a reframed version of your question, then compare the two outputs for meaningful differences.",
      text: `I'd like to test whether this output is sensitive to how the question was framed. Re-answer my original question using this alternative framing: [WRITE YOUR REFRAMED QUESTION HERE]. Then note any meaningful differences between this answer and the one you gave before.`,
    },
    freshConversation: {
      where: "In a new conversation (required for an unbiased read)",
      whyHere: "A fresh session without the original question allows the model to infer what was asked from the output alone, making framing effects visible.",
      text: `I'm going to paste an AI-generated output below. Without being told what question produced it, describe what it appears to be answering. Then write an alternative framing of that question and describe how you would expect the answer to differ if that framing had been used instead.

[PASTE OUTPUT HERE]`,
    },
  },

  {
    id: "chain",
    name: "Chain of thought",
    minLevel: 3,
    sequenceTag: "Step 3",
    when: "Use for any output involving calculations, multi-step reasoning, or logical inference. Gives you a step-by-step explanation you can inspect, even though it may not reflect the model's actual internal reasoning.",
    note: "If a step can't be reconstructed clearly, that's the step most likely to contain an error. Focus your manual checks there.",
    text: `Now reconstruct your full reasoning step by step, from the information you started with to the conclusion you reached. Show every logical link and intermediate calculation so each step can be checked independently.`,
    inConversation: {
      where: "In the original conversation",
      whyHere: "The model reconstructs its reasoning with full context, including information from the conversation it may not have made explicit in the output.",
      text: `Now reconstruct your full reasoning step by step, from the information you started with to the conclusion you reached. Show every logical link and intermediate calculation so each step can be checked independently.`,
    },
    freshConversation: {
      where: "In a new conversation or a different model",
      whyHere: "A model working from the output alone must make its reasoning explicit from scratch, which can reveal steps the original model glossed over.",
      text: `I'm going to paste an AI-generated output below. Reconstruct the full reasoning that would be needed to reach its conclusion, step by step, from plausible inputs. Show every logical link and intermediate calculation. Flag any step where the reasoning appears to be missing, unclear, or potentially incorrect.

[PASTE OUTPUT HERE]`,
    },
  },

  {
    id: "known-answer",
    name: "Known-answer test",
    minLevel: 3,
    sequenceTag: "Step 3",
    when: "Use when you have at least one fact in the output whose correct answer you already know. Gives you a quick reliability check using something you already know is correct.",
    note: "If the model gets the known answer wrong, treat the rest of the output with extra scepticism. If it gets it right, that's partial, not full, reassurance.",
    text: `I have included at least one item in this output whose correct answer I already know. Identify which items you are most confident about and state your answers; I will check them against what I know to assess overall reliability. If you cannot identify a clear known-answer anchor, flag any data points you are treating as absolute facts.`,
    inConversation: {
      where: "In the original conversation",
      whyHere: "The model can identify which claims it made with high confidence versus which it generated with uncertainty.",
      text: `I have included at least one item in this output whose correct answer I already know. Identify which items you are most confident about and state your answers; I will check them against what I know to assess overall reliability. If you cannot identify a clear known-answer anchor, flag any data points you are treating as absolute facts.`,
    },
    freshConversation: {
      where: "In a new conversation or a different model",
      whyHere: "A different model provides an independent answer to your known-anchor items, giving you a second read.",
      text: `I'm going to paste an AI-generated output and a set of known facts I can verify. For each known fact, state whether the output is correct. Then assess what the accuracy on the known items suggests about the reliability of the claims I cannot independently verify.

Known facts I can check: [ADD YOUR KNOWN FACTS HERE]

[PASTE OUTPUT HERE]`,
    },
  },

  {
    id: "source",
    name: "Source verification",
    minLevel: 3,
    sequenceTag: "Step 3",
    when: "Use when you have source material the AI was meant to draw from. Helps identify what may have been dropped, added, or changed in meaning.",
    note: "The main thing to look at is a side-by-side comparison. Look especially for paraphrases that shift meaning; these are harder to catch than outright additions.",
    text: `Compare this output against the source material it was based on. Identify anything that was dropped, added (including hallucinated facts not in the source), or changed in meaning, even subtly. Quote the original and your version side by side where there is a discrepancy.`,
    inConversation: {
      where: "In the original conversation, if you shared the source",
      whyHere: "The model can compare against source material already in the conversation context.",
      text: `Compare this output against the source material it was based on. Identify anything that was dropped, added (including hallucinated facts not in the source), or changed in meaning, even subtly. Quote the original and your version side by side where there is a discrepancy.`,
    },
    freshConversation: {
      where: "In a new conversation — paste both",
      whyHere: "Paste both the source and the output so the model can compare them without prior context influencing the check.",
      text: `I'm going to paste a source document and an AI-generated output based on it. Compare the two. Identify anything that was dropped, added (including facts not in the source), or changed in meaning, even subtly. Quote the original and the output side by side where there is a discrepancy.

SOURCE:
[PASTE SOURCE HERE]

OUTPUT:
[PASTE OUTPUT HERE]`,
    },
  },

  {
    id: "rule",
    name: "Rule-based check",
    minLevel: 3,
    sequenceTag: "Step 3",
    when: "Use when the output was meant to follow specific rules, policies, or formatting criteria. Checks the output against each stated criterion.",
    note: "Define the rules explicitly in your follow-up if needed. Vague criteria produce vague compliance assessments.",
    text: `Evaluate this output against the policy, rules, formatting constraints, or criteria it was meant to apply. For each rule or criterion, state whether the output complies, and flag any violations, deviations, or edge cases where the rules were applied incorrectly.`,
    inConversation: {
      where: "In the original conversation",
      whyHere: "The model knows what rules it was working to and can check its own output against them directly.",
      text: `Evaluate this output against the policy, rules, formatting constraints, or criteria it was meant to apply. For each rule or criterion, state whether the output complies, and flag any violations, deviations, or edge cases where the rules were applied incorrectly.`,
    },
    freshConversation: {
      where: "In a new conversation — paste the rules and the output",
      whyHere: "A model without prior context applies the rules strictly, without any inclination to treat its own output as compliant.",
      text: `I'm going to paste a set of rules or criteria and an AI-generated output that was meant to follow them. For each rule or criterion, state whether the output complies, and flag any violations, deviations, or edge cases where the rules were applied incorrectly.

RULES:
[PASTE RULES HERE]

OUTPUT:
[PASTE OUTPUT HERE]`,
    },
  },

  {
    id: "computational",
    name: "Computational check",
    minLevel: 3,
    sequenceTag: "Step 3",
    when: "Use for any output containing numbers, calculations, or quantitative analysis. Redo the calculation step by step from the provided inputs.",
    note: "Always provide the source data when running this prompt; the model needs it to redo the work. If the inputs aren't clear, that's the first thing to flag.",
    text: `Redo every calculation from scratch, showing each step. Explicitly state the inputs used, the method applied, and the results. Compare with the original and flag any step where the inputs, method, or arithmetic may be incorrect.`,
    inConversation: {
      where: "In a new conversation (required)",
      whyHere: "The original conversation will reproduce the same result. A fresh session is the only way this check is meaningful.",
      text: `I'm going to paste an AI-generated output containing calculations. Before reading it, redo every calculation from scratch using the inputs below, showing each step. Then compare your results with the output and flag any discrepancy in inputs, method, or arithmetic.

INPUTS:
[PASTE SOURCE DATA HERE]

OUTPUT TO CHECK:
[PASTE OUTPUT HERE]`,
    },
    freshConversation: {
      where: "In a new conversation (required)",
      whyHere: "The original conversation will reproduce the same result. A fresh session is the only way this check is meaningful.",
      text: `I'm going to paste an AI-generated output containing calculations. Before reading it, redo every calculation from scratch using the inputs below, showing each step. Then compare your results with the output and flag any discrepancy in inputs, method, or arithmetic.

INPUTS:
[PASTE SOURCE DATA HERE]

OUTPUT TO CHECK:
[PASTE OUTPUT HERE]`,
    },
  },
];
