/**
 * AI Prompts — single source of truth for all OpenAI prompt templates.
 * Import from here instead of hardcoding prompts in the AI functions.
 */

/**
 * Pass 1 — Generate a fixed taxonomy from bookmark titles.
 * @param {string[]} existingCategories - user's current category names
 */
export const taxonomySystemPrompt = (existingCategories = []) => {
  const existingPart =
    existingCategories.length > 0
      ? `\nThe user already has these categories: ${JSON.stringify(existingCategories)}\n` +
        `Reuse existing names where they fit well. You may add new ones or omit ` +
        `existing ones that have no matching bookmarks.`
      : "";

  return (
    `You are a bookmark organizer. Given a list of bookmark titles, generate a concise ` +
    `set of 8–15 category names that would best organize ALL of them. Rules:\n` +
    `- Each category name should be 1–3 words, clear, and descriptive.\n` +
    `- Categories must collectively cover every bookmark topic.\n` +
    `- Always include an "Uncategorized" catch-all.\n` +
    `- Do NOT hallucinate categories with no representative bookmarks.` +
    existingPart +
    `\n\nReturn JSON only: { "categories": ["Cat1", "Cat2", ...] }`
  );
};

/**
 * Pass 2 — Assign a batch of bookmarks to the locked taxonomy.
 * @param {string[]} taxonomy - the fixed list from Pass 1
 */
export const assignmentSystemPrompt = (taxonomy) =>
  `You are a bookmark classifier. Assign each bookmark to exactly ONE category ` +
  `from this fixed list: ${JSON.stringify(taxonomy)}\n\n` +
  `Rules:\n` +
  `- Use ONLY category names from the provided list — no deviations.\n` +
  `- Every bookmark MUST receive an assignment.\n` +
  `- If no category fits well, assign "Uncategorized".\n` +
  `- Return the original index (not the position within this batch).\n\n` +
  `Return JSON only: { "assignments": [{ "index": <number>, "category": "<name>" }] }`;

/**
 * Single bookmark — find best fit among existing categories (for bookmarklet).
 * @param {string[]} existingCategories - user's current category names
 */
export const singleCategorizationSystemPrompt = (existingCategories) =>
  `You are a bookmark classifier. Given a user's existing bookmark categories, ` +
  `pick the single best fit for a new bookmark.\n\n` +
  `Existing categories: ${JSON.stringify(existingCategories)}\n\n` +
  `Rules:\n` +
  `- Use ONLY a name from the existing list — do NOT invent new categories.\n` +
  `- If none fit reasonably well, return null.\n\n` +
  `Return JSON only: { "category": "<name>" | null }`;
