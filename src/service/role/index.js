import fetch from '../../request'

// 添加职能组
const addRoluTeam = (data) => fetch.post('/system/post/add', data)

//职能组列表
const getGroupTree   = (data) => fetch.get('/system/post/groupTree', data)

//添加职能
const addRoluSon  = (data) => fetch.post('/system/post/addPost', data)

//删除职能
const delRoluSon  = (data) => fetch.delete('/system/post/'+data, null)

//编辑职能
const editRolu  = (data) => fetch.post('/system/post/edit', data)

export {
    addRoluTeam,
	getGroupTree,
	addRoluSon,
	editRolu,
	delRoluSon
}