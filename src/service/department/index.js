import fetch from '../../request'

// 查询当前企业部门成员
const getDeptEmpList = (data) => fetch.get('/system/dept/orgStructure/' + data)
// 创建企业
const postCreateDept = (data) => fetch.post('/system/dept/addDept', data)
// 删除部门
const deleteDept = (data) => fetch.delete('/system/dept/' + data)
// 获取部门详细信息
const getDeptDetail = (data) => fetch.get('/system/dept/' + data)
// 部门详细信息编辑后保存
const postEditDept = (data) => fetch.post('/system/dept/edit', data)
// 查询当前用户所选择企业下的所有部门
const getSelectCurrDeptList = () => fetch.get('/system/dept/selectCurrDeptList')
// 查询当前登录企业下所有人员
const getQueryCurrStaff = () => fetch.get('/system/user/queryCurrStaff')

export {
    getDeptEmpList,
    postCreateDept,
    deleteDept,
    getDeptDetail,
    postEditDept,
    getSelectCurrDeptList,
    getQueryCurrStaff
}