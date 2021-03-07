(function (Vue) {
	Vue.directive('focus',{
		inserted(el,binding){
			el.focus()
		},
		update(el,binding){
			if(binding.value){
				el.focus()
			}
		}
	})
	new Vue({
		el:'#app',
		data() {
			return {
				currentItem:null,
				counter:0,
				dataList:[
					{id:1,checked:true,content:'js'},
					{id:2,checked:false,content:'phyon'},
					{id:3,checked:true,content:'javaScript'},
				],
				filterData:"All",
				filterList:[
					{id:1,action:"All",selected:false},
					{id:2,action:"Active",selected:false},
					{id:3,action:"Completed",selected:false},
				]
			}
		},
		created() {
			this.dataList = JSON.parse(localStorage.getItem("vuejs")||"[]")
		},
		watch:{
			dataList:{
				deep:true,
				handler:function(newValue,oldValue){
					localStorage.setItem("vuejs",JSON.stringify(newValue))
				}
			}
		},
		methods:{
			 //获取点击过滤的选项
			 getFilterData(e){
				this.filterData = e.target.innerText
				this.filterList.map((item)=>{
					item.action === e.target.innerText?item.selected = true:item.selected = false
				})
			 },
			//删除任务
			deleItem(e){
				this.dataList = this.dataList.filter(function(item){
					return item === e?'':item
				})
			},
			//输入框增加任务
			addItem(e){ 
				if(e.target.value){
					if(this.dataList.length === 0){
						this.dataList.push({id:1,checked:false,content:e.target.value})
					}else{
						this.dataList.push({id:this.dataList[this.dataList.length-1].id+1,checked:false,content:e.target.value})
					}
				}		
				e.target.value=''
			},
			//删除已完成任务项
			deleCompleted(){
				this.dataList = this.dataList.filter((item)=>{
					return item.checked?'':item
				})
			},
			//获取双击的文本输入框
			toEdit(e){
				this.currentItem = e
			},
			//退出编辑窗口
			cancelEdit(){
				this.currentItem = null
			},
			//完成编辑并保存数据
			finishEdit(item,event){
				const nowContent = event.target.value
				if(!nowContent){
					this.deleItem(item)
				}else{
					item.content = nowContent
					this.currentItem = null
				}
			}
		},
		computed:{
				//获取hash
			getHash(){
				switch(this.filterData) {
					case "All":
						return this.dataList
					case "Completed":
						return this.dataList.filter((item)=>item.checked?item:'')
					case "Active":
						return this.dataList.filter((item)=>item.checked?'':item)
				}
			},
			//统计未完成任务数
			uncompletedNum(){
				this.counter = 0
				this.dataList.map((item)=>{
					if(item.checked === false){
						this.counter ++
					}	
				})
				return this.counter
			},
			//切换item单复数
			plural(){
				return this.counter <= 1 ? false : true
			},
			//全选和不全选按钮
			toggleAll:{
				get(){
					return this.uncompletedNum?false:true
				},
				set(newValue){
					 this.dataList.map((item)=>{		
						item.checked = newValue
					 })
				}
			}
		}
	})
	 

})(Vue);
