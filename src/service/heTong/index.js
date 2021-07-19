import fetch from '../../request'

// 合同列表
const htList = (data) => fetch.get('/crm/contract/list',{params:data})
// 合同签约
const htAdd = (data) => fetch.post('/crm/contract/save', data)

//合同作废
const ht_cancelled = (data) => fetch.get('/crm/contract/cancelled/'+data)

//合同归档
const ht_pigeonhole = (data) => fetch.get('/crm/contract/pigeonhole/'+data)

//合同借出
const ht_lend= (data) => fetch.get('/crm/contract/lend/'+data)


//生成签约合同(返回签约所需信息)
const router_htAdd = (data) => fetch.get('/crm/offer/price/contract/sign/'+data);



//根据客户Id获取合同号 (获取当前企业下所有已签约合同号)
const getHetongNum = (data) => fetch.get('/crm/contract/listMasterDeptSignContract',null)

//根据客户Id获取合同号
const getHetongNumTow = (data) => fetch.get('/crm/contract/getDetailByCustomerId/'+data)

//根据合同号获取合同信息
const getHetongInfo = (data) => fetch.get('/crm/contract/getDetailByContractNo/'+data,null)

//合同详情信息
const getDefault = (data) => fetch.get('/crm/contract/info/'+data.category+'/'+data.id)


//合同回款列表
const getHtTicList = (data) => fetch.get('/crm/contract/invoice/listAdd',{params:data})


//根据合同编号获取产品信息
const getProInfo = (data) => fetch.get('/crm/contract/contract-no/'+data)

export {
    htList,
    htAdd,
	ht_cancelled,
	ht_pigeonhole,
	ht_lend,
	getHetongNum,
	getHetongNumTow,
	getHetongInfo,
	getHtTicList,
	getDefault,
	router_htAdd,
	getProInfo
}