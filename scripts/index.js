$(function() {
	var ref = new Firebase("https://build-me.firebaseio.com");
	var isNewUser = true;
	$('#login').click(function() {
		ref.onAuth(authCallback);
	});

	checkAuth();

	function authCallback(authData) {
		if (authData) {
			console.log(authData);
			if (ref.child("users").orderByChild("uid").equalTo(authData.uid)) {
				isNewUser = false;
			}
			if (isNewUser) {
				ref.child("users").child(authData.uid).set({
					provider: authData.provider,
					name: getName(authData)
				});
			}
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

	function getName(authData) {
	switch(authData.provider) {
		case 'password':
			return authData.password.email.replace(/@.*/, '');
		case 'twitter':
			return authData.twitter.displayName;
		case 'facebook':
			return authData.facebook.displayName;
	}
}
});