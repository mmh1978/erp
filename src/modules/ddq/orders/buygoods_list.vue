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
                <el-table-column prop="title" label="标题" min-width="200"></el-table-column>
                <el-table-column prop="tblUser.nickName" label="发布人" min-width="130"></el-table-column>
                <el-table-column prop="tblUser.phone" label="手机号" width="140"></el-table-column>
                <el-table-column prop="purposePrice" label="期望价格" width="140"></el-table-column>
                <el-table-column prop="categoryName" label="商品类型" width="120"></el-table-column>
                <el-table-column prop="createTime" label="发布时间" width="180"></el-table-column>
                <el-table-column prop="validTime" label="截止时间" width="180"></el-table-column>
                
               <el-table-column prop="goodsStatus" label="求购状态" min-width="120">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].goodsStatus=='0'">
                          求购中
                        </template>
                        <template v-if="dataList.content[scope.$index].goodsStatus=='1'">
                          已完成
                        </template>
                        <template v-if="dataList.content[scope.$index].goodsStatus=='2'">
                          已过期
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="审核结果" min-width="120">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].isAgree=='0'">
                            未通过
                        </template>
                        <template v-if="dataList.content[scope.$index].isAgree=='1'">
                            通过
                        </template>
                        <template v-if="dataList.content[scope.$index].isAgree=='2'">
                            待审核
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
                    <span>{{detail.descript}}</span>
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
                    <span>{{detail.purposePrice}}</span>
                </el-form-item>
                <el-form-item label="发布人">
                    <span>{{detail.tblUser.nickName}}</span>
                </el-form-item>

                <el-form-item label="订单状态">
                    <el-select v-model="subDetail.goodsStatus" placeholder="请选择">
                        <el-option :label="'求购中'" :value="0"></el-option>
                        <el-option :label="'已完成'" :value="1"></el-option>
                        <el-option :label="'已过期'" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="审核状态">
                    <el-select v-model="subDetail.isAgree" placeholder="请选择">
                        <el-option :label="'未通过'" :value="0"></el-option>
                        <el-option :label="'已通过'" :value="1"></el-option>
                        <el-option :label="'待审核'" :value="2"></el-option>
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
    name: 'buyGoods',
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
                tblUser: {
                    nickName: ''
                }

            },
            subDetail: {
                goodsStatus: '',
                isAgree: '',
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
                _searchData+='&tblUser.nickName='+this.sellUserPhoneSearch
            }
            if(this.buyUserPhoneSearch){
                _searchData+='&tblUser.phone='+this.buyUserPhoneSearch
            }
            if(this.statusSearch){
                _searchData+='&categoryId='+this.statusSearch
            }
            if(this.orderTypeSearch){
                _searchData+='&orderType='+this.orderTypeSearch
            }
            this.fetchData(api.buyGoods+'?sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
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
                _searchData+='&tblUser.nickName='+this.sellUserPhoneSearch
            }
            if(this.buyUserPhoneSearch){
                _searchData+='&tblUser.phone='+this.buyUserPhoneSearch
            }
            if(this.statusSearch){
                _searchData+='&categoryId='+this.statusSearch
            }
            if(this.orderTypeSearch){
                _searchData+='&orderType='+this.orderTypeSearch
            }
            this.fetchData(api.buyGoods+'?sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
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

            this.subDetail.goodsStatus=data[index].goodsStatus
            this.subDetail.isAgree=data[index].isAgree
            this.subDetail.id=data[index].pkGlobalId

            this.activeName = 'first'
            this.modifyState=true

        },
        modifyStatus(){
            this.patchData(api.buyGoods+'/'+this.detail.pkGlobalId,this.subDetail,(data) => {
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