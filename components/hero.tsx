import React from "react";
import SafeImage from "@/components/safe-image";

interface Profile {
  name?: string;
  photo_profile_url?: string;
  bio?: string;
}

interface HeroProps {
  profile?: Profile;
}

const Hero: React.FC<HeroProps> = ({ profile }) => {
  const name = profile?.name?.toUpperCase() || "AKHYAR AZAMTA";
  const bio =
    profile?.bio ||
    "Systems Architect. Protocol Breaker. Building resilient digital structures in the void.";
  const photoUrl =
    profile?.photo_profile_url ||
    "https://lh3.googleusercontent.com/aida/AP1WRLsPEApvMd86hgFOHMsl0t2j_bhK63qz3ec_enTJiohddHquROMparqFNQ4M_zTtYbNGZgQzTcI8oH8W4Zl6I5WR9mBIEls8jXeW2ai5i_gOOy9nzQZJ1HQprazmomzuj27hRtXQSOFXsm50XzToXGkdtrpcTI0rNQ7C0-q0TdnWLgT9u-tg3t4gemIroDYNMElCmWIT45y4r3mYGzOwecs_GIDQqg2RYy2eAvlmXRdAP7woArb6ncaPD233";

  return (
    <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter min-h-[70vh] items-center pt-20 pb-16 md:pt-24 md:pb-20">
      {/* Kiri: Teks */}
      <div className="order-2 md:order-1 md:col-span-7 bg-background-surface/90 border border-white/20 p-6 md:p-8 slide-in-left relative">
        {/* Dekorasi sudut */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-neon-cyan"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-neon-cyan"></div>

        {/* Header Terminal */}
        <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
          <div className="w-3 h-3 rounded-sm bg-error"></div>
          <div className="w-3 h-3 rounded-sm bg-tertiary-fixed-dim"></div>
          <div className="w-3 h-3 rounded-sm bg-neon-cyan"></div>
          <span className="font-label-sm text-label-sm text-terminal-gray ml-4">
            root@mainframe:~
          </span>
        </div>

        {/* Typewriter */}
        <div className="font-code-md text-[10px] md:text-code-md text-neon-cyan mb-2 md:mb-4 typewriter w-fit">
          &gt; INITIALIZING LOGIN SEQUENCE...
        </div>

        {/* Welcome message */}
        <div
          className="font-code-md text-[10px] md:text-code-md text-on-surface mb-6 md:mb-8 opacity-0"
          style={{ animation: "fadeInUp 0.5s 3.5s forwards" }}
        >
          &gt; Welcome to the Mainframe.
        </div>

        {/* Nama */}
        <h1
          className="font-headline-xl text-2xl md:text-headline-xl text-on-surface mb-3 md:mb-6 opacity-0"
          style={{ animation: "fadeInUp 0.5s 4s forwards" }}
        >
          {name}
        </h1>

        {/* Bio */}
        <p
          className="font-body-lg text-xs md:text-body-lg text-terminal-gray mb-6 md:mb-8 opacity-0 max-w-lg leading-relaxed"
          style={{ animation: "fadeInUp 0.5s 4.2s forwards" }}
        >
          {bio}
        </p>

        {/* Tombol */}
        <div
          className="flex flex-wrap gap-2 md:gap-4 opacity-0"
          style={{ animation: "fadeInUp 0.5s 4.4s forwards" }}
        >
          <a
            href="#contact"
            className="inline-block bg-neon-cyan text-background font-label-sm text-[10px] md:text-label-sm uppercase tracking-widest px-4 py-2 md:px-6 md:py-3 hover:shadow-[0_0_15px_rgba(0,242,255,0.4)] transition-all duration-300 active:scale-95"
          >
            EXECUTE_CONNECT
          </a>
          <a
            href="#projects"
            className="inline-block bg-transparent border border-neon-cyan text-neon-cyan font-label-sm text-[10px] md:text-label-sm uppercase tracking-widest px-4 py-2 md:px-6 md:py-3 hover:bg-neon-cyan hover:text-background transition-all duration-300 active:scale-95"
          >
            VIEW_DATASTREAM
          </a>
        </div>
      </div>

      {/* Kanan: Foto dengan efek */}
      <div
        className="order-1 md:order-2 md:col-span-5 flex flex-col items-center justify-center opacity-0 mb-8 md:mb-0"
        style={{ animation: "fadeInUp 0.8s 1s forwards" }}
      >
        <div className="relative group">
          {/* Glow background */}
          <div className="absolute inset-0 bg-neon-cyan blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>

          {/* Frame foto */}
          <div className="relative border-2 border-neon-cyan p-2 bg-background-deep neon-glow-cyan">
            {/* Sudut dekoratif */}
            <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-electric-purple"></div>
            <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-electric-purple"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-electric-purple"></div>
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-electric-purple"></div>

            <SafeImage
              alt={profile?.name ? `${profile.name} Profile` : "Akhyar Azamta Profile"}
              className="w-40 h-40 md:w-64 md:h-64 object-cover filter contrast-125 saturate-50 hover:saturate-100 transition-all duration-500"
              src={photoUrl}
              width={256}
              height={256}
            />
          </div>

          {/* Badge status */}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-background-surface border border-neon-cyan px-3 py-1 md:px-4 md:py-1 flex items-center gap-2 neon-glow-cyan whitespace-nowrap">
            <div className="w-2 h-2 bg-neon-cyan animate-pulse"></div>
            <span className="font-label-sm text-[10px] md:text-label-sm text-neon-cyan tracking-widest">
              Scan Status: VERIFIED
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;