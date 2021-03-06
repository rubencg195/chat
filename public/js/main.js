'use strict';
// var domain = "http://localhost:3030/";
var domain = "http://192.168.1.139:3030/";
var img = "http://images.clipartpanda.com/chat-clipart-dT7eGEonc.png";
var app = angular.module('Chat', [/*'webcam',*/'naif.base64', 'ngRoute', 'ngResource','ui.router', 'ui.materialize', 'ngStorage', 'ngSanitize'])
app.controller('mainCtrl', function($scope, $route, $routeParams , $location, $localStorage, $timeout,$sce, $stateParams){
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

				if( (file.size/1024) < 100  ){
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

	$scope.checkNotifications = function(){

	}

	$scope.processText = function(val){
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
		$scope.error = $localStorage.error;

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


		if( $localStorage.user &&  $scope.client){
			$scope.getRooms();
			$scope.getContacts();
			$scope.getInvitations();
			$scope.profileUsername = $scope.user.username;
			$scope.profileName = $scope.user.name;
			$scope.profileEmail = $scope.user.email;

			
			$scope.client.service('users').on('created', function(_notice){
				$scope.getAllUsers();
			});

			$scope.client.service('invitations').on('created', function(_invitation){
				if(_invitation.owner == $scope.user._id){
					$scope.getRooms();
					$scope.getContacts();
					$scope.getInvitations();
				}
			});

			$scope.client.service('notifications').on('created', function(_notice){
				console.log(_notice);
				if(_notice && _notice.data){
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
				console.log(_notice);
				if(_notice && _notice.data){
					_notice.data.forEach(function(){
						
					});
				}
			});

			$scope.client.service('users').on('patched', _user => {
				if(_user._id == $scope.user._id){
					console.log('My User patched', _user);
					$scope.getRooms();
					$scope.getContacts();
				}
			});
		}
		

		$.contextMenu({
			    // define which elements trigger this menu
		    selector: ".click-menu",
		    // define the elements of the menu
		    items: {
		        friend: {name: "Agregar como amigo", callback: function(key, opt){ 
		        	console.log("agregar amigo!"); 
					if($scope.contextUsrSelected){
						$scope.createContact($scope.contextUsrSelected.email);
					}
							        	
		        }},
		        private: {name: "Iniciar chat privado", callback: function(key, opt){ 
		        	console.log("privado!");
		        	if($scope.contextUsrSelected){
						$scope.Contacts.forEach(function(_contact, i){
							$scope.Contacts[i].selected = false;
						});
						$scope.Contacts.forEach(function(_cData, i){
							if(_cData.contact == $scope.contextUsrSelected._id){
								$scope.Contacts[i].selected = true;
							}
						});
						$scope.createRooms( true, "");
					}
		        }},
		        info: {name: "Ver información del perfil", callback: function(key, opt){ 
		        	console.log("perfil!"); 
		        	console.log($scope.contextUsrSelected);
		        	 $('#profileModal').modal('open');
		        }},
		        deleteFromChat: {name: "Borrar del Chat", callback: function(key, opt){ 
		        	console.log("Delete From Chat! ",$scope.currentRoom ); 
		        	console.log($scope.contextUsrSelected);
		        	$scope.deleteRoomToUser( $scope.contextUsrSelected._id, $scope.currentRoom._id );
		        	$scope.openChatByRoom($scope.currentRoom._id);
		        }}
		    }
		    // there's more, have a look at the demos and docs...
		});

		
		// We will also see when new users get created in real-time
		// $scope.client.service('users').on('created', $scope.updateUsers );
		console.log("INIT");
		// console.log($scope);
		// console.log($scope.client);
		$scope.showChatFlag = false;
	};

	$scope.contactsNotInChat = function(){
		$scope.contactsNotInChatList = [];
		$scope.getContacts();

		$timeout(function(){
			$scope.Contacts.forEach( function( _contact ){
				let _user = _contact.contact;
				if(  _user._id != $scope.user._id ){
					$scope.contactsNotInChatList.push(_user);
				}
			});
		}, 500);
	}

	$scope.selectNextContact2 = function(cData){
		$scope.contactsNotInChatList = [];
		$scope.contactsNotInChatList.push(cData);
		if(cData.selected == false){
			$scope.contactsNotInChat();
		}
	};

	$scope.initChat = function(){
		console.log("INIT CHAT");
		$scope.showChatFlag = true;
		// console.log($scope.currentRoom);
		if($scope.currentRoom != null && $localStorage.user && $scope.client ){
			$scope.getRooms();
			$scope.getContacts();
			$scope.inChatMsgs = [];
			$scope.contactsNotInChat();
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
			// console.log($scope.currentRoom);
			$scope.client.service('rooms').get($scope.currentRoom._id).then(roomResult => {
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
						}
				});
			}).catch(error => {
				console.log("Room No Existe");
			});
			$scope.updateCurrentChat();
		}else{
			console.log($scope.currentRoom);
			console.log( $localStorage.user );
			console.log($localStorage.client);
			console.log("FAILED TO INIT CHAT");
		}		
	};
	$scope.cancelChatUpdate = function(){
		$timeout.cancel($scope.timer);
		$scope.showChatFlag = false;
	};
	$scope.updateCurrentChat = function(){
		console.log('Updating Chat '+$scope.showChatFlag);
		$scope.timer = $timeout(function(){
			if($scope.showChatFlag){
				$scope.updateChatParticipants();
				// $scope.contactsNotInChat();
				$scope.updateCurrentChat();
			}
		}, 2000);
		
	};
	$scope.updateChatParticipants = function(){
		if($scope.currentRoom && $scope.currentRoom.participants){
			$scope.currentRoom.participants.forEach(function(_participant, i){
				$scope.client.service('users').get(_participant._id).then(function(result){
					if(result._id){
						$scope.currentRoom.participants[i] = result;
						// console.log('Updating Participant ', $scope.currentRoom.participants[i]);
						$scope.$apply();
					}
				});
			});
			$scope.inChatMsgs.forEach(function(_chatMsg, i){
				$scope.client.service('users').get(_chatMsg.from._id).then(function(result){
					if(result._id){
						$scope.inChatMsgs[i].from = result;
						// console.log('Updating Msg User ', $scope.inChatMsgs[i].from);
						$scope.$apply();
					}
				});
			});
		}
	};

	$scope.setContextUsr = function(_usr){
		$scope.contextUsrSelected = _usr;
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
	$scope.activateAccount = function(credentials){
		console.log("ID "+$stateParams.id+" Name "+$stateParams.name+" Email "+$stateParams.email);
		$scope.tmpName = $stateParams.name;
		if($stateParams.id  && $stateParams.name && $stateParams.email && credentials){
			credentials.name = $scope.tmpName;
			console.log("Login");
			// var credentials = $scope.getCredentials();
		    const payload = credentials ? Object.assign({ strategy: 'local' }, credentials) : {};
	        return $scope.client.authenticate(payload)
	          .then(function(result) {
	            console.log("PASO ");

	            $scope.client.service('users').patch($stateParams.id, {
					validate: true
				})
				.then(function(res){
					$scope.result = result;
		            $scope.findUsersToLogin(credentials.email, true, $scope.showDashboard );
		            $scope.$apply();	
				}).catch(function(){
					$scope.setLoggedUser( $stateParams.id , false );
					$scope.client.logout().then(function(){
							$localStorage.user = null;
							localStorage.client = null;
				       		$localStorage.server = null;

				    });
				});
	          })
	          .catch(function(error){
	            $scope.error = "Error Activating User, Credentials Not Valid ";
	            console.log("NO PASO ");
	            console.log(error);
	            // $scope.error = error;
	            // $scope.showLogin();
	            $scope.$apply();
	          });
		}else{
			console.log("INFORMATION NOT VALID");
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
			    		$scope.updateChatParticipants();

			    		$scope.currentRoom.participants.forEach(function(_participant){

							if( _msg.indexOf('@'+_participant.username) != -1 || _msg.indexOf('@all') != -1  ){
								$scope.client.service('notifications').create({
									type: "block",
									userId:  _participant._id,
									userName: _participant.name,
									userEmail: _participant.email,
									title: "You have received a message",
									text: '<h1>Hi '+_participant.name+'! <br></h1> '+$scope.user.name+' has sent you the next message: <br><br> '+_msg+' <br><br> <img src="'+_img+'"> <br><br>Reply Back! <br><br>'
								}).then(function(){	
									$scope.error = "Email activation Notification Sent";
								}).catch(function(notice_error){	
									$scope.error = "Error Email activation Notification ";
								});
							}
						});
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
		$scope.client.service('users').get($scope.user._id).then(function(result){
			$scope.Rooms = [];
			$scope.Channels = [];
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
				$scope.Rooms.forEach(function(_room){
					let tempName = _name;
					if(_private)
						tempName = selectedContacts[0].name;
					console.log(_room.name + " - "+ tempName);
					if(_room.name == tempName){
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
				if(_private)
					_name = selectedContacts[0].name;
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
			    	console.log("Chat Created", result);
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
			}else{
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
			}
				
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

	$scope.getAllRooms = function(){
		let roomName = $('input#roomName').val();
		$scope.client.service('rooms').find().then(function(result){
			$scope.allRooms = result.data;
			if( roomName != null && roomName.trim() != '' && result.total > 0 ){
				let tmpArr = [];
				$scope.allRooms.forEach(function(_room){
					if( _room.name.includes(roomName) != -1 && $scope.user.rooms.includes(_room._id) == false ){
						tmpArr.push(_room);
					}
					$scope.allRooms = tmpArr;
				});
			}else{
				if( result.total == 0 ){
					$scope.allRooms = [];
				}
			}
			console.log("All users, roomName selected: "+roomName, $scope.allRooms);
			$scope.roomToAdd = null;
			$scope.$apply();
		});		
	};

	$scope.selectInvitationRoom = function(_room){
		$scope.allRooms = [];
		$scope.roomToAdd = _room;
		$scope.allRooms.push(_room);
		// console.log("Friend to add: ", $scope.roomToAdd);
	};

	$scope.requestInvitation = function(){
		if($scope.roomToAdd){
			let _from = $scope.user._id;
			let _to   = $scope.roomToAdd.owner;
			let _room = $scope.roomToAdd._id; 
			console.log("Request: from: ", _from, " to ",_to, " room ",_room);
			$scope.client.service('invitations').create({
				owner : _to,
				from  : _from,
				room  : _room
			}).then(result=>{
				console.log("requestInvitation ", result );
			});
		}else{
			console.log("No Room selected");
		}
		
	};

	$scope.getAllUsers = function(){
		let email = $('input#contactEmail').val();
		$scope.client.service('users').find().then(function(result){
			$scope.allUsers = result.data;
			if( email != null && email.trim() != '' && result.total > 0 ){
				let tmpArr = [];
				$scope.allUsers.forEach(function(_user){
					if(_user.email.indexOf(email) != -1){
						tmpArr.push(_user);
					}
					$scope.allUsers = tmpArr;
				});
			}else{
				if( result.total == 0 ){
					$scope.allUsers = [];
				}
			}
			// console.log("All users, email selected: "+email, $scope.allUsers);
			$scope.userToAdd = null;
			$scope.$apply();
		});		
	};

	$scope.selectFriend = function(friend){
		$scope.allUsers = [];
		$scope.userToAdd = friend;
		$scope.allUsers.push(friend);
		// $('input#contactEmail').val(friend.email);
		$scope.cEmail = friend.email; 
		console.log("Friend to add: ", $scope.userToAdd);
		
	}
	$scope.selectContactToAdd = function(cData){
		$scope.selectedUserToAdd = cData;
		console.log("selectedUserToAdd: ",$scope.selectedUserToAdd);
	};
	$scope.addUserToChatUpdate = function(){
		if($scope.selectedUserToAdd && $scope.selectedUserToAdd._id){
			$scope.addRoomToUser( $scope.selectedUserToAdd._id , $scope.currentRoom._id );
			$timeout(function() {
				$scope.openChatByRoom($scope.currentRoom._id);
			}, 500);
		}else{
			console.log("No user selected");
		}
	};

	// $scope.$watch('cEmail', function(newValue, oldValue){
	//     console.log("cEmail ", $scope.cEmail);
	// }, true);

	$scope.closeModals = function(){
		$('.modal').modal('close');
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
		console.log("Email to create conotact: ", contactEmail);
		if(contactEmail != null && contactEmail != $scope.user.email){
			$scope.findUsersByEmail(contactEmail).then(function(userData){
				var newContact = userData;
				if(newContact != null){
					console.log(newContact, $scope.Contacts);

					let finded = false;
				    $scope.Contacts.forEach(function(_tmpContact){
				    	if( _tmpContact.contact._id == newContact._id ){
				    		console.log(_tmpContact._id +" - "+ newContact._id);
				    		finded = true;
				    	}
				    });
				    if(finded == false){
				    	$scope.client.service('contacts').create({
							owner: $scope.user._id,
							contact: newContact._id
					    }).then(function(result){
					    	console.log("Creating contact");
					    	console.log(result);
					    	$scope.getContacts();
					    });
				    }else{
				    	console.log("Cant Add User Already In Contacts");
				    }

				}else{
					$scope.error = "User Not Found"
					console.log($scope.error);
				}
			});
		}else{
			console.log("Cant Create a Contact of Yourself or info equal null");
		}
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
	};
	
	$scope.getInvitations = function(){
	    $scope.client.service('invitations').find().then(function(result){
	    	if(result.total > 0){
	    		let tmpArr = result.data;
	    		$scope.Invitations = [];
	    		tmpArr.forEach(function(tmpInvit){
	    			if(tmpInvit.owner == $scope.user._id){
	    				$scope.client.service('rooms').get(tmpInvit.room).then(function(_room){
	    					$scope.client.service('users').get(tmpInvit.from).then(function(_user){
		    					if(_room._id != null){
		    						tmpInvit.room = _room;
		    						tmpInvit.from = _user;
		    						$scope.Invitations.push(tmpInvit);
		    					}
		    					console.log("Invitation: ", tmpInvit );
		    				});
	    				});
	    			}
	    		});
	    	}
	    	$scope.$apply();
	    });
	};
	$scope.acceptInvitations = function(invit, accept){
		if(accept){
			$scope.addRoomToUser( invit.from._id,  invit.room._id  );
			 $scope.client.service('invitations').patch( invit._id,{
				readed : true
		    }).then(function(result){
		    	console.log("Invitations accept ",result);
		    	
		    	$scope.getInvitations();
		    	$scope.$apply();
		    }); 
		}else{
			console.log("Invitation Data not correct");
		}
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
		console.log(credentials);
		$scope.client.service('users').find({
			query:{
				email: credentials.email
			}
		})
		.then(function(userGet){
			console.log(userGet);
			if(userGet.data[0]){
				const payload = credentials ? Object.assign({ strategy: 'local' }, credentials) : {};
		        return $scope.client.authenticate(payload)
		          .then(function(result) {
		            console.log("PASO");
		            $scope.result = result;
		            if(userGet.data[0].validate){
		            	$scope.setLoggedUser( userGet.data[0]._id, true );
		            	$scope.findUsersToLogin(credentials.email, true, $scope.showDashboard );
		            	$localStorage.error = "";
		            }else{
		            	$scope.error = "activate your account, an email has been sent to your account."
		            	console.log($scope.error);
		            	$scope.client.logout().then(function(){
							$localStorage.user = null;
							localStorage.client = null;
				       		$localStorage.server = null;
				       		$scope.client.service('notifications').create({
								type: "block",
								userId:  userGet.data[0]._id,
								userName: userGet.data[0].name,
								userEmail: userGet.data[0].email,
								title: "Your Account Has Been Blocked",
								text: '<h1>Welcome '+name+' <br></h1><h2>Click on the link to activate your account '+userGet.data[0].email+'</h2><br><br><a href="'+domain+'activate?id='+userGet.data[0]._id+'&name='+userGet.data[0].name+'&email='+userGet.data[0].email+'">Click Here</a><br><br><img src="http://orig07.deviantart.net/a17c/f/2015/172/2/6/you_shall_not_pass_by_borgster93-d8y4zyd.jpg">'
							}).then(function(){	
								$scope.error = "Email activation Notification Sent";
							}).catch(function(notice_error){	
								$scope.error = "Error Email activation Notification "+notice_error;
							});

							$scope.setLoggedUser( userGet.data[0]._id , false );
				       		// $scope.loginErrorsCatching( userGet.data[0]._id, userGet.data[0].name, userGet.data[0].email );
						});
		            }
		          })
		          .catch(function(error){
		            if(userGet.data[0])
		            	$scope.loginErrorsCatching( userGet.data[0]._id, userGet.data[0].name, userGet.data[0].email );
		            $scope.error = "Credentials Not Valid Failure #"+$scope.loginErrors;
		            $scope.$apply();
		            console.log($scope.error);
		            console.log(error);
		          });
		           
			}else{
				$scope.error = "Error Retrieving User Data";
	            console.log($scope.error);
			}
			

		}).catch(function(error2){
			$scope.error = "Email "+credentials.email+" not found, Can't send a activation notification";
			console.log(error2);
    		console.log($scope.error);
    		$scope.$apply();
		});
	};
	$scope.loginErrorsCatching = function(id, name, email ){
		if($scope.loginErrors == null){
        	$scope.loginErrors = 1;
        }else{
        	$scope.loginErrors++;
        }
        if($scope.loginErrors >= 5){
			console.log("Sending Error Email To "+email);
			$scope.client.service('users').patch( id, {
				validate: false
			})
			.then(function(res){
				$scope.client.service('notifications').create({
					type: "block",
					userId:  id,
					userName: name,
					userEmail: email,
					title: "Your Account Has Been Blocked",
					text: '<h1>Welcome '+name+' <br></h1><h2>Click on the link to activate your account '+email+'</h2><br><br><a href="'+domain+'activate?id='+id+'&name='+name+'&email='+email+'">Click Here</a><br><br><img src="http://orig07.deviantart.net/a17c/f/2015/172/2/6/you_shall_not_pass_by_borgster93-d8y4zyd.jpg">'

				}).then(function(){	
					$scope.error = "Email activation Notification Sent";
					$scope.$apply();
				}).catch(function(notice_error){	
					$scope.error = "Error Email activation Notification "+notice_error;
					$scope.$apply();
				});
			}).catch(function(){
				$scope.error = "Error Blocking Account "+email;
					$scope.$apply();
			});
        }
        console.log("Failed Tries: "+$scope.loginErrors);
     	$scope.$apply();	
	};
	$scope.signup = function(credentials){
		if(credentials && credentials.name && credentials.email && credentials.password && credentials.username){
			console.log("Sign up");
		    $scope.client.service('users').create(credentials)
		      .then(function(result) {
	      		console.log("PASO ");
	      		console.log(result);
	      		$scope.error = "Activate your account, an email has been sent to your account."
	      		$localStorage.error = $scope.error;
	      		$scope.showLogin();
	            // $scope.login(credentials);
	            $scope.$apply();
	          })
	          .catch(function(error){
	            $scope.error = "Error Signin Up";
	            console.log(error);
	            $scope.$apply();
	            // $scope.showSignup();
	          });
		}else{
			$scope.error = "Invalid Data, Enter Correct Information, Remember Password 1 Capital Letter, 1 Number minimum";
		}
	};
	$scope.logout = function(){
		let _id = $localStorage.user._id;
		$scope.setLoggedUser( _id , false );
		$scope.client.logout().then(function(){
			$localStorage.user = null;
			localStorage.client = null;
       		$localStorage.server = null;
       		$localStorage.error = "";
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
		console.log($scope);
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
    })
     .when("/activate", {
        templateUrl: "templates/confirmation.html"
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
    })
    .state('activate', {
        url: "/activate?id&name&email",
        templateUrl: "templates/confirmation.html"
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
