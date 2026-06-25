"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Console from "@/components/console";
import ScrollAnimations from "@/components/scroll-animations";
import TimelineIcon from "@mui/icons-material/Timeline";
import SchoolIcon from "@mui/icons-material/School";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import NeurologyIcon from "@mui/icons-material/School";
import CloudIcon from "@mui/icons-material/Cloud";
import CodeIcon from "@mui/icons-material/Code";
import DnsIcon from "@mui/icons-material/Dns";
import LanguageIcon from "@mui/icons-material/Language";
import MergeIcon from "@mui/icons-material/Merge";
import SecurityIcon from "@mui/icons-material/Security";
import StorageIcon from "@mui/icons-material/Storage";
import TerminalIcon from "@mui/icons-material/Terminal";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import SafeImage from "@/components/safe-image";
import LoadingScreen from "@/components/loading-screen";

// ─── Tipe Data ──────────────────────────────────────────────────────────────

interface Profile {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  bio: string;
  photo_profile_url: string;
  social_media: {
    github?: string;
    linkedin?: string;
    instagram?: string;
  };
}

interface Experience {
  id: number;
  title: string;
  company: string;
  period: string;
  description: string[];
  is_current: boolean;
}

interface Education {
  id: number;
  degree: string;
  institution: string;
  period: string;
  description: string | null;
  grade: number | null;
}

interface Certificate {
  id: number;
  name: string;
  issuer: string;
  issue_date: string;
  expiry_date: string;
  credential_url: string;
  image_url: string;
}

interface PortfolioData {
  profile: Profile;
  experiences: Experience[];
  educations: Education[];
  certificates: Certificate[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCertIcon(name: string): React.ReactNode {
  const n = name.toLowerCase();
  if (n.includes("aws") || n.includes("cloud")) return <CloudIcon />;
  if (n.includes("react") || n.includes("frontend")) return <CodeIcon />;
  if (n.includes("backend") || n.includes("api")) return <DnsIcon />;
  if (n.includes("javascript") || n.includes("js")) return <LanguageIcon />;
  if (n.includes("git") || n.includes("version")) return <MergeIcon />;
  if (n.includes("security")) return <SecurityIcon />;
  if (n.includes("database") || n.includes("sql")) return <StorageIcon />;
  if (n.includes("linux") || n.includes("server")) return <TerminalIcon />;
  return <WorkspacePremiumIcon />;
}

function formatPeriod(period: string): string {
  return period.toUpperCase().replace(/ /g, "_");
}

const now = new Date().toISOString().replace("T", " ").slice(0, 19);

// ─── Halaman ──────────────────────────────────────────────────────────────────

export default function HistoryPage() {
  const [profile, setProfile] = useState<Profile>({
    id: 0,
    name: "Akhyar Azamta",
    email: "",
    phone_number: "",
    bio: "",
    photo_profile_url: "",
    social_media: {},
  });
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingScreenDone, setLoadingScreenDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const terminalRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLParagraphElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // ─── Fetch Data ────────────────────────────────────────────────────────────

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/v1/portfolio/akhyarazamta`);
        if (!res.ok) throw new Error("Failed to fetch portfolio data");
        const json = await res.json();
        if (!json.success) throw new Error("API returned success: false");
        const data = json.data;
        setProfile(data.profile);
        setExperiences(data.experiences || []);
        setEducations(data.educations || []);
        setCertificates(data.certificates || []);
      } catch (err) {
        console.error("Error fetching history data:", err);
        setError("Failed to load history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  // ─── Terminal Live Logs ────────────────────────────────────────────────────

  useEffect(() => {
    if (loading || error) return;

    const liveLogs = [
      `> Polling uptime monitor...`,
      `> Heartbeat OK: 200ms`,
      `> Cache warmed: ${experiences.length} experience records.`,
      `> DNS resolution: akhyar.local -> 127.0.0.1`,
      `> TLS handshake: COMPLETE`,
      `> Audit log: ${certificates.length} certs active.`,
      `> Memory pressure: LOW`,
      `> Scheduler queue: EMPTY`,
      `> Sync with remote mainframe... [OK]`,
      `> ${educations.length} academic modules loaded.`,
      `> Network interface: eth0 UP`,
      `> Process forked: PID 4821`,
      `> Boot sector verified. Integrity: PASS`,
    ];

    let idx = 0;

    const addLog = () => {
      const container = terminalRef.current;
      const cursor = cursorRef.current;
      if (!container) return;

      const time = new Date().toLocaleTimeString("en-GB", { hour12: false });
      const line = document.createElement("p");
      line.innerHTML = `<span style="color: rgba(148, 163, 184, 0.6);">[${time}]</span> ${liveLogs[idx]}`;

      if (cursor) {
        container.insertBefore(line, cursor);
      } else {
        container.appendChild(line);
      }

      // Cap to 20 lines (excluding prompt and cursor)
      const allLines = container.querySelectorAll("p:not(#core-dump-cursor)");
      if (allLines.length > 18) {
        allLines[0]?.remove();
      }

      container.scrollTop = container.scrollHeight;
      idx = (idx + 1) % liveLogs.length;
    };

    intervalRef.current = setInterval(addLog, 2500);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [loading, error, experiences.length, certificates.length, educations.length]);

  // ─── Loading & Error States ──────────────────────────────────────────────

  if (!loadingScreenDone) {
    return <LoadingScreen isLoading={loading} onComplete={() => setLoadingScreenDone(true)} />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-deep">
        <div className="text-error font-code-md">{error}</div>
      </div>
    );
  }

  const totalCerts = certificates.length;
  const activeJobs = experiences.filter((e) => e.is_current).length;
  const totalExperiences = experiences.length;
  const totalEducations = educations.length;

  return (
    <>
      <Header profile={profile} activePage="HISTORY" />

      <main className="pt-14 md:pt-28 pb-24 md:pb-16 px-4 md:px-margin-desktop max-w-container-max mx-auto relative z-10">
        {/* Page Header */}
        <header className="mb-8 md:mb-16 border-l-2 md:border-l-4 border-neon-cyan pl-4 md:pl-6 reveal-section">
          <div className="inline-flex items-center gap-2 px-2 py-1 mb-3 md:mb-4 bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan font-code-md text-[10px] md:text-xs tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
            STATUS: HISTORY_LOADED
          </div>
          <h1 className="font-headline-xl text-3xl md:text-5xl lg:text-8xl tracking-tighter uppercase mb-3 md:mb-4 terminal-glow">
            CORE_DUMP<span className="text-neon-cyan animate-pulse">_</span>
          </h1>
          <p className="font-body-md text-xs md:text-body-lg text-terminal-gray max-w-2xl">
            Trace back the chronological evolution of{" "}
            {profile.name.toUpperCase().replace(/ /g, "_")} through technical milestones and
            architectural deployments.
          </p>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-gutter">
          {/* Left Column: Work History + Education + Terminal */}
          <section className="lg:col-span-8 space-y-10 md:space-y-20">
            {/* WORK_HISTORY */}
            <div className="reveal-section">
              <div className="flex items-center gap-2 md:gap-4 mb-6 md:mb-12">
                <TimelineIcon className="text-xl md:text-2xl text-neon-cyan" />
                <span className="font-headline-md text-base md:text-headline-md text-on-surface">
                  WORK_HISTORY
                </span>
                <div className="flex-grow h-px bg-white/10 relative">
                  <div className="absolute top-0 left-0 h-full w-1/4 bg-neon-cyan blur-[2px]" />
                </div>
              </div>

              <div className="relative ml-3 md:ml-4 pl-6 md:pl-12 timeline-line space-y-8 md:space-y-12">
                {experiences.length > 0 ? (
                  experiences.map((exp) => (
                    <div key={exp.id} className="relative group">
                      {/* Timeline dot */}
                      <div
                        className={`absolute -left-[33px] md:-left-[54px] top-2 w-3 h-3 md:w-4 md:h-4 bg-background border-2 ${exp.is_current
                            ? "border-neon-cyan shadow-[0_0_10px_#00f2ff] group-hover:bg-neon-cyan"
                            : "border-terminal-gray group-hover:border-neon-cyan"
                          } rounded-full z-10 transition-all duration-300`}
                      />

                      {/* Header Row */}
                      <div className="flex flex-col md:flex-row md:justify-between items-start mb-2">
                        <div>
                          <h2 className="font-headline-md text-sm md:text-headline-md text-on-surface group-hover:text-neon-cyan transition-colors duration-300 mb-1">
                            {exp.title}
                          </h2>
                          <p className="font-label-sm text-[10px] md:text-label-sm text-on-surface-variant uppercase tracking-wider">
                            {exp.company
                              .replace(/[^a-zA-Z0-9 ]/g, "")
                              .replace(/ /g, "_")
                              .toUpperCase()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-1 md:mt-0 flex-shrink-0">
                          <span className="font-code-md text-[10px] md:text-code-md text-terminal-gray">
                            {formatPeriod(exp.period)}
                          </span>
                          <span
                            className={`font-code-md text-[10px] px-2 py-0.5 border ${exp.is_current
                                ? "text-neon-cyan bg-neon-cyan/10 border-neon-cyan/30"
                                : "text-terminal-gray bg-white/5 border-white/10"
                              }`}
                          >
                            {exp.is_current ? "[ACTIVE]" : "[ARCHIVED]"}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <div
                        className={`p-3 md:p-6 mt-2 md:mt-4 border ${exp.is_current
                            ? "bg-surface-container-low border-outline-variant/20 hover:border-neon-cyan/50"
                            : "bg-surface-container-low/40 border-outline-variant/10"
                          } transition-colors`}
                      >
                        <ul className="space-y-2 md:space-y-3 font-body-md text-xs md:text-body-md text-terminal-gray list-none">
                          {exp.description.map((desc, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span
                                className={
                                  exp.is_current
                                    ? "text-neon-cyan flex-shrink-0"
                                    : "text-electric-purple flex-shrink-0"
                                }
                              >
                                {">"}
                              </span>
                              {desc}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-terminal-gray font-code-md p-8 border border-white/10 bg-background-surface text-center">
                    {">"} NO_HISTORY_RECORDS_FOUND // API_OFFLINE_OR_EMPTY
                  </div>
                )}
              </div>
            </div>

            {/* ACADEMIC_RECORDS */}
            <div className="reveal-section">
              <div className="flex items-center gap-2 md:gap-4 mb-6 md:mb-12">
                <SchoolIcon className="text-xl md:text-2xl text-electric-purple" />
                <span className="font-headline-md text-base md:text-headline-md text-on-surface">
                  ACADEMIC_RECORDS
                </span>
                <div className="flex-grow h-px bg-white/10 relative">
                  <div className="absolute top-0 left-0 h-full w-1/4 bg-electric-purple blur-[2px]" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {educations.length > 0 ? (
                  educations.map((edu, i) => {
                    const accentHex = i % 2 === 0 ? "#00f2ff" : "#bc13fe";
                    return (
                      <div
                        key={edu.id}
                        className="group relative flex flex-col h-full bg-surface-container-low p-4 md:p-4 border border-outline-variant/20 hover:border-[var(--accent-color)] hover:border-opacity-50 transition-all duration-300"
                        style={{ "--accent-color": accentHex } as React.CSSProperties}
                      >
                        <div
                          className="absolute top-3 right-3 md:top-1 md:right-1 opacity-20 group-hover:opacity-100 transition-opacity"
                          style={{ color: accentHex }}
                        >
                          <NeurologyIcon className="text-2xl md:text-4xl" />
                        </div>
                        <div
                          className="font-label-sm text-[10px] md:text-label-sm mb-2 pr-4 break-all"
                          style={{ color: accentHex }}
                        >
                          {edu.degree.toUpperCase().replace(/ /g, "_")}
                        </div>
                        <h3 className="font-headline-md text-sm md:text-headline-md text-white mb-2 md:mb-3 group-hover:text-neon-cyan transition-colors">
                          {edu.institution}
                        </h3>
                        {edu.grade !== null && (
                          <p className="font-body-md text-xs md:text-body-md text-terminal-gray mb-4">
                            GPA: {Number(edu.grade).toFixed(2)}/4.0
                          </p>
                        )}
                        <span
                          className="inline-block font-label-sm text-[10px] md:text-label-sm border px-2 md:px-3 py-0.5 md:py-1 mt-auto w-fit"
                          style={{ color: accentHex, borderColor: `${accentHex}4d` }}
                        >
                          {formatPeriod(edu.period)}
                        </span>
                        <div
                          className="absolute bottom-0 left-0 w-1 h-0 group-hover:h-full transition-all duration-500"
                          style={{ background: accentHex }}
                        />
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-2 text-center text-terminal-gray font-code-md p-8 border border-white/10 bg-background-surface">
                    {">"} NO_ACADEMIC_RECORDS_FOUND
                  </div>
                )}
              </div>
            </div>

            {/* Terminal Mockup */}
            <div className="mt-12 md:mt-24 reveal-section">
              <div className="glass-panel rounded-none border-neon-cyan/20 overflow-hidden">
                <div className="bg-surface-container-high px-3 md:px-4 py-2 flex items-center gap-1.5 md:gap-2 border-b border-white/10">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500/50" />
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-yellow-500/50" />
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-neon-cyan/50" />
                  <span className="ml-2 md:ml-4 font-code-md text-[10px] md:text-xs text-terminal-gray">
                    core_dump.sh — bash
                  </span>
                  <div className="ml-auto flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
                    <span className="font-code-md text-[10px] text-neon-cyan/60 uppercase tracking-widest">
                      LIVE
                    </span>
                  </div>
                </div>
                <div
                  ref={terminalRef}
                  className="p-3 md:p-6 font-code-md text-[10px] md:text-[13px] text-neon-cyan/70 space-y-1 h-40 md:h-56 overflow-y-auto"
                  id="core-dump-output"
                >
                  <p>
                    <span className="text-electric-purple">root@akhyar_os:</span>
                    <span className="text-white">~</span> cat /proc/career_history
                  </p>
                  <p>[{now}] INFO: Timeline rendered.</p>
                  <p>[{now}] INFO: {experiences.length} experience nodes mapped.</p>
                  <p>[{now}] INFO: {educations.length} academic sectors indexed.</p>
                  <p>[{now}] INFO: {totalCerts} cert keys validated.</p>
                  <p>[{now}] SUCCESS: CORE_DUMP complete.</p>
                  <p ref={cursorRef} className="text-white/40 animate-pulse" id="core-dump-cursor">
                    _
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Right Column: Certifications + Stats */}
          <aside className="lg:col-span-4 space-y-6 md:space-y-8 lg:sticky lg:top-28 self-start">
            {/* CERTIFICATIONS Panel */}
            <div className="bg-surface-container-lowest border border-outline-variant/20 p-4 md:p-6 relative overflow-hidden reveal-section">
              <div className="absolute top-0 left-0 w-full h-1 bg-electric-purple shadow-[0_0_10px_#bc13fe]" />
              <h3 className="font-headline-md text-sm md:text-headline-md text-white mb-4 md:mb-6 flex items-center gap-2">
                <WorkspacePremiumIcon className="text-electric-purple text-xl md:text-2xl" />
                CERTIFICATIONS
              </h3>

              {certificates.length > 0 ? (
                <div className="space-y-3">
                  {certificates.map((cert) => {
                    const isExpired = cert.expiry_date
                      ? new Date(cert.expiry_date) < new Date()
                      : false;
                    return (
                      <a
                        key={cert.id}
                        href={cert.credential_url || "#"}
                        target={cert.credential_url ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 md:p-3 bg-surface-container-low border border-outline-variant/10 hover:border-neon-cyan/40 transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-sm md:text-base text-terminal-gray group-hover:text-neon-cyan transition-colors flex-shrink-0">
                            {getCertIcon(cert.name)}
                          </span>
                          <div className="min-w-0">
                            <p className="font-code-md text-xs md:text-code-md text-on-surface group-hover:text-neon-cyan transition-colors truncate">
                              {cert.name}
                            </p>
                            {cert.issuer && (
                              <p className="font-code-md text-[10px] text-terminal-gray uppercase truncate">
                                {cert.issuer}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className="text-base flex-shrink-0">
                          {isExpired ? (
                            <CancelIcon className="text-error" />
                          ) : (
                            <CheckCircleIcon className="text-neon-cyan" />
                          )}
                        </span>
                      </a>
                    );
                  })}
                </div>
              ) : (
                <div className="text-terminal-gray font-code-md text-center p-4 border border-white/10">
                  {">"} NO_CERTS_FOUND
                </div>
              )}
            </div>

            {/* Stats Card */}
            <div className="grid grid-cols-3 gap-2 md:gap-3 reveal-section">
              <div className="bg-surface-container-lowest border border-neon-cyan/20 p-3 md:p-4 text-center hover:border-neon-cyan/60 transition-colors">
                <div className="font-headline-md text-xl md:text-headline-md text-neon-cyan">
                  {totalExperiences}
                </div>
                <div className="font-label-sm text-[10px] text-terminal-gray uppercase mt-1">Roles</div>
              </div>
              <div className="bg-surface-container-lowest border border-electric-purple/20 p-3 md:p-4 text-center hover:border-electric-purple/60 transition-colors">
                <div className="font-headline-md text-xl md:text-headline-md text-electric-purple">
                  {totalEducations}
                </div>
                <div className="font-label-sm text-[10px] text-terminal-gray uppercase mt-1">Degrees</div>
              </div>
              <div className="bg-surface-container-lowest border border-neon-cyan/20 p-3 md:p-4 text-center hover:border-neon-cyan/60 transition-colors">
                <div className="font-headline-md text-xl md:text-headline-md text-neon-cyan">
                  {totalCerts}
                </div>
                <div className="font-label-sm text-[10px] text-terminal-gray uppercase mt-1">Certs</div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Floating Console */}
      <Console
        initialLogs={[
          "> Initializing CORE_DUMP sequence...",
          "> Loading academic_records.db [OK]",
          "> Verifying cert_keys... [OK]",
          "> Timeline mapped to grid 1280px",
          "> System status: OPTIMAL",
          "> Terminal ready_",
        ]}
        dynamicLogs={[
          "> Scanning sector 7G...",
          "> Decrypting history archives...",
          "> Found: 4 certifications updated.",
          "> Trace route: 127.0.0.1 -> CLOUD_CORE",
          "> Core_dump rendered in 12ms",
          "> Power output: 1.21GW",
          "> Monitoring active sessions...",
          "> All protocols nominal.",
        ]}
      />

      <Footer profileName={profile.name} />
      <ScrollAnimations />
    </>
  );
}