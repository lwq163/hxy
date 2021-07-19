<template>
    <div class="contract">
		<tab-menu></tab-menu>
		<div class="search hxy-mb-25">
			<Form ref="searchForm" :model="searchForm" :label-width="100" @keydown.native.enter.prevent="handleSearch">
				<Row>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
                        <FormItem label="合同编号" prop="contract_no">
                            <Input type="text" v-model="searchForm.contract_no" placeholder="请输入合同编号"></Input>
                        </FormItem>
                    </Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
                        <FormItem label="创建时间" prop="create_date">
                            <DatePicker
								style="width: 100%"
								type="datetime"
								v-model="searchForm.create_date" 
								@on-change="changeTime"
								:editable="false" 
								format="yyyy-MM-dd HH:mm:ss"
								placeholder="请选择创建时间"
								placement="bottom-start" 
								clearable>
							</DatePicker>
                        </FormItem>
                    </Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
                        <FormItem label="甲方" prop="partyA">
                            <Input type="text" v-model="searchForm.partyA" placeholder="请输入甲方"></Input>
                        </FormItem>
                    </Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
                        <FormItem label="乙方" prop="partyB">
                            <Input type="text" v-model="searchForm.partyB" placeholder="请输入乙方"></Input>
                        </FormItem>
                    </Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
                        <FormItem label="丙方" prop="partyC">
                            <Input type="text" v-model="searchForm.partyC" placeholder="请输入丙方"></Input>
                        </FormItem>
                    </Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
                        <FormItem label="知识产权顾问" prop="IP_consultant">
                            <Input type="text" v-model="searchForm.IP_consultant" placeholder="请输入知识产权顾问"></Input>
                        </FormItem>
                    </Col>
					
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
                        <FormItem label="签约时间" prop="time">
                            <DatePicker
								style="width: 100%"
								type="daterange"
								v-model="searchForm.time"
								@on-change="changeQyTime"
								format="yyyy-MM-dd"
								placeholder="请选择签约时间" 
								:editable="false" 
								placement="bottom-start" 
								clearable>
							</DatePicker>
                        </FormItem>
                    </Col>
                    
					
                    <Col :md="12" :lg="8" :xl="6" :xxl="6">
                        <FormItem label="合同状态" prop="status">
                            <Select v-model="searchForm.status" placeholder="请选择合同状态" clearable filterable>
                                <Option v-for="(val,index) in contractType" :value="val.value" :key="index" v-if="index<2">{{val.label}}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    
					<Col span="24" class="tr">
                        <Button type="primary" @click="handleSearch('searchForm')" icon="ios-search" class="hxy-ml-30 hxy-mr-10">搜索</Button>
						<Button type="default" @click="handleReset('searchForm')" icon="ios-refresh">清空</Button>
                    </Col>
				</Row>
			</Form>
		</div>
        <div class="hxy-mb-25">
			<Button type="primary" ghost class="hxy-mr-10" @click="openQuotationDialog">签约</Button>
			<Button class="hxy-mr-10" @click="go_pigeonhole"  :disabled="ids==''">归档</Button>
			<Button class="hxy-mr-10" @click="go_cancelled"  :disabled="ids==''">作废</Button>
			<Button class="hxy-mr-10" @click="go_lend"  :disabled="ids==''">借出</Button>
            <Button class="hxy-mr-10" @click="openTran">栏目标题</Button>
			<Button type="error" class="hxy-mr-10" @click="deleteDataAll" :disabled="ids==''">删除</Button>
			<!-- <Button type="primary" class="hxy-mr-20" @click="exportData()">导出</Button> -->
		</div>
		<div class="hxy-mb-25">
			<Table stripe border :columns="contractListTitle" :data="contractListData" :loading="pageLoading" @on-selection-change="selectChange"></Table>
		</div>
		<div class="pos-r tr">
			<Page :total="total" :page-size="searchForm.pageSize" :current="searchForm.pageNum" placement="top" show-total show-sizer show-elevator @on-change="changePage" @on-page-size-change="changePageSize"></Page>
		</div>

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
									<FormItem label="联系人方式" prop="ATelNum">
										<Input type="text" v-model="contractForm.ATelNum" disabled></Input>
									</FormItem>
								</Col>
							</Row>
							
							
							<Row class="hxy-pl-15 hxy-pr-15 hxy-pt-20">
								<Col span="11">
									<FormItem label="乙方(受托人)" prop="BName">
										<Input type="text" v-model="contractForm.BName"  disabled></Input>
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
							
							
							<Row class="hxy-pl-15 hxy-pr-15 hxy-pt-20">
								<Col span="11">
									<FormItem label="丙方(协作方)" prop="CName">
										<Input type="text" v-model="contractForm.CName"  ></Input>
									</FormItem>
								</Col>
								<Col span="2"></Col>
								<Col span="11">
									<FormItem label="通信地址" prop="Caddress">
										<Input type="text" v-model="contractForm.Caddress" ></Input>
									</FormItem>
								</Col>
							</Row>
							<Row class="hxy-pl-15 hxy-pr-15">
								<Col span="11">
									<FormItem label="知识产权顾问" prop="CTelName">
										<Input type="text" v-model="contractForm.CTelName"  ></Input>
									</FormItem>
								</Col>
								<Col span="2"></Col>
								<Col span="11">
									<FormItem label="联系人电话" prop="CTelNum">
										<Input type="text" v-model="contractForm.CTelNum" ></Input>
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
						<div class="title">致力于行业服务标准制定者和引领者</div>
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
                <Button type="primary" @click="handleSubmit">确定签约</Button>
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
		
		
		<!-- 栏目标题弹窗 -->
		<tranFer :dataShow="TranList"  :TranListNo="TranListNo"  @refresh= "refresh" @closeTran="closeTran"  v-show="TranFlag"></tranFer>
		
		
    </div>
</template>
<script>
import { morenContract} from '_s/enterprise'
import { deleteOffer} from '_s/offerPrice'
import { htAdd,htList,getDefault,ht_cancelled,ht_pigeonhole,ht_lend,router_htAdd } from '_s/heTong'
import { mapGetters} from 'vuex'
export default {
	data(){
		return{
			searchForm: {
				contract_no: '',
                create_date: '',
                customer: '',
				partyA: '',
				partyB: '',
				partyC: '',
				IP_consultant: '',
				tiem	:"",
				signing_time: '',
				end_time: "",
				status: '',
				pageNum: 1, // 页数
				pageSize: 10, // 每页显示数量
			},
            contractType: [],
			total: 0,
			pageLoading: false,//页面loading动画
			ids: [],
			idsData:[],
			single: true,
			multiple: true,
			title: '',
			

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
					type : "index",
					resizable: true,
					width: 80,
					align: 'center'
				},
				{
					title: '合同编号',
					key: 'contractNo',
					resizable: true,
					width: 250,
					align: 'center',
				},
				{
					title: '创建时间',
					key: 'createTime',
					resizable: true,
					width: 200,
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
					title: '所属人',
					key: 'userName',
					resizable: true,
					width: 150,
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
					key: 'contractPaperStatus',
					resizable: true,
					width: 150,
					align: 'center',
				},
				{
					title: '甲方(委托人)',
					key: 'firParty',
					resizable: true,
					width: 150,
					align: 'center',
				},
				{
					title: '甲方通信地址',
					key: 'firAddress',
					resizable: true,
					width: 200,
					align: 'center',
				},
				{
					title: '甲方联系人',
					key: 'firPerson',
					resizable: true,
					width: 150,
					align: 'center',
				},
				{
					title: '乙方(受托人)',
					key: 'secParty',
					resizable: true,
					width: 150,
					align: 'center',
				},
				{
					title: '乙方通信地址',
					key: 'secAddress',
					resizable: true,
					width: 200,
					align: 'center',
				},
				{
					title: '乙方服务监督（投诉）',
					key: 'secPerson',
					resizable: true,
					width: 200,
					align: 'center',
				},
				{
					title: '乙方服务电话',
					key: 'secTel',
					resizable: true,
					width: 150,
					align: 'center',
				},
				{
					title: '丙方（协作方）',
					key: 'thiParty',
					resizable: true,
					width: 150,
					align: 'center',
				},
				{
					title: '丙方通信地址',
					key: 'thiAddress',
					resizable: true,
					width: 200,
					align: 'center',
				},
				{
					title: '知识产权顾问',
					key: 'counselor',
					resizable: true,
					width: 150,
					align: 'center',
				},
				{
					title: '知识产权顾问联系电话',
					key: 'counselorTel',
					resizable: true,
					width: 200,
					align: 'center',
				},
				{
					title: '产品信息',
					key: 'productName',
					resizable: true,
					width: 150,
					align: 'center',
				},
				{
					title: '附加费用',
					key: 'extraCharge',
					resizable: true,
					width: 150,
					align: 'center',
				},
				{
					title: '合计金额',
					key: 'contractAmount',
					resizable: true,
					width: 150,
					align: 'center',
				},
				{
					title: '知识产权专业建议',
					key: 'counselorSuggest',
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
					title: '开户行',
					key: 'secBank',
					resizable: true,
					width: 150,
					align: 'center',
				},
				{
					title: '账户名称',
					key: 'secAccpuntName',
					resizable: true,
					width: 150,
					align: 'center',
				},
				{
					title: '账户号',
					key: 'secAccount',
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
										this.toEdit(params.row)
									}
								}
							}, '签约'),
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
										this.lookDefault(params.row)
									}
								}
							}, '详情'),
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
										this.deleteData(params.row)
									}
								}
							}, '删除'),
							h('Button', {
								props: {
									type: 'primary',
									size: 'small'
								},
								style: {
							        color: '#ffffff',
									display : params.row.contractStatus!=0?"inline-block":"none"
							    },
								on: {
									click: () => {
										this.loadHeTong(params.row)
									}
								}
							}, '下载')
						])
					}
				}
			],
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
		}
	},
	computed: {
		...mapGetters({
			config: 'get_config',
			user: 'get_userinfo'
		})
	},
	created() {
		if(this.$route.query.id){		//如果是其它页面的生成签约合同跳转过来的
			this.getInfo_ht();
		}
		this.getTranList();
	},
	mounted(){
		//获取合同状态字典
		this.contractType = this.filterDict(this.config,'crm_contract_status');
		//合同模板
		this.getTemplate();
		
		//列表数据
		this.getContractList()
	},
	methods: {
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
			this.contractDialog = true
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
		handleSubmit() {
			this.$refs['contractForm'].validate((valid) => {
				if(valid) {
					if(this.isAgain){
						this.isAgain = false;
						this.addHeTongApi()
					}
				}
			})
		},
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
		// 获取列表数据
		getContractList() {
			const param = {
				contractNo : this.searchForm.contract_no,
				contractStatus : this.searchForm.status || '',
				counselor : this.searchForm.IP_consultant,
				createTime : this.searchForm.create_date,
				firPerson : this.searchForm.partyA,
				secPerson : this.searchForm.partyB,
				thiPerson : this.searchForm.partyC,
				signBeginTime : this.searchForm.signing_time,
				signEndTime : this.searchForm.end_time,
				pageSize : this.searchForm.pageSize,
				pageNum  : this.searchForm.pageNum
			}
			htList(param).then(res=>{
				this.contractListData = res.rows;
				this.total = res.total;
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
			const param = {
				category : this.lookInfo.category,
				id		 : this.lookInfo.id
			}
			getDefault(param).then(res=>{
				if(res.code==200){
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
			this.idsData = selection;
			if(this.ids.length==1){
				this.lookInfo = selection[0];	//详情信息；
				this.contractForm.AName = selection[0].firParty;
				this.contractForm.Aaddress = selection[0].firAddress;
				this.contractForm.ATelName = selection[0].firPerson;
				this.contractForm.ATelNum = selection[0].firTel;
			}
		},
		toEdit(data) {
			this.title = '签约';

			this.lookInfo = data;	//详情信息；
			this.contractForm.AName = data.firParty;
			this.contractForm.Aaddress = data.firAddress;
			this.contractForm.ATelName = data.firPerson;
			this.contractForm.ATelNum = data.firTel;
			this.contractForm.BName = data.secParty;
			this.contractForm.Baddress = data.secAddress;
			this.contractForm.BTelName = data.secPerson;
			this.contractForm.BTelNum = data.secTel;
			this.getDeault_by_ht();
			
			this.contractDialog = true;
		},
		lookDefault(data) {
			this.tableInfo = data;
			this.contractDialog_def = true;
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
		setTotal(){
			var total = 0;
			this.productData.forEach((item)=>{
				total += item.totalPrice
			})
			this.extraChargeData.forEach((item)=>{
				total += item.price
			})
			this.contractForm.total_cost = total;
			this.contractForm.total_cost = Math.floor(this.contractForm.total_cost * 100) / 100;
			this.contractForm.total_cost_Big = this.$util.number_chinese(this.contractForm.total_cost);
		},
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
			this.searchForm.create_date = e;
		},
		//签约时间
		changeQyTime(e){
			console.log("e: " + JSON.stringify(e));
			this.searchForm.signing_time = e[0];
			this.searchForm.end_time  = e[1];
		},
		
		
		//归档
		go_pigeonhole(){
			ht_pigeonhole(this.ids).then(res=>{
				console.log("归档res: " + JSON.stringify(res));
				this.initResetData();
			}).catch(error=>{
				console.log("error: " + JSON.stringify(error));
			})
		},
		//作废
		go_cancelled(){			
			ht_cancelled(this.ids).then(res=>{
				console.log("作废res: " + JSON.stringify(res));
				this.initResetData();
			}).catch(error=>{
				
			})
		},
		//借出
		go_lend(){
			ht_lend(this.ids).then(res=>{
				console.log("借出res: " + JSON.stringify(res));
				this.initResetData();
			}).catch(error=>{
				
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