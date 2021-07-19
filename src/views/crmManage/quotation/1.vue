<template>
	<div>
		<Form ref="searchForm" :label-width="100">
			<FormItem label="付款方式">
				<Select v-model="payfor" placeholder="请选择付款方式" filterable  :clearable="true"  @on-change="selOne">
					<Option v-for="val in csList" :value="val.value" :key="val.value">{{val.name}}</Option>
				</Select>
			</FormItem>
			
			<FormItem label="付款方式"  v-for="item in csListTow" :key="item.value"  v-if="item.value==csID">
				<Select  :value="payBz" placeholder="请选择标准"   filterable  :clearable="true" ref="element" @on-change="selTow" :label-in-value="true">
					<Option v-for="val in item.dataList" :value="val.value" :key="val.value">{{val.name}}</Option>
				</Select>
			</FormItem>
			<button>确定</button>
		</Form>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				payfor : "",
				payBz  : "",
				
				csID   : 0,
				csList : [
					 {value:1,name:"产品1",dataList:[{name:"标准1",value:1}]},
					 {value:2,name:"产品2",dataList:[{name:"标准2",value:1}]},
				],
				csListTow : [
					 {value:1,name:"产品1",dataList:[{name:"标准1",value:1}]},
					 {value:2,name:"产品2",dataList:[{name:"标准2",value:1}]},
				],
			}
		},
		methods:{
			selOne(e){
				this.csID = e;
			},
			selTow(e){
	
			}
		}
	}
</script>