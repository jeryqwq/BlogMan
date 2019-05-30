module.exports = {
    title: 'BlogMan',
    description: '曾今我也以为梦想遥不可及',
    themeConfig: {
        nav: [
            { text: '前端', link: '/' },
            { text: '时间安排', link: '/guide/' },
            { text: 'GitHub', link: 'https://github.com/jeryqwq' },
          ],
        sidebar: [
          {
            title: '基础',
            children: [
              '/Base/JS',
              '/Base/CSS',
              '/Base/ES6',
              '/Base/CMDAMD',
              '/Base/NODE',
              '/Base/Promise',
              '/Base/Render',
              '/Base/Git',
            ]
          },
          {
            title: '框架必知',
            children: [
                '/FrameWorkBase/MVVM',
                '/FrameWorkBase/VisualDom',
                '/FrameWorkBase/DomDiff',
                '/FrameWorkBase/Route',
                '/FrameWorkBase/PublicState',
            ]
          },
          {
            title: '框架',
            children: [
              '/FrameWork/Typescript',
                '/FrameWork/Vue',
                '/FrameWork/React',
                '/FrameWork/Koa'
            ]
          },
          {
            title: '数据库',
            children: [
                '/DataBase/Mongod',
                '/DataBase/MySQL',
            ]
          }
        ]
      }
  }