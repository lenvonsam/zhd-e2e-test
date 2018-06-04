import Nightmare from 'nightmare'
import {
  getScreenshotUrl
} from 'jest-vue-report' //引用方法

jest.setTimeout(50000)
describe('xingyun Login', function() { //login指的是该用例的描述
  let page = null
  let orderNo = ''
  let listNo = ''
  let warehouse = ''
  beforeEach(function() {
    page = Nightmare({
      show: false
      , fullscreen: false
    })
    // .viewport(1024, 768) //设置是否展示屏幕，和屏幕大小
    page.goto('http://webtest.xingyun361.com') //进入型云网站
  })

  it('xingyun login', (done) => {
    page
      .wait(500)
      .click('#login1 a')
      .wait('#username_0')
      .insert('#username_0', '王楠') //登录买家
      .insert('#password', '888888')
      .inject('js', 'src/utils/jquery.min.js')
      .wait()
      .evaluate(function() {
        const htmlObj = $.ajax({
          url: 'http://webtest.xingyun361.com/gzql/zhd/util/query_secret.shtml?type=login',
          async: false
        }) //获取验证码
        return JSON.parse(htmlObj.responseText).code || ''
      }).then(code => {
        console.log('code:>>>' + code)
        page
        .insert('#login_code', code) //输入验证码
        .click('#login_bt.c_loginBtn') //点击确定
        .wait(1000)
        .click('#active2')
        .click('#area_float_side_mycart a') //点击侧边栏购物车
        .click('.cart_hed span')
        .wait(1000)
        .insert('#ipt_goods_name', '槽钢') //输入槽钢
        .click('#queryButton')
        .wait(1000)
        .click('.table.table-striped.mb0 tbody:nth-child(2) tr td:nth-last-child(1) a') //点击第一行的购买
        .click('#area_float_side_mycart a') //点击侧边栏购物车
        .wait(500)
        .click('.js_btn') //点击去购物车结算
        .wait(500)
        .wait(2000)
        .wait('.m_inner label input')
        .click('.m_inner label:nth-child(2) input')
        .evaluate(function() {
        document.querySelector('.tr_num input').value = '' //清空数字
        }).end().then(() => {
          console.log('结束======')
          done()
        })
      })
  })
})