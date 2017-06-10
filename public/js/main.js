'use strict';
var domain = "http://localhost:3030/";
var img = "http://images.clipartpanda.com/chat-clipart-dT7eGEonc.png";
var app = angular.module('Chat', [/*'webcam',*/'naif.base64', 'ngRoute', 'ngResource','ui.router', 'ui.materialize', 'ngStorage'])
app.controller('mainCtrl', function($scope, $route, $routeParams , $location, $localStorage){
	//$scope.user = {};
	//$scope.error = '';
   $scope.channel = {
		name: "",
		data: "",
		img: "",
		date: "",
		read: false,
		visible: true
	};
	$scope.msg = {
		name: "",
		data: "",
		img: "",
		date: "",
		read: false,
		visible: true
	};
	$scope.newGIF = {
	    filesize : 54836, /* bytes */
	    filetype: "image/jpeg",
	    filename : "profile.jpg",
	    base64 :   "/9j/4AAQSkZJRgABAgAAAQABAAD//gAEKgD/4gIctcwIQA"
    };
	$scope.chatUsers = [];
  $scope.contacts = [];
	$scope.inChatMsgs = [{name: "Ruben", data: "Hola",img: "", date: "12/12/17", read: false, visible: true},{name: "Carlos", data: "Cuando se arma la potra",img: "", date: "13/12/17", read: false, visible: true}];
	$scope.Channels = [{name: "Futbol Team", data: "Hola",img: "", date: "12/12/17", read: false, visible: true},{name: "Work", data: "Cuando se arma la potra",img: "", date: "13/12/17", read: false, visible: true}];
	$scope.onError = function (err) {};
	$scope.onStream = function (stream) {};
	$scope.onSuccess = function () {};
	$scope.take_snapshot = function(){
			Webcam.snap( function(data_uri) {
					$scope.cameraURI = data_uri;
					document.getElementById('my_result').innerHTML = '<img src="'+data_uri+'"/>';
			} );
	};
	$scope.previewFile = function(){
			var preview = $( "img#imgUpload" )[ 0 ];
			var file    = $( "input#btnUpload" )[ 0 ].files[0];
			var reader  = new FileReader();

			preview.src = "./assets/loading.gif";

			console.log(file);
			console.log(preview);
			reader.addEventListener("load", function () {
				preview.src = reader.result;
				$scope.imgUpload =  reader.result;
				$scope.disabletUpload = false;
				$scope.$apply();
			}, false);

			if (file) {
				reader.readAsDataURL(file);
			}

			console.log(reader);

	};
	$scope.myChannel = {
    // the fields below are all optional
	    videoHeight: 200,
	    videoWidth: 200,
	    video: null // Will reference the video element on success
	};
	$scope.verifyUser = function(){
		if( $scope.user == null){
			window.location.replace(domain+"login");
		}
	};
  $scope.init =  function(){
		$scope.disabletUpload = true;
		$scope.selectedRoomName = '';
		$scope.user = $localStorage.user;
        $scope.client = $localStorage.client;
        $scope.server = $localStorage.server;

		if( $localStorage.user && $localStorage.client && $localStorage.server){
			$scope.getRooms(true);
			$scope.getRooms(false);
			$scope.getContacts();
		}
		// Establish a Socket.io connection
		$scope.socket = io();
		// Initialize our Feathers client application through Socket.io
		// with hooks and authentication.
		$scope.client = feathers();
		$scope.client.configure(feathers.socketio($scope.socket));
		$scope.client.configure(feathers.hooks());
		// Use localStorage to store our login token
		$scope.client.configure(feathers.authentication({
		  storage: window.localStorage
		}));
		// Listen to created events and add the new message in real-time
		// $scope.client.service('messages').on('created', $scope.updateMessages );
		// We will also see when new users get created in real-time
		// $scope.client.service('users').on('created', $scope.updateUsers );
	};
	$scope.cleanTmpData = function(){
		$scope.chatUsers = [];
		$scope.inChatMsgs = [];

		$scope.$apply();
	};
	$scope.createEmoji = function (){

		$scope.$apply();

	};
	$scope.settings = function (){

		$scope.$apply();

	};
	$scope.addUser = function(user){
		$scope.chatUsers.push(user);
		$scope.$apply();
	};
	$scope.deleteUser = function(user){
		$scope.chatUsers.pop(user);
		$scope.$apply();
	};
	$scope.updateUser = function(_username, _name, _email, _img ) {
				$scope.client.service('users').patch($scope.user._id, {
						username: _username,
						name: _name,
						email: _email
				})
				.then(function(result){
							console.log(result);
							$scope.user = result;
							$localStorage.user = result;
							$scope.$apply();
				});
	};
	$scope.addRoomToUser =  function( _userId,  _RoomId  ) {
				$scope.findUserById( _userId ).then(function(userData){
						let participantData = userData;
						if( participantData.rooms == null){
							participantData.rooms = [];
						}
						if(participantData.rooms.indexOf(_RoomId) != -1 ){
							console.log("Room Ya Existe");
							return;
						}
						participantData.rooms.push( _RoomId  );
						console.log("Anadiendo Room a User "+participantData.name);
						console.log(participantData);
						$scope.client.service('users').patch( _userId, {
								rooms: participantData.rooms
						})
						.then(function(result){
									console.log(result);
									if(result._id == $scope.user._id){
										$scope.user = result;
										$localStorage.user = result;
									}
									$scope.$apply();
						});
				});
	};
	$scope.deleteRoomToUser =  function( _userId,  _RoomId  ) {
				$scope.findUserById( _userId ).then(function(userData){
						let participantData = userData;
						if( participantData.rooms == null){
							participantData.rooms = [];
						}
						if(participantData.rooms.indexOf(_RoomId) == -1 ){
							console.log("Room No Se puede Borrar, No Existe");
							return;
						}
						participantData.rooms.splice(participantData.rooms.indexOf(_RoomId),1);
						console.log("Borrando Room a User "+participantData.name);
						console.log(participantData);
						$scope.client.service('users').patch( _userId, {
								rooms: participantData.rooms
						})
						.then(function(result){
									console.log(result);
									if(result._id == $scope.user._id){
										$scope.user = result;
										$localStorage.user = result;
									}
									$scope.$apply();
						});
				});
	};
	$scope.setLoggedUser = function( _id , _isLogged ) {
				$scope.client.service('users').patch( _id, {
						loggedIn: _isLogged
				})
				.then(function(result){
							console.log(result);
							if(result._id == $scope.user._id){
								$scope.user = result;
								$localStorage.user = result;
							}
							$scope.$apply();
				});
	};
	$scope.addUserLoginFailure = function( _userId ) {
		scope.findUserById( _userId ).then(function(userData){
				let participantData = userData;
				if( participantData.loginFailures == null){
					participantData.loginFailures = 0;
				}
				if(participantData.loginFailures == 5 ){
					participantData.loginFailures = 0;
					$scope.sendEmailAndBlockUser( _userId );
				}
				$scope.client.service('users').patch( _userId, {
						loginFailures: participantData.loginFailures
				})
				.then(function(result){
							console.log(result);
							if(result._id == $scope.user._id){
								$scope.user = result;
								$localStorage.user = result;
							}
							$scope.$apply();
				});
		});
	};
	$scope.sendEmailAndBlockUser = function( _userId ){


	};
	$scope.addMessage = function(msg){
		const sender = message.user || {};
		$scope.chatUsers.push(msg);
		$scope.$apply();
	};
	$scope.deleteMessage = function(msg){
		$scope.chatUsers.pop(msg);
		$scope.$apply();
	};
	$scope.sendMessage = function(){
		const input = $('[name="text"]');
	    $scope.client.service('messages').create({
	      text: input.val()
	    }).then(() => input.val(''));
	    $scope.$apply();
	};
	$scope.getRooms = function(_private){
	    $scope.client.service('rooms').find({
		  query: {
		    owner: $scope.user._id,
		    private: _private
		  }
		}).then(function(result){
    		if(_private){
    			console.log("Rooms");
	    		$scope.Rooms = result.data;
	    		$scope.Rooms.forEach(function(room, ri){
	    			room.participants.forEach(function(p, i){
		    			$scope.findUserById(p.id).then(function(userData){
		    				room.participants[i] = userData;
		    				$scope.$apply();
		    			});
		    		});
	    		});
	    		console.log($scope.Rooms);
    		}else{
    			console.log("Channels");
	    		$scope.Channels = result.data;
	    		$scope.Channels.forEach(function(channel, ri){
	    			channel.participants.forEach(function(c, i){
		    			$scope.findUserById(c.id).then(function(userData){
		    				channel.participants[i] = userData;
		    				$scope.$apply();
		    			});
		    		});
	    		});
	    		console.log($scope.Channels);
    		}
	    });
	};
	$scope.createRooms = function( _private, _name){
		let participants = []
		$scope.Contacts.forEach(function(_cData){
			if(_cData.selected)
				participants.push({id: _cData.contact._id});
		});
		if(participants.length < 1){
			$scope.Contacts.forEach(function(element){  element.selected = false;  });
			$scope.error = "No Contacts Selected";
			console.log($scope.error);
		}else{
			participants.push({id: $scope.user._id});
			$scope.client.service('rooms').create({
				owner: $scope.user._id,
				img: img,
				private: _private,
				name : _name
		    }).then(function(result){
		    	console.log("Room Created Private: "+_private);
		    	// console.log(result.data);
		    	console.log(participants);
		    	$scope.Contacts.forEach(function(element){ element.selected = false; });
		    	$scope.selectedRoomName = '';
		    	$scope.getRooms(_private);
		    });
		}
	};
	$scope.updateRooms = function(room){
		var participants = []
		room.participants.forEach(function(_participant){
			participants.push(_participant);
		});
	    $scope.client.service('rooms').create({
			owner: $scope.user._id,
			img: img,
			participants: participants,
			private: room.private
	    }).then(function(result){
	    	console.log(result.data);
	    	$scope.$apply();
	    });
	    console.log(participants);
	};
	$scope.getContacts = function(){
	    $scope.client.service('contacts').find({
		  query: {
		    owner: $scope.user._id
		  }
		}).then(function(result){
    		// console.log("Contacts");
    		$scope.Contacts = result.data;
    		$scope.Contacts.forEach(function(contact, ci){
    			$scope.findUserById(contact.owner).then(function(userData){
    				contact.owner = userData;
    				$scope.$apply();
    			});
    			$scope.findUserById(contact.contact).then(function(userData){
    				contact.contact = userData;
    				$scope.$apply();
    			});
    		});
    		// console.log($scope.Contacts);
	    });
	};
	$scope.createContact = function(contactEmail){
		$scope.findUsersByEmail(contactEmail).then(function(userData){
			var newContact = userData;
			if(newContact != null){
				console.log("Creating contact");
				console.log(newContact);
			}else{
				$scope.error = "User Not Found"
				console.log($scope.error);
				return;
			}
		    $scope.client.service('contacts').create({
				owner: $scope.user._id,
				contact: newContact._id
		    }).then(function(result){
		    	console.log(result);
		    	$scope.getContacts();
		    });
		});
	};
	$scope.selectNextContact = function(cData){
		if($scope.selectedContact){
			$scope.selectedContact.selected = false;
			$scope.selectedContact = null;
			$scope.Contacts.forEach(function(element){
				element.selected = false;
			});

		}else{
			$scope.selectedContact = cData;
		}
	}
	$scope.getInvitations = function(){
	    $scope.client.service('invitations').find(/* {
	      text: input.val()
	    }*/).then(function(result){
	    	console.log(result.data);
	    	$scope.$apply();
	    });
	};
	$scope.createInvitations = function(){
	    $scope.client.service('invitations').create({
			emailTo: "",
			emailFrom: "",
			roomId: ""
	    }).then(function(result){
	    	console.log(result.data);
	    	$scope.$apply();
	    });
	};
	$scope.createGif = function(_frase, _from, _img){
	    $scope.client.service('gifs').create({
					frase: _frase,
					from: _from,
					img: _img
	    }).then(function(result){
	    	console.log(result.data);
	    	$scope.$apply();
	    });
	};
	$scope.getUsers = function(){
		$scope.client.service('users').find()
	      .then(function(result) {
      		console.log(result.data);
      		$scope.$apply();
      		return result.data;
          })
          .catch(function(error){
            console.log(error);
            $scope.$apply();
            return null;
        });
	}
	$scope.findUserById = function(id){
        return new Promise((resolve, reject) => {
        	$scope.client.service('users').find({
			  query: {
			    _id: id
			  }
			})
		    .then(function(result) {
		        resolve(result.data[0]);
	          })
	          .catch(function(error){
	            console.log(error);
	            $scope.error = error;
			    reject(error);
	        });
		});
	}
	$scope.findUsersByEmail = function(_email){
		return new Promise((resolve, reject) => {
        	$scope.client.service('users').find({
			  query: {
			    email: _email
			  }
			})
		    .then(function(result) {
		    	console.log(result.data[0]);
		        resolve(result.data[0]);
	          })
	          .catch(function(error){
	            console.log(error);
	            $scope.error = error;
			    reject(error);
	        });
		});
	}
	$scope.findUsersToLogin = function(email, redirect, location){
		$scope.client.service('users').find()
	      .then(function(result) {

      		result.data.forEach(function(element){
            	if(element.email == email){
            		$scope.user = element;

            		$localStorage.user = element;
            		$localStorage.client = $scope.client;
            		$localStorage.server = $scope.server;

            		console.log($scope.user);
            		// alert($scope.user.name);
            		$scope.$apply();
            		if(redirect)
            			location();
            	}
            });
          })
          .catch(function(error){
            console.log("NO PASO ");
            console.log(error);
            $scope.error = error;
            $scope.$apply();
            $scope.showLogin();
          });
	}
	$scope.login = function(credentials){
		console.log("Login");
		// var credentials = $scope.getCredentials();
	    const payload = credentials ? Object.assign({ strategy: 'local' }, credentials) : {};
        return $scope.client.authenticate(payload)
          .then(function(result) {
            console.log("PASO ");
            $scope.result = result;
            $scope.findUsersToLogin(credentials.email, true, $scope.showDashboard );
            $scope.$apply();
          })
          .catch(function(error){
            $scope.error = "Error Login Up "+ credentials;
            console.log("NO PASO ");
            console.log(error);
            $scope.error = error;
            $scope.showLogin();
            $scope.$apply();
          });
	};
	$scope.signup = function(credentials){
		console.log("Sign up");
	    $scope.client.service('users').create(credentials)
	      .then(function(result) {
      		console.log("PASO ");
      		console.log(result);
            $scope.login(credentials);
            $scope.$apply();
          })
          .catch(function(error){
            $scope.error = "Error Signin Up";
            console.log(error);
            $scope.$apply();
            // $scope.showSignup();
          });
	};
	$scope.logout = function(){
		$scope.client.logout().then(function(){
			$localStorage.user = null;
			localStorage.client = null;
       		$localStorage.server = null;
			$scope.showLogin();
		});
	};
	$scope.showLogin = function(){
		window.location.replace(domain+"login");
	};
	$scope.showSignup = function(){
		window.location.replace(domain+"signup");
	};
	$scope.showDashboard = function(){
		window.location.replace(domain+"dashboard");
	};
	$scope.showChat = function(){
		window.location.replace(domain+"chat");
	};
	$scope.getCredentials = function(){
		const tmpUser = {
		  		name: $scope.formName,
          email: $scope.formEmail,
          password:  $scope.formPassword,
					rooms: []
        };
        $scope.$apply();
        return tmpUser;
	};
	$scope.joinRoom = function(roomId){
		// const user = app.get('user');
		$scope.$apply();
        return app.service('users').patch($scope.user.id, { rooms: $scope.user.rooms.concat(roomId) });

	};
	$scope.print = function(value){
		console.log($scope.result);
		$scope.$apply();
	}
	$scope.islogin = function(){
		if($localStorage.user == null){
			$scope.showSignup();
		}
	}
	$scope.letItLog = function(){
		if($localStorage.user != null){
			$scope.showDashboard();
		}
	}
	$scope.uploadGif = function(){
		if (this.files && this.files[0]) {
		    var FR = new FileReader();
		    FR.addEventListener("load", function(e) {
		      document.getElementById("img").src       = e.target.result;
		      document.getElementById("b64").innerHTML = e.target.result;
		    });
		    FR.readAsDataURL( this.files[0] );
		}
	}
	$scope.init();
});
app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
    .when("/signup", {
        templateUrl : "templates/signup.html"
    })
    .when("/login", {
        templateUrl : "templates/login.html"
    })
    .when("/", {
        templateUrl : "templates/menu.html"
    })
    .when("/channel", {
        templateUrl : "templates/channel.html"
    })
    .when("/chat", {
        templateUrl : "templates/chat.html"
    });
    $locationProvider.html5Mode({
       enabled: true,
       requireBase: false
    });
});
app.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
    .state('index', {
        url: "/",
        templateUrl: "templates/menu.html"
    })
    .state('dashboard', {
        url: "/dashboard",
        templateUrl: "templates/dashboard.html"
    })
    .state('login', {
        url: "/login",
        templateUrl: "templates/login.html"
    })
    .state('signup', {
        url: "/signup",
        templateUrl: "templates/signup.html"
    })
    .state('chat', {
        url: "/chat",
        templateUrl: "templates/chat.html"
    })
    .state('channel', {
        url: "/channel",
        templateUrl: "templates/channel.html"
    });
});


/*
app.service('messages').update(1, {
text: 'A patched message'
})
.then(message => console.log(message));
const params = {
query: { read: false }
};
// Mark all unread messages as read
app.service('messages').patch(null, {
read: true
}, params);
PATCH /messages/1
{ "text": "A patched message" }
*/
