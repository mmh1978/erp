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
                        <el-input v-model="sellUserPhoneSearch" placeholder="发布人名称"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-input v-model="buyUserPhoneSearch" placeholder="发布人电话"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="statusSearch" clearable placeholder="品类">
                            <el-option :key="1" :label="'手表'" :value="1"></el-option>
                            <el-option :key="2" :label="'名包'" :value="2"></el-option>
                            <el-option :key="3" :label="'其它'" :value="3"></el-option>
                            <el-option :key="4" :label="'腰带'" :value="4"></el-option>
                            <el-option :key="5" :label="'翡翠'" :value="5"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button icon="search" @click="reData">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <!-- content -->
        <template>
            <el-table :data="dataList.content" border style="width: 100%" :height="autoHeight" v-loading="loading">
                <el-table-column prop="expectedPrice" label="预期价格" width="140"></el-table-column>
                <el-table-column prop="goodsStatus" label="求购状态" min-width="120">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].type=='0'">
                          回收
                        </template>
                        <template v-if="dataList.content[scope.$index].type=='1'">
                          寄卖
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="categoryName" label="品类" width="120"></el-table-column>
                <el-table-column prop="brandName" label="品牌" width="120"></el-table-column>
                <el-table-column prop="serialName" label="系列" width="120"></el-table-column>
                <el-table-column prop="typeName" label="型号" width="120"></el-table-column>
                <el-table-column prop="user.nickName" label="用户名" width="120"></el-table-column>
                <el-table-column prop="user.phone" label="电话" width="130"></el-table-column>
                <el-table-column prop="returnAddr" label="回收地址" width="120"></el-table-column>
                <el-table-column prop="createTime" label="发布时间" width="180"></el-table-column>
                <el-table-column prop="" label="回收状态" min-width="120">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].status=='0'">
                            待处理
                        </template>
                        <template v-if="dataList.content[scope.$index].status=='1'">
                            等待用户发货
                        </template>
                        <template v-if="dataList.content[scope.$index].status=='2'">
                            平台待收货
                        </template>
                        <template v-if="dataList.content[scope.$index].status=='3'">
                            平台已收货待处理
                        </template>
                        <template v-if="dataList.content[scope.$index].status=='4'">
                            平台销售中
                        </template>
                        <template v-if="dataList.content[scope.$index].status=='5'">
                            平台交易中
                        </template>
                        <template v-if="dataList.content[scope.$index].status=='6'">
                            平台已成交
                        </template>
                        <template v-if="dataList.content[scope.$index].status=='7'">
                            平台结算中
                        </template>
                        <template v-if="dataList.content[scope.$index].status=='8'">
                            已完成
                        </template>
                        <template v-if="dataList.content[scope.$index].status=='9'">
                            审核失败
                        </template>
                        <template v-if="dataList.content[scope.$index].status=='10'">
                            为用户取消
                        </template>
                        <template v-if="dataList.content[scope.$index].status=='11'">
                            为平台退货
                        </template>
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
            <div style="overflow:hidden">
                <div v-for="item in fileList"  style="width:200px;height:200px;float:left;margin-right:10px;background-size:cover;background-position:center" :style="{backgroundImage:'url('+thumb + item.fileId+')'}"></div>
            </div>
            <el-form label-width="80px">
                <el-form-item label="标题">
                    <span>{{detail.title}}</span>
                </el-form-item>
                <el-form-item label="描述">
                    <span>{{detail.description}}</span>
                </el-form-item>
                <el-form-item label="品牌">
                    <span>{{detail.brandName}}</span>
                </el-form-item>
                <el-form-item label="型号">
                    <span>{{detail.typeName}}</span>
                </el-form-item>
                <el-form-item label="表镜" v-if="detail.categoryId=='1'">
                    <span>{{detail.watchDiameter}}</span>
                </el-form-item>
                <el-form-item label="尺寸" v-if="detail.categoryId=='2'">
                    <span>{{detail.bagSize}}</span>
                </el-form-item>
                <el-form-item label="期望价格">
                    <span>{{detail.expectedPrice}}</span>
                </el-form-item>
                <el-form-item label="发布人">
                    <span>{{detail.user.nickName}}</span>
                </el-form-item>
                <el-form-item label="发布时间">
                    <span>{{detail.createTime}}</span>
                </el-form-item>

                <el-form-item label="收件人">
                    <span>{{detail.returnReceiver}}</span>
                </el-form-item>
                <el-form-item label="收获地址">
                    <span>{{detail.returnAddr}}</span>
                </el-form-item>
                <el-form-item label="平台回复">
                    <span>{{detail.platformReply}}</span>
                </el-form-item>
                <el-form-item label="回收状态">
                    <el-select v-model="subDetail.status" placeholder="请选择">
                        <el-option :label="'待处理'" :value="0"></el-option>
                        <el-option :label="'等待用户发货'" :value="1"></el-option>
                        <el-option :label="'平台待收货'" :value="2"></el-option>
                        <el-option :label="'平台已收货待处理'" :value="3"></el-option>
                        <el-option :label="'平台销售中'" :value="4"></el-option>
                        <el-option :label="'平台交易中'" :value="5"></el-option>
                        <el-option :label="'平台已成交'" :value="6"></el-option>
                        <el-option :label="'平台结算中'" :value="7"></el-option>
                        <el-option :label="'已完成'" :value="8"></el-option>
                        <el-option :label="'审核失败'" :value="9"></el-option>
                        <el-option :label="'为用户取消'" :value="10"></el-option>
                        <el-option :label="'为平台退货'" :value="11"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="modifyStatus">提交</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import api from '../../../util/api'
import ajax from '../../../util/ajax'
export default {
    name: 'recycleConsignment',
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
                user: {
                    nickName: ''
                }

            },
            subDetail: {
                status: '',
                id: '',
            },

            modifyState: false,

            fileList: [],

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
                _searchData+='&user.nickName='+this.sellUserPhoneSearch
            }
            if(this.buyUserPhoneSearch){
                _searchData+='&user.phone='+this.buyUserPhoneSearch
            }
            if(this.statusSearch){
                _searchData+='&categoryId='+this.statusSearch
            }
            if(this.orderTypeSearch){
                _searchData+='&orderType='+this.orderTypeSearch
            }
            this.fetchData(api.recycleConsignment+'?sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
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
                _searchData+='&user.nickName='+this.sellUserPhoneSearch
            }
            if(this.buyUserPhoneSearch){
                _searchData+='&user.phone='+this.buyUserPhoneSearch
            }
            if(this.statusSearch){
                _searchData+='&categoryId='+this.statusSearch
            }
            if(this.orderTypeSearch){
                _searchData+='&orderType='+this.orderTypeSearch
            }
            this.fetchData(api.recycleConsignment+'?sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
                console.log(data)
                this.dataList=data
                this.loading=false
            })
        },
        showModify(index , data) {

            this.fetchData(api.goodsImage+'/?goodsId='+data[index].pkGlobalId,'',(data) => {
                this.fileList = data.content
            })

            this.detail=data[index]

            this.subDetail.status=data[index].status
            this.subDetail.id=data[index].pkGlobalId

            this.activeName = 'first'
            this.modifyState=true

        },
        modifyStatus(){
            this.patchData(api.recycleConsignment+'/'+this.detail.pkGlobalId,this.subDetail,(data) => {
                this.$message({showClose: true,message: '提交成功',type: 'success'})
                this.modifyState=false
                this.reData()
            })
        },
        handleClose(done) {
            done()
        },
        handlePictureCardPreview(file){
            this.dialogImageUrl = file.url
            this.dialogVisible = true
        },
        openImg(href){
            this.dialogImageUrl = ''
            this.dialogVisible = true
            this.dialogImageUrl = href
        }
    }
}
</script>