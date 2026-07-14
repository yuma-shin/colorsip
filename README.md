# ColorSip

画像・動画からピクセル単位で色を抽出し、RGB値とカラーコード（HEX）を確認・コピーできる、クライアント完結型のスポイトツールです。

すべての処理はブラウザ内で完結し、インポートした画像・動画データが外部サーバーへ送信されることはありません。

## 主な機能

- **画像・動画のインポート**: ファイル選択ボタン、ドラッグ&ドロップ、クリップボードからの貼り付けに対応
  - 対応形式: PNG / JPEG / WebP / GIF（画像）、MP4 / WebM（動画）
- **スポイトによる色抽出**: 画像・動画上のピクセルをクリックしてRGB値とHEXコードを取得。ホバー時は拡大表示のマグニファイアが追従
- **動画フレームキャプチャ**: 再生・一時停止・シークに対応した動画プレビュー。一時停止中のみ色を確定可能
- **色抽出履歴**: セッション中に抽出した色を一覧表示し、個別または一括で削除可能。HEX・RGBはワンクリックでコピー
- **ダーク/ライトモード**: OSのカラースキーム設定に応じた初期テーマを適用し、手動での切り替えにも対応
- **OG Image・アイコン**: ビルド時に静的生成されるOGP画像・ファビコン・アプリアイコン（SVG/PNG）を提供

## 技術スタック

| 分類 | 技術 |
|------|------|
| フレームワーク | [Next.js](https://nextjs.org/) (App Router) |
| 言語 | TypeScript |
| UIコンポーネント | [Chakra UI](https://chakra-ui.com/) v3 |
| アニメーション | [Motion](https://motion.dev/) |
| 状態管理 | [Zustand](https://github.com/pmndrs/zustand) |
| アイコン | [React Icons](https://react-icons.github.io/react-icons/) |
| テーマ切替 | [next-themes](https://github.com/pacocoursey/next-themes) |
| テスト | [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) |

## セットアップ

```bash
npm install
```

## 開発

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) で開発サーバーが起動します。

## ビルド

```bash
npm run build
npm run start
```

## テスト

```bash
npm run test        # 一度だけ実行
npm run test:watch  # ウォッチモード
```

テストファイルは [`tests/`](./tests) ディレクトリに、`src/` と同じ構成でまとめられています。

## Lint / 型チェック

```bash
npm run lint
npx tsc --noEmit
```

## プライバシー

画像・動画のデコード、色抽出、履歴管理を含むすべての処理はブラウザ内（クライアントサイド）で実行されます。インポートしたファイルがサーバーへ送信されることはありません。

## ライセンス

[MIT License](./LICENSE.md)
