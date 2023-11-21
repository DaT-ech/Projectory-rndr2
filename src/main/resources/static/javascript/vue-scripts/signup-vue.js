const usernameAvailabilityCheckerUrl = '/usernameAvailability/';

Vue.createApp({
	data(){
		return{
			username: false,
			usernameAvailability: "",
			
		}
	},
	created(){
		
	},
	methods:{
		checkUsernameAvailabiltiy(chosenUsername){
			if(chosenUsername != ""){
				fetch(usernameAvailabilityCheckerUrl+chosenUsername)
				.then(response => response.text())				
				.then(data => {
					if(data == "Available"){
						this.usernameAvailability = data;
					}
					else{
						this.usernameAvailability = "Not available. How about: "+data;
					}
				})
			}
			else{
				this.usernameAvailability = "";
			}
			
		}
	}
}).mount("#sign-up-form")