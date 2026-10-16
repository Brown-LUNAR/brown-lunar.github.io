"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./navItems";

function MenuIcon({ open }: { open: boolean }) {
    // Three bars that collapse into an X. Stroke inherits the theme colour.
    return (
        <svg
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
        >
            {open ? (
                <>
                    <line x1="5" y1="5" x2="21" y2="21" />
                    <line x1="21" y1="5" x2="5" y2="21" />
                </>
            ) : (
                <>
                    <line x1="4" y1="7" x2="22" y2="7" />
                    <line x1="4" y1="13" x2="22" y2="13" />
                    <line x1="4" y1="19" x2="22" y2="19" />
                </>
            )}
        </svg>
    );
}

export default function MobileNav() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const panelRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Close on navigation, so the panel never outlives the page it opened on.
    // Done during render (not in an effect) so it lands in the same commit as the new page.
    const [lastPathname, setLastPathname] = useState(pathname);
    if (pathname !== lastPathname) {
        setLastPathname(pathname);
        setOpen(false);
    }

    useEffect(() => {
        if (!open) return;

        function onKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setOpen(false);
                buttonRef.current?.focus();
            }
        }

        function onPointerDown(event: MouseEvent) {
            const target = event.target as Node;
            if (panelRef.current?.contains(target)) return;
            if (buttonRef.current?.contains(target)) return;
            setOpen(false);
        }

        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("mousedown", onPointerDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.removeEventListener("mousedown", onPointerDown);
        };
    }, [open]);

    return (
        <div className="nav-mobile">
            <button
                ref={buttonRef}
                type="button"
                className="nav-mobile-toggle"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                aria-controls="mobile-menu"
                onClick={() => setOpen((value) => !value)}
            >
                <MenuIcon open={open} />
            </button>

            <div
                id="mobile-menu"
                ref={panelRef}
                className="nav-mobile-panel"
                hidden={!open}
            >
                {NAV_ITEMS.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="nav-mobile-link"
                        onClick={() => setOpen(false)}
                    >
                        {item.label}
                    </Link>
                ))}
            </div>
        </div>
    );
}
