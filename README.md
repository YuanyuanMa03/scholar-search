# Scholar Search - Web of Science 移动端应用

这是一个使用 Capacitor 构建的 WebView 应用，用于在移动设备上便捷地访问 Web of Science。

## 功能特点

- 原生移动应用体验，支持 iOS 和 Android
- 直接访问 Web of Science 官方网站
- 保持与网页版完全一致的使用体验
- 优化的移动端显示效果

## 技术栈

- **Capacitor** - 跨平台原生运行时
- **React** - 用户界面框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具

## 开发环境要求

### Android 开发
- Android Studio (推荐最新版本)
- JDK 8 或更高版本
- Android SDK (API Level 21+)
- Android 设备或模拟器

### iOS 开发
- macOS 系统
- Xcode 14 或更高版本
- CocoaPods
- iOS 设备或模拟器 (iOS 12+)

## 安装依赖

```bash
pnpm install
```

## 开发命令

### 网页版开发
```bash
pnpm dev          # 启动开发服务器
pnpm build        # 构建生产版本
```

### 移动端开发

```bash
# 同步 Capacitor 配置到原生平台
pnpm cap:sync

# 打开 Android Studio 进行 Android 开发
pnpm cap:open:android

# 打开 Xcode 进行 iOS 开发 (仅限 macOS)
pnpm cap:open:ios

# 完整构建并运行 Android 应用
pnpm android

# 完整构建并运行 iOS 应用 (仅限 macOS)
pnpm ios
```

## 构建生产版本

### Android

1. 构建 Web 资源：
```bash
pnpm build
```

2. 同步到 Android：
```bash
npx cap sync android
```

3. 在 Android Studio 中打开项目：
```bash
npx cap open android
```

4. 在 Android Studio 中构建 APK 或 AAB

### iOS

1. 构建 Web 资源：
```bash
pnpm build
```

2. 同步到 iOS：
```bash
npx cap sync ios
```

3. 在 Xcode 中打开项目：
```bash
npx cap open ios
```

4. 在 Xcode 中构建和归档应用

## 配置说明

### Capacitor 配置 (capacitor.config.ts)

主要配置项：
- `appId`: 应用唯一标识符
- `appName`: 应用显示名称
- `server.url`: WebView 加载的 URL (Web of Science)
- `server.allowNavigation`: 允许导航的 URL 模式

### Android 权限

应用已配置以下权限：
- `INTERNET` - 网络访问
- `ACCESS_NETWORK_STATE` - 网络状态检测
- `ACCESS_WIFI_STATE` - WiFi 状态检测

### iOS 配置

Info.plist 中已配置：
- App Transport Security (ATS) 设置
- 支持的屏幕方向
- Web of Science 域名例外

## 项目结构

```
scholar-search/
├── android/                # Android 原生项目
├── ios/                    # iOS 原生项目
├── src/                    # Web 源代码
├── dist/                   # 构建输出
├── capacitor.config.ts     # Capacitor 配置
├── package.json           # 项目依赖
└── README.md              # 项目文档
```

## 常见问题

### Android 构建失败
- 确保 Android SDK 已正确安装
- 检查 JDK 版本是否兼容
- 在 Android Studio 中同步 Gradle

### iOS 构建失败
- 确保 Xcode 版本符合要求
- 运行 `pod install` 更新 CocoaPods 依赖
- 检查开发者证书和配置文件

### WebView 无法加载页面
- 检查网络连接
- 确认 capacitor.config.ts 中的 URL 配置正确
- 查看原生平台日志获取错误信息

## 许可证

本项目仅供学习和个人使用。Web of Science 是 Clarivate 的注册商标。

## 相关链接

- [Capacitor 官方文档](https://capacitorjs.com/)
- [Web of Science 官网](https://www.webofscience.com/)
