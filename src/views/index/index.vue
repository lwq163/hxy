<template>
  <div class="app-container">
    <Row :gutter="25">
      <Col span="8">
        <div class="area-box">
          <div class="item-title overflow">
            <span class="more">更多 &gt;</span>
            <span class="fl">我的任务</span>
            <span class="search fl">
              <Select v-model="time" size="small" placeholder="请选择">
                <Option
                  v-for="item in timeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </Option>
              </Select>
            </span>
          </div>
          <Row class="item-box" style="padding: 26px 10px 26px 26px;">
            <Row :gutter="20" style="width: 100%; height: 370px; overflow: auto;">
              <Col :xs="24" :sm="24" :md="12" :lg="12">
                <div class="package">
                  <div>
                    <div class="t1"><span class="line line-info"></span>新增意向用户</div>
                    <div class="t2"><span class="txt">任务</span> <span class="num">200</span></div>
                    <div class="t2"><span class="txt">完成</span> <span class="num">222</span></div>
                  </div>
                  <div class="progress">
                    <Circle :percent="60" stroke-linecap="round" :trail-width="8" :stroke-width="8" :stroke-color="['#0080F5','#93C7F5']" :size="60">
                        <span style="color:#0080F5">60%</span>
                    </Circle>
                  </div>
                </div>
              </Col>
              <Col :xs="24" :sm="24" :md="12" :lg="12">
                <div class="package">
                  <div>
                    <div class="t1"><span class="line line-info"></span>新增意向用户</div>
                    <div class="t2"><span class="txt">任务</span> <span class="num">1234</span></div>
                    <div class="t2"><span class="txt">完成</span> <span class="num">222</span></div>
                  </div>
                  <div class="progress">
                    <Circle :percent="50" stroke-linecap="round" :trail-width="8" :stroke-width="8" :stroke-color="['#5987FF','#8FACFA']" :size="60">
                        <span style="color:#5987FF">50%</span>
                    </Circle>
                  </div>
                </div>
              </Col>
              <Col :xs="24" :sm="24" :md="12" :lg="12">
                <div class="package">
                  <div>
                    <div class="t1"><span class="line line-primary"></span>签单数量</div>
                    <div class="t2"><span class="txt">任务</span> <span class="num">555</span></div>
                    <div class="t2"><span class="txt">完成</span> <span class="num">222</span></div>
                  </div>
                  <div class="progress">
                    <Circle :percent="80" stroke-linecap="round" :trail-width="8" :stroke-width="8" :stroke-color="['#F5A114','#FBCF2D']" :size="60">
                        <span style="color:#FFAC00">80%</span>
                    </Circle>
                  </div>
                </div>
              </Col>
              <Col :xs="24" :sm="24" :md="12" :lg="12">
                <div class="package">
                  <div>
                    <div class="t1"><span class="line line-warning"></span>合同总额</div>
                    <div class="t2"><span class="txt">任务</span> <span class="num">300</span></div>
                    <div class="t2"><span class="txt">完成</span> <span class="num">222</span></div>
                  </div>
                  <div class="progress">
                    <Circle :percent="80" stroke-linecap="round" :trail-width="8" :stroke-width="8" :stroke-color="['#00C4C5','#7BE8E8']" :size="60">
                        <span style="color:#00C4C5">80%</span>
                    </Circle>
                  </div>
                </div>
              </Col>
              <Col :xs="24" :sm="24" :md="12" :lg="12">
                <div class="package">
                  <div>
                    <div class="t1"><span class="line line-warning"></span>回款总额</div>
                    <div class="t2"><span class="txt">任务</span> <span class="num">300</span></div>
                    <div class="t2"><span class="txt">完成</span> <span class="num">222</span></div>
                  </div>
                  <div class="progress">
                    <Circle :percent="80" stroke-linecap="round" :trail-width="8" :stroke-width="8" :stroke-color="['#FA915E','#FFC889']" :size="60">
                        <span style="color:#FA915E">80%</span>
                    </Circle>
                  </div>
                </div>
              </Col>
              <Col :xs="24" :sm="24" :md="12" :lg="12">
                <div class="package">
                  <div>
                    <div class="t1"><span class="line line-warning"></span>合同总额</div>
                    <div class="t2"><span class="txt">任务</span> <span class="num">300</span></div>
                    <div class="t2"><span class="txt">完成</span> <span class="num">222</span></div>
                  </div>
                  <div class="progress">
                    <Circle :percent="80" stroke-linecap="round" :trail-width="8" :stroke-width="8" :stroke-color="['#F5A114','#FBCF2D']" :size="60">
                        <span style="color:#FFAC00">80%</span>
                    </Circle>
                  </div>
                </div>
              </Col>
              <Col :xs="24" :sm="24" :md="12" :lg="12">
                <div class="package">
                  <div>
                    <div class="t1"><span class="line line-warning"></span>回款总额</div>
                    <div class="t2"><span class="txt">任务</span> <span class="num">300</span></div>
                    <div class="t2"><span class="txt">完成</span> <span class="num">222</span></div>
                  </div>
                  <div class="progress">
                    <Circle :percent="80" stroke-linecap="round" :trail-width="8" :stroke-width="8" :stroke-color="['#F5A114','#FBCF2D']" :size="60">
                        <span style="color:#FFAC00">80%</span>
                    </Circle>
                  </div>
                </div>
              </Col>
            </Row>
          </Row>
        </div>

        <div class="area-box">
          <div class="item-title">
            <span class="more">更多 &gt;</span>
            <span style="margin-right: 36px;">成长学院</span>
            <span class="tab-list">
              <span v-for="(item,index) in tabName" :class="{active:num == index}" :key="index" @click="selectTab(index)">{{item}}</span>
            </span>
          </div>
          <Row :gutter="20" class="item-box">
            <div v-if="num==0" class="recommend">
              <div class="user-info overflow">
                <div class="avatar fl">
                  <Avatar shape="square" :size="40" :src="avatarUrl"></Avatar >
                </div>
                <div class="info fl">
                  <div class="name">姓名</div>
                  <div class="position">职位</div>
                </div>
                <div class="style-button1 fr">
                  <i class="iconfont iconPC-35" style="color: #2D8CF0"></i>
                  <span class="t1">我的课程</span>
                  <span class="t2">20</span>
                </div>
                <div class="style-button1 fr">
                  <i class="iconfont iconPC-34" style="color: #2D8CF0"></i>
                  <span class="t1">即将考试</span>
                  <span class="t2">2</span>
                </div>
              </div>
              <div class="share-box overflow" v-for="i in 2" :key="i">
                <div class="avatar fl">
                  <Avatar shape="square" :size="40" :src="avatarUrl"></Avatar >
                </div>
                <div class="info fl">
                  <div class="name">姓名</div>
                  <div class="time">25分钟前</div>
                </div>
                <div class="desc overflow">
                  <div class="txt">
                    <span class="">#战绩分享#</span>历时1个月，成功签约美的客户。感谢各部门小伙伴的忙，…
                  </div>
                  <div class="pic">
                    <img
                      style="width: 58px; height: 58px; margin-right: 14px;"
                      :src="url"/>
                    <img
                      style="width: 58px; height: 58px; margin-right: 14px;"
                      :src="url"/>
                    <img
                      style="width: 58px; height: 58px; margin-right: 14px;"
                      :src="url"/>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="num==1" class="topten">
              <div class="user-info overflow">
                <div class="avatar fl">
                  <Avatar shape="square" :size="40" :src="avatarUrl"></Avatar >
                </div>
                <div class="info fl">
                  <div class="name">姓名</div>
                  <div class="position">职位</div>
                </div>
                <div class="style-button1 fr">
                  <i class="iconfont iconPC-35" style="color: #2D8CF0"></i>
                  <span class="t1">我的学时</span>
                  <span class="t2">20h</span>
                </div>
                <div class="style-button1 fr">
                  <i class="iconfont iconPC-34" style="color: #2D8CF0"></i>
                  <span class="t1">我的积分</span>
                  <span class="t2">20</span>
                </div>
              </div>
              <Row :gutter="25">
                <Col span="12">
                  <div class="topten-title"><span class="more">更多 &gt;</span>学时排行</div>
                  <div class="topten-list">
                    <ul>
                      <li>
                        <div class="b1 fl">
                          22
                        </div>
                        <div class="b2 fl">
                          <Avatar shape="square" :size="38" :src="avatarUrl"></Avatar >
                        </div>
                        <div class="b3 fl">本人排行</div>
                        <div class="b4 fr">1234h</div>
                      </li>
                      <li>
                        <div class="b1 fl">
                          <svg class="icon-svg" aria-hidden="true">
                            <use xlink:href="#iconPC-37"></use>
                          </svg>
                        </div>
                        <div class="b2 fl">
                          <Avatar shape="square" :size="38" :src="avatarUrl"></Avatar >
                        </div>
                        <div class="b3 fl">姓名</div>
                        <div class="b4 fr">123h</div>
                      </li>
                      <li>
                        <div class="b1 fl">
                          <svg class="icon-svg" aria-hidden="true">
                            <use xlink:href="#iconPC-38"></use>
                          </svg>
                        </div>
                        <div class="b2 fl">
                          <Avatar shape="square" :size="38" :src="avatarUrl"></Avatar >
                        </div>
                        <div class="b3 fl">姓名</div>
                        <div class="b4 fr">123h</div>
                      </li>
                      <li>
                        <div class="b1 fl">
                          <svg class="icon-svg" aria-hidden="true">
                            <use xlink:href="#iconPC-39"></use>
                          </svg>
                        </div>
                        <div class="b2 fl">
                          <Avatar shape="square" :size="38" :src="avatarUrl"></Avatar >
                        </div>
                        <div class="b3 fl">姓名</div>
                        <div class="b4 fr">123h</div>
                      </li>
                      <li>
                        <div class="b1 fl">
                          4
                        </div>
                        <div class="b2 fl">
                          <Avatar shape="square" :size="38" :src="avatarUrl"></Avatar >
                        </div>
                        <div class="b3 fl">姓名</div>
                        <div class="b4 fr">123h</div>
                      </li>
                    </ul>
                  </div>
                </Col>
                <Col span="12">
                  <div class="topten-title"><span class="more">更多 &gt;</span>积分排行</div>
                  <div class="topten-list">
                    <ul>
                      <li>
                        <div class="b1 fl">
                          22
                        </div>
                        <div class="b2 fl">
                          <Avatar shape="square" :size="38" :src="avatarUrl"></Avatar >
                        </div>
                        <div class="b3 fl">本人排行</div>
                        <div class="b4 fr">111</div>
                      </li>
                      <li>
                        <div class="b1 fl">
                          <svg class="icon-svg" aria-hidden="true">
                            <use xlink:href="#iconPC-37"></use>
                          </svg>
                        </div>
                        <div class="b2 fl">
                          <Avatar shape="square" :size="38" :src="avatarUrl"></Avatar >
                        </div>
                        <div class="b3 fl">姓名</div>
                        <div class="b4 fr">222</div>
                      </li>
                      <li>
                        <div class="b1 fl">
                          <svg class="icon-svg" aria-hidden="true">
                            <use xlink:href="#iconPC-38"></use>
                          </svg>
                        </div>
                        <div class="b2 fl">
                          <Avatar shape="square" :size="38" :src="avatarUrl"></Avatar >
                        </div>
                        <div class="b3 fl">姓名</div>
                        <div class="b4 fr">333</div>
                      </li>
                      <li>
                        <div class="b1 fl">
                          <svg class="icon-svg" aria-hidden="true">
                            <use xlink:href="#iconPC-39"></use>
                          </svg>
                        </div>
                        <div class="b2 fl">
                          <Avatar shape="square" :size="38" :src="avatarUrl"></Avatar >
                        </div>
                        <div class="b3 fl">姓名</div>
                        <div class="b4 fr">444</div>
                      </li>
                      <li>
                        <div class="b1 fl">
                          4
                        </div>
                        <div class="b2 fl">
                          <Avatar  shape="square" :size="38" :src="avatarUrl"></Avatar >
                        </div>
                        <div class="b3 fl">姓名</div>
                        <div class="b4 fr">555</div>
                      </li>
                    </ul>
                  </div>
                </Col>
              </Row>
            </div>
          </Row>
        </div>
      </Col>
      <Col span="8">
        <div class="area-box">
          <div class="item-title">
            <span class="more">更多 &gt;</span>
            <span>待办协同</span>
          </div>
          <Row class="item-box" style="height: 640px;">
			      <div style="width: 100%">
              <calendar :insert="true"  :lunar="true" @backtoday="backtoday" @pre="pre" @next="next" :type="0"></calendar>
            </div>
          </Row>		
        </div>
        <div class="area-box">
          <div class="item-title">
            <span class="more">更多 &gt;</span>
            <span>企业公告</span>
          </div>
          <Row class="item-box notice" style="height: 200px;">
            <ul>
              <li>
                <i class="iconfont icon-jiagou"></i>
                <span class="tag1">内部</span>
                [图]Signal向手机数据提取工具Cellebrite宣战：使用过时DLL存在诸多漏洞
              </li>
              <li>
                <i class="iconfont icon-jiagou"></i>
                <span class="tag2">外部</span>
                印度发起#FOSS4GOV挑战赛 鼓励本土开发者为政企打造开源软件
              </li>
              <li>
                <i class="iconfont icon-jiagou"></i>
                <span class="tag1">内部</span>
                EdgeDeflector：让新闻和兴趣用默认浏览器打开的开源小工具
              </li>
              <li>
                <i class="iconfont icon-jiagou"></i>
                <span class="tag2">外部</span>
                Blender公布今年发展路线图：包括添加对Vulkan的支持
              </li>
              <li>
                <i class="iconfont icon-jiagou"></i>
                <span class="tag1">内部</span>
                Docker Desktop现已正式提供为Apple Silicon Mac打造的原生版本
              </li>
            </ul>
          </Row>
        </div>
      </Col>
      <Col span="8">
        <div class="area-box">
          <div class="item-title">
            <span class="search fr">
              <Select v-model="time" size="small" placeholder="请选择">
                <Option
                  v-for="item in timeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </Option>
              </Select>
            </span>
            <span>我的客户</span>
          </div>
          <Row class="item-box custom" style="height: 170px;">
            <Col span="6" v-for="(item,index) in customList" :key="index" class="custom-list">
              <div class="i-box1">
                <div class="i-box2">
                  <div class="packbox">
                    <div class="b1">{{item.num}}</div>
                    <div class="b2">{{item.title}}</div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <div class="area-box">
          <div class="item-title">
            <span class="search fr">
              <Select v-model="time" size="small" placeholder="请选择">
                <Option
                  v-for="item in timeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </Option>
              </Select>
            </span>
            <span>我的工单</span>
          </div>
          <Row class="item-box order" style="height: 170px;">
            <Col span="6" v-for="(item,index) in orderList" :key="index" class="order-list">
              <div class="i-box1">
                <div class="i-box2">
                  <div class="packbox">
                    <div class="b1">{{item.num}}</div>
                    <div class="b2">{{item.title}}</div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <div class="area-box">
          <div class="item-title">
            <span class="more">更多 &gt;</span>
            <span>工作助手</span>
          </div>
          <Row class="item-box work">
            <ul>
              <li v-for="i in 12" :key="i">
                <i class="iconfont icon-jiagou"></i>
                小王提交了新的客户信息 @你 ，请你继续跟进并收集客户资料…
              </li>
            </ul>
          </Row>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
  import calendar from "_c/calendar/calendar.vue"

  export default {
    name: "index",
    components:{
      calendar
    },
    data() {
      return {
        time: '',
        timeOptions: [
          {
            value: 'day',
            label: '日'
          },
          {
            value: 'week',
            label: '周'
          },
          {
            value: 'month',
            label: '月'
          }
        ],
        tabName: ['推荐','排行'],
        tabList: [],
        num: 0,
        avatarUrl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        srcList: [
          'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        ],
        customList: [
          {
            num: 200,
            title: '跟进中'
          },
          {
            num: 200,
            title: '成交'
          },
          {
            num: 200,
            title: '战败'
          },
          {
            num: 200,
            title: '暂时搁置'
          },
        ],
        orderList: [
          {
            num: 20,
            title: '待处理'
          },
          {
            num: 12,
            title: '处理中'
          },
          {
            num: 200,
            title: '已完成'
          },
          {
            num: 200,
            title: '工单池'
          },
        ],
      }
    },
    methods: {
      selectTab(index) {
        this.num = index
      },
			
      //日记事件
      pre(e){
    
      },
      next(e){

      },
      backtoday(e){

      },
		// 日历事件结束
    },
  };
</script>
<style scoped lang="scss">
  .app-container {
    font-size: 14px;
  }
  .area-box {
    margin-bottom: 36px;
    .item-title {
      height: 32px;
      line-height: 32px;
      color: #202631;
      font-size: 22px;
      margin-bottom: 12px;
      padding: 0 12px;
      .more {
        float: right;
        font-size: 14px;
        color: #8f9bb3;
      }
      .search {
        padding-left: 17px;
      }
      .tab-list {
        font-size: 16px;
        span {
          padding: 6px 5px;
          border-bottom: 2px solid #e4e9f2;
          cursor: pointer;
        }
        span.active {
          padding: 6px 5px;
          color: #1890ff;
          border-bottom: 2px solid #1890ff;
        }
      }
    }
    .item-box {
      height: 420px;
      border-radius: 20px;
      box-shadow: 0px 0px 4px 0px rgba(242,242,242,0.50), 6px 6px 10px 0px rgba(226,226,226,0.60); 
      padding: 26px;
      border: 1px solid #eee;
      overflow: hidden;
      .package {
        height: 105px;
        background: #f7f9fc;
        border-radius: 8px;
        padding: 12px;
        overflow: hidden;
        display: flex;
        justify-content: space-between;
        margin-bottom: 26px;
        .progress {
          width: 60px;
          height: 50px;
          padding-top: 20px;
        }
        .t1 {
          display: flex;
          font-size: 18px;
          height: 25px;
          line-height: 25px;
          margin-bottom: 7px;
          overflow: hidden;
        }
        .t2 {
          height: 22px;
          line-height: 22px;
          margin-bottom: 5px;
          .txt {
            color: #8f9bb3;
            font-size: 14px;
            margin-right: 10px;
          }
          .num {
            color: #333;
            font-size: 16px;
          }
        }
      }
    }
  }
  .line {
    width: 2px;
    height: 16px;
    margin-right: 8px;
    display: block;
    overflow: hidden;
    margin-top: 3px;
  }
  .line-info {
    background: #0080f5;
  }
  .line-primary {
    background: #00c4c5;
  }
  .line-success {
    background: #67C23A;
  }
  .line-warning {
    background: #ffac00;
  }
  .line-danger {
    background: #F56C6C;
  }
  .line-default {
    background: #909399;
  }
  .user-info {
    margin-bottom: 35px;
    .avatar {
      width: 40px;
      height: 40px;
      margin-right: 12px;
    }
    .info {
      .name {
        color: #333;
        height: 20px;
        line-height: 20px;
      }
      .position {
        color: #8F9BB3;
        height: 20px;
        line-height: 20px;
      }
    }
    .style-button1 {
      height: 39px;
      line-height: 39px;
      opacity: 1;
      border: 1px solid #e4e9f2;
      border-radius: 9px;
      margin-left: 12px;
      padding: 0 12px;
      .t1 {
        color: #8F9BB3;
        padding: 0 6px;
      }
      .t2 {
        color: #333;
        font-weight: 600;
      }
    }
  }
  .recommend {
    width: 100%;
    .share-box {
      height: 130px;
      border: 1px solid #e4e9f2;
      border-radius: 9px;
      padding: 12px;
      margin-bottom: 24px;
      .avatar {
        width: 40px;
        height: 40px;
        margin-right: 12px;
      }
      .info {
        .name {
          color: #333;
          height: 20px;
          line-height: 20px;
        }
        .time {
          color: #999;
          height: 20px;
          line-height: 20px;
        }
      }
      .desc {
        padding-left: 30px;
        .txt {
          height: 40px;
          line-height: 20px;
          text-align: justify;
          color: #333;
          overflow: hidden;
          margin-bottom: 8px;
          span {
            color: #FFA751;
            margin-right: 5px;
          }
        }
        .pic {
          height: 58px;
          overflow: hidden;
          ul {
            li {
              width: 58px;
              height: 58px;
            }
          }
        }
      }
    }
  }
  .topten {
    width: 100%;
    .topten-title {
      font-size: 16px;
      color: #202631;
      span.more {
        float: right;
        font-size: 14px;
        color: #8f9bb3;
      }
    }
    .topten-list {
      ul {
        padding-top: 25px;
        li {
          height: 38px;
          margin-bottom: 14px;
          zoom: 1;
          overflow: hidden;
          .b1 {
            width: 38px;
            height: 38px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 10px;
            font-size: 14px;
            font-weight: 700;
            color: #333;
          }
          .b2 {
            width: 38px;
            height: 38px;
            border-radius: 8px;
            overflow: hidden;
            margin-right: 11px;
          }
          .b3 {
            font-size: 14px;
            height: 38px;
            line-height: 38px;
            color: #333;
          }
          .b4 {
            height: 38px;
            line-height: 38px;
            font-size: 12px;
            color: #666;
          }
        }
      }
    }
  }
  .iconsize {
    width: 27px;
    height: 31px;
  }
  .notice {
    ul {
      li {
        height: 30px;
        line-height: 30px;
        color: #304156;
        overflow: hidden;
        span {
          border-radius: 3px;
          margin: 0 6px;
          padding: 2px 4px;
        }
        span.tag1 {
          color: #1890FF;
          border: 1px solid #1890FF;
          font-size: 10px;
        }
        span.tag2 {
          color: #FFA751;
          border: 1px solid #FFA751;
          font-size: 10px;
        }
      }
    }
  }
  .custom {
    .custom-list {
      display: flex;
      justify-content: center;
      .i-box1 {
        width: 88%;
        height: 0;
        padding-bottom:88%;
        background: #F1F9FE;
        border-radius: 50%;
        box-shadow: 0px 4px 12px 0px rgba(5,113,202,0.32);
        position: relative;
        .i-box2 {
          width: 80%;
          height: 0;
          padding-bottom:80%;
          background: #fff;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
          .packbox {
            width: 100%;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            position: absolute;
            text-align: center;
            .b1 {
              height: 35px;
              line-height: 35px;
              font-size: 26px;
              color: #2F80ED;
              font-weight: 500;
            }
            .b2 {
              height: 18px;
              height: 18px;
              color: #2F80ED;
            }
          }
        }
      }
      .i-box1:hover {
        background: #F1F9FE;
        cursor: pointer;
        .i-box2 {
          background: linear-gradient(216deg,#94cbff 17%, #2f80ed 87%);
          .packbox {
            .b1 {
              color: #fff;
            }
            .b2 {
              color: #fff;
            }
          }
        }
      }
    }
  }
  .order {
    .order-list {
      display: flex;
      justify-content: center;
      .i-box1 {
        width: 88%;
        height: 0;
        padding-bottom:88%;
        background: #F1F4FF;
        border-radius: 50%;
        box-shadow: 0px 4px 12px 0px rgba(100,135,248,0.32);
        position: relative;
        .i-box2 {
          width: 80%;
          height: 0;
          padding-bottom:80%;
          background: #fff;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
          .packbox {
            width: 100%;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            position: absolute;
            text-align: center;
            .b1 {
              height: 35px;
              line-height: 35px;
              font-size: 26px;
              color: #6487F8;
              font-weight: 500;
            }
            .b2 {
              height: 18px;
              height: 18px;
              color: #6487F8;
            }
          }
        }
      }
      .i-box1:hover {
        background: #F1F9FE;
        cursor: pointer;
        .i-box2 {
          background: linear-gradient(216deg,#a0a4f9 14%, #6487f8 87%);
          .packbox {
            .b1 {
              color: #fff;
            }
            .b2 {
              color: #fff;
            }
          }
        }
      }
    }
  }
  .work {
    ul {
      li {
        height: 30px;
        line-height: 30px;
        color: #304156;
        overflow: hidden;
      }
    }
  }
</style>