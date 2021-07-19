<template>
	<div class="productLib">
		<tab-menu></tab-menu>
		<div class="hxy-mb-30">
			<Button type="primary" class="hxy-mr-20" @click="openADD">添加分类</Button>
		</div>
		
		<div class="hxy-mb-25">
			<Table row-key="id"  border :columns="taskListTitle" :data="taskListData"  @on-selection-change="selectChange">
				<template slot-scope="{row}" slot="file_one" >
					<lookFile :row='row.list'></lookFile>
				</template>
			</Table>
		</div>
		

		<div class="pos-r tr">
			<Page :total="pageInfo.total"  :page-size="pageInfo.pageSize"  :current="pageInfo.pageNum" @on-change="changePage" @on-page-size-change="changePageSize"    show-total show-sizer show-elevator />
		</div>
		
		
		<!-- 头部新增系列 -->
		<Modal v-model="addSheet" width = "700" title="添加分类" :footer-hide="true" >
			<Form ref="addXiLie" :model="addXiLieModel"  :rules="ruleXiLieModel"  :label-width="130" label-position="left">
				<Row><Col><FormItem label="分类名称" prop="gname"><Input v-model="addXiLieModel.gname"></Input></FormItem></Col></Row>
				<Row><Col><FormItem label="分类编码" prop="seriesCode"><Input v-model="addXiLieModel.seriesCode" placeholder="请输入"></Input></FormItem></Col></Row>
				<Row><Col><FormItem label="分类说明" prop="seriesNotes"><Input v-model="addXiLieModel.seriesNotes" placeholder="请输入"></Input></FormItem></Col></Row>
				<modalBtn @sureBtn="sureBtn('addXiLie')" @cancleBtn="addSheet=false"></modalBtn>
			</Form>
		</Modal>
		
		
		<!-- 列表- 新增系列 -->
		<Modal v-model="sonSheet" width = "700"  title="添加分类" :footer-hide="true" >
			<Form ref="addXiLieSon" :model="addXiLieModel"  :rules="ruleXiLieModel"  :label-width="130" label-position="left">
				<Row><Col><FormItem label="分类名称" prop="secName"><Input v-model="addXiLieModel.secName"></Input></FormItem></Col></Row>
				<Row><Col><FormItem label="分类编码" prop="seriesCode"><Input v-model="addXiLieModel.seriesCode" placeholder="请输入"></Input></FormItem></Col></Row>
				<Row><Col><FormItem label="分类说明" prop="seriesNotes"><Input v-model="addXiLieModel.seriesNotes" placeholder="请输入"></Input></FormItem></Col></Row>
				<modalBtn @sureBtn="sureBtn('addXiLieSon')" @cancleBtn="sonSheet=false"></modalBtn>
			</Form>
		</Modal>
		
		<!-- 编辑系列产品 -->
		<Modal v-model="editSheet" width = "700" title="编辑分类名称" :footer-hide="true" >
			<Form ref="editXiLie" :model="addXiLieModel"  :rules="ruleXiLieModel"  :label-width="130" label-position="left">
				<Row><Col><FormItem label="分类名称" prop="gname"><Input v-model="addXiLieModel.gname"></Input></FormItem></Col></Row>
				<Row><Col><FormItem label="分类编码" prop="seriesCode"><Input v-model="addXiLieModel.seriesCode" placeholder="请输入"></Input></FormItem></Col></Row>
				<Row><Col><FormItem label="分类说明" prop="seriesNotes"><Input v-model="addXiLieModel.seriesNotes" placeholder="请输入"></Input></FormItem></Col></Row>
				<modalBtn sureText="确认修改" @sureBtn="sureBtn('editXiLie')" @cancleBtn="editSheet=false"></modalBtn>
			</Form>
		</Modal>
		
		<!-- 编辑子系列产品 -->
		<Modal v-model="editSheetSon" width = "700" title="编辑分类名称" :footer-hide="true" >
			<Form ref="editXiLieSon" :model="addXiLieModel"  :rules="ruleXiLieModel"  :label-width="130" label-position="left">
				<Row><Col><FormItem label="分类名称" prop="secName"><Input v-model="addXiLieModel.secName"></Input></FormItem></Col></Row>
				<Row><Col><FormItem label="分类编码" prop="seriesCode"><Input v-model="addXiLieModel.seriesCode" placeholder="请输入"></Input></FormItem></Col></Row>
				<Row><Col><FormItem label="分类说明" prop="seriesNotes"><Input v-model="addXiLieModel.seriesNotes" placeholder="请输入"></Input></FormItem></Col></Row>
				<modalBtn sureText="确认修改" @sureBtn="sureBtn('editXiLieSon')" @cancleBtn="editSheetSon=false"></modalBtn>
			</Form>
		</Modal>
		
	</div>
</template>
<script>
import { productSeriesAdd,productSeriesList,productSeriesAddSon,productSeriesEdit,productSeriesDel,goodData,productToXiLie,productSeriesSelectSon,producGetList} from '_s/product'	
import { getSystemDict } from '_s'
export default {
    data(){
        return{
			pageInfo   : {
				pageLoading   : false,	
				total		  : 0,		//总数
				pageNum 	  : 1, 		//页数
				pageSize      : 10, 	//每页显示数量
			},
			//以下是初始页面表格参数
			taskListData  : [],	
			taskListTitle : [
				{
					title: "序号",
					type: 'index',
					width: 100,
					resizable: true
				},
				{
					title: '分类名称',
					key  : 'series',
					tree : true,
					width: 600,
					resizable: true
				},
				{
					title: '分类编码',
					key  : 'seriesCode',
					resizable: true
				},
				{
					title: '分类说明',
					key  : 'seriesNotes',
					resizable: true
				},
				{
					title: '操作',
					key: 'place',
					resizable: true,
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								on: {
									click: () => {
										this.delData(params.row)
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
										this.edit(params.row)
									}
								}
							}, '编辑'),
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								on: {
									click: () => {
										this.$refs['addXiLieSon'].resetFields();
										this.addXiLieModel.id = params.row.id;
										this.sonSheet = true;
									}
								}
							}, '添加')
						])
					}
				},
			],
			
			//以下是新增系列弹窗参数
			addSheet : false,
			sonSheet : false,
			editSheet: false,
			editSheetSon:false,
			
			addXiLieModel: {
				id   : '',
				pid  : '',
				gname: '',
				seriesCode : "",
				seriesNotes : "",
				fileList : []
			},
			ruleXiLieModel: {
				gname: [
					{ required: true, message: '请输入分类名称', trigger: 'change' }
				],
				seriesCode: [
					{ required: true, message: '请输入分类编码', trigger: 'change' }
				],
				seriesNotes: [
					{ required: true, message: '请输入分类说明', trigger: 'change' },
				]
			},
			//是否增加还是编辑
			isAddOrEdit: true,		//true增加。false,编辑
			isAgain : true,
			//产品类型字典
			goodType : [],
			//选中的数据
			ids : [],
			//删除
			delList : [],
        }
    },
	created() {
		//获取系列类型，并初始化列表数据
		getSystemDict().then(res => {
			this.goodType = this.filterDict(res.data,'crm_product_product_series_type');
			this.initList();
		})
	},
    methods: {
		// 多选框选中数据
		selectChange(selection) {
			this.ids = selection.map(item => item.id);
			this.delList = selection.map(item => item.id);
		},
		// 底部翻页选择
		changePage(pages) {
			this.pageInfo.pageNum = pages;
			this.ids = [];
			this.initList();
		},
		changePageSize(size) {
			this.ids = [];
			this.pageInfo.pageSize = size;
			this.initList();
		},
		sureBtn(name) {
			this.$refs[name].validate((valid) => {
				if (valid) {
					if(this.isAgain){
						this.isAgain = false;
						switch(name){
							case  'addXiLie' : 
							this.addXiLie();
							break;
							case  'addXiLieSon' :
							this.addXiLieSon();
							break;
							case  'editXiLie' :
							this.editXiLie();
							break;
							case  'editXiLieSon' :
							this.editXiLieSon();
							break;
						}
					}
				}
			})
		},
		addXiLie(){
			const param = {
				series   : this.addXiLieModel.gname,			//系列名称
				seriesNotes : this.addXiLieModel.seriesNotes,
				seriesCode : this.addXiLieModel.seriesCode,
			}
			productSeriesAdd(param).then(res=>{
				if(res.code==200){
					this.addSheet = false;
					this.$Message.success('添加成功！');	
					this.clearInitData()
					setTimeout(()=>{
						this.isAgain = true;
					},1000)
				}
			}).catch(error=>{
				setTimeout(()=>{
					this.isAgain = true;
				},1000)
			})
		},
		addXiLieSon(){
			const  param = {
				series   : this.addXiLieModel.secName,		//子系列名称
				seriesNotes : this.addXiLieModel.seriesNotes,
				seriesCode : this.addXiLieModel.seriesCode,
				pid      : this.addXiLieModel.id,			//pid
			}
			productSeriesAddSon(param).then(res=>{
				if(res.code==200){
					this.sonSheet = false;
					this.$Message.success('添加成功');
					this.clearInitData()
					setTimeout(()=>{
						this.isAgain = true;
					},1000)
				}
			}).catch(error=>{
				setTimeout(()=>{
					this.isAgain = true;
				},1000)
			})
		},
		editXiLie(){
			const param = {
				id       : this.addXiLieModel.id,
				series   : this.addXiLieModel.gname,//系列名称
				seriesNotes : this.addXiLieModel.seriesNotes,
				seriesCode : this.addXiLieModel.seriesCode,
			}
			console.log("param: " + JSON.stringify(param));
			productSeriesEdit(param).then(res=>{
				if(res.code==200){
					this.editSheet = false;
					this.$Message.success('编辑成功！');
					this.clearInitData()
					setTimeout(()=>{
						this.isAgain = true;
					},1000)
				}
			}).catch(error=>{
				setTimeout(()=>{
					this.isAgain = true;
				},1000)
			})
		},
		editXiLieSon(){
			const param = {
				series   : this.addXiLieModel.secName,		//子系列名称
				seriesNotes : this.addXiLieModel.seriesNotes,
				seriesCode : this.addXiLieModel.seriesCode,
				pid :  this.addXiLieModel.pid,				//pid 父
				id  :  this.addXiLieModel.id,				//pid 子
			}
			console.log("param: " + JSON.stringify(param));
			productSeriesEdit(param).then(res=>{
				if(res.code==200){
					this.editSheetSon = false;
					this.$Message.success('编辑成功！');
					this.clearInitData()
					setTimeout(()=>{
						this.isAgain = true;
					},1000)
				}
			}).catch(error=>{
				setTimeout(()=>{
					this.isAgain = true;
				},1000)
			})
		},
		clearInitData(){
			this.ids = [];
			this.pageInfo.pageNum = 1;
			this.pageInfo.pageSize= 10;
			this.initList();
		},
		initList(){
			const param = {
				pageNum  : this.pageInfo.pageNum,
				pageSize : this.pageInfo.pageSize
			}
			productSeriesList(param).then(res=>{
				this.loading = false;
				this.delList = [];
				this.ids = [];
				if(res.code==200){
					res.rows.forEach((item)=>{
						this.$set(item,'isFirst',1);
						if(item.children!=''){
							item.children.forEach((temp)=>{
								this.$set(temp,'isFirst',2);
							})
						}
					})
					this.taskListData = res.rows;
					this.pageInfo.total = res.total;
				}
			})
		},
		edit(data){
			console.log("1: " + JSON.stringify(1));
			// 回填数据
			this.isAddOrEdit = false;
			if(data.isFirst==1){		//说明是编辑主系列的
				this.addXiLieModel.id    = data.id
				this.addXiLieModel.gname = data.series;
				this.addXiLieModel.seriesCode = data.seriesCode;
				this.addXiLieModel.seriesNotes = data.seriesNotes;
				this.editSheet = true;
			}else{						//编辑子系列
				this.addXiLieModel.id     = data.id;
				this.addXiLieModel.pid    = data.pid;
				this.addXiLieModel.secName = data.series;
				this.addXiLieModel.seriesCode = data.seriesCode;
				this.addXiLieModel.seriesNotes = data.seriesNotes;
				this.editSheetSon = true;
			}
		},
		//删除
		delData(data){
			var _this = this;
			this.$Modal.confirm({
				title: "确定删除当前数据吗？",
				cancelText : "取消",
				onOk(){
					productSeriesDel(data.id).then(res=>{
						if(res.code==200){
							_this.clearInitData()
							_this.$Message.success(res.msg);
						}
					})
				}
			});
		},
		openADD(){
			this.$refs['addXiLie'].resetFields();
			this.addXiLieModel.id = "";
			this.addSheet = true;
		},
		//查看产品
		lookProdut(id,type){
			//是否有子系列
			const param = {
				id : id
			}
			productSeriesSelectSon(param).then(res=>{
				console.log("res: " + JSON.stringify(res));
				if(res.code==200){
					if(type==1){					//默认
						this.selecOne = [];
						this.selecOne_text = "";
						this.selecTow = [];
						this.selecTow_text = "";
						this.selecThr = [];
						this.selecThr_text = "";
						this.selecFour = [];
						this.selecFour_text = "";
						
						this.selecOne = res.data;
					}
					else if(type==2){
						this.selecTow = res.data
					}else if(type==3){
						this.selecThr = res.data
					}else if(type==4){
						this.selecFour = res.data
					}
					this.productSheet = true;
					this.getLook_list(id)
				}
			})
		}
    }
}
</script>
<style lang="scss" scoped>
	.ivu-form-item-label{
		text-align: left !important;
	}
	.loadImg{
		width: 40px;
		height: 40px;
	}
	.addBZ{
		border-radius: 4px;
		height: 36px;
		width: 110px;
		background-color: #2D8CF0;
		color: white;
		cursor: pointer;
		.addBZRed{
			color: red;
			font-size: 20px;
		}
	}
</style>