<template>
    <div class="contract">
		<tab-menu></tab-menu>
		<div class="search hxy-mb-25">
			<Form ref="searchForm" :model="searchForm" :label-width="100" @keydown.native.enter.prevent="handleSearch">
				<Row  :gutter="20">
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="受理单编号" prop="applyBillCode">
							<Input type="text" v-model="searchForm.applyBillCode" placeholder="请输入受理单编号"></Input>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="合同状态" prop="contractStatus">
							<Select  placeholder="请选择合同状态" v-model="searchForm.contractStatus" clearable filterable>
								<Option v-for="(val,index) in contractStatus" :value="val.value" :key="index">{{val.label}}</Option>
							</Select>
						</FormItem>
					</Col>
					
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
                        <FormItem label="合同编号" prop="contractNo">
                            <Input type="text" placeholder="请输入合同编号" v-model="searchForm.contractNo"></Input>
                        </FormItem>
                    </Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
                        <FormItem label="合同有效期" prop="endTime">
                            <DatePicker
								v-model='endTime'
								style="width: 100%"
								type="datetime"
								@on-change="changeTime"
								:editable="false" 
								format="yyyy-MM-dd"
								placeholder="请选择合同有效期"
								placement="bottom-start" 
								clearable>
							</DatePicker>
                        </FormItem>
                    </Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
					    <FormItem label="签约时间" prop="signTime">
					        <DatePicker
								v-model='signTime'
								style="width: 100%"
								type="datetime"
								@on-change="changeQyTime"
								format="yyyy-MM-dd"
								placeholder="请选择签约时间" 
								:editable="false" 
								placement="bottom-start" 
								clearable>
							</DatePicker>
					    </FormItem>
					</Col>
					<!-- <Col :md="12" :lg="8" :xl="6" :xxl="6">
					    <FormItem label="结束签约时间" prop="signTimeEnd">
					        <DatePicker
								v-model='searchForm.signTimeEnd'
								style="width: 100%"
								type="date"
								@on-change="changeQyTime"
								format="yyyy-MM-dd"
								placeholder="请选择签约时间" 
								:editable="false" 
								placement="bottom-start" 
								clearable>
							</DatePicker>
					    </FormItem>
					</Col> -->
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
					    <FormItem label="纸质状态" prop="documentStatus">
					        <Select placeholder="请选择合同状态" clearable filterable v-model="searchForm.documentStatus">
					            <Option v-for="(val,index) in contractType" :value="val.value" :key="index">{{val.label}}</Option>
					        </Select>
					    </FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
					    <FormItem label="客户名称" prop="customerName">
					        <Input type="text" placeholder="请输入客户名称" v-model="searchForm.customerName"></Input>
					    </FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
                        <Button type="primary" @click="handleSearch('searchForm')" icon="ios-search" class="hxy-ml-30 hxy-mr-30">搜索</Button>
                        <Button type="default" @click="handleReset('searchForm')" icon="ios-refresh">清空</Button>
                  </Col>
				</Row>
			</Form>
		</div>
        <div class="hxy-mb-25">
			<Button type="primary" ghost class="hxy-mr-10" @click="openHeTong">生成合同</Button>
			<Button class="hxy-mr-10" :disabled="signForm.id == '' ||  ids.length !== 1" @click="openSign">签约</Button>
			<Button class="hxy-mr-10" @click="go_cancelled"  :disabled="ids==''">作废</Button>
			<Button class="hxy-mr-10" @click="go_pigeonhole"  :disabled="ids==''">归档</Button>
			<Button class="hxy-mr-10" @click="go_lend"  :disabled="ids==''">借出</Button>
		</div>
		<div class="hxy-mb-25">
			<Table stripe border :columns="contractListTitle" :data="contractListData"   @on-selection-change="selectChange"></Table>
		</div>
		<div class="pos-r tr">
			<Page :total="total" :page-size="searchForm.pageSize" :current="searchForm.pageNum" placement="top" show-total show-sizer show-elevator @on-change="changePage" @on-page-size-change="changePageSize"></Page>
		</div>


		
		<!-- 生成合同 -->
		<Modal
		    :title="quotationTit"
		    v-model="quotationDialog"
		    :width="1000"
			:z-index="1000"
			:mask-closable="false"
			>
		    <Form :model="quotationForm" ref="quotationForm_ref" :rules="rulesQuotation" label-position="left" :label-width="130">
				<div>
					<Tabs ref="tabs" value="基本信息">
						<TabPane label="基本信息" name="基本信息">
							<Row :gutter="20">
								<Col span="12" v-show="quotationType === 0">
									<FormItem label="合同模板" prop="orgTemplateId">
										<Select
											v-model="quotationForm.orgTemplateId"
											placeholder="请输入"
											clearable 
											>
											<Option v-for="(item, index) in baseInfosOpt" :value="item.id" :key="index" style="width: 80px">{{item.name}}</Option>
										</Select>
									</FormItem> 
								</Col>
								<Col span="12">
									<!-- 新增 -->
									<FormItem v-show="quotationType === 0" label="报价单编号" prop="quotationId">
										<Select
											ref="serch_bill"
											:filterable="true" 
											:remote = "true"
											v-model="quotationForm.quotationId"
											:remote-method="onBlur_applyBillId"
											@on-change="onChangeBill"
											@on-clear="onClearBill"
											placeholder="请输入"
											clearable 
											:disabled="contListAbled">
											<Option v-for="(item, index) in BillIdData" :value="item.id" :key="index" style="width: 80px">{{item.quotaionCode}}</Option>
										</Select>
									</FormItem>
									<!-- 编辑回显 -->
									<FormItem v-show="quotationType !== 0" label="报价单编号" prop="quotaionCode">
										<Input v-model="quotationForm.quotaionCode" clearable :disabled="contListAbled"></Input>
									</FormItem>
								</Col>
								<!-- <Col span="12" v-if="!isAddOrEdit">
									<FormItem label="受理单ID" prop="applyBillId">
										{{quotationForm.applyBillCode}}
									</FormItem> 
								</Col>
								<Col span="12" >
									<FormItem    :label-width="0" prop="quotaionOrder">
										报价次序 ： {{quotationForm.quotaionOrder}}
									</FormItem>
								</Col> -->
							</Row>
							<Row :gutter="20">
								<Col span="24" >
									<FormItem label="产品及服务" prop="servicelList">
										<div><Button class="hxy-mb-15" :disabled="contListAbled" @click="open_pro_ser_sheet">增加产品及服务</Button></div>
										<!-- <Table stripe border :columns="pro_ser_title" :data="quotationForm.servicelList"> -->
											<!-- <template slot-scope="{row,index}" slot="serviceCount" >
												<Input placeholder="请输入数量" v-model="row.serviceCount" @on-change="setCountData($event, index, 'serviceCount')" clearable :disabled="contListAbled"></Input>
											</template> -->
										<!-- </Table> -->
										<Table border :columns="pro_ser_title" :data="servicelList"></Table>
									</FormItem>
								</Col>
							</Row>
							<Row :gutter="20" style="padding-left: 130px;">
								<Col span="6" >
									<FormItem label="合计报价（元）：" prop="contractAmount">
										{{quotationForm.contractAmount}}
									</FormItem>
								</Col>
								<Col span="6" >
									<FormItem label="产品数量：" prop="productCount">
										{{quotationForm.productCount}}
									</FormItem>
								</Col>
							</Row>
							<Row>
								<Col span="12">
									<FormItem label="付款方式" prop="payMethod">
										<Select v-model="quotationForm.payMethod" placeholder="请选择付款方式"  clearable :disabled="contListAbled"  @on-change="selPayMent"  :label-in-value="true">
											<Option v-for="(val,index) in payMethodData" :value="val.id" :key="index">{{val.name}}</Option>
										</Select>
									</FormItem>
								</Col>
							</Row>
							<div v-for="(obj,index) in quotationForm.payTimeList" :key="index">
								<Row v-if="index==0">
									<Col span="20" class="hxy-ml-20">
										<FormItem  :label-width="0" style="padding-left:100px;">
											<div class="isFlexalitem" style="width: 100%;">
												<div style="width: 380px;">第一期付款比例 {{obj.payProportion}}  
													<span class="hxy-mr-15 hxy-ml-15"> 付款金额(元) :  {{obj.payAmount||'-'}} </span> 
													<span style="color: red;">* </span>付款时间 : 
												</div>
												<DatePicker
													type="date"
													v-model="obj.payTime"
													@on-change="selectPayTime($event,index)"
													placeholder="第一期付款时间" 
													style="width:40%"
													:disabled="contListAbled">
												</DatePicker>
											</div>
										</FormItem>
									</Col>
								</Row>
								<Row v-if="index==1">
									<Col span="20" class="hxy-ml-20">
										<FormItem  :label-width="0" style="padding-left:100px;">
											<div class="isFlexalitem" style="width: 100%;">
												<div style="width: 380px;">第二期付款比例 {{obj.payProportion}}  
													<span class="hxy-mr-15 hxy-ml-15"> 付款金额(元) :  {{obj.payAmount||'-'}} </span> 
													<span class="hxy-ml-15" style="color: red;">* </span>付款时间 : 
												</div>
												<DatePicker 
													type="date"
													v-model="obj.payTime"
													@on-change="selectPayTime($event,index)"
													placeholder="第二期付款时间" 
													style="width:40%"
													:disabled="contListAbled">
												</DatePicker>
											</div>
										</FormItem>
									</Col>
								</Row>
								<Row v-if="index==2">
									<Col span="20" class="hxy-ml-20">
										<FormItem  :label-width="0" style="padding-left:100px;">
											<div class="isFlexalitem" style="width: 100%;">
												<div style="width: 380px;">第三期付款比例 {{obj.payProportion}}  
													<span class="hxy-mr-15 hxy-ml-15"> 付款金额(元) :  {{obj.payAmount||'-'}} </span> 
													<span class="hxy-ml-15" style="color: red;">* </span>付款时间 : 
												</div>
												<DatePicker 
													type="date"
													v-model="obj.payTime"
													@on-change="selectPayTime($event,index)"
													placeholder="第三期付款时间" 
													style="width:40%"
													:disabled="contListAbled">
												</DatePicker>
											</div>
										</FormItem>
									</Col>
								</Row>
							</div>
							<approve ref="approve_ref" v-show="quotationType !== 2"></approve>
						</TabPane>
						<TabPane label="其他信息" name="其他信息">
							<Row>
								<Col span="12">
									<FormItem label="合同有效期" prop="startTime">
										<DatePicker :options="startOption" v-model="quotationForm.startTime" format="yyyy-MM-dd"    :transfer="true"   type="datetime" placeholder="请选择开始时间" clearable :disabled="contListAbled"></DatePicker>
									</FormItem>
									<FormItem label="" prop="endTime">
										<DatePicker :options="endOption" v-model="quotationForm.endTime"   format="yyyy-MM-dd"    :transfer="true"   type="datetime" placeholder="请选择结束时间" clearable :disabled="contListAbled"></DatePicker>
									</FormItem>   
								</Col>
							</Row>
							<Row>
								<Col span="12">
									<FormItem label="设置到期提醒" prop="isAlter">
										<Switch v-model="quotationForm.isAlter" clearable :disabled="contListAbled"></Switch>
									</FormItem>
								</Col>
							</Row>
							<Row>
								<Col span="12">
									<FormItem label="甲方(委托人)" prop="firParty">
										<Input type="text" v-model="quotationForm.firParty" clearable :disabled="contListAbled"></Input>
									</FormItem>   
								</Col>
							</Row>
							<Row>
								<Col span="12">
									<FormItem label="通信地址" prop="firAddress">
										<Input type="text" v-model="quotationForm.firAddress" clearable :disabled="contListAbled"></Input>
									</FormItem>  
								</Col>
							</Row>
							<Row>
								<Col span="12">
									<FormItem label="联系人" prop="firPerson">
										<Input type="text" v-model="quotationForm.firPerson"  clearable :disabled="contListAbled"></Input>
									</FormItem>
								</Col>
							</Row>
							<Row>
								<Col span="12">
									<FormItem label="联系人方式" prop="firTel">
										<Input type="text" v-model="quotationForm.firTel" clearable :disabled="contListAbled"></Input>
									</FormItem>
								</Col>
							</Row>
							<Row>
								<Col span="12">
									<FormItem label="乙方(受托人)" prop="secParty">
										<Input type="text" v-model="quotationForm.secParty"  clearable :disabled="contListAbled"></Input>
									</FormItem>   
								</Col>
							</Row>
							<Row>
								<Col span="12">
									<FormItem label="通信地址" prop="secAddress">
										<Input type="text" v-model="quotationForm.secAddress" clearable :disabled="contListAbled"></Input>
									</FormItem>
								</Col>
							</Row>
							<Row>
								<Col span="12">
									<FormItem label="服务监督(投诉)" prop="secPerson">
										<Input type="text" v-model="quotationForm.secPerson"  clearable :disabled="contListAbled"></Input>
									</FormItem>
								</Col>
							</Row>
							<Row>
								<Col span="12">
									<FormItem label="服务电话" prop="secTel">
										<Input type="text" v-model="quotationForm.secTel" clearable :disabled="contListAbled"></Input>
									</FormItem> 
								</Col>
							</Row>
							<Row>
								<Col span="12">
									<FormItem label="丙方(协作方)" prop="thiParty">
										<Input type="text" v-model="quotationForm.thiParty"  clearable :disabled="contListAbled"></Input>
									</FormItem>
								</Col>
							</Row>
							<Row>
								<Col span="12">
									<FormItem label="通信地址" prop="thiAddress">
										<Input type="text" v-model="quotationForm.thiAddress" clearable :disabled="contListAbled"></Input>
									</FormItem>
								</Col>
							</Row>
							<Row>
								<Col span="12">
									<FormItem label="知识产权顾问" prop="counselor">
										<Input type="text" v-model="quotationForm.counselor"  clearable :disabled="contListAbled"></Input>
									</FormItem>
								</Col>
							</Row>
							<Row>
								<Col span="12">
									<FormItem label="联系人电话" prop="counselorTel">
										<Input type="text" v-model="quotationForm.counselorTel" clearable :disabled="contListAbled"></Input>
									</FormItem>
								</Col>
							</Row>
							<Row>
								<Col span="12">
									<FormItem label="知识产权专业建议" prop="counselorSuggest">
										<Input   type="textarea"   v-model="quotationForm.counselorSuggest" clearable :disabled="contListAbled"></Input>
									</FormItem>
								</Col>
							</Row>
							<Row>
								<Col span="12">
									<FormItem label="其他约定事项" prop="otherMatter">
										<Input   type="textarea"   v-model="quotationForm.otherMatter" clearable :disabled="contListAbled"></Input>
									</FormItem>
								</Col>
							</Row>
							<Row>
								<Col span="12">
									<FormItem label="备注" prop="remark">
										<Input  type="textarea"   v-model="quotationForm.remark" clearable :disabled="contListAbled"></Input>
									</FormItem>
								</Col>
							</Row>
							<modalUpLoad upLoadText="附件" @listenFile="listenFile"></modalUpLoad>
						</TabPane>
					</Tabs>
				</div>
		    </Form>
			<div slot="footer">
		        <Button type="default" @click="quotationDialog=false">取消</Button>
		        <Button type="primary" @click="handleSubmit">确定</Button>
		    </div>
		</Modal>


		
		<!-- 增加产品及服务 -->
		<Modal
		    :title="isAddOrEdit?'增加产品及服务':'编辑产品及服务'"
		    v-model="pro_ser_sheet"
		    :width="650"
			:z-index="1001"
			:mask-closable="false">
			<Form :model="bussnessForm" ref="bussnessForm_ref" :rules="rulesBussness" label-position="left" :label-width="100">
				<Row>
					<Col span="12">
						<FormItem label="产品名称" prop="serviceId">
							<Select v-model="bussnessForm.serviceId" @on-change="selOne"  :label-in-value="true" >
								<Option :value="item.id" v-for="(item,index) in productOnlineList" :key="index">{{item.productName}}</Option>
							</Select>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem label="产品数量" prop="serviceCount">
							<Input type="number" v-model="bussnessForm.serviceCount" placeholder="请输入产品数量"></Input>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem label="产品单价" prop="unitPrice">
							<Input type="number" v-model="bussnessForm.unitPrice" placeholder="请输入产品单价"></Input>
						</FormItem>
					</Col>
				</Row>
				
				<Row>
					<Col span="12">
						<FormItem label="联系人" prop="contactId">
							<Select v-model="bussnessForm.contactId"  @on-change="selTow"  :label-in-value="true">
								<Option :value="item.id" v-for="(item,index) in contactData" :key="index">{{item.contactName}}</Option>
							</Select>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem label="跟单人" prop="followId">
							<Select v-model="bussnessForm.followId"  @on-change="selThr"  :label-in-value="true">
								<Option :value="item.followId" v-for="(item,index) in followData" :key="index">{{item.followName}}</Option>
							</Select>
						</FormItem>
					</Col>
				</Row>
			</Form>
			<div slot="footer">
		        <Button type="default" @click="pro_ser_sheet=false">取消</Button>
		        <Button type="primary" @click="bussnessSubmit">确定</Button>
		    </div>
		</Modal>
			
			
		<Modal
		    title="签约"
		    v-model="signContact_sheet"
		    :width="860"
			:z-index="1000"
			:mask-closable="false">
			<Form :model="signForm" ref="signForm_ref" :rules="rulesQuotationSign" label-position="left" :label-width="120">
				<Row>
					<Col span="12" >
						<FormItem label="签约时间" prop="signTime">
							<DatePicker
								v-model="signForm.signTime"
								style="width: 100%"
								type="date"
								placeholder="请选择" 
								clearable>
							</DatePicker>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12" >
						<FormItem label="见证人" prop="witness">
							<Input placeholder="请输入" v-model="signForm.witness"></Input>
						</FormItem>
					</Col>
				</Row>
				<modalUpLoad upLoadText="添加附件" @listenFile="listenFile" ref="file_ref"></modalUpLoad>
			</Form>
			<div slot="footer">
				<Button type="default" @click="signContact_sheet=false">取消</Button>
				<Button type="primary" @click="handleSubmit_sign">确定</Button>
			</div>
		</Modal>	
	


		<!-- 以下div代码是以前的 -->
        <!-- 签约弹出/编辑窗口 -->
		<Modal
            :title="title"
            v-model="contractDialog"
            @on-cancel="handleCancel"
            :width="860"
			:z-index="1000"
			:mask-closable="false">
			<Tabs type="card" v-model="current">
				<TabPane label="合同A面" name="first">
					<div class="topbox">
						<div class="title">{{contracTemInfo.name}}</div>
						<div class="num">
							合同编号:{{contracTemInfo.contractNo}}
						</div>
					</div>
					<Form :model="contractForm" ref="contractForm" :rules="rulesContract" label-position="left" :label-width="100">
						<div class="table-form-ht">
							<Row class="hxy-pl-15 hxy-pr-15 hxy-pt-20">
								<Col span="11">
									<FormItem label="甲方(委托人)" prop="AName">
										<Input type="text" v-model="contractForm.AName" disabled></Input>
									</FormItem>   
								</Col>
								<Col span="2"></Col>
								<Col span="11">
									<FormItem label="通信地址" prop="Aaddress">
										<Input type="text" v-model="contractForm.Aaddress" disabled></Input>
									</FormItem>
								</Col>
							</Row>
							<Row class="hxy-pl-15 hxy-pr-15" >
								<Col span="11">
									<FormItem label="联系人" prop="ATelName">
										<Input type="text" v-model="contractForm.ATelName"  disabled></Input>
									</FormItem>
								</Col>
								<Col span="2"></Col>
								<Col span="11">
									<FormItem label="联系人方式" prop="firTel">
										<Input type="text" v-model="contractForm.firTel" disabled></Input>
									</FormItem>
								</Col>
							</Row>
							
							
							<Row class="hxy-pl-15 hxy-pr-15 hxy-pt-20">
								<Col span="11">
									<FormItem label="乙方(受托人)" prop="secParty">
										<Input type="text" v-model="contractForm.secParty"  disabled></Input>
									</FormItem>
								</Col>
								<Col span="2"></Col>
								<Col span="11">
									<FormItem label="通信地址" prop="Baddress">
										<Input type="text" v-model="contractForm.Baddress" disabled></Input>
									</FormItem>
								</Col>
							</Row>
							<Row class="hxy-pl-15 hxy-pr-15" prop="BTelName">
								<Col span="11">
									<FormItem label="服务监督(投诉)">
										<Input type="text" v-model="contractForm.BTelName"  disabled></Input>
									</FormItem>
								</Col>
								<Col span="2"></Col>
								<Col span="11">
									<FormItem label="服务电话" prop="BTelNum">
										<Input type="text" v-model="contractForm.BTelNum" disabled></Input>
									</FormItem>
								</Col>
							</Row>
							
							
							
							
							
							
							
							
							
							<div class="title">九大系列产品目录</div>
							<div class="content hxy-mb-10">
								1、基础知识产权系列产品；2、科技政策申报系列产品；3、品牌宣传系列产品；4、法务咨询系列产品；5、财税咨询系列产；6、精益化管理咨询系列产品；7、研发辅助系列产品；8、教育培训系列产品；9、智能数字化办公系列产品；10、风险担保服务
							</div>
							<div class="hxy-pl-30 hxy-pr-30">
								<div class="hxy-mb-15" style="display: flex; justify-content: space-between;">
									<div class="title1">产品明细</div>
								</div>
								<div class="hxy-mb-25">
									<Table stripe border :columns="productTitle" :data="productData"></Table>
								</div>
								<div class="hxy-mb-15" style="display: flex; justify-content: space-between;">
									<div class="title1">附加费用</div>
								</div>
								<div class="hxy-mb-25">
									<Table stripe border :columns="extraChargeTitle" :data="extraChargeData"></Table>
								</div>
								<div class="hxy-mb-25" style="display:flex;">
									<div class="hxy-mr-10" style="height: 36px; line-height: 36px;">以上委托事务费用合计：￥</div>
									<div class="hxy-mr-30">
										<Input type="text" v-model="contractForm.total_cost" placeholder="请输入金额" readonly></Input>
									</div>
									<div style="height: 36px; line-height: 36px;">大写：{{contractForm.total_cost_Big}} </div>
								</div>
							</div>
							<hr style="border: 1px solid #dfe4ed;"/>
							<div class="title">知识产权专业建议</div>
							<div class="content">
								乙方基于甲方阐述的企业及技术信息，基于《知识产权法》及《知识产权代理管理条例》，乙方提出如下建议：
							</div>
							<div class="hxy-pl-10 hxy-pr-10 hxy-mb-15">
								<Input type="textarea" v-model="contractForm.proposal" :rows="4" placeholder="请输入建议"></Input>
							</div>
							<div class="content">若甲方坚持放弃乙方上述建议，则上述知识产权使用过程中如有出现不便捷及保护不完整，乙方已履行告知义务。</div>
							<hr style="border: 1px solid #dfe4ed;"/>
							<div class="title hxy-mb-15">其他约定事项</div>
							<div class="hxy-pl-10 hxy-pr-10 hxy-mb-15">
								<Input type="textarea" v-model="contractForm.proposalTow" :rows="4" placeholder="请输入其他约定事项"></Input>
							</div>
							<hr style="border: 1px solid #dfe4ed;"/>
							<div class="title hxy-mb-10">乙方服务交付标准</div>
							<div class="content1">1、乙方服务严格按照《五星售后服务评价标准》进行过程服务；如有异议，可拨打全国售后服务热线或直接在微信售后群中@服务监督人进行申诉。</div>
							<div class="content1">2、乙方提供终身免费售后咨询及基础知识产权咨询服务。</div>
							<div class="content1">3、因知识产权申请属于”风险代理”服务，乙方针对每类产品及服务额外推出”注册保障”的有偿服务，详情可咨询当地知识产权顾问。</div>
							<div class="content1">4、上述代理服务中，除另行约定外，服务费中都不包含（首年年费、登记费等其他第三方费用），乙方另行推出的服务套餐除外。</div>
							<div class="content1">5、乙方服务中材料交付标准：国家下发的官文及递交标准申请文件；官文处理专业建议；售后群；定期回访服务。</div>
							<div class="content1" style="color: red;">6、乙方服务材料交付标准代表合同约定服务的完成。</div>
							<hr style="border: 1px solid #dfe4ed;"/>
							<div class="bank-info hxy-pt-10">
								<div class="box1">银行转帐（附汇款底单）：</div>
								<div class="box2">公司名称：{{contracTemInfo.secondPartyAccountName}}</div>
								<div class="box2">开户行：{{contracTemInfo.secondPartyDeposit}}</div>
								<div class="box2">帐号：{{contracTemInfo.secondPartyAccount}}</div>
							</div>
							<hr style="border: 1px solid #dfe4ed;"/>
							<Row :gutter="20" class="hxy-pl-15 hxy-pr-15 hxy-pt-20">
								<Col span="8">
									<Col span="24" class="hxy-mb-20">
										<strong>甲方</strong>
									</Col>
									<Col span="24">
										<FormItem label="盖章/签字" prop="partyA">
											<Input type="text" v-model="contractForm.partyA" placeholder="盖章/签字" disabled></Input>
										</FormItem>
									</Col>
									<Col span="24">
										<FormItem label="日期" prop="create_date_a">
											<DatePicker
												style="width: 100%"
												type="date"
												v-model="contractForm.create_date_a" 
												placeholder="日期" 
												:editable="false" 
												disabled
												placement="bottom-start" 
												clearable>
											</DatePicker>
										</FormItem>
									</Col>
								</Col>
								<Col span="8">
									<Col span="24" class="hxy-mb-20">
										<strong>乙方</strong>
									</Col>
									<Col span="24">
										<FormItem label="盖章/签字" prop="partyB">
											<Input type="text" v-model="contractForm.partyB" placeholder="盖章/签字" disabled></Input>
										</FormItem>
									</Col>
									<Col span="24">
										<FormItem label="日期" prop="create_date_b">
											<DatePicker
												style="width: 100%"
												type="date"
												v-model="contractForm.create_date_b" 
												placeholder="日期" 
												:editable="false" 
												disabled
												placement="bottom-start" 
												clearable>
											</DatePicker>
										</FormItem>
									</Col>
								</Col>
								<Col span="8">
									<Col span="24" class="hxy-mb-20">
										<strong>丙方</strong>
									</Col>
									<Col span="24">
										<FormItem label="盖章/签字" prop="partyC">
											<Input type="text" v-model="contractForm.partyC" placeholder="盖章/签字" disabled></Input>
										</FormItem>
									</Col>
									<Col span="24">
										<FormItem label="日期" prop="create_date_c">
											<DatePicker
												style="width: 100%"
												type="date"
												v-model="contractForm.create_date_c" 
												placeholder="日期" 
												:editable="false" 
												disabled
												placement="bottom-start" 
												clearable>
											</DatePicker>
										</FormItem>
									</Col>
								</Col>
							</Row>
						</div>
            		</Form>
					<hr style="border: 1px solid #dfe4ed;"/>
					<div class="bottombox">
						<div class="title">致力于行业服务标准	制定者和引领者</div>
					</div>
				</TabPane>
				<TabPane label="合同B面" name="second">
					<div class="topbox">
						<div class="title">{{contracTemInfo.name}}</div>
						<div class="num">
							合同编号:{{contracTemInfo.contractNo}}
						</div>
					</div>
					<div class="content1 hxy-mb-25" style="text-indent: 2em;">
						甲乙双方本着平等、自愿、公平、诚信的原则，依据《中华人民共和国合同法》等法律法规，经过友好协商，就甲方委托乙
						方进行知识产权管家式代理的相关事项达成合同如下，以资共同遵守：
					</div>
					<div class="text-desc">
						<div class="title">一、甲方权利及义务：</div>
						<div class="con">1、甲方应无保留地向乙方陈述与知识产权管家式代理事务有关的事实情况，并在乙方要求的期限内提供详细、真实、有效的资料及证明文件（包括有约定的第三方相关报告的出具文件）。</div>
						<div class="con">2、如甲方委托乙方进行知识产权管家式代理事务中存在弄虚作假或故意侵犯他人的合法权益等不正当行为，经发现后，甲方应当承担一切相关责任，且乙方有权解除本合同，所收费用均不予退回。</div>
						<div class="con">3、甲方应在本合同签订当日内，按合同约定的付款方式将所需费用及时支付给乙方。否则，乙方有权不启动相关受托知识产权管家式代理事务事项；若甲方在合同签订后，拒不履行付款义务超过3个工作日的，则乙方有权解除本合同。</div>
						<div class="con">4、<span style="color: red;">因甲方原因终止</span>与乙方的委托代理关系，乙方所收款项不予退还。</div>
						<div class="con">5、甲方委托乙方知识产权管家式代理服务中选择注册风险担保事务，如因甲方单方面原因终止合同继续履行，乙方所收款项不予退还。</div>
					</div>

					<div class="text-desc">
						<div class="title">二、乙方权利及义务：</div>
						<div class="con">1、乙方接受甲方委托，依法办理合同中约定的委托事务，维护甲方的合法权益。</div>
						<div class="con">2、乙方在收到甲方的支付的委托代理费用后，应立即启动合同约定的委托事务工作，及时向有关的主管部门递交材料文件。若甲方在合同签订后，拒不履行付款义务的，乙方保留追究<span style="color: red;">甲方违约损失</span>的权利,且甲方赔付乙方合同金额的30%作为违约金。</div>
						<div class="con">3、因乙方原因而不能完成甲方的委托事务，其中：若因甲方提供的资料有错误或瑕疵而导致该委托事务未成功；乙方不退还给甲方相关委托事务的代理费用。乙方接受委托事务仅限于委托事务的材料整理及递交，如因异议程序而造成委托事务无法完成的，属非因乙方原因而不能完成甲方的委托事务，乙方无需退还甲方已支付的相关委托代理费。</div>
						<div class="con">4、若甲方同时委托了风险担保事务，乙方依据主管单位下发的最终意见作为赔付依据；其中：被担保的委托事务经主管单位下发证书被担保的委托事务经主管单位审核并下发意见书，甲方主动放弃再次审查，均认定乙方无责，无须赔付任何费用；若被担保的委托事务经由甲方同意，乙方再次进行复审依然驳回，则乙方须赔付甲方注册风险担保金及企业约定费用。</div>
					</div>

					<div class="text-desc">
						<div class="title"><span style="color: red;">三、丙方权利及义务：</span></div>
						<div class="con"><span style="color: red;">1、丙方协作乙方合同主约定的权利及义务，并承诺连带责任。</span></div>
					</div>

					<div class="text-desc">
						<div class="title">四、其他约定：</div>
						<div class="con">1、合同中知识产权管家式代理事务若需做出任何修改，须经甲、乙双方协商一致后，做出相应修改；在原合同上进行个别修改，甲方须在修改的地方盖章或签字，若修改的内容较多，应当另行签订合同。</div>
						<div class="con">2、在本合同履行期间，若甲方地址、联系人、联系电话、电邮等联系方式中有任何一项发生变化时，甲方务必及时以书面方式传真或邮寄通知乙方，否则因此造成的一切不利后果均由甲方承担。</div>
						<div class="con">3、除因履行本合同义务所需外，未经对方书面同意，任何一方不得擅自向第三方泄露对方的任何信息及资料，包括但不限于本合同约定的代理事项涉及的资料。</div>
						<div class="con">4、由于不可抗力或其他不能归咎于甲乙双方的原因导致本合同未能履行的，本合同自行解除。</div>
						<div class="con">5、如双方就本合同内容或履行发生任何争议，应友好协商解决；协商不成时，任何一方均可向乙方所在地的人民法院提起诉讼。</div>
						<div class="con">6、本合同的各项条款均具有独立性，其中任何条款或规定的无效，并不影响其他条款或规定的效力；所有条款均为甲乙双方真实意思表示，双方均已完全解读无误。</div>
						<div class="con">7、本合同一式三份，甲方执一份，乙方执二份，具有同等法律效力。合同中除文本空格、双方签章信息外，均为印刷字体。手写部分（包括但不限于添加、删除、修改）须双方在手写处签章确认后才具备法律效力。</div>
					</div>
				</TabPane>
				<TabPane label="支付详情" name="three">
					<Table stripe border :columns="ht_pay_title" :data="ht_pay_data">
						<template slot-scope="{ row, index }" slot="inProduct" v-if="row.payProducList!=''">
							<div style="height: 15px;"></div>
							<div v-for="(item,num) in row.payProducList" :key="num" >
								<div class="hxy-mb-15">
									<span style="margin-right: 5px">{{item}}</span>
								</div>
							</div>
						</template>
					</Table>
				</TabPane>
			</Tabs>
			<div slot="footer">
                <Button type="default" @click="handleCancel">取消</Button>
                <Button type="primary">确定签约</Button>
            </div>
        </Modal>
		

		<!-- 查看详情 -->
		<Modal title="查看详情" v-model="contractDialog_def" :width="860">
			<Row :gutter="10" class="hxy-mb-20">
				<Col span="12">
					合同编号 ：{{tableInfo.contractNo || ''}}
				</Col>
				<Col span="12">
					创建时间：{{tableInfo.createTime || ''}}
				</Col>
			</Row>
			<Row :gutter="10" class="hxy-mb-20">
				<Col span="12">
					签约时间 ：{{tableInfo.signTime || ''}}
				</Col>
				<Col span="12">
					所属人：{{tableInfo.userName || ''}}
				</Col>
			</Row>
			<Row :gutter="10" class="hxy-mb-20">
				<Col span="12">
					合同状态 ：{{tableInfo.contractStatusCh || ''}}
				</Col>
				<Col span="12">
					纸质状态：{{tableInfo.contractPaperStatus || ''}}
				</Col>
			</Row>
			<Row :gutter="10" class="hxy-mb-20">
				<Col span="12">
					甲方（委托人） ：{{tableInfo.firParty || ''}}
				</Col>
				<Col span="12">
					甲方通信地址：{{tableInfo.firAddress || ''}}
				</Col>
			</Row>
			<Row :gutter="10" class="hxy-mb-20">
				<Col span="12">
					甲方联系人 ：{{tableInfo.firPerson || ''}}
				</Col>
				<Col span="12">
					甲方联系人方式 ：{{tableInfo.firTel || ''}}
				</Col>
			</Row>
			<Row :gutter="10" class="hxy-mb-20">
				<Col span="12">
					乙方（委托人） ：{{tableInfo.secParty || ''}}
				</Col>
				<Col span="12">
					乙方通信地址：{{tableInfo.secAddress || ''}}
				</Col>
			</Row>
			<Row :gutter="10" class="hxy-mb-20">
				<Col span="12">
					乙方（服务监督投诉） ：{{tableInfo.secPerson || ''}}
				</Col>
				<Col span="12">
					乙方服务电话：{{tableInfo.secTel || ''}}
				</Col>
			</Row>
			<Row :gutter="10" class="hxy-mb-20">
				<Col span="12">
					丙方（协作方） ：{{tableInfo.thiParty || ''}}
				</Col>
				<Col span="12">
					丙方通信地址：{{tableInfo.thiAddress || ''}}
				</Col>
			</Row>
			<Row :gutter="10" class="hxy-mb-20">
				<Col span="12">
					知识产权顾问 ：{{tableInfo.counselor || ''}}
				</Col>
				<Col span="12">
					知识产权顾问联系电话：{{tableInfo.counselorTel || ''}}
				</Col>
			</Row>
			<Row :gutter="10" class="hxy-mb-20">
				<Col span="12">
					十大系列产品目录 ：
					<div>1、基础知识产权系列产品；</div>	
					<div>2、科技政策申报系列产品；</div>	
					<div>3、品牌宣传系列产品</div>	
					<div>4、法务咨询系列产品；</div>	
					<div>5、财税咨询系列产；</div>	
					<div>6、精益化管理咨询系列产品；</div>	
					<div>7、研发辅助系列产品；</div>	
					<div>8、教育培训系列产品；</div>	
					<div>9、智能数字化办公系列产品；</div>	
					<div>10、风险担保服务</div>	
				</Col>
				<Col span="12">
					乙方服务交付标准 ：
					<div>1、乙方服务严格按照《五星售后服务评价标准》进行过程服务；如有异议，可拨打全国售后服务热线或直接在微信售后群中@服务监督人进行申诉。</div>	
					<div>2、乙方提供终身免费售后咨询及基础知识产权咨询服务。</div>	
					<div>3、因知识产权申请属于”风险代理”服务，乙方针对每类产品及服务额外推出”注册保障”的有偿服务，详情可咨询当地知识产权顾问。</div>	
					<div>4、上述代理服务中，除另行约定外，服务费中都不包含（首年年费、登记费等其他第三方费用），乙方另行推出的服务套餐除外。</div>	
					<div>5、乙方服务中材料交付标准：国家下发的官文及递交标准申请文件；官文处理专业建议；售后群；定期回访服务。</div>	
					<div>6、乙方服务材料交付标准代表合同约定服务的完成。</div>	
				</Col>
			</Row>
			<Row :gutter="10" class="hxy-mb-20">
				<Col span="12">
					产品信息 ：{{tableInfo.productName || ''}}
				</Col>
				<Col span="12">
					附加费用：{{tableInfo.extraCharge || ''}}
				</Col>
			</Row>
			<Row :gutter="10" class="hxy-mb-20">
				<Col span="12">
					合计金额 ：{{tableInfo.contractAmount || ''}}
				</Col>
				<Col span="12">
					知识产权专业建议：{{tableInfo.counselorSuggest || ''}}
				</Col>
			</Row>
			<Row :gutter="10" class="hxy-mb-20">
				<Col span="12">
					其他约定事项 ：{{tableInfo.otherMatter || ''}}
				</Col>
				<Col span="12">
					开户行：{{tableInfo.secBank || ''}}
				</Col>
			</Row>
			<Row :gutter="10" class="hxy-mb-20">
				<Col span="12">
					账户名称 ：{{tableInfo.secAccpuntName || ''}}
				</Col>
				<Col span="12">
					账户号：{{tableInfo.secAccount || ''}}
				</Col>
			</Row>
		</Modal>
		<!-- 预览 -->
		<Modal title="" v-model="previewContract" :width="1200">
			<div slot="footer">
				<div class="tc">
					<Button @click="changePdfPage(0)" class="turn">上一页</Button>
					{{contractCurrentPage}}  /  {{contractPageCount}}
					<Button @click="changePdfPage(1)" class="turn">下一页</Button>
				</div>
				<Button @click="previewContract = false">取消</Button>
                <Button type="primary" class="btn-warning" @click="downloadPdf">下载PDF</Button>
          	</div>
			<div>
				<pdf 
					:src="src"
					:page="contractCurrentPage"
					@num-pages="contractPageCount = $event"
					@page-loaded="contractCurrentPage = $event"
					@loaded="loadPdfHandler">
				</pdf>
			</div>
			
		</Modal>
		
		<!-- 栏目标题弹窗 -->
		<tranFer :dataShow="TranList"  :TranListNo="TranListNo"  @refresh= "refresh" @closeTran="closeTran"  v-show="TranFlag"></tranFer>
		
		
		
    </div>
</template>
<script>
import approve from '_c/approve'
import { queryCurrStaff } from "_s/customer"
import { getCrmTemp } from "_s/approval"
import { morenContract} from '_s/enterprise'
import { paymentList } from '_s/product'
import { getInp_biil_id,listContactAndFollow} from '_s/followUp'
import { getProductList,deleteOffer,getPrudctOnline } from '_s/offerPrice'
import { htAdd,htList,getDefault,ht_cancelled,ht_pigeonhole,ht_lend,router_htAdd } from '_s/heTong'
import { baseInfos, codeList, service, save, contractList, contractSign, pigeonhole, cancelled, lend, detail, update, preview } from '_s/collectInvoice' // 受理单合同接口
import { getOnSell } from '_s/accepForm'
import { mapGetters} from 'vuex'
import pdf from 'vue-pdf'
import axios from 'axios'


export default {
	components:{
		approve,
		pdf
	},
	data(){
		return{
			contractPageCount: 0, // 总页数
			contractCurrentPage: 0, // 当前页
			previewContract: false,
			payforList: [],
			//生成合同
			contractForm: {
				id  : "",
			    name: '',
			    create_date: '',
			    order_no: '',
				customer: '',
				type: '',
				receiver: '',
				quotation_remark: '',
				isCreate: false,
				contract_remark: '',
				payfor: "",
				total : 0,
				count : 0
			},
			
			
			
			
			
			
			
			
			contractStatus: [],
            contractType: [],
			total: 0,
			pageLoading: false,//页面loading动画
			ids: [],
			idsData:[],
			single: true,
			multiple: true,
			

			contracTemInfo: {},		//合同模板
			contractDialog: false,
			contractListData: [],
			contractListTitle: [
				{
					type: 'selection',
					width: 60,
					resizable: true,
					align: 'center'
				},
				{
					title: '序号',
					key: "index",
					resizable: true,
					width: 80,
					align: 'center',
					render:(h,params)=>{
						return h("span" ,{
						},params.index+1)
					}
				},
				{
					title: '受理单编号',
					key : "applyBillCode",
					resizable: true,
					width: 240,
					align: 'center'
				},
				{
					title: '客户名称',
					key: "customerName",
					resizable: true,
					width: 150,
					align: 'center'
				},
				{
					title: '报价编号',
					key: 'quotaionCode',
					resizable: true,
					width: 240,
					align: 'center',
				},
				{
					title: '合同编号',
					key: 'contractNo',
					resizable: true,
					width: 250,
					align: 'center',
				},
				{
					title: '创建人',
					key: 'createByName',
					resizable: true,
					width: 150,
					align: 'center',
				},
				{
					title: '签约时间',
					key: 'signTime',
					resizable: true,
					width: 200,
					align: 'center',
				},
				{
					title: '跟单人',
					key: 'followName',
					resizable: true,
					width: 520,
					align: 'center',
				},
				{
					title: '报价人',
					key: 'quotationName',
					resizable: true,
					width: 150,
					align: 'center',
				},
				{
					title: '合同有效期',
					key: 'startTimeEndTime',
					resizable: true,
					width: 360,
					align: 'center',
				},
				{
					title: '合同状态',
					key: 'contractStatusCh',
					resizable: true,
					width: 150,
					align: 'center',
				},
				{
					title: '纸质状态',
					key: 'documentStatus',
					resizable: true,
					width: 150,
					align: 'center',
				},
				{
					title: '合计金额(元)',
					key: 'contractAmount',
					resizable: true,
					width: 150,
					align: 'center',
				},
				{
					title: '其他约定事项',
					key: 'otherMatter',
					resizable: true,
					width: 150,
					align: 'center',
				},
				{
					title: '审批状态',
					key: 'approveStatus',
					resizable: true,
					width: 150,
					align: 'center',
				},
				{
					title:'操作',
					key:'action',
					width: 240,
					align: 'center',
					fixed: 'right',
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								style: {
                                    color: '#2d8cf0',
									display : params.row.contractStatus==0?"inline-block":"none"
                                },
								on: {
									click: () => {
										this.$refs['signForm_ref'].resetFields();
										this.signContact_sheet = true
										this.signForm.id = params.row.id
										// this.toEdit(params.row)
									}
								}
							}, '签约'),
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								style: {
							        color: '#2d8cf0',
									display : params.row.contractStatus==0?"inline-block":"none"
							    },
								on: {
									click: () => {
										this.quotationTit = '编辑合同'
										this.quotationType = 1
										this.$refs.tabs.activeKey = '基本信息'
										this.contListAbled = false
										this.toEdit(params.row)
									}
								}
							}, '编辑'),
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								style: {
                                    color: '#2d8cf0'
                                },
								on: {
									click: () => {
										this.quotationTit = '合同详情'
										this.quotationType = 2
										this.$refs.tabs.activeKey = '基本信息'
										this.lookDefault(params.row)
									}
								}
							}, '详情'),
							h('Button', {
								props: {
									type: 'text',
									size: 'small',
									loading: this.loading[params.index]
								},
								style: {
                                    color: '#2d8cf0',
									display : params.row.contractStatus !==1?"none":"inline-block"
                                },
								on: {
									click: () => {
										this.contractID = params.row.id
										this.getPdfCode(params.index)
									}
								}
							}, '预览'),
							// h('Button', {
							// 	props: {
							// 		type: 'text',
							// 		size: 'small'
							// 	},
							// 	style: {
                            //         color: '#2d8cf0',
							// 		display : params.row.contractStatus==0?"inline-block":"none"
                            //     },
							// 	on: {
							// 		click: () => {
							// 			this.deleteData(params.row)
							// 		}
							// 	}
							// }, '删除'),
							// h('Button', {
							// 	props: {
							// 		type: 'primary',
							// 		size: 'small'
							// 	},
							// 	style: {
							//         color: '#ffffff',
							// 		display : params.row.contractStatus!=0?"inline-block":"none"
							//     },
							// 	on: {
							// 		click: () => {
							// 			this.loadHeTong(params.row)
							// 		}
							// 	}
							// }, '下载')
						])
					}
				}
			],
			loading: [],
			current: 'first',
			contractForm: {
				AName : "",
				Aaddress:"",
				ATelName:"",
				ATelNum : "",
				BName : "",
				Baddress:"",
				BTelName:"",
				BTelNum : "",
				CName : "",
				Caddress:"",
				CTelName:"",
				CTelNum : "",
				
				total_cost:"",		//合计金额
				total_cost_Big:"",	//大写
				proposal:"",		//知识产权建议
				proposalTow : "",	//其它约定事项
				offerId : "",		//报价id (去详情的offerId)
				
				
				partyA: '',
				partyB: '',
				partyC: '',
				create_date_a: '',
				create_date_b: '',
				create_date_c: '',
			},
			rulesContract: {
				AName: [
					{ required: true, message: '甲方（委托人不能为空）', trigger: 'blur' }
				],
				Aaddress: [
					{ required: true, message: '甲方（通信地址不能为空）', trigger: 'blur' }
				],
				ATelName: [
					{ required: true, message: '甲方（联系人不能为空）', trigger: 'blur' }
				],
				ATelNum: [
					{ required: true, message: '甲方（联系方式不能为空）', trigger: 'blur' }
				],
				BName: [
					{ required: true, message: '乙方（委托人不能为空）', trigger: 'blur' }
				],
				Baddress: [
					{ required: true, message: '乙方（通信地址不能为空）', trigger: 'blur' }
				],
				BTelName: [
					{ required: true, message: '乙方（服务监督投诉不能为空）', trigger: 'blur' }
				],
				BTelNum: [
					{ required: true, message: '乙方（联系方式不能为空）', trigger: 'blur' }
				],
				CName: [
					{ required: true, message: '丙方（协作方不能为空）', trigger: 'blur' }
				],
				Caddress: [
					{ required: true, message: '丙方（通信地址不能为空）', trigger: 'blur' }
				],
				CTelName: [
					{ required: true, message: '丙方（知识产权顾问不能为空）', trigger: 'blur' }
				],
				CTelNum: [
					{ required: true, message: '丙方（联系电话不能为空）', trigger: 'blur' }
				],
			},

			//产品明细
			productData: [],
			productTitle: [
				{
					title: '序号',
					type : "index",
					resizable: true,
					width: 80,
					align: 'center',
				},
				{
					title: '委托事务',
					key: 'productName',
					resizable: true,
					align: 'center',
				},
				{
					title: '委托数量',
					key: 'count',
					resizable: true,
					align: 'center',
				},
				{
					title: '委托产品明细',
					key: 'remark',
					resizable: true,
					align: 'center',
					render:(h,params) => {
						return h('Input',{
								props: {
										value: params.row.remark,
										size:'small',
								},
								on:{
										input: (val) => {
											this.productData[params.row._index].remark = val;
										}
								}
							})
                    }
				},
				{
					title: '费用（元）',
					key: 'totalPrice',
					resizable: true,
					align: 'center',
				},
				{
					title:'操作',
					key:'action',
					width: 100,
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								style: {
                                    color: '#2d8cf0'
                                },
								on: {
									click: () => {
										this.toDel_one(params.row)
									}
								}
							}, '删除')
						])
					}
				}
			],
			
			//附加费用
			extraChargeData: [
				{
					id: 1,
					type: '',
					remark: '',
					amount: ''
				}
			],
			extraChargeTitle: [
				{
					title: '序号',
					type : "index",
					resizable: true,
					width: 80,
					align: 'center',
				},
				{
					title: '附加分类',
					key: 'typeName',
					resizable: true,
					align: 'center',
				},
				{
					title: '备注',
					key: 'remark',
					resizable: true,
					align: 'center',
					render:(h,params) => {
						return h('Input',{
							props:{
									value: params.row.remark,
									size:'small',
							},
							on:{
									input: (val) => {
										this.extraChargeData[params.row._index].remark = val;
									}
                            }
							})
					}
				},
				{
					title: '费用(元)',
					key: 'price',
					resizable: true,
					align: 'center',
				},
				{
					title:'操作',
					key:'action',
					width: 100,
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								style: {
                                    color: '#2d8cf0'
                                },
								on: {
									click: () => {
										this.toDel_tow(params.row.id)
									}
								}
							}, '删除')
						])
					}
				}
			],
			
			
		
			
			lookInfo : "",		//签约查看信息
			ht_pay_data: [],
			ht_pay_title: [
				{
					title: '付款批次',
					key: 'payNum',
					resizable: true,
					align: 'center',
				},
				{
					title: '付款时间',
					key: 'payTime',
					resizable: true,
					align: 'center',
				},
				{
					title: '付款金额',
					key: 'paySum',
					resizable: true,
					align: 'center',
				},
				{
					title: '包含产品',
					slot: 'inProduct',
					key : "inProduct",
					resizable: true,
					align: 'center',
				},
			],
			
			//查看表格详情
			contractDialog_def : false,
			tableInfo : "",
			
			
			isAgain : true,
			
			
			// 以下是穿梭框参数
			TranList  : [],	  //穿梭框左侧数据
			TranListNo: [],	  //不属于穿梭框左侧数据的，例如选择框，序号，操作详情
			TranFlag  : false,//开关
			
			
			
			
			
			
			//上面都是老的根据情况没用的都对应可以删除，以下代码有用，
			//搜索参数
			searchForm: {
				pageSize: 10,
				pageNum : 1
			},
			endTime: '',
			signTime: '',
			total : 0,
			//分页参数
			// pageInfo : {
				
			// 	pageSize : 10,
			// 	pageNum  : 1
			// },
			//签约参数
			signContact_sheet : false,
			signForm  : {
				
			},
			
			
			
			//以下是参数是基本信息里的代码-开始
			//公共的下拉选择数据
			payMethodData	: [],			//付款方式
			BillIdData		: [],			//受理单关键字搜索数据
			productOnlineList: [],			//在线产品
			contactData		: [],			//联系人数据
			followData		: [],			//跟单人数据
			//签约基本信息
			title	: "",
			isAddOrEdit:true,
			isLook : false,
			quotationDialog: false,
			quotationTit: '',
			quotationType: null, // 0新增，1编辑，2详情
			quotationForm: {
				isAlter: true,
				applyBillCode : "",			//受理单编号
				applyBillId   : "",			//受理单id
				payMethod	  : "",			//付款方式
				payTimeList   : [],			//付款时间集合
				productCount  : 0,			//产品数量
				contractAmount: 0,			//报价总额
				quotaionMethod: "",			//报价方式
				quotaionOrder : "",			//报价次序
				remark		  : "",			//备注
				servicelList : [],	//产品及服务
				quotationFileList:[]		//附件
			},
			startOption: {
				// 开始时间必须小于结束时间
				disabledDate: (date) => {
					if (!this.quotationForm.endTime) {
						return date.getTime() < new Date(1970 - 1 - 1).getTime()
					} else {
						return date.getTime() > new Date(this.quotationForm.endTime)
					}
				}
			},
			endOption: {
				// 结束时间必须大于开始时间
				disabledDate: (date) => {
					return (
						date.getTime() < new Date(this.quotationForm.startTime) ||
						date.getTime() < new Date(1970 - 1 - 1).getTime()
					)
				}
			},
			contListAbled: false,
			rulesQuotation: {
				orgTemplateId: [
					{ required: true, message: '此项不能为空', trigger: 'change',type:"number" }
				],
				quotationId: [
					{ required: true, message: '此项不能为空', trigger: 'change',type:"number" }
				],
				payMethod: [
					{ required: true, message: '此项不能为空', trigger: 'change',type:"number" }
				],
				startTime: [
					{ required: true, message: '此项不能为空',trigger: 'change',type: 'date' }
				],
				endTime: [
					{ required: true, message: '此项不能为空',trigger: 'change',type: 'date' }
				],
				firParty: [{ required: true, message: '此项不能为空', trigger: 'change'}],
				firAddress: [{ required: true, message: '此项不能为空', trigger: 'change'}],
				firPerson: [{ required: true, message: '此项不能为空', trigger: 'change'}],
				firTel: [{ required: true, message: '此项不能为空', trigger: 'change'}],
				secParty: [{ required: true, message: '此项不能为空', trigger: 'change'}],
				secAddress: [{ required: true, message: '此项不能为空', trigger: 'change'}],
				secPerson: [{ required: true, message: '此项不能为空', trigger: 'change'}],
				secTel: [{ required: true, message: '此项不能为空', trigger: 'change'}],
			},
			//产品及服务列表
			pro_isAddOrEdit:true,
			pro_Cindex    : 0,
			pro_customerId: "",
			customerId: null,
			pro_ser_sheet : false,
			servicelList: [],
			pro_ser_title : [
				{
					title: '序号',
					type : "index",
					resizable: true,
					width: 80,
					align: 'center'
				},
				{
					title: '产品及服务',
					key: 'serviceName',
					resizable: true,
					width: 150,
					align: 'center'
				},
				{
					title: '产品数量',
					key: 'serviceCount',
					resizable: true,
					width: 120,
					align: 'center'
				},
				{
					title: '产品单价(默认标价)',
					key: 'unitPrice',
					resizable: true,
					width: 110,
					align: 'center'
				},
				{
					title: '联系人',
					key: 'contactName',
					resizable: true,
					width: 120,
					align: 'center'
				},
				{
					title: '跟单人',
					key: 'followName',
					resizable: true,
					width: 120,
					align: 'center'
				},
				{
					title: '操作',
					resizable: true,
					align: 'center',
					render:(h,params)=>{
						return h('div', [
							h('Button', {
								props: {
									size: 'small',
									disabled: this.contListAbled
								},
								on: {
									click: () => {
										this.$refs['bussnessForm_ref'].resetFields()
										this.pro_isAddOrEdit = false
										this.isAddOrEdit = false // 判断是新增产品服务还是编辑产品服务
										this.proEdit(params.row)
									}
								}
							}, "编辑"),
							h('Button', {
								props: {
									size: 'small',
									disabled: this.contListAbled
								},
								style:{
									'margin-left': '10px',
								},
								on: {
									click: () => {
										this.proDel(params.row)
									}
								}
							}, "删除"),
						])
					}
				},
			],
			//产品与服务弹窗
			bussnessForm: {
				contactId : "",		//联系人id
				followId  : "",		//跟单人id
				serviceCount :"",	//产品数量
				serviceId : "",		//产品服务id
				unitPrice : "",		//产品单价
				serviceName : "",	
				contactName : "",
				followName  : ""
			},
			rulesBussness:{
				serviceId: [
					{ required: true, message: '此项不能为空', trigger: 'change',type:"number" }
				],
				serviceCount: [
					{ required: true, message: '此项不能为空' }
				],
				unitPrice: [
					{ required: true, message: '此项不能为空', trigger: 'change' }
				],
				contactId: [
					{ required: true, message: '此项不能为空', trigger: 'change',type:"number"  }
				],
				followId: [
					{ required: true, message: '此项不能为空', trigger: 'change',type:"number" }
				]
			},
			//以上是参数是基本信息里的代码-结束

			// 合同
			baseInfosOpt: [],
			rulesQuotationSign: {
				signTime: [{ required: true, message: '此项不能为空', trigger: 'change', type: 'date' }],
				witness: [{ required: true, message: '此项不能为空', trigger: 'change' }],
			},
			contractID: null,
			fileStream: null,
			src: '',
		}
	},
	computed: {
		...mapGetters({
			config: 'get_config',
			user: 'get_userinfo'
		})
	},
	created() {
		this.getPayMent();	//付款方式
		// this.getPrudctOnlineData(); //在线产品数据
	},
	mounted(){
		//获取合同状态字典
		let contract = this.filterDict(this.config,'crm_contract_status');
		this.contractType = this.filterDict(this.config,'document_status');
		
		contract.forEach(item => {
			if (item.value !== '2' && item.value !== '3') {
				this.contractStatus.push(item)
			}
		})
	
		//合同模板
		// this.getTemplate();
		
		//列表数据
		// this.getContractList()
		
		
		//审批人数据
		this.initApprove();

		this.getContractList()
		
	},
	methods: {
		
		// 获取合同模板
		getBaseInfos() {
			baseInfos().then(res => {
				if (res.code === 200) {
					this.baseInfosOpt = res.data
				}
			})
		},
		// 合同审批
		async initApprove(){
			queryCurrStaff().then(res => {
				this.$refs['approve_ref'].setData_mount(res.data);
			})
			await getCrmTemp({ formName: 12 }).then(res => {
				if (res.code === 200) {
					this.$refs['approve_ref'].setData_init(res);
				}
			})
		},
		//基本信息的逻辑开始
		//获取付款方式
		getPayMent(){
			paymentList({}).then(res=>{
				if(res.code==200){
					this.payMethodData = res.rows;
				}
			})
		},
		//在线产品
		getPrudctOnlineData(data){
			getOnSell(this.customerId).then(res=>{
				if (res.code === 200) {
					this.productOnlineList = res.data;
					if (data) {
						this.productOnlineList.forEach(item => {
							if (item.productName === data.serviceName) {
								data.id = item.id
							}
						})
					}
				}
			})
		},
		//受理单输入关键字列表
		onBlur_applyBillId(query){
			if(query!==''){
				codeList(query).then(res => {
					if (res.code === 200) {
						this.BillIdData = res.data
						
					}
				})
			}else{
				this.$refs['serch_bill'].setQuery("");
				this.BillIdData = [];
			}
		},
		// 新增选择报价单编号
		onChangeBill(e){
			if(!e){
				return
			}
			this.onClearBill();
			this.BillIdData.forEach((item)=>{ // 获取customerId
				if(item.id == e){
					this.customerId =  item.customerId
				} 
			})
			// 通过报价单编号获取已有的产品及服务
			service(e).then(res=>{
				if (res.code === 200) {
					// 通过报价单编号获取合同其他信息
					this.quotationForm.firParty = res.data.firParty
					this.quotationForm.firAddress = res.data.firAddress
					this.quotationForm.firPerson = res.data.firPerson
					this.quotationForm.firTel = res.data.firTel
					this.quotationForm.secParty = res.data.secParty
					this.quotationForm.secAddress = res.data.secAddress
					this.quotationForm.secPerson = res.data.secPerson
					this.quotationForm.secTel = res.data.secTel
					this.quotationForm.applyBillId = res.data.applyBillId // 受理单号

					this.quotationForm.quotaionOrder = res.data.quotaionOrder;
					this.pro_customerId = res.data.customerId;
					let obj = {}
					if(res.data.serviceDetailList!=''&&res.data.serviceDetailList){
						for(let i=0;i<res.data.serviceDetailList.length;i++){
							let temp = res.data.serviceDetailList[i];
							obj = {
								contactId : temp.contactId,
								followId  : temp.followId,
								serviceCount : temp.serviceCount,
								serviceId : temp.serviceId,
								unitPrice : temp.unitPrice+"",
								serviceName : temp.serviceName,
								contactName : temp.contactName,
								followName  : temp.followName
							}
							this.servicelList.push(obj)
						}	
						this.setTotal()
					}

				}
			})
		},
		onClearBill(){
			this.servicelList = [];
			this.quotationForm.quotaionOrder = "";
			this.pro_customerId  = "";
		},
		//获取上传附件的数据
		listenFile(data,unType){
			this.quotationForm.quotationFileList = data;
		},
		// 打开新增报价弹框
		openQuotationDialog() {
			this.title = '新增报价';
			this.$refs['quotationForm_ref'].resetFields();
			this.quotationForm.payTimeList = [];
			this.quotationDialog = true;
			this.isAddOrEdit = true;
			this.isLook = false;
		},
		//打开---增加产品与服务开关
		open_pro_ser_sheet(){
			if (this.quotationForm.quotationId) {
				this.pro_isAddOrEdit = true;
				this.isAddOrEdit = true // 判断是新增产品服务还是编辑产品服务
				this.getPrudctOnlineData() // 获取新增时的产品及服务
				if(this.isAddOrEdit){
					this.setSheetData();
				}
				this.pro_ser_sheet = true;
			} else {
				this.$Message.info('请选择报价单编号')
			}
			
		},
		setSheetData(){
			this.contactData = [];	//联系人数据
			this.followData  = [];	//跟单人数据
			if(this.customerId){
				listContactAndFollow(this.customerId).then(res=>{
					if (res.code === 200) {
					    this.contactData = res.data.listContact; 	 //联系人
					    this.followData = res.data.listFollowPerson; //跟单人
					}
				})
			}
			this.$refs['bussnessForm_ref'].resetFields(); 
		},
		
		selOne(e){
			if(!e){
				return
			}
			this.bussnessForm.serviceName = e.label;
		},
		selTow(e){
			if(!e){
				return
			}
			this.bussnessForm.contactName = e.label;
		},
		selThr(e){
			if(!e){
				return
			}
			this.bussnessForm.followName = e.label;
		},
		//产品数量输入绑定
		// setCountData(e, index, type){
		//   this.quotationForm.servicelList[index][type] = e.target.value;
		//   this.setTotal();
		// },

		// 编辑产品及服务
		async proEdit(data){
			this.pro_ser_sheet = true;
			this.pro_Cindex = data._index;
			if(this.isAddOrEdit){
				await this.getPrudctOnlineData(data)
				await this.setSheetData();
			}else{
				this.pro_ser_sheet = true;
			}
			this.bussnessForm.contactId	   = data.contactId;
			this.bussnessForm.followId 	   = data.followId;
			this.bussnessForm.serviceCount = data.serviceCount;
			this.bussnessForm.serviceId	   = data.serviceId;
			this.bussnessForm.unitPrice    = data.unitPrice;
			this.bussnessForm.serviceName  = data.serviceName;
			this.bussnessForm.contactName  = data.contactName;
			this.bussnessForm.followName   = data.followName;
		},
		// 删除产品及服务列表
		proDel(data){
			this.servicelList.splice(data._index,1);
			this.setTotal();
		},
		// 计算合计报价和产品数量
		setTotal(){
			this.quotationForm.contractAmount = 0;
			this.quotationForm.productCount = 0;
			this.servicelList.forEach((item)=>{
				this.quotationForm.contractAmount += (item.unitPrice * 1) * (item.serviceCount * 1)
				this.quotationForm.productCount += item.serviceCount * 1
			})
			
			this.quotationForm.contractAmount =  Math.round(this.quotationForm.contractAmount * 100) / 100;  //截取两位
			this.setTotalPay();
		},
		setTotalPay(){
			//计算下方付款方式金额占比
			if(this.quotationForm.payMethod&&this.quotationForm.contractAmount){
				for(var i=0;i<this.quotationForm.payTimeList.length;i++){
					var temp = this.quotationForm.payTimeList[i];
					var str  = temp.payProportion.split("%");
					temp.payAmount = Number(this.quotationForm.contractAmount)*str[0]/100
				}
			}	
		},
		//选择付款方式
		selPayMent(e){
			if(!e){
				return
			}
			this.quotationForm.payTimeList = [];
			for(var i=0;i<this.payMethodData.length;i++){
				var temp = this.payMethodData[i];
				if(e.value==temp.id){
					var json = JSON.parse(temp.config);
					if(temp.type==0){			//1期
						var obj  = {
							payAmount 	  : "",			 	//付款金额
							payBatch  	  : 1,	//付款期数
							payProportion : json[1]+"%",  	//付款占比
							payTime		  : ""				//付款时间
						}
						this.quotationForm.payTimeList.push(obj)
					}else{						//3期
						var len = 3;
						if(json[3]==""){	//如果第三条没数据
							len = 2;
						}
						for(var j=1;j<=len;j++){
							var obj2  = {
								payAmount 	  : "",			 	//付款金额
								payBatch  	  : j,				//付款期数
								payProportion : json[j]+"%",  	//付款占比
								payTime		  : ""				//付款时间
							}
							this.quotationForm.payTimeList.push(obj2)
						}
					}
					break;
				}
			}
			this.setTotalPay()
		},
		//选择报价时间
		change_offer_time(e){
			this.searchForm.createTime = e;
		},
		//选择时间
		selectPayTime(e,index){
			this.quotationForm.payTimeList[index].payTime = e;
		},
		// 提交添加产品及服务信息
		bussnessSubmit() {
			this.$refs['bussnessForm_ref'].validate((valid) => {
				if(valid) {
					var obj = JSON.stringify(this.bussnessForm);
					var toJson = JSON.parse(obj)
					this.$util.checkIsAgain(()=>{
						if(this.pro_isAddOrEdit){	// 新增
							this.servicelList.push(toJson);
						}else{							// 编辑
							this.servicelList[this.pro_Cindex].contactId = toJson.contactId;
							this.servicelList[this.pro_Cindex].followId = toJson.followId;
							this.servicelList[this.pro_Cindex].serviceCount = toJson.serviceCount;
							this.servicelList[this.pro_Cindex].serviceId = toJson.serviceId;
							this.servicelList[this.pro_Cindex].unitPrice = toJson.unitPrice;
							this.servicelList[this.pro_Cindex].serviceName = toJson.serviceName;
							this.servicelList[this.pro_Cindex].contactName = toJson.contactName;
							this.servicelList[this.pro_Cindex].followName = toJson.followName;
						}
						this.pro_ser_sheet = false;
						this.setTotal();
					})
				}
			})
		},
		//基本信息的逻辑结束
		//打开弹窗-生成合同
		openHeTong(){
			this.$refs['quotationForm_ref'].resetFields()
			this.contListAbled = false
			this.$refs.tabs.activeKey = '基本信息'
			this.quotationForm = {}
			this.servicelList = []
			this.quotationTit = '生成合同'
			this.quotationType = 0
			this.getBaseInfos()
			this.quotationDialog = true;
		},
		//打开-签约弹窗
		openSign(){
			this.signContact_sheet = true;
			this.$refs['signForm_ref'].resetFields();
			this.signForm.signTime = ''
			this.signForm.witness = ''
		},
		
		// 确定生成合同
		handleSubmit() {
			console.log(this.quotationType, '1')
			if (this.quotationType === 2) {
				this.quotationDialog = false
			}
			// 先打印下基本信息的校验-开始
			if(this.servicelList.length ===0){
				this.$Message.error("产品及服务不能为空");
				return
			}
			console.log(this.quotationType, '2')

			// 校验付款时间 如果有一条数据没填时间或者金额就返回
			var isOk = true;
			for(let i=0;i<this.quotationForm.payTimeList.length;i++){
				var temp = this.quotationForm.payTimeList[i];
				if(temp.payTime=='' || temp.payBatch==''){
					this.$Message.error("请完善付款时间信息！");
					isOk = false;
					break;
				}
			}
			console.log(this.quotationType, '3')
			
			if(!isOk){
				return
			}
			
			this.$refs['quotationForm_ref'].validate((valid) => {
				if(valid){
					// 校验审批
					var roveInfo =  this.$refs.approve_ref.check_role();
					if(roveInfo==-1){
						return
					}
					this.quotationForm.approvalTempId = roveInfo.approvalTempId,
					this.quotationForm.approvalUserIds = roveInfo.approvalUserIds,
					this.quotationForm.examineUserIds = roveInfo.examineUserIds,
					this.quotationForm.ccUserIds = roveInfo.ccUserIds,
					this.quotationForm.leaveMessage = roveInfo.leaveMessage
					this.quotationForm.servicelList = this.servicelList
					this.quotationForm.quotationFileList = this.quotationForm.quotationFileList
					this.quotationForm.isAlter = this.quotationForm.isAlter ? 1 : 0
					// let param = {
					// 	applyBillCode : this.quotationForm.applyBillCode,			//受理单编号
					// 	applyBillId   : this.quotationForm.applyBillId,				//受理单id
					// 	payMethod	  : this.quotationForm.payMethod,				//付款方式
					// 	payTimeList   : this.quotationForm.payTimeList,				//付款时间集合
					// 	productCount  : this.quotationForm.productCount,			//产品数量
					// 	quotaionAmount: this.quotationForm.quotaionAmount,			//报价总额
					// 	quotaionMethod: this.quotationForm.quotaionMethod,			//报价方式
					// 	quotaionOrder : this.quotationForm.quotaionOrder,			//报价次序
					// 	remark		  : this.quotationForm.remark,					//备注
					// 	servicelList :  this.servicelList,                           //产品及服务
					// 	quotationFileList : this.quotationForm.quotationFileList,   //附件
						
					// 	//审批参数
					// 	approvalTempId : roveInfo.approvalTempId,
					// 	approvalUserIds: roveInfo.approvalUserIds,
					// 	examineUserIds : roveInfo.examineUserIds,
					// 	ccUserIds	   : roveInfo.ccUserIds,
					// 	leaveMessage   : roveInfo.leaveMessage
					// }
					if (this.quotationType === 0) {
						this.baseInfosOpt.filter(item => item.id === this.quotationForm.orgTemplateId ? this.quotationForm.templateBaseInfo = item : '')
						save(this.quotationForm).then(res => {
							if (res.code === 200) {
								this.quotationDialog = false
								this.getContractList()
							}
						})
					} else if (this.quotationType === 1) {
						// this.baseInfosOpt.filter(item => item.id === this.quotationForm.orgTemplateId ? this.quotationForm.templateBaseInfo = item : '')
						update(this.quotationForm).then(res => {
							if (res.code === 200) {
								this.quotationDialog = false
								this.getContractList()
							}
						})
					}
				} else {
					// 校验审批
					var roveInfo =  this.$refs.approve_ref.check_role();
					if(roveInfo==-1){
						return
					}
					this.quotationForm.approvalTempId = roveInfo.approvalTempId,
					this.quotationForm.approvalUserIds = roveInfo.approvalUserIds,
					this.quotationForm.examineUserIds = roveInfo.examineUserIds,
					this.quotationForm.ccUserIds = roveInfo.ccUserIds,
					this.quotationForm.leaveMessage = roveInfo.leaveMessage
					this.quotationForm.servicelList = this.servicelList
					this.quotationForm.quotationFileList = this.quotationForm.quotationFileList
					this.quotationForm.isAlter = this.quotationForm.isAlter ? 1 : 0
					// let param = {
					// 	applyBillCode : this.quotationForm.applyBillCode,			//受理单编号
					// 	applyBillId   : this.quotationForm.applyBillId,				//受理单id
					// 	payMethod	  : this.quotationForm.payMethod,				//付款方式
					// 	payTimeList   : this.quotationForm.payTimeList,				//付款时间集合
					// 	productCount  : this.quotationForm.productCount,			//产品数量
					// 	quotaionAmount: this.quotationForm.quotaionAmount,			//报价总额
					// 	quotaionMethod: this.quotationForm.quotaionMethod,			//报价方式
					// 	quotaionOrder : this.quotationForm.quotaionOrder,			//报价次序
					// 	remark		  : this.quotationForm.remark,					//备注
					// 	servicelList :  this.servicelList,                           //产品及服务
					// 	quotationFileList : this.quotationForm.quotationFileList,   //附件
						
					// 	//审批参数
					// 	approvalTempId : roveInfo.approvalTempId,
					// 	approvalUserIds: roveInfo.approvalUserIds,
					// 	examineUserIds : roveInfo.examineUserIds,
					// 	ccUserIds	   : roveInfo.ccUserIds,
					// 	leaveMessage   : roveInfo.leaveMessage
					// }
					if (this.quotationType === 0) {
						this.baseInfosOpt.filter(item => item.id === this.quotationForm.orgTemplateId ? this.quotationForm.templateBaseInfo = item : '')
						save(this.quotationForm).then(res => {
							if (res.code === 200) {
								this.quotationDialog = false
								this.getContractList()
							}
						})
					} else if (this.quotationType === 1) {
						// this.baseInfosOpt.filter(item => item.id === this.quotationForm.orgTemplateId ? this.quotationForm.templateBaseInfo = item : '')
						update(this.quotationForm).then(res => {
							if (res.code === 200) {
								this.quotationDialog = false
								this.getContractList()
							}
						})
					}
				}
			})
		},
		// 确定签约
		handleSubmit_sign(){
			this.$refs['signForm_ref'].validate((valid) => {
				if(valid){
					contractSign(this.signForm).then(res => {
						if (res.code === 200) {
							this.signContact_sheet = false
							this.getContractList()
						}
					})
				}
			})
		},
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		// 打开签约弹框
		openQuotationDialog() {
			//判断选中的数据是否有未签约的两条数据num，还有是否有其它状态的数据isOtherStatus
			//只有未签约contractStatus==0才能签约
			if(this.idsData==''){			//没有勾选数据
				this.$Message.error("请选择一条未签约的合同！");
				return
			}else{
				if(this.idsData.length==1){		//只有一条数据判断，是否是未签约的
					if(this.idsData[0].contractStatus!=0){
						this.$Message.error("该合同"+this.idsData[0].contractStatusCh);
						return
					}
				}else{
					this.$Message.error("请选择一条未签约的合同！");
					return
				}
			}
			
			this.getDeault_by_ht();
			this.title = '签约';
			this.quotationDialog = true
		},
		// 清空签约弹框
		resetForm() {
			this.$refs['contractForm'].resetFields()
		},
		// 关闭签约弹框
		handleCancel() {
			this.contractDialog = false
		},
		// 提交签约
		// handleSubmit() {
		// 	this.$refs['contractForm'].validate((valid) => {
		// 		if(valid) {
		// 			if(this.isAgain){
		// 				this.isAgain = false;
		// 				this.addHeTongApi()
		// 			}
		// 		}
		// 	})
		// },
		
		
		
	
		
		//新增合同（签约）
		addHeTongApi(){
			var param = {
				contractBizList:this.productData,					//业务信息集合数据
				contractNo     :this.contracTemInfo.contractNo, //合同编号
				contractSum    :this.contractForm.total_cost,	//合计报价
				counselor : this.contractForm.CTelName,			//知识产权顾问
				counselorSuggest : this.contractForm.proposal,	//知识产权专业建议
				counselorTel : this.contractForm.CTelNum,		//知识产权联系电话
				deptContractId : this.contracTemInfo.id,			//所使用合同模版ID
				extraChargeList:this.extraChargeData, 			//附加费用
				offerId : 	this.contractForm.offerId,			//报价id
				otherMatter : this.contractForm.proposalTow,	//约定其他事项
				thiAddress  : this.contractForm.Caddress,		//丙方通信地址
				thiParty	: this.contractForm.CName,   		//丙方（协作方）
			}
			htAdd(param).then(res=>{
				if(res.code==200){
					this.initResetData()
				}
			}).catach(error=>{
				setTimeout(()=>{
					this.isAgain = true;
				},1000)
			})
		},
		//重置刷新列表数据
		initResetData(){
			this.ids     = [];
			this.idsData = [];
			this.searchForm.pageNum = 1;
			this.$Message.success("操作成功");
			this.getContractList();
			this.contractDialog = false;
			setTimeout(()=>{
				this.isAgain = true;
			},1000)
		},
		// 获取合同列表数据
		getContractList() {
			// const param = {
			// 	contractNo : this.searchForm.contract_no,
			// 	contractStatus : this.searchForm.status || '',
			// 	counselor : this.searchForm.IP_consultant,
			// 	createTime : this.searchForm.create_date,
			// 	firPerson : this.searchForm.partyA,
			// 	secPerson : this.searchForm.partyB,
			// 	thiPerson : this.searchForm.partyC,
			// 	signBeginTime : this.searchForm.signing_time,
			// 	signEndTime : this.searchForm.end_time,
			// 	pageSize : this.searchForm.pageSize,
			// 	pageNum  : this.searchForm.pageNum
			// }
			contractList(this.searchForm).then(res=>{
				if (res.code === 200) {
					this.contractListData = res.rows;
					this.contractListData.forEach(item => {
						if (item.startTime && item.endTime) {
							item.startTimeEndTime =`${item.startTime} 至 ${item.endTime}` 
						}
					})
					this.total = res.total
				}
			})
		},
		//获取合同模板
		getTemplate(){
			morenContract({}).then(res => {
				this.contracTemInfo = res.data;
				
				this.contractForm.BName = res.data.secondPartyName;
				this.contractForm.Baddress = res.data.secondPartyAddress;
				this.contractForm.BTelName = res.data.secondPartyPhoneName;
				this.contractForm.BTelNum = res.data.secondPartyPhone;
			})
		},
		//合同详情信息
		getDeault_by_ht(){
			// const param = {
			// 	category : this.lookInfo.category,
			// 	id		 : this.lookInfo.id
			// }
			detail(this.lookInfo.id).then(res=>{
				if(res.code==200){
					this.quotationForm = res.data
					this.servicelList = res.data.serviceDetailList
					// this.quotationForm.forEach(item => {
					// 	item.payMethod = Number(item.payMethod)
					// })
					// console.log(this.quotationForm, 'quotationForm')
					// return 
					this.productData = res.data.productBizList;
					this.extraChargeData = res.data.extraChargeList;
					this.contractForm.offerId = res.data.offerId;
					this.contractForm.total_cost = res.data.contractSum;
					this.contractForm.total_cost = Math.floor(this.contractForm.total_cost * 100) / 100;
					this.contractForm.total_cost_Big = this.$util.number_chinese(this.contractForm.total_cost);
					
					//处理支付详情数据
					res.data.payBatchList.forEach((item)=>{
						var str = item.payProductName.split(" ");
						this.$set(item,"payProducList",str);
					})
					this.ht_pay_data = res.data.payBatchList;

				}
			})
		},
		//获取签约信息-其它地方跳转过来的
		getInfo_ht(){
			router_htAdd(this.$route.query.id).then(res=>{
				console.log("res: " + JSON.stringify(res));
				
				//回填信息
				this.contractForm.AName = res.data.firParty;
				this.contractForm.Aaddress = res.data.firAddress;
				this.contractForm.ATelName =res.data.firPerson;
				this.contractForm.ATelNum = res.data.firTel;
				
				
				
				this.productData = res.data.productBizList;
				this.extraChargeData = res.data.extraChargeList;
				this.contractForm.offerId = res.data.offerId;
				this.contractForm.total_cost = res.data.offerSum;
				this.contractForm.total_cost_Big = this.$util.number_chinese(res.data.offerSum);
				//处理支付详情数据
				res.data.payBatchList.forEach((item)=>{
					var str = item.payProductName.split(" ");
					this.$set(item,"payProducList",str);
				})
				this.ht_pay_data = res.data.payBatchList;
				
				this.contractDialog = true;
			})
		},
		
		
		
		
		
		// 多选框选中数据
		selectChange(selection) {
			this.ids = selection.map(item => item.id);
			this.signForm.id = selection[0].id
			this.idsData = selection;
			if(this.ids.length==1){
				this.lookInfo = selection[0];	//详情信息；
				this.contractForm.AName = selection[0].firParty;
				this.contractForm.Aaddress = selection[0].firAddress;
				this.contractForm.ATelName = selection[0].firPerson;
				this.contractForm.ATelNum = selection[0].firTel;
			}
		},
		// 编辑合同
		toEdit(data) {
			this.lookInfo = data;	//详情信息；
			// this.contractForm.AName = data.firParty;
			// this.contractForm.Aaddress = data.firAddress;
			// this.contractForm.ATelName = data.firPerson;
			// this.contractForm.ATelNum = data.firTel;
			// this.contractForm.BName = data.secParty;
			// this.contractForm.Baddress = data.secAddress;
			// this.contractForm.BTelName = data.secPerson;
			// this.contractForm.BTelNum = data.secTel;
			this.getDeault_by_ht();
			
			this.quotationDialog = true;
		},
		// 合同详情
		lookDefault(data) {
			this.lookInfo = data;
			this.getDeault_by_ht();
			this.contListAbled = true
			this.quotationDialog = true;
			// this.tableInfo = data;
			// this.contractDialog_def = true;
		},
		//产品明细删除
		toDel_one(data){
			if(this.productData.length==1){
				this.$Message.error("至少保留一条产品明细信息！")
				return
			}
			var _this = this;
			this.$Modal.confirm({
				title: "确定删除当前数据吗？",
				cancelText : "取消",
				onOk(){
					_this.productData.splice(data._index,1)
					_this.setTotal()
				}
			});
		},
		//附加费用删除
		toDel_tow(data){
			var _this = this;
			this.$Modal.confirm({
				title: "确定删除当前数据吗？",
				cancelText : "取消",
				onOk(){
					_this.extraChargeData.splice(data._index,1)
					_this.setTotal()
				}
			});
		},
		//删除后重新，计算合计金额
		// setTotal(){
		// 	var total = 0;
		// 	this.productData.forEach((item)=>{
		// 		total += item.totalPrice
		// 	})
		// 	this.extraChargeData.forEach((item)=>{
		// 		total += item.price
		// 	})
		// 	this.contractForm.total_cost = total;
		// 	this.contractForm.total_cost = Math.floor(this.contractForm.total_cost * 100) / 100;
		// 	this.contractForm.total_cost_Big = this.$util.number_chinese(this.contractForm.total_cost);
		// },
		//删除单个
		deleteData(data){
			var _this = this;
			this.$Modal.confirm({
				title: "确定删除当前数据吗？",
				cancelText : "取消",
				onOk(){
					deleteOffer([data.offerId]).then(res=>{
						if(res.code==200){
							_this.initResetData();
						}
					})
				}
			});
		},
		//删除多个
		deleteDataAll(){
			var isOk = true;
			for(var i=0;i<this.idsData.length;i++){
				var temp = this.idsData[i];
				if(temp.contractStatus!=0){		//只有未签约的能删除
					isOk = false;
					break
				}
			}
			if(!isOk){
				this.$Message.error("请选择未签约的合同")
				return
			}
			console.log(":ok");
			var _this = this;
			this.$Modal.confirm({
				title: "确定删除当前数据吗？",
				cancelText : "取消",
				onOk(){
					deleteOffer(_this.ids).then(res=>{
						if(res.code==200){
							_this.initResetData();
						}
					})
				}
			});
		},
		//创建时间
		changeTime(e){
			this.searchForm.endTime = e;
		},
		//签约时间
		changeQyTime(e){
			// console.log("e: " + JSON.stringify(e));
			this.searchForm.signTime = e
			// this.searchForm.end_time  = e[1];
		},
		
		
		//归档
		go_pigeonhole(){
			this.$Modal.confirm({
                title: "是否归档",
                onOk: () => {
                    pigeonhole(this.ids).then(res=>{
						this.initResetData();
					})
                }
            })
		},
		//作废
		go_cancelled(){		
			this.$Modal.confirm({
                title: "是否作废",
                onOk: () => {
                    cancelled(this.ids).then(res=>{
						this.initResetData();
					})
                }
            })	
			
		},
		//借出
		go_lend(){
			this.$Modal.confirm({
                title: "是否借出",
                onOk: () => {
                    lend(this.ids).then(res=>{
						this.initResetData();
					})
                }
            })
		},
		
		// 搜索
		handleSearch(name) {
            this.getContractList()
		},
		// 清空搜索
		handleReset(name) {
			this.searchForm.signing_time = "";
			this.searchForm.end_time  = "";
			this.$refs[name].resetFields()
			this.getContractList()
		},
		// 当前页面
		changePage(pages) {
			this.searchForm.pageNum = pages
			this.getContractList()
		},
		// 每页显示条数
		changePageSize(size) {
			this.searchForm.pageSize = size
			this.getContractList()
		},
		//导出
		exportData(){
			const param = {
				contractNo : this.searchForm.contract_no,
				contractStatus : this.searchForm.status,
				counselor : this.searchForm.IP_consultant,
				createTime : this.searchForm.create_date,
				firPerson : this.searchForm.partyA,
				secPerson : this.searchForm.partyB,
				thiPerson : this.searchForm.partyC,
				signBeginTime : this.searchForm.signing_time,
				signEndTime : "",
				pageSize : this.searchForm.pageSize,
				pageNum  : this.searchForm.pageNum
			}
			this.axiosPost('/crm/contract/export',param,'合同列表')
		},
		loadHeTong(data){
			this.$util.axiosPostPdf('/crm/contract/download/'+data.id,null,'合同文件下载')
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
			this.contractListTitle = this.TranListNo.concat(e);
		},
		getTranList(){
			//显示要的数据
			this.TranList = this.contractListTitle.filter((item)=>{
				if(item.key&&item.key!='id'&&item.key!='action'){
					return item
				}
			})
			//不要显示的数据
			this.TranListNo = this.contractListTitle.filter((item)=>{
				if(!item.key||item.key=='id'||item.key=='action'){
					return item
				}
			})
		},
		// 下载pdf
		downloadPdf() {
			const InstructionManualvv = this.fileStream;
			let blob = new Blob([InstructionManualvv.data], {type: 'application/pdf;charset=UTF-8'});
			let fileName = '合同.pdf';
			if (window.navigator.msSaveOrOpenBlob) {
				navigator.msSaveBlob(blob, fileName)
			} else {
				var link = document.createElement('a');
				link.href = window.URL.createObjectURL(blob);
				link.download = fileName;
				link.click();
				window.URL.revokeObjectURL(link.href) //释放内存
			}
		},
		// 获取pdf文件
		getPdfCode (index) {
			this.$set(this.loading, index, true)
			axios({
				method: 'get',
				url: process.env.VUE_APP_BASE_API + `/crm/crm/contract/preview/${this.contractID}`,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Authorization': 'Bearer ' + this.$util.getCookie('Admin-Token')
				},
				responseType: 'blob'
			}).then(res => {
				this.fileStream = res
				this.src  = this.getObjectURL(res.data);
				this.previewContract = true
				this.$set(this.loading, index, false)
			})
		},
		// 分页显示pdf
		changePdfPage (val) {
			if (val === 0 && this.contractCurrentPage > 1) {
				this.contractCurrentPage--
			}
			if (val === 1 && this.contractCurrentPage < this.contractPageCount) {
				this.contractCurrentPage++
			}
		},
		// pdf加载时先加载第一页
		loadPdfHandler () {
			this.contractCurrentPage = 1
		},
		// 将返回的流数据转换为url
		getObjectURL(file) {
			let url = null;
			if (window.createObjectURL != undefined) { // basic
				url = window.createObjectURL(file);
			} else if (window.webkitURL != undefined) { // webkit or chrome
				try {
					url = window.webkitURL.createObjectURL(file);
				} catch (error) {

				}
			} else if (window.URL != undefined) { // mozilla(firefox)
				try {
					url = window.URL.createObjectURL(file);
				} catch (error) {

				}
			}
			return url;
		}
	}
}
</script>
<style lang="scss" scoped>
	.contract {}
	.topbox {
		padding: 15px 0 20px 0;
		.title {
			font-size: 22px;
			text-align: center;
			color: #000;
			margin-bottom: 15px;
		}
		.num {
			font-size: 14px;
			text-align: right;
			span{
				color: #f30;
			}
		}
	}
	.content {
		padding: 15px;
		line-height: 22px;
		text-align: justify;
	}
	.content1 {
		padding: 5px 15px;
		line-height: 22px;
		text-align: justify;
	}
	.bank-info {
		padding: 20px 15px 10px 15px;
		.box1 {
			margin-bottom: 15px;
		}
		.box2 {
			margin-bottom: 10px;
			font-weight: 700;
		}
	}
	.text-desc{
		padding: 5px 15px;
		margin-bottom: 15px;
		.title {
			font-weight: 700;
			margin-bottom: 15px;
		}
		.con {
			padding-left: 30px;
			line-height: 24px;
			text-align: justify;
			margin-bottom: 10px;
		}
	}
	.bottombox {
		padding: 15px 0;
		.title{
			font-size: 16px;
			text-align: center;
			color: #bbb;
		}
	}
	.table-form-ht {
		border: 2px solid #dfe4ed;
		margin-bottom: 25px;
		.title {
			font-weight: 700;
			font-size: 16px;
			padding: 15px 15px 0 15px;
			text-align: left;
		}
		.title1 {
			font-weight: 700;
			font-size: 14px;
			height: 32px;
			line-height: 32px;
		}
	}
</style>