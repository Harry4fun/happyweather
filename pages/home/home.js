// pm2.5 浓度对应的指数等级
// 0-50 优
// 50-100 良
// 100-150 轻度污染：对敏感人群不健康
// 150-200 中度污染：不健康
// 200-300 重度污染：非常不健康
// 300-500 严重污染：有毒物
// 500以上 爆表：有毒物
let globalData = getApp().globalData;
let messages = require('../../data/messages.js');
let bmap = require('../../lib/bmap-wx.js')
let utils = require('../../utils/utils.js')
Page({
  data: {
    isIPhoneX: globalData.isIPhoneX,
    message: '',
    cityDatas: {},
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
    bcgImgList: [{
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
  },
  calcPM(value) {
    if (value > 0 && value <= 50) {
      return {
        val: value,
        desc: '优',
        detail: '',
      }
    } else if (value > 50 && value <= 100) {
      return {
        val: value,
        desc: '良',
        detail: '',
      }
    } else if (value > 100 && value <= 150) {
      return {
        val: value,
        desc: '轻度污染',
        detail: '对敏感人群不健康',
      }
    } else if (value > 150 && value <= 200) {
      return {
        val: value,
        desc: '中度污染',
        detail: '不健康',
      }
    } else if (value > 200 && value <= 300) {
      return {
        val: value,
        desc: '重度污染',
        detail: '非常不健康',
      }
    } else if (value > 300 && value <= 500) {
      return {
        val: value,
        desc: '严重污染',
        detail: '有毒物',
      }
    } else if (value > 500) {
      return {
        val: value,
        desc: '爆表',
        detail: '能出来的都是条汉子',
      }
    }
  },
  success(data) {
    this.setData({
      openSettingButtonShow: false,
    })
    wx.stopPullDownRefresh()
    let now = new Date()
    // 存下来源数据
    data.updateTime = now.getTime()
    data.updateTimeFormat = utils.formatDate(now, "MM-dd hh:mm")
    let results = data.originalData.results[0] || {}
    data.pm = this.calcPM(results['pm25'])
    // 当天实时温度
    // \d表示数字, + 表示一个或多个
    data.temperature = `${results.weather_data[0].date.match(/\d+/g)[2]}`
    wx.setStorage({
      key: 'cityDatas',
      data: data,
    })
    this.setData({
      cityDatas: data,
    })
    console.log('cityDatas',this.data.cityDatas);
  },
  commitSearch(res) {
    let val = ((res.detail || {}).value || '').replace(/\s+/g, '')
    this.search(val)
  },
  // 彩蛋
  dance() {
    this.setData({
      enableSearch: false,
    })
    let heartbeat = this.selectComponent('#heartbeat')
    heartbeat.dance(() => {
      this.setData({
        showHeartbeat: false,
        enableSearch: true,
      })
      this.setData({
        showHeartbeat: true,
      })
    })
  },
  // 搜索城市
  search(val) {
    // 彩蛋
    if (val === '520' || val === '521') {
      this.setData({
        searchText: '',
      })
      this.dance();
      return
    }
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300,
    })
    if (val) {
      this.geocoder(val, (loc) => {
        this.init({
          location: `${loc.lng},${loc.lat}`
        })
      })
    }
  },
  geocoder(address, success) {
    wx.request({
      url: getApp().setGeocoderUrl(address),
      success(res) {
        let data = res.data || {};
        if(!data.status) {
          let location = (data.result || {}).location || {};
          success && success(location);
        } else {
          wx.showToast({
            title: data.msg || '网络不给力，请稍后再试',
            icon:'none'
          })
        }
      },
      fail(res){
        wx.showToast({
          title: res.errMsg || '网络不给力，请稍后再试',
          icon: 'none',
        })
      },
      complete: () => {
        this.setData({
          searchText: ''
        })
      }
    })
  },
  // wx.openSetting 要废弃，button open-type openSetting 2.0.7 后支持
  // 使用 wx.canIUse('openSetting') 都会返回 true，这里判断版本号区分
  canUseOpenSettingApi() {
    let systeminfo = getApp().globalData.systeminfo
    let SDKVersion = systeminfo.SDKVersion
    let version = utils.cmpVersion(SDKVersion, '2.0.7')
    if (version < 0) {
      return true
    } else {
      return false
    }
  },
  init(params) {
    let BMap = new bmap.BMapWX({
      ak: globalData.ak,
    });
    BMap.weather({
      location: params.location,
      fail: this.fail,
      success: this.success,
    });
  },
  fail(res) {
    wx.stopPullDownRefresh();
    let errMsg = res.errMsg || ''
    // 拒绝授权地理位置权限
    if (errMsg.indexOf('deny') !== -1 || errMsg.indexOf('denied') !== -1) {
      wx.showToast({
        title: '需要开启地理位置权限',
        icon: 'none',
        duration: 2500,
        success: (res) => {
          if (this.canUseOpenSettingApi()) {
            let timer = setTimeout(() => {
              clearTimeout(timer)
              wx.openSetting({})
            }, 2500)
          } else {
            this.setData({
              openSettingButtonShow: true,
            })
          }
        },
      })
    } else {
      wx.showToast({
        title: '网络不给力，请稍后再试',
        icon: 'none',
      })
    }
  },
  onPullDownRefresh(res) {
    this.init({})
  },
  /**
   * 上次存储的菜单按钮位置
   */
  setMenuPosition() {
    wx.getStorage({
      key: 'pos',
      success: (res) => {
        this.setData({
          pos: res.data,
        })
      },
      fail: (res) => {
        this.setData({
          pos: {},
        })
      },
    })
  },
  // 获取之前存储的静态天气数据
  getCityDatas() {
    let cityDatas = wx.getStorage({
      key: 'cityDatas',
      success: (res) => {
        this.setData({
          cityDatas: res.data,
        })
      },
    })
  },
  setBcgImg(index) {
    if (index) {
      this.setData({
        bcgImgIndex: index,
        bcgImg: this.data.bcgImgList[index].src,
        bcgColor: this.data.bcgImgList[index].topColor,
      })
      this.setNavigationBarColor()
      return
    }
    wx.getStorage({
      key: 'bcgImgIndex',
      success: (res) => {
        let bcgImgIndex = res.data || 0
        this.setData({
          bcgImgIndex,
          bcgImg: this.data.bcgImgList[bcgImgIndex].src,
          bcgColor: this.data.bcgImgList[bcgImgIndex].topColor,
        })
        this.setNavigationBarColor()
      },
      fail: () => {
        this.setData({
          bcgImgIndex: 0,
          bcgImg: this.data.bcgImgList[0].src,
          bcgColor: this.data.bcgImgList[0].topColor,
        })
        this.setNavigationBarColor()
      },
    })
  },
  setNavigationBarColor(color) {
    let bcgColor = color || this.data.bcgColor
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: bcgColor
    })
  },
  onShow(){
    this.setBcgImg();
    this.getCityDatas();
    this.setMenuPosition();
    this.setNavigationBarColor('#2d2225');
    this.initSetting((setting) => {
      this.checkUpdate(setting)
    });
    if (!this.data.cityChanged) {
      this.init({})
    } else {
      this.search(this.data.searchCity)
      this.setData({
        cityChanged: false,
        searchCity: '',
      })
    }
    this.setData({
      message: messages.messages(),
    })
  },
  onHide(){
    wx.setStorage({
      key: 'pos',
      data: this.data.pos,
    })
  },
  initSetting(successFunc) {
    wx.getStorage({
      key: 'setting',
      success: (res) => {
        let setting = res.data || {}
        this.setData({
          setting,
        })
        successFunc && successFunc(setting)
      },
      fail: () => {
        this.setData({
          setting: {},
        })
      },
    })
  },
  checkUpdate(setting) {
    // 兼容低版本
    if (!setting.forceUpdate || !wx.getUpdateManager) {
      return
    }
    let updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate((res) => {
      console.error(res)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已下载完成，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      })
    })
  },
  showBcgImgArea() {
    this.setData({
      bcgImgAreaShow: true,
    })
  },
  hideBcgImgArea() {
    this.setData({
      bcgImgAreaShow: false,
    })
  },
  chooseBcg(e) {
    let dataset = e.currentTarget.dataset
    let src = dataset.src
    let index = dataset.index
    this.setBcgImg(index)
    wx.setStorage({
      key: 'bcgImgIndex',
      data: index,
    })
  },
  onShareAppMessage(res){
    return {
      title: 'Happy Weather--快乐天气',
      path: `/pages/home/home`,
      // imageUrl: '',
      success() { },
      fail(e) {
        let errMsg = e.errMsg || ''
        // 对不是用户取消转发导致的失败进行提示
        let msg = '分享失败，可重新分享'
        if (errMsg.indexOf('cancel') !== -1) {
          msg = '取消分享'
        }
        wx.showToast({
          title: msg,
          icon: 'none',
        })
      }
    }
  },

})