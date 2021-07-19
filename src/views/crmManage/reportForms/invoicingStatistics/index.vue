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
							<span class="fontBold hxy-font-size-18">已开票总额</span>
							<div>
								<span class="hxy-mr-15">时间</span>
								<Select v-model="ticketAll" style="width:200px">
									<Option v-for="item in ticketAllSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
								</Select>
							</div>
						</div>
						<div class='echartBox' id="ticketAllBox"></div>
					</Card>
				</Col>
				
				
				<Col :md="12" :lg="8" :xl="8" :xxl="8">
					<Card>
						<div class="isFlexSpace">
							<span class="fontBold hxy-font-size-18">未开票总额</span>
							<div>
								<span class="hxy-mr-15">时间</span>
								<Select v-model="noTicketAll" style="width:200px">
									<Option v-for="item in noTicketAllSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
								</Select>
							</div>
						</div>
						<div class='echartBox' id="noTicketAllBox"></div>
					</Card>
				</Col>
				
				
				<Col :md="12" :lg="8" :xl="8" :xxl="8">
					<Card>
						<div class="isFlexSpace">
							<span class="fontBold hxy-font-size-18">开票排名</span>
							<div>
								<span class="hxy-mr-15">时间</span>
								<Select v-model="ticketRank" style="width:200px">
									<Option v-for="item in ticketRankSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
								</Select>
							</div>
						</div>
						<div class="echartBox" style="padding-top: 15px;">
							<div class="isFlexSpace hxy-mb-15" v-for="(item,index) in ticketRankData" :key="index">
								<div><span>{{index+1}}</span><span class="hxy-ml-15">所属人：张三00{{index}}</span></div>
								<div>开票额：100万</div>
							</div>
						</div>
					</Card>
				</Col>
				
				
				<Col :md="12" :lg="8" :xl="8" :xxl="8" class="hxy-mt-30">
					<Card>
						<div class="isFlexSpace">
							<span class="fontBold hxy-font-size-18">开票占比</span>
							<div>
								<span class="hxy-mr-15">时间</span>
								<Select v-model="ticZb" style="width:200px">
									<Option v-for="item in ticZbSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
								</Select>
							</div>
						</div>
						<div class='echartBox' id="ticZbBox"></div>
					</Card>
				</Col>
				
				<Col :md="12" :lg="8" :xl="8" :xxl="8" class="hxy-mt-30">
					<Card>
						<div class="isFlexSpace">
							<span class="fontBold hxy-font-size-18">审批状态占比</span>
							<div>
								<span class="hxy-mr-15">时间</span>
								<Select v-model="ticStateZb" style="width:200px">
									<Option v-for="item in ticStateZbSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
								</Select>
							</div>
						</div>
						<div class='echartBox' id="stateBox"></div>
					</Card>
				</Col>
				
				<Col :md="12" :lg="8" :xl="8" :xxl="8" class="hxy-mt-30">
					<Card>
						<div class="isFlexSpace">
							<span class="fontBold hxy-font-size-18">未开票排名</span>
							<div>
								<span class="hxy-mr-15">时间</span>
								<Select v-model="noTicRank" style="width:200px">
									<Option v-for="item in noTicRankSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
								</Select>
							</div>
						</div>
						<div class="echartBox" style="padding-top: 15px;">
							<div class="isFlexSpace hxy-mb-15" v-for="(item,index) in noTicRankData" :key="index">
								<div><span>{{index+1}}</span><span class="hxy-ml-15">所属人:李四{{index}}</span></div>
								<div><span>未开票额: {{100+index}}</span></div>
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


			//已开票总额
			ticketAll : '',
			ticketAllSel : [{value: 'New York',label: 'New York'},{value: 'London',label: 'London'}],
			
			
			//未开票总额
			noTicketAll : "",
			noTicketAllSel   : [{value: 'New York',label: 'New York'},{value: 'London',label: 'London'}],
			
			
			//开票排名
			ticketRank : "",
			ticketRankSel : [{value: 'New York',label: 'New York'},{value: 'London',label: 'London'}],
			ticketRankData : [1,2,3,4,5,6,7],
			
			//开票占比
			ticZb : "",
			ticZbSel : [{value: 'New York',label: 'New York'},{value: 'London',label: 'London'}],
			
			
			//审批状态占比
			ticStateZb : "",
			ticStateZbSel : [{value: 'New York',label: 'New York'},{value: 'London',label: 'London'}],
			
			//未开票排名
			noTicRank : "",
			noTicRankSel :  [{value: 'New York',label: 'New York'},{value: 'London',label: 'London'}],
			noTicRankData : [1,2,3,4,5,6,7],
			
        }
    },
	components: {tabMenu},
    mounted(){
		this.initTicAll();
		this.initNoTicketAll();
		this.initTicZb();
		this.initStaEchart();
		
		// 监听窗口变化，重置echart视图自适应
		window.onresize = () => {
			echarts.init(document.getElementById('ticketAllBox')).resize();
			echarts.init(document.getElementById('noTicketAllBox')).resize();
			echarts.init(document.getElementById('ticZbBox')).resize();
			echarts.init(document.getElementById('stateBox')).resize();
		}
    },
    methods: {
		//已开票总额
		initTicAll(){
			let myChart = echarts.init(document.getElementById('ticketAllBox'))
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
						data: [50, 88, 170, 80, 30, 60,90],
						type: 'bar'
					},
					{
						data: [120, 200, 150, 80, 70, 110, 130],
						type: 'bar',
					}
				]
			});
		},
		
		
		//未回款额
		initNoTicketAll(){
			let myChart = echarts.init(document.getElementById('noTicketAllBox'))
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
		initTicZb(){
			let myChart = echarts.init(document.getElementById('ticZbBox'))
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