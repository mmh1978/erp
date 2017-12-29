<style lang="less" scope>

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
                        <el-input v-model="goodsNameSearch" placeholder="请输入查询商品名称"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-input v-model="nickNameSearch" placeholder="请输入查询卖家名称"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-input v-model="phoneSearch" placeholder="请输入查询卖家电话"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-input v-model="goodsCodeSearch" placeholder="请输入商品编号"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="categoryIdSearch" clearable placeholder="请选择商品品类" @visible-change="visibleChange" :loading="selectLoading" remote>
                            <el-option v-for="item in categoryList" :key="item.pkGlobalId" :value="item.pkGlobalId" :label="item.name"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="">
                        <el-checkbox label="推荐" v-model="recommendSearch" name="type"></el-checkbox>
                    </el-form-item>
                    <el-form-item label="">
                        <el-checkbox label="自营" v-model="proprietarySearch" name="type"></el-checkbox>
                    </el-form-item>
                    <el-form-item>
                        <el-button icon="search" @click="reData">搜索</el-button>
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
                <el-table-column prop="goodsCode" label="商品编号" width="130"></el-table-column>
                <el-table-column prop="erpGoodsId" label="ERP商品编号" min-width="120"></el-table-column>
                <el-table-column prop="title" label="商品名称" min-width="120"></el-table-column>
                <el-table-column prop="descript" label="描述" min-width="150"></el-table-column>
                <el-table-column prop="price" label="同行价" min-width="120"></el-table-column>
                <el-table-column prop="consumerPrice" label="客户价" min-width="120"></el-table-column>
                <el-table-column prop="readTimes" label="浏览量" min-width="120"></el-table-column>
                <el-table-column prop="tblUser.nickName" label="卖家名称" min-width="120"></el-table-column>
                <el-table-column prop="tblUser.phone" label="卖家电话" width="130"></el-table-column>
                <el-table-column prop="goodsStatus" label="上架" width="80">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].goodsStatus=='1'">
                            <i class="el-icon-minus"></i>
                        </template>
                        <template v-else>
                            <i class="el-icon-check" style="color:#13ce66"></i>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="recommend" label="推荐" width="80">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].recommend=='1'">
                            <i class="el-icon-check" style="color:#13ce66"></i>
                        </template>
                        <template v-else>
                            <i class="el-icon-minus"></i>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="proprietary" label="自营" width="80">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].proprietary=='1'">
                            <i class="el-icon-check" style="color:#13ce66"></i>
                        </template>
                        <template v-else>
                            <i class="el-icon-minus"></i>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="isAgree" label="审核" width="80">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].isAgree=='1'">
                            <i class="el-icon-check" style="color:#13ce66"></i>
                        </template>
                        <template v-if="dataList.content[scope.$index].isAgree=='0'">
                            <i class="el-icon-minus"></i>
                        </template>
                        <template v-if="dataList.content[scope.$index].isAgree=='2'">
                            待审核
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="sellStatus" label="销售状态" width="100">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].sellStatus=='0'">
                            在售
                        </template>
                        <template v-if="dataList.content[scope.$index].sellStatus=='1'">
                            交易中
                        </template>
                        <template v-if="dataList.content[scope.$index].sellStatus=='2'">
                            线上销售
                        </template>
                        <template v-if="dataList.content[scope.$index].sellStatus=='3'">
                            线下销售
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序" width="80"></el-table-column>
                <el-table-column prop="createTime" label="修改时间" width="180"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click.native.prevent="showModify(scope.$index, dataList.content)">编辑</el-button>
                        <el-button type="text" size="small" @click.native.prevent="showVerify(scope.$index, dataList.content)">审核</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <div class="bottom-bar">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="dataList.totalElements"></el-pagination>
        </div>
        <el-dialog title="编辑商品" :visible.sync="modifyState" size="large" :before-close="handleClose">
            <el-tabs type="border-card" v-model="activeName" @tab-click="changeTabs">
                <el-tab-pane label="主要属性" name="first">
                    <el-form :model="modifyForm" :rules="modifyRules" ref="modifyForm" label-width="100px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="商品标题" prop="title">
                                    <el-input v-model="modifyForm.title"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="商品描述" prop="descript">
                                    <el-input v-model="modifyForm.descript"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="商品编号" prop="goodsCode">
                                    <el-input v-model="modifyForm.goodsCode"></el-input>
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
                                    <el-input-number v-model="modifyForm.consumerPrice" :min="0" style="width:100%" :controls="false"></el-input-number>
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
                                <el-form-item label="销售状态" prop="sellStatus">
                                    <!-- <el-input v-model="modifyForm.sellStatus"></el-input> -->
                                    <el-select v-model="modifyForm.sellStatus" placeholder="请选择" style="width:100%">
                                        <el-option :label="'在售'" :value="0"></el-option>
                                        <el-option :label="'交易中'" :value="1"></el-option>
                                        <el-option :label="'线上销售'" :value="2"></el-option>
                                        <el-option :label="'线下销售'" :value="3"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="发布人" prop="">
                                    <el-input v-model="modifyForm.tblUser.nickName" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="商品排序" prop="sort">
                                    <el-input v-model="modifyForm.sort"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item>
                                    <el-checkbox v-model="modifyForm.goodsStatus">上架</el-checkbox>
                                    <el-checkbox v-model="modifyForm.isRecommend">首页精品推荐</el-checkbox>
                                    <el-checkbox v-model="modifyForm.isProprietary">自营</el-checkbox>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="备注">
                                    <el-input type="textarea" v-model="modifyForm.memo"></el-input>
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
                            <el-col :span="12"> 
                                <el-form-item label="">
                                    <el-button @click="open('http://www.xbiao.com/search/index?wd=')">腕表之家</el-button>
                                    <el-button @click="open('https://www.baidu.com/s?wd=')">百度</el-button>
                                    <el-button @click="open('https://search.jd.com/Search?keyword=')">京东</el-button>
                                    <el-button @click="open('https://paimai.taobao.com/pmp_list/3____1_1.htm?q=')">闲鱼拍卖</el-button>
                                    <el-button @click="importAttr">导入属性</el-button>
                                </el-form-item>
                            </el-col>
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
                <el-tab-pane label="二手属性" name="third">
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
                </el-tab-pane>
                <el-tab-pane label="图片" name="fifth">
                    <el-upload id="sort_img" :action="file+'/upload'" list-type="picture-card" :file-list="modifyImgList" :on-remove="handleRemove" :on-success="imgListSuccess" :on-preview="handlePictureCardPreview">
                        <i class="el-icon-plus"></i>
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
        <el-dialog title="审核" :visible.sync="verifyState" size="tiny">
            <el-form ref="verifyForm" :model="verifyForm" label-width="80px" >
                <el-form-item label="审核状态">
                    <el-select v-model="verifyForm.isAgree" placeholder="请选择审核状态">
                        <el-option label="未通过" value="0"></el-option>
                        <el-option label="已通过" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="verifyForm.memo"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="verify" :loading="verifyLoading">确定</el-button>
                    <el-button  @click="verifyState = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import api from '../../../util/api'
import ajax from '../../../util/ajax'
import Sortable from 'sortablejs'
export default {
    name: 'goodAgreeList',
    mixins: [ajax],
    data () {
        return {
            dialogVisible: false,
            dialogImageUrl: '',
            
            goodsNameSearch: '',
            nickNameSearch: '',
            phoneSearch: '',
            goodsCodeSearch: '',
            categoryIdSearch: '',
            isAgreeSearch: '',
            recommendSearch: '',
            proprietarySearch: '',
            selectLoading: false,
            categoryList:'',
            dataList: '',
            currentPage: 1,
            pageSize: 20,
            loading: false,

            file: '',
            thumb: '',

            verifyForm: {
                isAgree: '',
                memo: '',
                goodsId: '',
            },

            modifyState: false,
            modifyLoading: false,
            modifyForm: {
                pkGlobalId: '',
                title: '',
                descript: '',
                goodsCode: '',
                price: '',
                consumerPrice: '',
                publicPrice: '',
                sellStatus: '',
                tblUser: '',
                sort: '',
                goodsStatus: '',
                goodsStatus:'',
                isRecommend: '',
                isProprietary: '',
                memo: '',
            },
            modifyRules: {
                pkGlobalId: [
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

            verifyState: false,
            verifyLoading: false,
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
            if(this.goodsNameSearch){
                _searchData+='&goodsName='+this.goodsNameSearch
            }
            if(this.nickNameSearch){
                _searchData+='&tblUser.nickName='+this.nickNameSearch
            }
            if(this.phoneSearch){
                _searchData+='&tblUser.phone='+this.phoneSearch
            }
            if(this.goodsCodeSearch){
                _searchData+='&keyword='+this.goodsCodeSearch
            }
            if(this.categoryIdSearch){
                _searchData+='&categoryId='+this.categoryIdSearch
            }
            if(this.isAgreeSearch){
                _searchData+='&isAgree='+this.isAgreeSearch
            }
            if(this.recommendSearch){
                _searchData+='&recommend='+this.recommendSearch
            }
            if(this.proprietarySearch){
                _searchData+='&proprietary='+this.proprietarySearch
            }
            this.fetchData(api.sellGoods+'?isAgree=2&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
                this.dataList=data
                this.loading=false
            })
        },
        reData() {
            this.loading=true
            this.currentPage=1
            let _searchData = ''
            if(this.goodsNameSearch){
                _searchData+='&goodsName='+this.goodsNameSearch
            }
            if(this.nickNameSearch){
                _searchData+='&tblUser.nickName='+this.nickNameSearch
            }
            if(this.phoneSearch){
                _searchData+='&tblUser.phone='+this.phoneSearch
            }
            if(this.goodsCodeSearch){
                _searchData+='&keyword='+this.goodsCodeSearch
            }
            if(this.categoryIdSearch){
                _searchData+='&categoryId='+this.categoryIdSearch
            }
            if(this.isAgreeSearch){
                _searchData+='&isAgree='+this.isAgreeSearch
            }
            if(this.recommendSearch){
                _searchData+='&recommend='+this.recommendSearch
            }
            if(this.proprietarySearch){
                _searchData+='&proprietary='+this.proprietarySearch
            }
            this.fetchData(api.sellGoods+'?isAgree=2&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
                this.dataList=data
                this.loading=false
                console.log(data)
            })
        },
        showVerify(index , data) {
            this.verifyForm.goodsId=data[index].pkGlobalId
            this.verifyState=true
        },
        verify() {
            this.verifyLoading=true
            this.patchData(api.sellGoods+'/agree',this.verifyForm,(data) => {
                this.reData()
                this.$message({message: '恭喜你，保存成功',type: 'success'})
                this.verifyState=false
                this.verifyLoading=false
            })
        },
        showModify(index , data) {
            this.activeName = 'first'
            
            /*第一个tab标签里的数据*/
            this.modifyForm.pkGlobalId=data[index].pkGlobalId
            this.modifyForm.title=data[index].title
            this.modifyForm.descript=data[index].descript
            this.modifyForm.goodsCode=data[index].goodsCode
            this.modifyForm.price=data[index].price
            this.modifyForm.consumerPrice=data[index].consumerPrice
            this.modifyForm.publicPrice=data[index].publicPrice || ''
            this.modifyForm.sellStatus=data[index].sellStatus
            this.modifyForm.tblUser=data[index].tblUser
            this.modifyForm.sort=data[index].sort
            this.modifyForm.goodsStatus=data[index].goodsStatus == '0' ? true : false
            this.modifyForm.isRecommend=data[index].isRecommend == '1' ? true : false
            this.modifyForm.isProprietary=data[index].isProprietary == '1' ? true : false
            this.modifyForm.memo=data[index].memo || ''

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
            if(data[index].goodsParts){
                this.secondForm.goodsPartsArr=data[index].goodsParts.split(',')
            }

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
                    this.modifyForm.goodsStatus=!this.modifyForm.goodsStatus
                    this.patchData(api.sellGoods+'/'+this.modifyForm.pkGlobalId,this.modifyForm,(data) => {
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
                    this.patchData(api.sellGoods+'/'+this.modifyForm.pkGlobalId,this.secondForm,(data) => {
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
                'goodsId':this.modifyForm.pkGlobalId,
                'images':this.modifyImgId.join(',')
            }
            console.log(_p)
            this.putData(api.goodsImage+'/'+this.modifyForm.pkGlobalId,_p,(data) => {
                this.reData()
                this.$message({message: '恭喜你，修改成功',type: 'success'})
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
        imgListSuccess(res, flie){
            if(this.addState){
                this.imgList.push(res.UPLOAD_FILE_ID[0])
            }else if (this.modifyState){
                this.modifyImgId.push(res.UPLOAD_FILE_ID[0])
                this.imgSort[`${flie.url}`]=res.UPLOAD_FILE_ID[0]
            }
        },
        changeTabs(targetName) {
            if(targetName.name=='second'){

            }else if(targetName.name=='third'){
                this.fetchData(api.goodsAttr+'?goodsId='+this.modifyForm.pkGlobalId+'&page=0&size=999','',(data) => {
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
                this.modifyImgList=[]
                this.modifyImgId=[]
                this.fetchData(api.goodsImage+'?goodsId='+this.modifyForm.pkGlobalId,'',(data) => {
                    console.log(data)
                    let _arr = data.content
                    _arr.sort(this.compare('sort'))
                    console.log(_arr)
                    for(let i in _arr){
                        this.modifyImgList.push({
                            name: _arr[i].pkGlobalId + '|' + _arr[i].fileId,
                            url: api.file+'/'+_arr[i].fileId,
                            status: 'finished'
                        })
                        this.modifyImgId.push(_arr[i].fileId)
                    }
                })
                let _vue=this
                let _blob=[]
                this.$nextTick(function(){
                    let _el = document.getElementById('sort_img').children[0]
                    new Sortable(_el, {
                        group: "omega" ,
                        onEnd: function (evt){
                            let _list = evt.from.children
                            _blob=[]
                            _vue.modifyImgId=[]
                            for(let i = 0 ; i<_list.length ;i++){
                                console.log(_list[i].children[0].currentSrc)
                                _blob.push(_list[i].children[0].currentSrc)
                            }
                            for(let j in _blob){
                                if(_blob[j].split(':')[0]=='blob'){
                                    _vue.modifyImgId.push(_vue.imgSort[`${_blob[j]}`])
                                }else if(_blob[j].split(':')[0]=='http'){
                                    _vue.modifyImgId.push(_blob[j].split('/')[_blob[j].split('/').length-1])
                                }
                            }
                        }
                    })
                })
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
            this.dialogImageUrl = file.url
            this.dialogVisible = true
        },
        openImg(href){
            this.dialogImageUrl = ''
            this.dialogVisible = true
            this.dialogImageUrl = href
        },
        visibleChange(data) {
            this.selectLoading = true
            if(data){
                this.fetchData(api.goodsCategory+'?page=0&size=9999','',(data) => {
                    this.categoryList=data.content
                    this.selectLoading=false
                    console.log(data)
                })
            }
        },
        importAttr(){
            if(!this.secondForm.typeId){
                this.$message({
                    message: '请选择型号',
                    type: 'warning'
                })
            }else{
                this.fetchData(api.goodsAttr+'/info/?typeId='+this.secondForm.typeId+'&brandId='+this.secondForm.brandId+'&categoryId='+this.secondForm.categoryId,'', (data) => {
                    let _data = data
                    if(this.secondForm.categoryId=='1'){
                        for(var i in this.fourthFormA){
                            this.fourthFormA[i]=_data[i]
                        }
                    }
                    if(this.secondForm.categoryId=='2'){
                        for(var k in this.fourthFormB){
                            this.fourthFormA[k]=_data[k]
                        }
                    }
                    this.activeName = 'fourth'
                })
            }
        },
        handleClose(done) {
            this.fourthFormA = {
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
            done()
        }
    }
}
</script>