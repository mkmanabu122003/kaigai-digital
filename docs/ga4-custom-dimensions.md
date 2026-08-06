# GA4 カスタムディメンション登録手順

作成日: 2026-08-06

## なぜ必要か

`src/lib/ga.ts` は9種類のカスタムイベントを送信しているが、**GA4管理画面でカスタムディメンションとして登録しないと、パラメータの中身をレポートで見られない**。

実際に 2026-08-05 時点で以下の状態だった。

- `cta_view` の `service_name` → 取得できた（登録済み）
- `site_error` の `error_type` / `error_message` → **API がエラーを返す（未登録）**
- `web_vitals` の `metric_name` / `metric_rating` → **未登録**

`site_error` は28日間で89件発生していたが、**中身が読めないため原因を特定できなかった**（後にMicrosoft Clarityのスクリプトエラーと判明し、コード側で除外済み）。同じ事態を防ぐため、以下を登録する。

## 登録手順

1. [GA4管理画面](https://analytics.google.com/) を開く
2. 左下の **管理**（歯車アイコン）をクリック
3. 「データの表示」列 → **カスタム定義**
4. **カスタムディメンションを作成** をクリック
5. 下表のとおり入力して保存
   - 範囲：すべて **イベント**
   - イベントパラメータ：下表の「パラメータ名」を**正確に**入力（大文字小文字・アンダースコアまで一致させる）

> 登録後、データが反映されるまで24〜48時間かかる。過去に遡っては反映されない。

## 登録すべきディメンション

### 優先度 高（収益・不具合の把握に直結）

| ディメンション名 | パラメータ名 | 関連イベント | 用途 |
|---|---|---|---|
| サービス名 | `service_name` | `affiliate_click` / `cta_view` | どのASP商材がクリックされたか。**収益分析の根幹** |
| 記事スラッグ | `article_slug` | `affiliate_click` / `cta_view` / `scroll_depth` | どの記事が稼いでいるか |
| CTA配置 | `placement` | `affiliate_click` / `cta_view` | top/middle/bottom のどれが効くか |
| エラー種別 | `error_type` | `site_error` | js_error か unhandled_rejection か |
| エラー内容 | `error_message` | `site_error` | 不具合の特定に必須 |
| 発生ページ | `page_path` | `site_error` | どのページで壊れているか |

### 優先度 中（改善の打ち手を決めるのに使う）

| ディメンション名 | パラメータ名 | 関連イベント | 用途 |
|---|---|---|---|
| A/Bバリアント | `variant` | `affiliate_click` | CTA文言のA/Bテスト結果 |
| スクロール到達率 | `depth_percentage` | `scroll_depth` | 記事のどこで離脱しているか |
| 読了時間 | `read_time_seconds` | `article_read_complete` | 実際に読まれているかの指標 |
| 指標名 | `metric_name` | `web_vitals` | LCP / INP / CLS の別 |
| 指標評価 | `metric_rating` | `web_vitals` | good / needs-improvement / poor |

### 優先度 低（余裕があれば）

| ディメンション名 | パラメータ名 | 関連イベント |
|---|---|---|
| リンク元スラッグ | `from_slug` | `internal_link_click` |
| リンク先パス | `to_path` | `internal_link_click` |
| アンカーテキスト | `anchor_text` | `internal_link_click` |
| 外部リンクURL | `link_url` | `external_link_click` |
| 検索語 | `search_term` | `site_search` |
| 検索結果件数 | `results_count` | `site_search` |

## 指標（メトリクス）として登録するもの

「カスタム指標」タブで登録する。単位は「標準」。

| 指標名 | パラメータ名 | 関連イベント |
|---|---|---|
| Web Vitals値 | `metric_value` | `web_vitals` |

## 送信しているイベント一覧

`src/lib/ga.ts` で定義済み。

| イベント名 | 発火条件 |
|---|---|
| `page_view` | ページ表示時（2026-08-06に送信方式を修正） |
| `cta_view` | CTAが画面に50%以上入ったとき（1回のみ） |
| `affiliate_click` | アフィリエイトボタンのクリック |
| `internal_link_click` | 内部リンクのクリック |
| `external_link_click` | 外部リンクのクリック |
| `scroll_depth` | 25/50/75/100%到達時 |
| `article_read_complete` | 90%スクロール かつ 滞在30秒以上 |
| `site_search` | サイト内検索 |
| `web_vitals` | LCP/INP/CLS/FCP/TTFB の計測時 |
| `site_error` | 同一オリジンのJSエラー発生時（2026-08-06に第三者エラーを除外） |

## 登録後に確認すること

1. 24〜48時間後、GA4の「探索」で `service_name` を軸にレポートを作る
2. `affiliate_click` が0件のままなら、CTAが押されていないのか計測が漏れているのかを切り分ける
   - `cta_view` は出ているのに `affiliate_click` が0 → 本当に押されていない（CTA文言・配置の問題）
   - どちらも0 → 計測側の問題を疑う
3. `npx tsx scripts/affiliate-report.ts` でサービス別のクリックが取れるようになる

## 補足：DebugViewでの検証

実装を変更したときは、GA4の **管理 → DebugView** で確認できる。ローカル開発環境（`NODE_ENV=development`）では `debug_mode: true` が自動で付与されるため、`npm run dev` で起動してページを操作すればDebugViewにリアルタイムで表示される。
