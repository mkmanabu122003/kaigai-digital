# 記事統廃合プラン（73本 → 35本）

作成日: 2026-08-06
根拠データ: `reports/data/coverage/2026-08-05.json`（URL Inspection API実測）, `reports/data/2026-08-05.json`（GSC 28日）

---

## 1. なぜ統廃合するのか

### 事実1: インデックス率は平均文字数と相関している

| セクション | 記事数 | INDEX済 | 率 | 表示回数 | 平均文字数 |
|---|---|---|---|---|---|
| compare | 7 | 4 | **57%** | 102 | **4,153字** |
| taiwan | 5 | 3 | 60% | 31 | 3,303字 |
| china | 25 | 7 | 28% | 24 | 2,951字 |
| guide | 19 | 2 | **11%** | 88 | 3,008字 |
| korea / uae / vietnam | 13 | **0** | 0% | **0** | 3,331字 |

最も厚い compare（平均4,153字）のインデックス率が最も高く、表示回数の39%を稼いでいる。

### 事実2: 表示回数の72%が9記事に集中している

263impのうち190impを以下9本が占める。**残り64本の表示回数は合計73imp（1本あたり1.1imp）**。

`/guide/paypay-overseas`(51) `/compare/overseas-remittance`(46) `/guide/travel-insurance-credit-card-chiebukuro`(37) `/taiwan/esim-chiebukuro`(31) `/compare/best-esim`(27) `/china/credit-card-chiebukuro`(18) `/compare/best-vpn`(16) `/compare/rakuten-mobile-overseas`(13) `/china/vpn-chiebukuro`(3)

### 事実3: サイト内カニバリゼーションが多発している ★真因

「検出 – インデックス未登録」45本の主因は、DR0だけでなく**同一トピックの記事が複数存在すること**。Googleは重複と判断した側をインデックスしない。

実際に確認された共食い:

| トピック | 重複記事 | 状態 |
|---|---|---|
| 韓国eSIM | `/korea/esim-chiebukuro`, `/korea/sim-chiebukuro`, `/guide/korea-esim-chiebukuro` | **3本すべて未登録** |
| 台湾から日本の動画 | `/taiwan/netflix-chiebukuro`, `/taiwan/vpn-chiebukuro` | 両方INDEX済だが**表示0** |
| 海外フリーWiFiの危険性 | `/guide/free-wifi-danger-chiebukuro`, `/guide/hotel-wifi-safety`, `/china/free-wifi` | 3本すべて未登録 |
| 海外クレカ | `/guide/expat-credit-card-chiebukuro`, `/guide/how-many-cards-chiebukuro`, `/guide/travel-insurance-credit-card-chiebukuro` | INDEX済は1本のみ |
| 中国LINE | `/china/line-vpn`, `/china/line-chiebukuro` | 両方未登録 |
| 中国の銀行アクセス | `/china/banking-access`, `/china/banking-chiebukuro` | 両方未登録 |
| 日本の動画配信 | `/guide/japan-streaming-abroad`, `/compare/streaming-vpn`, `/guide/japan-radio-abroad` | 3本すべて未登録 |

### 🔴 発見された不具合: 台湾2記事のURLと内容が入れ替わっている

| URL | 実際の内容 |
|---|---|
| `/taiwan/netflix-chiebukuro` | TVer・ABEMA について |
| `/taiwan/vpn-chiebukuro` | Netflix について |

両方ともINDEX済みだがURLと内容が一致しておらず、かつトピックが重複している。**統合対象**。

### 統廃合しても失うトラフィックはほぼゼロ

統合対象の記事はいずれも表示0〜2imp。**Googleの世界に事実上存在していない**ため、統合によるトラフィック損失は発生しない。

---

## 2. 統廃合マッピング

凡例: ✅=INDEX済 / ⚠️=クロール済・未登録 / 🔸=検出・未登録 / ❌=URL未認識

### compare（7 → 6本）※最高パフォーマンス。ほぼ維持

| 残す | 状態 | 統合元（301リダイレクト） |
|---|---|---|
| `/compare/best-esim` | ✅ 27imp | `/china/esim-comparison`, `/vietnam/esim-comparison`, `/guide/esim-setup-chiebukuro` |
| `/compare/overseas-remittance` | ✅ 46imp | `/guide/overseas-remittance-chiebukuro` |
| `/compare/best-vpn` | ✅ 16imp | — |
| `/compare/rakuten-mobile-overseas` | ✅ 13imp | — |
| `/compare/airalo-vs-trifa` | 🔸 | — |
| `/compare/best-sim-number` | 🔸 | — |
| ~~`/compare/streaming-vpn`~~ | ❌ | → `/guide/japan-streaming-abroad` へ統合 |

### guide（19 → 8本）※最も整理効果が大きい

| 残す | 状態 | 統合元（301リダイレクト） |
|---|---|---|
| `/guide/paypay-overseas` | ✅ 51imp | — |
| `/guide/travel-insurance-credit-card-chiebukuro` | ✅ 37imp | `/guide/expat-credit-card-chiebukuro`, `/guide/how-many-cards-chiebukuro` |
| `/guide/japan-streaming-abroad` | ❌ | `/compare/streaming-vpn`, `/guide/japan-radio-abroad` |
| `/guide/free-wifi-danger-chiebukuro` | 🔸 | `/guide/hotel-wifi-safety`, `/china/free-wifi` |
| `/guide/expat-checklist` | 🔸 | `/guide/smartphone-settings-before-travel` |
| `/guide/nordvpn-setup` | 🔸 | `/guide/surfshark-setup` |
| `/guide/kabeneko-review` | ❌ | `/guide/kabeneko-setup` |
| `/guide/epos-overseas-cashing` | 🔸 | — |
| ~~`/guide/korea-esim-chiebukuro`~~ | 🔸 | → `/korea/sim-chiebukuro` へ |
| ~~`/guide/wifi-rental-chiebukuro`~~ | 🔸 | → `/compare/best-esim` へ |

### china（25 → 8本）※削減幅が最大

| 残す | 状態 | 統合元（301リダイレクト） |
|---|---|---|
| `/china/net-guide`（6,647字ハブ） | 🔸 | `/china/line-vpn`, `/china/line-chiebukuro`, `/china/google-chiebukuro`, `/china/youtube-chiebukuro`, `/china/instagram-twitter-vpn`, `/china/chatgpt-vpn`, `/china/zoom-teams`, `/china/map-apps`, `/china/free-wifi` |
| `/china/vpn-chiebukuro` | ✅ 4位 | `/china/vpn-free-trial` |
| `/china/credit-card-chiebukuro` | ✅ 18imp | `/china/banking-access`, `/china/banking-chiebukuro` |
| `/china/short-trip` | ✅ | `/china/business-trip-chiebukuro`, `/china/expat-digital-prep`, `/china/expat-net-chiebukuro` |
| `/china/kabeneko-vs-nordvpn` | ✅ | `/china/nordvpn-trouble` |
| `/china/vpn-comparison` | ✅ | `/china/esim-comparison` → compare/best-esimへ |
| `/china/kabeneko-trouble` | ✅ | — |
| `/china/vpn-legal-chiebukuro` | ✅ | — |

> 中国のアプリ別記事9本を `net-guide` に「アプリ別の対策」章として統合すると、ハブが6,647字 → 約12,000字級になり、compare相当の厚みになる。

### korea（5 → 3本）

| 残す | 統合元 |
|---|---|
| `/korea/net-guide` | — |
| `/korea/sim-chiebukuro` | `/korea/esim-chiebukuro`, `/guide/korea-esim-chiebukuro` |
| `/korea/vpn-chiebukuro` | `/korea/netflix-chiebukuro` |

### taiwan（5 → 3本）★最優先で守るべきセクション

| 残す | 統合元 |
|---|---|
| `/taiwan/esim-chiebukuro` ✅ **5.5位・サイト唯一のクリック源** | `/taiwan/sim-chiebukuro` |
| `/taiwan/net-guide` | — |
| `/taiwan/netflix-chiebukuro` ✅ | `/taiwan/vpn-chiebukuro`（URL/内容の入れ替わりもここで解消） |

### thailand（4 → 3本）/ uae（4 → 2本）/ vietnam（4 → 2本）

| 残す | 統合元 |
|---|---|
| `/thailand/sim-chiebukuro` ✅ | — |
| `/thailand/net-guide` | — |
| `/thailand/vpn-chiebukuro` | `/thailand/netflix-vpn` |
| `/uae/net-guide` | `/uae/esim-chiebukuro` |
| `/uae/whatsapp-line` | `/uae/line-call-chiebukuro` |
| `/vietnam/net-guide` | `/vietnam/esim-comparison` |
| `/vietnam/sim-chiebukuro` | `/vietnam/vpn-chiebukuro` |

### 合計

| | 現在 | 統合後 |
|---|---|---|
| compare | 7 | 6 |
| guide | 19 | 8 |
| china | 25 | 8 |
| korea | 5 | 3 |
| taiwan | 5 | 3 |
| thailand | 4 | 3 |
| uae | 4 | 2 |
| vietnam | 4 | 2 |
| **合計** | **73** | **35** |

---

## 3. 実行フェーズ

作業量は統合1件あたり30〜45分。一度に全部やらず、効果の大きい順に3フェーズで進める。

### Phase 1: 明白なカニバリの解消（15本削減 / 最優先）

共食いが確認されており、解消すれば残った側が浮上する可能性が高いもの。

1. 韓国eSIM 3本 → `/korea/sim-chiebukuro`
2. 台湾動画 2本 → `/taiwan/netflix-chiebukuro`（入れ替わりバグも同時解消）
3. 台湾SIM 2本 → `/taiwan/esim-chiebukuro`（**5.5位を強化**）
4. 海外クレカ 3本 → `/guide/travel-insurance-credit-card-chiebukuro`（37imp・17位を強化）
5. フリーWiFi 3本 → `/guide/free-wifi-danger-chiebukuro`
6. 日本の動画配信 3本 → `/guide/japan-streaming-abroad`
7. 中国LINE 2本・中国銀行 2本 → 各統合先へ

### Phase 2: 中国ハブへの集約（9本削減）

中国のアプリ別記事9本を `/china/net-guide` に章として統合。ハブを12,000字級にする。

### Phase 3: 残りの整理（14本削減）

セットアップ系、赴任準備系、uae/vietnamの集約。

---

## 4. 実行手順（1件あたり）

```bash
# 1. 統合先に統合元のユニークな情報をマージ（手動加筆）
#    - 統合元にしかない見出し・FAQ・比較表を移植する
#    - 単純なコピペではなく、重複を削って1本の流れに再構成する

# 2. 統合元ファイルを削除
rm src/content/countries/korea/esim-chiebukuro.mdx

# 3. next.config.ts の redirects() に301を追加
#    { source: "/korea/esim-chiebukuro", destination: "/korea/sim-chiebukuro", permanent: true }

# 4. 内部リンクの張り替えを検証（リンク切れ0であること）
npx tsx scripts/check-internal-links.ts

# 5. 品質チェック
npx tsx scripts/quality-check.ts

# 6. ビルド確認
npm run build

# 7. 統合先URLをIndexing APIで再送信
npx tsx scripts/request-indexing.ts --urls https://kaigai-digital.com/korea/sim-chiebukuro
```

### 注意点

- **sitemapは自動更新される**（`src/app/sitemap.xml/route.ts` が `getAllSlugs()` ベース）ため手動作業は不要
- 301リダイレクトは必ず設定する。設定しないと既存の被リンク・評価が失われる
- `relatedSlugs` フロントマターに統合元のslugが残っていると関連記事ウィジェットが壊れるため、grep で全記事を確認する

```bash
grep -rn "統合元のslug" src/content/ next.config.ts
```

---

## 5. 期待効果と限界

### 期待できること

- クロール予算が35本に集中し、インデックス率が改善する
- 1記事あたりの情報密度が上がり、ヘルプフルコンテンツ判定に有利になる
- 内部リンクが分散せず、主要ページへ集約される
- カニバリ解消により、既存のINDEX済み記事の順位が上がる余地が生まれる

### 統廃合だけでは解決しないこと

**Domain Rating = 0.0** の問題は統廃合では解決しない。被リンク獲得（P0施策）と併走させる必要がある。統廃合は「弾を減らして命中率を上げる」施策であり、「射程を伸ばす」施策ではない。

現状のオーガニック流入は月21セッション。月1万円の収益に必要な水準（約1,700セッション/月）まで約80倍の開きがあり、統廃合単独では埋まらない。
