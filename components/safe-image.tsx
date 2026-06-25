import Image from "next/image";

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  style?: React.CSSProperties;
}

/**
 * SafeImage — wrapper tipis di atas next/image.
 * Dengan `images: { unoptimized: true }` di next.config.ts,
 * Next.js <Image> sudah otomatis render sebagai <img> biasa
 * tanpa server-side optimization, sehingga bekerja di static export
 * dan tidak ada masalah private IP restriction.
 */
export default function SafeImage({
  src,
  alt,
  className,
  width,
  height,
  fill,
  style,
}: SafeImageProps) {
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        className={className}
        fill
        style={style}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      width={width ?? 500}
      height={height ?? 300}
      style={style}
    />
  );
}
