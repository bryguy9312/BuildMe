$('document').ready(function() {
	//TODO needs to add character ability mods to calculated number
	$("#abilityScores input").on("keyup", function() {
		thisAbil = this.id;
		character.stats.abilityScores[thisAbil] = this.value;
		$("#"+thisAbil+"Mod").attr('value', modCalc(this.value));
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

	$('#raceMenu').on("change", function() {
		//TODO check for current race, if it is not null then reset or reverse race parameters in order to make way for newly selected race
		if(this.value == 0 || character.descrip.race != "") {
			//reset parameters
		}


		if(this.value != 0) {
			character.descrip.race = this.value;
			//asynch, do all data manipulation here
			$.getJSON("raceTraits.json", function(data) {
				var raceInfo = data[character.descrip.race];
				console.log(data[character.descrip.race]);
				//TODO set up a separate trait/feat abilScore modifier value
				//add race abilScore modifier
				$.each(raceInfo.abilityScores, function(key, value) {
					modAbilScore(key, value);
				});
				//set race size
				character.descrip.size = raceInfo.size;
				//generate and set height
				character.descrip.height = genHeight(raceInfo.height);
				//TODO generate weight instead of setting constant
				//set weight based on race
				character.descrip.weight = raceInfo.weight;
				//set movespeed
				character.descrip.moveSpeed = raceInfo.speed;
				//TODO generate random starting age?
				//set age based on race parameters
				character.descrip.age = raceInfo.age;
				//clear out character race traits then update with selected race
				character.stats.raceTraits = {};
				$.each(raceInfo.traits, function(key, value) {
					character.stats.raceTraits[key] = value;
				});
				//add race proficiencies to character object
				$.each(raceInfo.proficiencies, function(key, value) {
					$.each(value.split("-"), function(index, element) {
						character.stats.proficiencies[key].push(element);
					})
				})
				//add subraces to select menu
				$.each(raceInfo.subraces, function(index, element) {
					$("#subraceMenu").append($("<option></option>").attr("value", element).text(element));
				});
				$("#subraceMenu").prop("disabled", false);
			})
		}
	});

	$("#subraceMenu").on("change", function() {
		if(this.value != 0) {
			$.getJSON("subraceTraits.json", function(data) {

			})
		}
	});

	function genHeight(heightString) {
		var heightArray = heightString.split("-");
		var max = parseInt(heightArray[1]);
		var min = parseInt(heightArray[0]);
		return Math.floor(Math.random()*(max-min+1)+min);
	}


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

	function modAbilScore(abil, mod) {
		abil = abil.toLowerCase();
		console.log(character.stats.abilityScores[abil]);
		character.stats.abilityScores[abil] += parseInt(mod);
		console.log(character.stats.abilityScores[abil]);
	}

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
			height: 0,
			weight: "",
			deity: "",
			languages: []
		},
		stats: {
			abilityScores: {
				str: 0,
				dex: 0,
				con: 0,
				int: 0,
				wis: 0,
				cha: 0
			},
			abilities: {},
			classFeats: {},
			raceTraits: {},
			experience: 0,
			proficiencies: {
				weapon: [],
				armor: [],
				tool: []
			},
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

});