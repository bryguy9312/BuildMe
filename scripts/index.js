$(function() {
	var ref = new Firebase("https://build-me.firebaseio.com");
	$('#login').click(function() {
		ref.onAuth(authCallback);
	});

	checkAuth();

	function authCallback(authData) {
		if (authData) {
			console.log(authData);
			window.location.replace("/build-me.html");
		} else {
			ref.authWithOAuthPopup("facebook", function(error, authData) {
			  	if (error) {
			    	console.log("Login Failed!", error);
			  	} else {
			    	console.log("Authenticated successfully with payload:", authData);

			    	//window.location.replace("/build-me.html");
			  	}
			});
		}
	}

	function checkAuth() {
		var authData = ref.getAuth();
		if (authData) {
			window.location.replace("/build-me.html");
		}
	}
});