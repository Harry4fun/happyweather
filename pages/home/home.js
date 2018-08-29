let globalData = getApp().globalData
Page({
  data: {
    isIPhoneX: globalData.isIPhoneX,
    message: '',
    cityDatas: { "originalData": { "error": 0, "status": "success", "date": "2018-08-29", "results": [{ "currentCity": "烟台市", "pm25": "34", "index": [{ "des": "天气热，建议着短裙、短裤、短薄外套、T恤等夏季服装。", "tipt": "穿衣指数", "title": "穿衣", "zs": "热" }, { "des": "较适宜洗车，未来一天无雨，风力较小，擦洗一新的汽车至少能保持一天。", "tipt": "洗车指数", "title": "洗车", "zs": "较适宜" }, { "des": "各项气象条件适宜，无明显降温过程，发生感冒机率较低。", "tipt": "感冒指数", "title": "感冒", "zs": "少发" }, { "des": "天气较好，但因气温较高且风力较强，请适当降低运动强度并注意户外防风。推荐您进行室内运动。", "tipt": "运动指数", "title": "运动", "zs": "较适宜" }, { "des": "属中等强度紫外线辐射天气，外出时建议涂擦SPF高于15、PA+的防晒护肤品，戴帽子、太阳镜。", "tipt": "紫外线强度指数", "title": "紫外线强度", "zs": "中等" }], "weather_data": [{ "date": "周三 08月29日 (实时：26℃)", "dayPictureUrl": "http://api.map.baidu.com/images/weather/day/duoyun.png", "nightPictureUrl": "http://api.map.baidu.com/images/weather/night/qing.png", "weather": "多云转晴", "wind": "南风3-4级", "temperature": "28 ~ 22℃" }, { "date": "周四", "dayPictureUrl": "http://api.map.baidu.com/images/weather/day/qing.png", "nightPictureUrl": "http://api.map.baidu.com/images/weather/night/qing.png", "weather": "晴", "wind": "东北风3-4级", "temperature": "27 ~ 23℃" }, { "date": "周五", "dayPictureUrl": "http://api.map.baidu.com/images/weather/day/qing.png", "nightPictureUrl": "http://api.map.baidu.com/images/weather/night/qing.png", "weather": "晴", "wind": "东北风3-4级", "temperature": "27 ~ 22℃" }, { "date": "周六", "dayPictureUrl": "http://api.map.baidu.com/images/weather/day/duoyun.png", "nightPictureUrl": "http://api.map.baidu.com/images/weather/night/qing.png", "weather": "多云转晴", "wind": "东北风3-4级", "temperature": "25 ~ 20℃" }] }] } },
    icons: ['/img/clothing.png', '/img/carwashing.png', '/img/pill.png', '/img/running.png', '/img/sun.png'],
    // 用来清空 input
    searchText: '',
    // 是否已经弹出
    hasPopped: false,
    animationMain: {},
    animationOne: {},
    animationTwo: {},
    animationThree: {},
    // 是否切换了城市
    cityChanged: false,
    // 需要查询的城市
    searchCity: '',
    setting: {},
    bcgImgList: [
      {
        src: '/img/beach-bird-birds-235787.jpg',
        topColor: '#393836'
      },
      {
        src: '/img/clouds-forest-idyllic-417102.jpg',
        topColor: '#0085e5'
      },
      {
        src: '/img/backlit-dawn-dusk-327466.jpg',
        topColor: '#2d2225'
      },
      {
        src: '/img/accomplishment-adventure-clear-sky-585825.jpg',
        topColor: '#004a89'
      },
      {
        src: '/img/fog-himalayas-landscape-38326.jpg',
        topColor: '#b8bab9'
      },
      {
        src: '/img/asphalt-blue-sky-clouds-490411.jpg',
        topColor: '#009ffe'
      },
      {
        src: '/img/aerial-climate-cold-296559.jpg',
        topColor: '#d6d1e6'
      },
      {
        src: '/img/beautiful-cold-dawn-547115.jpg',
        topColor: '#ffa5bc'
      }
    ],
    bcgImgIndex: 0,
    bcgImg: '',
    bcgImgAreaShow: false,
    bcgColor: '#2d2225',
    // 粗暴直接：移除后再创建，达到初始化组件的作用
    showHeartbeat: true,
    // heartbeat 时禁止搜索，防止动画执行
    enableSearch: true,
    pos: {},
    openSettingButtonShow: false
  
}
}
)