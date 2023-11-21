const getProjectsCardUrl = '/project/getProjects';
const getProjectCardCountUrl = '/project/getProjectCount';
const getOwnProjectsCardCount = '/project/getOwnProjectsCardCount';
const getJoinedProjectsCardCount = '/project/getJoinedProjectsCardCount';
/* num = 1;
const cardVar = "coming from card, "+num;
alert(modalVar)*/

const projectCardVue = Vue.createApp({

	data() {
		return {
			projectsOnCard: [],
			projectCount: [],
			loadingProjects: false,




		}
	},
	created() {
		this.projectListCount = 0,
			this.getProjects(),
			this.getProjectCount()
	},
	mounted() {
		//sends it into unending loop when declared in data();
		this.projectListCount = 0
	},
	updated() {
		this.projectListCount = 0
	},
	computed() {
	},
	methods: {
		check1(){
			alert("calling alien method")
		},
		getProjects() {
			this.loadingProjects = true;
			fetch(getProjectsCardUrl)
				.then(response => response.json())
				.then(data => {
					this.projectsOnCard = data						
				})

		},
		getProjectCount() {
			//get all projects count
			fetch(getProjectCardCountUrl)
				.then(response => response.json())
				.then(data => this.projectCount[0] = data)
			//get projects Created by user count
			fetch(getOwnProjectsCardCount)
				.then(response => response.json())
				.then(data => this.projectCount[1] = data)
			//get joined projects count
			fetch(getJoinedProjectsCardCount)
				.then(response => response.json())
				.then(data => this.projectCount[2] = data)
		},
		

	}

})
projectCardVue.mount("#project-card")

// Attach to window object
window.projectCardVue = projectCardVue;

/*if(document.getElementById("projects-holder-container")){
projectVue.mount("#projects-holder-container")
}*/
