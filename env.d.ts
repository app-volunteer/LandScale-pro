interface ImportMetaEnv {
  readonly VITE_ILOVEPDF_PUBLIC?: string;
  readonly VITE_ILOVEPDF_SECRET?: string;
  // add other VITE_... variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
