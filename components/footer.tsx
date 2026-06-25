"use client";

import React, { useEffect, useRef, useState } from "react";
import TerminalIcon from "@mui/icons-material/Terminal";
import SpeedIcon from "@mui/icons-material/Speed";
import DnsIcon from "@mui/icons-material/Dns";
import CodeIcon from "@mui/icons-material/Code";
import WorkIcon from "@mui/icons-material/Work";
import Link from "next/link";

interface FooterProps {
  profileName?: string;
}

export default function Footer({ profileName = "AKHYAR_AZAMTA" }: FooterProps) {
  const footerRef = useRef<HTMLElement>(null);
  const [ping, setPing] = useState("-- MS");
  const [status, setStatus] = useState("PINGING...");
  const [statusDotClass, setStatusDotClass] = useState(
    "w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-terminal-gray"
  );

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let pingInterval: NodeJS.Timeout | null = null;

    const initFooter = () => {
      // 1. Console avoidance (geser console saat footer terlihat)
      const footer = footerRef.current;
      const consoleEl = document.getElementById("system-console");

      if (footer && consoleEl) {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                consoleEl.style.transform = "translateY(-220px)";
              } else {
                consoleEl.style.transform = "";
              }
            });
          },
          { threshold: 0.1 }
        );
        observer.observe(footer);
      }

      // 2. Telemetry ping setiap 15 detik
      async function checkServerStatus() {
        const start = performance.now();
        try {
          await fetch(apiUrl, {
            method: "GET",
            mode: "no-cors",
            cache: "no-store",
          });

          const duration = Math.floor(performance.now() - start);
          setStatus("ONLINE");
          setPing(`${duration}MS`);
          setStatusDotClass(
            "w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-neon-cyan shadow-[0_0_8px_#00f2ff] animate-pulse"
          );
        } catch {
          setStatus("OFFLINE");
          setPing("ERR");
          setStatusDotClass(
            "w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-error shadow-[0_0_8px_#ffb4ab]"
          );
        }
      }

      checkServerStatus();
      if (pingInterval) clearInterval(pingInterval);
      pingInterval = setInterval(checkServerStatus, 15000);
    };

    initFooter();

    // Cleanup
    return () => {
      if (observer) observer.disconnect();
      if (pingInterval) clearInterval(pingInterval);
    };
  }, [apiUrl]);

  return (
    <footer
      ref={footerRef}
      className="w-full border-t border-outline-variant/20 bg-background-deep relative z-10 mt-8 md:mt-24"
    >
      <div className="px-6 md:px-margin-desktop pt-6 pb-20 md:pt-10 md:pb-10 max-w-container-max mx-auto">
        <div className="flex flex-col md:grid md:grid-cols-3 gap-6 items-center w-full">
          {/* Telemetry / Stats */}
          <div className="order-1 md:order-2 flex md:justify-self-center justify-center items-center gap-3 md:gap-6 p-3 md:p-4 bg-surface-container-low border border-outline-variant/20 rounded-lg w-full sm:w-auto shadow-inner">
            <div className="flex items-center gap-1.5 md:gap-2">
              <span className={statusDotClass} id="server-status-dot" />
              <span className="font-code-md text-[10px] md:text-xs text-white" id="server-status-text">
                {status}
              </span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-outline-variant/30" />
            <div className="flex items-center gap-1.5 md:gap-2">
              <SpeedIcon className="text-electric-purple text-[14px] md:text-[16px]" />
              <span className="font-code-md text-[10px] md:text-xs text-terminal-gray" id="server-ping-text">
                {ping}
              </span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-outline-variant/30" />
            <div className="flex items-center gap-1.5 md:gap-2">
              <DnsIcon className="text-data-pink text-[14px] md:text-[16px]" />
              <span className="font-code-md text-[10px] md:text-xs text-terminal-gray">API_CORE</span>
            </div>
          </div>

          <div className="order-2 md:contents flex justify-between w-full items-center gap-2">
            {/* Brand & Copyright */}
            <div className="flex items-center md:order-1 md:justify-self-start">
              <div className="font-label-sm text-[10px] md:text-label-sm text-neon-cyan uppercase tracking-widest flex items-center gap-1.5 md:gap-2">
                <TerminalIcon className="text-[14px] md:text-sm" />
                <span className="whitespace-nowrap">
                  © {new Date().getFullYear()} {profileName.toUpperCase().replace(/ /g, "_")}
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 md:gap-8 font-label-sm text-[10px] md:text-label-sm items-center md:order-3 md:justify-self-end">
              <Link
                className="text-terminal-gray hover:text-neon-cyan flex items-center gap-1 transition-all duration-300 hover:-translate-y-1"
                href="https://github.com/akhyarazamta"
                target="_blank"
                rel="noopener noreferrer"
              >
                <CodeIcon className="text-[14px] md:text-lg" />
                <span>GITHUB</span>
              </Link>
              <Link
                className="text-terminal-gray hover:text-electric-purple flex items-center gap-1 transition-all duration-300 hover:-translate-y-1"
                href="https://linkedin.com/in/akhyarazamta"
                target="_blank"
                rel="noopener noreferrer"
              >
                <WorkIcon className="text-[14px] md:text-lg" />
                <span>LINKEDIN</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}