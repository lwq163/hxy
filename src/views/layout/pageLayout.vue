<template>
    <div class="layout">
        <div class="left-part">
            <Sider />
        </div>
        <div class="right-part">
            <Header />
            <div class="content">
                <router-view></router-view>
            </div>
        </div>
        <!-- <fiexd></fiexd> -->
    </div>
</template>
<script>
import Header from '_c/layout/header'
import Sider from '_c/layout/sider'
import Bread from '_c/layout/bread'
// import fiexd from '_c/layout/fiexdBox'

export default {
    data(){
        return{
        }
    },
    components: {Header, Sider,Bread},
}
</script>