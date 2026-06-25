import React from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SafeImage from "@/components/safe-image";

interface Technology {
  id: number;
  name: string;
  icon_url: string;
  color?: string;
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

interface Project {
  id: number;
  title: string;
  description: string;
  image_url: string;
  demoLink?: string;
  sourceCode?: string;
  price?: string;
  technologies?: Technology[];
  categories?: Category[];
  stats?: Stats;
}

interface ProjectsProps {
  projects?: Project[];
}

export default function Projects({ projects = [] }: ProjectsProps) {
  return (
    <section className="mt-20 md:mt-32" id="projects">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 md:mb-12">
        <span className="font-headline-md text-xl md:text-headline-md text-on-surface">
          CORE_DUMP
        </span>
        <div className="grow h-px bg-white/10 relative">
          <div className="absolute top-0 left-0 h-full w-1/4 bg-electric-purple blur-[2px]"></div>
        </div>
        <div className="hidden md:flex">
          <a
            href="/projects"
            className="shrink-0 flex items-center gap-2 font-code-md text-xs text-neon-cyan border border-neon-cyan/40 px-4 py-1.5 hover:bg-neon-cyan hover:text-background transition-all duration-300 group animate-bounce hover:animate-none"
          >
            <ArrowForwardIcon className="text-[14px] group-hover:translate-x-1 transition-transform" />
            VIEW_ALL_PROJECTS
          </a>
        </div>
      </div>

      {/* Grid Projects */}
      <div className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
        {projects && projects.length > 0 ? (
          <>
            {projects.map((project, index) => (
              <div
                key={project.id || index}
                className="shrink-0 w-[85%] sm:w-[60%] md:w-auto snap-center md:snap-align-none group relative bg-background-surface border border-white/10 hover:border-neon-cyan/50 transition-all duration-300 p-3 md:p-4"
              >
              {/* Dekorasi garis tepi */}
              <div className="absolute top-0 left-0 w-full h-1 bg-electric-purple/20 group-hover:bg-neon-cyan transition-colors duration-300"></div>
              <div className="absolute top-0 left-0 w-1 h-full bg-electric-purple/20 group-hover:bg-neon-cyan transition-colors duration-300"></div>

              {/* Gambar */}
              <div className="relative overflow-hidden h-24 md:h-48 mb-3 md:mb-4 border border-white/10 flex items-center justify-center bg-background-deep">
                {project.image_url && !project.image_url.includes("default.png") ? (
                  <SafeImage
                    alt={project.title}
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 opacity-80 group-hover:opacity-100"
                    src={project.image_url}
                    width={500}
                    height={300}
                  />
                ) : (
                  <span className="font-code-md text-terminal-gray">
                    DATA_STREAM_ERR: [IMAGE_NOT_FOUND]
                  </span>
                )}
                <div className="absolute inset-0 bg-neon-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay"></div>
              </div>

              {/* Judul & status */}
              <div className="flex flex-col md:flex-row justify-between md:items-start mb-2 md:mb-3 gap-1 md:gap-0">
                <h3
                  className="font-code-md text-xs md:text-body-lg text-neon-cyan group-hover:text-white transition-colors duration-300 glitch-hover line-clamp-2 md:line-clamp-1"
                  data-text={project.title}
                >
                  {project.title}
                </h3>
                <span className="font-code-md text-[10px] text-terminal-gray border border-white/20 px-1 md:px-2 py-0.5 md:py-1 shrink-0 group-hover:border-neon-cyan/30 self-start">
                  SYS_OK
                </span>
              </div>

              {/* Deskripsi */}
              <p className="font-body-md text-xs md:text-body-md text-terminal-gray mb-3 md:mb-4 line-clamp-2 md:line-clamp-3">
                {project.description}
              </p>

              {/* Teknologi */}
              <div className="flex gap-1 md:gap-2 flex-wrap">
                {project.technologies?.slice(0, 3).map((tech) => (
                  <span
                    key={tech.id}
                    className="font-code-md text-[10px] bg-background-deep border border-white/20 px-1.5 md:px-2 py-0.5 md:py-1 text-terminal-gray group-hover:border-white/40 transition-colors flex items-center gap-1"
                  >
                    <SafeImage
                      src={tech.icon_url}
                      alt={tech.name.toUpperCase()}
                      className="w-3 h-3 md:w-5 md:h-5"
                      width={20}
                      height={20}
                    />
                    {tech.name.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
            ))}
            
            {/* Mobile View All Button at the end of Carousel */}
            <div className="shrink-0 w-[50%] sm:w-[40%] md:hidden snap-center flex items-stretch">
              <a
                href="/projects"
                className="w-full flex flex-col items-center justify-center gap-3 font-code-md text-xs text-neon-cyan border border-neon-cyan/40 p-4 hover:bg-neon-cyan hover:text-background transition-all duration-300 group bg-background-surface animate-pulse hover:animate-none"
              >
                <ArrowForwardIcon className="text-3xl group-hover:translate-x-2 transition-transform" />
                <span>VIEW_ALL</span>
              </a>
            </div>
          </>
        ) : (
          <div className="col-span-1 md:col-span-3 shrink-0 w-full text-center text-terminal-gray font-code-md p-6 md:p-8 border border-white/10 bg-background-surface">
            &gt; NO_PROJECT_DATA_FOUND
          </div>
        )}
      </div>

    </section>
  );
}