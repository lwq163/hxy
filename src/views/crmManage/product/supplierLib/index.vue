<template>
	<div class="productLib">
		<tab-menu></tab-menu>
		<div class="search">
			<Form ref="formInline" :label-width="85" label-position="left">
				<Row :gutter="40">
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="供应商名称" prop="creatPreson">
							<Input type="text" v-model="inpName" placeholder="请输入供应商名称"></Input>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="负责人" prop="creatPreson">
							<Input type="text" v-model="inpPreson" placeholder="请输入负责人"></Input>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
					<FormItem label="开户行" prop="creatPreson">
						<Input type="text" v-model="inpAddress" placeholder="请输入负责人"></Input>
					</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
					<FormItem label="户名" prop="creatPreson">
						<Input type="text" v-model="inpUserName" placeholder="请输入户名"></Input>
					</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
					<FormItem label="账号" prop="creatPreson">
						<Input type="text" v-model="inpCard" placeholder="请输入账号"></Input>
					</FormItem>
					</Col>
				</Row>
				<Col span="24" class="tr">
				<Button type="primary" @click="handleSearch()" icon="ios-search" class="hxy-mr-10">搜索</Button>
				<Button type="default" @click="handleReset()" icon="ios-refresh">清空</Button>
				</Col>
			</Form>
		</div>


		<div class="hxy-mb-30">
			<Button type="primary" class="hxy-mr-20" @click="addBusPro">新增供应商</Button>
		</div>


		<div class="hxy-mb-25">
			<Table stripe border :columns="taskListTitle" :data="taskListData" :loading="loading"
				@on-selection-change="selectChange">
				<template slot-scope="{ row}" slot="bankInfo">
					<div style="height: 15px;"></div>
					<div v-for="(item,num) in row.crmProviderBanks" :key="num" @click="openBankInfo(item)"
						class="hxy-mb-15">
						<Button>{{item.bankOfDeposit}}</Button>
					</div>
				</template>
			</Table>
		</div>
		<div class="pos-r tr">
			<Page :total="total"   :page-size="pageSize"  :current="pageNum" @on-change="changePage" @on-page-size-change="changePageSize" show-total show-sizer
				show-elevator />
		</div>




		<!-- 新增供应商 -->
		<Modal v-model="addBus" width="600" :title="addOrEdit?'编辑供应商':'新增供应商'" :footer-hide="true">
			<Form ref="addModel" :model="addModel" :rules="addRule" :label-width="140" label-position="left">
				<Row>
					<Col>
					<FormItem label="供应商名称" prop="name"><Input v-model="addModel.name"></Input></FormItem>
					</Col>
				</Row>
				<Row>
					<Col>
					<FormItem label="统一社会信用代码" prop="code"><Input v-model="addModel.code"></Input></FormItem>
					</Col>
				</Row>
				<Row>
					<Col>
					<FormItem label="供应商注册地址" prop="address"><Input v-model="addModel.address"></Input></FormItem>
					</Col>
				</Row>
				<Row>
					<Col>
					<FormItem label="供应商邮寄地址" prop="sendAddress"><Input v-model="addModel.sendAddress"></Input></FormItem>
					</Col>
				</Row>
				<Row>
					<Col>
					<FormItem label="负责人" prop="preson"><Input v-model="addModel.preson"></Input></FormItem>
					</Col>
				</Row>
				<Row>
					<Col>
					<FormItem label="负责人联系方式" prop="presonTel"><Input v-model="addModel.presonTel" type="tel"></Input>
					</FormItem>
					</Col>
				</Row>

				<div class="addBZ isFlexCenter " @click="addBankInfoData"><span class="addBZRed">*</span>添加银行信息</div>
				<div class="hxy-mb-20 hxy-mt-20">
					<Table stripe border :columns="bankTitle" :data="bankData" @on-selection-change="selectChange">
					</Table>
				</div>

				<modalBtn :sureText="addOrEdit?'确认修改':'确认新增'" @sureBtn="sureBtn('addModel')" @cancleBtn="addBus=false">
				</modalBtn>
			</Form>
		</Modal>



		<!-- 编辑供应商价格表 -->
		<Modal v-model="editBus" width="720" title="编辑供应商价格表" :footer-hide="true">
			<Form ref="editModel" :model="editModel" :rules="editRule" :label-width="140" label-position="left">
				<Row>
					<Col class="isFlexSpace" style="align-items: flex-start;">
					<FormItem label="供应商名称" prop="name"><Input v-model="editModel.name" disabled=""></Input></FormItem>
					</Col>
				</Row>
				<Row>
					<Col class="isFlexSpace" style="align-items: flex-start;">
					<FormItem label="类型名称" prop="typeName"><Input v-model="editModel.typeName"></Input></FormItem>
					<Button type="primary" class="hxy-ml-30" @click="addType">添加</Button>
					</Col>
				</Row>
				<Button type="primary" class="hxy-mb-10" @click="openSheetName()" v-show="tabMenu!=''">
					<span style="color: red;">*</span> 添加规格
				</Button>


				<div class="isFlexalitem">
					<div class="hxy-mb-15 isFlexalitem" v-for="(item,index) in tabMenu" :key="item.name">
						<div class="typeBtn" @click.stop="onTabCli(index)" :class="{'borderDeep':index==tabIndex}">
							{{item.name}}<span @click.stop="onTapRemove(index)">X</span></div>
					</div>
				</div>
				<div style="width: 100%;">
					<div v-for="(item,index) in tabMenu" :key="item.name" style="width: 100%;">
						<div v-show="index==tabIndex">
							<SkuForm :ref="'skuForm'+index" :source-attribute="item.sourceAttribute"
								:structure="item.structure" :attribute.sync="item.attribute" :sku.sync="item.sku"
								:theme="2" :batch="false" async />
						</div>
					</div>
				</div>


				<!-- <Tabs type="card" closable  @on-click="onTabCli"  @on-tab-remove="onTapRemove" v-show="tabMenu!=''">
					<TabPane :label="item.name" v-for="(item,index) in tabMenu" :key="index" >
						
					</TabPane>
				</Tabs> -->
				<modalBtn @sureBtn="sureBtn('editModel')" @cancleBtn="editBus=false"></modalBtn>
			</Form>
		</Modal>




		<!-- 添加银行信息 -->
		<Modal v-model="bankFlag" width="600" :title="bankAddorEdit?'编辑银行信息':'添加银行信息'" :footer-hide="true">
			<Form ref="bankModel" :model="bankFlagModel" :rules="bankFlagRule" :label-width="80" label-position="left">
				<Row>
					<Col>
					<FormItem label="开户行" prop="address"><Input v-model="bankFlagModel.address"></Input></FormItem>
					</Col>
				</Row>
				<Row>
					<Col>
					<FormItem label="户名" prop="name"><Input v-model="bankFlagModel.name"></Input></FormItem>
					</Col>
				</Row>
				<Row>
					<Col>
					<FormItem label="账号" prop="number"><Input v-model="bankFlagModel.number"></Input></FormItem>
					</Col>
				</Row>
				<modalBtn :sureText="bankAddorEdit?'确认修改':'确认新增'" @sureBtn="sureBtn('bankModel')"
					@cancleBtn="bankFlag=false"></modalBtn>
			</Form>
		</Modal>



		<!-- 详情 -->
		<Modal v-model="lookDefault" width="600" title="查看详情" :footer-hide="true">
			<Form ref="addModel2" :model="addModel" :rules="addRule" :label-width="140" label-position="left">
				<Row>
					<Col>
					<FormItem label="供应商名称" prop="name"><Input v-model="addModel.name" disabled></Input></FormItem>
					</Col>
				</Row>
				<Row>
					<Col>
					<FormItem label="统一社会信用代码" prop="code"><Input v-model="addModel.code" disabled></Input></FormItem>
					</Col>
				</Row>
				<Row>
					<Col>
					<FormItem label="供应商注册地址" prop="address"><Input v-model="addModel.address" disabled></Input></FormItem>
					</Col>
				</Row>
				<Row>
					<Col>
					<FormItem label="供应商邮寄地址" prop="sendAddress"><Input v-model="addModel.sendAddress" disabled></Input></FormItem>
					</Col>
				</Row>
				<Row>
					<Col>
					<FormItem label="负责人" prop="preson"><Input v-model="addModel.preson" disabled></Input></FormItem>
					</Col>
				</Row>
				<Row>
					<Col>
					<FormItem label="负责人联系方式" prop="presonTel"><Input v-model="addModel.presonTel" disabled
							type="tel"></Input>
					</FormItem>
					</Col>
				</Row>
				<div class="hxy-mb-20 hxy-mt-20">
					<Table stripe border :columns="bankTitle" :data="bankData" @on-selection-change="selectChange"></Table>
				</div>
				<modalBtn sureText="关闭" @sureBtn="lookDefault=false" @cancleBtn="lookDefault=false"></modalBtn>
			</Form>
		</Modal>


		<!-- 银行信息 -->
		<Modal title="银行信息" v-model="bankSheet" :mask-closable="false" :width="720">
			<div>
				<Row :gutter="10" class="hxy-mb-20">
					<Col span="12">
					开户行：{{bankInfo.bankOfDeposit || ''}}
					</Col>
					<Col span="12">
					户名：{{bankInfo.name || ''}}
					</Col>
				</Row>
				<Row :gutter="10" class="hxy-mb-20">
					<Col span="12">
					账号：{{bankInfo.number || ''}}
					</Col>
				</Row>
			</div>
		</Modal>


		<!-- 添加规格名 -->
		<Modal v-model="addGGObj.ggNameSheet" width="700" title="添加规格" :footer-hide="true">
			<Row>
				<Col class="isFlexSpace" style="align-items: flex-start;">
				<Input placeholder="请输入规格名称" v-model="addGGObj.guigeName"></Input>
				</Col>
			</Row>
			<modalBtn @sureBtn="addGuige" @cancleBtn="addGGObj.ggNameSheet=false"></modalBtn>
		</Modal>


		<!-- 查看价格表 -->
		<Modal v-model="lookDefaultPrice" width="900" title="查看供应商价格表" :footer-hide="true">
			<div class="isFlexalitem">
				<div class="hxy-mb-15 isFlexalitem" v-for="(item,index) in lookSku.dataList" :key="item.name">
					<div class="typeBtn" @click.stop="onTabCli_look(index)"
						:class="{'borderDeep':index==lookSku.Cindex}">{{item.name}}</div>
				</div>
			</div>
			<div class="menban"></div>
			<SkuForm v-if="lookSku.sourceAttribute!=''" ref='skuFormLook' :source-attribute="lookSku.sourceAttribute"
				:structure="lookSku.structure" :attribute.sync="lookSku.attribute" :sku.sync="lookSku.sku" :theme="2"
				:disabled="true" :batch="false" async>
				<template #priceName="slotProps">
					{{ slotProps.row.priceName }}
				</template>
			</SkuForm>
			<div v-if="lookSku.sourceAttribute==''" style="text-align: center;">暂无</div>
		</Modal>



		<!-- 栏目标题弹窗 -->
		<tranFer :dataShow="TranList" :TranListNo="TranListNo" @refresh="refresh" @closeTran="closeTran"
			v-show="TranFlag"></tranFer>
	</div>
</template>

<script>
	import SkuForm from 'vue-sku-form'
	import {
		productAddBus,
		productList,
		productEditBus,
		productDelete,
		pricing,
		lookPricing
	} from '_s/product'
	export default {
		components: {
			SkuForm
		},
		data() {
			return {
				addGGObj: {
					ggNameSheet: false,
					ggPriceSheet: false,
					guigeName: "",
					priceName: "",
				},
				tabIndex: 0,

				lookDefaultPrice: false,
				lookSku: {
					sourceAttribute: [],
					structure: [{
							name: 'price1',
							type: 'input',
							label: '成本价',
							required: true,
							batch: false
						},
						{
							name: 'price2',
							type: 'input',
							label: '促销价',
							batch: false
						},
						{
							name: 'price3',
							type: 'input',
							label: '会员价1',
							batch: false
						},
						{
							name: 'price4',
							type: 'input',
							label: '会员价2',
							batch: false
						},
						{
							name: 'price5',
							type: 'input',
							label: '会员价3',
							batch: false
						}
					],
					attribute: [],
					sku: [],
					dataList: [],
					Cindex: 0
				},


				//搜索绑定
				inpName: "",
				inpPreson: "",
				inpAddress: "",
				inpUserName: "",
				inpCard: "",


				//区分是新增还是编辑
				addOrEdit: false, //false默认新增，true编辑
				taskListData: [],
				taskListTitle: [{
						type: 'selection',
						width: 60,
						resizable: true,
						align: 'center'
					},
					{
						title: '序号',
						type: "index",
						resizable: true,
						align: "center",
						width: 80
					},
					{
						title: '供应商名称',
						key: 'name',
						align: "center",
						resizable: true,
						width: 200
					},
					{
						title: '统一社会信用代码',
						key: 'creditCode',
						resizable: true,
						align: "center",
						width: 200
					},
					{
						title: '供应商注册地址',
						key: 'regiestAddress',
						resizable: true,
						align: "center",
						width: 300
					},
					{
						title: '供应商邮寄地址',
						key: 'sendAddress',
						resizable: true,
						align: "center",
						width: 300
					},
					{
						title: '负责人',
						key: 'person',
						resizable: true,
						align: "center",
						width: 150
					},
					{
						title: '联系方式',
						key: 'tel',
						align: "center",
						resizable: true,
						width: 150
					},
					// {
					// 	title: '银行信息',
					// 	key: 'bankInfo',
					// 	slot: 'bankInfo',
					// 	resizable: true,
					// 	align: "center",
					// 	width: 250
					// },
					// {
					// 	title: '供应商价格表',
					// 	key: 'amount_collected',
					// 	align: "center",
					// 	resizable: true,
					// 	width: 150,
					// 	render: (h, params) => {
					// 		return h('div', [
					// 			h('Button', {
					// 				props: {
					// 					type: 'text',
					// 					size: 'small'
					// 				},
					// 				on: {
					// 					click: () => {
					// 						this.lookSkuOpen(params.row)
					// 					}
					// 				}
					// 			}, '查看')
					// 		])
					// 	}
					// },
					{
						title: '操作',
						key: 'action',
						width: 250,
						align: "center",
						fixed: "right",
						render: (h, params) => {
							return h('div', [
								h('Button', {
									props: {
										type: 'text',
										size: 'small'
									},
									on: {
										click: () => {
											this.edit(params.row);
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
											this.look(params.row);
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
											this.deleteData(params.row)
										}
									}
								}, '删除')
							])
						}
					}
				],
				searchForm: {
					date: '',
					person: '',
					position: '',
					name: '',
					page: 1, // 页数
					pageSize: 10, // 每页显示数量
				},




				//以下是新增供应商参数
				addBus: false,
				addModel: {
					id: "",
					name: "",
					code: "",
					address: "",
					sendAddress:"",
					preson: "",
					presonTel: "",
				},
				addRule: {
					name: [{
						required: true,
						message: '请输入供应商名称',
						trigger: 'blur'
					}],
					code: [{
						required: true,
						message: '请输入社会统一信用代码',
						trigger: 'blur'
					}],
					address: [{
						required: true,
						message: '请输入供应商注册地址',
						trigger: 'blur'
					}],
					sendAddress: [{
						required: true,
						message: '请输入供应商邮寄地址',
						trigger: 'blur'
					}],
					preson: [{
						required: true,
						message: '请输入负责人',
						trigger: 'blur'
					}],
					presonTel: [{
						required: true,
						message: '请输入负责人联系方式',
						trigger: 'blur'
					}],
				},



				//以下是编辑供应商参数
				editBus: false,
				eddisabled: true,
				editModel: {
					crmProviderId: "", //供应商id
					name: "",
					typeName: ""
				},
				editRule: {
					name: [{
						required: true,
						message: '请输入供应商名称',
						trigger: 'blur'
					}],
					typeName: [{
						required: true,
						message: '请输入类型名称',
						trigger: 'blur'
					}],
				},
				isShowType: false,
				isGuige: false,
				tabMenu: [],



				TypeIndex: 0,
				addTypeArry: [],
				priceArray: [],


				//添加银行信息
				bankTitle: [{
						title: '序号',
						type: "index",
						align: 'center',
						resizable: true,
						width: 70
					},
					{
						title: '开户行',
						key: 'bankOfDeposit',
						align: 'center',
						resizable: true,
						width: 150
					},
					{
						title: '户名',
						key: 'name',
						align: 'center',
						resizable: true,
						width: 100
					},
					{
						title: '账号',
						key: 'number',
						align: 'center',
						resizable: true,
						width: 120
					},
					{
						title: '操作',
						key: 'caozuo',
						align: 'center',
						resizable: true,
						width: 126,
						render: (h, params) => {
							return h('div', [
								h('Button', {
									props: {
										type: 'text',
										size: 'small'
									},
									on: {
										click: () => {
											if (this.lookDefault) {
												return
											}
											this.editBank(params.row, params.index);
										}
									}
								},  this.lookDefault?"-":'编辑'),
								h('Button', {
									props: {
										type: 'text',
										size: 'small'
									},
									on: {
										click: () => {
											if (this.lookDefault) {
												return
											}
											var _this = this;
											this.$Modal.confirm({
												title: "确定删除当前数据吗？",
												cancelText: "取消",
												onOk() {
													_this.bankData.splice(params.index, 1)
												}
											});
										}
									}
								},this.lookDefault?'':'删除')
							]);
						}
					},
				],
				bankData: [],
				bankFlag: false,
				bankFlagModel: {
					address: "",
					name: "",
					number: ""
				},
				bankFlagRule: {
					name: [{
						required: true,
						message: '请输入户名',
						trigger: 'blur'
					}],
					address: [{
						required: true,
						message: '请输入开户行',
						trigger: 'blur'
					}],
					number: [{
						required: true,
						message: '请输入账号',
						trigger: 'blur'
					}],
				},
				bankAddorEdit: false, //false为新增，true为编辑
				bankEditIndex: 0,

				//分页
				pageNum: 1,
				pageSize: 10,
				total: 0,
				ids: [],
				loading: true,
				lookDefault: false,

				bankSheet: false,
				bankInfo: "",
				isAgain: true,


				// 以下是穿梭框参数
				TranList: [], //穿梭框左侧数据
				TranListNo: [], //不属于穿梭框左侧数据的，例如选择框，序号，操作详情
				TranFlag: false, //开关
			}
		},
		created() {
			this.getTranList();
		},
		mounted() {
			this.initList();
		},
		methods: {
			openSheetName() {
				this.addGGObj.ggNameSheet = true;
				this.addGGObj.guigeName = "";
			},
			openSheetPrice() {
				this.addGGObj.ggPriceSheet = true;
				this.addGGObj.priceName = "";
			},
			addGuige() {
				if (this.addGGObj.guigeName == '') {
					this.$Message.error("请输入规格名称！");
					return
				}
				if (this.sourceAttribute) {
					for (var i = 0; i < this.sourceAttribute.length; i++) {
						var temp = this.sourceAttribute[i];
						if (temp.name == this.addGGObj.guigeName) {
							return this.$Message.error("规格名称已存在！");
							break;
						}
					}
				}
				var temp = this.tabMenu[this.tabIndex];
				setTimeout(() => {
					var setData = {
						name: this.addGGObj.guigeName,
						type: 'input',
						item: []
					}
					temp.sourceAttribute.push(setData);
					this.sourceAttribute = temp.sourceAttribute;
					this.$refs[`skuForm${this.tabIndex}`][0].init();
					this.addGGObj.ggNameSheet = false;
					temp.loading = false;
				}, 300)

			},
			//查看编辑价格表
			lookSkuOpen(data) {
				this.lookDefaultPrice = true;
				this.lookSku.Cindex = 0;
				this.lookSku.dataList = [];
				const param = {
					id: data.id
				}
				lookPricing(param).then(res => {
					console.log("res: " + JSON.stringify(res));
					if (res.data == '') {
						this.lookSku.sourceAttribute = [];
						this.lookSku.attribute = [];
						this.lookSku.sku = [];
						this.$refs.skuFormLook.init();
					} else {
						this.lookSku.dataList = res.data;
						this.show_look_data();
					}
				})
			},
			show_look_data() {
				if (this.lookSku.dataList[this.lookSku.Cindex].crmPriceTypeJson) {
					var json = JSON.parse(this.lookSku.dataList[this.lookSku.Cindex].crmPriceTypeJson);
					setTimeout(() => {
						this.lookSku.sourceAttribute = json.sourceAttribute;
						setTimeout(() => {
							this.lookSku.attribute = json.attribute;
							setTimeout(() => {
								this.lookSku.sku = json.sku;
								this.$refs.skuFormLook.init();
							}, 300)
						}, 300)
					}, 300)
				}
			},



			// 多选框选中数据
			selectChange(selection) {
				console.log(": " + JSON.stringify(selection));
				this.ids = selection.map(item => item.id)
				if (selection.length == 1) {
					this.eddisabled = false;
					this.editModel.name = selection[0].name;
					this.editModel.crmProviderId = selection[0].id;
				} else {
					this.eddisabled = true;
				}
			},

			// 底部翻页选择
			changePage(pages) {
				this.pageNum = pages;
				this.initList();
			},
			changePageSize(size) {
				this.pageSize = size;
				this.initList();
			},

			//新增按钮
			addBusPro() {
				this.$refs['addModel'].resetFields();
				this.bankData = [];
				this.addOrEdit = false;
				this.addBus = true;
			},
			sureBtn(name) {
				this.$refs[name].validate((valid) => {
					if (valid) {
						if (name == 'addModel') {
							if (this.bankData == '') {
								this.$Message.error('请添加银行信息');
								return
							}
						}
						if (this.isAgain) {
							this.isAgain = false;
							switch (name) {
								case "addModel":
									if (!this.addOrEdit) {
										this.addBusniess()
									} else {
										this.editBusniess()
									}
									break
								case "editModel":
									this.editPrice();
									break
								case "bankModel":
									if (!this.bankAddorEdit) {
										this.addBanKInfo();
									} else {
										this.eidtBanKInfo();
									}
									break;
							}
						}
					}
				})
			},
			//编辑供应商价格确定提交
			editPrice() {
				if (this.tabMenu == '') {
					this.$Message.error('请先添加类型');
					this.isAgain = true;
					return
				}

				// 深拷贝一份数据验证
				var str = JSON.stringify(this.tabMenu);
				var deepData = JSON.parse(str);
				var arry = [];
				var isGoOn = true;
				var isPrice = true; //弹出显示用
				var isGuigeVal = true;
				for (var i = 0; i < deepData.length; i++) {
					if (deepData[i].sku == '') { //没有添加规格
						isGoOn = false;
						break;
					} else {
						for (var g = 0; g < deepData[i].sku.length; g++) {
							if (deepData[i].sku[g].sku == '') { //没有设置规格值
								isGoOn = false;
								isGuigeVal = false;
								break;
							} else { //继续判断成本价是否填写
								if (deepData[i].sku[g].price1 == '') {
									isGoOn = false;
									isPrice = false;
									break;
								}
							}
						}
					}
					for (var j = 0; j < deepData[i].attribute.length; j++) {
						var temp = deepData[i].attribute[j];
						for (var k = 0; k < temp.item.length; k++) {
							var obj = {
								name: temp.name,
								content: temp.item[k],
								crmPriceTypeJson: deepData[i].sku
							}
							deepData[i].setData.push(obj)
						}
					}

					var dataInset = {
						sku: deepData[i].sku,
						sourceAttribute: deepData[i].sourceAttribute,
						attribute: deepData[i].attribute,
					}
					var param = {
						crmProviderId: this.editModel.crmProviderId, //供应商id
						name: deepData[i].name, //类型
						specifications: deepData[i].setData,
						crmPriceTypeJson: JSON.stringify(dataInset)
					}
					arry.push(param)
				}
				if (!isGoOn) {
					if (!isPrice) {
						this.$Message.error('请输入成本价！');
					} else if (!isGuigeVal) {
						this.$Message.error('请输入规格值！');
					} else {
						this.$Message.error('请完善信息！');
					}
					this.isAgain = true;
					return
				}
				pricing(arry).then(res => {
					if (res.code == 200) {
						this.$Message.success('添加成功');
						this.editBus = false;
						setTimeout(() => {
							this.isAgain = true;
						}, 1000)
					}
				}).catch(error => {
					setTimeout(() => {
						this.isAgain = true;
					}, 1000)
				})
			},
			//新增供应商
			addBusniess() {
				const param = {
					name: this.addModel.name,
					creditCode: this.addModel.code,
					regiestAddress: this.addModel.address,
					sendAddress:this.addModel.sendAddress,
					person: this.addModel.preson,
					tel: this.addModel.presonTel,
					crmProviderBanks: this.bankData
				}
				console.log("param: " + JSON.stringify(param));
				productAddBus(param).then(res => {
					console.log("res: " + JSON.stringify(res));
					if (res.code == 200) {
						this.addBus = false;
						this.$Message.success('新增成功');
						this.initList();
						setTimeout(() => {
							this.isAgain = true;
						}, 1000)
					}
				}).catch(error => {
					setTimeout(() => {
						this.isAgain = true;
					}, 1000)
				})
			},
			//编辑供应商
			editBusniess() {
				const param = {
					id: this.addModel.id,
					name: this.addModel.name,
					creditCode: this.addModel.code,
					regiestAddress: this.addModel.address,
					sendAddress:this.addModel.sendAddress,
					person: this.addModel.preson,
					tel: this.addModel.presonTel,
					crmProviderBanks: this.bankData
				}
				productEditBus(param).then(res => {
					if (res.code == 200) {
						this.addBus = false;
						this.$Message.success('编辑成功');
						this.initList();
						setTimeout(() => {
							this.isAgain = true;
						}, 1000)
					}
				}).catch(error => {
					setTimeout(() => {
						this.isAgain = true;
					}, 1000)
				})
			},
			//供应商列表
			initList() {
				const param = {
					name: this.inpName,
					person: this.inpPreson,
					bankOfDeposit: this.inpAddress,
					bankAccountName: this.inpUserName,
					number: this.inpCard,
					pageSize: this.pageSize,
					pageNum: this.pageNum
				}
				productList(param).then(res => {
					if (res.code == 200) {
						this.loading = false;
						this.taskListData = res.rows;
						this.total = res.total;
						this.ids = [];
						this.eddisabled = true;
						this.$Message.info(res.msg)
					}
				})
			},
			//添加银行弹窗
			addBankInfoData() {
				this.$refs['bankModel'].resetFields();
				this.bankFlag = true;
				this.bankAddorEdit = false;
			},
			//添加银行确认
			addBanKInfo() {
				var obj = {
					bankOfDeposit: this.bankFlagModel.address,
					name: this.bankFlagModel.name,
					number: this.bankFlagModel.number
				}
				this.bankData.push(obj);
				this.bankFlag = false;
				setTimeout(() => {
					this.isAgain = true;
				}, 1000)
			},
			//编辑银行确认
			eidtBanKInfo() {
				this.bankData[this.bankEditIndex].bankOfDeposit = this.bankFlagModel.address;
				this.bankData[this.bankEditIndex].name = this.bankFlagModel.name;
				this.bankData[this.bankEditIndex].number = this.bankFlagModel.number;
				this.bankFlag = false;
				setTimeout(() => {
					this.isAgain = true;
				}, 1000)
			},
			//编辑银行弹窗
			editBank(data, index) {
				this.bankEditIndex = index;
				this.bankFlagModel.address = data.bankOfDeposit;
				this.bankFlagModel.name = data.name;
				this.bankFlagModel.number = data.number;
				this.bankAddorEdit = true;
				this.bankFlag = true;
			},
			//编辑供应商
			edit(data) {
				this.addModel.id = data.id;
				this.addModel.name = data.name;
				this.addModel.code = data.creditCode;
				this.addModel.address = data.regiestAddress;
				this.addModel.sendAddress = data.sendAddress;
				this.addModel.preson = data.person;
				this.addModel.presonTel = data.tel;
				this.bankData = data.crmProviderBanks;

				this.addOrEdit = true;
				this.addBus = true;
			},
			//查看详情
			look(data) {
				this.addModel.id = data.id;
				this.addModel.name = data.name;
				this.addModel.code = data.creditCode;
				this.addModel.address = data.regiestAddress;
				this.addModel.sendAddress = data.sendAddress;
				this.addModel.preson = data.person;
				this.addModel.presonTel = data.tel;
				this.bankData = data.crmProviderBanks;
				this.lookDefault = true;
			},
			//删除单个
			deleteData(data) {
				var _this = this;
				this.$Modal.confirm({
					title: "确定删除当前数据吗？",
					cancelText: "取消",
					onOk() {
						productDelete([data.id]).then(res => {
							if (res.code == 200) {
								this.$Message.success('Success!');
								_this.pageNum = 1;
								_this.initList();
							}
						})
					}
				});
			},
			//删除多个
			deleteDataAll() {
				if (this.ids == '') {
					this.$Message.error('请选择要删除的数据！');
					return
				}
				var _this = this;
				this.$Modal.confirm({
					title: "确定删除当前数据吗？",
					cancelText: "取消",
					onOk() {
						productDelete(_this.ids).then(res => {
							if (res.code == 200) {
								this.$Message.success('Success!');
								_this.pageNum = 1;
								_this.initList();
							}
						})
					}
				});
			},
			//搜索
			handleSearch() {
				this.initList();
			},
			//清空
			handleReset() {
				this.inpName = "";
				this.inpPreson = "";
				this.inpAddress = "";
				this.inpUserName = "";
				this.inpCard = "";
				this.initList();
			},
			//导出
			exportData() {
				const param = {
					name: this.inpName,
					person: this.inpPreson,
					bankOfDeposit: this.inpAddress,
					bankAccountName: this.inpUserName,
					number: this.inpCard
				}
				this.axiosPost('/crm/provider/export', param, '供应商列表')
			},
			//
			editPriceShow() {
				if (this.ids.length == 1) {
					this.editModel.typeName = "";
					this.tabMenu = [];
					this.tabIndex = 0;
					this.editBus = true;
				}
			},

			//添加类型
			addType() {
				if (this.editModel.name == '') {
					this.$Message.success('请输入供应商名称');
					return
				}
				if (this.editModel.typeName == '') {
					this.$Message.success('请输入类型名称');
					return
				}
				if (this.tabMenu == '') {
					var obj = {
						name: this.editModel.typeName,
						sourceAttribute: [],
						structure: [{
								name: 'price1',
								type: 'input',
								label: '成本价',
								required: true
							},
							{
								name: 'price2',
								type: 'input',
								label: '促销价'
							},
							{
								name: 'price3',
								type: 'input',
								label: '会员价1'
							},
							{
								name: 'price4',
								type: 'input',
								label: '会员价2'
							},
							{
								name: 'price5',
								type: 'input',
								label: '会员价3'
							}
						],
						attribute: [],
						sku: [],
						setData: []
					}
					this.tabMenu.push(obj)
				} else {
					var isOk = true;
					for (var i = 0; i < this.tabMenu.length; i++) {
						if (this.tabMenu[i].name == this.editModel.typeName) {
							isOk = false;
							break;
						} else {
							isOk = true;
						}
					}
					if (isOk) {
						var obj2 = {
							name: this.editModel.typeName,
							sourceAttribute: [],
							structure: [{
									name: 'price1',
									type: 'input',
									label: '成本价',
									required: true
								},
								{
									name: 'price2',
									type: 'input',
									label: '促销价'
								},
								{
									name: 'price3',
									type: 'input',
									label: '会员价1'
								},
								{
									name: 'price4',
									type: 'input',
									label: '会员价2'
								},
								{
									name: 'price5',
									type: 'input',
									label: '会员价3'
								}
							],
							attribute: [],
							sku: [],
							setData: []
						}
						this.tabMenu.push(obj2)
					} else {
						this.$Message.success('类型名称不能重复');
						return
					}
				}
			},
			//选择类型
			onTabCli(e) {
				this.tabIndex = e;
			},
			onTabCli_look(e) {
				this.lookSku.Cindex = e;
				this.show_look_data();
			},
			//删除tab类型
			onTapRemove(e) {
				this.tabMenu.splice(e, 1);
				this.tabIndex = 0;
			},
			openBankInfo(item) {
				this.bankSheet = true;
				this.bankInfo = item;
				console.log("item: " + JSON.stringify(item));
			},




			// 以下是穿梭框逻辑
			openTran() {
				this.TranFlag = true
			},
			closeTran() {
				this.TranFlag = false
			},
			refresh(e) {
				//把选择框，序号，操作详情的数据，合并当前要显示的模块
				this.taskListTitle = this.TranListNo.concat(e);
			},
			getTranList() {
				//显示要的数据
				this.TranList = this.taskListTitle.filter((item) => {
					if (item.key && item.key != 'id' && item.key != 'action') {
						return item
					}
				})
				//不要显示的数据
				this.TranListNo = this.taskListTitle.filter((item) => {
					if (!item.key || item.key == 'id' || item.key == 'action') {
						return item
					}
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.ivu-form-item-label {
		text-align: left !important;
	}

	.addBZ {
		border-radius: 4px;
		height: 36px;
		width: 110px;
		background-color: #2D8CF0;
		color: white;
		cursor: pointer;

		.addBZRed {
			color: red;
			font-size: 20px;
		}
	}

	.guigeBox {
		padding: 16px;
		box-sizing: border-box;
		border: 1px solid #eee;
		border-radius: 4px;
		background: #F5F2F0;

		.guigeList {
			border: 1px solid #eee;
			border-radius: 4px;
			padding: 12px 8px;
			background: white;
			box-sizing: border-box;
		}
	}

	.priceHead {
		text-align: center;

		.xh {
			width: 100px;
		}

		.level {
			width: 200px;
		}

		.priceInp {}
	}


	.tableBox {
		overflow-x: scroll;
	}

	.tabHead,
	.tabHeadTow {
		display: flex;
		align-items: center;
	}

	.tabHead>div {
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		// flex: 1;
		width: 100px;
		flex-shrink: 0;
		border: 1px solid #eee;
		border-left: none;
	}

	.tabHead>div:nth-of-type(1) {
		border: 1px solid #eee;
	}

	.myInput {
		width: 60px !important;
		height: 30px;
	}

	.tabTh {
		// flex: 1;
		width: 100px;
		border: 1px solid #eee;
		border-top: none;
		border-left: none;
		flex-shrink: 0;
	}

	.tabTh>div {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}

	.tabTh:nth-of-type(1) {
		border-left: 1px solid #eee;
		// border-left: 1px solid #eees;
	}

	.tabTh>div div {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tabTh input {
		width: 120px;
	}

	.typeBtn {
		height: 36px;
		line-height: 36px;
		border-bottom: 1px solid #DCDEE2;
		cursor: pointer;
		position: relative;
		padding: 0 24px;
	}

	.typeBtn span {
		position: absolute;
		top: -6px;
		right: 8px;
	}

	.borderDeep {
		border-bottom: 2px solid #2D8CF0;
		color: #2D8CF0;
	}

	.menban {
		width: 100%;
		height: calc(100% - 100px);
		position: absolute;
		bottom: 0;
		left: 0;
		z-index: 10;
	}
</style>
