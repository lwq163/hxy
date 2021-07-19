import fetch from '../../request'

// 查询组织架构列表
const getOrgList = (data) => fetch.get('/system/dept/query/orgStructure/' + data)
// 查询企业下的员工列表(分页)
const getEmpList = (data) => fetch.get('/system/employee/query/employeeList',{ params:data })
// 根据企业id查询企业下的部门列表
const getQueryDeptList = (data) => fetch.get('/system/dept/query/DeptList/' + data)
// 查询企业下的员工列表
const getEmployeeList = (data) => fetch.get('/system/employee/query/employeeList/' + data)
// 添加员工
const postAddEmployee = (data) => fetch.post('/system/employee/add', data)
// 编辑保存
const postEditEmployee = (data) => fetch.post('/system/employee/edit', data)
// 根据id查询员工详情
const getQueryEmployee = (data) => fetch.get('/system/employee/query/' + data)
// 调整部门
const postChangeDept = (data) => fetch.post('/system/employee/changeDept', data)
// 查询职能树
const getPostList = (data) => fetch.get('/system/post/groupTree',{ params:data })
// 根据岗位查询人员列表
const getPostStaffList = (data) => fetch.get('/system/post/staffList',{ params:data })
// 岗位批量添加人员
const postStaffAdd = (data) => fetch.post('/system/post/staffAdd', data)

export {
    getOrgList,
    getEmployeeList,
    getQueryDeptList,
    getEmpList, 
    postAddEmployee,
    postEditEmployee,
    getQueryEmployee,
    postChangeDept,
    getPostList,
    getPostStaffList,
    postStaffAdd
}