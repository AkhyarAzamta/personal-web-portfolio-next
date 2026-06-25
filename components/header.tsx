"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Terminal as TerminalIcon,
  Assessment as MonitoringIcon, // alternatif: MonitorHeart, Analytics
  Hub as HubIcon,
  Timer as TimerIcon,
  SatelliteAlt as SatelliteAltIcon,
  SettingsEthernet as SettingsEthernetIcon,
} from "@mui/icons-material";
import Link from "next/link";

interface HeaderProps {
  profile?: {
    name?: string;
    social_media?: {
      github?: string;
    };
  };
  activePage?: string;
}

const Header: React.FC<HeaderProps> = ({ profile, activePage = "" }) => {
  const osName = profile?.name
    ? profile.name.toUpperCase().replace(/ /g, "_")
    : "AKHYAR_AZAMTA";

  const navItems = [
    { label: "TERMINAL", mobileLabel: "TERM", href: "/", icon: TerminalIcon },
    { label: "PROJECTS", mobileLabel: "PROJECTS", href: "/projects", icon: MonitoringIcon },
    { label: "HISTORY", mobileLabel: "CORE", href: "/history", icon: HubIcon },
    { label: "LOGS", mobileLabel: "LOGS", href: "/blogs", icon: TimerIcon },
    { label: "UPLINK", mobileLabel: "UPLINK", href: "/#contact", icon: SatelliteAltIcon },
  ];

  const [lastScrollY, setLastScrollY] = useState(0);
  const bottomNavRef = useRef<HTMLDivElement>(null);

  const handleConsoleToggle = () => {
    const consoleEl = document.getElementById("system-console");
    if (consoleEl) {
      const currentDisplay = window.getComputedStyle(consoleEl).display;
      consoleEl.style.display = currentDisplay === "none" ? "flex" : "none";
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/#")) {
      const id = href.replace("/#", "");
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const bottomNav = bottomNavRef.current;
      if (!bottomNav) return;
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        bottomNav.style.transform = "translateY(100%)";
      } else if (currentScrollY < lastScrollY) {
        bottomNav.style.transform = "translateY(0)";
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-xl border-b border-neon-cyan/30 shadow-[0_0_15px_rgba(0,242,255,0.1)] z-50">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop md:py-1 max-w-container-max mx-auto">
          <Link
            href="/"
            className="font-headline-md text-base md:text-headline-md text-neon-cyan drop-shadow-[0_0_8px_rgba(0,242,255,0.8)] tracking-tighter cursor-pointer"
          >
            {osName}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 font-code-md text-code-md uppercase tracking-widest">
            {navItems.map((item) => {
              const isActive = activePage === item.label;
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`flex items-center gap-2 ${
                    isActive
                      ? "text-neon-cyan border-b-2 border-neon-cyan pb-1"
                      : "text-terminal-gray hover:text-neon-cyan"
                  } transition-colors`}
                >
                  <Icon className="text-lg" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-2 md:gap-4 text-neon-cyan">
            <a
              href={profile?.social_media?.github || "https://github.com/akhyarazamta"}
              target="_blank"
              rel="noopener noreferrer"
              className="active:scale-95 cursor-crosshair hover:bg-neon-cyan/10 p-2 transition-all duration-300"
              title="Source Code"
            >
              <SettingsEthernetIcon />
            </a>
            <button
              onClick={handleConsoleToggle}
              className="active:scale-95 cursor-crosshair hover:bg-neon-cyan/10 p-2 transition-all duration-300"
              title="Toggle Console"
            >
              <TerminalIcon />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav
        ref={bottomNavRef}
        className="md:hidden fixed bottom-0 left-0 right-0 w-full bg-background-surface/95 backdrop-blur-xl border-t border-white/10 z-60 pb-[env(safe-area-inset-bottom)] transition-transform duration-300"
      >
        <div className="flex justify-around items-center px-2">
          {navItems.map((item) => {
            const isActive = activePage === item.label;
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`flex flex-col items-center gap-1.5 p-2 w-16 ${
                  isActive
                    ? "text-neon-cyan drop-shadow-[0_0_8px_rgba(0,242,255,0.6)]"
                    : "text-terminal-gray hover:text-white"
                } transition-all duration-300`}
              >
                <Icon className="text-[22px]" />
                <span className="font-code-md text-[10px] uppercase tracking-wider">
                  {item.mobileLabel}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Header;