<template>
  <div class="bg">
    <div class="login">
      <div class="login-img-title">
        <div class="login-top">
          <img class="login-img" src="@/assets/images/Company logo.png"/>
          <span class="login-wel">{{timeState}}，欢迎登录 ~</span>
        </div> 
        <p class="login-title">老板，我来后台管理系统</p>
      </div>
      <div class="login-form">
        <Tabs>
          <TabPane label="登录" class="current-tab">
            <Row>
              <Form ref="loginForm" :model="loginForm" :rules="ruleForm" @keydown.native.enter.prevent="login">
                <FormItem prop="username">
                  <Input class="form-account" v-model="loginForm.username" placeholder="请输入邮箱号" @on-focus="accountIcon = true">
                    <Icon slot="prefix" class="iconfont iconPC-1" />
                    <span v-show="accountIcon" slot="suffix" class="ivu-input-suffix border-left">
                      <i class="iconfont iconPC-71" v-on:click="handleRemoveAccount"></i>
                    </span>
                  </Input>
                </FormItem>
                <FormItem v-if="pwdFlag" prop="password" class="form-pwd">
                  <Input v-model="loginForm.password" type="password" placeholder="请输入密码" @on-focus="pwdHideIcon = true">
                    <Icon slot="prefix" class="iconfont iconPC-2" />
                    <span v-show="pwdHideIcon" slot="suffix" class="ivu-input-suffix border-left">
                        <i v-show="pwdHideIcon" class="iconfont iconPC-73" slot="suffix" v-on:click="handlePwd"></i>
                    </span>
                  </Input>
                </FormItem>
                <FormItem v-else prop="password" class="form-pwd">
                  <Input v-model="loginForm.password" type="text" placeholder="请输入密码">
                    <Icon slot="prefix" class="iconfont iconPC-2" />
                    <span slot="suffix" class="ivu-input-suffix border-left">
                      <i class="iconfont iconPC-72" slot="suffix" v-on:click="handlePwd"></i>
                    </span>
                  </Input>
                </FormItem>
                <FormItem prop="code">
                  <Input class="login-code" v-model="loginForm.code" placeholder="请输入验证码">
                    <Icon slot="prefix" class="iconfont iconPC-3" />
                    <img :src="imgUrl" @click="getCode" slot="suffix"/>
                  </Input>
                </FormItem>
                <FormItem prop="rememberPsw">
                  <div class="login-remember-password">
                    <Checkbox v-model="loginForm.rememberPsw">记住密码</Checkbox>
                    <span class="forget-password-btn" @click="handleForgetPassword">忘记密码？</span>
                  </div>
                </FormItem>
                <Button class="login-btn" type="primary" @click="login" :loading="btnLoading">登录</Button>
              </Form>
            </Row>
            <div class="isFlexalitem hxy-mt-20">
              <span class="login-text">社交账号登录</span>
              <div class="isFlexAround icons">
                <Icon class="iconfont iconPC-80 hxy-font-color-fff"/>
                <!-- <svg class="icon-font QQ-icon">
                  <use xlink:href="#iconPC-74"></use>
                </svg> -->
                <Icon class="iconfont iconPC-81 hxy-font-color-fff"/>
                <!-- <svg class="icon-font wechat-icon">
                  <use xlink:href="#iconPC-75"></use>
                </svg> -->
                <Icon class="iconfont iconPC-79 hxy-font-color-fff"/>
                <!-- <svg class="icon-font dd-icon">
                  <use xlink:href="#iconPC-76"></use>
                </svg> -->
              </div>
            </div>
          </TabPane>
          <TabPane label="注册">
            <Row>
              <Form ref="registerForm" :model="registerForm" :rules="registerRuleForm" @keydown.native.enter.prevent="handleFinishRegister">
                <FormItem prop="email">
                  <Input class="form-account" v-model="registerForm.email" placeholder="请输入邮箱号" @on-focus="registerAccountIcon = true">
                    <Icon slot="prefix" class="iconfont iconPC-1" />
                    <span v-show="registerAccountIcon" slot="suffix" class="ivu-input-suffix border-left" @click="handleRemoveRegisterEmail">
                      <i class="iconfont iconPC-71" v-on:click="handleRemoveAccount"></i>
                    </span>
                  </Input>
                </FormItem>
                <FormItem prop="authCode" class="register-code">
                  <Input class="get-code" v-model="registerForm.authCode" placeholder="请输入验证码" maxlength="6">
                    <Icon slot="prefix" class="iconfont iconPC-3" />
                    <Button v-show="codeShow" type="text" slot="suffix" @click="handleSendAuthCode">{{btnText}}</Button>
                    <Button v-show="!codeShow" type="text" slot="suffix">{{codeCount}}秒后重试</Button>
                  </Input>
                </FormItem>
                <FormItem v-if="registerPwdFlag" prop="password" class="form-pwd">
                  <Input v-model="registerForm.password" type="password" placeholder="请输入密码（6-20位数字）" @on-focus="registerPwdHideIcon = true">
                    <Icon slot="prefix" class="iconfont iconPC-2" />
                    <span v-show="registerPwdHideIcon" slot="suffix" class="ivu-input-suffix border-left">
                        <i v-show="registerPwdHideIcon" class="iconfont iconPC-73" slot="suffix" v-on:click="handleRegisterPwd"></i>
                    </span>
                  </Input>
                </FormItem>
                <FormItem v-else prop="password" class="form-pwd">
                  <Input v-model="registerForm.password" type="text" placeholder="请输入密码（6-20位数字）">
                    <Icon slot="prefix" class="iconfont iconPC-2" />
                    <span slot="suffix" class="ivu-input-suffix border-left">
                      <i class="iconfont iconPC-72" slot="suffix" v-on:click="handleRegisterPwd"></i>
                    </span>
                  </Input>
                </FormItem>
                <FormItem v-if="confirmPwdFlag" prop="surePassword" class="form-pwd">
                  <Input v-model="registerForm.surePassword" type="password" placeholder="请再次输入确认密码" @on-focus="confirmPwdHideIcon = true">
                    <Icon slot="prefix" class="iconfont iconPC-2" />
                    <span v-show="confirmPwdHideIcon" slot="suffix" class="ivu-input-suffix border-left">
                        <i v-show="confirmPwdHideIcon" class="iconfont iconPC-73" slot="suffix" v-on:click="handleConfirmPwd"></i>
                    </span>
                  </Input>
                </FormItem>
                <FormItem v-else prop="surePassword" class="form-pwd">
                  <Input v-model="registerForm.surePassword" type="text" placeholder="请再次输入确认密码">
                    <Icon slot="prefix" class="iconfont iconPC-2" />
                    <span slot="suffix" class="ivu-input-suffix border-left">
                      <i class="iconfont iconPC-72" slot="suffix" v-on:click="handleConfirmPwd"></i>
                    </span>
                  </Input>
                </FormItem>
                <Button class="login-btn register-btn" type="primary" @click="handleFinishRegister">完成并登录</Button>
              </Form>
            </Row>
          </TabPane>
        </Tabs>
      </div>
    </div>

    <!-- <vue-particles
      color="#fff"
      :particleOpacity="0.7"
      :particlesNumber="60"
      shapeType="circle"
      :particleSize="4"
      linesColor="#fff"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="2"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
      class="bg"
    >
    </vue-particles> -->

  </div>
</template>

<script>

  import { postLogin, getCodeImg, sendAuthCode, signIn } from '_s/login'
  import Crypto from '_m/crypto'
  import util from '_m/util'

  export default {
    name: "login",
    data() {
      var surePwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.registerForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      }
      return {
        loginForm: {
          username: '',
          password: '',
          code: '',
          rememberPsw: false,
        },
        timeState: util.getTimeState(),
        ruleForm: {
          username: [
            { required: true, message: '请输入邮箱号', trigger: 'blur' }
            // { pattern: /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/, message: '请输入正确的邮箱', trigger: 'blur' }
          ],
          password: [{ required: true, message: '请输入密码', trigger: 'blur' },{message: '密码中不能含有空格等特殊字符', trigger: 'blur',pattern: /^\S+$/}],
          code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
        },
        registerForm: {},
        registerRuleForm: {
          email: [
            { required: true, message: '请输入邮箱号', trigger: 'blur' },
            { pattern: /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/, message: '请输入正确的邮箱', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { message: '密码中不能含有空格等特殊字符', trigger: 'blur',pattern: /^\S+$/ },
            { pattern: /^\d{6,20}$/, message: '请输入正确密码（6-20位数字）', trigger: 'blur' }
          ],
          surePassword: [
            { required: true, message: '请输入确认密码', trigger: 'blur' },
            { message: '密码中不能含有空格等特殊字符', trigger: 'blur',pattern: /^\S+$/},
            { validator: surePwd, required: true, trigger: 'blur' }
          ],
          authCode: [{ required: true, message: '请输入验证码', trigger: 'blur' },{ message: '验证码为6位数字', pattern: /^\d{6}$/, trigger: 'blur' }]
        },

        codeData: {},
        imgUrl: '',
        timer: {},
        redirect: undefined,
        accountIcon: false,
        pwdHideIcon: false,
        pwdFlag: true,
        registerPwdFlag: true,
        registerAccountIcon: false,
        registerPwdHideIcon: false,
        confirmPwdFlag: true,
        confirmPwdHideIcon: false,
        codeTimer: null,
        codeCount: null,
        codeShow: true,
        btnText: '获取验证码',
        btnLoading: false
      }
    },
    watch: {
      $route: {
        handler: function(route) {
          this.redirect = route.query && route.query.redirect
          console.log('redirect',this.redirect)
        },
        immediate: true
        
      }
    },
    mounted() {
      this.getCode()
      this.setTime()
      this.accountInfoData()
    },
    destroyed() {
      // 清除定时器
      clearInterval(this.timer)
    },
    methods: {
      // 获取验证码
      handleSendAuthCode() {
        if (this.registerForm.email) {
          sendAuthCode({
            email: this.registerForm.email,
            type: 1
          }).then(res => {
            if (res.code === 200) {
              const TIME_COUNT = 60;
              if (!this.codeTimer) {
                this.codeCount = TIME_COUNT;
                this.codeShow = false;
                this.codeTimer = setInterval(() => {
                if (this.codeCount > 0 && this.codeCount <= TIME_COUNT) {
                    this.codeCount--;
                  } else {
                    this.codeShow = true;
                    this.btnText = '重新获取'
                    clearInterval(this.codeTimer);
                    this.codeTimer = null;
                  }
                }, 1000)
              }
            }
          })
        } else {
          this.$Message.error('请输入邮箱号')
        }
      },
      // 完成注册登录
      handleFinishRegister() {
        this.$refs['registerForm'].validate((valid) => {
          if (valid) {
            signIn({
              authCode: this.registerForm.authCode,
              email: this.registerForm.email,
              password: this.registerForm.password
            }).then(res => {
              if (res.code === 200) {
                util.setCookie('Admin-Token',data.access_token,data.expires_in)
                this.$store.dispatch('GetDeptList').then(() => {
                  this.$router.push({
                    path: "/chooseEnterprise"
                  })
                })                
                this.$Message.success('登录成功')
                // this.$Message.success(res.msg)
                // this.$router.push('/index')
              }
            })
          }
        })
      },
      handleRemoveRegisterEmail() {
        this.registerForm.email = ''
      },
      // 忘记密码
      handleForgetPassword() {
        this.$router.push('/resetPwd')
      },
      handleRemoveAccount() {
        this.loginForm.username = ''
      },
      handleConfirmPwd() {
        this.confirmPwdFlag = !this.confirmPwdFlag
      },
      handleRegisterPwd() {
        this.registerPwdFlag = !this.registerPwdFlag
      },
      handlePwd() {
        this.pwdFlag = !this.pwdFlag
      },
      handleShowPwd() {
        console.log(this.loginForm.password, '密码')
      },
      // 设置自动刷新验证码防止验证码过期
      setTime() {
        clearInterval(this.timer)
        this.timer = setInterval(() => {
          this.getCode()
        },60*2*1000)
      },
      // 获取验证码
      getCode() {
        getCodeImg().then(res => {
          if(res.code===200) {
            this.codeData = res
            this.imgUrl = "data:image/gif;base64," + res.img
          }
        })
      },
      handleLogin() {
        this.$refs['registerForm'].validate((valid) => {
          if (valid) {
            console.log('注册完成')
          }
        })
      },
      // 登录操作
      login() {
        this.btnLoading = true
        let params = {
          username: this.loginForm.username, 
          password: this.loginForm.password, 
          code: this.loginForm.code, 
          uuid: this.codeData.uuid
        }
        this.$refs['loginForm'].validate((valid) => {
          if (valid) {
            postLogin(params).then(res => {
              if(res.code===200) {
                this.btnLoading = false
                let data = res.data
                let cipherUsername = Crypto.encrypt(this.loginForm.username)
                let cipherPassword = Crypto.encrypt(this.loginForm.password)
                if(this.loginForm.rememberPsw) {
                  util.setCookie('username',cipherUsername,30)
                  util.setCookie('password',cipherPassword,30)
                  util.setCookie('rememberPsw',this.loginForm.rememberPsw,30)
                }else {
                  util.delCookie('username')
                  util.delCookie('password')
                  util.delCookie('rememberPsw')
                }
                util.setCookie('Admin-Token',data.access_token,data.expires_in)
                this.$store.dispatch('GetDeptList').then(() => {
                  this.$router.push({
                    path: "/chooseEnterprise"
                  })
                })                
                this.$Message.success('登录成功')
              } else {
                this.btnLoading = false
                this.$Message.error(res.msg)
              }
            }).catch(err => {
              this.btnLoading = false
              this.getCode()
              this.setTime()
            })  
          }else{
            this.btnLoading = false
          }
        })
      },
      // 检测是否有帐号信息
      accountInfoData() {
        let username = util.getCookie('username')
        let password = util.getCookie('password')
        let rememberPsw = util.getCookie('rememberPsw')
        if(username === null || password === null || rememberPsw === null) {
          console.log('cookie中没有检测到账号信息！')
          return false
        }else {
          console.log('cookie中检测到账号信息！现在开始预填写！')
          this.loginForm.username = Crypto.decrypt(username)
          this.loginForm.password = Crypto.decrypt(password)
          this.loginForm.rememberPsw = Boolean(rememberPsw)
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  .bg {
    background-image: url("../../assets/images/bg.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    height: 100vh;
  }
  .login {
    width: 895px;
    height: 443px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: space-between;
    .login-img-title {
      margin-top: 45px;
      .login-top {
        display: flex;
        align-items: center;
        .login-img {
          width: 34px;
          height: 40px;
        }
        .login-wel {
          font-size: 28px;
          margin-left: 8px;
          color: #ffffff;
          font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
        }
      }
      .login-title {
        font-size: 36px;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        margin-left: 8px;
        color: #ffffff;
        margin-top: 12px;
      }
    }
    .login-form {
      width: 409px;
      height: 495px;
      background: rgba(255,255,255,.2);
      border-radius: 24px;
      box-shadow: 16px 16px 24px 0px rgba(44,146,245,0.10), 0px 2px 16px 0px rgba(0,0,0,0.10);
      box-sizing: border-box;
      padding: 32px;
      /deep/.ivu-tabs-bar {
        border: 0;
        margin-bottom: 24px;
      }
      /deep/.ivu-tabs-tab{
        font-size: 24px;
        font-family: PingFangSC, PingFangSC-Regular;
        color: #ffffff;
        opacity: 0.7;
      }
      /deep/.ivu-tabs-tab-active, .ivu-tabs-tab-focused{
        font-size: 24px;
        font-family: PingFangSC, PingFangSC-Regular;
        color: #ffffff;
        opacity: 1;
      }
      /deep/.ivu-input-wrapper, .ivu-input-wrapper-default, .ivu-input-type-text{
        width: 345px;
      }
      /deep/.ivu-tabs-ink-bar {
        width: 48px!important;
        height: 3px;
        background-color: #fff;
        left: 14px;
      }
      /deep/.ivu-input-prefix {
        left: 24px;
        top: 11px;
      }
      /deep/.ivu-input, .ivu-input-default, .ivu-input-with-prefix {
        height: 52px;
        background: #f1f1f1;
        border-radius: 8px;
        padding-left: 52px;
      }
      /deep/.ivu-input-prefix {
        display: inline-block;
        width: 20px;
        height: 20px;
      }
      .form-account {
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
      .border-left {
        border-left: 1px solid #cdcdcd;
      }
      .form-pwd {
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
      .login-code {
        /deep/.ivu-input-suffix {
          display: inline-block;
          width: 96px;
          height: 36px;
          position: absolute;
          top: 10px;
          margin-right: 24px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      /deep/.ivu-form-item-error-tip {
        margin-left: 23px;
        font-size: 12px;
      }
      /deep/.ivu-input,.ivu-input-default,.ivu-input-with-prefix {
        border: 0;
      }
      /deep/.ivu-input:focus{
        outline: 0;
        box-shadow: 0 0 0 0 rgb(255,255,255);
      }
      .login-remember-password {
        width: 345px;
        font-size: 14px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 0 26px;
        color: #ffffff;
        opacity: 0.6;
        /deep/.ivu-checkbox .ivu-checkbox-checked {
          opacity: 1;
          border: 1px solid #ffffff;
        }
        /deep/.ivu-checkbox-checked, .ivu-checkbox-inner {
          border-color: #fff;
        }
        /deep/.ivu-checkbox-inner{
          background: rgba(255,255,255,0);
          border-color: #fff;
        }
        /deep/.ivu-checkbox-checked, .ivu-checkbox-inner:focus{
          outline: 0;
        }
        /deep/.ivu-checkbox-checked, .ivu-checkbox-inner:active{
          outline: 0;
        }
        .forget-password-btn {
          cursor: pointer;
        }
      }
      /deep/.ivu-checkbox,.ivu-checkbox-checked {
        margin-right: 10px;
      }
      .login-btn {
        width: 345px;
        height: 36px;
        opacity: 1;
        background: #3497fd;
        border-radius: 8px;
        font-weight: 400;
        color: #ffffff;
        font-size: 14px;
        display:block;
        margin:0 auto;
        margin-top: -13px;
      }
      .login-text {
        font-size: 14px;
        font-family: PingFangSC, PingFangSC-Regular;
        color: #ffffff;
        margin-left: 43px;
      }
      .icons {
        width: 170px;
        margin-left: 10px;
        .QQ-icon {
          width: 20px;
          height: 23px;
        }
        .wechat-icon {
          width: 24px;
          height: 24px;
        }
        .dd-icon {
          width: 24px;
          height: 24px;
        }
      }
      .register-btn {
        margin-top: 40px;
      }
      .register-code {
        /deep/.ivu-input-suffix {
          display: inline-block;
          width: 90px;
          height: 36px;
          position: absolute;
          top: 10px;
          margin-right: 24px;
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
      }
    }
  }
</style>