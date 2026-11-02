"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#story", label: "Our Story" },
  { href: "#products", label: "Products" },
  { href: "#why", label: "Why GBR" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative md:hidden">
      <button
        type="button"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        onClick={() => setIsOpen((open) => !open)}
        className="grid h-10 w-10 place-items-center rounded-lg border border-line text-ink"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      {isOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="absolute right-0 top-full z-40 mt-2 flex w-56 flex-col gap-1 rounded-xl border border-line bg-paper p-2 shadow-lg"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm text-ink hover:bg-soft"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setIsOpen(false)}
            className="mt-1 rounded-lg bg-ink px-3 py-2.5 text-center text-sm font-medium text-white"
          >
            Become a Partner
          </a>
        </nav>
      )}
    </div>
  );
}
