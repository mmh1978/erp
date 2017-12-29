<style lang="less" scope>
    .goods_img{
        width: 100%;
        height: 320px;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
        margin-top: 10px;
    }
table.gridtable , table.innertable{
    font-size:14px;
    color:#333333;
    border-width: 1px;
    border-color: #666;
    border-collapse: collapse;
    width: 100%;
}
table.gridtable td{
    border-width: 1px;
    border-style: solid;
    border-color: #666;
    background-color: #ffffff;
}
table.gridtable td>div{
    margin: 10px;
}
table.gridtable td>div input{
    border: 0;
    width: 100%;
    outline: none;
    font-size: 14px;
}
table.gridtable td>div .checkbox{
    display: inline-block;
    position: relative;
    padding-left: 20px;
    margin-right: 16px;
}
table.gridtable td>div .checkbox:before{
    content: "";
    display: block;
    position: absolute;
    width: 14px;
    height: 14px;
    border: 1px solid #999;
    border-radius: 4px;
    left: 0;
    top: 50%;
    margin-top: -8px;
    line-height: 14px;
    text-align: center;
}
table.gridtable td>div .checkbox.ok:before{
    content: "\2713";
    font-weight: bold;
    border: 2px solid #000;
}
table.innertable td{
    border-top: none;
    border-left: none;
    border-bottom: none;
    border-right: 1px solid #666;
}
table.innertable td:last-child{
    border: none;
}
</style>
<template>
    <div class="content">
        <el-dialog v-model="dialogVisible" size="full">
            <img :src="dialogImageUrl" alt="">
        </el-dialog>
        <!-- search -->
        <div class="top-bar">
            <div class="item">
                <el-form :inline="true">
                    <el-form-item label="">
                        <el-input v-model="pkGlobalIdSearch" placeholder="订单号"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-input v-model="sellUserPhoneSearch" placeholder="卖家手机号"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-input v-model="buyUserPhoneSearch" placeholder="买家手机号"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="statusSearch" clearable placeholder="订单状态">
                            <el-option :label="'待付款'" :value="'0'"></el-option>
                            <el-option :label="'卖家待发货'" :value="1"></el-option>
                            <el-option :label="'平台待收货'" :value="2"></el-option>
                            <el-option :label="'平台处理中'" :value="3"></el-option>
                            <el-option :label="'平台待发货'" :value="4"></el-option>
                            <el-option :label="'平台待退货'" :value="5"></el-option>
                            <el-option :label="'买家待收货'" :value="6"></el-option>
                            <el-option :label="'买家已收货'" :value="7"></el-option>
                            <el-option :label="'卖家待收货'" :value="8"></el-option>
                            <el-option :label="'卖家已收货'" :value="9"></el-option>
                            <el-option :label="'已取消'" :value="10"></el-option>
                            <el-option :label="'已退款'" :value="11"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item>
                        <el-select v-model="orderTypeSearch" clearable placeholder="订单类型">
                            <el-option :label="'购买商品'" :value="0"></el-option>
                            <el-option :label="'鉴定打赏'" :value="1"></el-option>
                            <el-option :label="'学院打赏'" :value="2"></el-option>
                            <el-option :label="'鉴定悬赏'" :value="3"></el-option>
                            <el-option :label="'卖家拍品保证金'" :value="4"></el-option>
                            <el-option :label="'买家拍品保证金'" :value="5"></el-option>
                            <el-option :label="'拍品成交定单'" :value="6"></el-option>
                            <el-option :label="'养护定单'" :value="7"></el-option>
                            <el-option :label="'vip服务'" :value="8"></el-option>
                            <el-option :label="'我要中检'" :value="9"></el-option>
                            <el-option :label="'保证金'" :value="1"></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item>
                        <el-button icon="search" @click="reData">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <!-- content -->
        <template>
            <el-table :data="dataList.content" border style="width: 100%" :height="autoHeight" v-loading="loading">
                <el-table-column prop="order.pkGlobalId" label="订单号" width="200"></el-table-column>
                <el-table-column prop="title" label="商品标题" min-width="200"></el-table-column>
                <el-table-column prop="categoryName" label="商品类型" min-width="100"></el-table-column>
                <el-table-column prop="price" label="商品价格" min-width="120"></el-table-column>
                <el-table-column prop="commissionPrice" label="佣金" min-width="120"></el-table-column>
                <el-table-column prop="fee" label="手续费" min-width="120">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].fee">
                            {{dataList.content[scope.$index].fee}}
                        </template>
                        <template v-else>
                            0.00
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="order.totalPrice" label="支付金额" min-width="120"></el-table-column>           
                <el-table-column prop="order.payType" label="支付方式" min-width="120">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].order">
                            <template v-if="dataList.content[scope.$index].order.payType=='1'">微信</template>
                            <template v-if="dataList.content[scope.$index].order.payType=='2'">支付宝</template>
                            <template v-if="dataList.content[scope.$index].order.payType=='3'">余额</template>
                            <template v-if="dataList.content[scope.$index].order.payType=='4'">银联</template>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="下单时间" width="180"></el-table-column>
                <el-table-column prop="order.principal.name" label="客服" min-width="120"></el-table-column>
                <el-table-column prop="identifyResult.identifierName" label="鉴定师" min-width="120">
                    <template slot-scope="scope" v-if="dataList.content[scope.$index].identifyResult">
                        {{dataList.content[scope.$index].identifyResult.identifierName}}
                    </template>
                </el-table-column>
                <el-table-column prop="identifyResult.isTrue" label="鉴定结果" min-width="120">
                    <template slot-scope="scope" v-if="dataList.content[scope.$index].identifyResult">
                        <template v-if="dataList.content[scope.$index].identifyResult.isTrue=='0'">通过</template>
                        <template v-if="dataList.content[scope.$index].identifyResult.isTrue=='1'">不通过</template>
                        <template v-if="dataList.content[scope.$index].identifyResult.isTrue=='-1'">不确定</template>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="订单状态" min-width="120">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].status=='0'">待付款</template>
                        <template v-if="dataList.content[scope.$index].status=='1'">卖家待发货</template>
                        <template v-if="dataList.content[scope.$index].status=='2'">平台待收货</template>
                        <template v-if="dataList.content[scope.$index].status=='3'">平台处理中</template>
                        <template v-if="dataList.content[scope.$index].status=='4'">平台待发货</template>
                        <template v-if="dataList.content[scope.$index].status=='5'">平台待退货</template>
                        <template v-if="dataList.content[scope.$index].status=='6'">买家待收货</template>
                        <template v-if="dataList.content[scope.$index].status=='7'">买家已收货</template>
                        <template v-if="dataList.content[scope.$index].status=='8'">卖家待收货</template>
                        <template v-if="dataList.content[scope.$index].status=='9'">卖家已收货</template>
                        <template v-if="dataList.content[scope.$index].status=='10'">已取消</template>
                        <template v-if="dataList.content[scope.$index].status=='11'">已退款</template>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="70">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click.native.prevent="showModify(scope.$index, dataList.content)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <div class="bottom-bar">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="dataList.totalElements"></el-pagination>
        </div>
        <!-- dialog -->
        <el-dialog title="编辑订单" :visible.sync="modifyState" size="large" :before-close="handleClose">

            <el-tabs type="border-card" v-model="activeName" @tab-click="changeTabs">
                <!-- the first tab -->
                <el-tab-pane label="基本信息" name="first">
                    <el-form label-width="120px">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="订单号" prop="">
                                    <el-input v-model="detail.order.pkGlobalId" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="商品价格" prop="">
                                    <el-input v-model="detail.price" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="订单金额" prop="">
                                    <el-input v-model="detail.order.totalPrice" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="支付状态" prop="">
                                    <el-input v-if="detail.order.status=='0'" value="未付款" disabled></el-input>
                                    <el-input v-if="detail.order.status=='1'" value="已付款" disabled></el-input>
                                    <el-input v-if="detail.order.status=='2'" value="已取消" disabled></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="鉴定方式" prop="">
                                    <el-input v-if="detail.identifyMethod=='0'" value="远程鉴定" disabled></el-input>
                                    <el-input v-if="detail.identifyMethod=='1'" value="中检鉴定" disabled></el-input>
                                    <el-input v-if="detail.identifyMethod=='2'" value="实物鉴定" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="鉴定价格" prop="">
                                    <el-input v-if="detail.price<20000" value="100" disabled></el-input>
                                    <el-input v-if="20000<=detail.price && detail.price<50000" value="200" disabled></el-input>
                                    <el-input v-if="50000<=detail.price" value="400" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="鉴定状态" prop="">
                                    <template v-if="detail.identifyRequest">
                                        <el-input v-if="detail.identifyRequest.identifyStatus=='0'" value="待鉴定" disabled></el-input>
                                        <el-input v-if="detail.identifyRequest.identifyStatus=='1'" value="已鉴定" disabled></el-input>
                                    </template>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="鉴定师" prop="">
                                    <template v-if="detail.identifyResult">
                                        <el-input v-model="detail.identifyResult.identifierName" disabled></el-input>
                                    </template>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="卖家名称" prop="">
                                    <el-input v-model="detail.sellUser.nickName" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="卖家电话" prop="">
                                    <el-input v-model="detail.sellUser.phone" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="学员" prop="">
                                    <el-input v-if="detail.sellUser.student" value="是" disabled></el-input>
                                    <el-input v-else value="否" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="平台至买家运费" prop="">
                                    <el-input v-if="usToBuy.exPrice" :value="usToBuy.exPrice" disabled></el-input>
                                    <el-input v-else value="暂无" disabled></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="买家名称" prop="">
                                    <el-input v-model="detail.buyUser.nickName" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="买家电话" prop="">
                                    <el-input v-model="detail.buyUser.phone" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="下单时间" prop="">
                                    <el-input v-model="detail.createTime" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="更新时间" prop="">
                                    <el-input v-model="detail.updateTime" disabled></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="结单金额" prop="">
                                    <el-input v-if="usToBuy.exPrice" :value="detail.price-exPrice-detail.commissionPrice-detail.order.fee" disabled></el-input>
                                    <el-input v-else :value="detail.price-detail.commissionPrice-detail.order.fee" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="手续费" prop="">
                                    <el-input v-model="detail.order.fee" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="佣金比例" prop="">
                                    <el-input :value="detail.commission+'‰'" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="佣金" prop="">
                                    <el-input v-model="detail.commissionPrice" disabled></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="支付方式" prop="">
                                    <el-input v-if="detail.order.payType=='0'" value="其他" disabled></el-input>
                                    <el-input v-if="detail.order.payType=='1'" value="微信" disabled></el-input>
                                    <el-input v-if="detail.order.payType=='2'" value="支付宝" disabled></el-input>
                                    <el-input v-if="detail.order.payType=='3'" value="余额" disabled></el-input>
                                    <el-input v-if="detail.order.payType=='4'" value="银联" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="收款状态" prop="">
                                    <el-input v-if="detail.order.collectStatus=='0'" value="未到账" disabled></el-input>
                                    <el-input v-if="detail.order.collectStatus=='1'" value="已到账" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="流水单号" prop="">
                                    <el-input v-model="detail.order.turnover" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="财务" prop="">
                                    <el-input v-if="detail.order.admin" :value="detail.order.admin.name" disabled></el-input>
                                    <el-input v-else value="暂无" disabled></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="操作状态" prop="">
                                    <el-select v-model="detailStatus" placeholder="请选择" style="width:100%">
                                        <el-option :label="'待付款'" :value="0"></el-option>
                                        <el-option :label="'卖家待发货'" :value="1"></el-option>
                                        <el-option :label="'平台待收货'" :value="2"></el-option>
                                        <el-option :label="'平台处理中'" :value="3"></el-option>
                                        <el-option :label="'平台待发货'" :value="4"></el-option>
                                        <el-option :label="'平台待退货'" :value="5"></el-option>
                                        <el-option :label="'买家待收货'" :value="6"></el-option>
                                        <el-option :label="'买家已收货'" :value="7"></el-option>
                                        <el-option :label="'卖家待收货'" :value="8"></el-option>
                                        <el-option :label="'卖家已收货'" :value="9"></el-option>
                                        <el-option :label="'已取消'" :value="10"></el-option>
                                        <el-option :label="'已退款'" :value="11"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label-width="12px">
                                    <el-button type="primary" @click="modifyStatus">提交</el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-tab-pane>
                <!-- the second tab -->
                <el-tab-pane label="商品信息" name="second">
                    <div style="overflow:hidden">
                        <div v-for="item in fileList"  style="width:200px;height:200px;float:left;margin-right:10px;background-size:cover;background-position:center" :style="{backgroundImage:'url('+thumb + item.fileId+')'}"></div>
                    </div>
                    <el-form label-width="120px">
                        <el-form-item label="商品名称">
                            <span>{{detail.title}}</span>
                        </el-form-item>
                        <el-form-item label="商品价格">
                            <span>{{detail.price}}</span>
                        </el-form-item>
                        <el-form-item label="商品类型">
                            <span>{{detail.categoryName}}</span>
                        </el-form-item>
                        <el-form-item label="商品品牌">
                            <span>{{detail.brandName}}</span>
                        </el-form-item>
                        <el-form-item label="商品型号">
                            <span>{{detail.sellGoods.typeName}}</span>
                        </el-form-item>
                        <el-form-item label="商品描述">
                            <span>{{detail.sellGoods.descript}}</span>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <!-- the third tab -->
                <el-tab-pane label="买家信息" name="third">
                    <el-form label-width="120px">
                        <el-form-item label="收货人">
                            <span>{{receiveAddr.receiverName}}</span>
                        </el-form-item>
                        <el-form-item label="电话">
                            <span>{{receiveAddr.receiverPhone}}</span>
                        </el-form-item>
                        <el-form-item label="邮编">
                            <span>{{receiveAddr.code}}</span>
                        </el-form-item>
                        <el-form-item label="收货地址">
                            <span>{{receiveAddr.province + receiveAddr.city + receiveAddr.town + receiveAddr.detailAddr}}</span>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <!-- the fourth tab -->
                <!-- detail.sellGoods.categoryId -->
                <el-tab-pane label="鉴定报告" name="fourth">

                    <!-- 表的打印表格 -->
                    <div id="print" v-if="detail.sellGoods.categoryId=='1'">
                        <h4 style="text-align:center;font-size:28px;padding:16px;">名表检验单</h4>
                        <table class="gridtable">
                            <tr>
                                <td rowspan="4" width="50">
                                    <div>基本信息</div>
                                </td>
                                <td width="100"><div>客户姓名</div></td>
                                <td width="100"><div v-if="isPrint"><input type="text" v-model="tableWatch.customerName"></div><div v-else>{{tableWatch.customerName}}&nbsp;</div></td>
                                <td width="80"><div>鉴定人</div></td>
                                <td><div v-if="isPrint"><input type="text" v-model="tableWatch.appraiser"></div><div v-else>{{tableWatch.appraiser}}&nbsp;</div></td>
                                <td width="80"><div>日期</div></td>
                                <td><div v-if="isPrint"><input type="text" v-model="tableWatch.identifyDate"></div><div v-else>{{tableWatch.identifyDate}}&nbsp;</div></td>
                            </tr>
                            <tr>
                                <td width="100"><div>品牌</div></td>
                                <td><div v-if="isPrint"><input type="text" v-model="tableWatch.brandName"></div><div v-else>{{tableWatch.brandName}}&nbsp;</div></td>
                                <td width="80"><div>系列</div></td>
                                <td><div v-if="isPrint"><input type="text" v-model="tableWatch.serialName"></div><div v-else>{{tableWatch.serialName}}&nbsp;</div></td>
                                <td width="80"><div>公价</div></td>
                                <td><div v-if="isPrint"><input type="text" v-model="tableWatch.publicPrice"></div><div v-else>{{tableWatch.publicPrice}}&nbsp;</div></td>
                            </tr>
                            <tr>
                                <td width="100"><div>款型</div></td>
                                <td colspan="2">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.style" :min="0" :max="3">
                                            <el-checkbox :label="'1'">男</el-checkbox>
                                            <el-checkbox :label="'2'">女</el-checkbox>
                                            <el-checkbox :label="'3'">中性</el-checkbox>
                                            <el-checkbox :label="'4'">怀表</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.style.indexOf('1') >= 0}">男</span>
                                        <span class="checkbox" :class="{ok:tableWatch.style.indexOf('2') >= 0}">女</span>
                                        <span class="checkbox" :class="{ok:tableWatch.style.indexOf('3') >= 0}">中性</span>
                                        <span class="checkbox" :class="{ok:tableWatch.style.indexOf('4') >= 0}">怀表</span>
                                    </div>
                                </td>
                                <td width="80"><div>包装</div></td>
                                <td colspan="2">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.packaging" :min="0">
                                            <el-checkbox :label="'1'">包装盒</el-checkbox>
                                            <el-checkbox :label="'2'">表卡</el-checkbox>
                                            <el-checkbox :label="'3'">证书</el-checkbox>
                                            <el-checkbox :label="'4'">保修</el-checkbox>
                                            <el-checkbox :label="'5'">使用说明</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.packaging.indexOf('1') >= 0}">包装盒</span>
                                        <span class="checkbox" :class="{ok:tableWatch.packaging.indexOf('2') >= 0}">表卡</span>
                                        <span class="checkbox" :class="{ok:tableWatch.packaging.indexOf('3') >= 0}">证书</span>
                                        <span class="checkbox" :class="{ok:tableWatch.packaging.indexOf('4') >= 0}">保修</span>
                                        <span class="checkbox" :class="{ok:tableWatch.packaging.indexOf('5') >= 0}">使用说明</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="100"><div>型号</div></td>
                                <td colspan="2">
                                    <div v-if="isPrint"><input type="text" v-model="tableWatch.typeName"></div><div v-else>{{tableWatch.typeName}}&nbsp;</div>
                                </td>
                                <td width="80"><div>来源</div></td>
                                <td colspan="2">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.source" :min="0" :max="3">
                                            <el-checkbox :label="'1'">发票</el-checkbox>
                                            <el-checkbox :label="'2'">销售凭证</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.source.indexOf('1') >= 0}">发票</span>
                                        <span class="checkbox" :class="{ok:tableWatch.source.indexOf('2') >= 0}">销售凭证</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td rowspan="26">
                                    <div>检测流程</div>
                                </td>
                                <td width="100" rowspan="19"><div>外观</div></td>
                                <td width="80"><div>表壳痕迹</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.watchcaseTraces" :min="0">
                                            <el-checkbox :label="'1'">轻微划痕</el-checkbox>
                                            <el-checkbox :label="'2'">明显划痕</el-checkbox>
                                            <el-checkbox :label="'3'">坑点痕迹</el-checkbox>
                                            <el-checkbox :label="'4'">打磨痕迹</el-checkbox>
                                            <el-checkbox :label="'5'">明显损伤</el-checkbox>
                                            <el-checkbox :label="'6'">表壳不完整</el-checkbox>
                                            <el-checkbox :label="'7'">完好</el-checkbox>
                                            <el-checkbox :label="'8'">其他</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.watchcaseTraces.indexOf('1') >= 0}">轻微划痕</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchcaseTraces.indexOf('2') >= 0}">明显划痕</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchcaseTraces.indexOf('3') >= 0}">坑点痕迹</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchcaseTraces.indexOf('4') >= 0}">打磨痕迹</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchcaseTraces.indexOf('5') >= 0}">明显损伤</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchcaseTraces.indexOf('6') >= 0}">表壳不完整</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchcaseTraces.indexOf('7') >= 0}">完好</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchcaseTraces.indexOf('8') >= 0}">其他</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>表壳形状</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.watchcaseShape" :min="0">
                                            <el-checkbox :label="'1'">圆形</el-checkbox>
                                            <el-checkbox :label="'2'">酒桶形</el-checkbox>
                                            <el-checkbox :label="'3'">方形</el-checkbox>
                                            <el-checkbox :label="'4'">椭圆形</el-checkbox>
                                            <el-checkbox :label="'5'">花形</el-checkbox>
                                            <el-checkbox :label="'6'">其他</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.watchcaseShape.indexOf('1') >= 0}">圆形</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchcaseShape.indexOf('2') >= 0}">酒桶形</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchcaseShape.indexOf('3') >= 0}">方形</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchcaseShape.indexOf('4') >= 0}">椭圆形</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchcaseShape.indexOf('5') >= 0}">花形</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchcaseShape.indexOf('6') >= 0}">其他</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>材质</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.material" :min="0">
                                            <el-checkbox :label="'1'">钢</el-checkbox>
                                            <el-checkbox :label="'2'">钢及金</el-checkbox>
                                            <el-checkbox :label="'3'">18K白金</el-checkbox>
                                            <el-checkbox :label="'4'">18K玫瑰金</el-checkbox>
                                            <el-checkbox :label="'5'">18K黄金</el-checkbox>
                                            <el-checkbox :label="'6'">铂金</el-checkbox>
                                            <el-checkbox :label="'7'">陶瓷</el-checkbox>
                                            <el-checkbox :label="'8'">其他材质</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.material.indexOf('1') >= 0}">钢</span>
                                        <span class="checkbox" :class="{ok:tableWatch.material.indexOf('2') >= 0}">钢及金</span>
                                        <span class="checkbox" :class="{ok:tableWatch.material.indexOf('3') >= 0}">18K白金</span>
                                        <span class="checkbox" :class="{ok:tableWatch.material.indexOf('4') >= 0}">18K玫瑰金</span>
                                        <span class="checkbox" :class="{ok:tableWatch.material.indexOf('5') >= 0}">18K黄金</span>
                                        <span class="checkbox" :class="{ok:tableWatch.material.indexOf('6') >= 0}">铂金</span>
                                        <span class="checkbox" :class="{ok:tableWatch.material.indexOf('7') >= 0}">陶瓷</span>
                                        <span class="checkbox" :class="{ok:tableWatch.material.indexOf('8') >= 0}">其他材质</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>表径</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.watchDiameter" :min="0">
                                            <el-checkbox :label="'1'">22</el-checkbox>
                                            <el-checkbox :label="'2'">26</el-checkbox>
                                            <el-checkbox :label="'3'">28</el-checkbox>
                                            <el-checkbox :label="'4'">30</el-checkbox>
                                            <el-checkbox :label="'5'">34</el-checkbox>
                                            <el-checkbox :label="'6'">36</el-checkbox>
                                            <el-checkbox :label="'7'">38</el-checkbox>
                                            <el-checkbox :label="'8'">40</el-checkbox>
                                            <el-checkbox :label="'9'">42</el-checkbox>
                                            <el-checkbox :label="'10'">43</el-checkbox>
                                            <el-checkbox :label="'11'">45</el-checkbox>
                                            <el-checkbox :label="'12'">45以上</el-checkbox>
                                            <el-checkbox :label="'13'">其他</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.watchDiameter.indexOf('1') >= 0}">22</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchDiameter.indexOf('2') >= 0}">26</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchDiameter.indexOf('3') >= 0}">28</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchDiameter.indexOf('4') >= 0}">30</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchDiameter.indexOf('5') >= 0}">34</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchDiameter.indexOf('6') >= 0}">36</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchDiameter.indexOf('7') >= 0}">38</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchDiameter.indexOf('8') >= 0}">40</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchDiameter.indexOf('9') >= 0}">42</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchDiameter.indexOf('10') >= 0}">43</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchDiameter.indexOf('11') >= 0}">45</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchDiameter.indexOf('12') >= 0}">45以上</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchDiameter.indexOf('13') >= 0}">其他</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>表盘</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.watchDial" :min="0">
                                            <el-checkbox :label="'1'">划痕</el-checkbox>
                                            <el-checkbox :label="'2'">污渍</el-checkbox>
                                            <el-checkbox :label="'3'">水迹</el-checkbox>
                                            <el-checkbox :label="'4'">泥点</el-checkbox>
                                            <el-checkbox :label="'5'">完好</el-checkbox>
                                            <el-checkbox :label="'6'">其他</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.watchDial.indexOf('1') >= 0}">划痕</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchDial.indexOf('2') >= 0}">污渍</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchDial.indexOf('3') >= 0}">水迹</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchDial.indexOf('4') >= 0}">泥点</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchDial.indexOf('5') >= 0}">完好</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchDial.indexOf('6') >= 0}">其他</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>刻度</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.scale" :min="0">
                                            <el-checkbox :label="'1'">缺损</el-checkbox>
                                            <el-checkbox :label="'2'">污渍</el-checkbox>
                                            <el-checkbox :label="'3'">无荧光</el-checkbox>
                                            <el-checkbox :label="'4'">脱落</el-checkbox>
                                            <el-checkbox :label="'5'">遮掩</el-checkbox>
                                            <el-checkbox :label="'6'">非钻石</el-checkbox>
                                            <el-checkbox :label="'7'">完好</el-checkbox>
                                            <el-checkbox :label="'8'">其他</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.scale.indexOf('1') >= 0}">缺损</span>
                                        <span class="checkbox" :class="{ok:tableWatch.scale.indexOf('2') >= 0}">污渍</span>
                                        <span class="checkbox" :class="{ok:tableWatch.scale.indexOf('3') >= 0}">无荧光</span>
                                        <span class="checkbox" :class="{ok:tableWatch.scale.indexOf('4') >= 0}">脱落</span>
                                        <span class="checkbox" :class="{ok:tableWatch.scale.indexOf('5') >= 0}">遮掩</span>
                                        <span class="checkbox" :class="{ok:tableWatch.scale.indexOf('6') >= 0}">非钻石</span>
                                        <span class="checkbox" :class="{ok:tableWatch.scale.indexOf('7') >= 0}">完好</span>
                                        <span class="checkbox" :class="{ok:tableWatch.scale.indexOf('8') >= 0}">其他</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>表针</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.watchNeedle" :min="0">
                                            <el-checkbox :label="'1'">蓝钢</el-checkbox>
                                            <el-checkbox :label="'2'">K金</el-checkbox>
                                            <el-checkbox :label="'3'">合金</el-checkbox>
                                            <el-checkbox :label="'4'">划痕</el-checkbox>
                                            <el-checkbox :label="'5'">毛碴</el-checkbox>
                                            <el-checkbox :label="'6'">完好</el-checkbox>
                                            <el-checkbox :label="'7'">其他</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.watchNeedle.indexOf('1') >= 0}">蓝钢</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchNeedle.indexOf('2') >= 0}">K金</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchNeedle.indexOf('3') >= 0}">合金</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchNeedle.indexOf('4') >= 0}">划痕</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchNeedle.indexOf('5') >= 0}">毛碴</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchNeedle.indexOf('6') >= 0}">完好</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchNeedle.indexOf('7') >= 0}">其他</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>日历</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.calendar" :min="0">
                                            <el-checkbox :label="'1'">边框毛碴</el-checkbox>
                                            <el-checkbox :label="'2'">轮盘坏</el-checkbox>
                                            <el-checkbox :label="'3'">位置不正</el-checkbox>
                                            <el-checkbox :label="'4'">完好</el-checkbox>
                                            <el-checkbox :label="'5'">其他</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.calendar.indexOf('1') >= 0}">边框毛碴</span>
                                        <span class="checkbox" :class="{ok:tableWatch.calendar.indexOf('2') >= 0}">轮盘坏</span>
                                        <span class="checkbox" :class="{ok:tableWatch.calendar.indexOf('3') >= 0}">位置不正</span>
                                        <span class="checkbox" :class="{ok:tableWatch.calendar.indexOf('4') >= 0}">完好</span>
                                        <span class="checkbox" :class="{ok:tableWatch.calendar.indexOf('5') >= 0}">其他</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>小表盘</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.watchSmallDial" :min="0">
                                            <el-checkbox :label="'1'">运转不灵</el-checkbox>
                                            <el-checkbox :label="'2'">掉针</el-checkbox>
                                            <el-checkbox :label="'3'">完好</el-checkbox>
                                            <el-checkbox :label="'4'">其他</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.watchSmallDial.indexOf('1') >= 0}">运转不灵</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchSmallDial.indexOf('2') >= 0}">掉针</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchSmallDial.indexOf('3') >= 0}">完好</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchSmallDial.indexOf('4') >= 0}">其他</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>表镜</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.watchMirror" :min="0">
                                            <el-checkbox :label="'1'">蓝宝石</el-checkbox>
                                            <el-checkbox :label="'2'">玻璃</el-checkbox>
                                            <el-checkbox :label="'3'">亚克力</el-checkbox>
                                            <el-checkbox :label="'4'">磨损</el-checkbox>
                                            <el-checkbox :label="'5'">划痕</el-checkbox>
                                            <el-checkbox :label="'6'">磕边</el-checkbox>
                                            <el-checkbox :label="'7'">后换表镜</el-checkbox>
                                            <el-checkbox :label="'8'">变形</el-checkbox>
                                            <el-checkbox :label="'9'">完好</el-checkbox>
                                            <el-checkbox :label="'10'">其他</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.watchMirror.indexOf('1') >= 0}">蓝宝石</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchMirror.indexOf('2') >= 0}">玻璃</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchMirror.indexOf('3') >= 0}">亚克力</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchMirror.indexOf('4') >= 0}">磨损</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchMirror.indexOf('5') >= 0}">划痕</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchMirror.indexOf('6') >= 0}">磕边</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchMirror.indexOf('7') >= 0}">后换表镜</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchMirror.indexOf('8') >= 0}">变形</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchMirror.indexOf('9') >= 0}">完好</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchMirror.indexOf('10') >= 0}">其他</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>表把</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.watchCrown" :min="0">
                                            <el-checkbox :label="'1'">磨损严重</el-checkbox>
                                            <el-checkbox :label="'2'">印字不清</el-checkbox>
                                            <el-checkbox :label="'3'">脱落</el-checkbox>
                                            <el-checkbox :label="'4'">失灵</el-checkbox>
                                            <el-checkbox :label="'5'">转送松动</el-checkbox>
                                            <el-checkbox :label="'6'">转动过紧</el-checkbox>
                                            <el-checkbox :label="'7'">完好</el-checkbox>
                                            <el-checkbox :label="'8'">其他</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.watchCrown.indexOf('1') >= 0}">磨损严重</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchCrown.indexOf('2') >= 0}">印字不清</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchCrown.indexOf('3') >= 0}">脱落</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchCrown.indexOf('4') >= 0}">失灵</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchCrown.indexOf('5') >= 0}">转送松动</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchCrown.indexOf('6') >= 0}">转动过紧</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchCrown.indexOf('7') >= 0}">完好</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchCrown.indexOf('8') >= 0}">其他</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>钻刻</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.diamond" :min="0">
                                            <el-checkbox :label="'1'">原镶钻</el-checkbox>
                                            <el-checkbox :label="'2'">后镶钻</el-checkbox>
                                            <el-checkbox :label="'3'">无钻</el-checkbox>
                                            <el-checkbox :label="'4'">其他</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.diamond.indexOf('1') >= 0}">原镶钻</span>
                                        <span class="checkbox" :class="{ok:tableWatch.diamond.indexOf('2') >= 0}">后镶钻</span>
                                        <span class="checkbox" :class="{ok:tableWatch.diamond.indexOf('3') >= 0}">无钻</span>
                                        <span class="checkbox" :class="{ok:tableWatch.diamond.indexOf('4') >= 0}">其他</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>后盖</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.rearCover" :min="0">
                                            <el-checkbox :label="'1'">螺丝后盖</el-checkbox>
                                            <el-checkbox :label="'2'">旋转后盖</el-checkbox>
                                            <el-checkbox :label="'3'">撬盖</el-checkbox>
                                            <el-checkbox :label="'4'">背透</el-checkbox>
                                            <el-checkbox :label="'5'">划痕</el-checkbox>
                                            <el-checkbox :label="'6'">印记不清</el-checkbox>
                                            <el-checkbox :label="'7'">壳子毛糙</el-checkbox>
                                            <el-checkbox :label="'8'">完好</el-checkbox>
                                            <el-checkbox :label="'9'">其他</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.rearCover.indexOf('1') >= 0}">螺丝后盖</span>
                                        <span class="checkbox" :class="{ok:tableWatch.rearCover.indexOf('2') >= 0}">旋转后盖</span>
                                        <span class="checkbox" :class="{ok:tableWatch.rearCover.indexOf('3') >= 0}">撬盖</span>
                                        <span class="checkbox" :class="{ok:tableWatch.rearCover.indexOf('4') >= 0}">背透</span>
                                        <span class="checkbox" :class="{ok:tableWatch.rearCover.indexOf('5') >= 0}">划痕</span>
                                        <span class="checkbox" :class="{ok:tableWatch.rearCover.indexOf('6') >= 0}">印记不清</span>
                                        <span class="checkbox" :class="{ok:tableWatch.rearCover.indexOf('7') >= 0}">壳子毛糙</span>
                                        <span class="checkbox" :class="{ok:tableWatch.rearCover.indexOf('8') >= 0}">完好</span>
                                        <span class="checkbox" :class="{ok:tableWatch.rearCover.indexOf('9') >= 0}">其他</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>表耳</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.watchEar" :min="0">
                                            <el-checkbox :label="'1'">表耳刻字</el-checkbox>
                                            <el-checkbox :label="'2'">表耳印记</el-checkbox>
                                            <el-checkbox :label="'3'">磨损</el-checkbox>
                                            <el-checkbox :label="'4'">缺损</el-checkbox>
                                            <el-checkbox :label="'5'">完好</el-checkbox>
                                            <el-checkbox :label="'6'">其他</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.watchEar.indexOf('1') >= 0}">表耳刻字</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchEar.indexOf('2') >= 0}">表耳印记</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchEar.indexOf('3') >= 0}">磨损</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchEar.indexOf('4') >= 0}">缺损</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchEar.indexOf('5') >= 0}">完好</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchEar.indexOf('6') >= 0}">其他</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>表带材质</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.strapMaterial" :min="0">
                                            <el-checkbox :label="'1'">钢</el-checkbox>
                                            <el-checkbox :label="'2'">钢及金</el-checkbox>
                                            <el-checkbox :label="'3'">18K白金</el-checkbox>
                                            <el-checkbox :label="'4'">18K玫瑰金</el-checkbox>
                                            <el-checkbox :label="'5'">18K黄金</el-checkbox>
                                            <el-checkbox :label="'6'">铂金</el-checkbox>
                                            <el-checkbox :label="'7'">陶瓷</el-checkbox>
                                            <el-checkbox :label="'8'">其他材质</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.strapMaterial.indexOf('1') >= 0}">钢</span>
                                        <span class="checkbox" :class="{ok:tableWatch.strapMaterial.indexOf('2') >= 0}">钢及金</span>
                                        <span class="checkbox" :class="{ok:tableWatch.strapMaterial.indexOf('3') >= 0}">18K白金</span>
                                        <span class="checkbox" :class="{ok:tableWatch.strapMaterial.indexOf('4') >= 0}">18K玫瑰金</span>
                                        <span class="checkbox" :class="{ok:tableWatch.strapMaterial.indexOf('5') >= 0}">18K黄金</span>
                                        <span class="checkbox" :class="{ok:tableWatch.strapMaterial.indexOf('6') >= 0}">铂金</span>
                                        <span class="checkbox" :class="{ok:tableWatch.strapMaterial.indexOf('7') >= 0}">陶瓷</span>
                                        <span class="checkbox" :class="{ok:tableWatch.strapMaterial.indexOf('8') >= 0}">其他材质</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>金属表带</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.metalStrap" :min="0">
                                            <el-checkbox :label="'1'">松懈</el-checkbox>
                                            <el-checkbox :label="'2'">划痕</el-checkbox>
                                            <el-checkbox :label="'3'">磨损严重</el-checkbox>
                                            <el-checkbox :label="'4'">缺少螺丝</el-checkbox>
                                            <el-checkbox :label="'5'">脱扣</el-checkbox>
                                            <div style="display:inline-block;margin:0 16px;">表带节数<div style="display:inline-block;width:40px;border-bottom:1px solid #666;margin-left:10px;"><input type="text" name="" v-model="tableWatch.strapNumber"></div></div>
                                            <el-checkbox :label="'7'">完好</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.metalStrap.indexOf('1') >= 0}">松懈</span>
                                        <span class="checkbox" :class="{ok:tableWatch.metalStrap.indexOf('2') >= 0}">划痕</span>
                                        <span class="checkbox" :class="{ok:tableWatch.metalStrap.indexOf('3') >= 0}">磨损严重</span>
                                        <span class="checkbox" :class="{ok:tableWatch.metalStrap.indexOf('4') >= 0}">缺少螺丝</span>
                                        <span class="checkbox" :class="{ok:tableWatch.metalStrap.indexOf('5') >= 0}">脱扣</span>
                                        <div style="display:inline-block;margin-right:16px;">表带节数 {{tableWatch.strapNumber}}</div>
                                        <span class="checkbox" :class="{ok:tableWatch.metalStrap.indexOf('7') >= 0}">完好</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>皮质表带</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.cortexStrap" :min="0">
                                            <el-checkbox :label="'1'">旧</el-checkbox>
                                            <el-checkbox :label="'2'">有异味</el-checkbox>
                                            <el-checkbox :label="'3'">开线</el-checkbox>
                                            <el-checkbox :label="'4'">腐烂</el-checkbox>
                                            <el-checkbox :label="'5'">完好</el-checkbox>
                                            <el-checkbox :label="'6'">其他</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.cortexStrap.indexOf('1') >= 0}">旧</span>
                                        <span class="checkbox" :class="{ok:tableWatch.cortexStrap.indexOf('2') >= 0}">有异味</span>
                                        <span class="checkbox" :class="{ok:tableWatch.cortexStrap.indexOf('3') >= 0}">开线</span>
                                        <span class="checkbox" :class="{ok:tableWatch.cortexStrap.indexOf('4') >= 0}">腐烂</span>
                                        <span class="checkbox" :class="{ok:tableWatch.cortexStrap.indexOf('5') >= 0}">完好</span>
                                        <span class="checkbox" :class="{ok:tableWatch.cortexStrap.indexOf('6') >= 0}">其他</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>表扣</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.watchButton" :min="0">
                                            <el-checkbox :label="'1'">蝴蝶扣</el-checkbox>
                                            <el-checkbox :label="'2'">针扣</el-checkbox>
                                            <el-checkbox :label="'3'">折叠扣</el-checkbox>
                                            <el-checkbox :label="'4'">划痕</el-checkbox>
                                            <el-checkbox :label="'5'">磨损严重</el-checkbox>
                                            <el-checkbox :label="'6'">刻字不清</el-checkbox>
                                            <el-checkbox :label="'7'">印记模糊</el-checkbox>
                                            <el-checkbox :label="'8'">其他</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.watchButton.indexOf('1') >= 0}">蝴蝶扣</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchButton.indexOf('2') >= 0}">针扣</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchButton.indexOf('3') >= 0}">折叠扣</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchButton.indexOf('4') >= 0}">划痕</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchButton.indexOf('5') >= 0}">磨损严重</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchButton.indexOf('6') >= 0}">刻字不清</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchButton.indexOf('7') >= 0}">印记模糊</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchButton.indexOf('8') >= 0}">其他</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>螺丝</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.screw" :min="0">
                                            <el-checkbox :label="'1'">缺少螺丝</el-checkbox>
                                            <el-checkbox :label="'2'">有划痕</el-checkbox>
                                            <el-checkbox :label="'3'">断裂</el-checkbox>
                                            <el-checkbox :label="'4'">完好</el-checkbox>
                                            <el-checkbox :label="'5'">其他</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.screw.indexOf('1') >= 0}">缺少螺丝</span>
                                        <span class="checkbox" :class="{ok:tableWatch.screw.indexOf('2') >= 0}">有划痕</span>
                                        <span class="checkbox" :class="{ok:tableWatch.screw.indexOf('3') >= 0}">断裂</span>
                                        <span class="checkbox" :class="{ok:tableWatch.screw.indexOf('4') >= 0}">完好</span>
                                        <span class="checkbox" :class="{ok:tableWatch.screw.indexOf('5') >= 0}">其他</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="100" rowspan="5"><div>机芯</div></td>
                                <td width="80"><div>打磨</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.polish" :min="0">
                                            <el-checkbox :label="'1'">粗糙</el-checkbox>
                                            <el-checkbox :label="'2'">精细</el-checkbox>
                                            <el-checkbox :label="'3'">其他</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.polish.indexOf('1') >= 0}">粗糙</span>
                                        <span class="checkbox" :class="{ok:tableWatch.polish.indexOf('2') >= 0}">精细</span>
                                        <span class="checkbox" :class="{ok:tableWatch.polish.indexOf('3') >= 0}">其他</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>刻字</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.lettering" :min="0">
                                            <el-checkbox :label="'1'">粗糙</el-checkbox>
                                            <el-checkbox :label="'2'">精细</el-checkbox>
                                            <el-checkbox :label="'3'">其他</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.lettering.indexOf('1') >= 0}">粗糙</span>
                                        <span class="checkbox" :class="{ok:tableWatch.lettering.indexOf('2') >= 0}">精细</span>
                                        <span class="checkbox" :class="{ok:tableWatch.lettering.indexOf('3') >= 0}">其他</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>螺丝</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.movementScrew" :min="0">
                                            <el-checkbox :label="'1'">蓝钢螺丝</el-checkbox>
                                            <el-checkbox :label="'2'">普通螺丝</el-checkbox>
                                            <el-checkbox :label="'3'">缺少螺丝</el-checkbox>
                                            <el-checkbox :label="'4'">有划痕</el-checkbox>
                                            <el-checkbox :label="'5'">断裂</el-checkbox>
                                            <el-checkbox :label="'6'">其他</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.movementScrew.indexOf('1') >= 0}">蓝钢螺丝</span>
                                        <span class="checkbox" :class="{ok:tableWatch.movementScrew.indexOf('2') >= 0}">普通螺丝</span>
                                        <span class="checkbox" :class="{ok:tableWatch.movementScrew.indexOf('3') >= 0}">缺少螺丝</span>
                                        <span class="checkbox" :class="{ok:tableWatch.movementScrew.indexOf('4') >= 0}">有划痕</span>
                                        <span class="checkbox" :class="{ok:tableWatch.movementScrew.indexOf('5') >= 0}">断裂</span>
                                        <span class="checkbox" :class="{ok:tableWatch.movementScrew.indexOf('6') >= 0}">其他</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>自动陀</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.rotor" :min="0">
                                            <el-checkbox :label="'1'">中心陀</el-checkbox>
                                            <el-checkbox :label="'2'">偏心陀</el-checkbox>
                                            <el-checkbox :label="'3'">松动</el-checkbox>
                                            <el-checkbox :label="'4'">磨边</el-checkbox>
                                            <el-checkbox :label="'5'">卡死</el-checkbox>
                                            <el-checkbox :label="'6'">运转不畅</el-checkbox>
                                            <el-checkbox :label="'7'">其他</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.rotor.indexOf('1') >= 0}">中心陀</span>
                                        <span class="checkbox" :class="{ok:tableWatch.rotor.indexOf('2') >= 0}">偏心陀</span>
                                        <span class="checkbox" :class="{ok:tableWatch.rotor.indexOf('3') >= 0}">松动</span>
                                        <span class="checkbox" :class="{ok:tableWatch.rotor.indexOf('4') >= 0}">磨边</span>
                                        <span class="checkbox" :class="{ok:tableWatch.rotor.indexOf('5') >= 0}">卡死</span>
                                        <span class="checkbox" :class="{ok:tableWatch.rotor.indexOf('6') >= 0}">运转不畅</span>
                                        <span class="checkbox" :class="{ok:tableWatch.rotor.indexOf('7') >= 0}">其他</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>固定圈</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.retainerRing" :min="0">
                                            <el-checkbox :label="'1'">钢圈</el-checkbox>
                                            <el-checkbox :label="'2'">塑料圈</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.retainerRing.indexOf('1') >= 0}">钢圈</span>
                                        <span class="checkbox" :class="{ok:tableWatch.retainerRing.indexOf('2') >= 0}">塑料圈</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="100"><div>功能</div></td>
                                <td colspan="5">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.func" :min="0">
                                            <el-checkbox :label="'1'">大三针</el-checkbox>
                                            <el-checkbox :label="'2'">日历</el-checkbox>
                                            <el-checkbox :label="'3'">小三针</el-checkbox>
                                            <el-checkbox :label="'4'">双历</el-checkbox>
                                            <el-checkbox :label="'5'">计时</el-checkbox>
                                            <el-checkbox :label="'6'">动储</el-checkbox>
                                            <el-checkbox :label="'7'">飞返</el-checkbox>
                                            <el-checkbox :label="'8'">月相</el-checkbox>
                                            <el-checkbox :label="'9'">年历</el-checkbox>
                                            <el-checkbox :label="'10'">万年历</el-checkbox>
                                            <el-checkbox :label="'11'">两地时</el-checkbox>
                                            <el-checkbox :label="'12'">潜水</el-checkbox>
                                            <el-checkbox :label="'13'">追针</el-checkbox>
                                            <el-checkbox :label="'14'">陀飞轮</el-checkbox>
                                            <el-checkbox :label="'15'">其他</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.func.indexOf('1') >= 0}">大三针</span>
                                        <span class="checkbox" :class="{ok:tableWatch.func.indexOf('2') >= 0}">日历</span>
                                        <span class="checkbox" :class="{ok:tableWatch.func.indexOf('3') >= 0}">小三针</span>
                                        <span class="checkbox" :class="{ok:tableWatch.func.indexOf('4') >= 0}">双历</span>
                                        <span class="checkbox" :class="{ok:tableWatch.func.indexOf('5') >= 0}">计时</span>
                                        <span class="checkbox" :class="{ok:tableWatch.func.indexOf('6') >= 0}">动储</span>
                                        <span class="checkbox" :class="{ok:tableWatch.func.indexOf('7') >= 0}">飞返</span>
                                        <span class="checkbox" :class="{ok:tableWatch.func.indexOf('8') >= 0}">月相</span>
                                        <span class="checkbox" :class="{ok:tableWatch.func.indexOf('9') >= 0}">年历</span>
                                        <span class="checkbox" :class="{ok:tableWatch.func.indexOf('10') >= 0}">万年历</span>
                                        <span class="checkbox" :class="{ok:tableWatch.func.indexOf('11') >= 0}">两地时</span>
                                        <span class="checkbox" :class="{ok:tableWatch.func.indexOf('12') >= 0}">潜水</span>
                                        <span class="checkbox" :class="{ok:tableWatch.func.indexOf('13') >= 0}">追针</span>
                                        <span class="checkbox" :class="{ok:tableWatch.func.indexOf('14') >= 0}">陀飞轮</span>
                                        <span class="checkbox" :class="{ok:tableWatch.func.indexOf('15') >= 0}">其他</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="100"><div>校表仪</div></td>
                                <td colspan="5">
                                    <div v-if="isPrint">
                                        <div style="display:inline-block;margin:0 16px;">日差<div style="display:inline-block;width:60px;border-bottom:1px solid #666;margin-left:10px;"><input type="text" name="" v-model="tableWatch.dailyDifference"></div></div>
                                        <div style="display:inline-block;margin:0 16px;">摆幅<div style="display:inline-block;width:60px;border-bottom:1px solid #666;margin-left:10px;"><input type="text" name="" v-model="tableWatch.swing"></div></div>
                                        <div style="display:inline-block;margin:0 16px;">偏振<div style="display:inline-block;width:60px;border-bottom:1px solid #666;margin-left:10px;"><input type="text" name="" v-model="tableWatch.polarization"></div></div>
                                        <div style="display:inline-block;margin:0 16px;">参数<div style="display:inline-block;width:60px;border-bottom:1px solid #666;margin-left:10px;"><input type="text" name="" v-model="tableWatch.parameter"></div></div>
                                    </div>
                                    <div v-else>
                                        日差 {{tableWatch.dailyDifference}} &nbsp; 摆幅 {{tableWatch.swing}} &nbsp; 偏振 {{tableWatch.polarization}} &nbsp; 参数 {{tableWatch.parameter}}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="50">
                                    <div>鉴定结论</div>
                                </td>
                                <td colspan="6"><div v-if="isPrint"><input type="text" v-model="tableWatch.conclusion"></div><div v-else>{{tableWatch.conclusion}}&nbsp;</div></td>
                            </tr>
                        </table>
                        <div style="text-align:right;padding:30px 0 0 0;">鉴定师签名：____________</div>
                    </div>
                    <!-- 包的打印表格 -->
                    <div id="print" v-if="detail.sellGoods.categoryId=='2'">
                        <h4 style="text-align:center;font-size:28px;padding:16px;">名品检验单</h4>
                        <table class="gridtable">
                            <tr>
                                <td rowspan="4" width="50">
                                    <div>基本信息</div>
                                </td>
                                <td width="100"><div>客户姓名</div></td>
                                <td width="130"><div v-if="isPrint"><input type="text" v-model="tableBag.customerName"></div><div v-else>{{tableBag.customerName}}&nbsp;</div></td>
                                <td width="100"><div>鉴定人</div></td>
                                <td width="100"><div v-if="isPrint"><input type="text" v-model="tableBag.appraiser"></div><div v-else>{{tableBag.appraiser}}&nbsp;</div></td>
                                <td width="100"><div>日期</div></td>
                                <td><div v-if="isPrint"><input type="text" v-model="tableBag.identifyDate"></div><div v-else>{{tableBag.identifyDate}}&nbsp;</div></td>
                            </tr>
                            <tr>
                                <td width="100"><div>品牌</div></td>
                                <td><div v-if="isPrint"><input type="text" v-model="tableBag.brandName"></div><div v-else>{{tableBag.brandName}}&nbsp;</div></td>
                                <td width="80"><div>系列</div></td>
                                <td><div v-if="isPrint"><input type="text" v-model="tableBag.serialName"></div><div v-else>{{tableBag.serialName}}&nbsp;</div></td>
                                <td width="80"><div>公价</div></td>
                                <td><div v-if="isPrint"><input type="text" v-model="tableBag.publicPrice"></div><div v-else>{{tableBag.publicPrice}}&nbsp;</div></td>
                            </tr>
                            <tr>
                                <td width="100"><div>款型</div></td>
                                <td colspan="2">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableBag.style" :min="0" :max="3">
                                            <el-checkbox :label="'1'">男</el-checkbox>
                                            <el-checkbox :label="'2'">女</el-checkbox>
                                            <el-checkbox :label="'3'">中性</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableBag.style.indexOf('1') >= 0}">男</span>
                                        <span class="checkbox" :class="{ok:tableBag.style.indexOf('2') >= 0}">女</span>
                                        <span class="checkbox" :class="{ok:tableBag.style.indexOf('3') >= 0}">中性</span>
                                    </div>
                                </td>
                                <td width="80"><div>包装</div></td>
                                <td colspan="2">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableBag.packaging" :min="0">
                                            <el-checkbox :label="'1'">盒子</el-checkbox>
                                            <el-checkbox :label="'2'">发票</el-checkbox>
                                            <el-checkbox :label="'3'">防尘袋</el-checkbox>
                                            <el-checkbox :label="'4'">保修卡</el-checkbox>
                                            <el-checkbox :label="'5'">说明书</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableBag.packaging.indexOf('1') >= 0}">盒子</span>
                                        <span class="checkbox" :class="{ok:tableBag.packaging.indexOf('2') >= 0}">发票</span>
                                        <span class="checkbox" :class="{ok:tableBag.packaging.indexOf('3') >= 0}">防尘袋</span>
                                        <span class="checkbox" :class="{ok:tableBag.packaging.indexOf('4') >= 0}">保修卡</span>
                                        <span class="checkbox" :class="{ok:tableBag.packaging.indexOf('5') >= 0}">说明书</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="100"><div>型号</div></td>
                                <td><div v-if="isPrint"><input type="text" v-model="tableBag.typeName"></div><div v-else>{{tableBag.typeName}}&nbsp;</div></td>
                                <td width="80"><div>编码</div></td>
                                <td><div v-if="isPrint"><input type="text" v-model="tableBag.code"></div><div v-else>{{tableBag.code}}&nbsp;</div></td>
                                <td width="80"><div>来源</div></td>
                                <td>
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableBag.source" :min="0">
                                            <el-checkbox :label="'1'">专柜</el-checkbox>
                                            <el-checkbox :label="'2'">其他</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableBag.source.indexOf('1') >= 0}">专柜</span>
                                        <span class="checkbox" :class="{ok:tableBag.source.indexOf('2') >= 0}">其他</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td rowspan="21">
                                    <div>检测流程</div>
                                </td>
                                <td width="100" rowspan="5"><div>皮质</div></td>
                                <td width="80"><div>logo</div></td>
                                <td colspan="4"  align="right">
                                    <div v-if="isPrint">
                                        <input type="text" v-model="tableBag.cortexLogoT">
                                        <el-checkbox-group v-model="tableBag.cortexLogo" :min="0">
                                            <el-checkbox :label="'1'">符合正品</el-checkbox>
                                            <el-checkbox :label="'2'">不符合正品</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span>{{tableBag.cortexLogoT}}</span>
                                        <span class="checkbox" :class="{ok:tableBag.cortexLogo.indexOf('1') >= 0}">符合正品</span>
                                        <span class="checkbox" :class="{ok:tableBag.cortexLogo.indexOf('2') >= 0}">不符合正品</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>印花</div></td>
                                <td colspan="4"  align="right">
                                    <div v-if="isPrint">
                                        <input type="text" v-model="tableBag.cortexPrintT">
                                        <el-checkbox-group v-model="tableBag.cortexPrint" :min="0">
                                            <el-checkbox :label="'1'">符合正品</el-checkbox>
                                            <el-checkbox :label="'2'">不符合正品</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span>{{tableBag.cortexPrintT}}</span>
                                        <span class="checkbox" :class="{ok:tableBag.cortexPrint.indexOf('1') >= 0}">符合正品</span>
                                        <span class="checkbox" :class="{ok:tableBag.cortexPrint.indexOf('2') >= 0}">不符合正品</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>油边</div></td>
                                <td colspan="4"  align="right">
                                    <div v-if="isPrint">
                                        <input type="text" v-model="tableBag.cortexPaintT">
                                        <el-checkbox-group v-model="tableBag.cortexPaint" :min="0">
                                            <el-checkbox :label="'1'">符合正品</el-checkbox>
                                            <el-checkbox :label="'2'">不符合正品</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span>{{tableBag.cortexPaintT}}</span>
                                        <span class="checkbox" :class="{ok:tableBag.cortexPaint.indexOf('1') >= 0}">符合正品</span>
                                        <span class="checkbox" :class="{ok:tableBag.cortexPaint.indexOf('2') >= 0}">不符合正品</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>材质</div></td>
                                <td colspan="4"  align="right">
                                    <div v-if="isPrint">
                                        <input type="text" v-model="tableBag.cortexMaterialT">
                                        <el-checkbox-group v-model="tableBag.cortexMaterial" :min="0">
                                            <el-checkbox :label="'1'">符合正品</el-checkbox>
                                            <el-checkbox :label="'2'">不符合正品</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span>{{tableBag.cortexMaterialT}}</span>
                                        <span class="checkbox" :class="{ok:tableBag.cortexMaterial.indexOf('1') >= 0}">符合正品</span>
                                        <span class="checkbox" :class="{ok:tableBag.cortexMaterial.indexOf('2') >= 0}">不符合正品</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>气味</div></td>
                                <td colspan="4"  align="right">
                                    <div v-if="isPrint">
                                        <input type="text" v-model="tableBag.cortexSmellT">
                                        <el-checkbox-group v-model="tableBag.cortexSmell" :min="0">
                                            <el-checkbox :label="'1'">符合正品</el-checkbox>
                                            <el-checkbox :label="'2'">不符合正品</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span>{{tableBag.cortexSmellT}}</span>
                                        <span class="checkbox" :class="{ok:tableBag.cortexSmell.indexOf('1') >= 0}">符合正品</span>
                                        <span class="checkbox" :class="{ok:tableBag.cortexSmell.indexOf('2') >= 0}">不符合正品</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="100" rowspan="4"><div>内衬</div></td>
                                <td width="80"><div>年份标</div></td>
                                <td colspan="4"  align="right">
                                    <div v-if="isPrint">
                                        <input type="text" v-model="tableBag.liningYearT">
                                        <el-checkbox-group v-model="tableBag.liningYear" :min="0">
                                            <el-checkbox :label="'1'">符合正品</el-checkbox>
                                            <el-checkbox :label="'2'">不符合正品</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span>{{tableBag.liningYearT}}</span>
                                        <span class="checkbox" :class="{ok:tableBag.liningYear.indexOf('1') >= 0}">符合正品</span>
                                        <span class="checkbox" :class="{ok:tableBag.liningYear.indexOf('2') >= 0}">不符合正品</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>洗水标</div></td>
                                <td colspan="4"  align="right">
                                    <div v-if="isPrint">
                                        <input type="text" v-model="tableBag.liningWashWaterT">
                                        <el-checkbox-group v-model="tableBag.liningWashWater" :min="0">
                                            <el-checkbox :label="'1'">符合正品</el-checkbox>
                                            <el-checkbox :label="'2'">不符合正品</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span>{{tableBag.liningWashWaterT}}</span>
                                        <span class="checkbox" :class="{ok:tableBag.liningWashWater.indexOf('1') >= 0}">符合正品</span>
                                        <span class="checkbox" :class="{ok:tableBag.liningWashWater.indexOf('2') >= 0}">不符合正品</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>编码</div></td>
                                <td colspan="4"  align="right">
                                    <div v-if="isPrint">
                                        <input type="text" v-model="tableBag.liningCodeT">
                                        <el-checkbox-group v-model="tableBag.liningCode" :min="0">
                                            <el-checkbox :label="'1'">符合正品</el-checkbox>
                                            <el-checkbox :label="'2'">不符合正品</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span>{{tableBag.liningCodeT}}</span>
                                        <span class="checkbox" :class="{ok:tableBag.liningCode.indexOf('1') >= 0}">符合正品</span>
                                        <span class="checkbox" :class="{ok:tableBag.liningCode.indexOf('2') >= 0}">不符合正品</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>内里</div></td>
                                <td colspan="4"  align="right">
                                    <div v-if="isPrint">
                                        <input type="text" v-model="tableBag.liningInsideT">
                                        <el-checkbox-group v-model="tableBag.liningInside" :min="0">
                                            <el-checkbox :label="'1'">符合正品</el-checkbox>
                                            <el-checkbox :label="'2'">不符合正品</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span>{{tableBag.liningInsideT}}</span>
                                        <span class="checkbox" :class="{ok:tableBag.liningInside.indexOf('1') >= 0}">符合正品</span>
                                        <span class="checkbox" :class="{ok:tableBag.liningInside.indexOf('2') >= 0}">不符合正品</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="100" rowspan="6"><div>五金</div></td>
                                <td width="80"><div>拉头</div></td>
                                <td colspan="4"  align="right">
                                    <div v-if="isPrint">
                                        <input type="text" v-model="tableBag.hardwareSliderT">
                                        <el-checkbox-group v-model="tableBag.hardwareSlider" :min="0">
                                            <el-checkbox :label="'1'">符合正品</el-checkbox>
                                            <el-checkbox :label="'2'">不符合正品</el-checkbox>
                                            <el-checkbox :label="'3'">未做鉴定</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span>{{tableBag.hardwareSliderT}}</span>
                                        <span class="checkbox" :class="{ok:tableBag.hardwareSlider.indexOf('1') >= 0}">符合正品</span>
                                        <span class="checkbox" :class="{ok:tableBag.hardwareSlider.indexOf('2') >= 0}">不符合正品</span>
                                        <span class="checkbox" :class="{ok:tableBag.hardwareSlider.indexOf('3') >= 0}">未做鉴定</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>拉芽</div></td>
                                <td colspan="4"  align="right">
                                    <div v-if="isPrint">
                                        <input type="text" v-model="tableBag.hardwareBudT">
                                        <el-checkbox-group v-model="tableBag.hardwareBud" :min="0">
                                            <el-checkbox :label="'1'">符合正品</el-checkbox>
                                            <el-checkbox :label="'2'">不符合正品</el-checkbox>
                                            <el-checkbox :label="'3'">未做鉴定</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span>{{tableBag.hardwareBudT}}</span>
                                        <span class="checkbox" :class="{ok:tableBag.hardwareBud.indexOf('1') >= 0}">符合正品</span>
                                        <span class="checkbox" :class="{ok:tableBag.hardwareBud.indexOf('2') >= 0}">不符合正品</span>
                                        <span class="checkbox" :class="{ok:tableBag.hardwareBud.indexOf('3') >= 0}">未做鉴定</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>铆钉</div></td>
                                <td colspan="4"  align="right">
                                    <div v-if="isPrint">
                                        <input type="text" v-model="tableBag.hardwareRivetT">
                                        <el-checkbox-group v-model="tableBag.hardwareRivet" :min="0">
                                            <el-checkbox :label="'1'">符合正品</el-checkbox>
                                            <el-checkbox :label="'2'">不符合正品</el-checkbox>
                                            <el-checkbox :label="'3'">未做鉴定</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span>{{tableBag.hardwareRivetT}}</span>
                                        <span class="checkbox" :class="{ok:tableBag.hardwareRivet.indexOf('1') >= 0}">符合正品</span>
                                        <span class="checkbox" :class="{ok:tableBag.hardwareRivet.indexOf('2') >= 0}">不符合正品</span>
                                        <span class="checkbox" :class="{ok:tableBag.hardwareRivet.indexOf('3') >= 0}">未做鉴定</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>扣头</div></td>
                                <td colspan="4"  align="right">
                                    <div v-if="isPrint">
                                        <input type="text" v-model="tableBag.hardwareClaspT">
                                        <el-checkbox-group v-model="tableBag.hardwareClasp" :min="0">
                                            <el-checkbox :label="'1'">符合正品</el-checkbox>
                                            <el-checkbox :label="'2'">不符合正品</el-checkbox>
                                            <el-checkbox :label="'3'">未做鉴定</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span>{{tableBag.hardwareClaspT}}</span>
                                        <span class="checkbox" :class="{ok:tableBag.hardwareClasp.indexOf('1') >= 0}">符合正品</span>
                                        <span class="checkbox" :class="{ok:tableBag.hardwareClasp.indexOf('2') >= 0}">不符合正品</span>
                                        <span class="checkbox" :class="{ok:tableBag.hardwareClasp.indexOf('3') >= 0}">未做鉴定</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>链条</div></td>
                                <td colspan="4"  align="right">
                                    <div v-if="isPrint">
                                        <input type="text" v-model="tableBag.hardwareChainT">
                                        <el-checkbox-group v-model="tableBag.hardwareChain" :min="0">
                                            <el-checkbox :label="'1'">符合正品</el-checkbox>
                                            <el-checkbox :label="'2'">不符合正品</el-checkbox>
                                            <el-checkbox :label="'3'">未做鉴定</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span>{{tableBag.hardwareChainT}}</span>
                                        <span class="checkbox" :class="{ok:tableBag.hardwareChain.indexOf('1') >= 0}">符合正品</span>
                                        <span class="checkbox" :class="{ok:tableBag.hardwareChain.indexOf('2') >= 0}">不符合正品</span>
                                        <span class="checkbox" :class="{ok:tableBag.hardwareChain.indexOf('3') >= 0}">未做鉴定</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>扣子</div></td>
                                <td colspan="4"  align="right">
                                    <div v-if="isPrint">
                                        <input type="text" v-model="tableBag.hardwareButtonT">
                                        <el-checkbox-group v-model="tableBag.hardwareButton" :min="0">
                                            <el-checkbox :label="'1'">符合正品</el-checkbox>
                                            <el-checkbox :label="'2'">不符合正品</el-checkbox>
                                            <el-checkbox :label="'3'">未做鉴定</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span>{{tableBag.hardwareButtonT}}</span>
                                        <span class="checkbox" :class="{ok:tableBag.hardwareButton.indexOf('1') >= 0}">符合正品</span>
                                        <span class="checkbox" :class="{ok:tableBag.hardwareButton.indexOf('2') >= 0}">不符合正品</span>
                                        <span class="checkbox" :class="{ok:tableBag.hardwareButton.indexOf('3') >= 0}">未做鉴定</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="100" rowspan="5"><div>成色</div></td>
                                <td width="80"><div>磨损</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableBag.qualityAbrasion" :min="0">
                                            <el-checkbox :label="'1'">正面</el-checkbox>
                                            <el-checkbox :label="'2'">左侧</el-checkbox>
                                            <el-checkbox :label="'3'">右侧</el-checkbox>
                                            <el-checkbox :label="'4'">后面</el-checkbox>
                                            <el-checkbox :label="'5'">上边角</el-checkbox>
                                            <el-checkbox :label="'6'">下边角</el-checkbox>
                                            <el-checkbox :label="'7'">手把</el-checkbox>
                                            <el-checkbox :label="'8'">长肩带</el-checkbox>
                                            <el-checkbox :label="'9'">配皮</el-checkbox>
                                            <el-checkbox :label="'10'">五金</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableBag.qualityAbrasion.indexOf('1') >= 0}">正面</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityAbrasion.indexOf('2') >= 0}">左侧</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityAbrasion.indexOf('3') >= 0}">右侧</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityAbrasion.indexOf('4') >= 0}">后面</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityAbrasion.indexOf('5') >= 0}">上边角</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityAbrasion.indexOf('6') >= 0}">下边角</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityAbrasion.indexOf('7') >= 0}">手把</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityAbrasion.indexOf('8') >= 0}">长肩带</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityAbrasion.indexOf('9') >= 0}">配皮</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityAbrasion.indexOf('10') >= 0}">五金</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>吸色</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableBag.qualityAbsorption" :min="0">
                                            <el-checkbox :label="'1'">表皮</el-checkbox>
                                            <el-checkbox :label="'2'">手把</el-checkbox>
                                            <el-checkbox :label="'3'">长肩带</el-checkbox>
                                            <el-checkbox :label="'4'">配皮</el-checkbox>
                                            <el-checkbox :label="'5'">正面</el-checkbox>
                                            <el-checkbox :label="'6'">左侧</el-checkbox>
                                            <el-checkbox :label="'7'">右侧</el-checkbox>
                                            <el-checkbox :label="'8'">后面</el-checkbox>
                                            <el-checkbox :label="'9'">上边角</el-checkbox>
                                            <el-checkbox :label="'10'">下边角</el-checkbox>
                                            <el-checkbox :label="'11'">底部</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableBag.qualityAbsorption.indexOf('1') >= 0}">表皮</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityAbsorption.indexOf('2') >= 0}">手把</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityAbsorption.indexOf('3') >= 0}">长肩带</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityAbsorption.indexOf('4') >= 0}">配皮</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityAbsorption.indexOf('5') >= 0}">正面</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityAbsorption.indexOf('6') >= 0}">左侧</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityAbsorption.indexOf('7') >= 0}">右侧</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityAbsorption.indexOf('8') >= 0}">后面</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityAbsorption.indexOf('9') >= 0}">上边角</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityAbsorption.indexOf('10') >= 0}">下边角</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityAbsorption.indexOf('11') >= 0}">底部</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>氧化</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableBag.qualityOxygenation" :min="0">
                                            <el-checkbox :label="'1'">手把</el-checkbox>
                                            <el-checkbox :label="'2'">长肩带</el-checkbox>
                                            <el-checkbox :label="'3'">配皮</el-checkbox>
                                            <el-checkbox :label="'4'">拉头</el-checkbox>
                                            <el-checkbox :label="'5'">拉芽</el-checkbox>
                                            <el-checkbox :label="'6'">铆钉</el-checkbox>
                                            <el-checkbox :label="'7'">扣头</el-checkbox>
                                            <el-checkbox :label="'8'">链条</el-checkbox>
                                            <el-checkbox :label="'9'">扣子</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableBag.qualityOxygenation.indexOf('1') >= 0}">手把</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityOxygenation.indexOf('2') >= 0}">长肩带</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityOxygenation.indexOf('3') >= 0}">配皮</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityOxygenation.indexOf('4') >= 0}">拉头</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityOxygenation.indexOf('5') >= 0}">拉芽</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityOxygenation.indexOf('6') >= 0}">铆钉</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityOxygenation.indexOf('7') >= 0}">扣头</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityOxygenation.indexOf('8') >= 0}">链条</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityOxygenation.indexOf('9') >= 0}">扣子</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>变色</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableBag.qualityDiscoloration" :min="0">
                                            <el-checkbox :label="'1'">手把</el-checkbox>
                                            <el-checkbox :label="'2'">长肩带</el-checkbox>
                                            <el-checkbox :label="'3'">配皮</el-checkbox>
                                            <el-checkbox :label="'4'">正面</el-checkbox>
                                            <el-checkbox :label="'5'">左侧</el-checkbox>
                                            <el-checkbox :label="'6'">右侧</el-checkbox>
                                            <el-checkbox :label="'7'">后面</el-checkbox>
                                            <el-checkbox :label="'8'">底部</el-checkbox>
                                            <el-checkbox :label="'9'">翻盖</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableBag.qualityDiscoloration.indexOf('1') >= 0}">手把</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityDiscoloration.indexOf('2') >= 0}">长肩带</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityDiscoloration.indexOf('3') >= 0}">配皮</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityDiscoloration.indexOf('4') >= 0}">正面</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityDiscoloration.indexOf('5') >= 0}">左侧</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityDiscoloration.indexOf('6') >= 0}">右侧</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityDiscoloration.indexOf('7') >= 0}">后面</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityDiscoloration.indexOf('8') >= 0}">底部</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityDiscoloration.indexOf('9') >= 0}">翻盖</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>划痕</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableBag.qualityScratch" :min="0">
                                            <el-checkbox :label="'1'">正面</el-checkbox>
                                            <el-checkbox :label="'2'">左侧</el-checkbox>
                                            <el-checkbox :label="'3'">右侧</el-checkbox>
                                            <el-checkbox :label="'4'">后面</el-checkbox>
                                            <el-checkbox :label="'5'">手把</el-checkbox>
                                            <el-checkbox :label="'6'">长肩带</el-checkbox>
                                            <el-checkbox :label="'7'">配皮</el-checkbox>
                                            <el-checkbox :label="'8'">铆钉</el-checkbox>
                                            <el-checkbox :label="'9'">扣头</el-checkbox>
                                            <el-checkbox :label="'10'">链条</el-checkbox>
                                            <el-checkbox :label="'11'">扣子</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableBag.qualityScratch.indexOf('1') >= 0}">正面</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityScratch.indexOf('2') >= 0}">左侧</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityScratch.indexOf('3') >= 0}">右侧</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityScratch.indexOf('4') >= 0}">后面</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityScratch.indexOf('5') >= 0}">手把</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityScratch.indexOf('6') >= 0}">长肩带</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityScratch.indexOf('7') >= 0}">配皮</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityScratch.indexOf('8') >= 0}">铆钉</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityScratch.indexOf('9') >= 0}">扣头</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityScratch.indexOf('10') >= 0}">链条</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityScratch.indexOf('11') >= 0}">扣子</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="100"><div>其他</div></td>
                                <td colspan="5"><div v-if="isPrint"><input type="text" v-model="tableBag.other"></div><div v-else>{{tableBag.other}}&nbsp;</div></td>
                            </tr>
                            <tr>
                                <td width="50">
                                    <div>鉴定结论</div>
                                </td>
                                <td colspan="6"><div v-if="isPrint"><input type="text" v-model="tableBag.conclusion"></div><div v-else>{{tableBag.conclusion}}&nbsp;</div></td>
                            </tr>
                        </table>
                        <div style="text-align:right;padding:30px 0 0 0;">鉴定师签名：____________</div>
                    </div>

                    <div>
                        鉴定结果
                        <el-select v-model="jdStatus" placeholder="请选择" disabled>
                            <el-option :label="'通过'" :value="0"></el-option>
                            <el-option :label="'不通过'" :value="1"></el-option>
                            <el-option :label="'不确定'" :value="-1"></el-option>
                        </el-select>
                        <el-button @click="printme">打印</el-button>
                    </div>

                    <div>
                        <div>注释</div>
                        <div>
                            <p>1、如多件物品，每件使用一份检验单；</p>
                            <p>2、“ <el-checkbox></el-checkbox> ” 打勾选择，“ ____________ ” 填写数字或有效描述；</p>
                            <p>3、检验单填写完毕后需上传照片至附加；</p>
                        </div>
                    </div>

                </el-tab-pane>
                <!-- the fifth tab -->
                <el-tab-pane label="物流信息" name="fifth">
                    <h3 style="margin-bottom:12px">订单号：{{detail.order.pkGlobalId}}</h3>
                    <p>卖家至平台</p>
                    <el-form label-width="100px">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="物流单号" prop="">
                                    <span>{{sellToUs.exNumber}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="3">
                                <el-form-item label="运费" prop="">
                                    <span v-if="sellToUs.exPrice">{{sellToUs.exPrice}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="15">
                            <el-collapse>
                                <el-collapse-item title="物流信息">
                                    <!-- <div>物流信息</div> -->
                                    暂无
                                </el-collapse-item>
                            </el-collapse>           
                            </el-col>
                        </el-row>
                    </el-form>
                    <p>平台至卖家</p>
                    <!-- <el-form label-width="100px">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="物流单号" prop="">
                                    <span v-if="usToSell.exNumber">{{usToSell.exNumber}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="3">
                                <el-form-item label="运费" prop="">
                                    <span>{{usToSell.exPrice}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="15">
                            <el-collapse>
                                <el-collapse-item title="物流信息">
                                    暂无
                                </el-collapse-item>
                            </el-collapse>           
                            </el-col>
                        </el-row>
                    </el-form> -->
                    <el-form label-width="80px">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="物流单号" prop="">
                                    <el-input v-model="usToSellTemp.exNumber"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="运费" prop="">
                                    <el-row>
                                        <el-col :span="11">
                                            <el-input v-model="usToSellTemp.exPrice"></el-input>
                                        </el-col>
                                        <el-col :span="2">&nbsp;</el-col>
                                        <el-col :span="11">
                                            <el-button @click="subusToSellTemp">保存</el-button>
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                            <el-collapse>
                                <el-collapse-item title="物流信息">
                                    暂无
                                </el-collapse-item>
                            </el-collapse>           
                            </el-col>
                        </el-row>
                    </el-form>

                    <p>平台至买家</p>
                    <!-- <el-form label-width="100px">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="物流单号" prop="">
                                    <span>{{usToBuy.exNumber}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="3">
                                <el-form-item label="运费" prop="">
                                    <span v-if="usToBuy.exPrice">{{usToBuy.exPrice}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="15">
                                <el-collapse>
                                    <el-collapse-item title="物流信息">
                                        暂无
                                    </el-collapse-item>
                                </el-collapse>           
                            </el-col>
                        </el-row>
                    </el-form> -->
                    <el-form label-width="80px">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="物流单号" prop="">
                                    <el-input v-model="usToBuyTemp.exNumber"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="运费" prop="">
                                    <el-row>
                                        <el-col :span="11">
                                            <el-input v-model="usToBuyTemp.exPrice"></el-input>
                                        </el-col>
                                        <el-col :span="2">&nbsp;</el-col>
                                        <el-col :span="11">
                                            <el-button @click="subusToBuyTemp">保存</el-button>
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                            <el-collapse>
                                <el-collapse-item title="物流信息">
                                    暂无
                                </el-collapse-item>
                            </el-collapse>           
                            </el-col>
                        </el-row>
                    </el-form>

                </el-tab-pane>
                <!-- the sixth tab -->
                <el-tab-pane label="退款信息" name="sixth">
                    <el-form label-width="120px">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="处理方式" prop="">
                                    <el-select v-model="refund.cutType" placeholder="请选择" style="width:100%">
                                        <el-option :label="'扣款比例'" :value="0"></el-option>
                                        <el-option :label="'扣款金额'" :value="1"></el-option>
                                    </el-select>
                                    <!-- <el-input v-model="refund.cutPrice" style="margin-top:12px"></el-input> -->
                                    <el-input v-if="refund.cutType=='0'" v-model="refund.cutPrice" style="width:100%;margin-top:12px"><template slot="append">%</template></el-input>
                                    <el-input v-if="refund.cutType=='1'" v-model="refund.cutPrice" style="width:100%;margin-top:12px"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="姓名" prop="">
                                    <el-input v-model="refund.refundName"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="支付方式" prop="">
                                    <el-select v-model="refund.refundType" placeholder="请选择" style="width:100%">
                                        <el-option :label="'微信'" :value="1"></el-option>
                                        <el-option :label="'支付宝'" :value="2"></el-option>
                                        <el-option :label="'银行卡'" :value="4"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="账户" prop="">
                                    <el-input v-model="refund.refundAccount"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="备注" prop="">
                            <el-input v-model="refund.memo"></el-input>
                        </el-form-item>
                        <el-form-item label="" prop="">
                            <el-button type="primary" @click="submitRefund">提交</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <!-- the seventh tab -->
                <el-tab-pane label="操作记录" name="seventh">
                    <el-table :data="orderLog" border style="width: 100%">
                        <el-table-column type="index" label="编号" width="70"></el-table-column>
                        <el-table-column prop="orderId" label="订单号" width="300"></el-table-column>
                        <el-table-column prop="content" label="内容" min-width="200"></el-table-column>
                        <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>

        </el-dialog>
    </div>
</template>

<script>
import api from '../../../util/api'
import ajax from '../../../util/ajax'
export default {
    name: 'list',
    mixins: [ajax],
    data () {
        return {
            dialogVisible: false,
            dialogImageUrl: '',

            pkGlobalIdSearch: '',
            sellUserPhoneSearch: '',
            buyUserPhoneSearch: '',
            statusSearch: '',
            orderTypeSearch: '',

            dataList: '',
            currentPage: 1,
            pageSize: 20,
            loading: false,

            file: '',
            thumb: '',

            detail: {
                order: {
                    pkGlobalId: '',
                    totalPrice: '',
                    fee: '',
                    payType: '',
                    admin: {
                        name: ''
                    }
                },
                sellUser: {
                    nickName: '',
                    phone: '',
                    student: false
                },
                buyUser: {
                    nickName: '',
                    phone: ''
                },
                sellGoods: {
                    descript: '',
                },
                identifyResult: {
                    identifierName: ''
                },
                identifyRequest: {
                    identifyStatus: ''
                },
                status: '',

            },
            detailStatus: '',

            modifyState: false,
            activeName: 'first',
          
            //退款信息
            refund:{
                cutType: 0,
                cutPrice: '',
                refundName: '',
                refundType: 1,
                refundAccount: '',
                memo: '',
                id: '',
            },

            //后加的鬼
            isPrint: false,
            tableBag: {
                customerName: '',
                appraiser: '',
                identifyDate: '',
                code: '',
                brandName: '',
                serialName: '',
                typeName: '',
                publicPrice: '',
                style: [],
                packaging: [],
                source: [],
                cortexLogo: [],
                cortexLogoT: '',
                cortexPrint: [],
                cortexPrintT: '',
                cortexPaint: [],
                cortexPaintT: '',
                cortexMaterial: [],
                cortexMaterialT: '',
                cortexSmell: [],
                cortexSmellT: '',
                liningYear: [],
                liningYearT: '',
                liningWashWater: [],
                liningWashWaterT: '',
                liningCode: [],
                liningCodeT: '',
                liningInside: [],
                liningInsideT: '',
                hardwareSlider: [],
                hardwareSliderT: '',
                hardwareBud: [],
                hardwareBudT: '',
                hardwareRivet: [],
                hardwareRivetT: '',
                hardwareClasp: [],
                hardwareClaspT: '',
                hardwareChain: [],
                hardwareChainT: '',
                hardwareButton: [],
                hardwareButtonT: '',
                qualityAbrasion: [],
                qualityAbsorption: [],
                qualityOxygenation: [],
                qualityDiscoloration: [],
                qualityScratch: [],
                other: '',
                conclusion: '',
            },
            tableWatch: {
                customerName: '',
                appraiser: '',
                identifyDate: '',
                brandName: '',
                serialName: '',
                typeName: '',
                publicPrice: '',
                style: [],
                packaging: [],
                source: [],
                watchcaseTraces: [],
                watchcaseShape: [],
                material: [],
                watchDiameter: [],
                watchDial: [],
                scale: [],
                watchNeedle: [],
                calendar: [],
                watchSmallDial: [],
                watchMirror: [],
                watchCrown: [],
                diamond: [],
                rearCover: [],
                watchEar: [],
                strapMaterial: [],
                metalStrap: [],
                cortexStrap: [],
                watchButton: [],
                screw: [],
                polish: [],
                lettering: [],
                movementScrew: [],
                rotor: [],
                retainerRing: [],
                func: [],
                conclusion: '',

                strapNumber: '',
                dailyDifference: '',
                swing: '',
                polarization: '',
                parameter: '',
            },
            jdStatus: '',

            fileList: [],
            exPrice:0,//卖家至平台运费
            sellToUs: '',
            usToSell: '',
            usToBuy: '',
            receiveAddr: '',//收货人
            orderLog: [],//操作记录

            usToSellTemp:{
                pkGlobalId: '',
                goodsBuyId: '',
                exNumber: '',
                exCompany: "顺丰",
                exPrice: '',
                type: 2
            },
            usToBuyTemp:{
                pkGlobalId: '',
                goodsBuyId: '',
                exNumber: '',
                exCompany: "顺丰",
                exPrice: '',
                type: 3
            }
        }
    },
    created(){
        var _vue=this
        this.autoHeight=window.innerHeight-160
        window.onresize=function(){_vue.autoHeight=window.innerHeight-160}

        this.reData()

        this.file = api.file + '/'
        this.thumb = api.thumb + '/'
    },
    mounted(){

    },
    updated(){
        
    },
    methods:{
        handleCurrentChange(val) {
            this.loading=true
            let _searchData = ''
            if(this.pkGlobalIdSearch){
                _searchData+='&pkGlobalId='+this.pkGlobalIdSearch
            }
            if(this.sellUserPhoneSearch){
                _searchData+='&sellUser.phone='+this.sellUserPhoneSearch
            }
            if(this.buyUserPhoneSearch){
                _searchData+='&buyUser.phone='+this.buyUserPhoneSearch
            }
            if(this.statusSearch){
                _searchData+='&status='+this.statusSearch
            }
            if(this.orderTypeSearch){
                _searchData+='&orderType='+this.orderTypeSearch
            }
            this.fetchData(api.ordersList+'?sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
                this.dataList=data
                this.loading=false
            })
        },
        reData() {
            this.loading=true
            this.currentPage=1
            let _searchData = ''
            if(this.pkGlobalIdSearch){
                _searchData+='&pkGlobalId='+this.pkGlobalIdSearch
            }
            if(this.sellUserPhoneSearch){
                _searchData+='&sellUser.phone='+this.sellUserPhoneSearch
            }
            if(this.buyUserPhoneSearch){
                _searchData+='&buyUser.phone='+this.buyUserPhoneSearch
            }
            if(this.statusSearch){
                _searchData+='&status='+this.statusSearch
            }
            if(this.orderTypeSearch){
                _searchData+='&orderType='+this.orderTypeSearch
            }
            this.fetchData(api.ordersList+'?sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
                this.dataList=data
                this.loading=false
            })
        },
        showModify(index , data) {

            this.fetchData(api.logistics+'/?goodsBuyId='+data[index].pkGlobalId+'&type=1','',(data) => {
                if(data.length>0){
                    this.exPrice = data[0].exPrice
                    this.sellToUs = data[0]
                }
            
            })
            this.fetchData(api.logistics+'/?goodsBuyId='+data[index].pkGlobalId+'&type=2','',(data) => {
                if(data.length>0){
                    this.usToSell = data[0]
                    //以后要删除的
                    if(data[0].pkGlobalId){
                        this.usToSellTemp.pkGlobalId=data[0].pkGlobalId
                    }
                    this.usToSellTemp.exNumber=data[0].exNumber
                    this.usToSellTemp.exPrice=data[0].exPrice
                }

            })
            this.fetchData(api.logistics+'/?goodsBuyId='+data[index].pkGlobalId+'&type=3','',(data) => {
                if(data.length>0){
                    this.usToBuy = data[0]
                    //以后要删除的
                    if(data[0].pkGlobalId){
                        this.usToBuyTemp.pkGlobalId=data[0].pkGlobalId
                    }
                    this.usToBuyTemp.exNumber=data[0].exNumber
                    this.usToBuyTemp.exPrice=data[0].exPrice
                }

            })

            this.detail=data[index]
            this.detailStatus=data[index].status

            this.refund={
                cutType: data[index].cutType,
                cutPrice: data[index].cutPrice,
                refundName: data[index].refundName,
                refundType: data[index].refundType,
                refundAccount: data[index].refundAccount,
                memo: data[index].memo,
            }

            this.activeName = 'first'
            this.modifyState=true

        },
        changeTabs(targetName) {
            if(targetName.name=='second'){
                this.fetchData(api.goodsImage+'/?goodsId='+this.detail.sellGoods.pkGlobalId,'',(data) => {
                    this.fileList = data.content
                })
            }else if(targetName.name=='third'){
                this.fetchData(api.receiverAddr+'/'+this.detail.receiveAddrId,'',(data) => {
                    this.receiveAddr = data
                })
            }else if(targetName.name=='fourth'){
                if(this.detail.sellGoods.categoryId=='1' && this.detail.identifyRequest){
                    this.fetchData(api.identifyReportWatch+'?identifyId='+this.detail.identifyRequest.pkGlobalId,'',(data) => {
                        let _data = data
                        if(_data.length>0){
                            this.hasIdentify = false
                            for(let i in this.tableWatch){
                                if(this.tableWatch[i].constructor==Array && _data[0][i]){
                                    this.tableWatch[i]=_data[0][i].split(',')
                                }else{
                                    if(_data[0][i]){
                                        this.tableWatch[i]=_data[0][i]
                                    }
                                }
                            }
                            this.jdStatus = _data[0].isTrue
                        }else{
                            this.hasIdentify = true
                        }
                    })
                }
                if(this.detail.sellGoods.categoryId=='2' && this.detail.identifyRequest){
                    this.fetchData(api.identifyReport+'?identifyId='+this.detail.identifyRequest.pkGlobalId,'',(data) => {
                        let _data = data
                        if(_data.length>0){
                            this.hasIdentify = false
                            for(let i in this.tableBag){
                                if(this.tableBag[i].constructor==Array && _data[0][i]){
                                    this.tableBag[i]=_data[0][i].split(',')
                                }else{
                                    if(_data[0][i]){
                                        this.tableBag[i]=_data[0][i]
                                    }
                                }
                            }
                            this.jdStatus = _data[0].isTrue
                        }else{
                            if(_data[0][i]){
                                this.hasIdentify = true
                            }
                        }
                    })
                }
            }else if(targetName.name=='fifth'){
                
            }else if(targetName.name=='sixth'){
                
            }else if(targetName.name=='seventh'){
                this.fetchData(api.orderLog+'?orderId='+this.detail.order.pkGlobalId,'',(data) => {
                    this.orderLog = data
                })
            }
        },
        modifyStatus(){
            this.patchData(api.modifyStatus+'/'+this.detail.pkGlobalId+'?status='+this.detailStatus,'',(data) => {
                this.$message({showClose: true,message: '提交成功',type: 'success'})
                this.reData()
            })
        },
        submitRefund(){
            this.refund.id = this.detail.pkGlobalId
            this.patchData(api.ordersList+'/'+this.detail.pkGlobalId,this.refund,(data) => {
                this.$message({showClose: true,message: '提交成功',type: 'success'})
                this.reData()
            })
        },
        //运费以后要删了的方法
        subusToSellTemp(){
            this.usToSellTemp.goodsBuyId=this.detail.pkGlobalId
            this.subForm(api.logistics,this.usToSellTemp,(data) => {
                this.$message({showClose: true,message: '提交成功',type: 'success'})
                this.reData()
            })
        },
        //运费以后要删了的方法
        subusToBuyTemp(){
            this.usToBuyTemp.goodsBuyId=this.detail.pkGlobalId
            this.subForm(api.logistics,this.usToBuyTemp,(data) => {
                this.$message({showClose: true,message: '提交成功',type: 'success'})
                this.reData()
            })
        },
        handleClose(done) {
            done()
            this.tableBag = {
                customerName: '',
                appraiser: '',
                identifyDate: '',
                code: '',
                brandName: '',
                serialName: '',
                typeName: '',
                publicPrice: '',
                style: [],
                packaging: [],
                source: [],
                cortexLogo: [],
                cortexLogoT: '',
                cortexPrint: [],
                cortexPrintT: '',
                cortexPaint: [],
                cortexPaintT: '',
                cortexMaterial: [],
                cortexMaterialT: '',
                cortexSmell: [],
                cortexSmellT: '',
                liningYear: [],
                liningYearT: '',
                liningWashWater: [],
                liningWashWaterT: '',
                liningCode: [],
                liningCodeT: '',
                liningInside: [],
                liningInsideT: '',
                hardwareSlider: [],
                hardwareSliderT: '',
                hardwareBud: [],
                hardwareBudT: '',
                hardwareRivet: [],
                hardwareRivetT: '',
                hardwareClasp: [],
                hardwareClaspT: '',
                hardwareChain: [],
                hardwareChainT: '',
                hardwareButton: [],
                hardwareButtonT: '',
                qualityAbrasion: [],
                qualityAbsorption: [],
                qualityOxygenation: [],
                qualityDiscoloration: [],
                qualityScratch: [],
                other: '',
                conclusion: '',
            }
            this.tableWatch = {
                customerName: '',
                appraiser: '',
                identifyDate: '',
                brandName: '',
                serialName: '',
                typeName: '',
                publicPrice: '',
                style: [],
                packaging: [],
                source: [],
                watchcaseTraces: [],
                watchcaseShape: [],
                material: [],
                watchDiameter: [],
                watchDial: [],
                scale: [],
                watchNeedle: [],
                calendar: [],
                watchSmallDial: [],
                watchMirror: [],
                watchCrown: [],
                diamond: [],
                rearCover: [],
                watchEar: [],
                strapMaterial: [],
                metalStrap: [],
                cortexStrap: [],
                watchButton: [],
                screw: [],
                polish: [],
                lettering: [],
                movementScrew: [],
                rotor: [],
                retainerRing: [],
                func: [],
                conclusion: '',
                strapNumber: '',
                dailyDifference: '',
                swing: '',
                polarization: '',
                parameter: '',
            }
        },
        handlePictureCardPreview(file){
            this.dialogImageUrl = file.url
            this.dialogVisible = true
        },
        openImg(href){
            this.dialogImageUrl = ''
            this.dialogVisible = true
            this.dialogImageUrl = href
        },
        printme() {
            this.isPrint = false
            this.$nextTick(function(){
                document.body.innerHTML=document.getElementById('print').innerHTML
                window.print()
                window.location.reload()
            })
        }
    }
}
</script>