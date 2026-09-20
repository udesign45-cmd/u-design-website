import Image from "next/image";
import type { ClientLogo } from "@/types/content";

/** Approved client logos only (constitution II). Renders nothing when empty. */
export function LogoCloud({ logos }: { logos: ClientLogo[] }) {
  if (logos.length === 0) return null;
  return (
    <ul className="grid grid-cols-2 items-center gap-6 sm:grid-cols-3 lg:grid-cols-6">
      {logos.map((logo) => (
        <li
          key={logo.company}
          className="flex aspect-3/2 items-center justify-center rounded-card bg-white p-4"
        >
          <Image
            src={logo.logo.src}
            alt={logo.company}
            className="max-h-12 w-auto object-contain opacity-80 grayscale"
            sizes="(min-width: 1024px) 160px, 40vw"
          />
        </li>
      ))}
    </ul>
  );
}
