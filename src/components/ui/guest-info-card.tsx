import type { GuestInfoItem } from "@/types/models";

export function GuestInfoCard({ item }: { item: GuestInfoItem }) {
  return (
    <article className="rounded-[1.8rem] border border-white/8 bg-white/[0.035] p-5 text-right">
      <p className="text-xs tracking-[0.24em] text-gold-soft/80">{item.title}</p>
      <h3 className="mt-4 text-xl font-semibold text-foreground">{item.value}</h3>
      <p className="mt-3 text-sm leading-6 text-white/58">{item.description}</p>
    </article>
  );
}
