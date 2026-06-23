# TCGDB Nuxt 模块描述文件

## 1. 文档目的

本文档描述如何在现有 `suny25-lab/RRD_dashboard` 的 Nuxt Dashboard 模板基础上，接入 TCGDB 业务模块。

当前目标不是重新搭建一个独立应用，而是沿用现有 Nuxt 模板的布局、侧边栏、页面路由和组件组织，把原来的通用 Dashboard 改造成 TCG 市场热度与商业分析工具。

## 2. Nuxt 模板现有结构

当前 GitHub 仓库是 Nuxt Dashboard 模板，主要结构如下：

| 目录/文件 | 当前作用 | TCGDB 改造方向 |
|---|---|---|
| `app/layouts/default.vue` | 全局 Dashboard 布局和侧边栏 | 保留布局，调整导航文案和入口含义 |
| `app/pages/index.vue` | Home 页面 | 改为 TCG 市场总览 Dashboard |
| `app/pages/inbox.vue` | Inbox 邮件页 | 改为 TCG News 和社媒消息中心 |
| `app/pages/customers.vue` | Customers 客户列表页 | 改为 51 家 TCG 品牌列表 |
| `app/components/home/` | Home 页面图表和 KPI 组件 | 改为市场热度、趋势、市场变化组件 |
| `app/components/inbox/` | 邮件列表和邮件详情组件 | 改为消息流列表和消息详情组件 |
| `app/components/customers/` | 客户增删弹窗组件 | 改为品牌维护/品牌详情入口组件 |
| `server/api/customers.ts` | 模板客户假数据 API | 改为品牌列表 API |
| `server/api/mails.ts` | 模板邮件假数据 API | 改为 News/社媒消息 API |
| `app/types/index.d.ts` | 模板类型定义 | 增加 TCG 品牌、消息、指标、趋势类型 |

## 3. 总体信息架构

| Nuxt 页面 | TCGDB 页面含义 | 业务模块 |
|---|---|---|
| `/` | Home / 市场总览 | 当前 Dashboard、市场变化、趋势对比、核心指标 |
| `/inbox` | News / 社媒消息 | TCG 新闻、官方推文、系统提醒、消息详情 |
| `/customers` | Brands / 关注品牌 | 51 家 TCG 品牌列表、筛选、排序、进入详情 |
| `/customers/[id]` | 品牌详情 | 单品牌完整信息，后续建议新增 |
| `/settings` | 数据设置 | 关键词映射、品牌状态、数据源配置，后续保留 |

侧边栏可以继续使用当前模板的三个主入口，但 UI 文案建议改为：

- `Home` -> `Dashboard`
- `Inbox` -> `News`
- `Customers` -> `Brands`

如果暂时不改路由，也可以只改显示文案，保持 `/inbox` 和 `/customers` 不变。

## 4. Home 模块：TCG 市场总览 Dashboard

### 4.1 模块定位

Home 是老板和业务负责人每天首先看的页面。它不是营销首页，也不是说明页，而是直接展示当前 TCG 市场变化和品牌排序。

### 4.2 页面内容

Home 页面建议由以下模块组成：

| 模块 | 内容 | 数据来源 |
|---|---|---|
| 顶部 KPI | 覆盖品牌数、最新完整周、Google Trends 数据更新时间；不做“当前市场热度”总分 | Google Trends + 品牌基础信息 |
| 全市场走势 | 近 26 周 Google Trends 搜索热度走势折线图 | Google Trends 周度数据 |
| 品牌热度排名 | 当前热度 Top 10、热度上升 Top 10、热度下降 Top 10；三组直观展示，不做下拉框 | Google Trends 最新排名数据 |
| 趋势对比 | 最多 6 个品牌同图趋势对比 | Google Trends / 品牌周度结果 |
| 市场变化 | 升温最快、降温最快、活跃产品变化、活跃系列变化 | Google Trends + TCGplayer |

### 4.3 关键交互

- 时间范围选择：默认最近完整周，可扩展为近 7 天、30 天、90 天、12 个月。
- 品牌趋势选择：最多同时选择 6 个品牌。
- 分组对比：51 个品牌强制按 6 个一组展示，避免 Pokemon 热度过大压缩其他品牌。
- 相对指数模式：支持把每个品牌起点归一为 100，看相对涨跌速度。
- 市场变化列表点击品牌后进入品牌详情。
- 品牌热度排名固定展示三组 Top 10：当前热度、上升最快、下降最快，不使用下拉框切换。

### 4.4 热度统一口径

所有页面中名为“热度”的指标，统一使用 Google Trends 搜索热度口径。

- 当前热度：最新完整周期 Google Trends 数值。
- 热度上升：当前周期 Google Trends 与对比周期的变化值或变化率。
- 热度下降：当前周期 Google Trends 与对比周期的变化值或变化率，从低到高展示。
- 市场变化中的“热度”原因也只来自 Google Trends。
- TCGplayer 数据只用于产品数、系列数、活跃产品、活跃系列和后续价格信息，不参与“热度”定义。

### 4.5 不在当前 Home 强制展示

- eBay 上架数量。
- eBay 评级数量。
- eBay 评级百分比。
- 空数据价格模块。

如果没有稳定数据，不应为了页面完整而放空模块。

## 5. Inbox 模块：TCG News 和社媒消息中心

### 5.1 模块定位

Inbox 在 TCGDB 中不再是邮件收件箱，而是品牌新闻、官方社媒和系统提醒的消息中心。

### 5.2 消息类型

| 类型 | 说明 | 示例 |
|---|---|---|
| `news` | 官网新闻、公告、新品发布 | Pokemon 发布新扩展包 |
| `social` | 官方社媒动态 | 官方 X/Twitter 推文 |
| `alert` | 系统提醒 | 某品牌近 4 周热度快速上升 |
| `data` | 数据状态提醒 | TCGplayer 数据未更新 |

### 5.3 消息字段

| 字段 | 说明 |
|---|---|
| `id` | 消息 ID |
| `brand_id` | 关联品牌 ID |
| `brand_name` | 品牌名称 |
| `source` | 来源，例如 official_site、twitter、youtube、system |
| `type` | news、social、alert、data |
| `title` | 消息标题 |
| `summary` | 摘要 |
| `url` | 原始链接 |
| `published_at` | 发布时间 |
| `priority` | high、normal、low |
| `status` | unread、read、archived |

### 5.4 Nuxt 落点

| 现有文件 | 改造方向 |
|---|---|
| `app/pages/inbox.vue` | 保留双栏结构：左侧消息列表，右侧消息详情 |
| `app/components/inbox/InboxList.vue` | 改为 TCG 消息列表 |
| `app/components/inbox/InboxMail.vue` | 改为消息详情面板 |
| `server/api/mails.ts` | 改为 `/api/tcg-news` 或继续复用为消息 API |
| `app/types/index.d.ts` | 增加 `TcgMessage` 类型 |

### 5.5 交互

- 按品牌筛选。
- 按消息类型筛选。
- 按来源筛选。
- 按未读/已读筛选。
- 点击消息显示摘要、原始链接、关联品牌。
- 从消息详情跳转到品牌详情。

## 6. Customers 模块：51 家关注 TCG 品牌

### 6.1 模块定位

Customers 页面在业务上改为 Brands 页面。它展示当前关注的 51 家 TCG 品牌，而不是传统 CRM 客户。

### 6.2 品牌列表字段

| 字段 | 说明 | 数据来源 |
|---|---|---|
| `id` | 品牌 ID | 品牌基础信息 |
| `name` | 品牌名称 | 品牌基础信息 |
| `logo_url` | Logo | 品牌基础信息 |
| `aliases` | 别名/关键词 | 品牌基础信息 |
| `status` | 活跃、观察、低活跃、停更 | 品牌基础信息 |
| `current_heat` | 当前热度 | Google Trends |
| `heat_change_4w` | 近 4 周变化 | Google Trends |
| `heat_rank` | 51 品牌内排名 | 最新排名数据 |
| `product_count` | TCGplayer 产品总数 | TCGplayer |
| `series_count` | TCGplayer 系列总数 | TCGplayer |
| `active_product_count` | 活跃产品数 | TCGplayer |
| `active_series_count` | 活跃系列数 | TCGplayer |
| `latest_news_at` | 最近消息时间 | News/社媒 |

### 6.3 Nuxt 落点

| 现有文件 | 改造方向 |
|---|---|
| `app/pages/customers.vue` | 改为品牌列表表格 |
| `app/components/customers/AddModal.vue` | 后续可改为新增/编辑品牌 |
| `app/components/customers/DeleteModal.vue` | 后续可改为移除关注品牌 |
| `server/api/customers.ts` | 改为品牌列表 API |
| `app/types/index.d.ts` | 增加 `TcgBrand` 类型 |

### 6.4 交互

- 搜索品牌名。
- 按品牌状态筛选。
- 按当前热度排序。
- 按近 4 周变化排序。
- 按活跃产品数排序。
- 按活跃系列数排序。
- 点击品牌行进入详情页。

## 7. 品牌详情模块

### 7.1 模块定位

品牌详情页用于查看单个品牌的全部可用信息，是 Customers/Brands 页点击后的下钻页面。

建议新增路由：

`app/pages/customers/[id].vue`

如果 UI 文案改为 Brands，但路由暂时不改，也可以继续使用 `/customers/[id]`。

### 7.2 页面内容

| 区域 | 内容 |
|---|---|
| 品牌头部 | Logo、品牌名、状态、别名、关键词、官网、社媒 |
| 热度走势 | 单品牌 Google Trends 折线图 |
| 热度指标 | 当前热度、搜索热度、近 4 周变化、排名和排名变化 |
| TCGplayer 指标 | 产品总数、系列总数、活跃产品、活跃系列 |
| 市场动向 | 活跃产品变化、活跃系列变化 |
| 价格信息 | 聚合均价、中位价、样本数；若数据不足则隐藏或标记 |
| News/社媒 | 该品牌相关消息列表 |

### 7.3 当前不强制展示

- eBay 指标。
- 评级指标。
- 没有样本支撑的价格判断。
- 合作推荐。

## 8. 数据模块

### 8.1 当前优先数据

| 数据文件/来源 | 用途 |
|---|---|
| Google Trends 周度数据 | 品牌周度搜索热度和趋势 |
| Google Trends 最新排名数据 | 当前热度 Top 10、上升 Top 10、下降 Top 10 |
| Google Trends 全市场聚合数据 | 全市场搜索热度走势 |
| `data/market_temperature_v4_pokemon_merged/*` | 可作为 51 品牌清单和现有周度承载文件；热度字段必须只取 Google Trends 口径，不使用综合热度总分 |
| TCGplayer 处理数据 | 产品总数、系列总数、活跃产品、活跃系列、价格样本 |
| 品牌基础信息 | Logo、别名、关键词、状态 |
| News/社媒数据 | Inbox 和品牌详情消息流 |

### 8.2 API 建议

| API | 用途 |
|---|---|
| `/api/tcg/summary` | Home 顶部 KPI 和全市场概览 |
| `/api/tcg/brands` | 51 家品牌列表 |
| `/api/tcg/brands/[id]` | 单品牌详情 |
| `/api/tcg/trends` | 多品牌趋势对比 |
| `/api/tcg/market-changes` | 市场变化榜单 |
| `/api/tcg/messages` | News/社媒消息 |

MVP 可以先用静态 JSON 或服务器端读取本地 CSV 生成 API 响应，后续再接数据库。

## 9. 类型模块建议

建议在 `app/types/index.d.ts` 中增加以下业务类型：

| 类型 | 作用 |
|---|---|
| `TcgBrand` | 品牌基础信息和当前指标 |
| `TcgBrandDetail` | 单品牌详情 |
| `TcgTrendPoint` | 折线图时间点 |
| `TcgMarketSummary` | Home 顶部概览 |
| `TcgMarketChange` | 市场变化榜单项 |
| `TcgMessage` | News/社媒消息 |
| `TcgDataSourceStatus` | 数据源更新时间和状态 |

## 10. 导航和命名建议

当前模板导航可以这样改：

| 当前导航 | 建议显示 | 路由是否保留 |
|---|---|---|
| Home | Dashboard | 保留 `/` |
| Inbox | News | 保留 `/inbox` |
| Customers | Brands | 保留 `/customers` |
| Settings | Settings | 保留 `/settings` |

这样可以减少路由迁移成本，同时让界面语义变成 TCGDB。

## 11. 当前版本范围

### 必做

- Home 改为 TCG 市场总览。
- Inbox 改为 TCG 新闻和社媒消息。
- Customers 改为 51 家品牌列表。
- 品牌点击后能查看详情。
- Google Trends 使用 51 品牌现有数据。
- TCGplayer 指标先作为市场数据主来源。
- 市场变化板块保留。
- Pokemon 过大时使用 6 个一组或相对指数对比。

### 暂缓

- eBay 指标。
- 真实 Twitter/X API 自动接入。
- 产品级页面。
- 单卡级页面。
- 自动价格预测。
- 自动报告。

## 12. 实施顺序建议

1. 先建立 TCG 业务类型和本地数据读取层。
2. 改 Home：把模板销售 Dashboard 替换为 TCG 市场总览。
3. 改 Customers：把客户表格替换为 51 品牌列表。
4. 新增品牌详情页。
5. 改 Inbox：把邮件假数据替换为 News/社媒消息。
6. 调整侧边栏文案。
7. 运行类型检查、构建和浏览器验收。

## 13. 已确认补充口径

1. 侧边栏显示为 `Brands`，但保留 `/customers` 路由。
2. 品牌详情支持切换入口：`/customers/[id]` 是主路由，`/brands/[id]` 作为别名跳转。
3. 价格后续使用官网/TCGplayer 官方数据中的 price 字段，不从缺失的 eBay 数据推断。
4. Home 第一版先展示产品数、系列数、活跃产品、活跃系列；价格等官网 price 数据稳定后再接。
5. Settings 第一版保留页面，但不接入可编辑数据。
