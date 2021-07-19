<template>
    <div class="menu pos-r hxy-mb-20">
        <ul class="pos-r">
            <li v-for="(item,index) in tabList" :key="index">
                <router-link :to="item.path" class="db">{{item.title}}</router-link>
            </li>
        </ul>
        <div class="line pos-a"></div>
    </div>
</template>

<script>
import { mapGetters } from "vuex"
import util from '_m/util'
export default {
    name: 'tabmenu',
    data() {
        return {
            tabList: [],
            path: ''
        }
    },
    computed: {
		...mapGetters({
			menuList : 'get_menuList'
		})
	},
	watch:{
        "$route": {
            handler(val,oldVal){
                if(val){
                    this.path = this.$route.path.split('/')
                }
            },
            immediate: true
        }
    },
    mounted() {
        this.tabList = util.filterMenu(this.menuList,this.path)
    },
    methods: {}
};
</script>
<style lang="scss" scoped>
.menu {
    .line {
        width: 100%;
        height: 1px;
        overflow: hidden;
        background: #DCDEE2;
        bottom: 0;
        left: 0;
        z-index: 99;
    }
    ul {
        display: flex;
        z-index: 100;
        li {
            height: 40px;
            line-height: 20px;
            text-align: center;
            margin-right: 15px;
            a {
                height: 40px;
                display: block;
                padding: 0 10px;
                color: #515A6E;
                &:hover {
                    color: #5CADFF;
                }
                &.active{
                    color: #5CADFF;
                    font-size: 13px;
                    border-bottom: 2px solid #5CADFF;
                }
            }
        }
    }
}
</style>