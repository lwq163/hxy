<template>
  <div>
      <div>
          <Form ref='accepFormRef' :label-width="100" :model='accepFormSear'>
              <Row>
                  <Col :md="12" :lg="8" :xl="6" :xxl="6">
                    <FormItem label="客户名称" prop="companyName">
                        <Input clearable v-model="accepFormSear.companyName" placeholder="请输入客户名称" />
                    </FormItem>
                  </Col>
                  <Col :md="12" :lg="8" :xl="6" :xxl="6">
                    <FormItem label="受理单编号" prop="applyBillCode">
                        <Input clearable v-model="accepFormSear.applyBillCode" placeholder="请输入受理单编号" />
                    </FormItem>
                  </Col>
                  <Col :md="12" :lg="8" :xl="6" :xxl="6">
                    <FormItem label="创建人" prop="nickName">
                        <Input clearable v-model="accepFormSear.nickName" placeholder="请输入创建人" />
                    </FormItem>
                  </Col>
                  <Col :md="12" :lg="8" :xl="6" :xxl="6">
                    <FormItem label="状态" prop='billStatus'>
                        <Select clearable v-model="accepFormSear.billStatus" placeholder="请选择状态" >
                            <Option v-for="(item,index) in billStatus" :key="index" :value="item.value">
                                {{item.label}}    
                            </Option>
                        </Select>
                    </FormItem>
                  </Col>
                  <Col :md="12" :lg="8" :xl="6" :xxl="6">
                    <FormItem label="来源渠道" prop="dataResource">
                        <Select clearable v-model="accepFormSear.dataResource" placeholder="请选择来源渠道" >
                            <Option v-for="(item,index) in dataResource" :key="index" :value="item.value">
                                {{item.label}}    
                            </Option>
                        </Select>
                    </FormItem>
                  </Col>
                  <Col :md="12" :lg="8" :xl="6" :xxl="6">
                    <Button type="primary" icon="ios-search" class="hxy-ml-30 hxy-mr-10" @click="handleApplyBillList">搜索</Button>
					<Button type="default" @click="handleReset('accepFormRef')" icon="ios-refresh">清空</Button>
                  </Col>
              </Row>
          </Form>
      </div>
      <Button @click="createAccepFormBtn">创建受理单</Button>
      <div class="hxy-mt-10">
          <Table border :columns="accepFormTitle" :data="accepFormData"></Table>
      </div>
      <div class="tr hxy-mt-10">
          <Page :total="total" :page-size="accepFormSear.pageSize" :current="accepFormSear.pageNum" placement="top" show-total show-sizer show-elevator @on-change="changePage" @on-page-size-change="changePageSize"></Page>
      </div>
      <!-- 创建受理单 -->
      <Modal :title="accepFormTit" :width="720" :mask-closable="false" :scrollable="true" v-model="createAccepFormMod">
          <div slot="footer">
            <Button @click="createAccepFormMod = false">取消</Button>
            <Button type="primary" class="btn-warning" @click="handleApplyBillSave('createAccepFormRef')">保存</Button>
          </div>
          <Form ref="createAccepFormRef" :model="createAccepFormPar" :rules="createAccepFormRules" :label-width="120">
                <FormItem label="客户名称" prop="crmCustomerId">
                    <Select
                        v-model="createAccepFormPar.crmCustomerId"
                        filterable
                        clearable
                        @on-change='handleListContact'
                        placeholder="请选择客户名称"
                        :disabled="isEdit"
                        >
                        <Option v-for="(item, index) in masterDeptCustomer" :key="index" :value="item.customerId">{{item.companyName}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="产品服务" prop="">
                    <Button class="hxy-mb-10" :disabled="isEdit" @click="addProductServicesBtn">添加产品服务</Button>
                    <Table border ref="paymentCollectionTable" :columns="productServicesTitle" :data="productServicesData"></Table>
                </FormItem>
                <FormItem label="预算价格（元）" prop="">
                    <Input clearable :disabled="isEdit" type="number" placeholder="请输入预算价格" v-model="createAccepFormPar.budgetAmount"/>
                </FormItem>
                <FormItem label="预计交付时间" prop="">
                    <DatePicker 
                        type="date"
                        :disabled="isEdit"
                        v-model="createAccepFormPar.planPayTime"
                        placeholder="请选择预计交付时间" 
                        :editable="false" 
                        placement="bottom-start"
                        format="yyyy-MM-dd"
                        clearable>
                    </DatePicker>
                </FormItem>
                <FormItem prop="files" v-show="!isEdit">
                    <modalUpLoad upLoadText="添加附件" @listenFile="listenFile" ref="fileOne"></modalUpLoad>
                </FormItem>
          </Form>
      </Modal>
      <!-- 转让受理单 -->
      <Modal title="转让受理单" :width="720" :mask-closable="false" :scrollable="true" v-model="transferAccepFormMod">
            <div slot="footer">
                <Button @click="transferAccepFormMod = false">取消</Button>
                <Button type="primary" class="btn-warning" @click="handleTransfer('transferRef')">保存</Button>
            </div>
            <Form ref="transferRef" :model="transferAccepForm" :label-width="80" :rules="transferRules">
                <FormItem label="转移原因" prop="transferReason">
                    <Input placeholder="请输入" v-model="transferAccepForm.transferReason"></Input>
                </FormItem>
                <FormItem label="" prop="belongUserId">
                    <RadioGroup v-model="transferAccepForm.belongUserId">
                        <Radio :label="transferAccepForm.belongUserId">转移到当前企业成员
                            <Select
                                v-model="transferAccepForm.belongUserId"
                                filterable
                                >
                                <Option v-for="(item, index) in queryCurrStaff" :key="index" :value="item.userId">{{item.nickName}}</Option>
                            </Select>
                        </Radio>
                        <!-- <Radio :label="transferAccepForm.companyName">转移到合作空间
                            <Select
                                v-model="transferAccepForm.companyName"
                                filterable
                                >
                                <Option v-for="(item, index) in queryCurrStaff" :key="index" :value="item.userId">{{item.nickName}}</Option>
                            </Select>
                        </Radio> -->
                    </RadioGroup>
                 </FormItem>
                <div class="hxy-mt-20">
                    <approve ref="approve_ref"></approve>
                </div>
            </Form>
      </Modal>
      <Modal title="作废" :width="720" :mask-closable="false" :scrollable="true" v-model="toVoidReasonMod">
          <div slot="footer">
            <Button @click="toVoidReasonMod = false">取消</Button>
            <Button type="primary" class="btn-warning" @click="handlefer('transferRef')">确认</Button>
          </div>
          <Form :label-width="80" :model="invalidFom">
              <FormItem label="作废原因">
                  <Input v-model="invalidFom.cancelReason" />
              </FormItem>
          </Form>
      </Modal>
  </div>
</template>

<script>
import approve from '_c/approve'
import { getCrmTemp } from "_s/approval"
import {  mapGetters } from 'vuex'
import { queryCurrStaff, getMasterDeptCustomer } from '_s/customer'
import { applyBillSave, applyBillList, listContactAndFollow, applyBillDetails, applyBillAccept, applyBillTransfer, getOnSell, invalid } from '_s/accepForm'
export default {
    data() {
        return {
            id: '', // 受理单id
            accepFormSear: {
                pageNum: 1,
                pageSize: 10
            }, // 条件搜索内容
            masterDeptCustomer: [], // 客户名称
            queryCurrStaff: [], // 企业下的员工
            total: 0,
            accepFormTitle: [{
                title: '序号',
                width: 80,
                render:(h,params)=>{
                    return h("span" ,{
                    },params.index+1)
                }
            },{
                title: '受理单编号',
                width: 240,
                key: "applyBillCode",
            },{
                title: '创建人',
                width: 180,
                key: "nickName",
            },{
                title: '来源渠道',
                width: 120,
                key: "dataResourceDesc",
            },{
                title: '状态',
                width: 120,
                key: "billStatusDesc",
            },{
                title: '客户名称',
                width: 200,
                key: "companyName",
            },{
                title: '预算',
                width: 120,
                key: "budgetAmount",
            },{
                title: '预计交付时间',
                width: 220,
                key: "planPayTime",
            },{
                title: '申请时间',
                width: 220,
                key: "createTime",
            },{
                title: '受理时间',
                width: 220,
                key: "acceptTime",
            },{
                title: '最后跟进时间',
                width: 220,
                key: "lastFollowTime",
            },{
                title: '最后报价时间',
                width: 220,
                key: "lastOfferPriceTime",
            },{
                title: '签约时间',
                width: 220,
                key: "signTime",
            },{
                title: '回款时间',
                width: 220,
                key: "paybackTime",
            },{
                title: '开票时间',
                width: 220,
                key: "billingTime",
            },{
                title: '最后报件时间',
                width: 220,
                key: "lastDeliveryTime",
            },{
                title: '最后派工时间',
                width: 220,
                key: "lastDispatchTime",
            },{
                title: '最后制作时间',
                width: 220,
                key: "lastDealTime",
            },{
                title: '最后质检时间',
                width: 220,
                key: "lastQualityInspectionTime",
            },{
                title: '最后递交时间',
                width: 220,
                key: "lastCommitTime",
            },{
                title: '作废时间',
                width: 220,
                key: "cancelTime",
            },{
                title: '附件',
                key: 'file',
                resizable: true,
                width: 300,
                render:(h, params) => {
                    // let fileList = []
                    // let arr = []
                    // let data = params.row.fileInfoList
                    // if(data.length > 0) {
                    //     data.forEach((value,index) => {
                    //         arr = [
                    //             h('Icon', {
                    //                 props: {
                    //                     type: value.isImage?'md-image':'ios-paper',
                    //                 },
                    //                 style: {
                    //                     marginRight: '5px',
                    //                     fontSize: '16px'
                    //                 },
                    //                 class:'color-primary',
                    //             })
                    //         ]
                    //         arr.push(
                    //             h('Tooltip',{
                    //                 props: {
                    //                     placement: 'top',
                    //                     content: value.displayName
                    //                 },
                    //                 style: {
                    //                     marginRight: '5px',
                    //                 }
                    //             },value.displayName)
                    //         )
                    //         if(value.isImage) {
                    //             // 预览
                    //             arr.push(
                    //                 h('Button', {
                    //                     props: {
                    //                         type: 'primary',
                    //                         size: 'small'
                    //                     },
                    //                     style: {
                    //                         marginRight: '5px',
                    //                     },
                    //                     on: {
                    //                         click: () => {
                    //                             this.preview(value)
                    //                         }
                    //                     }
                    //                 }, '预览')
                    //             )
                    //         }else {
                    //             // 下载
                    //             arr.push(
                    //                 h('Button', {
                    //                     props: {
                    //                         type: 'primary',
                    //                         size: 'small'
                    //                     },
                    //                     style: {
                    //                         marginRight: '5px'
                    //                     },
                    //                     on: {
                    //                         click: () => {
                    //                             this.download(value)
                    //                         }
                    //                     }
                    //                 }, '下载')
                    //             )
                    //         }
                    //         fileList.push(h('div',{
                    //             style: {
                    //                 padding:'5px',
                    //                 display: 'flex',
                    //                 alignItems: 'center'
                    //             }
                    //         },arr))
                    //     })
                        
                    // }
                    // return h('div',fileList)
                }
            },{
                title: '操作',
                width: 220,
                fixed: 'right',
                render: (h, params) => {
                    return h('div', [
                        h('Button', {
                            props: {
                                type: 'text',
                                size: 'small'
                            },
                            style: {
                                display: params.row.billStatus == 0 ? 'inline-block' : 'none'
                            },
                            on: {
                                click: () => {
                                    this.$Modal.confirm({
                                        title: "是否确定受理此单",
                                        onOk: () => {
                                            applyBillAccept(params.row.id).then(res => {
                                                if(res.code === 200){
                                                    this.handleApplyBillList()
                                                }
                                            })
                                        }
                                    })
                                }
                            }
                        }, '受理'),
                        h('Button', {
                            props: {
                                type: 'text',
                                size: 'small'
                            },
                            style: {
                                display: params.row.billStatus == 0 ? 'none' : 'inline-block'
                            },
                            on: {
                                click: () => {
                                    this.id = params.row.id
                                    this.$refs.transferRef.resetFields()
                                    this.handleApplyBillTransfer(params.row)
                                    // this.chargeFn(params.row)
                                    // this.transferAccepForm = true
                                }
                            }
                        }, '转让'),
                        h('Button', {
                            props: {
                                type: 'text',
                                size: 'small',
                            },
                            style: {
                                display: params.row.billStatus == 0 ? 'inline-block' : 'none'
                            },
                            on: {
                                click: () => {
                                    this.invalidFom = {}
                                    this.toVoidReasonMod = true
                                    this.invalidFom.id = params.row.id
                                }
                            }
                        }, '作废'),
                        h('Button', {
                            props: {
                                type: 'text',
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                    this.isEdit = true
                                    this.createAccepFormPar.crmCustomerId = params.row.crmCustomerId // 赋值客户id
                                    this.handleListContact() // 查看详情先获取产品及服务,联系人
                                    this.getApplyBillDetails(params.row.id)
                                }
                            }
                        }, '详情')
                    ])
                }
            }],
            isEdit: false,
            accepFormData: [],
            accepFormTit: '创建受理单',
            accepFormType: 0,
            createAccepFormMod: false, // 受理单弹窗
            createAccepFormRules: {
                crmCustomerId: [{ required: true,message: '此项不能为空' }]
            }, // 创建受理单校验
            transferRules: {
                transferReason: [{ required: true, message: '此项不能为空', trigger: 'change'}],
            },
            isProSerVal: true,
            productServicesTitle: [{
                title: '序号',
                width: 80,
                render:(h,params)=>{
                    return h("span" ,{
                    },params.index+1)
                }
            },{
                title: '产品及服务',
                width: 180,
                key: "serviceId",
                render: (h, params) => {
                    return h('Select', {
                        props: {
                            transfer: true,
                            value: params.row.serviceId,
                            disabled: this.isEdit,
                        },
                        on: {
                            'on-change':(val) => {
                                this.productServicesData[params.index].serviceId = val
                                if (this.productServicesData[params.index].serviceId) {
                                    this.isProSerVal = false
                                }
                            } 
                        },
                    },
                    [
                        this.onSell.map(function(res){
                            return h('Option',{
                                    props:{
                                        value: res.id,
                                        key: res.id
                                    }
                            },res.productName)
                        })
                    ]);
                },
            },{
                title: '联系人',
                width: 220,
                key: "contactId",
                render: (h, params) => {
                    return h('Select', {
                        props: {
                            transfer: true,
                            value: params.row.contactId,
                            disabled: this.isProSerVal,
                        },
                        on: {
                            'on-change':(val) => {
                                this.productServicesData[params.index].contactId = val
                            } 
                        },
                    },
                    [
                        this.listContact.map(function(res){
                            return h('Option',{
                                    props:{
                                        value: res.id,
                                        key: res.id
                                    }
                            },res.contactName)
                        })
                    ]);
                },
            },{
                title: '跟单人',
                width: 220,
                key: "followId",
                render: (h, params) => {
                    return h('Select', {
                        props: {
                            transfer: true,
                            value: params.row.followId,
                            disabled: this.isProSerVal,
                        },
                        on: {
                            'on-change':(val) => {
                                this.productServicesData[params.index].followId = val
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
            }],
            productServicesData: [],
            transferAccepForm: {},
            createAccepFormPar: {
                dataResource: '1',
                applyServices: []
            }, // 创建受理单参数
            fileList: [],
            transferPar: {}, // 转让受理单参数
            transferAccepFormMod: false,
            listContact: [], // 客户联系人
            // listFollowPerson: [], // 客户跟单人
            dataResource: [],
            billStatus: [],
            onSell: [], // 产品及服务
            toVoidReasonMod: false,
            // 作废受理单
            invalidFom: {}
        }
    },
    mounted() {
        this.dataResource = this.filterDict(this.config,'data_resource') // 来源渠道
        this.billStatus = this.filterDict(this.config,'bill_status') // 受理单状态

        this.getCustomer() // 获取客户名称
        this.handleApplyBillList() // 获取受理单列表
        //审批人数据
		this.initApprove();

    },
    components: { approve },
    computed: {
        ...mapGetters({
			config: 'get_config'
		})
    },
    methods: {
        // 合同审批
		async initApprove(){
            queryCurrStaff().then(res => {
                if (res.code === 200) {
                    this.queryCurrStaff = res.data
                    // this.listFollowPerson = res.data
                    this.$refs['approve_ref'].setData_mount(this.queryCurrStaff)
                }
            })
			await getCrmTemp({ formName:  6}).then(res => {
				if (res.code === 200) {
					this.$refs['approve_ref'].setData_init(res);
				}
			})
		},
        // 单条作废受理单
        handlefer() {
            invalid(this.invalidFom).then(res => {
                if (res.code === 200) {
                    this.handleApplyBillList()
                    this.$Message.success(res.msg)
                    this.handleApplyBillList() // 获取受理单列表
                    this.toVoidReasonMod = false
                }
            })
        },
        // 条件搜索受理单分页列表
        handleApplyBillList() {
            applyBillList(this.accepFormSear).then(res => {
                if(res.code === 200) {
                    this.total = res.total
                    this.accepFormData = res.rows
                }
            })
        },
        // 清空搜索
		handleReset(name) {
			this.$refs[name].resetFields();
			this.handleApplyBillList()
		},
        // 受理单详情
        getApplyBillDetails(id) {
            applyBillDetails(id).then(res => {
                if (res.code === 200) {
                    this.createAccepFormPar = res.data
                    this.createAccepFormPar.applyServices = res.data.applyServices
                    this.productServicesData = res.data.applyServices
                    // this.getOnSellFn(this.createAccepFormPar.crmCustomerId)
                    // if (this.onSell) {
                    //     this.onSell.forEach(item => {
                    //         if (item.indexOf(this.productServicesData.serviceId) !== -1) {
                    //             alert()
                    //             // item.serviceIdName = el.contactName
                    //         }
                    //     })
                    // }
                    

                    //     // this.listContact.filter(el => {
                    //     //     console.log(el.id)
                    //     //     if (el.indexOf(this.productServicesData.serviceId) !== -1) {
                    //     //         alert()
                    //     //         item.serviceIdName = el.contactName
                    //     //     }
                    //     // })
                    
                    this.createAccepFormMod = true
                }
            })
        },
        // 转让受理单
        handleApplyBillTransfer() {
            this.transferAccepFormMod = true

        },
        // 创建受理单按钮
        createAccepFormBtn() {
            this.$refs.createAccepFormRef.resetFields()
            this.isEdit = false // 能编辑
            this.createAccepFormPar = {
                dataResource: '1',
            }
            this.productServicesData = []
            this.createAccepFormMod = true
        },
        // 选择客户获取客户联系人列表
        handleListContact() {
            if (this.createAccepFormPar.crmCustomerId) {
                this.getOnSellFn(this.createAccepFormPar.crmCustomerId) // 产品及服务
                listContactAndFollow(this.createAccepFormPar.crmCustomerId).then(res => {
                    if (res.code === 200) {
                        this.listContact = res.data.listContact  // 客户联系人
                        // this.listFollowPerson = res.data.listFollowPerson // 客户跟单人
                    }
                })
            }
        },
        // 添加产品服务
        addProductServicesBtn(){
            if (this.createAccepFormPar.crmCustomerId) {
                let params = {
                    serviceId: null,
                    contactId: null,
                    followId: null
                }
                this.productServicesData.push(params)
            } else {
                this.$Message.info('请先选择客户名称')
            }
        },
        // 新增受理单
        handleApplyBillSave(name) {
            this.$refs[name].validate(valid => {
                if (valid) {
                    this.createAccepFormPar.applyServices = this.productServicesData
                    applyBillSave(this.createAccepFormPar).then(res => {
                        if (res.code === 200) {
                            this.createAccepFormMod = false
                            this.handleApplyBillList()
                        }
                    })
                }
            })
        },
        // 保存转让受理单
        handleTransfer(name) {
            this.$refs[name].validate(valid => {
                if (valid) {
                    //校验审批
                    var roveInfo =  this.$refs.approve_ref.check_role();
                    this.transferAccepForm.leaveMessage = roveInfo.leaveMessage
                    this.transferAccepForm.approvalUserIds = roveInfo.approvalUserIds
                    this.transferAccepForm.ccUserIds  =  roveInfo.ccUserIds   
                    this.transferAccepForm.approvalTempId  =  roveInfo.approvalTempId 
                    this.transferAccepForm.examineUserIds  =  roveInfo.examineUserIds
                    this.transferAccepForm.id  =  this.id
                    applyBillTransfer(this.transferAccepForm).then(res => {
                        if (res.code === 200) {
                            this.handleApplyBillList()
                            this.transferAccepFormMod = false
                        }
                    })
                }
            })
        },
        // 当前页面
		changePage(pages) {
			this.accepFormSear.pageNum = pages
			this.handleApplyBillList()
		},
		// 每页显示条数
		changePageSize(size) {
			this.accepFormSear.pageSize = size
			this.handleApplyBillList()
		},
        // 上传附件
        listenFile(data){
			this.fileList = data;
		},
        // 获取客户名称
        getCustomer() {
            getMasterDeptCustomer().then(res => {
                if(res.code === 200) {
                    this.masterDeptCustomer = res.data
                }
            })
        },
        // 获取产品及服务
        getOnSellFn(crmCustomerId) {
            getOnSell(crmCustomerId).then(res => {
                if (res.code === 200) {
                    this.onSell = res.data
                }
            })
        }
    }
}
</script>

<style>

</style>