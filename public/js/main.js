'use strict';
var domain = "http://localhost:3030/";
var img = "http://images.clipartpanda.com/chat-clipart-dT7eGEonc.png";
var app = angular.module('Chat', [/*'webcam',*/'naif.base64', 'ngRoute', 'ngResource','ui.router', 'ui.materialize', 'ngStorage', 'ngSanitize'])
app.controller('mainCtrl', function($scope, $route, $routeParams , $location, $localStorage, $timeout,$sce){
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
	$scope.chatMsgs = [];
	$scope.Channels = [];
	$scope.Rooms = [];
	$scope.onError = function (err) {};
	$scope.onStream = function (stream) {};
	$scope.onSuccess = function () {};
	$scope.take_snapshot = function(){
			Webcam.snap( function(data_uri) {
					$scope.cameraURI = data_uri;
					document.getElementById('my_result').innerHTML = '<img src="'+data_uri+'"/>';
			} );
	};
	$scope.previewFile = function( imgTag, btnTag ){
			$scope.imgUpload =  null;
			let pStr = "img#"+imgTag;
			let fStr = "input#"+btnTag; 
			var preview = $( pStr )[ 0 ];
			var file    = $( fStr )[ 0 ].files[0];
			var reader  = new FileReader();
			preview.src = "./assets/loading.gif";
			
			reader.addEventListener("load", function () {
				let tmp = new Image();
				tmp.src = reader.result;

				console.log("File Size "+ file.size/1024 + " W: "+tmp.width+" H: "+tmp.height );
				// console.log(tmp);

				if( (file.size/1024) < 50  ){
					preview.src = reader.result;
					$scope.imgUpload =  reader.result;
					$scope.disabletUpload = false;
					$scope.$apply();
				}else{
					preview.src = "https://us.123rf.com/450wm/roxanabalint/roxanabalint1702/roxanabalint170200113/71064094-no-es-v-lido-grunge-sello-de-goma-en-el-fondo-blanco-ilustraci-n-vectorial.jpg?ver=6";
					console.log("Dimensiones no Validas");
				}
				
				
			}, false);
			if (file) {
				reader.readAsDataURL(file);
			}
			console.log(reader);
	};
	$scope.createGif = function(_frase, _from){
		let _img = $scope.imgUpload;
		if(_img != null && _frase != null && _from != null){
			$scope.client.service('gifs').create({
						frase: _frase,
						from: _from,
						img: _img
		    }).then(function(result){
				var preview = $( "img#imgUpload" )[ 0 ];
				preview.src = 'https://s-media-cache-ak0.pinimg.com/736x/f8/3e/13/f83e13fc005394433a6a76a793f11042.jpg';
				$scope.gifFrase = '';
				$('input#inp').val('');
		    	$scope.$apply();
		    });
		}else{
			console.log("GIf No correcto");
		}
	    
	};
	$scope.uploadGif = function(){
		if (this.files && this.files[0]) {
		    var FR = new FileReader();
		    FR.addEventListener("load", function(e) {
		      document.getElementById("img").src       = e.target.result;
		      document.getElementById("b64").innerHTML = e.target.result;
		    });
		    FR.readAsDataURL( this.files[0] );
		}
	};
	$scope.previewGifSelection = function(Selection){
		if($scope.gifSelection == null)
			$scope.gifSelection = '';
		$scope.gifSelection = $scope.gifSelection +"("+ Selection + ') ';
		console.log($scope.gifSelection);
	};
	$scope.addGifToChat = function(){
		if($scope.currentMsg == null)
			$scope.currentMsg = '';
		if($scope.gifSelection == null)
			$scope.gifSelection = '';
		// $scope.currentMsg = $scope.currentMsg + $scope.gifSelection + ' ';
		$('input#currentMsg').val( $('input#currentMsg').val() + $scope.gifSelection + ' ' );
		$scope.gifSelection = '';
		console.log($scope.currentMsg);
	};
	$scope.processImg = function(val, _pID){
		// console.log('INIT Process');
		if(val != null){
			let cont = 0;
			let tmpVal = val;
			let outVal = '';

			//CHECK FOR UNDERLINE
			while( tmpVal.indexOf('~') != -1 &&  cont < 500){
				let fX = tmpVal.indexOf('~');
				if(fX != -1){
					tmpVal = tmpVal.slice(0,fX) + tmpVal.slice(fX+1);
					let sX = tmpVal.indexOf('~');
					if(sX != -1 ){
						let subStr = tmpVal.slice(fX, sX);
						outVal += tmpVal.slice(0, fX ) +"<del>"+subStr+"</del>";
						tmpVal = tmpVal.slice(sX+1);
					}
				}
				cont++;
			}
			outVal += tmpVal;
			tmpVal = outVal;
			outVal = '';
			cont = 0;

			//CHECK FOR ITALIC
			while( tmpVal.indexOf('_') != -1 &&  cont < 500){
				let fX = tmpVal.indexOf('_');
				if(fX != -1){
					tmpVal = tmpVal.slice(0,fX) + tmpVal.slice(fX+1);
					let sX = tmpVal.indexOf('_');
					if(sX != -1 ){
						let subStr = tmpVal.slice(fX, sX);
						outVal += tmpVal.slice(0, fX ) +"<i>"+subStr+"</i>";
						tmpVal = tmpVal.slice(sX+1);
					}
				}
				cont++;
			}
			outVal += tmpVal;
			tmpVal = outVal;
			outVal = '';
			cont = 0;

			//CHECK FOR BOLD
			while( tmpVal.indexOf('*') != -1 &&  cont < 500){
				let fX = tmpVal.indexOf('*');
				if(fX != -1){
					tmpVal = tmpVal.slice(0,fX) + tmpVal.slice(fX+1);
					let sX = tmpVal.indexOf('*');
					if(sX != -1 ){
						let subStr = tmpVal.slice(fX, sX);
						outVal += tmpVal.slice(0, fX ) +"<b>"+subStr+"</b>";
						tmpVal = tmpVal.slice(sX+1);
					}
				}
				cont++;
			}
			outVal += tmpVal;
			tmpVal = outVal;
			outVal = '';
			cont = 0;

			//CHECK FOR IMAGES
			while( tmpVal.indexOf('(') != -1 &&  cont < 500){
				let fX = tmpVal.indexOf('(');
				let sX = tmpVal.indexOf(')');

				if(fX != -1){
					if(sX == -1 ){
						tmpVal = tmpVal.slice(fX+1);
					}else{
						let subStr = tmpVal.slice(fX+1, sX);
						$scope.Gifs.forEach(function(_gif){
							if(_gif.frase == subStr && tmpVal.trim() != ''){

								outVal += tmpVal.slice(0, fX ) +"<img src='"+_gif.img+"' height='50' >";
								tmpVal = tmpVal.slice(sX+1);
								
							}
						});
					}
				}
				cont++;
			}
			outVal += tmpVal;


			return outVal;
		} 
	};
	$scope.previewChatImg = function(){
		var img = $( "img#imgUploadChat" )[ 0 ];
		var file    = $( "input#file" )[ 0 ].files[0];
		var reader  = new FileReader();
		img.src = "./assets/loading.gif";
		$scope.imageReady = false;

		reader.addEventListener("load", function () {
			img.src = reader.result;
			$scope.imgUpload =  reader.result;
			$scope.disabletUpload = false;

			img.src = reader.result;
			img.onload = function() {
		        var MAX_WIDTH = 25;
		        var MAX_HEIGHT = 25;
		        var tempW = img.width;
		        var tempH = img.height;
		        if (tempW > tempH) {
		            if (tempW > MAX_WIDTH) {
		               tempH *= MAX_WIDTH / tempW;
		               tempW = MAX_WIDTH;
		            }
		        } else {
		            if (tempH > MAX_HEIGHT) {
		               tempW *= MAX_HEIGHT / tempH;
		               tempH = MAX_HEIGHT;
		            }
		        }
		 
		        var canvas = $( "canvas#canvas" )[ 0 ] ;
		        canvas.width = tempW;
		        canvas.height = tempH;
		        var ctx = canvas.getContext("2d");
		        ctx.drawImage(this, 0, 0, tempW, tempH);
		        var dataURL = canvas.toDataURL("image/jpeg");
		 		console.log($( "canvas#canvas" )[ 0 ] );
		 		$scope.imageReady = true;
		 		$scope.imageUri = reader.result;
		 		$scope.$apply();
	        }
		}, false);
		if (file) {
			reader.readAsDataURL(file);
		}
		console.log(reader);
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
		$scope.currentRoom = $localStorage.currentRoom;
		


		if( $localStorage.user && $localStorage.client ){
			$scope.getRooms();
			$scope.getContacts();
			$scope.profileUsername = $scope.user.username;
			$scope.profileName = $scope.user.name;
			$scope.profileEmail = $scope.user.email;

			$scope.client.service('notifications').on('created', function(_notice){
				if(_notice.data){
					if($scope.Notifications == null)
						$scope.Notifications = [];
					_notice.data.forEach(function(_notice){
						$scope.Notifications.push(_notice);
					});
				}
			});
			$scope.client.service('notifications').find({
				query:{
					from : $scope.user._id
				}
			}, function(_notice){
				if(_notice.data){
					_notice.data.forEach(function(){
						
					});
				}
			});
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

		$.contextMenu({
			    // define which elements trigger this menu
		    selector: ".click-menu",
		    // define the elements of the menu
		    items: {
		        friend: {name: "Agregar como amigo", callback: function(key, opt){ 
		        	console.log("agregar amigo!"); 
		        	$timeout(function () {
						console.log($scope.contextUsrSelected);
					}, 100);		        	
		        }},
		        private: {name: "Iniciar chat privado", callback: function(key, opt){ 
		        	console.log("privado!");
		        	console.log($scope.contextUsrSelected);
		        }},
		        info: {name: "Ver información del perfil", callback: function(key, opt){ 
		        	console.log("perfil!"); 
		        	console.log($scope.contextUsrSelected);
		        }}
		    }
		    // there's more, have a look at the demos and docs...
		});

		
		// We will also see when new users get created in real-time
		// $scope.client.service('users').on('created', $scope.updateUsers );
		console.log("INIT");
		// console.log($scope);
		// console.log($scope.client);
	};
	$scope.initChat = function(){
		console.log("INIT CHAT");
		// console.log($scope.currentRoom);
		if($scope.currentRoom != null && $localStorage.user && $scope.client ){
			$scope.getRooms();
			$scope.getContacts();
			$scope.inChatMsgs = [];
			$scope.client.service("messages").find().then(_messages=>{
				_messages.data.forEach(function(_message) {
					if(_message.room == $scope.currentRoom._id){
							$scope.inChatMsgs.push(_message);
							// console.log($scope.inChatMsgs);
					}
				});
			});
			$scope.client.service("gifs").find().then(Gifs=>{
				if($scope.Gifs == null)
					$scope.Gifs = [];
				Gifs.data.forEach(function(_gif) {
					$scope.Gifs.push(_gif);
				});
				// console.log($scope.processImg(' Hola como estas (mad) jaja (alone) asdasd (pensando) '))
			});
			// Listen to created events and add the new message in real-time
			$scope.client.service('messages').on('created', function(msgData){
					if($scope.currentRoom != null){
						if($scope.inChatMsgs == null){
							$scope.inChatMsgs = [];
						}
						if(msgData.room == $scope.currentRoom._id){
							if( $scope.inChatMsgs.indexOf(msgData) == -1 ){
								$scope.inChatMsgs.push(msgData);
							}else {
								console.log("Mensaje ya exite");
							}
						}else{
							console.log("Mensaje no pertenece a este room");
						}
					}
					$scope.$apply();
			});
		}else{
			console.log($scope.currentRoom);
			console.log( $localStorage.user );
			console.log($localStorage.client);
			console.log("FAILED TO INIT CHAT");
		}
	};

	$scope.cleanTmpData = function(){
		$scope.chatUsers = [];


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
		if(_img == null)
			_img = "https://ssl.gstatic.com/images/branding/product/1x/avatar_circle_blue_512dp.png";
		if(_username != null && _name != null && _email != null && _img != null ){
			$scope.client.service('users').patch($scope.user._id, {
					username: _username,
					name: _name,
					email: _email,
					img: _img
			})
			.then(function(result){
						console.log(result);
						$scope.user = result;
						$localStorage.user = result;
						$scope.$apply();
			});
		}else{
			console.log("Informacion Incorrecta Perfil");
		}
		
	};
	$scope.setLoggedUser = function( _id , _isLogged ) {
				$scope.client.service('users').patch( _id, {
						logged: _isLogged
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
	$scope.sendMessage = function(_msg, _img){
			$scope.imageReady = false;
			// $scope.currentRoom = $localStorage.currentRoom;
			if($scope.currentRoom == null || $scope.user._id == null || _msg == null || _msg.trim() == ''){
				// console.log($scope.currentRoom);
				// console.log($scope.user);
				// console.log(_msg);
				console.log("INFORMATION NOT VALID");
			}else{
				let roomId = $scope.currentRoom._id;
				let fromId = $scope.user;
				$scope.client.service('messages').create({
						room: roomId,
						from: fromId,
			      		text: _msg,
			      		img: _img
			    }).then(result=>{
			    		$("input#currentMsg").val("");
			    		$scope.currentMsg = '';
			    		// console.log($scope);
						// console.log(result);
						// console.log($scope.currentRoom);
						// console.log($scope.user);
						// console.log(_msg);

				});
			}
	};

	$scope.$watch('currentMsg', function(newValue, oldValue){
	    if(newValue){

	    }
	}, true);

	$scope.watchMsgNotice = function(_msg){

	};

	$scope.updateMessage = function(){
		$scope.client.service('messages').find({
			query: {
				room: $scope.currentRoom
			}
		}).then(function(result){
			  $scope.chatMsgs = result.data;
				console.log(result);
		});
	};
	$scope.getRooms = function(){
		$scope.Rooms = [];
		$scope.Channels = [];
		$scope.client.service('users').get($scope.user._id).then(function(result){
			$scope.user = result;
			$localStorage.user = result;
			if($scope.user.rooms == null){
				$scope.user.rooms = [];
			}
			$scope.user.rooms.forEach(function(_roomId){
					$scope.client.service('rooms').get(_roomId).then(function(room_result){
						if(room_result.private != null){
							if(room_result.private == true){
								$scope.Rooms.push(room_result);
							}else{
								$scope.Channels.push(room_result);
							}
						}
						$scope.$apply();
					}).catch(error=>{
						console.log("Room "+_roomId+" no se hallo "+error);
						$scope.deleteRoomToUser( $scope.user._id,  _roomId  );
					});
			});
	 });
	};
	$scope.checkRoomExistByParticipant = function(_userId){
		// Return a new promise.
		return new Promise(function(resolve, reject) {
		      // so check the status

		      if (true) {
		        // Resolve the promise with the response text
		        resolve(true);
		      }
		      else {
		        // Otherwise reject with the status text
		        // which will hopefully be a meaningful error
		        reject(false);
		      }
		});
	};
	$scope.createRooms = function( _private, _name){
		let participants = []
		let selectedContacts = [];
		$scope.Contacts.forEach(function(_cData){
			if(_cData.selected){
				participants.push({id: _cData.contact._id});
				selectedContacts.push(_cData.contact);
			}
		});
		if(participants.length < 1){
			$scope.Contacts.forEach(function(element){  element.selected = false;  });
			$scope.error = "No Contacts Selected";
		}else{
			let valid = true;
			if(_private){
				_name = selectedContacts[0].name;
				$scope.Rooms.forEach(function(_room){
					console.log(_room.name + " - "+ _name);
					if(_room.name == _name){
						console.log('Room Ya Existe, Use otro nombre o eliga otro Usuario');
						valid = false;
					}
				});
			}else{
				$scope.Channels.forEach(function(_room){
					console.log(_room.name + " - "+ _name);
					if(_room.name == _name){
						console.log('Room Ya Existe, Use otro nombre o eliga otro Usuario');
						valid = false;
					}
				});
			}
			if(valid){
				participants.push({id: $scope.user._id});
				$scope.client.service('rooms').create({
					owner: $scope.user._id,
					img: img,
					private: _private,
					name : _name
			    }).then(function(result){
						participants.forEach(function(_pa){
							$scope.addRoomToUser( _pa.id  , result._id );
						});
			    	$scope.Contacts.forEach(function(element){ element.selected = false; });
			    	$scope.selectedRoomName = '';
			    });
			}
		}
		$timeout(function () {
			$scope.getRooms();
		}, 250);
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
						$scope.client.service('users').patch( _userId, {
								rooms: participantData.rooms
						})
						.then(function(result){
									if(result._id == $scope.user._id){
										$scope.user = result;
										$localStorage.user = result;
									}
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
							return;
						}
						participantData.rooms.splice(participantData.rooms.indexOf(_RoomId),1);
						console.log("Borrando Room a User "+participantData.name);
						$scope.client.service('users').patch( _userId, {
								rooms: participantData.rooms
						})
						.then(function(result){
									if(result._id == $scope.user._id){
										$scope.user = result;
										$localStorage.user = result;
									}
									$scope.$apply();
						});
				});
				$timeout(function () {
					$scope.getRooms();
				}, 250);
	};
	$scope.openChatByRoom = function(roomId) {
			$scope.client.service('rooms').get(roomId).then(roomResult => {
					$scope.currentRoom = roomResult;
					$scope.client.service('users').find().then(result =>{
							if(result.data != null){
								$scope.currentRoom.participants = [];
								result.data.forEach(function(_user){
									if(_user.rooms != null && _user.rooms.indexOf($scope.currentRoom._id) != -1  )
										$scope.currentRoom.participants.push(_user);
								});
								console.log($scope.currentRoom);
								$localStorage.currentRoom = $scope.currentRoom;
								$scope.showChat();
							}
					});
			}).catch(error => {
				console.log("Room No Existe");
			});
	};
	$scope.openChatByContact = function(_user){
		let alreadyInChat = false;
		if(_user.rooms != null){
			_user.rooms.forEach(function(_roomId){
				for (var i = 0; i < $scope.Rooms.length; i++) {
					if($scope.Rooms[i]._id == _roomId){
						console.log("Found Match "+roomId);
					}
				}
			});
		}else{

		}
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
		  rooms: [],
		  img: "https://ssl.gstatic.com/images/branding/product/1x/avatar_circle_blue_512dp.png"
        };
        $scope.$apply();
        return tmpUser;
	};
	$scope.print = function(value){
		console.log(value);
	};
	$scope.islogin = function(){
		if($localStorage.user == null){
			$scope.showSignup();
		}
	};
	$scope.letItLog = function(){
		if($localStorage.user != null){
			$scope.showDashboard();
		}
	};
	
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
app.directive('ngRightClick', function($parse) {
    return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {$event:event});
            });
        });
    };
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
