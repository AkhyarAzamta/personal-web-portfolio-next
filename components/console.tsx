"use client";

import React, { useState, useEffect, useRef } from "react";
import TerminalIcon from "@mui/icons-material/Terminal";

interface ConsoleProps {
  title?: string;
  initialLogs?: string[];
  dynamicLogs?: string[];
}

export default function Console({
  title = "system_metrics.sh — bash",
  initialLogs = [
    "> Initializing sequence...",
    "> Loading system records... [OK]",
    "> Verifying security keys... [OK]",
  ],
  dynamicLogs = [
    "> Scanning memory...",
    "> Running diagnostics...",
    "> Checking node latency...",
    "> Connection stable.",
    "> Awaiting command input...",
  ],
}: ConsoleProps) {
  const [logs, setLogs] = useState<string[]>(initialLogs);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let logIndex = 0;

    // Function to add a new log
    const addLog = () => {
      const time = new Date().toLocaleTimeString("en-GB", { hour12: false });
      const logText = dynamicLogs[logIndex].replace("> ", "");
      const newLog = `> [${time}] ${logText}`;

      setLogs((prevLogs) => {
        // Keep max 12 logs
        const updated = [...prevLogs, newLog];
        if (updated.length > 12) {
          updated.shift();
        }
        return updated;
      });

      logIndex = (logIndex + 1) % dynamicLogs.length;
    };

    // Start interval
    intervalRef.current = setInterval(addLog, 3000);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [dynamicLogs]);

  // Auto-scroll to bottom when logs change
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div
      className="fixed bottom-8 right-8 z-50 w-72 glass-panel border-neon-cyan/50 shadow-[0_0_20px_rgba(0,242,255,0.2)] transition-transform duration-500 hidden lg:flex flex-col"
      id="system-console"
    >
      {/* Header */}
      <div className="bg-surface-container-high px-4 py-2 flex justify-between items-center border-b border-neon-cyan/20">
        <span className="font-label-sm text-[10px] text-white flex items-center gap-2">
          <TerminalIcon className="text-[12px]" />
          {title}
        </span>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 bg-data-pink rounded-full" />
          <div className="w-2.5 h-2.5 bg-tertiary-container rounded-full" />
          <div className="w-2.5 h-2.5 bg-neon-cyan rounded-full" />
        </div>
      </div>

      {/* Logs container */}
      <div
        ref={logContainerRef}
        className="p-4 h-48 overflow-y-auto font-code-md text-[10px] text-neon-cyan/80 space-y-1"
      >
        {logs.map((log, idx) => (
          <div key={idx}>{log}</div>
        ))}
      </div>
    </div>
  );
}