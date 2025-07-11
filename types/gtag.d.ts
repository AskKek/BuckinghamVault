/// <reference types="gtag.js" />

declare global {
  interface Window {
    gtag: typeof gtag
  }
}