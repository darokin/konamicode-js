// quick and dirty as javascript should be ;) [darokin]
var imageDirectory = "images/";
var nekoDir 	= "L";
var nekoPosture = "crouch";
var nekoVer		= "01";
var nekoSpeed	= "2";
var nekoPatience = false;
var nekoCrouchPatience = false;
var nekoWin		= false;

var inuDir 		= "R";
var inuPosture 	= "crouch";
var inuVer		= "01";

var bControlEnable = true;

var bHasMovedOnce = false;

// KONAMI CODE (vars)
// up down left rigth a b
// 38 40 37 39 65 66
var konamiCodeKeyChain=new Array(38, 38, 40, 40, 37, 39, 37, 39, 66, 65);
var konamiDifficulty=550; // temps maximum entre deux touches pour rentrer le konami code (en ms)
var keyChain=new Array();
var keyLastTime=0;
var keyGood=0;
//var keyLapse=0;

function UpdateNeko()
{
	bHasMovedOnce = true;
	nekoPatience = false;
	$("#neko").attr("src", imageDirectory + "Neko_" + nekoDir + "_" + nekoPosture + "_" + nekoVer + ".gif");
}

function UpdateInu()
{
	$("#inu").attr("src", imageDirectory + "Inu_" + inuDir + "_" + inuPosture + "_" + inuVer + ".gif");
}

function endInuHeart()
{
	InuCrouch();
}

function endNekoUp() 
{
	nekoPosture = "stand";
	UpdateNeko();
}

function endNekoReflexe() 
{
	if (nekoPosture == "stand" && nekoWin == false)
	{
		$('#winSign').html("<img id=\"heart\" src=\"images/heartSmallx2.gif\" />");
		nekoWin = true;
		//alert("WIN");
	}
}

function endInuPatience() 
{
	if (nekoPatience == true && nekoWin == false)
	{
		inuPosture = "stand";
		UpdateInu();
		setTimeout("endNekoReflexe()", 900);
	}
}

function endNekoPatience() 
{
	if (nekoPatience == true && nekoWin == false)
	{
		InuCrouch();
		setTimeout("endInuPatience()", 4000);
	}	
}

function InuCrouch() 
{
	inuPosture = "crouch";
	UpdateInu();
}

function NekoFly() 
{
	nekoDir = "R";
	nekoPosture = "fly";
	UpdateNeko();
	$("#spanCat").animate({"marginRight": "10px"}, 2500, function() {
		nekoDir = "L";
		nekoPosture = "crouch";
		UpdateNeko();
		bControlEnable = true;
	});
}


function UpdateGame()
{
	var mR = $("#spanCat").css("margin-right");
	var marginVal = parseInt(mR.substring(0,mR.length-2));
	$("#NekoInfo").html("marginRight = '" + marginVal + "'");
	//setTimeout("UpdateNekoInfo()", 500);
	//var proximiteInu = 260 - marginVal;
	if (marginVal > 300)
	{
		// aboie
		if (inuPosture != "bark" && !nekoWin)
		{
			inuPosture = "bark";
			UpdateInu();
		}
		if (marginVal > 346 && bControlEnable && !nekoWin)
		{
			bControlEnable = false;
			inuPosture = "stand";  // prepare a stopper d'abboyer
			setTimeout("UpdateInu()", 1000);
			setTimeout("InuCrouch()", 1600);
			NekoFly();
		}
		else if (marginVal > 345 && nekoWin && inuPosture != "heart")
		{
			inuPosture = "heart";
			UpdateInu();
			setTimeout("endInuHeart()", 3000);
		}
	}
	else if (marginVal > 245)
	{
		if (marginVal < 280 && inuPosture == "bark") // todo : qqs conditions a fusionner
		{
			inuPosture = "stand";
			UpdateInu();
		}
		else if (inuPosture != "stand")
		{
			inuPosture = "stand";
			UpdateInu();
		}
		
	}
	else if (marginVal < 220 && inuPosture != "crouch")
	{
		inuPosture = "crouch";
		UpdateInu();
	}
	
}

function checkKeyR(e)
{
	if (!bControlEnable)
		return;
		
/* 	// KONAMI CODE (check)
	var _now = getTime();
	if ((_now - keyLastTime > konamiDifficulty) || (keyLastTime == 0))
	{
		keyChain.push(e.keyCode);
		if (keyChain.length >= konamiCodeKeyChain.length)
		{
			var konamiCodeOk = true;
			for (i = konamiCodeKeyChain.length; i > 0; i--)
			{
				if (keyChain[keyChain.length-1-(konamiCodeKeyChain.length-i)] != konamiCodeKeyChain[i-1])
				{
					konamiCodeOk = false;
					break;
				}
			}
			if (konamiCodeOk)
				alert("KONEMI CODE OK !")
		}
	}
	 */
	var _nowDate = new Date(); 
	var _now = _nowDate.getTime();
	if ((_now - keyLastTime < konamiDifficulty) || (keyLastTime == 0))
	{
		if (e.keyCode == konamiCodeKeyChain[keyGood])
		{
			keyGood++;
			if (keyGood == konamiCodeKeyChain.length)
			{
				$('body').css('background-image', 'url(bg3.png)');
				$('body').css('background-color', '#092D34');
				$('#starSign1').html("<img id=\"star1\" src=\"images/star.png\" />");
				$('#starSign2').html("<img id=\"star2\" src=\"images/star.png\" />");
				//alert("Konami Code Ok !");
				keyGood = 0;
			}
		}
		else
		{
			keyGood = 0;
		}
	}
	if (keyGood == 0 && e.keyCode == konamiCodeKeyChain[0])
	{
		keyGood = 1;
	}
	keyLastTime = _now;
	
	
	switch (e.keyCode) 
	{
        case 40://down
            break;
        case 38:
            if (nekoPosture == "up")
			{
				endNekoUp();
				//nekoPosture = "stand";
				//UpdateNeko();
			}
            break;
        case 37:
			//alert(parseInt($("#spanCat").css("margin-right").substring(0,2)));
			if (nekoPosture == "walk")
			{
				nekoPosture = "stand";
				UpdateNeko();
			}
            break;
        case 39://right
			if (nekoPosture == "walk")
			{
				nekoPosture = "stand";
				UpdateNeko();
			}
            break;
        default:
            //alert('?'+e.keyCode+'?');  
    }      
	
	
	UpdateGame();
}

function checkKey(e){
	if (!bControlEnable)
		return;
		

	switch (e.keyCode) {
        case 40://down
            if (nekoPosture != "crouch")
			{
				nekoPosture = "crouch";
				UpdateNeko();
				// == Test si chien debout (proche mais aboie pas
				if (inuPosture == "stand")
				{
					nekoPatience = true;
					setTimeout("endNekoPatience()", 2000);
				}
			}
            break;
        case 38://up
            if (nekoPosture == "crouch")
			{
				nekoPosture = "stand";
				UpdateNeko();
			}
			else if (nekoPosture == "stand")
			{
				nekoPosture = "up";
				UpdateNeko();
				setTimeout("endNekoUp()", 1500);
			}
            break;
        case 37://left
			var mR = $("#spanCat").css("margin-right");
			if (parseInt(mR.substring(0,mR.length-2)) < (360 - parseInt(nekoSpeed)))
			{
				$("#spanCat").animate({"marginRight": "+="+nekoSpeed+"px"}, 1);
				if (nekoPosture != "walk" || nekoDir != "L")
				{
					nekoDir 	= "L";
					nekoPosture = "walk";
					UpdateNeko();
				}
			}
			else
			{
				if (nekoPosture != "stand")
				{
					nekoDir 	= "L";
					nekoPosture = "stand";
					UpdateNeko();
				}
			}
            break;
        case 39://right
			var mR = $("#spanCat").css("margin-right");
            if (parseInt(mR.substring(0,mR.length-2)) > (10 + parseInt(nekoSpeed)))
			{
				$("#spanCat").animate({"marginRight": "-="+nekoSpeed+"px"}, 1);
				if (nekoPosture != "walk" || nekoDir != "R")
				{
					nekoDir 	= "R";
					nekoPosture = "walk";
					UpdateNeko();
				}
			}
			else
			{
				if (nekoPosture != "stand")
				{
					nekoDir 	= "R";
					nekoPosture = "stand";
					UpdateNeko();
				}
			}
            break;
        default:
            //alert('keycode = "' + e.keyCode + '"');  
    }   


	UpdateGame();
}

/* ********************************** READY ************************** */
$(document).ready(function() {
	var queryhash = window.location.hash
	switch (queryhash) {
		case "#about":
			document.title = "Adrien Rebuzzi - About";
			$("#contactL a").animate({opacity: 0.3},500);
			$("#contactL a").hover(	function() {$("#contactL a").animate({opacity: 0.7},200);}, 
									function() {$("#contactL a").animate({opacity: 0.3},200);});
			setTimeout("initialShowAbout()", 1700);
			break;
		case "#contact":
			document.title = "Adrien Rebuzzi - Contact";
			$('#aboutL').css('background-image', 'url(tab88_close.png)');
			$('#contactL').css('background-image', 'url(tab88_open.png)');
			$("#aboutL a").animate({opacity: 0.3},500);
			$("#aboutL a").hover(	function() {$("#aboutL a").animate({opacity: 0.7},200);}, 
									function() {$("#aboutL a").animate({opacity: 0.3},200);});
			setTimeout("initialShowContact()", 1700);
			break;
		default:
			$("#contactL a").animate({opacity: 0.3},500);
			$("#contactL a").hover(	function() {$("#contactL a").animate({opacity: 0.7},200);}, 
									function() {$("#contactL a").animate({opacity: 0.3},200);});
			setTimeout("initialShowAbout()", 1700);
			break;
	}
	//$("#vcard a").hover(showVcardLabel, hideVcardLabel);
	$("#aboutL a").click(showAbout);
	$("#contactL a").click(showContact);
	
	$("#neko").bind("click", UpdateNeko);
/*	
	$("#neko").bind("click", function() {
      var src = ($(this).attr("src") === "cat_anim01.gif") ? "cat02.gif" : "cat_anim01.gif";
      $(this).attr("src", src);
	  $("#spanCat").animate({"marginRight": "+=2px"}, 1000);
	  //$(".block").animate({"left": "-=50px"}, "slow");
		//$(document).keypress(function (e) {
	});
*/
	
	$("#content").hide();
	
	$(".social-bt").animate({opacity: 0.5},1);
	$(".social-bt").hover(	function() {$(this).css("border", "1px solid white");
										$(this).animate({opacity: 1},200);}, 
							function() {$(this).css("border", "1px solid black");
										$(this).animate({opacity: 0.5},200);});
	
	$("#vCardImage").animate({opacity: 0.7},500);
	$("#vCardImage").hover(	function() {$(this).animate({opacity: 1},200);}, 
							function() {$(this).animate({opacity: 0.7},200);});
	
	// == Ecoute des touches
	$(document).keyup (checkKeyR);
	if ($.browser.mozilla) {
		$(document).keypress (checkKey);
	} else {
		$(document).keydown (checkKey);
	}

	//setTimeout("UpdateNekoInfo()", 500);
	
	setTimeout("$('#bubbleMsg').fadeOut(300);", 2000);
	
	// == CYCLE !  image transition effects
	$('.pics').cycle({ 
		fx:    'fade', 
		pause:  2 
	});
});

function initialShowAbout() {
	$("#content").hide();

	setTimeout("$('#content').slideDown('slow');", 500);
	//$('#about').hide();
	$('#about').fadeIn(500);
	//$("#contactL a").animate({opacity: 0.3},500);
}

function initialShowContact() {
	$("#content").hide();
	$('#about').hide();
	setTimeout("$('#content').slideDown('slow');", 500);
	$('#contact').fadeIn(500);
}

function showAbout() {
	document.title = "Adrien Rebuzzi's vCard - About";
	
	$("#content").slideUp(500);
	$("#contact").fadeOut(500);
	setTimeout("$('#contact').hide();", 500);
	setTimeout("$('#about').fadeIn(500);", 500);
	$("#content").slideDown(500);
	
	$("#contactL").css('background-image', 'url(tab88_close.png)');
	$("#aboutL").css('background-image', 'url(tab88_open.png)');
	
	$('#contact').click(showContact);
	$("#aboutL a").click(function() { });
	
	setTimeout("$('#aboutL a').animate({opacity: 1},0);", 1000);
}

function showContact() {

	document.title = "Adrien Rebuzzi's vCard - Contact";

	$("#content").slideUp(500);
	$("#about").fadeOut(500);
	setTimeout("$('#about').hide();", 500);
	setTimeout("$('#contact').fadeIn(500);", 500);
	$("#content").slideDown(500);
	
	$('#aboutL').css('background-image', 'url(tab88_close.png)');
	$('#contactL').css('background-image', 'url(tab88_open.png)');
	
	// aff tips 'control' si pas encore bougé le chat et qu'on passe à contact
	if (!bHasMovedOnce)
	{
		$('#bubbleMsg').attr("src",	"bubbleInfoControl.gif");
		$('#bubbleMsg').fadeIn(300);
		setTimeout("$('#bubbleMsg').fadeOut(300);", 6000);
	}
	//var $this = $(this), handler = arguments.callee;
	//$this.unbind('click', handler);
	
	$("#contactL a").click(function() { return false; });
	$('#about').click(showAbout);
	
	setTimeout("$('#contactL a').animate({opacity: 1},0);", 1000);
	//setTimeout("$('#contactL a').hover(	function() { return false; }, function() { return false; });", 1000);
	//$('#contactL a').removeClass('hover');
					
	$("#aboutL a").animate({opacity: 0.3},500);
	$("#aboutL a").hover(	function() {$("#aboutL a").animate({opacity: 0.7},200);}, 
							function() {$("#aboutL a").animate({opacity: 0.3},200);});
}
