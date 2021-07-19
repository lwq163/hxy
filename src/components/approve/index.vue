<template>
	<div style="border: 1px solid #eee;padding:16px 16px 0;border-radius: 4px;">
		<div class="isFlexSpace hxy-mb-20">
			<span>审批流程展示</span>
			<!-- <span style="color: #007AFF;" >流程设置</span> -->
		</div>
		<Form :model="approveModel" ref="approve_form_ref" :label-width="60">
			<FormItem label="审核人" :md="12" :lg="8" :xl="6" :xxl="6" prop="examineUserIds">
				<Select  multiple filterable style="width:260px;"  v-model="approveModel.examineUserIds">
					<Option v-for="(item,index) in approveModel.queryCurExaine"  :key="index"  :value="item.userId">{{item.nickName}}</Option>
				</Select>  
			</FormItem>
			<FormItem label="审批人" :md="12" :lg="8" :xl="6" :xxl="6" prop="approvalUserIds">
				<Select multiple filterable style="width:260px;" v-model="approveModel.approvalUserIds" >
					<Option v-for="(item,index) in approveModel.queryCurrStaff"   :key="index" :value="item.userId">{{item.nickName}}</Option>
				</Select>
			</FormItem>
			<FormItem label="抄送人" :md="12" :lg="8" :xl="6" :xxl="6" prop="ccUserIds">
				<Select  multiple filterable style="width:260px;"  v-model="approveModel.ccUserIds">
					<Option v-for="(item,index) in approveModel.queryCurrCaoSon"  :key="index"  :value="item.userId">{{item.nickName}}</Option>
				</Select>  
			</FormItem>
			
			
			<FormItem prop="isFlag" :label-width="0">
				<div class="isFlexSpace">
					<div class="isFlexSpace" style="width: 315px;">
						通过聊天发送给审批人<Switch v-model="approveModel.isFlag"></Switch>
					</div>
					<div style="flex:1;margin-left: 16px;">备注：将审批单和留言通过聊天发送给第一审批人</div>
				</div>
			</FormItem>
			<FormItem label="留言" :md="12" :lg="8" :xl="6" :xxl="6" class="hxy-mt-20" prop="leaveMessage">
				<Input  style="width:260px;"  v-model="approveModel.leaveMessage"></Input>
			</FormItem>
		</Form>
	</div>
</template>
<script>
	export default {
		props:{
			name : Number
		},
		data(){
			return {
				approveModel : {
					approvalTempId : "",		//审批模板id
					approvalUserIds: "",		//审批的id集合
					ccUserIds	   : "",		//抄送的id集合
					examineUserIds : "",		//审核的id集合
					
					
					//数据集合
					queryCurrStaff : [],		//审批人
					queryCurrCaoSon: [],		//抄送人
					queryCurExaine : [],		//审核人
					
					//其它
					remarkUser     : "",		//第一审批人
					isFlag         : false,		//是否通过聊天发送审批人,暂时没用到可以忽略
					leaveMessage   : "",		//留言
				},
				
				//用来回填过虐判断的，其它没有任何作用
				approvalUserId : [],
				ccUserId	   : [],
				examinecUserId : []
			}
		},
		methods:{
			//获取审批人、抄送人、审核人下拉框数据
			setData_mount(data){
				this.approveModel.queryCurrStaff = data;
				this.approveModel.queryCurrCaoSon = data;
				this.approveModel.queryCurExaine = data;
			},
			//初始化数据回填，默认显示审批人跟抄送人
			setData_init(res){
				this.approveModel.approvalTempId = res.data.id;		// 模板id
				res.data.approvalList.forEach(item => {			    // 审批人id
					this.approvalUserId.push(item.userId)
				})
				res.data.ccList.forEach(item => { 					// 抄送人id
					this.ccUserId.push(item.userId)
				})
				res.data.examineList.forEach(item => { 				// 审核人id
					this.examinecUserId.push(item.userId)
				})
				//过滤出当前的审批数据，与模板中数据如果匹配就显示
				this.approveModel.queryCurrStaff.filter(item => {
					if (this.approvalUserId.indexOf(item.userId) !== -1 ) {
						this.approveModel.approvalUserIds = item.userId	 //反显审批人
					}
				})
				this.approveModel.queryCurrCaoSon.filter(item => {
					if (this.ccUserId.indexOf(item.userId) !== -1 ) {
						this.approveModel.ccUserIds = item.userId 		 //反显抄送人
					}
				})
				this.approveModel.queryCurrCaoSon.filter(item => {
					if (this.examinecUserId.indexOf(item.userId) !== -1 ) {
						this.approveModel.examineUserIds = item.userId 		 //反显审核人
					}
				})
			},
			
			clearData(){
				this.$refs['approve_form_ref'].resetFields();
			},
			check_role(){													//自定义校验
				if(this.approveModel.approvalUserIds==''){				
					this.$Message.error("审批人不能为空！");
					return -1
				}
				if(this.approveModel.ccUserIds==''){
					this.$Message.error("抄送人不能为空！");
					return -1
				}
				if(this.approveModel.examineUserIds==''){
					this.$Message.error("审核人不能为空！");
					return -1
				}
				var obj = {													//如果验证通过就返回id集合
					approvalTempId  : this.approveModel.approvalTempId,
					approvalUserIds : this.approveModel.approvalUserIds,
					ccUserIds       : this.approveModel.ccUserIds,
					examineUserIds  : this.approveModel.examineUserIds,
					leaveMessage    : this.approveModel.leaveMessage
				}
				return obj
			}
		}
	}
</script>
<style>
</style>
