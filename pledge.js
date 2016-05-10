'use strict';
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js deferral-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:

function $Promise() {
	this.state = 'pending' ;
	this.handlerGroups = [];

}

$Promise.prototype.then = function (success, rejected){
	var handler = {} // why handler = {successCb: success, errorCb: rejected} does not work ?
	
	handler.forwarder = new Deferral;
	if (typeof success === 'function' || typeof rejected === 'function'){
		//console.log(this.handlerGroups);
		handler.successCb = success;
		handler.errorCb = rejected;
	}
	
	this.handlerGroups.push(handler);

	if(this.state === 'resolved' || this.state === 'rejected')this.callHandlers();
	handler.forwarder.$promise = this;
	return handler.forwarder.$promise;
}

$Promise.prototype.catch = function (func){ //what does .catch do???
	return this.then(null, func);		//when is catch called ?
}

// $Promise.prototype.callHandlers = function() {
// 	var state = this.state;
// 	var value = this.value;
// 	var handlerGroups = this.handlerGroups;
// 	if(this.handlerGroups.length > 0){
// 		var result ;

// 		this.handlerGroups.forEach(function(handler){ 
			
// 			if(state === 'resolved' && handler.successCb){
// 				try {
// 					handler.successCb(value);
// 					result = handler.successCb(value);
// 					if(result instanceof Deferral) {
// 						handler.forwarder.$promise = result ;
// 					} else {
// 						handler.forwarder.$promise.value = result;
// 					}
// 				} catch(result) {
// 					handler.forwarder.$promise.state = 'rejected';
// 					handler.forwarder.$promise.value = result;
// 					handler.forwarder.reject(result);
// 				}
					
// 			} else if(state === 'rejected' && handler.errorCb){	
// 				try {
// 					handler.errorCb(value);
// 					result = handler.successCb(value);
// 					if(result instanceof Deferral) {
// 						handler.forwarder.$promise = result;
// 					} else {
// 						handler.forwarder.$promise.value = result ;
// 						// handler.forwarder.$promise.state = 'resolved';
// 					}	
// 			} catch(result) {
// 				handler.forwarder.$promise.value = result ;
// 				handler.forwarder.$promise.state = 'rejected';
// 				handler.forwarder.reject(result);
// 				}
// 			}
// 	this.handlerGroups = [];
// 	})
// }
// }

$Promise.prototype.callHandlers = function(){
	var state = this.state;
	var value = this.value;
	var handlerGroups = this.handlerGroups;
	if(this.handlerGroups.length > 0){
		//How shift and forEach work together? Would that work with a for loop?
		this.handlerGroups.forEach(function(handler){ // forEach creates a new scope
			if(state === 'resolved' && handler.successCb){
				var result = handler.successCb(value);
				if(result instanceof Deferral) {
					handler.forwarder.$promise = result ;
				} else {
					try {
						handler.forwarder.$promise.value = result;
					}
					catch(result) {
						// handler.forwarder.$promise.state = 'rejected';
						// handler.forwarder.$promise.value = result;
						handler.forwarder.$promise.reject(result);
					}
				}
			}
			else if(state === 'rejected' && handler.errorCb){
				var result = handler.errorCb(value);
				//handler.forwarder.reject()
				if(result instanceof Deferral) {
					handler.forwarder.$promise = result;
				} else {
					handler.forwarder.$promise.value = result ;
					handler.forwarder.$promise.state = 'resolved';
				}
			}
		})
	this.handlerGroups = [];
	}

	
}

function Deferral() {
	this.$promise = new $Promise() ;
	
}

//Deferral.prototype.forwarder = function (){};

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
		this.$promise.callHandlers();
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
