const getters = {
    get_permissions: state => state.user.permissions,
    get_roles: state => state.user.roles,
    get_userinfo: state => state.user.userinfo,
    get_avatar: state => state.user.avatar,
    get_nickName: state => state.user.nickName,
    get_asynRouter: state => state.user.asynRouter,
    get_menuList: state => state.router.menuList,
	get_secList : state => state.router.secondList,
	get_menuIndex : state => state.router.menuIndex,
    get_config: state => state.config.config,
    get_deptList: state => state.company.deptList,
    get_company_info: state => state.company.info,
    get_isRead: state => state.notice.isRead,
}
export default getters