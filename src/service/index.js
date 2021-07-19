import fetch from '../request'

// 查询全部字典
const getSystemDict = () => fetch.get('/system/dict/data/queryAll')

// 省市区数据
const getRegionList = () => fetch.get('/system/region/listAll')

// 获取用户所属企业列表
const getMasterDeptList = (data) => fetch.get('/system/dept/getMasterDeptList', { params:data })

// 根据企业ID获取详细信息
const getMasterDeptInfo = (data) => fetch.get('/system/company/getMasterDeptInfo/' + data)

export {
    getSystemDict,
    getRegionList,
    getMasterDeptList,
    getMasterDeptInfo
}