import { CheckCircle2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Scene } from "@/types/models";

export function SceneCard({
  scene,
  active,
  onActivate,
}: {
  scene: Scene;
  active: boolean;
  onActivate: () => void;
}) {
  const Icon = scene.icon;

  return (
    <button
      type="button"
      onClick={onActivate}
      className={cn(
        "group relative overflow-hidden rounded-[2rem] border p-5 text-right transition-all duration-300 hover:-translate-y-1",
        active
          ? "border-gold/30 bg-white/[0.07]"
          : "border-white/7 bg-white/[0.035] hover:border-gold/18 hover:bg-white/[0.05]",
      )}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br", scene.accent)} />
      <div className="relative flex h-full flex-col justify-between gap-6">
        <div className="flex items-start justify-between gap-4">
          {active ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-100" />
          ) : (
            <Sparkles className="h-5 w-5 text-white/40" />
          )}
          <span className="rounded-[1.3rem] bg-black/18 p-3 text-gold">
            <Icon className="h-6 w-6" />
          </span>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-foreground">{scene.name}</h3>
          <p className="mt-2 text-sm leading-6 text-white/62">{scene.description}</p>
          <p className="mt-4 text-xs tracking-[0.22em] text-white/45">{scene.mood}</p>
        </div>
      </div>
    </button>
  );
}
