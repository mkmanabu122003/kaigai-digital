# GA4 カスタムディメンション登録手順

作成日: 2026-08-06

## なぜ必要か

`src/lib/ga.ts` は9種類のカスタムイベントを送信しているが、**GA4管理画面でカスタムディメンションとして登録しないと、パラメータの中身をレポートで見られない**。

実際に 2026-08-05 時点で以下の状態だった。

- `cta_view` の `service_name` → 取得できた（登録済み）
- `site_error` の `error_type` / `error_message` → **API がエラーを返す（未登録）**
- `web_vitals` の `metric_name` / `metric_rating` → **未登録**

`site_error` は28日間で89件発生していたが、**中身が読めないため原因を特定できなかった**（後にMicrosoft Clarityのスクリプトエラーと判明し、コード側で除外済み）。同じ事態を防ぐため、以下を登録する。

## 登録手順（スクリプトで自動登録できる）

`scripts/setup-ga4-dimensions.ts` で一括登録できる。**必要な作業は下記ステップ1の権限付与だけ**で、あとはコマンド1回で完了する。

### ステップ1：サービスアカウントに編集者ロールを付与する（要手作業）

GA4のアクセス権限変更はプロパティ管理者しかできないため、ここだけは手動で行う。

1. [GA4管理画面](https://analytics.google.com/) → 左下の **管理**（歯車アイコン）
2. **プロパティ**列 → **プロパティのアクセス管理**
3. 右上の **＋** → **ユーザーを追加**
4. メールアドレスに以下を入力

   ```
   indexing-api@seo-pipeline-490113.iam.gserviceaccount.com
   ```

5. **「新規ユーザーにメールで通知する」のチェックを外す**（サービスアカウントのため通知不要）
6. ロールで **編集者** を選択
7. **追加** をクリック

> このサービスアカウントは Indexing API と GSC/GA4 のデータ取得で既に使用しているもの。新規発行は不要。

### ステップ2：スクリプトを実行する

```bash
# 作成予定の確認（変更なし）
npx tsx scripts/setup-ga4-dimensions.ts --dry-run

# 実行
npx tsx scripts/setup-ga4-dimensions.ts

# 登録済み一覧だけ見る
npx tsx scripts/setup-ga4-dimensions.ts --list
```

登録済みのパラメータはスキップされるため、**何度実行しても安全**（冪等）。

> 登録後、データが反映されるまで24〜48時間かかる。**過去に遡っては反映されない。**

### 手動で登録する場合

管理 → **データの表示**列 → **カスタム定義** → **カスタムディメンションを作成** から、下表のパラメータ名を正確に入力する（範囲はすべて「イベント」）。

**表示名には日本語が使えない。** GA4の制約で、英数字・アンダースコア・スペースのみ受け付ける。

---

## 登録状況（2026-08-06 時点）

| パラメータ | 状態 |
|---|---|
| `service_name` / `article_slug` / `placement` / `variant` | ✅ **登録済み** |
| 上記以外（下表の10件） | ❌ 未登録 — ステップ1の権限付与後にスクリプトで作成される |

アフィリエイト分析の根幹である4つは既に登録されていた。そのため `cta_view` のサービス別内訳は取得できていた（NordVPN 68 / トリファ 30 / かべネコ 28 など）。**未登録なのは不具合の特定に使う系統**であり、これが `site_error` 89件の中身を読めなかった原因。

## 登録すべきディメンション

### スクリプトが登録するもの（9ディメンション + 1指標）

| 表示名 | パラメータ名 | 関連イベント | 用途 |
|---|---|---|---|
| Error Type | `error_type` | `site_error` | js_error か unhandled_rejection か |
| Error Message | `error_message` | `site_error` | **不具合の特定に必須** |
| Error Page Path | `page_path` | `site_error` | どのページで壊れているか |
| Metric Name | `metric_name` | `web_vitals` | LCP / INP / CLS の別 |
| Metric Rating | `metric_rating` | `web_vitals` | good / needs-improvement / poor |
| Scroll Depth | `depth_percentage` | `scroll_depth` | 記事のどこで離脱しているか |
| Read Time Seconds | `read_time_seconds` | `article_read_complete` | 実際に読まれているかの指標 |
| Link From Slug | `from_slug` | `internal_link_click` | 内部リンク改修の効果測定 |
| Link To Path | `to_path` | `internal_link_click` | 同上 |

**カスタム指標（1件）**

| 表示名 | パラメータ名 | 関連イベント | 単位 |
|---|---|---|---|
| Web Vitals Value | `metric_value` | `web_vitals` | 標準 |

### 登録を見送ったもの

GA4のカスタムディメンションは上限50件で、**一度作ると削除してもすぐには枠が戻らない**（アーカイブ扱いになる）。今すぐ使う予定がないものは作らない方針とした。必要になったら `scripts/setup-ga4-dimensions.ts` の `DIMENSIONS` 配列に追記して再実行すればよい。

| パラメータ名 | 関連イベント | 見送り理由 |
|---|---|---|
| `anchor_text` | `internal_link_click` | `from_slug` / `to_path` があれば当面足りる |
| `link_url` / `link_text` | `external_link_click` | 発リンクは追加したばかりで分析対象が少ない |
| `search_term` / `results_count` | `site_search` | サイト内検索の利用がほぼない |

> **`page_path` について：** GA4には標準ディメンションの「ページパス」が別に存在する。カスタムパラメータとして送信している `page_path`（`site_error` の発生ページ）とは別物なので、レポートでは表示名 **Error Page Path** で区別すること。

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
