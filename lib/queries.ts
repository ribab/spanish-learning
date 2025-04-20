"use server";

import { db } from "./prisma";

export async function createArticle(title: string) {
  try {
    const article = await db.articles.create({
      data: {
        title,
      },
    });
    return article;
  } catch (error) {
    console.error("Error creating article:", error);
    return null;
  }
}
