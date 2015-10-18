$('document').ready(function() {
	$('#raceMenu').on('change', function() {
		changeRaceProfile($("#raceMenu option:selected").text());
	});
	$( "input[type=checkbox]" ).on( "click", function(){
		thisClass = this.value
		if (this.checked) {
			//$('#classLevels').append("<div id=" + thisClass + "><label>" + thisClass + "</label><input class='level' type='text'></div>");
			$('#classLevels').append("<div id=" + thisClass + "><label>" + thisClass +"<input type='text' class='level' value='0' disabled><button>+</button> <button>-</button>");
			character.descrip.levels[thisClass] = 0;
			console.log(character.descrip.levels.totalLevel);
			lvlTotal = character.descrip.levels.totalLevel;
			character.descrip.levels.totalLevel = lvlTotal + 1;
			character.descrip.levels.progression.totalLevel = thisClass;
			console.log(character.descrip.levels.progression);
		} else {
			$('#' + thisClass).remove();
			delete(character.descrip.levels[thisClass]);
			delete(character.descrip.levels.progression['totalLevel']);
			character.descrip.levels.totalLevel -= 1;
		}
		console.log(character.descrip.levels);
		//compile character level based on levels of classes? character.setLevel();
	});

	$('.level').keyup(function() {
		console.log(this);
	});

	$('.plusLevel').on("click", function() {
		console.log("it works sorta");
	});

	//object to handle user's character building, stored locally until saved to server
	var character = {
		descrip: {
			race: "",
			name: "",
			gender: "",
			levels: {
				totalLevel: 0,
				progression: {}
			},
			health: {},
			proficiency: {},
			alignment: {},
			background: {},
			moveSpeed: 0,
			size: "",
			height: "",
			weight: "",
			deity: "",
			languages: []
		},
		feat: {
			abilityScores: {},
			abilities: {},
			classFeats: {},
			raceTraits: {},
			experience: 0
		},
		inv: {
			equipment: {},
			weapons: {},
			armor: {},
			currency: {}
		}
	};

	//Calculates the ability modifier based off of user inputted ability score
	//TODO change output to update ability modifier text field
	function modCalc(stat) {
		return Math.floor((stat - 10) / 2);
	};

	//Rolls a single d20
	//TODO change output to something more appropriate
	function rollDice() {
		window.alert(Math.floor((Math.random() * 20) + 1));
	};

	//generates a string of 6 ability scores by rolling 4d6 and dropping the lowest
	//TODO change the output from an alert to an inline text box or something
	function genAbilScores() {
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
	};

	function changeRaceProfile(race) {
		window.alert(race);
	};

});
