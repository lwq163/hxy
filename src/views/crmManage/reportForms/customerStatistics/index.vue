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
							<span class="fontBold hxy-font-size-18">新增客户</span>
							<div>
								<span class="hxy-mr-15">时间</span>
								<Select v-model="inpAdd" style="width:200px">
									<Option v-for="item in inpAaSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
								</Select>
							</div>
						</div>
						<div class='echartBox' id="addUserBox"></div>
					</Card>
				</Col>
				
				
				<Col :md="12" :lg="8" :xl="8" :xxl="8">
					<Card>
						<div class="isFlexSpace">
							<span class="fontBold hxy-font-size-18">意向客户</span>
							<div>
								<span class="hxy-mr-15">时间</span>
								<Select v-model="inpPurpose" style="width:200px">
									<Option v-for="item in inpPpSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
								</Select>
							</div>
						</div>
						<div class='echartBox' id="purpose"></div>
					</Card>
				</Col>
				
				
				<Col :md="12" :lg="8" :xl="8" :xxl="8">
					<Card>
						<div class="isFlexSpace">
							<span class="fontBold hxy-font-size-18">成交客户排名</span>
							<div>
								<span class="hxy-mr-15">时间</span>
								<Select v-model="inpRankSuccess" style="width:200px">
									<Option v-for="item in inpRankSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
								</Select>
							</div>
						</div>
						<div class="echartBox" style="padding-top: 15px;">
							<div class="isFlexSpace hxy-mb-15" v-for="(item,index) in rankData" :key="index">
								<div><span>{{index+1}}</span><span class="hxy-ml-15">客户名称</span></div>
								<div><span>所属人：测试00{{index+1}}</span><span class="hxy-ml-30">成交量：100</span></div>
							</div>
						</div>
					</Card>
				</Col>
				
				
				<Col :md="12" :lg="8" :xl="8" :xxl="8" class="hxy-mt-30">
					<Card>
						<div class="isFlexSpace">
							<span class="fontBold hxy-font-size-18">成交客户</span>
							<div>
								<span class="hxy-mr-15">时间</span>
								<Select v-model="inpSucc" style="width:200px">
									<Option v-for="item in inpSuccSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
								</Select>
							</div>
						</div>
						<div class='echartBox' id="succUser"></div>
					</Card>
				</Col>
				
				<Col :md="12" :lg="8" :xl="8" :xxl="8" class="hxy-mt-30">
					<Card>
						<div class="isFlexSpace">
							<span class="fontBold hxy-font-size-18">战败客户</span>
							<div>
								<span class="hxy-mr-15">时间</span>
								<Select v-model="inpLose" style="width:200px">
									<Option v-for="item in inpLoseSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
								</Select>
							</div>
						</div>
						<div class='echartBox' id="loseUser"></div>
					</Card>
				</Col>
				
				<Col :md="12" :lg="8" :xl="8" :xxl="8" class="hxy-mt-30">
					<Card>
						<div class="isFlexSpace">
							<span class="fontBold hxy-font-size-18">客户行业排名</span>
							<div>
								<span class="hxy-mr-15">时间</span>
								<Select v-model="inpTrade" style="width:200px">
									<Option v-for="item in inpTradeSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
								</Select>
							</div>
						</div>
						<div class="echartBox" style="padding-top: 15px;">
							<div class="isFlexSpace hxy-mb-15" v-for="(item,index) in tradeData" :key="index">
								<div><span>{{index+1}}</span><span class="hxy-ml-15">行业名称</span></div>
								<div><span>客户量: {{100+index}}</span></div>
							</div>
						</div>
					</Card>
				</Col>
				
				<Col :md="12" :lg="8" :xl="8" :xxl="8" class="hxy-mt-30">
					<Card>
						<div class="isFlexSpace">
							<span class="fontBold hxy-font-size-18">暂时搁置客户</span>
							<div>
								<span class="hxy-mr-15">时间</span>
								<Select v-model="inpPorary" style="width:200px">
									<Option v-for="item in inpPorarySel" :value="item.value" :key="item.value">{{ item.label }}</Option>
								</Select>
							</div>
						</div>
						<div class='echartBox' id="poraryUser"></div>
					</Card>
				</Col>
				
				
				<Col :md="12" :lg="8" :xl="8" :xxl="8" class="hxy-mt-30">
					<Card>
						<div class="isFlexSpace">
							<span class="fontBold hxy-font-size-18">跟进阶段分布</span>
							<div>
								<span class="hxy-mr-15">时间</span>
								<Select v-model="inpFollow" style="width:200px">
									<Option v-for="item in inpFollowSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
								</Select>
							</div>
						</div>
						<div class='echartBox' id="follow"></div>
					</Card>
				</Col>
				
				
				<Col :md="12" :lg="8" :xl="8" :xxl="8" class="hxy-mt-30">
					<Card>
						<div class="isFlexSpace">
							<span class="fontBold hxy-font-size-18">客户类型分布</span>
							<div>
								<span class="hxy-mr-15">时间</span>
								<Select v-model="inpTypeUser" style="width:200px">
									<Option v-for="item in inpTypeUserSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
								</Select>
							</div>
						</div>
						<div class='echartBox' id="typeUSer"></div>
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


			//新增客户参数
			inpAdd : '',
			inpAaSel : [{value: 'New York',label: 'New York'},{value: 'London',label: 'London'}],
			
			
			//意向客户
			inpPurpose : "",
			inpPpSel   : [{value: 'New York',label: 'New York'},{value: 'London',label: 'London'}],
			
			
			//成交客户排名
			inpRankSuccess : "",
			inpRankSel : [{value: 'New York',label: 'New York'},{value: 'London',label: 'London'}],
			rankData   : [1,2,3,4,5,6,7],
			
			//成交客户
			inpSucc : "",
			inpSuccSel : [{value: 'New York',label: 'New York'},{value: 'London',label: 'London'}],
			
			
			//战败客户
			inpLose : "",
			inpLoseSel : [{value: 'New York',label: 'New York'},{value: 'London',label: 'London'}],
			
			
			//行业名称排行
			inpTrade : "",
			inpTradeSel :  [{value: 'New York',label: 'New York'},{value: 'London',label: 'London'}],
			tradeData : [1,2,3,4,5,6,7],
			
			//暂时搁置客户
			inpPorary : "",
			inpPorarySel:[{value: 'New York',label: 'New York'},{value: 'London',label: 'London'}],
			
			
			//跟进阶段分布
			inpFollow : "",
			inpFollowSel : [{value: 'New York',label: 'New York'},{value: 'London',label: 'London'}],
			
			//客户类型分布
			inpTypeUser : "",
			inpTypeUserSel : [{value: 'New York',label: 'New York'},{value: 'London',label: 'London'}],
        }
    },
	components: {tabMenu},
    mounted(){
		this.initAddEchart();
		this.initPurEchart();
		this.initSucEchart();
		this.initLosEchart();
		this.initPorEchart();
		this.initFolEchart();
		this.initTypEchart();
		
		
		this.$nextTick(()=>{
			// 监听窗口变化，重置echart视图自适应
			window.onresize = () => {
				echarts.init(document.getElementById('addUserBox')).resize();
				echarts.init(document.getElementById('purpose')).resize();
				echarts.init(document.getElementById('succUser')).resize();
				echarts.init(document.getElementById('loseUser')).resize();
				echarts.init(document.getElementById('poraryUser')).resize();
				echarts.init(document.getElementById('follow')).resize();
				echarts.init(document.getElementById('typeUSer')).resize();
			}
		})
    },
    methods: {
		initAddEchart(){
			let myChart = echarts.init(document.getElementById('addUserBox'))
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
		
		initPurEchart(){
			let myChart = echarts.init(document.getElementById('purpose'))
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
		
		initSucEchart(){
			let myChart = echarts.init(document.getElementById('succUser'))
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
		
		
		initLosEchart(){
			let myChart = echarts.init(document.getElementById('loseUser'))
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
		
		initPorEchart(){
			let myChart = echarts.init(document.getElementById('poraryUser'))
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
		
		initFolEchart(){
			let myChart = echarts.init(document.getElementById('follow'))
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
		
		initTypEchart(){
			let myChart = echarts.init(document.getElementById('typeUSer'))
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