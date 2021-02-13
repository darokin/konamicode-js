// quick and dirty as javascript should be ;) [darokin]
// == I let the nice comment above from 2010

// KONAMI CODE (vars)
// up down left rigth a b
// 38 40 37 39 65 66
const konamiCodeKeyChain = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

// Max time in ms between 2 keystrokes
const konamiDifficultyEasy = 1000;
var konamiDifficulty = konamiDifficultyEasy;

var keyChain = new Array();
var keyLastTime = 0;
var keyGood = 0;

/* ********************************** KONAMI CODE ************************** */
function konamiCheck(_keyCode) {
	var _nowDate = new Date(); 
	var _now = _nowDate.getTime();
	var _diffTime = _now - keyLastTime;
	var _bFailTime = false;
	var _bFailKey = false;
	var _bSuccess = false;

	// == Test if TOO SLOW
	_bFailTime = ((keyLastTime != 0) && (_diffTime > konamiDifficulty)) 

	// == Test if KEY CORRECT
	_bFailKey = (_keyCode != konamiCodeKeyChain[keyGood]) 

	if (_bFailTime || _bFailKey) {
		if (_bFailTime) {
			$("#logspan").html("TOO SLOW on key " + keyGood + " you took " + _diffTime + "ms.");
			if (_bFailKey) {
				$("#logspan").append(" And you were typing the wrong key anyway.")
			}
		} else {
			$("#logspan").html("FAIL ON KEY " + keyGood + ".");
		}
	}

	// == Test if Konami code fully done
	_bSuccess = (keyGood == konamiCodeKeyChain.length - 1)
	if (_bSuccess) {
		$("#logspan").html("!! PERFECT !!");
	}

	// == Exit and reinit if fail or full success
	if (_bFailTime || _bFailKey || _bSuccess) {
		keyGood = 0;
		keyLastTime = 0;
		return _bSuccess;
	}

	// == Key and Time OK, continue counting
	$("#logspan").html("GOOD " + (keyGood + 1));
	keyGood++;
	keyLastTime = _now;
	return false;
}
/* **********************************       ************************** */

function checkKeyR(e) {
	if (konamiCheck(e.keyCode)) {
		// YEAH
	}
}

/* ********************************** READY ************************** */

$(document).ready(function() {
	// == Key listening
	$(document).keyup(checkKeyR);
});

/* **********************************       ************************** */

/*
function konamiCheckOld(_keyCode) {
	var _nowDate = new Date(); 
	var _now = _nowDate.getTime();
	if ((_now - keyLastTime < konamiDifficulty) || (keyLastTime == 0))
	{
		if (_keyCode == konamiCodeKeyChain[keyGood])
		{
			keyGood++;
			console.log("GOOD " + keyGood)
			if (keyGood == konamiCodeKeyChain.length)
			{
				console.log("PERFECT")
				keyGood = 0;
			}
		}
		else
		{
			console.log("FAIL ON KEY " + keyGood)
			keyGood = 0;
		}
	}
	if (keyGood == 0 && _keyCode == konamiCodeKeyChain[0])
	{
		keyGood = 1;
	}
	keyLastTime = _now;
}
*/