import { PageWrapper } from "@/components/page-wrapper";
import { getNoteById } from "@/server/notes";
import { JSONContent } from "@tiptap/react";
import RichTextEditor from "@/components/rich-text-editor";

type Params = Promise<{
  noteId: string;
}>;

export default async function NotePage({ params }: { params: Params }) {
  const { noteId } = await params;

  const { note } = await getNoteById(noteId);

  return (
    <PageWrapper
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        {
          label: note?.notebook?.name ?? "Notebook",
          href: `/dashboard/notebook/${note?.notebook?.id}`,
        },
        { label: note?.title ?? "Note", href: `/dashboard/notebook/${note?.notebook?.id}/note/${noteId}` },
      ]}
    >
      <h1>{note?.title}</h1>
      <RichTextEditor
        content={note?.content as JSONContent}
        noteId={noteId}
      />
    </PageWrapper>
  );
}