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
      , fullscreen: true
    })
    // .viewport(1024, 768) //设置是否展示屏幕，和屏幕大小
    page.goto('http://webtest.xingyun361.com') //进入型云网站
  })

  /************************************************ 登录买家，下单，付款 *********************************************/
  test('Mall buy and pay', async function() { // 商城购物付款
    await page
      .click('#login1 a')
      .wait('#username_0')
    let code = await page
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
      })
    console.log('code>>>>' + code)
    await page
      .insert('#login_code', code) //输入验证码
      .click('#login_bt.c_loginBtn') //点击确定
      .wait(1000)

    let content = await page
      .wait()
      .evaluate(function() {
        return document.title
      })
    expect(content).toBe('型云')

    await page
      .click('#active2')
      .click('#area_float_side_mycart a') //点击侧边栏购物车
      .click('.cart_hed span') //点击清空购物车

    await page.wait(1000)
      .insert('#ipt_goods_name', '槽钢') //输入槽钢
      .click('#queryButton')
      .wait(1000)
      .click('.table.table-striped.mb0 tbody:nth-child(2) tr td:nth-last-child(1) a') //点击第一行的购买
      .click('#area_float_side_mycart a') //点击侧边栏购物车
      .wait(500)
      .click('.js_btn') //点击去购物车结算
      .wait(500)

    await page
      .wait(2000)
      .wait('.m_inner label input')
      .click('.m_inner label:nth-child(2) input') //选择磅计
      .evaluate(function() {
        document.querySelector('.tr_num input').value = '' //清空数字
      })
      .insert('.tr_num input', '10') //输入数量为10
      .wait(500)
      .click('.tr_do a:nth-child(2)') //点击生成订单
      .click('.ks-dialog-footer.ks-overlay-footer button ') //点击确定
      .wait(2000)
      .click('.suc_bottom.text-center a:nth-child(2)') //点击去付款


    await page
      .wait(1000)
      .wait('#content_1 tr:nth-last-child(1)')
      .click('#content_1 tr td:nth-last-child(1) a') //点击付款
      .wait(1000)

    await page
      .wait(1000)
    orderNo = await page
      .evaluate(() => document.querySelector('.h_f_1 span').innerHTML) //获取订单号
    console.log('orderNo:>>' + orderNo)

    await page.wait()
    warehouse = await page
      .evaluate(() => document.querySelector('#goods_list_id td:nth-child(6)').innerHTML) //获取仓库名
    console.log('warehouse:>>' + warehouse)


    await page
      .insert('#ipt_password_3', '888888') //输入密码
    let msg = await page.wait('#btn_3_ok')
      .evaluate(function() {
        const htmlObj = $.ajax({
          url: 'http://webtest.xingyun361.com/gzql/zhd/util/query_secret.shtml?type=pay',
          async: false
        }) //获取验证码
        return JSON.parse(htmlObj.responseText).code || ''
      })
    console.log('code>>>>' + msg)
    await page
      .insert('#ipt_vcode_3', msg) //输入验证码
      .click('#btn_3_ok') //点击确认
      .click('#ks-stdmod-footer-ks-component475 button:nth-child(1)') //点击确定
      .wait('#ks-stdmod-footer-ks-component607 button')
      .click('#ks-stdmod-footer-ks-component607 button').end() //点击确定
  })

  /*************************************登陆卖家，制作提单********************************************************/
  // test('make lad bill', async function () { //制作提单
  //   console.log('orderNo:>>>' + orderNo)
  //   console.log('warehouse:>>>' + warehouse)
  //   await page
  //     .click('#login1 a')
  //     .wait('#username_0')
  //   let code = await page
  //     .insert('#username_0', 'wangnan') //登陆卖家
  //     .insert('#password', '888888')
  //     .inject('js', 'src/utils/jquery.min.js')
  //     .wait()
  //     .evaluate(function() {
  //       const htmlObj = $.ajax({
  //         url: 'http://webtest.xingyun361.com/gzql/zhd/util/query_secret.shtml?type=login',
  //         async: false
  //       }) //获取验证码
  //       return JSON.parse(htmlObj.responseText).code || ''
  //     })
  //   console.log('code>>>>' + code)
  //   await page
  //     .insert('#login_code', code) //输入验证码
  //     .click('#login_bt.c_loginBtn') //点击确定

  //   await page
  //     .wait(1000)
  //   let content = await page
  //     .evaluate(() => document.title)
  //   expect(content).toBe('卖家中心 - 买卖钢材，行云流水')

  //   let cookies = await page.cookies.get()
  //   console.log('cookies')
  //   console.log(cookies)

  //   await page
  //     .click('.top_icon16') //点击提单管理
  //     .wait('.my_left_block1 li:nth-child(5) ul li:nth-last-child(1)')
  //     .click('.my_left_block1 li:nth-child(5) ul li:nth-child(1) a') //点击制作提单
  //     .insert('#tstc_no', orderNo) //输入订单号
  //     .click('#queryButton') //点击查询按钮
  //     .wait('#batch_makeBill')
  //     .wait(1000)
  //   let url = await page.wait()
  //     .evaluate(() => document.querySelector('#tbContent tr:nth-child(1) td:nth-last-child(1) a').href)
  //   console.log('url:>>>' + url)
  //   await page.wait()
  //     .click('#tbContent tr:nth-child(1) td:nth-last-child(1) a') //点击制作提单按钮
  //   await page
  //     .cookies.set(cookies)
  //     .goto(url)
  //     .wait()
  //   let titleName = await page
  //     .evaluate(function() {
  //       return document.title
  //     })
  //   expect(titleName).toBe('制作提单 - 买卖钢材，行云流水')
  //   await page
  //     .insert('#delivery_man_input', '周玉') //输入制作提单内容
  //     .insert('#phone_dv', '18861281071')
  //     .insert('#certificate_code', '340621197309108496')
  //     .insert('#vehicle_no_input', '苏DEW255')
  //     .click('#tjButton') //点击确定
  //     .wait(500)
  //     .click('.ks-dialog-footer.ks-overlay-footer div:nth-child(1) button') //点击确定
  //     .wait(500)
  //     .click('.ks-dialog-footer.ks-overlay-footer div:nth-child(1) button') //点击确定
  //     .wait(1500)
  //   let makefinish = await page
  //     .evaluate(() => document.querySelector('#goodsContent tr td span').innerHTML)
  //   expect(makefinish).toBe('物资已全提完！！！')
  //   console.log('makefinish:>>' + makefinish)

  //   await page.wait(500)
  //     .click('.top_icon16') //点击提单管理
  //     .click('.my_left_block1 li:nth-child(5) ul li:nth-child(2) a') //点击提单管理
  //     .insert('#dealNo', orderNo) //输入订单号
  //     .click('#queryButton') //点击查询
  //     .wait(1000)

  //   await page.wait(1000)

  //   listNo = await page
  //     .evaluate(() => document.querySelector('#tbContent_sell tr td:nth-child(1)').innerHTML) //根据订单号查询提单号
  //   console.log('listNo:>>' + listNo)
  //   await page.wait(1000).end()

  // })

  /*****************************************登陆仓储出库**********************************************************/
  // test('out of warehouse ', async function() {
  //   await page.goto('http://192.168.80.147:8080/app/login.do') //登陆仓储
  //     .wait('#btnlogin')
  //     .insert('.loginList:nth-child(1) input', 'gdsdp')
  //     .insert('.loginList:nth-child(2) input', 'sdp123')
  //     .insert('.crandomCode input', '1111')
  //     .click('#btnlogin')
  //   let content = await page
  //     .wait(1000)
  //     .evaluate(() => document.querySelector('#app-header-innerCt span').innerHTML)
  //   expect(content).toBe('型云供应链集成管理平台')
  //   console.log('content:>>' + content)

  //   await page
  //     .wait(1000)
  //     .click('#treeview-1040-record-0008 div span') //点击仓储物流管理
  //     .wait(500)
  //     .click('#treeview-1040-record-0036 div span') //点击仓储管理
  //     .wait(500)
  //     .click('#treeview-1040-record-0038 div span') //点击出库管理
  //     .wait(500)

  //   await page
  //     .click('#treeview-1040-record-P0092 span') //点击出库实提登记
  //     .wait(1000)

  //   await page
  //     .click('.x-panel.x-grid-with-row-lines.x-grid-locked.x-border-item.x-box-item.x-panel-default.x-grid span') //点击增加
  //     .wait(1000)

  //   await page
  //     .wait('#ldp_source_storage_warehouseout_ownerout_controller_OwneroutCtrl_showEditWin')
  //   let warehouseCode = await page.wait()
  //     .inject('js', 'src/utils/jquery.min.js')
  //     .wait()
  //     .evaluate(() => {
  //       const htmlObj = $.ajax({
  //         url: 'http://192.168.80.147:8080/app/warehouseAjax!queryCombo.do?_dc=1527833563371',
  //         type: 'post',
  //         data: {
  //           page: 1,
  //           start: 0,
  //           limit: 100,
  //           query: ''
  //         },
  //         dataType: 'application/x-www-form-urlencoded',
  //         async: false
  //       })
  //       return JSON.parse(htmlObj.responseText).warehouseList || ''
  //     })

  //   let wareCode = ''
  //   if (warehouseCode !== '') {
  //     let index = warehouseCode.findIndex(item => item.warehouseName === warehouse)
  //     if (index > -1) wareCode = warehouseCode[index].warehouseCode
  //   }
  //   console.log('====wareCode:>>.' + wareCode)

  //   await page
  //     .wait(1000)
  //     .insert('#ldp_source_storage_warehouseout_ownerout_controller_OwneroutCtrl_showEditWin_main-innerCt input[name="warehouseCode"]', wareCode) //输入仓库名
  //     .insert('#ldp_source_storage_warehouseout_ownerout_controller_OwneroutCtrl_showEditWin_main-innerCt table:nth-child(2) td:nth-child(2) table:nth-child(5) input', listNo) //输入提单号
  //     .click('#ldp_source_storage_warehouseout_ownerout_controller_OwneroutCtrl_showEditWin_oconsignBt-btnInnerEl') //点击待出库物资

  //   await page
  //     .wait(1000)
  //     .click('#ldp_source_storage_warehouseout_ownerout_controller_OwneroutCtrl_showEditWin_import_queryForm-innerCt .x-panel.x-panel-default a span') //点击查询
  //     .wait(500)
  //     .click('.x-column-header.x-column-header-align-center.x-box-item.x-column-header-default.x-unselectable.x-column-header-first.x-column-header-last span') //点击全选
  //     .click('.x-toolbar.x-docked.x-toolbar-footer.x-docked-bottom.x-toolbar-docked-bottom.x-toolbar-footer-docked-bottom.x-box-layout-ct .x-btn.x-unselectable.x-box-item.x-toolbar-item.x-btn-default-small.x-noicon.x-btn-noicon.x-btn-default-small-noicon') //点击确定
  //     .wait(500)
  //     .click('#ldp_source_storage_warehouseout_ownerout_controller_OwneroutCtrl_showEditWin_save-btnInnerEl') //点击保存
  //     .wait(1000)
  //     .click('.x-toolbar.x-docked.x-toolbar-footer.x-docked-bottom.x-toolbar-docked-bottom.x-toolbar-footer-docked-bottom.x-box-layout-ct span') //点击确定
  //     .end()
  // })
})