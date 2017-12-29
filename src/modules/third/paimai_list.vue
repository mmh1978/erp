<style lang="less" scope>
    .paimai-detail{
        width: 520px;
        img{
            width: 520px;
        }
    }
.worksInfo li{
  list-style: none;
}
.worksInfo table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  margin-bottom: 10px;
}
.worksInfo table a{
  color: #282828;
  line-height: 1.4;
}
.worksInfo th {
  width: 60px;
  background: #f2f2f2;
}
.worksInfo th, .worksInfo td {
  border: 1px solid #e6e6e6;
  padding: 0 10px;
  height: auto;
  word-break: break-all;
}
.titBlue{
  display: none;
}
</style>
<template>
    <div class="content">
        <div class="top-bar">
            <div class="item">
                <el-form :inline="true">
                    <el-form-item label="">
                        <el-input v-model="nameS" placeholder="商品名称"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-input v-model="brandNameS" placeholder="品牌"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-input v-model="serialNameS" placeholder="系列"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-input v-model="typeNameS" placeholder="型号"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-input v-model="thirdIdS" placeholder="商品ID"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="thirdNameS" clearable placeholder="平台">
                            <el-option label="寺库拍卖" value="寺库拍卖"></el-option>
                            <el-option label="雅昌拍卖" value="雅昌拍卖"></el-option>
                            <el-option label="京东拍卖" value="京东拍卖"></el-option>
                            <el-option label="咸鱼拍卖" value="咸鱼拍卖"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="categoryIdS" clearable placeholder="品类">
                            <el-option label="名表" value="1"></el-option>
                            <el-option label="名包" value="2"></el-option>
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
                <el-table-column prop="thirdId" label="商品ID" min-width="100"></el-table-column>
                <el-table-column prop="image" label="商品图片" width="140">
                    <template slot-scope="scope">
                        <img v-if="dataList.content[scope.$index].image" :src="dataList.content[scope.$index].image" style="width: 120px;display: block;margin: 10px 0;">
                        <img v-else :src="dataList.content[scope.$index].images[0]" style="width: 120px;display: block;margin: 10px 0;">
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="名称" min-width="200"></el-table-column>
                <el-table-column prop="price" label="成交价格" min-width="120"></el-table-column>
                <el-table-column prop="priceMarket" label="市场参考价" width="120"></el-table-column>
                <el-table-column prop="brandName" label="品牌" min-width="100"></el-table-column>
                <el-table-column prop="serialName" label="系列" min-width="100"></el-table-column>
                <el-table-column prop="typeName" label="型号" min-width="100"></el-table-column>
                <el-table-column prop="thirdName" label="平台名称" min-width="100"></el-table-column>
                <el-table-column prop="dataOk" label="数据状态" min-width="100">
                    <template slot-scope="scope">
                        {{dataList.content[scope.$index].dataOk}}
                    </template>
                </el-table-column>
                <el-table-column prop="overTime" label="成交时间" width="180"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index, dataList.content)">移除</el-button>
                        <el-button type="text" size="small" @click.native.prevent="showModify(scope.$index, dataList.content)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <div class="bottom-bar">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="total , prev, pager, next, jumper" :total="dataList.totalElements"></el-pagination>
        </div>
        <el-dialog title="添加" :visible.sync="addState" size="tiny">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px" v-loading="addLoading">

                <el-form-item label="选择会员" prop="memberId">
                    <el-select v-model="form.memberId" filterable remote placeholder="请输入关键词" :remote-method="remoteMethod" :loading="memberLoading">
                        <el-option v-for="item in memberList" :key="item.pkGlobalId" :value="item.pkGlobalId" :label="item.nickName+' : '+item.phone"></el-option>
                    </el-select>
                </el-form-item>      
                <el-form-item label="自营商品" prop="machineGoodsType">
                    <el-switch v-model="form.machineGoodsType" on-text="" off-text=""></el-switch>
                    <span>（是否显示自营商品）</span>
                </el-form-item>
                <el-form-item label="零售价" prop="machinePriceType">
                    <el-switch v-model="form.machinePriceType" on-text="" off-text=""></el-switch>
                    <span>（是否显示零售价格）</span>
                </el-form-item>
                <el-form-item label="备注" prop="memo">
                    <el-input v-model="form.memo"></el-input>
                </el-form-item>
                <el-form-item label="轮播图">
                    <el-upload  :action="file+'/upload'" list-type="picture-card" :on-remove="handleRemove" :on-success="imgListSuccess">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="add('form')">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="查看" :visible.sync="modifyState" size="large">
            <el-form ref="modifyForm" :model="modifyForm" :rules="modifyRules" label-width="90px" v-loading="modifyLoading">
               
                <el-form-item label="轮播图">
                    <div v-for="item in modifyForm.images" style="width:160px;height:160px;display:inline-block;background-size:contain;background-repeat:no-repeat;background-position:center;
                    margin-right:10px" :style="{backgroundImage: 'url('+item+')'}"></div>
                </el-form-item>      
                <el-form-item label="名称">
                    {{modifyForm.name}}
                </el-form-item>
                <el-form-item label="成交价格">
                    {{modifyForm.price}}
                </el-form-item>
                <el-form-item label="市场参考价">
                    {{modifyForm.priceMarket}}
                </el-form-item>
                <el-form-item label="品牌">
                    {{modifyForm.brandName}}
                </el-form-item>
                <el-form-item label="系列">
                    {{modifyForm.serialName}}
                </el-form-item>
                <el-form-item label="型号">
                    {{modifyForm.typeName}}
                </el-form-item>
                <el-form-item label="详情">
                    <div class="paimai-detail" v-html="modifyForm.oriHtml"></div>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="modifyState = false">关闭</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import api from '../../util/api'
import ajax from '../../util/ajax'
export default {
    name: 'paimaiList',
    mixins: [ajax],
    data () {
        return {
            dataList: '',
            currentPage: 1,
            pageSize: 20,
            loading: false,

            file: '',

            addState: false,
            addLoading: false,
            form: {
                images: '',
                memberId: '',
                machineGoodsType: '',
                machinePriceType: '',
                memo:'',
            },
            rules: {
                memberId: [
                    { required: true, message: '请选择会员', trigger: 'blur' }
                ]
            },

            modifyState: false,
            modifyLoading: false,
            modifyForm: {
                images: '',
                memberId: '',
                machineGoodsType: '',
                machinePriceType: '',
                memo:'',
            },
            modifyRules: {
                memberId: [
                    { required: true, message: '请选择会员', trigger: 'blur' }
                ]
            },

            memberList: [],
            memberLoading: '',
            imgList: [],
            modifyImgList: [],//修改展示图片列表
            modifyImgId: [],//保存当前有的图片ID
            deleteImgList: [],//删除已上传图片列表

            nameS: '',
            brandNameS: '',
            serialNameS: '',
            typeNameS: '',
            thirdIdS: '',
            thirdNameS: '',
            categoryIdS: '',
        }
    },
    created(){
        var _vue=this
        this.autoHeight=window.innerHeight-160
        window.onresize=function(){_vue.autoHeight=window.innerHeight-160}

        this.reData()

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
            if(this.nameS){
                _searchData+='&name='+this.nameS
            }
            if(this.brandNameS){
                _searchData+='&brandName='+this.brandNameS
            }
            if(this.serialNameS){
                _searchData+='&serialName='+this.serialNameS
            }
            if(this.typeNameS){
                _searchData+='&typeName='+this.typeNameS
            }
            if(this.thirdIdS){
                _searchData+='&thirdId='+this.thirdIdS
            }
            if(this.thirdNameS){
                _searchData+='&thirdName='+this.thirdNameS
            }
            if(this.categoryIdS){
                _searchData+='&categoryId='+this.categoryIdS
            }
            this.fetchData(api.paimaiList+'?page='+(this.currentPage-1)+'&size='+this.pageSize + _searchData,'',(data) => {
                this.dataList=data
                this.loading=false
            })
        },
        reData() {
            this.loading=true
            this.currentPage=1
            let _searchData = ''
            if(this.nameS){
                _searchData+='&name='+this.nameS
            }
            if(this.brandNameS){
                _searchData+='&brandName='+this.brandNameS
            }
            if(this.serialNameS){
                _searchData+='&serialName='+this.serialNameS
            }
            if(this.typeNameS){
                _searchData+='&typeName='+this.typeNameS
            }
            if(this.thirdIdS){
                _searchData+='&thirdId='+this.thirdIdS
            }
            if(this.thirdNameS){
                _searchData+='&thirdName='+this.thirdNameS
            }
            if(this.categoryIdS){
                _searchData+='&categoryId='+this.categoryIdS
            }
            this.fetchData(api.paimaiList+'?page='+(this.currentPage-1)+'&size='+this.pageSize + _searchData,'',(data) => {
                this.dataList=data
                this.loading=false
                console.log(data)
            })
        },
        add(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    this.addLoading=true

                    this.form.images=this.imgList.join(',')
                    let _id = this.form.memberId
                    delete this.form.memberId
                    this.form.operator={ 'pkGlobalId':_id }

                    this.subForm(api.paimaiList,this.form,(data) => {
                        this.addLoading=false
                        this.addState=false
                        for(let i in this.form){ this.form[i]='' }
                        this.reData()
                        this.$message({ message: '恭喜你，添加成功', type: 'success' })
                    })
                } else { return false }
            })
        },
        deleteRow(index , data) {
            this.$confirm('确定删除吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
                this.deleteData(api.paimaiList+'/'+data[index].id,'',(data) => {
                    this.reData()
                    this.$message({ type: 'success', message: '删除成功!' })
                })
            }).catch(() => { })
        },
        showModify(index , data) {
            console.log(data[index])
    
            this.modifyForm = data[index]
            this.modifyState=true
        },
        modify(modifyForm) {
            this.$refs[modifyForm].validate((valid) => {
                if (valid) {
                    this.modifyLoading=true
                    
                    this.modifyForm.images=this.modifyImgId.join(',')
                    let _id = this.modifyForm.memberId
                    delete this.modifyForm.memberId
                    this.modifyForm.operator={ 'pkGlobalId':_id }
                    console.log(this.modifyForm)
                    this.patchData(api.paimaiList+'/'+this.modifyForm.pkGlobalId,this.modifyForm,(data) => {
                        this.modifyState=false
                        this.modifyLoading=false
                        this.reData()
                        this.$message({message: '恭喜你，修改成功',type: 'success'})
                    })

                    this.deleteFile()
                    
                } else { return false }
            })
        },
        deleteFile(){
            if(this.deleteImgList.length>0){
                let _id = this.deleteImgList.pop()
                this.deleteData(api.file+'/'+_id,'',(data) => {
                    this.deleteFile()
                })
            }
        },
        remoteMethod(query) {
            if (query !== '') {
                this.memberLoading = true
                this.fetchData(api.member+'/search?keyword='+query,'',(data) => {
                    this.memberList=data
                    this.memberLoading=false
                })
            } else {
                this.memberList = []
            }
        },
        handleRemove(file, fileList) {
            if(this.addState){
                this.deleteData(api.file+'/'+file.response.UPLOAD_FILE_ID[0],'',(data) => {

                })
                if(this.imgList.indexOf(file.response.UPLOAD_FILE_ID[0])>=0){
                    let _index = this.imgList.indexOf(file.response.UPLOAD_FILE_ID[0])
                    this.imgList.splice(_index,1)
                }
            }else if (this.modifyState){
                if(file.response){//如果修改时删除的是刚上传的图片
                    this.deleteData(api.file+'/'+file.response.UPLOAD_FILE_ID[0],'',(data) => {})
                    if(this.modifyImgId.indexOf(file.response.UPLOAD_FILE_ID[0])>=0){
                        let _index = this.modifyImgId.indexOf(file.response.UPLOAD_FILE_ID[0])
                        this.modifyImgId.splice(_index,1)
                    }
                }else{//否则删除的就是回填数据的图片
                    this.deleteImgList.push(file.name)
                    let _index = this.modifyImgId.indexOf(file.name)
                    this.modifyImgId.splice(_index,1)
                }
            }
        },
        imgListSuccess(res, flie){
            if(this.addState){
                this.imgList.push(res.UPLOAD_FILE_ID[0])
            }else if (this.modifyState){
                this.modifyImgId.push(res.UPLOAD_FILE_ID[0])
            }
        }
    }
}
</script>