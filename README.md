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
- **GitHub Actions** - 自动化构建

## 快速开始（无需 Android Studio/Xcode）

### 使用 GitHub Actions 自动构建（推荐）

这是最简单的方式，不需要安装任何开发工具！

1. **创建 GitHub 仓库并推送代码**

```bash
# 在 GitHub 上创建一个新仓库（例如：scholar-search）

# 添加远程仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/scholar-search.git

# 推送代码
git branch -M main
git push -u origin main
```

2. **自动构建**

推送代码后，GitHub Actions 会自动开始构建：
- Android APK 会自动生成
- 构建完成后可以在 Actions 页面下载 APK

3. **下载 APK**

- 访问你的仓库页面
- 点击 "Actions" 标签
- 选择最新的构建任务
- 在 "Artifacts" 部分下载 `scholar-search-android.apk`

4. **手动触发构建**

你也可以手动触发构建：
- 访问仓库的 "Actions" 页面
- 选择 "Build Android APK" 或 "Build iOS IPA"
- 点击 "Run workflow" 按钮

### 构建流程说明

```
代码推送 → GitHub Actions 触发 → 自动构建 → 生成 APK/IPA → 下载安装
```

## 本地开发（需要开发工具）

如果你有 Android Studio 或 Xcode，可以进行本地开发：

### 安装依赖

```bash
pnpm install
```

### 开发命令

```bash
# 网页版开发
pnpm dev          # 启动开发服务器
pnpm build        # 构建生产版本

# 移动端开发
pnpm cap:sync              # 同步配置
pnpm cap:open:android      # 打开 Android Studio
pnpm cap:open:ios          # 打开 Xcode
pnpm android               # 构建并运行 Android
pnpm ios                   # 构建并运行 iOS
```

### 本地构建 Android APK

如果你安装了 JDK 和 Android SDK（不需要 Android Studio）：

```bash
# 1. 构建前端资源
pnpm build

# 2. 同步到 Android
npx cap sync android

# 3. 构建 APK
cd android
./gradlew assembleDebug

# APK 位置: android/app/build/outputs/apk/debug/app-debug.apk
```

### 本地构建 iOS（需要 macOS）

```bash
# 1. 构建前端资源
pnpm build

# 2. 同步到 iOS
npx cap sync ios

# 3. 使用 Xcode 打开项目
open ios/App/App.xcworkspace

# 4. 在 Xcode 中构建
```

## GitHub Actions 配置详解

### Android 构建流程

`.github/workflows/build-android.yml` 配置了 Android APK 的自动构建：

1. 检出代码
2. 安装 Node.js 和 pnpm
3. 安装项目依赖
4. 构建前端资源
5. 安装 Java 和 Android SDK
6. 构建 Android APK
7. 上传构建产物

### iOS 构建流程

`.github/workflows/build-ios.yml` 配置了 iOS 应用的构建：

- 模拟器版本：自动构建，无需开发者账号
- 真机版本：需要 Apple 开发者账号和证书（需要额外配置）

### 构建触发条件

构建会在以下情况自动触发：
- 推送代码到 `main` 或 `master` 分支
- 创建以 `v` 开头的 tag（如 `v1.0.0`）
- 创建 Pull Request
- 手动触发（workflow_dispatch）

## 配置说明

### Capacitor 配置 (capacitor.config.ts)

```typescript
const config: CapacitorConfig = {
  appId: 'com.scholarsearch.app',
  appName: 'Scholar Search',
  webDir: 'dist',
  server: {
    url: 'https://www.webofscience.com/',
    allowNavigation: [
      'https://www.webofscience.com/*',
      'https://*.webofscience.com/*',
      'https://*.clarivate.com/*',
    ],
  },
};
```

### 修改配置

如果你想要修改 WebView 加载的 URL：

1. 编辑 `capacitor.config.ts`
2. 修改 `server.url` 和 `server.allowNavigation`
3. 提交并推送代码，GitHub Actions 会自动重新构建

## 项目结构

```
scholar-search/
├── .github/
│   └── workflows/           # GitHub Actions 配置
│       ├── build-android.yml
│       └── build-ios.yml
├── android/                 # Android 原生项目
├── ios/                     # iOS 原生项目
├── src/                     # Web 源代码
├── dist/                    # 构建输出
├── capacitor.config.ts      # Capacitor 配置
└── package.json            # 项目依赖
```

## 常见问题

### Q: APK 构建失败怎么办？

A: 检查 GitHub Actions 的构建日志，常见问题：
- 依赖安装失败：等待几分钟重试
- Gradle 构建超时：可能是网络问题，重试即可

### Q: 如何获取 iOS 真机版 IPA？

A: 需要配置 Apple 开发者账号：
1. 在 GitHub 仓库设置中添加 secrets：
   - `IOS_CODE_SIGN_IDENTITY`: 你的签名证书
   - `IOS_PROVISIONING_PROFILE`: Provisioning Profile
2. 取消 `build-ios.yml` 中相关代码的注释
3. 重新触发构建

### Q: WebView 无法加载页面？

A: 检查以下几点：
- 确认网络连接正常
- 检查 `capacitor.config.ts` 中的 URL 配置
- 查看 GitHub Actions 构建日志

### Q: 如何更新应用？

A: 只需：
1. 修改代码
2. 推送到 GitHub
3. GitHub Actions 自动构建新版本
4. 下载新的 APK 安装

## 安装 APK 到手机

### Android

1. 下载 APK 文件
2. 在手机上启用"允许安装未知来源应用"
3. 打开 APK 文件并安装

### iOS

模拟器版无法在真机上运行。真机版需要：
1. Apple 开发者账号
2. 配置签名和证书
3. 通过 TestFlight 或直接分发

## 许可证

本项目仅供学习和个人使用。Web of Science 是 Clarivate 的注册商标。

## 相关链接

- [Capacitor 官方文档](https://capacitorjs.com/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Web of Science 官网](https://www.webofscience.com/)
