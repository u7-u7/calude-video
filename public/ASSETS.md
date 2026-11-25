# 素材来源

- `soundtrack.wav` 由本项目的 [`scripts/generate-soundtrack.mjs`](../scripts/generate-soundtrack.mjs) 合成，含旋律、节拍和按画面对点的操作音效。运行 `npm run soundtrack` 可重新生成，制作过程没有使用外部音频采样。
- `handwriting.woff2`：霞鹜文楷繁体版常规字重的字符子集，覆盖当前组件中的文字。上游：[Google Fonts 中的 LXGW WenKai TC](https://github.com/google/fonts/tree/main/ofl/lxgwwenkaitc)，原字体文件 `LXGWWenKaiTC-Regular.ttf`，许可随附于 `OFL.txt`。字体支持所需的简体汉字；该变体是字体包名称。
- 四种素材缩略图、手机内容、机器人、边框、图标、波形与粒子由 Wise Wong 的 React 与 SVG 代码生成，随项目保留 MIT 许可。剪辑界面里的音乐波形是示意绘图。

需要扩充汉字时，可从上述上游下载完整字体，转换为 WOFF2 后替换 `handwriting.woff2`，或者将 `src/font.css` 改为读取完整 TTF。请保留字体许可。
