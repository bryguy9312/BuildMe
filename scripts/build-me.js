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
		var selectedRaceVal = this.value;
		//asynch, do all data manipulation here
		//reverse subrace selection when race is changed
		if (character.descrip.subrace != 0 && character.descrip.race != 0) {
			console.log(character.descrip.race);
			$.getJSON("subraceTraits.json", function(data) {
				reverseSubrace(data[character.descrip.race][character.descrip.subrace]);
			})
		}
		$.getJSON("raceTraits.json", function(data) {
			//checks whether or not race parameters need to be reversed, then reverses
			if(selectedRaceVal == 0 || character.descrip.race != selectedRaceVal)) {
				var raceInfo = data[character.descrip.race];
				//reverse race selections
				$.each(raceInfo, function(key, value) {
					charFunctions[key+"Reverse"](value);
				});
				character.descrip.race = 0;
			}
			// modifies character values based on selected race
			if(selectedRaceVal != 0) {
				character.descrip.race = selectedRaceVal;
				var raceInfo = data[character.descrip.race];
				//TODO set up a separate trait/feat abilScore modifier value?
				$.each(raceInfo, function(key, value) {
					charFunctions[key](value);
				})
			}
			refreshHTMLFields();
		})
	});

	$("#subraceMenu").on("change", function() {
		var selectedSubraceVal = this.value;
		$.getJSON("subraceTraits.json", function(data) {
			if(selectedSubraceVal == 0 || (character.descrip.subrace != selectedSubraceVal && character.descrip.subrace != "")) {
				var subraceInfo = data[character.descrip.race][character.descrip.subrace];
				reverseSubrace(subraceInfo);
			}
			if(selectedSubraceVal != 0) {
				character.descrip.subrace = selectedSubraceVal;
				var subraceInfo = data[character.descrip.race][character.descrip.subrace];
				$.each(subraceInfo, function(key, value) {
					console.log(key + " " + value);
					charFunctions[key](value);
				})
			}
			refreshHTMLFields();
		})
	});

	function reverseSubrace(subraceInfo) {
		$.each(subraceInfo, function(key, value) {
			console.log(key+' ' + value);
			charFunctions[key+"Reverse"](value);
		});
		character.descrip.subrace = 0;
	}

	//Helper functions for use in automated json handling
	var charFunctions = {
		abilityScores: updateAbilScores,
		abilityScoresReverse: updateAbilScoresReverse,
		size: setSize,
		sizeReverse: clearSize,
		height: setHeight,
		heightReverse: clearHeight,
		weight: setWeight,
		weightReverse: clearWeight,
		speed: setMoveSpeed,
		speedReverse: clearMoveSpeed,
		age: setAge,
		ageReverse: clearAge,
		raceTraits: setRaceTraits,
		raceTraitsReverse: clearRaceTraits,
		proficiencies: addProficiencies,
		proficienciesReverse: removeProficiencies,
		subraces: updateSubraceMenu,
		subracesReverse: clearSubraceMenu
	};
	function updateSubraceMenu(subraces) {
		$.each(subraces, function (index, element) {
			$("#subraceMenu").append($("<option></option>").attr("value", element).text(element));
		});
		$("#subraceMenu").prop("disabled", false);
	}
	function clearSubraceMenu(subraces) {
		$("#subraceMenu").find('option')
				.remove()
				.end()
				.append('<option value="0">---Pick a Subrace---</option>')
				.prop("disabled", "disabled");
	}
	function addProficiencies(proficiencies) {
		$.each(proficiencies, function (key, value) {
			$.each(value.split("-"), function (index, element) {
				character.stats.proficiencies[key].push(element);
			})
		})
	}
	function removeProficiencies(proficiencies) {
		$.each(proficiencies, function(key, value){
			$.each(value.split("-"), function (index, element) {
				var profIndex = character.stats.proficiencies[key].indexOf(element);
				if(profIndex > -1) {
					character.stats.proficiencies[key].splice(element, 1);
				}
			})
		});
	}
	function setRaceTraits(traits){
		$.each(traits, function(key,value) {
			character.stats.raceTraits[key] = value;
		})
	}
	function clearRaceTraits(){
		character.stats.raceTraits = {};
	}
	function setAge(age) {
		character.descrip.age = age;
	}
	function clearAge() {
		setAge(0);
	}
	function setMoveSpeed(moveSpeed) {
		character.descrip.moveSpeed = moveSpeed;
	}
	function clearMoveSpeed() {
		setMoveSpeed(0);
	}
	function setWeight(weightStr) {
		character.descrip.weight = weightStr;
	}
	function clearWeight() {
		setWeight(0);
	}
	function setHeight(heightStr) {
		character.descrip.height = genHeight(heightStr);
	}
	function clearHeight(){
		setHeight(0);
	}
	function setSize(size) {
		character.descrip.size = size;
	}
	function clearSize() {
		setSize("")
	}
	function updateAbilScores(abilScores) {
		$.each(abilScores, function (key, value) {
			modAbilScore(key, value);
		})
	}
	function updateAbilScoresReverse(abilityScores) {
		$.each(abilityScores, function(key, value) {
			modAbilScore(key, -value);
		});
	}

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
			$("#" + abil).val(parseInt(character.stats.abilityScores[abil]) + parseInt(character.stats.abilityScoreAdjustments[abil]));
		});
		//TODO refresh modScores

	}

	function genHeight(heightString) {
		if (heightString == 0) {
			return 0;
		}
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
		character.stats.abilityScoreAdjustments[abil] += parseInt(mod);
	}

	var character = {
		descrip: {
			race: "",
			subrace: "",
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
			abilityScoreAdjustments: {
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
		},
		temp: {
			abilityScoreAdjustments: {
				str: 0,
				dex: 0,
				con: 0,
				int: 0,
				wis: 0,
				cha: 0
			}
		}
	};

	//Calculates the ability modifier based off of user inputted ability score
	function modCalc(stat) {
		return Math.floor((stat - 10) / 2);
	};

});