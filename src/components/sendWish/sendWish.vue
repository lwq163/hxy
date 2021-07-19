<template>
	<div>
		<Modal v-model="isShow"  width ="700"  title="送祝福"   :footer-hide="true">
			<Row class="hxy-mb-15">
				<Col :md="12" :lg="8" :xl="8" :xxl="8">联系人：{{userInfo.contactName}}</Col>
				<Col :md="12" :lg="8" :xl="8" :xxl="8">职务：{{userInfo.contactPosition}}</Col>
				<Col :md="12" :lg="8" :xl="8" :xxl="8">联系人类别：{{userInfo.contactType}}</Col>
			</Row>
			<Row class="hxy-mb-15">
				<Col :md="12" :lg="8" :xl="8" :xxl="8">企业名称：{{userInfo.companyName}}</Col>
			</Row>
			<Form  ref="sendWishModel_ref" :model="sendWishModel"  :rules="sendWishRule"  :label-width="100" label-position="left">
				<FormItem  label="服务类型" prop="serverType">
					<Select v-model="sendWishModel.serverType" style="width: 200px;" >
						<Option v-for="item in selStateData" :value="item.value" :key="item.value">{{ item.label }}</Option>
					</Select>
				</FormItem>
				<div class="addBZ isFlexCenter hxy-mt-20" @click="open_LiwuFlag"><span class="addBZRed">*</span>新增礼品</div>
				<div class="hxy-mb-20 hxy-mt-20">
					<Table stripe border :columns="liwuTitle" :data="liwuData"></Table>
				</div>
				<Row class="hxy-mb-15">
					<Col :md="12" :lg="8" :xl="8" :xxl="8">合计金额：{{sendWishModel.totalPrice}}</Col>
					<Col :md="12" :lg="8" :xl="8" :xxl="8">合计数量：{{sendWishModel.totalCount}}</Col>
					<Col :md="12" :lg="8" :xl="8" :xxl="8">大写金额：{{sendWishModel.bigPrice}}</Col>
				</Row>
				
				<div class="isFlexalitem hxy-mb-20">
					<span class="hxy-mr-15">其它备注</span>
					<Input style="width: 200px;" v-model="sendWishModel.remark"></Input>
				</div>
				<approve ref="approve_ref" :name="5"></approve>
			</Form>
			<modalBtn  @sureBtn="subcomitData"  @cancleBtn="cancleBtn"></modalBtn>
		</Modal>
		
		
		<!-- 新增礼物 -->
		<Modal v-model="addLiwuFlag"  width ="700"  title="新增礼品"   :footer-hide="true">
			<Form  ref="addLiwu_ref" :model="sendWishLiwu"  :rules="sendWishLiwuRule"  :label-width="100" label-position="left">
				<FormItem   label="礼品名称"  prop="giftName">
					<Input type="text" style="width: 200px;" v-model="sendWishLiwu.giftName"></Input>
				</FormItem>
				<FormItem  label="单价"  prop="giftUnitPrice">
					<Input type="number" style="width: 200px;" v-model="sendWishLiwu.giftUnitPrice"></Input>
				</FormItem>
				<FormItem  label="数量" prop="giftNums">
					<Input type="number" style="width: 200px;" v-model="sendWishLiwu.giftNums"></Input>
				</FormItem>
			</Form>
			<modalBtn sureText="确认"  @sureBtn="addLiwu"  @cancleBtn="addLiwuFlag=false"></modalBtn>
		</Modal>
	</div>
</template>
<script>
	import approve from '_c/approve'
	import { mapGetters } from 'vuex'
	export default {
		computed: {
			...mapGetters({
				config: 'get_config',
				user: 'get_userinfo'
			})
		},
		mounted() {
			this.selStateData = this.filterDict(this.config,'wish_type'); 	 	//维护状态
		},
		components:{
			approve  
		},
		data() {
			return {
				isShow : false,
				userInfo : "",
				selStateData  : [],		//服务类型
				
				
				sendWishModel : {
					serverType : "",
					remark	   : "",
					totalPrice : 0,
					totalCount : 0,
					bigPrice   : ""
				},
				sendWishRule :{
					serverType : [
						{ required: true, message: '请选择服务类型', trigger: 'change'}
					]
				},
				
				//新增礼品
				liwu_isAddOr_edit:true,
				addLiwuFlag : false,
				eidtIndex   : 0,
				sendWishLiwu: {
					giftName : "",
					giftNums : "",
					giftUnitPrice : ""
				},
				sendWishLiwuRule :{
					giftName : [
						{ required: true, message: '请选择礼物名称', trigger: 'blur' }
					],
					giftNums : [
						{ required: true, message: '请选择礼物单价', trigger: 'blur' }
					],
					giftUnitPrice : [
						{ required: true, message: '请选择礼物数量', trigger: 'blur' }
					]
				},
				liwuData  : [],
				liwuTitle : [
					{
						title: '序号',
						type : "index",
						resizable: true,
						align : "center",
					},
					{
						title: '礼品名称',
						key: 'giftName',
						resizable: true,
						align : "center",
						width : 120
					},
					{
						title: '数量',
						key: 'giftNums',
						resizable: true,
						align : "center",
					},
					{
						title: '单价（自动）带出',
						key: 'giftUnitPrice',
						resizable: true,
						align : "center",
						width : 200
					},			
					{
						title:'操作',
						key:'action',
						align : "center",
						fixed : "right",
						width : 200,
						render: (h, params) => {
							return h('div', [
								h('Button', {
									props: {
										type: 'text',
										size: 'small'
									},
									on: {
										click: () => {
											this.edit_liwu(params.row)
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
											this.del_liwu(params.row)
										}
									}
								}, '删除')
							])
						}
					}
				],
				
				
				//审批流程
				approveModel : {
					spData: [
						{value: 'bbh',label: 'bbh'},
					],
					spList: [],
					csData: [
						{value: '大专院校',label: '大专院校'},
						{value: '科研单位',label: '科研单位'},
						{value: '事业单位',label: '事业单位'},
						{value: '个人',label: '个人'},
					],
					csList : [],
					isFlag : "",
					inpLeave:""
				},
			}
		},
		methods:{
			subcomitData() {
				this.$refs["sendWishModel_ref"].validate((valid) => {
					if (valid) {
						if(this.liwuData==''){
							this.$Message.error("请添加礼品！");
							return
						}
						//校验审批
						var roveInfo =  this.$refs.approve_ref.check_role();
						if(roveInfo==-1){
							return
						}
						var obj = {
							crmCustomerContactId : this.userInfo.crmCustomerContactId,
							specialDate : this.userInfo.specialDate,
							gifts	: this.liwuData,
							remark	: this.sendWishModel.remark,
							wishType: this.sendWishModel.serverType,
							ccUserIds : roveInfo.ccUserIds,
							approvalUserIds : roveInfo.approvalUserIds,
							approvalTempId : roveInfo.approvalTempId,
							leaveMessage: roveInfo.leaveMessage
						}
						this.$emit("sureBtn",obj)
					}
				})
			},
			getInfo(data){
				this.userInfo = data;
			},
			openModel(){
				this.liwuData = [];
				this.sendWishModel.serverType = "";
				this.sendWishModel.remark = "";
				this.sendWishModel.totalPrice = 0;
				this.sendWishModel.totalCount = 0;
				this.sendWishModel.bigPrice = "";
				this.$refs['sendWishModel_ref'].resetFields();
				this.isShow = true;
			},
			cancleBtn(){
				this.isShow = false;
			},
			//添加礼品按钮
			open_LiwuFlag(){
				this.addLiwuFlag = true;
				this.liwu_isAddOr_edit = true;
				this.$refs['addLiwu_ref'].resetFields();
			},
			//编辑礼物
			edit_liwu(data){
				//回填数据
				this.sendWishLiwu.giftName = this.liwuData[data._index].giftName;
				this.sendWishLiwu.giftNums = this.liwuData[data._index].giftNums;
				this.sendWishLiwu.giftUnitPrice = this.liwuData[data._index].giftUnitPrice;

				
				this.eidtIndex = data._index;
				this.addLiwuFlag = true;
				this.liwu_isAddOr_edit = false;
			},
			//删除礼物
			del_liwu(data){
				this.liwuData.splice(data._index,1);
				this.set_total();
			},
			//合计
			set_total(){
				this.sendWishModel.totalPrice = 0;
				this.sendWishModel.totalCount = 0;
				this.sendWishModel.bigPrice = 0;
				this.liwuData.forEach((item)=>{
					this.sendWishModel.totalPrice += (Number(item.giftUnitPrice)*Number(item.giftNums));
					this.sendWishModel.totalCount += Number(item.giftNums);
				})
				this.sendWishModel.bigPrice =  this.$util.number_chinese(this.sendWishModel.totalPrice);
			},
			
			//增加/编辑礼物事件
			addLiwu(){
				if(this.liwu_isAddOr_edit){
					var obj = {
						giftName : this.sendWishLiwu.giftName,
						giftNums : this.sendWishLiwu.giftNums,
						giftUnitPrice : this.sendWishLiwu.giftUnitPrice
					}
					this.liwuData.push(obj);
					this.addLiwuFlag = false;
				}else{
					this.liwuData[this.eidtIndex].giftName = this.sendWishLiwu.giftName;
					this.liwuData[this.eidtIndex].giftNums = this.sendWishLiwu.giftNums;
					this.liwuData[this.eidtIndex].giftUnitPrice = this.sendWishLiwu.giftUnitPrice;
					this.addLiwuFlag = false;
				}
				this.set_total();
			}
		}
	}
</script>
<style scoped="scoped" lang="scss">
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
