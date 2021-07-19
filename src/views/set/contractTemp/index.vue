<template>
    <div class="template">
		<div class="hxy-mb-25">
			<Button class="hxy-mr-10" type="primary" ghost @click="openTemplateDialog">新增模板</Button>
		</div>
		<div class="hxy-mb-25">
			<Table stripe border :columns="contractTitle" :data="contractData" :loading="pageLoading"></Table>
		</div>
		<div class="pos-r tr">
			<Page :total="total" :page-size="pageSize" :current="page" placement="top" show-total show-sizer show-elevator @on-change="changePage" @on-page-size-change="changePageSize"></Page>
		</div>

		<!-- 新增/编辑模板弹出窗口 -->
		<Modal
			:title="title"
			v-model="templateDialog"
			@on-cancel="closeDialog"
			:mask-closable="false"
			:width="720">
			<Form :model="contractForm" ref="contractForm" :rules="rulesContract" label-position="left" :label-width="110">
				<Row :gutter="10">
					<Col span="24">
						<FormItem label="模板名称" prop="name">
							<Input type="text" v-model="contractForm.name" placeholder="请输入模板名称" />
						</FormItem>
					</Col>
					<!-- <Col span="24">
						<FormItem label="适用产品类型" prop="suitType">
							<tree-select :multiple="true" :limit="4" value-consists-of="ALL_WITH_INDETERMINATE" :clearable="true" :normalizer="normalizer" v-model="contractForm.suitType" :options="productSeriesListData" :show-count="true" no-results-text="暂无数据" no-options-text="暂无数据" placeholder="请选择适用产品类型" @input="selectSuitType" />
						</FormItem>
					</Col> -->
					<Col span="24">
						<FormItem label="合同编号生成方式" prop="generateType" :label-width="150" class="redDot">
							<RadioGroup v-model="contractForm.generateType">
								<div style="display: flex;align-items: center;">
									<Tooltip content="HT年月日时分秒毫秒" placement="top-start" max-width="250">
										<Radio label='1' class="hxy-mr-20">系统自动</Radio>
									</Tooltip>
								</div>
								<div style="display: flex;align-items: center;">
									<Radio label='2' class="hxy-pr-15">自定义</Radio>
									<div style="display: flex;" v-if="contractForm.generateType==='2'">
										<div class="hxy-pr-15">首位</div>
										<div class="hxy-pr-10" style="width: 245px;">
											<FormItem prop="customLetter">
												<Input type="text" v-model="contractForm.customLetter" placeholder="请输入大写字母，最多5位" />
											</FormItem>
										</div>
										<div>+ HT年月日时分秒毫秒</div>
									</div>
								</div>
							</RadioGroup>
						</FormItem>
					</Col>
					<Col span="24">
						<modalUpLoad ref="contractTemp" upLoadText="上传合同" @listenFile="listenFile"></modalUpLoad>
					</Col>
				</Row>
			</Form>
			<div slot="footer">
				<Button type="default" @click="closeDialog">取消</Button>
				<Button type="primary" @click="createSubmit" :loading="btnLoading">确定</Button>
			</div>
		</Modal>

		<!-- 模板详情 -->
		<Modal
			:title="title"
			v-model="detailDialog"
			:mask-closable="false"
			:width="720">
			<div>
				<Row :gutter="10" class="hxy-mb-20">
					<Col span="24">
						模板名称：{{detailData.name || ''}}
					</Col>
				</Row>
				<!-- <Row :gutter="10" class="hxy-mb-20">
					<Col span="24">
						适用产品类型：{{detailData.series || ''}}
					</Col>
				</Row> -->
				<Row :gutter="10" class="hxy-mb-20">
					<Col span="24">
						合同编号生成方式：{{detailData.generateName}}
					</Col>
				</Row>
				<Row :gutter="10" class="hxy-mb-20">
					<Col span="24" class="hxy-mb-10">
						合同原件：
					</Col>
					<Col span="24">
						<div v-for="(item,index) in detailData.contractFileList" :key="index">
							<span class="hxy-pr-20">{{item.displayName}} </span>
							<Button type="primary" size="small" @click="download(item)">下载</Button>
						</div>
					</Col>
				</Row>
			</div>
			<div slot="footer">
				<Button type="default" @click="detailDialog = false">关闭</Button>
			</div>
		</Modal>
    </div>
</template>

<script>
import util from '_m/util'
import {getContractTempList,getProductSeriesList,postAddTemp,deleteTemp} from '_s/contractTemp'
import { mapGetters } from 'vuex'
export default {
	data() {
		return {
			page: 1, // 页数
			pageSize: 10, // 每页显示数量
			total: 0,
			pageLoading: false,//页面loading动画
			title: '',
			btnLoading: false,
			contractTitle: [
				{
					title: '序号',
					type: 'index',
					resizable: true,
					width: 80,
					tooltip: true
				},
				{
					title: '模板名称',
					key: 'name',
					resizable: true,
				},
				{
					title: '合同编号生成方式',
					resizable: true,
					render: (h, params) => { 
						let id = params.row.generateType
						let type = this.generateTypeList.filter(item => item.value == id) 
						return h('div', type.length>0?type[0].label:'') 
					}
				},
				{
					title: '合同原件',
					key: 'contractFileList',
					resizable: true,
					width: 350,
					render:(h, params) => {
						let contractFileList = []
						let arr = []
						let data = params.row.contractFileList
						if(data.length > 0) {
							data.forEach((value,index) => {
								arr = [
									h('Icon', {
										props: {
											type: value.isImage?'md-image':'ios-paper',
										},
										style: {
											marginRight: '5px',
											fontSize: '16px'
										},
										class:'color-primary',
									})
								]
								arr.push(
									h('Tooltip',{
										props: {
											placement: 'top',
											content: value.displayName
										},
										style: {
											marginRight: '5px',
										}
									},value.displayName)
								)
								// 下载
								arr.push(
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
												this.download(value)
											}
										}
									}, '下载')
								)
								contractFileList.push(h('div',{
									style: {
										padding:'5px',
										display: 'flex',
										alignItems: 'center'
									}
								},arr))
							})
							
						}
						return h('div',contractFileList)
					}
				},
				{
					title:'操作',
					key:'action',
					width: 200,
					align: 'center',
					fixed: 'right',
					render: (h, params) => {
						let btnArr = []
						if(this.validateRole('system:contract:list')) {
							btnArr.push(
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
											this.templateDetail(params.row)
										}
									}
								}, '详情')
							)
						}
						if(this.validateRole('system:contract:remove')) {
							btnArr.push(
								h('Button', {
									props: {
										type: 'error',
										size: 'small'
									},
									style: {
										marginRight: '5px'
									},
									on: {
										click: () => {
											this.templateDel(params.row)
										}
									}
								}, '删除')
							)
						}
						return h('div', btnArr)
					}
				}
			],
			contractData: [],
			productSeriesListData: [],
			generateTypeList: [],
			templateDialog: false,
			contractForm: {
				name: '',
				suitType: [],
				generateType: '1',
				customLetter: ''
			},
			rulesContract: {
				name: [
					{ required: true, type: 'string', message: '请填写模板名称', trigger: 'blur' }
				],
				suitType: [
					{ required: true, type: 'array', message: '请选择适用产品类型', trigger: 'blur' }
				],
				generateType: [
					{ required: true, type: 'string', message: '请选择合同编号生成方式', trigger: 'blur' }
				],
				customLetter: [
					{ required: true, type: 'string', message: '请填写合同编号生成规则', trigger: 'blur' },
					{ type: 'string', pattern: /^[A-Z]{1,5}$/, message: '请输入五位大写英文字母', trigger: 'blur'}
				]
			},
			detailDialog: false,
			detailData: {},
			contractFileList: []
		}
	},
	computed: {
		...mapGetters({
			config: 'get_config'
		})
	},
	created() {},
	mounted() {
		this.getContractTempListData()
		this.generateTypeList = this.filterDict(this.config,'generate_type')
	},
	methods: {
		// 查询合同模板列表
		getContractTempListData() {
			this.pageLoading = true
			let params = {
				pageNum: this.page,
				pageSize: this.pageSize
			}
			getContractTempList(params).then(res => {
				if(res.code===200) {
					this.contractData = res.rows
					// this.contractData.forEach((value,index) => {
					// 	let suitTypeList = value.suitType.split(',')
					// 	let arr = []
					// 	suitTypeList.forEach((_v,_i) => {
					// 		let series = util.getIdData(this.productSeriesListData,'id',_v)
					// 		if(series) {
					// 			arr.push(series.series)
					// 		}else{
					// 			arr = []
					// 		}
					// 	})
					// 	this.contractData[index].series = arr.join(',')
					// })
					this.total = res.total
					this.pageLoading = false
				}else {
					this.pageLoading = false
				}
			}).catch(err => {
				this.pageLoading = false
			})
		},
		// 查询产品类型列表
		getProductSeriesListData() {
			getProductSeriesList().then(res => {
				if(res.code===200) {
					this.productSeriesListData = res.rows
					this.getContractTempListData()
				}
			})
		},
		// 适用产品类型自定义键值
		normalizer(node) {
			if (node.children && !node.children.length) {
				delete node.children;
			}
			if (node.children==null && node.children=='null') {
				delete node.children;
			}
			return {
				id: node.id,
				label: node.series,
				children: node.children?node.children:'',
				isDefaultExpanded: true
			}
		},
		// 选择适用产品类型
		selectSuitType(e) {
			this.contractForm.suitType = e
			if(this.contractForm.suitType.length!=0) {
				this.$nextTick(() => {
					this.$refs['contractForm'].validateField('suitType')
				})
			}
		},
		// 下载
		download(data) {
			console.log(data)
			let openWindow = window.open('about:blank', '_blank')
			openWindow.location = data.url
		},
		// 打开新增模板
		openTemplateDialog() {
			this.resetForm()
			this.title = '新增模板'
			this.templateDialog = true
			this.btnLoading = false
			this.$refs['contractTemp'].changeData([])
		},
		//获取上传合同的数据
		listenFile(data,unType){
			this.contractFileList = data
		},
		// 提交新增模板
		createSubmit() {
			this.btnLoading = true
			this.$refs['contractForm'].validate((valid) => {
				if(valid) {
					let params = {
						name: this.contractForm.name,
						// suitType: this.contractForm.suitType.toString(),
						generateType: this.contractForm.generateType,
						customLetter: this.contractForm.generateType=='2'?this.contractForm.customLetter:'',
						contractFileList: this.contractFileList
					}
					postAddTemp(params).then(res => {
						if(res.code===200) {
							this.$Message.success(res.msg)
							this.templateDialog = false
							this.getContractTempListData()
						}else {
							this.btnLoading = false
							this.$Message.error(res.msg)
						}
					}).catch(err=>{
						this.btnLoading = false
					})
				}else {
					this.btnLoading = false
				}
			})
		},
		// 查看模板详情
		templateDetail(data) {
			this.title = '查看模板详情'
			this.detailDialog = true
			this.detailData = data
			let generate = this.generateTypeList.filter(item => item.value == data.generateType)
			this.detailData.generateName = generate.length>0?generate[0].label:''
		},
		// 删除模板
		templateDel(data) {
			let id = data.id
			this.$Modal.confirm({
				title: '删除',
				content: '确定删除该模板吗？',
				loading: true,
				onOk: () => {
					deleteTemp(id).then(res => {
						if(res.code===200) {
							this.$Modal.remove()
							this.$Message.success(res.msg)
							this.page = 1
							this.getContractTempListData()
						}
					}).catch(err => {
						this.$Modal.remove()
					})
				}
			})
		},
		// 清空新增模板弹框
		resetForm() {
			this.contractFileList = []
			this.$refs['contractForm'].resetFields()
		},
		// 关闭新增模板
		closeDialog() {
			this.templateDialog = false
		},
		// 当前页面
		changePage(pages) {
			this.page = pages
			this.getContractTempListData()
		},
		// 每页显示条数
		changePageSize(size) {
			this.pageSize = size
			this.getContractTempListData()
		}
	}
}
</script>
<style lang="scss" scoped>
	/deep/.ivu-tooltip {
			height: 27px;
			line-height: 27px;
			.ivu-tooltip-rel {
				max-width: 200px;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
	/deep/.redDot .ivu-form-item-label:before {
		content: '*';
		display: inline-block;
		margin-right: 4px;
		line-height: 1;
		font-family: SimSun;
		font-size: 14px;
		color: #ed4014;
	}
</style>