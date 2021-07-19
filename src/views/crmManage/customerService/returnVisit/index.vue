<template>
	<div class="productLib">
		<tab-menu></tab-menu>
		<div class="hxy-mb-30">
			<!-- <Button class="hxy-mr-20"  @click=" returnVisit = true">周期 /主动回访</Button> -->
			<!-- <Button class="hxy-mr-20"  @click="customerComplaintReturnVisit">客诉回访</Button> -->
			<Tabs value="true" type="card" :animated="false" @on-click="changeTabs">
				<TabPane label="周期 /主动回访" name="true"></TabPane>
				<TabPane label="客诉回访" name="false"></TabPane>
			</Tabs>
		</div>
		<div class="search">
			<Form ref="formInline" :label-width="100" :model="search">
				<Row>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="回访类型" prop="backLeiX">
							<Select v-model="search.backLeiX" clearable>
								<Option v-for="item in search.backLeiXData" :disabled='item.backLeiXAble' :value="item.value" :key="item.value">{{ item.label }}</Option>
							</Select>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="回访状态" :md="12" :lg="8" :xl="6" :xxl="6" prop="backState">
							<Select v-model="search.backState" clearable>
								<Option v-for="item in search.backStateData" :value="item.value" :key="item.value">{{ item.label }}</Option>
							</Select>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="客户名称" :md="12" :lg="8" :xl="6" :xxl="6" prop="customerName">
							<Input v-model="search.customerName"  :label-in-value="true" clearable></Input>
							<!-- <Select  v-model="search.customerName"  :label-in-value="true" clearable>
								<Option  v-for="(val,index) in customerList" :value="val.companyName" :key="index">{{val.companyName}}</Option>
							</Select> -->
						</FormItem>
					</Col>
					
				</Row>
				<Row>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="回访人" :md="12" :lg="8" :xl="6" :xxl="6" prop="backPreson">
							<Input v-model="search.backPreson" placeholder="请输入回访人" clearable></Input>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="回访日期" :md="12" :lg="8" :xl="6" :xxl="6" prop="backTime">
							<DatePicker clearable v-model="search.backTime"  type="date"  style="width: 100%"  @on-change="changeDate"  placeholder="请选择"></DatePicker>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="回访方式" :md="12" :lg="8" :xl="6" :xxl="6" prop="backTypeId">
							<Select v-model="search.backTypeId" clearable>
								<Option v-for="item in search.backTypeData" :value="item.value" :key="item.value"  placeholder="请选择">{{ item.label }}</Option>
							</Select>
						</FormItem>
					</Col>
				</Row>
				<Col span="24" class="tr">
					<Button type="primary" @click="handleSearch()" icon="ios-search" class="hxy-mr-10">搜索</Button>
					<Button type="default" @click="handleReset('formInline')" icon="ios-refresh">清空</Button>
				</Col>
			</Form>
		</div>

		
		<div  v-show='returnVisit'>
			<div class="hxy-mb-30">
				<Button class="hxy-mr-20"    @click="open_btn_add">新增回访</Button>
				<!-- <Button type="primary" class="hxy-mr-20"    @click="open_btn_add">转移</Button> -->
				<!--<Button type="warning" class="hxy-mr-20" @click="TranFlag=true">栏目标题</Button>
				<Button type="error" class="hxy-mr-20"   @click="deleteDataAll" :disabled="ids==''">删除</Button> -->
			</div>
			
			
			<div class="hxy-mb-25">
				<Table stripe border :columns="taskListTitle" :data="taskListData" :loading="pageLoading" @on-selection-change="selectChange"></Table>
			</div>
			<div class="pos-r tr">
				<Page :total="pageInfo.total" :page-size="search.pageSize" :current="search.pageNum" @on-change="changePage" @on-page-size-change="changePageSize"    show-total show-sizer show-elevator />
			</div>
			

			<!-- 新增回访 -->
			<Modal v-model="addBus"  width = "700"  title="新增回访"   :footer-hide="true">
				<!-- <div class="isFlexSpace" style="width: 300px;"><span>录入人:{{user.nickName}}</span></div> -->
				<!-- <div class="hxy-mt-15 hxy-mb-20">回访类型：主动回访</div> -->
				<Form  ref="addModel_ref" :model="addModel"  :rules="addRule"  :label-width="140" label-position="left">
					<Row>
						<Col span="13">
							<FormItem label="客户名称" prop="customerName" :md="12" :lg="8" :xl="6" :xxl="6">
								<Select v-model="addModel.customerName" placeholder="请输入客户名称" @on-change="custSel">
									<Option v-for="(item,index) in customerList" :value="item.id" :key="index">{{item.companyName}}</Option>
								</Select>
							</FormItem>
						</Col>
					</Row>
					<Row>
						<Col span="13">
							<FormItem label="受理单编号" prop="crmApplyBillId" :md="12" :lg="8" :xl="6" :xxl="6">
								<Select filterable v-model="addModel.crmApplyBillId" placeholder="请输入客户名称">
									<Option v-for="(item,index) in acceptFormID" :value="item" :key="index">{{item}}</Option>
								</Select>
							</FormItem>
						</Col>
					</Row>
					
					
				<!-- 	<Row>
						<Col span="13">
							<FormItem label="关联合同" prop="contractId">
								<Select v-model="addModel.contractId" placeholder="请选择合同编号"   @on-change="custWorkSel" style="width: 100%;">
									<Option v-for="(item,index) in contractData" :value="item.id" :key="index">{{item.contractNo}}</Option>
								</Select>
							</FormItem>
						</Col>
					</Row> -->
					<Row>
						<Col span="13">
							<FormItem label="联系人" prop="crmCustomerContactId">
								<Select v-model="addModel.crmCustomerContactId" placeholder="请选择联系人名称"   >
									<Option v-for="(item,index) in crmCustomerContactData" :value="item.id" :key="index">{{item.contactName}}</Option>
								</Select>
							</FormItem>
						</Col>
					</Row>
					<Row>
						<Col span="13">
							<FormItem label="回访方式" prop="returnVisitMode">
								<Select v-model="addModel.returnVisitMode" placeholder="请选择回访方式" >
									<Option v-for="item in returnVisitModeData" :value="item.value" :key="item.value" >{{ item.label }}</Option>
								</Select>
							</FormItem>
						</Col>
					</Row>
					<Row>
						<Col span="13">
							<FormItem label="回访内容" prop="returnVisitContent"><Input v-model="addModel.returnVisitContent" ></Input></FormItem>
						</Col>
					</Row>
					<Row>
						<Col span="13">
							<FormItem label="客户反馈" prop="customerFeedback"><Input v-model="addModel.customerFeedback"></Input></FormItem>
						</Col>
					</Row>
					<Row>
						<Col span="13">
							<div class="isFlexSpace" style="margin-bottom: 25px;">
								<span>新增客户需求</span>
								<Switch v-model="addModel.isAddDemand"  />
							</div>
						</Col>
					</Row>
					<Row v-if="addModel.isAddDemand">
						<Col span="13">
							<FormItem label="需求内容" prop="demandContent"><Input v-model="addModel.demandContent"></Input></FormItem>
						</Col>
					</Row>
					<Row v-if="addModel.isAddDemand">
						<Col span="13">
							<FormItem label="需求执行人" prop="demandExecuteUserId">
								<Select  multiple clearable filterable  v-model="addModel.demandExecuteUserId" placeholder="请添加需求执行人">
									<Option v-for="(item,index) in demandExecuteData"  :key="index"  :value="item.userId">{{item.nickname}}</Option>
								</Select>
							</FormItem>
						</Col>
					</Row>
					<modalUpLoad upLoadText="上传附件" @listenFile="listenFileOne" ref="file_ref_one"></modalUpLoad>
				<!-- 	<Row>
						<Col span="13">
							<div class="isFlexSpace" style="margin-top: 25px;">
								<span>是否回访结束</span>
								<Switch   v-model="addModel.isFinish" />
							</div>
						</Col>
					</Row> -->
					
					
					<modalBtn :isScroll="true" @sureBtn="sureBtn('addModel_ref')"  @cancleBtn="addBus=false"></modalBtn>
				</Form>
			</Modal>
			
			
			<!-- 回访 -->
			<Modal v-model="backSheet"  width ="700"  title="回访"   :footer-hide="true">
				<Form  ref="backModel_ref" :model="backModel"  :rules="backRule"  :label-width="140" label-position="left">
					<Row>
						<Col>
							<FormItem label="联系人" prop="crmCustomerContactId">
								<Select v-model="backModel.crmCustomerContactId" placeholder="请选择联系人名称" clearable filterable>
									<Option v-for="(item,index) in backModel.crmCustomerContactData" :value="item.id" :key="index">{{item.contactName}}</Option>
								</Select>
							</FormItem>
						</Col>
					</Row>
					<Row>
						<Col>
							<FormItem label="回访方式" prop="returnVisitMode">
								<Select v-model="backModel.returnVisitMode" style="width:186px">
									<Option v-for="item in returnVisitModeData" :value="item.value" :key="item.value" >{{ item.label }}</Option>
								</Select>
							</FormItem>
						</Col>
					</Row>
					<Row>
						<Col>
							<FormItem label="回访内容" prop="returnVisitContent"><Input v-model="backModel.returnVisitContent" ></Input></FormItem>
						</Col>
					</Row>
					<Row>
						<Col>
							<FormItem label="客户反馈" prop="customerFeedback"><Input v-model="backModel.customerFeedback" ></Input></FormItem>
						</Col>
					</Row>
					<Row>
						<Col>
							<div class="isFlexSpace" style="width: 325px;margin-bottom: 25px;">
								<span>新增客户需求</span>
								<Switch  v-model="backModel.isAddDemand" />
							</div>
						</Col>
					</Row>
					<Row v-if="backModel.isAddDemand">
						<Col>
							<FormItem label="需求内容" prop="demandContent"><Input v-model="backModel.demandContent"></Input></FormItem>
						</Col>
					</Row>
					<Row v-if="backModel.isAddDemand">
						<Col>
							<FormItem label="需求执行人" prop="demandExecuteUserId">
								<Select  multiple  :filterable="true"   style="width:260px;"  v-model="backModel.demandExecuteUserId">
									<Option v-for="(item,index) in demandExecuteData"  :key="index"  :value="item.userId">{{item.userName}}</Option>
								</Select> 
							</FormItem>
						</Col>
					</Row>
					<modalUpLoad upLoadText="上传附件" @listenFile="listenFileTow" ref="file_ref_tow"></modalUpLoad>
					<!-- <Row>
						<Col>
							<div class="isFlexSpace" style="width: 325px;margin-top: 25px;">
								<span>是否回访结束</span>
								<Switch  v-model="backModel.isFinish"  />
							</div>
						</Col>
					</Row> -->
					<modalBtn sureText="确认"   @sureBtn="sureBtn('backModel_ref')"  @cancleBtn="backSheet=false"></modalBtn>
				</Form>
			</Modal>
			
			<!-- 受理单 -->
			<Modal v-model="applyBillMod"  width = "600"  title="受理单记录"   :footer-hide="true">
				<div>

					<Table stripe border :columns="applyBillTit" :data="applyBillDate"  @on-selection-change="selectChange">
						<!-- <template slot-scope="{ row }" slot="demandExecuteUserIds" >
							<div style="height: 15px;"></div>
							<div v-for="(item,num) in row.demandExecuteUserIds" :key="num" >
								<div class="hxy-mb-15">
									<span style="margin-right: 15px">{{item.displayName}};</span>
								</div>
							</div>
							<span v-if="!row.demandExecuteUserIds">暂无</span>
						</template>
						
						
						
						<template slot-scope="{row}" slot="file" >
							<lookFile :row='row.uploadFiles'></lookFile>
						</template> -->
					</Table>
				</div>
				<modalBtn sureText="确认"   @sureBtn="applyBillMod=false"  @cancleBtn="applyBillMod=false"></modalBtn>
			</Modal>
			<!-- 客户档案 -->
			<Modal title="客户档案记录" :width="720" :mask-closable="false" :scrollable="true" v-model="profileMod">
				<div slot="footer">
					<Button @click="profileMod = false">取消</Button>
					<Button type="primary" class="btn-warning" @click="profileMod = false">确定</Button>
				</div>
				<Tabs>
					<TabPane label="基础信息" :disabled="baseInfo">
						<Form :model="baseInfoPar" :label-width="130">
							<FormItem label="客户名称" prop="companyName">
								<Input v-model="baseInfoPar.companyName" clearable :disabled='customerDisabled'/>
							</FormItem>
							<FormItem label="统一社会信用代码" prop="creditCode">
								<Input v-model="baseInfoPar.creditCode" clearable disabled></Input>
							</FormItem>
							<FormItem label="实际经营地址" prop="actualAddress">
								<Input :disabled='customerDisabled' placeholder="" v-model="baseInfoPar.actualAddress" clearable></Input>
							</FormItem>
							<FormItem label="所属行业" prop="industry">
								<Select
									v-model="baseInfoPar.industry"
									filterable
									:disabled='customerDisabled'
									clearable
									>
									<Option v-for="(item, index) in industry" :key="index" :value="item.value">{{item.label}}</Option>
								</Select>
							</FormItem>
							<FormItem label="人员规模" prop="staffSize">
								<Select
									v-model="baseInfoPar.staffSize"
									filterable
									:disabled='customerDisabled'
									clearable
									>
									<Option v-for="(item, index) in staffSizeOpt" :key="index" :value="item.value">{{item.label}}</Option>
								</Select>
							</FormItem>
							<FormItem label="E-mail" prop="email">
								<Input :disabled='customerDisabled' placeholder="" v-model="baseInfoPar.email" clearable></Input>
							</FormItem>
							<FormItem label="网址" prop="website">
								<Input :disabled='customerDisabled' placeholder="" v-model="baseInfoPar.website" clearable></Input>
							</FormItem>
							<FormItem label="企业联系电话" prop="telephone">
								<Input type='number' :disabled='customerDisabled' placeholder="" v-model="baseInfoPar.telephone" clearable></Input>
							</FormItem>
							<FormItem label="曾用名" prop="usedName">
								<Input :disabled='customerDisabled' placeholder="" v-model="baseInfoPar.usedName" clearable></Input>
							</FormItem>
							<FormItem label="营业期限" prop="usinessTime">
								<DatePicker 
									type="daterange"
									v-model="businessTime"
									placeholder="" 
									:editable="false" 
									placement="bottom-start"
									format="yyyy-MM-dd"
									:disabled='customerDisabled'
									clearable>
								</DatePicker>
							</FormItem>
							<FormItem label="公司类型" prop="comCharacter">
								<Select
									v-model="baseInfoPar.comCharacter"
									filterable
									:disabled='customerDisabled'
									clearable
									>
									<Option v-for="(item, index) in companyType" :key="index" :value="item.value">{{item.label}}</Option>
								</Select>
							</FormItem>
							<FormItem label="参保人数" prop="insuranceCount">
								<Input :disabled='customerDisabled' placeholder="" v-model="baseInfoPar.insuranceCount" clearable></Input>
							</FormItem>
							<FormItem label="注册地址" prop="registerAddress">
								<Input :disabled='customerDisabled' placeholder="" v-model="baseInfoPar.registerAddress" clearable></Input>
							</FormItem>
							<FormItem label="经营范围" prop="bussinessScope">
								<Input :disabled='customerDisabled' placeholder="" v-model="baseInfoPar.bussinessScope" clearable></Input>
							</FormItem>
							<FormItem label="成立日期" prop="registerTime">
								<DatePicker 
									type="date"
									v-model="baseInfoPar.registerTime" 
									placeholder="" 
									:editable="false" 
									placement="bottom-start"
									format="yyyy-MM-dd"
									:disabled='customerDisabled'
									clearable>
								</DatePicker>
							</FormItem>
							<FormItem label="注册资本" prop="registerCapital">
								<Input type='number' :disabled='customerDisabled' placeholder="" v-model="baseInfoPar.registerCapital" clearable></Input>
							</FormItem>
							<FormItem label="实缴资本" prop="payCapital">
								<Input type='number' :disabled='customerDisabled' placeholder="" v-model="baseInfoPar.payCapital" clearable></Input>
							</FormItem>
							<FormItem label="纳税人识别号" prop="taxNumber">
								<Input :disabled='customerDisabled' placeholder="" v-model="baseInfoPar.taxNumber" clearable></Input>
							</FormItem>
							<FormItem label="登记机关" prop="registerDepartment">
								<Input :disabled='customerDisabled' placeholder="" v-model="baseInfoPar.registerDepartment" clearable></Input>
							</FormItem>
							<FormItem label="开户行" prop="accountBank">
								<Input :disabled='customerDisabled' placeholder="" v-model="baseInfoPar.accountBank" clearable></Input>
							</FormItem>
							<FormItem label="账户名" prop="accountName">
								<Input :disabled='customerDisabled' placeholder="" v-model="baseInfoPar.accountName" clearable></Input>
							</FormItem>
							<FormItem label="账户号" prop="accountNumber">
								<Input type='number' :disabled='customerDisabled' placeholder="" v-model="baseInfoPar.accountNumber" clearable></Input>
							</FormItem>
						</Form>
					</TabPane>
					<TabPane label="联系人信息" :disabled="contactInfo">
						<!-- <div class="hxy-mb-15" v-show="customerDisabled === false">
							<Button @click="handleContacts">添加联系人</Button>
						</div> -->
						<div class="hxy-mb-25">
							<Table border :columns="contactListTitle" :data="listContact"></Table>
						</div>
					</TabPane>
					<TabPane label="决策人信息" :disabled="decisionsInfo">
						<!-- <div class="hxy-mb-15" v-show="customerDisabled === false">
							<Button @click="handleAddShareholderBtn">添加决策人信息</Button>
						</div> -->
						<div class="hxy-mb-25">
							<Table border :columns="listShareholderTitle" :data="listShareholder"></Table>
						</div>
					</TabPane>
					<TabPane label="补充信息" :disabled="pointInfo">
						<Form ref="supplementaryInfo" :label-width="100" :model="extraInfo">
							<FormItem label="客户种类" prop="custCategory">
								<Select
									v-model="extraInfo.custCategory"
									filterable
									:disabled='customerDisabled'
									clearable
									>
									<Option v-for="(item, index) in custCategoryOpt" :key="index" :value="item.value">{{item.label}}</Option>
								</Select>
							</FormItem>
							<FormItem label="客户状态" prop="custStatus">
								<Select
									v-model="extraInfo.custStatus"
									filterable
									:disabled='customerDisabled'
									clearable
									>
									<Option v-for="(item, index) in custStatusOpt" :key="index" :value="item.value">{{item.label}}</Option>
								</Select>
							</FormItem>
							<FormItem label="客户渠道" prop="custChannel">
								<Select v-model="extraInfo.custChannel" clearable :disabled='customerDisabled'>
									<Option v-for="(item,index) in customerChannel" :key="index" :value="item.value">{{item.label}}</Option>
								</Select>
							</FormItem>
							<FormItem label="意向购买产品" prop="purposeProduct">
								<Input  placeholder="" v-model="extraInfo.purposeProduct" :disabled='customerDisabled'></Input>
							</FormItem>
							<FormItem label="客户意向描述" prop="purposrDesc">
								<Input  placeholder="" v-model="extraInfo.purposrDesc" :disabled='customerDisabled'></Input>
							</FormItem>

							<FormItem label="回访周期" prop="visitCycleType">
								<Select v-model="extraInfo.visitCycleType" filterable :disabled='customerDisabled'>
									<Option v-for="(item, index) in dayFrequencyOpt" :key="index" :value="item.value">{{item.label}}</Option>
								</Select>
							</FormItem>
							<FormItem label="">
								<Select :disabled='customerDisabled' v-show="visitCycleType === '1' || visitCycleType === '3' " placeholder="" v-model="extraInfo.visitCycle">
									<Option v-for="(item,index) in visitCycleOpt" :key="index" :value="item.label">{{item.label}}</Option>
								</Select>
								<DatePicker v-show="visitCycleType === '2' || visitCycleType === '4' || visitCycleType === '5'" v-model="extraInfo.visitCycle" type="date" placeholder=""></DatePicker>
							</FormItem>

							<FormItem label="开始时间" prop="visitStartTime">
								<DatePicker 
									type="date"
									v-model="extraInfo.visitStartTime" 
									placeholder="开始时间" 
									:editable="false" 
									placement="bottom-start" 
									style="width: 100%"
									:disabled='customerDisabled'
									clearable>
								</DatePicker>
							</FormItem>
							<FormItem label="结束时间" prop="visitEndTime">
								<DatePicker
									type="date"
									v-model="extraInfo.visitEndTime"
									placeholder="结束时间"
									:editable="false"
									placement="bottom-start"
									style="width: 100%"
									:disabled='customerDisabled'
									clearable>
								</DatePicker>
							</FormItem>

							<FormItem label="上游客户" prop="upstreamCust">
								<Input  placeholder="" v-model="extraInfo.upstreamCust" :disabled='customerDisabled' clearable></Input>
							</FormItem>
							<FormItem label="所属客户上游行业" prop="upstreamIndustry">
								<Select placeholder="" v-model="extraInfo.upstreamIndustry" :disabled='customerDisabled' clearable>
									<Option v-for="(item,index) in industry" :key="index" :value="item.value">{{item.label}}</Option>
								</Select>
							</FormItem>
							<FormItem label="下游供应商" prop="downstreamCust">
								<Input  placeholder="" v-model="extraInfo.downstreamCust" :disabled='customerDisabled' clearable></Input>
							</FormItem>
							<FormItem label="所属客户下游行业" prop="downstreamIndustry">
								<Select placeholder="" v-model="extraInfo.downstreamIndustry" :disabled='customerDisabled' clearable>
									<Option v-for="(item,index) in industry" :key="index" :value="item.value">{{item.label}}</Option>
								</Select>
							</FormItem>
							<FormItem label="企业规划" prop="plan">
								<Input  placeholder="" v-model="extraInfo.plan" :disabled='customerDisabled' clearable></Input>
							</FormItem>
							<!-- <FormItem label="附件" prop="files">
								<modalUpLoad upLoadText="上传附件" @listenFile="listenFile" ref="fileOne"></modalUpLoad>
							</FormItem> -->
						</Form>
					</TabPane>
				</Tabs>
			</Modal>

			<!-- 合同 -->
			<Modal v-model="contractMod"  width = "600"  title="合同记录"   :footer-hide="true">
				<div>
					<Table stripe border :columns="contractModTitle" :data="contractModDate"  @on-selection-change="selectChange">
						<template slot-scope="{ row }" slot="demandExecuteUserIds" >
							<div style="height: 15px;"></div>
							<div v-for="(item,num) in row.demandExecuteUserIds" :key="num" >
								<div class="hxy-mb-15">
									<span style="margin-right: 15px">{{item.displayName}};</span>
								</div>
							</div>
							<span v-if="!row.demandExecuteUserIds">暂无</span>
						</template>
						
						
						
						<template slot-scope="{row}" slot="file" >
							<lookFile :row='row.uploadFiles'></lookFile>
						</template>
					</Table>
				</div>
				<modalBtn sureText="确认"   @sureBtn="contractMod=false"  @cancleBtn="contractMod=false"></modalBtn>
			</Modal>

			<!-- 回访记录 -->
			<Modal v-model="backHis"  width = "600"  title="回访记录"   :footer-hide="true">
				<div>
					<Table stripe border :columns="backHisTitle" :data="backHisData"  @on-selection-change="selectChange">
						<template slot-scope="{ row }" slot="demandExecuteUserIds" >
							<div style="height: 15px;"></div>
							<div v-for="(item,num) in row.demandExecuteUserIds" :key="num" >
								<div class="hxy-mb-15">
									<span style="margin-right: 15px">{{item.displayName}};</span>
								</div>
							</div>
							<span v-if="!row.demandExecuteUserIds">暂无</span>
						</template>
						
						
						
						<template slot-scope="{row}" slot="file" >
							<lookFile :row='row.uploadFiles'></lookFile>
						</template>
					</Table>
				</div>
				<modalBtn sureText="确认"   @sureBtn="backHis=false"  @cancleBtn="backHis=false"></modalBtn>
			</Modal>
			

			<!-- 列表查看详情 -->
			<Modal  v-model="lookSheet" width = "600"  title="回访详情">	
				<Row :gutter="10" class="hxy-mb-20">
					<Col span="12">
						录入人：{{tableInfo.createByName || '-'}}
					</Col>
					<Col span="12">
						受理单编号 ：{{tableInfo.returnVisitTypeName || '-'}}
					</Col>
				</Row>
				<Row :gutter="10" class="hxy-mb-20">
					<Col span="12">
						客户名称 ：{{tableInfo.customerName || '-'}}
					</Col>
					<!-- <Col span="12">
						关联合同：{{tableInfo.contractNo || '-'}}
					</Col> -->
				</Row>
				<Row :gutter="10" class="hxy-mb-20">
					<Col span="12">
						回访类型 ：{{tableInfo.returnVisitTypeName || '-'}}
					</Col>
					<Col span="12">
						回访状态：{{tableInfo.statusName || '-'}}
					</Col>
				</Row>
				
				<!-- <Row :gutter="10" class="hxy-mb-20">
					<Col span="12">
						到账时间 ：{{tableInfo.arrivalTime || '-'}}
					</Col>
					<Col span="12">
						到账金额 ：{{tableInfo.arrivalAmount || '-'}}
					</Col>
				</Row>
				<Row :gutter="10" class="hxy-mb-20" >
					<Col span="12">
						单号：{{tableInfo.dispatcId || '-'}}
					</Col>
					<Col span="12">
						派单时间 ：{{tableInfo.dispatcTime || '-'}}
					</Col>
				</Row>
				<Row :gutter="10" class="hxy-mb-20" >
					<Col span="12">
						投诉人：{{tableInfo.crmCustomerContactName || '-'}}
					</Col>
					<Col span="12">
						投诉时间 ：{{tableInfo.complaintTime || '-'}}
					</Col>
				</Row>
				<Row :gutter="10" class="hxy-mb-20" >
					<Col span="12">
						回访周期：{{tableInfo.returnVisitCycle || '-'}}
					</Col>
				</Row> -->
			</Modal>
			
			<!-- 栏目标题弹窗 -->
			<tranFer :dataShow="TranList"  :TranListNo="TranListNo"  @refresh= "refresh" @closeTran="closeTran"  v-show="TranFlag"></tranFer>
		</div>
		<div v-show='!returnVisit'>
			<div class="hxy-mb-25 hxy-mt-30">
				<Table stripe border :columns="taskComplaintTitle" :data="taskComplaintData" :loading="pageLoading" @on-selection-change="selectChange">
					<template slot-scope="{row}" slot="file_one" >
						<lookFile :row='row.files'></lookFile>
					</template>
				</Table>
			</div>
			<div class="pos-r tr">
				<Page :total="complaintPageInfo.total" @on-change="changeComplaintPage" @on-page-size-change="changeComplaintPageSize" show-total show-sizer show-elevator />
			</div>
			<!-- 详情 -->
			<Modal
				title="客诉详情"
				v-model="look_sheet"
				:mask-closable="false"
				:width="720">
				<div>
					<Row :gutter="10" class="hxy-mb-20">
						<Col span="12">
							客诉时间：{{look_Info.customerComplaintTime || ''}}
						</Col>
						<Col span="12">
							客户名称：{{look_Info.companyName || ''}}
						</Col>
					</Row>
					<Row :gutter="10" class="hxy-mb-20">
						<Col span="12">
							客诉状态：{{look_Info.customerComplaintStatusDesc || ''}}
						</Col>
						<Col span="12">
							联系人：{{look_Info.contactName || ''}}
						</Col>
					</Row>
					<Row :gutter="10" class="hxy-mb-20">
						<Col span="12">
							联系电话 ：{{look_Info.customerContactTelPhone || ''}}
						</Col>
						<Col span="12">
							客诉途径：{{look_Info.customerComplaintMethodDesc || ''}}
						</Col>
					</Row>
					<Row :gutter="10" class="hxy-mb-20">
						<Col span="12">
							指定客诉人 ：{{look_Info.guestComplainant || ''}}
						</Col>
						<Col span="12">
							客诉内容：{{look_Info.customerComplaintContent || ''}}
						</Col>
					</Row>
					<Row :gutter="10" class="hxy-mb-20">
						<Col span="12" >
							附件 ：
							<lookFile :row='look_Info.files'></lookFile>
						</Col>
					</Row>
					<!-- <modalUpLoad upLoadText=""  ref="look_file_ref"></modalUpLoad> -->
				</div>
			</Modal>
		</div>
		
		
		
		
		
	</div>
</template>
<script> 
import sendWishTemp from '_c/sendWish/sendWish'
import { getMasterDeptCustomer,queryCurrStaff, listContact, customerDocument } from '_s/customer'
import { findCustCant} from '_s/offerPrice'
import { getApplyListByCustomerId, applyBillList } from '_s/accepForm'
import { getContractByCustomerId, contractByCustomerId } from '_s/collection'
import { backList,backRemove,backAddMore,backAdd,backGetWorkNo,look_back_his, serve_list, listRewiew  } from '_s/serverSafe'
import { mapGetters } from 'vuex'
export default {
    data(){
        return{
			returnVisit: true, // true 表示周期、主动回访  false 表示客诉回访
			ids	   : [],
			search : {
				backLeiX : "",
				backLeiXData : [],
				backState  : "",
				backStateData: [],
				customerName : " ",
				backPreson:"",
				backTime : "",
				backTypeId:"",
				backTypeData:[],
				pageSize: 10,
				pageNum: 1
			},
			backLeiXAble: false, // 禁用某项回访类型
			pageInfo  : {
				total   : 0
			},
			getNowTime:"",
			
			//共有参数
			customerList: [],			//客户名称集合
			contractData: [],			//合同数据
			returnVisitModeData:[],		//回访数据
			demandExecuteData : [],		//需求执行人数据
			acceptFormID: [], // 受理单id
			crmCustomerContactData:[],	//联系人数据
			
			//以下是新增回访
			addBus  : false,
			addModel: {
				customerId	: "",			//客户名称id
				contractId  : "",			//合同id
				contractNo	: "",			//合同号
				crmCustomerContactId:"",	//联系人id
				returnVisitContent : "",	//回访内容
				returnVisitMode	   : "",	//回访方式
				customerFeedback   : "",	//客户反馈
				demandContent 	   : "",	//需求内容
				demandExecuteUserId: "",	//需求执行人
				isAddDemand		   : false,		//是否新增需求
				isFinish		   : false,		//是否结束回访
				uploadFiles		   : []
			},
			addRule: {
				customerName: [
					{ required: true, message: '此项为必填项', trigger: 'change',type:"number" }
				],
				crmApplyBillId: [
					{ required: true, message: '此项为必填项', trigger: 'change', type: 'Array'}
				],
				contractId: [
					{ required: true, message: '此项为必填项', trigger: 'change',type:"number" }
				],
				crmCustomerContactId: [
					{ required: true, message: '此项为必填项', trigger: 'change',type:"number"}
				],
				returnVisitMode: [
					{ required: true, message: '此项为必填项', trigger: 'change' }
				],
				returnVisitContent: [
					{ required: true, message: '此项为必填项', trigger: 'blur' }
				],
				customerFeedback: [
					{ required: true, message: '此项为必填项', trigger: 'blur' }
				],
			},
			pageLoading : false,//页面loading动画
			applyBillMod: false,
			applyBillTit: [{
                title: '序号',
                render:(h,params)=>{
                    return h("span" ,{
                    },params.index+1)
                }
            },{
                title: '受理单编号',
                key: "applyBillCode",
            }],
			applyBillDate: [],
			// 客户档案记录
			industry: [],
			staffSizeOpt: [],
			custCategoryOpt: [],
			custStatusOpt: [],
			followupStageOpt: [],
			followSatausOpt: [],
			dayFrequencyOpt: [],
			custRelationOpt: [],
			sysUserSexOpt: [],
			contactTypeOpt: [],
			companyType: [],
			customerChannel: [],
			registerTime: [],
			healthStatus: [],
            visitCycleType: null, // 回访周期类型
			listShareholderTitle: [{
                title: '序号',
                width: 80,
                render:(h,params)=>{
                    return h("span" ,{
                    },params.index+1)
                }
            },{
                title: '姓名',
                width: 150,
                key: "shareholderName",
            },{
                title: '是否为决策人',
                width: 150,
                key: "executorName",
            },{
                title: '出生年月',
                width: 150,
                key: "birthday",
            },{
                title: '籍贯',
                width: 150,
                key: "nativePlace",
            },{
                title: '性别',
                width: 150,
                key: "sex",
            },{
                title: '电话',
                width: 150,
                key: "shareholderName",
            },{
                title: '职务',
                width: 150,
                key: "position",
            },{
                title: '家庭住址',
                width: 150,
                key: "homeAdd",
            },{
                title: '占股比例',
                width: 150,
                key: "stockRight",
            },{
                title: '在公司频率',
                width: 150,
                key: "incompanyHz",
            },{
                title: '关联公司',
                width: 150,
                key: "associationCompany",
            },{
                title: '每次对接印象',
                width: 150,
                key: "impress",
            }],
            listShareholder: [],
			contactListTitle: [{
                title: '序号',
                width: 80,
                render:(h,params)=>{
                    return h("span" ,{
                    },params.index+1)
                }
            },{
                title: '姓名',
                width: 100,
                key: "contactName",
            },{
                title: '性别',
                width: 80,
                key: "contactSexName",
            },{
                title: '职务',
                width: 100,
                key: "contactPosition",
            },{
                title: '部门',
                width: 100,
                key: "contactPost",
            },{
                title: '电话',
                width: 180,
                key: "contactMobile",
                align: 'companyAddress'
            },{
                title: '微信号',
                width: 180,
                key: "contactWechat",
                align: 'creditCode'
            },{
                title: '类型',
                width: 150,
                key: "contactTypeNmae",
            },{
                title: '爱好',
                width: 180,
                key: "hobby",
            },{
                title: '特殊日期',
                width: 180,
                key: "specialDate",
                align: 'staffSize'
            }],
            listContact: [], // 新增客户联系人
			customerDocumentMod: false,
            customerDisabled: false,
			profileMod: false,
			baseInfo: false,
            contactInfo: false,
            decisionsInfo: false,
            pointInfo: false,
            baseInfoPar: {},
			extraInfo: {}, // 补充信息
            visitCycleOpt: [], // 回访周期选择项
			businessTime: [], // 营业期限
			customerDocumentTit: [{
                title: '序号',
                render:(h,params)=>{
                    return h("span" ,{
                    },params.index+1)
                }
            },{
                title: '客户档案',
                key: "contactName",
            }],
			customerDocumentDate: [],
			contractMod: false,
			contractModTitle: [{
                title: '序号',
                render:(h,params)=>{
                    return h("span" ,{
                    },params.index+1)
                }
            },{
                title: '合同编号',
                key: "contractNo",
            }],
			contractModDate: [],
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
					type : "index",
					resizable: true,
					align : "center",
					width: 80
				},
				{
					title: '受理单编号',
					key: 'backTypeName',
					align : "center",
					resizable: true,
				},
				{
					title: '客户名称',
					key: 'customerName',
					resizable: true,
					align : "center",
				},
				{
					title: '回访类型',
					key: 'returnVisitTypeName',
					align : "center",
					resizable: true,
				},
				{
					title: '回访状态',
					key: 'statusName',
					resizable: true,
					align : "center",
				},
				{
					title: '录入人',
					key: 'createByName',
					resizable: true,
					align : "center",
				},
				{
					title:'操作',
					width: 380,
					align : "center",
					fixed : "right",
					render: (h, params) => {
						return h('div', [
							// h('Button', {
							// 	props: {
							// 		type: 'text',
							// 		size: 'small'
							// 	},
							// 	on: {
							// 		click: () => {
							// 		}
							// 	}
							// }, '聊天室'),
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								on: {
									click: () => {
										this.open_back_his(params.row)
									}
								}
							}, '回访'),
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								on: {
									click: () => {
										this.applyBillMod = true
										this.applyBillDate = []
										getApplyListByCustomerId({ id: params.row.customerId }).then(res => {
											if (res.code === 200) {
												res.data.forEach(item => {
													let obj = {
														applyBillCode: item
													}
													this.applyBillDate.push(obj)
												})
											}
										})
									}
								}
							}, '受理单'),
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								on: {
									click: () => {
										this.profileMod = true
										customerDocument(params.row.customerId).then(res => {
											if (res.code === 200) {
												// this.customerDocumentDate = res.data
												this.customerDisabled = true // 禁用查看状态
												this.baseInfoPar = res.data.baseInfo // 基础信息
												this.listContact = res.data.listContact // 联系人信息
												this.listContact.forEach(item => { // 联系人列表反显爱好哦
													if (item.listHobby.length !== 0) {
														item.listHobby.forEach(el => {
															item.hobby = el.hobby
														})
													}
												})
												this.listContact.forEach(item => { // 联系人列表反显爱好哦
													if (item.listSpecialDate.length !== 0) {
														item.listSpecialDate.forEach(el => {
															item.specialDate = el.specialDate
														})
													}
												})
												this.listShareholder = res.data.listShareholder // 决策人信息
												this.extraInfo = res.data.extraInfo // 补充信息
												this.businessTime = this.baseInfoPar.businessTime.split(',')
											}
										})
									}
								}
							}, '客户档案'),
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								on: {
									click: () => {
										this.contractModDate = []
										this.contractMod = true
										contractByCustomerId(params.row.customerId).then(res => {
											if (res.code === 200) {
												res.data.forEach(item => {
													let obj = {
														contractNo: item
													}
													this.contractModDate.push(obj)
												})
											}
										})
									}
								}
							}, '合同'),
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								on: {
									click: () => {
										this.lookHis(params.row)
									}
								}
							}, '回访记录'),
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								on: {
									click: () => {
										console.log(params.row, '详情')
										this.lookMore(params.row)
									}
								}
							}, '详情')
						])
					}
				}
			],

			
			//回访
			backSheet : false,
			backModel : {
				crmCustomerContactId : "",	//联系人id
				crmCustomerContactData:[],	//联系人数据
				crmReturnVisitId	 : "",	//主表记录id
				returnVisitMode		 : "",	//回访方式
				returnVisitContent	 : "",	//回访内容
				customerFeedback	 : "",	//客户反馈
				isAddDemand			 : false,	//是否新增需求
				demandContent		 : "",	//需求内容
				demandExecuteUserId	 : "",	//需求执行人
				isFinish			 : false,	//是否结束回访
				uploadFiles			 : [],
			},
			backRule: {
				crmCustomerContactId: [
					{ required: true, message: '请选择联系人', trigger: 'change',type:"number" }
				],
				returnVisitMode: [
					{ required: true, message: '请选择回访方式', trigger: 'change' }
				],
				returnVisitContent: [
					{ required: true, message: '请填写回访内容', trigger: 'blur' }
				],
				customerFeedback: [
					{ required: true, message: '请填写客户反馈', trigger: 'blur' }
				],
			},
			
			//回访记录
			backHis : false,
			backHisTitle : [
				{
					title: '序号',
					type: "index",
					resizable: true,
					align : "center",
					width: 80
				},
				{
					title: '回访人',
					key: "index",
					resizable: true,
					align : "center",
					width: 80
				},
				{
					title: '回访时间',
					key: "index",
					resizable: true,
					align : "center",
					width: 80
				},
				{
					title: '联系人',
					key: 'crmCustomerContactName',
					resizable: true,
					align : "center",
					width: 120
				},
				{
					title: '回访方式',
					key: 'backTypeName',
					resizable: true,
					align : "center",
					width: 100,
				},
				{
					title: '回访内容',
					key: 'returnVisitContent',
					resizable: true,
					align : "center",
					width: 200
				},		
				{
					title: '客户反馈',
					key: 'customerFeedback',
					resizable: true,
					align : "center",
					width: 150
				},	
				{
					title: '需求内容',
					resizable: true,
					align : "center",
					width: 200,
					render: (h, params) => {
						return h('div', [
							h('span', {
							}, params.row.demandContent || "暂无")
						])
					}
				},		
				{
					title: '需求执行人',
					slot : "demandExecuteUserIds",
					resizable: true,
					align : "center",
					width: 250,
				},	
				{
					title:'附件',
					slot :'file',
					width: 500,
					align : "center"
				}
			],
			backHisData : [],
			
			// 客诉回访
			taskComplaintData: [],
			taskComplaintTitle: [
				{
					type: 'selection',
					width: 60,
					resizable: true,
					align: 'center'
				},
				{
					title: '序号',
					type : 'index',
					resizable: true,
					align : "center",
					width: 80
				},
				{
					title: '客户名称',
					key: 'companyName',
					align : "center",
					resizable: true,
					width: 200
				},
				{
					title: '回访类型',
					key: 'crmReturnVisitIdName',
					resizable: true,
					align : "center",
					width: 200
				},
				{
					title: '回访状态',
					key: 'crmReturnStatusName',
					resizable: true,
					align : "center",
					width: 300
				},
				{
					title: '联系人',
					key: 'contactName',
					resizable: true,
					align : "center",
					width: 300
				},
				{
					title: '联系电话',
					key: 'customerContactTelPhone',
					resizable: true,
					align : "center",
					width: 150
				},
				{
					title: '客诉途径',
					key: 'customerComplaintMethodDesc',
					align : "center",
					resizable: true,
					width: 150
				},
				{
					title: '指定客诉人',
					key: 'guestComplainant',
					resizable: true,
					align : "center",
					width: 250
				},
				{
					title: '客诉内容',
					key: 'customerComplaintContent',
					align : "center",
					resizable: true,
					width: 150
				},
				// {
				// 	title: '图片',
				// 	slot: 'file_one',
				// 	key : "file_one",
				// 	align : "center",
				// 	resizable: true,
				// 	width: 220
				// },
				
				// {
				// 	title: '处理人',
				// 	key: 'customerComplaintContent',
				// 	align : "center",
				// 	resizable: true,
				// 	width: 150
				// },
				// {
				// 	title: '处理完成时间',
				// 	key: 'customerComplaintContent',
				// 	align : "center",
				// 	resizable: true,
				// 	width: 150
				// },
				{
					title: '处理方式',
					key: 'processingMethod',
					align : "center",
					resizable: true,
					width: 150
				},
				{
					title: '处理结果',
					key: 'processResult',
					align : "center",
					resizable: true,
					width: 150
				},
				{
					title: '备注',
					key: 'remark',
					align : "center",
					resizable: true,
					width: 150
				},
				{
					title: '责任人',
					key: 'responsibilityUsers',
					align : "center",
					resizable: true,
					width: 150
				},
				{
					title: '责任内容',
					key: 'responsibilityContent',
					align : "center",
					resizable: true,
					width: 150
				},
				{
					title:'操作',
					width: 380,
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
										this.open_back_his(params.row)
									}
								}
							}, '回访'),
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								on: {
									click: () => {
										this.applyBillDate = []
										this.applyBillMod = true
										getApplyListByCustomerId({ id: params.row.customerId }).then(res => {
											if (res.code === 200) {
												res.data.forEach(item => {
													let obj = {
														applyBillCode: item
													}
													this.applyBillDate.push(obj)
												})
											}
										})
									}
								}
							}, '受理单'),
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								on: {
									click: () => {
										this.profileMod = true
										customerDocument(params.row.customerId).then(res => {
											if (res.code === 200) {
												// this.customerDocumentDate = res.data
												this.customerDisabled = true // 禁用查看状态
												this.baseInfoPar = res.data.baseInfo // 基础信息
												this.listContact = res.data.listContact // 联系人信息
												this.listContact.forEach(item => { // 联系人列表反显爱好哦
													if (item.listHobby.length !== 0) {
														item.listHobby.forEach(el => {
															item.hobby = el.hobby
														})
													}
												})
												this.listContact.forEach(item => { // 联系人列表反显爱好哦
													if (item.listSpecialDate.length !== 0) {
														item.listSpecialDate.forEach(el => {
															item.specialDate = el.specialDate
														})
													}
												})
												this.listShareholder = res.data.listShareholder // 决策人信息
												this.extraInfo = res.data.extraInfo // 补充信息
												this.businessTime = this.baseInfoPar.businessTime.split(',')
											}
										})
									}
								}
							}, '客户档案'),
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								on: {
									click: () => {
										this.contractModDate = []
										this.contractMod = true
										contractByCustomerId(params.row.customerId).then(res => {
											if (res.code === 200) {
												res.data.forEach(item => {
													let obj = {
														contractNo: item
													}
													this.contractModDate.push(obj)
												})
											}
										})
									}
								}
							}, '合同'),
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								on: {
									click: () => {
										this.lookHis(params.row)
									}
								}
							}, '回访记录'),
							// h('Button', {
							// 	props: {
							// 		type: 'text',
							// 		size: 'small'
							// 	},
							// 	style : {
							// 		display : params.row.customerComplaintStatus == 2?"none":"inline-block"
							// 	},
							// 	on: {
							// 		click: () => {
							// 			this.cliChuli(params.row);
							// 		}
							// 	}
							// }, '处理'),
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								on: {
									click: () => {
										this.look_sheet= true;
										this.look_Info = params.row;
										this.$refs['look_file_ref'].changeData(params.row.pic)
									}
								}
							}, '详情'),
							// h('Button', {
							// 	props: {
							// 		type: 'text',
							// 		size: 'small'
							// 	},
							// 	on: {
							// 		click: () => {
							// 			this.handleCrmTemp()
							// 			this.open_talkSheet(params.row)
							// 		}
							// 	}
							// }, '报批')
							// h('Button', {
							// 	props: {
							// 		type: 'text',
							// 		size: 'small'
							// 	},
							// 	on: {
							// 		click: () => {
							// 			this.open_chuliHis(params.row)
							// 		}
							// 	}
							// }, '处理记录')
						])
					}
				}
			],
			complaintPageInfo : {
				pageNum : 1,
				pageSize:10,
				total   : 0
			},
			lookSheet : false,
			tableInfo  : "",
			isAgain    : true,
			//查看详情
			look_sheet : false,
			look_Info  : "",
			
			// 以下是穿梭框参数
			TranList  : [],	  //穿梭框左侧数据
			TranListNo: [],	  //不属于穿梭框左侧数据的，例如选择框，序号，操作详情
			TranFlag  : false,//开关
        }
    },
	components: {sendWishTemp},
	computed: {
		...mapGetters({
			config: 'get_config',
			user: 'get_userinfo'
		})
	},
	created() {
		this.getTranList();
		this.getNowTime = this.$util.getNowTime();
	},
    mounted(){
		this.search.backLeiXData  = this.filterDict(this.config,'crm_return_visit_type');  	 //回访类型
		this.search.backStateData = this.filterDict(this.config,'crm_return_visit_status');  //回访状态 
		this.search.backTypeData  = this.filterDict(this.config,'crm_return_visit_mode');    //回访方式
		this.returnVisitModeData  = this.filterDict(this.config,'crm_return_visit_mode'); 	 //回访方式-弹窗离的
		this.industry = this.filterDict(this.config,'industry')
        this.staffSizeOpt = this.filterDict(this.config,'staff_size') // 人员规模
        this.custCategoryOpt = this.filterDict(this.config,'cust_category')
        this.custStatusOpt = this.filterDict(this.config,'cust_sataus')
        this.followupStageOpt = this.filterDict(this.config,'follow_step')
        this.followSatausOpt = this.filterDict(this.config,'follow_sataus')
        this.dayFrequencyOpt = this.filterDict(this.config,'review_cycle')
        this.custRelationOpt = this.filterDict(this.config,'cust_relation')
        this.sysUserSexOpt = this.filterDict(this.config,'sys_user_sex') // 性别
        this.contactTypeOpt = this.filterDict(this.config,'contact_type') // 职位类型
        this.companyType = this.filterDict(this.config,'company_type') // 企业类型
        this.customerChannel = this.filterDict(this.config,'customer_channel')
        this.registerTime = this.filterDict(this.config,'register_time') // 成立时间
        this.healthStatus = this.filterDict(this.config,'health_status') // 健康状况
        this.isAlert = this.filterDict(this.config,'is_alert') // 是否定时提醒 
        this.wishType = this.filterDict(this.config,'wish_type') // 服务类型

		if (this.returnVisit) {
			this.search.backLeiXData.filter(item => {
				if (item.value.indexOf('2') !== -1) {
					item.backLeiXAble = true
				} else {
					item.backLeiXAble = false
				}
			})
		} 
		
		this.initList();
		this.getCustmer();
		this.getZhixing();
    },
    methods: {
		// 切换周期回访和客诉回访
		changeTabs(name) {
			if (name === 'true') {
				this.returnVisit = true
				this.$refs['formInline'].resetFields()
				this.search.backLeiXData.filter(item => {
					if (item.value.indexOf('2') !== -1) {
						item.backLeiXAble = true
					} else {
						item.backLeiXAble = false
					}
				})
				this.initList()
			} else {
				this.returnVisit = false
				this.$refs['formInline'].resetFields()
				this.search.backLeiXData.filter(item => {
					if (item.value.indexOf('3') !== -1 || item.value.indexOf('4') !== -1) {
						item.backLeiXAble = true
					} else {
						item.backLeiXAble = false
					}
				})
				this.complaintInitList()
			}
		},
		// 客诉回访列表
		complaintInitList(){
			let param = {	
				pageSize: this.complaintPageInfo.pageSize,
				pageNum: this.complaintPageInfo.pageNum,
				crmCustomerContactName:this.search.backPreson,	//回访人
				customerName : this.search.customerName,	//客户名称
				returnVisitMode : this.search.backTypeId,	//回访方式
				returnVisitType : this.search.backLeiX,			//回访类型
				reutrnVisitDate : this.search.backTime,			//回访日期
				status : this.search.backState,			//回访状态
				pageSize : this.search.pageSize,
				pageNum  : this.search.pageNum
			}
			listRewiew(param).then(res=>{
				this.taskComplaintData = res.rows;
				this.taskComplaintData.forEach(item => {
					this.search.backLeiXData.filter(el => {
						if (el.value.indexOf(item.crmReturnVisitId) !== -1) {
							item.crmReturnVisitIdName = el.label
						} 
					})
				})
				this.taskComplaintData.forEach(item => {
					this.search.backStateData.filter(el => {
						if (el.value.indexOf(item.crmReturnStatus) !== -1) {
							item.crmReturnStatusName = el.label
						} 
					})
				})
				this.complaintPageInfo.total = res.total;
				this.ids = [];
			})
		},
		//客户名称
		getCustmer(){
			getMasterDeptCustomer().then(res=>{
				this.customerList = res.data;
			})
		},
		//执行人数据
		getZhixing(){
			queryCurrStaff().then(res=>{
				this.demandExecuteData = res.data;
			})
		},
		//列表数据
		initList(){
			const param = {
				crmCustomerContactName:this.search.backPreson,	//回访人
				customerName : this.search.customerName,	//客户名称
				returnVisitMode : this.search.backTypeId,	//回访方式
				returnVisitType : this.search.backLeiX,			//回访类型
				reutrnVisitDate : this.search.backTime,			//回访日期
				status : this.search.backState,			//回访状态
				pageSize : this.search.pageSize,
				pageNum  : this.search.pageNum
			} 
			backList(param).then(res=>{
				if(res.code==200){
					// res.rows.forEach((item)=>{
					// 	this.$set(item,"backTypeName",this.search.backLeiXData[item.returnVisitType].label)	//回访类型
					// 	this.$set(item,"backStateName",this.search.backStateData[item.status].label)		//回访状态
					// })
					this.pageInfo.total = res.total
					this.taskListData = res.rows
					this.taskListData.forEach(item => {
						this.search.backLeiXData.filter(el => {
							if (el.value.indexOf(item.returnVisitType) !== -1) {
								item.returnVisitTypeName = el.label
							} 
						})
					})
					this.taskListData.forEach(item => {
						this.search.backStateData.filter(el => {
							if (el.value.indexOf(item.status) !== -1) {
								item.statusName = el.label
							} 
						})
					})
					this.ids = [];
				}
			})
		},
		// 回访客户时选择联系人
		custSel(e){
			this.$refs['addModel_ref'].resetFields();
			this.addModel.crmApplyBillId = []
			this.addModel.crmCustomerContactId = ''
			if(!e){
				return
			}
			// 获取受理单ID
			getApplyListByCustomerId({ id: e }).then(res=>{
				this.acceptFormID = res.data;
			})
			// 获取联系人数据
			const param = {
				crmCustomerId : e
			}
			listContact(e).then(res=>{
				this.crmCustomerContactData = res.data
			})
		},
		//关联合同编号下拉事件
		custWorkSel(e){
			if(e){
				for(var i=0;i<this.contractData.length;i++){
					var temp = this.contractData[i];
					if(temp.id==e){
						this.addModel.contractNo = temp.contractNo;
						break
					}
				}
			}else{
				this.addModel.contractId = "";
				this.addModel.contractNo = "";
			}
		},
		//打开新增回访
		open_btn_add(){
			this.$refs['addModel_ref'].resetFields();
			this.contractData = [];
			this.crmCustomerContactData=[];
			this.addModel.uploadFiles = [];
			this.$refs.file_ref_one.changeData(this.addModel.uploadFiles);
			this.addModel.isAddDemand = false;
			this.addModel.isFinish    = false;
			
			this.addBus = true;
		},
		//打开列表回访
		open_back_his(data){
			console.log(data, '987')
			this.$refs['backModel_ref'].resetFields();
			this.backModel.crmCustomerContactData = [];
			this.backModel.uploadFiles = [];
			this.$refs.file_ref_tow.changeData(this.backModel.uploadFiles);
			this.backModel.isAddDemand = false;
			this.backModel.isFinish    = false;
			//主键id
			this.backModel.crmReturnVisitId = data.id;
			let param
			//获取联系人数据
			if (!this.returnVisit) {
				param = {
					crmCustomerId : data.customerId
				}
			} else {
				param = {
					crmCustomerId : data.customerId
				}
			}
			findCustCant(param).then(res=>{
				this.backModel.crmCustomerContactData = res.rows;
				this.backSheet = true;
			})
		},
		//新增回访附件
		listenFileOne(data){
			this.addModel.uploadFiles = data;
		},
		//增加回访记录附件
		listenFileTow(data){
			this.backModel.uploadFiles = data;
		},
		
		
		
		
		// 多选框选中数据
		selectChange(selection) {
			this.ids = selection.map(item => item.id)
		},
		

		
		sureBtn(name) {
			this.$refs[name].validate((valid) => {
				if (valid) {
					if(this.isAgain){
						this.isAgain = false;
						switch(name){
							case "addModel_ref" : 
							this.add_back_api();
							break;
							case "backModel_ref" :
							this.add_back_more_api()
							break;
						}
					}
				}
			})
		},
		//新增回访
		add_back_api(){
			var param = {
				belongUserId: this.user.userId,				//所属人user_id
				customerId	: this.addModel.customerId,		//客户名称id
				contractId  : this.addModel.contractId,		//合同号id
				contractNo  : this.addModel.contractNo,		//合同编号
				crmApplyBillId: this.addModel.crmApplyBillId,	
				crmReturnVisitDetailDto : {
					crmCustomerContactId:this.addModel.crmCustomerContactId,//联系人id
					returnVisitContent : this.addModel.returnVisitContent,	//回访内容
					returnVisitMode	   : this.addModel.returnVisitMode,		//回访方式
					customerFeedback   : this.addModel.customerFeedback,	//客户反馈
					demandContent 	   : this.addModel.demandContent,		//需求内容
					demandExecuteUserIds : this.addModel.demandExecuteUserId,//需求执行人
					isAddDemand		   : this.addModel.isAddDemand?1:0,		//是否新增需求
					isFinish		   : this.addModel.isFinish?1:0,			//是否结束回访
				}
			}
			if(!this.addModel.isAddDemand){
				delete param.crmReturnVisitDetailDto.demandExecuteUserIds 
				delete param.crmReturnVisitDetailDto.demandContent
				backAdd(param).then(res=>{ 
					this.$Message.success(res.msg);
					this.addBus = false;
					this.initList();
					this.clearIsagain()
				}).catch(error=>{
					this.clearIsagain()
				})
			} else {
				if (this.addModel.demandContent && this.addModel.demandExecuteUserId) {
					backAdd(param).then(res=>{ 
						this.$Message.success(res.msg);
						this.addBus = false;
						this.initList();
						this.clearIsagain()
					}).catch(error=>{
						this.clearIsagain()
					})
				} else {
					this.$Message.info('请先填写新增的需求')
					this.addBus = false
				}
			}
		},
		//新增回访-继续增加回访
		add_back_more_api(){
			var param = {
				crmCustomerContactId : this.backModel.crmCustomerContactId,	//联系人id
				crmReturnVisitId	 : this.backModel.crmReturnVisitId,	//主表记录id
				returnVisitMode		 : this.backModel.returnVisitMode,	//回访方式
				returnVisitContent	 : this.backModel.returnVisitContent,	//回访内容
				customerFeedback	 : this.backModel.customerFeedback,	//客户反馈
				isAddDemand			 : this.backModel.isAddDemand ? 1 : 0,	//是否新增需求	
				demandContent		 : this.backModel.demandContent,	//需求内容
				demandExecuteUserIds : this.backModel.demandExecuteUserId,	//需求执行人
				// isFinish			 : this.backModel.isFinish,	// 是否结束回访
			}
			if(!this.backModel.isAddDemand){
				delete param.demandExecuteUserIds 
				delete param.demandContent 
			}
			backAddMore(param).then(res=>{
				this.$Message.success(res.msg);
				this.backSheet = false;
				this.initList();
				this.clearIsagain()
			}).catch(error=>{
				this.clearIsagain()
			})
		},
		clearIsagain(){
			setTimeout(()=>{
				this.isAgain = true;
			},1000)
		},
		//查看回访记录
		lookHis(data){
			let param
			if (!this.returnVisit) {
				param = data.crmReturnVisitId
			} else {
				param = data.id
			}
			look_back_his(param).then(res=>{
				console.log("res: " + JSON.stringify(res));
				if(res.code==200){
					res.data.forEach((item)=>{
						if(item.returnVisitMode){
							this.$set(item,'backTypeName',this.search.backTypeData[item.returnVisitMode].label)
						}else{
							this.$set(item,'backTypeName','-')
						}
					})
					this.backHisData = res.data;
					this.backHis  = true;
				}
			})
		},
		lookMore(data){
			this.tableInfo = data;
			this.lookSheet = true;
		},

		//删除
		deleteDataAll(){
			if(this.ids==''){
				this.$Message.error('请选择要删除的数据！');
				return
			}
			var _this = this;
			this.$Modal.confirm({
				title: "确定删除当前数据吗？",
				cancelText : "取消",
				onOk(){
					backRemove(_this.ids).then(res=>{
						if(res.code==200){
							this.$Message.success('Success!');
							_this.pageInfo.pageNum = 1;
							_this.initList();
						}
					})
				}
			});
		},
		changeDate(e){
			this.search.backTime = e;
		},
		
	
		
		// 搜索
		handleSearch() {
			this.search.pageNum = 1
			if (this.returnVisit) {
				this.initList();
			} else {
				this.complaintInitList()
			}
		},
		// 清空搜索
		handleReset(name) {
			this.$refs[name].resetFields();
			this.search.pageNum = 1
			this.initList()
		},
		// 当前页面
		changePage(pages) {
			this.pageInfo.pageNum = pages
			this.initList()
		},
		// 每页显示条数
		changePageSize(size) {
			this.pageInfo.pageSize = size
			this.initList()
		},
		// 当前页面
		changeComplaintPage(pages) {
			this.pageInfo.pageNum = pages
			this.initList()
		},
		// 每页显示条数
		changeComplaintPageSize(size) {
			this.pageInfo.pageSize = size
			this.initList()
		},
		//导出
		exportData(){
			const param = {
				crmCustomerContactName:this.search.backPreson,	//回访人
				customerName : this.search.customerName,		//客户名称
				returnVisitMode : this.search.backTypeId,		//回访方式
				returnVisitType : this.search.backLeiX,			//回访类型
				reutrnVisitDate : this.search.backTime,			//回访日期
				status : this.search.backState,					//回访状态
			}
			this.axiosPost('/crmReview/export/list',param,'客户回访表')
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