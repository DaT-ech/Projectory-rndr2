const authUserDetailUrl = "/user/detail"
const userConnectionsUrl = "/user/connections";
const userProjectsUrl = "/user/projects";
const sendConnectionRequestUrl = '/user/connection/request/send/'; //{receiver}
const cancelConnectionRequestUrl = '/user/connection/request/remove/'; //{receiver}
const connectionStatusUrl = '/user/connection/status/'; //{receiver}
const unfriendUserUrl = '/user/connection/remove/'; //{unfriendee}
const unfriendUserByConnIdUrl = '/user/connection/remove-by-conn-id/'; //{unfriendee}

const sentConnectionRequestUrl = '/user/connection/request/sent/';
const receivedConnectionRequestUrl = '/user/connection/request/received/';

const acceptConnectionRequestUrl = '/user/connection/request/accept/';
const rejectConnectionRequestUrl = '/user/connection/request/reject/';
const connectionSenderReceiverId = '/user/connection/SenderReceiverId/';

const suggestedConnectionsUrl = '/user/connection/suggested/';

//userAppElementExists = document.getElementById('user-app-element');
userAppElementExists = document.getElementById('user-details');

isOwnAccount = ownAccount;
profileUsername = profileUsernameValue

const userDetail = Vue.createApp({
	data() {
		return {
			isOwnAccount: ownAccount,
			authUserId: null,
			authUsername: null,
			authFirstName: null,
			authLastName: null,
			authEmail: null,
			authOnlineStatus: null,
			authRole: null,
			authEnabled: null,
			authProfilePicture: null,

			userProjectList: [],
			userProjectCount: 0,
			userConnectionsList: [],
			sentConnections: [],
			receivedConnections: [],
			userConnectsCount: 0,
			connectionStatus:'',
			connectionSenderReceiverId:{},
			suggestedConnections: [],
			sendingConnectionRequest: false,
			cancelingConnectionRequest: false,
			acceptingConnectionRequest: false,
			rejectingConnectionRequest: false,
			unfriendingConnection: false,
			unfriendingConnectionWithConnId: false,
			

		}
	},
	created() {
		//alert(profileUsernameValue+" "+ownAccount)
		//alert(isOwnAccount)
		this.getUserDetail(profileUsername);
		this.getUserProjects(profileUsername);
		this.getUserConnections(profileUsername);
		this.getSuggestedConnections(5);		
		//alert(this.authUsername)
	},
	updated() {

	},
	methods: {

		getUserDetail(profileUsername) {
			let userDetailurl = null;
			if (isOwnAccount == 'true') {
				userDetailurl = authUserDetailUrl
			}
			else {
				userDetailurl = authUserDetailUrl + "/" + profileUsername
			}
			fetch(userDetailurl)
				.then(response => response.json())
				.then(data => {

					this.authUserId = data.userId
					this.authUsername = data.username
					this.authFirstName = data.firstName
					this.authLastName = data.lastName
					this.authOnlineStatus = data.onlineStatus
					if (data.profilePicture == null) {
						//alert(data.firstName[0])
						this.authProfilePicture = data.firstName[0].toUpperCase();
					} else {
						this.authProfilePicture = data.profilePicture
					}
					if (isOwnAccount == 'true') {
						this.authEmail = data.email
						this.authRole = data.authRole
						this.authEnabled = data.Enabled
					}
					this.getConnectionStatus(this.authUserId)
					this.getConnectionSenderReceiverId(this.authUserId)
				})

		},
		getUserProjects(profileUsername) {
			let userProjecturl = null;
			userProjecturl = userProjectsUrl + "/" + profileUsername
			fetch(userProjecturl)
				.then(response => response.json())
				.then(data => {
					this.userProjectList = data;
					this.userProjectCount = this.userProjectList.length;

				})
		},
		getUserConnections(profileUsername) {
			this.connectionStatus = "unknown"; //to keep Connect btn from showing up while loading(remove default)
			let userDetailurl = null;
			userConnection = userConnectionsUrl + "/" + profileUsername

			fetch(userConnection)
				.then(response => response.json())
				.then(data => {
					this.userConnectionsList = data
					this.userConnectionsList.forEach(conn => {
						if (conn.profilePicture == null) {
							conn.profilePicture = conn.connectedUserFirstName[0].toUpperCase();
						} 						
					})
					this.userConnectsCount = this.userConnectionsList.length;
				});
				
				//get sent requests if own account
				if (isOwnAccount == 'true') {
					this.getSentConnectionRequests();
					this.getReceivedConnectionRequests();
				}
				
		},
		connectWithUser(receiverUserId) {
			this.sendingConnectionRequest = true;
			fetch(sendConnectionRequestUrl+receiverUserId)
				.then(response => response.json())
				.then(data => {
					if(data == 1){
						toggleNotification("success", "connection request sent!")
						this.getConnectionStatus(receiverUserId)
						this.getConnectionSenderReceiverId(receiverUserId)
						
					}
					else{
						toggleNotification("error", "unable to send connection request");
					}					
					this.sendingConnectionRequest = false;
				})
		},
		cancelConnectionRequest(receiverUserId, event) {
			if(event)
			event.preventDefault();
			let url = cancelConnectionRequestUrl;
			if(isNaN(receiverUserId)){
				url = "/user/connection/request/remove-username/"
			}
			this.cancelingConnectionRequest = true;
			fetch(url+receiverUserId)
				.then(response => response.json())
				.then(data => {
					//alert(data)
					if(data == 1){
						toggleNotification("success", "connection request canceled!")
						this.getConnectionStatus(receiverUserId);
						this.getUserConnections(this.authUsername);
						//this.getConnectionSenderReceiverId(receiverUserId)
					}
					else{
						toggleNotification("error", "unable to cancel connection request");
					}
					this.cancelingConnectionRequest = false;
				})
		},
		
		rejectConnectionRequest(connectionId, event) {
			if(event)
			event.preventDefault();
			this.rejectingConnectionRequest = true;
			fetch(rejectConnectionRequestUrl+connectionId)
				.then(response => response.json())
				.then(data => {
					//alert(data)
					if(data == 1){
						toggleNotification("success", "connection request rejected!")
						this.getUserConnections(this.authUsername);
					}
					else{
						toggleNotification("error", "unable to reject connection request");
					}
					this.rejectingConnectionRequest = false;
				})
		},
		acceptConnectionRequest(connectionId, event) {
			if(event)
			event.preventDefault();
			this.acceptingConnectionRequest = true;
			fetch(acceptConnectionRequestUrl+connectionId)
				.then(response => response.json())
				.then(data => {
					//alert(data)
					if(data == 1){
						toggleNotification("success", "connection request accepted!")
						this.getUserConnections(this.authUsername);
						this.getConnectionStatus(this.authUserId)
						this.getConnectionSenderReceiverId(this.authUserId)
					}
					else{
						toggleNotification("error", "unable to accept connection request");
					}					
					this.acceptingConnectionRequest = false;
				})
		},
		unfriendUser(unfriendeeUserId, event) {
			if(event)
			event.preventDefault();
			this.unfriendingConnection = true;
			fetch(unfriendUserUrl+unfriendeeUserId)
				.then(response => response.json())
				.then(data => {
					if(data == 1){
						toggleNotification("success", "connection with user has been terminated!")
						this.getConnectionStatus(unfriendeeUserId)
						this.getUserConnections(this.authUsername);
					}
					else{
						toggleNotification("error", "unable to unfriend user");
					}
					this.unfriendingConnection = false;
				})
		},
		unfriendUserConnId(unfriendUserConnId, event) {  //duplicate for now..
			if(event)
			event.preventDefault();
			this.unfriendingConnectionWithConnId = true;
			fetch(unfriendUserByConnIdUrl+unfriendUserConnId)
				.then(response => response.json())
				.then(data => {
					if(data == 1){
						toggleNotification("success", "connection with user has been terminated!")
						this.getConnectionStatus(unfriendUserConnId)
						this.getUserConnections(this.authUsername);
					}
					else{
						toggleNotification("error", "unable to unfriend user");
					}
					this.unfriendingConnectionWithConnId = false;
				})
		},
		getConnectionStatus(userId){
				fetch(connectionStatusUrl+userId)
				.then(response => response.text())
				.then(data => {
					this.connectionStatus = data;
				})
		},
		getConnectionSenderReceiverId(userId){
				fetch(connectionSenderReceiverId+userId)
				.then(response => response.json())
				.then(data => {
					this.connectionSenderReceiverId = data;
				})
		},
		getSentConnectionRequests(){
		fetch(sentConnectionRequestUrl)
			.then(response => response.json())
			.then(data => {
				this.sentConnections = data
				this.sentConnections.forEach(sentConn => {
						if (sentConn.profilePicture == null) {
							sentConn.profilePicture = sentConn.connectedUserFirstName[0].toUpperCase();
						} 						
					})
			});
	},
	
	getReceivedConnectionRequests(){
		fetch(receivedConnectionRequestUrl)
			.then(response => response.json())
			.then(data => {
				this.receivedConnections = data
				this.receivedConnections.forEach(receivedReq => {
						if (receivedReq.profilePicture == null) {
							receivedReq.profilePicture = receivedReq.connectedUserFirstName[0].toUpperCase();
						} 						
					})
			});
	},
	getSuggestedConnections(resultLimit){
		fetch(suggestedConnectionsUrl+resultLimit)
			.then(response => response.json())
			.then(data => {
				 this.suggestedConnections = data
				 
				 if (data.profilePicture == null) {
						//alert(data.firstName[0])
						this.authProfilePicture = data.firstName[0].toUpperCase();
					} else {
						this.authProfilePicture = data.profilePicture
					}
			}
			
			)
	}
	
	
	
		
	}	
	

})
if (userAppElementExists)
	userDetail.mount('#user-details');


