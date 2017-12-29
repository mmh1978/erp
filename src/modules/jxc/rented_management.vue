<style lang="less" scope>

</style>
<template>
    <div class="content">
        <div class="top-bar">
            <div class="item">
                <el-form :inline="true">
                    <el-form-item label="">
                        <el-button type="primary" @click="oddRemoteMethod" class="el-icon-plus"> 添加</el-button>
                    </el-form-item>
                    <el-form-item label="">
                        <el-input v-model="idSearch" placeholder="单号"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-select v-model="statusSearch" clearable placeholder="状态">
                            <el-option label="全部借出" value="1"></el-option>
                            <el-option label="部分归还" value="2"></el-option>
                            <el-option label="全部归还" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="">
                        <el-select v-model="paymentStatusSearch" clearable placeholder="审核状态">
                            <el-option label="待审核" value="0"></el-option>
                            <el-option label="已同意" value="1"></el-option>
                            <el-option label="已拒绝" value="2"></el-option>
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
                <el-table-column prop="id" label="单号" width="120"></el-table-column>
                <el-table-column prop="status" label="状态" width="100">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].status=='1'">全部借出</template>
                        <template v-if="dataList.content[scope.$index].status=='2'">部分归还</template>
                        <template v-if="dataList.content[scope.$index].status=='3'">全部归还</template>
                    </template>
                </el-table-column>
                <el-table-column prop="operator.name" label="操作员" width="100"></el-table-column>
                <el-table-column prop="auditStatus" label="审核状态" width="100">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].auditStatus=='0'">待审核</template>
                        <template v-if="dataList.content[scope.$index].auditStatus=='1'">已同意</template>
                        <template v-if="dataList.content[scope.$index].auditStatus=='2'">已拒绝</template>
                    </template>
                </el-table-column>
                <el-table-column prop="check1.name" label="审核人" width="120"></el-table-column>
                <el-table-column prop="memo" label="备注" min-width="100"></el-table-column>
                <el-table-column prop="createTime" label="创建日期" width="180"></el-table-column>
                <el-table-column fixed="right" label="操作" width="160">
                    <template slot-scope="scope">
                        <el-button type="plain" size="small" @click.native.prevent="showDetail(scope.$index, dataList.content)" v-if="dataList.content[scope.$index].auditStatus=='1'">查看</el-button>
                        <!-- <el-button type="plain" size="small" @click.native.prevent="showPay(scope.$index, dataList.content)" v-if="dataList.content[scope.$index].status=='02' && dataList.content[scope.$index].paymentStatus=='01'">付款</el-button> -->
                        <template v-if="dataList.content[scope.$index].auditStatus=='0'">
                            <!-- <el-popover ref="pop" placement="bottom" trigger="click"> -->
                                <el-button type="text" size="small" @click.native.prevent="showEdit(scope.$index, dataList.content)">编辑</el-button>
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

        <!-- <el-dialog title="添加付款明细" :visible.sync="addAccountState" size="tiny">
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
        </el-dialog> -->

        <el-dialog title="添加明细" :visible.sync="addCollectState" size="large">
            <el-form :inline="true">
                <el-form-item>
                    <el-select v-model="innerSStatus" clearable placeholder="商品状态">
                        <el-option label="正常" value="01"></el-option>
                        <el-option label="已出售" value="02"></el-option>
                        <el-option label="已出库" value="03"></el-option>
                        <el-option label="待完善" value="04"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item><el-input v-model="innerSName" placeholder="商品名称"></el-input></el-form-item>
                <el-form-item><el-input v-model="innerSTel" placeholder="商品编号"></el-input></el-form-item>
                <el-form-item><el-button icon="search" @click="reInnerData">查询</el-button></el-form-item>
            </el-form>
            <el-table :data="oddNumList.content" border style="width: 100%" max-height="500" v-loading="oddNumLoading" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="operator" label="商品图片" min-width="160">
                    <template slot-scope="scope">
                        <img :src="thumb+oddNumList.content[scope.$index].coverImg" style="width: 120px;display: block;margin: 10px 0;" @click="openImg(file+oddNumList.content[scope.$index].coverImg)">
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="商品编号" min-width="100"></el-table-column>
                <el-table-column prop="categoryName" label="商品分类" min-width="100"></el-table-column>
                <el-table-column prop="brandName" label="商品品牌" min-width="100"></el-table-column>
                <el-table-column prop="typeName" label="商品型号" min-width="200"></el-table-column>
                <el-table-column prop="name" label="商品名称" min-width="200"></el-table-column>
                <el-table-column prop="costPrice" label="成本价" min-width="100"></el-table-column>
                <el-table-column prop="price" label="同行价" min-width="100"></el-table-column>
                <el-table-column prop="customerPrice" label="客户价" min-width="100"></el-table-column>
                <el-table-column prop="status" label="商品状态" min-width="100">
                    <template slot-scope="scope">
                        <template v-if="oddNumList.content[scope.$index].status=='01'">正常</template>
                        <template v-if="oddNumList.content[scope.$index].status=='02'">已出售</template>
                        <template v-if="oddNumList.content[scope.$index].status=='03'">已出库</template>
                        <template v-if="oddNumList.content[scope.$index].status=='04'">待完善</template>
                    </template>
                </el-table-column>
                <el-table-column prop="operator.name" label="操作人" min-width="100"></el-table-column>
            </el-table>
            <el-row>
                <el-col :span="24" style="overflow:hidden;margin-top:20px">
                    <el-pagination @current-change="curChange" :current-page.sync="curPage" :page-size="pSize" layout="prev, pager, next, jumper" :total="oddNumList.totalElements" style="float:left"></el-pagination>
                    <el-button type="primary" @click="chooseGoods" style="float:left">选择</el-button>
                </el-col>
            </el-row>
        </el-dialog>

        <!-- <el-dialog title="添加寄卖单" :visible.sync="addState" size="large">
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
                                    <el-table :data="oddNumList.content" border style="width: 100%;max-height:500px" v-loading="oddNumLoading" height="400">
                                        <el-table-column min-width="100" property="name" label="名称"></el-table-column>
                                        <el-table-column width="100" property="contact" label="联系人"></el-table-column>
                                        <el-table-column width="140" property="tel" label="联系电话"></el-table-column>
                                        <el-table-column min-width="100" property="payBank" label="开户行"></el-table-column>
                                        <el-table-column min-width="100" property="payName" label="开户支行"></el-table-column>
                                        <el-table-column min-width="100" property="payAccount" label="收款账号"></el-table-column>
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
                    <el-col :span="24">
                        <el-form-item label="联系地址" prop="">
                            <el-input v-model="form.address" disabled></el-input>
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
        </el-dialog> -->

        <el-dialog title="添加" :visible.sync="modifyState" size="large">
            <el-form ref="modifyForm" :model="modifyForm" :rules="modifyRules" label-width="100px" v-loading="modifyLoading">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注" prop="">
                            <el-input v-model="modifyForm.memo"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="明细">
                    <el-table :data="purchaseList" border style="width: 100%" max-height="500">
                        <el-table-column prop="operator" label="商品图片" min-width="160">
                        <template slot-scope="scope">
                            <img :src="thumb+purchaseList[scope.$index].coverImg" style="width: 120px;display: block;margin: 10px 0;" @click="openImg(file+purchaseList[scope.$index].coverImg)">
                        </template>
                        </el-table-column>
                        <el-table-column prop="id" label="商品编号" min-width="100"></el-table-column>
                        <el-table-column prop="categoryName" label="商品分类" min-width="100"></el-table-column>
                        <el-table-column prop="brandName" label="商品品牌" min-width="100"></el-table-column>
                        <el-table-column prop="typeName" label="商品型号" min-width="200"></el-table-column>
                        <el-table-column prop="name" label="商品名称" min-width="200"></el-table-column>
                        <el-table-column prop="costPrice" label="成本价" min-width="100"></el-table-column>
                        <el-table-column prop="price" label="同行价" min-width="100"></el-table-column>
                        <el-table-column prop="customerPrice" label="客户价" min-width="100"></el-table-column>
                        <el-table-column prop="status" label="商品状态" min-width="100">
                            <template slot-scope="scope">
                                <template v-if="purchaseList[scope.$index].status=='01'">正常</template>
                                <template v-if="purchaseList[scope.$index].status=='02'">已出售</template>
                                <template v-if="purchaseList[scope.$index].status=='03'">已出库</template>
                                <template v-if="purchaseList[scope.$index].status=='04'">待完善</template>
                            </template>
                        </el-table-column>
                        <el-table-column prop="operator.name" label="操作人" min-width="100"></el-table-column>
                        <el-table-column fixed="right" label="操作" width="70">
                            <template slot-scope="scope">
                                <template>
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
                    <el-col :span="24">
                        <el-form-item label="备注" prop="">
                            <el-input v-model="editForm.memo"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="明细">
                    <el-table :data="purchaseList" border style="width: 100%" max-height="500">
                        <el-table-column prop="operator" label="商品图片" min-width="160">
                        <template slot-scope="scope">
                            <img :src="thumb+purchaseList[scope.$index].coverImg" style="width: 120px;display: block;margin: 10px 0;" @click="openImg(file+purchaseList[scope.$index].coverImg)">
                        </template>
                        </el-table-column>
                        <el-table-column prop="id" label="商品编号" min-width="100"></el-table-column>
                        <el-table-column prop="categoryName" label="商品分类" min-width="100"></el-table-column>
                        <el-table-column prop="brandName" label="商品品牌" min-width="100"></el-table-column>
                        <el-table-column prop="typeName" label="商品型号" min-width="200"></el-table-column>
                        <el-table-column prop="name" label="商品名称" min-width="200"></el-table-column>
                        <el-table-column prop="costPrice" label="成本价" min-width="100"></el-table-column>
                        <el-table-column prop="price" label="同行价" min-width="100"></el-table-column>
                        <el-table-column prop="customerPrice" label="客户价" min-width="100"></el-table-column>
                        <el-table-column prop="status" label="商品状态" min-width="100">
                            <template slot-scope="scope">
                                <template v-if="purchaseList[scope.$index].status=='01'">正常</template>
                                <template v-if="purchaseList[scope.$index].status=='02'">已出售</template>
                                <template v-if="purchaseList[scope.$index].status=='03'">已出库</template>
                                <template v-if="purchaseList[scope.$index].status=='04'">待完善</template>
                            </template>
                        </el-table-column>
                        <el-table-column prop="operator.name" label="操作人" min-width="100"></el-table-column>
                        <el-table-column fixed="right" label="操作" width="70">
                            <template slot-scope="scope">
                                <template>
                                    <el-button type="text" size="small" @click.native.prevent="purchaseDelete(scope.$index, purchaseList)">删除</el-button>
                                </template>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item>
                    <el-button @click="addCollectState = true">添加明细</el-button>
                    <el-button type="primary" @click="edit('editForm')">保存</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog title="查看详情" :visible.sync="showState" size="large">
            <el-form :model="showForm" label-width="100px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注" prop="">
                            <el-input v-model="showForm.memo"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="明细">
                    <el-table :data="purchaseList" border style="width: 100%" max-height="500">
                        <el-table-column prop="operator" label="商品图片" min-width="160">
                        <template slot-scope="scope">
                            <img :src="thumb+purchaseList[scope.$index].coverImg" style="width: 120px;display: block;margin: 10px 0;" @click="openImg(file+purchaseList[scope.$index].coverImg)">
                        </template>
                        </el-table-column>
                        <el-table-column prop="backstatus" label="归还状态" min-width="100">
                            <template slot-scope="scope">
                                <template v-if="purchaseList[scope.$index].backstatus=='1'">已借出</template>
                                <template v-if="purchaseList[scope.$index].backstatus=='2'">已归还</template>
                            </template>
                        </el-table-column>
                        <el-table-column prop="id" label="商品编号" min-width="100"></el-table-column>
                        <el-table-column prop="categoryName" label="商品分类" min-width="100"></el-table-column>
                        <el-table-column prop="brandName" label="商品品牌" min-width="100"></el-table-column>
                        <el-table-column prop="typeName" label="商品型号" min-width="200"></el-table-column>
                        <el-table-column prop="name" label="商品名称" min-width="200"></el-table-column>
                        <el-table-column prop="costPrice" label="成本价" min-width="100"></el-table-column>
                        <el-table-column prop="price" label="同行价" min-width="100"></el-table-column>
                        <el-table-column prop="customerPrice" label="客户价" min-width="100"></el-table-column>
                        <el-table-column prop="status" label="商品状态" min-width="100">
                            <template slot-scope="scope">
                                <template v-if="purchaseList[scope.$index].status=='01'">正常</template>
                                <template v-if="purchaseList[scope.$index].status=='02'">已出售</template>
                                <template v-if="purchaseList[scope.$index].status=='03'">已出库</template>
                                <template v-if="purchaseList[scope.$index].status=='04'">待完善</template>
                            </template>
                        </el-table-column>
                        <el-table-column prop="operator.name" label="操作人" min-width="100"></el-table-column>
                        <el-table-column fixed="right" label="操作" width="70">
                            <template slot-scope="scope">
                                <template>
                                    <el-button type="text" size="small" v-if="purchaseList[scope.$index].backstatus=='1'" @click.native.prevent="purchaseBack(scope.$index, purchaseList)">归还</el-button>
                                </template>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="showState = false">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog title="审核" :visible.sync="verifyState" size="small">
            <el-form :model="verifyForm" label-width="100px">

                <el-form-item label="审核状态" prop="name">
                    <el-select v-model="verifyForm.auditStatus" placeholder="">
                        <el-option :label="'通过'" :value="1"></el-option>
                        <el-option :label="'拒绝'" :value="2"></el-option>
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

        <!-- <el-dialog title="付款" :visible.sync="payState" size="large">
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
                        <el-form-item label="制单时间" prop="">
                            <el-input v-model="payForm.createTime" disabled></el-input>
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
        </el-dialog> -->

        <!-- <el-dialog title="入库" :visible.sync="goodsinState" size="large">
            <el-form :model="goodsinForm" label-width="100px">
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
                <el-form-item label="采购明细" v-if="purchaseList.length>0">
                    <el-table :data="purchaseList" border style="width: 100%">
                        <el-table-column min-width="100" property="id" label="产品ID"></el-table-column>
                        <el-table-column width="100" property="categoryName" label="品类名称"></el-table-column>
                        <el-table-column width="100" property="brandName" label="品牌名称"></el-table-column>
                        <el-table-column min-width="180" property="typeName" label="型号名称"></el-table-column>
                        <el-table-column min-width="200" property="name" label="名称"></el-table-column>
                        <el-table-column width="80" property="number" label="数量"></el-table-column>
                        <el-table-column width="90" property="price" label="成本价"></el-table-column>
                        <el-table-column width="90" property="samePrice" label="同行价"></el-table-column>
                        <el-table-column width="160" property="sameRate" label="同行销售提成"></el-table-column>
                        <el-table-column width="80" property="customerPrice" label="客户价"></el-table-column>
                        <el-table-column width="160" property="customerRate" label="客户销售提成"></el-table-column>
                        <el-table-column min-width="180" property="memo" label="备注"></el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="goodsin">确定</el-button>
                </el-form-item>
                </el-col>
            </el-form>
        </el-dialog> -->

    </div>
</template>

<script>
import api from '../../util/api'
import ajax from '../../util/ajax'
export default {
    name: 'rentedManagement',
    mixins: [ajax],
    data () {
        return {
            idSearch: '',
            statusSearch: '',
            paymentStatusSearch: '',
            oddNumListSearch: '',
            dataList: '',
            currentPage: 1,
            pageSize: 20,
            loading: false,

            file: '',
            thumb: '',

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

            modifyState: false,
            modifyLoading: false,
            modifyForm: {
                memo: '',
            },
            modifyRules: {

            },
            price: '',
            goodsNumber: '',

            categoryList: '',//品类
            categoryLoading: false,

            goodsTypeList: '',//型号
            goodsTypeLoading: false,
            goodsTypeDis: true,

            oddNumList: [],
            oddNumLoading: false,

            collectState: false,
            addCollectState: false,

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
                id: '',
                operator: {
                    name: '',
                },
                createTime: '',
            },

            verifyState: false,//审核
            verifyForm: {
                auditStatus: 1,
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

            curPage: 1,
            pSize: 10,
            innerSName: '',
            innerSTel: '',
            innerSStatus: '',

            multipleSelection: [],

        }
    },
    created(){
        var _vue=this
        this.autoHeight=window.innerHeight-160
        window.onresize=function(){_vue.autoHeight=window.innerHeight-160}

        this.reData()

        this.thumb = api.thumb + '/'
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
                _searchData+='&auditStatus='+this.paymentStatusSearch
            }
            this.fetchData(api.rentedManagement+'?sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
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
                _searchData+='&auditStatus='+this.paymentStatusSearch
            }
            this.fetchData(api.rentedManagement+'?sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
                this.dataList=data
                this.loading=false
                console.log(data)
                this.$forceUpdate()
            })
        },
        curChange(val) {
            let _searchData = ''
            this.oddNumLoading=true
            if(this.innerSName){
                _searchData+='&keyword='+this.innerSName
            }
            if(this.innerSStatus){
                _searchData+='&status='+this.innerSStatus
            }
            if(this.innerSTel){
                _searchData+='&purchaseDetail.id='+this.innerSTel
            }
            this.fetchData(api.baseManagement+'?rentedStatus=false&page='+(this.curPage-1)+'&size='+this.pSize+_searchData,'',(data) => {
                this.oddNumList=data
                this.oddNumLoading=false
            })
        },
        reInnerData() {
            this.curPage=1
            let _searchData = ''
            this.oddNumLoading=true
            if(this.innerSName){
                _searchData+='&keyword='+this.innerSName
            }
            if(this.innerSStatus){
                _searchData+='&status='+this.innerSStatus
            }
            if(this.innerSTel){
                _searchData+='&purchaseDetail.id='+this.innerSTel
            }
            this.fetchData(api.baseManagement+'?rentedStatus=false&page='+(this.curPage-1)+'&size='+this.pSize+_searchData,'',(data) => {
                this.oddNumList=data
                this.oddNumLoading=false
            })
        },
        add(form) {
            // this.form.id=this.form.id.toString()
            // this.$refs[form].validate((valid) => {
            //     if (valid) {
            //         this.addLoading=true
            //         let _p={
            //             supplier: {
            //                 id: this.form.id,
            //             },
            //             memo: this.form.memoA,
            //             jm: true,
            //         }
            //         this.subForm(api.jmgoodsinManagement,_p,(data) => {
            //             this.addLoading=false
            //             this.addState=false
            //             this.reData()
            //             this.$message({ message: '恭喜你，添加成功', type: 'success' })
            //         })
            //     } else { return false }
            // })
        },
        showEdit(index , data){
            this.reInnerData()
            this.purchaseList=[]
            this.editId = data[index].id
            this.editForm.memo = data[index].memo
            this.fetchData(api.rentedDetail+'?refId='+data[index].id,'',(redata) => {
                for(let i in redata){
                    this.purchaseList.push(redata[i].jxcGoods)
                }
            })
            this.editState=true
        },
        edit(editForm) {
            this.$refs[editForm].validate((valid) => {
                if (valid) {
                    this.addLoading=true
                    let _p = {
                        id:this.editId,
                        memo:this.editForm.memo,
                        detailList:[]
                    }
                    for(let i in this.purchaseList){
                        _p.detailList.push({
                            jxcGoods:{
                                id:this.purchaseList[i].id
                            }
                        })
                    }
                    this.subForm(api.rentedManagement,_p,(data) => {
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
                this.deleteData(api.rentedManagement+'/'+data[index].id,'',(data) => {
                    this.reData()
                    this.$message({ type: 'success', message: '删除成功!' })
                })
            }).catch(() => { })
        },
        showDetail(index , data){
            this.purchaseList=[]
            this.showForm.memo = data[index].memo
            this.fetchData(api.rentedDetail+'?refId='+data[index].id,'',(redata) => {
                for(let i in redata){
                    redata[i].jxcGoods.backstatus=redata[i].status
                    redata[i].jxcGoods.backid=redata[i].id
                    this.purchaseList.push(redata[i].jxcGoods)
                }
            })
            this.showState = true
        },
        modify(modifyForm) {
            this.$refs[modifyForm].validate((valid) => {
                if (valid) {
                    this.modifyLoading=true
                    let _p = {
                        memo:this.modifyForm.memo,
                        detailList:[]
                    }
                    for(let i in this.purchaseList){
                        _p.detailList.push({
                            jxcGoods:{
                                id:this.purchaseList[i].id
                            }
                        })
                    }
                    this.subForm(api.rentedManagement,_p,(data) => {
                        this.modifyState=false
                        this.modifyLoading=false
                        this.reData()
                        this.$message({message: '恭喜你，保存成功',type: 'success'})
                    })
                } else { return false }
            })
        },
        oddRemoteMethod() {
            this.purchaseList=[]
            this.modifyState=true
            this.reInnerData()
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
                    console.log(data)
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
                    console.log(this.categoryList)
                })
            }else{
                this.categoryLoading=false
            }
        },
        goodsTypeChange(data){
            console.log(data)
        },
        addDetailForm() {//把明细加到表格里面
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
            }
            this.purchaseList.push(_p)
            this.addCollectState=false
        },
        purchaseDelete(index , data) {
            data.splice(index, 1)
        },
        showVerify(index , data){
            this.verifyId=data[index].id
            this.verifyState=true
        },
        subVerify(){
            this.patchData(api.rentedManagement+'/check/'+this.verifyId,this.verifyForm,(data) => {
                this.reData()
                this.verifyState=false
                this.$message({ message: '恭喜你，审核成功', type: 'success' })
            })
        },
        showPay(index , data) {
            console.log(data[index])
            this.refId = data[index].id
            this.price = data[index].price
            this.goodsNumber = data[index].goodsNumber
            if(data[index].operator){
                this.payForm=data[index].operator
            }
            this.purchaseList=[]
            this.fetchData(api.purchaseDetail+'?refId='+this.refId,'',(redata) => {
                if(!!redata.content){
                    this.purchaseList = redata.content
                }
            })
            this.payState = true
        },
        showAccount(state){//查找付款账户
            if(state && !this.accountList){
                this.accountLoading=true
                this.fetchData(api.account,'',(data) => {
                    this.accountList=data.content
                    this.accountLoading=false
                    console.log(data)
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
            console.log(this.payList)
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
                    this.subForm(api.jmgoodsinManagement+'/payment?id='+this.refId,_data,(data) => {
                        this.payState=false
                        this.reData()
                        this.$message({message: '恭喜你，保存成功',type: 'success'})
                    })
                } else { return false }
            })
        },
        showGoodsin(index , data){
            this.refId = data[index].id
            console.log(data[index])
            this.goodsinForm = data[index]
            this.purchaseList=[]
            this.fetchData(api.purchaseDetail+'?refId='+this.refId,'',(redata) => {
                if(!!redata.content){
                    this.purchaseList = redata.content
                }
            })
            this.goodsinState = true
        },
        goodsin(){
            let _arr = []
            for(let i in this.purchaseList){
                _arr.push({
                    purchaseGoodsId:this.purchaseList[i].id,
                    memo:this.purchaseList[i].memo
                })
            }
            let _p = {
                jxcPurchase:{id:this.goodsinForm.id},
                number: this.goodsinForm.goodsNumber,
                price: this.goodsinForm.price,
                memo: this.goodsinForm.memo,
                detailList: _arr,
                jm: true,
            }
            this.subForm(api.jmgoodsinManagement+'/goodsin?id='+this.refId,_p,(data) => {
                this.goodsinState=false
                this.reData()
                this.$message({ message: '恭喜你，入库成功', type: 'success' })
            })
        },
        visibleChange(data) {
            this.selectLoading = true
            if(data){
                this.fetchData(api.supplier,'',(data) => {
                    console.log(data)
                    this.oddNumListSearch=data
                    this.selectLoading=false
                })
            }
        },
        chooseGoods(){
            for(let i in this.multipleSelection){
                this.purchaseList.push(this.multipleSelection[i])
            }
            this.addCollectState=false
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        purchaseBack(index,data){
            this.$confirm('确定归还吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
                this.subForm(api.rentedManagement+'/revert?id='+data[index].backid,'',(redata) => {
                    data[index].backstatus=2
                    this.$message({ type: 'success', message: '操作成功!' })
                })
            }).catch(() => { })
        },
    }
}
</script>