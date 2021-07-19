import fetch from '../../request'
import Qs from 'qs'

// 工单分页-派工模块
const getWorkOrderList = (data) => fetch.get('/crm/workOrderDetail/workOrderDetailPage', { params: data })
// 工单分页-制作模块
const getWorkOrderFilePage = (data) => fetch.get('/crm/workOrderDetail/workOrderFilePage', { params: data })
// 根据产品ID获取产品文件清单列表(派单)
const getProductByProduct = (productId) => fetch.get('/crm/productSeriesFile/list/series/product/' + productId)
// 根据产品ID获取产品文件清单列表(管理文件)
const getProductBySeries = (seriesRelId) => fetch.get('/crm/productSeriesFile/list/series/' + seriesRelId)
// 提交派单
const postOrderDispatch = (data) => fetch.post('/crm/workOrderDetail/dispatch', data )
// 获取企业产品文件清单列表
const productSeriesFileList = (data) => fetch.get('/crm/productSeriesFile/list', { params: data })
// 查询产品系列
const getProductSeries = (data) => fetch.get('/crm/productSeries/list', { params: data })
// 文件清单新增
const postSaveProductFile = (data) => fetch.post('/crm/productSeriesFile/save', data )
// 文件清单修改
const putUpdateProductFile = (data) => fetch.put('/crm/productSeriesFile/update', data)
// 根据产品ID清空文件清单
const deleteProduct = (id) => fetch.delete('/crm/productSeriesFile/remove/' + id)
// 盖章
const postSignedSeal = (id) => fetch.post('/crm/workOrderDetail/signedSeal/' + id)
// 递交
const postSubmit = (id) => fetch.post('/crm/workOrderDetail/submit/' + id)

export {
    getWorkOrderList,
    getWorkOrderFilePage,
    getProductByProduct,
    getProductBySeries,
    postOrderDispatch,
    productSeriesFileList,
    getProductSeries,
    postSaveProductFile,
    putUpdateProductFile,
    deleteProduct,
    postSignedSeal,
    postSubmit
}