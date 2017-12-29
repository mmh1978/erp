<style lang="less" scope>
    @import "../css/color";
    .side{
        position: absolute;
        width: 200px;
        top: 60px;
        bottom: 0;
        background:#eef1f6;
        overflow-y: auto;
        overflow-x: hidden;
    }
</style>
<template>
<div class="side">
<el-menu default-active="1-4-1" class="el-menu-vertical-demo" @select="handleSelect">
<template v-for="item in menuList">
    <el-submenu :index="'/home'+item.path" v-if="userRoles.indexOf(item.id)>=0">
        <template slot="title">
            <i class="el-icon-menu"></i>
            <span slot="title">{{item.label}}</span>
        </template>
        <template v-for="child in item.children">
            <template v-if="userRoles.indexOf(child.id)>=0">
                <el-menu-item :index="'/home'+child.path" :class="{'is-active':$route.path==child.path}" v-if="child.menu">{{child.label}}</el-menu-item>
                <el-submenu :index="'/home'+child.path" v-else>
                    <span slot="title">{{child.label}}</span>
                    <template v-for="inner in child.children">
                        <el-menu-item v-if="userRoles.indexOf(inner.id)>=0" :index="'/home'+inner.path" :class="{'is-active':$route.path==inner.path}">{{inner.label}}</el-menu-item>
                    </template>
                </el-submenu>
            </template>
        </template>
    </el-submenu>
</template>
</el-menu>
</div>
</template>

<script>
import api from '../util/api'
import ajax from '../util/ajax'
export default {
    name: 'side',
    mixins: [ajax],
    data () {
        return {
            menuList: '',
            userRoles: ''
        }
    },
    created(){
        this.menuList=JSON.parse(sessionStorage.menu)
        this.userRoles=JSON.parse(sessionStorage.userRoles).rights
    },
    mounted(){

    },
    updated(){
        
    },
    methods:{
        handleSelect(key, keyPath) {
            this.$router.push(key)
        }
    }
}
</script>