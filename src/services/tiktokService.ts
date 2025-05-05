// src/services/tiktokService.ts
import axios from "axios";
import { Video } from "@/models/Video";

/**
 * Consulta la API oEmbed de TikTok para obtener la información completa del video.
 * @param videoUrl La URL del video de TikTok.
 * @returns Un objeto con todos los campos de la API oEmbed.
 */
export async function getTikTokEmbed(videoUrl: string): Promise<{
  version: string;
  type: string;
  title: string;
  author_url: string;
  author_name: string;
  width: string;
  height: string;
  html: string;
  thumbnail_width: number;
  thumbnail_height: number;
  thumbnail_url: string;
  provider_url: string;
  provider_name: string;
}> {
  try {
    const response = await axios.get("https://www.tiktok.com/oembed", {
      params: { url: videoUrl },
    });
    // Devuelve todos los campos de la respuesta

    return {
      version: response.data.version,
      type: response.data.type,
      title: response.data.title,
      author_url: response.data.author_url,
      author_name: response.data.author_name,
      width: response.data.width,
      height: response.data.height,
      html: response.data.html,
      thumbnail_width: response.data.thumbnail_width,
      thumbnail_height: response.data.thumbnail_height,
      thumbnail_url: response.data.thumbnail_url,
      provider_url: response.data.provider_url,
      provider_name: response.data.provider_name,
    };
  } catch (error) {
    console.error("Error al obtener embed para", videoUrl, error);
    throw error;
  }
}

/**
 * Obtiene la lista de videos consultando la API oEmbed para cada URL.
 */
export async function getVideos(): Promise<Video[]> {
  const videoUrls = [
    "https://www.tiktok.com/@fer_lu07/video/7293263902522002693",
    "https://www.tiktok.com/@fer_lu07/video/7389433493232635142",
    "https://www.tiktok.com/@loveeeeeeeeeeez/video/7416593431050374407",
    "https://www.tiktok.com/@frankia.navarro/video/7410271820613455110",
    "https://www.tiktok.com/@deeploveconnections/photo/7414613786331565345",
    "https://www.tiktok.com/@abbcc2hh/video/7409034104672505119",
    "https://www.tiktok.com/@isbaefeelings/video/7472571577033297154",
    "https://www.tiktok.com/@scout2015/video/7472163458079886622",
    "https://www.tiktok.com/@paradedicarselx/photo/7417124810452438278",
    "https://www.tiktok.com/@asamimichaann/video/7395170921432091922",
    "https://www.tiktok.com/@onlooooop/video/7471797461451918614",
    "https://www.tiktok.com/@yen.kat/video/7471486666104900870",
    "https://www.tiktok.com/@oye_kenedy/video/7471402415045070088",
    "https://www.tiktok.com/@khaleesiisaa/video/7417099791756217633",
    "https://www.tiktok.com/@antoniaangel5/video/7470630442471820599",
    "https://www.tiktok.com/@mariaclaudiaql/video/7471807196397948166",
  ];

  const videos = await Promise.all(
    videoUrls.map(async (url, index) => {
      try {
        const embedData = await getTikTokEmbed(url);
        // Crea un objeto Video usando la clase definida
        return new Video({
          version: embedData.version,
          type: embedData.type,
          title: embedData.title,
          author_url: embedData.author_url,
          author_name: embedData.author_name,
          width: embedData.width,
          height: embedData.height,
          html: embedData.html,
          thumbnail_width: embedData.thumbnail_width,
          thumbnail_height: embedData.thumbnail_height,
          thumbnail_url: embedData.thumbnail_url,
          provider_url: embedData.provider_url,
          provider_name: embedData.provider_name,
        });
      } catch (error) {
        // En caso de error, se crea un Video con datos de error
        return new Video({
          version: "1.0",
          type: "video",
          title: "Error",
          author_url: "",
          author_name: "",
          width: "100%",
          height: "100%",
          html: `<p>Error cargando video</p>`,
          thumbnail_width: 0,
          thumbnail_height: 0,
          thumbnail_url: "",
          provider_url: "",
          provider_name: "",
        });
      }
    })
  );

  return videos;
}
