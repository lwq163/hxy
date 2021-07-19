<template>
	<div class="productLib">
		<tab-menu></tab-menu>
		<div class="search">
			<Form ref="searchForm" :model="busSearch" :label-width="100" >
				<Row>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="合同编号" :md="12" :lg="8" :xl="6" :xxl="6" prop='contractNo'>
							<Input v-model="busSearch.contractNo" placeholder='请输入' clearable></Input>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="报件状态" :md="12" :lg="8" :xl="6" :xxl="6" prop='status'>
							<Select  v-model="busSearch.status" placeholder='请选择' clearable>
								<Option v-for="item in crmGenerateWorkOrderStatus" :value="item.value" :key="item.value">{{ item.label }}</Option>
							</Select>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="技术联系人" :md="12" :lg="8" :xl="6" :xxl="6" prop='contactName'>
							<Input v-model="busSearch.contactName"  placeholder='请输入' clearable></Input>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="产品及服务" :md="12" :lg="8" :xl="6" :xxl="6" prop='productName'>
							<Input v-model="busSearch.productName"  placeholder='请输入' clearable></Input>
						</FormItem>
					</Col>
				</Row>
				<Col span="24" class="tr">
					<Button type="primary" @click="handleSearch('searchForm')" icon="ios-search" class="hxy-mr-10">搜索</Button>
					<Button type="default" @click="handleReset('searchForm')" icon="ios-refresh">清空</Button>
				</Col>
			</Form>
		</div>
		
		<div class="hxy-mb-15">
			<Button type="primary" ghost class="hxy-mr-20" @click="handleAddBus">新增报件</Button>
		</div> 	
		
		<div class="hxy-mb-15">
			<Table stripe border :columns="taskListTitle" :data="taskListData" :loading="pageLoading" @on-selection-change="selectChange"></Table>
		</div>
		<div class="pos-r tr">
			<Page :total="total" @on-change="changePage" @on-page-size-change="changePageSize"    show-total show-sizer show-elevator />
		</div>
		
		<!-- 新增报件 -->
		<Modal v-model="addBus"  width = "720"  :title="title">
			<div slot="footer">
				<Button @click="addBus=false">取消</Button>
				<Button type="primary" style="margin-left: 8px" @click="sureBtn('addRef')">确认</Button>
			</div>
			<Form ref="addRef" :rules="addRul" :model="addModel" :label-width="100"  label-position="left">
				<FormItem label="合同编号" :md="12" :lg="8" :xl="6" :xxl="6" prop="contractNo">
					<Select
						v-model="addModel.contractNo"
						filterable
						style="width: 200px"
						@on-change="handleGenerateWorkOrderInfo"
						:disabled="disabledDetail"
						placeholder="请输入合同编号"
						clearable>
						<Option v-for="(option, index) in contractNoOpt" :value="option" :key="index">{{option}}</Option>
					</Select>
				</FormItem>
				<FormItem label="合同摘要" :md="12" :lg="8" :xl="6" :xxl="6" prop="contractAbstract">
					<Input placeholder="请输入合同摘要" type="textarea" style="width: 100%;" v-model="addModel.contractAbstract" :disabled="disabledDetail"></Input> 
				</FormItem>
				<FormItem label="产品信息">
					<Table stripe border height="400" :columns="productTit" :data="productDetails"  @on-selection-change="selectChange"></Table>
				</FormItem>
				<FormItem label="备注" prop="remark">
					<Input placeholder="请输入备注" style="width: 200px;" v-model="addModel.remark" :disabled="disabledDetail"></Input> 
				</FormItem>
				<modalUpLoad v-show="titleType !== 2" :fileData="fileData"></modalUpLoad>
			</Form>
		</Modal>
		<!-- 编辑业务类型 -->
		<!-- <Modal v-model="busTypeModal"  width = "720"  title="编辑业务类型"  :footer-hide="true">
			<Form :model="busType">
				<Row>
					<Col>
						<FormItem label="产品名称">
							<Input style="width: 200px;" v-model="busType.productName"></Input> 
						</FormItem>
						<FormItem label="产品数量">
							<Input style="width: 200px;" v-model="busType.number"></Input> 
						</FormItem>
						<FormItem label="交付标准">
							<Input style="width: 200px;" v-model="busType.productStandardName"></Input> 
						</FormItem>
						<modalUpLoad :fileData="fileData"></modalUpLoad>
						<FormItem label="指定代理人" >
							<Input style="width: 200px;" v-model="busType.appointedAgentUserId"></Input> 
						</FormItem>
						<FormItem label="客户要求完成期限" >
							<Input style="width: 200px;" v-model="busType.planFinishDate"></Input> 
						</FormItem>
					</Col>
				</Row>
			</Form>
			<modalBtn @sureBtn="busTypeBtn()" @cancleBtn="busTypeModal=false"></modalBtn>
		</Modal> -->
		
		<!-- 栏目标题弹窗 -->
		<tranFer :dataShow="TranList"  :TranListNo="TranListNo"  @refresh= "refresh" @closeTran="closeTran"  v-show="TranFlag"></tranFer>
	</div>
</template>

<script>
import tranFer from '_c/Transfer/Transfer'
import tabMenu from '_c/tab-menu'
import { add, getGenerateWorkOrderInfo, list, query, edit, remove, getDetailByCustomerId, changeStatus, getContractByLike } from '_s/splitContract'
import { queryCurrStaff, getMasterDeptCustomer, maintainContactList, getTechsByCustomerId } from "_s/customer"
import {  mapGetters } from 'vuex'

export default {
    data(){
        return{
			disabledDetail: false,
			masterDeptCustomer: [],
			disabledBtn: true,
			title: '新增报件',
			titleType: null, // 0新增，1编辑，2详情
			busSearch: {
				pageNum: 1, // 页数
				pageSize: 10, // 每页显示数量
			},
			pageLoading : false, // 页面loading动画
			taskListData: [],
			taskListTitle: [
				{
					title: '序号',
					resizable: true,
					width: 80,
					render:(h,params)=>{
						return h("span" ,{
						},params.index+1)
					}
				},
				{
					title: '合同编号',
					key: 'contractNo',
					resizable: true,
					width: 250
				},
				{
					title: '客户名称',
					key: 'companyName',
					resizable: true,
					width: 150
				},
				{
					title: '合同摘要',
					key: 'contractAbstract',
					resizable: true,
					width: 150
				},
				{
					title: '跟单人',
					key: 'followUserName',
					resizable: true,
					width: 150
				},
				{
					title: '备注',
					key: 'remark',
					resizable: true,
					width: 150
				},
				{
					title: '附件',
					key: 'uploadFiles',
					resizable: true,
					width: 180,
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								on: {
									click: () => {
										// this.toView(params.row.id)
										this.backSheet = true
									}
								}
							}, 'XXX'),
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								on: {
									click: () => {
										// this.toView(params.row.id)
									}
								}
							}, '详情'),
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								on: {
									click: () => {
										this.toRemoveView(params.row.id)
									}
								}
							}, '下载')
						])
					}
				},
				{
					title: '状态',
					key: 'statusLabel',
					resizable: true,
					width: 150
				},
				{
					title:'操作',
					key:'action',
					width: 200,
					fixed : "right",
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								on: {
									click: () => {
										this.handleChangeStatus(params.row)
										// this.toEditView(params.row)
									}
								}
							}, '提交'),
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								style: {
									display: params.row.status !== 2 ? 'inline-block' : 'none'
								},
								on: {
									click: () => {
										this.disabledDetail = false
										this.isEdit = false // 产品信息可编辑
										this.title = '编辑报件'
										this.titleType = 1
										this.addBus = true
										this.toEditView(params.row)
										// this.toView(params.row.id)
									}
								}
							}, '编辑'),
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								on: {
									click: () => {
										this.disabledDetail = true
										this.isEdit = true // 产品信息不可编辑
										this.title = '报件详情'
										this.titleType = 2
										this.addBus = true
										this.toEditView(params.row)
										// this.wishHis = true;
									}
								}
							}, '详情')
						])
					}
				}
			],
			total: 0,
			searchForm: {
				date: '',
				person: '',
				position: '',
				name: '',
				pageNum: 1, // 页数
				pageSize: 10, // 每页显示数量
			},
			
			//以下是新增报件
			addBus: false,
			busTypeModal: false,
			addModel: {
				productDetails: []
			},
			addRul: {
				contractNo: [{ required: true, message: '请输入合同编号', trigger: 'change' }],
			},
			busType: {},
			productDetails: [],
			addRule: {
				code: [
					{ required: true, message: '请输入合同编号', trigger: 'blur' }
				],
				asktype: [
					{ required: true, message: '请选择申请人类型', trigger: 'blur' }
				]
			},
			fileData : [1,2],
			
			//以下是送祝福
			sendWish  : false,
			productTit : [
				{
					type: 'selection',
					width: 60,
					resizable: true,
					align: 'center'
				},
				{
					title: '序号',
					resizable: true,
					align : "center",
					width: 80,
					render:(h,params)=>{
						return h("span" ,{
						},params.index+1)
					}
				},
				{
					title: '产品及服务名称',
					key: 'productName',
					resizable: true,
					width: 150
				},
				{
					title: '产品数量',
					key: 'number',
					resizable: true,
					width: 150
				},
				{
					title: '技术联系人',
					key: 'technicalContactUserId',
					resizable: true,
					width: 180,
					render: (h, params) => {
						return h('Select', {
							props: {
								transfer: true,
								value: params.row.technicalContactUserId,
								disabled: this.isEdit,
							},
							on: {
								'on-change':(val) => {
									this.productDetails[params.index].technicalContactUserId = val
								} 
							},
						},
						[
							this.listMaster.map(function(res){
								return h('Option',{
										props:{
											value: res.id,
											key: res.id
										}
								},res.contactName)
							})
						]);
					},
				},
				{
					title: '指定代理人',
					key: 'num',
					resizable: true,
					align : "appointedAgentUserId",
					width: 180,
					render: (h, params) => {
						return h('Select', {
							props: {
								transfer: true,
								value: params.row.appointedAgentUserId,
								disabled: this.isEdit,
							},
							on: {
								'on-change':(val) => {
									this.productDetails[params.index].appointedAgentUserId = val
								} 
							},
						},
						[
							this.queryCurrStaff.map(function(res){
								return h('Option',{
										props:{
											value: res.userId,
											key: res.userId
										}
								},res.nickName)
							})
						]);
					},
				},
				{
					title: '优先级',
					key: 'priority',
					resizable: true,
					width: 120,
					render: (h, params) => {
						return h('Select', {
							props: {
								transfer: true,
								value: String(params.row.priority),
								disabled: this.isEdit,
							},
							on: {
								'on-change':(val) => {
									this.productDetails[params.index].priority = val
								} 
							},
						},
						[
							this.priorityType.map(function(res){
								return h('Option',{
										props:{
											value: res.value,
											key: res.value
										}
								},res.label)
							})
						]);
					},
				},	
				{
					title: '要求交付时间',
					key: 'planFinishDate',
					resizable: true,
					width: 200,
					render: (h,params) => {
						return h('DatePicker', {
							props: {
								transfer: true,
								clearable: true,
								placeholder: '请选择日期',
								value: params.row[params.column.key],
								type: 'date',
								format: 'yyyy-MM-dd',
								size: 'small',
								disabled: this.isEdit,
							},
							on: {
								'on-change': (val)=>{
									this.productDetails[params.index].planFinishDate = val
								}
							}
						})
					}
				},	
				{
					title: '制作要求',
					key: 'manufactureRequirements',
					resizable: true,
					width: 200,
					render: (h,params) => {
						return h('Input', {
							props: {
								value: params.row.manufactureRequirements,
								disabled: this.isEdit,
							},
							on: {
								input: (val) => {
									this.productDetails[params.index].manufactureRequirements = val
								}
							}
						})
					}
				},
				// {
				// 	title:'操作',
				// 	key:'action',
				// 	width: 130,
				// 	align : "center",
				// 	fixed : "right",
				// 	render: (h, params) => {
				// 		return h('div', [
				// 			h('Button', {
				// 				props: {
				// 					type: 'text',
				// 					size: 'small'
				// 				},
				// 				on: {
				// 					click: () => {
				// 						this.toDetailView(params.row, params.index)
				// 					}
				// 				}
				// 			}, '编辑')
				// 		])
				// 	}
				// }
			],
			productDetails: [],
			newProductDetails: [], // 勾选的产品信息
			isEdit: false, // 产品信息是否可编辑

			//回访
			backSheet : false,
			backModel : {
				name  : "",
				backType  : "",
				backCont : "",
				userSign : "",
				xqCont   : "",
				xqPreson : ""
			},
			backRule: {
				name: [
					{ required: true, message: '请填写联系人', trigger: 'blur' }
				],
				backType: [
					{ required: true, message: '请选择回访方式', trigger: 'blur' }
				],
				backCont: [
					{ required: true, message: '请填写回访内容', trigger: 'blur' }
				],
				userSign: [
					{ required: true, message: '请填写客户反馈', trigger: 'blur' }
				],
			},
			
			//回访记录
			backHis : false,
			backHisTitle : [
				{
					title: '序号',
					key: 'id',
					resizable: true,
					align : "center",
					width: 80
				},
				{
					title: '联系人',
					key: 'name',
					resizable: true,
					align : "center",
					width: 120
				},
				{
					title: '回访方式',
					key: 'backType',
					resizable: true,
					align : "center",
					width: 100
				},
				{
					title: '回访内容',
					key: 'backCont',
					resizable: true,
					align : "center",
					width: 200
				},		
				{
					title: '客户反馈',
					key: 'userSign',
					resizable: true,
					align : "center",
					width: 150
				},	
				{
					title: '需求内容',
					key: 'xqCont',
					resizable: true,
					align : "center",
					width: 200
				},		
				{
					title: '需求执行人',
					key: 'xqPreson',
					resizable: true,
					align : "center",
					width: 200
				},	
				{
					title:'操作',
					key:'action',
					width: 130,
					align : "center",
					fixed : "right",
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								on: {
									click: () => {
										this.toView(params.row.id)
									}
								}
							}, '详情'),
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								on: {
									click: () => {
										this.toView(params.row.id)
									}
								}
							}, '下载')
						])
					}
				}
			],
			backHisData : [
				{
					id: 1,
					name : "礼物1",
					backType : 10,
					backCont : 100,
					userSign : "很好",
					xqCont   : "无需求",
					xqPreson : "张三"
				},
				{
					id: 2,
					name : "礼物1",
					backType : 10,
					backCont : 100,
					userSign : "很好",
					xqCont   : "无需求",
					xqPreson : "张三"
				}
			],
			
			//祝福记录
			wishHis : false,
			wishHisTitle : [
				{
					title: '序号',
					key: 'id',
					resizable: true,
					align : "center",
					width: 80
				},
				{
					title: '联系人',
					key: 'name',
					resizable: true,
					align : "center",
					width: 120
				},
				{
					title: '祝福方式',
					key: 'backType',
					resizable: true,
					align : "center",
					width: 100
				},
				{
					title: '祝福内容',
					key: 'backCont',
					resizable: true,
					align : "center",
					width: 200
				},		
				{
					title: '客户反馈',
					key: 'userSign',
					resizable: true,
					align : "center",
					width: 150
				},	
				{
					title: '需求内容',
					key: 'xqCont',
					resizable: true,
					align : "center",
					width: 200
				},		
				{
					title: '需求执行人',
					key: 'xqPreson',
					resizable: true,
					align : "center",
					width: 200
				},	
				{
					title:'操作',
					key:'action',
					width: 130,
					align : "center",
					fixed : "right",
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								on: {
									click: () => {
										this.toView(params.row.id)
									}
								}
							}, '详情'),
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								on: {
									click: () => {
										this.toView(params.row.id)
									}
								}
							}, '下载')
						])
					}
				}
			],
			wishHisData : [{
				id: 1,
				name : "礼物1",
				backType : 10,
				backCont : 100,
				userSign : "很好",
				xqCont   : "无需求",
				xqPreson : "张三"
			},
			{
				id: 2,
				name : "礼物1",
				backType : 10,
				backCont : 100,
				userSign : "很好",
				xqCont   : "无需求",
				xqPreson : "张三"
			}],
			
			// 以下是穿梭框参数
			TranList  : [],	  //穿梭框左侧数据
			TranListNo: [],	  //不属于穿梭框左侧数据的，例如选择框，序号，操作详情
			TranFlag  : false,//开关
			crmGenerateWorkOrderApplyType: [], // 申请人类型
			crmGenerateWorkOrderStatus: [], // 报件状态
			technicalUserIds: [], // 技术联系人
			queryCurrStaff: [],
			editId: null, // 编辑id
			contractNo: [],
			changeStatus: [],
			ids: null,
      		customerOpt: [],
			contractNoOpt: [], // 合同编号
			listMaster: [], // 客户联系人
			priorityType: [] // 优先级
        }
    },
	components: {tabMenu,tranFer},
	computed: {
		...mapGetters({
			config: 'get_config'
		})
	},
    mounted(){
		this.crmGenerateWorkOrderApplyType = this.filterDict(this.config, 'crm_generate_work_order_apply_type') // 付款方式
		this.crmGenerateWorkOrderStatus = this.filterDict(this.config, 'crm_generate_work_order_status') // 报件状态
		this.priorityType = this.filterDict(this.config, 'priority_type') // 优先级
		
		// 审批人、抄送人下拉框
		queryCurrStaff().then(res => {
			if (res.code === 200) {
				this.queryCurrStaff = res.data
			}
		})

		// 客户名称
		getMasterDeptCustomer().then(res => {
			if (res.code === 200) {
				this.masterDeptCustomer = res.data
			}
		})
	
		this.getTranList()
		this.getList()
		this.handleContractByLike()
    },
    methods: {
		// 导出
		handleExportFile() {
			let params = {
				createBy: this.busSearch.createBy,
				belongUserId: this.busSearch.belongUserId,
				contractNo: this.busSearch.contractNo,
				status: this.busSearch.status,
				companyName:  this.busSearch.companyName,
				applyType:  this.busSearch.applyType,
				createTime: this.busSearchc.reateTime
			}
			let fileName = this.$route.path.split('/').slice(-2)
			let url = '/crm/generateWorkOrder/export/list'
			this.axiosPost(url, params, fileName[0])
		},
		// 新增报件按钮
		handleAddBus() {
			this.$refs['addRef'].resetFields()
			this.addModel = {}
			this.productDetails = []
			this.disabledDetail = false
			this.isEdit = false // 产品信息可编辑
			this.titleType = 0
			this.title = '新增报件'
			this.addBus = true
		},
		// 提交、撤回
		handleChangeStatus(params) {
			// this.changeStatus.forEach(item => {
			// 	item.status = status
			// })
			this.$Modal.confirm({
                title: "确定提交该记录",
                onOk: () => {
                    changeStatus({ id: params.id, status: 2}).then(res => {
						if (res.code === 200) {
							this.$Message.info(res.msg)
							this.getList()
						}
					})
                }
            })
		},
		// 多条删除
		handleRemove() {
			remove( this.changeStatus ).then(res => {
				if (res.code === 200) {
					this.getList()
				}
			})
		},
		// 单条删除报件列表
		toRemoveView(params) {
			if (params.status !== 1 || params.status !== 2) {
				remove({ id: params.id }).then(res => {
					if (res.code === 200) {
						this.getList()
					}
				})
			} else {
				this.$Message.info('已提交不能删除')
			}
		},
		// 多选框选中数据
		selectChange(selection) {
			this.newProductDetails = selection
			let obj = {}
			selection.forEach(item => {
				obj = {
					id: item.id
				}
			})
			this.changeStatus.push(obj)
			this.disabledBtn = false
			this.disabledBtn = !selection.length
		},
		// 选择客户名称
		handleContract(e) {
			// 合同编号
			getDetailByCustomerId(e).then(res => {
				if (res.code === 200) {
					this.contractNo = res.data
				}
			})
		},
		// 条件搜索报件列表
		handleSearch() {
			this.getList()
		},
		// 报件列表接口
		getList() {
			list(this.busSearch).then(res => {
				if (res.code === 200) {
					this.taskListData = res.rows
					this.taskListData.forEach(item => {
						this.crmGenerateWorkOrderStatus.filter(el => {
							if (el.value.indexOf(item.status) !== -1) {
								item.statusLabel = el.label
							}
						})
					})
					this.total = res.total
				}
			})
		},
		// toDetailView(params, index) {
			// console.log(index, '879')
			// this.productTit[index].disabled = false
			// if (params.isReport === 0) {
			// 	this.busTypeModal = true
			// 	this.busType = params
			// } else {
			// 	this.$Message.info('已签约合同不能编辑')
			// }
		// },
		// 获取合同编号
		handleContractByLike() {
			getContractByLike().then(res => {
				if (res.code === 200) {
					this.contractNoOpt = res.data
				}
			})
		},
		// 根据合同编号获取产品信息
		handleGenerateWorkOrderInfo() {
			if (this.addModel.contractNo) {
				getGenerateWorkOrderInfo({ contractNo: this.addModel.contractNo }).then(res => {
					if (res.code === 200) {
						this.productDetails = res.data.productDetails
						// this.technicalUserIds = res.data.technicalUserIds
					}
				})
				this.getMaintainContactList(this.addModel.contractNo) // 获取技术联系人
			}
		},
		// 联系人
        getMaintainContactList(contractNo) {
            getTechsByCustomerId(contractNo).then(res => {
                if (res.code === 200) {
                    this.listMaster = res.data
                }
            })
        }, 
		// 确定新增
		sureBtn(name) {
			if (this.titleType === 2) { // 详情直接关闭弹框
				this.addBus = false
			} else {
				this.$refs[name].validate((valid) => {
					if (valid) {
						if(this.titleType === 0){ // 新增
							if  (this.newProductDetails.length !== 0) {
								this.addModel.productDetails = this.newProductDetails
								this.addModel.isAddCostReductionMaterials ? this.addModel.isAddCostReductionMaterials = 1 : this.addModel.isAddCostReductionMaterials = 0
								add(this.addModel).then(res => {
									this.getList()
									this.addBus = false
								})		
							} else {
								this.$Message.info('请先勾选需要提交的产品信息')
							}
							
						} else if (this.titleType === 1) { // 编辑
							if  (this.newProductDetails.length !== 0) {
								this.addModel.id = this.editId
								this.addModel.productDetails = this.newProductDetails
								this.addModel.isAddCostReductionMaterials ? this.addModel.isAddCostReductionMaterials = 1 : this.addModel.isAddCostReductionMaterials = 0
								edit(this.addModel).then(res => {
									this.getList()
									this.addBus = false
								})
							} else {
								this.$Message.info('请先勾选需要提交的产品信息')
							}
						}
					}
				})
			}
		},
		changeDate(e){
			console.log("e: " + JSON.stringify(e));
		},
		// 当前页面
		changePage(pages) {
			console.log("pages: " + JSON.stringify(pages));
		},
		// 每页显示条数
		changePageSize(size) {
			console.log("size: " + JSON.stringify(size));
		},
		// 确定编辑业务类型
		busTypeBtn() { // this.busType // 编辑的那条
			this.addModel.productDetails.forEach(item => {
				if (item.id === this.busType.id) {
					item = this.busType
				}
			})
			this.productDetails.push(this.busType)
			this.busTypeModal = false
		},
		// 获取编辑详情
		toEditView(params) {
			this.editId = params.id
			query({ id: params.id }).then(res => {
				if (res.code === 200) {
					this.addModel = res.data
					this.productDetails = res.data.productDetails
					this.technicalUserIds = res.data.technicalUserIds
				}
			})
		},
		// 以下是穿梭框逻辑
		openTran(){
			this.TranFlag = true
		},
		closeTran(){
			this.TranFlag = false
		},
		refresh(e){
			//把选择框，序号，操作详情的数据，合并当前要显示的模块
			this.taskListTitle = this.TranListNo.concat(e);
		},
		getTranList(){
			//显示要的数据
			this.TranList = this.taskListTitle.filter((item)=>{
				if(item.key&&item.key!='id'&&item.key!='action'){
					return item
				}
			})
			//不要显示的数据
			this.TranListNo = this.taskListTitle.filter((item)=>{
				if(!item.key||item.key=='id'||item.key=='action'){
					return item
				}
			})
		},
		// 清空搜索
		handleReset(name) {
			this.$refs[name].resetFields()
            this.getList()
		},
    }
}
</script>
<style lang="scss" scoped>
	.ivu-form-item-label{
		text-align: left !important;
	}
	.loadImg{
		width: 40px;
		height: 40px;
	}
	.addBZ{
		border-radius: 4px;
		height: 36px;
		width: 110px;
		background-color: #2D8CF0;
		color: white;
		cursor: pointer;
		.addBZRed{
			color: red;
			font-size: 20px;
		}
	}
	.guigeBox{
		padding: 16px;
		box-sizing: border-box;
		border: 1px solid #eee;
		border-radius: 4px;
		background: #F5F2F0;
		.guigeList{
			border: 1px solid #eee;
			border-radius: 4px;
			padding:12px 8px;
			background: white;
			box-sizing: border-box;
		}
	}
	
	.priceHead{
		text-align: center;
		.xh{
			width: 100px;
		}
		.level{
			width:200px;
		}
		.priceInp{
			
		}
	}
	
	
	.addBZ{
		border-radius: 4px;
		height: 36px;
		width: 110px;
		background-color: #2D8CF0;
		color: white;
		cursor: pointer;
		.addBZRed{
			color: red;
			font-size: 20px;
		}
	}
</style>