'use strict';

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDeJtisScxqBRSVz3OUSLJaBN_i11nBvr8",
    authDomain: "contacts-list-220ef.firebaseapp.com",
    databaseURL: "https://contacts-list-220ef.firebaseio.com",
    storageBucket: "contacts-list-220ef.appspot.com",
    messagingSenderId: "288965203468"
};
firebase.initializeApp(config);

//angular module Initialize
angular.module('myApp.contacts', ['ngRoute', 'firebase'])

    //configure routes
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/contacts', {
            templateUrl: 'contacts/contacts.html',
            controller: 'contactsCtrl'
        });
    }])

    //controller logic begins
    .controller('contactsCtrl', ['$scope', '$firebaseObject', '$firebaseArray', function($scope, $firebaseObject, $firebaseArray) {

        //create refs to firebase database
        var ref = firebase.database().ref();

        $scope.contacts = $firebaseArray(ref);
        $scope.addFormShow = true;
        $scope.editFormShow = false;

        $scope.showEditForm = function(contact) {
            $scope.addFormShow = false;
            $scope.editFormShow = true;

            $scope.id = contact.$id;
            $scope.name = contact.name;
            $scope.email = contact.email;
            $scope.phone = contact.phone;

        };


        $scope.addContact = function() {

            $scope.contacts.$add({
                name: $scope.name,
                email: $scope.email,
                phone: $scope.phone
            }).then(function(ref) {

                console.log("added contact " + ref);

                var id = "";

                ref.on('value', snap => console.log(snap.val(), snap.key));

                //short way of writing using es6 arrow functions
                ref.on('value', snap => id = snap.key);

                //traditional way of writing
                // ref.on('value', function(snap) {
                //     return console.log(snap.key);
                // });

                $scope.name = '';
                $scope.email = '';
                $scope.phone = '';
            });
        }; //add contact ends here

        $scope.editContact = function() {
            var id = $scope.id;
            var record = $scope.contacts.$getRecord(id);

            record.name = $scope.name;
            record.email = $scope.email;
            record.phone = $scope.phone;

            $scope.contacts.$save(record).then(function(ref) {
                ref.on('value', snap => console.log(snap.key));
            });

            $scope.name = '';
            $scope.email = '';
            $scope.phone = '';

            $scope.addFormShow = true;
            $scope.editFormShow = false;
        };

        $scope.removeContact = function(contact) {
            $scope.contacts.$remove(contact);
        };

    }]);
