<style lang="less" scope>
    .goods_img{
        width: 100%;
        height: 320px;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
        margin-top: 10px;
    }
table.gridtable , table.innertable{
    font-size:14px;
    color:#333333;
    border-width: 1px;
    border-color: #666;
    border-collapse: collapse;
    width: 100%;
}
table.gridtable td{
    border-width: 1px;
    border-style: solid;
    border-color: #666;
    background-color: #ffffff;
}
table.gridtable td>div{
    margin: 10px;
}
table.gridtable td>div input{
    border: 0;
    width: 100%;
    outline: none;
    font-size: 14px;
}
table.gridtable td>div .checkbox{
    display: inline-block;
    position: relative;
    padding-left: 20px;
    margin-right: 16px;
}
table.gridtable td>div .checkbox:before{
    content: "";
    display: block;
    position: absolute;
    width: 14px;
    height: 14px;
    border: 1px solid #999;
    border-radius: 4px;
    left: 0;
    top: 50%;
    margin-top: -8px;
    line-height: 14px;
    text-align: center;
}
table.gridtable td>div .checkbox.ok:before{
    content: "\2713";
    font-weight: bold;
    border: 2px solid #000;
}
table.innertable td{
    border-top: none;
    border-left: none;
    border-bottom: none;
    border-right: 1px solid #666;
}
table.innertable td:last-child{
    border: none;
}
</style>
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
                        <el-input v-model="sellUserPhoneSearch" placeholder="发布人手机号"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-input v-model="buyUserPhoneSearch" placeholder="发布人用户名"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="statusSearch" clearable placeholder="鉴定类型">
                            <el-option :key="0" :label="'平台鉴定'" :value="'0'"></el-option>
                            <el-option :key="1" :label="'中检鉴定'" :value="'1'"></el-option>
                            <el-option :key="2" :label="'实物鉴定'" :value="'2'"></el-option>
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
                <el-table-column prop="user.nickName" label="发布人" min-width="130"></el-table-column>
                <el-table-column prop="user.phone" label="手机号" width="140"></el-table-column>
                <el-table-column prop="method" label="鉴定类型" min-width="120">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].method=='0'">
                            平台鉴定
                        </template>
                        <template v-if="dataList.content[scope.$index].method=='1'">
                            中检鉴定
                        </template>
                        <template v-if="dataList.content[scope.$index].method=='2'">
                            实物鉴定
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="price" label="鉴定费用" width="100"></el-table-column>
                <el-table-column prop="categoryName" label="类型" width="80"></el-table-column>
                <el-table-column prop="result" label="最低价最高价" width="130">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].result && dataList.content[scope.$index].result[0].lowValue">
                            {{dataList.content[scope.$index].result[0].lowValue}}<br>
                        </template>
                        <template v-else>-<br></template>
                        <template v-if="dataList.content[scope.$index].result && dataList.content[scope.$index].result[0].highValue">
                            {{dataList.content[scope.$index].result[0].highValue}}
                        </template>
                        <template v-else>-</template>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="发布时间" width="180"></el-table-column>
                <el-table-column prop="" label="鉴定时间" width="180">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].result && dataList.content[scope.$index].result[0].createTime">
                            {{dataList.content[scope.$index].result[0].createTime}}<br>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="result" label="鉴定师" min-width="120">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].result && dataList.content[scope.$index].result[0].user">
                            {{dataList.content[scope.$index].result[0].user.nickName}}<br>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="result" label="鉴定结果" min-width="120">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].result && dataList.content[scope.$index].result[0].isTrue">
                            <template v-if="dataList.content[scope.$index].result[0].isTrue=='-1'">不确定</template>
                            <template v-if="dataList.content[scope.$index].result[0].isTrue=='1'">未通过</template>
                            <template v-if="dataList.content[scope.$index].result[0].isTrue=='0'">通过</template>
                        </template>
                    </template>
                </el-table-column>
               <el-table-column prop="identifyStatus" label="鉴定状态" min-width="120">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].identifyStatus=='0'">
                          待鉴定
                        </template>
                        <template v-if="dataList.content[scope.$index].identifyStatus=='1'">
                          已完成
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="审核结果" min-width="120">
                    <template slot-scope="scope">
                        <template v-if="dataList.content[scope.$index].isAgree=='0'">
                          未通过
                        </template>
                        <template v-else>
                          已通过
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

            <el-tabs type="border-card" v-model="activeName" @tab-click="changeTabs">
                <!-- the first tab -->
                <el-tab-pane label="基本信息" name="first">
                    <div style="overflow:hidden">
                        <div v-for="item in fileList"  style="width:200px;height:200px;float:left;margin-right:10px;background-size:cover;background-position:center" :style="{backgroundImage:'url('+thumb + item.fileId+')'}"></div>
                    </div>
                    <el-form label-width="80px">
                        <el-form-item label="品牌">
                            <span>{{detail.brandName}}</span>
                        </el-form-item>
                        <el-form-item label="发布人">
                            <span>{{detail.user.nickName}}</span>
                        </el-form-item>
                        <el-form-item label="地址">
                            <span v-if="detail.address">{{detail.address.detailAddr}}</span>
                        </el-form-item>
                        <el-form-item label="订单号">
                            <span>{{detail.pkGlobalId}}</span>
                        </el-form-item>
                        <el-form-item label="中检证书">
                            <span v-if="detail.method=='1'">需要</span>
                            <span v-else>不需要</span>
                        </el-form-item>
                        <el-form-item label="审核状态">
                            <el-select v-model="subDetail.isAgree" placeholder="请选择" disabled>
                                <el-option :label="'未通过'" :value="0"></el-option>
                                <el-option :label="'已通过'" :value="1"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="发货单号">
                            <el-input v-model="subDetail.sendNumber1" disabled>
                                <template slot="append">用户发往平台</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="发货单号">
                            <el-input v-model="subDetail.sendNumber2" disabled>
                                <template slot="append">平台发往用户</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="备注">
                            <el-input v-model="subDetail.memo" disabled></el-input>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <!-- the second tab -->
                <el-tab-pane label="鉴定报告" name="second">

                    <!-- 表的打印表格 -->
                    <div id="print" v-if="detail.categoryId=='1'">
                        <h4 style="text-align:center;font-size:28px;padding:16px;">名表检验单</h4>
                        <table class="gridtable">
                            <tr>
                                <td rowspan="4" width="50">
                                    <div>基本信息</div>
                                </td>
                                <td width="100"><div>客户姓名</div></td>
                                <td width="100"><div v-if="isPrint"><input type="text" v-model="tableWatch.customerName"></div><div v-else>{{tableWatch.customerName}}&nbsp;</div></td>
                                <td width="80"><div>鉴定人</div></td>
                                <td><div v-if="isPrint"><input type="text" v-model="tableWatch.appraiser"></div><div v-else>{{tableWatch.appraiser}}&nbsp;</div></td>
                                <td width="80"><div>日期</div></td>
                                <td><div v-if="isPrint"><input type="text" v-model="tableWatch.identifyDate"></div><div v-else>{{tableWatch.identifyDate}}&nbsp;</div></td>
                            </tr>
                            <tr>
                                <td width="100"><div>品牌</div></td>
                                <td><div v-if="isPrint"><input type="text" v-model="tableWatch.brandName"></div><div v-else>{{tableWatch.brandName}}&nbsp;</div></td>
                                <td width="80"><div>系列</div></td>
                                <td><div v-if="isPrint"><input type="text" v-model="tableWatch.serialName"></div><div v-else>{{tableWatch.serialName}}&nbsp;</div></td>
                                <td width="80"><div>公价</div></td>
                                <td><div v-if="isPrint"><input type="text" v-model="tableWatch.publicPrice"></div><div v-else>{{tableWatch.publicPrice}}&nbsp;</div></td>
                            </tr>
                            <tr>
                                <td width="100"><div>款型</div></td>
                                <td colspan="2">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.style" :min="0" :max="3">
                                            <el-checkbox :label="'1'">男</el-checkbox>
                                            <el-checkbox :label="'2'">女</el-checkbox>
                                            <el-checkbox :label="'3'">中性</el-checkbox>
                                            <el-checkbox :label="'4'">怀表</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.style.indexOf('1') >= 0}">男</span>
                                        <span class="checkbox" :class="{ok:tableWatch.style.indexOf('2') >= 0}">女</span>
                                        <span class="checkbox" :class="{ok:tableWatch.style.indexOf('3') >= 0}">中性</span>
                                        <span class="checkbox" :class="{ok:tableWatch.style.indexOf('4') >= 0}">怀表</span>
                                    </div>
                                </td>
                                <td width="80"><div>包装</div></td>
                                <td colspan="2">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.packaging" :min="0">
                                            <el-checkbox :label="'1'">包装盒</el-checkbox>
                                            <el-checkbox :label="'2'">表卡</el-checkbox>
                                            <el-checkbox :label="'3'">证书</el-checkbox>
                                            <el-checkbox :label="'4'">保修</el-checkbox>
                                            <el-checkbox :label="'5'">使用说明</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.packaging.indexOf('1') >= 0}">包装盒</span>
                                        <span class="checkbox" :class="{ok:tableWatch.packaging.indexOf('2') >= 0}">表卡</span>
                                        <span class="checkbox" :class="{ok:tableWatch.packaging.indexOf('3') >= 0}">证书</span>
                                        <span class="checkbox" :class="{ok:tableWatch.packaging.indexOf('4') >= 0}">保修</span>
                                        <span class="checkbox" :class="{ok:tableWatch.packaging.indexOf('5') >= 0}">使用说明</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="100"><div>型号</div></td>
                                <td colspan="2">
                                    <div v-if="isPrint"><input type="text" v-model="tableWatch.typeName"></div><div v-else>{{tableWatch.typeName}}&nbsp;</div>
                                </td>
                                <td width="80"><div>来源</div></td>
                                <td colspan="2">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.source" :min="0" :max="3">
                                            <el-checkbox :label="'1'">发票</el-checkbox>
                                            <el-checkbox :label="'2'">销售凭证</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.source.indexOf('1') >= 0}">发票</span>
                                        <span class="checkbox" :class="{ok:tableWatch.source.indexOf('2') >= 0}">销售凭证</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td rowspan="26">
                                    <div>检测流程</div>
                                </td>
                                <td width="100" rowspan="19"><div>外观</div></td>
                                <td width="80"><div>表壳痕迹</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.watchcaseTraces" :min="0">
                                            <el-checkbox :label="'1'">轻微划痕</el-checkbox>
                                            <el-checkbox :label="'2'">明显划痕</el-checkbox>
                                            <el-checkbox :label="'3'">坑点痕迹</el-checkbox>
                                            <el-checkbox :label="'4'">打磨痕迹</el-checkbox>
                                            <el-checkbox :label="'5'">明显损伤</el-checkbox>
                                            <el-checkbox :label="'6'">表壳不完整</el-checkbox>
                                            <el-checkbox :label="'7'">完好</el-checkbox>
                                            <el-checkbox :label="'8'">其他</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.watchcaseTraces.indexOf('1') >= 0}">轻微划痕</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchcaseTraces.indexOf('2') >= 0}">明显划痕</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchcaseTraces.indexOf('3') >= 0}">坑点痕迹</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchcaseTraces.indexOf('4') >= 0}">打磨痕迹</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchcaseTraces.indexOf('5') >= 0}">明显损伤</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchcaseTraces.indexOf('6') >= 0}">表壳不完整</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchcaseTraces.indexOf('7') >= 0}">完好</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchcaseTraces.indexOf('8') >= 0}">其他</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>表壳形状</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.watchcaseShape" :min="0">
                                            <el-checkbox :label="'1'">圆形</el-checkbox>
                                            <el-checkbox :label="'2'">酒桶形</el-checkbox>
                                            <el-checkbox :label="'3'">方形</el-checkbox>
                                            <el-checkbox :label="'4'">椭圆形</el-checkbox>
                                            <el-checkbox :label="'5'">花形</el-checkbox>
                                            <el-checkbox :label="'6'">其他</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.watchcaseShape.indexOf('1') >= 0}">圆形</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchcaseShape.indexOf('2') >= 0}">酒桶形</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchcaseShape.indexOf('3') >= 0}">方形</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchcaseShape.indexOf('4') >= 0}">椭圆形</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchcaseShape.indexOf('5') >= 0}">花形</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchcaseShape.indexOf('6') >= 0}">其他</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>材质</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.material" :min="0">
                                            <el-checkbox :label="'1'">钢</el-checkbox>
                                            <el-checkbox :label="'2'">钢及金</el-checkbox>
                                            <el-checkbox :label="'3'">18K白金</el-checkbox>
                                            <el-checkbox :label="'4'">18K玫瑰金</el-checkbox>
                                            <el-checkbox :label="'5'">18K黄金</el-checkbox>
                                            <el-checkbox :label="'6'">铂金</el-checkbox>
                                            <el-checkbox :label="'7'">陶瓷</el-checkbox>
                                            <el-checkbox :label="'8'">其他材质</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.material.indexOf('1') >= 0}">钢</span>
                                        <span class="checkbox" :class="{ok:tableWatch.material.indexOf('2') >= 0}">钢及金</span>
                                        <span class="checkbox" :class="{ok:tableWatch.material.indexOf('3') >= 0}">18K白金</span>
                                        <span class="checkbox" :class="{ok:tableWatch.material.indexOf('4') >= 0}">18K玫瑰金</span>
                                        <span class="checkbox" :class="{ok:tableWatch.material.indexOf('5') >= 0}">18K黄金</span>
                                        <span class="checkbox" :class="{ok:tableWatch.material.indexOf('6') >= 0}">铂金</span>
                                        <span class="checkbox" :class="{ok:tableWatch.material.indexOf('7') >= 0}">陶瓷</span>
                                        <span class="checkbox" :class="{ok:tableWatch.material.indexOf('8') >= 0}">其他材质</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>表径</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.watchDiameter" :min="0">
                                            <el-checkbox :label="'1'">22</el-checkbox>
                                            <el-checkbox :label="'2'">26</el-checkbox>
                                            <el-checkbox :label="'3'">28</el-checkbox>
                                            <el-checkbox :label="'4'">30</el-checkbox>
                                            <el-checkbox :label="'5'">34</el-checkbox>
                                            <el-checkbox :label="'6'">36</el-checkbox>
                                            <el-checkbox :label="'7'">38</el-checkbox>
                                            <el-checkbox :label="'8'">40</el-checkbox>
                                            <el-checkbox :label="'9'">42</el-checkbox>
                                            <el-checkbox :label="'10'">43</el-checkbox>
                                            <el-checkbox :label="'11'">45</el-checkbox>
                                            <el-checkbox :label="'12'">45以上</el-checkbox>
                                            <el-checkbox :label="'13'">其他</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.watchDiameter.indexOf('1') >= 0}">22</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchDiameter.indexOf('2') >= 0}">26</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchDiameter.indexOf('3') >= 0}">28</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchDiameter.indexOf('4') >= 0}">30</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchDiameter.indexOf('5') >= 0}">34</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchDiameter.indexOf('6') >= 0}">36</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchDiameter.indexOf('7') >= 0}">38</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchDiameter.indexOf('8') >= 0}">40</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchDiameter.indexOf('9') >= 0}">42</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchDiameter.indexOf('10') >= 0}">43</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchDiameter.indexOf('11') >= 0}">45</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchDiameter.indexOf('12') >= 0}">45以上</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchDiameter.indexOf('13') >= 0}">其他</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>表盘</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.watchDial" :min="0">
                                            <el-checkbox :label="'1'">划痕</el-checkbox>
                                            <el-checkbox :label="'2'">污渍</el-checkbox>
                                            <el-checkbox :label="'3'">水迹</el-checkbox>
                                            <el-checkbox :label="'4'">泥点</el-checkbox>
                                            <el-checkbox :label="'5'">完好</el-checkbox>
                                            <el-checkbox :label="'6'">其他</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.watchDial.indexOf('1') >= 0}">划痕</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchDial.indexOf('2') >= 0}">污渍</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchDial.indexOf('3') >= 0}">水迹</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchDial.indexOf('4') >= 0}">泥点</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchDial.indexOf('5') >= 0}">完好</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchDial.indexOf('6') >= 0}">其他</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>刻度</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.scale" :min="0">
                                            <el-checkbox :label="'1'">缺损</el-checkbox>
                                            <el-checkbox :label="'2'">污渍</el-checkbox>
                                            <el-checkbox :label="'3'">无荧光</el-checkbox>
                                            <el-checkbox :label="'4'">脱落</el-checkbox>
                                            <el-checkbox :label="'5'">遮掩</el-checkbox>
                                            <el-checkbox :label="'6'">非钻石</el-checkbox>
                                            <el-checkbox :label="'7'">完好</el-checkbox>
                                            <el-checkbox :label="'8'">其他</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.scale.indexOf('1') >= 0}">缺损</span>
                                        <span class="checkbox" :class="{ok:tableWatch.scale.indexOf('2') >= 0}">污渍</span>
                                        <span class="checkbox" :class="{ok:tableWatch.scale.indexOf('3') >= 0}">无荧光</span>
                                        <span class="checkbox" :class="{ok:tableWatch.scale.indexOf('4') >= 0}">脱落</span>
                                        <span class="checkbox" :class="{ok:tableWatch.scale.indexOf('5') >= 0}">遮掩</span>
                                        <span class="checkbox" :class="{ok:tableWatch.scale.indexOf('6') >= 0}">非钻石</span>
                                        <span class="checkbox" :class="{ok:tableWatch.scale.indexOf('7') >= 0}">完好</span>
                                        <span class="checkbox" :class="{ok:tableWatch.scale.indexOf('8') >= 0}">其他</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>表针</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.watchNeedle" :min="0">
                                            <el-checkbox :label="'1'">蓝钢</el-checkbox>
                                            <el-checkbox :label="'2'">K金</el-checkbox>
                                            <el-checkbox :label="'3'">合金</el-checkbox>
                                            <el-checkbox :label="'4'">划痕</el-checkbox>
                                            <el-checkbox :label="'5'">毛碴</el-checkbox>
                                            <el-checkbox :label="'6'">完好</el-checkbox>
                                            <el-checkbox :label="'7'">其他</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.watchNeedle.indexOf('1') >= 0}">蓝钢</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchNeedle.indexOf('2') >= 0}">K金</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchNeedle.indexOf('3') >= 0}">合金</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchNeedle.indexOf('4') >= 0}">划痕</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchNeedle.indexOf('5') >= 0}">毛碴</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchNeedle.indexOf('6') >= 0}">完好</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchNeedle.indexOf('7') >= 0}">其他</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>日历</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.calendar" :min="0">
                                            <el-checkbox :label="'1'">边框毛碴</el-checkbox>
                                            <el-checkbox :label="'2'">轮盘坏</el-checkbox>
                                            <el-checkbox :label="'3'">位置不正</el-checkbox>
                                            <el-checkbox :label="'4'">完好</el-checkbox>
                                            <el-checkbox :label="'5'">其他</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.calendar.indexOf('1') >= 0}">边框毛碴</span>
                                        <span class="checkbox" :class="{ok:tableWatch.calendar.indexOf('2') >= 0}">轮盘坏</span>
                                        <span class="checkbox" :class="{ok:tableWatch.calendar.indexOf('3') >= 0}">位置不正</span>
                                        <span class="checkbox" :class="{ok:tableWatch.calendar.indexOf('4') >= 0}">完好</span>
                                        <span class="checkbox" :class="{ok:tableWatch.calendar.indexOf('5') >= 0}">其他</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>小表盘</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.watchSmallDial" :min="0">
                                            <el-checkbox :label="'1'">运转不灵</el-checkbox>
                                            <el-checkbox :label="'2'">掉针</el-checkbox>
                                            <el-checkbox :label="'3'">完好</el-checkbox>
                                            <el-checkbox :label="'4'">其他</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.watchSmallDial.indexOf('1') >= 0}">运转不灵</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchSmallDial.indexOf('2') >= 0}">掉针</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchSmallDial.indexOf('3') >= 0}">完好</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchSmallDial.indexOf('4') >= 0}">其他</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>表镜</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.watchMirror" :min="0">
                                            <el-checkbox :label="'1'">蓝宝石</el-checkbox>
                                            <el-checkbox :label="'2'">玻璃</el-checkbox>
                                            <el-checkbox :label="'3'">亚克力</el-checkbox>
                                            <el-checkbox :label="'4'">磨损</el-checkbox>
                                            <el-checkbox :label="'5'">划痕</el-checkbox>
                                            <el-checkbox :label="'6'">磕边</el-checkbox>
                                            <el-checkbox :label="'7'">后换表镜</el-checkbox>
                                            <el-checkbox :label="'8'">变形</el-checkbox>
                                            <el-checkbox :label="'9'">完好</el-checkbox>
                                            <el-checkbox :label="'10'">其他</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.watchMirror.indexOf('1') >= 0}">蓝宝石</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchMirror.indexOf('2') >= 0}">玻璃</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchMirror.indexOf('3') >= 0}">亚克力</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchMirror.indexOf('4') >= 0}">磨损</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchMirror.indexOf('5') >= 0}">划痕</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchMirror.indexOf('6') >= 0}">磕边</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchMirror.indexOf('7') >= 0}">后换表镜</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchMirror.indexOf('8') >= 0}">变形</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchMirror.indexOf('9') >= 0}">完好</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchMirror.indexOf('10') >= 0}">其他</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>表把</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.watchCrown" :min="0">
                                            <el-checkbox :label="'1'">磨损严重</el-checkbox>
                                            <el-checkbox :label="'2'">印字不清</el-checkbox>
                                            <el-checkbox :label="'3'">脱落</el-checkbox>
                                            <el-checkbox :label="'4'">失灵</el-checkbox>
                                            <el-checkbox :label="'5'">转送松动</el-checkbox>
                                            <el-checkbox :label="'6'">转动过紧</el-checkbox>
                                            <el-checkbox :label="'7'">完好</el-checkbox>
                                            <el-checkbox :label="'8'">其他</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.watchCrown.indexOf('1') >= 0}">磨损严重</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchCrown.indexOf('2') >= 0}">印字不清</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchCrown.indexOf('3') >= 0}">脱落</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchCrown.indexOf('4') >= 0}">失灵</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchCrown.indexOf('5') >= 0}">转送松动</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchCrown.indexOf('6') >= 0}">转动过紧</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchCrown.indexOf('7') >= 0}">完好</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchCrown.indexOf('8') >= 0}">其他</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>钻刻</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.diamond" :min="0">
                                            <el-checkbox :label="'1'">原镶钻</el-checkbox>
                                            <el-checkbox :label="'2'">后镶钻</el-checkbox>
                                            <el-checkbox :label="'3'">无钻</el-checkbox>
                                            <el-checkbox :label="'4'">其他</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.diamond.indexOf('1') >= 0}">原镶钻</span>
                                        <span class="checkbox" :class="{ok:tableWatch.diamond.indexOf('2') >= 0}">后镶钻</span>
                                        <span class="checkbox" :class="{ok:tableWatch.diamond.indexOf('3') >= 0}">无钻</span>
                                        <span class="checkbox" :class="{ok:tableWatch.diamond.indexOf('4') >= 0}">其他</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>后盖</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.rearCover" :min="0">
                                            <el-checkbox :label="'1'">螺丝后盖</el-checkbox>
                                            <el-checkbox :label="'2'">旋转后盖</el-checkbox>
                                            <el-checkbox :label="'3'">撬盖</el-checkbox>
                                            <el-checkbox :label="'4'">背透</el-checkbox>
                                            <el-checkbox :label="'5'">划痕</el-checkbox>
                                            <el-checkbox :label="'6'">印记不清</el-checkbox>
                                            <el-checkbox :label="'7'">壳子毛糙</el-checkbox>
                                            <el-checkbox :label="'8'">完好</el-checkbox>
                                            <el-checkbox :label="'9'">其他</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.rearCover.indexOf('1') >= 0}">螺丝后盖</span>
                                        <span class="checkbox" :class="{ok:tableWatch.rearCover.indexOf('2') >= 0}">旋转后盖</span>
                                        <span class="checkbox" :class="{ok:tableWatch.rearCover.indexOf('3') >= 0}">撬盖</span>
                                        <span class="checkbox" :class="{ok:tableWatch.rearCover.indexOf('4') >= 0}">背透</span>
                                        <span class="checkbox" :class="{ok:tableWatch.rearCover.indexOf('5') >= 0}">划痕</span>
                                        <span class="checkbox" :class="{ok:tableWatch.rearCover.indexOf('6') >= 0}">印记不清</span>
                                        <span class="checkbox" :class="{ok:tableWatch.rearCover.indexOf('7') >= 0}">壳子毛糙</span>
                                        <span class="checkbox" :class="{ok:tableWatch.rearCover.indexOf('8') >= 0}">完好</span>
                                        <span class="checkbox" :class="{ok:tableWatch.rearCover.indexOf('9') >= 0}">其他</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>表耳</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.watchEar" :min="0">
                                            <el-checkbox :label="'1'">表耳刻字</el-checkbox>
                                            <el-checkbox :label="'2'">表耳印记</el-checkbox>
                                            <el-checkbox :label="'3'">磨损</el-checkbox>
                                            <el-checkbox :label="'4'">缺损</el-checkbox>
                                            <el-checkbox :label="'5'">完好</el-checkbox>
                                            <el-checkbox :label="'6'">其他</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.watchEar.indexOf('1') >= 0}">表耳刻字</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchEar.indexOf('2') >= 0}">表耳印记</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchEar.indexOf('3') >= 0}">磨损</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchEar.indexOf('4') >= 0}">缺损</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchEar.indexOf('5') >= 0}">完好</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchEar.indexOf('6') >= 0}">其他</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>表带材质</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.strapMaterial" :min="0">
                                            <el-checkbox :label="'1'">钢</el-checkbox>
                                            <el-checkbox :label="'2'">钢及金</el-checkbox>
                                            <el-checkbox :label="'3'">18K白金</el-checkbox>
                                            <el-checkbox :label="'4'">18K玫瑰金</el-checkbox>
                                            <el-checkbox :label="'5'">18K黄金</el-checkbox>
                                            <el-checkbox :label="'6'">铂金</el-checkbox>
                                            <el-checkbox :label="'7'">陶瓷</el-checkbox>
                                            <el-checkbox :label="'8'">其他材质</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.strapMaterial.indexOf('1') >= 0}">钢</span>
                                        <span class="checkbox" :class="{ok:tableWatch.strapMaterial.indexOf('2') >= 0}">钢及金</span>
                                        <span class="checkbox" :class="{ok:tableWatch.strapMaterial.indexOf('3') >= 0}">18K白金</span>
                                        <span class="checkbox" :class="{ok:tableWatch.strapMaterial.indexOf('4') >= 0}">18K玫瑰金</span>
                                        <span class="checkbox" :class="{ok:tableWatch.strapMaterial.indexOf('5') >= 0}">18K黄金</span>
                                        <span class="checkbox" :class="{ok:tableWatch.strapMaterial.indexOf('6') >= 0}">铂金</span>
                                        <span class="checkbox" :class="{ok:tableWatch.strapMaterial.indexOf('7') >= 0}">陶瓷</span>
                                        <span class="checkbox" :class="{ok:tableWatch.strapMaterial.indexOf('8') >= 0}">其他材质</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>金属表带</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.metalStrap" :min="0">
                                            <el-checkbox :label="'1'">松懈</el-checkbox>
                                            <el-checkbox :label="'2'">划痕</el-checkbox>
                                            <el-checkbox :label="'3'">磨损严重</el-checkbox>
                                            <el-checkbox :label="'4'">缺少螺丝</el-checkbox>
                                            <el-checkbox :label="'5'">脱扣</el-checkbox>
                                            <div style="display:inline-block;margin:0 16px;">表带节数<div style="display:inline-block;width:40px;border-bottom:1px solid #666;margin-left:10px;"><input type="text" name="" v-model="tableWatch.strapNumber"></div></div>
                                            <el-checkbox :label="'7'">完好</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.metalStrap.indexOf('1') >= 0}">松懈</span>
                                        <span class="checkbox" :class="{ok:tableWatch.metalStrap.indexOf('2') >= 0}">划痕</span>
                                        <span class="checkbox" :class="{ok:tableWatch.metalStrap.indexOf('3') >= 0}">磨损严重</span>
                                        <span class="checkbox" :class="{ok:tableWatch.metalStrap.indexOf('4') >= 0}">缺少螺丝</span>
                                        <span class="checkbox" :class="{ok:tableWatch.metalStrap.indexOf('5') >= 0}">脱扣</span>
                                        <div style="display:inline-block;margin-right:16px;">表带节数 {{tableWatch.strapNumber}}</div>
                                        <span class="checkbox" :class="{ok:tableWatch.metalStrap.indexOf('7') >= 0}">完好</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>皮质表带</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.cortexStrap" :min="0">
                                            <el-checkbox :label="'1'">旧</el-checkbox>
                                            <el-checkbox :label="'2'">有异味</el-checkbox>
                                            <el-checkbox :label="'3'">开线</el-checkbox>
                                            <el-checkbox :label="'4'">腐烂</el-checkbox>
                                            <el-checkbox :label="'5'">完好</el-checkbox>
                                            <el-checkbox :label="'6'">其他</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.cortexStrap.indexOf('1') >= 0}">旧</span>
                                        <span class="checkbox" :class="{ok:tableWatch.cortexStrap.indexOf('2') >= 0}">有异味</span>
                                        <span class="checkbox" :class="{ok:tableWatch.cortexStrap.indexOf('3') >= 0}">开线</span>
                                        <span class="checkbox" :class="{ok:tableWatch.cortexStrap.indexOf('4') >= 0}">腐烂</span>
                                        <span class="checkbox" :class="{ok:tableWatch.cortexStrap.indexOf('5') >= 0}">完好</span>
                                        <span class="checkbox" :class="{ok:tableWatch.cortexStrap.indexOf('6') >= 0}">其他</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>表扣</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.watchButton" :min="0">
                                            <el-checkbox :label="'1'">蝴蝶扣</el-checkbox>
                                            <el-checkbox :label="'2'">针扣</el-checkbox>
                                            <el-checkbox :label="'3'">折叠扣</el-checkbox>
                                            <el-checkbox :label="'4'">划痕</el-checkbox>
                                            <el-checkbox :label="'5'">磨损严重</el-checkbox>
                                            <el-checkbox :label="'6'">刻字不清</el-checkbox>
                                            <el-checkbox :label="'7'">印记模糊</el-checkbox>
                                            <el-checkbox :label="'8'">其他</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.watchButton.indexOf('1') >= 0}">蝴蝶扣</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchButton.indexOf('2') >= 0}">针扣</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchButton.indexOf('3') >= 0}">折叠扣</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchButton.indexOf('4') >= 0}">划痕</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchButton.indexOf('5') >= 0}">磨损严重</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchButton.indexOf('6') >= 0}">刻字不清</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchButton.indexOf('7') >= 0}">印记模糊</span>
                                        <span class="checkbox" :class="{ok:tableWatch.watchButton.indexOf('8') >= 0}">其他</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>螺丝</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.screw" :min="0">
                                            <el-checkbox :label="'1'">缺少螺丝</el-checkbox>
                                            <el-checkbox :label="'2'">有划痕</el-checkbox>
                                            <el-checkbox :label="'3'">断裂</el-checkbox>
                                            <el-checkbox :label="'4'">完好</el-checkbox>
                                            <el-checkbox :label="'5'">其他</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.screw.indexOf('1') >= 0}">缺少螺丝</span>
                                        <span class="checkbox" :class="{ok:tableWatch.screw.indexOf('2') >= 0}">有划痕</span>
                                        <span class="checkbox" :class="{ok:tableWatch.screw.indexOf('3') >= 0}">断裂</span>
                                        <span class="checkbox" :class="{ok:tableWatch.screw.indexOf('4') >= 0}">完好</span>
                                        <span class="checkbox" :class="{ok:tableWatch.screw.indexOf('5') >= 0}">其他</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="100" rowspan="5"><div>机芯</div></td>
                                <td width="80"><div>打磨</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.polish" :min="0">
                                            <el-checkbox :label="'1'">粗糙</el-checkbox>
                                            <el-checkbox :label="'2'">精细</el-checkbox>
                                            <el-checkbox :label="'3'">其他</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.polish.indexOf('1') >= 0}">粗糙</span>
                                        <span class="checkbox" :class="{ok:tableWatch.polish.indexOf('2') >= 0}">精细</span>
                                        <span class="checkbox" :class="{ok:tableWatch.polish.indexOf('3') >= 0}">其他</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>刻字</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.lettering" :min="0">
                                            <el-checkbox :label="'1'">粗糙</el-checkbox>
                                            <el-checkbox :label="'2'">精细</el-checkbox>
                                            <el-checkbox :label="'3'">其他</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.lettering.indexOf('1') >= 0}">粗糙</span>
                                        <span class="checkbox" :class="{ok:tableWatch.lettering.indexOf('2') >= 0}">精细</span>
                                        <span class="checkbox" :class="{ok:tableWatch.lettering.indexOf('3') >= 0}">其他</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>螺丝</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.movementScrew" :min="0">
                                            <el-checkbox :label="'1'">蓝钢螺丝</el-checkbox>
                                            <el-checkbox :label="'2'">普通螺丝</el-checkbox>
                                            <el-checkbox :label="'3'">缺少螺丝</el-checkbox>
                                            <el-checkbox :label="'4'">有划痕</el-checkbox>
                                            <el-checkbox :label="'5'">断裂</el-checkbox>
                                            <el-checkbox :label="'6'">其他</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.movementScrew.indexOf('1') >= 0}">蓝钢螺丝</span>
                                        <span class="checkbox" :class="{ok:tableWatch.movementScrew.indexOf('2') >= 0}">普通螺丝</span>
                                        <span class="checkbox" :class="{ok:tableWatch.movementScrew.indexOf('3') >= 0}">缺少螺丝</span>
                                        <span class="checkbox" :class="{ok:tableWatch.movementScrew.indexOf('4') >= 0}">有划痕</span>
                                        <span class="checkbox" :class="{ok:tableWatch.movementScrew.indexOf('5') >= 0}">断裂</span>
                                        <span class="checkbox" :class="{ok:tableWatch.movementScrew.indexOf('6') >= 0}">其他</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>自动陀</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.rotor" :min="0">
                                            <el-checkbox :label="'1'">中心陀</el-checkbox>
                                            <el-checkbox :label="'2'">偏心陀</el-checkbox>
                                            <el-checkbox :label="'3'">松动</el-checkbox>
                                            <el-checkbox :label="'4'">磨边</el-checkbox>
                                            <el-checkbox :label="'5'">卡死</el-checkbox>
                                            <el-checkbox :label="'6'">运转不畅</el-checkbox>
                                            <el-checkbox :label="'7'">其他</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.rotor.indexOf('1') >= 0}">中心陀</span>
                                        <span class="checkbox" :class="{ok:tableWatch.rotor.indexOf('2') >= 0}">偏心陀</span>
                                        <span class="checkbox" :class="{ok:tableWatch.rotor.indexOf('3') >= 0}">松动</span>
                                        <span class="checkbox" :class="{ok:tableWatch.rotor.indexOf('4') >= 0}">磨边</span>
                                        <span class="checkbox" :class="{ok:tableWatch.rotor.indexOf('5') >= 0}">卡死</span>
                                        <span class="checkbox" :class="{ok:tableWatch.rotor.indexOf('6') >= 0}">运转不畅</span>
                                        <span class="checkbox" :class="{ok:tableWatch.rotor.indexOf('7') >= 0}">其他</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>固定圈</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.retainerRing" :min="0">
                                            <el-checkbox :label="'1'">钢圈</el-checkbox>
                                            <el-checkbox :label="'2'">塑料圈</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.retainerRing.indexOf('1') >= 0}">钢圈</span>
                                        <span class="checkbox" :class="{ok:tableWatch.retainerRing.indexOf('2') >= 0}">塑料圈</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="100"><div>功能</div></td>
                                <td colspan="5">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableWatch.func" :min="0">
                                            <el-checkbox :label="'1'">大三针</el-checkbox>
                                            <el-checkbox :label="'2'">日历</el-checkbox>
                                            <el-checkbox :label="'3'">小三针</el-checkbox>
                                            <el-checkbox :label="'4'">双历</el-checkbox>
                                            <el-checkbox :label="'5'">计时</el-checkbox>
                                            <el-checkbox :label="'6'">动储</el-checkbox>
                                            <el-checkbox :label="'7'">飞返</el-checkbox>
                                            <el-checkbox :label="'8'">月相</el-checkbox>
                                            <el-checkbox :label="'9'">年历</el-checkbox>
                                            <el-checkbox :label="'10'">万年历</el-checkbox>
                                            <el-checkbox :label="'11'">两地时</el-checkbox>
                                            <el-checkbox :label="'12'">潜水</el-checkbox>
                                            <el-checkbox :label="'13'">追针</el-checkbox>
                                            <el-checkbox :label="'14'">陀飞轮</el-checkbox>
                                            <el-checkbox :label="'15'">其他</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableWatch.func.indexOf('1') >= 0}">大三针</span>
                                        <span class="checkbox" :class="{ok:tableWatch.func.indexOf('2') >= 0}">日历</span>
                                        <span class="checkbox" :class="{ok:tableWatch.func.indexOf('3') >= 0}">小三针</span>
                                        <span class="checkbox" :class="{ok:tableWatch.func.indexOf('4') >= 0}">双历</span>
                                        <span class="checkbox" :class="{ok:tableWatch.func.indexOf('5') >= 0}">计时</span>
                                        <span class="checkbox" :class="{ok:tableWatch.func.indexOf('6') >= 0}">动储</span>
                                        <span class="checkbox" :class="{ok:tableWatch.func.indexOf('7') >= 0}">飞返</span>
                                        <span class="checkbox" :class="{ok:tableWatch.func.indexOf('8') >= 0}">月相</span>
                                        <span class="checkbox" :class="{ok:tableWatch.func.indexOf('9') >= 0}">年历</span>
                                        <span class="checkbox" :class="{ok:tableWatch.func.indexOf('10') >= 0}">万年历</span>
                                        <span class="checkbox" :class="{ok:tableWatch.func.indexOf('11') >= 0}">两地时</span>
                                        <span class="checkbox" :class="{ok:tableWatch.func.indexOf('12') >= 0}">潜水</span>
                                        <span class="checkbox" :class="{ok:tableWatch.func.indexOf('13') >= 0}">追针</span>
                                        <span class="checkbox" :class="{ok:tableWatch.func.indexOf('14') >= 0}">陀飞轮</span>
                                        <span class="checkbox" :class="{ok:tableWatch.func.indexOf('15') >= 0}">其他</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="100"><div>校表仪</div></td>
                                <td colspan="5">
                                    <div v-if="isPrint">
                                        <div style="display:inline-block;margin:0 16px;">日差<div style="display:inline-block;width:60px;border-bottom:1px solid #666;margin-left:10px;"><input type="text" name="" v-model="tableWatch.dailyDifference"></div></div>
                                        <div style="display:inline-block;margin:0 16px;">摆幅<div style="display:inline-block;width:60px;border-bottom:1px solid #666;margin-left:10px;"><input type="text" name="" v-model="tableWatch.swing"></div></div>
                                        <div style="display:inline-block;margin:0 16px;">偏振<div style="display:inline-block;width:60px;border-bottom:1px solid #666;margin-left:10px;"><input type="text" name="" v-model="tableWatch.polarization"></div></div>
                                        <div style="display:inline-block;margin:0 16px;">参数<div style="display:inline-block;width:60px;border-bottom:1px solid #666;margin-left:10px;"><input type="text" name="" v-model="tableWatch.parameter"></div></div>
                                    </div>
                                    <div v-else>
                                        日差 {{tableWatch.dailyDifference}} &nbsp; 摆幅 {{tableWatch.swing}} &nbsp; 偏振 {{tableWatch.polarization}} &nbsp; 参数 {{tableWatch.parameter}}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="50">
                                    <div>鉴定结论</div>
                                </td>
                                <td colspan="6"><div v-if="isPrint"><input type="text" v-model="tableWatch.conclusion"></div><div v-else>{{tableWatch.conclusion}}&nbsp;</div></td>
                            </tr>
                        </table>
                        <div style="text-align:right;padding:30px 0 0 0;">鉴定师签名：____________</div>
                    </div>
                    <!-- 包的打印表格 -->
                    <div id="print" v-if="detail.categoryId=='2'">
                        <h4 style="text-align:center;font-size:28px;padding:16px;">名品检验单</h4>
                        <table class="gridtable">
                            <tr>
                                <td rowspan="4" width="50">
                                    <div>基本信息</div>
                                </td>
                                <td width="100"><div>客户姓名</div></td>
                                <td width="130"><div v-if="isPrint"><input type="text" v-model="tableBag.customerName"></div><div v-else>{{tableBag.customerName}}&nbsp;</div></td>
                                <td width="100"><div>鉴定人</div></td>
                                <td width="100"><div v-if="isPrint"><input type="text" v-model="tableBag.appraiser"></div><div v-else>{{tableBag.appraiser}}&nbsp;</div></td>
                                <td width="100"><div>日期</div></td>
                                <td><div v-if="isPrint"><input type="text" v-model="tableBag.identifyDate"></div><div v-else>{{tableBag.identifyDate}}&nbsp;</div></td>
                            </tr>
                            <tr>
                                <td width="100"><div>品牌</div></td>
                                <td><div v-if="isPrint"><input type="text" v-model="tableBag.brandName"></div><div v-else>{{tableBag.brandName}}&nbsp;</div></td>
                                <td width="80"><div>系列</div></td>
                                <td><div v-if="isPrint"><input type="text" v-model="tableBag.serialName"></div><div v-else>{{tableBag.serialName}}&nbsp;</div></td>
                                <td width="80"><div>公价</div></td>
                                <td><div v-if="isPrint"><input type="text" v-model="tableBag.publicPrice"></div><div v-else>{{tableBag.publicPrice}}&nbsp;</div></td>
                            </tr>
                            <tr>
                                <td width="100"><div>款型</div></td>
                                <td colspan="2">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableBag.style" :min="0" :max="3">
                                            <el-checkbox :label="'1'">男</el-checkbox>
                                            <el-checkbox :label="'2'">女</el-checkbox>
                                            <el-checkbox :label="'3'">中性</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableBag.style.indexOf('1') >= 0}">男</span>
                                        <span class="checkbox" :class="{ok:tableBag.style.indexOf('2') >= 0}">女</span>
                                        <span class="checkbox" :class="{ok:tableBag.style.indexOf('3') >= 0}">中性</span>
                                    </div>
                                </td>
                                <td width="80"><div>包装</div></td>
                                <td colspan="2">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableBag.packaging" :min="0">
                                            <el-checkbox :label="'1'">盒子</el-checkbox>
                                            <el-checkbox :label="'2'">发票</el-checkbox>
                                            <el-checkbox :label="'3'">防尘袋</el-checkbox>
                                            <el-checkbox :label="'4'">保修卡</el-checkbox>
                                            <el-checkbox :label="'5'">说明书</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableBag.packaging.indexOf('1') >= 0}">盒子</span>
                                        <span class="checkbox" :class="{ok:tableBag.packaging.indexOf('2') >= 0}">发票</span>
                                        <span class="checkbox" :class="{ok:tableBag.packaging.indexOf('3') >= 0}">防尘袋</span>
                                        <span class="checkbox" :class="{ok:tableBag.packaging.indexOf('4') >= 0}">保修卡</span>
                                        <span class="checkbox" :class="{ok:tableBag.packaging.indexOf('5') >= 0}">说明书</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="100"><div>型号</div></td>
                                <td><div v-if="isPrint"><input type="text" v-model="tableBag.typeName"></div><div v-else>{{tableBag.typeName}}&nbsp;</div></td>
                                <td width="80"><div>编码</div></td>
                                <td><div v-if="isPrint"><input type="text" v-model="tableBag.code"></div><div v-else>{{tableBag.code}}&nbsp;</div></td>
                                <td width="80"><div>来源</div></td>
                                <td>
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableBag.source" :min="0">
                                            <el-checkbox :label="'1'">专柜</el-checkbox>
                                            <el-checkbox :label="'2'">其他</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableBag.source.indexOf('1') >= 0}">专柜</span>
                                        <span class="checkbox" :class="{ok:tableBag.source.indexOf('2') >= 0}">其他</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td rowspan="21">
                                    <div>检测流程</div>
                                </td>
                                <td width="100" rowspan="5"><div>皮质</div></td>
                                <td width="80"><div>logo</div></td>
                                <td colspan="4"  align="right">
                                    <div v-if="isPrint">
                                        <input type="text" v-model="tableBag.cortexLogoT">
                                        <el-checkbox-group v-model="tableBag.cortexLogo" :min="0">
                                            <el-checkbox :label="'1'">符合正品</el-checkbox>
                                            <el-checkbox :label="'2'">不符合正品</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span>{{tableBag.cortexLogoT}}</span>
                                        <span class="checkbox" :class="{ok:tableBag.cortexLogo.indexOf('1') >= 0}">符合正品</span>
                                        <span class="checkbox" :class="{ok:tableBag.cortexLogo.indexOf('2') >= 0}">不符合正品</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>印花</div></td>
                                <td colspan="4"  align="right">
                                    <div v-if="isPrint">
                                        <input type="text" v-model="tableBag.cortexPrintT">
                                        <el-checkbox-group v-model="tableBag.cortexPrint" :min="0">
                                            <el-checkbox :label="'1'">符合正品</el-checkbox>
                                            <el-checkbox :label="'2'">不符合正品</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span>{{tableBag.cortexPrintT}}</span>
                                        <span class="checkbox" :class="{ok:tableBag.cortexPrint.indexOf('1') >= 0}">符合正品</span>
                                        <span class="checkbox" :class="{ok:tableBag.cortexPrint.indexOf('2') >= 0}">不符合正品</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>油边</div></td>
                                <td colspan="4"  align="right">
                                    <div v-if="isPrint">
                                        <input type="text" v-model="tableBag.cortexPaintT">
                                        <el-checkbox-group v-model="tableBag.cortexPaint" :min="0">
                                            <el-checkbox :label="'1'">符合正品</el-checkbox>
                                            <el-checkbox :label="'2'">不符合正品</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span>{{tableBag.cortexPaintT}}</span>
                                        <span class="checkbox" :class="{ok:tableBag.cortexPaint.indexOf('1') >= 0}">符合正品</span>
                                        <span class="checkbox" :class="{ok:tableBag.cortexPaint.indexOf('2') >= 0}">不符合正品</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>材质</div></td>
                                <td colspan="4"  align="right">
                                    <div v-if="isPrint">
                                        <input type="text" v-model="tableBag.cortexMaterialT">
                                        <el-checkbox-group v-model="tableBag.cortexMaterial" :min="0">
                                            <el-checkbox :label="'1'">符合正品</el-checkbox>
                                            <el-checkbox :label="'2'">不符合正品</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span>{{tableBag.cortexMaterialT}}</span>
                                        <span class="checkbox" :class="{ok:tableBag.cortexMaterial.indexOf('1') >= 0}">符合正品</span>
                                        <span class="checkbox" :class="{ok:tableBag.cortexMaterial.indexOf('2') >= 0}">不符合正品</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>气味</div></td>
                                <td colspan="4"  align="right">
                                    <div v-if="isPrint">
                                        <input type="text" v-model="tableBag.cortexSmellT">
                                        <el-checkbox-group v-model="tableBag.cortexSmell" :min="0">
                                            <el-checkbox :label="'1'">符合正品</el-checkbox>
                                            <el-checkbox :label="'2'">不符合正品</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span>{{tableBag.cortexSmellT}}</span>
                                        <span class="checkbox" :class="{ok:tableBag.cortexSmell.indexOf('1') >= 0}">符合正品</span>
                                        <span class="checkbox" :class="{ok:tableBag.cortexSmell.indexOf('2') >= 0}">不符合正品</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="100" rowspan="4"><div>内衬</div></td>
                                <td width="80"><div>年份标</div></td>
                                <td colspan="4"  align="right">
                                    <div v-if="isPrint">
                                        <input type="text" v-model="tableBag.liningYearT">
                                        <el-checkbox-group v-model="tableBag.liningYear" :min="0">
                                            <el-checkbox :label="'1'">符合正品</el-checkbox>
                                            <el-checkbox :label="'2'">不符合正品</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span>{{tableBag.liningYearT}}</span>
                                        <span class="checkbox" :class="{ok:tableBag.liningYear.indexOf('1') >= 0}">符合正品</span>
                                        <span class="checkbox" :class="{ok:tableBag.liningYear.indexOf('2') >= 0}">不符合正品</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>洗水标</div></td>
                                <td colspan="4"  align="right">
                                    <div v-if="isPrint">
                                        <input type="text" v-model="tableBag.liningWashWaterT">
                                        <el-checkbox-group v-model="tableBag.liningWashWater" :min="0">
                                            <el-checkbox :label="'1'">符合正品</el-checkbox>
                                            <el-checkbox :label="'2'">不符合正品</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span>{{tableBag.liningWashWaterT}}</span>
                                        <span class="checkbox" :class="{ok:tableBag.liningWashWater.indexOf('1') >= 0}">符合正品</span>
                                        <span class="checkbox" :class="{ok:tableBag.liningWashWater.indexOf('2') >= 0}">不符合正品</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>编码</div></td>
                                <td colspan="4"  align="right">
                                    <div v-if="isPrint">
                                        <input type="text" v-model="tableBag.liningCodeT">
                                        <el-checkbox-group v-model="tableBag.liningCode" :min="0">
                                            <el-checkbox :label="'1'">符合正品</el-checkbox>
                                            <el-checkbox :label="'2'">不符合正品</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span>{{tableBag.liningCodeT}}</span>
                                        <span class="checkbox" :class="{ok:tableBag.liningCode.indexOf('1') >= 0}">符合正品</span>
                                        <span class="checkbox" :class="{ok:tableBag.liningCode.indexOf('2') >= 0}">不符合正品</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>内里</div></td>
                                <td colspan="4"  align="right">
                                    <div v-if="isPrint">
                                        <input type="text" v-model="tableBag.liningInsideT">
                                        <el-checkbox-group v-model="tableBag.liningInside" :min="0">
                                            <el-checkbox :label="'1'">符合正品</el-checkbox>
                                            <el-checkbox :label="'2'">不符合正品</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span>{{tableBag.liningInsideT}}</span>
                                        <span class="checkbox" :class="{ok:tableBag.liningInside.indexOf('1') >= 0}">符合正品</span>
                                        <span class="checkbox" :class="{ok:tableBag.liningInside.indexOf('2') >= 0}">不符合正品</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="100" rowspan="6"><div>五金</div></td>
                                <td width="80"><div>拉头</div></td>
                                <td colspan="4"  align="right">
                                    <div v-if="isPrint">
                                        <input type="text" v-model="tableBag.hardwareSliderT">
                                        <el-checkbox-group v-model="tableBag.hardwareSlider" :min="0">
                                            <el-checkbox :label="'1'">符合正品</el-checkbox>
                                            <el-checkbox :label="'2'">不符合正品</el-checkbox>
                                            <el-checkbox :label="'3'">未做鉴定</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span>{{tableBag.hardwareSliderT}}</span>
                                        <span class="checkbox" :class="{ok:tableBag.hardwareSlider.indexOf('1') >= 0}">符合正品</span>
                                        <span class="checkbox" :class="{ok:tableBag.hardwareSlider.indexOf('2') >= 0}">不符合正品</span>
                                        <span class="checkbox" :class="{ok:tableBag.hardwareSlider.indexOf('3') >= 0}">未做鉴定</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>拉芽</div></td>
                                <td colspan="4"  align="right">
                                    <div v-if="isPrint">
                                        <input type="text" v-model="tableBag.hardwareBudT">
                                        <el-checkbox-group v-model="tableBag.hardwareBud" :min="0">
                                            <el-checkbox :label="'1'">符合正品</el-checkbox>
                                            <el-checkbox :label="'2'">不符合正品</el-checkbox>
                                            <el-checkbox :label="'3'">未做鉴定</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span>{{tableBag.hardwareBudT}}</span>
                                        <span class="checkbox" :class="{ok:tableBag.hardwareBud.indexOf('1') >= 0}">符合正品</span>
                                        <span class="checkbox" :class="{ok:tableBag.hardwareBud.indexOf('2') >= 0}">不符合正品</span>
                                        <span class="checkbox" :class="{ok:tableBag.hardwareBud.indexOf('3') >= 0}">未做鉴定</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>铆钉</div></td>
                                <td colspan="4"  align="right">
                                    <div v-if="isPrint">
                                        <input type="text" v-model="tableBag.hardwareRivetT">
                                        <el-checkbox-group v-model="tableBag.hardwareRivet" :min="0">
                                            <el-checkbox :label="'1'">符合正品</el-checkbox>
                                            <el-checkbox :label="'2'">不符合正品</el-checkbox>
                                            <el-checkbox :label="'3'">未做鉴定</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span>{{tableBag.hardwareRivetT}}</span>
                                        <span class="checkbox" :class="{ok:tableBag.hardwareRivet.indexOf('1') >= 0}">符合正品</span>
                                        <span class="checkbox" :class="{ok:tableBag.hardwareRivet.indexOf('2') >= 0}">不符合正品</span>
                                        <span class="checkbox" :class="{ok:tableBag.hardwareRivet.indexOf('3') >= 0}">未做鉴定</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>扣头</div></td>
                                <td colspan="4"  align="right">
                                    <div v-if="isPrint">
                                        <input type="text" v-model="tableBag.hardwareClaspT">
                                        <el-checkbox-group v-model="tableBag.hardwareClasp" :min="0">
                                            <el-checkbox :label="'1'">符合正品</el-checkbox>
                                            <el-checkbox :label="'2'">不符合正品</el-checkbox>
                                            <el-checkbox :label="'3'">未做鉴定</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span>{{tableBag.hardwareClaspT}}</span>
                                        <span class="checkbox" :class="{ok:tableBag.hardwareClasp.indexOf('1') >= 0}">符合正品</span>
                                        <span class="checkbox" :class="{ok:tableBag.hardwareClasp.indexOf('2') >= 0}">不符合正品</span>
                                        <span class="checkbox" :class="{ok:tableBag.hardwareClasp.indexOf('3') >= 0}">未做鉴定</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>链条</div></td>
                                <td colspan="4"  align="right">
                                    <div v-if="isPrint">
                                        <input type="text" v-model="tableBag.hardwareChainT">
                                        <el-checkbox-group v-model="tableBag.hardwareChain" :min="0">
                                            <el-checkbox :label="'1'">符合正品</el-checkbox>
                                            <el-checkbox :label="'2'">不符合正品</el-checkbox>
                                            <el-checkbox :label="'3'">未做鉴定</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span>{{tableBag.hardwareChainT}}</span>
                                        <span class="checkbox" :class="{ok:tableBag.hardwareChain.indexOf('1') >= 0}">符合正品</span>
                                        <span class="checkbox" :class="{ok:tableBag.hardwareChain.indexOf('2') >= 0}">不符合正品</span>
                                        <span class="checkbox" :class="{ok:tableBag.hardwareChain.indexOf('3') >= 0}">未做鉴定</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>扣子</div></td>
                                <td colspan="4"  align="right">
                                    <div v-if="isPrint">
                                        <input type="text" v-model="tableBag.hardwareButtonT">
                                        <el-checkbox-group v-model="tableBag.hardwareButton" :min="0">
                                            <el-checkbox :label="'1'">符合正品</el-checkbox>
                                            <el-checkbox :label="'2'">不符合正品</el-checkbox>
                                            <el-checkbox :label="'3'">未做鉴定</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span>{{tableBag.hardwareButtonT}}</span>
                                        <span class="checkbox" :class="{ok:tableBag.hardwareButton.indexOf('1') >= 0}">符合正品</span>
                                        <span class="checkbox" :class="{ok:tableBag.hardwareButton.indexOf('2') >= 0}">不符合正品</span>
                                        <span class="checkbox" :class="{ok:tableBag.hardwareButton.indexOf('3') >= 0}">未做鉴定</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="100" rowspan="5"><div>成色</div></td>
                                <td width="80"><div>磨损</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableBag.qualityAbrasion" :min="0">
                                            <el-checkbox :label="'1'">正面</el-checkbox>
                                            <el-checkbox :label="'2'">左侧</el-checkbox>
                                            <el-checkbox :label="'3'">右侧</el-checkbox>
                                            <el-checkbox :label="'4'">后面</el-checkbox>
                                            <el-checkbox :label="'5'">上边角</el-checkbox>
                                            <el-checkbox :label="'6'">下边角</el-checkbox>
                                            <el-checkbox :label="'7'">手把</el-checkbox>
                                            <el-checkbox :label="'8'">长肩带</el-checkbox>
                                            <el-checkbox :label="'9'">配皮</el-checkbox>
                                            <el-checkbox :label="'10'">五金</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableBag.qualityAbrasion.indexOf('1') >= 0}">正面</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityAbrasion.indexOf('2') >= 0}">左侧</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityAbrasion.indexOf('3') >= 0}">右侧</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityAbrasion.indexOf('4') >= 0}">后面</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityAbrasion.indexOf('5') >= 0}">上边角</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityAbrasion.indexOf('6') >= 0}">下边角</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityAbrasion.indexOf('7') >= 0}">手把</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityAbrasion.indexOf('8') >= 0}">长肩带</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityAbrasion.indexOf('9') >= 0}">配皮</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityAbrasion.indexOf('10') >= 0}">五金</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>吸色</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableBag.qualityAbsorption" :min="0">
                                            <el-checkbox :label="'1'">表皮</el-checkbox>
                                            <el-checkbox :label="'2'">手把</el-checkbox>
                                            <el-checkbox :label="'3'">长肩带</el-checkbox>
                                            <el-checkbox :label="'4'">配皮</el-checkbox>
                                            <el-checkbox :label="'5'">正面</el-checkbox>
                                            <el-checkbox :label="'6'">左侧</el-checkbox>
                                            <el-checkbox :label="'7'">右侧</el-checkbox>
                                            <el-checkbox :label="'8'">后面</el-checkbox>
                                            <el-checkbox :label="'9'">上边角</el-checkbox>
                                            <el-checkbox :label="'10'">下边角</el-checkbox>
                                            <el-checkbox :label="'11'">底部</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableBag.qualityAbsorption.indexOf('1') >= 0}">表皮</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityAbsorption.indexOf('2') >= 0}">手把</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityAbsorption.indexOf('3') >= 0}">长肩带</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityAbsorption.indexOf('4') >= 0}">配皮</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityAbsorption.indexOf('5') >= 0}">正面</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityAbsorption.indexOf('6') >= 0}">左侧</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityAbsorption.indexOf('7') >= 0}">右侧</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityAbsorption.indexOf('8') >= 0}">后面</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityAbsorption.indexOf('9') >= 0}">上边角</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityAbsorption.indexOf('10') >= 0}">下边角</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityAbsorption.indexOf('11') >= 0}">底部</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>氧化</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableBag.qualityOxygenation" :min="0">
                                            <el-checkbox :label="'1'">手把</el-checkbox>
                                            <el-checkbox :label="'2'">长肩带</el-checkbox>
                                            <el-checkbox :label="'3'">配皮</el-checkbox>
                                            <el-checkbox :label="'4'">拉头</el-checkbox>
                                            <el-checkbox :label="'5'">拉芽</el-checkbox>
                                            <el-checkbox :label="'6'">铆钉</el-checkbox>
                                            <el-checkbox :label="'7'">扣头</el-checkbox>
                                            <el-checkbox :label="'8'">链条</el-checkbox>
                                            <el-checkbox :label="'9'">扣子</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableBag.qualityOxygenation.indexOf('1') >= 0}">手把</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityOxygenation.indexOf('2') >= 0}">长肩带</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityOxygenation.indexOf('3') >= 0}">配皮</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityOxygenation.indexOf('4') >= 0}">拉头</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityOxygenation.indexOf('5') >= 0}">拉芽</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityOxygenation.indexOf('6') >= 0}">铆钉</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityOxygenation.indexOf('7') >= 0}">扣头</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityOxygenation.indexOf('8') >= 0}">链条</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityOxygenation.indexOf('9') >= 0}">扣子</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>变色</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableBag.qualityDiscoloration" :min="0">
                                            <el-checkbox :label="'1'">手把</el-checkbox>
                                            <el-checkbox :label="'2'">长肩带</el-checkbox>
                                            <el-checkbox :label="'3'">配皮</el-checkbox>
                                            <el-checkbox :label="'4'">正面</el-checkbox>
                                            <el-checkbox :label="'5'">左侧</el-checkbox>
                                            <el-checkbox :label="'6'">右侧</el-checkbox>
                                            <el-checkbox :label="'7'">后面</el-checkbox>
                                            <el-checkbox :label="'8'">底部</el-checkbox>
                                            <el-checkbox :label="'9'">翻盖</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableBag.qualityDiscoloration.indexOf('1') >= 0}">手把</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityDiscoloration.indexOf('2') >= 0}">长肩带</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityDiscoloration.indexOf('3') >= 0}">配皮</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityDiscoloration.indexOf('4') >= 0}">正面</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityDiscoloration.indexOf('5') >= 0}">左侧</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityDiscoloration.indexOf('6') >= 0}">右侧</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityDiscoloration.indexOf('7') >= 0}">后面</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityDiscoloration.indexOf('8') >= 0}">底部</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityDiscoloration.indexOf('9') >= 0}">翻盖</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="80"><div>划痕</div></td>
                                <td colspan="4">
                                    <div v-if="isPrint">
                                        <el-checkbox-group v-model="tableBag.qualityScratch" :min="0">
                                            <el-checkbox :label="'1'">正面</el-checkbox>
                                            <el-checkbox :label="'2'">左侧</el-checkbox>
                                            <el-checkbox :label="'3'">右侧</el-checkbox>
                                            <el-checkbox :label="'4'">后面</el-checkbox>
                                            <el-checkbox :label="'5'">手把</el-checkbox>
                                            <el-checkbox :label="'6'">长肩带</el-checkbox>
                                            <el-checkbox :label="'7'">配皮</el-checkbox>
                                            <el-checkbox :label="'8'">铆钉</el-checkbox>
                                            <el-checkbox :label="'9'">扣头</el-checkbox>
                                            <el-checkbox :label="'10'">链条</el-checkbox>
                                            <el-checkbox :label="'11'">扣子</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-else>
                                        <span class="checkbox" :class="{ok:tableBag.qualityScratch.indexOf('1') >= 0}">正面</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityScratch.indexOf('2') >= 0}">左侧</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityScratch.indexOf('3') >= 0}">右侧</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityScratch.indexOf('4') >= 0}">后面</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityScratch.indexOf('5') >= 0}">手把</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityScratch.indexOf('6') >= 0}">长肩带</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityScratch.indexOf('7') >= 0}">配皮</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityScratch.indexOf('8') >= 0}">铆钉</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityScratch.indexOf('9') >= 0}">扣头</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityScratch.indexOf('10') >= 0}">链条</span>
                                        <span class="checkbox" :class="{ok:tableBag.qualityScratch.indexOf('11') >= 0}">扣子</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td width="100"><div>其他</div></td>
                                <td colspan="5"><div v-if="isPrint"><input type="text" v-model="tableBag.other"></div><div v-else>{{tableBag.other}}&nbsp;</div></td>
                            </tr>
                            <tr>
                                <td width="50">
                                    <div>鉴定结论</div>
                                </td>
                                <td colspan="6"><div v-if="isPrint"><input type="text" v-model="tableBag.conclusion"></div><div v-else>{{tableBag.conclusion}}&nbsp;</div></td>
                            </tr>
                        </table>
                        <div style="text-align:right;padding:30px 0 0 0;">鉴定师签名：____________</div>
                    </div>

                    <div>
                        鉴定结果
                        <el-select v-model="jdStatus" placeholder="请选择">
                            <el-option :label="'通过'" :value="0"></el-option>
                            <el-option :label="'不通过'" :value="1"></el-option>
                            <el-option :label="'不确定'" :value="-1"></el-option>
                        </el-select>
                        <el-button type="primary" @click="save">保存</el-button>
                        <el-button @click="printme">打印</el-button>
                    </div>

                    <div>
                        <div>注释</div>
                        <div>
                            <p>1、如多件物品，每件使用一份检验单；</p>
                            <p>2、“ <el-checkbox></el-checkbox> ” 打勾选择，“ ____________ ” 填写数字或有效描述；</p>
                            <p>3、检验单填写完毕后需上传照片至附加；</p>
                        </div>
                    </div>

                </el-tab-pane>
                <!-- the third tab -->
                <el-tab-pane label="操作记录" name="third">

                    <el-table :data="orderLog" border style="width: 100%">
                        <el-table-column type="index" label="编号" width="70"></el-table-column>
                        <el-table-column prop="orderId" label="订单号" width="300"></el-table-column>
                        <el-table-column prop="content" label="内容" min-width="200"></el-table-column>
                        <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
                    </el-table>

                </el-tab-pane>
                
            </el-tabs>

        </el-dialog>
    </div>
</template>

<script>
import api from '../../../util/api'
import ajax from '../../../util/ajax'
export default {
    name: 'identifyList',
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
                    nickName: '',
                },
                address: {
                    detailAddr: '',
                }
            },
            subDetail: {
                isAgree: '',
                sendNumber1: '',
                sendNumber2: '',
                memo: '',
                pkGlobalId: '',
            },

            modifyState: false,
            activeName: 'first',

            //后加的鬼
            isPrint: true,
            tableBag: {
                customerName: '',
                appraiser: '',
                identifyDate: '',
                code: '',
                brandName: '',
                serialName: '',
                typeName: '',
                publicPrice: '',
                style: [],
                packaging: [],
                source: [],
                cortexLogo: [],
                cortexLogoT: '',
                cortexPrint: [],
                cortexPrintT: '',
                cortexPaint: [],
                cortexPaintT: '',
                cortexMaterial: [],
                cortexMaterialT: '',
                cortexSmell: [],
                cortexSmellT: '',
                liningYear: [],
                liningYearT: '',
                liningWashWater: [],
                liningWashWaterT: '',
                liningCode: [],
                liningCodeT: '',
                liningInside: [],
                liningInsideT: '',
                hardwareSlider: [],
                hardwareSliderT: '',
                hardwareBud: [],
                hardwareBudT: '',
                hardwareRivet: [],
                hardwareRivetT: '',
                hardwareClasp: [],
                hardwareClaspT: '',
                hardwareChain: [],
                hardwareChainT: '',
                hardwareButton: [],
                hardwareButtonT: '',
                qualityAbrasion: [],
                qualityAbsorption: [],
                qualityOxygenation: [],
                qualityDiscoloration: [],
                qualityScratch: [],
                other: '',
                conclusion: '',
            },
            tableWatch: {
                customerName: '',
                appraiser: '',
                identifyDate: '',
                brandName: '',
                serialName: '',
                typeName: '',
                publicPrice: '',
                style: [],
                packaging: [],
                source: [],
                watchcaseTraces: [],
                watchcaseShape: [],
                material: [],
                watchDiameter: [],
                watchDial: [],
                scale: [],
                watchNeedle: [],
                calendar: [],
                watchSmallDial: [],
                watchMirror: [],
                watchCrown: [],
                diamond: [],
                rearCover: [],
                watchEar: [],
                strapMaterial: [],
                metalStrap: [],
                cortexStrap: [],
                watchButton: [],
                screw: [],
                polish: [],
                lettering: [],
                movementScrew: [],
                rotor: [],
                retainerRing: [],
                func: [],
                conclusion: '',

                strapNumber: '',
                dailyDifference: '',
                swing: '',
                polarization: '',
                parameter: '',
            },
            jdStatus: 0,

            fileList: [],
            orderLog: [],

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
                _searchData+='&user.phone='+this.sellUserPhoneSearch
            }
            if(this.buyUserPhoneSearch){
                _searchData+='&user.nickName='+this.buyUserPhoneSearch
            }
            if(this.statusSearch){
                _searchData+='&method='+this.statusSearch
            }
            if(this.orderTypeSearch){
                _searchData+='&orderType='+this.orderTypeSearch
            }
            this.fetchData(api.identifyList+'?identifyStatus=0&type=0&sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
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
                _searchData+='&user.phone='+this.sellUserPhoneSearch
            }
            if(this.buyUserPhoneSearch){
                _searchData+='&user.nickName='+this.buyUserPhoneSearch
            }
            if(this.statusSearch){
                _searchData+='&method='+this.statusSearch
            }
            if(this.orderTypeSearch){
                _searchData+='&orderType='+this.orderTypeSearch
            }
            this.fetchData(api.identifyList+'?identifyStatus=0&type=0&sort=createTime,desc&page='+(this.currentPage-1)+'&size='+this.pageSize+_searchData,'',(data) => {
                this.dataList=data
                this.loading=false
            })
        },
        showModify(index , data) {

            this.fetchData(api.identifyImg+'?identifyId='+data[index].pkGlobalId,'',(data) => {
                this.fileList = data.content
            })

            this.detail=data[index]

            this.subDetail.isAgree=data[index].isAgree
            this.subDetail.pkGlobalId=data[index].pkGlobalId
            this.subDetail.sendNumber1=data[index].sendNumber1
            this.subDetail.sendNumber2=data[index].sendNumber2
            this.subDetail.memo=data[index].memo

            this.activeName = 'first'
            this.modifyState=true

        },
        changeTabs(targetName) {
            if(targetName.name=='second'){
                
            }else if(targetName.name=='third'){
                this.fetchData(api.indentifyLog+'?orderId='+this.detail.pkGlobalId,'',(data) => {
                    this.orderLog = data
                })
            }
        },
        modifyStatus(){
            this.patchData(api.identifyList+'/'+this.detail.pkGlobalId,this.subDetail,(data) => {
                this.$message({showClose: true,message: '提交成功',type: 'success'})
                this.reData()
            })
        },
        save(){
            let _bagData = JSON.parse(JSON.stringify(this.tableBag))
            let _watchData = JSON.parse(JSON.stringify(this.tableWatch))
            if(this.detail.categoryId == '1'){
                for(let i in _watchData){
                    if(_watchData[i].constructor==Array){
                        _watchData[i] = _watchData[i].join()
                    }
                }
                _watchData.identifyId = this.detail.pkGlobalId
                _watchData.isTrue = this.jdStatus
                this.$confirm('确定保存吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
                    this.subForm(api.identifyReport,_watchData,(data) => {
                        this.reData()
                        this.modifyState=false
                        this.$message({ type: 'success', message: '保存成功!' })
                    })
                }).catch(() => { })
            }
            if(this.detail.categoryId == '2'){
                for(let i in _bagData){
                    if(_bagData[i].constructor==Array){
                        _bagData[i] = _bagData[i].join()
                    }
                }
                _bagData.identifyId = this.detail.pkGlobalId
                _bagData.isTrue = this.jdStatus
                this.$confirm('确定保存吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
                    this.subForm(api.identifyReport,_bagData,(data) => {
                        this.reData()
                        this.modifyState=false
                        this.$message({ type: 'success', message: '保存成功!' })
                    })
                }).catch(() => { })
            }
        },
        submitRefund(){
            // this.refund.id = this.detail.pkGlobalId
            // this.patchData(api.identifyList+'/'+this.detail.pkGlobalId,this.refund,(data) => {
            //     this.$message({showClose: true,message: '提交成功',type: 'success'})
            // })
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
        },
        printme() {
            this.isPrint = false
            this.$nextTick(function(){
                document.body.innerHTML=document.getElementById('print').innerHTML
                window.print()
                window.location.reload()
            })
        }
    }
}
</script>