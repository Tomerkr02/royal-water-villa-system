import { SceneCard } from "@/components/ui/scene-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { useControlStore } from "@/store/control-store";

export function ScenesScreen() {
  const scenes = useControlStore((state) => state.scenes);
  const selectedSceneId = useControlStore((state) => state.selectedSceneId);
  const activateScene = useControlStore((state) => state.activateScene);

  return (
    <div>
      <SectionHeading
        eyebrow="מצבים"
        title="אווירה מוכנה בלחיצה אחת"
        description="אוסף מצבים שנבנו כדי להתאים לרגעים שונים בשהייה: הגעה, ערב, אירוח ליד הבריכה, לילה רגוע או יציאה מהווילה."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {scenes.map((scene) => (
          <SceneCard
            key={scene.id}
            scene={scene}
            active={selectedSceneId === scene.id}
            onActivate={() => void activateScene(scene.id)}
          />
        ))}
      </div>
    </div>
  );
}
