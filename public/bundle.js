(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function($scope, Server){
      // Add a new user to the list
      client = $scope.client,
      server = $scope.server,
      application = {},
      addUser = function(user) {
        // Add the user to the list
        $('.user-list').append(`<li>
          <a class="block relative" href="#">
            <img src="${user.avatar}" alt="" class="avatar">
            <span class="absolute username">${user.email}</span>
          </a>
        </li>`);
        // Update the number of users
        $('.online-count').html($('.user-list li').length);
      },
      // Renders a new message and finds the user that belongs to the message
      addMessage = function(message) {
        // Find the user belonging to this message or use the anonymous user if not found
        const sender = message.user || {};
        const chat = $('.chat');

        chat.append(`<div class="message flex flex-row">
          <img src="${sender.avatar}" alt="${sender.email}" class="avatar">
          <div class="message-wrapper">
            <p class="message-header">
              <span class="username font-600">${sender.email}</span>
              <span class="sent-date font-300">${moment(message.createdAt).format('MMM Do, hh:mm:ss')}</span>
            </p>
            <p class="message-content font-300">${message.text}</p>
          </div>
        </div>`);
        chat.scrollTop(chat[0].scrollHeight - chat[0].clientHeight);
      },
      // Log in either using the given email/password or the token from storage
      login = function(credentials) {
        const payload = credentials ? Object.assign({ strategy: 'local' }, credentials) : {};
        return client.authenticate(payload)
          .then(function() {
            console.log("User: "+credentials);
            user = credentials;
            showDashboard();
          })
          .catch(function(){
            console.log("Error Signin Up "+credentials);
            showLogin();
          });
      },
      // Show the login page
      showLogin = function(error = {}) {
        if($('.login').length) {
          $('.heading').append(`<p>There was an error: ${error.message}</p>`);
        } else {
          window.location.replace("http://localhost:3030/login");
        }
      },
      showDashboard = function(){
        window.location.replace("http://localhost:3030/dashboard");
      },
      // Shows the chat page
      showChat = function() {
        // similar behavior as an HTTP redirect
        window.location.replace("http://localhost:3030/chat");
        // $('#app').html(chatHTML);

        // // Find the latest 10 messages. They will come with the newest first
        // // which is why we have to reverse before adding them
        // client.service('messages').find({
        //   query: {
        //     $sort: { createdAt: -1 },
        //     $limit: 25
        //   }
        // }).then(page => {
        //   page.data.reverse().forEach(addMessage);
        // });

        // // Find all users
        // client.service('users').find().then(page => {
        //   const users = page.data;

        //   // Add every user to the list
        //   users.forEach(addUser.bind(application));
        // });
      },
      // Retrieve email/password object from the login/signup page
      getCredentials = function() {
        const user = {
          email: $('[name="email"]').val(),
          password: $('[name="password"]').val()
        };
        return user;
      },
      joinRoom = function(roomId) {
        const user = app.get('user');

        return app.service('users').patch(user.id, { rooms: user.rooms.concat(roomId) });
      }
}



},{}],2:[function(require,module,exports){
'use strict';

var app = angular.module('Chat', ['webcam','naif.base64', 'ngRoute', 'ngResource','ui.router', 'ui.materialize']);

app.directive("mainNav", function() {
    return {
        templateUrl: "templates/mainNav.html"
    };
})
.directive("mainSliderMenu", function() {
    return {
        templateUrl : "templates/mainSliderMenu.html"
    };
})
.directive("colorLoader", function() {
	return {
        templateUrl : "templates/colorLoader.html"
    };
})
.directive("chats", function() {
    return {
        templateUrl : "templates/chats.html"
    };
})
.directive("contacts", function() {
    return {
        templateUrl : "templates/contacts.html"
    };
})
.directive("gif", function() {
    return {
        templateUrl : "templates/gif.html"
    };
})
.directive("settings", function() {
    return {
        templateUrl : "templates/settings.html"
    };
})
.directive("chat", function() {
    return {
        templateUrl : "templates/chat.html"
    };
})
.directive("channel", function() {
    return {
        templateUrl : "templates/channel.html"
    };
})
.directive("dashboard", function() {
    return {
        templateUrl : "templates/channel.html"
    };
});
},{}],3:[function(require,module,exports){
'use strict';
var server = require('./server');
var directives = require('./directives');
var views = require('./views');
var routes = require('./routes');
var application = require('./appModule');
var mainCtrl = require('./mainCtrl');

var app = angular.module('Chat', ['webcam','naif.base64', 'ngRoute', 'ngResource','ui.router', 'ui.materialize']);
app.controller('mainCtrl', mainCtrl );
app.config(routes);
app.config(views);
app.factory('Server', server);
app.factory('Main', application);


},{"./appModule":1,"./directives":2,"./mainCtrl":4,"./routes":5,"./server":6,"./views":7}],4:[function(require,module,exports){
'use strict';

module.exports = function mainCtrl($scope, $route, $routeParams , $location) {
    $scope.User = "Ruben";
    $scope.OpenChat = function(msg){
    	console.log(msg);
    }
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
    $scope.user = {
    	name : "",
    	email: "",
    	number:"",
    	avatar:""
    };
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
    $scope.contacts = []
    $scope.currentUser = {};
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

    $scope.init =  function init($scope){
		$scope.currentUser  = {name : "Ruben", email: "asdsa@asdd.com", number:"545345", avatar:""};
		$scope.contacts.push({name : "Rene", email: "asdsa@asdd.com", number:"545345", avatar:""});
		$scope.contacts.push({name : "Carlos", email: "asdsa@asdd.com", number:"545345", avatar:""});
	}
	$scope.updateUsers = function (){

	}
	$scope.updateChats = function (){

	}
	$scope.updateContacts = function (){

	}
	$scope.createEmoji = function (){

	}
	$scope.settings = function (){}

	$scope.init($scope);








} 
},{}],5:[function(require,module,exports){
'use strict';

module.exports =  function ($routeProvider, $locationProvider) {
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
};

},{}],6:[function(require,module,exports){
'use strict';

module.exports = function($scope, Main){
	


	// Establish a Socket.io connection
	$scope.socket = io();
	// Initialize our Feathers client application through Socket.io
	// with hooks and authentication.
	$scope.client = feathers();
	$scope.application = application;

	$scope.client.configure(feathers.socketio($scope.socket));
	$scope.client.configure(feathers.hooks());
	// Use localStorage to store our login token
	client.configure(feathers.authentication({
	  storage: window.localStorage
	}));

	// Listen to created events and add the new message in real-time
	client.service('messages').on('created', application.addMessage);
	// We will also see when new users get created in real-time
	client.service('users').on('created', application.addUser);

	// Set up event listeners
	$(document)
	  .on('click', '#signup', () => {
	    console.log('Click');
	    const user = application.getCredentials();

	    client.service('users').create(user)
	      .then(() => application.login(user));
	  })
	  .on('click', '#login', () => {
	    console.log('Click');
	    const user = application.getCredentials();

	    application.login(user);
	  })
	  .on('click', '#logout', () => {
	    client.logout().then(() => $('#app').html(loginHTML));
	  })
	  .on('submit', '#send-message', ev => {
	    // This is the message text input field
	    const input = $('[name="text"]');

	    // Create a new message and then clear the input field
	    client.service('messages').create({
	      text: input.val()
	    }).then(() => input.val(''));

	    ev.preventDefault();
	  });
    //buttonapplication.login();

};
},{}],7:[function(require,module,exports){
'use strict';

module.exports = function($stateProvider, $urlRouterProvider) {
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
        })
};
},{}]},{},[3]);
