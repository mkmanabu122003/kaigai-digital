# kaigai-digital.com 改善指示書

> 作成日: 2026-03-30
> GSCデータ: 過去28日間（2026-03-20〜03-28）
> 現状: 50記事公開済み / 5クリック / 288表示 / 7ページのみ表示

---

## 施策一覧

| # | 施策 | 担当 | 期待インパクト | 工数 |
|---|------|------|----------------|------|
| 1 | Google Indexing APIで全記事を一括申請 | エンジニア | 表示回数 5〜10倍 | 30分 |
| 2 | sitemap.xml の lastmod を正確な日付に修正 | エンジニア | クロール効率改善 | 30分 |
| 3 | paypay-overseas の title/description 最適化 | CMO | CTR 0.66%→5%以上 | 1時間 |
| 4 | best-esim / overseas-remittance のコンテンツ強化 | CMO+アフィリエイター | 順位改善→CV直結 | 各2〜3時間 |
| 5 | 知恵袋記事の韓国・台湾への横展開 | CMO+エンジニア | ロングテール流入2〜3倍 | 各記事1時間 |

---

## 施策1: Google Indexing API で全記事を一括インデックス申請

### Why（CEO/COO視点）
- 50記事中43記事が表示ゼロ。コンテンツ資産の86%が眠っている状態
- 新規ドメインはGoogleのクロール頻度が低く、自然インデックスに数週間〜数ヶ月かかる
- APIで能動的に通知することで、インデックス速度を劇的に短縮できる
- **これが解消されない限り、他の施策の効果も限定的**

### What（CMO視点）
- 全50記事のURLをGoogle Indexing APIで `URL_UPDATED` 通知する
- 特に中国VPN系記事（8記事）は検索ボリュームが大きく、インデックスされれば即座にトラフィック貢献

### How（エンジニア実行手順）

#### 前提条件
- Google Cloud プロジェクトで Indexing API を有効化済み
- サービスアカウントキー（JSON）を取得済み
- GSC でサービスアカウントのメールアドレスをサイト所有者として追加済み

#### 手順

```bash
# Step 1: まず dry-run で対象URLを確認（全記事）
GOOGLE_SERVICE_ACCOUNT_KEY=/path/to/service-account.json \
  npx tsx scripts/request-indexing.ts --since 2020-01-01 --dry-run

# Step 2: 問題なければ実行
GOOGLE_SERVICE_ACCOUNT_KEY=/path/to/service-account.json \
  npx tsx scripts/request-indexing.ts --since 2020-01-01

# Step 3: トップページ・カテゴリページも個別に申請
GOOGLE_SERVICE_ACCOUNT_KEY=/path/to/service-account.json \
  npx tsx scripts/request-indexing.ts --urls \
  https://kaigai-digital.com,\
  https://kaigai-digital.com/china,\
  https://kaigai-digital.com/thailand,\
  https://kaigai-digital.com/korea,\
  https://kaigai-digital.com/taiwan,\
  https://kaigai-digital.com/vietnam,\
  https://kaigai-digital.com/uae
```

#### 注意事項
- Indexing API のクォータは1日あたり200リクエスト。50記事+7カテゴリ=57件なので1回で十分
- API通知はあくまで「クロールリクエスト」。インデックス保証ではない
- 送信後、GSCの「ページのインデックス登録」レポートで進捗を追跡

#### 前提条件が未整備の場合

```
1. Google Cloud Console (https://console.cloud.google.com) でプロジェクト作成
2. 「Web Search Indexing API」を有効化
3. サービスアカウントを作成 → JSONキーをダウンロード
4. GSC → 設定 → ユーザーと権限 → サービスアカウントのメールを「オーナー」として追加
5. 環境変数 GOOGLE_SERVICE_ACCOUNT_KEY にJSONキーのパスを設定
```

### KPI（COO視点）
- 実行後1週間: インデックス済みページ数 7 → 40以上
- 実行後2週間: 表示回数 288/月 → 1,500/月以上

---

## 施策2: sitemap.xml の lastmod を正確な日付に修正

### Why（CEO/COO視点）
- 現在の sitemap.xml は全ページの lastmod が「アクセス時の現在時刻」
- Googleはこれを「信頼できない lastmod」と判断し、サイトマップの優先度を下げる
- 正確な lastmod はクロールバジェットの最適化に直結する（新規サイトではクロール頻度が限られるため特に重要）

### What（CMO視点）
- 各記事の frontmatter にある `updatedAt` を使って正確な lastmod を出力する
- 静的ページ（トップ、検索、プライバシーポリシー等）は固定日付を設定

### How（エンジニア実行手順）

#### 現在のコード（問題箇所）
```typescript
// src/app/sitemap.xml/route.ts
// ❌ すべて new Date().toISOString() になっている
const staticPages = [
  { url: "", lastmod: new Date().toISOString() },
  ...
];
const articlePages = slugs.map((s) => {
  return { url, lastmod: new Date().toISOString() };  // ❌
});
```

#### 修正方針
```typescript
// ✅ getAllSlugs() の返り値に updatedAt を含める
// ✅ 記事ページは frontmatter の updatedAt を使用
// ✅ 静的ページはビルド日ではなく最終更新日を固定値で設定
```

#### 修正内容

1. `src/lib/mdx.ts` の `getAllSlugs()` が `updatedAt` を返すように修正
2. `src/app/sitemap.xml/route.ts` を以下のように修正:

```typescript
import { getAllSlugs } from "@/lib/mdx";
import { countries } from "@/lib/countries";
import { siteConfig } from "@/lib/config";

export async function GET() {
  const slugs = getAllSlugs(); // updatedAt を含む

  const staticPages = [
    { url: "", lastmod: "2026-03-22" },         // サイト公開日
    { url: "/search", lastmod: "2026-03-22" },
    { url: "/privacy-policy", lastmod: "2026-03-22" },
    { url: "/disclaimer", lastmod: "2026-03-22" },
  ];

  const countryPages = countries.map((c) => ({
    url: `/${c.id}`,
    lastmod: "2026-03-22", // カテゴリページの最終更新日
  }));

  const articlePages = slugs.map((s) => {
    let url: string;
    if (s.category === "country") {
      url = `/${s.slug}`;
    } else {
      url = `/${s.category}/${s.slug}`;
    }
    return {
      url,
      lastmod: s.updatedAt || s.publishedAt || "2026-03-22",  // ✅ 記事の実日付
    };
  });

  const allPages = [...staticPages, ...countryPages, ...articlePages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${siteConfig.url}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
```

#### 確認方法
```bash
npm run dev
# ブラウザで http://localhost:3000/sitemap.xml を開き、
# 各 <lastmod> が記事ごとに異なる日付になっていることを確認
```

### KPI（COO視点）
- クロール統計レポートで「クロール頻度」の変化を追跡
- 2週間後にGSC「クロールの統計情報」で改善を確認

---

## 施策3: paypay-overseas の title / description 最適化

### Why（CEO/COO視点）
- サイト全体で最も表示回数が多いページ（151回 / 全体の52%）
- しかし CTR 0.66%（1クリック/151表示）は異常に低い。業界平均CTRの1/5以下
- タイトルとディスクリプションの改善だけで、コード変更なしにクリック数を数倍にできる
- このページが集客エンジンになるかどうかで、サイト全体の成長速度が変わる

### What（CMO視点）

#### 検索クエリの分析
paypay-overseas に流入しているクエリ:
| クエリ | 表示 | 順位 |
|--------|------|------|
| paypay 使える国 | 7 | 12.7 |
| paypayが使える国 | 2 | 10.5 |
| paypay使える国 | 6 | 8.3 |
| ペイペイ 使える国 | 2 | 9.5 |
| ペイペイが使える国 | 2 | 11 |
| ペイペイ 海外 | 3 | 26.7 |
| paypay 海外 使える国 | 2 | 7.5 |
| paypay 海外 | 2 | 35.5 |
| paypay 海外で使う | 1 | 28 |

**検索意図の分析:**
- 「使える国」系 = **一覧を求めている**（情報探索型）
- 「海外」系 = **使い方を知りたい**（How-to型）
- 主軸は「PayPay 使える国 一覧」に集約される

#### 現在のタイトル
```
海外でPayPayは使える？対応国一覧と代わりの決済手段まとめ
```
**問題点:**
- 「海外でPayPayは使える？」は疑問形で弱い。検索者は「使える国一覧」を求めている
- 「代わりの決済手段まとめ」は検索意図とズレ（ユーザーはまず一覧を知りたい）

#### 改善案

**タイトル案（推奨）:**
```
PayPayが使える国一覧【2026年最新】Alipay+対応の全14カ国と使い方
```
- 「PayPayが使える国」= 主軸キーワードを冒頭に
- 「一覧」= 検索意図に完全マッチ
- 「2026年最新」= 鮮度訴求
- 「全14カ国」= 具体的な数字でクリック誘引

**ディスクリプション案:**
```
PayPayは海外14カ国で利用可能。韓国・台湾・タイなどAlipay+提携店で使えます。対応国の一覧と実際に使える店舗、使えない国での代替決済手段をまとめました。
```
- 120字以内
- 「14カ国」「韓国・台湾・タイ」で具体性
- 検索結果で「自分の渡航先が含まれているか」がわかる

### How（実行手順）

```bash
# 1. 記事のフロントマターを編集
# src/content/guide/paypay-overseas.mdx

# title を変更:
title: PayPayが使える国一覧【2026年最新】Alipay+対応の全14カ国と使い方

# description を変更:
description: PayPayは海外14カ国で利用可能。韓国・台湾・タイなどAlipay+提携店で使えます。対応国の一覧と実際に使える店舗、使えない国での代替決済手段をまとめました。

# updatedAt を更新:
updatedAt: '2026-03-30'

# 2. 記事本文のH1直下に「結論」を追加（なければ）
# → 「PayPayはAlipay+提携の14カ国で利用可能。対応国一覧はこちら→（表）」

# 3. 品質チェック
npx tsx scripts/quality-check.ts --path "src/content/guide/paypay-overseas.mdx"

# 4. インデックス再申請
npx tsx scripts/request-indexing.ts --urls https://kaigai-digital.com/guide/paypay-overseas
```

### 追加施策（アフィリエイター視点）
- 記事内の「PayPayが使えない国での代替手段」セクションで **Wiseデビットカード** への誘導を強化
- 現在 `affiliateServices: [wise]` 設定済みだが、記事本文での訴求が弱い可能性
- 「PayPayより為替レートが有利」「200カ国以上で使える」等の比較訴求を追加
- 比較LP `/compare/overseas-remittance` への内部リンクを記事上部にも配置

### KPI（COO視点）
- 1週間後: CTR 0.66% → 3%以上（=4.5クリック/月相当）
- 2週間後: 順位改善に伴い表示回数も増加 → 月間300表示・15クリック目標
- タイトル変更後、GSCで日次CTRを追跡

---

## 施策4: best-esim / overseas-remittance のコンテンツ強化

### Why（CEO/COO視点）
- この2ページはアフィリエイト収益に直結する「比較LP」
- best-esim: Airaloの成約ページ（現状: 38表示、順位49、CTR 0%）
- overseas-remittance: Wiseの成約ページ（現状: 55表示、順位15.5、CTR 1.82%）
- 順位を1ページ目（10位以内）に押し上げれば、アフィリエイト収益が発生し始める
- **サイトのマネタイズを実現するための最重要施策**

### What（CMO + アフィリエイター視点）

#### 4-A: best-esim（順位49 → 目標: 20位以内）

**現状の問題:**
- 「海外esim おすすめ」（17表示、順位83）、「海外 esim おすすめ」（3表示、順位78）で大幅に圏外
- 強豪サイト（価格.com、Time Out、各キャリア公式）と戦うため、差別化が必要

**コンテンツ強化ポイント:**

1. **タイトル改善**
   - 現在: `【2026年】海外おすすめeSIM 5選｜国別の選び方と設定手順`
   - 改善案: `海外eSIMおすすめ5選を実際に使って比較【2026年】料金・速度・設定の全まとめ`
   - 理由: 「実際に使って」で独自性、「料金・速度・設定」で網羅性を訴求

2. **独自性の追加**（他サイトとの差別化）
   - 実際の速度テスト結果（スクショ付き）
   - 国別おすすめeSIM早見表（「タイならAiralo」「韓国ならXX」）
   - 「知恵袋で多い失敗パターン」セクション追加
   - 設定手順のスクリーンショット

3. **E-E-A-T強化**
   - 「編集部が実際にXカ国で使用したレビュー」の明記
   - 最終更新日の明示（記事内にも）
   - 料金表の最終確認日を記載

4. **内部リンク強化**
   - 国別記事（china/esim-comparison, vietnam/esim-comparison）からこの比較LPへのリンクを強化
   - `rakuten-mobile-overseas` → `best-esim` への誘導を追加
   - `korea-esim-chiebukuro` → `best-esim` への誘導を追加

5. **構造の改善**
   - 記事冒頭に「結論: 迷ったらAiraloがおすすめ」を明記
   - 比較表をページ上部に移動（スクロールなしで比較できるように）

#### 4-B: overseas-remittance（順位15.5 → 目標: 8位以内）

**現状の分析:**
- 「paypal wise 比較」（4表示、順位11.5、CTR 25%）→ 購買意欲が非常に高いクエリ
- 「paypal 海外送金」（2表示、順位36.5）→ 改善余地大
- 「海外送金」系全体で55表示 → ボリュームはある

**コンテンツ強化ポイント:**

1. **タイトル改善**
   - 現在: `海外送金はWise一択？PayPal・銀行送金と徹底比較【2026年】`
   - 改善案: `海外送金おすすめ比較｜Wise・PayPal・銀行の手数料を実額で検証【2026年】`
   - 理由: 「実額で検証」で独自性、「手数料」でユーザーの最大関心事にフォーカス

2. **コンテンツ追加**
   - **実額シミュレーション表**: 「10万円を米ドルで送った場合」の手数料・着金額を3サービスで比較
   - **送金シナリオ別おすすめ**: 留学費用、海外赴任の生活費、フリーランス報酬受取、家族への仕送り
   - **よくある失敗パターン**: 「銀行の海外送金で中継銀行手数料を知らなかった」等

3. **「PayPal Wise 比較」「PayPal Wise どっち」への最適化**
   - このクエリはCTR 25%の超優良クエリ
   - H2に「PayPalとWiseはどっちがいい？5つの違いを比較」を追加
   - 比較表を充実させる（手数料、為替レート、送金速度、対応通貨、使いやすさ）

4. **Wise誘導の強化（アフィリエイター視点）**
   - 「結論: 個人の海外送金はWiseが最安」を記事冒頭に
   - CTAの文言を具体化:「Wiseなら10万円の送金手数料が約600円」
   - 無料アカウント開設の手順を簡潔に記載

### How（実行手順）

```bash
# === best-esim ===

# 1. フロントマターの title/description を更新
# 2. 記事本文にセクション追加:
#    - 国別おすすめ早見表
#    - 「知恵袋で多いeSIMの失敗」セクション
#    - 実速度の比較情報
# 3. 文字数を現在の範囲（3,000〜4,500字）内で最大化

# 4. 他記事からの内部リンク追加（以下のファイルを編集）:
#    - src/content/countries/china/esim-comparison.mdx → best-esimへのリンク追加
#    - src/content/countries/vietnam/esim-comparison.mdx → best-esimへのリンク追加
#    - src/content/compare/rakuten-mobile-overseas.mdx → best-esimへのリンク追加
#    - src/content/guide/korea-esim-chiebukuro.mdx → best-esimへのリンク追加

# 5. updatedAt を今日に更新
# 6. 品質チェック
npx tsx scripts/quality-check.ts --path "src/content/compare/best-esim.mdx"

# === overseas-remittance ===

# 1. フロントマターの title/description を更新
# 2. 記事本文にセクション追加:
#    - 実額シミュレーション比較表
#    - PayPal vs Wise 詳細比較セクション
#    - 送金シナリオ別おすすめ
# 3. 他記事からの内部リンク追加:
#    - src/content/guide/paypay-overseas.mdx → overseas-remittanceへのリンク追加
#    - src/content/countries/china/banking-access.mdx → overseas-remittanceへのリンク追加

# 4. updatedAt を今日に更新
# 5. 品質チェック
npx tsx scripts/quality-check.ts --path "src/content/compare/overseas-remittance.mdx"

# === 共通 ===
# インデックス再申請
npx tsx scripts/request-indexing.ts --urls \
  https://kaigai-digital.com/compare/best-esim,\
  https://kaigai-digital.com/compare/overseas-remittance
```

### KPI（COO視点）

| ページ | 現在 | 1ヶ月後目標 | 3ヶ月後目標 |
|--------|------|-------------|-------------|
| best-esim 順位 | 49位 | 25位 | 10位以内 |
| best-esim 表示 | 38/月 | 200/月 | 1,000/月 |
| overseas-remittance 順位 | 15.5位 | 10位 | 5位以内 |
| overseas-remittance 表示 | 55/月 | 300/月 | 1,500/月 |
| Airalo成約 | 0 | 1〜3件/月 | 10件/月 |
| Wise成約 | 0 | 2〜5件/月 | 15件/月 |

---

## 施策5: 知恵袋記事の韓国・台湾への横展開

### Why（CEO/COO視点）
- 知恵袋系記事は現在サイト内で最高のCTR（20%）を記録
- thailand/sim-chiebukuro（順位4.6）、china/expat-net-chiebukuro（順位5.0）はわずか10日で上位表示
- ロングテールキーワードのため競合が少なく、新規ドメインでも短期間で上位を獲得できる
- 韓国・台湾はまだ知恵袋記事がゼロ → 確実に埋められる隙間

### What（CMO + アフィリエイター視点）

#### 横展開の優先順位

| 優先度 | 記事 | 想定キーワード | 月間検索Vol目安 | 紐づく商材 |
|--------|------|--------------|----------------|-----------|
| P1 | korea/esim-chiebukuro | 韓国 eSIM おすすめ 知恵袋 | 中 | Airalo |
| P1 | korea/vpn-chiebukuro | 韓国 VPN 必要 知恵袋 | 低〜中 | NordVPN |
| P1 | taiwan/sim-chiebukuro | 台湾 SIM おすすめ 知恵袋 | 中 | Airalo |
| P2 | korea/sim-chiebukuro | 韓国 SIM 現地購入 知恵袋 | 中 | Airalo |
| P2 | taiwan/vpn-chiebukuro | 台湾 VPN 知恵袋 | 低 | NordVPN |
| P2 | thailand/vpn-chiebukuro | タイ VPN 知恵袋 | 低〜中 | NordVPN |
| P3 | uae/esim-chiebukuro | ドバイ SIM おすすめ 知恵袋 | 低 | Airalo |
| P3 | vietnam/sim-chiebukuro | ベトナム SIM おすすめ 知恵袋 | 低〜中 | Airalo |

※ guide/korea-esim-chiebukuro.mdx は既に存在するが、`/guide/` カテゴリ。韓国カテゴリ内にも配置する価値あり（検索意図が異なる場合のみ。重複に注意）

#### 知恵袋記事の勝ちパターン（既存記事から抽出）

**構造テンプレート:**
```
1. 結論（50字以内で核心を述べる）
2. <CTA service="xxx" placement="top" />
3. ## 知恵袋でよくある質問パターン（3〜4個の声を紹介）
4. ## [質問1]の解決策（詳細セクション）
5. ## [質問2]の解決策
6. <CTA service="xxx" placement="middle" />
7. ## 料金・サービス比較表
8. ## 渡航前にやるべきこと（チェックリスト）
9. ## まとめ（箇条書き3〜5項）
10. <CTA service="xxx" placement="bottom" />
```

**タイトル形式:**
```
[国名]の[トピック]おすすめは？知恵袋の旅行者レビューまとめ【2026年】
```

**必須要素:**
- 文字数: 1,400〜1,900字
- CTA: 最低3箇所（top, middle, bottom）
- FAQ: 3つ以上
- 内部リンク: 最低3本（うち1本は比較LP）
- 「知恵袋では...」の引用形式を複数箇所に

### How（実行手順）

#### P1記事の作成（3記事）

```bash
# Step 1: プロンプト資料を確認
# prompts/system-prompt.md を読む
# prompts/article-types/ の該当テンプレートを確認
# prompts/country-context/ の国別コンテキストを確認

# Step 2: 記事作成（draftsディレクトリに）
# src/content/drafts/korea/esim-chiebukuro.mdx
# src/content/drafts/korea/vpn-chiebukuro.mdx
# src/content/drafts/taiwan/sim-chiebukuro.mdx

# Step 3: 品質チェック
npx tsx scripts/quality-check.ts --path "src/content/drafts/korea/*.mdx"
npx tsx scripts/quality-check.ts --path "src/content/drafts/taiwan/*.mdx"

# Step 4: 公開
npx tsx scripts/promote-draft.ts "src/content/drafts/korea/esim-chiebukuro.mdx"
npx tsx scripts/promote-draft.ts "src/content/drafts/korea/vpn-chiebukuro.mdx"
npx tsx scripts/promote-draft.ts "src/content/drafts/taiwan/sim-chiebukuro.mdx"

# Step 5: インデックス申請
npx tsx scripts/request-indexing.ts --urls \
  https://kaigai-digital.com/korea/esim-chiebukuro,\
  https://kaigai-digital.com/korea/vpn-chiebukuro,\
  https://kaigai-digital.com/taiwan/sim-chiebukuro
```

#### 記事間の内部リンク設計

```
[新規] korea/esim-chiebukuro
  → /compare/best-esim（比較LP）
  → /korea/net-guide（韓国ネットガイド）
  → /guide/korea-esim-chiebukuro（既存ガイド）

[新規] korea/vpn-chiebukuro
  → /compare/best-vpn（比較LP）
  → /korea/net-guide
  → /compare/streaming-vpn

[新規] taiwan/sim-chiebukuro
  → /compare/best-esim（比較LP）
  → /taiwan/net-guide
  → /guide/smartphone-settings-before-travel
```

同時に既存記事からも新記事へリンクを追加:
```
korea/net-guide → korea/esim-chiebukuro, korea/vpn-chiebukuro へリンク追加
taiwan/net-guide → taiwan/sim-chiebukuro へリンク追加
compare/best-esim → korea/esim-chiebukuro, taiwan/sim-chiebukuro へリンク追加
```

### KPI（COO視点）

| 指標 | 1ヶ月後 | 3ヶ月後 |
|------|---------|---------|
| 知恵袋記事数 | 14 → 17記事 | 22記事 |
| 知恵袋記事の月間表示 | 50 | 500 |
| 知恵袋記事の月間クリック | 10 | 100 |
| 知恵袋記事の平均CTR | 15%以上 | 15%以上 |

---

## 全体ロードマップ

```
Week 1（3/31〜4/6）
├── [エンジニア] 施策1: Indexing API 一括申請 ← 最優先
├── [エンジニア] 施策2: sitemap.xml lastmod 修正
└── [CMO] 施策3: paypay-overseas タイトル最適化

Week 2（4/7〜4/13）
├── [CMO] 施策4-B: overseas-remittance コンテンツ強化
├── [CMO] 施策4-A: best-esim コンテンツ強化
└── [エンジニア] インデックス状況の中間チェック

Week 3〜4（4/14〜4/27）
├── [CMO+エンジニア] 施策5: 知恵袋P1記事 3本作成・公開
├── [全員] GSCデータの週次レビュー開始
└── [COO] KPI進捗確認・次月計画策定
```

## 月次レビュー指標

| 指標 | 現在（3/30） | 4月末目標 | 6月末目標 |
|------|-------------|-----------|-----------|
| インデックス済みページ | ~7 | 50+ | 65+ |
| 月間表示回数 | 288 | 3,000 | 15,000 |
| 月間クリック数 | 5 | 100 | 500 |
| 平均CTR | 1.74% | 3% | 4% |
| アフィリエイト成約 | 0 | 3〜5件 | 20件 |
