export class Video {
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
  // Propiedades adicionales:
  author_avatar?: string;
  created_at?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  embed_product_id?: string;

  constructor(data: {
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
    author_avatar?: string;
    created_at?: string;
    likes?: number;
    comments?: number;
    shares?: number;
    embed_product_id?: string;
  }) {
    this.version = data.version;
    this.type = data.type;
    this.title = data.title;
    this.author_url = data.author_url;
    this.author_name = data.author_name;
    this.width = data.width;
    this.height = data.height;
    this.html = data.html;
    this.thumbnail_width = data.thumbnail_width;
    this.thumbnail_height = data.thumbnail_height;
    this.thumbnail_url = data.thumbnail_url;
    this.provider_url = data.provider_url;
    this.provider_name = data.provider_name;
    // Asignación de propiedades opcionales con valores por defecto:
    this.author_avatar = data.author_avatar || "";
    this.created_at = data.created_at || "";
    this.likes = data.likes ?? 0;
    this.comments = data.comments ?? 0;
    this.shares = data.shares ?? 0;
    this.embed_product_id = data.embed_product_id || "";
  }
}
