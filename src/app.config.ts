export default defineAppConfig({
  pages: ['pages/index/index', 'pages/league/index', 'pages/team/index'],
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
        pagePath: 'pages/league/index',
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
