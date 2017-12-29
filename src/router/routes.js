const login = r => require.ensure([], () => r(require('../modules/login')), 'login')
const home = r => require.ensure([], () => r(require('../modules/home')), 'home')
const systemConf = r => require.ensure([], () => r(require('../modules/system/conf')), 'systemConf')
const systemLog = r => require.ensure([], () => r(require('../modules/system/log')), 'systemLog')
const systemRole = r => require.ensure([], () => r(require('../modules/system/role')), 'systemRole')
const systemUser = r => require.ensure([], () => r(require('../modules/system/user')), 'systemUser')
//客服管理
const customerHelp = r => require.ensure([], () => r(require('../modules/customer/help')), 'customerHelp')
//学院官网模块
const collegeLink = r => require.ensure([], () => r(require('../modules/college/link')), 'collegeLink')
const collegeApply = r => require.ensure([], () => r(require('../modules/college/apply')), 'collegeApply')
const collegeShare = r => require.ensure([], () => r(require('../modules/college/share')), 'collegeShare')
const collegeActivity = r => require.ensure([], () => r(require('../modules/college/activity')), 'collegeActivity')
const collegeIndustry = r => require.ensure([], () => r(require('../modules/college/industry')), 'collegeIndustry')
const collegeCategory = r => require.ensure([], () => r(require('../modules/college/category')), 'collegeCategory')
//进销存模块
const jxcSupplier = r => require.ensure([], () => r(require('../modules/jxc/supplier_management')), 'jxcSupplier')
const accountManagement = r => require.ensure([], () => r(require('../modules/jxc/account_management')), 'accountManagement')
const purchaseManagement = r => require.ensure([], () => r(require('../modules/jxc/purchase_management')), 'purchaseManagement')
const jmgoodsinManagement = r => require.ensure([], () => r(require('../modules/jxc/jmgoodsin_management')), 'jmgoodsinManagement')
const goodsinManagement = r => require.ensure([], () => r(require('../modules/jxc/goodsin_management')), 'goodsinManagement')
const saleManagement = r => require.ensure([], () => r(require('../modules/jxc/sale_management')), 'saleManagement')
const saleReportManagement = r => require.ensure([], () => r(require('../modules/jxc/sale_report_management')), 'saleReportManagement')
const goodsoutManagement = r => require.ensure([], () => r(require('../modules/jxc/goodsout_management')), 'goodsoutManagement')
const baseManagement = r => require.ensure([], () => r(require('../modules/jxc/base_management')), 'baseManagement')
const rentedManagement = r => require.ensure([], () => r(require('../modules/jxc/rented_management')), 'rentedManagement')
const rejectManagement = r => require.ensure([], () => r(require('../modules/jxc/reject_management')), 'rejectManagement')
const ckManagement = r => require.ensure([], () => r(require('../modules/jxc/ck_management')), 'ckManagement')
//典当圈后台
const brandGroup = r => require.ensure([], () => r(require('../modules/ddq/pl/brand_group')), 'brandGroup')
const goodsCategory = r => require.ensure([], () => r(require('../modules/ddq/pl/goods_category')), 'goodsCategory')
const brand = r => require.ensure([], () => r(require('../modules/ddq/pl/brand')), 'brand')
const goodsSerial = r => require.ensure([], () => r(require('../modules/ddq/pl/goods_serial')), 'goodsSerial')
const goodsType = r => require.ensure([], () => r(require('../modules/ddq/pl/goods_type')), 'goodsType')
const dgjList = r => require.ensure([], () => r(require('../modules/ddq/dgj/list')), 'dgjList')
const identifyListDdq = r => require.ensure([], () => r(require('../modules/ddq/identify/identify_list')), 'identifyListDdq')
const identifyOrder = r => require.ensure([], () => r(require('../modules/ddq/identify/identify_order')), 'identifyOrder')
// const withdrawList = r => require.ensure([], () => r(require('../modules/ddq/money/withdraw_list')), 'withdrawList')
const memberList = r => require.ensure([], () => r(require('../modules/ddq/member/list')), 'memberList')
const maintenList = r => require.ensure([], () => r(require('../modules/ddq/orders/mainten_list')), 'maintenList')
const ordersList = r => require.ensure([], () => r(require('../modules/ddq/orders/list')), 'ordersList')
const vipList = r => require.ensure([], () => r(require('../modules/ddq/member/vip_list')), 'vipList')
const vipType = r => require.ensure([], () => r(require('../modules/ddq/member/vip_type')), 'vipType')
const goodsManagement = r => require.ensure([], () => r(require('../modules/ddq/goods/goods_management')), 'goodsManagement')
const goodCommentList = r => require.ensure([], () => r(require('../modules/ddq/goods/good_comment_list')), 'goodCommentList')
const goodAgreeList = r => require.ensure([], () => r(require('../modules/ddq/goods/good_agree_list')), 'goodAgreeList')
const appra = r => require.ensure([], () => r(require('../modules/ddq/member/appra')), 'appra')
const orgInfo = r => require.ensure([], () => r(require('../modules/ddq/member/org_info')), 'orgInfo')
const userInfo = r => require.ensure([], () => r(require('../modules/ddq/member/user_info')), 'userInfo')
const identifyList = r => require.ensure([], () => r(require('../modules/ddq/orders/identify_list')), 'identifyList')
const buygoodsList = r => require.ensure([], () => r(require('../modules/ddq/orders/buygoods_list')), 'buygoodsList')
const recyclingList = r => require.ensure([], () => r(require('../modules/ddq/orders/recycling_list')), 'recyclingList')
const banner = r => require.ensure([], () => r(require('../modules/ddq/banner')), 'banner')
//客户关系管理
const customerOpen = r => require.ensure([], () => r(require('../modules/customer_relation/open')), 'customerOpen')
const customerPrivate = r => require.ensure([], () => r(require('../modules/customer_relation/private')), 'customerPrivate')
//财务管理
const paymentManagement = r => require.ensure([], () => r(require('../modules/money/payment_management')), 'paymentManagement')
const paymentDetailManagement = r => require.ensure([], () => r(require('../modules/money/payment_detail_management')), 'paymentDetailManagement')
const collectManagement = r => require.ensure([], () => r(require('../modules/money/collect_management')), 'collectManagement')
const collectDetailManagement = r => require.ensure([], () => r(require('../modules/money/collect_detail_management')), 'collectDetailManagement')
const yueManagement = r => require.ensure([], () => r(require('../modules/money/yue_management')), 'yueManagement')
const bueCollectManagement = r => require.ensure([], () => r(require('../modules/money/bue_collect_management')), 'bueCollectManagement')
const collectOrderManagement = r => require.ensure([], () => r(require('../modules/money/collect_order_management')), 'collectOrderManagement')
const orderCancelManagement = r => require.ensure([], () => r(require('../modules/money/order_cancel_management')), 'orderCancelManagement')
//今日营业报表 
const today = r => require.ensure([], () => r(require('../modules/charts/today')), 'today')
const chartsUser = r => require.ensure([], () => r(require('../modules/charts/user')), 'chartsUser')
const sellGoods = r => require.ensure([], () => r(require('../modules/charts/sell_goods')), 'sellGoods')
const buyGoods = r => require.ensure([], () => r(require('../modules/charts/buy_goods')), 'buyGoods')
const chartsOrder = r => require.ensure([], () => r(require('../modules/charts/order')), 'chartsOrder')
const identifyRequest = r => require.ensure([], () => r(require('../modules/charts/identify_request')), 'identifyRequest')
const userSearch = r => require.ensure([], () => r(require('../modules/charts/user_search')), 'userSearch')
const chartsCode = r => require.ensure([], () => r(require('../modules/charts/code')), 'chartsCode')
const loginInfo = r => require.ensure([], () => r(require('../modules/charts/login_info')), 'loginInfo')
//人人奢官网
const rrsNews = r => require.ensure([], () => r(require('../modules/rrs/news')), 'rrsNews')
//拍卖数据
const paimaiList = r => require.ensure([], () => r(require('../modules/third/paimai_list')), 'paimaiList')
const watchList = r => require.ensure([], () => r(require('../modules/third/watch_list')), 'watchList')

export default [
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/home',
    name: 'home',
    component: home,
    children: [
      //========================拍卖=======================//
      {
        path: '/home/third/paimai_list',
        name: 'paimaiList',
        component: paimaiList,
        meta: { role: 'MENU_THIRD_PAIMAI_LIST_MANAGEMENT' }
      },
      {
        path: '/home/third/watch_list',
        name: 'watchList',
        component: watchList,
        meta: { role: 'MENU_THIRD_WATCH_LIST_MANAGEMENT' }
      },
      //========================人人奢=======================//
      {
        path: '/home/rrs/news',
        name: 'rrsNews',
        component: rrsNews,
        meta: { role: 'MENU_RRS_NEWS' }
      },
      //========================财务管理=======================//
      {
        path: '/home/money/order_cancel_management',
        name: 'orderCancelManagement',
        component: orderCancelManagement,
        meta: { role: 'MENU_MONEY_ORDER_CANCEL_MANAGEMENT' }
      },
      {
        path: '/home/money/collect_order_management',
        name: 'collectOrderManagement',
        component: collectOrderManagement,
        meta: { role: 'MENU_MONEY_COLLECT_ORDER_MANAGEMENT' }
      },
      {
        path: '/home/money/bue_collect_management',
        name: 'bueCollectManagement',
        component: bueCollectManagement,
        meta: { role: 'MENU_MONEY_BUE_COLLECT_MANAGEMENT' }
      },
      {
        path: '/home/money/yue_management',
        name: 'yueManagement',
        component: yueManagement,
        meta: { role: 'MENU_MONEY_YUE_MANAGEMENT' }
      },
      {
        path: '/home/money/payment_management',
        name: 'paymentManagement',
        component: paymentManagement,
        meta: { role: 'MENU_MONEY_PAYMENT_MANAGEMENT' }
      },
      {
        path: '/home/money/payment_detail_management',
        name: 'paymentDetailManagement',
        component: paymentDetailManagement,
        meta: { role: 'MENU_MONEY_PAYMENT_DETAIL_MANAGEMENT' }
      },
      {
        path: '/home/money/collect_management',
        name: 'collectManagement',
        component: collectManagement,
        meta: { role: 'MENU_MONEY_COLLECT_MANAGEMENT' }
      },
      {
        path: '/home/money/collect_detail_management',
        name: 'collectDetailManagement',
        component: collectDetailManagement,
        meta: { role: 'MENU_MONEY_COLLECT_DETAIL_MANAGEMENT' }
      },
      //========================客户关系管理=======================//
      {
        path: '/home/customer_relation/private',
        name: 'customerPrivate',
        component: customerPrivate,
        meta: { role: 'MENU_CUSTOMER_PRIVATE' }
      },
      {
        path: '/home/customer_relation/open',
        name: 'customerOpen',
        component: customerOpen,
        meta: { role: 'MENU_CUSTOMER_OPEN' }
      },
      //========================典当圈后台=======================//
      {
        path: '/home/ddq/identify/identify_list',
        name: 'identifyListDdq',
        component: identifyListDdq,
        meta: { role: 'MENU_IDENTIFY_MANAGEMENT' }
      },
      {
        path: '/home/ddq/identify/identify_order',
        name: 'identifyOrder',
        component: identifyOrder,
        meta: { role: 'MENU_IDENTIFY_ORDER_MANAGEMENT' }
      },
      {
        path: '/home/ddq/banner',
        name: 'banner',
        component: banner,
        meta: { role: 'MENU_DDQ_BANNER_MANAGEMENT' }
      },
      {
        path: '/home/ddq/member/user_info',
        name: 'userInfo',
        component: userInfo,
        meta: { role: 'MENU_DDQ_USER_INFO' }
      },
      {
        path: '/home/ddq/member/org_info',
        name: 'orgInfo',
        component: orgInfo,
        meta: { role: 'MENU_DDQ_ORG_INFO' }
      },
      {
        path: '/home/ddq/member/appra',
        name: 'appra',
        component: appra,
        meta: { role: 'MENU_DDQ_APPRA_LIST' }
      },
      {
        path: '/home/ddq/member/vip_list',
        name: 'vipList',
        component: vipList,
        meta: { role: 'MENU_DDQ_USER_VIP_LIST' }
      },
      {
        path: '/home/ddq/member/vip_type',
        name: 'vipType',
        component: vipType,
        meta: { role: 'MENU_DDQ_USER_VIP_TYPE_LIST' }
      },
      {
        path: '/home/ddq/goods/goods_management',
        name: 'goodsManagement',
        component: goodsManagement,
        meta: { role: 'MENU_DDQ_GOODS_LIST' }
      },
      {
        path: '/home/ddq/goods/good_comment_list',
        name: 'goodCommentList',
        component: goodCommentList,
        meta: { role: 'MENU_DDQ_GOODS_COMMENT_LIST' }
      },
      {
        path: '/home/ddq/goods/good_agree_list',
        name: 'goodAgreeList',
        component: goodAgreeList,
        meta: { role: 'MENU_DDQ_GOODS_AGREE_LIST' }
      },
      {
        path: '/home/ddq/orders/mainten_list',
        name: 'maintenList',
        component: maintenList,
        meta: { role: 'MENU_DDQ_ORDERS_MAINTEN_LIST' }
      },
      {
        path: '/home/ddq/orders/list',
        name: 'ordersList',
        component: ordersList,
        meta: { role: 'MENU_DDQ_ORDERS_LIST' }
      },
      {
        path: '/home/ddq/orders/identify_list',
        name: 'identifyList',
        component: identifyList,
        meta: { role: 'MENU_DDQ_ORDERS_IDENTIFY_LIST' }
      },
      {
        path: '/home/ddq/orders/buygoods_list',
        name: 'buygoodsList',
        component: buygoodsList,
        meta: { role: 'MENU_DDQ_ORDERS_BUYGOODS_LIST' }
      },
      {
        path: '/home/ddq/orders/recycling_list',
        name: 'recyclingList',
        component: recyclingList,
        meta: { role: 'MENU_DDQ_ORDERS_RECYCLING_LIST' }
      },
      // {
      //   path: '/home/ddq/money/withdraw_list',
      //   name: 'withdrawList',
      //   component: withdrawList,
      //   meta: { role: 'MENU_DDQ_MEMBER_LIST' }
      // },
      {
        path: '/home/ddq/member/list',
        name: 'memberList',
        component: memberList,
        meta: { role: 'MENU_DDQ_MEMBER_LIST' }
      },
      {
        path: '/home/ddq/dgj/list',
        name: 'dgjList',
        component: dgjList,
        meta: { role: 'MENU_DGJ_LIST' }
      },
      {
        path: '/home/ddq/pl/goods_type',
        name: 'goodsType',
        component: goodsType,
        meta: { role: 'MENU_PL_GOODS_TYPE_MANAGEMENT' }
      },
      {
        path: '/home/ddq/pl/goods_serial',
        name: 'goodsSerial',
        component: goodsSerial,
        meta: { role: 'MENU_PL_GOODS_SERIAL_MANAGEMENT' }
      },
      {
        path: '/home/ddq/pl/brand_group',
        name: 'brandGroup',
        component: brandGroup,
        meta: { role: 'MENU_PL_BRAND_GROUP_MANAGEMENT' }
      },
      {
        path: '/home/ddq/pl/goods_category',
        name: 'goodsCategory',
        component: goodsCategory,
        meta: { role: 'MENU_PL_GOODS_CATEGORY_MANAGEMENT' }
      },
      {
        path: '/home/ddq/pl/brand',
        name: 'brand',
        component: brand,
        meta: { role: 'MENU_PL_BRAND_MANAGEMENT' }
      },
      //========================系统=======================//
      {
        path: '/home/system/conf',
        name: 'systemConf',
        component: systemConf,
        meta: { role: 'MENU_SYSTEM_SETTING_MANAGEMENT' } 
      },
      {
        path: '/home/system/log',
        name: 'systemLog',
        component: systemLog,
        meta: { role: 'MENU_SYSTEM_LOG_MANAGEMENT' } 
      },
      {
        path: '/home/system/role',
        name: 'systemRole',
        component: systemRole,
        meta: { role: 'MENU_SYSTEM_ROLE_MANAGEMENT' } 
      },
      {
        path: '/home/system/user',
        name: 'systemUser',
        component: systemUser,
        meta: { role: 'MENU_SYSTEM_USER_MANAGEMENT' } 
      },
      //========================官网=======================//
      {
        path: '/home/college/link',
        name: 'collegeLink',
        component: collegeLink,
        meta: { role: 'MENU_COLLEGE_LINK_MANAGEMENT' }
      },
      {
        path: '/home/college/apply',
        name: 'collegeApply',
        component: collegeApply,
        meta: { role: 'MENU_COLLEGE_APPLY_MANAGEMENT' }
      },
      {
        path: '/home/college/share',
        name: 'collegeShare',
        component: collegeShare,
        meta: { role: 'MENU_COLLEGE_SHARE_MANAGEMENT' }
      },
      {
        path: '/home/college/activity',
        name: 'collegeActivity',
        component: collegeActivity,
        meta: { role: 'MENU_COLLEGE_ACTIVITY_MANAGEMENT' }
      },
      {
        path: '/home/college/industry',
        name: 'collegeIndustry',
        component: collegeIndustry,
        meta: { role: 'MENU_COLLEGE_INDUSTRY_MANAGEMENT' }
      },
      {
        path: '/home/college/category',
        name: 'collegeCategory',
        component: collegeCategory,
        meta: { role: 'MENU_COLLEGE_CATEGORY_MANAGEMENT' }
      },
      //========================进销存=======================//
      {
        path: '/home/jxc/supplier_management',
        name: 'jxcSupplier',
        component: jxcSupplier,
        meta: { role: 'MENU_JXC_SUPPLIER_MANAGEMENT' }
      },
      {
        path: '/home/jxc/account_management',
        name: 'accountManagement',
        component: accountManagement,
        meta: { role: 'MENU_JXC_ACCOUNT_MANAGEMENT' }
      },
      {
        path: '/home/jxc/purchase_management',
        name: 'purchaseManagement',
        component: purchaseManagement,
        meta: { role: 'MENU_JXC_PURCHASE_MANAGEMENT' }
      },
      {
        path: '/home/jxc/jmgoodsin_management',
        name: 'jmgoodsinManagement',
        component: jmgoodsinManagement,
        meta: { role: 'MENU_JXC_JMGOODSIN_MANAGEMENT' }
      },
      {
        path: '/home/jxc/goodsin_management',
        name: 'goodsinManagement',
        component: goodsinManagement,
        meta: { role: 'MENU_JXC_GOODSIN_MANAGEMENT' }
      },
      {
        path: '/home/jxc/sale_management',
        name: 'saleManagement',
        component: saleManagement,
        meta: { role: 'MENU_JXC_SALE_MANAGEMENT' }
      },
      {
        path: '/home/jxc/sale_report_management',
        name: 'saleReportManagement',
        component: saleReportManagement,
        meta: { role: 'MENU_JXC_SALEREPORT_MANAGEMENT' }
      },
      {
        path: '/home/jxc/goodsout_management',
        name: 'goodsoutManagement',
        component: goodsoutManagement,
        meta: { role: 'MENU_JXC_GOODSOUT_MANAGEMENT' }
      },
      {
        path: '/home/jxc/base_management',
        name: 'baseManagement',
        component: baseManagement,
        meta: { role: 'MENU_JXC_BASE_MANAGEMENT' }
      },
      {
        path: '/home/jxc/rented_management',
        name: 'rentedManagement',
        component: rentedManagement,
        meta: { role: 'MENU_JXC_RENTED_MANAGEMENT' }
      },
      {
        path: '/home/jxc/reject_management',
        name: 'rejectManagement',
        component: rejectManagement,
        meta: { role: 'MENU_JXC_REJECT_MANAGEMENT' }
      },
      {
        path: '/home/jxc/ck_management',
        name: 'ckManagement',
        component: ckManagement,
        meta: { role: 'MENU_JXC_CK_MANAGEMENT' }
      },
      //========================客服=======================//
      {
        path: '/home/customer/help',
        name: 'customerHelp',
        component: customerHelp,
        meta: { role: 'MENU_CUSTOMER_HELP' }
      },
      //========================统计报表中心=======================//
      {
        path: '/home/charts/today',
        name: 'today',
        component: today,
        meta: { role: 'MENU_CHARTS_TODAY' }
      },
      {
        path: '/home/charts/user',
        name: 'chartsUser',
        component: chartsUser,
        meta: { role: 'MENU_CHARTS_USER' }
      },
      {
        path: '/home/charts/sell_goods',
        name: 'sellGoods',
        component: sellGoods,
        meta: { role: 'MENU_CHARTS_SELL_GOODS' }
      },
      {
        path: '/home/charts/buy_goods',
        name: 'buyGoods',
        component: buyGoods,
        meta: { role: 'MENU_CHARTS_BUY_GOODS' }
      },
      {
        path: '/home/charts/order',
        name: 'chartsOrder',
        component: chartsOrder,
        meta: { role: 'MENU_CHARTS_ORDER' }
      },
      {
        path: '/home/charts/identify_request',
        name: 'identifyRequest',
        component: identifyRequest,
        meta: { role: 'MENU_CHARTS_IDENTIFY_REQUEST' }
      },
      {
        path: '/home/charts/user_search',
        name: 'userSearch',
        component: userSearch,
        meta: { role: 'MENU_CHARTS_USER_SEARCH' }
      },
      {
        path: '/home/charts/code',
        name: 'chartsCode',
        component: chartsCode,
        meta: { role: 'MENU_CHARTS_CODE' }
      },
      {
        path: '/home/charts/login_info',
        name: 'loginInfo',
        component: loginInfo,
        meta: { role: 'MENU_CHARTS_LOGIN_INFO' }
      },
    ]
  },
  { 
    path: '*', 
    redirect: '/login'
  }
]