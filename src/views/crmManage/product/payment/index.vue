<template>
	<div class="productLib">
		<tab-menu></tab-menu>
		<div class="search">
			<Form ref="formInline" :model="searchForm"  :label-width="100"  label-position="left">
				<Row>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="付款类型"  prop="type">
							<Select v-model="searchForm.type">
								<Option :value="item.value" v-for="item in payMent" :key="item.value">{{item.label}}</Option>
							</Select>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="创建时间" prop="createTime">
							<DatePicker format="yyyy-MM-dd HH:mm:ss" v-model="searchForm.createTime" type="datetime" placeholder="请选择" @on-change="changeDate" style="width:100%;"></DatePicker>
						</FormItem>
					</Col>
				</Row>
			</Form> 
			<div class="isFlexSpace" style="justify-content: flex-end;width: 100%;">
				<div>
					<Button type="primary" @click="handleSearch()" icon="ios-search" class="hxy-mr-10">搜索</Button>
					<Button type="default" @click="handleReset()" icon="ios-refresh">清空</Button>
				</div>
			</div>
		</div>
		
		
		<div class="hxy-mb-30">
			<Button type="primary" class="hxy-mr-20"    @click="openPay">创建付款方式</Button>
		</div>
		<div class="hxy-mb-25">
			<Table  border :columns="taskListTitle" :data="taskListData" @on-selection-change="selectChange">
				<template slot-scope="{row}" slot="file_one" >
					<lookFile :row='row.sysFiles'></lookFile>
				</template>
			</Table>
		</div>
		<div class="pos-r tr">
			<Page :total="pageInfo.total"   :page-size="pageInfo.pageSize"   :current="pageInfo.pageNum" @on-change="changePage" @on-page-size-change="changePageSize"    show-total show-sizer show-elevator />
		</div>
		

		<!-- 新增付款方式 -->
		<Modal v-model="paySheet"  width = "600"  title="新增付款方式"   :footer-hide="true">
			<Form  ref="payModel" :model="payModel"  :rules="payRule"  :label-width="130"  label-position="left">
				<Row><Col><FormItem label="付款名称" prop="name"><Input v-model="payModel.name"></Input></FormItem></Col></Row>
				<Row>
					<Col>
						<FormItem label="付款类型" prop="payType">
							<Select v-model="payModel.payType" style="width:186px" >
								<Option :value="item.value" v-for="item in payMent" :key="item.value">{{item.label}}</Option>
							</Select>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col>
						<FormItem label="第一期付款比例" prop="payOne">
							<div class="isFlexalitem" style="align-items: center;">
								<Input v-model="payModel.payOne" type="text" @on-keyup="onKeyup"></Input>
								<span class="hxy-ml-10">%</span>
							</div>
						</FormItem>
					</Col>
				</Row>
				<Row v-if="payModel.payType==1">
					<Col>
						<FormItem label="第二期付款比例" prop="payTow">
							<div class="isFlexalitem" style="align-items: center;">
								<Input v-model="payModel.payTow" type="text" @on-keyup="onKeyup"></Input >
								<span class="hxy-ml-10">%</span>
							</div>
						</FormItem>
					</Col>
				</Row>
				<Row v-if="payModel.payType==1">
					<Col>
						<FormItem label="第三期付款比例" prop="payThr">
							<div class="isFlexalitem" style="align-items: center;">
								<Input v-model="payModel.payThr" type="text" @on-keyup="onKeyup"> </Input>
								<span class="hxy-ml-10">%</span>
							</div>
						</FormItem>
					</Col>
				</Row>
				<Row><Col><FormItem label="备注" prop="beizhu"><Input v-model="payModel.beizhu"></Input></FormItem></Col></Row>
				<modalUpLoad upLoadText="上传说明" @listenFile="listenFile" ref="file_Ref"></modalUpLoad>
				<modalBtn @sureBtn="sureBtn('payModel')" @cancleBtn="paySheet=false"></modalBtn>
			</Form>
		</Modal>
		
		<!-- 编辑付款方式 -->
		<Modal v-model="paySheetEdit"  width = "600"  title="编辑付款方式"   :footer-hide="true">
			<Form  ref="payModelEdit" :model="payModelEdit"  :rules="payRule"  :label-width="130"  label-position="left">
				<Row><Col><FormItem label="付款名称" prop="name"><Input v-model="payModelEdit.name"></Input></FormItem></Col></Row>
				<Row>
					<Col>
						<FormItem label="付款类型" prop="payType">
							<Select v-model="payModelEdit.payType" style="width:186px" >
								<Option :value="item.value" v-for="item in payMent" :key="item.value">{{item.label}}</Option>
							</Select>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col>
						<FormItem label="第一期付款比例" prop="payOne">
							<div class="isFlexalitem" style="align-items: center;">
								<Input v-model="payModelEdit.payOne"></Input>
								<span class="hxy-ml-10">%</span>
							</div>
						</FormItem>
					</Col>
				</Row>
				<Row v-if="payModelEdit.payType==1">
					<Col>
						<FormItem label="第二期付款比例" prop="payTow">
							<div class="isFlexalitem" style="align-items: center;">
								<Input v-model="payModelEdit.payTow"></Input>
								<span class="hxy-ml-10">%</span>
							</div>
						</FormItem>
					</Col>
				</Row>
				<Row v-if="payModelEdit.payType==1">
					<Col>
						<FormItem label="第三期付款比例">
							<div class="isFlexalitem" style="align-items: center;">
								<Input v-model="payModelEdit.payThr"></Input>
								<span class="hxy-ml-10">%</span>
							</div>
						</FormItem>
					</Col>
				</Row>
				<Row><Col><FormItem label="备注" prop="beizhu"><Input v-model="payModelEdit.beizhu"></Input></FormItem></Col></Row>
				<modalUpLoad upLoadText="上传附件" @listenFile="listenFile" ref="editFile" unType="edit"></modalUpLoad>
				<modalBtn sureText="确认修改" @sureBtn="sureBtn('payModelEdit')" @cancleBtn="paySheetEdit=false"></modalBtn>
			</Form>
		</Modal>
		
		
		<!-- 详情 -->
		<Modal v-model="paySheetLook"  width = "600"  title="查看详情"   :footer-hide="true">
			<Form  ref="payModelEdit" :model="payModelEdit"  :rules="payRule"  :label-width="130"  label-position="left">
				<Row><Col><FormItem label="付款名称" prop="name"><Input v-model="payModelEdit.name" disabled></Input></FormItem></Col></Row>
				<Row>
					<Col>
						<FormItem label="付款类型" prop="payType">
							<Select v-model="payModelEdit.payType" disabled style="width:186px" >
								<Option :value="item.value" v-for="item in payMent" :key="item.value">{{item.label}}</Option>
							</Select>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col>
						<FormItem label="第一期付款比例" prop="payOne">
							<div class="isFlexalitem" style="align-items: center;">
								<Input v-model="payModelEdit.payOne" disabled></Input>
								<span class="hxy-ml-10">%</span>
							</div>
						</FormItem>
					</Col>
				</Row>
				<Row v-if="payModelEdit.payType==1">
					<Col>
						<FormItem label="第二期付款比例" prop="payTow">
							<div class="isFlexalitem" style="align-items: center;">
								<Input v-model="payModelEdit.payTow" disabled></Input>
								<span class="hxy-ml-10">%</span>
							</div>
						</FormItem>
					</Col>
				</Row>
				<Row v-if="payModelEdit.payType==1">
					<Col>
						<FormItem label="第三期付款比例">
							<div class="isFlexalitem" style="align-items: center;">
								<Input v-model="payModelEdit.payThr" disabled></Input>
								<span class="hxy-ml-10">%</span>
							</div>
						</FormItem>
					</Col>
				</Row>
				<Row><Col><FormItem label="备注" prop="beizhu"><Input v-model="payModelEdit.beizhu" disabled></Input></FormItem></Col></Row>
				<lookFile :row='payModelEdit.fileList'></lookFile>
				<modalBtn sureText="关闭" @sureBtn="paySheetLook=false" @cancleBtn="paySheetLook=false"></modalBtn>
			</Form>
		</Modal>
		
		
	</div>
</template>
<script>
import { addPayMent,paymentList,editPayMent,deletePayMent } from '_s/product'
import { getSystemDict } from '_s'
import { queryCurrStaff } from '_s/customer'
import { mapGetters } from 'vuex'
export default {
    data(){
        return{
			searchForm : {
				createTime : "",
				type	   : ""
			},
			pageInfo   : {
				pageLoading   : false,	
				total		  : 0,		//总数
				pageNum 	  : 1, 		//页数
				pageSize      : 10, 	//每页显示数量
			},
			//以下是初始页面表格参数
			pageLoading : false,//页面loading动画
			taskListData: [],
			taskListTitle: [
				{
					type: 'selection',
					width: 60,
					resizable: true,
					align: 'center'
				},
				{
					title: '序号',
					type: 'index',
					resizable: true,
					width: 80,
					align: 'center'
				},
				{
					title: '创建时间',
					key: 'createTime',
					resizable: true,
					align: 'center',
					width: 200,
				},
				{
					title: '付款名称',
					key: 'name',
					resizable: true,
					align: 'center',
					width: 200,
				},
				{
					title: '付款类型',
					key: 'payType',
					resizable: true,
					align: 'center',
					width: 200,
				},
				{
					title: '第一期付款比例',
					key: 'payOne',
					resizable: true,
					align: 'center',
					width: 150,
					render: (h, params) => {
						return  h('span', {}, params.row.payOne)
					}
				},
				{
					title: '第二期付款比例',
					key: 'payTow',
					resizable: true,
					width: 150,
					align: 'center',
					render: (h, params) => {
						return  h('span', {}, params.row.payTow || '-')
					}
				},
				{
					title: '第三期付款比例',
					key: 'payThr',
					resizable: true,
					width: 150,
					align: 'center',
					render: (h, params) => {
						return  h('span', {}, params.row.payThr || '-')
					}
				},
				{
					title: '备注',
					key: 'remark',
					resizable: true,
					width: 150,
					align: 'center'
				},
				{
					title: '说明',
					slot: 'file_one',
					key : 'file_one',
					resizable: true,
					width: 250,
					align: 'center'
				},
				{
					title: '状态',
					key : 'remark',
					resizable: true,
					width: 250,
					align: 'center',
					render:(h,params)=>{
						return h('span',{},
							params.row.status==0?"已停用":"已启用"
						)
					}
				},
				{
					title:'操作',
					key:'action',
					width: 200,
					align: 'center',
					fixed: 'right',
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								on: {
									click: () => {
										this.changeState(params.row)
									}
								}
							}, params.row.status==0?'启用':'停用'),
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								on: {
									click: () => {
										this.edit(params.row)
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
										this.look(params.row)
									}
								}
							}, '详情')
						])
					}
				}
			],
			StatusData  : [],
			
			
			// 以下是穿梭框参数
			TranList  : [],	  //穿梭框左侧数据
			TranListNo: [],	  //不属于穿梭框左侧数据的，例如选择框，序号，操作详情
			TranFlag  : false,//开关
			
			
			
			//新增付款方式
			paySheet : false,
			payModel: {
				name  : "",
				payType : "",
				payOne  : "",
				payTow  : "",
				payThr  : "",
				beizhu	: "",
			},
			payMent : [],
			payRule: {
				name: [
					{ required: true, message: '请输入付款名称', trigger: 'blur' }
				],
				payType: [
					{ required: true, message: '请选择付款类型', trigger: 'blur' }
				],
				payOne:[
					{ required: true, message: '请输入第一期付款比例', trigger: 'change' }
				],
				payTow: [
					{ required: true, message: '请输入第二期付款比例', trigger: 'blur' }
				]
			},
			//附件列表
			fileList : [],
			
			//编辑弹窗
			paySheetEdit : false,
			payModelEdit : {
				name  : "",
				payType : "",
				payOne  : "",
				payTow  : "",
				payThr  : "",
				beizhu	: "",
				fileList: []
			},
			
			//详情
			paySheetLook : false,
			
        }
    },
    mounted(){
		this.initData();
		//获取付款类型
		getSystemDict().then(res => {
			this.payMent = this.filterDict(res.data,'crm_product_payment');
			this.StatusData = this.filterDict(res.data,'crm_payment_status');
		})
    },
    methods: {
		//选择创建时间
		changeDate(e){
			this.searchForm.createTime = e;
		},
		//打开-创建付款方式
		openPay(){
			this.$refs['file_Ref'].changeData([]);
			this.$refs['payModel'].resetFields();
			this.paySheet = true;
		},
		// 多选框选中数据
		selectChange(selection) {
			this.ids = selection.map(item => item.id)
		},
		// 底部翻页选择
		changePage(pages) {
			this.pageInfo.pageNum = pages;
			this.ids = [];
			this.initData();
		},
		changePageSize(size) {
			this.ids = [];
			this.pageInfo.pageSize = size;
			this.initData();
		},
		//获取上传附件的数据
		listenFile(data,unType){
			if(unType=='edit'){
				this.payModelEdit.fileList =data;
			}else{
				this.fileList = data;
			}
		},
		onKeyup(){
			this.payModel.payOne = this.payModel.payOne.replace(/\D/g,'')
			this.payModel.payTow = this.payModel.payTow.replace(/\D/g,'')
			this.payModel.payThr = this.payModel.payThr.replace(/\D/g,'')
		},
		//编辑
		edit(data){
			var str = JSON.parse(data.config);
			this.payModelEdit.id   = data.id;
			this.payModelEdit.name = data.name;
			this.payModelEdit.payType = data.type;
			this.payModelEdit.payOne = str["1"];
			this.payModelEdit.payTow = str["2"];
			this.payModelEdit.payThr = str["3"];
			this.payModelEdit.beizhu = data.remark;
			this.payModelEdit.fileList = data.sysFiles;
			this.$refs.editFile.changeData(data.sysFiles);
			this.paySheetEdit = true;
		},
		//查看详情
		look(data){
			var str = JSON.parse(data.config);
			this.payModelEdit.id   = data.id;
			this.payModelEdit.name = data.name;
			this.payModelEdit.payType = data.type;
			this.payModelEdit.payOne = str["1"];
			this.payModelEdit.payTow = str["2"];
			this.payModelEdit.payThr = str["3"];
			this.payModelEdit.beizhu = data.remark;
			this.payModelEdit.fileList = data.sysFiles;
			this.$refs.editFile.changeData(data.sysFiles);
			this.paySheetLook = true;
		},
		clearInitData(){
			this.paySheetEdit = false;
			this.paySheet = false;
			this.pageInfo.pageLoading = false;
			this.pageInfo.pageNum = 1;
			this.pageInfo.pageSize = 10;
			this.initData();
		},
		clearLoad(){
			this.pageInfo.pageLoading = true;
			setTimeout(()=>{
				this.pageInfo.pageLoading = false;
			},3000)
		},
		//搜索
		handleSearch(){
			this.clearInitData();
			this.$Message.success('正在搜索中...');
		},
		//清空
		handleReset(){
			this.$refs['formInline'].resetFields()
			this.clearInitData();
		},
		sureBtn(name) {
			this.$refs[name].validate((valid) => {
				if (valid) {
					if(name=='payModel'){
						this.addPayMentType();
					}else if(name=='payModelEdit'){
						this.editPayMentType();
					}
				}
			})
		},
		//新增付款方式
		addPayMentType(){
			var param = {
				name   : this.payModel.name,
				remark : this.payModel.beizhu,
				type   : this.payModel.payType,
				list   : this.fileList
			}
			if(this.payModel.payType==0){
				param.config = JSON.stringify({
					"1"  : this.payModel.payOne
				})
			}else if(this.payModel.payType==1){
				param.config = JSON.stringify({
					"1"  : this.payModel.payOne,
					"2"	 : this.payModel.payTow,
					"3"  : this.payModel.payThr
				})
			}
			this.clearLoad();
			this.$util.checkIsAgain(()=>{
				addPayMent(param).then(res=>{
					if(res.code==200){
						this.clearInitData();
					}
				})
			})
		},
		//编辑
		editPayMentType(){
			var param = {
				name   : this.payModelEdit.name,
				remark : this.payModelEdit.beizhu,
				type   : this.payModelEdit.payType,
				list   : this.payModelEdit.fileList,
				id     : this.payModelEdit.id
			}
			if(this.payModelEdit.payType==0){
				param.config = JSON.stringify({
					"1"  : this.payModelEdit.payOne
				})
			}else if(this.payModelEdit.payType==1){
				param.config = JSON.stringify({
					"1"  : this.payModelEdit.payOne,
					"2"	 : this.payModelEdit.payTow,
					"3"  : this.payModelEdit.payThr
				})
			}
			this.clearLoad();
			this.$util.checkIsAgain(()=>{
				editPayMent(param).then(res=>{
					if(res.code==200){
						this.clearInitData();
					}
				})
			})
		},
		//启用或停用
		changeState(data){
			var _this = this;
			var title = data.status==0?"启用":"停用";
			this.$Modal.confirm({
				title: "确定"+title+'当前付款方式吗',
				cancelText : "取消",
				onOk(){
					var param = {
						status : data.status==0?1:0,
						id     : data.id
					}
					console.log("param: " + JSON.stringify(param));
					_this.clearLoad();
					this.$util.checkIsAgain(()=>{
						editPayMent(param).then(res=>{
							if(res.code==200){
								_this.clearInitData();
							}
						})
					})
				}
			});
		},
		//初始化数据
		initData(){
			const param = {
				type     : this.searchForm.type || "",
				createTime : this.searchForm.createTime || "",
				pageNum  : this.pageInfo.pageNum,
				pageSize : this.pageInfo.pageSize
			}
			
			paymentList(param).then(res=>{
				console.log("res: " + JSON.stringify(res));
				if(res.code==200){
					res.rows.forEach((item)=>{
						var str = JSON.parse(item.config);
						if(item.type==0){						//全额付款
							this.$set(item,'payOne',str["1"]+'%');	//分期付款
							this.$set(item,'payTow',"-");
							this.$set(item,'payThr',"-");
						}else if(item.type==1){
							this.$set(item,'payOne',str["1"]+"%");
							this.$set(item,'payTow',str["2"]+"%");
							if(str["3"]==''){
								this.$set(item,'payThr','-');
							}else{
								this.$set(item,'payThr',str["3"]+"%");
							}
						}
						this.$set(item,'payType',item.type==0?'全额付款':"分期付款");
						if(item.remark==''){
							item.remark = "-"
						}
					})
					this.taskListData = res.rows;
					this.pageInfo.pageLoading = false;
					this.pageInfo.total = res.total;
				}
			}).catch(error=>{
				this.pageInfo.pageLoading = false;
			})
		}
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
</style>