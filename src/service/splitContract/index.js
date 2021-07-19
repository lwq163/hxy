import fetch from '../../request'

// 新增报件
const  add = (data) => fetch.post('/crm/generateWorkOrder/add',data)
// 根据合同编号查询合同产品信息 (只需要传递合同编号即可 )
const  getGenerateWorkOrderInfo = (data) => fetch.post('/crm/generateWorkOrder/getGenerateWorkOrderInfo',data)
// 获取合同编号
const  getContractByLike = () => fetch.get('/crm/generateWorkOrder/getContractByLike')
// 报件分页
const  list = (data) => fetch.get('/crm/generateWorkOrder/list', { params: data })
// 获取编辑详情
const  query = (data) => fetch.post('/crm/generateWorkOrder/query', data )
// 编辑报件
const  edit = (data) => fetch.post('/crm/generateWorkOrder/edit', data )
// 删除报件 传递此报件单的id
const  remove = (data) => fetch.post('/crm/generateWorkOrder/remove', data )
// 根据客户Id获取合同号
const  getDetailByCustomerId = (data) => fetch.get(`/crm/generateWorkOrder/getDetailByCustomerId/${data}`)
// 提交暂存撤回操作 只需要传递 id ，和状态
const  changeStatus = (data) => fetch.post('/crm/generateWorkOrder/changeStatus', data )
// 新增报件模糊搜索合同编号
// const  getContractByLike = (data) => fetch.get(`/crm/generateWorkOrder/getContractByLike/${data}`)

export {
	add,
	getGenerateWorkOrderInfo,
	getContractByLike,
	list,
	query,
	edit,
	remove,
	getDetailByCustomerId,
	changeStatus,
}