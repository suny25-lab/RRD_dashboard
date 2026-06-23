type TcgMessage = {
  title: string
  summary: string
  brandName: string
  source: string
  type: string
}

export function stateLabel(state: string) {
  if (state === 'Warming') {
    return '升温'
  }

  if (state === 'Cooling') {
    return '降温'
  }

  return '稳定'
}

export function signalLabel(signal: string) {
  if (signal === 'Search') {
    return '搜索热度'
  }

  if (signal === 'Products') {
    return '活跃产品变化'
  }

  if (signal === 'Series') {
    return '活跃系列变化'
  }

  if (signal === 'Search heat increased') {
    return '搜索热度上升'
  }

  if (signal === 'Search heat declined') {
    return '搜索热度下降'
  }

  return '搜索热度稳定'
}

export function sourceLabel(source: string) {
  if (source === 'Google Trends') {
    return 'Google Trends'
  }

  if (source === 'TCGplayer') {
    return 'TCGplayer'
  }

  if (source === 'Official News') {
    return '官网新闻'
  }

  if (source === 'Social') {
    return '社媒'
  }

  return source
}

export function messageTypeLabel(type: string) {
  if (type === 'Alert' || type === 'alert') {
    return '提醒'
  }

  if (type === 'TCGplayer' || type === 'data') {
    return 'TCGplayer'
  }

  if (type === 'News' || type === 'news') {
    return '新闻'
  }

  if (type === 'Social' || type === 'social') {
    return '社媒'
  }

  return type
}

export function messageTitleCn(message: Pick<TcgMessage, 'title' | 'brandName' | 'source'>) {
  const points = message.title.match(/[+-]?\d+(?:\.\d+)?\s*pts/)?.[0].replace('pts', '点')

  if (message.source === 'Google Trends') {
    if (message.title.includes('rose')) {
      return `${message.brandName} 搜索热度上升${points ? ` ${points}` : ''}`
    }

    if (message.title.includes('fell')) {
      return `${message.brandName} 搜索热度下降${points ? ` ${points}` : ''}`
    }
  }

  if (message.source === 'TCGplayer' && message.title.includes('active product coverage changed')) {
    return `${message.brandName} 活跃产品覆盖变化${points ? ` ${points}` : ''}`
  }

  return message.title
}

export function messageSummaryCn(message: Pick<TcgMessage, 'summary' | 'source'>) {
  const heat = message.summary.match(/Current heat is ([\d.]+)\/100/)?.[1]

  if (message.source === 'Google Trends') {
    if (message.summary.includes('increased')) {
      return `近 4 周 Google Trends 搜索热度上升。当前热度为 ${heat ?? '-'} / 100。`
    }

    if (message.summary.includes('declined')) {
      return `近 4 周 Google Trends 搜索热度下降。当前热度为 ${heat ?? '-'} / 100。`
    }
  }

  const products = message.summary.match(/about ([\d,]+) products and ([\d,]+) products with public market data/)

  if (message.source === 'TCGplayer' && products) {
    return `TCGplayer 当前约有 ${products[1]} 个产品，其中 ${products[2]} 个有公开市场数据。`
  }

  return message.summary
}
