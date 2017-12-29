'use strict'
const prov = 'http://192.168.1.119'//http://120.25.151.49:8060//http://192.168.1.119//https://erp.chaddq.com//http://demo.chaddq.com
export default {
	hasRole: prov + '/api/has_role',
	order: prov + '/api/order',
	recycleConsignment: prov + '/api/recycle_consignment',
	indentifyLog: prov + '/api/identify_log',
	identifyImg: prov + '/api/identify_img',
	identifyReportWatch: prov + '/api/identify_report_watch',
	identifyReport: prov + '/api/identify_report',
	modifyStatus: prov + '/api/goods_buy_order/modify_status',
	orderLog: prov + '/api/order_log',
	receiverAddr: prov + '/api/receiver_addr',
	logistics: prov + '/api/logistics',
	watchList: prov + '/api/watch',
	paimaiList: prov + '/api/paimai',//拍卖
	hasPrivilege: prov + '/api/has_privilege',
	resetPassword: prov + '/api/user/reset_password',//修改密码
	thumb: prov + '/api/file/thumb',//获取缩略图
	file: prov + '/api/file',//文件接口
	login: prov + '/api/login',//登录
	logout: prov + '/api/logout',//退出
	menu: prov + '/api/menu',//菜单
	current: prov + '/api/user/current',//当前登录人
	conf: prov + '/api/conf',//系统配置
	log: prov + '/api/log',//系统日志
	role: prov + '/api/role',//角色管理
	rolePrivilege: prov + '/api/role_privilege',//角色授权
	user: prov + '/api/user',//用户管理
	buyGoods: prov + '/api/buy_goods',
	identifyRequest: prov + '/api/identify_request',
	userSearch:prov + '/api/user_search/count',
	chartsCode:prov + '/api/code',
	loginInfo:prov + '/api/login_info',
	//========================官网api=========================//
	college: prov + '/api/college',//官网
	rrs: prov + '/api/rrs',//官网
	//========================客服=========================//
	help: prov + '/api/help',//帮助知识库
	//========================进销存=========================//
	supplier: prov + '/api/supplier',//供应商管理
	account: prov + '/api/finance_account',//进销存账户管理
	jmList: prov + '/api/sale_detail/jm_list',//寄卖单号
	purchaseManagement: prov + '/api/purchase',//采购管理
	purchaseDetail: prov + '/api/purchase_detail',
	jmgoodsinManagement: prov + '/api/goods_jm',//寄卖管理
	jmDetail: prov + '/api/goods_jm_detail',//
	goodsinManagement: prov + '/api/goods_in',//入库管理
	saleManagement: prov + '/api/sale',//销售管理
	saleReportManagement: prov + '/api/sale_detail',//销售业绩管理
	goodsoutManagement: prov + '/api/goods_out',//出库管理
	baseManagement: prov + '/api/goods',//库存管理
	rentedManagement: prov + '/api/rented',//借还管理
	rentedDetail: prov + '/api/rented_detail',//借还详情
	rejectManagement: prov + '/api/return',//退货管理
	returnDetail: prov + '/api/return_detail',//
	ckManagement: prov + '/api/jxc/base',//仓库管理
	goodsinDetail: prov + '/api/goods_in_detail',//入库详情
	//========================典当圈后台=========================//
	banner: prov + '/api/banner',
	brandGroup: prov + '/api/brand_group',//品牌分组
	goodsCategory: prov + '/api/goods_category',//商品分类
	brand: prov + '/api/brand',//品牌管理
	goodsSerial: prov + '/api/goods_serial',//商品系列管理
	goodsType: prov + '/api/goods_type',//商品类型管理
	dgjList: prov + '/api/machine_user',//导购机用户
	member: prov + '/api/member',//会员管理
	withdrawList: prov + '/api/withdraw',//体现申请列表
	userAccountRecord: prov + '/api/user_account_record',//余额变动记录
	userPayAccount: prov + '/api/user_pay_account',//余额查询
	userAccount: prov + '/api/user_account',//用户账户
	maintenList: prov + '/api/user_maintenance',//用户养护记录
	ordersList: prov + '/api/goods_buy_order',//订单列表
	sellGoods: prov + '/api/sell_goods',//商品列表
	goodCommentList: prov + '/api/sell_goods_comment',//商品评论列表
	vipType: prov + '/api/vip_detail',//VIP类型
	vipList: prov + '/api/user_vip',//VIP用户列表
	appra: prov + '/api/user_appraiser',//鉴定师列表
	orgInfo: prov + '/api/user_org_apply',//同行申请
	userInfo: prov + '/api/user_info',//实名认证申请
	goodsAttr: prov + '/api/sell_goods_attr',//
	goodsImage: prov + '/api/goods_image',//
	goodsAttrWatch: prov + '/api/goods_attr_watch',//
	goodsAttrBag: prov + '/api/goods_attr_bag',//
	identifyList: prov + '/api/identify_request',
	//========================客户关系管理=========================//
	customer: prov + '/api/customer',//客户关系
	//========================财务管理=========================//
	paymentManagement: prov + '/api/payment',//付款单管理
	paymentDetailManagement: prov + '/api/payment_detail',//付款单明细管理
	collectManagement: prov + '/api/collect',//收款单管理18323894307,17780502244
	collectDetailManagement: prov + '/api/collect_detail',//收款单明细管理430111198712192129

	count : prov + '/api/goods/count',
}
