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