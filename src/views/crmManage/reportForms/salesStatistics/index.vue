<template>
	<div class="customer">
		<tab-menu></tab-menu>
		<div class="search">
			<Form ref="formInline">
				<Row>
					<Col>
						<FormItem label="开始时间" prop="date" class="isFlexalitem hxy-mr-30">
							<DatePicker type="date" placeholder="请选择"></DatePicker>
						</FormItem>
					</Col>
					<Col>
						<FormItem label="结束时间" prop="date"  class="isFlexalitem hxy-mr-30">
							<DatePicker type="date" placeholder="请选择"></DatePicker>
						</FormItem>
					</Col>
					<Col>
						<FormItem label="所属人" prop="inpBranch" class="isFlexalitem hxy-mr-30">
							<Input type="text" v-model="inpBranch" placeholder="请输入所属人"></Input>
						</FormItem>
					</Col>
					<Col >
						<FormItem label="部门" prop="inpBranch"  class="isFlexalitem hxy-mr-30">
							<Input type="text" v-model="inpBranch" placeholder="请输入部门"></Input>
						</FormItem>
					</Col>
					
					<Col span="24" class="tr">
					    <Button type="primary" @click="handleSearch('searchForm')" icon="ios-search" class="hxy-mr-10">搜索</Button>
						<Button type="default" @click="handleReset('searchForm')" icon="ios-refresh">清空</Button>
					</Col>
				</Row>
			</Form>
		</div>
		<div class="hxy-mb-20"><Button type="success">导出本页面数据</Button></div>
		<div>
			<Row :gutter="32">
				<Col :md="12" :lg="8" :xl="8" :xxl="8">
					<Card>
						<div class="isFlexSpace">
							<span class="fontBold hxy-font-size-18">新增销售额</span>
							<div>
								<span class="hxy-mr-15">时间</span>
								<Select v-model="inpAddBuy" style="width:200px">
									<Option v-for="item in inpAddBuySel" :value="item.value" :key="item.value">{{ item.label }}</Option>
								</Select>
							</div>
						</div>
						<div class='echartBox' id="addBuyBox"></div>
					</Card>
				</Col>
				
				
				<Col :md="12" :lg="8" :xl="8" :xxl="8">
					<Card>
						<div class="isFlexSpace">
							<span class="fontBold hxy-font-size-18">退款额</span>
							<div>
								<span class="hxy-mr-15">时间</span>
								<Select v-model="inpRefund" style="width:200px">
									<Option v-for="item in inpRefundSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
								</Select>
							</div>
						</div>
						<div class='echartBox' id="refundBox"></div>
					</Card>
				</Col>
				
				
				<Col :md="12" :lg="8" :xl="8" :xxl="8">
					<Card>
						<div class="isFlexSpace">
							<span class="fontBold hxy-font-size-18">销售排名</span>
							<div>
								<span class="hxy-mr-15">时间</span>
								<Select v-model="inpRankBuy" style="width:200px">
									<Option v-for="item in inpRankBuySel" :value="item.value" :key="item.value">{{ item.label }}</Option>
								</Select>
							</div>
						</div>
						<div class="echartBox" style="padding-top: 15px;">
							<div class="isFlexSpace hxy-mb-15" v-for="(item,index) in rankDataBuy" :key="index">
								<div><span>{{index+1}}</span><span class="hxy-ml-15">销售人</span></div>
								<div>销售额：100</div>
							</div>
						</div>
					</Card>
				</Col>
				
				
				<Col :md="12" :lg="8" :xl="8" :xxl="8" class="hxy-mt-30">
					<Card>
						<div class="isFlexSpace">
							<span class="fontBold hxy-font-size-18">总销售额</span>
							<div>
								<span class="hxy-mr-15">时间</span>
								<Select v-model="inpAllBuy" style="width:200px">
									<Option v-for="item in inpAllBuySel" :value="item.value" :key="item.value">{{ item.label }}</Option>
								</Select>
							</div>
						</div>
						<div class='echartBox' id="allBuyBox"></div>
					</Card>
				</Col>
				
				
				<Col :md="12" :lg="8" :xl="8" :xxl="8" class="hxy-mt-30">
					<Card>
						<div class="isFlexSpace">
							<span class="fontBold hxy-font-size-18">总退款额</span>
							<div>
								<span class="hxy-mr-15">时间</span>
								<Select v-model="inpAllRefund" style="width:200px">
									<Option v-for="item in inpAllRefundSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
								</Select>
							</div>
						</div>
						<div class='echartBox' id="allRefundBox"></div>
					</Card>
				</Col>
				
				
				<Col :md="12" :lg="8" :xl="8" :xxl="8" class="hxy-mt-30">
					<Card>
						<div class="isFlexSpace">
							<span class="fontBold hxy-font-size-18">部门排名</span>
							<div>
								<span class="hxy-mr-15">时间</span>
								<Select v-model="inpTeam" style="width:200px">
									<Option v-for="item in inpTeamSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
								</Select>
							</div>
						</div>
						<div class="echartBox" style="padding-top: 15px;">
							<div class="isFlexSpace hxy-mb-15" v-for="(item,index) in teamRank" :key="index">
								<div><span>{{index+1}}</span><span class="hxy-ml-15">部门：A部</span></div>
								<div><span>销售额: {{100+index}}</span></div>
							</div>
						</div>
					</Card>
				</Col>
				
				
				
				
				
				
				<Col :md="12" :lg="8" :xl="8" :xxl="8" class="hxy-mt-30">
					<Card>
						<div class="isFlexSpace">
							<span class="fontBold hxy-font-size-18">跟进方式占比</span>
							<div>
								<span class="hxy-mr-15">时间</span>
								<Select v-model="inpFlow" style="width:200px">
									<Option v-for="item in inpFlowSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
								</Select>
							</div>
						</div>
						<div class='echartBox' id="flowBox"></div>
					</Card>
				</Col>
				
				<Col :md="12" :lg="8" :xl="8" :xxl="8" class="hxy-mt-30">
					<Card>
						<div class="isFlexSpace">
							<span class="fontBold hxy-font-size-18">报价方式占比</span>
							<div>
								<span class="hxy-mr-15">时间</span>
								<Select v-model="inpTalkType" style="width:200px">
									<Option v-for="item in inpTalkTypeSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
								</Select>
							</div>
						</div>
						<div class='echartBox' id="talkTypeBox"></div>
					</Card>
				</Col>
				
				
			</Row>
		</div>
	</div>
</template>
<script>
import tabMenu from '_c/tab-menu';
import * as echarts from 'echarts';
export default {
    data(){
        return{
			//头部参数
			inpPreson : "",  //所属人
			inpBranch : "",	 //部门	


			//新增销售额
			inpAddBuy : '',
			inpAddBuySel : [{value: 'New York',label: 'New York'},{value: 'London',label: 'London'}],
			
			
			//退款额
			inpRefund : "",
			inpRefundSel   : [{value: 'New York',label: 'New York'},{value: 'London',label: 'London'}],
			
			
			//销售排名
			inpRankBuy : "",
			inpRankBuySel : [{value: 'New York',label: 'New York'},{value: 'London',label: 'London'}],
			rankDataBuy   : [1,2,3,4,5,6,7],
			
			//总销售额
			inpAllBuy : "",
			inpAllBuySel : [{value: 'New York',label: 'New York'},{value: 'London',label: 'London'}],
			
			
			//总退款额
			inpAllRefund : "",
			inpAllRefundSel : [{value: 'New York',label: 'New York'},{value: 'London',label: 'London'}],
			
			
			//部门排名
			inpTeam : "",
			inpTeamSel :  [{value: 'New York',label: 'New York'},{value: 'London',label: 'London'}],
			teamRank : [1,2,3,4,5,6,7],
			
			//跟进方式占比
			inpFlow : "",
			inpFlowSel : [{value: 'New York',label: 'New York'},{value: 'London',label: 'London'}],
			
			//报价方式占比
			inpTalkType : "",
			inpTalkTypeSel : [{value: 'New York',label: 'New York'},{value: 'London',label: 'London'}],
			
        }
    },
	components: {tabMenu},
    mounted(){
		this.initAdd();
		this.initRefund();
		this.initAllBuy();
		this.initAllRefund();
		this.initFlow();
		this.initTalkType();
		// 监听窗口变化，重置echart视图自适应
		window.onresize = () => {
			echarts.init(document.getElementById('addBuyBox')).resize();
			echarts.init(document.getElementById('refundBox')).resize();
			echarts.init(document.getElementById('allBuyBox')).resize();
			echarts.init(document.getElementById('allRefundBox')).resize();
			echarts.init(document.getElementById('flowBox')).resize();
			echarts.init(document.getElementById('talkTypeBox')).resize();
		}
    },
    methods: {
		initAdd(){
			let myChart = echarts.init(document.getElementById('addBuyBox'))
			myChart.setOption({
				legend: {
					top: 'bottom'
				},
				tooltip: {
					trigger: 'axis',
				},
				xAxis: {
					type: 'category',
					data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
				},
				yAxis: {
					type: 'value',
					splitLine: {
						lineStyle: {
							type : "dashed"
						}
					}
				},
				grid:{
					top : 30
				},
				series: [
					{
						name : "这周",
						data: [100, 60, 70, 50, 85, 120, 90],
						type: 'line',
						smooth: true
					},
					{
						name : "上周",
						data: [60, 40, 50, 30, 65, 100, 70],
						type: 'line',
						smooth: true
					},
				]
			});
		},
		
		initRefund(){
			let myChart = echarts.init(document.getElementById('refundBox'))
			myChart.setOption({
				legend: {
					top: 'bottom'
				},
				tooltip: {
					trigger: 'axis',
				},
				xAxis: {
					type: 'category',
					data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
				},
				yAxis: {
					type: 'value',
					splitLine: {
						lineStyle: {
							type : "dashed"
						}
					}
				},
				grid:{
					top : 30
				},
				series: [
					{
						name : "这周",
						data: [100, 60, 70, 50, 85, 120, 90],
						type: 'line',
						smooth: true
					},
					{
						name : "上周",
						data: [60, 40, 50, 30, 65, 100, 70],
						type: 'line',
						smooth: true
					},
				]
			});
		},
		
		initAllBuy(){
			let myChart = echarts.init(document.getElementById('allBuyBox'))
			myChart.setOption({
				legend: {
					top: 'bottom'
				},
				tooltip: {
					trigger: 'axis',
				},
				xAxis: {
					type: 'category',
					data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
				},
				yAxis: {
					type: 'value',
					splitLine: {
						lineStyle: {
							type : "dashed"
						}
					}
				},
				grid:{
					top : 30
				},
				series: [
					{
						name : "这周",
						data: [100, 60, 70, 50, 85, 120, 90],
						type: 'line',
						smooth: true
					},
					{
						name : "上周",
						data: [60, 40, 50, 30, 65, 100, 70],
						type: 'line',
						smooth: true
					},
				]
			});
		},

		initAllRefund(){
			let myChart = echarts.init(document.getElementById('allRefundBox'))
			myChart.setOption({
				legend: {
					top: 'bottom'
				},
				tooltip: {
					trigger: 'axis',
				},
				xAxis: {
					type: 'category',
					data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
				},
				yAxis: {
					type: 'value',
					splitLine: {
						lineStyle: {
							type : "dashed"
						}
					}
				},
				grid:{
					top : 30
				},
				series: [
					{
						name : "这周",
						data: [100, 60, 70, 50, 85, 120, 90],
						type: 'line',
						smooth: true
					},
					{
						name : "上周",
						data: [60, 40, 50, 30, 65, 100, 70],
						type: 'line',
						smooth: true
					},
				]
			});
		},
		
		initFlow(){
			let myChart = echarts.init(document.getElementById('flowBox'))
			myChart.setOption({
				tooltip: {
					trigger: 'item',
					formatter: '{a} <br/>{b} : {c} ({d}%)'
				},
				legend: {
					bottom: 0,
					left: 'center'
				},
				series: [
					{
						type: 'pie',
						radius: '52%',
						center: ['50%', '50%'],
						selectedMode: 'single',
						data: [
							{value: 5,name: '幽州:5%'},
							{value: 35, name: '荆州:35%'},
							{value: 10, name: '兖州:10%'},
							{value: 30, name: '益州:30%'},
							{value: 20, name: '西凉:20%'}
						],
						emphasis: {
							itemStyle: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						}
					}
				]
			});
		},
		
		initTalkType(){
			let myChart = echarts.init(document.getElementById('talkTypeBox'))
			myChart.setOption({
				tooltip: {
					trigger: 'item',
					formatter: '{a} <br/>{b} : {c} ({d}%)'
				},
				legend: {
					bottom: 0,
					left: 'center'
				},
				series: [
					{
						type: 'pie',
						radius: '52%',
						center: ['50%', '50%'],
						selectedMode: 'single',
						data: [
							{value: 5,name: '幽州:5%'},
							{value: 35, name: '荆州:35%'},
							{value: 10, name: '兖州:10%'},
							{value: 30, name: '益州:30%'},
							{value: 20, name: '西凉:20%'}
						],
						emphasis: {
							itemStyle: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						}
					}
				]
			});
		}
    }
}

//图标自适应
window.onresize = () => {
   // echarts.init(document.getElementById('addUserBox')).resize();
   // echarts.init(document.getElementById('purpose')).resize();
   // echarts.init(document.getElementById('succUser')).resize();
   // echarts.init(document.getElementById('loseUser')).resize();
   // echarts.init(document.getElementById('poraryUser')).resize();
   // echarts.init(document.getElementById('follow')).resize();
   // echarts.init(document.getElementById('typeUSer')).resize();
}
</script>
<style lang="scss" scoped>
	.echartBox{
		width: 100%;
		height: 250px;
	}
</style>