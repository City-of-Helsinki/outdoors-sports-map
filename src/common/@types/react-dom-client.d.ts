// @types/react-dom's stable RootOptions doesn't yet include these React 19 handlers
// (only declared in the canary type channel), so augment them here.
import "react-dom/client";

declare module "react-dom/client" {
  interface RootOptions {
    onUncaughtError?: (error: unknown, errorInfo: { componentStack?: string }) => void
    onCaughtError?: (error: unknown, errorInfo: { componentStack?: string }) => void
  }
}
