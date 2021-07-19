<template>
    <div class="dataRange">
		<div class="hxy-mb-25">
			<Table stripe border :columns="rangeTitle" :data="rangeData" :loading="pageLoading"></Table>
		</div>
		<div class="pos-r tr">
			<Page :total="total" :page-size="pageSize" :current="page" placement="top" show-total show-sizer show-elevator @on-change="changePage" @on-page-size-change="changePageSize"></Page>
		</div>

		<!-- 数据范围管理 -->
		<Modal
			:title="title"
			v-model="dataRangeDialog"
			@on-cancel="closeDialog"
			:mask-closable="false"
			:width="720">
			<Form :model="dataRangeForm" ref="dataRangeForm" :rules="rulesDataRange" label-position="left" :label-width="50">
				<Row :gutter="10" class="hxy-mb-20">
					<Col span="24">
						当前企业名称：{{masterDeptName[0].masterDeptName}}
					</Col>
				</Row>
				<Row :gutter="10" class="hxy-mb-10">
					<Col span="12">
						<FormItem label="区域" prop="areaId">
							<tree-select value-consists-of="ALL" :normalizer="normalizer_area" :clearable="true" v-model="dataRangeForm.areaId" :options="searchAreaData" no-results-text="暂无数据" no-options-text="暂无数据" placeholder="请选择区域" @select="selectAreaId" />
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem label="部门" prop="deptId">
							<tree-select value-consists-of="ALL" :normalizer="normalizer" :clearable="true" v-model="dataRangeForm.deptId" :options="searchDeptData" no-results-text="暂无数据" no-options-text="暂无数据" placeholder="请选择部门" @input="selectDeptId" />
						</FormItem>
					</Col>
					<Col span="12">
						<FormItem label="报表" prop="reportId">
							<Select v-model="dataRangeForm.reportId" placeholder="请选择报表" clearable filterable @on-change="selectReportId">
								<Option v-for="(val,index) in searchReportData" :value="val.id" :key="index">{{val.name}}</Option>
							</Select>
						</FormItem>
					</Col>
				</Row>
				
				<div class="pos-r">
					<Spin size="large" fix v-if="dataRangePageLoading"></Spin>
					<Row class="tableBorder tableBg fontWeight">
						<Col span="2" class="tablePd10 tableRightBorder"></Col>
						<Col span="6" class="tablePd10 tableRightBorder">数据名称</Col>
						<Col span="16" class="tablePd10">详细功能</Col>
					</Row>
					<Row class="tableBorder">
						<Col span="2" class="tablePd10 tableRightBorder">
							<Checkbox
								:indeterminate="indeterminateArea"
								:value="isArea"
								:disabled="areaData.length==0"
								@click.prevent.native="checkAll($event,areaData,'areas')"/>
						</Col>
						<Col span="6" class="tablePd10 tableRightBorder">{{areaName}}</Col>
						<Col span="16" class="tablePd10">
							<CheckboxGroup v-model="dataRangeForm.areaIds" @on-change="getAreaIds">
								<Checkbox v-for="(item,index) in areaData" :label="item.id" :key="index" class="tablePd2">{{item.name}}</Checkbox>
							</CheckboxGroup>
						</Col>
					</Row>
					<Row class="tableBorder">
						<Col span="2" class="tablePd10 tableRightBorder">
							<Checkbox
								:indeterminate="indeterminateDept"
								:value="isDept"
								:disabled="deptData.length==0"
								@click.prevent.native="checkAll($event,deptData,'depts')"/>
						</Col>
						<Col span="6" class="tablePd10 tableRightBorder">{{deptName}}</Col>
						<Col span="16" class="tablePd10">
							<CheckboxGroup v-model="dataRangeForm.deptIds" @on-change="getDeptIds">
								<Checkbox v-for="(item,index) in deptData" :label="item.id" :key="index" class="tablePd2">{{item.name}}</Checkbox>
							</CheckboxGroup>
						</Col>
					</Row>
					<Row class="tableBorder">
						<Col span="2" class="tablePd10 tableRightBorder">
							<Checkbox
								:indeterminate="indeterminateBase"
								:value="isBase"
								:disabled="baseData.length==0"
								@click.prevent.native="checkAll($event,baseData,'baseDatas')"/>
						</Col>
						<Col span="6" class="tablePd10 tableRightBorder">{{baseName}}</Col>
						<Col span="16" class="tablePd10">
							<CheckboxGroup v-model="dataRangeForm.baseIds" @on-change="getBaseIds">
								<Checkbox v-for="(item,index) in baseData" :label="item.id" :key="index" class="tablePd2">{{item.name}}</Checkbox>
							</CheckboxGroup>
						</Col>
					</Row>
					<Row class="tableBorder">
						<Col span="2" class="tablePd10 tableRightBorder">
							<Checkbox
								:indeterminate="indeterminateBuiness"
								:value="isBuiness"
								:disabled="buinessData.length==0"
								@click.prevent.native="checkAll($event,buinessData,'buiness')"/>
						</Col>
						<Col span="6" class="tablePd10 tableRightBorder">{{buinessName}}</Col>
						<Col span="16" class="tablePd10">
							<CheckboxGroup v-model="dataRangeForm.buinessIds" @on-change="getBuinessIds">
								<Checkbox v-for="(item,index) in buinessData" :label="item.id" :key="index" class="tablePd2">{{item.name}}</Checkbox>
							</CheckboxGroup>
						</Col>
					</Row>
					<Row class="tableBorder">
						<Col span="2" class="tablePd10 tableRightBorder">
							<Checkbox
								:indeterminate="indeterminateReport"
								:value="isReport"
								:disabled="reportData.length==0"
								@click.prevent.native="checkAll($event,reportData,'reports')"/>
						</Col>
						<Col span="6" class="tablePd10 tableRightBorder">{{reportName}}</Col>
						<Col span="16" class="tablePd10">
							<CheckboxGroup v-model="dataRangeForm.reportIds" @on-change="getReportIds">
								<Checkbox v-for="(item,index) in reportData" :label="item.id" :key="index" class="tablePd2">{{item.name}}</Checkbox>
							</CheckboxGroup>
						</Col>
					</Row>
				</div>
			</Form>
			<div slot="footer">
				<Button type="default" @click="closeDialog">取消</Button>
				<Button type="primary" @click="handleSubmit" :loading="btnLoading">确定</Button>
			</div>
		</Modal>

		<!-- 查看详情 -->
		<Modal
			:title="'查看'+title"
			v-model="detailDialog"
			@on-cancel="closeDialog"
			:mask-closable="false"
			:width="720">
			<div>
				<Row class="tableBorder tableBg fontWeight">
					<Col span="6" class="tablePd10 tableRightBorder">数据名称</Col>
					<Col span="18" class="tablePd10">详细功能</Col>
				</Row>
				<Row class="tableBorder">
					<Col span="6" class="tablePd10 tableRightBorder" style="display:flex; align-items:center;">{{title}}</Col>
					<Col span="18" class="tablePd10">
						<Tag size="medium" v-for="(item,index) in viewArr" :key="index">{{item}}</Tag>
					</Col>
				</Row>
			</div>
			<div slot="footer">
				<Button type="default" @click="closeDialog">关闭</Button>
			</div>
		</Modal>
    </div>
</template>

<script>
import util from '_m/util'
import {getRoleDataRangeList,getAreaDeptBaseDataBuinessReport,getDataByRoleId,postDataRangeRole} from '_s/enterpriseAdmin'
import {getDeptEmpList} from '_s/department'
import {getAreaList} from '_s/area'
import { mapGetters } from 'vuex'
export default {
	data() {
		return {
			page: 1, // 页数
			pageSize: 10, // 每页显示数量
			total: 0,
			pageLoading: false,//页面loading动画
			dataRangePageLoading: false,// 弹窗页面tableloading动画
			title: '',
            rangeTitle: [
                {
					title: '序号',
					type: 'index',
					resizable: true,
					align: 'center',
					width: 80
				},
				{
					title: '角色id',
					key: 'roleId',
					resizable: true,
					width: 120
				},
				{
					title: '角色名称',
					key: 'roleName',
					resizable: true,
				},
				{
					title: '区域',
					key: 'areaIds',
					resizable: true,
					width: 150,
					align: 'center',
					render: (h, params) => {
						let btnArr = [
							h('Button', {
								props: {
									type: 'text',
									size: 'small',
									ghost: true
								},
								style: {
									color: '#2d8cf0',
								},
								on: {
									click: () => {
										this.toView(params.row,'areas')
									}
								}
							}, '详情')
						]
						return h('div', btnArr)
					}
				},
				{
					title: '部门',
					key: 'deptIds',
					resizable: true,
					width: 150,
					align: 'center',
					render: (h, params) => {
						let btnArr = [
							h('Button', {
								props: {
									type: 'text',
									size: 'small',
									ghost: true
								},
								style: {
									color: '#2d8cf0',
								},
								on: {
									click: () => {
										this.toView(params.row,'depts')
									}
								}
							}, '详情')
						]
						return h('div', btnArr)
					}
				},
				{
					title: '基础数据',
					key: 'dataIds',
					resizable: true,
					width: 150,
					align: 'center',
					render: (h, params) => {
						let btnArr = [
							h('Button', {
								props: {
									type: 'text',
									size: 'small',
									ghost: true
								},
								style: {
									color: '#2d8cf0',
								},
								on: {
									click: () => {
										this.toView(params.row,'baseDatas')
									}
								}
							}, '详情')
						]
						return h('div', btnArr)
					}
				},
				{
					title: '业务单据',
					resizable: true,
					width: 150,
					align: 'center',
					render: (h, params) => {
						let btnArr = [
							h('Button', {
								props: {
									type: 'text',
									size: 'small',
									ghost: true
								},
								style: {
									color: '#2d8cf0',
								},
								on: {
									click: () => {
										this.toView(params.row,'buiness')
									}
								}
							}, '详情')
						]
						return h('div', btnArr)
					}
				},
				{
					title: '报价清单',
					resizable: true,
					width: 150,
					align: 'center',
					render: (h, params) => {
						let btnArr = [
							h('Button', {
								props: {
									type: 'text',
									size: 'small',
									ghost: true
								},
								style: {
									color: '#2d8cf0',
								},
								on: {
									click: () => {
										this.toView(params.row,'reports')
									}
								}
							}, '详情')
						]
						return h('div', btnArr)
					}
				},
                {
					title:'操作',
					key:'action',
					width: 150,
					align: 'center',
					fixed: 'right',
					render: (h, params) => {
						let btnArr = [
							h('Button', {
								props: {
									type: 'primary',
									size: 'small'
								},
								style: {
									marginRight: '5px'
								},
								on: {
									click: () => {
										this.toEdit(params.row)
									}
								}
							}, '编辑')
						]
						return h('div', btnArr)
					}
				}
            ],
            rangeData: [],
            btnLoading: false,
			dataRangeDialog: false,
			dataRangeForm: {
				areaId: undefined,
				deptId: undefined,
				reportId: '',
				// 数据名称ids
				areaIds: [],
				deptIds: [],
				baseIds: [],
				buinessIds: [],
				reportIds: [],
			},
			defaultDataRange: {
				// 数据名称ids
				areaIds: [],
				deptIds: [],
				baseIds: [],
				buinessIds: [],
				reportIds: [],
			},
			rulesDataRange: {},
			masterDeptId: '',
			masterDeptName: '',
			dataRange: [],
			// 数据名称data
			areaData: [],
			deptData: [],
			baseData: [],
			buinessData: [],
			reportData: [],
			// 数据名称name
			areaName: '',
			deptName: '',
			baseName: '',
			buinessName: '',
			reportName: '',
			// 编辑搜索
			searchAreaData: [],
			searchDeptData: [],
			searchReportData: [],
			// 全选操作
			indeterminateArea: true,
			isArea: false,
			indeterminateDept: true,
			isDept: false,
			indeterminateBase: true,
			isBase: false,
			indeterminateBuiness: true,
			isBuiness: false,
			indeterminateReport: true,
			isReport: false,
			curRoleId:'',
			detailDialog: false,
			viewArr: []
		}
	},
	computed:{
		...mapGetters([
			'get_deptList'
		])
	},
	created() {
		this.masterDeptId = parseInt(util.getStorage('masterDeptId'))
		this.masterDeptName = this.get_deptList.filter(item => {
			return item.masterDeptId == this.masterDeptId
		})
	},
	mounted() {
		this.getRoleDataRangeListData()
		this.getDeptEmpListData()
		this.getAreaListData()
		this.getAreaDeptBaseDataBuinessReportData()
	},
	methods: {
        // 获取角色数据范围管理列表
        getRoleDataRangeListData() {
            this.pageLoading = true
			let params = {
				pageNum  : this.page,
				pageSize : this.pageSize
			}
            getRoleDataRangeList(params).then(res => {
                if(res.code===200) {
                    this.pageLoading = false
					this.rangeData = res.rows
					this.total = res.total
                }
            }).catch(err => {
				this.pageLoading = false
			})
        },
		// 获取当前企业的区域 部门 基础数据 业务单据 报表清单所有的
        getAreaDeptBaseDataBuinessReportData() {
			this.indeterminateArea = false
			this.isArea = false
			this.indeterminateDept = false
			this.isDept = false
			this.indeterminateBase = false
			this.isBase = false
			this.indeterminateBuiness = false
			this.isBuiness = false
			this.indeterminateReport = false
			this.isReport = false

			this.dataRangePageLoading = true
			let params = {
				areaId: this.dataRangeForm.areaId || '',
				deptId: this.dataRangeForm.deptId || '',
				reportId: this.dataRangeForm.reportId || '',
			}
            getAreaDeptBaseDataBuinessReport(params).then(res => {
                if(res.code===200) {
					setTimeout(()=>{
						this.dataRangePageLoading = false
					},1000)
					this.isShow = true
					let val = res.data
					this.dataRange = val
					this.areaData = val.filter(item=>item.key=='areas')[0].list
					this.areaName = val[0].name
					this.deptData = val.filter(item=>item.key=='depts')[0].list
					this.deptName = val[1].name
					this.baseData = val.filter(item=>item.key=='baseDatas')[0].list
					this.baseName = val[2].name
					this.buinessData = val.filter(item=>item.key=='buiness')[0].list
					this.buinessName = val[3].name
					this.reportData = val.filter(item=>item.key=='reports')[0].list
					this.reportName = val[4].name

					this.listFuc(this.defaultDataRange.areaIds,this.areaData,'areas')
					this.listFuc(this.defaultDataRange.deptIds,this.deptData,'depts')
					this.listFuc(this.defaultDataRange.baseIds,this.baseData,'baseDatas')
					this.listFuc(this.defaultDataRange.buinessIds,this.buinessData,'buiness')
					this.listFuc(this.defaultDataRange.reportIds,this.reportData,'reports')
				}
            }).catch(err => {
				this.dataRangePageLoading = false
			})
		},
		// 根据roleid获取当前数据
		getDataByRoleIdData(roleId) {
			let params = {
				roleId: roleId
			}
			getDataByRoleId(params).then(res => {
                if(res.code===200) {
					let val = JSON.parse(JSON.stringify(res.data))
					this.dataRangeForm.areaIds = val.areaIds,
					this.dataRangeForm.deptIds = val.deptIds,
					this.dataRangeForm.baseIds = val.baseDataIds,
					this.dataRangeForm.buinessIds = val.buinessDataIds,
					this.dataRangeForm.reportIds = val.reportDataIds

					this.defaultDataRange.areaIds = val.areaIds,
					this.defaultDataRange.deptIds = val.deptIds,
					this.defaultDataRange.baseIds = val.baseDataIds,
					this.defaultDataRange.buinessIds = val.buinessDataIds,
					this.defaultDataRange.reportIds = val.reportDataIds

					this.listFuc(this.defaultDataRange.areaIds,this.areaData,'areas')
					this.listFuc(this.defaultDataRange.deptIds,this.deptData,'depts')
					this.listFuc(this.defaultDataRange.baseIds,this.baseData,'baseDatas')
					this.listFuc(this.defaultDataRange.buinessIds,this.buinessData,'buiness')
					this.listFuc(this.defaultDataRange.reportIds,this.reportData,'reports')
                }
            })
		},
		// 控制checkbox样式
		listFuc(ids,data,key) {
			let data_new = data.map(item=>item.id).sort()
			let ids_new = ids.sort()
			// 全选控制
			if(ids.length===data.length&&data.length>0) {
				if(JSON.stringify(data_new)==JSON.stringify(ids_new)) {
					switch(key) {
						case 'areas':
							this.indeterminateArea = false
							this.isArea = true
							break;
						case 'depts':
							this.indeterminateDept = false
							this.isDept = true
							break;
						case 'baseDatas':
							this.indeterminateBase = false
							this.isBase = true
							break;
						case 'buiness':
							this.indeterminateBuiness = false
							this.isBuiness = true
							break;
						case 'reports':
							this.indeterminateReport = false
							this.isReport = true
							break;
					}
				}
			}
			// 取消全选控制
			if(data.length==0 || ids.length==0){
				switch(key) {
					case 'areas':
						this.indeterminateArea = false
						this.isArea = false
						break;
					case 'depts':
						this.indeterminateDept = false
						this.isDept = false
						break;
					case 'baseDatas':
						this.indeterminateBase = false
						this.isBase = false
						break;
					case 'buiness':
						this.indeterminateBuiness = false
						this.isBuiness = false
						break;
					case 'reports':
						this.indeterminateReport = false
						this.isReport = false
						break;
				}
			}

			// 验证重复元素
			if(ids.length>0&&data.length>0) {
				if(util.isRepeat(data_new.concat(ids_new))){
					switch(key) {
						case 'areas':
							this.indeterminateArea = true
							this.isArea = false
							break;
						case 'depts':
							this.indeterminateDept = true
							this.isDept = false
							break;
						case 'baseDatas':
							this.indeterminateBase = true
							this.isBase = false
							break;
						case 'buiness':
							this.indeterminateBuiness = true
							this.isBuiness = false
							break;
						case 'reports':
							this.indeterminateReport = true
							this.isReport = false
							break;
					}
				}
			}
		},
		// 选择区域
		selectAreaId(e) {
			this.dataRangeForm.areaId = e.areaId
			this.getDataByRoleIdData(this.curRoleId)
			setTimeout(()=>{
				this.getAreaDeptBaseDataBuinessReportData()
			},200)
		},
		// 自定义区域键值
		normalizer_area(node) {
			if (node.children && !node.children.length) {
				delete node.children;
			}
			return {
				id: node.areaId,
				label: node.areaName,
				children: node.children,
				isDefaultExpanded: true
			}
		},
		// 选择部门
		selectDeptId(e) {
			this.dataRangeForm.deptId = e
			this.getDataByRoleIdData(this.curRoleId)
			setTimeout(()=>{
				this.getAreaDeptBaseDataBuinessReportData()
			},200)
		},
		// 自定义部门键值
		normalizer(node) {
			if (node.children && !node.children.length) {
				delete node.children;
			}
			return {
				id: node.deptId,
				label: node.deptName,
				children: node.children,
				isDefaultExpanded: true
			}
		},
		// 选择报表
		selectReportId(e) {
			this.dataRangeForm.reportId = e
			this.getDataByRoleIdData(this.curRoleId)
			setTimeout(()=>{
				this.getAreaDeptBaseDataBuinessReportData()
			},200)
		},
		// 查询当前企业部门
		getDeptEmpListData() {
			this.pageLoading = true
			let masterDeptId = parseInt(util.getStorage('masterDeptId'))
			getDeptEmpList(masterDeptId).then(res => {
				if(res.code===200) {
					this.searchDeptData = []
					this.pageLoading = false
					this.searchDeptData.push(res.data)
					util.setArr(this.searchDeptData)
				}
			}).catch(err => {
				this.pageLoading = false
			})
		},
		// 查询区域列表
		getAreaListData() {
			let params = {
				masterDeptId: parseInt(util.getStorage('masterDeptId'))
			}
			getAreaList(params).then(res => {
				if(res.code===200) {
					this.searchAreaData = res.data
				}
			}).catch(err => {
			})
		},
		// 打开编辑对话框
		toEdit(data) {
			this.resetForm()
			this.dataRangeDialog = true
			this.title = '数据范围管理'
			this.curRoleId = data.roleId
			this.getDataByRoleIdData(this.curRoleId)
			setTimeout(()=>{
				this.getAreaDeptBaseDataBuinessReportData()
			},200)
		},
		// 勾选区域id
		getAreaIds(e) {
			this.dataRangeForm.areaIds = e
			this.listFuc(this.dataRangeForm.areaIds,this.areaData,'areas')
		},
		// 勾选部门id
		getDeptIds(e) {
			this.dataRangeForm.deptIds = e
			this.listFuc(this.dataRangeForm.deptIds,this.deptData,'depts')
		},
		// 勾选基础数据id
		getBaseIds(e) {
			this.dataRangeForm.baseIds = e
			this.listFuc(this.dataRangeForm.baseIds,this.baseData,'baseDatas')
		},
		// 勾选业务单据id
		getBuinessIds(e) {
			this.dataRangeForm.buinessIds = e
			this.listFuc(this.dataRangeForm.buinessIds,this.buinessData,'buiness')
		},
		// 勾选报表清单id
		getReportIds(e) {
			this.dataRangeForm.reportIds = e
			this.listFuc(this.dataRangeForm.reportIds,this.reportData,'reports')
		},
		// 全选操作
		checkAll(e,data,key) {
			switch(key) {
				case 'areas':
					if (this.indeterminateArea) {
						this.isArea = false
					} else {
						this.isArea = !this.isArea
					}
					this.indeterminateArea = false
					if (this.isArea) {
						this.dataRangeForm.areaIds = data.map(item=>item.id)
					} else {
						this.dataRangeForm.areaIds = []
					}
					break;
				case 'depts':
					if (this.indeterminateDept) {
						this.isDept = false
					} else {
						this.isDept = !this.isDept
					}
					this.indeterminateDept = false
					if (this.isDept) {
						this.dataRangeForm.deptIds = data.map(item=>item.id)
					} else {
						this.dataRangeForm.deptIds = []
					}
					break;
				case 'baseDatas':
					if (this.indeterminateBase) {
						this.isBase = false
					} else {
						this.isBase = !this.isBase
					}
					this.indeterminateBase = false
					if (this.isBase) {
						this.dataRangeForm.baseIds = data.map(item=>item.id)
					} else {
						this.dataRangeForm.baseIds = []
					}
					break;
				case 'buiness':
					if (this.indeterminateBuiness) {
						this.isBuiness = false
					} else {
						this.isBuiness = !this.isBuiness
					}
					this.indeterminateBuiness = false
					if (this.isBuiness) {
						this.dataRangeForm.buinessIds = data.map(item=>item.id)
					} else {
						this.dataRangeForm.buinessIds = []
					}
					break;
				case 'reports':
					if (this.indeterminateReport) {
						this.isReport = false
					} else {
						this.isReport = !this.isReport
					}
					this.indeterminateReport = false
					if (this.isReport) {
						this.dataRangeForm.reportIds = data.map(item=>item.id)
					} else {
						this.dataRangeForm.reportIds = []
					}
					break;
			}
		},
		// 编辑
		handleSubmit() {
			let areaArr = []
			if(this.dataRangeForm.areaIds.length > 0 && this.areaData.length > 0) {
				this.dataRangeForm.areaIds.forEach((value,index) => {
					areaArr.push({
						areaId: value
					})
				})
			}else if(this.areaData.length == 0) {
				this.areaArr = []
			}
			let deptArr = []
			if(this.dataRangeForm.deptIds.length > 0 && this.deptData.length > 0) {
				this.dataRangeForm.deptIds.forEach((value,index) => {
					deptArr.push({
						deptId: value
					})
				})
			}else if(this.deptData.length == 0) {
				this.deptArr = []
			}
			let baseArr = []
			if(this.dataRangeForm.baseIds.length > 0 && this.baseData.length > 0) {
				this.dataRangeForm.baseIds.forEach((value,index) => {
					baseArr.push({
						permitId: value
					})
				})
			}else if(this.baseData.length == 0) {
				this.baseArr = []
			}
			let buinessArr = []
			if(this.dataRangeForm.buinessIds.length > 0 && this.buinessData.length > 0) {
				this.dataRangeForm.buinessIds.forEach((value,index) => {
					buinessArr.push({
						permitId: value
					})
				})
			}else if(this.buinessData.length == 0) {
				this.buinessArr = []
			}
			let reportArr = []
			if(this.dataRangeForm.reportIds.length > 0 && this.reportData.length > 0) {
				this.dataRangeForm.reportIds.forEach((value,index) => {
					reportArr.push({
						permitId: value
					})
				})
			}else if(this.reportData.length == 0) {
				this.reportArr = []
			}
			let params = {
				roleId: this.curRoleId,
				list: areaArr.concat(deptArr,baseArr,buinessArr,reportArr)
			}

			postDataRangeRole(params).then(res => {
				if(res.code===200) {
					this.dataRangeDialog = false
					this.getRoleDataRangeListData()
					this.$Message.success(res.msg)
				}
			}).catch(err => {
			})
		},
		// 查看详情
		toView(data,key) {
			this.detailDialog = true
			this.viewArr = []
			let arr = []
			switch(key) {
				case 'areas':
					this.title = '区域'
					let areaIds = data.areaIds
					this.areaData.forEach((value,index) => {
						areaIds.forEach((v,i) => {
							if(value.id==v) {
								arr.push(value.name)
							}
						})
					})
					this.viewArr = arr
					break;
				case 'depts':
					this.title = '部门'
					let deptIds = data.deptIds
					this.deptData.forEach((value,index) => {
						deptIds.forEach((v,i) => {
							if(value.id==v) {
								arr.push(value.name)
							}
						})
					})
					this.viewArr = arr
					break;
				case 'baseDatas':
					this.title = '基础数据'
					let baseIds = data.baseDataIds
					this.baseData.forEach((value,index) => {
						baseIds.forEach((v,i) => {
							if(value.id==v) {
								arr.push(value.name)
							}
						})
					})
					this.viewArr = arr
					break;
				case 'buiness':
					this.title = '业务单据'
					let buinessIds = data.buinessDataIds
					this.buinessData.forEach((value,index) => {
						buinessIds.forEach((v,i) => {
							if(value.id==v) {
								arr.push(value.name)
							}
						})
					})
					this.viewArr = arr
					break;
				case 'reports':
					this.title = '报表清单'
					let reportIds = data.reportDataIds
					this.reportData.forEach((value,index) => {
						reportIds.forEach((v,i) => {
							if(value.id==v) {
								arr.push(value.name)
							}
						})
					})
					this.viewArr = arr
					break;
			}
		},
        // 关闭
        closeDialog() {
            this.dataRangeDialog = false
			this.detailDialog = false
        },
        // 清空
		resetForm() {
			this.btnLoading = false
			this.$refs['dataRangeForm'].resetFields()
        },
		// 当前页面
		changePage(pages) {
			this.page = pages
			this.getRoleDataRangeListData()
		},
		// 每页显示条数
		changePageSize(size) {
			this.pageSize = size
			this.getRoleDataRangeListData()
		}
	}
}
</script>
<style lang="scss" scoped>
	.tableBorder {
		border: 1px solid #dcdee2;
		margin-top: -1px;
		.tablePd10 {
			padding: 10px;
		}
		.tableRightBorder {
			border-right: 1px solid #dcdee2;
		}
	}
	.tableBg {
		background-color: #f8f8f9;
	}
	.fontWeight {
		font-weight: 700;
	}
	.tablePd2 {
		padding: 2px;
	}
</style>