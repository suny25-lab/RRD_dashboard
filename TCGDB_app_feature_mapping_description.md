# TCGDB App 功能接入理解描述

## 目标

在现有 `suny25-lab/RRD_dashboard` 的 Nuxt Dashboard 模板基础上，改造成 TCG 市场热度与商业分析 Dashboard。

这不是重新做一个独立网站，而是沿用当前模板已有的信息架构：

- `Home` 作为 TCG 市场总览 Dashboard。
- `Inbox` 作为 TCG 新闻与社媒消息中心。
- `Customers` 作为 51 家关注 TCG 品牌的管理与浏览入口。

当前阶段先使用已有 Google Trends 和 TCGplayer 数据，不强制展示 eBay 数据。

## 页面功能映射

| 现有页面 | 改造后的 TCGDB 功能 | 核心作用 |
|---|---|---|
| Home | TCG 市场总览 Dashboard | 展示 Google Trends 热度排名、市场变化、品牌排名和关键指标 |
| Inbox | TCG 新闻与社媒消息 | 汇总品牌官网 News、官方推文、社媒动态和待关注消息 |
| Customers | 51 家关注品牌 | 展示所有关注的 TCG 品牌，点击品牌进入完整品牌详情 |
| Customer Detail | 品牌详情页 | 展示单个品牌的基础信息、热度、TCGplayer 指标、后续官网 price、News/社媒 |

## Home：当前 Dashboard 总览

Home 页就是目前你做的 Dashboard 主页面，应保留市场热度和市场变化板块。

### 建议展示内容

- 市场总览 KPI：
  - 当前覆盖品牌数：51 家。
  - 最新数据周期。
  - Google Trends 数据更新时间。
  - 最新完整周。
  - TCGplayer 活跃产品总量。
  - TCGplayer 活跃系列总量。
  - 不做“当前市场热度”总分。

- 品牌热度排名：
  - Google Trends 当前热度 Top 10。
  - Google Trends 热度上升最快 Top 10。
  - Google Trends 热度下降最快 Top 10。
  - 三组榜单直观展示，不做下拉框。

- 市场变化板块：
  - 热度上升最快。
  - 热度下降最快。
  - 活跃产品增长最快。
  - 活跃产品减少最快。
  - 活跃系列增长最快。
  - 活跃系列减少最快。

- 趋势对比：
  - 使用 Google Trends 数据。
  - 支持 51 家品牌。
  - 为避免 Pokemon 热度过大导致其他品牌不可视化，采用 6 个品牌一组的强制分组对比。
  - 可增加“相对指数模式”，将每个品牌起点归一为 100，用来看涨跌速度。

### 热度统一口径

- 所有“热度”都使用 Google Trends 搜索热度。
- TCGplayer 只提供产品、系列、活跃度和价格信息，不参与热度定义。
- eBay 当前没有数据，不进入热度口径。
- 价格后续使用官网/TCGplayer 官方 price 数据，不从缺失的 eBay 数据推断。

### Home 不需要强制展示

- eBay 上架数量。
- eBay 评级数量。
- eBay 评级百分比。

因为当前没有 eBay 数据，页面不应该为了完整性硬塞空模块。

## Inbox：TCG 新闻与社媒消息

Inbox 不再是普通邮件收件箱，而是 TCG News 和社媒动态消息流。

### 消息类型

- 官网 News：
  - 新品发布。
  - 官方公告。
  - 活动信息。
  - 禁限卡/规则变化。

- 官方社媒：
  - X/Twitter 官方账号推文。
  - YouTube 官方更新。
  - Instagram/Facebook 等官方内容，后续可扩展。

- 系统提醒：
  - 某品牌热度快速上升。
  - 某品牌活跃产品突然增加。
  - 某品牌长期未更新。
  - 数据源抓取失败或缺失。

### Inbox 列表字段

| 字段 | 说明 |
|---|---|
| brand | 关联品牌 |
| source | 来源，例如 official_site、twitter、youtube |
| type | news、social、alert |
| title | 消息标题 |
| published_at | 发布时间 |
| summary | 内容摘要 |
| url | 原始链接 |
| priority | 消息优先级 |
| status | unread、read、archived |

### Inbox 交互

- 按品牌筛选。
- 按来源筛选。
- 按消息类型筛选。
- 按时间排序。
- 点击消息查看摘要和原始链接。
- 标记已读/未读。
- 可从消息跳转到品牌详情页。

## Customers：51 家关注 TCG 品牌

Customers 页面不再表示传统 CRM 客户，而是表示正在跟踪的 51 家 TCG 品牌。

页面名称可以保留为 Customers 作为路由，也可以在 UI 文案中改成 Brands / TCG Brands。

### 品牌列表字段

| 字段 | 说明 |
|---|---|
| logo | 品牌 Logo |
| name | 品牌名称 |
| aliases | 品牌别名和关键词 |
| status | 活跃、观察、低活跃、停更 |
| current_heat | 当前 Google Trends 热度 |
| heat_change_4w | 近 4 周热度变化 |
| heat_rank | 51 家品牌内热度排名 |
| product_count | TCGplayer 产品总数 |
| series_count | TCGplayer 系列总数 |
| active_product_count | TCGplayer 活跃产品数 |
| active_series_count | TCGplayer 活跃系列数 |
| latest_news_at | 最近 News/社媒更新时间 |

### 品牌列表交互

- 搜索品牌。
- 按状态筛选。
- 按热度排序。
- 按热度变化排序。
- 按活跃产品数排序。
- 按活跃系列数排序。
- 点击品牌进入完整品牌详情。

## 品牌详情页：点开品牌后的全部信息

品牌详情页使用需求文档中定义的信息，不强制加入当前没有的数据。

### 品牌基础信息

- Logo。
- 品牌名称。
- 英文名/简称/别名。
- Google Trends 关键词。
- TCGplayer 映射关键词。
- 官方网站。
- 官方社媒账号。
- 品牌状态。

### Google Trends 热度

- 当前品牌热度。
- 近 4 周热度变化。
- 热度排名。
- 单品牌热度趋势线。
- 与同组 5 个品牌的分组对比。
- 相对指数模式，防止 Pokemon 压缩其他品牌曲线。

### TCGplayer 市场信息

- 产品总数。
- 系列总数。
- 活跃产品数。
- 活跃系列数。
- 活跃产品变化。
- 活跃系列变化。
- 品牌聚合价格。
- 价格变化。
- 样本数。

### News 和社媒

- 官网 News 列表。
- 官方推文/社媒列表。
- 最近更新时间。
- 指定周期内 News/社媒数量。
- 消息可跳回 Inbox 原始记录。

### 暂不强制展示

- eBay 上架数量。
- eBay 评级数量。
- eBay 评级百分比。

这些指标等 eBay 数据接入稳定后再进入品牌详情页。

## 数据优先级

| 数据 | 当前优先级 | 说明 |
|---|---|---|
| Google Trends | P0 | 用于 51 家品牌热度、排名、趋势和市场变化 |
| TCGplayer | P0 | 用于产品、系列、活跃度和价格聚合 |
| 品牌基础信息 | P0 | 用于 Customers/Brands 列表和品牌详情 |
| News/社媒 | P1 | 先在 Inbox/详情页设计位置，数据源稳定后接入 |
| eBay | 暂缓 | 当前没有数据，不强制展示 |

## 关键业务口径

- Dashboard 的核心对象是 51 家 TCG 品牌。
- Home 是总览，不是落地页。
- Inbox 是 News/社媒消息中心。
- Customers 是品牌列表，不再按传统客户理解。
- 品牌详情页展示“这个品牌的全部可用信息”。
- 市场变化板块必须保留。
- 当前版本先用 Google Trends 和 TCGplayer 支撑主要功能。
- eBay 信息没有就隐藏，不做空指标占位。
- Pokemon 热度过大时，多品牌趋势图使用 6 个一组或相对指数展示。

## 已确认补充口径

1. UI 文案使用 `Brands` / `TCG Brands`，路由可继续保留 `/customers`。
2. 支持 `/customers/[id]` 和 `/brands/[id]` 两种品牌详情入口。
3. 价格后续使用官网/TCGplayer 官方 price 数据。
4. Home 当前 Dashboard 以 `TCGDB_dashboard_description.md` 和 Nuxt 模块描述为准继续实现。
5. Settings 保留页面，但第一版不接入可编辑数据。
