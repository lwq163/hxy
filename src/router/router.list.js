import util from '_m/util'
// 路由懒加载
const _import = require('./_import_' + process.env.VUE_APP_NODE)
// 主页面
const Main = _import('main')
// 404页面不存在
const Page404 = {path: '*',meta: {title: '页面不存在'},component: _import('errorPage/404')}
// 路由
const routePage = [
    {
        path: '/',
        redirect: '/login',
        component: Main,
        children: [
            { 
                path: '/login',
                name: 'login',
                meta: {
                    title: '登录'
                },
                component: _import('login/login')
            },
            { 
                path: '/resetPwd',
                name: 'resetPwd',
                meta: {
                    title: '重置密码'
                },
                component: _import('login/resetPwd')
            },
            { 
                path: '/chooseEnterprise',
                name: 'chooseEnterprise',
                meta: {
                    title: '选择企业'
                },
                component: _import('login/chooseEnterprises')
            }
        ]
    },
    Page404
]
const asynRouter = [
    {
        path: '/index',
        name: 'index',
        redirect: '/index',
        meta: { title: '首页', icon: 'iconPC-6', role: 'homePage', isShow: true },
        component: _import('layout/pageLayout'),
        children: [
            {
                path: '',
                name: 'homePage',
                meta: { title: '首页', icon: '', role: 'homePage', isShow: true },
                component: _import('index/index')
            }
        ]
    },
    {
        path: '/notice',
        name: 'notice',
        redirect: '/notice/all',
        meta: { title: '消息', icon:'iconPC-7', role: 'message', isShow: true},
        component: _import('layout/pageLayout'),
        children: [
            {
                path: 'all',
                name: 'all',
                meta: { title: '全部', icon: '', role:'message', isShow: true },
                component: _import('notice/all/index')
            },
            {
                path: 'workAssist',
                name: 'workAssist',
                meta: { title: '工作助手', icon: '', role:'message', isShow: false },
                component: _import('notice/workAssist/index')
            },
            {
                path: 'systemNotice',
                name: 'systemNotice',
                meta: { title: '系统消息', icon: '', role:'message', isShow: false },
                component: _import('notice/systemNotice/index')
            }
        ]
    },
    {
        path: '/crmManage',
        name: 'crmManage',
        redirect: (to) => {
            if (util.includePermission(['*:*:*'])) return { name: 'customer' }
            if (util.includePermission(['crm:customer'])) return { name: 'customer' }
            if (util.includePermission(['crm:apply'])) return { name: 'accepForm' }
            if (util.includePermission(['crm:follow'])) return { name: 'followUp' }
            if (util.includePermission(['crm:payment'])) return { name: 'quotation' }
            if (util.includePermission(['crm:signContract'])) return { name: 'signContract' }
            if (util.includePermission(['crm:generateWorkOrder'])) return { name: 'splitContract' }
            if (util.includePermission(['crm:generateWork'])) return { name: 'order' }
            if (util.includePermission(['crm:makeOrder'])) return { name: 'production' }
            if (util.includePermission(['crm:service'])) return { name: 'customerService' }
            if (util.includePermission(['crm:product'])) return { name: 'product' }
        },
        meta: { title: 'CRM', icon:'iconPC-8', role: 'crm', isShow: true},
        component: Main,
        children: [
            {
                path: 'task',
                name: 'task',
                redirect: '/crmManage/task/designate',
                meta: { title: '任务', icon: 'iconPC-36', role: 'crm:task', isShow: true },
                component: _import('layout/pageLayout'),
                children: [
                    {
                        path: 'designate',
                        name: 'designate',
                        meta: { title: '指派任务', icon: '', role:'crm:task', isShow: true },
                        component: _import('crmManage/task/designate/index')
                    },
                    {
                        path: 'report',
                        name: 'report',
                        meta: { title: '报备任务', icon: '', role:'crm:task', isShow: true },
                        component: _import('crmManage/task/report/index')
                    },
                    {
                        path: 'personal',
                        name: 'personal',
                        meta: { title: '个人任务', icon: '', role:'crm:task', isShow: true },
                        component: _import('crmManage/task/personal/index')
                    },
                ]
            },
            {
                path: 'customer',
                name: 'customer',
                redirect: (to) => {
                    if (util.includePermission(['*:*:*'])) return { name: 'activity' }
                    if (util.includePermission(['crm:customer:active'])) return { name: 'activity' }
                    if (util.includePermission(['crm:customer:invalid'])) return { name: 'nullify' }
                    if (util.includePermission(['crm:customer:public'])) return { name: 'common' }
                },
                meta: { title: '客户', icon: 'iconPC-27', role:'crm:customer', isShow: true },
                component: _import('layout/pageLayout'),
                children: [
                    {
                        path: 'activity',
                        name: 'activity',
                        meta: { title: '活动', icon: '', role:'crm:customer:active', isShow: true },
                        component: _import('crmManage/customer/activity/index')
                    },
                    {
                        path: 'nullify',
                        name: 'nullify',
                        meta: { title: '作废', icon: '', role:'crm:customer:invalid', isShow: true },
                        component: _import('crmManage/customer/nullify/index')
                    },
                    {
                        path: 'common',
                        name: 'common',
                        meta: { title: '公共', icon: '', role:'crm:customer:public', isShow: true },
                        component: _import('crmManage/customer/common/index')
                    },
                ]
            },
            {
                path: 'accepForm',
                name: '',
                meta: { title: '受理单', icon: 'iconPC-28', role:'crm:apply', isShow: true },
                component: _import('layout/pageLayout'),
                children: [
                    {
                        path: '',
                        name: 'accepForm',
                        meta: { title: '受理单', icon: '', role:'crm:apply', isShow: true },
                        component: _import('crmManage/accepForm/index')
                    }
                ]
            },
            {
                path: 'followUp',
                name: '',
                meta: { title: '跟进', icon: 'iconPC-29', role:'crm:follow', isShow: true },
                component: _import('layout/pageLayout'),
                children: [
                    {
                        path: '',
                        name: 'followUp',
                        meta: { title: '跟进', icon: '', role:'crm:follow', isShow: true },
                        component: _import('crmManage/followUp/index')
                    }
                ]
            },
            {
                path: 'quotation',
                name: '',
                meta: { title: '报价', icon: 'iconPC-30', role:'crm:payment', isShow: true },
                component: _import('layout/pageLayout'),
                children: [
                    {
                        path: '',
                        name: 'quotation',
                        meta: { title: '报价', icon: '', role:'crm:payment', isShow: true },
                        component: _import('crmManage/quotation/index')
                    }
                ]
            },
            {
                path: 'signContract',
                name: 'signContract',
                redirect: (to) => {
                    if (util.includePermission(['*:*:*'])) return { name: 'contract' }
                    if (util.includePermission(['crm:signContract:contract'])) return { name: 'contract' }
                    if (util.includePermission(['crm:signContract:invoice'])) return { name: 'collectionInvoice' }
                },
                meta: { title: '签约', icon: 'iconPC-31', role:'crm:signContract', isShow: true },
                component: _import('layout/pageLayout'),
                children: [
                    {
                        path: 'contract',
                        name: 'contract',
                        meta: { title: '合同', icon: '', role:'crm:signContract:contract', isShow: true },
                        component: _import('crmManage/signContract/contract/index')
                    },
                    {
                        path: 'collectionInvoice',
                        name: 'collectionInvoice',
                        meta: { title: '回款', icon: '', role:'crm:signContract:invoice', isShow: true },
                        component: _import('crmManage/signContract/collectionInvoice/index')
                    },
                ]
            },
            {
                path: 'splitContract',
                name: '',
                meta: { title: '报件', icon: 'iconPC-32', role:'crm:generateWorkOrder', isShow: true },
                component: _import('layout/pageLayout'),
                children: [
                    {
                        path: '',
                        name: 'splitContract',
                        meta: { title: '报件', icon: '', role:'crm:generateWorkOrder', isShow: true },
                        component: _import('crmManage/splitContract/index')
                    }
                ]
            },
            {
                path: 'order',
                name: '',
                meta: { title: '派工', icon: 'iconPC-33', role: 'crm:generateWork', isShow: true },
                component: _import('layout/pageLayout'),
                children: [
                    {
                        path: '',
                        name: 'order',
                        meta: { title: '派工', icon: '', role: 'crm:generateWork', isShow: true },
                        component: _import('crmManage/order/index'),
                    }
                ]
            },
            {
                path: 'production',
                name: '',
                meta: { title: '制作', icon: 'iconPC-34', role: 'crm:makeOrder', isShow: true },
                component: _import('layout/pageLayout'),
                children: [
                    {
                        path: '',
                        name: 'production',
                        meta: { title: '制作', icon: '', role: 'crm:makeOrder', isShow: true },
                        component: _import('crmManage/production/index'),
                    }
                ]
            },
            {
                path: 'customerService',
                name: 'customerService',
                redirect: (to) => {
                    if (util.includePermission(['*:*:*'])) return { name: 'returnVisit' }
                    if (util.includePermission(['crm:service:revisit'])) return { name: 'returnVisit' }
                    if (util.includePermission(['crm:service:complaint'])) return { name: 'complaint' }
                    if (util.includePermission(['crm:service:relationship'])) return { name: 'maintain' }
                },
                meta: { title: '客服', icon: 'iconPC-35', role:'crm:service', isShow: true },
                component: _import('layout/pageLayout'),
                children: [
                    {
                        path: 'returnVisit',
                        name: 'returnVisit',
                        meta: { title: '客户回访', icon: '', role:'crm:service:revisit', isShow: true },
                        component: _import('crmManage/customerService/returnVisit/index')
                    },
                    {
                        path: 'complaint',
                        name: 'complaint',
                        meta: { title: '客诉处理', icon: '', role:'crm:service:complaint', isShow: true },
                        component: _import('crmManage/customerService/complaint/index')
                    },
                    {
                        path: 'maintain',
                        name: 'maintain',
                        meta: { title: '客情维护', icon: '', role:'crm:service:relationship', isShow: true },
                        component: _import('crmManage/customerService/maintain/index')
                    }
                ]
            },
            {
                path: 'product',
                name: 'product',
                redirect: (to) => {
                    if (util.includePermission(['*:*:*'])) return { name: 'productLib' }
                    if (util.includePermission(['crm:product:product'])) return { name: 'productLib' }
                    if (util.includePermission(['crm:product:productSeries'])) return { name: 'productManger' }
                    if (util.includePermission(['crm:product:payment'])) return { name: 'payment' }
                    if (util.includePermission(['crm:product:provider'])) return { name: 'supplierLib' }
                },
                meta: { title: '产品', icon: 'iconPC-36', role:'crm:product', isShow: true },
                component: _import('layout/pageLayout'),
                children: [
                    {
                        path: 'productLib',
                        name: 'productLib',
                        meta: { title: '产品', icon: '', role:'crm:product:product', isShow: true },
                        component: _import('crmManage/product/productLib/index')
                    },
					{
					    path: 'productManger',
					    name: 'productManger',
					    meta: { title: '分类管理', icon: '', role:'crm:product:productSeries', isShow: true },
					    component: _import('crmManage/product/productManger/index')
					},
					{
					    path: 'payment',
					    name: 'payment',
					    meta: { title: '付款方式', icon: '', role:'crm:product:payment', isShow: true },
					    component: _import('crmManage/product/payment/index')
					},
					{
					    path: 'supplierLib',
					    name: 'supplierLib',
					    meta: { title: '供应商库', icon: '', role:'crm:product:provider', isShow: true },
					    component: _import('crmManage/product/supplierLib/index')
					}
                ]
            },
        ]
    },
    {
        path: '/approval',
        name: 'approval',
        redirect: '/approval',
        meta: { title: '审批', icon: 'iconPC-9', role:'approval', isShow: true },
        component: _import('layout/pageLayout'),
        children: [
            {
                path: '',
                name: 'approvalPage',
                meta: { title: '审批', icon: '', role: 'approval', isShow: true },
                component: _import('approval/index')
            }
        ]
    },
    {
        path: '/set',
        name: 'set',
        redirect: (to) => {
            if (util.includePermission(['*:*:*'])) return { name: 'user' }
            if (util.includePermission(['setting:personl'])) return { name: 'user' }
            if (util.includePermission(['setting:companyManage'])) return { name: 'enterprise' }
            if (util.includePermission(['setting:aduitProcess'])) return { name: 'approvalProcess' }
            if (util.includePermission(['setting:contractTemplate'])) return { name: 'contractTemp' }
        },
        meta: { title: '设置', icon: 'iconPC-10', role: 'setting', isShow: true },
        component: Main,
        children: [
            {
                path: 'user',
                name: 'user',
                redirect: (to) => {
                    if (util.includePermission(['*:*:*'])) return { name: 'personBasic' }
                    if (util.includePermission(['setting:personal:basic'])) return { name: 'personBasic' }
                },
                meta: { title: '个人设置', icon: 'iconPC-80', role:'setting:personl', isShow: true },
                component: _import('layout/pageLayout'),
                children: [
                    {
                        path: 'personBasic',
                        name: 'personBasic',
                        meta: { title: '基本设置', icon: '', role:'setting:personal:basic', isShow: true },
                        component: _import('set/user/personBasic/index')
                    }
                ]
            },
            {
                path: 'enterprise',
                name: 'enterprise',
                redirect: (to) => {
                    if (util.includePermission(['*:*:*'])) return { name: 'companyBasic' }
                    if (util.includePermission(['setting:companyManage:basic'])) return { name: 'companyBasic' }
                    if (util.includePermission(['setting:companyManage:structure'])) return { name: 'organization' }
                    if (util.includePermission(['setting:companyManage:area'])) return { name: 'area' }
                    if (util.includePermission(['setting:companyManage:dept'])) return { name: 'department' }
                    if (util.includePermission(['setting:companyManage:post'])) return { name: 'role' }
                },
                meta: { title: '企业管理', icon: 'iconPC-41', role:'setting:companyManage', isShow: true },
                component: _import('layout/pageLayout'),
                children: [
                    {
                        path: 'companyBasic',
                        name: 'companyBasic',
                        meta: { title: '企业设置', icon: '', role:'setting:companyManage:basic', isShow: true },
                        component: _import('set/enterprise/companyBasic/index')
                    },
                    {
                        path: 'organization',
                        name: 'organization',
                        meta: { title: '组织架构', icon: '', role:'setting:companyManage:structure', isShow: true },
                        component: _import('set/enterprise/organization/index')
                    },
                    {
                        path: 'area',
                        name: 'area',
                        meta: { title: '区域管理', icon: '', role:'setting:companyManage:area', isShow: true },
                        component: _import('set/enterprise/area/index')
                    },
                    {
                        path: 'department',
                        name: 'department',
                        meta: { title: '部门管理', icon: '', role:'setting:companyManage:dept', isShow: true },
                        component: _import('set/enterprise/department/index')
                    },
                    {
                        path: 'role',
                        name: 'role',
                        meta: { title: '职能管理', icon: '', role:'setting:companyManage:post', isShow: true },
                        component: _import('set/enterprise/role/index')
                    },
                ]
            },
            {
                path: 'approvalProcess',
                name: '',
                meta: { title: '审批流程', icon: 'iconPC-9', role:'setting:aduitProcess', isShow: true },
                component: _import('layout/pageLayout'),
                children: [
                    {
                        path: '',
                        name: 'approvalProcess',
                        meta: { title: '审批流程', icon: '', role:'setting:aduitProcess', isShow: true },
                        component: _import('set/approvalProcess/index')
                    }
                ]
            },
            {
                path: 'contractTemp',
                name: '',
                meta: { title: '合同模板', icon: 'iconPC-81', role:'setting:contractTemplate', isShow: true },
                component: _import('layout/pageLayout'),
                children: [
                    {
                        path: '',
                        name: 'contractTemp',
                        meta: { title: '合同模板', icon: '', role:'setting:contractTemplate', isShow: true },
                        component: _import('set/contractTemp/index')
                    }
                ]
            },
        ]
    },
    {
        path: '/enterpriseAdmin',
        name: 'enterpriseAdmin',
        redirect: (to) => {
            if (util.includePermission(['*:*:*'])) return { name: 'registeredUsers' }
            if (util.includePermission(['adminSetting:userPre'])) return { name: 'registeredUsers' }
            if (util.includePermission(['adminSetting:user'])) return { name: 'officialUsers' }
            if (util.includePermission(['adminSetting:permission'])) return { name: 'extentPower' }
            if (util.includePermission(['adminSetting:dataRange'])) return { name: 'dataRange' }
        },
        meta: { title: '管理员设置', icon: 'iconPC-11', role:'adminSetting', isShow: true },
        component: _import('layout/pageLayout'),
        children: [
            {
                path: 'registeredUsers',
                name: 'registeredUsers',
                meta: { title: '预注册用户', icon: 'iconPC-82', role:'adminSetting:userPre', isShow: true },
                component: _import('enterpriseAdmin/registeredUsers/index')
            },
            {
                path: 'officialUsers',
                name: 'officialUsers',
                meta: { title: '正式用户', icon: 'iconPC-83', role:'adminSetting:user', isShow: true },
                component: _import('enterpriseAdmin/officialUsers/index')
            },
            {
                path: 'extentPower',
                name: 'extentPower',
                meta: { title: '权限管理', icon: 'iconPC-84', role:'adminSetting:permission', isShow: true },
                component: _import('enterpriseAdmin/extentPower/index')
            },
            {
                path: 'dataRange',
                name: 'dataRange',
                meta: { title: '数据范围', icon: 'iconPC-85', role:'adminSetting:dataRange', isShow: true },
                component: _import('enterpriseAdmin/dataRange/index')
            }
        ]
    },
    {path: '*',meta: {title: '页面不存在',icon:'',role:'*:*:*',isShow: false},redirect: '/'}
]

export {
    routePage,
    asynRouter,
    Page404
}