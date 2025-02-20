import { defineStore } from "pinia";
import { ref } from "vue";

export const useImageStore = defineStore("imageStore", () => {
  const images = ref<string[]>([
    "https://via.placeholder.com/300x300?text=Foto+1",
    "https://via.placeholder.com/300x300?text=Foto+2",
    "https://via.placeholder.com/300x300?text=Foto+3",
    "https://via.placeholder.com/300x300?text=Foto+4",
    "https://via.placeholder.com/300x300?text=Foto+5",
    "https://via.placeholder.com/300x300?text=Foto+6",
  ]);

  // Aquí podrías agregar acciones para cargar, actualizar, etc.
  return { images };
});
