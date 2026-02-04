/**
 * WhatsSound — Open Graph Meta Tags Helper
 * Genera meta tags para compartir en redes sociales
 */

const BASE_URL = 'https://whatssound-app.vercel.app';

export interface OGMetaData {
  title: string;
  description: string;
  image: string;
  url: string;
  type?: 'website' | 'music.playlist' | 'profile';
}

/**
 * Genera meta tags OG para una sesión
 */
export function getSessionOGMeta(sessionId: string, sessionName?: string, djName?: string): OGMetaData {
  const title = sessionName 
    ? `${sessionName} - ${djName || 'En vivo'} | WhatsSound`
    : 'Sesión en vivo | WhatsSound';
  
  const description = djName 
    ? `Únete a la sesión de ${djName} en WhatsSound. Escucha música en vivo, pide canciones y conecta con otros fans.`
    : 'Únete a esta sesión en vivo en WhatsSound. Escucha música, pide canciones y conecta con otros fans.';

  return {
    title,
    description,
    image: `${BASE_URL}/api/og/session/${sessionId}`,
    url: `${BASE_URL}/session/${sessionId}`,
    type: 'music.playlist',
  };
}

/**
 * Genera meta tags OG para un perfil de DJ
 */
export function getDJProfileOGMeta(djId: string, djName: string, bio?: string): OGMetaData {
  return {
    title: `${djName} | WhatsSound`,
    description: bio || `Sigue a ${djName} en WhatsSound. Escucha sus sesiones en vivo y conecta con la comunidad.`,
    image: `${BASE_URL}/api/og/dj/${djId}`,
    url: `${BASE_URL}/dj/${djId}`,
    type: 'profile',
  };
}

/**
 * Meta tags por defecto de la app
 */
export const DEFAULT_OG_META: OGMetaData = {
  title: 'WhatsSound - Música Social en Vivo',
  description: 'La app de música social donde los DJs pinchan en vivo y la audiencia pide canciones. Únete a sesiones, envía propinas y descubre nuevos artistas.',
  image: `${BASE_URL}/og-default.png`,
  url: BASE_URL,
  type: 'website',
};

/**
 * Genera el HTML de los meta tags
 */
export function generateOGMetaTags(meta: OGMetaData): string {
  return `
    <meta property="og:title" content="${meta.title}" />
    <meta property="og:description" content="${meta.description}" />
    <meta property="og:image" content="${meta.image}" />
    <meta property="og:url" content="${meta.url}" />
    <meta property="og:type" content="${meta.type || 'website'}" />
    <meta property="og:site_name" content="WhatsSound" />
    
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${meta.title}" />
    <meta name="twitter:description" content="${meta.description}" />
    <meta name="twitter:image" content="${meta.image}" />
  `.trim();
}
