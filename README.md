# 小克剪视频

一段 30 秒的手绘剪辑动画。机器人把夜景、拉面、柴犬和舞池素材拖上时间轴，剪掉发呆片段，加入转场与字幕，调整参数，最后卡点导出。画面用可编辑的 React 和 SVG 组件绘制，音乐与操作音效由项目内脚本合成。

![导出后的小克与手机预览](docs/preview.png)

## 预览和导出

需要 Node.js 22.18 或更新版本。

```sh
npm ci
npm run build
```

双击 `dist/index.html` 即可离线试看。预览支持进度拖动、重播、倍速和声音开关。分享时保留整个 `dist` 目录，声音文件在 `dist/assets/`。

```sh
npm start            # 在 Remotion Studio 查看可编辑时间轴
npm run soundtrack   # 重新合成音乐与音效
npm run render       # 导出 1280×720、30 fps 的 H.264 MP4
npm run check        # TypeScript 和时间轴测试
npm run verify       # 需 PATH 中有 FFmpeg 和 FFprobe
```

MP4 写入 `delivery/claude-video-editing.mp4`。预览控件只出现在离线播放器里。

## 编辑入口

| 文件 | 内容 |
| --- | --- |
| `src/timeline.ts` | 分段时码、镜头与参数曲线 |
| `src/Film.tsx` | 手机画面、结尾和音轨 |
| `src/components/` | 手绘角色、剪辑界面与四组素材 |
| `scripts/generate-soundtrack.mjs` | 旋律、节拍、转场和操作音效 |

## 来源与许可

画面源码基于 Wise Wong 的 MIT 项目，保留版权与许可。参考作品及其原音轨归各自权利人。随附字体遵循 SIL OFL，详情见素材说明。[上游源码](https://github.com/WiseWong6/claude-video-editing-remotion/tree/f0ee02b33129ba63eb0df11b157d33326ceec0e7) · [Motion Face 参考](https://motionface.cc/?recording=e3ee409a-50f7-4b4a-af27-288226e47a57) · [MIT 许可](LICENSE) · [素材说明](public/ASSETS.md)
