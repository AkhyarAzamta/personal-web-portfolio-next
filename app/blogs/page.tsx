"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Console from "@/components/console";
import ScrollAnimations from "@/components/scroll-animations";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CodeIcon from "@mui/icons-material/Code";
import SafeImage from "@/components/safe-image";
import LoadingScreen from "@/components/loading-screen";
import { getCached, setCache } from "@/lib/data-cache";

// ─── Tipe Data ──────────────────────────────────────────────────────────────

interface Tag {
  id: number;
  name: string;
  slug: string;
}

interface Blog {
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

interface BlogsResponse {
  success: boolean;
  data: Blog[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toISOString().slice(0, 10).replace(/-/g, ".");
}

// ─── Halaman ──────────────────────────────────────────────────────────────────

export default function BlogsPage() {
  type BlogsCache = { blogs: Blog[]; currentPage: number; lastPage: number; total: number };
  const initialCacheKey = "portfolio_blogs_page_1";
  const initialCache = getCached<BlogsCache>(initialCacheKey);

  const [blogs, setBlogs] = useState<Blog[]>(() => initialCache?.blogs ?? []);
  const [currentPage, setCurrentPage] = useState(() => initialCache?.currentPage ?? 1);
  const [lastPage, setLastPage] = useState(() => initialCache?.lastPage ?? 1);
  const [totalBlogs, setTotalBlogs] = useState(() => initialCache?.total ?? 0);
  const [loading, setLoading] = useState(() => initialCache === null);
  const [loadingScreenDone, setLoadingScreenDone] = useState(() => initialCache !== null);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    const cacheKey = `portfolio_blogs_page_${currentPage}`;
    const cached = getCached<BlogsCache>(cacheKey);

    // Jika halaman ini sudah pernah di-fetch, tampilkan dari cache tanpa loading
    if (cached) {
      setBlogs(cached.blogs);
      setLastPage(cached.lastPage);
      setTotalBlogs(cached.total);
      return;
    }

    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/api/v1/portfolio/akhyarazamta/blogs?page=${currentPage}`);
        if (!res.ok) throw new Error("Failed to fetch blogs");
        const json: BlogsResponse = await res.json();
        if (json.success) {
          const blogData = json.data || [];
          const meta = { currentPage: json.meta?.current_page || 1, lastPage: json.meta?.last_page || 1, total: json.meta?.total || 0 };
          setBlogs(blogData);
          setCurrentPage(meta.currentPage);
          setLastPage(meta.lastPage);
          setTotalBlogs(meta.total);
          setCache<BlogsCache>(cacheKey, { blogs: blogData, ...meta });
        } else {
          throw new Error("API returned success: false");
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [apiUrl, currentPage]);

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
      <Header activePage="LOGS" />

      <main className="pt-14 md:pt-28 pb-24 md:pb-16 px-4 md:px-margin-desktop max-w-container-max mx-auto relative z-10">
        {/* Page Header */}
        <header className="mb-10 md:mb-16 border-l-2 md:border-l-4 border-neon-cyan pl-4 md:pl-6 reveal-section">
          <div className="inline-flex items-center gap-2 px-2 py-1 mb-3 md:mb-4 bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan font-code-md text-[10px] md:text-xs tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
            STATUS: LOGS_INDEXED
          </div>
          <h1 className="font-headline-xl text-3xl md:text-6xl lg:text-8xl tracking-tighter uppercase mb-2 terminal-glow">
            DATALAKE_LOGS
          </h1>
          <p className="font-code-md text-xs md:text-code-md text-terminal-gray uppercase tracking-[0.2em] md:tracking-[0.3em] mt-2">
            A persistent stream of system insights
          </p>
          {totalBlogs > 0 && (
            <p className="font-code-md text-[10px] md:text-xs text-neon-cyan/60 mt-2 uppercase tracking-widest">
              &gt; {totalBlogs} ENTRIES // PAGE {currentPage}/{lastPage}
            </p>
          )}
        </header>

        {/* Blogs Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-gutter">
          {blogs.length > 0 ? (
            blogs.map((blog, i) => {
              const accent = i % 2 === 1 ? "electric-purple" : "neon-cyan";
              const accentHex = accent === "neon-cyan" ? "#00f2ff" : "#bc13fe";
              const dateStr = blog.published_at ? formatDate(blog.published_at) : "UNKNOWN";
              return (
                <article
                  key={blog.id}
                  className="reveal-card glass-panel group relative flex flex-col h-full border-t-2 transition-all duration-500"
                  style={{ borderTopColor: accentHex }}
                >
                  <div className="aspect-video relative overflow-hidden">
                    {blog.featured_image_url ? (
                      <SafeImage
                        className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                        src={blog.featured_image_url}
                        alt={blog.title}
                        width={500}
                        height={300}
                      />
                    ) : (
                      <div className="w-full h-full bg-background-deep flex items-center justify-center">
                        <CodeIcon
                          className="text-4xl md:text-6xl opacity-20"
                          style={{ color: accentHex }}
                        />
                      </div>
                    )}
                    <div
                      className="absolute top-2 left-2 md:top-4 md:left-4 bg-background-deep/80 backdrop-blur-md px-2 py-0.5 md:px-3 md:py-1 font-code-md text-[10px] md:text-xs border"
                      style={{ color: accentHex, borderColor: `${accentHex}4d` }}
                    >
                      [{blog.view_count || 0} VIEWS]
                    </div>
                    {blog.reading_time && (
                      <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-background-deep/80 backdrop-blur-md px-2 py-0.5 md:px-2 md:py-1 font-code-md text-[10px] md:text-xs text-terminal-gray border border-white/10">
                        {blog.reading_time}MIN
                      </div>
                    )}
                  </div>
                  <div className="p-3 md:p-6 flex flex-col grow">
                    <div className="font-code-md text-[10px] md:text-xs text-terminal-gray mb-2 md:mb-4 flex justify-between gap-2">
                      <span className="truncate">TS: [{dateStr}]</span>
                    </div>
                    <h2
                      className="font-headline-md text-sm md:text-base text-on-background mb-2 md:mb-3 leading-snug line-clamp-2"
                      style={{ transition: "color 0.3s" }}
                    >
                      {blog.title}
                    </h2>
                    <p className="text-terminal-gray text-xs md:text-sm mb-3 md:mb-4 line-clamp-2 md:line-clamp-3 font-body-md grow">
                      {blog.excerpt}
                    </p>
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 md:gap-1.5 mb-3 md:mb-6">
                        {blog.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag.id}
                            className="font-code-md text-[10px] text-terminal-gray bg-white/5 border border-white/10 px-1.5 py-0.5 uppercase"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="mt-auto">
                      <a
                        href={`${apiUrl}/blogs/${blog.slug || blog.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full border py-2 md:py-3 font-code-md text-[10px] md:text-xs flex items-center justify-center gap-1 md:gap-2 transition-all duration-300 hover:opacity-80"
                        style={{ color: accentHex, borderColor: accentHex }}
                      >
                        READ_LOG
                        <ArrowForwardIosIcon className="text-[12px] md:text-sm transition-transform group-hover:translate-x-1" />
                      </a>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="col-span-full text-center text-terminal-gray font-code-md p-8 md:p-16 border border-white/10 bg-background-surface text-xs md:text-sm">
              &gt; NO_LOG_ENTRIES_FOUND // API_OFFLINE_OR_EMPTY
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {lastPage > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-12 reveal-section">
            <button
              onClick={() => {
                setCurrentPage((p) => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={currentPage === 1}
              className="px-4 py-2 font-code-md text-xs md:text-sm border border-white/20 disabled:opacity-30 disabled:cursor-not-allowed hover:border-neon-cyan hover:text-neon-cyan transition-colors bg-surface-container-low"
            >
              &laquo; PREV
            </button>
            
            {Array.from({ length: lastPage }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-code-md text-xs md:text-sm border transition-colors ${
                  currentPage === page
                    ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan shadow-[0_0_10px_#00f2ff]"
                    : "border-white/20 text-terminal-gray hover:border-neon-cyan hover:text-neon-cyan bg-surface-container-low"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => {
                setCurrentPage((p) => Math.min(lastPage, p + 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={currentPage === lastPage}
              className="px-4 py-2 font-code-md text-xs md:text-sm border border-white/20 disabled:opacity-30 disabled:cursor-not-allowed hover:border-neon-cyan hover:text-neon-cyan transition-colors bg-surface-container-low"
            >
              NEXT &raquo;
            </button>
          </div>
        )}

        {/* Terminal Mockup */}
        <section className="mt-12 md:mt-24 reveal-section">
          <div className="glass-panel rounded-none border-neon-cyan/20 overflow-hidden">
            <div className="bg-surface-container-high px-3 md:px-4 py-2 flex items-center gap-1.5 md:gap-2 border-b border-white/10">
              <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500/50" />
              <div className="w-2 h-2 md:w-3 md:h-3 bg-yellow-500/50" />
              <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500/50" />
              <span className="ml-2 md:ml-4 font-code-md text-[10px] md:text-xs text-terminal-gray">
                system_metrics.sh — bash
              </span>
            </div>
            <div className="p-3 md:p-6 font-code-md text-[10px] md:text-code-md text-neon-cyan/70 space-y-1">
              <p>
                <span className="text-electric-purple">root@akhyar_os:</span>
                <span className="text-white">~</span> tail -f /var/log/system.log
              </p>
              <p>
                [{new Date().toISOString().slice(0, 19).replace("T", " ")}] INFO: Kernel boot complete.
              </p>
              <p>
                [{new Date().toISOString().slice(0, 19).replace("T", " ")}] INFO: {totalBlogs} entries indexed... OK
              </p>
              <p>
                [{new Date().toISOString().slice(0, 19).replace("T", " ")}] SUCCESS: AKHYAR_AZAMTA Mainframe operational.
              </p>
              <p className="animate-pulse">_</p>
            </div>
          </div>
        </section>
      </main>

      <Console
        initialLogs={[
          "> Initializing BLOG_ARCHIVE_UPLINK...",
          `> Fetching ${totalBlogs} memory logs...`,
          "> Connection established: NODE_AZ_01",
        ]}
        dynamicLogs={[
          "> Syncing latest transmissions...",
          "> Rendering markdown assets...",
          "> Network traffic stable.",
        ]}
      />

      <Footer profileName="AKHYAR_AZAMTA" />
      <ScrollAnimations />
    </>
  );
}