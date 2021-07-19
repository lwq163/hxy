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
							<span class="fontBold hxy-font-size-18">回访总数</span>
							<div>
								<span class="hxy-mr-15">时间</span>
								<Select v-model="inpBackAll" style="width:200px">
									<Option v-for="item in inpBackAllSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
								</Select>
							</div>
						</div>
						<div class='echartBox' id="backAllBox"></div>
					</Card>
				</Col>
				
				
				<Col :md="12" :lg="8" :xl="8" :xxl="8">
					<Card>
						<div class="isFlexSpace">
							<span class="fontBold hxy-font-size-18">客诉总数</span>
							<div>
								<span class="hxy-mr-15">时间</span>
								<Select v-model="inpTouSuAll" style="width:200px">
									<Option v-for="item in inpTouSuAllSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
								</Select>
							</div>
						</div>
						<div class='echartBox' id="tousuAllBox"></div>
					</Card>
				</Col>
				
				
				<Col :md="12" :lg="8" :xl="8" :xxl="8">
					<Card>
						<div class="isFlexSpace">
							<span class="fontBold hxy-font-size-18">回访排名</span>
							<div>
								<span class="hxy-mr-15">时间</span>
								<Select v-model="inpRankBack" style="width:200px">
									<Option v-for="item in inpRankBackSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
								</Select>
							</div>
						</div>
						<div class="echartBox" style="padding-top: 15px;">
							<div class="isFlexSpace hxy-mb-15" v-for="(item,index) in rankBackData" :key="index">
								<div><span>{{index+1}}</span><span class="hxy-ml-15">回访人：张三{{index+1}}</span></div>
								<div><span>回访量：{{index+1}}</span></div>
							</div>
						</div>
					</Card>
				</Col>
				
				
				<Col :md="12" :lg="8" :xl="8" :xxl="8" class="hxy-mt-30">
					<Card>
						<div class="isFlexSpace">
							<span class="fontBold hxy-font-size-18">客情维护</span>
							<div>
								<span class="hxy-mr-15">时间</span>
								<Select v-model="inpWeihu" style="width:200px">
									<Option v-for="item in inpWeihuSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
								</Select>
							</div>
						</div>
						<div class='echartBox' id="weihuBox"></div>
					</Card>
				</Col>
				
				
				
				<Col :md="12" :lg="8" :xl="8" :xxl="8" class="hxy-mt-30">
					<Card>
						<div class="isFlexSpace">
							<span class="fontBold hxy-font-size-18">回访类型分布</span>
							<div>
								<span class="hxy-mr-15">时间</span>
								<Select v-model="inpBackType" style="width:200px">
									<Option v-for="item in inpBackTypeSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
								</Select>
							</div>
						</div>
						<div class='echartBox' id="backTypeBox"></div>
					</Card>
				</Col>
				
				<Col :md="12" :lg="8" :xl="8" :xxl="8" class="hxy-mt-30">
					<Card>
						<div class="isFlexSpace">
							<span class="fontBold hxy-font-size-18">客诉排名</span>
							<div>
								<span class="hxy-mr-15">时间</span>
								<Select v-model="inpTousuRank" style="width:200px">
									<Option v-for="item in inpTousuRankSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
								</Select>
							</div>
						</div>
						<div class="echartBox" style="padding-top: 15px;">
							<div class="isFlexSpace hxy-mb-15" v-for="(item,index) in rankTousuData" :key="index">
								<div><span>{{index+1}}</span><span class="hxy-ml-15">处理人：张三{{index+1}}</span></div>
								<div><span>客诉量: {{100+index}}</span></div>
							</div>
						</div>
					</Card>
				</Col>
				
				<Col :md="12" :lg="8" :xl="8" :xxl="8" class="hxy-mt-30">
					<Card>
						<div class="isFlexSpace">
							<span class="fontBold hxy-font-size-18">客服类型分布</span>
							<div>
								<span class="hxy-mr-15">时间</span>
								<Select v-model="chatType" style="width:200px">
									<Option v-for="item in chatTypeSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
								</Select>
							</div>
						</div>
						<div class='echartBox' id="chatTypeBox"></div>
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


			//回放总数
			inpBackAll : '',
			inpBackAllSel : [{value: 'New York',label: 'New York'},{value: 'London',label: 'London'}],
			
			
			//客诉总数
			inpTouSuAll : "",
			inpTouSuAllSel   : [{value: 'New York',label: 'New York'},{value: 'London',label: 'London'}],
			
			
			//回放排名
			inpRankBack : "",
			inpRankBackSel : [{value: 'New York',label: 'New York'},{value: 'London',label: 'London'}],
			rankBackData   : [1,2,3,4,5,6,7],
			
			
			
			//客情维护
			inpWeihu : "",
			inpWeihuSel : [{value: 'New York',label: 'New York'},{value: 'London',label: 'London'}],
			
			
			//回访类型分布
			inpBackType : "",
			inpBackTypeSel : [{value: 'New York',label: 'New York'},{value: 'London',label: 'London'}],
			
			
			//客诉排名
			inpTousuRank : "",
			inpTousuRankSel :  [{value: 'New York',label: 'New York'},{value: 'London',label: 'London'}],
			rankTousuData : [1,2,3,4,5,6,7],
			
			//客服类型分布
			chatType : "",
			chatTypeSel:[{value: 'New York',label: 'New York'},{value: 'London',label: 'London'}],
        }
    },
	components: {tabMenu},
    mounted(){
		this.initBackAll();
		this.initTousuAll();
		this.initWeihu();
		this.initBackType();
		this.initChatType();
		// 监听窗口变化，重置echart视图自适应
		window.onresize = () => {
			echarts.init(document.getElementById('backAllBox')).resize();
			echarts.init(document.getElementById('tousuAllBox')).resize();
			echarts.init(document.getElementById('weihuBox')).resize();
			echarts.init(document.getElementById('backTypeBox')).resize();
			echarts.init(document.getElementById('chatTypeBox')).resize();
		}
    },
    methods: {
		initBackAll(){
			let myChart = echarts.init(document.getElementById('backAllBox'))
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
		
		initTousuAll(){
			let myChart = echarts.init(document.getElementById('tousuAllBox'))
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
		
		initWeihu(){
			let myChart = echarts.init(document.getElementById('weihuBox'))
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
		
		
		initBackType(){
			let myChart = echarts.init(document.getElementById('backTypeBox'))
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
							{value: 5,name: 'Tom'},
							{value: 35, name: 'Jack'},
							{value: 10, name: 'Bbh'},
							{value: 30, name: 'LiTom'},
							{value: 20, name: 'May'}
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
		
		initChatType(){
			let myChart = echarts.init(document.getElementById('chatTypeBox'))
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
							{value: 5,name: 'Tom'},
							{value: 35, name: 'Jack'},
							{value: 10, name: 'Bbh'},
							{value: 30, name: 'LiTom'},
							{value: 20, name: 'May'}
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
		
    }
}
</script>
<style lang="scss" scoped>
	.echartBox{
		width: 100%;
		height: 250px;
	}
</style>