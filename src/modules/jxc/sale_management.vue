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
                        <el-select v-model="statusSearch" clearable placeholder="状态">
                            <el-option label="待审核" value="01"></el-option>
                            <el-option label="已审核" value="02"></el-option>
                            <el-option label="已拒绝" value="09"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="">
                        <el-select v-model="paymentStatusSearch" clearable placeholder="收款状态">
                            <el-option label="待收款" value="01"></el-option>
                            <el-option label="已收款" value="02"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="">
                        <el-input v-model="nameSearch" placeholder="客户姓名"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button icon="search" @click="reData">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <template>
            <el-table :data="dataList.content" border style="width: 100%" :height="autoHeight" v-loading="loading">
                <el-table-column prop="id" label="销售单编号" width="120"></el-table-column>
                <el-table-column prop="customer.name" label="客户" min-width="100"></el-table-column>
                <el-table-column prop="price" label="销售金额" width="100"></el-table-column>
                <el-table-column prop="goodsNumber" label="商品数量" width="100"></el-table-column>
                <el-table-column prop="status" label="状态" width="100">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].status=='01'">待审核</template>
                        <template v-if="dataList.content[scope.$index].status=='02'">已审核</template>
                        <template v-if="dataList.content[scope.$index].status=='09'">拒绝</template>
                    </template>
                </el-table-column>
                <el-table-column prop="paymentStatus" label="收款状态" width="100">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].paymentStatus=='01'">待收款</template>
                        <template v-if="dataList.content[scope.$index].paymentStatus=='02'">已收款</template>
                    </template>
                </el-table-column>
                <el-table-column prop="saleChannel" label="销售渠道" width="100">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].saleChannel=='01'">微信</template>
                        <template v-if="dataList.content[scope.$index].saleChannel=='02'">线下</template>
                        <template v-if="dataList.content[scope.$index].saleChannel=='03'">平台</template>
                    </template>
                </el-table-column>
                <el-table-column prop="check1.name" label="审核人" width="100"></el-table-column>
                <el-table-column prop="seller.name" label="销售员" width="100"></el-table-column>
                <el-table-column prop="memo" label="备注" width="100"></el-table-column>
                <el-table-column prop="createTime" label="创建日期" width="180"></el-table-column>
                <el-table-column prop="updateTime" label="更新日期" width="180"></el-table-column>
                <el-table-column fixed="right" label="操作" width="210">
                    <template slot-scope="scope">

                        <el-button type="plain" size="small" @click.native.prevent="showDetail(scope.$index, dataList.content)" v-if="dataList.content[scope.$index].paymentStatus=='02'">查看</el-button>
                        <el-button type="plain" size="small" @click.native.prevent="showPay(scope.$index, dataList.content)" v-if="dataList.content[scope.$index].status=='02' && dataList.content[scope.$index].paymentStatus=='01'">收款</el-button>
                        <!-- <el-button type="plain" size="small" @click.native.prevent="showGoodsin(scope.$index, dataList.content)" v-if="dataList.content[scope.$index].paymentStatus=='02' && dataList.content[scope.$index].status=='02'">出库</el-button> -->
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

        <el-dialog title="添加收款明细" :visible.sync="addAccountState" size="tiny">
            <el-form label-width="80px" :model="accountForm">
                <el-form-item label="收款账户">
                    <el-select v-model="accountForm.account" filterable placeholder="请选择" :loading="accountLoading" @visible-change="showAccount">
                        <el-option v-for="(item , index) in accountList" :key="item.id" :label="item.name" :value="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="收款类型">
                    <el-select v-model="accountForm.account" disabled>
                        <el-option v-for="(item , index) in accountList" v-if="item.type=='1'" :key="item.id" :label="'银行账户'" :value="index"></el-option>
                        <el-option v-for="(item , index) in accountList" v-if="item.type=='2'" :key="item.id" :label="'微信账户'" :value="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="收款金额">
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

        <el-dialog title="添加明细" :visible.sync="addCollectState" size="large">
            <el-form :inline="true">
                <el-form-item><el-input v-model="innerSName" placeholder="商品名称"></el-input></el-form-item>
                <el-form-item><el-button icon="search" @click="reInnerData">查询</el-button></el-form-item>
            </el-form>
            <el-table :data="goodsList.content" border style="width: 100%" height="350" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="id" label="编号" width="100"></el-table-column>
                <el-table-column prop="name" label="商品名称" min-width="320"></el-table-column>
                <el-table-column prop="brandName" label="品牌" min-width="100"></el-table-column>
                <el-table-column prop="typeName" label="型号" min-width="100"></el-table-column>
                <el-table-column prop="price" label="同行价" width="100"></el-table-column>
                <el-table-column prop="customerPrice" label="客户价" width="100"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" min-width="100"></el-table-column>
            </el-table>
            <el-row>
                <el-col :span="24" style="overflow:hidden;margin-top:20px">
                    <el-pagination @current-change="curChange" :current-page.sync="curPage" :page-size="pSize" layout="prev, pager, next, jumper" :total="goodsList.totalElements" style="float:left"></el-pagination>
                    <el-button type="primary" @click="chooseGoods" style="float:left">选择</el-button>
                </el-col>
            </el-row>
        </el-dialog>

        <el-dialog title="添加销售单" :visible.sync="addState" size="large">
            <el-form ref="form" :model="form" :rules="rules" label-width="100px" v-loading="addLoading">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="客户姓名" prop="name">
                            <el-select v-model="form.customer.id" filterable remote placeholder="请输入姓名或手机号" :remote-method="oddRemoteMethod" :loading="oddNumLoading" clearable style="width:100%" @change="oddChange">
                                <el-option v-for="item in oddNumList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="客户性别" prop="">
                            <template v-if="oddSelect.sex=='02'">
                                <el-input value="女" disabled></el-input>
                            </template>
                            <template v-if="oddSelect.sex=='01'">
                                <el-input value="男" disabled></el-input>
                            </template>
                            <template v-if="!oddSelect">
                                <el-input disabled></el-input>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="身份证号" prop="">
                            <el-input v-model="oddSelect.paperNumber" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="客户电话" prop="">
                            <el-input v-model="oddSelect.tel" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="客户类型" prop="">
                            <template v-if="oddSelect.customerType=='10'">
                                <el-input value="同行" disabled></el-input>
                            </template>
                            <template v-if="oddSelect.customerType=='11'">
                                <el-input value="客户" disabled></el-input>
                            </template>
                            <template v-if="!oddSelect">
                                <el-input disabled></el-input>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="客户地址" prop="">
                            <el-input v-model="oddSelect.addr" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="客户来源" prop="">
                            <template v-if="oddSelect.customerOrigin=='10'">
                                <el-input value="散客" disabled></el-input>
                            </template>
                            <template v-if="oddSelect.customerOrigin=='11'">
                                <el-input value="咸鱼" disabled></el-input>
                            </template>
                            <template v-if="oddSelect.customerOrigin=='12'">
                                <el-input value="平台" disabled></el-input>
                            </template>
                            <template v-if="!oddSelect">
                                <el-input disabled></el-input>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="销售员" prop="">
                            <el-select v-model="form.seller.id" clearable placeholder="请选择" style="width:100%">
                                <el-option v-for="item in userSaleList" :label="item.user.name" :value="item.user.id" :key="item.user.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="销售渠道" prop="">
                            <el-select v-model="form.saleChannel" clearable placeholder="请选择" style="width:100%">
                                <el-option label="微信" value="01"></el-option>
                                <el-option label="线下" value="02"></el-option>
                                <el-option label="平台" value="03"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="16">
                        <el-form-item label="备注" prop="">
                            <el-input v-model="form.memo"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="销售时间" prop="">
                            <el-date-picker v-model="form.saleTime" type="datetime" placeholder="选择日期时间" style="width:100%"></el-date-picker>
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
                        <el-form-item label="客户姓名" prop="name">
                            <el-select v-model="modifyForm.customer.id" filterable remote placeholder="请输入姓名或手机号" :remote-method="oddRemoteMethod" :loading="oddNumLoading" clearable style="width:100%" @change="oddChange" disabled>
                                <el-option v-for="item in oddNumList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="客户性别" prop="">
                            <template v-if="oddSelect.sex=='02'">
                                <el-input value="女" disabled></el-input>
                            </template>
                            <template v-if="oddSelect.sex=='01'">
                                <el-input value="男" disabled></el-input>
                            </template>
                            <template v-if="!oddSelect">
                                <el-input disabled></el-input>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="身份证号" prop="">
                            <el-input v-model="oddSelect.paperNumber" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="客户电话" prop="">
                            <el-input v-model="oddSelect.tel" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="客户类型" prop="">
                            <template v-if="oddSelect.customerType=='10'">
                                <el-input value="同行" disabled></el-input>
                            </template>
                            <template v-if="oddSelect.customerType=='11'">
                                <el-input value="客户" disabled></el-input>
                            </template>
                            <template v-if="!oddSelect">
                                <el-input disabled></el-input>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="客户地址" prop="">
                            <el-input v-model="oddSelect.addr" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="客户来源" prop="">
                            <template v-if="oddSelect.customerOrigin=='10'">
                                <el-input value="散客" disabled></el-input>
                            </template>
                            <template v-if="oddSelect.customerOrigin=='11'">
                                <el-input value="咸鱼" disabled></el-input>
                            </template>
                            <template v-if="oddSelect.customerOrigin=='12'">
                                <el-input value="平台" disabled></el-input>
                            </template>
                            <template v-if="!oddSelect">
                                <el-input disabled></el-input>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="销售员" prop="">
                            <el-select v-model="modifyForm.seller.id" clearable placeholder="请选择" style="width:100%" disabled>
                                <el-option v-for="item in userSaleList" :label="item.user.name" :value="item.user.id" :key="item.user.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="销售渠道" prop="">
                            <el-select v-model="modifyForm.saleChannel" clearable placeholder="请选择" style="width:100%" disabled>
                                <el-option label="微信" value="01"></el-option>
                                <el-option label="线下" value="02"></el-option>
                                <el-option label="平台" value="03"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="16">
                        <el-form-item label="备注" prop="">
                            <el-input v-model="modifyForm.memo" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="销售时间" prop="">
                            <el-date-picker v-model="modifyForm.saleTime" type="datetime" placeholder="" disabled style="width:100%"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="销售单明细" v-if="purchaseList.length>0">
                    <el-table :data="purchaseList" border style="width: 100%" height="200">
                        <el-table-column width="100" property="id" label="商品编号"></el-table-column>
                        <el-table-column min-width="200" property="name" label="商品名称"></el-table-column>
                        <el-table-column width="110" property="goodsReturn" label="是否退货">
                            <template slot-scope="scope">
                                <template v-if="purchaseList[scope.$index].goodsReturn">已退货</template>
                                <template v-else>正常</template>
                            </template>
                        </el-table-column>
                        <el-table-column width="100" property="price" label="同行价"></el-table-column>
                        <el-table-column width="100" property="customerPrice" label="客户价"></el-table-column>
                        <el-table-column width="160" property="salePrice" label="销售价">
                            <template slot-scope="scope">
                                <el-input-number v-model="purchaseList[scope.$index].salePrice" :controls="false" :step="0.1" :min="0" style="width:100%"></el-input-number>
                            </template>
                        </el-table-column>
                        <el-table-column width="80" property="number" label="数量"></el-table-column>
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
                    <el-button @click="addDetail">添加明细</el-button>
                    <el-button type="primary" @click="modify('modifyForm')">保存</el-button>
                </el-form-item>
                </el-col>
            </el-form>
        </el-dialog>

        <el-dialog title="编辑销售单" :visible.sync="editState" size="large">
            <el-form ref="editForm" :model="editForm" :rules="editRules" label-width="100px" v-loading="editLoading">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="客户姓名" prop="name">
                            <el-select v-model="editForm.customer.id" filterable remote placeholder="请输入姓名或手机号" :remote-method="oddRemoteMethod" :loading="oddNumLoading" clearable style="width:100%" @change="oddChange">
                                <el-option v-for="item in oddNumList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="客户性别" prop="">
                            <template v-if="oddSelect.sex=='02'">
                                <el-input value="女" disabled></el-input>
                            </template>
                            <template v-if="oddSelect.sex=='01'">
                                <el-input value="男" disabled></el-input>
                            </template>
                            <template v-if="!oddSelect">
                                <el-input disabled></el-input>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="身份证号" prop="">
                            <el-input v-model="oddSelect.paperNumber" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="客户电话" prop="">
                            <el-input v-model="oddSelect.tel" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="客户类型" prop="">
                            <template v-if="oddSelect.customerType=='10'">
                                <el-input value="同行" disabled></el-input>
                            </template>
                            <template v-if="oddSelect.customerType=='11'">
                                <el-input value="客户" disabled></el-input>
                            </template>
                            <template v-if="!oddSelect">
                                <el-input disabled></el-input>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="客户地址" prop="">
                            <el-input v-model="oddSelect.addr" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="客户来源" prop="">
                            <template v-if="oddSelect.customerOrigin=='10'">
                                <el-input value="散客" disabled></el-input>
                            </template>
                            <template v-if="oddSelect.customerOrigin=='11'">
                                <el-input value="咸鱼" disabled></el-input>
                            </template>
                            <template v-if="oddSelect.customerOrigin=='12'">
                                <el-input value="平台" disabled></el-input>
                            </template>
                            <template v-if="!oddSelect">
                                <el-input disabled></el-input>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="销售员" prop="">
                            <el-select v-model="editForm.seller.id" clearable placeholder="请选择" style="width:100%">
                                <el-option v-for="item in userSaleList" :label="item.user.name" :value="item.user.id" :key="item.user.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="销售渠道" prop="">
                            <el-select v-model="editForm.saleChannel" clearable placeholder="请选择" style="width:100%">
                                <el-option label="微信" value="01"></el-option>
                                <el-option label="线下" value="02"></el-option>
                                <el-option label="平台" value="03"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="16">
                        <el-form-item label="备注" prop="">
                            <el-input v-model="editForm.memo"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="销售时间" prop="">
                            <el-date-picker v-model="editForm.saleTime" type="datetime" placeholder="选择日期时间" style="width:100%"></el-date-picker>
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
                        <el-form-item label="客户姓名" prop="name">
                            <el-select v-model="showForm.customer.id" filterable remote placeholder="" :remote-method="oddRemoteMethod" :loading="oddNumLoading" clearable style="width:100%" @change="oddChange" disabled>
                                <el-option v-for="item in oddNumList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="客户性别" prop="">
                            <template v-if="oddSelect.sex=='02'">
                                <el-input value="女" disabled></el-input>
                            </template>
                            <template v-if="oddSelect.sex=='01'">
                                <el-input value="男" disabled></el-input>
                            </template>
                            <template v-if="!oddSelect">
                                <el-input disabled></el-input>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="身份证号" prop="">
                            <el-input v-model="oddSelect.paperNumber" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="客户电话" prop="">
                            <el-input v-model="oddSelect.tel" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="客户类型" prop="">
                            <template v-if="oddSelect.customerType=='10'">
                                <el-input value="同行" disabled></el-input>
                            </template>
                            <template v-if="oddSelect.customerType=='11'">
                                <el-input value="客户" disabled></el-input>
                            </template>
                            <template v-if="!oddSelect">
                                <el-input disabled></el-input>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="客户地址" prop="">
                            <el-input v-model="oddSelect.addr" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="客户来源" prop="">
                            <template v-if="oddSelect.customerOrigin=='10'">
                                <el-input value="散客" disabled></el-input>
                            </template>
                            <template v-if="oddSelect.customerOrigin=='11'">
                                <el-input value="咸鱼" disabled></el-input>
                            </template>
                            <template v-if="oddSelect.customerOrigin=='12'">
                                <el-input value="平台" disabled></el-input>
                            </template>
                            <template v-if="!oddSelect">
                                <el-input disabled></el-input>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="销售员" prop="">
                            <el-select v-model="showForm.seller.id" clearable placeholder="请选择" style="width:100%" disabled>
                                <el-option v-for="item in userSaleList" :label="item.user.name" :value="item.user.id" :key="item.user.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="销售渠道" prop="">
                            <el-select v-model="showForm.saleChannel" clearable placeholder="请选择" style="width:100%" disabled>
                                <el-option label="微信" value="01"></el-option>
                                <el-option label="线下" value="02"></el-option>
                                <el-option label="平台" value="03"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="16">
                        <el-form-item label="备注" prop="">
                            <el-input v-model="showForm.memo" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="销售时间" prop="">
                            <el-date-picker v-model="showForm.saleTime" type="datetime" placeholder="" disabled style="width:100%"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="销售单明细" v-if="purchaseList.length>0">
                    <el-table :data="purchaseList" border style="width: 100%" height="200">
                        <el-table-column width="100" property="id" label="商品编号"></el-table-column>
                        <el-table-column min-width="200" property="name" label="商品名称"></el-table-column>
                        <el-table-column width="100" property="price" label="同行价"></el-table-column>
                        <el-table-column width="110" property="goodsReturn" label="是否退货">
                            <template slot-scope="scope">
                                <template v-if="purchaseList[scope.$index].goodsReturn">已退货</template>
                                <template v-else>正常</template>
                            </template>
                        </el-table-column>
                        <el-table-column width="100" property="customerPrice" label="客户价"></el-table-column>
                        <el-table-column width="160" property="salePrice" label="销售价">
                            <template slot-scope="scope">
                                <el-input-number v-model="purchaseList[scope.$index].salePrice" :controls="false" :step="0.1" :min="0" style="width:100%" :disabled="true"></el-input-number>
                            </template>
                        </el-table-column>
                        <el-table-column width="80" property="number" label="数量"></el-table-column>
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

        <el-dialog title="收款" :visible.sync="payState" size="large">
            <el-form :model="payForm" :rules="payRules" ref="payForm" label-width="100px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="收款单号" prop="">
                            <el-input v-model="payForm.id" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="收款人员" prop="">
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
                    <el-col :span="8">
                        <el-form-item label="已付金额" prop="">
                            <el-input v-model="payMoney" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="剩余金额" prop="">
                            <el-input disabled :value="(price-payMoney).toFixed(2)"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="备注" prop="">
                    <el-input v-model="payForm.memo"></el-input>
                </el-form-item>
                <el-form-item label="收款明细" >
                    <el-table :data="payList" border style="width: 100%">
                        <el-table-column min-width="180" property="name" label="收款账户"></el-table-column>
                        <el-table-column width="100" property="type" label="收款类型">
                            <template slot-scope="scope">
                                <template v-if="payList[scope.$index].type=='1'">
                                    银行账户
                                </template>
                                <template v-if="payList[scope.$index].type=='2'">
                                    微信账户
                                </template>
                            </template>
                        </el-table-column>
                        <el-table-column width="100" property="money" label="收入金额"></el-table-column>
                        <el-table-column min-width="100" property="memo" label="备注"></el-table-column>
                        <el-table-column fixed="right" label="操作" width="70">
                            <template slot-scope="scope">
                                <el-button type="text" v-if="!payList[scope.$index].delete" size="small" @click.native.prevent="purchaseDelete(scope.$index, payList)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item>
                    <el-button @click="addAccountState = true">添加收款明细</el-button>
                    <el-button type="primary"  @click="pay('payForm')">保存</el-button>
                </el-form-item>
                </el-col>
            </el-form>
        </el-dialog>

        <el-dialog title="出库" :visible.sync="goodsinState" size="large">
            <el-form :model="goodsinForm" label-width="100px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="销售单号" prop="">
                            <el-input v-model="goodsinForm.id" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="销售人" prop="">
                            <el-input v-if="goodsinForm.operator" v-model="goodsinForm.operator.name" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="创建时间" prop="">
                            <el-input v-model="goodsinForm.createTime" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="销售明细" v-if="purchaseList.length>0">
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
                    <el-button type="primary" @click="goodsin">确定</el-button>
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
    name: 'saleManagement',
    mixins: [ajax],
    data () {
        return {
            statusSearch: '',
            paymentStatusSearch: '',
            nameSearch: '',
            dataList: '',
            currentPage: 1,
            pageSize: 20,
            loading: false,

            addState: false,
            addLoading: false,
            form: {
                customer: {
                    id: ''
                },
                saleChannel: '',
                memo: '',
                seller: {
                    id: ''
                },
                saleTime:'',
            },
            rules: {
                customer: [
                    { required: true, message: '请选择客户', trigger: 'blur' }
                ],
            },

            editForm: {
                customer: {
                    id: ''
                },
                saleChannel: '',
                memo: '',
                seller: {
                    id: ''
                },
                saleTime:'',
            },
            editRules: {

            },
            editLoading: false,
            editState:false,
            editMemo: '',

            modifyState: false,
            modifyLoading: false,
            modifyForm: {
                customer: {
                    id: ''
                },
                saleChannel: '',
                memo: '',
                seller: {
                    id: ''
                },
                saleTime:'',
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
            oddSelect: '',

            collectState: false,
            addCollectState: false,

            // detailForm: {
            //     category: '',
            //     goodsType: '',
            //     price: '',
            //     number: '',
            //     samePrice: '',
            //     customerPrice: '',
            //     memo: '',
            //     counterpartPercentage: '',//同行价利润提成比
            //     customerPercentage: '',//客户价利润提成比
            // },
            // counterpartProfit: '',//同行价利润
            // sellCounterpartPercentage: '',//同行销售比率
            // customerProfit: '',
            // sellCustomerPercentage: '',

            refId: '',

            purchaseList: [],

            showState: false,//查看明细状态
            showForm: {
                customer: {
                    id: ''
                },
                saleChannel: '',
                memo: '',
                seller: {
                    id: ''
                }
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

            userSaleList: '',

            goodsList: '',
            curPage: 1,
            pSize: 10,
            innerSName: '',
            multipleSelection: [],
            payMoney: '',
        }
    },
    created(){
        var _vue=this
        this.autoHeight=window.innerHeight-160
        window.onresize=function(){_vue.autoHeight=window.innerHeight-160}

        this.reData()

        this.file = api.file + '/'

        this.fetchData(api.user+'/sale','',(data) => {
            this.userSaleList=data
        })
    },
    mounted(){

    },
    updated(){
        
    },
    methods:{
        handleCurrentChange(val) {
            this.loading=true
            let _searchData = ''
            if(this.statusSearch){
                _searchData+='&status='+this.statusSearch
            }
            if(this.paymentStatusSearch){
                _searchData+='&paymentStatus='+this.paymentStatusSearch
            }
            if(this.nameSearch){
                _searchData+='&customerName='+this.nameSearch
            }
            this.fetchData(api.saleManagement+'?sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
                this.dataList=data
                this.loading=false
            })
        },
        reData() {
            this.loading=true
            // this.currentPage=1
            let _searchData = ''
            if(this.statusSearch){
                _searchData+='&status='+this.statusSearch
            }
            if(this.paymentStatusSearch){
                _searchData+='&paymentStatus='+this.paymentStatusSearch
            }
            if(this.nameSearch){
                _searchData+='&customerName='+this.nameSearch
            }
            this.fetchData(api.saleManagement+'?sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
                this.dataList=data
                this.loading=false
                console.log(data)
            })
        },
        curChange(val) {
            let _searchData = ''
            if(this.innerSName){
                _searchData+='&keyword='+this.innerSName
            }
            this.fetchData(api.baseManagement+'?status=01&page='+(this.curPage-1)+'&size='+this.pSize+_searchData,'',(data) => {
                this.goodsList=data
                console.log(data)
            })
        },
        reInnerData() {
            this.curPage=1
            let _searchData = ''
            if(this.innerSName){
                _searchData+='&keyword='+this.innerSName
            }
            this.fetchData(api.baseManagement+'?status=01&page='+(this.curPage-1)+'&size='+this.pSize+_searchData,'',(data) => {
                this.goodsList=data
                console.log(data)
            })
        },
        add(form) {
            this.$refs[form].validate((valid) => {
                console.log(this.form)
                if (valid) {
                    this.addLoading=true
                    this.subForm(api.saleManagement,this.form,(data) => {
                        this.addLoading=false
                        this.addState=false
                        this.reData()
                        this.$message({ message: '恭喜你，添加成功', type: 'success' })
                        this.form={
                            customer: {
                                id: ''
                            },
                            saleChannel: '',
                            memo: '',
                            seller: {
                                id: ''
                            }
                        }
                    })
                } else { return false }
            })
        },
        showEdit(index , data){
            this.oddSelect=data[index].customer
            this.oddNumList=[]
            this.oddNumList.push(data[index].customer)
            this.editForm.customer.id=data[index].customer.id
            this.editForm.seller.id=data[index].seller.id
            this.editForm.saleChannel=data[index].saleChannel
            this.editForm.memo=data[index].memo
            this.editForm.saleTime=data[index].saleTime
            this.editForm.id=data[index].id
            this.editState=true
        },
        edit(editForm) {
            this.$refs[editForm].validate((valid) => {
                if (valid) {
                    this.patchData(api.saleManagement+'/'+this.editForm.id,this.editForm,(data) => {
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
                this.deleteData(api.saleManagement+'/'+data[index].id,'',(data) => {
                    this.reData()
                    this.$message({ type: 'success', message: '删除成功!' })
                })
            }).catch(() => { })
        },
        showModify(index , data) {
            this.oddSelect=data[index].customer
            this.oddNumList=[]
            this.oddNumList.push(data[index].customer)
            this.modifyForm.customer.id=data[index].customer.id
            this.modifyForm.seller.id=data[index].seller.id
            this.modifyForm.saleChannel=data[index].saleChannel
            this.modifyForm.memo=data[index].memo
            this.modifyForm.saleTime=data[index].saleTime
            this.modifyForm.id=data[index].id

            this.fetchData(api.saleReportManagement+'?goodsSale.id='+this.modifyForm.id,'',(redata) => {
                this.purchaseList = []
                if(!!redata.content){
                    for(let i in redata.content){
                        let _d = {
                            id:redata.content[i].goods.id,
                            number:redata.content[i].number,
                            name:redata.content[i].goods.name,
                            price:redata.content[i].goods.price,
                            customerPrice:redata.content[i].goods.customerPrice,
                            salePrice:redata.content[i].price,
                        }
                        this.purchaseList.push(_d)
                    }
                }
            })

            this.modifyState=true
        },
        showDetail(index , data){
            console.log(data[index])
            this.oddSelect=data[index].customer
            this.oddNumList=[]
            this.oddNumList.push(data[index].customer)

            this.showForm.customer.id=data[index].customer.id
            
            this.showForm.seller.id=data[index].seller.id
            this.showForm.saleChannel=data[index].saleChannel
            this.showForm.saleTime=data[index].saleTime
            this.showForm.memo=data[index].memo
            this.showForm.id=data[index].id

            this.fetchData(api.saleReportManagement+'?goodsSale.id='+this.showForm.id,'',(redata) => {
                console.log(redata)
                this.purchaseList = []
                if(!!redata.content){
                    for(let i in redata.content){
                        let _d = {
                            id:redata.content[i].goods.id,
                            number:redata.content[i].number,
                            name:redata.content[i].goods.name,
                            price:redata.content[i].goods.price,
                            customerPrice:redata.content[i].goods.customerPrice,
                            salePrice:redata.content[i].price,
                        }
                        this.purchaseList.push(_d)
                    }
                }
            })
            this.showState = true
        },
        modify(modifyForm) {
            console.log(this.purchaseList)
            this.$refs[modifyForm].validate((valid) => {
                if (valid) {
                    // this.modifyLoading=true
                    let _p = []
                    for(let i in this.purchaseList){
                        // if(!!this.purchaseList[i].deleteState){
                            let _d={
                                goods: {
                                    id: this.purchaseList[i].id
                                },
                                goodsSale: {
                                    id: this.modifyForm.id
                                },
                                price: this.purchaseList[i].salePrice,
                                number: this.purchaseList[i].number
                            }
                            _p.push(_d)
                        // }
                    }
                    console.log(_p)
                    this.subForm(api.saleReportManagement+'/batch_create/'+this.modifyForm.id,_p,(data) => {
                        this.modifyState=false
                        this.modifyLoading=false
                        this.reData()
                        this.$message({message: '恭喜你，保存成功',type: 'success'})
                    })
                } else { return false }
            })
        },
        oddRemoteMethod(query) {
            if (query !== '') {
                this.oddNumLoading = true
                this.fetchData(api.customer+'/search?keyword='+query,'',(data) => {
                    console.log(data)
                    this.oddNumList=data
                    this.oddNumLoading=false
                })
            } else {
                this.oddNumList = []
            }    
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
            // let _categoryName , _typeName , _typeNameFull , _brandObj
            // for(let i in this.categoryList){
            //     if(this.categoryList[i].pkGlobalId == this.detailForm.category){
            //         _categoryName = this.categoryList[i].name
            //     }
            // }
            // for(let j in this.goodsTypeList){
            //     if(this.goodsTypeList[j].pkGlobalId == this.detailForm.goodsType){
            //         _typeName = this.goodsTypeList[j].name
            //         _typeNameFull = this.goodsTypeList[j].nameFull
            //         _brandObj = this.goodsTypeList[j].brand
            //     }
            // }
            // let _p = {
            //     "refId": this.refId,
            //     "name": _typeNameFull,
            //     "categoryId": this.detailForm.category,
            //     "categoryName": _categoryName,
            //     "brandId": _brandObj.pkGlobalId,
            //     "brandName": _brandObj.name,
            //     "typeId": this.detailForm.goodsType,
            //     "typeName": _typeName,
            //     "number": this.detailForm.number,
            //     "price": this.detailForm.price,
            //     "samePrice": this.detailForm.samePrice,
            //     "sameRate": this.sellCounterpartPercentage,
            //     "customerPrice": this.detailForm.customerPrice,
            //     "customerRate": this.sellCustomerPercentage,
            //     "memo": this.detailForm.memo,
            //     "deleteState":true,
            // }
            // this.purchaseList.push(_p)
            // this.addCollectState=false
        },
        purchaseDelete(index , data) {
            data.splice(index, 1)
        },
        showVerify(index , data){
            this.verifyId=data[index].id
            this.verifyState=true
        },
        subVerify(){
            this.patchData(api.saleManagement+'/check/'+this.verifyId,this.verifyForm,(data) => {
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
            // this.purchaseList=[]
            // this.fetchData(api.purchaseDetail+'?refId='+this.refId,'',(redata) => {
            //     if(!!redata.content){
            //         this.purchaseList = redata.content
            //     }
            // })
            console.log(0)
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
            this.payMoney=0
            let _p = {
                'name': this.accountList[this.accountForm.account].name,
                'type': this.accountList[this.accountForm.account].type,
                'money': this.accountForm.money,
                'memo': this.accountForm.memo,
                'id': this.accountList[this.accountForm.account].id,
            }
            this.payList.push(_p)
            console.log(this.payList)
            for(let i in this.payList){
                console.log(this.payList[i].money)
                this.payMoney+=Number(this.payList[i].money)
            }
            this.addAccountState=false
            console.log(this.payMoney)
        },
        pay(payForm) {
            this.$refs[payForm].validate((valid) => {
                if (valid) {
                    let _arr = []
                    for(let i in this.payList){
                        let _p={
                            "sum":this.payList[i].money,
                            "collectWay":this.payList[i].type,
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
                    this.subForm(api.saleManagement+'/collect?id='+this.refId,_data,(data) => {
                        this.payState=false
                        this.reData()
                        this.$message({message: '恭喜你，保存成功',type: 'success'})
                        this.payList=[]
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
            }
            this.subForm(api.purchaseManagement+'/goodsin?id='+this.refId,_p,(data) => {
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
        oddChange(data){
            for(let i in this.oddNumList){
                if(this.oddNumList[i].id==data){
                    this.oddSelect=this.oddNumList[i]
                }
            }
        },
        chooseGoods(){
            for(let i in this.multipleSelection){
                this.multipleSelection[i].deleteState=true
                this.purchaseList.push(this.multipleSelection[i])
            }
            this.addCollectState=false
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        addDetail(){
            this.addCollectState = true
            this.curChange()
        }
    }
}
</script>