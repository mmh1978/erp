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
                    <!-- <el-form-item label="">
                        <el-input v-model="accountSearch" placeholder="提现账号"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="statusSearch" clearable placeholder="状态">
                            <el-option :value="'0'" :label="'未处理'"></el-option>
                            <el-option :value="'1'" :label="'已处理'"></el-option>
                            <el-option :value="'2'" :label="'已制单'"></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item>
                        <el-button icon="search" @click="reData">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <template>
            <el-table :data="dataList.content" border style="width: 100%" :height="autoHeight" v-loading="loading">
                <el-table-column prop="tblUser.nickName" label="昵称" min-width="120"></el-table-column>
                <el-table-column prop="tblUser.phone" label="电话" width="130"></el-table-column>
                <el-table-column label="状态" min-width="150">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].accountStaus=='0'">
                            正常
                        </template>
                        <template v-if="dataList.content[scope.$index].accountStaus=='1'">
                            冻结
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="accountNumber" label="账户余额" width="130"></el-table-column>
                <el-table-column fixed="right" label="操作" width="80">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click.native.prevent="showChange(scope.$index, dataList.content)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <div class="bottom-bar">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="dataList.totalElements"></el-pagination>
        </div>

        <el-dialog title="账单详情" :visible.sync="changeState" size="small">
            <el-table :data="changeData.content" style="width: 100%">
                <el-table-column prop="changeNumber" label="变动金额" width="110"></el-table-column>
                <el-table-column label="变动类型" width="110">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].changeType=='0'">
                            收入
                        </template>
                        <template v-if="dataList.content[scope.$index].changeType=='1'">
                            支出
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="变动备注" min-width="180"></el-table-column>
                <el-table-column prop="updateTime" label="变动时间" width="180"></el-table-column>
                <el-table-column prop="entityId" label="关联ID" min-width="180"></el-table-column>
            </el-table>
            <el-pagination style="margin-top:10px" @current-change="ChangeDataPage" :current-page.sync="changeCurrentPage" :page-size="changePageSize" layout="total, prev, pager, next" :total="changeData.totalElements"></el-pagination>
        </el-dialog>
    </div>
</template>

<script>
import api from '../../util/api'
import ajax from '../../util/ajax'
export default {
    name: 'userAccount',
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
            this.patchData(api.userAccount+'/'+this.dataId,params,(data) => {
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
            this.fetchData(api.userAccount+'?sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
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
            this.fetchData(api.userAccount+'?sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
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
            this.changeId=allData[index].pkGlobalId
            // if(!!allData[index].tblUser){
                this.fetchData(api.userAccountRecord+'?userAccount.pkGlobalId='+allData[index].pkGlobalId+'&page='+(this.changeCurrentPage-1)+'&size='+this.changePageSize,'',(data) => {
                    this.changeData=data
                    this.changeDataLoading=false
                })
            // }
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