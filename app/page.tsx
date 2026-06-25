"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Projects from "@/components/projects";
import Experience from "@/components/experience";
import Education from "@/components/education";
import Certifications from "@/components/certifications";
import Logs from "@/components/logs";
import Skills from "@/components/skills";
import Contact from "@/components/contact";
import Console from "@/components/console";
import ScrollAnimations from "@/components/scroll-animations";
import LoadingScreen from "@/components/loading-screen";

// ─── Tipe Data ────────────────────────────────────────────────────────────────

interface SocialMedia {
  github?: string;
  linkedin?: string;
  instagram?: string;
  [key: string]: string | undefined;
}

interface Profile {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  bio: string;
  photo_profile_url: string;
  social_media: SocialMedia;
}

interface Technology {
  id: number;
  name: string;
  icon_url: string;
  color: string;
}

export interface JobPosition {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon_url: string | null;
  color: string;
  technologies?: Technology[]; // opsional
}

export interface Skill {
  id: number;
  level: string; // "beginner" | "intermediate" | "advanced"
  experience_months: number;
  is_primary: boolean;
  technology: Technology;
  job_position: {
    id: number;
    name: string;
  } | null;
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
  total_revenue?: number;
}

export interface Project {
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

export interface Experience {
  id: number;
  title: string;
  company: string;
  period: string;
  description: string[] | string;
  is_current: boolean;
}

export interface Education {
  id: number;
  degree: string;
  institution: string;
  period: string;
  description: string | null;
  grade: number | null;
}

export interface Certificate {
  id: number;
  name: string;
  issuer: string;
  issue_date: string;
  expiry_date: string;
  credential_url: string;
  image_url: string;
}

interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image_url: string;
  published_at: string;
  view_count: number;
  reading_time: number;
  tags: Tag[];
}

interface PortfolioData {
  profile: Profile;
  job_positions: JobPosition[];
  skills: Skill[];
  projects: Project[];
  experiences: Experience[];
  educations: Education[];
  certificates: Certificate[];
  blogs: Blog[];
}

// ─── Halaman ──────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingScreenDone, setLoadingScreenDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/v1/portfolio/akhyarazamta`);
        if (!res.ok) throw new Error("Gagal mengambil data portfolio");
        const json = await res.json();
        if (!json.success) throw new Error("API mengembalikan success: false");
        setPortfolioData(json.data);
      } catch (err) {
        console.error("Error fetching portfolio:", err);
        setError("Gagal memuat data portfolio. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  // Scroll to hash after loading screen is completely done
  useEffect(() => {
    if (loadingScreenDone && window.location.hash) {
      const id = window.location.hash.substring(1);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [loadingScreenDone]);

  if (!loadingScreenDone) {
    return <LoadingScreen isLoading={loading} onComplete={() => setLoadingScreenDone(true)} />;
  }

  if (error || !portfolioData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-deep">
        <div className="text-error font-code-md">{error || "Data tidak ditemukan"}</div>
      </div>
    );
  }

  const { profile, projects, experiences, educations, certificates, skills, job_positions, blogs } =
    portfolioData;
  return (
    <>
      <Header profile={profile} activePage="TERMINAL" />
      <main className="pt-24 pb-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto relative z-10">
        <Hero profile={profile} />
        <Projects projects={projects} />
        <Experience experiences={experiences} />
        <Education educations={educations} />
        <Certifications certificates={certificates} />
        <Logs blogs={blogs} />
        <Skills skills={skills} job_positions={job_positions} />
        <Contact />
      </main>
      <Console />
      <Footer profileName={profile.name} />
      <ScrollAnimations />
    </>
  );
}