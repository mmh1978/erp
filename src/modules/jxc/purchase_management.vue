<style lang="less" scope>

</style>
<template>
    <div class="content">
        <div class="top-bar">
            <div class="item">
                <el-form :inline="true">
                    <el-form-item label="">
                        <el-button type="primary" @click="addState = true" class="el-icon-plus"> 添加</el-button>
                    </el-form-item>
                    <el-form-item label="">
                        <el-input v-model="idSearch" placeholder="采购单编号"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-select v-model="statusSearch" clearable placeholder="采购单状态">
                            <el-option label="待审核" value="01"></el-option>
                            <el-option label="待入库" value="02"></el-option>
                            <el-option label="已入库" value="03"></el-option>
                            <el-option label="已拒绝" value="09"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="">
                        <el-select v-model="paymentStatusSearch" clearable placeholder="付款状态">
                            <el-option label="待付款" value="01"></el-option>
                            <el-option label="已付款" value="02"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="supplierSearch" clearable filterable placeholder="供应商" :remote-method="remoteMethod" :loading="selectLoading" remote>
                            <el-option v-for="item in oddNumListSearch.content" :key="item.id" :value="item.id" :label="item.name"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button icon="search" @click="reData">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <template>
            <el-table :data="dataList.content" border style="width: 100%" :height="autoHeight" v-loading="loading">
                <el-table-column prop="id" label="采购单编号" width="120"></el-table-column>
                <el-table-column prop="supplier.name" label="供应商" width="100"></el-table-column>
                <el-table-column prop="postSale" label="采购类型" width="100">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].postSale=='0'">正常采购</template>
                        <template v-if="dataList.content[scope.$index].postSale=='2'">退货采购</template>
                    </template>
                </el-table-column>
                <el-table-column prop="goodsNumber" label="商品数量" width="100"></el-table-column>
                <el-table-column prop="price" label="总金额" width="100"></el-table-column>
                <el-table-column prop="status" label="状态" width="100">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].status=='01'">待审核</template>
                        <template v-if="dataList.content[scope.$index].status=='02'">待入库</template>
                        <template v-if="dataList.content[scope.$index].status=='03'">已入库</template>
                        <template v-if="dataList.content[scope.$index].status=='09'">已拒绝</template>
                    </template>
                </el-table-column>
                <el-table-column prop="paymentStatus" label="付款状态" width="100">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].paymentStatus=='01'">待付款</template>
                        <template v-if="dataList.content[scope.$index].paymentStatus=='02'">已付款</template>
                    </template>
                </el-table-column>
                <el-table-column prop="operator.name" label="操作员" width="100"></el-table-column>
                <el-table-column prop="check1.name" label="采购审核人" width="120"></el-table-column>
                <el-table-column prop="memo" label="备注" min-width="100"></el-table-column>
                <el-table-column prop="createTime" label="创建日期" width="180"></el-table-column>
                <el-table-column fixed="right" label="操作" width="210">
                    <template slot-scope="scope">

                        <el-button type="plain" size="small" @click.native.prevent="showDetail(scope.$index, dataList.content)" v-if="dataList.content[scope.$index].status=='03' || dataList.content[scope.$index].status=='09'">查看</el-button>
                        <el-button type="plain" size="small" @click.native.prevent="showPay(scope.$index, dataList.content)" v-if="dataList.content[scope.$index].status=='02' && dataList.content[scope.$index].paymentStatus=='01'">付款</el-button>
                        <el-button type="plain" size="small" @click.native.prevent="showGoodsin(scope.$index, dataList.content)" v-if="dataList.content[scope.$index].paymentStatus=='02' && dataList.content[scope.$index].status=='02'">入库</el-button>
                        <template v-if="dataList.content[scope.$index].status=='01'">
                            <!-- <el-popover ref="pop" placement="bottom" trigger="click"> -->
                                <el-button type="text" size="small" @click.native.prevent="showEdit(scope.$index, dataList.content)">编辑</el-button>
                                <el-button type="text" size="small" @click.native.prevent="showModify(scope.$index, dataList.content)">添加明细</el-button>
                                <el-button type="text" size="small" @click.native.prevent="showVerify(scope.$index, dataList.content)">审核</el-button>
                                <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index, dataList.content)">删除</el-button>
                            <!-- </el-popover>
                            <el-button type="primary" size="small" v-popover:pop>操作</el-button> -->
                        </template>
                            
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <div class="bottom-bar">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="dataList.totalElements"></el-pagination>
        </div>

        <el-dialog title="添加付款明细" :visible.sync="addAccountState" size="tiny">
            <el-form label-width="80px" :model="accountForm">
                <el-form-item label="付款账户">
                    <el-select v-model="accountForm.account" filterable placeholder="请选择" :loading="accountLoading" @visible-change="showAccount">
                        <el-option v-for="(item , index) in accountList" :key="item.id" :label="item.name" :value="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="支付类型">
                    <el-select v-model="accountForm.account" disabled>
                        <el-option v-for="(item , index) in accountList" v-if="item.type=='1'" :key="item.id" :label="'银行账户'" :value="index"></el-option>
                        <el-option v-for="(item , index) in accountList" v-if="item.type=='2'" :key="item.id" :label="'微信账户'" :value="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="支付金额">
                    <el-input v-model="accountForm.money"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="accountForm.memo"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addAccountForm">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog title="添加明细" :visible.sync="addCollectState" size="small">
            <el-form label-width="100px" :model="detailForm">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="品类名称">
                            <el-select v-model="detailForm.category" filterable placeholder="请选择" :loading="categoryLoading" @visible-change="showCategory" @change="goodsTypeDis=false" style="width:100%">
                                <el-option v-for="(item , index) in categoryList" :key="item.pkGlobalId" :label="item.name" :value="item.pkGlobalId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="名称">
                            <el-select v-model="detailForm.goodsType" filterable remote placeholder="请输入关键词" :remote-method="showGoodsType" :loading="goodsTypeLoading" style="width:100%" :disabled="goodsTypeDis">
                                <el-option v-for="item in goodsTypeList" :key="item.pkGlobalId" :label="item.name" :value="item.pkGlobalId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="品牌名称">
                            <el-select v-model="detailForm.goodsType" placeholder="" style="width:100%" disabled>
                                <el-option v-for="item in goodsTypeList" :key="item.pkGlobalId" :label="item.brand.name" :value="item.pkGlobalId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="型号">
                            <el-select v-model="detailForm.goodsType" remote placeholder="" style="width:100%" disabled>
                                <el-option v-for="item in goodsTypeList" :key="item.pkGlobalId" :label="item.name" :value="item.pkGlobalId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="成本价">
                            <el-input-number v-model="detailForm.price" :min="0" :controls="false" style="width:100%"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="数量">
                            <el-input-number v-model="detailForm.number" :min="1" :controls="false" style="width:100%"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- 同行价 -->
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="同行价">
                            <el-input-number v-model="detailForm.samePrice" :min="0" :controls="false" style="width:100%"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="利润">
                            <el-input v-model="counterpartProfit" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="同行利润比率%">
                            <!-- <el-input v-model="detailForm.counterpartPercentage"></el-input> -->
                            <el-input-number v-model="detailForm.counterpartPercentage" :min="0" :controls="false" style="width:100%"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="同行销售比率%">
                            <el-input v-model="sellCounterpartPercentage" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- 客户价 -->
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="客户价">
                            <el-input-number v-model="detailForm.customerPrice" :min="0" :controls="false" style="width:100%"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="利润">
                            <el-input v-model="customerProfit" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="客户利润比率%">
                            <!-- <el-input v-model="detailForm.customerPercentage"></el-input> -->
                            <el-input-number v-model="detailForm.customerPercentage" :min="0" :controls="false" style="width:100%"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="客户销售比率%">
                            <el-input v-model="sellCustomerPercentage" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注">
                            <el-input type="textarea" v-model="detailForm.memo"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item>
                    <el-button type="primary" @click="addDetailForm">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- sadfasdfas -->
        <el-dialog title="编辑明细" :visible.sync="editCollectState" size="small">
            <el-form label-width="100px" :model="editdetailForm">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="品类名称">
                            <el-input v-model="editdetailForm.categoryName" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="名称">
                            <el-input v-model="editdetailForm.name" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="品牌名称">
                            <el-input v-model="editdetailForm.brandName" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="型号">
                            <el-input v-model="editdetailForm.typeName" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="成本价">
                            <el-input-number v-model="editdetailForm.price" :min="0" :controls="false" style="width:100%"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="数量">
                            <el-input-number v-model="editdetailForm.number" :min="1" :controls="false" style="width:100%"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- 同行价 -->
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="同行价">
                            <el-input-number v-model="editdetailForm.samePrice" :min="0" :controls="false" style="width:100%"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="利润">
                            <el-input v-model="counterpartProfit" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="同行利润比率%">
                            <!-- <el-input v-model="editdetailForm.counterpartPercentage"></el-input> -->
                            <el-input-number v-model="editdetailForm.counterpartPercentage" :min="0" :controls="false" style="width:100%"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="同行销售比率%">
                            <el-input v-model="sellCounterpartPercentage" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- 客户价 -->
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="客户价">
                            <el-input-number v-model="editdetailForm.customerPrice" :min="0" :controls="false" style="width:100%"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="利润">
                            <el-input v-model="customerProfit" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="客户利润比率%">
                            <!-- <el-input v-model="editdetailForm.customerPercentage"></el-input> -->
                            <el-input-number v-model="editdetailForm.customerPercentage" :min="0" :controls="false" style="width:100%"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="客户销售比率%">
                            <el-input v-model="sellCustomerPercentage" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注">
                            <el-input type="textarea" v-model="editdetailForm.memo"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item>
                    <el-button type="primary" @click="editDetailForm">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- asdfasdfasdfasdf -->

        <el-dialog title="添加采购单" :visible.sync="addState" size="large">
            <el-form ref="form" :model="form" :rules="rules" label-width="100px" v-loading="addLoading">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="供应商" prop="name">
                            <el-col :span="18">
                                <el-input v-model="form.name" disabled></el-input>
                            </el-col>
                            <el-col :span="1">&nbsp;</el-col>
                            <el-col :span="5">
                                <el-popover ref="popover" placement="bottom" width="1200" trigger="click" @show="oddRemoteMethod">
                                    <el-form :inline="true">
                                        <el-form-item><el-input v-model="innerSName" placeholder="供应商名称"></el-input></el-form-item>
                                        <el-form-item><el-input v-model="innerSTel" placeholder="手机号"></el-input></el-form-item>
                                        <el-form-item><el-button icon="search" @click="reInnerData">查询</el-button></el-form-item>
                                    </el-form>
                                    <el-table :data="oddNumList.content" border style="width: 100%" v-loading="oddNumLoading" height="400">
                                        <el-table-column min-width="100" property="name" label="名称"></el-table-column>
                                        <el-table-column width="100" property="contact" label="联系人"></el-table-column>
                                        <el-table-column width="140" property="tel" label="联系电话"></el-table-column>
                                        <!-- <el-table-column min-width="140" property="address" label="联系地址"></el-table-column> -->
                                        <el-table-column min-width="100" property="payBank" label="开户行"></el-table-column>
                                        <el-table-column min-width="100" property="payName" label="开户支行"></el-table-column>
                                        <el-table-column min-width="100" property="payAccount" label="收款账号"></el-table-column>
                                        <!-- <el-table-column width="120" property="createTime" label="创建日期"></el-table-column> -->
                                        <el-table-column fixed="right" label="操作" width="70">
                                            <template slot-scope="scope">
                                                <el-button type="text" size="small" @click.native.prevent="selectOdd(scope.$index, oddNumList.content)">选择</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                    <el-row>
                                        <el-col :span="24" style="overflow:hidden;margin-top:20px">
                                            <el-pagination @current-change="curChange" :current-page.sync="curPage" :page-size="pSize" layout="prev, pager, next, jumper" :total="oddNumList.totalElements" style="float:left"></el-pagination>
                                        </el-col>
                                    </el-row>
                                </el-popover>
                                <el-button class="el-icon-search" v-popover:popover>查找</el-button>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系人" prop="">
                            <el-input v-model="form.contact" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系电话" prop="">
                            <el-input v-model="form.tel" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="收款账号" prop="">
                            <el-input v-model="form.payAccount" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="开户行" prop="">
                            <el-input v-model="form.payBank" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="开户支行" prop="">
                            <el-input v-model="form.payName" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="16">
                        <el-form-item label="联系地址" prop="">
                            <el-input v-model="form.address" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="采购时间" prop="">
                            <el-date-picker v-model="form.purchaseTime" type="datetime" placeholder="选择日期时间" style="width:100%"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注" prop="">
                            <el-input v-model="form.memoA"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item>
                    <el-button type="primary" @click="add('form')">保存</el-button>
                </el-form-item>
                </el-col>
            </el-form>
        </el-dialog>

        <el-dialog title="添加明细" :visible.sync="modifyState" size="large">
            <el-form ref="modifyForm" :model="modifyForm" :rules="modifyRules" label-width="100px" v-loading="modifyLoading">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="供应商" prop="name">
                            <el-input v-model="modifyForm.name" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系人" prop="">
                            <el-input v-model="modifyForm.contact" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系电话" prop="">
                            <el-input v-model="modifyForm.tel" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="收款账号" prop="">
                            <el-input v-model="modifyForm.payAccount" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="开户行" prop="">
                            <el-input v-model="modifyForm.payBank" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="开户支行" prop="">
                            <el-input v-model="modifyForm.payName" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="16">
                        <el-form-item label="联系地址" prop="">
                            <el-input v-model="modifyForm.address" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="采购时间" prop="">
                            <el-date-picker v-model="modifyForm.purchaseTime" type="datetime" placeholder="" disabled style="width:100%"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注" prop="">
                            <el-input v-model="modifyForm.memo" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="商品数量" prop="">
                            <el-input v-model="goodsNumber" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="总金额" prop="">
                            <el-input v-model="price" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="采购明细" v-if="purchaseList.length>0">
                    <el-table :data="purchaseList" border style="width: 100%">
                        <el-table-column min-width="100" property="id" label="产品ID"></el-table-column>
                        <el-table-column width="100" property="categoryName" label="品类名称"></el-table-column>
                        <el-table-column width="100" property="brandName" label="品牌名称"></el-table-column>
                        <el-table-column min-width="180" property="typeName" label="型号名称"></el-table-column>
                        <el-table-column min-width="200" property="name" label="名称"></el-table-column>
                        <el-table-column width="80" property="number" label="数量"></el-table-column>
                        <el-table-column width="110" property="goodsReturn" label="是否退货">
                            <template slot-scope="scope">
                                <template v-if="purchaseList[scope.$index].goodsReturn">已退货</template>
                                <template v-else>正常</template>
                            </template>
                        </el-table-column>
                        <el-table-column width="90" property="price" label="成本价"></el-table-column>
                        <el-table-column width="90" property="samePrice" label="同行价"></el-table-column>
                        <el-table-column width="160" property="sameRate" label="同行销售提成"></el-table-column>
                        <el-table-column width="80" property="customerPrice" label="客户价"></el-table-column>
                        <el-table-column width="160" property="customerRate" label="客户销售提成"></el-table-column>
                        <el-table-column min-width="180" property="memo" label="备注"></el-table-column>
                        <el-table-column fixed="right" label="操作" width="120">
                            <template slot-scope="scope">
                                <template>
                                    <el-button type="text" size="small" @click.native.prevent="purchaseEdit(scope.$index, purchaseList)">编辑</el-button>
                                    <el-button type="text" size="small" @click.native.prevent="purchaseDelete(scope.$index, purchaseList)">删除</el-button>
                                </template>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item>
                    <el-button @click="addCollectState = true">添加明细</el-button>
                    <el-button type="primary" @click="modify('modifyForm')">保存</el-button>
                </el-form-item>
                </el-col>
            </el-form>
        </el-dialog>

        <el-dialog title="编辑采购单" :visible.sync="editState" size="large">
            <el-form ref="editForm" :model="editForm" :rules="editRules" label-width="100px" v-loading="editLoading">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="供应商" prop="name">
                            <el-col :span="18">
                                <el-input v-model="editForm.name" disabled></el-input>
                            </el-col>
                            <el-col :span="1">&nbsp;</el-col>
                            <el-col :span="5">
                                <el-popover ref="popover" placement="bottom" width="1200" trigger="click" @show="oddRemoteMethod">
                                    <el-form :inline="true">
                                        <el-form-item><el-input v-model="innerSName" placeholder="供应商名称"></el-input></el-form-item>
                                        <el-form-item><el-input v-model="innerSTel" placeholder="手机号"></el-input></el-form-item>
                                        <el-form-item><el-button icon="search" @click="reInnerData">查询</el-button></el-form-item>
                                    </el-form>
                                    <el-table :data="oddNumList.content" border style="width: 100%;max-height:500px" v-loading="oddNumLoading"  height="400">
                                        <el-table-column min-width="100" property="name" label="名称"></el-table-column>
                                        <el-table-column width="100" property="contact" label="联系人"></el-table-column>
                                        <el-table-column width="140" property="tel" label="联系电话"></el-table-column>
                                        <!-- <el-table-column min-width="140" property="address" label="联系地址"></el-table-column> -->
                                        <el-table-column min-width="100" property="payBank" label="开户行"></el-table-column>
                                        <el-table-column min-width="100" property="payName" label="开户支行"></el-table-column>
                                        <el-table-column min-width="100" property="payAccount" label="收款账号"></el-table-column>
                                        <!-- <el-table-column width="120" property="createTime" label="创建日期"></el-table-column> -->
                                        <el-table-column fixed="right" label="操作" width="70">
                                            <template slot-scope="scope">
                                                <el-button type="text" size="small" @click.native.prevent="selectOdd(scope.$index, oddNumList.content)">选择</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                    <el-row>
                                        <el-col :span="24" style="overflow:hidden;margin-top:20px">
                                            <el-pagination @current-change="curChange" :current-page.sync="curPage" :page-size="pSize" layout="prev, pager, next, jumper" :total="oddNumList.totalElements" style="float:left"></el-pagination>
                                        </el-col>
                                    </el-row>
                                </el-popover>
                                <el-button class="el-icon-search" v-popover:popover>查找</el-button>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系人" prop="">
                            <el-input v-model="editForm.contact" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系电话" prop="">
                            <el-input v-model="editForm.tel" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="收款账号" prop="">
                            <el-input v-model="editForm.payAccount" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="开户行" prop="">
                            <el-input v-model="editForm.payBank" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="开户支行" prop="">
                            <el-input v-model="editForm.payName" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-col :span="16">
                            <el-form-item label="联系地址" prop="">
                                <el-input v-model="editForm.address" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="采购时间" prop="">
                                <el-date-picker v-model="editPurchaseTime" type="datetime" placeholder="选择日期时间" style="width:100%"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注" prop="">
                            <el-input v-model="editMemo"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item>
                    <el-button type="primary" @click="edit('editForm')">保存</el-button>
                </el-form-item>
                </el-col>
            </el-form>
        </el-dialog>

        <el-dialog title="查看详情" :visible.sync="showState" size="large">
            <el-form :model="showForm" label-width="100px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="供应商" prop="name">
                            <el-input v-model="showForm.name" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系人" prop="">
                            <el-input v-model="showForm.contact" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系电话" prop="">
                            <el-input v-model="showForm.tel" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="收款账号" prop="">
                            <el-input v-model="showForm.payAccount" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="开户行" prop="">
                            <el-input v-model="showForm.payBank" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="开户支行" prop="">
                            <el-input v-model="showForm.payName" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="16">
                        <el-form-item label="联系地址" prop="">
                            <el-input v-model="showForm.address" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="采购时间" prop="">
                            <el-date-picker v-model="showForm.purchaseTime" type="datetime" placeholder="" disabled style="width:100%"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注" prop="">
                            <el-input v-model="showForm.memo" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="商品数量" prop="">
                            <el-input v-model="goodsNumber" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="总金额" prop="">
                            <el-input v-model="price" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="采购明细" v-if="purchaseList.length>0">
                    <el-table :data="purchaseList" border style="width: 100%">
                        <el-table-column min-width="100" property="id" label="产品ID"></el-table-column>
                        <el-table-column width="100" property="categoryName" label="品类名称"></el-table-column>
                        <el-table-column width="100" property="brandName" label="品牌名称"></el-table-column>
                        <el-table-column min-width="180" property="typeName" label="型号名称"></el-table-column>
                        <el-table-column min-width="200" property="name" label="名称"></el-table-column>
                        <el-table-column width="80" property="number" label="数量"></el-table-column>
                        <el-table-column width="110" property="goodsReturn" label="是否退货">
                            <template slot-scope="scope">
                                <template v-if="purchaseList[scope.$index].goodsReturn">已退货</template>
                                <template v-else>正常</template>
                            </template>
                        </el-table-column>
                        <el-table-column width="90" property="price" label="成本价"></el-table-column>
                        <el-table-column width="90" property="samePrice" label="同行价"></el-table-column>
                        <el-table-column width="160" property="sameRate" label="同行销售提成"></el-table-column>
                        <el-table-column width="80" property="customerPrice" label="客户价"></el-table-column>
                        <el-table-column width="160" property="customerRate" label="客户销售提成"></el-table-column>
                        <el-table-column min-width="180" property="memo" label="备注"></el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="showState = false">确定</el-button>
                </el-form-item>
                </el-col>
            </el-form>
        </el-dialog>

        <el-dialog title="审核" :visible.sync="verifyState" size="small">
            <el-form :model="verifyForm" label-width="100px">

                <el-form-item label="审核状态" prop="name">
                    <el-select v-model="verifyForm.status" placeholder="">
                        <el-option :label="'通过'" :value="'02'"></el-option>
                        <el-option :label="'拒绝'" :value="'09'"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="审核意见" prop="">
                    <el-input type="textarea" v-model="verifyForm.memo" placeholder="请填写审核意见"></el-input>
                </el-form-item>
     
                <el-form-item>
                    <el-button type="primary" @click="subVerify">确定</el-button>
                </el-form-item>
                </el-col>
            </el-form>
        </el-dialog>

        <el-dialog title="付款" :visible.sync="payState" size="large">
            <el-form :model="payForm" :rules="payRules" ref="payForm" label-width="100px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="采购单号" prop="">
                            <el-input v-model="payForm.id" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="采购人员" prop="">
                            <el-input v-model="payForm.name" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="采购时间" prop="">
                            <el-date-picker v-model="payForm.purchaseTime" type="datetime" placeholder="" disabled style="width:100%"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="总金额" prop="">
                            <el-input v-model="price" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="备注" prop="">
                            <el-input v-model="payForm.memo"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- v-if="payList.length>0" -->
                <el-form-item label="付款明细" >
                    <el-table :data="payList" border style="width: 100%">
                        <el-table-column min-width="180" property="name" label="付款账户"></el-table-column>
                        <el-table-column width="100" property="type" label="支付类型">
                            <template slot-scope="scope">
                                <template v-if="payList[scope.$index].type=='1'">
                                    银行账户
                                </template>
                                <template v-if="payList[scope.$index].type=='2'">
                                    微信账户
                                </template>
                            </template>
                        </el-table-column>
                        <el-table-column width="100" property="money" label="支付金额"></el-table-column>
                        <el-table-column min-width="100" property="memo" label="备注"></el-table-column>
                        <el-table-column fixed="right" label="操作" width="70">
                            <template slot-scope="scope">
                                <el-button type="text" v-if="!payList[scope.$index].delete" size="small" @click.native.prevent="purchaseDelete(scope.$index, payList)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item>
                    <el-button @click="addAccountState = true">添加付款明细</el-button>
                    <el-button type="primary"  @click="pay('payForm')">保存</el-button>
                </el-form-item>
                </el-col>
            </el-form>
        </el-dialog>

        <el-dialog title="入库" :visible.sync="goodsinState" size="large">
            <el-form :model="goodsinForm" :rules="goodsinFormRules" ref="goodsinForm" label-width="100px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="采购单号" prop="">
                            <el-input v-model="goodsinForm.id" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="采购人" prop="">
                            <el-input v-if="goodsinForm.operator" v-model="goodsinForm.operator.name" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="创建时间" prop="">
                            <el-input v-model="goodsinForm.createTime" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="仓库" prop="baseId">
  <el-select v-model="goodsinForm.baseId" placeholder="请选择" style="width:100%">
    <el-option
      v-for="item in ckList"
      :key="item.id"
      :label="item.name"
      :value="item.id">
    </el-option>
  </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="采购明细" v-if="purchaseList.length>0">
                    <el-table :data="purchaseList" border style="width: 100%">
                        <el-table-column min-width="100" property="id" label="产品ID"></el-table-column>
                        <el-table-column width="100" property="categoryName" label="品类名称"></el-table-column>
                        <el-table-column width="100" property="brandName" label="品牌名称"></el-table-column>
                        <el-table-column min-width="180" property="typeName" label="型号名称"></el-table-column>
                        <el-table-column min-width="200" property="name" label="名称"></el-table-column>
                        <el-table-column width="80" property="number" label="数量"></el-table-column>
                        <el-table-column width="110" property="goodsReturn" label="是否退货">
                            <template slot-scope="scope">
                                <template v-if="purchaseList[scope.$index].goodsReturn">已退货</template>
                                <template v-else>正常</template>
                            </template>
                        </el-table-column>
                        <el-table-column width="90" property="price" label="成本价"></el-table-column>
                        <el-table-column width="90" property="samePrice" label="同行价"></el-table-column>
                        <el-table-column width="160" property="sameRate" label="同行销售提成"></el-table-column>
                        <el-table-column width="80" property="customerPrice" label="客户价"></el-table-column>
                        <el-table-column width="160" property="customerRate" label="客户销售提成"></el-table-column>
                        <el-table-column min-width="180" property="memo" label="备注"></el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="goodsin('goodsinForm')">确定</el-button>
                </el-form-item>
                </el-col>
            </el-form>
        </el-dialog>

    </div>
</template>

<script>
import api from '../../util/api'
import ajax from '../../util/ajax'
export default {
    name: 'purchaseManagement',
    mixins: [ajax],
    data () {
        return {
            idSearch: '',
            statusSearch: '',
            paymentStatusSearch: '',
            supplierSearch: '',
            oddNumListSearch: '',
            dataList: '',
            currentPage: 1,
            pageSize: 20,
            loading: false,

            addState: false,
            addLoading: false,
            form: {
                name: '',
                contact: '',
                tel: '',
                payAccount: '',
                payBank: '',
                payName: '',
                address: '',
                memoA: '',
                purchaseTime: '',
            },
            rules: {
                name: [
                    { required: true, message: '请选择寄卖单', trigger: 'blur' }
                ],
            },

            editForm: {
                name: '',
                contact: '',
                tel: '',
                payAccount: '',
                payBank: '',
                payName: '',
                address: '',
                memo: '',
            },
            editRules: {

            },
            editLoading: false,
            editState:false,
            editMemo: '',
            editPurchaseTime: '',

            modifyState: false,
            modifyLoading: false,
            modifyForm: {
                name: '',
                contact: '',
                tel: '',
                payAccount: '',
                payBank: '',
                payName: '',
                address: '',
                memo: '',
            },
            modifyRules: {
                // name: '',
                // contact: '',
                // tel: '',
                // payAccount: '',
                // payBank: '',
                // payName: '',
                // address: '',
                // memo: '',
            },
            price: '',
            goodsNumber: '',

            categoryList: '',//品类
            categoryLoading: false,

            goodsTypeList: '',//型号
            goodsTypeLoading: false,
            goodsTypeDis: true,

            oddNumList: [],
            oddNumLoading: true,

            collectState: false,
            addCollectState: false,
            editCollectState: false,

            detailForm: {
                category: '',
                goodsType: '',
                price: '',
                number: '',
                samePrice: '',
                customerPrice: '',
                memo: '',
                counterpartPercentage: '',//同行价利润提成比
                customerPercentage: '',//客户价利润提成比
            },
            counterpartProfit: '',//同行价利润
            sellCounterpartPercentage: '',//同行销售比率
            customerProfit: '',
            sellCustomerPercentage: '',
            editdetailForm: {
                category: '',
                goodsType: '',
                price: '',
                number: '',
                samePrice: '',
                customerPrice: '',
                memo: '',
                counterpartPercentage: '',//同行价利润提成比
                customerPercentage: '',//客户价利润提成比
            },

            refId: '',

            purchaseList: [],

            showState: false,//查看明细状态
            showForm: {
                name: '',
                contact: '',
                tel: '',
                payAccount: '',
                payBank: '',
                payName: '',
                address: '',
                memo: '',
            },//查看明细数据

            goodsinState: false,
            goodsinForm: {
                baseId : '',
                id: '',
                operator: {
                    name: '',
                },
                createTime: '',
            },
            goodsinFormRules: {
                baseId: [
                    { required: true, message: '请选择仓库', trigger: 'blur' }
                ],
            },
            verifyState: false,//审核
            verifyForm: {
                status: '02',
                memo: '',
            },

            payState: false,
            payForm: {
                name: '',
                contact: '',
                tel: '',
                payAccount: '',
                payBank: '',
                payName: '',
                address: '',
                memo: '',
                purchaseTime: '',
            },
            payRules: {
                name: [
                    { required: true, message: '请选择寄卖单', trigger: 'blur' }
                ],
            },

            payList: [],

            accountList: '',
            accountLoading: true,
            accountForm: {
                account: '',
                memo: '',
                money: '',
            },
            addAccountState: false,

            selectLoading: false,

            loadingP: 0,
            loadingT: '',

            curPage: 1,
            pSize: 10,
            innerSName: '',
            innerSTel: '',

            ckList: '',
        }
    },
    created(){
        var _vue=this
        this.autoHeight=window.innerHeight-160
        window.onresize=function(){_vue.autoHeight=window.innerHeight-160}

        this.reData()

        this.fetchData(api.ckManagement+'?page=0&size=9999','',(redata) => {
            if(!!redata.content){
                this.ckList = redata.content
            }
        })

        this.file = api.file + '/'
    },
    mounted(){

    },
    updated(){
        
    },
    methods:{
        handleCurrentChange(val) {
            this.loading=true
            let _searchData = ''
            if(this.idSearch){
                _searchData+='&id='+this.idSearch
            }
            if(this.statusSearch){
                _searchData+='&status='+this.statusSearch
            }
            if(this.paymentStatusSearch){
                _searchData+='&paymentStatus='+this.paymentStatusSearch
            }
            if(this.supplierSearch){
                _searchData+='&supplier.id='+this.supplierSearch
            }
            this.fetchData(api.purchaseManagement+'?sort=createTime,desc&postSale=0&postSale=2&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
                this.dataList=data
                this.loading=false
            })
        },
        reData() {
            this.loading=true
            this.currentPage=1
            let _searchData = ''
            if(this.idSearch){
                _searchData+='&id='+this.idSearch
            }
            if(this.statusSearch){
                _searchData+='&status='+this.statusSearch
            }
            if(this.paymentStatusSearch){
                _searchData+='&paymentStatus='+this.paymentStatusSearch
            }
            if(this.supplierSearch){
                _searchData+='&supplier.id='+this.supplierSearch
            }
            this.fetchData(api.purchaseManagement+'?sort=createTime,desc&postSale=0&postSale=2&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
                this.dataList=data
                this.loading=false
                this.$forceUpdate()
            })
        },
        curChange(val) {
            let _searchData = ''
            if(this.innerSName){
                _searchData+='&name='+this.innerSName
            }
            if(this.innerSTel){
                _searchData+='&tel='+this.innerSTel
            }
            this.fetchData(api.supplier+'?page='+(this.curPage-1)+'&size='+this.pSize+_searchData,'',(data) => {
                this.oddNumList=data
            })
        },
        reInnerData() {
            this.curPage=1
            let _searchData = ''
            if(this.innerSName){
                _searchData+='&name='+this.innerSName
            }
            if(this.innerSTel){
                _searchData+='&tel='+this.innerSTel
            }
            this.fetchData(api.supplier+'?page='+(this.curPage-1)+'&size='+this.pSize+_searchData,'',(data) => {
                this.oddNumList=data
            })
        },
        add(form) {
            this.form.id=this.form.id.toString()
            this.$refs[form].validate((valid) => {
                if (valid) {
                    this.addLoading=true
                    let _p={
                        supplier: {
                            id: this.form.id,
                        },
                        memo: this.form.memoA,
                        purchaseTime: this.form.purchaseTime,
                    }
                    this.subForm(api.purchaseManagement,_p,(data) => {
                        this.addLoading=false
                        this.addState=false
                        this.reData()
                        this.$message({ message: '恭喜你，添加成功', type: 'success' })
                    })
                } else { return false }
            })
        },
        showEdit(index , data){
            this.editId = data[index].id
            this.editMemo = data[index].memo
            this.editPurchaseTime = data[index].purchaseTime
            if(data[index].supplier){
                this.editForm=data[index].supplier
            }
            this.editState=true
        },
        edit(editForm) {
            this.editForm.id=this.editForm.id.toString()
            this.$refs[editForm].validate((valid) => {
                if (valid) {
                    this.addLoading=true
                    let _p={
                        supplier: {
                            id: this.editForm.id,
                        },
                        id: this.editId,
                        memo: this.editMemo,
                    }
                    this.patchData(api.purchaseManagement+'/'+this.editId,_p,(data) => {
                        this.editLoading=false
                        this.editState=false
                        this.reData()
                        this.$message({ message: '恭喜你，修改成功', type: 'success' })
                    })
                } else { return false }
            })
        },
        deleteRow(index , data) {
            this.$confirm('确定删除吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
                this.deleteData(api.purchaseManagement+'/'+data[index].id,'',(data) => {
                    this.reData()
                    this.$message({ type: 'success', message: '删除成功!' })
                })
            }).catch(() => { })
        },
        showModify(index , data) {
            this.refId = data[index].id
            this.price = data[index].price
            this.goodsNumber = data[index].goodsNumber
            if(data[index].supplier){
                this.modifyForm=data[index].supplier
            }
            this.modifyForm.memo=data[index].memo
            this.modifyForm.purchaseTime=data[index].purchaseTime
            this.purchaseList=[]
            this.fetchData(api.conf+'?code=同行价利润提成比','',(redata) => {
                this.detailForm.counterpartPercentage=redata.content[0].value || 0
            })
            this.fetchData(api.conf+'?code=客户价利润提成比','',(redata) => {
                this.detailForm.customerPercentage=redata.content[0].value || 0
            })
            this.fetchData(api.purchaseDetail+'?refId='+this.refId,'',(redata) => {
                if(!!redata.content){
                    this.purchaseList = redata.content
                }
            })
            this.modifyState=true
        },
        showDetail(index , data){
            this.refId = data[index].id
            this.price = data[index].price
            this.goodsNumber = data[index].goodsNumber
            if(data[index].supplier){
                this.showForm=data[index].supplier
            }
            this.showForm.memo=data[index].memo
            this.showForm.purchaseTime=data[index].purchaseTime
            this.purchaseList=[]
            this.fetchData(api.purchaseDetail+'?refId='+this.refId,'',(redata) => {
                if(!!redata.content){
                    this.purchaseList = redata.content
                }
            })
            this.showState = true
        },
        modify(modifyForm) {
            this.$refs[modifyForm].validate((valid) => {
                if (valid) {
                    this.modifyLoading=true
                    let _p = []
                    for(let i in this.purchaseList){
                        _p.push(this.purchaseList[i])
                    }
                    this.subForm(api.purchaseDetail+'/batch_create/'+this.refId,_p,(data) => {
                        this.modifyState=false
                        this.modifyLoading=false
                        this.reData()
                        this.$message({message: '恭喜你，保存成功',type: 'success'})
                    })
                } else { return false }
            })
        },
        oddRemoteMethod() {
            this.fetchData(api.supplier,'',(data) => {
                this.oddNumList=data
                this.oddNumLoading=false
            })
        },
        selectOdd(index , data){
            if(this.addState){
                this.form=data[index]
            }else if(this.editState){
                this.editForm=data[index]
            }
            
        },
        showGoodsType(query){//查找型号
            if (query !== '') {
                this.goodsTypeLoading=true
                this.fetchData(api.goodsType+'/search?keyword='+query+'&categoryId='+this.detailForm.category+'&size=20','',(data) => {
                    this.goodsTypeList=data.content
                    this.goodsTypeLoading=false
                })
            } else {
                this.goodsTypeList = []
            }    
        },
        showCategory(state){//查找品类
            if(state && !this.categoryList){
                this.categoryLoading=true
                this.fetchData(api.goodsCategory,'',(data) => {
                    this.categoryList=data.content
                    this.categoryLoading=false
                })
            }else{
                this.categoryLoading=false
            }
        },
        goodsTypeChange(data){
            
        },
        addDetailForm() {//把明细加到表格里面
            console.log(0)
            console.log(this.detailForm)
            let _categoryName , _typeName , _typeNameFull , _brandObj
            for(let i in this.categoryList){
                if(this.categoryList[i].pkGlobalId == this.detailForm.category){
                    _categoryName = this.categoryList[i].name
                }
            }
            for(let j in this.goodsTypeList){
                if(this.goodsTypeList[j].pkGlobalId == this.detailForm.goodsType){
                    _typeName = this.goodsTypeList[j].name
                    _typeNameFull = this.goodsTypeList[j].nameFull
                    _brandObj = this.goodsTypeList[j].brand
                }
            }
            let _p = {
                "refId": this.refId,
                "name": _typeNameFull,
                "categoryId": this.detailForm.category,
                "categoryName": _categoryName,
                "brandId": _brandObj.pkGlobalId,
                "brandName": _brandObj.name,
                "typeId": this.detailForm.goodsType,
                "typeName": _typeName,
                "number": this.detailForm.number,
                "price": this.detailForm.price,
                "samePrice": this.detailForm.samePrice,
                "sameRate": this.sellCounterpartPercentage,
                "customerPrice": this.detailForm.customerPrice,
                "customerRate": this.sellCustomerPercentage,
                "memo": this.detailForm.memo,
                "deleteState":true,
                "goodsReturn":false
            }
            this.purchaseList.push(_p)
            this.addCollectState=false
        },
        editDetailForm(){
            let _p = {
                "refId": this.refId,
                "name": this.editdetailForm.name,
                "categoryId": this.editdetailForm.categoryId,
                "categoryName": this.editdetailForm.categoryName,
                "brandId": this.editdetailForm.brandId,
                "brandName": this.editdetailForm.brandName,
                "typeId": this.editdetailForm.typeId,
                "typeName": this.editdetailForm.typeName,
                "number": this.editdetailForm.number,
                "price": this.editdetailForm.price,
                "samePrice": this.editdetailForm.samePrice,
                "sameRate": this.sellCounterpartPercentage,
                "customerPrice": this.editdetailForm.customerPrice,
                "customerRate": this.sellCustomerPercentage,
                "memo": this.editdetailForm.memo,
                "id": this.editdetailForm.id || '',
                "deleteState":true,
            }
            for(let i in this.purchaseList){
                if(this.purchaseList[i].id==_p.id){
                    this.purchaseList[i].refId=this.refId
                    this.purchaseList[i].name=this.editdetailForm.name
                    this.purchaseList[i].categoryId=this.editdetailForm.categoryId
                    this.purchaseList[i].categoryName=this.editdetailForm.categoryName
                    this.purchaseList[i].brandId=this.editdetailForm.brandId
                    this.purchaseList[i].brandName=this.editdetailForm.brandName
                    this.purchaseList[i].typeId=this.editdetailForm.typeId
                    this.purchaseList[i].typeName=this.editdetailForm.typeName
                    this.purchaseList[i].number=this.editdetailForm.number
                    this.purchaseList[i].price=this.editdetailForm.price
                    this.purchaseList[i].samePrice=this.editdetailForm.samePrice
                    this.purchaseList[i].sameRate=this.sellCounterpartPercentage
                    this.purchaseList[i].customerPrice=this.editdetailForm.customerPrice
                    this.purchaseList[i].customerRate=this.sellCustomerPercentage
                    this.purchaseList[i].memo=this.editdetailForm.memo
                    this.purchaseList[i].id=this.editdetailForm.id
                }
            }
            this.editCollectState=false
        },
        purchaseDelete(index , data) {
            data.splice(index, 1)
        },
        purchaseEdit(index , data){
            this.editCollectState=true
            this.loadingT = data[index]
            this.loadingP = 0
            this.fetchData(api.conf+'?code=同行价利润提成比','',(redata) => {
                this.editdetailForm.counterpartPercentage=redata.content[0].value || 0
                this.loadingP++
            })
            this.fetchData(api.conf+'?code=客户价利润提成比','',(redata) => {
                this.editdetailForm.customerPercentage=redata.content[0].value || 0
                this.loadingP++
            })
        },
        showVerify(index , data){
            this.verifyId=data[index].id
            this.verifyState=true
        },
        subVerify(){
            this.patchData(api.purchaseManagement+'/check/'+this.verifyId,this.verifyForm,(data) => {
                this.reData()
                this.verifyState=false
                this.$message({ message: '恭喜你，审核成功', type: 'success' })
            })
        },
        showPay(index , data) {
            this.refId = data[index].id
            this.price = data[index].price
            this.goodsNumber = data[index].goodsNumber
            if(data[index].operator){
                this.payForm=data[index].operator
            }
            this.payForm.purchaseTime=data[index].purchaseTime
            this.purchaseList=[]
            // this.fetchData(api.purchaseDetail+'?refId='+this.refId,'',(redata) => {
            //     if(!!redata.content){
            //         this.purchaseList = redata.content
            //     }
            // })
            this.payState = true
        },
        showAccount(state){//查找付款账户
            if(state && !this.accountList){
                this.accountLoading=true
                this.fetchData(api.account,'',(data) => {
                    this.accountList=data.content
                    this.accountLoading=false
                })
            }else{
                this.accountLoading=false
            }
        },
        addAccountForm() {//把付款账户加到表格里面
            let _p = {
                'name': this.accountList[this.accountForm.account].name,
                'type': this.accountList[this.accountForm.account].type,
                'money': this.accountForm.money,
                'memo': this.accountForm.memo,
                'id': this.accountList[this.accountForm.account].id,
            }
            this.payList.push(_p)
            this.addAccountState=false
        },
        pay(payForm) {
            this.$refs[payForm].validate((valid) => {
                if (valid) {
                    let _arr = []
                    for(let i in this.payList){
                        let _p={
                            "sum":this.payList[i].money,
                            "paymentWay":this.payList[i].type,
                            "memo":this.payList[i].memo,
                            "financeAccount": {
                                "id":this.payList[i].id
                            }
                        }
                        if(!this.payList[i].delete){
                            _arr.push(_p) 
                        }
                    }
                    let _data = {
                        detailList: _arr,
                        memo: this.payForm.memo,
                        sum: this.price
                    }
                    this.subForm(api.purchaseManagement+'/payment?id='+this.refId,_data,(data) => {
                        this.payState=false
                        this.reData()
                        this.$message({message: '恭喜你，保存成功',type: 'success'})
                    })
                } else { return false }
            })
        },
        showGoodsin(index , data){
            this.refId = data[index].id
            this.goodsinForm = data[index]
            this.purchaseList=[]
            this.fetchData(api.purchaseDetail+'?refId='+this.refId,'',(redata) => {
                if(!!redata.content){
                    this.purchaseList = redata.content
                }
            })
            this.goodsinState = true
        },
        goodsin(goodsinForm){
            if(this.goodsinForm.baseId){
                this.goodsinForm.baseId=this.goodsinForm.baseId.toString()
            }
            this.$refs[goodsinForm].validate((valid) => {
                if (valid) {
                    let _arr = []
                    for(let i in this.purchaseList){
                        //如果是退货的，就筛选掉
                        if(!this.purchaseList[i].goodsReturn){
                            _arr.push({
                                purchaseDetail:{id:this.purchaseList[i].id},
                                memo:this.purchaseList[i].memo
                            })
                        }
                    }
                    let _p = {
                        jxcPurchase:{id:this.goodsinForm.id},
                        number: this.goodsinForm.goodsNumber,
                        price: this.goodsinForm.price,
                        memo: this.goodsinForm.memo,
                        detailList: _arr,
                        baseId: this.goodsinForm.baseId,
                    }
                    this.subForm(api.purchaseManagement+'/goodsin?id='+this.refId,_p,(data) => {
                        this.goodsinState=false
                        this.reData()
                        this.$message({ message: '恭喜你，入库成功', type: 'success' })
                    })
                }
            })
        },
        remoteMethod(query) {
            if(query){
                this.selectLoading = true
                this.fetchData(api.supplier+'?name='+query,'',(data) => {
                    this.oddNumListSearch=data
                    this.selectLoading=false
                })
            }
        },
    },
    watch:{
        detailForm:{
            handler: function (val, oldVal) { 
                this.counterpartProfit = (parseFloat(val.samePrice) - parseFloat(val.price))//同行价利润
                if(parseFloat(val.samePrice) > 0){
                    this.sellCounterpartPercentage = Math.round(((parseFloat(val.samePrice) - parseFloat(val.price)) * parseFloat(this.detailForm.counterpartPercentage) / parseFloat(val.samePrice)) * 10) / 10//同行销售比率
                }else{
                    this.sellCounterpartPercentage = ''
                }
                this.customerProfit = (parseFloat(val.customerPrice) - parseFloat(val.price))//客户价利润
                if(parseFloat(val.customerPrice) > 0){
                    this.sellCustomerPercentage = Math.round(((parseFloat(val.customerPrice) - parseFloat(val.price)) * parseFloat(this.detailForm.customerPercentage) / parseFloat(val.customerPrice)) * 10) / 10//客户销售比率
                }else{
                    this.sellCustomerPercentage = ''
                }
            },
            deep: true
        },
        loadingP(v , ov) {
            if(v=='2'){
                this.editdetailForm.categoryName = this.loadingT.categoryName
                this.editdetailForm.name = this.loadingT.name
                this.editdetailForm.brandName = this.loadingT.brandName
                this.editdetailForm.typeName = this.loadingT.typeName
                this.editdetailForm.price = this.loadingT.price
                this.editdetailForm.number = this.loadingT.number
                this.editdetailForm.samePrice = this.loadingT.samePrice
                this.editdetailForm.customerPrice = this.loadingT.customerPrice
                this.editdetailForm.brandId = this.loadingT.brandId
                this.editdetailForm.categoryId = this.loadingT.categoryId
                this.editdetailForm.typeId = this.loadingT.typeId
                this.editdetailForm.memo = this.loadingT.memo
                this.editdetailForm.id = this.loadingT.id
            }
        },
        editdetailForm:{
            handler: function (val, oldVal) { 
                this.counterpartProfit = (parseFloat(val.samePrice) - parseFloat(val.price))//同行价利润
                if(parseFloat(val.samePrice) > 0){
                    this.sellCounterpartPercentage = Math.round(((parseFloat(val.samePrice) - parseFloat(val.price)) * parseFloat(this.editdetailForm.counterpartPercentage) / parseFloat(val.samePrice)) * 10) / 10//同行销售比率
                }else{
                    this.sellCounterpartPercentage = ''
                }
                this.customerProfit = (parseFloat(val.customerPrice) - parseFloat(val.price))//客户价利润
                if(parseFloat(val.customerPrice) > 0){
                    this.sellCustomerPercentage = Math.round(((parseFloat(val.customerPrice) - parseFloat(val.price)) * parseFloat(this.editdetailForm.customerPercentage) / parseFloat(val.customerPrice)) * 10) / 10//客户销售比率
                }else{
                    this.sellCustomerPercentage = ''
                }
            },
            deep: true
        },
    }
}
</script>