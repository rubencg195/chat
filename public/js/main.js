'use strict';
var domain = "http://localhost:3030/";
var img = "http://images.clipartpanda.com/chat-clipart-dT7eGEonc.png";
var app = angular.module('Chat', ['webcam','naif.base64', 'ngRoute', 'ngResource','ui.router', 'ui.materialize', 'ngStorage'])
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
	}
    $scope.init =  function init(){
		
		$scope.user = $localStorage.user;
        $scope.client = $localStorage.client;
        $scope.server = $localStorage.server;

		if( $localStorage.user && $localStorage.client && $localStorage.server){
			$scope.getRooms();
			$scope.getContacts();
		}
		
		$scope.contacts.push({name : "Rene", email: "asdsa@asdd.com", number:"545345", avatar:""});
		$scope.contacts.push({name : "Carlos", email: "asdsa@asdd.com", number:"545345", avatar:""});

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
		$scope.client.service('messages').on('created', $scope.addMessage);
		// We will also see when new users get created in real-time
		$scope.client.service('users').on('created', $scope.addUser);

	};
	$scope.cleanTmpData = function(){
		$scope.chatUsers = [];
		$scope.inChatMsgs = [];
	};
	$scope.updateUsers = function (){

	};
	$scope.updateChats = function (){

	};
	$scope.updateContacts = function (){

	};
	$scope.createEmoji = function (){

	};
	$scope.settings = function (){

	};
	$scope.addUser = function(user){
		$scope.chatUsers.push(user);
	};
	$scope.deleteUser = function(user){
		$scope.chatUsers.pop(user);
	};
	$scope.addMessage = function(msg){
		const sender = message.user || {};
		$scope.chatUsers.push(msg);
	};
	$scope.deleteMessage = function(msg){
		$scope.chatUsers.pop(msg);
	};
	$scope.sendMessage = function(){
		const input = $('[name="text"]');
	    $scope.client.service('messages').create({
	      text: input.val()
	    }).then(() => input.val(''));
	};
	$scope.getRooms = function(){
	    $scope.client.service('rooms').find(/* {
	      text: input.val()
	    }*/).then(function(result){
	    		console.log(result.data);
	    		$scope.rooms = result.data;
	    });
	};
	$scope.createRooms = function(room){
	    $scope.client.service('rooms').create({
			owner: room.owner,
			img: _img,
			owner: room.participants,
			participants:[],
			private: false
	    }).then(function(result){
	    	console.log(result.data);
	    });
	};
	$scope.getContacts = function(){
	    $scope.client.service('contacts').find(/* {
	      text: input.val()
	    }*/).then(function(result){
	    	console.log(result.data);
	    });
	};
	$scope.createContacts = function(){
	    $scope.client.service('contacts').create({
			owner: "",
			contact: ""
	    }).then(function(result){
	    	console.log(result.data);
	    });
	};
	$scope.getInvitations = function(){
	    $scope.client.service('invitations').find(/* {
	      text: input.val()
	    }*/).then(function(result){
	    	console.log(result.data);
	    });
	};
	$scope.createInvitations = function(){
	    $scope.client.service('invitations').create({
			emailTo: "",
			emailFrom: "",
			roomId: ""
	    }).then(function(result){
	    	console.log(result.data);
	    });
	};
	$scope.findUserById = function(){

	}
	$scope.findUsersByEmail = function(email, redirect, location){
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
            		if(redirect)
            			location();
            	}
            });
          })
          .catch(function(error){
            console.log("NO PASO ");
            console.log(error);
            $scope.error = error;
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
            $scope.findUsersByEmail(credentials.email, true, $scope.showDashboard );
          })
          .catch(function(error){
            $scope.error = "Error Login Up "+ credentials;
            console.log("NO PASO ");
            console.log(error);
            $scope.error = error;
            $scope.showLogin();
          });
	};
	$scope.signup = function(credentials){
		console.log("Sign up");
	    $scope.client.service('users').create(credentials)
	      .then(function(result) {
      		console.log("PASO ");
      		console.log(result);
            $scope.login(credentials);
          })
          .catch(function(error){
            $scope.error = "Error Signin Up";
            console.log(error);
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
          password:  $scope.formPassword
        };
        return tmpUser;
	};
	$scope.joinRoom = function(roomId){
		// const user = app.get('user');
        return app.service('users').patch($scope.user.id, { rooms: $scope.user.rooms.concat(roomId) });
	};
	$scope.print = function(value){
		console.log($scope.result);
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

