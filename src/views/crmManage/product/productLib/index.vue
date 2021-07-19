<template>
	<div class="productLib">
		<tab-menu></tab-menu>
		<div class="search">
			<Form  :model="searchForm" ref="searchForm_ref" :label-width="85"  label-position="left">
				<Row :gutter="40">
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="产品代码" prop="productCode">
							<Input placeholder="请输入" v-model="searchForm.productCode"  />
						</FormItem>   
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="产品状态" prop="productStatus">
							<Select v-model="searchForm.productStatus" clearable>
								<Option v-for="(val,index) in goodStatusData" :value="val.value" :key="index">{{val.label}}</Option>
							</Select>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="产品类型" prop="seriesId">
							<Cascader :data="goodTypeData"  @on-change='casChange_search'></Cascader>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="区域" prop="areaId" >
							<Select v-model="searchForm.areaId" clearable>
								<Option v-for="(val,index) in cityData" :value="val.areaId" :key="index">{{val.areaName}}</Option>
							</Select>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="供应商名称" prop="providerName">
							<Input placeholder="请输入" v-model="searchForm.providerName"  />
						</FormItem>   
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="产品名称" prop="productName">
							<Input placeholder="请输入" v-model="searchForm.productName"  />
						</FormItem>   
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="产品形态" prop="productShape">
							<Select v-model="searchForm.productShape" clearable>
								<Option v-for="(val,index) in goodXingTai" :value="val.value" :key="index">{{val.label}}</Option>
							</Select>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="产品有效期" prop="productIndate">
							<Select v-model="searchForm.productIndate" clearable>
								<Option  :value="item.value" v-for="(item,index)  in valTimeData" :key="index">{{item.label}}</Option>
							</Select>
						</FormItem>
					</Col>   
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="行业" prop="industryId">
							<Select v-model="searchForm.industryId" clearable>
								<Option v-for="(val,index) in industryData" :value="val.value" :key="index">{{val.label}}</Option>
							</Select>
						</FormItem>
					</Col>
					<Col :md="12" :lg="8" :xl="6" :xxl="6">
						<FormItem label="客户类型" prop="cusTypeScope">
							<Select v-model="searchForm.cusTypeScope" clearable>
								<Option v-for="(val,index) in custTypeData" :value="val.value" :key="index">{{val.label}}</Option>
							</Select>
						</FormItem>
					</Col>
				</Row>	
				<div class="isFlexalitem" style="justify-content: flex-end;">
					<Button type="primary" @click="handleSearch()" icon="ios-search" class="hxy-mr-10">搜索</Button>
					<Button type="default" @click="handleReset()" icon="ios-refresh">清空</Button>
				</div>
			</Form>
		</div>
		<div class="hxy-mb-30">
			<Button type="info" class="hxy-mr-20"    @click="addSignSheet">添加产品</Button>
		</div>
		
		<div class="hxy-mb-25">
			<Table stripe border :columns="taskListTitle" :data="taskListData" :loading="pageInfo.pageLoading" @on-selection-change="selectChange">
				<template slot-scope="{row}" slot="file" >
					<lookFile :row='row.sysFiles'></lookFile>
				</template>
				<template slot-scope=" { row }" slot="areaScopeListStr" >
					<span v-for="(temp,index) in row.areaScopeListStr" :key="index">{{temp}}  <span v-if="row.areaScopeListStr.length>1">;</span> </span>
				</template>
				<template slot-scope=" { row }" slot="industryScopeListStr" >
					<span v-for="(temp,index) in row.industryScopeListStr" :key="index">{{temp}} <span v-if="row.industryScopeListStr.length>1">;</span></span>
				</template>
				<template slot-scope=" { row }" slot="cusTypeScopeListStr" >
					<span v-for="(temp,index) in row.cusTypeScopeListStr" :key="index">{{temp}} <span v-if="row.cusTypeScopeListStr.length>1">;</span></span>
				</template>
			</Table>
		</div>
		<div class="pos-r tr">
			<Page :total="pageInfo.total"  :current="pageInfo.pageNum"  :page-size="pageInfo.pageSize"  @on-change="changePage" @on-page-size-change="changePageSize" show-total show-sizer show-elevator />
		</div>
		

		<!-- 新增-编辑-详情产品弹窗 -->
		<Modal v-model="signSheet"  width="720"  :title="title"   :footer-hide="true" >
			<div class="isMenban" v-if="isMenban"></div>
			<Form  ref="signModel_ref" :model="signModel"  :rules="signRule"  :label-width="130" label-position="left">
				<Row>
					<Col span="12">
						<FormItem label="产品代码" prop="productCode"><Input v-model="signModel.productCode"></Input></FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem label="产品名称" prop="productName"><Input v-model="signModel.productName"></Input></FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem label="产品状态" prop="productStatus">
							<Select v-model="signModel.productStatus">
								<Option v-for="(val,index) in goodStatusData" :value="val.value" :key="index">{{val.label}}</Option>
							</Select>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem label="产品形态" prop="productShape">
							<Select v-model="signModel.productShape">
								<Option v-for="(val,index) in goodXingTai" :value="val.value" :key="index">{{val.label}}</Option>
							</Select>
						</FormItem>
					</Col>
				</Row>
				<!-- 根据产品形态来 -->
				<Row v-if="signModel.productShape>0">
					<Col span="12">
						<FormItem label="选择产品" prop="incloudProductIds">
							<Select multiple="" v-model="signModel.incloudProductIds">
								<Option  :value="item.id" v-for="(item,index)  in productSelData" :key="index">{{item.productName}}</Option>
							</Select>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem label="产品类型" prop="seriesId">
							<Cascader :data="goodTypeData" v-model="goodTypeDataValue"  @on-change='casChange_form'></Cascader>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem label="产品有效期" prop="productIndate">
							<Select v-model="signModel.productIndate" @on-change="selTime">
								<Option  :value="item.value" v-for="(item,index)  in valTimeData" :key="index">{{item.label}}</Option>
							</Select>
						</FormItem>
					</Col>
				</Row>
				<!-- 选择产品定期才显示 -->
				<Row v-if="signModel.productIndate==1">
					<Col span="12">
						<FormItem label="定期时间段" prop="specifyStartTime">
							<DatePicker  v-model="signModel.specifyStartTime"   format="yyyy-MM-dd HH:mm:ss"    :transfer="true"   type="datetime" placeholder="请选择开始时间"></DatePicker>
						</FormItem>
						<FormItem label="" prop="specifyEndTime">
							<DatePicker  v-model="signModel.specifyEndTime"     format="yyyy-MM-dd HH:mm:ss"    :transfer="true"   type="datetime" placeholder="请选择结束时间"></DatePicker>
						</FormItem>   
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem label="供应商" prop="providerIds">
							<Select multiple v-model="signModel.providerIds">
								<Option  :value="item.id" v-for="(item,index)  in providerData" :key="index">{{item.name}}</Option>
							</Select>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem label="作用范围"></FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem label="区域" prop="areaScopeList">
							<Select multiple v-model="signModel.areaScopeList">
								<Option  :value="item.areaId" v-for="(item,index)  in cityData" :key="index">{{item.areaName}}</Option>
							</Select>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem label="行业" prop="industryScopeList">
							<Select multiple v-model="signModel.industryScopeList" @on-change="selHanye">
								<Option v-for="(val,index) in industryData" :value="val.value" :key="index">{{val.label}}</Option>
							</Select>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem label="客户类型" prop="cusTypeScopeList">
							<Select multiple v-model="signModel.cusTypeScopeList">
								<Option v-for="(val,index) in custTypeData" :value="val.value" :key="index">{{val.label}}</Option>
							</Select>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem label="产品价格类型及具体价格" prop="shopBus" :label-width="300"></FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem label="计量单位" prop="measurementUnit"><Input v-model="signModel.measurementUnit" ></Input></FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem label="标准价(元)" prop="standardPrice"><Input v-model="signModel.standardPrice" type="number"></Input></FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem label="零售价(元)" prop="retailPrice"><Input v-model="signModel.retailPrice" type="number"></Input></FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem label="会员价(元)" prop="memberPrice"><Input v-model="signModel.memberPrice" type="number"></Input></FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem label="促销价(元)" prop="promotionPrice"><Input v-model="signModel.promotionPrice" type="number"></Input></FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem label="市场参考价(元)" prop="marketPrice"><Input v-model="signModel.marketPrice" type="number"></Input></FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
						<FormItem label="产品说明" prop="productDesc"><Input style="width: 100%;" type="textarea" v-model="signModel.productDesc"></Input></FormItem>
					</Col>
				</Row>
				<modalUpLoad v-show="!isMenban"  upLoadText="附件" ref="file_ref" @listenFile="listenFile"></modalUpLoad>
				<lookFile :row='signModel.sysFiles' v-if="isMenban"></lookFile>
				<modalBtn v-if="!isMenban"  :sureText="isAddOrEdti?'确认新增':'确认修改'" :isScroll="true" @sureBtn="sureBtn('signModel_ref')" @cancleBtn="signSheet=false"></modalBtn>
				
				<!-- 详情展示以下按钮 -->
				<div  class="isFlexalitem" style="justify-content: flex-end;" v-if="isMenban">
					<Button type="default" class="hxy-mr-20" @click="signSheet=false">取消</Button>
					<Button type="primary" @click="signSheet=false">关闭</Button>
				</div>
			</Form>
		</Modal>
		
		
		
	</div>
</template>
<script>
import { goodAdd,productList,goodData,goodDel,goodEdit,productSeriesList,goodLookDefault,getAllgood,getAreaData,changeCold} from '_s/product'	
import { getSystemDict } from '_s'
import { mapGetters} from 'vuex'
export default {
    data(){
        return{
			searchForm  : {
				productCode   : "",		//产品代码
				productStatus : "",		//产品状态
				seriesId      : "",		//产品类型
				areaId        : "",		//区域id
				providerName  : "",		//供应商名称
				productName   : "",		//产品名称
				productShape  : "",		//产品形态
				productIndate : "",		//产品有效期
				industryId    : "",		//行业id
				cusTypeScope  : "",		//客户类型
			},
			pageInfo   : {
				pageLoading : false,
				total   : 0,
				pageNum : 1,
				pageSize: 10
			},
			//下拉框数据
			goodStatusData : [],	//产品状态数据
			goodXingTai	   : [],	//产品形态
			goodTypeData   : [],	//产品类型
			goodTypeDataValue : [],	//产品类型用于回显数据的 ，其它没用
			industryData   : [],	//行业数据
			cityData	   : [],	//区域类型
			custTypeData   : [],	//客户类型
			valTimeData	   : [],	//产品有效期
			providerData   : [],	//供应商
			productSelData : [],	//选择产品数据
			//以下是初始页面表格参数
			taskListData: [],
			taskListTitle: [
				{
					type: 'selection',
					width: 60,
					resizable: true,
					align: 'center'
				},
				{
					title: '序号',
					type : "index",
					resizable: true,
					align: 'center',
					width:80,
				},
				{
					title: '产品代码',
					key: 'productCode',
					resizable: true,
					align: 'center',
					width: 200
				},
				{
					title: '产品名称',
					key: 'productName',
					resizable: true,
					align: 'center',
					width: 200
				},
				{
					title: '产品状态',
					key: 'productStatus',
					resizable: true,
					align: 'center',
					width: 200,
					render:(h,params)=>{
						let obj = this.goodStatusData[params.row.productStatus]
						return h('span',{},obj?obj.label:'')
					}
				},
				{
					title: '产品形态',
					key: 'productShape',
					resizable: true,
					align: 'center',
					width: 200,
					render:(h,params)=>{
						return h('span',{},this.goodXingTai[params.row.productShape].label)
					}
				},
				{
					title: '产品类型 ',
					key: 'seriesId',
					resizable: true,
					align: 'center',
					width: 200,
					render:(h,params)=>{
						var series = ""
						this.goodTypeData.forEach((item)=>{
							if(item.id==params.row.seriesId){
								series = item.series;
							}
						})
						return h('span',{},series)
					}
				},
				{
					title: '产品有效期',
					key: 'productShape',
					resizable: true,
					align: 'center',
					width: 200,
					render:(h,params)=>{
						return h('span',{},this.valTimeData[params.row.productIndate].label)
					}
				},
				{
					title: '定期时间段',
					key: 'specifyStartTime',
					resizable: true,
					width: 400,
					align: 'center',
					render:(h,params)=>{
						return h('span',{},params.row.specifyStartTime?params.row.specifyStartTime+"至"+params.row.specifyEndTime:"-")
					}
				},
				{
					title: '供应商',
					key: 'providerName',
					resizable: true,
					align: 'center',
					width: 180,
				},
				{
					title: '区域',
					slot : "areaScopeListStr",
					key: 'areaScopeListStr',
					resizable: true,
					align: 'center',
					width: 200,
				},
				{
					title: '行业',
					slot : "industryScopeListStr",
					key  : 'industryScopeListStr',
					resizable: true,
					align: 'center',
					width: 200
				},
				{
					title: '客户类型',
					slot : "cusTypeScopeListStr",
					key: 'cusTypeScopeListStr',
					resizable: true,
					align: 'center',
					width: 200
				},
				{
					title: '计算单位',
					key: 'measurementUnit',
					resizable: true,
					align: 'center',
					width: 200
				},
				{
					title: '标准价',
					key: 'standardPrice',
					resizable: true,
					align: 'center',
					width: 200
				},
				{
					title: '零售价',
					key: 'retailPrice',
					resizable: true,
					align: 'center',
					width: 200
				},
				{
					title: '会员价',
					key: 'memberPrice',
					resizable: true,
					align: 'center',
					width: 200
				},
				{
					title: '促销价',
					key: 'promotionPrice',
					resizable: true,
					align: 'center',
					width: 200
				},
				{
					title: '市场(参考)价',
					key: 'marketPrice',
					resizable: true,
					align: 'center',
					width: 200
				},
				{
					title: '产品说明',
					key: 'productDesc',
					resizable: true,
					align: 'center',
					width: 200
				},
				{
					title: '附件',
					slot: 'file',
					key : 'sysFiles',
					resizable: true,
					align: 'center',
					width: 300
				},
				{
					title:'操作',
					key:'action',
					width: 240,
					align: 'center',
					fixed: 'right',
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								on: {
									click: () => {
										this.delData(params.row.id)
									}
								}
							}, '删除'),
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								on: {
									click: () => {
										this.isMenban = false;
										this.title = "编辑产品";
										this.signEdit(params.row)
									}
								}
							}, '编辑'),
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								style:{
									display : params.row.productStatus>2||params.row.productStatus==1?"none":"inline-block"
								},
								on: {
									click: () => {
										this.sendCold(params.row)
									}
								}
							}, params.row.productStatus==0?'解冻':'冻结'),
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								on: {
									click: () => {
										this.title = "产品详情";
										this.isMenban = true;
										this.signEdit(params.row)
									}
								}
							}, '详情')
						])
					}
				}
			],
			//以下是新增产品参数
			title : "",
			isAddOrEdti : true,
			signSheet : false,
			isMenban  : false,  //详情
			signModel: {
				id				  : "",
				productCode		  : "", //产品代码
				productName 	  : "", //产品名称
				productStatus 	  : "", //产品状态
				productShape 	  : "", //产品形态
				incloudProductIds : [], //组合类型
				seriesId		  : "",	//产品类型
				productIndate 	  : "", //产品有效期
				specifyStartTime  : "", //定期开始时间
				specifyEndTime    : "", //定期结束时间
				providerIds		  : "", //供应商
				areaScopeList 	  : [],	//区域范围，可多选
				industryScopeList : [], //行业范围，可多选
				cusTypeScopeList  : [],	//客户类型范围，可多选
				measurementUnit   : "", //计量单位
				standardPrice     : "",	//标准价
				retailPrice 	  : "",	//零售价
				memberPrice	      : "",	//会员价
				promotionPrice 	  : "",	//促销价
				marketPrice 	  : "",	//市场参考价
				productDesc 	  : "",	//产品说明
				sysFiles 		  : [],	//附件
			},
			signRule: {
				productCode: [
					{ required: true, message: '请输入产品代码', trigger: 'change' }
				],
				productName: [
					{ required: true, message: '请输入产品名称', trigger: 'change' }
				],
				productStatus : [
					{ required: true, message: '请选择产品状态', trigger: 'change'}
				],
				productShape : [
					{ required: true, message: '请选择产品形态', trigger: 'change' }
				],
				incloudProductIds : [
					{ required: true, message: '请选择产品', trigger: 'change',type:"array"}
				],
				seriesId : [
					{ required: true, message: '请选择产品类型', trigger: 'change',type:"number" }
				],
				productIndate : [
					{ required: true, message: '请选择产品有效期', trigger: 'change' }
				],
				providerIds : [
					{ required: true, message: '请选择供应商', trigger: 'change',type:"array" }
				],
				areaScopeList : [
					{ required: true, message: '请选择区域（可多选）', trigger: 'change',type:"array"  }
				],
				industryScopeList : [
					{ required: true, message: '请选择行业（可多选）', trigger: 'change',type:"array"  }
				],
				cusTypeScopeList : [
					{ required: true, message: '请选择客户类型（可多选）', trigger: 'change',type:"array" }
				],
				measurementUnit : [
					{ required: true, message: '请输入计量单位', trigger: 'blur' }
				],
				standardPrice : [
					{ required: true, message: '请输入标准价', trigger: 'blur' }
				],
				specifyStartTime : [
					{ required: true, message: '请选择定期开始时间', trigger: 'change',type:"date" }
				],
				specifyEndTime : [
					{ required: true, message: '请选择定期结束时间', trigger: 'change',type:"date" }
				],
				retailPrice : [
					{ required: true, message: '请输入零售价', trigger: 'blur' }
				],
				memberPrice : [
					{ required: true, message: '请输入会员价', trigger: 'blur' }
				],
				promotionPrice : [
					{ required: true, message: '请输入促销价', trigger: 'blur' }
				],
				marketPrice : [
					{ required: true, message: '请输入市场参考价', trigger: 'blur' }
				],
				productDesc : [
					{ required: true, message: '请输入产品说明', trigger: 'blur' }
				]
			},
        }
    },
	computed: {
		...mapGetters({
			config: 'get_config',
			user: 'get_userinfo',
			company : 'get_company_info'
		})
	},
	mounted() {
		this.goodStatusData  =  this.filterDict(this.config,'crm_product_product_status'); //产品状态
		this.goodXingTai =  this.filterDict(this.config,'crm_product_shape');				//产品形态
		this.industryData=  this.filterDict(this.config,'industry');						//行业数据
		this.custTypeData=  this.filterDict(this.config,'cust_category');					//客户类型
		this.valTimeData =  this.filterDict(this.config,'crm_product_indate');     		//产品有效期
		this.initSel()
	},
    methods: {
		async initSel(){
			this.getGoodType();		//产品类型
			this.getProvderData();  //供应商
			this.AreaDataInit();	//区域
			await this.initTableList();
		},
		
		//供应商
		getProvderData(){
			productList().then(res => {
				this.providerData = res.rows;
			})
		},
		//产品类型
		getGoodType(){
			productSeriesList().then(res=>{
				if(res.code==200){
					if(res.rows!=''){
						this.goodTypeData = this.setGetGoodType(res.rows)
					} 
				}
			})
		},
		//递归设置产品类型数据
		setGetGoodType(data){
			for(var i=0;i<data.length;i++){
				var temp = data[i];
				this.$set(temp,'label',temp.series);
				this.$set(temp,'value',temp.id);
				if(data!=''){
					if(temp.children!=''){
						this.setGetGoodType(temp.children);
					}
				}
			}
			return data
		},
		
		//获取选择产品数据
		getAllgoodData(){
			getAllgood().then(res=>{
				this.productSelData = res.data;
			})
		},
		//获取区域
		AreaDataInit(){
			getAreaData(this.company.masterDeptId).then(res=>{
				this.cityData = res.data;
			})
		},
		//选择行业
		selHanye(e){
			if(e.length>1){
				if(e.indexOf('-1')>-1){	//如果包含该对象s
					this.signModel.industryScopeList = ["-1"];
				}
			}
		},
		//选择定期时间
		selTime(){
			this.signModel.specifyStartTime = "";
			this.signModel.specifyEndTime   = "";
		},
		//选择产品类型-搜索
		casChange_search(e){
			if(e==''){
				this.searchForm.seriesId = '';
				return
			}
			this.searchForm.seriesId = e[e.length-1];
		},
		//选择产品类型-表单
		casChange_form(e){
			if(e==''){
				this.signModel.seriesId = '';
				return
			}
			this.signModel.seriesId = e[e.length-1];
		},
		//搜索
		handleSearch(){
			this.$Message.info('搜索中');
			this.initTableList();
		},
		//清空
		handleReset(){
			this.$refs['searchForm_ref'].resetFields();
			this.clearInitData();
		},
		clearInitData(){
			this.pageInfo.pageNum  = 1;
			this.pageInfo.pageSize = 10;  
			this.initTableList();
		},
		// 底部翻页选择
		changePage(pages) {
			this.pageInfo.pageNum = pages;
			this.initTableList();
		},
		changePageSize(size) {
			this.pageInfo.pageSize = size;
			this.initTableList();
		},
		// 多选框选中数据
		selectChange(selection) {
			this.ids = selection.map(item => item.id)
		},
		sureBtn(name) {
			console.log("this.signModel.seriesId======" +this.signModel.seriesId);
			this.$refs[name].validate((valid) => {
				if (valid){
					this.submitAddData();
				}
			})
		},
		
		//新增-编辑
		submitAddData(){
			console.log("111: " + JSON.stringify(111));
			//如果选择了定期，校验时间
			var startTime = this.$util.formatTime(this.signModel.specifyStartTime);
			var endTime   = this.$util.formatTime(this.signModel.specifyEndTime);
			if(this.signModel.productIndate==1){
				if(startTime>endTime){
					this.$Message.error('定期开始时间不能大于结束时间！')
					return
				}
			}
			
			//设置行业参数,全行业就全空数组
			var hy_arry = [];
			if(this.signModel.industryScopeList.length==0){
				if(this.signModel.industryScopeList[0]=='-1'){
					hy_arry = [];
				}else{
					hy_arry = this.signModel.industryScopeList;
				}
			}else{
				hy_arry = this.signModel.industryScopeList;
			}
			
			
			var param = {
				productCode : this.signModel.productCode, //产品代码
				productName : this.signModel.productName, //产品名称
				productStatus : this.signModel.productStatus, //产品状态
				productShape : this.signModel.productShape, //产品形态
				incloudProductIds : this.signModel.incloudProductIds, //组合类型
				seriesId : this.signModel.seriesId,	 //产品类型
				productIndate : this.signModel.productIndate, //产品有效期
				specifyStartTime : startTime, //定期开始时间
				specifyEndTime :endTime,//定期结束时间
				providerIds : this.signModel.providerIds, //供应商
				areaScopeList : this.signModel.areaScopeList,	//区域范围，可多选
				industryScopeList : hy_arry, //行业范围，可多选
				cusTypeScopeList : this.signModel.cusTypeScopeList,	//客户类型范围，可多选
				measurementUnit : this.signModel.measurementUnit,   //计量单位
				standardPrice : this.signModel.standardPrice,		//标准价
				retailPrice : this.signModel.retailPrice,		//零售价
				memberPrice : this.signModel.memberPrice,		//会员价
				promotionPrice : this.signModel.promotionPrice,	//促销价
				marketPrice : this.signModel.marketPrice,		//市场参考价
				productDesc : this.signModel.productDesc,		//产品说明
				sysFiles : this.signModel.sysFiles,				//附件
			};
			console.log("param: " + JSON.stringify(param));
			this.$util.checkIsAgain(()=>{
				console.log("1: " + JSON.stringify(1));
				if(this.isAddOrEdti){			//新增
					goodAdd(param).then(res=>{
						this.signSheet = false;
						this.$Message.info('新增成功');
						this.clearInitData();
					})
				}else{	
					param.id = this.signModel.id;	//编辑
					goodEdit(param).then(res=>{
						this.signSheet = false;
						this.$Message.info('修改成功');
						this.clearInitData();
					})
				}
			})
		},
		listenFile(data){
			this.signModel.sysFiles = data;
		},
		initTableList(){
			const param = {
				productCode   : this.searchForm.productCode,		//产品代码
				productStatus : this.searchForm.productStatus,		//产品状态
				seriesId      : this.searchForm.seriesId,			//产品类型
				areaId        : this.searchForm.areaId,				//区域id
				providerName  : this.searchForm.providerName,		//供应商名称
				productName   : this.searchForm.productName,		//产品名称
				productShape  : this.searchForm.productShape,		//产品形态
				productIndate : this.searchForm.productIndate,		//产品有效期
				industryId    : this.searchForm.industryId,			//行业id
				cusTypeScope  : this.searchForm.cusTypeScope,		//客户类型
				pageSize	: this.pageInfo.pageSize,
				pageNum     : this.pageInfo.pageNum,
			}
			goodData(param).then(res=>{
				if(res.code==200){
					this.taskListData = res.rows;
					this.pageInfo.total = res.total;
				}
			})
		},
		//删除产品
		delData(id){
			var _this = this;
			this.$Modal.confirm({
				title: "确定删除当前数据吗？",
				cancelText : "取消",
				onOk(){
					goodDel(id).then(res=>{
						if(res.code==200){
							this.$Message.success(res.msg);
							_this.clearInitData();
						}
					})
				}
			});
		},
		//新增产品
		addSignSheet(){
			this.title = "新增产品";
			this.isMenban = false;
			this.isAddOrEdti = true;
			this.signSheet = true;
			this.goodTypeDataValue = [];
			this.getAllgoodData();	//选择产品数据
			this.$refs.file_ref.changeData([]);
			this.$refs['signModel_ref'].resetFields();
		},
		//编辑产品
		signEdit(e){
			this.$refs.signModel_ref.resetFields();
			this.signModel.specifyStartTime = "";
			this.signModel.specifyEndTime = "";
			
			this.isAddOrEdti = false;
			this.signModel.id = e.id;
			this.getAllgoodData();	//选择产品数据
			goodLookDefault(e.id).then(data=>{
				var temp = data.data;
				var arryOne = [];
				var arryTow = [];
				temp.industryScopeList.forEach((item)=>{
					arryOne.push(item+"");
				})
				temp.cusTypeScopeList.forEach((item)=>{
					arryTow.push(item+"");
				})
				this.signModel.productCode		 = temp.productCode; //产品代码
				this.signModel.productName 	  	 = temp.productName; //产品名称
				this.signModel.productStatus 	 = temp.productStatus;//产品状态
				this.signModel.productShape 	 = temp.productShape+""; //产品形态
				this.signModel.incloudProductIds = temp.incloudProductIds; //组合类型
				this.signModel.seriesId		  	 = temp.seriesId;		 //产品类型
				this.signModel.productIndate 	 = temp.productIndate;	 //产品有效期
				this.signModel.specifyStartTime  = temp.specifyStartTime; //定期开始时间
				this.signModel.specifyEndTime    = temp.specifyEndTime; //定期结束时间
				this.signModel.providerIds		 = temp.providerIds;	 //供应商
				this.signModel.areaScopeList 	 = temp.areaScopeList;	//区域范围，可多选
				this.signModel.industryScopeList = arryOne;//行业范围，可多选
				this.signModel.cusTypeScopeList  = arryTow	//客户类型范围，可多选
				this.signModel.measurementUnit   = temp.measurementUnit; //计量单位
				this.signModel.standardPrice     = temp.standardPrice+"";	//标准价
				this.signModel.retailPrice 	 	 = temp.retailPrice+"";	//零售价  s
				this.signModel.memberPrice	     = temp.memberPrice+"";	//会员价
				this.signModel.promotionPrice 	 = temp.promotionPrice+"";	//促销价
				this.signModel.marketPrice 	 	 = temp.marketPrice+"";	//市场参考价
				this.signModel.productDesc 	  	 = temp.productDesc;	//产品说明
				this.signModel.sysFiles 	     = temp.sysFiles;		//附件
				if(!this.isMenban){
					this.$refs['file_ref'].changeData(temp.sysFiles?temp.sysFiles:[]);
				}
				this.signSheet = true;
				
				//回显产状态,并蒋里面的字符串转为number
				var a = this.setData_init(this.goodTypeData,temp.seriesId);
				var b = a.split(',');
				this.goodTypeDataValue = b.map(function(el){return parseInt(el);});
			})
		},
		setData_init(data,id){
			var result = "";
			for(var i=0;i<this.goodTypeData.length;i++){
				var tempOne = this.goodTypeData[i];
				if(tempOne.id==id){
					result = id;
					return result
					break;
				}else{

					if(tempOne.children!=''){
						for(var j=0;j<tempOne.children.length;j++){
							var tempTow = tempOne.children[j];
							if(tempTow.id==id){
								return result=tempOne.id+","+tempTow.id;
								break;
							}
							
							else{
									
								if(tempTow.children!=''){
									for(var k=0;k<tempTow.children.length;k++){
										var tempThr = tempTow.children[k];
										if(tempThr.id==id){
											return result=tempOne.id+","+tempTow.id+","+tempThr.id
											break;
										}
										
										else{
											
											
											if(tempThr.children!=''){
												for(var g=0;g<tempThr.children.length;g++){
													var tempFour = tempThr.children[g];
													if(tempFour.id==id){
														return result=tempOne.id+","+tempTow.id+","+tempThr.id+","+tempFour.id
														break;
													}
													
													else{
														
														if(tempFour.children!=''){
															for(var g=0;g<tempFour.children.length;g++){
																var tempFive = tempFour.children[g];
																if(tempFive.id==id){
																	return result=tempOne.id+","+tempTow.id+","+tempThr.id+","+tempFour.id+","+tempFive
																	break;
																}
															}
														}
														
														
													}
													
												}
											}
											
											
											
											
										}
											
									}
								}
								
							}
							
						}
					}

				}
			}
			
			// var result = "";
			// for(var i=0;i<data.length;i++){
			// 	var temp = data[i];
			// 	result+=data.id;
			// 	if(data!=''){
			// 		if(temp.children!=''){
			// 			if(temp.id==id){
			// 				return result 
			// 			}else{
			// 				this.setData_init(temp.children,id);
			// 			}	
			// 		}
			// 	}
			// }
			// return data
		},
		//冻结-解冻
		sendCold(e){
			const param = {
				id : e.id,
				productStatus : e.productStatus==1?0:1
			}
			changeCold(param).then(res=>{
				this.signSheet = false;
				this.$Message.info('修改成功');
				this.clearInitData();
			})
		}
    }
}
</script>
<style lang="scss" scoped>
	.isMenban{
		position: absolute;
		width: 100%;
		height: calc(100% - 150px);
		box-sizing: border-box;
		top: 50px;
		left: 0;
		z-index: 3;
	}
</style>