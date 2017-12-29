<style lang="less" scope>

</style>
<template>
    <div class="content">
        <div class="top-bar">
            <div class="item">
                <el-form :inline="true">
                    <el-form-item label="">
                        <el-input v-model="phoneSearch" placeholder="手机号"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-input v-model="accountSearch" placeholder="提现账号"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="statusSearch" clearable placeholder="状态">
                            <el-option :value="'0'" :label="'未处理'"></el-option>
                            <el-option :value="'1'" :label="'已处理'"></el-option>
                            <el-option :value="'2'" :label="'已制单'"></el-option>
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
                <el-table-column prop="tblUser.phone" label="手机" width="140"></el-table-column>
                <el-table-column prop="tblUser.nickName" label="用户昵称" min-width="120"></el-table-column>
                <el-table-column prop="withdrawNum" label="提现金额(元)" width="120"></el-table-column>
                <el-table-column prop="payAccountId" label="提现账号" width="220"></el-table-column>
                <el-table-column label="账号类型" width="100">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].accountType=='1'">微信</template>
                        <template v-if="dataList.content[scope.$index].accountType=='2'">支付宝</template>
                        <template v-if="dataList.content[scope.$index].accountType=='3'">百度钱包</template>
                        <template v-if="dataList.content[scope.$index].accountType=='4'">银联</template>
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="100">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].status=='0'"><span>未处理</span></template>
                        <template v-if="dataList.content[scope.$index].status=='1'"><span style="color:#13CE66">已处理</span></template>
                        <template v-if="dataList.content[scope.$index].status=='2'"><span style="color:#20A0FF">已制单</span></template>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="实名认证" width="120">
                    <template slot-scope="scope">
                        <template v-if="!!dataList.content[scope.$index].tblUser">
                            <template v-if="dataList.content[scope.$index].tblUser.isAuth=='1'">
                                <i class="el-icon-check" style="color:#13ce66"></i>
                            </template>
                            <template v-else>
                                <i class="el-icon-minus"></i>
                            </template>
                        </template>
                        <template v-else>
                            <i class="el-icon-minus"></i>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="审请时间" width="180"></el-table-column>
                <el-table-column prop="updateTime" label="更新时间" width="180"></el-table-column>
                <el-table-column fixed="right" label="操作" width="160">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click.native.prevent="showEditData(scope.$index, dataList.content)">编辑</el-button>
                        <el-button type="text" size="small" @click.native.prevent="showChange(scope.$index, dataList.content)">余额变动记录</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <div class="bottom-bar">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="dataList.totalElements"></el-pagination>
        </div>
        <el-dialog title="编辑" :visible.sync="editState" size="small">
            <el-form label-width="100px" :model="editData">
                <el-col :span="12">
                    <el-form-item label="用户">
                        <el-input v-if="editData.tblUser" v-model="editData.tblUser.nickName" disabled></el-input>
                        <el-input v-else disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="手机">
                        <el-input v-if="editData.tblUser" v-model="editData.tblUser.phone" disabled></el-input>
                        <el-input v-else disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="提现金额(元)">
                        <el-input v-if="editData" v-model="editData.withdrawNum" disabled></el-input>
                        <el-input v-else disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="余额(元)">
                        <el-input v-if="editData" v-model="editData.accountNumber" disabled></el-input>
                        <el-input v-else disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="账户类型">
                        <template v-if="editData.accountType=='1'"><el-input  value="微信" disabled></el-input></template>
                        <template v-if="editData.accountType=='2'"><el-input  value="支付宝" disabled></el-input></template>
                        <template v-if="editData.accountType=='3'"><el-input  value="百度钱包" disabled></el-input></template>
                        <template v-if="editData.accountType=='4'"><el-input  value="银联" disabled></el-input></template>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="提现帐号">
                        <el-input v-if="editData" v-model="editData.payAccountId" disabled></el-input>
                        <el-input v-else disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="开户支行">
                        <el-input v-if="editData" v-model="editData.extra" disabled></el-input>
                        <el-input v-else disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="真实姓名">
                        <el-input v-if="editData" v-model="editData.accountName" disabled></el-input>
                        <el-input v-else disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-form>
            <el-form label-width="100px">
                <el-col :span="12">
                    <el-form-item label="提现状态">
                        <el-select v-model="editSelect" placeholder="请选择">
                            <el-option :value="0" label="未处理" :key="0"></el-option>
                            <el-option :value="1" label="已处理" :key="1"></el-option>
                            <el-option :value="2" label="已制单" :key="2"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">保 存</el-button>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-dialog>

        <el-dialog title="余额变动记录" :visible.sync="changeState" size="small">
            <el-table :data="changeData.content" style="width: 100%">
                <el-table-column prop="changeNumber" label="变动金额" width="90"></el-table-column>
                <el-table-column prop="changeType" label="变动类型" width="90"></el-table-column>
                <el-table-column prop="remark" label="变动备注" min-width="180"></el-table-column>
                <el-table-column prop="updateTime" label="变动时间" width="180"></el-table-column>
                <el-table-column prop="entityId" label="关联ID" min-width="180"></el-table-column>
            </el-table>
            <el-pagination style="margin-top:10px" @current-change="ChangeDataPage" :current-page.sync="changeCurrentPage" :page-size="changePageSize" layout="total, prev, pager, next" :total="changeData.totalElements"></el-pagination>
        </el-dialog>
    </div>
</template>

<script>
import api from '../../../util/api'
import ajax from '../../../util/ajax'
export default {
    name: 'withdrawList',
    mixins: [ajax],
    data () {
        return {
            phoneSearch: '',
            accountSearch: '',
            statusSearch: '',
            dataList: '',
            currentPage: 1,
            pageSize: 20,
            loading: false,

            editState: false,
            editData: {},
            changeData: [],
            changeState: false,
            changeDataLoading: false,
            changeCurrentPage: 1,
            changePageSize: 10,
            changeId: '',
            editSelect: '',
            userId: '',
            dataId: '',
        }
    },
    created(){
        var _vue=this
        this.autoHeight=window.innerHeight-160
        window.onresize=function(){_vue.autoHeight=window.innerHeight-160}

        this.reData()
    },
    mounted(){

    },
    updated(){
        
    },
    methods:{
        onSubmit() {
            let params = {"pkGlobalId":this.dataId,"status":this.editSelect}
            console.log(params)
            this.patchData(api.withdrawList+'/'+this.dataId,params,(data) => {
                this.reData()
                this.editState=false
                this.$message({ message: '恭喜你，修改成功', type: 'success' })
            })
        },
        handleCurrentChange(val) {
            this.loading=true
            let _searchData = ''
            if(this.phoneSearch){
                _searchData+='&tblUser.phone='+this.phoneSearch
            }
            if(this.accountSearch){
                _searchData+='&payAccountId='+this.accountSearch
            }
            if(this.statusSearch){
                _searchData+='&status='+this.statusSearch
            }
            this.fetchData(api.withdrawList+'?sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
                this.dataList=data
                this.loading=false
            })
        },
        reData() {
            this.loading=true
            this.currentPage=1
            let _searchData = ''
            if(this.phoneSearch){
                _searchData+='&tblUser.phone='+this.phoneSearch
            }
            if(this.accountSearch){
                _searchData+='&payAccountId='+this.accountSearch
            }
            if(this.statusSearch){
                _searchData+='&status='+this.statusSearch
            }
            this.fetchData(api.withdrawList+'?sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
                this.dataList=data
                this.loading=false
            })
        },
        showEditData(index , allData) {
            this.editState=true
            this.dataId = allData[index].pkGlobalId
            this.userId = allData[index].tblUser ? allData[index].tblUser.pkGlobalId : ''
            let _temp = allData[index]
            this.editSelect = allData[index].status
            if(!!allData[index].tblUser){
                this.fetchData(api.userPayAccount+'?page=0&size=1&userId='+this.userId+'&payAccountId='+allData[index].payAccountId,'',(data) => {
                    _temp.accountName = data.content[0].accountName
                    _temp.extra = data.content[0].extra
                    this.fetchData(api.userAccount+'?page=0&size=1&userId='+this.userId,'',(res) => {
                        _temp.accountNumber=res.content[0].accountNumber
                        this.editData = _temp
                    })
                })
            }
        },
        showChange(index , allData) {
            this.changeState=true
            this.changeDataLoading=true
            this.changeId=allData[index].tblUser.pkGlobalId
            if(!!allData[index].tblUser){
                this.fetchData(api.userAccountRecord+'?userAccount.userId='+allData[index].tblUser.pkGlobalId+'&page='+(this.changeCurrentPage-1)+'&size='+this.changePageSize,'',(data) => {
                    this.changeData=data
                    this.changeDataLoading=false
                })
            }
        },
        ChangeDataPage(val){
            this.fetchData(api.userAccountRecord+'?userAccount.userId='+this.changeId+'&page='+(this.changeCurrentPage-1)+'&size='+this.changePageSize,'',(data) => {
                this.changeData=data
                this.changeDataLoading=false
            })
        },
    }
}
</script>