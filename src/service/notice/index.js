import fetch from '../../request'
import Qs from 'qs'

// 查询全部消息
const getNoticeList = (data) => fetch.get('/system/sysNoticeMessage/list',{params:data})
// 批量已读消息
const postOnRead = (data) => fetch.post('/system/sysNoticeMessage/onRead',data)

export {
    getNoticeList,
    postOnRead
}