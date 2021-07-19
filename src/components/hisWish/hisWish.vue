<template>
	<div>
		<Modal v-model="his_sheet"  width ="900"  title="祝福记录"   :footer-hide="true">
			<Table stripe border :columns="hisTitle" :data="hisData"></Table>
		</Modal>
		
		<Modal v-model="his_sheet_tow"  width ="600"  title="礼品详情"  :loading="loading"  :footer-hide="true">
			<Table stripe border :columns="liwuTitle" :data="liwuData"></Table>
		</Modal>
		
	</div>
</template>
<script>
	import { get_his_wish,get_his_liwu} from '_s/serverSafe'
	export default {
		data() {
			return {
				his_sheet : false,
				his_sheet_tow:false,
				loading:false,
				hisData : [],
				hisTitle:[
					{
						title: '序号',
						type : "index",
						resizable: true,
						align : "center",
						width: 80
					},
					{
						title: '发起人',
						key: 'username',
						resizable: true,
						align : "center",
					},
					{
						title: '祝福时间',
						key: 'wishTime',
						align : "center",
						resizable: true,
						width: 150
					},
					{
						title: '服务类型',
						key: 'wishTypeDesc',
						resizable: true,
						align : "center",
					},
					{
						title: '礼单详情',
						key: 'contactName',
						align : "center",
						resizable: true,
						width: 150,
						render: (h, params) => {
							return h('div', [
								h('Button', {
									props: {
										type: 'text',
										size: 'small'
									},
									style: {
										color : "#07a"
									},
									on: {
										click: () => {
											this.look(params.row)
										}
									}
								}, '查看'),
							])
						}
					},
					{
						title: '合计数量',
						key: 'giftNums',
						resizable: true,
						align : "center",
					},
					{
						title: '合计金额',
						key: 'giftPrice',
						resizable: true,
						align : "center",
					},
					{
						title: '备注',
						key: 'remark',
						align : "center",
						resizable: true
					}
				],
				liwuData: [],
				liwuTitle:[
					{
						title: '序号',
						type : "index",
						resizable: true,
						align : "center",
					},
					{
						title: '礼品名称',
						key: 'giftName',
						resizable: true,
						align : "center",
						width : 120
					},
					{
						title: '数量',
						key: 'giftNums',
						resizable: true,
						align : "center",
					},
					{
						title: '单价',
						key: 'giftUnitPrice',
						resizable: true,
						align : "center",
					}
				]
			}
		},
		methods:{
			open(data){
				this.his_sheet = true;
				this.getHisWish(data);
			},
			getHisWish(data){
				const param = {
					crmCustomerContactId : data.crmCustomerContactId,
					specialDate			 : data.specialDate
				}
				get_his_wish(param).then(res=>{
					this.hisData = res.data;
				})
			},
			look(data){
				this.his_sheet_tow = true;
				get_his_liwu(data.wishId).then(res=>{
					this.liwuData = res.data;
					this.loading = true;
				})
			}
			
		}
	}
</script>
<style>
</style>
