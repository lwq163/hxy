<template>
  <div class="bg">
      <div class="return-logo isFlexalitem">
        <img class="reset-pwd-logo" src="@/assets/logo.png" alt="">
        <span class="hxy-font-color-fff hxy-font-size-24 hxy-ml-15">老板，我来后台管理系统</span>
        <span class="hxy-ml-25 hxy-mr-25 divider"></span>
        <span class="hxy-font-color-fff hxy-font-size-18">找回密码</span>
      </div>
      <div class="return-btn pos-r" style="z-index: 9999">
        <Icon class="iconfont iconPC-22 hxy-font-color-fff" />
        <span class="hxy-font-color-fff hxy-ml-12" @click="toLogin">返回到登录页</span>
      </div>
      <div class="reset-pwd-step">
        <Steps :current="resetStep">
            <Step title="验证身份" content="请确认邮箱账号">
              <i class="reset-password iconfont iconPC-3" :class="{'finish-step': resetStep <= 2}"  slot="icon"></i>
            </Step>
            <Step title="重置密码" content="请重新设置您的密码">
              <i class="reset-password iconfont iconPC-2" :class="{'finish-step': resetStep >= 1 && resetStep <= 2}" slot="icon"></i>
            </Step>
            <Step title="重置成功" content="密码重置成功，请重新登录">
              <i class="reset-password iconfont iconPC-78" :class="{'finish-step': resetStep === 2}" slot="icon"></i>
            </Step>
        </Steps>
        <div v-show="resetStep === 0" class="authentication">
          <Form ref="authentionForm" :model="authentionForm" :rules="authentionRules">
            <FormItem prop="email">
              <p class="isFlexalitem hxy-font-size-18 hxy-font-color-fff reset-account">
                <Icon slot="prefix" class="iconfont iconPC-1" />
                <span class="hxy-ml-12">账号</span>
              </p>
              <Input class="form-account hxy-mt-10" v-model="authentionForm.email" placeholder="请输入邮箱号" @on-focus="resetAccountIcon = true">
                <span v-show="resetAccountIcon" slot="suffix" class="ivu-input-suffix border-left" @click="handleRemoveResetEmail">
                  <i class="iconfont iconPC-71" v-on:click="handleRemoveAccount"></i>
                </span>
              </Input>
            </FormItem>
            <FormItem prop="authCode">
              <p class="isFlexalitem hxy-font-size-18 hxy-font-color-fff hxy-mt-10">
                <Icon slot="prefix" class="iconfont iconPC-3" />
                <span class="hxy-ml-12">验证码</span>
              </p>
              <Input class="get-code hxy-mt-16" v-model="authentionForm.authCode" placeholder="请输入验证码" maxlength="6">
                <Button type="text" slot="suffix" @click='handleSendAuthCode'>获取验证码</Button>
              </Input>
            </FormItem>
            <FormItem prop="rememberPsw">
              <Button class="next-step" type="primary" @click="handleAuthentionStep">下一步</Button>
            </FormItem>
            <FormItem prop="rememberPsw" class="goAndLandText">
              <span class="">密码已记起，</span>
              <a class="goAndLandBtn" type="text" href="/login">去登录</a>
            </FormItem>
          </Form>
        </div>
        <div v-show="resetStep === 1" class="authentication">
          <Form ref="resetPwdForm" :model="resetPwdForm" :rules="resetPwdRules">
            <FormItem v-if="resetPwdFlag" prop="password">
              <p class="isFlexalitem hxy-font-size-18 hxy-font-color-fff reset-account">
                <Icon slot="prefix" class="iconfont iconPC-2" />
                <span class="hxy-ml-12">密码</span>
              </p>
              <Input class="form-account hxy-mt-10" v-model="resetPwdForm.password" type="password" placeholder="请输入密码（6-20位数字）" @on-focus="resetPwdIcon = true">
                <span v-show="resetPwdIcon" slot="suffix" class="ivu-input-suffix border-left">
                    <i class="iconfont iconPC-73" slot="suffix" v-on:click="handleResetPwd"></i>
                </span>
              </Input>
            </FormItem>
            <FormItem v-else prop="password">
              <p class="isFlexalitem hxy-font-size-18 hxy-font-color-fff reset-account">
                <Icon slot="prefix" class="iconfont iconPC-2" />
                <span class="hxy-ml-12">密码</span>
              </p>
              <Input class="form-account hxy-mt-10" v-model="resetPwdForm.password" type="text" placeholder="请输入密码（6-20位数字）">
                <span slot="suffix" class="ivu-input-suffix border-left">
                    <i class="iconfont iconPC-72" slot="suffix" v-on:click="handleResetPwd"></i>
                </span>
              </Input>
            </FormItem>

            <FormItem v-if="surePwdFlag" prop="surePwd">
              <p class="isFlexalitem hxy-font-size-18 hxy-font-color-fff reset-account">
                <Icon slot="prefix" class="iconfont iconPC-2" />
                <span class="hxy-ml-12">确认密码</span>
              </p>
              <Input class="form-account hxy-mt-10" v-model="resetPwdForm.surePwd" type="password" placeholder="请再次输入确认您的新密码" @on-focus="surePwdIcon = true">
                <span v-show="surePwdIcon" slot="suffix" class="ivu-input-suffix border-left">
                    <i class="iconfont iconPC-73" slot="suffix" v-on:click="handleSurePwd"></i>
                </span>
              </Input>
            </FormItem>
            <FormItem v-else prop="surePwd">
              <p class="isFlexalitem hxy-font-size-18 hxy-font-color-fff reset-account">
                <Icon slot="prefix" class="iconfont iconPC-2" />
                <span class="hxy-ml-12">确认密码</span>
              </p>
              <Input class="form-account hxy-mt-10" v-model="resetPwdForm.surePwd" type="text" placeholder="请再次输入确认您的新密码">
                <span slot="suffix" class="ivu-input-suffix border-left">
                    <i class="iconfont iconPC-72" slot="suffix" v-on:click="handleSurePwd"></i>
                </span>
              </Input>
            </FormItem>
            <FormItem prop="rememberPsw">
              <Button class="next-step" type="primary" @click="handleResetPwdStep">下一步</Button>
            </FormItem>
            <FormItem prop="rememberPsw" class="goAndLandText">
              <span class="">密码已记起，</span>
              <a class="goAndLandBtn" type="text" href="/login">去登陆</a>
            </FormItem>
          </Form>
        </div>
        <div v-show="resetStep === 2" class="authentication tc reset-finish">
          <img src="@/assets/images/reset finish.png" alt="">
          <p class="reset-finish-tip hxy-mt-24">恭喜您！密码已重置成功</p>
          <Button type="primary" class="reset-finish-btn" to="/login">去登录</Button>
          <p class="reset-finish-tip hxy-opacity-6 hxy-mt-24">若未点击，10s后将自动跳转到登录页面</p>
        </div>
      </div>
  </div>
</template>

<script>
import { sendAuthCode, reset } from '_s/login'
import util from '_m/util'
export default {
  data() {
    var surePwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.resetPwdForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }
    return {
      resetStep: 0,
      authentionForm: {},
      resetPwdForm: {},
      resetPwdIcon: false,
      resetPwdFlag: true,
      surePwdIcon: false,
      surePwdFlag: true,
      resetAccountIcon: false,
      authentionRules: {
        email: [
          { required: true, message: '请输入邮箱号', trigger: 'blur' },
          { pattern: /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/, message: '请输入正确的邮箱', trigger: 'blur' }
        ],
        authCode: [{ required: true, message: '请输入邮箱验证码', trigger: 'blur' },{ message: '验证码为6位数字', pattern: /^\d{6}$/, trigger: 'blur' }]
      },
      resetPwdRules: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { message: '密码中不能含有空格等特殊字符', trigger: 'blur',pattern: /^\S+$/ },
          { pattern: /^\d{6,20}$/, message: '请输入正确密码（6-20位数字）', trigger: 'blur' }
        ],
        surePwd: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { message: '密码中不能含有空格等特殊字符', trigger: 'blur',pattern: /^\S+$/ },
          { validator: surePwd, required: true, trigger: 'blur' }
        ],
      }
    }
  },
  watch: {
    'resetStep': function(newVal) {
      if(newVal === 2) {
        setTimeout(() => {
          this.$router.push('/login')
        },10000)
      }
    }
  },
  methods: {
    toLogin() {
      util.delCookie('Admin-Token')
      localStorage.clear()
      setTimeout(() => {
          this.$router.push('/login')
          window.location.reload()
      },300)
    },
    handleRemoveResetEmail() {
      this.authentionForm.email = ''
    },
    // 获取验证码
    handleSendAuthCode() {
      sendAuthCode({
        email: this.authentionForm.email,
        type: 2
      }).then(res => {
        this.$Message.success(res.msg)
      })
    },
    // 验证身份
    handleAuthentionStep() {
      this.$refs['authentionForm'].validate((valid) => {
        if (valid) {
          this.resetStep = 1
        }
      })
    },
     // 重置密码
    handleResetPwdStep() {
      this.$refs['resetPwdForm'].validate((valid) => {
        if (valid) {
          reset({
            authCode: this.authentionForm.authCode,
            email: this.authentionForm.email,
            password: this.resetPwdForm.password
          }).then(res => {
            if(res.code === 200) {
              this.$Message.success(res.msg)
              this.resetStep = 2
            }
          })
        }
      })
    },
    // 查看密码
    handleResetPwd() {
      this.resetPwdFlag = !this.resetPwdFlag
    },
    // 查看确认密码
    handleSurePwd() {
      this.surePwdFlag = !this.surePwdFlag
    },
    handleRemoveAccount() {
      this.authentionForm.account = ''
    },
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
    .return-logo {
      position: fixed;
      top: 4%;
      left: 4%;
      .reset-pwd-logo {
        width: 34px;
        height: 40px;
      }
      .divider {
        display: inline-block;
        width: 1px;
        height: 21px;
        opacity: 1;
        background: #e8eaec;
      }
    }
    .return-btn {
      position: fixed;
      top: 13%;
      left: 4.5%;
      cursor: pointer;
    }
    .reset-pwd-step {
      width: 1398px;
      height: 723px;
      background: rgba(255,255,255,0.20);
      border-radius: 16px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      box-sizing: border-box;
      padding: 80px;
      /deep/.ivu-steps-head {
        background: transparent;
      }
      /deep/.ivu-steps .ivu-steps-title {
        background: transparent;
        color: #fff;
      }
      /deep/.ivu-steps-content {
        color: #fff;
      }
      /deep/.ivu-steps-item,.ivu-steps-status-process,.ivu-steps-custom {
        display: flex;
        align-items: center;
      }
      /deep/.ivu-steps .ivu-steps-tail {
        width: 55%;
        padding: 0 10px;
        position: absolute;
        left: 190px;
        top: 40px;
      }
      /deep/.ivu-steps-horizontal .ivu-steps-content{
        margin-left: 0;
      }
      /deep/.ivu-steps-horizontal .ivu-steps-content {
        padding-left: 0;
      }
      /deep/.ivu-steps-title {
        font-size: 24px;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        margin-top: 20px;
      }
      /deep/.ivu-steps-content {
        font-size: 18px;
        font-family: PingFangSC, PingFangSC-Regular;
      }
      .reset-password {
        width: 62px;
        height: 62px;
        opacity: 0.8;
        border: 2px solid #ffffff;
        border-radius: 50%;
        display: table-cell;
        vertical-align: middle;
        color: #fff;
        font-size: 21px;
      }
      .finish-step {
        border: 2px solid #2d8cf0;
        color:#2d8cf0;
        background: rgba(255,255,255,0.60);
      }
      .authentication {
        width: 400px;
        height: 372px;
        margin: 110px auto;
        .next-step {
          width: 100%;
          height: 44px;
          margin-top: 20px;
        }
      }
      .reset-finish {
        margin-top: 85px;
      }
      /deep/.ivu-input-with-suffix {
        height: 52px;
        border-radius: 8px;
        padding-left: 16px;
      }
      /deep/.ivu-form-item-error-tip {
        margin-left: 17px;
      }
      /deep/.login-code .ivu-btn,.ivu-btn-text {
        color: #2D8CF0;
      }
      /deep/.login-code .ivu-btn,.ivu-btn-text:hover {
        color: #2D8CF0;
        background: transparent;
      }
      /deep/.ivu-btn,.ivu-btn-text:focus {
        outline: 0;
      }
      .get-code {
        /deep/.ivu-input-suffix {
          width: 130px;
          line-height: 52px;
        }
      }
      .goAndLandText {
        font-size: 18px;
        font-family: PingFangSC, PingFangSC-Regular;
        text-align: right;
        color: rgba(255,255,255,0.40);
        margin-top: -15px;
        /deep/.ivu-btn,.ivu-btn-text {
          text-align: right;
          color: rgba(255,255,255,1);
        }
        .goAndLandBtn {
          text-decoration: underline;
          color: rgba(255,255,255,.8);
        }
      }
      .reset-finish-btn {
        width: 400px;
        height: 44px;
        margin-top: 65px;
      }
      .reset-finish-tip {
        font-size: 18px;
        font-family: PingFangSC, PingFangSC-Regular;
        color: #ffffff;
      }
      .border-left {
        border-left: 1px solid #cdcdcd;
      }
      /deep/.ivu-input-suffix {
        width: 66px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
</style>