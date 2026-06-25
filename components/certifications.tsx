import React from "react";
import CloudIcon from "@mui/icons-material/Cloud";
import CodeIcon from "@mui/icons-material/Code";
import DnsIcon from "@mui/icons-material/Dns";
import LanguageIcon from "@mui/icons-material/Language";
import MergeIcon from "@mui/icons-material/Merge";
import SecurityIcon from "@mui/icons-material/Security";
import StorageIcon from "@mui/icons-material/Storage";
import TerminalIcon from "@mui/icons-material/Terminal";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

interface Certificate {
  id: number;
  name: string;
  issuer: string;
  issue_date?: string;
  expiry_date?: string;
  credential_url?: string;
  image_url?: string;
}

interface CertificationsProps {
  certificates?: Certificate[];
}

// Mapping ikon berdasarkan keyword pada nama sertifikat
function getCertIcon(name: string): React.ReactNode {
  const n = name.toLowerCase();
  if (n.includes("aws") || n.includes("cloud")) return <CloudIcon />;
  if (n.includes("react") || n.includes("frontend")) return <CodeIcon />;
  if (n.includes("backend") || n.includes("api")) return <DnsIcon />;
  if (n.includes("javascript") || n.includes("js")) return <LanguageIcon />;
  if (n.includes("git") || n.includes("version")) return <MergeIcon />;
  if (n.includes("security") || n.includes("keamanan")) return <SecurityIcon />;
  if (n.includes("database") || n.includes("sql")) return <StorageIcon />;
  if (n.includes("linux") || n.includes("server")) return <TerminalIcon />;
  return <WorkspacePremiumIcon />;
}

export default function Certifications({ certificates = [] }: CertificationsProps) {
  return (
    <section className="mt-20 md:mt-32">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 md:mb-12">
        <span className="font-headline-md text-xl md:text-headline-md text-on-surface">
          VERIFIED_CERTIFICATIONS
        </span>
        <div className="grow h-px bg-white/10 relative">
          <div className="absolute top-0 left-0 h-full w-1/4 bg-neon-cyan blur-[2px]"></div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {certificates && certificates.length > 0 ? (
          certificates.map((cert) => {
            const issueYear = cert.issue_date
              ? new Date(cert.issue_date).getFullYear()
              : null;
            const expiryYear = cert.expiry_date
              ? new Date(cert.expiry_date).getFullYear()
              : null;
            const isExpired = cert.expiry_date
              ? new Date(cert.expiry_date) < new Date()
              : false;

            return (
              <a
                key={cert.id}
                href={cert.credential_url || "#"}
                target={cert.credential_url ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className="bg-background-surface/50 border border-white/10 p-3 md:p-4 flex flex-col items-center text-center gap-2 md:gap-3 group hover:border-neon-cyan/50 transition-all duration-300 hover:bg-background-surface relative"
              >
                {/* Garis sisi kiri */}
                <div className="absolute top-0 left-0 w-1 h-full bg-electric-purple/20 group-hover:bg-neon-cyan transition-colors duration-300" />

                {/* Ikon utama */}
                <div className="relative">
                  <span className="text-3xl md:text-4xl text-terminal-gray group-hover:text-neon-cyan transition-colors">
                    {getCertIcon(cert.name)}
                  </span>
                  {/* Badge status */}
                  <span className="absolute -bottom-1 -right-1 bg-background-deep rounded-full flex items-center justify-center p-[2px]">
                    {isExpired ? (
                      <CancelIcon className="text-error" style={{ fontSize: '14px' }} />
                    ) : (
                      <CheckCircleIcon className="drop-shadow-md text-neon-cyan" style={{ fontSize: '14px' }} />
                    )}
                  </span>
                </div>

                {/* Detail */}
                <div className="space-y-0.5 md:space-y-1">
                  <p className="font-label-sm text-[10px] md:text-xs text-on-surface group-hover:text-neon-cyan transition-colors uppercase leading-tight">
                    {cert.name}
                  </p>
                  <p className="font-code-md text-[10px] md:text-[10px] text-terminal-gray uppercase">
                    {cert.issuer}
                  </p>
                  {issueYear && expiryYear && (
                    <p className="font-code-md text-[10px] md:text-[10px] text-terminal-gray/60 uppercase">
                      {issueYear} - {expiryYear}
                    </p>
                  )}
                </div>
              </a>
            );
          })
        ) : (
          <div className="col-span-2 md:col-span-4 text-center text-terminal-gray font-code-md p-6 md:p-8 border border-white/10 bg-background-surface">
            &gt; NO_CERTIFICATION_RECORDS_FOUND
          </div>
        )}
      </div>
    </section>
  );
}