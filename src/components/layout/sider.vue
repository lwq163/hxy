<template>
    <div class="sider">
		<div class="logo">
			<img :src="companyLogo" :onerror="defaultLogo"/>
			<!-- <img :src="companyLogo"/> -->
		</div>
        <div class="menu">
            <template v-for="(item,index) in menuList">
			<!-- <template v-for="(item,index) in menuList" v-if="item.path!='/notice'"> -->
                <router-link :to="{path: item.path}">
					<div class="isFlexalitem">
						<i :class="'iconfont '+item.icon"></i>{{item.title}}
					</div>
                </router-link>
            </template>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    data(){
        return{
			Cindex : 0,
			companyLogo: ''
        }
    },
    computed: {
        ...mapGetters({
            menuList : 'get_menuList',
			companyInfo: 'get_company_info'
        }),
		defaultLogo() {
            return 'this.src="' + require('@/assets/company_logo.png') + '"';
        }
    },
	watch: {
		'$route': {
			handler(val,oldVal) {
				if(val) {
					let index  = 0;						//一级菜单当前选项
					let data = this.menuList
					let secData   = []				//二级菜单数据
					let url = this.$route.path.split('/')
					for(var i=0;i<data.length;i++){
						var temp = data[i];
						if(temp.name==url[1]){
							index = i;
							secData = temp.children?temp.children:"";
							break
						}
					}
					this.$store.commit('SET_SECLIST',{index:index,data:secData})
				}
			},
			immediate: true
		},
		companyInfo: {
			handler(val,oldVal){
				if(val) {
					this.companyLogo = val.logo
				}
            },
            immediate: true
		}
	},
    created() {
    },
    mounted(){
	},
	methods:{}
}
</script>