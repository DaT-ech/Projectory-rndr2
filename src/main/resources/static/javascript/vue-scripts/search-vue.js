const searchUrl = "/search/all/";

Vue.createApp({
	
	data(){
		return{
			fetchedSearchableData: [],
			searchLoading: false,
			noResult: false,
		}
	},
	created(){
		
	},
	methods:{
		fetchSearchableData(keyword, event){
			this.noResult = false;
			if(keyword != ''){
				searchLoading = true;
			fetch(searchUrl+keyword)
				.then(response => response.json())
				.then(data => {
					this.fetchedSearchableData = data;
					if(data.length == 0)
					this.noResult = true;
					searchLoading = false;
				})
			}
			else{
				this.noResult = false;
			}
		},
		searchThroughData(){
			
		}
	}
}).mount("#search-bar");
