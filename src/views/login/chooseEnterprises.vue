<template>
    <div class="bg">
        <div class="return-btn pos-r" style="z-index: 9999">
            <Icon class="iconfont iconPC-22 hxy-font-color-fff" />
            <span class="hxy-font-color-fff hxy-ml-12" @click="toLogin">返回到登录页</span>
        </div>
        <div class="choose-enterprise">
            <p class="hxy-font-size-32 hxy-font-color-fff tc">请选择您的企业</p>
            <p class="hxy-font-size-24 hxy-font-color-fff hxy-opacity-6 tc hxy-mt-12">以下为您加入的企业</p>
            <Carousel class="hxy-mt-20" v-model="value1" loop>
                <CarouselItem class="hxy-mt-80" v-for="(item,index) in newCompany" :key="index" style="display: grid; grid-template-columns: repeat(2, 1fr)">
                    <div class="every-enterprise hxy-mb-30" @click="selectCompany(el)" v-for="(el,ind) in item" :key="ind" style="cursor: pointer">
                        <dl class="isFlexalitem">
                            <dt class="enterprise-logo">
                                <img class="pos-r-c" src="@/assets/logo.png" alt="">
                            </dt>
                            <dd class="hxy-ml-16 enterprise-info">
                                <p class="enterprise-name">{{el.masterDeptName}}</p>
                                <p class="enter-enterprise tc">
                                    <span>进入该企业</span>
                                    <Icon class="iconfont iconPC-82" />
                                </p>
                            </dd>
                        </dl>
                    </div>
                </CarouselItem>
            </Carousel>
            <!-- <div class="enterprise-container">
                <div class="else-enterprise">
                    <div class="enterprise" v-for="(item,index) in company" :key="index">
                        <div class="every-enterprise" @click="selectCompany(item)">
                            <dl class="isFlexalitem">
                                <dt class="enterprise-logo">
                                    <img class="pos-r-c" src="@/assets/logo.png" alt="">
                                </dt>
                                <dd class="hxy-ml-16 enterprise-info">
                                    <p class="enterprise-name">{{item.masterDeptName}}</p>
                                    <p class="enter-enterprise tc">
                                        <span>进入该企业</span>
                                        <Icon class="iconfont iconPC-82" />
                                    </p>
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
            <div class="enterprise-btn">
                <Icon class="iconfont iconPC-70 enterprise-button button-prev hxy-mr-30"/>
                <Icon class="iconfont iconPC-20 enterprise-button button-next hxy-ml-30" :class="{'current-button': multipleEnterprises}"/>
            </div> -->
        </div>
    </div>
</template>

<script>

import { mapGetters } from "vuex"
import util from '_m/util'
import { deleteLogout } from '_s/login'

export default {
    data() {
        return {
            value1: 0,
            multipleEnterprises: false,
            enterpriseList: [
                {masterDeptName: '苏州弘知远扬知识产权有限公司'},
                {masterDeptName: '苏州弘知远扬知识产权有限公司'},
                {masterDeptName: '苏州弘知远扬知识产权有限公司'},
                {masterDeptName: '苏州弘知远扬知识产权有限公司'},
                {masterDeptName: '苏州弘知远扬知识产权有限公司'},
                {masterDeptName: '苏州弘知远扬知识产权有限公司'},
                {masterDeptName: '苏州弘知远扬知识产权有限公司'},
                {masterDeptName: '苏州弘知远扬知识产权有限公司'},
                {masterDeptName: '苏州弘知远扬知识产权有限公司'},
                {masterDeptName: '苏州弘知远扬知识产权有限公司'}
            ],
            newCompany: []
        }
    },
    computed: {
      
    },
    computed: {
		...mapGetters({
			company : 'get_deptList'
		})
	},
    mounted() {
        let len = this.company.length, sliceNum = 4
        for (let i = 0; i < len/sliceNum; i++) {
            this.newCompany.push(this.company.slice(i*sliceNum,(i+1)*sliceNum))
        }
    },
    methods: {
        selectCompany(data) {
            util.setStorage('masterDeptId',data.masterDeptId)
            setTimeout(() => {
                this.$router.push('/index')
            },300)
        },
        toLogin() {
            util.delCookie('Admin-Token')
            localStorage.clear()
            setTimeout(() => {
                this.$router.push('/login')
                window.location.reload()
            },300)
        }
    }
}
</script>

<style lang="scss" scoped>
.bg {
    background-image: url("../../assets/images/bg.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    height: 100vh;
    .return-btn {
      position: fixed;
      top: 8%;
      left: 4.5%;
      cursor: pointer;
    }
    .choose-enterprise {
      width: 1048px;
      height: 543px;
      background: rgba(255,255,255,0.20);
      border-radius: 16px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      box-sizing: border-box;
      padding: 60px 164px;
      .enterprise-container{
          width: 960px;
          height: 224px;
          margin-top: 104px;
          .else-enterprise {
            width: 960px;
            height: 224px;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            .enterprise {
                margin-right: 120px;
                margin-bottom: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
            }
        }
      }
      .enterprise-btn {
          margin-top: 105px;
          text-align: center;
            .enterprise-button {
                width: 40px;
                height: 40px;
                line-height: 40px;
                color: #fff;
                background: rgba(255,255,255,0.20);
                border-radius: 50%;
                opacity: 0.5;
            }
            .current-button {
                opacity: 1;
            }
      }
      
      .every-enterprise {
        width: 315px;
        height: 69px;
        background: rgba(255,255,255,.3);
        border-radius: 16px;
        box-sizing: border-box;
        padding: 11px;
        .enterprise-logo {
            width: 45px;
            height: 45px;
            border-radius: 12px;
            img {
                width: 34px;
                height: 41px;
            }
        }
        .enterprise-name {
            font-size: 14px;
            font-family: PingFangSC, PingFangSC-Regular;
            color: #ffffff;
            vertical-align: text-top;
            margin-bottom: 6px;
        }
        .enter-enterprise {
            display: table-cell;
            width: 86px;
            height: 20px;
            opacity: 0.6;
            border: 1px solid #ffffff;
            border-radius: 5px;
            color: #ffffff;
            vertical-align: middle;
            font-size: 10px;
            .iconfont {
                font-size: 10px;
            }
        }
      }
      .swiper-container {
          width: 100%;
          height: 100%;
      }
      .swiper-button-prev, .swiper-button-next{
        width: 40px;
        height: 40px;
        background: rgba(255,255,255,.2);
        border-radius: 50%;
        cursor: pointer;
      }
      .swiper-button-prev:after, .swiper-button-next:after {
        font-size: 14px;
        opacity: 0.3;
        color:#ffffff;
      }
      .enterprise-wrapper {
          margin-top: 104px;
      }
    }
    /deep/.ivu-col-span-24 {
        display: block;
        flex: 0 0 51%;
        max-width: 100%;
    }
    /deep/.ivu-carousel {
        left: 50%;
        transform: translateX(-46.8%);
    }
    /deep/.left,.ivu-carousel-arrow,.ivu-carousel-arrow-hover {
        position: absolute;
        top: 110%;
        left: 38%;
    }
    /deep/.right,.ivu-carousel-arrow,.ivu-carousel-arrow-hover {
        position: absolute;
        top: 110%;
        left: 50%;
    }
    /deep/.ivu-carousel-dots li {
        display: none !important;
    }
}
</style>