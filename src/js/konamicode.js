// quick and dirty as javascript should be ;) [darokin]
// == I let the nice comment above from 2010

// KONAMI CODE (vars)
// up down left rigth a b
// 38 40 37 39 65 66
const konamiCodeKeyChain = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
const konamiPicsSize = "48x45"
const konamiPics = [
	"kc_up_" + konamiPicsSize + ".png",
	"kc_up_" + konamiPicsSize + ".png",
	"kc_down_" + konamiPicsSize + ".png",
	"kc_down_" + konamiPicsSize + ".png",
	"kc_left_" + konamiPicsSize + ".png",
	"kc_right_" + konamiPicsSize + ".png",
	"kc_left_" + konamiPicsSize + ".png",
	"kc_right_" + konamiPicsSize + ".png",
	"kc_b_" + konamiPicsSize + ".png",
	"kc_a_" + konamiPicsSize + ".png"
]
const konamiText = [
	"UP", "UP",
	"DOWN", "DOWN",
	"LEFT", "RIGHT",
	"LEFT", "RIGHT",
	"B", "A"
]

const iconError = "<i class=\"fas fa-times\"></i>";
const iconOk = "<i class=\"fas fa-check-circle\"></i>";
const iconSuccess = "<i class=\"fas fa-heart\"></i>";

// Max time in ms between 2 keystrokes
const difficulties = [
	{"text": "Easy", 
	"speed": 777},
	{"text": "Normal", 
	"speed": 420},
	{"text": "Hard", 
	"speed": 300},
	{"text": "Hard++", 
	"speed": 180}
]
var konamiDifficulty;

var keyChain = new Array();
var keyLastTime = 0;
var keyGood = 0;

var bWait = false;

/* ********************************** KONAMI CODE ************************** */
function konamiCheck(_keyCode) {
	if (bWait) {
		return;
	}

	let _nowDate = new Date(); 
	let _now = _nowDate.getTime();
	let _diffTime = _now - keyLastTime;
	let _bFailTime = false;
	let _bFailKey = false;
	let _bSuccess = false;

	// == Test if TOO SLOW
	_bFailTime = ((keyLastTime != 0) && (_diffTime > konamiDifficulty)) 

	// == Test if KEY CORRECT
	_bFailKey = (_keyCode != konamiCodeKeyChain[keyGood]) 

	if (_bFailTime || _bFailKey) {
		if (_bFailTime) {
			$("#logspan").html(iconError + " Too slow on key n°" + (keyGood + 1) + " [" + konamiText[keyGood] + "] you took " + _diffTime + "ms.");
			if (_bFailKey) {
				$("#logspan").append(" You were typing the wrong key anyway ;)")
			}
		} else {
			$("#logspan").html(iconError + " Fail on key n°" + (keyGood + 1) + " [" + konamiText[keyGood] + "].");
		}
	}

	// == Update visuals
	updateKeyVisuals(keyGood, (_bFailTime || _bFailKey))

	// == Test if Konami code fully done
	_bSuccess = (!_bFailTime && !_bFailKey && keyGood == konamiCodeKeyChain.length - 1)

	// == Exit and reinit if fail or full success
	if (_bFailTime || _bFailKey || _bSuccess) {
		startWait(keyGood, _bSuccess)
		keyGood = 0;
		keyLastTime = 0;
		return _bSuccess;
	}

	// == Key and Time OK, continue counting
	$("#logspan").html(iconOk + " Key n°" + (keyGood + 1) + " [" + konamiText[keyGood] + "] validated.");
	$("#key" + keyGood).css("opacity", 1);
	keyGood++;
	keyLastTime = _now;
	return false;
}
/* **********************************       ************************** */

function updateKeyVisuals(_indKey, _bFail) {
	if (_bFail) {
		$("#key" + _indKey).addClass("red");	
	}
	$("#key" + _indKey).css("opacity", 1);
}

function resetLog() {
	$("#logspan").html("Start typing when you are ready");
}

function resetKeysVisuals(_indKey, _bSuccess) {
	for (i = 0; i < konamiPics.length; i++) {
		$("#key" + i).css("opacity", .2);
		if (_bSuccess) {
			$("#key" + i).removeClass("green");
		}
	}
	if (!_bSuccess) {
		$("#key" + _indKey).removeClass("red");
	}
}

function checkKeyR(e) {
	if (konamiCheck(e.keyCode)) {
		// YEAH
		for (i = 0; i < konamiPics.length; i++) {
			$("#key" + i).addClass("green");
		}
		$("#logspan").html(iconSuccess + " WELL DONE!");
	}
}

function setDifficulty(_speed) {
	konamiDifficulty = _speed;
	keyGood = 0;
	keyLastTime = 0;
	resetKeysVisuals(0, false);
	resetLog()
}

function testSleep() {
	if (bWait) {
		return;
	}
	let _nowDate = new Date(); 
	let _now = _nowDate.getTime();
	let _diffTime = _now - keyLastTime;

	// == The user is typing but took 2 times the delay and no input
	if ((keyLastTime != 0) && (_diffTime > (konamiDifficulty * 2))) {
		updateKeyVisuals(keyGood, true);
		$("#logspan").html(iconError + " Are you sleeping?");
		startWait(keyGood, false);
		keyGood = 0;
		keyLastTime = 0;
	}
	//setTimeout(function() { testSleep() }, 2000);
}

function startWait(_indKey, _bSuccess) {
	bWait = true;
	setTimeout(function() { bWait = false; resetKeysVisuals(_indKey, _bSuccess); resetLog(); }, (_bSuccess ? 40000 : 20000));
}

/* ********************************** READY ************************** */

$(document).ready(function() {
	// == Key listening
	$(document).keyup(checkKeyR);
	
	// == Init keys
	let i = 0;
	for (const elem of konamiPics) {
		$("#keysection").append("<img id=\"key" + i + "\" class=\"key\" src=\"imgs/" + elem + "\"></img>")
		i++
	}

	// == Init difficulties
	i = 0;
	difficulties.forEach(difflevel => {
		let strButton = "<button class=\"button buttonunselected\" id=\"bt" + i + "\" onclick=\"setDifficulty(" + difflevel.speed + ");\" href=\"#\">" + difflevel.text + "</button>";
		let strCol = "<div class=\"column\">" + strButton;
		strCol += "<br /><small>" + difflevel.speed + " ms</small></div>";
		$("#difficultysection").append("" + strCol + "");
		i++;
	});

	// Handle button selection
	$.each($('.buttonunselected'), function (key, value) {
		$(this).click(function (e) {
		  $('.buttonselected').removeClass('buttonselected').addClass('buttonunselected');
		  $(this).removeClass('buttonunselected').addClass('buttonselected');
		});
	});
	// == Set difficulty to normal by default
	konamiDifficulty = difficulties[1].speed
	$("#bt1").addClass("buttonselected");
	$("#bt1").removeClass("buttonunselected");

	// == Init log
	resetLog();

	// == Test user input delay too long
	setInterval(function() { testSleep(); }, 500);
});

/* **********************************       ************************** */

/* 2010 version
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