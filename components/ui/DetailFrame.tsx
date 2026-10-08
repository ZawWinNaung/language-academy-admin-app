import { ReactNode } from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

interface DetailFrameProps {
  backHref: string;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
}

export default function DetailFrame({
  backHref,
  title,
  description,
  children,
}: DetailFrameProps) {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4 pb-4 border-b border-border-main">
        <Link
          href={backHref}
          className="p-2.5 bg-surface border border-border-main hover:border-brand-primary/40 text-text-muted hover:text-brand-primary rounded-xl transition-all"
        >
          <FaArrowLeft className="text-xs" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-text-main flex items-center gap-2">
            {title}
          </h1>
          {description && (
            <p className="text-xs text-text-muted mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}
