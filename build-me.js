primaryRace = '';
$('document').ready(function() {
	$('#raceMenu').on('change', function() {
		changeRaceProfile($("#raceMenu option:selected").text());
	});
	$( "input[type=checkbox]" ).on( "click", function(){
		if (this.checked) {
			$('#classLevels').append('<label>' + this.value + '</label><input type="text"></input><br>').id(this.value);
		} else {
			$('#classLevels').remove('#'+this.value);
		}
	});
});




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
}

function changeRaceProfile(race) {
	window.alert(race);

}