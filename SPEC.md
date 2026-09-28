# 作成するもの

世界の予報

## 環境

- typescript
- viteでビルド、8000でサーバーをたてる
- rechartsでグラフ表示
- vitestで単体テスト実施
- playwrightでe2eテスト実施
- biomeで整形、静的解析
- cssはbootstrapを使う
- openmeteoで予報情報を取得

## データ

- openmeteoでtemperature (2m), relative humidity (2m), precipitation probabilityを取得
- 場所は世界の代表的な国と首都

## 画面

- アニメーションは不要

### ヘッダー

- タイトル不要
- ライト/ダークテーマ切替アイコンボタンとX(@JADENgygo)のリンクアイコンを設置
- color-schemeとtheme-colorを適切に設定、変化させる

### メイン

- openmeteoで取得したデータを表示したrechartsグラフをタイル形式で全体に並べる
- キャプションに国の名前と首都を表示

### フッター

- 不要
