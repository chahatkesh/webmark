import OpenAI from "openai";

let _client = null;
function getClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }
  if (!_client) {
    _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _client;
}

/**
 * Pass 1 — Generate a fixed taxonomy (8-15 categories) from bookmark titles.
 * Considers existing user category names so it reuses them where appropriate.
 */
export async function generateTaxonomy(titles, existingCategories = []) {
  const client = getClient();

  const existingPart =
    existingCategories.length > 0
      ? `\nThe user already has these categories: ${JSON.stringify(existingCategories)}\nReuse existing names where they fit. You may add new ones or drop ones that have no matching bookmarks.`
      : "";

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          `You are a bookmark organizer. Generate a concise list of 8-15 category names ` +
          `that would best organize ALL of the following bookmarks. Each category should be ` +
          `1-3 words, descriptive, and cover the full range of topics. Include an "Uncategorized" ` +
          `category as a catch-all.${existingPart}\n\n` +
          `Return JSON: { "categories": ["Cat1", "Cat2", ...] }`,
      },
      {
        role: "user",
        content: titles.map((t, i) => `${i + 1}. ${t}`).join("\n"),
      },
    ],
    max_tokens: 500,
  });

  const parsed = JSON.parse(response.choices[0].message.content);
  return parsed.categories;
}

/**
 * Pass 2 — Assign bookmarks to taxonomy categories in batches.
 * taxonomy is the locked vocabulary from Pass 1.
 */
export async function assignToCategories(bookmarks, taxonomy) {
  const client = getClient();
  const BATCH_SIZE = 50;
  const results = [];

  for (let i = 0; i < bookmarks.length; i += BATCH_SIZE) {
    const batch = bookmarks.slice(i, i + BATCH_SIZE);
    const batchItems = batch.map((b, idx) => ({
      index: i + idx,
      title: b.name || b.title || "",
      url: b.link || b.url || "",
    }));

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            `Assign each bookmark to exactly ONE of these categories: ${JSON.stringify(taxonomy)}.\n\n` +
            `Return JSON: { "assignments": [{ "index": <number>, "category": "<name>" }] }\n\n` +
            `Rules:\n- Use ONLY categories from the provided list.\n- Every bookmark MUST be assigned.\n` +
            `- If nothing fits, use "Uncategorized".`,
        },
        {
          role: "user",
          content: JSON.stringify(batchItems),
        },
      ],
      max_tokens: 4000,
    });

    const parsed = JSON.parse(response.choices[0].message.content);
    results.push(...parsed.assignments);
  }

  return results;
}

/**
 * Categorize a single bookmark against existing user categories.
 * Used by bookmarklet auto-sort (fire-and-forget).
 */
export async function categorizeSingle(title, url, existingCategories) {
  const client = getClient();

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          `Given these existing bookmark categories: ${JSON.stringify(existingCategories)}\n\n` +
          `Pick the single best category for this bookmark. If none fit well, return category as null.\n\n` +
          `Return JSON: { "category": "<name>" | null }`,
      },
      {
        role: "user",
        content: `Title: ${title}\nURL: ${url}`,
      },
    ],
    max_tokens: 100,
  });

  const parsed = JSON.parse(response.choices[0].message.content);
  return parsed.category;
}
