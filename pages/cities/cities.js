let staticData = require('../../data/staticData.js')
let utils = require('../../utils/utils.js')
Page({
  data:{
    alternative: null,
    cities: [],
    showItems: null,
    inputText: ''
  },
  cancel() {
    this.setData({
      inputText : '',
      showItems: this.data.cities
    })
  },
  // 根据城市进行筛选
  inputFilter(e) {
    let alternative = {}
    let cities = this.data.cities
    let value = e.detail.value.replace(/\s+/g,'')
    if(value.length) {
      for(let i in cities) {
        let items = cities[i];
        for(let j = 0,len = items.length;j < len;j++) {
          let item = items[j]
          // 如果城市名称中含有搜索关键词
          if(item.name.indexOf(value) != -1) {
            if (utils.isEmptyObject(alternative[i])) {
              alternative[i] = []
            }
            alternative[i].push(item);
          }
        }
      }
      if (utils.isEmptyObject(alternative)) {
        alternative = null
      }
      this.setData({
        alternative,
        showItems: alternative,
      })
    } else {
      this.setData({
        alternative : null,
        showItems: cities
      })
    }
  },
  // 按照字母顺序生成需要的数据格式
  getSortedAreaObj(areas) {
    // let areas = staticData.areas
    areas = areas.sort((a, b) => {
      if (a.letter > b.letter) {
        return 1
      }
      if (a.letter < b.letter) {
        return -1
      }
      return 0
    })
    let obj = {}
    for (let i = 0, len = areas.length; i < len; i++) {
      let item = areas[i]
      delete item.districts
      let letter = item.letter
      if (!obj[letter]) {
        obj[letter] = []
      }
      obj[letter].push(item)
    }
    // 返回一个对象，直接用 wx:for 来遍历对象，index 为 key，item 为 value，item 是一个数组
    return obj
  },
  // 城市选择了之后的动作
  choose(e) {
    console.log('choose',e)
    let item = e.currentTarget.dataset.item
    let name = item.name
    let pages = getCurrentPages()
    let len = pages.length
    let indexPage = pages[len - 2]
    indexPage.setData({
      cityChanged:true,
      searchCity: name
    })
    wx.navigateBack({})
  },
  onLoad() {
    let cities = this.getSortedAreaObj(staticData.cities || [])
    this.setData({
      cities,
      showItems: cities
    })
  }
})