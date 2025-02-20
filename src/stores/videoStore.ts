import { defineStore } from "pinia";
import type { Video } from "@/models/Video";
import { getVideos } from "@/services/tiktokService";

export const useVideoStore = defineStore("videoStore", {
  state: () => ({
    videos: [] as Video[],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchVideos() {
      this.loading = true;
      this.error = null;
      try {
        const data = await getVideos();
        this.videos = data;
      } catch (error: any) {
        this.error = error.message || "Error al obtener videos";
        console.error(this.error);
      } finally {
        this.loading = false;
      }
    },
  },
});
