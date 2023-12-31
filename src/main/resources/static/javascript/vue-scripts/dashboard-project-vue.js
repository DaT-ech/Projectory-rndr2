const fetchListUrl = '/user/api/todo-list/1';
const fetchListUrlREST = '/api/todo-list/1';
const fetchListUrlREST2 = '/api/todo-list/1';
const getProjectsUrl = '/project/getProjects';
const getProjectCountUrl = '/project/getProjectCount';
const getOwnProjectsCount = '/project/getOwnProjectsCount';
const getJoinedProjectsCount = '/project/getJoinedProjectsCount';
const updatedProjectStatusUrl = '/project/status/';

const addProjectUrl = '/project/add-project';
const deleteProjectUrl = '/project/delete';
const getProjectMembers = '/project/members';
const addProjectMember = '/project/addProjectMember';
const removeProjectMember = '/project/removeProjectMember';

const getPublicConnectsUrl = '/user/getUserConnectionList';
const userDetailUrl = "/user/detail"

const addProjectTaskUrl = '/project/add-project-task';
const getProjectTasks = '/project/task';
const getProjectTasksUrl = '/project/getProjectTasks';
const deleteProjectTaskUrl = '/project/task/delete/';

const collectionListUrl = '/user/collection';
const collectionTasksListUrl = '/user/collection/list';
const createCollectionUrl = '/user/collection/create';
const deleteCollectionUrl = '/user/collection/delete/';
const addListToCollectionUrl = '/user/collection/add/list';
const deleteSingleTodoItemUrl = '/user/collection/delete/list/item?itemId='
const markTodoItemAsDoneUrl = '/user/collection/mark/done/'
const markTodoItemAsOngoingUrl = '/user/collection/mark/ongoing/'
const deleteSelectedItemsUrl = '/user/collection/delete/list/item/selected/'

//let projectListCount2 = 0;
//project - display -modal
const projectVue = Vue.createApp({

	data() {
		return {
			projects: [],
			projectStatus: {},
			projectCount: [],
			connectsList: [],
			projectMembers: {},
			currentUserDetail: [],
			projectTasks: {},
			addingProjectTask: false,
			loadingProjects: false,
			creatingProject: false,
			deletingProject: false,

			projectTasksOnBoardPeekView: [],
			projectOnBoardCount: 0,

			userCollections: [],
			creatingCollection: false,
			addingItemToCollection: false,
			deletingCollection: false,
			refreshingProjectTasks: false,
			selectedItemsForDeletionCount: 0,

		}
	},
	created() {
		this.projectListCount = 0,
			this.getProjects(),
			this.getProjectCount(),
			this.getCurrentUserDetail(),
			this.getTasksListOnAgileBoard(),
			this.getUserCollection()

		//this.getProjectTasks();

	},
	mounted() {
		//sends it into unending loop when declared in data();
		this.projectListCount = 0
	},
	updated() {
		//prevents it from incrementing when data is updates
		this.projectListCount = 0
	},
	computed() {
		//projectListCount: 0
	},
	methods: {
		/*	incrementCount(){
				//alert(this.projectListCount)
				
				return ++this.projectListCount-600
			},*/
		getCurrentUserDetail() {
			fetch(userDetailUrl)
				.then(response => response.json())
				.then(data => this.currentUserDetail = data)
		},
		getProjects() {
			this.loadingProjects = true;
			fetch(getProjectsUrl)
				.then(response => response.json())
				.then(data => {
					this.projects = data
					//notift dashboard project card to update
					window.localStorage.setItem("projectHasBeenUpdated", true);  //why?

					this.projects.forEach(project => {
						this.projectStatus[project.projectId] = project.status;
						this.getProjectMembers(project.projectId, true)

						fetch(getProjectTasks + "?project=" + project.projectId)
							.then(response => response.json())
							.then(data => {
								project.projectTasks = data;
								this.loadingProjects = false;
							})
					})

				})

		},

		updateProjectStatus(projectId) {
			fetch(updatedProjectStatusUrl + projectId)
				.then(response => response.text())
				.then(data => {
					this.projectStatus[projectId] = data;
					//if(data == "Completed")
					//toggleNotification("success", "Project completed!");
					//trigger celebration confetti
				})

		}
		,
		updateProjectTasks(projectId) {
			this.updateProjectStatus(projectId);
			this.projects.forEach(project => {
				this.refreshingProjectTasks = true;
				fetch(getProjectTasks + "?project=" + project.projectId)
					.then(response => response.json())
					.then(data => {						//
						project.projectTasks = data;
						//this.loadingProjects = false;
						this.refreshingProjectTasks = false;
					})
			})
		},
		getProjectCount() {
			//get all projects count
			fetch(getProjectCountUrl)
				.then(response => response.json())
				.then(data => this.projectCount[0] = data)
			//get projects Created by user count
			fetch(getOwnProjectsCount)
				.then(response => response.json())
				.then(data => this.projectCount[1] = data)
			//get joined projects count
			fetch(getJoinedProjectsCount)
				.then(response => response.json())
				.then(data => this.projectCount[2] = data)
		},
		getProjectTasks() {
			fetch(getProjectTasks)
				.then(response => response.json())
				.then(data => {
					data.forEach(task => {
						this.projectTasks[task.projectId] = task
						alert(task.projectId)
					})

				})
			//alert(this.projectTasks.toString())
			//alert("fff")
		},
		getProjectTasksByProject(projectId) {
			fetch(getProjectTasks + "?project=" + projectId)
				.then(response => response.json())
				.then(data => {
					return data;
				})
		},
		addProject() {
			let title = document.getElementById("project-title-input");
			let description = document.getElementById("project-description-input");
			let status = document.getElementById("project-status-input");

			if (title.value.length == "") {
				toggleNotification("error", "Project title can't be blank!")
			}
			else {
				this.creatingProject = true;
				fetch(addProjectUrl + '?title=' + title.value + '&description=' + description.value + '&status=' + status.value)
					.then(response => response.json())
					.then(data => {
						toggleNotification("success", "Project successfully created!")
						title.value = "";
						description.value = "";
						this.getProjects();
						this.getProjectCount();
						this.creatingProject = false;
					})
			}
		},
		deleteProject(projectId) {
			this.deletingProject = true;
			fetch(deleteProjectUrl + '?project=' + projectId)
				.then(response => response.json())
				.then(data => {
					if (data == 1) {
						toggleNotification("success", "Project successfully deleted!")
						this.getProjects();
						this.getProjectCount();
					}
					else
						toggleNotification("error", "Unable to delete project!")
					this.deletingProject = false;
				})
		},
		showAddProjectMembersList(id, ev, on) {
			this.getProjectMembers(id, true);
			const container = document.getElementById("add-member-list-container-" + id);
			//alert(id)
			const inputArea = document.getElementById("add-project-members-btn-text");
			if (!container.classList.contains("show") && on != "blr") {
				this.collapseAllAddProjectMembersList();
				this.collapseAllAddProjectTaskForm();
				container.classList.add("show");

				fetch(getPublicConnectsUrl)
					.then(response => response.json())
					.then(data => this.connectsList = data)
			}
			else {
				if ((ev.currentTarget.value == "" && on == "blr") || ev.currentTarget.id != container.id) {
					container.classList.remove("show");
				}
			}

		},
		collapseAllAddProjectMembersList() {
			const memberForm = document.getElementsByClassName("add-project-member-list-container");
			for (let formContainer of memberForm) {
				formContainer.classList.remove("show");
			}

		},
		addProjectMember(projectId, username, event) {
			var ev = event.currentTarget;
			ev.setAttribute("disabled", true); //to make sure nothing changes while request is being processed
			//if(event.currentTarget.checked == true){ //member marked to be added
			fetch(addProjectMember + "?project=" + projectId + "&user=" + username)
				.then(response => response.json())
				.then(data => {
					//alert(data)
					if (data == 1)
						toggleNotification("success", "@" + username + " added as project member.");
					else {
						toggleNotification("error", "@" + username + " was not added as project member.");
						ev.checked = false;
					}
					ev.removeAttribute("disabled");  //neccessary when things don't work out
					this.getProjectMembers(projectId, true);
				})
		},
		removeProjectMember(projectId, username, event) {
			var ev = event.currentTarget
			ev.setAttribute("disabled", true); //to make sure nothing changes while request is being processed

			fetch(removeProjectMember + "?project=" + projectId + "&user=" + username)
				.then(response => response.json())
				.then(data => {
					if (data == 1)
						toggleNotification("success", "@" + username + " removed from project members.");
					else {
						toggleNotification("error", "unable to remove @" + username + " from project members.");
						ev.checked = true;
					}
					//this.projectMembers = data)   //why tho?
					ev.removeAttribute("disabled");  //neccessary when things don't work out
					this.getProjectMembers(projectId, true);
				});


		},
		getProjectMembers(projectId, multiple) {
			//alert("ohboii")
			fetch(getProjectMembers + "?project=" + projectId)
				.then(response => response.json())
				.then(data => {
					if (multiple) {
						this.projectMembers[projectId] = data;
					}
					else {
						this.projectMembers = data
					}
				})
			//alert(this.projectMembers[0].username)			
		},
		isNotInProjectMembers(username, projectId) {
			for (let member of this.projectMembers[projectId]) {
				if (member.username === username) {
					return false; // Username exists in project members
				}
			}
			return true; // Username does not exist in project members
		},
		addTaskToProject(projectId) {
			var currentTaskForm = "add-project-task-form-" + projectId;
			var taskTitle = document.querySelector("#" + currentTaskForm + " #task-title").value;
			var taskDescription = document.querySelector("#" + currentTaskForm + " #task-description").value;
			var taskStatus = document.querySelector("#" + currentTaskForm + " #task-status").value;
			if (taskTitle == "") {
				toggleNotification("error", "Task title can't be empty.")
			}
			else {
				this.addingProjectTask = true;
				fetch(addProjectTaskUrl + "?title=" + taskTitle + "&desc=" + taskDescription + "&project=" + projectId + "&status=" + taskStatus)
					.then(response => response.json())
					.then(data => {
						if (data == 1) {
							toggleNotification("success", "Task has been added to project.")
							document.querySelector("#" + currentTaskForm + " #task-title").value = "";
							document.querySelector("#" + currentTaskForm + " #task-description").value = "";
							taskStatus = document.querySelector("#" + currentTaskForm + " #task-status").value = "not started";							
							//this.getProjects();
							this.updateProjectTasks(projectId);
						}
						else
							toggleNotification("error", "Unable to add task to project.")
						this.addingProjectTask = false;
					})
			}
		},
		deleteTaskFromProject(taskId, projectId) {
			this.refreshingProjectTasks = true;
			fetch(deleteProjectTaskUrl + taskId)
				.then(response => response.json())
				.then(data => {
					if (data == 1) {
						toggleNotification("success", "Task has been deleted from project.")
						//this.getProjects();
						this.updateProjectTasks(projectId);
					}
					else
						toggleNotification("error", "Unable to delete task from project.")
					this.refreshingProjectTasks = false;
				})


		},
		//show "add project task" form
		showAddProjectTaskForm(id, trigger) {
			//add-project-task-button
			const addTaskForm = document.getElementById("add-project-task-form-" + id);

			if (addTaskForm.style.height == "0px") {
				this.collapseAllAddProjectTaskForm();
				this.collapseAllAddProjectMembersList();
				addTaskForm.style.height = "150px";
				trigger.currentTarget.classList.add("toggled");
			}
			else {
				addTaskForm.style.height = "0";
				trigger.currentTarget.classList.remove("toggled");
			}
		},
		collapseAllAddProjectTaskForm() {
			const AllAddTaskForms = document.getElementsByClassName("add-project-task-form");
			for (let f of AllAddTaskForms) {
				f.style.height = "0";
			}
		},
		searchThroughProjectMembersList() {
			fetch(getProjectsUrl)
				.then(response => response.json())
				.then(data => this.projects = data)
		},
		//expand/maximize container
		expandContainer(containerId, btnId) {
			const div = document.getElementById(containerId);
			const trigger = btnId.target;
			const allBoxes = document.getElementsByClassName("project-modal-boxes");
			const allTriggerBtns = document.getElementsByClassName("top-dangling-x-btn");
			//const d = document.get

			if (trigger.title == "Expand") {
				//minimize all project boxes, change bg color to default
				for (let box of allBoxes) {
					box.classList.replace('project-modal-boxes-expanded', 'project-modal-boxes-default');
				}
				for (let btn of allTriggerBtns) {
					btn.classList.remove('fa-compress');
					btn.classList.add('fa-expand');
					btn.setAttribute("title", "Expand");
					btn.parentElement.classList.remove("expanded");
				}

				trigger.setAttribute("title", "Minimize");
				div.classList.remove("project-modal-boxes-default");
				div.classList.add("project-modal-boxes-expanded");
				//div.parentElement.style.width = "100%";
				div.parentElement.classList.add("expanded");
				div.scrollIntoView();

				trigger.classList.remove('fa-expand');
				trigger.classList.add('fa-compress');
			}
			else {
				trigger.setAttribute("title", "Expand");
				div.classList.add("project-modal-boxes-default");
				div.classList.remove("project-modal-boxes-expanded");
				//div.parentElement.style.width = "fit-content";
				div.parentElement.classList.remove("expanded");
				trigger.classList.remove('fa-compress');
				trigger.classList.add('fa-expand');
			}
		},

		//methods for peek view cards
		getTasksListOnAgileBoard() {
			const projectId = window.localStorage.getItem("agile-board-selected-project")
			fetch(getProjectTasksUrl + "?project=" + projectId)
				.then(response => response.json())
				.then(data => {
					//alert(data[0].taskName)
					this.projectTasksOnBoardPeekView = data;
					this.projectOnBoardCount = data.length;
					//window.localStorage.setItem("agile-board-selected-project", projectId);
				})
		},


		//collection
		getUserCollection() {
			fetch(collectionListUrl)
				.then(response => response.json())
				.then(data => {
					this.userCollections = data
					//this.getUserCollectionTaskList();
				});
		},
		scrollToSpecificCollection(collectionId) {
			//document.getElementById(collectionId).scrollIntoView();
			window.setTimeout(test, 300);
			function test() {
				const collection = document.getElementById(collectionId);
				collection.scrollIntoView();
				//alert(collectionId);
			}

		},
		//add new collection script
		addNewCollection() {
			const title = document.getElementById("collection-name-input").value;
			if (title == '') {
				toggleNotification("error", "collection name can't be empty")
			}
			else {
				this.creatingCollection = true;
				fetch(createCollectionUrl + '?title=' + title)
					.then(response => response.json())
					.then(data => {
						let msg, notificationType;
						if (data == 1) {
							this.getUserCollection();
							msg = "New Collection Created!";
							notificationType = "success";
							document.getElementById("collection-name-input").value = '';
						}
						else {
							msg = "Couldn't Create New Collection. Please try again.";
							notificationType = "error";
						}						
						this.creatingCollection = false;
						toggleNotification(notificationType, msg);

					})
			}
		},
		deleteCollection(collectionId) {
			this.deletingCollection = collectionId;
			fetch(deleteCollectionUrl + collectionId)
				.then(resp => resp.json())
				.then(data => {
					if (data == 1) {
						toggleNotification("success", "Collection has been deleted")
						this.getUserCollection();
					}
					else {
						toggleNotification("error", "Unable to delete collection")
					this.deletingCollection = false;
					}
				})
		},
		//add todo item
		addTodo(collectionId) {
			const title = document.getElementById("col-" + collectionId + "-todo-title-input").value;
			if (title == '') {
				toggleNotification("error", "Item title can't be empty");
			} else {
				this.readyDeleteButton(collectionId, true)
				this.addingItemToCollection = collectionId; //not set to true to avoid triggering other similar buttons
				fetch(addListToCollectionUrl + '?title=' + title + '&collectionId=' + collectionId)
					.then(response => response.json())
					.then(data => {
						let msg, notificationType;
						if (data == 1) {
							this.getUserCollection();
							msg = "Todo task Item Added!";
							notificationType = "success";
							document.getElementById("col-" + collectionId + "-todo-title-input").value = '';
							this.readyDeleteButton(collectionId)
						}
						else {
							msg = "Couldn't add item. Please try again.";
							notificationType = "error";
						}
						toggleNotification(notificationType, msg);
						this.addingItemToCollection = false;

					})
			}
		},
		deleteSingleTodoItem(todoItemId) {
			fetch(deleteSingleTodoItemUrl + todoItemId)
				.then(response => response.json())
				.then(data => {
					if (data == 1) {
						this.getUserCollection();
						toggleNotification("success", "Item deleted");
					}
				})
		},
		readyDeleteButton(specificCollectionId, clear) {
			const checkboxes = document.getElementsByClassName("checkbox-for-deletion-" + specificCollectionId);
			const deleteSelectedItemsBtn = document.getElementById("delete-selected-btn-" + specificCollectionId);
			const numberOfItems = document.getElementById("number-of-items-badge-" + specificCollectionId);
			const deleteSingleItemBtns = document.getElementsByClassName("delete-single-item-btn-" + specificCollectionId);
			const deleteSingleItemLnk = document.getElementsByClassName("delete-single-item-link-" + specificCollectionId);
			this.selectedItemsForDeletionCount = 0;
			if (clear) {
				for (let checkbox of checkboxes){
					checkbox.checked = false;	
					}
					this.selectedItemsForDeletionCount = 0;
					deleteSelectedItemsBtn.setAttribute("disabled", true);
					deleteSelectedItemsBtn.classList.remove("btn-danger")
					for (let l of deleteSingleItemLnk) {
						//l.style="pointer-events: none !important";
						l.style.pointerEvents = "auto";
					}
					for (let i of deleteSingleItemBtns) {
						//i.setAttribute("class", "badge text-bg-danger delete-single-item-btn");
						i.classList.add("text-bg-danger");
						i.style.opacity = "1";
					}	
					numberOfItems.innerHTML = this.selectedItemsForDeletionCount;	
					
			}
			else {
				for (var checkbox of checkboxes) {
					if (checkbox.checked === true) {
						this.selectedItemsForDeletionCount++;
					}
				}
				numberOfItems.innerHTML = this.selectedItemsForDeletionCount;
				if (this.selectedItemsForDeletionCount > 0) {
					deleteSelectedItemsBtn.removeAttribute("disabled"); //d

					for (let l of deleteSingleItemLnk) { //can be replaced with classList
						l.style.pointerEvents = "none";
					}

					for (let i of deleteSingleItemBtns) {
						i.style.backgroundColor = "grey";
						i.style.opacity = "0.1";
						//i.setAttribute("class", "badge delete-single-item-btn");
						i.classList.remove("text-bg-danger");
					}
					deleteSelectedItemsBtn.classList.add("btn-danger")
				}
				else {
					deleteSelectedItemsBtn.setAttribute("disabled", true);
					deleteSelectedItemsBtn.classList.remove("btn-danger")
					for (let l of deleteSingleItemLnk) {
						//l.style="pointer-events: none !important";
						l.style.pointerEvents = "auto";
					}
					for (let i of deleteSingleItemBtns) {
						//i.setAttribute("class", "badge text-bg-danger delete-single-item-btn");
						i.classList.add("text-bg-danger");
						i.style.opacity = "1";
					}
				}
			}
		},
		deleteSelectedItems(collectionId,event) {
			event.preventDefault()
			let selectedItems = [];
			let selectedItemsJson = {};
			let counter = 0;
			const form = document.getElementById(event.target.id);

			const items = document.querySelectorAll("#" + event.target.id + " .checkbox-for-deletion")
			for (let item of items) {
				if (item.checked) {
					selectedItems.push(Number(item.value));
					//selectedItemsJson[counter++] = item.value					
				}
				//selectedItems = JSON.parse(selectedItems)
			}
			//console.log(selectedItems)
			//console.log(selectedItemsJson)
			const queryString = selectedItems.map(value => `items=${value}`).join('&');

			//fetch(deleteSelectedItemsUrl+selectedItems)
			fetch(deleteSelectedItemsUrl + "?" + queryString)
				.then(resp => resp.json())
				.then(data => {
					//console.log(data)
					if (data == 1) {
						//this.selectedItemsForDeletionCount = 0;
						toggleNotification("success", selectedItems.length + " items deleted");
					this.readyDeleteButton(collectionId, true)
						this.getUserCollection();
							//this.readyDeleteButton(collectionId)
					}
				})

		},
		markItemAsDone(todoItemId, event) {
			let url = markTodoItemAsDoneUrl;
			let msg = "Item marked as done"
			let done = true;
			if (!event.target.checked) {
				url = markTodoItemAsOngoingUrl;
				msg = "Item marked as on going"
				done = false;
			}
			fetch(url + todoItemId)
				.then(response => response.json())
				.then(data => {
					if (data == 1) {
						//this.getUserCollection();
						if (done)
							document.getElementById("list-item-" + todoItemId).classList.add("done");
						else
							document.getElementById("list-item-" + todoItemId).classList.remove("done");
						toggleNotification("success", msg);
					}
				})
		},
		editItem(id) {
			document.getElementById(id).contentEditable;
			// Get the container element by its ID.
			const listContrainer = document.select(id);
			// Get the span element by its ID.
			const spanElement = document.querySelector("#" + id + " span");
			//create form
			const form = document.createElement("form");
			form.setAttribute("action", "/todo/update-item?itemId=" + id);
			form.setAttribute("method", "POST");
			form.style.display = "inline";

			// Create a new text input element.
			const inputElement = document.createElement('input');
			inputElement.setAttribute("type", "text");
			inputElement.setAttribute("name", "name");

			// Set th value of the text input element to the text of the span element.
			inputElement.value = spanElement.textContent;
			inputElement.className = "form-control edit-element-title-input"

			//add input element to the form
			form.appendChild(inputElement);

			// Replace the span element with the form element.
			spanElement.replaceWith(form);
			//spanElement.replaceWith(inputElement);
			//&#10004;
		}


	}

})
projectVue.mount("#dashboard-area")
/*projectVue.mount("#project-list-modal-content")*/


/*if(document.getElementById("projects-holder-container")){
projectVue.mount("#projects-holder-container")
}*/
