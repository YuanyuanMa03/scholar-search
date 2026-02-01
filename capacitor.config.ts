import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.scholarsearch.app',
  appName: 'Scholar Search',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    // 允许导航到 Web of Science 及其相关域名
    url: 'https://www.webofscience.com/',
    cleartext: true,
    // 允许在 WebView 中导航的 URL 模式
    allowNavigation: [
      'https://www.webofscience.com/*',
      'https://*.webofscience.com/*',
      'https://*.clarivate.com/*',
    ],
  },
  android: {
    // Android 特定配置
    captureInput: true,
    webContentsDebuggingEnabled: true, // 开发时启用，发布时建议关闭
  },
  ios: {
    // iOS 特定配置
    captureInput: true,
    webViewAlias: 'WKWebView', // 使用 WKWebView
    // 配置 WKWebView 的设置
    overridesUserAgent: false, // 不覆盖 User-Agent，保持浏览器兼容性
  },
  // 插件配置
  plugins: {
    CapacitorHttp: {
      enabled: false,
    },
  },
};

export default config;
