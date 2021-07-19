//缓存当前项目所有菜单数据，主要是为了路由刷新也的时候会用到
function setAllMenuData(data){				
	localStorage.setItem('AllMenuData',JSON.stringify(data));
}
function getAllMenuData(){			
	let  obj = localStorage.getItem('AllMenuData')
	if(obj!='undefined'){
		return JSON.parse(obj)
	}else{
		return ""
	}
}
function removeMAllMenuData(){				
	 localStorage.removeItem('AllMenuData');
}


//缓存菜单左边当前的选项位置
function setMenuTabLeftIndex(index){				
	localStorage.setItem('MenuTabLeftIndex',index);
}
function getMenuTabLeftIndex(){				
	return localStorage.getItem('MenuTabLeftIndex');
}
function removeMenIndex(){				
	 localStorage.removeItem('MenuTabLeftIndex');
}



//缓存二级菜单数据
function setMenuSecList(data){				
	localStorage.setItem('MenuSecList',JSON.stringify(data));
}
function getMenuSecList(){		
	let  obj = localStorage.getItem('MenuSecList')
	if(obj!='undefined'){
		return JSON.parse(obj)
	}else{
		return ""
	}
}
function removeMenList(){		
	 localStorage.removeItem('MenuSecList');
}


module.exports = {
	setAllMenuData      : setAllMenuData,
	getAllMenuData		: getAllMenuData,
	removeMAllMenuData  : removeMAllMenuData,
    setMenuTabLeftIndex : setMenuTabLeftIndex,
	getMenuTabLeftIndex : getMenuTabLeftIndex,
	setMenuSecList      : setMenuSecList,
	getMenuSecList		: getMenuSecList,
	removeMenList		: removeMenList,
	removeMenIndex	    : removeMenIndex
}