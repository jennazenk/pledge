'use strict';
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js deferral-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:

function $Promise() {
	this.state = 'pending' ;
	this.handlerGroups = [];

// 	this.then = function (success, rejected){
// 	var handler = {successCb: success, errorCb: rejected}
// 	console.log(success, rejected);
// 	this.handlerGroups.push(handler);
// }
}

$Promise.prototype.then = function (success, rejected){
	var handler = {} // why handler = {successCb: success, errorCb: rejected} does not work ?
	if (typeof success === 'function' || typeof rejected === 'function'){
		console.log(this.handlerGroups);
		handler.successCb = success;
		handler.errorCb = rejected;	
	}
	
	this.handlerGroups.push(handler);
	if(this.state === 'resolved')this.callHandlers();
	
}

$Promise.prototype.callHandlers = function(){
	var state = this.state;
	var value = this.value;
	var handlerGroups = this.handlerGroups;
	if(this.handlerGroups.length > 0){
		//How shift and forEach work together? Would that work with a for loop?
		this.handlerGroups.forEach(function(handler){ // forEach creates a new scope
			if(state === 'resolved' && handler.successCb){
				handler.successCb(value);
			}
			else if(state === 'rejected' && handler.errorCb){
				handler.errorCb(value);
			}
		})
	console.log("HEEEEYYYYYY");
	this.handlerGroups = [];
	console.log('this.handlerGroups', this.handlerGroups);
	}

	
}

function Deferral() {
	this.$promise = new $Promise() ;
	
}

Deferral.prototype.resolve = function(data) {
	if(this.$promise.state === 'pending') {
		this.$promise.state = 'resolved' ;
		this.$promise.value = data ;
		this.$promise.callHandlers();
	}

}

Deferral.prototype.reject = function(data) {
	if(this.$promise.state === 'pending') {
		this.$promise.state = 'rejected' ;
		this.$promise.value = data ;
	}
}

function defer() {
	return new Deferral() ;
}

// defer.prototype.$promise = function() {
// 	return new $Promise ;
// }



/*-------------------------------------------------------
The spec was designed to work with Test'Em, so we don't
actually use module.exports. But here it is for reference:

module.exports = {
  defer: defer,
};

So in a Node-based project we could write things like this:

var pledge = require('pledge');
…
var myDeferral = pledge.defer();
var myPromise1 = myDeferral.$promise;
--------------------------------------------------------*/
