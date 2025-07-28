import {
  Pencil,
  Folder,
  Sparkles,
  Brain,
  Lock,
  Settings2,
} from "lucide-react";

export default function Features() {
  return (
    <section className="py-12 md:py-20">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
          <h2 className="text-balance text-4xl font-medium lg:text-5xl">
            Everything you need to think clearly and write better
          </h2>
          <p className="text-muted-foreground">
            KnotPad gives you the power to capture, organize, and revisit your
            thoughts with structure and clarity — in a way that feels natural.
          </p>
        </div>

        <div className="relative mx-auto grid max-w-4xl divide-x divide-y border *:p-12 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Pencil className="size-4" />
              <h3 className="text-sm font-medium">Effortless Writing</h3>
            </div>
            <p className="text-sm">
              A clean, distraction-free editor designed for focused note-taking
              and journaling.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Folder className="size-4" />
              <h3 className="text-sm font-medium">Organized by Design</h3>
            </div>
            <p className="text-sm">
              Keep your thoughts sorted with nested folders, tags, and search.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4" />
              <h3 className="text-sm font-medium">Markdown Magic</h3>
            </div>
            <p className="text-sm">
              Write in Markdown with live preview and beautiful formatting.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Brain className="size-4" />
              <h3 className="text-sm font-medium">Thoughtful by Nature</h3>
            </div>
            <p className="text-sm">
              Built to match how your brain works — flexible structure without
              chaos.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Lock className="size-4" />
              <h3 className="text-sm font-medium">Private by Default</h3>
            </div>
            <p className="text-sm">
              Your notes stay yours. Offline-first, with optional sync options.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Settings2 className="size-4" />
              <h3 className="text-sm font-medium">Customizable Workspace</h3>
            </div>
            <p className="text-sm">
              Themes, fonts, layout — make KnotPad feel like home.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
