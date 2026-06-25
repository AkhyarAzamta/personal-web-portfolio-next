import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Static Export untuk shared hosting / cPanel ──────────────────────────
  // Menghasilkan folder `out/` yang bisa di-upload ke public_html
  output: "export",

  // Tambahkan trailing slash agar setiap halaman jadi folder (lebih kompatibel
  // dengan static file server seperti Apache/Nginx di shared hosting)
  trailingSlash: true,

  // ── Image Optimization ───────────────────────────────────────────────────
  // Wajib dimatikan saat static export karena tidak ada server Next.js
  // yang berjalan. Gambar langsung di-serve dari src URL aslinya.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
