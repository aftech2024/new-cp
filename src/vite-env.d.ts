/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL: string;
  readonly VITE_SITE_NAME: string;
  readonly VITE_GA_ID: string;
  readonly VITE_CONTACT_ENDPOINT: string;
  readonly VITE_CHAT_ENDPOINT?: string;
  readonly VITE_CHAT_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/** Set in vite.config.ts: whether src/content/blog/editions holds any edition. */
declare const __BLOG_HAS_EDITIONS__: boolean;
