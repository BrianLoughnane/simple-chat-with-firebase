angular.module('myApp', ['firebase'])
	.constant('FIREBASE_URL', 'torid-inferno-7446.firebaseio.com/')
	.factory('firebaseReference', function(FIREBASE_URL) {
		return new Firebase(FIREBASE_URL);
		debugger
	})
	.controller('MyCtrl', function (firebaseReference, $scope, $firebase) {
		$scope.myData = $firebase(firebaseReference).$asObject();
	})
	.directive('chat', function() {
		'use strict';
		return {
			restrict: 'E',
			templateUrl: 'chat.tmpl.html',
			scope: {},
			controllerAs: 'ctrl',
			controller: function ($scope, $firebase, firebaseReference) {
				// $scope.test = $firebase(firebaseReference).$asObject();
				var ctrl = this;

				ctrl.send = {
					userName: '',
					message: ''
				}
				ctrl.messages = $firebase(firebaseReference.child('messages')).$asArray();
				ctrl.sendMessage = function (send) {
					// perform validation
					if (!send.message) return false;
					// save the message
					ctrl.messages.$add({
						message: send.message.trim(),
						userName: send.userName,
						datetime: Date.now()
					});
					ctrl.send.message = '';
				}
				ctrl.deleteMessage = function (message) {
					var id = message.$id;
					var ref = $firebase(firebaseReference.child('messages').child(id)).$asObject();
					ref.$remove();
					ref.$save();
				}
				ctrl.deleteAll = function () {
					var ref = $firebase(firebaseReference.child('messages')).$asObject();
					ref.$remove();
					ref.$save();
				}
			}
		};
	})
	.directive('login', function() {
		'use strict';
		return {
			restrict: 'E',
			templateUrl: 'login.html',
			scope: {},
			controllerAs: 'ctrl',
			controller: function ($scope, firebaseReference, $rootScope, $firebase) {
				$scope.loggedIn = $firebase(firebaseReference).$asArray();

				// $firebaseSimpleLogin(ref).$login('google', {
				// 	rememberMe: true,
				// 	scope: 'https://www.googleapis.com/auth/plus.login'
				// })

				$rootScope.$on('$firebaseSimpleLogin:login', function (event, user) {
					if (user !=null) {
						User.setUser(user.thirdPartyUserData);
					}
				});
				$rootScope.$on('$firebaseSimpleLogin:logout', function (event, user) {
					User.setDefault();
				});
			}
		};
	})