import { ArrowUpRight } from "lucide-react";
import type { ContactAction } from "@/types/models";

export function ContactCard({ action }: { action: ContactAction }) {
  const Icon = action.icon;

  return (
    <a
      href={action.href}
      target="_blank"
      rel="noreferrer"
      className="group rounded-[2rem] border border-white/8 bg-white/[0.04] p-5 text-right transition-all duration-300 hover:-translate-y-1 hover:border-gold/20"
    >
      <div className="flex items-start justify-between gap-4">
        <ArrowUpRight className="h-5 w-5 text-white/35 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        <span className="rounded-[1.3rem] bg-amber-200/12 p-3 text-gold">
          <Icon className="h-6 w-6" />
        </span>
      </div>
      <h3 className="mt-8 text-2xl font-semibold text-foreground">{action.label}</h3>
      <p className="mt-3 text-sm leading-6 text-white/58">{action.description}</p>
    </a>
  );
}
