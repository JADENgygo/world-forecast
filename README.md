# 世界の予報

SPEC.mdとDESIGN.mdをもとにした、12か国の首都の24時間予報アプリです。
React・TypeScript・Bootstrap・Rechartsを使用します。アニメーションはありません。

## 起動

Node.js 24環境で次を実行します。

```sh
npm ci
npm run dev
```

http://localhost:8000/ を開きます。ポートが使用中の場合は起動に失敗します。
必要な環境変数はありません。ブラウザからOpen-Meteoへ直接アクセスするため通信が必要です。

## 検証

```sh
npm run check
npm test
npm run build
npx playwright install --with-deps chromium
npm run test:e2e
```

E2EではAPIをモックし、通信結果によらず表示と操作を検証します。
Playwrightが起動したサーバーはテスト終了時に停止します。既存サーバーを再利用した場合は停止しません。
`npm run format` で整形、`npm run test:e2e:ui` でテスト用UIを開けます。

GitHub ActionsのCIは`dev`へのPR・push時と手動実行時に起動し、Node.js 24で上記のチェック、単体テスト、ビルド、ChromiumのE2Eテストを実行します。

## データと表示

地点マスターはsrc/cities.tsにあります。日時はUTCのUnix時刻で取得し、各首都のタイムゾーンで表示します。
取得時刻以降の24件を使用するため25時間分を要求します。値が欠測している場合は0に置換しません。
一部の地点のデータ形式が不正でも、正常な地点は表示します。取得失敗時には再試行できます。
気温軸は全地点共通、湿度と降水確率は0〜100%です。数値は開閉式の表でも確認できます。

テーマはOS設定を初期値とし、選択後はローカル保存値を優先します。
保存できない環境でも切り替えは動作します。

データ提供元: [Open-Meteo](https://open-meteo.com/)（[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)）。
APIパラメーターは[公式資料](https://open-meteo.com/en/docs)を参照してください。
無料APIの商用利用や利用上限は[利用条件](https://open-meteo.com/en/terms)を確認し、用途に応じて契約・接続先を選んでください。
