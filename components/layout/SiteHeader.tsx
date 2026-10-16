"use client";

import NavLinks from "./NavLinks";
import MobileNav from "./MobileNav";
import Logo from "@/components/logo";
import Link from "next/link";
import { useTheme } from "@/context/themeContext";

export default function SiteHeader() {
    const { theme, toggleTheme } = useTheme();
    return (
        <header className="header">
            <div className="header-inner">
                <div className="header-brand">
                    <Link href="/">
                        <Logo />
                    </Link>
                    <h3 className="header-title">
                        <Link href="/">Language Understanding and Representation Lab</Link>
                    </h3>
                </div>

                <div className="header-actions">
                    <NavLinks />

                    <button
                        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                        }}
                        onClick={toggleTheme}
                    >
                        {theme === "dark" ? (
                            <svg width="26" height="26" fill="#F9E4C8" stroke="#F9E4C8" strokeWidth="2">
                                <circle cx="12" cy="12" r="9" />
                            </svg>
                        ) : (
                            <svg width="26" height="26" fill="none" stroke="#323C50" strokeWidth="2">
                                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                            </svg>
                        )}
                    </button>

                    {/* Hamburger — replaces the nav row below 680px */}
                    <MobileNav />
                </div>
            </div>
        </header>
    );
}
