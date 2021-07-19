import fetch from '../../request'

/*
 ***
 1.付款方式模块
 ***
*/
//付款方式列表
const paymentList = (data) => fetch.get('/crm/payment/list', {params:data})

// 新增产品付款方式
const addPayMent = (data) => fetch.post('/crm/payment', data)

// 修改产品付款方式
const editPayMent = (data) => fetch.put('/crm/payment', data)

//删除付款方式
const deletePayMent = (data) => fetch.delete('/crm/payment/'+data,null)





/*
 ***
 2.供应商模块
 ***
*/
//新增供应商
const productAddBus = (data) => fetch.post('/crm/provider',data)

//编辑供应商
const productEditBus = (data) => fetch.put('/crm/provider',data)

//供应商列表
const productList = (data) => fetch.get('/crm/provider/list',{params:data})


//删除供应商
const productDelete = (data) => fetch.delete('/crm/provider/'+data,null)

//新增供应商价格类型
const pricing = (data) => fetch.post('/crm/pricing',data)


//查看供应商价格类型
const lookPricing =  (data) => fetch.post('/crm/pricing/queryByProviderId',data)



//新增银行
const addBankAPi = (data) => fetch.post('/crm/bank',data)


/*
 ***
 3.产品
 ***
*/

//新增产品
const goodAdd = (data) => fetch.post('/crm/product',data)

//修改产品
const goodEdit = (data) => fetch.put('/crm/product',data)

//删除产品
const goodDel = (data) => fetch.delete('/crm/product/'+data,null)

//产品列表
const goodData = (data) => fetch.get('/crm/product/list',{params:data})

//查询产品信息
const goodLookDefault = (data) => fetch.get('/crm/product/'+data,null)

//查询主系列，参数传{}，查当前子系列，传id;
const goodFindSeries = (data) => fetch.post('/crm/product/findSeries',data)


//获取所有的单品产品
const getAllgood = (data) => fetch.get('/crm/product/querySingleProduct',null)

//获取区域
const getAreaData = (data) => fetch.get('/system/area/query/deptList/'+data);

const changeCold  = (data) => fetch.post('/crm/product/updateStatus',data); 

/*
 ***
 4.系列管理
 ***
*/ 
//新增系列
const productSeriesAdd = (data) => fetch.post('/crm/productSeries/add',data)

//新增子系列
const productSeriesAddSon = (data) => fetch.post('/crm/productSeries/addSonSeries',data)

//系列列表
const productSeriesList = (data) => fetch.get('/crm/productSeries/list',{params:data})

//修改产品系列
const productSeriesEdit = (data) => fetch.put('/crm/productSeries/edit',data) 


//删除产品系列
const productSeriesDel = (data) => fetch.delete('/crm/productSeries/'+data,null)


//根据父系列查询子系列
const  productSeriesSelectSon = (data) => fetch.get('/crm/productSeries/selectSon',{params:data})

//根据系列产品id查询产品
const producGetList = (data) => fetch.get('/crm/productSeries/getProduct',{params:data})

//添加产品到多个系列
const productToXiLie = (data) => fetch.post('/crm/productSeries/addMulitProductToProductSeries',data)



export {
    addPayMent,
	editPayMent,
	paymentList,
	deletePayMent,
	
	productAddBus,
	productEditBus,
	productList,
	productDelete,
	pricing,
	lookPricing,
	
	
	productSeriesAdd,
	productSeriesList,
	productSeriesAddSon,
	productSeriesEdit,
	productSeriesDel,
	productSeriesSelectSon,
	productToXiLie,
	producGetList,
	changeCold,
	
	goodAdd,
	goodEdit,
	goodDel,
	goodData,
	goodFindSeries,
	goodLookDefault,
	getAllgood,
	getAreaData,
	
	
	addBankAPi
}