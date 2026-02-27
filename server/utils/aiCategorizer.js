import OpenAI from "openai";
import {
  taxonomySystemPrompt,
  assignmentSystemPrompt,
  singleCategorizationSystemPrompt,
} from "./aiPrompts.js";

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

let _totalCalls = 0;

function logAI(label, ...args) {
  const ts = new Date().toISOString().slice(11, 23); // HH:MM:SS.mmm
  console.log(`[AI ${ts}] ${label}`, ...args);
}

/**
 * Pass 1 — Generate a fixed taxonomy (8-15 categories) from bookmark titles.
 * Considers existing user category names so it reuses them where appropriate.
 */
export async function generateTaxonomy(titles, existingCategories = []) {
  const client = getClient();
  _totalCalls++;
  const callNum = _totalCalls;

  logAI(`Pass 1 (call #${callNum}) — generating taxonomy from ${titles.length} bookmark titles`);
  if (existingCategories.length > 0) {
    logAI(`  existing categories (${existingCategories.length}): ${existingCategories.slice(0, 6).join(", ")}${existingCategories.length > 6 ? "..." : ""}`);
  }

  const t0 = Date.now();
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: taxonomySystemPrompt(existingCategories) },
      { role: "user", content: titles.map((t, i) => `${i + 1}. ${t}`).join("\n") },
    ],
    max_tokens: 500,
  });

  const parsed = JSON.parse(response.choices[0].message.content);
  const taxonomy = parsed.categories;
  const usage = response.usage || {};
  logAI(
    `  done in ${Date.now() - t0}ms | tokens in:${usage.prompt_tokens ?? "?"} out:${usage.completion_tokens ?? "?"} | ` +
    `taxonomy (${taxonomy.length}): ${taxonomy.join(", ")}`
  );

  return taxonomy;
}

/**
 * Pass 2 — Assign bookmarks to taxonomy categories in batches.
 * The locked vocabulary from Pass 1 prevents drift/hallucination across batches.
 */
export async function assignToCategories(bookmarks, taxonomy) {
  const client = getClient();
  const BATCH_SIZE = 50;
  const totalBatches = Math.ceil(bookmarks.length / BATCH_SIZE);
  const results = [];

  logAI(
    `Pass 2 — assigning ${bookmarks.length} bookmarks in ${totalBatches} batch${totalBatches !== 1 ? "es" : ""} of ≤${BATCH_SIZE}`
  );

  for (let i = 0; i < bookmarks.length; i += BATCH_SIZE) {
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const batch = bookmarks.slice(i, i + BATCH_SIZE);
    _totalCalls++;
    const callNum = _totalCalls;

    logAI(`  batch ${batchNum}/${totalBatches} (call #${callNum}) — ${batch.length} bookmarks`);

    const batchItems = batch.map((b, idx) => ({
      index: i + idx,
      title: b.name || b.title || "",
      url: b.link || b.url || "",
    }));

    const t0 = Date.now();
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: assignmentSystemPrompt(taxonomy) },
        { role: "user", content: JSON.stringify(batchItems) },
      ],
      max_tokens: 4000,
    });

    const parsed = JSON.parse(response.choices[0].message.content);
    const usage = response.usage || {};
    logAI(
      `  batch ${batchNum} done in ${Date.now() - t0}ms | tokens in:${usage.prompt_tokens ?? "?"} out:${usage.completion_tokens ?? "?"} | ${parsed.assignments.length} assignments`
    );

    results.push(...parsed.assignments);
  }

  logAI(`Pass 2 complete — ${results.length} total assignments across ${_totalCalls} total AI calls this session`);
  return results;
}

/**
 * Categorize a single bookmark against existing user categories.
 * Used by bookmarklet auto-sort (fire-and-forget, non-fatal).
 */
export async function categorizeSingle(title, url, existingCategories) {
  const client = getClient();
  _totalCalls++;
  const callNum = _totalCalls;

  logAI(
    `Single (call #${callNum}) — "${title.slice(0, 60)}" against ${existingCategories.length} categories`
  );

  const t0 = Date.now();
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: singleCategorizationSystemPrompt(existingCategories) },
      { role: "user", content: `Title: ${title}\nURL: ${url}` },
    ],
    max_tokens: 100,
  });

  const parsed = JSON.parse(response.choices[0].message.content);
  const usage = response.usage || {};
  logAI(
    `  done in ${Date.now() - t0}ms | tokens in:${usage.prompt_tokens ?? "?"} out:${usage.completion_tokens ?? "?"} | result: "${parsed.category ?? "null (no match)"}"` 
  );

  return parsed.category;
}
