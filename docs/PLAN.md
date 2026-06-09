# FitAgent 実装スケジュール

> AIパーソナルトレーニング SaaS — MVP 実装ロードマップ  
> 参照: `../../docs/FitAgent_要件定義書.md` / デザイン: `../../../WF/`

---

## 現状

- `fit-agent/` は **README.md のみのグリーンフィールド**（スキャフォールド未実施）
- `../../../WF/` に静的 React プロトタイプあり（`screen-*.jsx` + `data.jsx` + `components.jsx`）— デザインの正は WF
- `../../docs/` に実装ルール（01〜07）あり — 全 Issue で遵守

## 方針

| 項目 | 決定内容 |
|------|---------|
| Issue 粒度 | 機能ID単位（`[AUTH-01]` 等で個別起票） |
| スコープ | MVP優先、栄養管理(NUTR)は v2 分離 |
| AI モデル | OpenAI GPT-4o-mini（Vercel AI SDK + `@ai-sdk/openai`） |
| 作業フロー | Issue → `feature/#<issue番号>` ブランチ → PR（Issue参照） |
| セキュリティ | 全クエリ `where:{ userId }`、全 Server Action で `auth()` 必須 |

> ⚠️ `CLAUDE.md` の docs 参照リンク（`05_ai-sdk` / `06_auth-security` / `07_database` / `08_testing-deployment`）と実ファイル名（`05_state-management` / `06_cache-strategy` / `07_error-handling`）が不一致 → **INFRA-01 で CLAUDE.md を修正する**

---

## マイルストーン

| Sprint | テーマ | 含む Issue | 目安 |
|--------|--------|-----------|------|
| **M1** | 基盤・認証 | INFRA-01〜03, AUTH-01/02/04 | Week 1 |
| **M2** | コア機能 | REC-01〜07/09, DASH-01〜05, HIST-01〜09, PROF-01/03/04/05 | Week 2 |
| **M3** | AI機能 | AI-INFRA, AI-01〜05/08, REC-02 | Week 3 |
| **M4** | 仕上げ・公開 | LP, バリデーション, テスト, デプロイ | Week 4 |
| **v2** | 栄養管理（分離） | NUTR-01〜05, REC-08, AI-06/07 | 後続 |

**着手順の制約**: M1 → M2（REC → DASH/HIST → PROF）→ M3 → M4

**設計参照（全 Issue 共通）**:
- `../../../WF/components.jsx` — 共通UI実装
- `../../../WF/screen-home.jsx` / `screen-workouts.jsx` / `screen-new.jsx` / `screen-ai.jsx` / `screen-plus-modal.jsx`
- `../../../WF/data.jsx` — データ形状・モック値
- `../../../WF/screenshots/` — プロフィール画面キャプチャ

---

## M1 — 基盤・認証（Week 1）

### [INFRA-01] プロジェクトスキャフォールド & ディレクトリ構成

**概要**: Next.js 16(App Router) + TS strict + Tailwind 4 + shadcn/ui を初期化し、`../../docs/01` のディレクトリ規約に沿った骨組みを作る。

**実装内容**:
- `create-next-app`（App Router / TS / Tailwind）。`tsconfig` strict・`any`禁止・path alias `@/*`
- ルートグループ `app/(auth)/` `app/(dashboard)/` を作成。`app/layout.tsx` は **Server Component・`cookies()`/`headers()` 不使用**
- ディレクトリ雛形作成: `actions/` `apis/` `components/{ui,workout,dashboard,history,ai,layout}/` `lib/{prisma.ts,auth.ts,validations/}` `hooks/` `types/` `constants/` `utils/`
- ESLint / Prettier / `interface` 禁止設定（`type` のみ）
- `package.json` の scripts を CLAUDE.md 記載通りに整備（dev/build/typecheck/lint/test/test:run）
- CLAUDE.md の docs 参照リンクを実ファイル名に修正

**受け入れ条件**:
- [ ] `npm run dev` で起動し空ページ表示
- [ ] `npm run typecheck` / `npm run lint` がパス
- [ ] ディレクトリ構成が `../../docs/01_directory_rules.md` と一致
- [ ] ルートレイアウトに `cookies()`/`headers()` を含まない

---

### [INFRA-02] DB スキーマ・Prisma・seed

**概要**: Neon(PostgreSQL) を接続し、要件定義書 §6.2 の Prisma スキーマを定義・マイグレーション。種目マスタを seed。

**実装内容**:
- Neon プロジェクト作成、`DATABASE_URL` を `.env.local`（ハードコード禁止）
- `prisma/schema.prisma` に MVP テーブルを定義:
  - `User` / `Exercise` / `WorkoutSession` / `WorkoutSet` / `AiAdvice`
  - NextAuth 用テーブル（`Account` / `Session` / `VerificationToken`）を Prisma Adapter 用に追加
  - `BodyMetric` / `MealLog` は v2 として **コメントアウト**
- `lib/prisma.ts` でシングルトン Prisma Client
- `prisma migrate dev` 実行
- seed: プリセット種目を `isCustom:false` で投入（胸/背中/脚/肩/腕/体幹の6部位、`../../../WF/data.jsx` の `best1RM` キーを参考に主要種目）

**受け入れ条件**:
- [ ] `npx prisma studio` で全テーブル確認、seed済み種目が部位別に存在
- [ ] 生SQL不使用。全リレーションが要件定義書と一致
- [ ] `npm run build` が通る

---

### [INFRA-03] デザインシステム移植（トークン & 共通コンポーネント）

**概要**: `../../../WF/components.jsx` のインラインスタイル実装を Tailwind 4 + shadcn/ui ベースの再利用コンポーネントへ移植。ダークテーマ・グラデーションを再現。

**実装内容**:
- 要件定義書 §8.1 のカラートークンを Tailwind `@theme` / CSS 変数に登録
  ```
  bg:#0B0C11 / card:#16171F / border:rgba(255,255,255,0.085)
  text:#F4F5FA / muted:rgba(236,238,247,0.56)
  lime:#C8FF4D / amber:#FFB13D
  grad:linear-gradient(135deg,#FF8A3D,#FF3D77,#A24BFF)
  ```
- 共通コンポーネントを実装:
  - `components/ui/`: `Card` `Chip` — shadcn/ui ベース
  - `components/ui/`: `RingStack`（同心円リングSVG）`Sparkline`（小型折れ線SVG）`Bars`（小型棒グラフSVG）
  - `components/ui/`: `SectionHead`（タイトル＋もっと見るリンク）`Icon`（SVGアイコンセット）
  - `components/layout/`: `TabBar`（5タブ・中央＋ボタン `translateY(-6px)` 浮き上がり、`backdrop-blur(16px)`、`paddingBottom:26px`）
- `app/(dashboard)/layout.tsx` に TabBar 配置。モバイルファースト(375px)

**受け入れ条件**:
- [ ] 各共通コンポーネントがダッシュボード画面で表示確認できる
- [ ] `../../../WF/screenshots/profile.png` と同等のダーク+グラデーション外観が 375px 幅で再現
- [ ] `use client` は対話が必要なコンポーネントのみ（`../../docs/02` 準拠）

---

### [AUTH-01] メール認証（サインアップ / ログイン）

**概要**: NextAuth.js v5 Credentials でメール+パスワード認証。`/auth/signup` `/auth/login` を実装。

**実装内容**:
- `lib/auth.ts` に NextAuth v5 設定（Prisma Adapter、Credentials provider、JWT session）
- `app/api/auth/[...nextauth]/route.ts`
- パスワードは bcrypt でハッシュ化。サインアップは Server Action 経由で User 作成
- フォームは React Hook Form + Zod（`lib/validations/auth.ts`）。エラーUI はコンポーネント内
- デザイン: `(auth)` グループ、ダークテーマ準拠フォーム

**受け入れ条件**:
- [ ] 新規登録 → ログイン → セッション確立が動作
- [ ] 重複メールはエラー表示。Zod バリデーションが機能
- [ ] パスワードは平文保存されない

---

### [AUTH-02] Google ログイン（OAuth）

**概要**: Google OAuth プロバイダを追加し、ソーシャルログインを可能にする。

**実装内容**:
- Google Cloud で OAuth クライアント作成。`AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` を `.env.local`
- `lib/auth.ts` に Google provider 追加
- サインアップ/ログイン画面に「Google で続ける」ボタンを追加
- 同一メールの既存アカウントとのリンク方針を決定・実装

**受け入れ条件**:
- [ ] Google アカウントでログインでき、User レコードが作成/紐付けされる
- [ ] ログイン後 `/dashboard` に遷移

---

### [AUTH-04] 認証ガード（middleware + レイアウト）

**概要**: 未ログイン時にダッシュボード配下へのアクセスを制限。

**実装内容**:
- `middleware.ts` で `(dashboard)` 配下を保護（matcher: `/dashboard/:path*` `/workouts/:path*` `/ai/:path*` `/profile/:path*`）
- `app/(dashboard)/layout.tsx` で `auth()` セッション確認、未認証は `/auth/login` へリダイレクト
- ルートレイアウトでは動的API禁止のため、保護は middleware + dashboard layout の二層で行う

**受け入れ条件**:
- [ ] 未認証で `/dashboard` `/workouts` `/ai` `/profile` → `/auth/login` へリダイレクト
- [ ] 認証済みで `/auth/login` → `/dashboard` へリダイレクト

---

## M2 — コア機能（Week 2）

### [REC-01〜06 / REC-09] 記録作成画面

**概要**: `/workouts/new` で種目選択・セット入力・リアルタイム集計・保存を実装。設計は `../../../WF/screen-new.jsx`。

**実装内容**:
- **REC-09 種目選択**: プリセット種目マスタから部位別に選択するモーダル/ドロワー
- **REC-04 種目追加**: 「＋種目を追加」で複数種目をまとめて記録可能
- **REC-03 セット管理**: セットごとに重量/回数入力、+/−ボタンで増減、「＋セットを追加」で行追加。状態は `useState` で管理
- **REC-05 リアルタイム集計**: 総ボリューム（kg = Σ重量×回数）・総セット数をフッターに即時表示
- **REC-06 保存**: `actions/workout.ts` の Server Action で `WorkoutSession` + `WorkoutSet` を作成。`auth()` 必須、`userId` 付与。PR 判定（O'Connor式推定1RM が過去最高を更新したとき `isPR:true`）
- 入力は Zod で検証（負数・空は保存不可）
- `+` ボタンのアクションシート（`../../../WF/screen-plus-modal.jsx`）から `/workouts/new` への導線

**受け入れ条件**:
- [ ] 複数種目×複数セットを入力して保存 → DB に正しく永続化（`userId` 分離確認）
- [ ] フッター集計が入力に追従してリアルタイム更新
- [ ] 不正値（負数・空）は保存不可でエラー表示
- [ ] `../../../WF/screen-new.jsx` と同等の UI/操作感（375px）

---

### [REC-07] 記録編集・削除

**概要**: セッション詳細ドロワーから既存記録を編集・削除。

**実装内容**:
- 詳細ドロワー（HIST-03 と共用 UI）に編集/削除ボタン
- Server Action で更新/削除前に **所有権確認（`findFirst` で `userId + id` の両条件）** を実施
- 削除時は関連 `WorkoutSet` をカスケード削除
- 更新後 `revalidateTag` で履歴・ダッシュボードを再検証

**受け入れ条件**:
- [ ] 他ユーザーの記録は編集/削除できない（所有権チェック）
- [ ] 編集内容がダッシュボード/履歴に反映される

---

### [DASH-01〜05] ホームダッシュボード

**概要**: `/dashboard` を `../../../WF/screen-home.jsx` に沿って実装。Server Components でデータ取得。

**実装内容**:
- **DASH-01** 週間カレンダー（月〜日、トレ日はグラデハイライト `rgba(255,61,119,0.18)`、今日は白枠 `outline:2.5px solid #F4F5FA`）
- **DASH-02** AI コーチ提案ヒーローカード（メニュー名・フォーカス部位タグ・総ボリューム・理由、グラデ背景 `gradV`、タップで `/ai` 遷移）。M2 では集計ベースのプレースホルダ → M3 で AI 生成に差し替え
- **DASH-03** 週間サマリー（`RingStack` でトレ日数達成率、総ボリューム先週比±%、鍛えた部位タグ）
- **DASH-04** 停滞検知アラート（停滞種目・週数・`Sparkline`・amber 配色・「AI に提案してもらう」CTA）。停滞判定ロジックは `utils/analytics.ts` に切り出し（M3 の AI-INFRA と共用）
- **DASH-05** 種目の成長カード横スクロール（主要4種目: スクワット/デッドリフト/ベンチプレス/ショルダープレス、`Sparkline`・成長率%・停滞バッジ、カード幅 190px）
- 各ウィジェットは **リソース単位で `<Suspense>` 分割**
- データ取得は Server Components で直接 Prisma（`where:{ userId }`）

**受け入れ条件**:
- [ ] 実 DB の記録から週間集計・成長率・部位タグが正しく算出・表示
- [ ] 各カードのタップ遷移が機能。データ無し時の空状態 UI あり
- [ ] `where:{ userId }` で自分の記録のみ集計

---

### [HIST-01〜09] トレーニング履歴

**概要**: `/workouts` を `../../../WF/screen-workouts.jsx` に沿って実装。月間カレンダー + グラフ。

**実装内容**:
- **HIST-01** 月間カレンダー（トレ日はドット + ハイライト、タップで詳細ドロワー表示）
- **HIST-02** 月次サマリーカード（トレ回数 / 総ボリューム / 自己ベスト更新回数）
- **HIST-03** セッション詳細ドロワー（下から出現、種目/セット/重量/時間/PR バッジ表示、編集・削除ボタン）
- **HIST-04** ボリューム推移グラフ（部位別/種目別、週=日別棒・月=日別折れ線・年=週集計棒）— Recharts
- **HIST-05** 最大重量推移グラフ（種目別、週=週最高棒・月=セッション折れ線・年=月集計折れ線）— Recharts
- **HIST-06** グラフタブ切り替え（ボリューム推移 / 最大重量）
- **HIST-07** 期間セグメント（週 / 月 / 年の3ボタン）
- **HIST-08** 部位・種目フィルター（横スクロールピル型チップ）
- **HIST-09** 種目内訳バー（選択部位の種目別ボリューム内訳）
- 期間/フィルタの状態は Client `useState`。グラフ再取得は Route Handler + `useQuery`
- 集計純関数は `utils/analytics.ts` に切り出し（DASH と共用）

**受け入れ条件**:
- [ ] 週/月/年・部位/種目フィルタ切替でグラフが正しく再集計表示
- [ ] カレンダー日付タップ → 該当セッション詳細ドロワーが表示
- [ ] PR 数（自己ベスト更新回数）が正しくカウント

---

### [PROF-01/03/04/05] マイページ

**概要**: `/profile` を `../../../WF/screenshots/profile.png` に沿って実装。

**実装内容**:
- **PROF-01** プロフィールカード（アバター・名前・トレ歴・総トレ回数・PR 更新数・連続日数）
- **PROF-02** プレミアムバナー（グラデ背景、静的 UI のみ。課金機能は v3）
- **PROF-03** 目標設定（フリーテキスト入力 → DB 保存。AI 分析=AI-08 は M3 で接続）
- **PROF-04** 体組成・体重記録への導線（数値表示のみ。実記録 UI は v2）
- **PROF-05** 種目マスタ（カスタム種目の追加・管理。`isCustom:true / userId付き`）
- プロフィール編集は Server Action（`auth()` + 所有権確認）

**受け入れ条件**:
- [ ] プロフィール（名前/目標/トレ歴）の表示・編集が永続化
- [ ] カスタム種目を追加でき、記録作成(REC-09)の選択肢に出る
- [ ] 連続日数・総トレ回数・PR 数が実データから正しく算出

---

## M3 — AI 機能（Week 3）

### [AI-INFRA] AI 基盤 & 分析ロジック

**概要**: Vercel AI SDK のストリーミング Route Handler と、提案の根拠となる分析純関数を整備。

**実装内容**:
- `app/api/ai/chat/route.ts`: Vercel AI SDK + `@ai-sdk/openai`（GPT-4o-mini）で `streamText`。**API キーはサーバーのみ**。`auth()` 必須
- `utils/analytics.ts` に純関数として実装:
  - 回復状態推定（直近セッションの部位・経過時間から「回復済み部位」を算出）
  - ボリューム集計（セッション/期間/部位別）
  - 停滞検知（8週の重量推移で3週以上変化なし）
  - estimated 1RM（O'Connor式: `weight × (1 + reps/40)`）
- ユーザーのトレ記録をコンテキストとしてプロンプトに注入（`where:{ userId }`）
- AI 応答は `AiAdvice` テーブルに保存（`type`: `menu_suggestion` / `analysis` / `stagnation_alert` / `goal_analysis`）
- フリープランの月5回制限カウント

**受け入れ条件**:
- [ ] Route Handler 経由でストリーミング応答が返る
- [ ] ネットワークタブで API キーがクライアントに露出しない
- [ ] 分析純関数（停滞検知・1RM・回復推定）の Vitest 単体テストがパス

---

### [AI-04 / AI-05] AI チャット UI & クイックチップ

**概要**: `/ai` チャット画面（`../../../WF/screen-ai.jsx`）。文字送りストリーミング表示 + クイックチップ送信。

**実装内容**:
- `useChat`（AI SDK）でストリーミング描画。チャットバブル・送信欄
- クイックチップ3種: 「今日のメニュー」「停滞を分析」「先週の振り返り」から定型プロンプトを即送信
- 音声入力(AI-06)は v2。マイクアイコンは非表示または `disabled`

**受け入れ条件**:
- [ ] 送信 → 最初のトークンが 2 秒以内に表示
- [ ] 3 種のチップが対応する分析を起動し回答が返る

---

### [AI-01] 本日のメニュー提案

**概要**: 直近セッションの部位から回復状態を推定し、今日やるべき種目・重量・セット数・回数を表形式で提案。

**実装内容**:
- 回復推定 + ユーザー実績重量をプロンプトに渡し、構造化（Markdown 表）で出力
- DASH-02 のヒーローカード（M2 プレースホルダ）を AI 生成結果に差し替え

**受け入れ条件**:
- [ ] その人の実績ベースの重量/回数が提示される（一般論でない）
- [ ] ダッシュボードの提案カードと AI 画面の提案が整合

---

### [AI-02] 停滞検知・代替提案

**概要**: 8週の重量推移を分析し3週以上の停滞を検知、代替種目をリスト提示。DASH-04 と連動。

**受け入れ条件**:
- [ ] 停滞種目を正しく検知し代替案を提示
- [ ] 停滞が無い場合はその旨を返す
- [ ] DASH-04 の停滞アラートと同じ種目が提示される

---

### [AI-03] 過去分析レポート

**概要**: 直近4週のボリューム・頻度を分析し、ボトルネック（弱点部位・頻度不足等）を提示。

**受け入れ条件**:
- [ ] 4週のデータから部位バランス/頻度の所見が返る
- [ ] 不足部位や過剰頻度の具体的な指摘が含まれる

---

### [AI-08] 目標 AI 分析（マイページ連携）

**概要**: PROF-03 のフリーテキスト目標を AI が分析し、パーソナライズされたプログラムを提案。

**受け入れ条件**:
- [ ] 目標テキスト入力 → 分析結果が表示される
- [ ] 結果が `AiAdvice(type: 'goal_analysis')` として保存される

---

### [REC-02] AI メニュー読み込み（記録画面連携）

**概要**: 記録作成画面のバナーから AI 提案メニューを自動展開して記録フォームにプリフィル。

**受け入れ条件**:
- [ ] 「AI のおすすめメニューを読み込む」バナーをタップで AI-01 の提案が種目/セット/重量に展開
- [ ] 展開後に手動編集して保存できる

---

## M4 — 仕上げ・公開（Week 4）

### ランディングページ (LP)

- `/` にサービス紹介・サインアップ導線を実装
- `(public)` グループ（静的レンダリング）

### バリデーション統一

- 全 Server Action / Route Handler の入力を Zod でバリデーション
- エラーハンドリングを `../../docs/07_error-handling_rules.md` に統一

### テスト

- Vitest + Testing Library で以下をカバー:
  - `utils/analytics.ts` の全純関数
  - 主要 Server Action（workout 作成/更新/削除）
  - 重要コンポーネント（記録フォーム、チャートフィルタ）
- `npm run test:run` を CI（GitHub Actions）に組み込み

### レスポンシブ・パフォーマンス

- 375px〜PC 対応のレスポンシブ
- LCP 3秒以内
- 全動的画面に `loading.tsx` を配置
- 画像・フォント最適化（`next/image`、`next/font`）

### デプロイ

- Vercel にデプロイ。環境変数（`DATABASE_URL` / `AUTH_*` / `OPENAI_API_KEY`）を設定
- `prisma migrate deploy`（`npm run build` スクリプトに組み込み）
- 本番 URL で動作確認

**受け入れ条件（M4 全体）**:
- [ ] `npm run typecheck && npm run lint && npm run test:run && npm run build` が全てパス
- [ ] 本番 URL で 認証 → 記録 → ダッシュボード → AI 提案の一連が動作
- [ ] モバイル(375px)/PC の主要画面が崩れない

---

## v2 — 栄養管理（後続フェーズ）

TabBar を「AIコーチ → 栄養」に変更（`../../../WF/screen-nutrition.jsx`）。

| Issue | 機能 |
|-------|------|
| NUTR-01 | カロリー・マクロ管理（目標 vs 実績） |
| NUTR-02 | AI 食事記録（メニュー名入力 → カロリー/マクロ自動推定） |
| NUTR-03 | BMR/TDEE 計算（Mifflin-St Jeor 式） |
| NUTR-04 | 週間カロリー棒グラフ |
| NUTR-05 | 体重・体脂肪率記録 |
| REC-08 | テンプレート機能 |
| AI-06 | 音声入力（マイク） |
| AI-07 | AI 提案履歴 |

DB: `BodyMetric` / `MealLog` テーブルのマイグレーション追加。

---

## 検証チェックリスト（Sprint 完了時）

```bash
npm run typecheck
npm run lint
npm run test:run
npm run build
npm run dev        # 起動確認
npx prisma studio  # DB 副作用確認
```

| Sprint | 追加確認項目 |
|--------|------------|
| M1 | 新規登録/Google ログイン/未認証リダイレクトを手動確認 |
| M2 | 記録作成 → 保存 → ダッシュ集計 → 履歴グラフ → 編集/削除を一周。別ユーザーで `userId` 分離確認 |
| M3 | `/ai` でストリーミング・各チップ・全 AI 機能を確認。ネットワークタブで API キー非露出を確認 |
| M4 | Vercel 本番 URL で全フローを確認。モバイル/PC レイアウト確認 |

---

> GitHub Issue タイトル例: `[AUTH-01] メール認証（サインアップ/ログイン）`  
> ブランチ命名: `feature/#<issue番号>`  
> PR: 対応 Issue を本文で参照（Closes #XX）
