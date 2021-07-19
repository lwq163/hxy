import fetch from '../../request'

//新增跟进
const save_follow = (data) => fetch.post('/crm//apply/follow/save',data);

//跟进列表
const list_follow = (data) => fetch.get('/crm/apply/follow/list',{params:data});

//变更时间
const change_follow_time = (data) => fetch.post('/crm/apply/follow/change-time',data);

//转交
const change_follow_user = (data) => fetch.post('/crm/apply/follow/change-user',data);

//作废
const change_follow_abolish = (data) => fetch.post('/crm/apply/follow/abolish',data);

//关闭
const change_follow_close = (data) => fetch.post('/crm/apply/follow/close',data);

//冻结与解冻
const change_follow_freeze = (data) => fetch.post('/crm/apply/follow/freeze',data);




//查询受理单id
const getInp_biil_id  = (data) => fetch.get('/crm/apply/follow/vague-search/code-list/'+data);

//联系人
const listContactAndFollow  = (data) => fetch.get('/crm/customer/listContactAndFollow/'+data);

//查询转移人员 (查询当前登录企业下所有用户)
const getChangePreson  = (data) => fetch.get('/system/user/queryCurrStaff',null);




export {
    save_follow,
	list_follow,
	change_follow_time,
	change_follow_user,
	change_follow_abolish,
	change_follow_close,
	change_follow_freeze,
	getInp_biil_id,
	listContactAndFollow,
	getChangePreson
}