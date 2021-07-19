<template>
	<div>
		<Modal v-model="lookDefault" width="700" title="查看详情" :footer-hide="true">
			<div v-for="(item,index) in tabMenu" :key="index">
				<Button type="primary" class="hxy-mb-10" @click="openSheetName()">
					<span style="color: red;">*</span> 添加规格
				</Button>
				<SkuForm
					:ref="'skuForm'+tabIndex"
					:source-attribute="item.sourceAttribute"
					:structure="item.structure"
					:attribute.sync="item.attribute"
					:sku.sync="item.sku"
					:theme="2"
					async
				/>
			</div>
		</Modal>
		
		
		<!-- 添加规格名 -->
		<Modal v-model="addGGObj.ggNameSheet" width="700" title="添加规格" :footer-hide="true">
			<Row>
				<Col class="isFlexSpace" style="align-items: flex-start;">
					<Input placeholder="请输入规格名称" v-model="addGGObj.guigeName"></Input>
				</Col>
			</Row>
			<modalBtn @sureBtn="addGuige"  @cancleBtn="guigeFlag=false"></modalBtn>
		</Modal>
		
		
		<div @click="ceshi">测试</div>
		
	</div>
</template>
<script>
	import SkuForm from 'vue-sku-form'
export default {
	components:{
		SkuForm
	},
	data() {
		return {
			addGGObj : {
				ggNameSheet :false,
				ggPriceSheet:false,
				guigeName  : "",
				priceName  : "",
			},
			// 成本价，促销价，会员价1，会员2，会员3
			
			
			tabMenu : [
				{
					name:"类型1",
					num : 0,
					sourceAttribute: [],
					structure : [
						{ name: 'price1', type: 'input', label: '成本价' },
						{ name: 'price2', type: 'input', label: '促销价' },
						{ name: 'price3', type: 'input', label: '会员价1' },
						{ name: 'price4', type: 'input', label: '会员价2' },
						{ name: 'price5', type: 'input', label: '会员价3' }
					],
					attribute: [],
					sku: []
				}
			],
			tabIndex:0,
			loading: false,
			lookDefault:true,
			sourceAttribute: [],
			structure : [],
			attribute: [],
			sku: []
		}
	},
	mounted() {},
	methods: {
		openSheetName(){
			this.addGGObj.ggNameSheet = true;
			this.addGGObj.guigeName   = "";
		},
		openSheetPrice(){
			this.addGGObj.ggPriceSheet = true;
			this.addGGObj.priceName   = "";
		},
		addGuige(){
			var temp = this.tabMenu[this.tabIndex];
			setTimeout(() => {
				var setData = {
					name: this.addGGObj.guigeName,
					type: 'input',
					item: []
				}
				temp.sourceAttribute.push(setData);
				this.sourceAttribute = temp.sourceAttribute;
				this.$refs[`skuForm${this.tabIndex}`][0].init();
				this.addGGObj.ggNameSheet = false;
				temp.loading = false;
			}, 300)
		},
		ceshi(){
			console.log("this.: " + JSON.stringify(this.tabMenu));
		},
		load(type) {
			this.loading = true
			if (type == 1) {
				setTimeout(() => {
					this.sourceAttribute = [
						{
							name: '颜色',
							item: ['黑', '金', '白']
						},
						{
							name: '内存',
							item: ['16G', '32G']
						}
					]
					setTimeout(() => {
						this.attribute = [
							{
								name: '颜色',
								item: ['黑', '金']
							},
							{
								name: '内存',
								item: ['64G']
							}
						]
						setTimeout(() => {
							this.sku = [
								{
									sku: '黑;64G',
									originalprice: '100',
									price: '80',
									stock: '100'
								},
								{
									sku: '金;64G',
									originalprice: '100',
									price: '85',
									stock: '50'
								}
							]
							// 切记，必须在 attribute、sku 数据都加载后再执行 init() 方法
							this.$refs.skuForm.init()
							this.loading = false
						}, 300)
					}, 300)
				}, 300)
			} else if (type == 2) {
				setTimeout(() => {
					this.sourceAttribute = [
						{
							name: '内存',
							item: ['16G', '32G']
						},
						{
							name: '颜色',
							item: ['黑', '金', '白']
						}
					]
					setTimeout(() => {
						this.attribute = [
							{
								name: '内存',
								item: ['64G']
							},
							{
								name: '颜色',
								item: ['红', '白']
							}
						]
						setTimeout(() => {
							this.sku = [
								{
									sku: '64G;红',
									originalprice: 10,
									price: 8,
									stock: 10
								},
								{
									sku: '64G;白',
									originalprice: 10,
									price: 8,
									stock: 5
								}
							]
							// 切记，必须在 attribute、sku 数据都加载后再执行 init() 方法
							this.$refs.skuForm.init()
							this.loading = false
						}, 300)
					}, 300)
				}, 300)
			} else {
				setTimeout(() => {
					this.sourceAttribute = [
						{
							name: '颜色',
							item: ['黑', '金', '白']
						}
					]
					this.attribute = []
					this.sku = []
					this.$refs[`skuForm${this.tabIndex}`][0].init()
					this.loading = false
				}, 300)
			}
		}
	}
}
</script>