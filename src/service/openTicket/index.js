import fetch from '../../request'


//新增开票
const  addTicket = (data) => fetch.post('/crm/contract/invoice/add',data)
 
 
//开票列表
const  getTicList = (data) => fetch.get('/crm/contract/invoice/list',{params:data})
 
//删除开票
const deleteTic = (data) => fetch.delete('/crm/contract/invoice/'+data);
 
//查看详情
const lookMoreTic = (data) => fetch.get('/crm/contract/invoice/detail/'+data)


//获取用户银行信息
const basicCustomer =  (data) => fetch.get('/crm/customer/basicCustomer/'+data)

//核销发票
const cancleTic = (data) => fetch.post('/crm/contract/invoice/cancel',data)

 
export {
	addTicket,
	getTicList,
	deleteTic,
	lookMoreTic,
	cancleTic,
	basicCustomer
}