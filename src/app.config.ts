export default defineAppConfig({
  pages: [
    'pages/leagues/index',
    'pages/league/index',
    'pages/schedule/index',
    'pages/ranking/index',
    'pages/player/index',
    'pages/index/index',
    'pages/team/index',
    'pages/login/index',
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
