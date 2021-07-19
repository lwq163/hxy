import fetch from '../../request'

// 获取部门列表
const getDept = () => fetch.get('/system/dept/treeselect')
// 查询任务
const getTaskList = (data) => fetch.get('/crm/task-order/list',{params:data})
// 新增任务
const postAddTask = (data) => fetch.post('/crm/task-order/add',data)
// 删除任务
const deleteTask = (data) => fetch.delete('/crm/task-order/delBatch/' + data)
// 获取任务详情
const getTaskDetail = (data) => fetch.get('/crm/task-order/detail/' + data)


export {
    getDept,
    getTaskList,
    postAddTask,
    deleteTask,
    getTaskDetail
}