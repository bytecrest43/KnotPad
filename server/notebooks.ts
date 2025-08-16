"use server";

import { db } from "@/db/drizzle";
import { InsertNotebook, notebooks, notes } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { unstable_cache as cache, revalidateTag } from "next/cache";

// Cached helpers
const getCachedNotebooksByUser = cache(
  async (userId: string) => {
    return db.query.notebooks.findMany({
      where: eq(notebooks.userId, userId),
      columns: {
        id: true,
        name: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
      with: {
        // For sidebar/dashboard lists, we don't need heavy content JSON
        notes: {
          columns: {
            id: true,
            title: true,
            content: true,
            notebookId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  },
  ["notebooksByUser"],
  {
    tags: [], // tags will be provided dynamically via revalidateTag based on user id keying
  }
);

const getCachedNotebookById = cache(
  async (id: string) => {
    return db.query.notebooks.findFirst({
      where: eq(notebooks.id, id),
      columns: {
        id: true,
        name: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
      with: {
        notes: {
          columns: {
            id: true,
            title: true,
            content: true,
            notebookId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  },
  ["notebookById"],
  {
    tags: [],
  }
);

export const createNotebook = async (values: InsertNotebook) => {
  try {
    await db.insert(notebooks).values(values);
    // Invalidate notebooks list for this user
    if (values.userId) {
      revalidateTag(`user:${values.userId}:notebooks`);
    }
    return { success: true, message: "Notebook created successfully" };
  } catch {
    return { success: false, message: "Failed to create notebook" };
  }
};

export const getNotebooks = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = session?.user?.id;

    if (!userId) {
      return { success: false, message: "User not found" };
    }

    // Use per-user tag so we can revalidate efficiently
    const notebooksByUser = await cache(
      async () => getCachedNotebooksByUser(userId),
      ["notebooksByUser", userId],
      { tags: [`user:${userId}:notebooks`, `sidebar:${userId}`] }
    )();

    return { success: true, notebooks: notebooksByUser };
  } catch {
    return { success: false, message: "Failed to get notebooks" };
  }
};

export const getNotebookById = async (id: string) => {
  try {
    const notebook = await cache(
      async () => getCachedNotebookById(id),
      ["notebookById", id],
      { tags: [`notebook:${id}`] }
    )();

    return { success: true, notebook };
  } catch {
    return { success: false, message: "Failed to get notebook" };
  }
};

export const updateNotebook = async (id: string, values: InsertNotebook) => {
  try {
    await db.update(notebooks).set(values).where(eq(notebooks.id, id));
    // Invalidate notebook and user's notebooks list
    revalidateTag(`notebook:${id}`);
    if (values.userId) {
      revalidateTag(`user:${values.userId}:notebooks`);
    }
    return { success: true, message: "Notebook updated successfully" };
  } catch {
    return { success: false, message: "Failed to update notebook" };
  }
};

export const deleteNotebook = async (id: string) => {
  try {
    // Find the notebook to get userId for invalidation
    const nb = await db.query.notebooks.findFirst({
      where: eq(notebooks.id, id),
      columns: { id: true, userId: true },
    });

    await db.delete(notebooks).where(eq(notebooks.id, id));

    revalidateTag(`notebook:${id}`);
    if (nb?.userId) {
      revalidateTag(`user:${nb.userId}:notebooks`);
      revalidateTag(`sidebar:${nb.userId}`);
    }
    return { success: true, message: "Notebook deleted successfully" };
  } catch {
    return { success: false, message: "Failed to delete notebook" };
  }
};