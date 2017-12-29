<style lang="less" scope>
    .base-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .base-uploader .el-upload:hover {
        border-color: #20a0ff;
    }
    .base-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .base {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>
<template>
    <div class="content">
        <el-dialog v-model="dialogVisible" size="full">
            <img :src="dialogImageUrl" alt="">
        </el-dialog>
        <div class="top-bar">
            <div class="item">
                <el-form :inline="true">
                    <el-form-item label="">
                        <el-select v-model="statusSearch" clearable placeholder="商品状态">
                            <el-option label="正常" value="01"></el-option>
                            <el-option label="已出售" value="02"></el-option>
                            <el-option label="已出库" value="03"></el-option>
                            <el-option label="待完善" value="04"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="">
                        <el-select v-model="postSaleSearch" clearable placeholder="商品来源">
                            <el-option label="采购" value="0"></el-option>
                            <el-option label="寄卖" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="">
                        <el-input v-model="keywordSearch" placeholder="商品名称"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-input v-model="sidSearch" placeholder="商品编号"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-input v-model="cidSearch" placeholder="采购编号"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-input v-model="idSearch" placeholder="产品编号"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button icon="search" @click="reData">搜索</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="exportData">导出</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <template>
            <el-table :data="dataList.content" border style="width: 100%" :height="autoHeight" v-loading="loading">
                <el-table-column prop="operator" label="商品图片" min-width="160">
                    <template slot-scope="scope">
                        <img :src="thumb+dataList.content[scope.$index].coverImg" style="width: 120px;display: block;margin: 10px 0;" @click="openImg(file+dataList.content[scope.$index].coverImg)">
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="商品编号" min-width="100"></el-table-column>
                <el-table-column prop="purchaseDetail.refId" label="采购编号" width="100"></el-table-column>
                <el-table-column prop="purchaseDetail.id" label="产品编号" width="100"></el-table-column>
                <el-table-column prop="sameRate" label="同销提成" width="100"></el-table-column>
                <el-table-column prop="customerRate" label="客销提成" min-width="100"></el-table-column>
                <el-table-column prop="categoryName" label="商品分类" min-width="100"></el-table-column>
                <el-table-column prop="brandName" label="商品品牌" min-width="100"></el-table-column>
                <el-table-column prop="typeName" label="商品型号" min-width="200"></el-table-column>
                <el-table-column prop="name" label="商品名称" min-width="200"></el-table-column>
                <el-table-column prop="costPrice" label="成本价" min-width="100" v-if="hasPrivilege"></el-table-column>
                <el-table-column prop="base.name" label="所在仓库" min-width="100"></el-table-column>
                <el-table-column prop="price" label="同行价" min-width="100"></el-table-column>
                <el-table-column prop="customerPrice" label="客户价" min-width="100"></el-table-column>
                <el-table-column prop="status" label="商品状态" min-width="100">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].status=='01'">正常</template>
                        <template v-if="dataList.content[scope.$index].status=='02'">已出售</template>
                        <template v-if="dataList.content[scope.$index].status=='03'">已出库</template>
                        <template v-if="dataList.content[scope.$index].status=='04'">待完善</template>
                    </template>
                </el-table-column>
                <el-table-column prop="operator.name" label="操作人" min-width="100"></el-table-column>
                <el-table-column prop="onsale" label="上架状态" min-width="100">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].onsale=='0'">未上架</template>
                        <template v-if="dataList.content[scope.$index].onsale=='1'">已上架</template>
                    </template>
                </el-table-column>
                <el-table-column prop="postSale" label="商品来源" width="100">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].postSale=='0'">采购</template>
                        <template v-if="dataList.content[scope.$index].postSale=='1'">寄卖</template>
                    </template>
                </el-table-column>
                <el-table-column prop="updateTime" label="更新时间" width="180"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click.native.prevent="showModify(scope.$index, dataList.content)">编辑</el-button>
                        <el-button type="text" size="small" @click.native.prevent="publishGoods(scope.$index, dataList.content)">发布</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <div class="bottom-bar">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="dataList.totalElements"></el-pagination>
        </div>
        <el-dialog title="编辑商品" :visible.sync="modifyState" size="large">
            <el-tabs type="border-card" v-model="activeName" @tab-click="changeTabs">
                <el-tab-pane label="商品信息" name="first">
                    <el-form :model="modifyForm" :rules="modifyRules" ref="modifyForm" label-width="100px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="商品编号" prop="">
                                    <el-input v-model="modifyForm.id" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="产品编号" prop="">
                                    <el-input v-model="modifyForm.purchaseId" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="采购编号" prop="">
                                    <el-input v-model="modifyForm.purchaseRefId" disabled></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="商品名称" prop="">
                                    <el-input v-model="modifyForm.name"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="同销提成" prop="">
                                    <el-input v-model="modifyForm.sameRate" placeholder="%"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="客销提成" prop="">
                                    <el-input v-model="modifyForm.customerRate" placeholder="%"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="同行价" prop="price">
                                    <el-input-number v-model="modifyForm.price" :min="0" style="width:100%" :controls="false"></el-input-number>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="客户价" prop="consumerPrice">
                                    <el-input-number v-model="modifyForm.customerPrice" :min="0" style="width:100%" :controls="false"></el-input-number>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="公价" prop="publicPrice">
                                    <el-input v-model="modifyForm.publicPrice" style="width:100%" :controls="false"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="所在仓库" prop="price">
  <el-select v-model="modifyForm.base.id" placeholder="请选择" style="width:100%">
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
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="描述">
                                    <el-input type="textarea" v-model="modifyForm.description"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="">
                                    <el-button type="primary" @click="modify('modifyForm')">保存</el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="分类属性" name="second">
                    <el-form :model="secondForm" :rules="secondRules" ref="secondForm" label-width="100px">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="商品分类" prop="">
                                    <el-select v-model="secondForm.categoryId" filterable placeholder="请选择" :loading="goodsCategoryLoading" @visible-change="goodsCategoryLoad" style="width:100%" @change="categoryIdChange">
                                        <el-option v-for="item in goodsCategory" :key="item.pkGlobalId" :label="item.name" :value="item.pkGlobalId"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="品牌" prop="">
                                    <el-select v-model="secondForm.brandId" filterable placeholder="请选择" :loading="brandLoading" @visible-change="brandLoad" style="width:100%" @change="brandIdChange">
                                        <el-option v-for="item in brandList" :key="item.pkGlobalId" :label="item.name" :value="item.pkGlobalId"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="配件" prop="">
                                    <el-checkbox-group v-model="secondForm.goodsPartsArr">
                                        <el-checkbox label="1">发票</el-checkbox>
                                        <el-checkbox label="2">盒子</el-checkbox>
                                        <el-checkbox label="4">说明书</el-checkbox>
                                        <el-checkbox label="8">身份证</el-checkbox>
                                        <el-checkbox label="16">防尘袋</el-checkbox>
                                        <el-checkbox label="1024">其他</el-checkbox>
                                    </el-checkbox-group>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="系列" prop="">
                                    <el-select v-model="secondForm.serialId" filterable placeholder="请选择" :loading="serialLoading" @visible-change="serialLoad" style="width:100%" @change="serialIdChange">
                                        <el-option v-for="item in serialList" :key="item.pkGlobalId" :label="item.name" :value="item.pkGlobalId"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="商品成色" prop="">
                                    <el-radio-group v-model="secondForm.qualityId">
                                        <el-tooltip placement="top">
                                            <div slot="content">该商品未经使用</div>
                                            <el-radio-button label="11">未使用</el-radio-button>
                                        </el-tooltip>
                                        <el-tooltip placement="top">
                                            <div slot="content">9新-99新;该商品有很好的品相,除一些<br>轻微使用痕迹，整体保存状态良好</div>
                                            <el-radio-button label="12">A级</el-radio-button>
                                        </el-tooltip>
                                        <el-tooltip placement="top">
                                            <div slot="content">85新-89新;该商品有正常使用痕迹，含划<br>痕。轻微变形及其他磨损，不影响正常使用</div>
                                            <el-radio-button label="13">B级</el-radio-button>
                                        </el-tooltip>
                                        <el-tooltip placement="top">
                                            <div slot="content">8新-84新;该商品有明显使用痕迹、图片<br>有清洗描述，含变形及其他磨损</div>
                                            <el-radio-button label="14">C级</el-radio-button>
                                        </el-tooltip>
                                        <el-tooltip placement="top">
                                            <div slot="content">7新-79新;该商品有严重磨损，污渍和划<br>痕，品相较差</div>
                                            <el-radio-button label="15">D级</el-radio-button>
                                        </el-tooltip>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="型号" prop="">
                                    <el-select v-model="secondForm.typeId" filterable placeholder="请选择" :loading="typeLoading" @visible-change="typeLoad" style="width:100%" @change="typeChange">
                                        <el-option v-for="item in typeList" :key="item.pkGlobalId" :label="item.name" :value="item.pkGlobalId"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="商品款式" prop="">
                                    <el-radio-group v-model="secondForm.goodsStyle">
                                        <el-radio-button label="0">男款</el-radio-button>
                                        <el-radio-button label="1">女款</el-radio-button>
                                        <el-radio-button label="99">其他</el-radio-button>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                            <!-- <el-col :span="12"> 
                                <el-form-item label="">
                                    <el-button @click="open('http://www.xbiao.com/search/index?wd=')">腕表之家</el-button>
                                    <el-button @click="open('https://www.baidu.com/s?wd=')">百度</el-button>
                                    <el-button @click="open('https://search.jd.com/Search?keyword=')">京东</el-button>
                                    <el-button @click="open('https://paimai.taobao.com/pmp_list/3____1_1.htm?q=')">闲鱼拍卖</el-button>
                                </el-form-item>
                            </el-col> -->
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="">
                                    <el-button type="primary" @click="second('secondForm')">保存</el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-tab-pane>
                <!-- <el-tab-pane label="二手属性" name="third">
                    <el-form :model="thirdFormA" :rules="thirdRulesB" ref="thirdFormA" label-width="100px" v-if="secondForm.categoryId=='1'">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="镶钻" prop="">
                                    <el-select v-model="thirdFormA.watchSecondHandDiamond" placeholder="请选择" style="width:100%">
                                        <el-option label="原钻" value="1"></el-option>
                                        <el-option label="后钻" value="2"></el-option>
                                        <el-option label="无钻" value="3"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="表带材质" prop="">
                                    <el-select v-model="thirdFormA.watchSecondHandBandMaterial" placeholder="请选择" style="width:100%">
                                        <el-option label="原装" value="1"></el-option>
                                        <el-option label="后换" value="2"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="表扣材质" prop="">
                                    <el-select v-model="thirdFormA.watchSecondHandClasp" placeholder="请选择" style="width:100%">
                                        <el-option label="原装" value="1"></el-option>
                                        <el-option label="后换" value="2"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="表径" prop="">
                                    <el-input v-model="thirdFormA.watchDiameter"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="表带长度" prop="">
                                    <el-input v-model="thirdFormA.watchBandLength"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="表带材质" prop="">
                                    <el-input v-model="thirdFormA.watchBandMaterial"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="瑕疵" prop="">
                                    <el-input type="textarea" v-model="thirdFormA.watchSecondHandDefect"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="">
                                    <el-button type="primary" @click="thirdA('thirdFormA')">保存</el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <el-form :model="thirdFormB" :rules="thirdRulesB" ref="thirdFormB" label-width="100px" v-if="secondForm.categoryId=='2'">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="上色" prop="bagSecondHandColor">
                                    <el-select v-model="thirdFormB.bagSecondHandColor" placeholder="请选择" style="width:100%">
                                        <el-option label="原装" value="1"></el-option>
                                        <el-option label="后换" value="2"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="拉链" prop="bagSecondHandZipper">
                                    <el-select v-model="thirdFormB.bagSecondHandZipper" placeholder="请选择" style="width:100%">
                                        <el-option label="原装" value="1"></el-option>
                                        <el-option label="后换" value="2"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="底应" prop="bagSecondHandBottom">
                                    <el-select v-model="thirdFormB.bagSecondHandBottom" placeholder="请选择" style="width:100%">
                                        <el-option label="原装" value="1"></el-option>
                                        <el-option label="后换" value="2"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="包扣" prop="bagSecondHandClasp">
                                    <el-select v-model="thirdFormB.bagSecondHandClasp" placeholder="请选择" style="width:100%">
                                        <el-option label="原装" value="1"></el-option>
                                        <el-option label="后换" value="2"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="内衬" prop="bagSecondHandLined">
                                    <el-select v-model="thirdFormB.bagSecondHandLined" placeholder="请选择" style="width:100%">
                                        <el-option label="原装" value="1"></el-option>
                                        <el-option label="后换" value="2"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="尺寸" prop="bagSize">
                                    <el-input v-model="thirdFormB.bagSize"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="瑕疵" prop="bagSecondHandDefect">
                                    <el-input type="textarea" v-model="thirdFormB.bagSecondHandDefect"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="">
                                    <el-button type="primary" @click="thirdB('thirdFormB')">保存</el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="参数属性" name="fourth">
                    <el-form :model="fourthFormA" :rules="fourthRulesA" ref="fourthFormA" label-width="100px" v-if="secondForm.categoryId=='1'">
                        <el-row>
                            <el-col :span="6"><el-form-item label="产家编号" prop="name"><el-input v-model="fourthFormA.bianhao"></el-input></el-form-item></el-col>
                            <el-col :span="6"><el-form-item label="手表表径" prop="name"><el-input v-model="fourthFormA.biaojin"></el-input></el-form-item></el-col>
                            <el-col :span="6"><el-form-item label="手表功能" prop="name"><el-input v-model="fourthFormA.gongneng"></el-input></el-form-item></el-col>
                            <el-col :span="6"><el-form-item label="机芯型号" prop="name"><el-input v-model="fourthFormA.jixinxinhao"></el-input></el-form-item></el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6"><el-form-item label="手表品牌" prop="name"><el-input v-model="fourthFormA.brandName"></el-input></el-form-item></el-col>
                            <el-col :span="6"><el-form-item label="出产厂商" prop="name"><el-input v-model="fourthFormA.org"></el-input></el-form-item></el-col>
                            <el-col :span="6"><el-form-item label="表壳厚度" prop="name"><el-input v-model="fourthFormA.biaokehoudu"></el-input></el-form-item></el-col>
                            <el-col :span="6"><el-form-item label="机芯类型" prop="name"><el-input v-model="fourthFormA.jixinleixin"></el-input></el-form-item></el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6"><el-form-item label="表壳材质" prop="name"><el-input v-model="fourthFormA.biaokecaizhi"></el-input></el-form-item></el-col>
                            <el-col :span="6"><el-form-item label="手表系列" prop="name"><el-input v-model="fourthFormA.xilei"></el-input></el-form-item></el-col>
                            <el-col :span="6"><el-form-item label="机芯直径" prop="name"><el-input v-model="fourthFormA.jixinzj"></el-input></el-form-item></el-col>
                            <el-col :span="6"><el-form-item label="手表款式" prop="name"><el-input v-model="fourthFormA.sex"></el-input></el-form-item></el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6"><el-form-item label="表盘颜色" prop="name"><el-input v-model="fourthFormA.biaopangyanse"></el-input></el-form-item></el-col>
                            <el-col :span="6"><el-form-item label="手表别名" prop="name"><el-input v-model="fourthFormA.nameOther"></el-input></el-form-item></el-col>
                            <el-col :span="6"><el-form-item label="表盘形状" prop="name"><el-input v-model="fourthFormA.biaopanxingzhuang"></el-input></el-form-item></el-col>
                            <el-col :span="6"><el-form-item label="手表摆轮" prop="name"><el-input v-model="fourthFormA.bailun"></el-input></el-form-item></el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6"><el-form-item label="表盘材质" prop="name"><el-input v-model="fourthFormA.biaopangcaizhi"></el-input></el-form-item></el-col>
                            <el-col :span="6"><el-form-item label="手表振频" prop="name"><el-input v-model="fourthFormA.zhenping"></el-input></el-form-item></el-col>
                            <el-col :span="6"><el-form-item label="宝石数" prop="name"><el-input v-model="fourthFormA.baoshiNumber"></el-input></el-form-item></el-col>
                            <el-col :span="6"><el-form-item label="表镜材质" prop="name"><el-input v-model="fourthFormA.biaojingcaizhi"></el-input></el-form-item></el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6"><el-form-item label="零件数" prop="name"><el-input v-model="fourthFormA.linjianNumber"></el-input></el-form-item></el-col>
                            <el-col :span="6"><el-form-item label="表冠材质" prop="name"><el-input v-model="fourthFormA.biaoguancaizhi"></el-input></el-form-item></el-col>
                            <el-col :span="6"><el-form-item label="动力储备" prop="name"><el-input v-model="fourthFormA.donglichubei"></el-input></el-form-item></el-col>
                            <el-col :span="6"><el-form-item label="表带颜色" prop="name"><el-input v-model="fourthFormA.biaodaiyanse"></el-input></el-form-item></el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6"><el-form-item label="手表避震" prop="name"><el-input v-model="fourthFormA.bizhen"></el-input></el-form-item></el-col>
                            <el-col :span="6"><el-form-item label="表带材质" prop="name"><el-input v-model="fourthFormA.biaodaicaizhi"></el-input></el-form-item></el-col>
                            <el-col :span="6"><el-form-item label="机芯厚度" prop="name"><el-input v-model="fourthFormA.jixinhoudu"></el-input></el-form-item></el-col>
                            <el-col :span="6"><el-form-item label="表扣类型" prop="name"><el-input v-model="fourthFormA.biaokouleixing"></el-input></el-form-item></el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6"><el-form-item label="表扣材质" prop="name"><el-input v-model="fourthFormA.biaokoucaizhi"></el-input></el-form-item></el-col>
                            <el-col :span="6"><el-form-item label="基础机芯" prop="name"><el-input v-model="fourthFormA.jichujixin"></el-input></el-form-item></el-col>
                            <el-col :span="6"><el-form-item label="手表游丝" prop="name"><el-input v-model="fourthFormA.yousi"></el-input></el-form-item></el-col>
                            <el-col :span="6"><el-form-item label="手表背透" prop="name"><el-input v-model="fourthFormA.beitou"></el-input></el-form-item></el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6"><el-form-item label="手表重量" prop="name"><el-input v-model="fourthFormA.weight"></el-input></el-form-item></el-col>
                            <el-col :span="6"><el-form-item label="电池寿命" prop="name"><el-input v-model="fourthFormA.dichishoumin"></el-input></el-form-item></el-col>
                            <el-col :span="6"><el-form-item label="防水深度" prop="name"><el-input v-model="fourthFormA.fangshuishengdu"></el-input></el-form-item></el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="">
                                    <el-button type="primary" @click="fourthA('fourthFormA')">保存</el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <el-form :model="fourthFormB" :rules="fourthRulesB" ref="fourthFormB" label-width="100px" v-if="secondForm.categoryId=='2'">
                        <el-row>
                            <el-col :span="8"><el-form-item label="包包尺寸" prop="name"><el-input v-model="fourthFormB.size"></el-input></el-form-item></el-col>
                            <el-col :span="8"><el-form-item label="包包品牌" prop="name"><el-input v-model="fourthFormB.brandName"></el-input></el-form-item></el-col>
                            <el-col :span="8"><el-form-item label="出产厂商" prop="name"><el-input v-model="fourthFormB.org"></el-input></el-form-item></el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8"><el-form-item label="包包颜色" prop="name"><el-input v-model="fourthFormB.color"></el-input></el-form-item></el-col>
                            <el-col :span="8"><el-form-item label="包包材质" prop="name"><el-input v-model="fourthFormB.caizhi"></el-input></el-form-item></el-col>
                            <el-col :span="8"><el-form-item label="包包产地" prop="name"><el-input v-model="fourthFormB.chandi"></el-input></el-form-item></el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8"><el-form-item label="开合方式" prop="name"><el-input v-model="fourthFormB.wujincaizhi"></el-input></el-form-item></el-col>
                            <el-col :span="8"><el-form-item label="内部结构" prop="name"><el-input v-model="fourthFormB.kaihefangshi"></el-input></el-form-item></el-col>
                            <el-col :span="8"><el-form-item label="五金材质" prop="name"><el-input v-model="fourthFormB.neibujiegou"></el-input></el-form-item></el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="">
                                    <el-button type="primary" @click="fourthB('fourthFormB')">保存</el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-tab-pane> -->
                <el-tab-pane label="图片" name="fifth">
                    <!-- <el-upload id="sort_img" :action="file+'/upload'" list-type="picture-card" :file-list="modifyImgList" :on-remove="handleRemove" :on-success="imgListSuccess" :on-preview="handlePictureCardPreview">
                        <i class="el-icon-plus"></i>
                    </el-upload> -->

                    <el-upload :action="file+'/upload'" :show-file-list="false" :on-success="imgListSuccess" class="base-uploader">
                        <img v-if="imageUrl" :src="imageUrl" class="base">
                        <i v-else class="el-icon-plus base-uploader-icon"></i>
                    </el-upload>
                    <el-form label-width="0px">
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="">
                                    <el-button type="primary" @click="fifth">保存</el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>
    </div>
</template>

<script>
import api from '../../util/api'
import ajax from '../../util/ajax'
// import Sortable from 'sortablejs'
export default {
    name: 'baseManagement',
    mixins: [ajax],
    data () {
        return {
            dialogVisible: false,
            dialogImageUrl: '',

            statusSearch: '',
            postSaleSearch: '',
            keywordSearch: '',
            idSearch: '',
            sidSearch: '',
            cidSearch: '',
            dataList: '',
            currentPage: 1,
            pageSize: 20,
            loading: false,
            file: '',
            thumb: '',
            modifyState: false,
            modifyLoading: false,
            modifyForm: {
                id: '',
                base: {id:''},
                purchaseRefId: '',
                purchaseId: '',
                name: '',
                sameRate: '',
                customerRate: '',
                price: '',
                customerPrice: '',
                publicPrice: '',
                description: '',
            },
            modifyRules: {
                id: [
                    { required: true, message: '', trigger: 'blur' }
                ]
            },

            secondForm: {
                categoryId: '',
                brandId:'',
                qualityId:'',
                goodsStyle: '',
                goodsPartsArr: [],
                serialId: '',
                typeId: '',
            },
            secondRules: {
                pkGlobalId: [
                    { required: true, message: '', trigger: 'blur' }
                ]
            },
            thirdFormA: {
                watchSecondHandDiamond: '',
                watchSecondHandBandMaterial: '',
                watchSecondHandClasp: '',
                watchDiameter: '',
                watchBandLength: '',
                watchBandMaterial: '',
                watchSecondHandDefect: '',
            },
            thirdRulesA: {
                pkGlobalId: [
                    { required: true, message: '', trigger: 'blur' }
                ]
            },
            thirdFormB: {
                bagSecondHandColor: '',
                bagSecondHandZipper: '',
                bagSecondHandBottom: '',
                bagSecondHandClasp: '',
                bagSecondHandLined: '',
                bagSize: '',
                bagSecondHandDefect: '',
            },
            thirdRulesB: {
                pkGlobalId: [
                    { required: true, message: '', trigger: 'blur' }
                ]
            },
            fourthFormA: {
                bianhao: '',
                biaojin: '',
                gongneng: '',
                jixinxinhao: '',
                brandName: '',
                org: '',
                biaokehoudu: '',
                jixinleixin: '',
                biaokecaizhi: '',
                xilei: '',
                jixinzj: '',
                sex: '',
                biaopangyanse: '',
                nameOther: '',
                biaopanxingzhuang: '',
                bailun: '',
                biaopangcaizhi: '',
                zhenping: '',
                baoshiNumber: '',
                biaojingcaizhi: '',
                linjianNumber: '',
                biaoguancaizhi: '',
                donglichubei: '',
                biaodaiyanse: '',
                bizhen: '',
                biaodaicaizhi: '',
                jixinhoudu: '',
                biaokouleixing: '',
                biaokoucaizhi: '',
                jichujixin: '',
                yousi: '',
                beitou: '',
                weight: '',
                dichishoumin: '',
                fangshuishengdu: '',
            },
            fourthRulesA: {
                pkGlobalId: [
                    { required: true, message: '', trigger: 'blur' }
                ]
            },
            fourthFormB: {
                size: '',
                brandName: '',
                org: '',
                color: '',
                caizhi: '',
                chandi: '',
                wujincaizhi: '',
                kaihefangshi: '',
                neibujiegou: '',
            },
            fourthRulesB: {
                pkGlobalId: [
                    { required: true, message: '', trigger: 'blur' }
                ]
            },

            imgList: [],
            modifyImgList: [],//修改展示图片列表
            modifyImgId: [],//保存当前有的图片ID
            deleteImgList: [],//删除已上传图片列表

            activeName: 'first',

            goodsCategoryLoading: true,
            goodsCategory: [],
            brandLoading: true,
            brandList: [],
            serialLoading: true,
            serialList: [],
            typeLoading: true,
            typeList: [],
            imgPkGlobalId: '',
            imgSort: {},//新上传的图片排序标志

            imageUrl: '',
            imageUrlId: '',

            ckList:'',

            hasPrivilege: false
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

        this.thumb = api.thumb + '/'
        this.file = api.file + '/'

        this.fetchData(api.hasPrivilege,'',(data) => {
            this.hasPrivilege = data.has
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
            if(this.postSaleSearch){
                _searchData+='&postSale='+this.postSaleSearch
            }
            if(this.keywordSearch){
                _searchData+='&keyword='+this.keywordSearch
            }
            if(this.idSearch){
                _searchData+='&purchaseDetail.id='+this.idSearch
            }
            if(this.sidSearch){
                _searchData+='&id='+this.sidSearch
            }
            if(this.cidSearch){
                _searchData+='&purchaseDetail.refId='+this.cidSearch
            }
            this.fetchData(api.baseManagement+'?sort=id,desc&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
                this.dataList=data
                this.loading=false
            })
        },
        reData() {
            this.loading=true
            this.currentPage=1
            let _searchData = ''
            if(this.statusSearch){
                _searchData+='&status='+this.statusSearch
            }
            if(this.postSaleSearch){
                _searchData+='&postSale='+this.postSaleSearch
            }
            if(this.keywordSearch){
                _searchData+='&keyword='+this.keywordSearch
            }
            if(this.idSearch){
                _searchData+='&purchaseDetail.id='+this.idSearch
            }
            if(this.sidSearch){
                _searchData+='&id='+this.sidSearch
            }
            if(this.cidSearch){
                _searchData+='&purchaseDetail.refId='+this.cidSearch
            }
            this.fetchData(api.baseManagement+'?sort=id,desc&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
                this.dataList=data
                this.loading=false
                console.log(data)
            })
        },
        showModify(index , data) {
            this.activeName = 'first'
            
            console.log(data[index])
            /*第一个tab标签里的数据*/
            this.modifyForm.id=data[index].id
            this.modifyForm.purchaseRefId=data[index].purchaseDetail.refId//采购编号
            this.modifyForm.purchaseId=data[index].purchaseDetail.id//产品编号
            this.modifyForm.name=data[index].name
            this.modifyForm.sameRate=data[index].sameRate
            this.modifyForm.customerRate=data[index].customerRate
            this.modifyForm.price=data[index].price
            this.modifyForm.customerPrice=data[index].customerPrice
            this.modifyForm.publicPrice=data[index].publicPrice
            this.modifyForm.description=data[index].description
            this.modifyForm.coverImg=data[index].coverImg
            this.modifyForm.base.id=data[index].base?data[index].base.id:''

            /*第二个tab标签里的数据*/
            this.goodsCategory.push({'name':data[index].categoryName,'pkGlobalId':data[index].categoryId})
            this.secondForm.categoryId=data[index].categoryId || ''

            this.brandList.push({'name':data[index].brandName,'pkGlobalId':data[index].brandId})
            this.secondForm.brandId=data[index].brandId || ''

            this.serialList.push({'name':data[index].serialName,'pkGlobalId':data[index].serialId})
            this.secondForm.serialId=data[index].serialId || ''

            this.typeList.push({'name':data[index].typeName,'pkGlobalId':data[index].typeId})
            this.secondForm.typeId=data[index].typeId || ''

            this.secondForm.qualityId=data[index].qualityId
            this.secondForm.goodsStyle=data[index].goodsStyle
            // this.secondForm.goodsPartsArr=data[index].goodsParts.split(',')

            this.secondForm.categoryName=data[index].categoryName
            this.secondForm.brandName=data[index].brandName
            this.secondForm.serialName=data[index].serialName
            this.secondForm.typeName=data[index].typeName


            this.modifyState=true

        },
        modify(modifyForm) {
            this.$refs[modifyForm].validate((valid) => {
                if (valid) {
                    this.modifyLoading=true
                    this.patchData(api.baseManagement+'/'+this.modifyForm.id,this.modifyForm,(data) => {
                        this.modifyLoading=false
                        this.reData()
                        this.$message({message: '恭喜你，保存成功',type: 'success'})
                    })
                    
                } else { return false }
            })
        },
        second(secondForm) {
            this.$refs[secondForm].validate((valid) => {
                if (valid) {
                    this.secondForm.goodsParts=this.secondForm.goodsPartsArr.join(',')
                    this.patchData(api.baseManagement+'/'+this.modifyForm.id,this.secondForm,(data) => {
                        this.modifyLoading=false
                        this.reData()
                        this.$message({message: '恭喜你，保存成功',type: 'success'})
                    })

                } else { return false }
            })
        },
        thirdA(thirdFormA) {
            this.$refs[thirdFormA].validate((valid) => {
                if (valid) {

                    console.log(this.thirdFormA)
                    delete this.thirdFormA.createTime
                    this.patchData(api.goodsAttr+'/'+this.thirdFormA.pkGlobalId,this.thirdFormA,(data) => {
                        this.reData()
                        this.$message({message: '恭喜你，保存成功',type: 'success'})
                    })
                    
                } else { return false }
            })
        },
        thirdB(thirdFormB) {
            this.$refs[thirdFormB].validate((valid) => {
                if (valid) {
 
                    delete this.thirdFormB.createTime
                    this.patchData(api.goodsAttr+'/'+this.thirdFormB.pkGlobalId,this.thirdFormB,(data) => {
                        this.reData()
                        this.$message({message: '恭喜你，保存成功',type: 'success'})
                    })
                    
                } else { return false }
            })
        },
        fourthA(fourthFormA) {
            this.$refs[fourthFormA].validate((valid) => {
                if (valid) {
                    delete this.fourthFormA.createTime
                    if(this.fourthFormA.pkGlobalId){
                        this.patchData(api.goodsAttrWatch+'/'+this.fourthFormA.pkGlobalId,this.fourthFormA,(data) => {
                            this.reData()
                            this.$message({message: '恭喜你，保存成功',type: 'success'})
                        })
                    }else{
                        this.subForm(api.goodsAttrWatch,this.fourthFormA,(data) => {
                            this.reData()
                            this.$message({message: '恭喜你，保存成功',type: 'success'})
                        })
                    }
                } else { return false }
            })
        },
        fourthB(fourthFormB){
            this.$refs[fourthFormB].validate((valid) => {
                if (valid) {
                    delete this.fourthFormB.createTime
                    if(this.fourthFormB.pkGlobalId){
                        this.patchData(api.goodsAttrBag+'/'+this.fourthFormB.pkGlobalId,this.fourthFormB,(data) => {
                            this.reData()
                            this.$message({message: '恭喜你，保存成功',type: 'success'})
                        })
                    }else{
                        this.subForm(api.goodsAttrBag,this.fourthFormB,(data) => {
                            this.reData()
                            this.$message({message: '恭喜你，保存成功',type: 'success'})
                        })
                    }
                    
                } else { return false }
            })
        },
        fifth(){

            let _p = {
                'id':this.modifyForm.id,
                'coverImg':this.imageUrlId
            }
            console.log(_p)
            this.patchData(api.baseManagement+'/'+this.modifyForm.id,_p,(data) => {
                this.reData()
                this.$message({message: '恭喜你，保存成功',type: 'success'})
            })

            this.deleteFile()
        },
        deleteFile(){
            if(this.deleteImgList.length>0){
                let _id = this.deleteImgList.pop()
                this.deleteData(api.goodsImage+'/'+_id,'',(data) => {
                    this.deleteFile()
                })
            }
        },
        goodsCategoryLoad(show) {
            if(show){
                this.fetchData(api.goodsCategory+'?page=0&size=9999','',(data) => {
                    this.goodsCategory=data.content
                    this.goodsCategoryLoading=false
                })
            }
        },
        categoryIdChange(event){
            for(let i in this.goodsCategory){
                if(this.goodsCategory[i].pkGlobalId==event){
                    this.secondForm.categoryName=this.goodsCategory[i].name
                }
            }
        },
        brandLoad(show){
            if(show){
                this.fetchData(api.brand+'?page=0&size=9999','',(data) => {
                    this.brandList=data.content
                    this.brandLoading=false
                })
            }
        },
        brandIdChange(event){
            for(let i in this.brandList){
                if(this.brandList[i].pkGlobalId==event){
                    this.secondForm.brandName=this.brandList[i].name
                }
            }
        },
        serialLoad(show) {
            if(show && !!this.secondForm.brandId){
                this.fetchData(api.goodsSerial+'?page=0&size=9999&brand.pkGlobalId='+this.secondForm.brandId,'',(data) => {
                    this.serialList=data.content
                    this.serialLoading=false
                })
            }
        },
        serialIdChange(event){
            for(let i in this.serialList){
                if(this.serialList[i].pkGlobalId==event){
                    this.secondForm.serialName=this.serialList[i].name
                }
            }
        },
        typeLoad(show) {
            if(show){
                if(!!this.secondForm.serialId){
                    this.fetchData(api.goodsType+'?page=0&size=9999&brand.pkGlobalId='+this.secondForm.brandId+'&serial.pkGlobalId='+this.secondForm.serialId,'',(resData) => {
                        this.typeList=resData.content
                        this.typeLoading=false
                    })
                }else{
                    this.fetchData(api.goodsType+'?page=0&size=9999&brand.pkGlobalId='+this.secondForm.brandId,'',(resData) => {
                        this.typeList=resData.content
                        this.typeLoading=false
                    })
                }
            }
        },
        typeChange(event){
            for(let i in this.typeList){
                if(this.typeList[i].pkGlobalId==event){
                    this.secondForm.typeName=this.typeList[i].name
                }
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
                    this.deleteImgList.push(file.name.split('|')[0])
                    let _index = this.modifyImgId.indexOf(file.name.split('|')[1])
                    this.modifyImgId.splice(_index,1)
                }
            }
        },
        imgListSuccess(res, file){
            this.imageUrl = URL.createObjectURL(file.raw)
            this.imageUrlId = res.UPLOAD_FILE_ID[0]
        },
        changeTabs(targetName) {
            if(targetName.name=='second'){

            }else if(targetName.name=='third'){
                this.fetchData(api.goodsAttr+'?goodsId='+this.modifyForm.id+'&page=0&size=999','',(data) => {
                    console.log(data)
                    if(data.content[0].categoryId=='1'){
                        this.thirdFormA=data.content[0]
                    }else if(data.content[0].categoryId=='2'){
                        this.thirdFormB=data.content[0]
                    }
                })
            }else if(targetName.name=='fourth'){
                if(this.secondForm.categoryId=='1'){
                    this.fetchData(api.goodsAttrWatch+'?goodsId='+this.modifyForm.pkGlobalId,'',(data) => {
                        if(data.content){
                            this.fourthFormA=data.content[0]
                        }
                    })
                }else if(this.secondForm.categoryId=='2'){
                    this.fetchData(api.goodsAttrBag+'?goodsId='+this.modifyForm.pkGlobalId,'',(data) => {
                        if(data.content){
                            this.fourthFormB=data.content[0]
                        }
                    })
                }
            }else if(targetName.name=='fifth'){
                this.imageUrl=this.thumb+this.modifyForm.coverImg
            }
        },
        compare(property) {
            return function(a,b){
                var value1 = a[property]
                var value2 = b[property]
                return value1 - value2
            }
        },
        open(href){
            let _href = encodeURI(href+this.secondForm.typeName)
            window.open(_href)
        },
        handlePictureCardPreview(file){
            window.open(file.url)
        },
        publishGoods(index , data){
            console.log(data[index])
            this.$confirm('确定发布吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.subForm(api.baseManagement+'/publish?goodsId='+data[index].id,'',(data) => {
                    this.reData()
                    this.$message({
                        type: 'success',
                        message: '上架成功!'
                    })
                })
            }).catch(() => {
        
            })
        },
        openImg(href){
            this.dialogImageUrl = ''
            this.dialogVisible = true
            this.dialogImageUrl = href
        },
        exportData(){
            let _searchData = ''
            if(this.statusSearch){
                _searchData+='&status='+this.statusSearch
            }
            if(this.postSaleSearch){
                _searchData+='&postSale='+this.postSaleSearch
            }
            window.open(api.baseManagement+'/export'+_searchData)
        }
    }
}
</script>