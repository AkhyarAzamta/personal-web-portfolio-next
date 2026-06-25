import React from "react";

export interface ExperienceData {
  id: number;
  title: string;
  company: string;
  period: string;
  description: string[] | string;
  is_current: boolean;
}

interface ExperienceProps {
  experiences?: ExperienceData[];
}

export default function Experience({ experiences = [] }: ExperienceProps) {
  const getDescriptionArray = (desc: string[] | string): string[] => {
    if (Array.isArray(desc)) return desc;
    if (typeof desc === "string") return desc.split("\n").filter(Boolean);
    return [];
  };

  return (
    <section className="mt-20 md:mt-32" id="history">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 md:mb-12">
        <span className="font-headline-md text-xl md:text-headline-md text-on-surface">
          WORK_HISTORY
        </span>
        <div className="grow h-px bg-white/10 relative">
          <div className="absolute top-0 left-0 h-full w-1/4 bg-neon-cyan blur-[2px]"></div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative ml-4 pl-12 timeline-line space-y-8 md:space-y-12">
        {experiences && experiences.length > 0 ? (
          experiences.map((exp) => (
            <div key={exp.id} className="relative group">
              {/* Dot timeline */}
              <div
                className={`
                  absolute -left-13.5 top-2 w-4 h-4 bg-background border-2 
                  rounded-full z-10 transition-colors duration-300
                  ${exp.is_current
                    ? "border-neon-cyan group-hover:bg-neon-cyan"
                    : "border-terminal-gray group-hover:border-neon-cyan"
                  }
                `}
              ></div>

              {/* Header row: title/company ↔ period/badge */}
              <div className="flex flex-col md:flex-row md:justify-between items-start mb-3 md:mb-4">
                <div>
                  <h3 className="font-code-md text-sm md:text-lg md:text-body-lg text-neon-cyan group-hover:text-white transition-colors duration-300 mb-1">
                    {exp.title}
                  </h3>
                  <p className="font-label-sm text-[10px] md:text-label-sm text-on-surface-variant uppercase tracking-wider">
                    {exp.company.replace(/[^a-zA-Z0-9 ]/g, "").replace(/ /g, "_").toUpperCase()}
                  </p>
                </div>
                <div className="flex items-center gap-2 md:gap-3 mt-1 md:mt-0">
                  <span className="font-code-md text-[10px] md:text-code-md text-terminal-gray">
                    {exp.period.toUpperCase()}
                  </span>
                  <span
                    className={`font-code-md text-[10px] px-2 py-0.5 border ${
                      exp.is_current
                        ? "text-neon-cyan bg-neon-cyan/10 border-neon-cyan/30"
                        : "text-terminal-gray bg-white/5 border-white/10"
                    }`}
                  >
                    {exp.is_current ? "[ACTIVE]" : "[ARCHIVED]"}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="font-code-md text-xs md:text-[13px] text-terminal-gray max-w-2xl space-y-1 md:space-y-2 pl-4 border-l border-white/10 group-hover:border-neon-cyan/50 transition-colors">
                {getDescriptionArray(exp.description).map((desc, idx) => (
                  <p key={idx}>&gt; {desc}</p>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-terminal-gray font-code-md">
            &gt; NO_HISTORY_RECORDS_FOUND
          </div>
        )}
      </div>
    </section>
  );
}