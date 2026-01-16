/// <reference types="vite/client" />
/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />

interface ImportMetaEnv {
  readonly REACT_APP_API_URL: string
  readonly REACT_APP_MAP_URL_TEMPLATE: string
  readonly REACT_APP_DIGITRANSIT_API_URL: string
  readonly REACT_APP_DIGITRANSIT_API_KEY: string
  readonly REACT_APP_APP_NAME: string
  // Add other REACT_APP_ variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}