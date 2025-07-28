import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CallToAction() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
            🚀 Ready to Note Like Never Before?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            ✍️ Create structured thoughts. 🧠 Capture ideas instantly. 📁 Stay organized for good.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/">
                <span>🌟 Get Started</span>
              </Link>
            </Button>

            <Button asChild size="lg" variant="outline">
              <Link href="/">
                <span>📝 Try a Sample Note</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
