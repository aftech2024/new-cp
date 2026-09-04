/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL: string;
  readonly VITE_SITE_NAME: string;
  readonly VITE_GA_ID: string;
  readonly VITE_CONTACT_ENDPOINT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
