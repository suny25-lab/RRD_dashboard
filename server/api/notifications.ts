import { sub } from 'date-fns'

const notifications = [{
  id: 1,
  unread: true,
  sender: {
    name: 'TCGDB',
    avatar: {
      src: 'https://api.dicebear.com/9.x/initials/svg?seed=TCGDB'
    }
  },
  body: 'Pokemon 搜索热度本周继续领先',
  date: sub(new Date(), { minutes: 7 }).toISOString()
}, {
  id: 2,
  unread: true,
  sender: {
    name: 'Google Trends',
    avatar: {
      src: 'https://api.dicebear.com/9.x/initials/svg?seed=GT'
    }
  },
  body: 'Disney Lorcana 近4周搜索热度上升',
  date: sub(new Date(), { hours: 1 }).toISOString()
}, {
  id: 3,
  sender: {
    name: 'TCGplayer',
    avatar: {
      src: 'https://api.dicebear.com/9.x/initials/svg?seed=TP'
    }
  },
  body: 'Godzilla Card Game 活跃产品覆盖变化明显',
  date: sub(new Date(), { hours: 3 }).toISOString()
}, {
  id: 4,
  sender: {
    name: '数据提醒',
    avatar: {
      src: 'https://api.dicebear.com/9.x/initials/svg?seed=DATA'
    }
  },
  body: '6品牌对比组已用于压缩 Pokemon 的视觉影响',
  date: sub(new Date(), { hours: 7 }).toISOString()
}, {
  id: 5,
  sender: {
    name: '消息源',
    avatar: {
      src: 'https://api.dicebear.com/9.x/initials/svg?seed=NEWS'
    }
  },
  body: '官网新闻和社媒源当前为预留页面',
  date: sub(new Date(), { days: 1, hours: 3 }).toISOString()
}]

export default eventHandler(async () => {
  return notifications
})
