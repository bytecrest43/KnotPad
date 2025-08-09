import Image from 'next/image'
import Link from 'next/link'

export default function FooterSection() {
  return (
    <footer className="py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-6">
        
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <Link
            href="/"
            aria-label="Go Home"
            className="flex items-center gap-3 hover:opacity-90 transition"
          >
            <Image 
              src="/knot.png" 
              alt="KnotPad logo"
              width={60}
              height={60}                        
              className="rounded-full shadow-lg"
            />
            <span className="text-3xl font-bold tracking-tight">KnotPad</span>
          </Link>

          {/* Tagline */}
          <p className="text-sm  text-center max-w-md">
            Your notes, beautifully organized — anywhere, anytime.
          </p>
        </div>

        {/* Social Links */}
        <div className="mt-8 flex justify-center gap-6">
          <Link
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram"
            className="hover:scale-110 transition"
          >
            <Image 
              src="/telegram.svg" 
              alt="Telegram"
              width={28}
              height={28}                        
            />
          </Link>
          <Link
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Snapchat"
            className="hover:scale-110 transition"
          >
            <Image 
              src="/snapchat.svg" 
              alt="Snapchat"
              width={28}
              height={28}                        
            />
          </Link>
          <Link
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="hover:scale-110 transition"
          >
            <Image 
              src="/tiktok.svg" 
              alt="TikTok"
              width={28}
              height={28}                        
            />
          </Link>
        </div>

        {/* Divider */}
        <div className="mt-10 border-t border-gray-800"></div>

        {/* Copyright */}
        <p className="mt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} <span className="font-bold">ByteCrest Inc.</span> All rights reserved.
        </p>
      </div>
    </footer>
  )
}
