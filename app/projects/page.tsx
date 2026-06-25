"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Console from "@/components/console";
import ScrollAnimations from "@/components/scroll-animations";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import Image from "next/image";
import SafeImage from "@/components/safe-image";
import LoadingScreen from "@/components/loading-screen";

// ─── Tipe Data ──────────────────────────────────────────────────────────────

interface Technology {
  id: number;
  name: string;
  icon_url: string;
  color: string;
}

interface Category {
  id: number;
  name: string;
  icon_url: string | null;
  color: string;
}

interface Stats {
  downloads_count: number;
  views_count: number;
  average_rating: number;
  favorites_count: number;
  purchases_count: number;
  reviews_count: number;
  total_revenue: number; // Sekarang selalu ada
}

interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  image_url: string;
  demoLink: string;
  sourceCode: string;
  price: string;
  technologies: Technology[];
  categories: Category[];
  stats: Stats;
}

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

// Response API: { success: true, data: Project[], meta: { current_page, last_page, per_page, total } }
interface ProjectsResponse {
  success: boolean;
  data: Project[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// ─── Halaman ──────────────────────────────────────────────────────────────────

export default function ProjectsPage() {
  const [profile, setProfile] = useState<Profile>({
    id: 0,
    name: "Akhyar Azamta",
    email: "",
    phone_number: "",
    bio: "",
    photo_profile_url: "",
    social_media: {},
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingScreenDone, setLoadingScreenDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch profile
        const profileRes = await fetch(`${apiUrl}/api/v1/portfolio/akhyarazamta`);
        if (profileRes.ok) {
          const profileJson = await profileRes.json();
          if (profileJson.success && profileJson.data.profile) {
            setProfile(profileJson.data.profile);
          }
        }

        // 2. Fetch projects
        const projectsRes = await fetch(`${apiUrl}/api/v1/portfolio/akhyarazamta/projects`);
        if (projectsRes.ok) {
          const projectsJson: ProjectsResponse = await projectsRes.json();
          if (projectsJson.success) {
            const projectList = projectsJson.data || [];
            setProjects(projectList);
            setTotalProjects(projectsJson.meta?.total || projectList.length);
          }
        }

      } catch (err) {
        console.error("Error fetching projects data:", err);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  // ─── Metrics ────────────────────────────────────────────────────────────────

  const totalTechnologies = new Set(
    projects.flatMap((p) => p.technologies?.map((t) => t.name) || [])
  ).size;

  const totalViews = projects.reduce(
    (sum, p) => sum + (p.stats?.views_count || 0),
    0
  );

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

  return (
    <>
      <Header profile={profile} activePage="PROJECTS" />

      <main className="relative pt-14 md:pt-28 pb-24 md:pb-16 px-4 md:px-margin-desktop max-w-container-max mx-auto">
        {/* Hero Header */}
        <header className="mb-8 md:mb-16 reveal-section">
          <div className="inline-flex items-center gap-2 px-2 py-1 mb-3 md:mb-4 bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan font-code-md text-[10px] md:text-xs tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
            STATUS: REPOSITORIES_SYNCED
          </div>
          <h1 className="font-headline-xl text-3xl md:text-6xl lg:text-headline-xl text-white mb-2 md:mb-4 glitch-text uppercase">
            PROJECT_ARCHIVE<span className="text-neon-cyan animate-pulse">_</span>
          </h1>
          <p className="font-body-md text-xs md:text-body-lg text-terminal-gray max-w-2xl">
            Technical breakdown of primary architectural builds and protocol implementations.
          </p>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-gutter">
          {/* Left Column: PROJECT_REPOS */}
          <section className="lg:col-span-8 space-y-8 md:space-y-12">
            <h2 className="font-headline-md text-base md:text-headline-md text-neon-cyan mb-4 md:mb-8 flex items-center gap-2 md:gap-3 reveal-section">
              <FolderOpenIcon className="text-xl md:text-2xl" />
              PROJECT_REPOS
            </h2>
            <div className="relative border-l border-outline-variant/30 ml-3 md:ml-4 pl-6 md:pl-10 space-y-10 md:space-y-16">
              {projects.length > 0 ? (
                projects.map((project, index) => {
                  const isLatest = index === 0;
                  const isExperimental = index % 3 === 2;

                  let hexColor = "#00f2ff";
                  if (isExperimental) {
                    hexColor = "#bc13fe";
                  } else if (index % 3 === 1) {
                    hexColor = "#db2777";
                  }

                  const status =
                    project.categories && project.categories.length > 0
                      ? `[${project.categories[0].name.toUpperCase().replace(/ /g, "_")}]`
                      : isLatest
                        ? "[ACTIVE_REL]"
                        : isExperimental
                          ? "[EXPERIMENTAL]"
                          : "[STABLE]";

                  return (
                    <div key={project.id} className="relative fade-in-up">
                      {/* Timeline Dot */}
                      <div
                        className={`absolute -left-[34px] md:-left-[51px] top-0 w-3 h-3 md:w-5 md:h-5 ${
                          isLatest ? `shadow-[0_0_10px_${hexColor}]` : "bg-outline-variant"
                        }`}
                        style={isLatest ? { background: hexColor } : {}}
                      />

                      {/* Project Header */}
                      <div className="mb-3 md:mb-4">
                        <p
                          className="font-label-sm text-[10px] mb-1 uppercase tracking-widest"
                          style={{ color: `${hexColor}60` }}
                        >
                          /ROOT/
                          {project.title.replace(/[^a-zA-Z0-9]/g, "_").toUpperCase().slice(0, 30)}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 md:gap-4">
                          <h3 className="font-headline-md text-base md:text-headline-md text-white">
                            {project.title}
                          </h3>
                          <span
                            className="self-start font-code-md text-[10px] px-2 py-0.5 border shrink-0"
                            style={
                              isLatest
                                ? {
                                    background: `${hexColor}20`,
                                    borderColor: `${hexColor}80`,
                                    color: hexColor,
                                  }
                                : { borderColor: "rgba(255,255,255,0.1)", color: "#888" }
                            }
                          >
                            {status}
                          </span>
                        </div>
                      </div>

                      {/* Project Content - menggunakan CSS variable untuk hover border */}
                      <a
                        href={`${apiUrl}/projects/${project.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 md:p-6 bg-surface-container-low/50 border border-outline-variant/10 group transition-all hover:border-opacity-50 project-card"
                        style={{ "--hover-border": hexColor } as React.CSSProperties}
                      >
                        <div
                          className={`grid ${project.image_url ? "sm:grid-cols-2" : "grid-cols-1"} gap-3 md:gap-6`}
                        >
                          {project.image_url && index % 2 === 1 && (
                            <div className="h-28 md:h-40 bg-background-deep border border-white/5 overflow-hidden">
                            <SafeImage
                                alt={project.title}
                                className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                                src={project.image_url}
                                width={500}
                                height={300}
                              />
                            </div>
                          )}

                          <div className="space-y-2 md:space-y-4">
                            <p className="font-body-md text-xs md:text-body-md text-terminal-gray line-clamp-3">
                              {project.description}
                            </p>
                            <div className="flex flex-wrap gap-1 md:gap-2">
                              {project.technologies?.slice(0, 5).map((tech) => (
                                <span
                                  key={tech.id}
                                  className="font-code-md text-[10px] px-1.5 py-0.5 md:px-2 md:py-1 uppercase border"
                                  style={{
                                    color: hexColor,
                                    background: `${hexColor}10`,
                                    borderColor: `${hexColor}40`,
                                  }}
                                >
                                  {tech.name}
                                </span>
                              ))}
                            </div>
                          </div>

                          {project.image_url && index % 2 === 0 && (
                            <div className="h-28 md:h-40 bg-background-deep border border-white/5 overflow-hidden">
                            <SafeImage
                                alt={project.title}
                                className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                                src={project.image_url}
                                width={500}
                                height={300}
                              />
                            </div>
                          )}
                        </div>
                      </a>
                    </div>
                  );
                })
              ) : (
                <div className="text-terminal-gray font-code-md p-8 border border-white/10 bg-background-surface text-center">
                  &gt; NO_PROJECT_RECORDS_FOUND // API_OFFLINE_OR_EMPTY
                </div>
              )}
            </div>
          </section>

          {/* Right Column: Side Panel */}
          <aside className="lg:col-span-4 space-y-6 md:space-y-12 lg:sticky lg:top-28 self-start">
            {/* PROJECT_METRICS */}
            <div className="bg-surface-container-lowest border border-outline-variant/20 p-4 md:p-6 relative overflow-hidden reveal-section">
              <div className="absolute top-0 left-0 w-full h-1 bg-electric-purple shadow-[0_0_10px_#bc13fe]" />
              <h3 className="font-headline-md text-sm md:text-headline-md text-white mb-4 md:mb-6 flex items-center gap-2">
                <AnalyticsIcon className="text-electric-purple text-xl md:text-2xl" />
                PROJECT_METRICS
              </h3>
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center justify-between p-2 md:p-3 bg-surface-container-low border border-outline-variant/10">
                  <div className="flex flex-col">
                    <span className="font-code-md text-xs md:text-code-md text-on-surface">
                      Total Projects
                    </span>
                    <span className="text-[10px] text-terminal-gray uppercase">deployed modules</span>
                  </div>
                  <span className="font-code-md text-sm md:text-base text-neon-cyan">
                    {totalProjects}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 md:p-3 bg-surface-container-low border border-outline-variant/10">
                  <div className="flex flex-col">
                    <span className="font-code-md text-xs md:text-code-md text-on-surface">
                      Tech Stack Breadth
                    </span>
                    <span className="text-[10px] text-terminal-gray uppercase">unique protocols</span>
                  </div>
                  <span className="font-code-md text-sm md:text-base text-neon-cyan">
                    {totalTechnologies}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 md:p-3 bg-surface-container-low border border-outline-variant/10">
                  <div className="flex flex-col">
                    <span className="font-code-md text-xs md:text-code-md text-on-surface">
                      Network Traffic
                    </span>
                    <span className="text-[10px] text-terminal-gray uppercase">total views</span>
                  </div>
                  <span className="font-code-md text-sm md:text-base text-neon-cyan">
                    {totalViews}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Console */}
      <Console
        initialLogs={[
          "> Initializing PROJECT_ARCHIVE_UPLINK...",
          "> Syncing repository data... [OK]",
          `> Fetching ${totalProjects} registered commits...`,
          "> Connection established: NODE_AZ_01",
        ]}
        dynamicLogs={[
          "> Pulling branch 'prod-main'...",
          "> Building components array...",
          "> Optimization phase: SUCCESS",
          "> Shifting traffic to secondary cluster...",
          "> Security handshake: VERIFIED",
          "> Kernel updated to latest build",
          "> Syncing neural mapping buffers...",
        ]}
      />

      <Footer profileName={profile.name} />
      <ScrollAnimations />
    </>
  );
}