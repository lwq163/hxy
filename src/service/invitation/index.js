import fetch from '../../request'

// 新企业邀请列表(所有企业)
const getInvitationList = (data) => fetch.get('/system/user/dept/apply/invitationPage', { params:data })
// 确认加入企业
const getConfirmInvitation = (data) => fetch.get('/system/user/dept/apply/confirmTheInvitation', { params:data })
// 拒绝邀请
const getDeclineInvitation = (data) => fetch.get('/system/user/dept/apply/declineAnInvitation', { params:data })

export {
    getInvitationList,
    getConfirmInvitation,
    getDeclineInvitation 
}