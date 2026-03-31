# 知恵袋記事量産 対応指示書

> 作成日: 2026-03-31
> 根拠データ: GSC 過去28日間（知恵袋記事CTR 20% / 平均順位4.8位）

---

## 背景と目的

### なぜ知恵袋記事を量産するのか（CEO/COO視点）

知恵袋記事はサイト内で圧倒的なパフォーマンスを記録している:

| 記事タイプ | 平均CTR | 平均順位 | クリック効率 |
|-----------|---------|---------|------------|
| 知恵袋記事 | **20%** | **4.8位** | 3click / 15imp |
| 比較LP | 0.9% | 32位 | 1click / 93imp |
| ガイド記事 | 0.66% | 10.9位 | 1click / 151imp |

新規ドメインがビッグワード（「海外eSIM おすすめ」等）で上位を取るには6〜12ヶ月かかる。
知恵袋記事はロングテールで競合が少なく、**公開10日で上位表示**を実現済み。

**戦略的な位置づけ:**
```
[知恵袋記事群（集客）] → 内部リンク → [比較LP（CV）] → アフィリエイト成約
```
知恵袋記事は「集客パイプライン」。比較LPは「CVエンジン」。両輪で回す。

### 量産の条件（リスク管理）

1. **CV導線が明確な記事のみ**（商材に紐づかない記事は作らない）
2. **月10〜15記事ペース**で段階的に投入（一気に50記事はスパム判定リスク）
3. **タイトルのバリエーション**を持たせる（後述）
4. **品質基準を維持**（quality-check.ts を必ず通す）

---

## Phase 1: 基盤整備（実施順）

### Step 1: 知恵袋記事テンプレートを作成

`prompts/article-types/chiebukuro.md` を新規作成する。

batch-generate.ts の `typeMap` に `chiebukuro` を追加し、
CSV の `article_type` に `chiebukuro` を指定すれば自動でテンプレートが適用される。

#### テンプレート内容

```markdown
# 知恵袋まとめ記事の追加指示

文字数: 2,000〜2,800字

## 構造
1. 結論50字以内（「eSIM事前購入が最もラク」等、断定的に）
2. CTA(top)
3. 知恵袋でよくある質問パターン（3〜4個）
   - 各パターンは「」付きの引用風見出し
   - 知恵袋での声を紹介 → 事実に基づく回答
4. 比較表またはメリデメ整理（表形式）
5. CTA(middle)
6. 実践ガイド（3〜5ステップ or チェックリスト）
7. セキュリティ・注意点
8. まとめ（箇条書き3〜5項）
9. CTA(bottom)

## タイトル形式（バリエーション必須）
以下からランダムに選択。同一パターンの連続使用は禁止:
- A: [国名]の[トピック]おすすめは？知恵袋の旅行者レビューまとめ【2026年】
- B: [国名]で[トピック]どうする？知恵袋の先輩駐在員の声まとめ【2026年】
- C: [トピック]の理由と解決法｜知恵袋の声まとめ【2026年】
- D: [国名]の[トピック]を徹底調査｜知恵袋のリアルな評判【2026年】
- E: [トピック]は実際どう？知恵袋の体験談と最適解【2026年】

## ルール
- 「知恵袋では...」「知恵袋に多い声として...」の引用形式を3箇所以上に
- 質問パターンの見出しは「」で囲み、実際の質問風にする
- CTA 最低3箇所（top, middle, bottom）
- FAQ 3個以上（フロントマターに記載）
- 内部リンク 最低4本（うち1本は比較LP /compare/*）
- 著者: Kaigai Digital 編集部
- VPN規制国の記事は末尾に免責事項を記載
```

### Step 2: batch-generate.ts に chiebukuro タイプを登録

`scripts/batch-generate.ts` の `typeMap` に追加:

```typescript
const typeMap: Record<string, string> = {
  compare: "prompts/article-types/compare.md",
  country_hub: "prompts/article-types/country-hub.md",
  country_service: "prompts/article-types/country-service.md",
  country_comparison: "prompts/article-types/country-comparison.md",
  guide: "prompts/article-types/guide.md",
  chiebukuro: "prompts/article-types/chiebukuro.md",  // 追加
};
```

### Step 3: 量産候補CSVを作成

`articles-data/batch-chiebukuro.csv` を作成する。

---

## Phase 2: 量産候補リスト（全30記事）

### 優先度P1: 即効性が高い（Wave 1 — 初月10記事）

CV導線が明確で、既存の比較LPに直結する記事。

| # | slug | title_pattern | country | main_keyword | target_affiliate | internal_links |
|---|------|---------------|---------|-------------|-----------------|----------------|
| 1 | korea/sim-chiebukuro | A | korea | 韓国 SIM 現地購入 知恵袋 | airalo | korea/net-guide;korea/esim-chiebukuro;compare/best-esim |
| 2 | taiwan/esim-chiebukuro | E | taiwan | 台湾 eSIM おすすめ 知恵袋 | airalo | taiwan/net-guide;taiwan/sim-chiebukuro;compare/best-esim |
| 3 | taiwan/vpn-chiebukuro | C | taiwan | 台湾 VPN 必要 知恵袋 | nordvpn | taiwan/net-guide;compare/best-vpn;compare/streaming-vpn |
| 4 | thailand/vpn-chiebukuro | C | thailand | タイ VPN 必要 知恵袋 | nordvpn | thailand/net-guide;compare/best-vpn;compare/streaming-vpn |
| 5 | vietnam/sim-chiebukuro | A | vietnam | ベトナム SIM おすすめ 知恵袋 | airalo | vietnam/net-guide;vietnam/esim-comparison;compare/best-esim |
| 6 | korea/netflix-chiebukuro | C | korea | 韓国 Netflix 日本版 見れない 知恵袋 | nordvpn | korea/net-guide;korea/vpn-chiebukuro;compare/streaming-vpn |
| 7 | taiwan/netflix-chiebukuro | C | taiwan | 台湾 Netflix 日本版 見れない 知恵袋 | nordvpn | taiwan/net-guide;compare/streaming-vpn;compare/best-vpn |
| 8 | guide/overseas-remittance-chiebukuro | E | | 海外送金 手数料 知恵袋 | wise | compare/overseas-remittance;guide/paypay-overseas;guide/expat-checklist |
| 9 | uae/esim-chiebukuro | A | uae | ドバイ SIM eSIM おすすめ 知恵袋 | airalo | uae/net-guide;compare/best-esim;uae/whatsapp-line |
| 10 | guide/esim-setup-chiebukuro | E | | eSIM 設定 難しい 知恵袋 | airalo | compare/best-esim;guide/smartphone-settings-before-travel;compare/rakuten-mobile-overseas |

### 優先度P2: 中国記事の補強（Wave 2 — 2ヶ月目5記事）

中国VPN記事群がインデックスされた後の追加。既存8記事との差別化に注意。

| # | slug | title_pattern | country | main_keyword | target_affiliate | internal_links |
|---|------|---------------|---------|-------------|-----------------|----------------|
| 11 | china/sim-chiebukuro | A | china | 中国 SIM eSIM おすすめ 知恵袋 | airalo | china/esim-comparison;china/net-guide;compare/best-esim |
| 12 | china/netflix-chiebukuro | C | china | 中国 Netflix 見れない 知恵袋 | nordvpn;kabeneko | china/net-guide;compare/streaming-vpn;china/vpn-comparison |
| 13 | china/chatgpt-chiebukuro | D | china | 中国 ChatGPT 使えない 知恵袋 | nordvpn;kabeneko | china/chatgpt-vpn;china/net-guide;compare/best-vpn |
| 14 | china/wifi-chiebukuro | D | china | 中国 Wi-Fi 安全 知恵袋 | nordvpn;kabeneko | china/free-wifi;china/net-guide;guide/hotel-wifi-safety |
| 15 | china/map-chiebukuro | E | china | 中国 Googleマップ 使えない 知恵袋 | nordvpn | china/map-apps;china/net-guide;compare/best-vpn |

### 優先度P3: ガイド系ロングテール（Wave 3 — 2〜3ヶ月目5記事）

特定国に依存しない横串の知恵袋記事。

| # | slug | title_pattern | country | main_keyword | target_affiliate | internal_links |
|---|------|---------------|---------|-------------|-----------------|----------------|
| 16 | guide/vpn-chiebukuro | E | | VPN おすすめ 知恵袋 海外 | nordvpn | compare/best-vpn;compare/streaming-vpn;guide/nordvpn-setup |
| 17 | guide/overseas-wifi-chiebukuro | D | | 海外 Wi-Fi レンタル 知恵袋 | airalo | guide/wifi-rental-chiebukuro;compare/best-esim;guide/hotel-wifi-safety |
| 18 | guide/rakuten-overseas-chiebukuro | E | | 楽天モバイル 海外 知恵袋 | airalo | compare/rakuten-mobile-overseas;compare/best-esim;guide/smartphone-settings-before-travel |
| 19 | guide/sim-number-chiebukuro | E | | 海外赴任 電話番号 維持 知恵袋 | | compare/best-sim-number;guide/expat-checklist;compare/best-esim |
| 20 | guide/hotel-wifi-chiebukuro | D | | ホテル Wi-Fi 安全 知恵袋 | nordvpn | guide/hotel-wifi-safety;guide/free-wifi-danger-chiebukuro;compare/best-vpn |

### 優先度P3: 追加国展開（Wave 3 — 3ヶ月目10記事）

新規国カテゴリの追加も視野に入れる。

| # | slug | title_pattern | country | main_keyword | target_affiliate | internal_links |
|---|------|---------------|---------|-------------|-----------------|----------------|
| 21 | vietnam/netflix-chiebukuro | C | vietnam | ベトナム Netflix 知恵袋 | nordvpn | vietnam/net-guide;compare/streaming-vpn;compare/best-vpn |
| 22 | uae/vpn-chiebukuro | C | uae | ドバイ VPN 必要 知恵袋 | nordvpn | uae/net-guide;uae/whatsapp-line;compare/best-vpn |
| 23 | korea/wifi-chiebukuro | D | korea | 韓国 Wi-Fi 事情 知恵袋 | nordvpn | korea/net-guide;guide/hotel-wifi-safety;compare/best-vpn |
| 24 | thailand/esim-chiebukuro | E | thailand | タイ eSIM おすすめ 知恵袋 | airalo | thailand/sim-chiebukuro;thailand/net-guide;compare/best-esim |
| 25 | thailand/wifi-chiebukuro | D | thailand | タイ Wi-Fi カフェ 知恵袋 | nordvpn | thailand/net-guide;guide/hotel-wifi-safety;compare/best-vpn |
| 26 | vietnam/wifi-chiebukuro | D | vietnam | ベトナム Wi-Fi 事情 知恵袋 | nordvpn | vietnam/net-guide;guide/hotel-wifi-safety;compare/best-vpn |
| 27 | korea/payment-chiebukuro | E | korea | 韓国 キャッシュレス 決済 知恵袋 | wise | korea/net-guide;guide/paypay-overseas;compare/overseas-remittance |
| 28 | taiwan/payment-chiebukuro | E | taiwan | 台湾 キャッシュレス 決済 知恵袋 | wise | taiwan/net-guide;guide/paypay-overseas;compare/overseas-remittance |
| 29 | china/payment-chiebukuro | E | china | 中国 決済 アリペイ 知恵袋 | wise | china/net-guide;china/banking-access;compare/overseas-remittance |
| 30 | uae/wifi-chiebukuro | D | uae | ドバイ Wi-Fi ホテル 知恵袋 | nordvpn | uae/net-guide;guide/hotel-wifi-safety;compare/best-vpn |

---

## Phase 3: 実行手順

### Wave 1 の実行フロー

```bash
# Step 1: テンプレート作成（前述の内容を保存）
# → prompts/article-types/chiebukuro.md

# Step 2: batch-generate.ts に chiebukuro タイプを追加
# → typeMap に chiebukuro エントリ追加

# Step 3: CSV作成
# → articles-data/batch-chiebukuro-wave1.csv

# Step 4: dry-run で内容確認
npx tsx scripts/batch-generate.ts \
  --input articles-data/batch-chiebukuro-wave1.csv \
  --dry-run

# Step 5: 生成実行（並列3、Sonnet使用）
npx tsx scripts/batch-generate.ts \
  --input articles-data/batch-chiebukuro-wave1.csv \
  --concurrency 3

# Step 6: 品質チェック
npx tsx scripts/quality-check.ts --path "src/content/drafts/**/*.mdx"

# Step 7: エラー修正（あれば手動で修正）

# Step 8: 一括公開
for f in src/content/drafts/**/*-chiebukuro.mdx; do
  npx tsx scripts/promote-draft.ts "$f" --no-ping
done

# Step 9: インデックス申請
GOOGLE_SERVICE_ACCOUNT_KEY=~/.config/kaigai-digital/service-account.json \
  npx tsx scripts/request-indexing.ts --since $(date +%Y-%m-%d)

# Step 10: ブログ村ping送信
npx tsx scripts/ping-blogmura.ts
```

### 既存記事への内部リンク追加（公開後に実施）

新記事を公開したら、関連する既存記事からも新記事へリンクを追加する:

```
各国 net-guide.mdx → 該当国の新chiebukuro記事へリンク追加
compare/best-esim.mdx → 国別chiebukuro記事へリンク追加
compare/best-vpn.mdx → 国別chiebukuro記事へリンク追加
```

---

## Phase 4: 効果測定と運用

### 週次チェック項目（CMO）

| 指標 | 確認方法 | 期待値 |
|------|---------|--------|
| インデックス状況 | GSC「ページのインデックス登録」 | 公開後1週間で90%以上 |
| 表示回数 | GSC パフォーマンスレポート | 1記事あたり50〜200/月 |
| CTR | GSC パフォーマンスレポート | 10%以上（知恵袋記事平均） |
| 平均順位 | GSC パフォーマンスレポート | 10位以内 |
| 比較LPへの送客 | GA4 内部リンククリック | 各記事から5click/月以上 |

### Wave間のGo/No-Go判断（COO）

| 条件 | Go | No-Go |
|------|-----|-------|
| Wave 1のインデックス率 | 80%以上 | 50%未満 → 原因調査 |
| Wave 1の平均CTR | 8%以上 | 3%未満 → テンプレート見直し |
| Wave 1の平均順位 | 15位以内 | 30位以下 → KW選定見直し |
| スパム判定 | なし | 手動対策通知 → 即停止 |

### KPI目標（CEO/COO）

| 指標 | 現在 | Wave 1完了後（1ヶ月） | Wave 2完了後（2ヶ月） | Wave 3完了後（3ヶ月） |
|------|------|---------------------|---------------------|---------------------|
| 知恵袋記事数 | 17 | 27 | 32 | 47 |
| 知恵袋記事の月間表示 | 15 | 1,000 | 3,000 | 8,000 |
| 知恵袋記事の月間クリック | 3 | 100 | 400 | 1,000 |
| 比較LPへの送客 | - | 50/月 | 200/月 | 500/月 |
| アフィリエイト成約 | 0 | 3〜5件 | 10〜15件 | 30件 |

### コスト見積もり（アフィリエイター視点）

| 項目 | Wave 1（10記事） | Wave 2（5記事） | Wave 3（15記事） |
|------|-----------------|----------------|-----------------|
| API生成コスト（Sonnet） | ~$1.50 | ~$0.75 | ~$2.25 |
| 品質チェック・修正 | 2〜3時間 | 1〜2時間 | 3〜5時間 |
| 内部リンク追加 | 1〜2時間 | 30分 | 2〜3時間 |
| **合計コスト** | **~$1.50 + 4時間** | **~$0.75 + 2時間** | **~$2.25 + 6時間** |

記事あたりのコストは約$0.15 + 20分。ROIは1成約で回収可能。

---

## 注意事項

### やらないこと
- CV導線のない記事（例:「海外旅行 持ち物 知恵袋」→ 商材なし）
- 既存記事とカニバる記事（例: china/vpn-chiebukuro は既存）
- 同一タイトルパターンの連続使用
- 1日10記事以上の一括公開

### カニバリチェック（公開前に必須）
新記事の `main_keyword` で既存記事を検索し、重複がないか確認:
```bash
grep -r "メインキーワード" src/content/ --include="*.mdx" -l
```

### 既存知恵袋記事一覧（重複回避用）
```
✅ china/vpn-chiebukuro
✅ china/line-chiebukuro
✅ china/google-chiebukuro
✅ china/youtube-chiebukuro
✅ china/vpn-legal-chiebukuro
✅ china/banking-chiebukuro
✅ china/business-trip-chiebukuro
✅ china/expat-net-chiebukuro
✅ thailand/sim-chiebukuro
✅ vietnam/vpn-chiebukuro
✅ uae/line-call-chiebukuro
✅ korea/esim-chiebukuro（今回作成）
✅ korea/vpn-chiebukuro（今回作成）
✅ taiwan/sim-chiebukuro（今回作成）
✅ guide/korea-esim-chiebukuro
✅ guide/wifi-rental-chiebukuro
✅ guide/free-wifi-danger-chiebukuro
```
