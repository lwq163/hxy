import fetch from '../../request'

// 获取祝福列表
const getList = (data) => fetch.get('/crm/crmCustomerRelationship/list',{params:data})

//送祝福
const wish_Add = (data) => fetch.post('/crm/crmCustomerRelationshipWish/save', data)


//祝福记录列表
const get_his_wish = (data) => fetch.get('/crm/crmCustomerRelationshipWish/list',{params:data})

//根据祝福ID获取礼品详情列表
const get_his_liwu = (data) => fetch.get('/crm/crmCustomerRelationshipWishGift/list/'+data)

//删除祝福
const del_wish = (dataOne,dataTow) => fetch.delete('/crm/crmCustomerRelationshipWish/remove/'+dataOne+'/'+dataTow)



//回访列表
const backList = (data) => fetch.get('/crm/crmReview/list',{params:data});

//新增回访
const backAdd = (data) => fetch.post('/crm/crmReview/add', data);


//增加回访记录-已有基础上继续新增
const backAddMore = (data) => fetch.post('/crm/crmReview/addReturnVisitDetail', data);

//删除回访
const backRemove = (data) => fetch.post('/crm/crmReview/remove/'+data);

//查询回访记录
const look_back_his = (data) => fetch.post('/crm/crmReview/getVisitDetail/'+data);


//根据客户名称获取已签约合同
const backGetWorkNo = (data) => fetch.get('/crm/generateWorkOrder/getDetailByCustomerId/'+data);


//新增客诉记录
const serve_add = (data) => fetch.post('/crm/crmCustomerComplaint/save',data);

//客诉记录列表
const serve_list = (data) => fetch.get('/crm/crmCustomerComplaint/list',{params:data});
// 客诉回访列表
const listRewiew = (data) => fetch.get('/crm/crmCustomerComplaint/listRewiew',{params:data});

//客诉记录查询详情
const serve_look = (data) => fetch.get('/crm/crmCustomerComplaint/details/'+data);

//删除客诉记录
const del_serve = (data) => fetch.delete('/crm/crmCustomerComplaint/remove/'+data);


//新增---客诉处理
const chuli_add = (data) => fetch.post('/crm/crmCustomerComplaintHandling/save',data);

//客诉---处理记录列表
const chuli_list = (data) => fetch.get('/crm/crmCustomerComplaintHandling/list/'+data);

// 报批客诉
const reportForApproval = (data) => fetch.post('/crm/crmCustomerComplaint/reportForApproval', data );


export {
   getList,
   wish_Add,
   get_his_wish,
   get_his_liwu,
   del_wish,
   
   //回访
   backList,
   backRemove,
   backAddMore,
   backAdd,
   backGetWorkNo,
   look_back_his,
   
   //客诉
   serve_add,
   serve_list,
   listRewiew,
   serve_look,
   del_serve,
   chuli_add,
   chuli_list,
   reportForApproval
}