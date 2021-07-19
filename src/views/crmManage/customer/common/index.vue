<template>
  <div>
      <tab-menu></tab-menu>
      <div class="hxy-mt-20">
          <Form :label-width="80"  :model="customerSearch" ref="customerForm">
              <Row>
                  <Col :md="12" :lg="8" :xl="6" :xxl="6">
                    <FormItem label="客户编号" prop="customerNo">
                        <Input v-model="customerSearch.customerNo" clearable/>
                    </FormItem>
                  </Col>
                  <Col :md="12" :lg="8" :xl="6" :xxl="6">
                    <FormItem label="客户名称" prop="companyName">
                        <Input v-model="customerSearch.companyName" clearable/>
                    </FormItem>
                  </Col>
                  <Col :md="12" :lg="8" :xl="6" :xxl="6">
                    <FormItem label="区域" prop="registerAddress">
                        <Input v-model="customerSearch.registerAddress" clearable/>
                    </FormItem>
                  </Col>
                  <Col :md="12" :lg="8" :xl="6" :xxl="6">
                    <FormItem label="所属行业" prop="industry">
                        <Select v-model="customerSearch.industry" clearable>
                            <Option v-for="(item,index) in industry" :key="index" :value="item.value">{{item.label}}</Option>
                        </Select>
                    </FormItem>
                  </Col>
                  <Col :md="12" :lg="8" :xl="6" :xxl="6">
                    <FormItem label="渠道" prop="custChannel">
                        <Select v-model="customerSearch.custChannel" clearable>
                            <Option v-for="(item,index) in customerChannel" :key="index" :value="item.value">{{item.label}}</Option>
                        </Select>
                    </FormItem>
                  </Col>
                  <Col :md="12" :lg="8" :xl="6" :xxl="6">
                    <FormItem label="企业类型" prop="comCharacter">
                        <Select v-model="customerSearch.comCharacter" clearable>
                            <Option v-for="(item,index) in companyType" :key="index" :value="item.value">{{item.label}}</Option>
                        </Select>
                    </FormItem>
                  </Col>
                  <Col :md="12" :lg="8" :xl="6" :xxl="6">
                    <FormItem label="规模" prop="staffSize">
                        <Select v-model="customerSearch.staffSize" clearable>
                            <Option v-for="(item,index) in staffSizeOpt" :key="index" :value="item.value">{{item.label}}</Option>
                        </Select>
                    </FormItem>
                  </Col>
                  <Col :md="12" :lg="8" :xl="6" :xxl="6">
                    <FormItem label="成立时间" prop="registerTime">
                        <Select v-model="customerSearch.registerTime" clearable>
                            <Option v-for="(item,index) in registerTime" :key="index" :value="item.value">{{item.label}}</Option>
                        </Select>
                    </FormItem>
                  </Col>
                  <Col span="24" class="tr">
                        <Button type="primary" @click="handleSearchCustomer" icon="ios-search" class="hxy-ml-30 hxy-mr-10">搜索</Button>
                        <Button type="default" @click="handleReset('customerForm')" icon="ios-refresh">清空</Button>
                  </Col>
              </Row>
          </Form>
      </div>
      <div>
          <Button class="hxy-mr-20" type="primary" ghost :disabled="selectBtn" @click="customerChargeBtn">认领客户</Button>
          <!-- <Button class="hxy-mr-20" @click="addCustomer">新增客户</Button> -->
          <Button class="hxy-mr-20" :disabled="selectBtn" @click="customerProfile">客户档案</Button>
          <Button class="hxy-mr-20" :disabled="selectBtn" @click="relatedCustomer">关联客户</Button>
          <Button class="hxy-mr-20" :disabled="selectBtn" @click="labelModal">标签</Button>
          <Button class="hxy-mr-20" :disabled="selectBtn" @click="transfer">批量转移</Button>
          <Button class="hxy-mr-20" @click="transKey">栏目调整</Button>
      </div>
      <div class="hxy-mt-20">
          <Table border ref="paymentCollectionTable" :columns="payCollTitle" :data="payCollData" @on-selection-change="customerSelect"></Table>
      </div>
      <div class="hxy-mt-20 tr">
          <Page :total="total" :page-size="customerSearch.pageSize" :current="customerSearch.pageNum" placement="top" show-total show-sizer show-elevator @on-change="changePage" @on-page-size-change="changePageSize"></Page>
      </div>
      <!-- 新增客户 -->
      <Modal :title="dialogTit" :width="720" :mask-closable="false" :scrollable="true" v-model="dialogMod">
          <div slot="footer">
                <Button @click="dialogMod = false">取消</Button>
                <Button type="primary" class="btn-warning" @click="addCustomerOk('addCustomerPar')">保存</Button>
          </div>
          <Form ref="addCustomerPar" :model="addCustomerPar" :rules="addCustomerRules" :label-width="140">
                <FormItem label="统一社会信用代码" prop="creditCode">
                    <Input v-model="addCustomerPar.creditCode" @on-blur="customerByCreditCode"/>
                </FormItem>
                <FormItem label="客户名称" prop="companyName">
                    <Input v-model="addCustomerPar.companyName" :disabled="customerInfo"/>
                </FormItem>
                <FormItem label="行业" prop="industry">
                    <Select
                        v-model="addCustomerPar.industry"
                        filterable
                        :disabled='customerInfo'
                        >
                        <Option v-for="(item, index) in industry" :key="index" :value="item.value">{{item.label}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="实际经营地址" prop="actualAddress">
                    <Input :disabled='customerInfo' placeholder="" v-model="addCustomerPar.actualAddress"></Input>
                </FormItem>
                <FormItem label="E-mail" prop="email">
                    <Input :disabled='customerInfo' placeholder="" v-model="addCustomerPar.email"></Input>
                </FormItem>
                <FormItem label="网址" prop="website">
                    <Input :disabled='customerInfo' placeholder="" v-model="addCustomerPar.website"></Input>
                </FormItem>
                <FormItem label="联系电话" prop="telephone">
                    <Input type='number' :disabled='customerInfo' placeholder="" v-model="addCustomerPar.telephone"></Input>
                </FormItem>
                <FormItem label="联系人" prop="linkMan">
                    <Input :disabled='customerInfo' placeholder="" v-model="addCustomerPar.linkMan"></Input>
                </FormItem>
                <FormItem label="跟单人" prop="followUpPerson">
                    <Select
                        v-model="addCustomerPar.followUpPerson"
                        filterable
                        multiple
                        :disabled='customerDisabled'
                        >
                        <Option v-for="(item, index) in queryCurrStaff" :key="index" :value="item.userId">{{item.nickName}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="承办人" prop="undertaker">
                    <Select
                        v-model="addCustomerPar.undertaker"
                        filterable
                        multiple
                        :disabled='customerDisabled'
                        >
                        <Option v-for="(item, index) in queryCurrStaff" :key="index" :value="item.userId">{{item.nickName}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="跟进策略" prop="followUpStrategy">
                    <Input :disabled='customerDisabled' placeholder="" v-model="addCustomerPar.followUpStrategy"></Input>
                </FormItem>
          </Form>
      </Modal>
      <!-- 客户档案 -->
      <Modal :title="profileTit" :width="720" :mask-closable="false" :scrollable="true" v-model="profileMod">
         <div slot="footer">
            <Button @click="profileMod = false">取消</Button>
            <Button type="primary" class="btn-warning" @click="profileOk">保存</Button>
         </div>
        <Tabs>
            <TabPane label="基础信息" :disabled="baseInfo">
                 <Form :model="baseInfoPar" :label-width="130">
                    <FormItem label="客户名称" prop="companyName">
                        <Input v-model="baseInfoPar.companyName" clearable/>
                    </FormItem>
                    <FormItem label="统一社会信用代码" prop="creditCode">
                        <Input v-model="baseInfoPar.creditCode" :disabled='customerDisabled' clearable></Input>
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
                            @on-change="getBusinessTime"
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
                <div class="hxy-mb-15" v-show="customerDisabled === false">
                    <Button @click="handleContacts">添加联系人</Button>
                </div>
                <div class="hxy-mb-25">
                    <Table border :columns="contactListTitle" :data="listContact"></Table>
                </div>
            </TabPane>
            <TabPane label="决策人信息" :disabled="decisionsInfo">
                <div class="hxy-mb-15" v-show="customerDisabled === false">
                    <Button @click="handleAddShareholderBtn">添加决策人信息</Button>
                </div>
                <div class="hxy-mb-25">
                    <Table :columns="listShareholderTitle" :data="listShareholder"></Table>
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
                        <Select v-model="extraInfo.custChannel" clearable>
                            <Option v-for="(item,index) in customerChannel" :key="index" :value="item.value">{{item.label}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="意向购买产品" prop="purposeProduct">
                        <Input  placeholder="" v-model="extraInfo.purposeProduct" :disabled='customerDisabled' clearable></Input>
                    </FormItem>
                    <FormItem label="客户意向描述" prop="purposrDesc">
                        <Input  placeholder="" v-model="extraInfo.purposrDesc" :disabled='customerDisabled' clearable></Input>
                    </FormItem>

                    <FormItem label="回访周期" prop="visitCycleType">
                        <Select v-model="extraInfo.visitCycleType" filterable :disabled='customerDisabled' clearable @on-change="handleVisitCycleType">
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
                    <FormItem label="附件" prop="files">
                        <modalUpLoad upLoadText="上传附件" @listenFile="listenFile" ref="fileOne"></modalUpLoad>
                    </FormItem>
                </Form>
            </TabPane>
        </Tabs>
      </Modal>
      <!-- 关联客户 -->
      <Modal :title="relatedTit" :width="720" :mask-closable="false" :scrollable="true" v-model="relatedMod">
            <div slot="footer">
                <Button @click="relatedMod = false">取消</Button>
                <Button type="primary" class="btn-warning" @click="relatedCustomerOk">保存</Button>
            </div>
            <Form>
                <FormItem label="">
                    <Button @click="addRelated">添加</Button>
                </FormItem>
            </Form>
            <Table border ref="paymentCollectionTable" :columns="relatedTitle" :data="relatedData" ></Table>
            <div class="hxy-mt-20 tr">
                <Page :total="related.total" :page-size="related.pageSize" :current="related.pageNum" placement="top" show-total show-sizer show-elevator @on-change="changeRelatedPage" @on-page-size-change="changeRelatedPageSize"></Page>
            </div>
      </Modal>
      <!-- 标签 -->
      <Modal :title="labelTit" :width="720" :mask-closable="false" :scrollable="true" v-model="labelMod">
            <div slot="footer">
                <Button @click="labelMod = false">取消</Button>
                <Button type="primary" class="btn-warning" @click="handleTagAdd">保存</Button>
            </div>
            <Form ref="labelForm" :model="labelForm">
                <FormItem>
                    <Button @click="handleTagAddTabble">添加标签</Button>
                </FormItem>
            </Form>
            <Table border :columns="labelTitle" :data="labelData"></Table>
            <div class="hxy-mt-20 tr">
                <Page :total="label.total" :page-size="label.pageSize" :current="label.pageNum" placement="top" show-total show-sizer show-elevator @on-change="changeLabelPage" @on-page-size-change="changeLabelPageSize"></Page>
            </div>
      </Modal>
      <!-- 批量转移 -->
      <Modal :title="transferTit" :width="720" :mask-closable="false" :scrollable="true" v-model="transferMod">
        <div slot="footer">
            <Button @click="transferMod = false">取消</Button>
            <Button type="primary" class="btn-warning" @click="handleTransfer">保存</Button>
        </div>
        <Form :label-width="70" ref="transferPar" :model="transferPar">
            <Row>
                <Col span="24" class="hxy-mt-25">
                    <FormItem label="转移原因" prop="">
                        <Input v-model="transferPar.reason"></Input>
                    </FormItem>
                </Col>
                <Col span="24">
                    <RadioGroup v-model="transferPar.belongUserId">
                        <Radio label="-1">转移至直属上级</Radio>
                        <Radio label="0">转移到成员
                            <Select
                                v-show="transferPar.belongUserId === '0'"
                                v-model="transferPar.companyName"
                                filterable
                                >
                                <Option v-for="(item, index) in listTransPersonOpt" :key="index" :value="item.userId">{{item.nickName}}</Option>
                            </Select>
                        </Radio>
                    </RadioGroup>
                </Col>
            </Row>
            <div v-show="transferPar.belongUserId === '0'" class="hxy-mt-20" style="border: 1px solid #eee;padding:16px 16px 0;border-radius: 4px;">
                <approve ref="approve_ref" :name="4"></approve>
            </div>
        </Form>
    </Modal>
    <tranFer :dataShow="TranList"  :TranListNo="TranListNo" @refresh= "refresh" v-show="tranFlag" @closeTran="closeTran"></tranFer>

    <!-- 新增联系人 -->
    <Modal :title="addContactsTit" :width="720" :mask-closable="false" :scrollable="true" v-model="addContactsModal">
        <div slot="footer">
            <Button @click="addContactsModal = false">取消</Button>
            <Button type="primary" class="btn-warning" @click="handleContactAdd('contactsBasicInfo')">保存</Button>
        </div>
        <Tabs :animated="false">
            <TabPane label="基本信息">
                <div class="">
                    <Form ref="contactsBasicInfo" :model="contactsBasicInfoForm" :rules="contactsBasicRules" :label-width="65">
                        <Row>
                            <Col span="12">
                                <FormItem label="姓名" prop="contactName">   
                                    <Input v-model="contactsBasicInfoForm.contactName" placeholder="" clearable :disabled="addContactsAbled"></Input>
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem label="性别" prop="contactSex">
                                    <Select v-model="contactsBasicInfoForm.contactSex" placeholder="" clearable :disabled="addContactsAbled">
                                        <Option v-for="(item,index) in sysUserSexOpt" :key="index" :value="item.value">{{item.label}}</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem label="职务" prop="contactPosition">
                                    <Input v-model="contactsBasicInfoForm.contactPosition" placeholder="" clearable :disabled="addContactsAbled"></Input>
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem label="部门" prop="contactPost">
                                    <Input v-model="contactsBasicInfoForm.contactPost"  placeholder="" clearable :disabled="addContactsAbled"></Input>
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem label="电话" prop="contactMobile">
                                    <Input type="number" v-model="contactsBasicInfoForm.contactMobile"  placeholder="" clearable :disabled="addContactsAbled"></Input>
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem label="微信号" prop="contactWechat">
                                    <Input v-model="contactsBasicInfoForm.contactWechat"  placeholder="" clearable :disabled="addContactsAbled"></Input>
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem label="类型" prop="contactType">
                                    <Select v-model="contactsBasicInfoForm.contactType"  placeholder="" clearable :transfer='true' :disabled="addContactsAbled">
                                        <Option v-for="(item,index) in contactTypeOpt" :key="index" :value="item.value">{{item.label}}</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </TabPane>
            <TabPane label="爱好">
                <div class="">
                    <Form ref="listHobbyForm" :rules="listHobbyRuleValidate" :model="listHobbyForm" >
                        <FormItem>
                            <Button type="primary" style="margin-left: 8px" @click="handleHobby" :disabled="addContactsAbled">添加爱好</Button>
                        </FormItem>
                    </Form>
                    <div class="hxy-mb-25">
                        <Table border :columns="listHobbyTitle" :data="listHobbyData"></Table>
                    </div>
                </div>
            </TabPane>
            <TabPane label="特殊日期">
                <Form ref="listSpecialForm" :model="listSpecialForm">
                    <FormItem>
                        <Button type="primary" style="margin-left: 8px" @click="handleSpecial" :disabled="addContactsAbled">添加特殊日期</Button>
                    </FormItem>
                </Form>
                <div class="hxy-mb-25">
                    <Table border :columns="listSpecialTitle" :data="listSpecialData"></Table>
                </div>
            </TabPane>
        </Tabs>
    </Modal>

    <!-- 添加决策人信息 -->
    <Modal :title="addShareholderInfoTit" :width="720" :mask-closable="false" :scrollable="true" v-model="addShareholderInfoModal">
        <div slot="footer">
            <Button @click="addShareholderInfoModal=false">取消</Button>
            <Button type="primary" style="margin-left: 8px" @click="handleAddShareholder('addShareholder')">确认</Button>
        </div>
        <Tabs :animated="false">
            <TabPane label="基本信息">
                <Form ref="addShareholder" :model="shareholdersInfo" :rules="addShareholderRuleValidate" :label-width="110" >
                    <FormItem label="姓名" prop="shareholderName">
                        <Input v-model="shareholdersInfo.shareholderName" placeholder="" clearable :disabled="addShareholderInfoAble"></Input>
                    </FormItem>
                    <FormItem label="是否为决策人" prop="">
                        <Switch v-model="shareholdersInfo.executor"/>
                    </FormItem>
                    <FormItem label="出生年月" prop="birthday">
                        <DatePicker 
                            type="date"
                            style="width: 100%"
                            v-model="shareholdersInfo.birthday" 
                            placeholder="" 
                            :editable="false" 
                            placement="bottom-start"
                            transfer
                            clearable
                            :disabled="addShareholderInfoAble">
                        </DatePicker>
                    </FormItem>
                    <FormItem label="籍贯" prop="nativePlace">
                        <Input v-model="shareholdersInfo.nativePlace" placeholder="" clearable :disabled="addShareholderInfoAble"></Input>
                    </FormItem>
                    <FormItem label="性别" prop="sex">
                        <Select v-model="shareholdersInfo.sex" placeholder="" clearable :disabled="addShareholderInfoAble">
                            <Option v-for="(item,index) in sysUserSexOpt" :key="index" :value="item.value">{{item.label}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="电话" prop="shareholderTel">
                        <Input type="number" v-model="shareholdersInfo.shareholderTel " placeholder="" clearable :disabled="addShareholderInfoAble"></Input>
                    </FormItem>
                    <FormItem label="职务" prop="position">
                        <Input v-model="shareholdersInfo.position" placeholder="" clearable :disabled="addShareholderInfoAble"></Input>
                    </FormItem>
                    <FormItem label="家庭住址" prop="homeAdd">
                        <Input v-model="shareholdersInfo.homeAdd" placeholder="" clearable :disabled="addShareholderInfoAble"></Input>
                    </FormItem>
                    <FormItem label="占股比例" prop="stockRight">
                        <Input type="number" v-model="shareholdersInfo.stockRight" placeholder="" clearable :disabled="addShareholderInfoAble"></Input>
                    </FormItem>
                    <FormItem label="在公司频率" prop="incompanyHz">
                        <Input v-model="shareholdersInfo.incompanyHz" placeholder="" clearable :disabled="addShareholderInfoAble"></Input>
                    </FormItem>
                    <FormItem label="关联公司" prop="associationCompany">
                        <Input v-model="shareholdersInfo.associationCompany" placeholder="" clearable :disabled="addShareholderInfoAble"></Input>
                    </FormItem>
                    <FormItem label="每次对接印象" prop="impress">
                        <Input v-model="shareholdersInfo.impress" placeholder="" clearable :disabled="addShareholderInfoAble"></Input>
                    </FormItem>
                </Form>
            </TabPane>
            <TabPane label="消费分析">
                <Form :model="shareholdersInfo" :label-width="110">
                    <FormItem label="年均消费额">
                        <Input type='number' v-model="shareholdersInfo.yearAvgConsume" placeholder="" clearable :disabled="addShareholderInfoAble"></Input>
                    </FormItem>
                    <FormItem label="月均消费额">
                        <Input type='number' v-model="shareholdersInfo.monthAvgConsume" placeholder="" clearable :disabled="addShareholderInfoAble"></Input>
                    </FormItem>
                    <FormItem label="购买频率">
                        <Input v-model="shareholdersInfo.buyHz" placeholder="" clearable :disabled="addShareholderInfoAble"></Input>
                    </FormItem>
                    <FormItem label="常购买时间">
                        <Input v-model="shareholdersInfo.buyTime" placeholder="" clearable :disabled="addShareholderInfoAble"></Input>
                    </FormItem>
                    <FormItem label="常购买产品">
                        <Input v-model="shareholdersInfo.oftenBuy" placeholder="" clearable :disabled="addShareholderInfoAble"></Input>
                    </FormItem>
                    <FormItem label="常用支付方式">
                        <Input v-model="shareholdersInfo.oftenPayment" placeholder="" clearable :disabled="addShareholderInfoAble"></Input>
                    </FormItem>
                    <FormItem label="产品品质喜好">
                        <Input v-model="shareholdersInfo.likeProQuality" placeholder="" clearable :disabled="addShareholderInfoAble"></Input>
                    </FormItem>
                    <FormItem label="产品功能喜好">
                        <Input v-model="shareholdersInfo.likeProFunction" placeholder="" clearable :disabled="addShareholderInfoAble"></Input>
                    </FormItem>
                    <FormItem label="媒介喜好">
                        <Input v-model="shareholdersInfo.likeMedia" placeholder="" clearable :disabled="addShareholderInfoAble"></Input>
                    </FormItem>
                </Form>
            </TabPane>
            <TabPane label="个人信息">
                <Form :model="shareholdersInfo" :label-width="110">
                    <Row>
                        <Col span="12">
                            <FormItem label="身高">
                                <Input v-model="shareholdersInfo.height" placeholder="" clearable :disabled="addShareholderInfoAble"></Input>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="体重">
                                <Input v-model="shareholdersInfo.xweight" placeholder="" clearable :disabled="addShareholderInfoAble"></Input>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="血型">
                                <Input v-model="shareholdersInfo.bloodType" placeholder="" clearable :disabled="addShareholderInfoAble"></Input>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="健康状况">
                                <Select v-model="shareholdersInfo.healthStatus" placeholder="" clearable :disabled="addShareholderInfoAble">
                                    <Option v-for="(item,index) in healthStatus" :key="index" :value="item.value">{{item.label}}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="病史" prop="">
                                <RadioGroup :disabled="addShareholderInfoAble">
                                    <Radio label="有"></Radio>
                                    <Radio label="无"></Radio>
                                </RadioGroup>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="具体" prop="">
                                <Input  placeholder="Enter your e-mail" clearable :disabled="addShareholderInfoAble"></Input>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="业务爱好">
                                <Input v-model="shareholdersInfo.businessHobby" placeholder="" clearable :disabled="addShareholderInfoAble"></Input>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="兴趣">
                                <Input v-model="shareholdersInfo.interest" placeholder="" clearable :disabled="addShareholderInfoAble"></Input>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="生活习惯">
                                <Input v-model="shareholdersInfo.lifeHabit" placeholder="" clearable :disabled="addShareholderInfoAble"></Input>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="主要性格特点" prop="">
                                <Input  placeholder="Enter your e-mail" clearable :disabled="addShareholderInfoAble"></Input>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="特别说明" prop="">
                                <Input  placeholder="Enter your e-mail" clearable :disabled="addShareholderInfoAble"></Input>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </TabPane>
            <TabPane label="亲属及其社会关系">
                <Table border :columns="listShareholderRelationTitle" :data="listShareholderRelationData"></Table>
            </TabPane>
        </Tabs>
    </Modal>
  </div>
</template>

<script>
import approve from '_c/approve'
import tranFer from '_c/Transfer/Transfer'
import {  mapGetters } from 'vuex'
import { queryCurrStaff, listTransPerson, getMasterDeptCustomer, postAddCustomer, getCustomerList, postCustomer, postEditCustomer, 
associate, tagAdd, transfer, changeStatus, getCustomerByCreditCode, tagList, associateList, customerCharge } from '_s/customer'
export default {
    data() {
        return {
            businessTime: [], // 营业期限
            selectBtn: true,
            payCollTitle: [{
                type: 'selection',
                width: 60,
            },{
                title: '序号',
                width: 80,
                render:(h,params)=>{
                    return h("span" ,{
                    },params.index+1)
                }
            },{
                title: '客户名称',
                width: 180,
                key: "companyName",
            },{
                title: '行业',
                width: 220,
                key: "industry",
            },{
                title: '实际经营地址',
                width: 220,
                key: "actualAddress",
            },{
                title: 'E-mail',
                width: 200,
                key: "email",
            },{
                title: '网址',
                width: 200,
                key: "website",
            },{
                title: '企业联系电话',
                width: 150,
                key: "telephone",
            },{
                title: '跟单人',
                width: 220,
                key: "followUpPersonName",
            },{
                title: '承办人',
                width: 220,
                key: "undertakerName",
            },{
                title: '跟进策略',
                width: 100,
                key: "followUpStrategy",
            },{
                title: '操作',
                width: 180,
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
                                    this.transferFn(params.row)
                                }
                            }
                        }, '转移'),
                        h('Button', {
                            props: {
                                type: 'text',
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                    this.profileTit = '客户档案详情',
                                    this.profileType = 1,
                                    this.profileMod = true
                                    this.id = params.row.id
                                    this.customerDetail()
                                }
                            }
                        }, '详情')
                    ])
                }
            }],
            payCollData: [],
            customerSearch: { // 搜索条件
                type: 2,
                pageNum: 1,
                pageSize: 10
            },
            total: 0,
            queryCurrStaff: [], // 企业下的员工
            listTransPersonOpt: [], // 除自己以外的企业员工
            industry: [], // 所属行业
            masterDeptCustomer: [], // 关联客户
            // 新增客户
            dialogTit: '',
            dialogType: 0,
            dialogMod: false,
            addCustomerPar: {}, // 新增客户字段
            customerInfo: false,
            customerDisabled: false,
            addCustomerRules: {
                companyName: [{ required: true,message: '此项不能为空', trigger: 'change' }],
                creditCode: [{ required: true,message: '此项不能为空', trigger: 'blur' }],
                industry: [{ required: true,message: '此项不能为空', trigger: 'change' }],
                actualAddress: [{ required: true,message: '此项不能为空', trigger: 'change' }],
                linkMan: [{ required: true,message: '此项不能为空', trigger: 'change' }],
                followUpPerson: [{ required: true,message: '此项不能为空', trigger: 'blur', type: 'array'}],
                followUpStrategy: [{ required: true,message: '此项不能为空', trigger: 'change' }],
            },
            // 客户档案
            profileTit: '',
            profileType: 0,
            profileMod: false,
            baseInfo: false,
            contactInfo: false,
            decisionsInfo: false,
            pointInfo: false,
            baseInfoPar: {},
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
                key: "contactSex",
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
                width: 100,
                key: "contactMobile",
                align: 'companyAddress'
            },{
                title: '微信号',
                width: 100,
                key: "contactWechat",
                align: 'creditCode'
            },{
                title: '类型',
                width: 150,
                key: "contactType",
            },{
                title: '爱好',
                width: 180,
                key: "hobby",
            },{
                title: '特殊日期',
                width: 150,
                key: "specialDate",
                align: 'staffSize'
            },{
                title: '操作',
                width: 150,
                key: "val25",
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
                                    this.addContactsModal = true
                                    this.addContactsTit = '联系人详情'
                                    this.addContactsType = -1 // 详情
                                    this.addContactsAbled = true
                                    if (params.row.id) {
                                        contactDetail(params.row.id).then(res => {
                                            if(res.code === 200) {
                                                this.contactsBasicInfoForm = res.data
                                                this.listHobbyData = res.listHobby
                                                this.listSpecialData = res.listSpecialDate
                                            }
                                        })
                                    }
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
                                    this.addContactsModal = true
                                    this.addContactsTit = '编辑联系人信息'
                                    this.addContactsType = 1 // 编辑
                                    this.addContactsAbled = false
                                    if (params.row.id) {
                                        contactDetail(params.row.id).then(res => {
                                            if(res.code === 200) {
                                                this.contactsBasicInfoForm = res.data
                                                this.listHobbyData = res.data.listHobby
                                                this.listSpecialData = res.data.listSpecialDate
                                            }
                                        })
                                    }
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
                                    this.listContact.splice(params.index, 1)
                                }
                            }
                        }, '删除')
                    ])
                }
            }],
            listContact: [], // 新增客户联系人
            addContactsModal: false,
            addContactsTit: '新增联系人',
            addContactsType: 0,
            addContactsAbled: false,
            addShareholderInfoModal: false,
            addShareholderInfoTit: '',
            addShareholderInfoType: '',
            addShareholderInfoAble: false,
            listShareholderTitle: [{
                title: '序号',
                width: 80,
                key: "id",
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
            },{
                title: '操作',
                width: 150,
                key: "createName",
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
                                    this.$refs.addShareholder.resetFields()
                                    this.addShareholderInfoTit = "决策人详情"
                                    this.addShareholderInfoType = -1
                                    this.addShareholderInfoModal = true
                                    this.addShareholderInfoAble = true
                                    this.shareholdersInfo = params.row // 决策人信息
                                    this.listShareholderRelationData = params.row.listShareholderRelation
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
                                    this.$refs.addShareholder.resetFields()
                                    this.addShareholderInfoTit = "编辑决策人信息"
                                    this.addShareholderInfoType = 1
                                    this.addShareholderInfoAble = false
                                    this.addShareholderInfoModal = true
                                    this.shareholdersInfo = params.row // 决策人基本信息
                                    this.listShareholderRelationData = params.row.listShareholderRelation
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
                                    this.listShareholder.splice(params.index, 1)
                                }
                            }
                        }, '删除')
                    ])
                }
            }],
            listShareholder: [],
            contactsBasicInfoForm: {},
            contactsBasicRules: {
                contactName: [{ required: true,message: '此项不能为空', trigger: 'change' }],
                contactSex: [{ required: true,message: '此项不能为空', trigger: 'change' }],
                contactPosition: [{ required: true,message: '此项不能为空', trigger: 'change' }],
                contactPost: [{ required: true,message: '此项不能为空', trigger: 'change' }],
                contactMobile: [{ required: true,message: '此项不能为空', trigger: 'change' }],
                contactType: [{ required: true,message: '此项不能为空', trigger: 'change' }],
            },
            listHobbyForm: {},
            listHobbyRuleValidate: {},
            listSpecialForm: {},
            addCustomerRuleValidate: {
                companyName:[{ required: true,message: '此项不能为空', trigger: 'change' }],
                actualAddress:[{ required: true,  message: '此项不能为空', trigger: 'change' }],
                industry:[{ required: true,  message: '此项不能为空', trigger: 'change' }],
                staffSize:[{ required: true,  message: '此项不能为空', trigger: 'change' }],
                custCategory:[{ required: true, message: '此项不能为空', trigger: 'change' }],
                followUpStage:[{ required: true, message: '此项不能为空', trigger: 'change' }],
                creditCode:[{ required: true,  message: '此项不能为空', trigger: 'change' }] 
            },
            addShareholderRuleValidate: {
                shareholderName: [{ required: true,message: '此项不能为空', trigger: 'change' }],
                birthday: [{ required: true,message: '此项不能为空', trigger: 'change', type: 'date' }],
                nativePlace: [{ required: true,message: '此项不能为空', trigger: 'change' }],
                sex: [{ required: true,message: '此项不能为空', trigger: 'change' }],
                shareholderTel: [{ required: true,message: '此项不能为空', trigger: 'change' }],
                position: [{ required: true,message: '此项不能为空', trigger: 'change' }],
                stockRight: [{ required: true,message: '此项不能为空', trigger: 'change' }],
                associationCompany: [{ required: true,message: '此项不能为空', trigger: 'change' }]
            },
            // addShareholderForm: {},
            // consumeAnalysisForm: {},
            // personalInfoForm: {},
            shareholdersInfo: {},
            listSpecialTitle: [{
                title: '序号',
                width: 80,
                render:(h,params)=>{
                    return h("span" ,{
                    },params.index+1)
                }
            },{
                title: '与其关系',
                width: 150,
                key: "relationship",
                render: (h, params) => {
                    return h('Select', {
                        props: {
                            transfer: true,
                            value: params.row.relationship
                        },
                        on: {
                            'on-change':(val) => {
                                this.listSpecialData[params.index].relationship = val
                            } 
                        },
                    },
                    [
                        this.custRelationOpt.map(function(res){
                            return h('Option',{
                                    props:{
                                        value: res.value,
                                        key: res.value
                                    }
                            },res.label)
                        })
                    ]);
                 },
            },{
                title: '特殊节日',
                width: 150,
                key: "specialDate",
                render: (h,params) => {
                    return h('Input', {
                        props: {
                            value: params.row.specialDate
                        },
                        on: {
                            input: (val) => {
                                this.listSpecialData[params.index].specialDate = val
                            }
                        }
                    })
                }
            },{
                title: '节日时间',
                width: 150,
                key: "festivalDate",
                render: (h,params) => {
                    return h('DatePicker', {
                        props: {
                            transfer: true,
                            clearable: false,
                            placeholder: '请选择日期',
                            value: params.row[params.column.key],
                            type: 'date',
                            format: 'yyyy-MM-dd',
                            size: 'small'
                        },
                        on: {
                            'on-change': (val)=>{
                                this.listSpecialData[params.index].festivalDate = val
                            }
                        }
                    })
                }
            },{
                title: '是否定时提醒',
                width: 150,
                key: "isAlert",
                render: (h,params) => {
                    return h('Select', {
                        props: {
                            transfer: true,
                            value: params.row.isAlert
                        },
                        on: {
                            'on-change':(val) => {
                                this.listSpecialData[params.index].isAlert = val
                            } 
                        },
                    },
                    [
                        this.isAlert.map(function(res){
                            return h('Option',{
                                    props:{
                                        value: res.value,
                                        key: res.value
                                    }
                            },res.label)
                        })
                    ]);
                }
            },{
                title: '操作',
                width: 150,
                key: "hobby",
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
                                    this.listSpecialData.splice(params.index, 1)
                                }
                            }
                        }, '删除')
                    ])
                }
            }],
            listSpecialData: [],
            listSpecialRuleValidate: {},
            listHobbyData: [],
            profilePar: {},
            listHobbyTitle: [{
                title: '序号',
                width: 80,
                render:(h,params)=>{
                    return h("span" ,{
                    },params.index+1)
                }
            },{
                title: '爱好',
                width: 150,
                key: "hobby",
                render: (h,params) => {
                    return h('Input', {
                        props: {
                            value: params.row.hobby
                        },
                        rules: [{ required: true,message: '此项不能为空', trigger: 'change' }],
                        on: {
                            input: (val) => {
                                this.listHobbyData[params.index].hobby = val
                            }
                        }
                    })
                }
            },{
                title: '添加人',
                width: 150,
                key: "createBy",
            },{
                title: '部门',
                width: 150,
                key: "deptId",
            },{
                title: '添加时间',
                width: 150,
                key: "createTime",
            },{
                title: '操作',
                width: 150,
                key: "hobby",
                fixed: 'right',
                render: (h, params) => {
                    return h('div', [
                        h('Button', {
                            props: {
                                type: 'text',
                                size: 'small',
                            },
                            on: {
                                click: () => {
                                    this.listHobbyData.splice(params.index, 1)
                                }
                            }
                        }, '删除')
                    ])
                }
            }],
            listHobbyData: [],
            extraInfo: {}, // 补充信息
            listShareholderRelationTitle: [{
                title: '序号',
                width: 60,
                render:(h,params)=>{
                    return h("span" ,{
                    },params.index+1)
                }
            },{
                title: '关系',
                width: 150,
                key: "relationship"
            },{
                title: '姓名',
                width: 150,
                key: "name",
                render: (h,params) => {
                    return h('Input', {
                        props: {
                            value: params.row.name
                        },
                        on: {
                            input: (val) => {
                                this.listShareholderRelationData[params.index].name = val
                            }
                        }
                    })
                }
            },{
                title: '工作单位',
                width: 200,
                key: "company",
                render: (h,params) => {
                    return h('Input', {
                        props: {
                            value: params.row.company
                        },
                        on: {
                            input: (val) => {
                                this.listShareholderRelationData[params.index].company = val
                            }
                        }
                    })
                }
            },{
                title: '部门及职务',
                width: 150,
                key: "position",
                render: (h,params) => {
                    return h('Input', {
                        props: {
                            value: params.row.position
                        },
                        on: {
                            input: (val) => {
                                this.listShareholderRelationData[params.index].position = val
                            }
                        }
                    })
                }
            }],
            listShareholderRelationData: [{
                relationship: '丈夫/妻子'
            },{
                relationship: '父亲'
            },{
                relationship: '母亲'
            },{
                relationship: '孩子（子女情况）'
            }],
            companyType: [], // 公司类型
            visitCycleOpt: [], // 回访周期选择项
            visitCycleType: null, // 回访周期类型
            // 关联客户
            relatedMod: false,
            relatedTit: '',
            relatedType: '',
            related: {
                total: null,
                pageSize: 10,
                pageNum: 1,
            },
            relatedTitle: [{
                title: '序号',
                width: 70,
                render:(h,params)=>{
                    return h("span" ,{
                    },params.index+1)
                }
            },{
                title: '客户名称',
                width: 200,
                key: "companyName",
                render: (h, params) => {
                    return h('Input', {
                        props: {
                            transfer: true,
                            value: params.row.companyName
                        },
                        on: {
                            input :(val) => {
                                this.relatedList(val, params.row)                                                
                            } 
                        },
                    }
                    // [
                    //     this.masterDeptCustomer.map(function(res){
                    //         return h('Option',{
                    //                 props:{
                    //                     value: res.customerId,
                    //                     key: res.customerId
                    //                 }
                    //         },res.companyName)
                    //     })
                    // ]
                    )
                 }
            },{
                title: '添加人',
                width: 150,
                key: "createBy",
            },{
                title: '部门',
                width: 150,
                key: "deptId",
            },{
                title: '添加时间',
                width: 150,
                key: "createTime",
            },{
                title: '操作',
                width: 150,
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
                                    this.relatedData.splice(params.index, 1)
                                    this.getRelated()
                                }
                            }
                        }, '删除')
                    ])
                }
            }],
            relatedData: [],
            related: {
                total: 0,
                pageNum: 1,
                pageSize: 10
            },
            // 标签
            labelTit: '',
            labelType: 0,
            labelMod: false,
            labelForm: {},
            labelTitle: [{
                title: '序号',
                render:(h,params)=>{
                    return h("span" ,{
                    },params.index+1)
                }
            },{
                title: '标签',
                key: 'tagName',
                render: (h,params) => {
                    return h('Input', {
                        props: {
                            value: params.row.tagName
                        },
                        on: {
                            input: (val) => {
                                this.labelData[params.index].tagName = val
                            }
                        }
                    })
                }
            },{
                title: '添加人',
                key: 'createBy',
            },{
                title: '部门',
                key: 'deptId',
            },{
                title: '添加时间',
                key: 'createTime',
            },{
                title: '操作',
                key: 'label5',
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
                                    this.labelData.splice(params.index, 1)
                                    this.getTag()
                                }
                            }
                        }, '删除')
                    ])
                }
            }],
            labelData: [],
            label: {
                total: 0,
                pageNum: 1,
                pageSize: 10
            },
            // 客户转移
            transferTit: '',
            transferType: 0,
            transferMod: false,
            transferPar: {},
            tranFlag: false,
            transferPar: {},
            // 穿梭框
			TranList: [],	  //穿梭框左侧数据
			TranListNo: [],	  //不属于穿梭框左侧数据的，例如选择框，序号，操作详情
            contactTypeOpt: [],
            sysUserSexOpt: [],
            custRelationOpt: [],
            dayFrequencyOpt: [],
            followSatausOpt: [],
            followupStageOpt: [],
            custStatusOpt: [],
            custCategoryOpt: [],
            staffSizeOpt: [],
            id: '',
            ids: [],
            fileList : [],
            creditCode: '',
            customerChannel: [],
            registerTime: [],
            healthStatus: [],
            isAlert: []
        }
    },
    components: { tranFer, approve },
    computed: {
        ...mapGetters({
			config: 'get_config',
			user: 'get_userinfo'
		})
    },
    mounted() {
        this.industry = this.filterDict(this.config,'industry')
        this.staffSizeOpt = this.filterDict(this.config,'staff_size')
        this.custCategoryOpt = this.filterDict(this.config,'cust_category')
        this.custStatusOpt = this.filterDict(this.config,'cust_sataus')
        this.followupStageOpt = this.filterDict(this.config,'follow_step')
        this.followSatausOpt = this.filterDict(this.config,'follow_sataus')
        this.dayFrequencyOpt = this.filterDict(this.config,'review_cycle')
        this.custRelationOpt = this.filterDict(this.config,'cust_relation')
        this.sysUserSexOpt = this.filterDict(this.config,'sys_user_sex')
        this.contactTypeOpt = this.filterDict(this.config,'contact_type')
        this.companyType = this.filterDict(this.config,'company_type')
        this.customerChannel = this.filterDict(this.config,'customer_channel')
        this.registerTime = this.filterDict(this.config,'register_time') // 成立时间
        this.healthStatus = this.filterDict(this.config,'health_status') // 健康状况
        this.isAlert = this.filterDict(this.config,'is_alert') // 是否定时提醒

        queryCurrStaff().then(res => {
            if (res.code === 200) {
                this.queryCurrStaff = res.data
            }
        })

        // 获取除自己以外的企业员工
        listTransPerson().then(res => {
            if (res.code === 200) {
                this.listTransPersonOpt = res.data
            }
        })

        // 关联客户客户列表
        getMasterDeptCustomer().then(res => {
            if(res.code === 200) {
                this.masterDeptCustomer = res.data
            }
        })

        this.getList()
        this.getTranList()
    },
    methods: {
        handleVisitCycleType(e) {
            if (e === '1') { // 每周
                this.visitCycleType = e
                this.visitCycleOpt = [{
                    label: '星期一'
                },{
                    label: '星期二'
                },{
                    label: '星期三'
                },{
                    label: '星期四'
                },{
                    label: '星期五'
                },{
                    label: '星期六'
                },{
                    label: '星期日'
                }]
            } else if (e === '2') { // 每月
                this.visitCycleType = e
            } else if (e === '3') { // 每季度
                this.visitCycleType = e
                this.visitCycleOpt = [{
                    label: '3月1日'
                },{
                    label: '6月1日'
                },{
                    label: '9月1日'
                },{
                    label: '12月1日'
                }]
            } else if (e === '4') { // 每年
                this.visitCycleType = e
            } else if (e === '5') { // 一次性活动
                this.visitCycleType = e
            }
        },
        // 认领客户
        customerChargeBtn() {
            this.$Modal.confirm({
                title: "是否认领该客户",
                onOk: () => {
                    customerCharge({ id: this.ids }).then(res => {
                        if (res.code === 200) {
                            this.getList()
                        }
                    })
                }
            })
        },
        // 通过社会统一信用代码获取客户信息
        customerByCreditCode() {
            let creditCode = ''
            if (this.addCustomerPar.creditCode) {
                creditCode = this.addCustomerPar.creditCode
                getCustomerByCreditCode(creditCode).then(res => {
                    if (res.code === 200) {
                        // this.customerInfo = true // 禁用新增客户信息
                        if (res.data.creditCode) {
                            this.addCustomerPar = res.data
                        } else {
                            this.addCustomerPar = {}
                            this.addCustomerPar.creditCode = creditCode
                        }
                    }
                })
            } else if (!this.addCustomerPar.creditCode) {
                this.addCustomerPar = {}
            }
        },
        // 客户作废
        // chargeFn(params) {
        //     this.$Modal.confirm({
        //         title: "确定作废此客户",
        //         onOk: () => {
        //             changeStatus({ id: [params.id], customerStatus: 1}).then(res => {
        //                 if(res.code === 200){
        //                     this.getList()
        //                     this.$Message.info(res.msg)
        //                 }
        //             })                 
        //         }
        //     })
        // },
        // 客户转移
        handleTransfer(id) {
            let params = {}
            if (this.transferPar.belongUserId !== '-1') { // 转移到直属上级
                //校验审批
                var roveInfo =  this.$refs.approve_ref.check_role();
            }
            if (this.transferPar.belongUserId === '-1') { // 转移到直属上级
                params = {
                    ids: this.ids,
                    belongUserId: this.transferPar.belongUserId,
                    reason: this.transferPar.reason
                }
            } else {
                params = {
                    ids: this.ids,
                    belongUserId: this.transferPar.companyName,
                    reason: this.transferPar.reason,
                    ccUserIds : roveInfo.ccUserIds,
                    approvalUserIds : roveInfo.approvalUserIds,
                    approvalTempId : roveInfo.approvalTempId,
                    leaveMessage: roveInfo.leaveMessage
                }
            }
            transfer(params).then(res => {
                if (res.code === 200) {
                    this.transferMod = false
                    this.getList()
                }
            })
        },
        // 单条客户转移
        transferFn(params){
            this.ids.push(params.id)
            this.transferMod = true
        },
        // 添加客户的关联客户
        addRelated() {
            let params = {}
            if (this.user) {
                params = {
                    createBy: this.user.nickName,
                    deptId: this.user.deptIds,
                    createTime: this.formatTime(new Date())
                }
            }
            this.relatedData.push(params)
        },
        // 关联客户表格
        relatedList(val, row) {
            row.companyName = val
            this.relatedData.splice(this.relatedData.length-1, 1, row)
        },
        // 新增空白爱好一栏
        handleHobby() {
            let params = {}
            if (this.user) {
                params = {
                    createBy: this.user.nickName,
                    deptId: this.user.deptIds,
                    createTime: this.formatTime(new Date())
                }
            }
            this.listHobbyData.push(params)
        },
        // 添加一栏特殊日期
        handleSpecial() {
            let params = {}
            this.listSpecialData.push(params)
        },
        // 多选框选中
        customerSelect(select) {
            if (select.length !== 0) {
                this.id = select[0].id
                this.ids = select.map(item => {
                    return item.id
                })
                this.profilePar = {
                    customerId: select[0].customerId,
                    id: select[0].id,
                    companyName: select[0].companyName
                }
            }
            this.selectBtn = select.length !== 1
        },
        
        // 联系人表格
        handleContactAdd(name) {
            this.$refs[name].validate(valid => {
                if (valid) {
                    this.contactsBasicInfoForm.listHobby = this.listHobbyData
                    this.contactsBasicInfoForm.listSpecialDate = this.listSpecialData
                    let params = {
                        contactName: this.contactsBasicInfoForm.contactName,
                        contactSex: this.contactsBasicInfoForm.contactSex,
                        contactPosition: this.contactsBasicInfoForm.contactPosition,
                        contactPost: this.contactsBasicInfoForm.contactPost,
                        contactMobile: this.contactsBasicInfoForm.contactMobile,
                        contactWechat: this.contactsBasicInfoForm.contactWechat,
                        contactType: this.contactsBasicInfoForm.contactType
                    }
                    let hobby = this.listHobbyData.map(item => {
                        return item.hobby
                    })
                    params.hobby = hobby.join()
                    let specialDate = this.listSpecialData.map(item => {
                        return item.specialDate
                    })
                    params.specialDate = specialDate.join()
                    this.listContact.push(params)
                    this.addContactsModal = false
                }
            })
        },
        // 添加联系人
        handleContacts() {
            this.$refs.contactsBasicInfo.resetFields()
            this.addContactsModal = true
            this.addContactsTit = '新增客户联系人'
            this.addContactsType = 0 // 新增
            this.addContactsAbled = false
            this.contactsBasicInfoForm = {}
            this.listHobbyData = []
            this.listSpecialData = []
        },
        // 添加决策人按钮
        handleAddShareholderBtn() {
            this.$refs.addShareholder.resetFields()
            this.addShareholderInfoTit = "添加决策人"
            this.addShareholderInfoType = 0
            this.addShareholderInfoAble = false
            this.addShareholderInfoModal = true
            this.shareholdersInfo = {}
        },
        // 保存决策人信息
        handleAddShareholder(name) {
            this.$refs[name].validate(valid => {
                if (valid) {
                    this.shareholdersInfo.birthday = this.formatDate(this.shareholdersInfo.birthday)
                    // this.shareholdersInfo = Object.assign(this.addShareholderForm, this.consumeAnalysisForm, this.personalInfoForm) // 基本信息，消费分析，个人信息
                    this.shareholdersInfo.listShareholderRelation = this.listShareholderRelationData // 亲属及其社会关系
                    if (this.addShareholderInfoType === 0) {
                        this.listShareholder.push(this.shareholdersInfo)
                    } else if (this.addShareholderInfoType === 1){
                        this.listShareholder = this.listShareholder.map(item => item.id === this.shareholdersInfo.id ? this.shareholdersInfo : item)
                   }
                    this.addShareholderInfoModal = false
                }
            })
        },
        // 添加标签到表格
        handleTagAddTabble() {
            let params = {}
            if (this.user) {
                params = {
                    crmCustomerId: this.profilePar.customerId,
                    createBy: this.user.nickName,
                    deptId: this.user.deptIds,
                    createTime: this.formatTime(new Date())
                }
            }
            params.tagName = this.labelForm.tagName
            this.labelData.push(params)
        },
        // 关联客户弹框
        relatedCustomer() {
            this.relatedTit = '关联客户',
            this.relatedType = 0,
            this.relatedMod = true
            this.getRelated()
        },
        // 查询关联客户列表
        getRelated(){
            let params = {
                pageNum: this.related.pageNum, 
                pageSize: this.related.pageSize,
                id: this.id
            }
            associateList( params ).then(res => {
                if (res.code === 200) {
                    this.related.total = res.total
                    this.relatedData = res.rows
                }
            })
        },
        changeRelatedPage(pages) {
            this.related.pageNum = pages
            this.getRelated()
        },
        changeRelatedPageSize(size){
            this.related.pageSize = size
            this.getRelated()
        },
        // 确定关联客户
        relatedCustomerOk() {
            let params = {
                id: this.profilePar.id,
                customerId: this.profilePar.customerId,
                pageNum: this.related.pageNum,
                pageSize: this.related.pageSize
            }
            params.companyIds = this.relatedData.map(item => {
                return item.customerId
            })
            associate(params).then(res => {
                if (res.code === 200) {
                    this.$Message.success(res.msg)
                    this.relatedMod = false
                }
            })
        },
        // 客户标签弹框
        labelModal() {
            this.labelTit = "标签",
            this.labelType = 0,
            this.labelMod = true
            this.getTag()
        },
        // 查询客户标签列表
        getTag() {
            let params = {
                pageNum: this.label.pageNum, 
                pageSize: this.label.pageSize,
                id: this.id
            }
            tagList( params ).then(res => {
                if (res.code === 200) {
                    this.label.total = res.total
                    this.labelData = res.rows
                }
            })
        },
        changeLabelPage(pages) {
            this.label.pageNum = pages
            this.getTag()
        },
        changeLabelPageSize(size){
            this.label.pageSize = size
            this.getTag()
        },
        // 确定给客户添加标签
        handleTagAdd(){
            tagAdd({ listTag: this.labelData }).then(res => {
                if (res.code === 200) {
                    this.labelMod = false
                    this.$Message.success('success!')
                    this.labelData = []
                }
            })
        },
        // 新增客户
        addCustomerOk(name) {
            this.$refs[name].validate(valid => {
                if (valid) {
                    postAddCustomer(this.addCustomerPar).then(res => {
                        if (res.code === 200) {
                            this.$Message.success(res.msg)
                            this.dialogMod = false
                            this.addCustomerPar = {}
                            this.getList()
                        }
                    })
                } else {
                    this.$Message.error('Fail!')
                }
            })
        },
        // 当前页面
		changePage(pages) {
			this.customerSearch.pageNum = pages
			this.getList()
		},
		// 每页显示条数
		changePageSize(size) {
			this.customerSearch.pageSize = size
			this.getList()
		},
        // 转移弹框
        transfer() {
            this.transferTit = "客户转移",
            this.transferType = 0,
            this.transferMod = true
        },
        // 彈出客户档案框
        customerProfile() {
            this.profileTit = '客户档案',
            this.profileType = 0,
            this.profileMod = true
            this.customerDisabled = false // 编辑状态
            this.customerDetail()
        },
        // 获取客户信息和客户档案信息
        customerDetail(){
            postCustomer(this.id).then(res => {
                if (res.code === 200) {
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
                    if (this.profileType === 1) { // 查看客戶档案详情
                        this.customerDisabled = true // 禁用查看状态
                    }
                }
            })
        },
        // 修改营业期限
        getBusinessTime(e) {
            console.log(e, 'e')
            this.baseInfoPar.businessTime = e.join()
        },
        // 保存客户档案
        profileOk() {
            this.baseInfoPar.id = this.id
            let params = {}
            params = {
                companyName: this.profilePar.companyName,
                customerId: this.profilePar.customerId,
                id: this.profilePar.id,
                baseInfo: this.baseInfoPar, // 基本信息
                listContact: this.listContact, // 联系人信息
                listShareholder: this.listShareholder, // 决策人信息
                extraInfo: this.extraInfo, // 补充信息
            }
            postEditCustomer(params).then(res => {
                if (res.code === 200) {
                    this.$Message.success(res.msg)
                    this.profileMod = false
                    this.getList()
                }
            })
        },
        // 清空搜索
		handleReset(name) {
			this.$refs[name].resetFields()
			this.getList()
		},
        getList() {
            getCustomerList(this.customerSearch).then(res => {
                if (res.code === 200) {
                    this.total = res.total
                    this.payCollData = res.rows
                    // this.payCollData.forEach(item => {
                    //     this.queryCurrStaff.filter(el => {
                    //         if(item.followUpPerson && item.followUpPerson.indexOf(el.userId) !== -1) { // 跟单人
                    //             item.followUpPerson += '，' + el.nickName
                    //         }
                    //         if(item.undertaker && item.undertaker.indexOf(el.userId) !== -1) { // 承办人
                    //             item.undertaker += '，' + el.nickName
                    //         }
                    //     })
                    // })
                }
            })
        },
        handleSearchCustomer() {
            this.getList()
        },
        // 上传附件
        listenFile(data){
			this.fileList = data;
		},

        // 栏目调整
        transKey() {
            this.tranFlag = true
        },
        // 以下是穿梭框逻辑
		openTran(){
			this.tranFlag = true
		},
		closeTran(){
			this.tranFlag = false
		},
		refresh(e){
			//把选择框，序号，操作详情的数据，合并当前要显示的模块
			this.payCollTitle = this.TranListNo.concat(e);
		},
        getTranList(){
			//显示要的数据
			this.TranList = this.payCollTitle.filter((item)=>{
				if(item.key&&item.key!='id'&&item.key!='action'){
					return item
				}
			})
			//不要显示的数据
			this.TranListNo = this.payCollTitle.filter((item)=>{
				if(!item.key||item.key=='id'||item.key=='action'){
					return item
				}
			})
		}
    }
}
</script>

<style>

</style>