<template>
  <div v-if="props.video">
    <v-hover v-slot="{ isHovering, props: hoverProps }">
      <v-card
        v-bind="hoverProps"
        class="tiktok-embed-container mx-auto"
        :elevation="isHovering ? 16 : 4"
        :style="{
          backgroundColor: '#1a1a1a',
          transform: isHovering ? 'scale(1.02)' : 'scale(1)',
        }"
      >
        <!-- Loading Skeleton -->
        <div v-if="loading" class="loading-container pa-4">
          <v-skeleton-loader class="skeleton-avatar" type="avatar" size="48" />
          <v-skeleton-loader class="skeleton-text mt-2" type="text@2" />
        </div>

        <!-- Video Embed -->
        <div
          v-else
          ref="embedContainer"
          v-html="embedHtml"
          class="video-container"
        ></div>

        <!-- Video Info Header -->
        <div class="video-header pa-4">
          <v-row no-gutters align="center">
            <v-col cols="auto">
              <v-avatar size="40" class="mr-3 border-avatar">
                <v-img
                  :src="
                    props.video?.author_avatar || 'https://picsum.photos/40'
                  "
                  class="elevation-1"
                ></v-img>
              </v-avatar>
            </v-col>
            <v-col>
              <div class="text-subtitle-1 font-weight-bold text-white">
                {{ props.video?.author_name }}
              </div>
              <div class="text-caption text-grey-lighten-1">
                {{ formatDate(props.video?.created_at) }}
              </div>
            </v-col>
            <v-col cols="auto">
              <v-btn
                variant="outlined"
                color="primary"
                size="small"
                @click.stop="openTikTokLink"
                prepend-icon="mdi-open-in-new"
                class="text-none tiktok-btn"
              >
                Ver en TikTok
              </v-btn>
            </v-col>
          </v-row>
        </div>

        <!-- Video Stats -->
        <v-card-actions class="video-stats pa-4">
          <v-row justify="space-around" align="center" no-gutters>
            <v-col cols="auto" class="stat-item">
              <v-icon color="error" size="24" class="mb-1">mdi-heart</v-icon>
              <div class="text-body-2 font-weight-medium">
                {{ formatNumber(props.video?.likes || 0) }}
              </div>
              <div class="text-caption text-grey-lighten-1">Me gusta</div>
            </v-col>
            <v-divider vertical class="mx-2"></v-divider>
            <v-col cols="auto" class="stat-item">
              <v-icon color="primary" size="24" class="mb-1"
                >mdi-comment-outline</v-icon
              >
              <div class="text-body-2 font-weight-medium">
                {{ formatNumber(props.video?.comments || 0) }}
              </div>
              <div class="text-caption text-grey-lighten-1">Comentarios</div>
            </v-col>
            <v-divider vertical class="mx-2"></v-divider>
            <v-col cols="auto" class="stat-item">
              <v-icon color="success" size="24" class="mb-1"
                >mdi-share-variant</v-icon
              >
              <div class="text-body-2 font-weight-medium">
                {{ formatNumber(props.video?.shares || 0) }}
              </div>
              <div class="text-caption text-grey-lighten-1">Compartidos</div>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-hover>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, defineProps, ref, nextTick } from "vue";
import { useVideoStore } from "@/stores/videoStore";
import type { Video } from "@/models/Video";

const props = defineProps<{ video: Video }>();
const videoStore = useVideoStore();
const loading = ref(true);
const embedContainer = ref<HTMLElement | null>(null);

const videoId = computed(() => {
  if (props.video && props.video.html) {
    const match = props.video.html.match(/data-video-id="([^"]+)"/);
    return match ? match[1] : "";
  }
  return "";
});

const videoUrl = computed(() => {
  if (props.video && props.video.html) {
    const match = props.video.html.match(/cite="([^"]+)"/);
    return match ? match[1] : props.video?.author_url;
  }
  return props.video?.author_url;
});

const embedHtml = computed(() => {
  if (!props.video) return null;
  const videoFromStore = videoStore.videos.find((v) => {
    const m = v.html.match(/data-video-id="([^"]+)"/);
    return m && m[1] === videoId.value;
  });
  return videoFromStore ? videoFromStore.html : props.video.html;
});

function formatDate(dateString?: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatNumber(num: number) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

function loadTikTokScript() {
  const existingScript = document.querySelector(
    'script[src="https://www.tiktok.com/embed.js"]'
  );
  if (existingScript) {
    existingScript.remove();
  }
  const script = document.createElement("script");
  script.src = "https://www.tiktok.com/embed.js";
  script.async = true;
  document.head.appendChild(script);
}

onMounted(async () => {
  if (!embedHtml.value) {
    await videoStore.fetchVideos();
  }

  setTimeout(() => {
    loading.value = false;
    nextTick(() => {
      loadTikTokScript();
    });
  }, 1000);
});

function openTikTokLink() {
  if (videoUrl.value) {
    window.open(videoUrl.value, "_blank");
  }
}
</script>

<style lang="scss" scoped>
.tiktok-embed-container {
  width: 100%;
  max-width: 600px;
  margin: 1.5rem auto;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.loading-container {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #1a1a1a;
}

.video-container {
  position: relative;
  z-index: 1;
}

.video-header {
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), transparent);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
}

.video-stats {
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-item {
  text-align: center;
  padding: 0.5rem 1rem;

  .v-icon {
    transition: transform 0.2s ease;
  }

  &:hover .v-icon {
    transform: scale(1.2);
  }
}

.border-avatar {
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.tiktok-btn {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }
}

:deep(.tiktok-embed) {
  margin: 0 !important;
  max-width: none !important;
}
</style>
