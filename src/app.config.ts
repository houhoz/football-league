export default defineAppConfig({
  pages: [
    'pages/leagues/index', // 联赛列表
    'pages/league/index', // 联赛详情
    'pages/schedule/index', // 赛程
    'pages/scheduleAdd/index', // 新增赛程
    'pages/match/index', // 比赛详情
    'pages/ranking/index', // 积分榜
    'pages/player/index', // 球员榜
    'pages/data/index', //我的联赛数据
    'pages/index/index', // 我的
    'pages/team/index', // 我的球队
    'pages/login/index', // 登录
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
  tabBar: {
    custom: false,
    color: '#716969',
    selectedColor: '#CA2525',
    list: [
      {
        text: '联赛',
        pagePath: 'pages/leagues/index',
        iconPath: 'assets/icons/tab_icon_platform_default.png',
        selectedIconPath: 'assets/icons/tab_icon_platform_selected.png',
      },
      {
        text: '球队',
        pagePath: 'pages/team/index',
        iconPath: 'assets/icons/tab_icon_organization_default.png',
        selectedIconPath: 'assets/icons/tab_icon_organization_selected.png',
      },
      {
        text: '我的',
        pagePath: 'pages/index/index',
        iconPath: 'assets/icons/tab_icon_mine_default.png',
        selectedIconPath: 'assets/icons/tab_icon_mine_selected.png',
      },
    ],
  },
})
