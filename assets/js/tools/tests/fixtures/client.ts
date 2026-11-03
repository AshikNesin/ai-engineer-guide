import OpenAI from "openai";

const MODELS = {
  cheap: "gpt-4o-mini",
  smart: "gpt-5",
  vision: "gpt-4.1-mini-2025-04-14",
  speech: "tts-1-hd",
  next: "gpt-5.6-sol",
} as const;

export const vertexModel = "claude-sonnet-4-5@20250929";
export const openrouter = "openai/gpt-4o";
