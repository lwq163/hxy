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
							<span class="fontBold hxy-font-size-18">未签约合同</span>
							<div>
								<span class="hxy-mr-15">时间</span>
								<Select v-model="inpNo" style="width:200px">
									<Option v-for="item in inpNoSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
								</Select>
							</div>
						</div>
						<div class='echartBox' id="noUserBox"></div>
					</Card>
				</Col>
				
				
				<Col :md="12" :lg="8" :xl="8" :xxl="8">
					<Card>
						<div class="isFlexSpace">
							<span class="fontBold hxy-font-size-18">已签约合同</span>
							<div>
								<span class="hxy-mr-15">时间</span>
								<Select v-model="inpOk" style="width:200px">
									<Option v-for="item in inpOkSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
								</Select>
							</div>
						</div>
						<div class='echartBox' id="okUserBox"></div>
					</Card>
				</Col>
				
				
				<Col :md="12" :lg="8" :xl="8" :xxl="8">
					<Card>
						<div class="isFlexSpace">
							<span class="fontBold hxy-font-size-18">签约顾客排名</span>
							<div>
								<span class="hxy-mr-15">时间</span>
								<Select v-model="inpRankSuccess" style="width:200px">
									<Option v-for="item in inpRankSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
								</Select>
							</div>
						</div>
						<div class="echartBox" style="padding-top: 15px;">
							<div class="isFlexSpace hxy-mb-15" v-for="(item,index) in rankData" :key="index">
								<div><span>{{index+1}}</span><span class="hxy-ml-15">知识产权顾问</span></div>
								<div>合同量：100</div>
							</div>
						</div>
					</Card>
				</Col>
				
				
				<Col :md="12" :lg="8" :xl="8" :xxl="8" class="hxy-mt-30">
					<Card>
						<div class="isFlexSpace">
							<span class="fontBold hxy-font-size-18">作废合同</span>
							<div>
								<span class="hxy-mr-15">时间</span>
								<Select v-model="inpDel" style="width:200px">
									<Option v-for="item in inpDelSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
								</Select>
							</div>
						</div>
						<div class='echartBox' id="delUserBox"></div>
					</Card>
				</Col>
				
				<Col :md="12" :lg="8" :xl="8" :xxl="8" class="hxy-mt-30">
					<Card>
						<div class="isFlexSpace">
							<span class="fontBold hxy-font-size-18">合同状态分布</span>
							<div>
								<span class="hxy-mr-15">时间</span>
								<Select v-model="inpState" style="width:200px">
									<Option v-for="item in inpStateSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
								</Select>
							</div>
						</div>
						<div class='echartBox' id="stateBox"></div>
					</Card>
				</Col>
				
				<Col :md="12" :lg="8" :xl="8" :xxl="8" class="hxy-mt-30">
					<Card>
						<div class="isFlexSpace">
							<span class="fontBold hxy-font-size-18">签约客户排名</span>
							<div>
								<span class="hxy-mr-15">时间</span>
								<Select v-model="inpTrade" style="width:200px">
									<Option v-for="item in inpTradeSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
								</Select>
							</div>
						</div>
						<div class="echartBox" style="padding-top: 15px;">
							<div class="isFlexSpace hxy-mb-15" v-for="(item,index) in tradeData" :key="index">
								<div><span>{{index+1}}</span><span class="hxy-ml-15">客户名称</span></div>
								<div><span>合同量: {{100+index}}</span></div>
							</div>
						</div>
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


			//未签约合同
			inpNo : '',
			inpNoSel : [{value: 'New York',label: 'New York'},{value: 'London',label: 'London'}],
			
			
			//已签约合同
			inpOk : "",
			inpOkSel   : [{value: 'New York',label: 'New York'},{value: 'London',label: 'London'}],
			
			
			//签约顾客排名
			inpRankSuccess : "",
			inpRankSel : [{value: 'New York',label: 'New York'},{value: 'London',label: 'London'}],
			rankData   : [1,2,3,4,5,6,7],
			
			//作废合同
			inpDel : "",
			inpDelSel : [{value: 'New York',label: 'New York'},{value: 'London',label: 'London'}],
			
			
			//合同分布状态
			inpState : "",
			inpStateSel : [{value: 'New York',label: 'New York'},{value: 'London',label: 'London'}],
			
			//签约客户排名
			inpTrade : "",
			inpTradeSel :  [{value: 'New York',label: 'New York'},{value: 'London',label: 'London'}],
			tradeData : [1,2,3,4,5,6,7],
			
        }
    },
	components: {tabMenu},
    mounted(){
		this.initNoEchart();
		this.initOkEchart();
		this.initDelEchart();
		this.initStaEchart();
		
		// 监听窗口变化，重置echart视图自适应
		window.onresize = () => {
			echarts.init(document.getElementById('okUserBox')).resize();
			echarts.init(document.getElementById('noUserBox')).resize();
			echarts.init(document.getElementById('stateBox')).resize();
			echarts.init(document.getElementById('delUserBox')).resize();
		}
    },
    methods: {
		initNoEchart(){
			let myChart = echarts.init(document.getElementById('noUserBox'))
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
		
		initOkEchart(){
			let myChart = echarts.init(document.getElementById('okUserBox'))
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
		
		initDelEchart(){
			let myChart = echarts.init(document.getElementById('delUserBox'))
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

		initStaEchart(){
			let myChart = echarts.init(document.getElementById('stateBox'))
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
</script>
<style lang="scss" scoped>
	.echartBox{
		width: 100%;
		height: 250px;
	}
</style>