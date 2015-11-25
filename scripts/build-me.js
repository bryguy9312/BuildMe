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

	//TODO populate this object with necessary functions, after making these functions, then replace redundant code when processing JSON files.




	$('#raceMenu').on("change", function() {
		var selectedRaceVal = this.value;
		//TODO make sure that I don't need another check for "select race" option here to reduce getJSON runs
		//TODO ideally, there would be a way to make this more efficient but since the data is so small it shouldn't really matter
		//asynch, do all data manipulation here
		$.getJSON("raceTraits.json", function(data) {
			//checks whether or not race parameters need to be reversed, then reverses
			if(selectedRaceVal == 0 || (character.descrip.race != "" && character.descrip.race != selectedRaceVal)) {
				var raceInfo = data[character.descrip.race];
				$.each(raceInfo.abilityScores, function(key, value) {
					modAbilScore(key, -value);
				});
				character.descrip.size = "";
				character.descrip.height = 0;
				character.descrip.weight = 0;
				character.descrip.moveSpeed = 0;
				character.descrip.age = 0;
				character.stats.raceTraits = {};
				$.each(raceInfo.proficiencies, function(key, value){
					$.each(value.split("-"), function (index, element) {
						var profIndex = character.stats.proficiencies[key].indexOf(element);
						if(profIndex > -1) {
							character.stats.proficiencies[key].splice(element, 1);
						}
					})
				});
				character.descrip.race = 0;
				$("#subraceMenu").prop("disabled", "disabled");
			}
			// modifies character values based on selected race
			if(selectedRaceVal != 0) {
				character.descrip.race = selectedRaceVal;
				var raceInfo = data[character.descrip.race];
				//TODO set up a separate trait/feat abilScore modifier value?
				$.each(raceInfo, function(key, value) {
					console.log(key + " " + value);
					charFunctions[key](value);
				})
			}
			refreshHTMLFields();
		})
	});
	//Helper functions for use in automated json handling
	var charFunctions = {
		updateAbilScores: updateAbilScores,
		setMoveSpeed: setMoveSpeed,
		setWeight: setWeight,
		setHeight: setHeight,
		setSize: setSize,
		setAge: setAge,
		setRaceTraits: setRaceTraits,
		addProficiencies: addProficiencies,
		updateSubraceMenu: updateSubraceMenu,
		abilityScores: updateAbilScores,
		size: setSize,
		height: setHeight,
		weight: setWeight,
		speed: setMoveSpeed,
		age: setAge,
		raceTraits: setRaceTraits,
		proficiencies: addProficiencies,
		subraces: updateSubraceMenu
	};
	function updateSubraceMenu(subraces) {
		$.each(subraces, function (index, element) {
			$("#subraceMenu").append($("<option></option>").attr("value", element).text(element));
		});
		$("#subraceMenu").prop("disabled", false);
	}
	function addProficiencies(proficiencies) {
		$.each(proficiencies, function (key, value) {
			$.each(value.split("-"), function (index, element) {
				character.stats.proficiencies[key].push(element);
			})
		})
	}
	function setRaceTraits(traits){
		$.each(traits, function(key,value) {
			character.stats.raceTraits[key] = value;
		})
	}
	function setAge(age) {
		character.descrip.age = age;
	}
	function setMoveSpeed(moveSpeed) {
		character.descrip.moveSpeed = moveSpeed;
	}
	function setWeight(weightStr) {
		character.descrip.weight = weightStr;
	}
	function setHeight(heightStr) {
		character.descrip.height = genHeight(heightStr);
	}
	function setSize(size) {
		character.descrip.size = size;
	}
	function updateAbilScores(abilScores) {
		$.each(abilScores, function (key, value) {
			modAbilScore(key, value);
		})
	}

	$("#subraceMenu").on("change", function() {
		if(this.value != 0) {
			$.getJSON("subraceTraits.json", function(data) {

			})
		}
	});
	//TODO complete this function
	function refreshHTMLFields() {
		$('#height').val(character.descrip.height);
		$('#weight').val(character.descrip.weight);
		$('#moveSpeed').val(character.descrip.moveSpeed);
		$('#size').val(character.descrip.size);
		$('#age').val(character.descrip.age);
		//$('#abilityScores input').val(character.descrip.abilityScores[this.attr('id')] + character.descrip.abilityScoreModifiers[this.attr('id')]);
		$('#abilityScores input').each(function() {
			var abil = this.id;
			$("#" + abil).val(character.stats.abilityScores[abil] + character.stats.abilityScoreModifiers[abil]);
		});

	}

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
		character.stats.abilityScoreModifiers[abil] += parseInt(mod);
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
			abilityScoreModifiers: {
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