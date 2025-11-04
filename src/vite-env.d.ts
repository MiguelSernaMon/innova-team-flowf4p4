/// <reference types="vite/client" />

// Fix for sockjs-client global issue in Vite
declare global {
  const global: typeof globalThis;
}

interface ImportMetaEnv {
  readonly VITE_GRAPHQL_URI: string;
  readonly VITE_WEBSOCKET_URI: string;
  readonly VITE_API_BASE_URL: string;
  // Añade más variables de entorno según necesites
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export {};
