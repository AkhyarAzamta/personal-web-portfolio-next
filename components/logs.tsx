import React from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CodeIcon from "@mui/icons-material/Code";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SafeImage from "@/components/safe-image";

interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image_url?: string;
  published_at?: string;
  view_count?: number;
  reading_time?: number;
  tags?: { id: number; name: string; slug: string }[];
}

interface LogsProps {
  blogs?: Blog[];
}

// Helper format tanggal
const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toISOString().slice(0, 10).replace(/-/g, ".");
};

export default function Logs({ blogs = [] }: LogsProps) {
  const displayBlogs = blogs.slice(0, 3);
  const apiURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  return (
    <section className="mt-20 md:mt-32" id="logs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 md:mb-12">
        <span className="font-headline-md text-xl md:text-headline-md text-on-surface">
          SYSTEM_LOGS
        </span>
        <div className="grow h-px bg-white/10 relative">
          <div className="absolute top-0 left-0 h-full w-1/4 bg-neon-cyan blur-[2px]" />
        </div>
        <div className="hidden md:flex">
          <a
            href="/blogs"
            className="shrink-0 flex items-center gap-2 font-code-md text-xs text-electric-purple border border-electric-purple/40 px-4 py-1.5 hover:bg-electric-purple hover:text-background transition-all duration-300 group animate-bounce hover:animate-none"
          >
            <ArrowForwardIcon className="text-[14px] group-hover:translate-x-1 transition-transform" />
            VIEW_ALL_LOGS
          </a>
        </div>
      </div>

      {/* Grid blog */}
      {displayBlogs.length > 0 ? (
        <div className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
          <>
          {displayBlogs.map((blog, i) => {
            const accent = i % 2 === 1 ? "neon-cyan" : "electric-purple";
            const accentHex = accent === "neon-cyan" ? "#00f2ff" : "#bc13fe";
            const dateStr = blog.published_at
              ? formatDate(blog.published_at)
              : "UNKNOWN";
            const tag =
              blog.tags?.[0]?.name?.toUpperCase().replace(/ /g, "_") ||
              "LOG_ENTRY";

            return (
              <article
                key={blog.id}
                className="shrink-0 w-[65%] sm:w-[60%] md:w-auto snap-center md:snap-align-none group relative bg-background-surface p-3 md:p-4 transition-all duration-300 hover:-translate-y-1"
                style={{ border: `1px solid ${accentHex}33` }}
              >
                {/* Sudut dekoratif */}
                <div
                  className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ borderColor: accentHex }}
                />
                <div
                  className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ borderColor: accentHex }}
                />

                {/* Gambar / thumbnail */}
                <div className="relative aspect-video mb-3 md:mb-4 overflow-hidden border border-white/10">
                  {blog.featured_image_url ? (
                    <SafeImage
                      alt={blog.title}
                      className="w-full h-full object-cover filter saturate-50 group-hover:saturate-100 transition-all duration-500"
                      src={blog.featured_image_url}
                      width={500}
                      height={300}
                    />
                  ) : (
                    <div className="w-full h-full bg-background-deep flex items-center justify-center">
                      <CodeIcon
                        className="text-6xl opacity-20"
                        style={{ color: accentHex }}
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-background-deep/80 to-transparent" />
                  <div className="absolute bottom-1 left-1 md:bottom-2 md:left-2">
                    <span
                      className="font-label-sm text-[10px] px-1 md:px-2 py-0.5 border"
                      style={{
                        color: accentHex,
                        borderColor: `${accentHex}4d`,
                        backgroundColor: `${accentHex}1a`,
                      }}
                    >
                      [{tag}]
                    </span>
                  </div>
                  {blog.reading_time && (
                    <div className="absolute top-1 right-1 md:top-2 md:right-2 bg-background-deep/80 backdrop-blur-sm px-1.5 md:px-2 py-0.5 font-code-md text-[10px] md:text-[10px] text-terminal-gray border border-white/10">
                      {blog.reading_time} MIN READ
                    </div>
                  )}
                </div>

                {/* Detail teks */}
                <div className="pt-2">
                  <p className="font-code-md text-[10px] md:text-[10px] text-terminal-gray/60 mb-1 md:mb-2 uppercase tracking-widest">
                    TS: [{dateStr}] // VIEWS: {blog.view_count || 0}
                  </p>
                  <h4 className="font-code-md text-xs md:text-body-lg text-white mb-1 md:mb-2 line-clamp-2 transition-colors duration-300">
                    {blog.title}
                  </h4>
                  <p className="font-body-md text-[10px] md:text-code-md text-terminal-gray mb-3 md:mb-6 line-clamp-2 md:line-clamp-3">
                    {blog.excerpt}
                  </p>
                  <a
                    href={`${apiURL}/blogs/${blog.slug || blog.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-1.5 md:py-2 flex items-center justify-center gap-1 md:gap-2 bg-transparent font-label-sm text-[10px] uppercase tracking-[0.2em] transition-all duration-300 group/btn"
                    style={{ border: `1px solid ${accentHex}`, color: accentHex }}
                  >
                    READ_LOG
                    <ArrowForwardIosIcon className="text-[10px] md:text-[12px] transition-transform group-hover/btn:translate-x-1" />
                  </a>
                </div>
              </article>
            );
          })}
          
          {/* Mobile View All Button at the end of Carousel */}
          <div className="shrink-0 w-[50%] sm:w-[40%] md:hidden snap-center flex items-stretch">
            <a
              href="/blogs"
              className="w-full flex flex-col items-center justify-center gap-3 font-code-md text-xs text-electric-purple border border-electric-purple/40 p-4 hover:bg-electric-purple hover:text-background transition-all duration-300 group bg-background-surface animate-pulse hover:animate-none"
            >
              <ArrowForwardIcon className="text-3xl group-hover:translate-x-2 transition-transform" />
              <span>VIEW_ALL</span>
            </a>
          </div>
        </>
        </div>
      ) : (
        <div className="shrink-0 w-full text-center text-terminal-gray font-code-md p-6 md:p-8 border border-white/10 bg-background-surface">
          &gt; NO_LOG_ENTRIES_FOUND // API_OFFLINE_OR_EMPTY
        </div>
      )}

    </section>
  );
}