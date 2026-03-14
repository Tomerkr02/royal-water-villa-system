import { getProvider } from "@/services/provider-registry";

export const sceneService = {
  getScenes: () => getProvider().getScenes(),
  activateScene: (sceneId: string) => getProvider().activateScene(sceneId),
};
