import React from "react";
import SchoolIcon from "@mui/icons-material/School";

export interface EducationData {
  id: number;
  degree: string;
  institution: string;
  period: string;
  grade: number | null;
  description?: string | null;
}

interface EducationProps {
  educations?: EducationData[];
}

export default function Education({ educations = [] }: EducationProps) {
  const formatGrade = (grade: number | null): string => {
    if (grade === null) return "";
    return grade.toFixed(2);
  };

  return (
    <section className="mt-20 md:mt-32">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 md:mb-12">
        <span className="font-headline-md text-xl md:text-headline-md text-on-surface">
          ACADEMIC_RECORDS
        </span>
        <div className="grow h-px bg-white/10 relative">
          <div className="absolute top-0 left-0 h-full w-1/4 bg-electric-purple blur-[2px]"></div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {educations && educations.length > 0 ? (
          educations.map((edu) => (
            <div
              key={edu.id}
              className="group relative bg-background-surface border border-white/10 p-4 md:p-6 transition-all duration-300 hover:border-neon-cyan/50"
            >
              {/* Dekorasi sudut */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-electric-purple opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-electric-purple opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Latar belakang dekoratif */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-neon-cyan opacity-[0.03] rotate-45 pointer-events-none" />

              {/* Konten */}
              <div className="flex flex-col gap-3 md:gap-4 relative z-10">
                <SchoolIcon className="text-neon-cyan text-3xl md:text-4xl" />
                <div>
                  <h3 className="font-code-md text-sm md:text-body-lg text-neon-cyan group-hover:text-white transition-colors duration-300">
                    {edu.degree}
                  </h3>
                  <p className="font-body-md text-xs md:text-body-md text-terminal-gray mt-1">
                    {edu.institution}
                  </p>
                  {edu.grade != null && (
                    <p className="font-code-md text-[10px] md:text-code-md text-terminal-gray mt-1">
                      GPA: {formatGrade(edu.grade)}
                    </p>
                  )}
                  <span className="inline-block mt-3 md:mt-4 font-label-sm text-[10px] md:text-label-sm text-neon-cyan border border-neon-cyan/30 px-2 md:px-3 py-0.5 md:py-1">
                    {edu.period.toUpperCase().replace(/ /g, "_")}
                  </span>
                </div>
              </div>

              {/* Garis bawah animasi */}
              <div className="absolute bottom-0 left-0 w-1 h-0 bg-neon-cyan group-hover:h-full transition-all duration-500" />
            </div>
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 text-center text-terminal-gray font-code-md p-6 md:p-8 border border-white/10 bg-background-surface">
            &gt; NO_ACADEMIC_RECORDS_FOUND
          </div>
        )}
      </div>
    </section>
  );
}