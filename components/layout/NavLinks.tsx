import Link from "next/link";
import { NAV_ITEMS } from "./navItems";

/** Desktop nav row. Hidden below the mobile breakpoint, where MobileNav takes over. */
export default function NavLinks() {
  return (
      <p className="menu nav-desktop" >
        {NAV_ITEMS.map((link) => (
            <Link
                key={link.href}
                href={link.href}
            >
              {link.label}
            </Link>
        ))}
      </p>
  );
}
