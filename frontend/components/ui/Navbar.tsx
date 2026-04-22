"use client";
// components/ui/Navbar.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText } from "lucide-react";
import clsx from "clsx";

const links = [
  { href: "/",          label: "Upload"    },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/keywords",  label: "Keywords"  },
  { href: "/enhance",   label: "Enhance"   },
];

export default function Navbar() {
  const path = usePathname();
  return (
    <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-green-400 font-semibold">
          <FileText size={20} />
          <span className="hidden sm:inline">ResumeAI</span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                path === href
                  ? "bg-green-500/20 text-green-400"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
              )}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
