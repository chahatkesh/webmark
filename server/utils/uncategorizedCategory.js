import Category from "../models/categoryModel.js";

export const UNCATEGORIZED_NAME = "Uncategorized";

export const UNCATEGORIZED_CATEGORY = {
  category: UNCATEGORIZED_NAME,
  bgcolor: "#f3f4f6",
  hcolor: "#4b5563",
  emoji: "📂",
};

export function findUncategorizedCategory(categories = []) {
  return (
    categories.find(
      (c) => c.category?.toLowerCase() === UNCATEGORIZED_NAME.toLowerCase(),
    ) || null
  );
}

export async function getOrCreateUncategorizedCategory(userId) {
  const existing = await Category.findOne({
    userId,
    category: { $regex: /^uncategorized$/i },
  });

  if (existing) return existing;

  const lastCategory = await Category.findOne({ userId }).sort("-order");
  const order = lastCategory ? lastCategory.order + 1 : 0;

  return Category.create({
    userId,
    ...UNCATEGORIZED_CATEGORY,
    order,
  });
}
