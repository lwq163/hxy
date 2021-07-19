import fetch from '../../request'

// 查询区域列表
const getAreaList = () => fetch.get('/system/area/query/tree')
// 新增区域
const postAddArea = (data) => fetch.post('/system/area/add', data)
// 编辑区域
const postEditArea = (data) => fetch.post('/system/area/edit', data)
// 删除区域
const deleteArea = (data) => fetch.delete('/system/area/delete/' + data)
// 根据id查询区域列表
const getAreaByIdList = (data) => fetch.get('/system/area/search/' + data)

export {
    getAreaList,
    postAddArea,
    postEditArea,
    deleteArea,
    getAreaByIdList
}