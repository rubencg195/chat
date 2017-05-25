function mainCtrl($scope) {
    
    $scope.user = {
    	name : "",
    	email: "",
    	number:"",
    	avatar:""
    }
    $scope.contacts = []
    $scope.currentUser = {};
	$scope.inChatMsgs = [{name: "Ruben", data: "Hola",img: "", date: "12/12/17", read: false, visible: true},{name: "Carlos", data: "Cuando se arma la potra",img: "", date: "13/12/17", read: false, visible: true}];
	$scope.msg = {
		name: "",
		data: "",
		img: "",
		date: "",
		read: false,
		visible: true
	}
	$scope.newGIF =   {
	    filesize : 54836, /* bytes */
	    filetype: "image/jpeg",
	    filename : "profile.jpg",
	    base64 :   "/9j/4AAQSkZJRgABAgAAAQABAAD//gAEKgD/4gIctcwIQA"
    };
	$scope.onError = function (err) {};
	$scope.onStream = function (stream) {};
	$scope.onSuccess = function () {};
	$scope.myChannel = {
    // the fields below are all optional
	    videoHeight: 200,
	    videoWidth: 200,
	    video: null // Will reference the video element on success
	};
	init($scope);
}

function init($scope){
	$scope.currentUser  = {name : "Ruben", email: "asdsa@asdd.com", number:"545345", avatar:""};
	$scope.contacts.push({name : "Rene", email: "asdsa@asdd.com", number:"545345", avatar:""});
	$scope.contacts.push({name : "Carlos", email: "asdsa@asdd.com", number:"545345", avatar:""});
}
function updateUsers(){}
function updateChats(){}
function updateContacts(){}
function createEmoji(){}
function settings(){}

var app = angular.module('Chat', ['webcam','naif.base64'])
	.controller('mainCtrl', ['$scope', mainCtrl] );



