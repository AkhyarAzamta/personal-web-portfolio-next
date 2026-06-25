import React from "react";
import TerminalIcon from "@mui/icons-material/Terminal";
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import CodeIcon from "@mui/icons-material/Code";
import ExtensionIcon from "@mui/icons-material/Extension";
import SafeImage from "@/components/safe-image";

export interface SkillData {
  id: number;
  level: string; // "beginner", "intermediate", "advanced"
  experience_months: number;
  is_primary: boolean;
  technology: {
    id: number;
    name: string;
    icon_url: string;
    color: string;
  };
  job_position: {
    id: number;
    name: string;
  } | null;
}

export interface JobPositionData {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon_url: string | null;
  color: string;
  technologies?: TechnologyData[]; // opsional
}

interface TechnologyData {
  id: number;
  name: string;
  icon_url: string;
  color: string;
}

interface SkillsProps {
  skills?: SkillData[];
  job_positions?: JobPositionData[];
}

export default function Skills({ skills = [], job_positions = [] }: SkillsProps) {
  // Group primary skills by job_position.id (since API doesn't include technologies in job_positions)
  const techsByJobPosition = skills
    .filter((skill) => skill.is_primary && skill.job_position)
    .reduce<Record<number, TechnologyData[]>>((acc, skill) => {
      const jobId = skill.job_position!.id;
      if (!acc[jobId]) acc[jobId] = [];
      const alreadyAdded = acc[jobId].find((t) => t.name === skill.technology.name);
      if (!alreadyAdded) acc[jobId].push(skill.technology);
      return acc;
    }, {});

  // Non-primary skills deduplicated
  const uniqueAdditionalSkills = skills
    .filter((skill) => !skill.is_primary)
    .reduce<SkillData[]>((acc, current) => {
      const exists = acc.find(
        (item) => item.technology.name === current.technology.name
      );
      if (!exists) acc.push(current);
      return acc;
    }, []);

  return (
    <section className="mt-20 md:mt-32" id="skills">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 md:mb-12">
        <span className="font-headline-md text-xl md:text-headline-md text-on-surface">
          SYSTEM_SKILLS
        </span>
        <div className="grow h-px bg-white/10 relative">
          <div className="absolute top-0 left-0 h-full w-1/4 bg-neon-cyan blur-[2px]" />
        </div>
      </div>

      <div className="space-y-8 md:space-y-12">
        {job_positions.map((job) => {
          const techs = techsByJobPosition[job.id] || [];
          return (
          <div key={job.id}>
            <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-6">
              <TerminalIcon className="text-xl md:text-2xl text-neon-cyan" />
              <h3 className="font-headline-md text-sm md:text-body-lg text-neon-cyan uppercase tracking-widest">
                {job.name.replace(/ /g, "_").toUpperCase()}
              </h3>
            </div>
            <div className="flex flex-wrap gap-3 md:gap-4 skill-group">
              {techs.map((tech) => (
                <div key={tech.id} className="skill-item">
                  <div
                    className="group relative bg-background-surface border border-white/10 px-4 py-2 hover:border-neon-cyan transition-all duration-300 flex items-center gap-2 overflow-hidden cursor-crosshair hover:-translate-y-0.5 hover:shadow-[0_0_10px_rgba(0,242,255,0.2)]"
                  >
                    <div className="absolute inset-0 bg-neon-cyan/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                    <div className="absolute left-0 top-0 w-1 h-full bg-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {tech.icon_url ? (
                      <SafeImage
                        src={tech.icon_url}
                        alt={tech.name}
                        className="skill-icon w-4 h-4 md:w-6 md:h-6 object-contain relative z-10 filter grayscale-0 group-hover:grayscale transition-all duration-300"
                        width={24}
                        height={24}
                      />
                    ) : (
                      <CodeIcon className="text-lg md:text-2xl text-neon-cyan relative z-10 group-hover:animate-pulse" />
                    )}
                    <span className="font-code-md text-xs md:text-[13px] text-on-surface group-hover:text-white transition-colors relative z-10">
                      {tech.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          );
        })}


        {/* Additional skills */}
        {uniqueAdditionalSkills.length > 0 && (
          <div>
            <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-6">
              <TipsAndUpdatesIcon className="text-xl md:text-2xl text-electric-purple" />
              <h3 className="font-headline-md text-sm md:text-body-lg text-electric-purple uppercase tracking-widest">
                EXPERIMENTAL_STACK
              </h3>
            </div>
            <div className="flex flex-wrap gap-4 skill-group">
              {uniqueAdditionalSkills.map((skill) => (
                <div key={skill.id} className="skill-item">
                  <div
                    className="flex items-center gap-2 bg-background-deep border border-electric-purple/30 px-4 py-2 hover:border-electric-purple transition-colors duration-300 group hover:-translate-y-0.5 hover:shadow-[0_0_10px_rgba(188,19,254,0.2)]"
                  >
                    {skill.technology.icon_url ? (
                      <SafeImage
                        src={skill.technology.icon_url}
                        alt={skill.technology.name}
                        className="skill-icon w-4 h-4 md:w-6 md:h-6 object-contain filter grayscale-0 group-hover:grayscale transition-all duration-300"
                        width={24}
                        height={24}
                      />
                    ) : (
                      <ExtensionIcon className="text-electric-purple text-lg md:text-[24px] group-hover:animate-pulse" />
                    )}
                    <span className="font-code-md text-xs md:text-[13px] text-on-surface group-hover:text-electric-purple transition-colors">
                      {skill.technology.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}