import fetch from '../../request'

//新增报价
const addOffer = (data) => fetch.post('/crm/apply/quotation/save',data);

//详情接口
const defaultOffer = (data) => fetch.get('/crm/apply/quotation/detail/'+data);

//删除报价
const deleteOffer= (data) => fetch.delete('/crm/offer/price/delBatch/'+data);

//编辑报价
const editOffer = (data) => fetch.post('/crm/apply/quotation/update',data);

//报价列表
const listOffer = (data) => fetch.get('/crm/apply/quotation/list',{params:data});

//查询客户联系人表
const findCustCant = (data) => fetch.get('/crm/customer/contact/list',{params:data})

//根据客户ID查询未签约报价编号及产品信息
const find_productInfo = (data) => fetch.get('/crm/offer/price/product-biz/'+data);


//获取客户名称
const getCustName = (data) => fetch.get('/crm/customer/belongUserCustomer',null)

//根据受理单编号查询产品及服务
const getProductList = (data) => fetch.get('/crm/apply/quotation/bill/service/'+data,null)

//获取在售产品
const getPrudctOnline = (data) => fetch.get('/crm/product/getOnSell/'+data,null)


//根据客户Id获取联系人列表：
const getContactList  = (data) => fetch.get('/crm/customer/listContact/'+data,null)

//查询当前登录企业下所有用户
const getAllUser  = (data) => fetch.get('/system/user/queryCurrStaff',null)


export {
    addOffer,
	listOffer,
	defaultOffer,
	deleteOffer,
	editOffer,
	findCustCant,
	find_productInfo,
	getCustName,
	getProductList,
	getPrudctOnline,
	getContactList,
	getAllUser
}