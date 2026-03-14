import { SceneCard } from "@/components/ui/scene-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { useI18n } from "@/lib/i18n";
import { useControlStore } from "@/store/control-store";

export function ScenesScreen() {
  const { t } = useI18n();
  const scenes = useControlStore((state) => state.scenes);
  const selectedSceneId = useControlStore((state) => state.selectedSceneId);
  const activateScene = useControlStore((state) => state.activateScene);

  return (
    <div>
      <SectionHeading
        eyebrow={t("scenes.eyebrow")}
        title={t("scenes.title")}
        description={t("scenes.description")}
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
