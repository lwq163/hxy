import fetch from '../../request'

// 查询合同模板列表
const getContractTempList = (data) => fetch.get('/system/contractTemplate/list', { params: data } )
// 查询产品类型列表
const getProductSeriesList = (data) => fetch.get('/crm/productSeries/list', { params: data } )
// 新增合同模板
const postAddTemp = (data) => fetch.post('/system/contractTemplate/add',data)
// 删除合同模板
const deleteTemp = (data) => fetch.delete('/system/contractTemplate/delete/' + data)


export {
    getContractTempList,
    getProductSeriesList,
    postAddTemp,
    deleteTemp
}