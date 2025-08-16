"use server";

import { db } from "@/db/drizzle";
import { InsertNote, notes, notebooks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { unstable_cache as cache, revalidateTag } from "next/cache";

const getCachedNoteById = cache(
  async (id: string) => {
    return db.query.notes.findFirst({
      where: eq(notes.id, id),
      columns: {
        id: true,
        title: true,
        content: true,
        notebookId: true,
        createdAt: true,
        updatedAt: true,
      },
      with: {
        notebook: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    });
  },
  ["noteById"],
  { tags: [] }
);

export const createNote = async (values: InsertNote) => {
  try {
    await db.insert(notes).values(values);
    // Invalidate views depending on this notebook's notes
    if (values.notebookId) {
      revalidateTag(`notebook:${values.notebookId}`);
    }
    return { success: true, message: "Note created successfully" };
  } catch {
    return { success: false, message: "Failed to create notebook" };
  }
};

export const getNoteById = async (id: string) => {
  try {
    const note = await cache(
      async () => getCachedNoteById(id),
      ["noteById", id],
      { tags: [`note:${id}`] }
    )();

    return { success: true, note };
  } catch {
    return { success: false, message: "Failed to get notebook" };
  }
};

export const updateNote = async (id: string, values: Partial<InsertNote>) => {
  try {
    await db.update(notes).set(values).where(eq(notes.id, id));
    // Invalidate the note page and its notebook list
    revalidateTag(`note:${id}`);
    // Lookup notebookId if not provided
    let notebookId = values.notebookId;
    if (!notebookId) {
      const n = await db.query.notes.findFirst({
        where: eq(notes.id, id),
        columns: { notebookId: true },
      });
      notebookId = n?.notebookId;
    }
    if (notebookId) {
      revalidateTag(`notebook:${notebookId}`);
    }
    return { success: true, message: "Notebook updated successfully" };
  } catch {
    return { success: false, message: "Failed to update notebook" };
  }
};

export const deleteNote = async (id: string) => {
  try {
    // Obtain notebookId for invalidation before delete
    const n = await db.query.notes.findFirst({
      where: eq(notes.id, id),
      columns: { notebookId: true },
    });

    await db.delete(notes).where(eq(notes.id, id));

    revalidateTag(`note:${id}`);
    if (n?.notebookId) {
      revalidateTag(`notebook:${n.notebookId}`);
    }
    return { success: true, message: "Notebook deleted successfully" };
  } catch {
    return { success: false, message: "Failed to delete notebook" };
  }
};
