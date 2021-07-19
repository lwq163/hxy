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
							<span class="fontBold hxy-font-size-18">回款总额</span>
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
							<span class="fontBold hxy-font-size-18">未回款额</span>
							<div>
								<span class="hxy-mr-15">时间</span>
								<Select v-model="inpNoBack" style="width:200px">
									<Option v-for="item in inpNoBackSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
								</Select>
							</div>
						</div>
						<div class='echartBox' id="noBackBox"></div>
					</Card>
				</Col>
				
				
				<Col :md="12" :lg="8" :xl="8" :xxl="8">
					<Card>
						<div class="isFlexSpace">
							<span class="fontBold hxy-font-size-18">回款排名</span>
							<div>
								<span class="hxy-mr-15">时间</span>
								<Select v-model="backRank" style="width:200px">
									<Option v-for="item in backRankSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
								</Select>
							</div>
						</div>
						<div class="echartBox" style="padding-top: 15px;">
							<div class="isFlexSpace hxy-mb-15" v-for="(item,index) in backRankData" :key="index">
								<div><span>{{index+1}}</span><span class="hxy-ml-15">所属人：张三00{{index}}</span></div>
								<div>回款额：100万</div>
							</div>
						</div>
					</Card>
				</Col>
				
				
				<Col :md="12" :lg="8" :xl="8" :xxl="8" class="hxy-mt-30">
					<Card>
						<div class="isFlexSpace">
							<span class="fontBold hxy-font-size-18">回款额占比</span>
							<div>
								<span class="hxy-mr-15">时间</span>
								<Select v-model="inpBackZb" style="width:200px">
									<Option v-for="item in inpBackZbSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
								</Select>
							</div>
						</div>
						<div class='echartBox' id="backZbBox"></div>
					</Card>
				</Col>
				
				<Col :md="12" :lg="8" :xl="8" :xxl="8" class="hxy-mt-30">
					<Card>
						<div class="isFlexSpace">
							<span class="fontBold hxy-font-size-18">审批状态占比</span>
							<div>
								<span class="hxy-mr-15">时间</span>
								<Select v-model="inpStateZb" style="width:200px">
									<Option v-for="item in inpStateZbSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
								</Select>
							</div>
						</div>
						<div class='echartBox' id="stateBox"></div>
					</Card>
				</Col>
				
				<Col :md="12" :lg="8" :xl="8" :xxl="8" class="hxy-mt-30">
					<Card>
						<div class="isFlexSpace">
							<span class="fontBold hxy-font-size-18">未回款排名</span>
							<div>
								<span class="hxy-mr-15">时间</span>
								<Select v-model="noBackRank" style="width:200px">
									<Option v-for="item in noBackRankSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
								</Select>
							</div>
						</div>
						<div class="echartBox" style="padding-top: 15px;">
							<div class="isFlexSpace hxy-mb-15" v-for="(item,index) in noBackRankData" :key="index">
								<div><span>{{index+1}}</span><span class="hxy-ml-15">所属人:李四{{index}}</span></div>
								<div><span>未回款额: {{100+index}}</span></div>
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


			//回款总额
			inpBackAll : '',
			inpBackAllSel : [{value: 'New York',label: 'New York'},{value: 'London',label: 'London'}],
			
			
			//未回款额
			inpNoBack : "",
			inpNoBackSel   : [{value: 'New York',label: 'New York'},{value: 'London',label: 'London'}],
			
			
			//回款排名
			backRank : "",
			backRankSel : [{value: 'New York',label: 'New York'},{value: 'London',label: 'London'}],
			backRankData   : [1,2,3,4,5,6,7],
			
			//回款额占比
			inpBackZb : "",
			inpBackZbSel : [{value: 'New York',label: 'New York'},{value: 'London',label: 'London'}],
			
			
			//审批状态占比
			inpStateZb : "",
			inpStateZbSel : [{value: 'New York',label: 'New York'},{value: 'London',label: 'London'}],
			
			//未回款排名
			noBackRank : "",
			noBackRankSel :  [{value: 'New York',label: 'New York'},{value: 'London',label: 'London'}],
			noBackRankData : [1,2,3,4,5,6,7],
			
        }
    },
	components: {tabMenu},
    mounted(){
		this.initBackAll();
		this.initNoBack();
		this.initBackZb();
		this.initStaEchart();
		
		// 监听窗口变化，重置echart视图自适应
		window.onresize = () => {
			echarts.init(document.getElementById('backAllBox')).resize();
			echarts.init(document.getElementById('noBackBox')).resize();
			echarts.init(document.getElementById('backZbBox')).resize();
			echarts.init(document.getElementById('stateBox')).resize();
		}
    },
    methods: {
		//回款总额
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
		
		
		//未回款额
		initNoBack(){
			let myChart = echarts.init(document.getElementById('noBackBox'))
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
		
		//回款额占比
		initBackZb(){
			let myChart = echarts.init(document.getElementById('backZbBox'))
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
		
		
		//审批状态占比
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