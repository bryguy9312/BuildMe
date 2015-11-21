$('document').ready(function() {
	var validLogout = false;
	var ref = new Firebase("https://build-me.firebaseio.com");
	ref.onAuth(authCallback);
	//checkAuth();

	$('#raceMenu').on('change', function() {
		changeRaceProfile($("#raceMenu option:selected"));
	});

	//TODO needs to add character ability mods to calculated number
	$("#abilityScores input").on("keyup", function() {
		thisAbil = this.id;
		character.stats.abilityScores[thisAbil] = this.value;
		$("#"+thisAbil+"Mod").attr('value', modCalc(this.value));
	});

	$('#logout').click(function() {
		validLogout = true;
		ref.unauth();
	});

	$( "input[type=checkbox]" ).on( "click", function(){
		thisClass = this.value;
		if (this.checked) {
			$('#classLevels').append('<div id="' + thisClass + '"><label>'+ thisClass + ': </label><input class="level" value="0" min="0" type="text" disabled> <button value="' + thisClass + '" class="plusLevel">+</button> <button class="minusLevel">-</buttonclass>');
		} else {
			$('#' + thisClass).remove();
		}
	});
	//TODO make the plus/minus buttons available only when appropriate (minus only for the last level added, maybe for last class and all levels...)
	//TODO implement forward and backwards class/race profiles
	$('body').on('click', '.plusLevel', function() {
		var thisClass = this.closest('div').id;
		var thisClassLevel = parseInt($("#" + thisClass + " input").attr('value')) + 1;
		$("#" + thisClass + " input").attr('value', thisClassLevel);
		character.descrip.levels.totalLevel += 1;
		character.descrip.levels.progression[character.descrip.levels.totalLevel] = thisClass;
	});

	$('body').on('click', '.minusLevel', function(event) {
		var thisClass = this.closest('div').id;
		var thisClassLevel = parseInt($('#' + thisClass + " input").attr('value'));
		if (thisClassLevel > 0) {
			delete(character.descrip.levels.progression[character.descrip.levels.totalLevel]);
			character.descrip.levels.totalLevel -= 1;
			thisClassLevel--;
			$("#" + thisClass + " input").attr('value', thisClassLevel);
		}
	});

	$('#rollDice').on('click', function() {
		//window.alert(Math.floor((Math.random() * 20) + 1));
		console.log(character);
	});

	$('#charName').on("keyup", function() {
		character.descrip.name = this.value;
	});

	$('#alignment').on('keyup', function() {
		character.descrip.alignment = this.value;
	});

	$('#background').on("keyup", function() {
		character.descrip.background = this.value;
	});

	$('#height').on("keyup", function() {
		character.descrip.height = this.value;
	});

	$('#gender').on("keyup", function() {
		character.descrip.gender = this.value;
	});

	$('#weight').on("keyup", function() {
		character.descrip.weight = this.value;
	});

	$('#deity').on("keyup", function() {
		character.descrip.deity = this.value;
	});

	$('#size').on("keyup", function() {
		character.descrip.size = this.value;
	});

	$('#age').on("keyup", function() {
		character.descrip.age = this.value;
	});

	$('#addSpell').on('click', function() {
		$("#spells").append("<div cl>")
	})

	$('#genAbilScores').on("click", function() {
		abilScores = "Your ability scores are: ";
		for (i = 0; i < 6; i++) {
			scoreTotal = 0;
			lowestRoll = 10;
			for(j = 0; j < 4; j++) {
				roll = Math.floor((Math.random() * 6) + 1);
				if(j == 0) {
					lowestRoll = roll;
				} else if (roll < lowestRoll) {
					scoreTotal += lowestRoll;
					lowestRoll = roll;
				} else {
					scoreTotal += roll;
				}
			}
			abilScores += scoreTotal + " ";
		}
		window.alert(abilScores);
	});

	function checkAuth() {
		var authData = ref.getAuth();
		if (authData) {

		} else {
			authCallback(authData);
		}
	};

	function authCallback(authData) {
		if (authData) {
		} else {
			if (validLogout) {
				window.location.replace("/index.html");
			} else {
				ref.authWithOAuthPopup("facebook", function(error, authData) {
				  	if (error) {
				    	console.log("Login Failed!", error);
				  	} else {
				    	console.log("Authenticated successfully with payload:", authData);
				  	}
				});
			}
		}
	};

	var character = {
		descrip: {
			race: "",
			name: "",
			age: "",
			gender: "",
			levels: {
				totalLevel: 0,
				progression: {}
			},
			alignment: "",
			background: "",
			moveSpeed: 0,
			size: "",
			height: "",
			weight: "",
			deity: "",
			languages: []
		},
		stats: {
			abilityScores: {},
			abilities: {},
			classFeats: {},
			raceTraits: {},
			experience: 0,
			proficiency: {},
			health: {},
			proficiencyBonus: 0
		},
		inv: {
			equipment: {},
			weapons: {},
			armor: {},
			currency: {}
		}
	};

	//Calculates the ability modifier based off of user inputted ability score
	function modCalc(stat) {
		return Math.floor((stat - 10) / 2);
	};

	function changeRaceProfile(raceObj) {
		if(raceObj.attr('value') != 0) {
			character.descrip.race = raceObj.text();
		}

	}
});