import axios from 'axios'
import Qs from 'qs'
import store from '../store'

let util = {}

// cookie操作
util.setCookie = function (c_name,n_value,expiredays) {
    let exdate = new Date()
    exdate.setTime(exdate.getTime() + expiredays * 24 * 60 * 60 * 1000);
    document.cookie = c_name + "=" + escape(n_value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())+";path=/"
}
util.getCookie = function(name) {
    let arr,reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
    if(arr = document.cookie.match(reg))
        return unescape(arr[2])
    else
        return null
}
util.delCookie = function (name) {
    let exp = new Date()
    exp.setTime(exp.getTime() - 24 * 60 * 60 * 1000)
    let cval = this.getCookie(name)
    if(cval != null) {
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString()+";path=/"
    }
	return true
}
// localStorage
util.getStorage = function (key) {
    return localStorage.getItem(key)
}
util.setStorage = function (key,val) {
    localStorage.setItem(key,val)
}
util.removeStorage = function (key) {
    localStorage.removeItem(key)
}
// 检测是否有token
util.isToken = function () {
    return this.getCookie('Admin-Token') === null ? 0 : 1
}

// 分离二级三级菜单
util.filterMenu = function (data,path,level) {
    let res = []
    if(level === undefined || level === 3) {
        // 三级菜单
        data.forEach((value,index) => {
            if(value.name == path[1]) {
                if(value.hasOwnProperty('children')) {
                    value.children.forEach((val,idx) => {
                        if(val.name == path[2]) {
                            res = val.children
                        }
                    })
                }
            }
        })
    }else if(level === 2) {
        // 二级菜单
        data.forEach((value,index) => {
            if(value.name == path[1]) {
                res = value.children
            }
        })
    }
    return res
}

// 转换大写金额
util.number_chinese = function(str) {
    let num = parseFloat(str)
    let strOutput = "",
        strUnit = '仟佰拾亿仟佰拾万仟佰拾元角分'
    num += "00"
    let intPos = num.indexOf('.')
    if (intPos >= 0){
        num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
    }
    strUnit = strUnit.substr(strUnit.length - num.length);
    for (let i=0; i < num.length; i++){
        strOutput += '零壹贰叁肆伍陆柒捌玖'.substr(num.substr(i,1),1) + strUnit.substr(i,1);
    }
    return strOutput.replace(/零角零分$/, '整').replace(/零[仟佰拾]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+元/, '元').replace(/亿零{0,3}万/, '亿').replace(/^元/, "零元")
}

//内存字节转换
util.conver = function (limit){  
	var size = "";  
	if( limit < 0.1 * 1024 ){ //如果小于0.1KB转化成B  
		size = limit.toFixed(2) + "B";    
	}else if(limit < 1 * 1024 * 1024 ){//如果小于1MB转化成KB  
		size = (limit / 1024).toFixed(2) + "KB";              
	}else if(limit < 0.1 * 1024 * 1024 * 1024){ //如果小于0.1GB转化成MB  
		size = (limit / (1024 * 1024)).toFixed(2) + "MB";  
	}else{ //其他转化成GB  
		size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";  
	}  
	var sizestr = size + "";   
	var len = sizestr.indexOf("\.");  
	var dec = sizestr.substr(len + 1, 2);  
	if(dec == "00"){//当小数点后为00时 去掉小数部分  
		return sizestr.substring(0,len) + sizestr.substr(len + 3,2);  
	}  
	return sizestr;  
}

// 分离字典
util.filterDict = function (arr,type) {
    let res = []
    res = arr.filter(item => {
        return item.dictType == type
    })
    return res.length>0?res[0].dictData:[]
}

// axios post请求下载excel
util.axiosPost = function (url,params,fileName) {
    axios({
        method: 'post',
        url: process.env.VUE_APP_BASE_API + url,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + this.getCookie('Admin-Token')
        },
        responseType: 'blob',
        data: Qs.stringify(params)
    }).then(res => {
        this.downloadExcel(res.data,fileName)
    }).catch(err => {
        console.error(err)
    })
}

// 下载excel
util.downloadExcel = function(data,fileName) {
    if (!data) {
        return
    }
    let url = window.URL.createObjectURL(new Blob([data]))
    let link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', fileName+'.xlsx')
    document.body.appendChild(link)
    link.click()
}

//下载pdf
util.axiosPostPdf = function (url,params,fileName) {
    axios({
        method: 'post',
        url: process.env.VUE_APP_BASE_API + url,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + this.getCookie('Admin-Token')
        },
        responseType: 'blob',
        data: Qs.stringify(params)
    }).then(res => {
        this.downloadPdf(res.data,fileName)
    }).catch(err => {
        console.error(err)
    })
}

util.downloadPdf = function(data,fileName) {
    if (!data) {
        return
    }
    let url = window.URL.createObjectURL(new Blob([data]))
    let link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', fileName+'.pdf')
    document.body.appendChild(link)
    link.click()
}

// 日期格式转为日期标准字符串（yyyy-mm-dd HH:mm:ss）
util.formatTime = function (date) {  
    if(date) {
        let y = date.getFullYear()
        let M = date.getMonth() + 1
        M = M < 10 ? '0' + M : M
        let d = date.getDate()
        d = d < 10 ? ('0' + d) : d
        let h = date.getHours()
        h = h < 10 ? ('0' + h) : h
        let m = date.getMinutes()
        m = m < 10 ? ('0' + m) : m
        let s = date.getSeconds()
        s = s < 10 ? ('0' + s) : s
        return y + '-' + M + '-' + d + ' ' + h + ':'+ m + ':' + s
    } 
}

// 日期格式转为日期标准字符串（yyyy-mm-dd）
util.formatDate = function (date) {  
    if(date) {
        let y = date.getFullYear()
        let m = date.getMonth() + 1
        m = m < 10 ? '0' + m : m
        let d = date.getDate()
        d = d < 10 ? ('0' + d) : d
        return y + '-' + m + '-' + d
    } 
}

util.getNowTime = function () {  
    var date = new Date();
    var year = date.getFullYear();
    var month= date.getMonth()+1;
    var day  = date.getDate();
    month = month>9?month:"0"+month;
    day   = day>9?day:"0"+day; 
    var str = year+"-"+month+"-"+day
    return str
}

// 重组省市区
util.regions = function (val) {
	let data = JSON.parse(JSON.stringify(val))
	let newRegions = []
	for(let p in data){
		let province = {value: data[p].provinceId,label: data[p].provinceName}
		if(data[p].hasOwnProperty('regions')){
			let pList = data[p].regions
			province.children = []
			for(let c in pList){
				let city = {value: pList[c].cityId,label: pList[c].cityName}
				if(pList[c].hasOwnProperty('regions')){
					let dList = pList[c].regions
					city.children = []
					for(let d in dList){
						let district = {value: dList[d].regionId,label: dList[d].regionName}
						city.children.push(district)
						city.children.sort((a,b)=>{
							return parseInt(a.value) - parseInt(b.value)
						})
					}
				}
				province.children.push(city)
				province.children.sort((c,d)=>{
					return parseInt(c.value) - parseInt(d.value)
				})
			}
		}
		newRegions.push(province)
		newRegions.sort((e,f)=>{
			return parseInt(e.value) - parseInt(f.value)
		})
	}
	return newRegions
}

// 递归数组添加checkbox禁用,默认展开
util.setArr = function (arr) {
    for (let i = 0; i < arr.length; i++) {
        if(arr.length == 1) {
            arr[i]._disabled = true
            arr[i].isDisabled = false
            arr[i]._showChildren = true
        }
        if(arr.length > 1) {
            if (arr[i].children.length > 0) {
                arr[i]._disabled = true
                arr[i].isDisabled = false
                arr[i]._showChildren = true
                arr[i].children = this.setArr(arr[i].children)
            }
        }
    }
    return arr
}

// 递归查询id对应的对象
util.getIdData = function(list,key,id) {
    if(!list instanceof Array){
        return null
    }
    //遍历数组
    for(let i in list) {
        let item = list[i]
        if(item[key]==id) {
            return item
        }else {
            if(item.children) {
                let value = this.getIdData(item.children,key,id)
                if(value) {
                    return value
                }
            }
        }
    }
}

// 给数组添加层级标识level
util.arrayTreeSetLevel = function(array, levelName = 'level', childrenName = 'children') {
    if (!Array.isArray(array)) return []
    const recursive = (array, level = 0) => {
        level++
        return array.map(v => {
            v[levelName] = level
            const child = v[childrenName]
            if (child && child.length) recursive(child, level)
            return v
        })
    }
    return recursive(array)
}

// 根据权限重定向默认页面(左侧菜单,二级菜单,三级菜单)
util.includePermission = function(permissions = []) {
    if (!permissions.length) return true
    const permissionList = store.getters.get_permissions
    return !!permissions.find(item => permissionList.includes(item))
}

// 验证权限(用于iview ui 表格render中的按钮权限,页面列表权限等)
util.validateRole = function(roleName) {
    let roleList = store.getters.get_permissions
    if(roleList[0] === '*:*:*' || roleList.indexOf(roleName) > -1 ){
        return true
    } else {
        return false
    }
}

// 根据当前时间判断时间段
util.getTimeState = function() {
    // 获取当前时间
    let timeNow = new Date()
    // 获取当前小时
    let hours = timeNow.getHours()
    // 设置默认文字
    let text = ``
    // 判断当前时间段
    if (hours >= 0 && hours <= 10) {
        text = `早上好`
    } else if (hours > 10 && hours <= 14) {
        text = `中午好`
    } else if (hours > 14 && hours <= 18) {
        text = `下午好`
    } else if (hours > 18 && hours <= 24) {
        text = `晚上好`
    }
    // 返回当前时间段对应的状态
    return text
}

// 递归遍历所有id
util.collectId = function (arr, ids = []) {
    arr.forEach(({ menuId, children }) => {
        if(menuId) {
            ids.push(menuId);
        }
        if(children) {
            this.collectId(children, ids)
        }
    });
    return ids
}

//防止重复点击
let isAgain = true;
util.checkIsAgain = function (func) {
	if(isAgain){
		func()
		isAgain = false;
		setTimeout(()=>{
			isAgain = true;
		},3000)
	}
    return isAgain;
}
util.resetIsAgain = function () {
	setTimeout(()=>{
		return isAgain = true;
	},1000);
}

// 数据范围过滤数组
util.filterArr = function (keys,name,selection) {
    let ids = []
    if(keys.indexOf(name)>-1) {
        let arr = selection.filter(item=>item.key == name)
        arr[0].list.forEach(value=>{
            ids.push(value.id)
        })
    }else{
        ids = []
    }
    return ids
}

// 验证重复元素，有重复返回true否则返回false
util.isRepeat = function (arr) {
    let hash = {}
    for(let i in arr) {
        if(hash[arr[i]]) {
            return true
        }
        // 不存在该元素，则赋值为true，可以赋任意值，相应的修改if判断条件即可
        hash[arr[i]] = true
    }
    return false
}

// 常用邮箱后缀提示
util.emailArr = function (value) {
    return !value || value.indexOf('@') >= 0 ? [] : [
        value + '@qq.com',
        value + '@sina.com',
        value + '@163.com'
    ]
}

// 判断数组中的值是否都相等
util.isAllEqual = function (array) {
    if (array.length > 0) {
        return !array.some(value => {
            return value !== array[0]
        })
    } else {
        return true
    }
}
export default util