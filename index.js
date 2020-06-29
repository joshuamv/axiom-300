
//////////////// global vars /////////////////

var currentMission; //sets dialogues for ava and earth
var pcPassword = []; //currently logged password
var pcUnlocked = true; //locked or unlocked
var avaMental = false; //true = crazy dialogues
var avaComplaint = 1; //dialogue played when she complains
var ongoingCall = true; //true = there's an on going call at the moment
var connectionLevel = true; //true = there's service, false call can't be made
var autoPilot = true; //true = autopilot on
var coordinatesStatus = false; //true = right coordinates entered
var coordinatesEntered = []; //array with three items, each represents a coordinate pair of numbers
var gameOverVar = false; //false = game hasn't been won yet. true = game won
//on off buttons. true = on, false = off
var oxygenLevel = 84;
var fuelLevel = 46;
var pc = true;
var ava = true;
var oxygen = true;
var intervalUp;
var intervalDown;
//landing
var gravity;
var sidePosition;
//global vars
var avaIntro;
var callIntro;
var speakingStartIntro;
var speakingOverIntro;
var oxyDownInterval;
var oxyUpInterval;
var earthIntroCC1;
var earthIntroCC2;
var avaTalkingAnimation;

//////////////// load html /////////////////

$(document).ready(function() {

  //show landingEngine(100) and hide $("#landing-game").hide(); to debug landing game
  // landingEngine(100);
  $("#landing-game").hide();
  //show loading screen + welcome screen, and hide other screens
  $("#game-over-screen").hide();
  $("#game-won-screen").hide();
  $("#dizzy").hide();
  $("#pc-bar").hide();
  $("#loading-screen").show();
  setTimeout(loadingScreen, 1000);

  //set ship's computer screen//
  $("#locked-screen").hide();
  $("#off-screen").hide();
  $("#info-screen").hide();
  $("#earth-coordinates").hide();
  $("#coordinate-error").hide();
  $("#coordinate-ok").hide();
  $("#change-coordinate").hide();
  $("#mouse-text").hide();
  $("#enter-coordinates").hide();
  $("#o2-off").hide();
  $("#o2-error").hide();
  $("#o2-low").hide();
  $("#o2-low-but-on").hide();
  $("#skip-intro").hide();
  $("#subtitles").hide();

  //set AVA screens to global vars
  $("#o2-percent").html(oxygenLevel + "%");
  $("#o2-percent-error").html(oxygenLevel + "%");
  $("#o2-percent-off").html(oxygenLevel + "%");
  $("#o2-percent-low").html(oxygenLevel + "%");
  $("#o2-percent-rising").html(oxygenLevel + "%");
  var barOxygenLevel = oxygenLevel/1.5625; //map AVA screen values//
  $(".bar-filling").width(barOxygenLevel);
  var barFuelLevel = fuelLevel/1.5625; //map AVA screen values//
  $(".fuel-bar-filling").width(barFuelLevel);
  $("#fuel-percent").html(fuelLevel + "%");

  //buttons click to run functions//
  $(".start-button").on("click", startGame);
  $("#pc-button").on("click", pcButton);
  $("#ava-button").on("click", avaButton);
  $("#o2-button").on("click", oxygenButton);
  $(".ava-on").on("click", avaSpeech);
  $("#autom-pilot").on("click", automPilot);
  $("#contact-earth").on("click", contactEarth);
  $("#ship-info").on("click", shipInfo);
  $("#close-button").on("click", homeScreen);
  $("#change-coordinate").on("click", deleteCoordinates);
  $("#o2-level").on("click", o2ava);
  $("#o2-error").on("click", o2ava);
  $("#o2-off").on("click", o2ava);
  $("#o2-low").on("click", o2ava);
  $("#o2-low-but-on").on("click", o2ava);
  $("#fuel-level").on("click", fuelAva);
  $("#speed").on("click", engineAva);
  $("#left-cam").on("click", leftcamAva);
  $("#front-cam").on("click", frontcamAva);
  $("#back-cam").on("click", backcamAva);
  $("#right-cam").on("click", rightcamAva);
  $("#destination").on("click", destinationAva);
  $(".radar").on("click", radar);
  $("#skip-intro").on("click", skipIntro);
  $("#reload-website").on("click", reloadWebsite);

  //password checks and reset//
  $(".password-button").click(function(){
    var inputPassword = $("input[name$='password']").val();
    pcPassword.push(inputPassword);
    console.log(pcPassword);
    checkPassword();
  });

  $('#password').on('keyup', function() {
    $('#password').removeClass('wrong-password');
  });

  //coordinates checks and reset//
  $("#enter-coordinate").click(function(){
    var inputCoordinate1 = $("input[name$='coordinates1']").val();
    var inputCoordinate2 = $("input[name$='coordinates2']").val();
    var inputCoordinate3 = $("input[name$='coordinates3']").val();
    coordinatesEntered.push(inputCoordinate1);
    coordinatesEntered.push(inputCoordinate2);
    coordinatesEntered.push(inputCoordinate3);
    console.log(coordinatesEntered);
    coordinatesCheck();
  });

  $('#coordinates1').on('keyup', function() {
    $('#coordinates1').removeClass('wrong-password');
    $("#coordinate-error").hide();
  });

  $('#coordinates2').on('keyup', function() {
    $('#coordinates2').removeClass('wrong-password');
    $("#coordinate-error").hide();
  });

  $('#coordinates3').on('keyup', function() {
    $('#coordinates3').removeClass('wrong-password');
    $("#coordinate-error").hide();
  });
  //end of doc ready//
});



///////////////// functions ///////////////////

function startGame() {
  //button click
  $('#gamebutton')[0].play();
  //play backgorund music
  $('#background')[0].play();
  //start fuel down
  fuelDownInterval(10000);
  $("#skip-intro").show();
  $("#pc-bar").show();
  speakingStarts();
  $(".start-screen").hide();
  $('#autom-pilot').toggleClass('error-background warning-background');
  currentMission = 0;
  callStarted();
  currentMission = 100;
  //intro speeches timing
  avaIntro = setTimeout(avaSpeech, 21200);
  callIntro = setTimeout(callEnded, 21202);
  speakingStartIntro = setTimeout(speakingStarts, 21400);
  speakingOverIntro = setTimeout(speakingOver, 32700);
}

function skipIntro() {
  $('#gamebutton')[0].play();
  $('#earth0')[0].pause();
  $("#skip-intro").hide();
  currentMission = 100;
  setTimeout(function(){
    speakingOver();
    return;
  }, 100);
  //stop subtitles and audio timeouts, stop them from from running and updating
  clearTimeout(avaIntro);
  clearTimeout(callIntro);
  clearTimeout(speakingStartIntro);
  clearTimeout(speakingOverIntro);
  clearTimeout(earthIntroCC1);
  clearTimeout(earthIntroCC2);
  callEnded();
  return;
}

//hides the loading screen after it is run. set timeout
function loadingScreen() {
  $("#loading-screen").hide();
}

function gameOver() {
  $("#game-over-screen").fadeIn(500);
  $('#gameover')[0].play();
}

function gameWon() {
  $("#game-won-screen").fadeIn(500);
  //play game won sound
  $('#win')[0].play();
}

//wait text follows the cursor's x and y
$(document).on('mousemove', function(e){
    $('#mouse-text').css({
       left:  e.pageX-20,
       top:   e.pageY
    });
});

//replay the game reloads the website
function reloadWebsite() {
  location.reload(true);
}

function landingEngine(speed) {
  gravity = 3;
  sidePosition = 3;
  var landingDownInterval = setInterval(function(){
    gravity++;
    if(gravity == 98) {
      clearInterval(landingDownInterval);
      checkLanding();
      return;
    }
    //link arrow keys to movement of ship
    $(document).keydown(function(pk){
      if(pk.keyCode == "37"){
        console.log("ship moved left");
        console.log(sidePosition);
        //left arrow
        --sidePosition;
        if (sidePosition < 0) {
          sidePosition = 0;
        }
      }
      if(pk.keyCode == "39"){
        console.log("ship moved right");
        console.log(sidePosition);
        //right arrow
        ++sidePosition;
        if (sidePosition > 98) {
          sidePosition = 98;
        }
      }
    });
    $('#ship-landing').css('top', gravity + "vh");
    $('#ship-landing').css('left', sidePosition + "vw");
  }, speed);
}

//see if landed on platform
function checkLanding() {
  //landed
  if (sidePosition > 84 && sidePosition < 94) {
    console.log("Axiom has landed");
    gameOverVar = true;
    $("#high-score-number").html(fuelLevel + "%")
    $("#score-number").html(fuelLevel)
    setTimeout(gameWon);
  }
    //close to landing but lost
  if (sidePosition == 82 || sidePosition == 83 || sidePosition == 84 || sidePosition == 96 || sidePosition == 95 || sidePosition == 94) {
    console.log("Axiom has crashed");
    gameOverVar = true;
    $("#game-over-text").html("THAT WAS SO CLOSE BUT AXIOM 300 HAS CRASHED, YOU DIED :(")
    setTimeout(gameOver);
  }
  //crashed the ship
  if (sidePosition < 82 || sidePosition > 96){
    console.log("Axiom has crashed");
    gameOverVar = true;
    $("#game-over-text").html("AXIOM 300 HAS CRASHED, YOU DIED :(")
    setTimeout(gameOver);
  }
}

function speakingStarts() {
  $('*').css('cursor', 'none');
  $('body').off('click');
  //show pointer on skip button
  $( "#skip-intro" ).mouseover(function() {
    $('*').css('cursor', 'pointer');
    $("#mouse-text").hide();
  });
  $( "#skip-intro" ).mouseout(function() {
    $('*').css('cursor', 'none');
    $("#mouse-text").show();
  });
  // bind click to skip button
  $('#skip-button').on('click');
  $("#mouse-text").show();
  showSubtitles();
}

function speakingOver() {
  setTimeout(function () {
    hideSubtitles();
    //set mouse to pointer where needed
    $("#mouse-text").hide();
    $('*').css('cursor', 'auto');
    $('.ava-screen').css('cursor', 'pointer');
    $('.screen-widget').css('cursor', 'pointer');
    $('.coordinate-button').css('cursor', 'pointer');
    $('.radar').css('cursor', 'pointer');
    $('.password-button').css('cursor', 'pointer');
    $('.button').css('cursor', 'pointer');
    $('.start-button').css('cursor', 'pointer');
    $('.skip-button').css('cursor', 'pointer');
    $('.pointer-text').css('cursor', 'pointer');
    $('.default-text').css('cursor', 'default');
    //turn the click back on
    $('*').on('click');
    return;
  }, 150);
}

function showSubtitles() {
  $("#subtitles").show();
}

function hideSubtitles() {
  $("#subtitles").hide();
}

function pauseAva100() {
  $('#ava100')[0].pause()
  return;
}

function pcButton() {
  pcUnlocked = false;
  if (pc == true) {
    if (avaMental == true) {
      //ava disables everything
      $('#phybutton')[0].play();
      $('#ava420')[0].play();
      speakingStarts();
      $("#subtitles").html("AVA: I'm sorry Yossef, I'm affraid I can't let you do that...");
      setTimeout(avaBack, 6000);
    }else{
      //pc off
      $('#phybutton')[0].play();
      $(".screen").hide();
      $("#locked-screen").hide();
      $("#off-screen").show();
      $("#info-screen").hide();
      $('#pc-button').toggleClass('pc-off');
      callEnded();
      pc = false;
    }
  } else {
    if (avaMental == true) {
      //ava disables everything
      $('#phybutton')[0].play();
      $('#ava420')[0].play();
      speakingStarts();
      $("#subtitles").html("AVA: I'm sorry Yossef, I'm affraid I can't let you do that...");
      setTimeout(avaBack, 6000);
    }else{
      //pc on goes to locked screen
      $('#phybutton')[0].play();
      $("#locked-screen").show();
      $(".screen").hide();
      $("#off-screen").hide();
      $("#info-screen").hide();
      $('#pc-button').removeClass('pc-off');
      pc = true;
      if (currentMission == 110) {
        currentMission = 120; //mission goes to 1.2 only when you're in the first part.
        // If you reset the computer in other missions it shouldn't change the dialogues
      }
    }
  }
  return;
}

//ava

function avaButton() {
  if (ava == true) {
    if (avaMental == true) {
      //ava disables everything
      $('#phybutton')[0].play();
      $('#ava420')[0].play();
      speakingStarts();
      $("#subtitles").html("AVA: I'm sorry Yossef, I'm affraid I can't let you do that...");
      setTimeout(avaBack, 6000);
    }else {
      //ava off
      $('#phybutton')[0].play();
      $('#ava').toggleClass('ava-on ava-off');
      $('#ava-light').removeClass('ava-eye-dark-red');
      $('#ava-light-background').removeClass('ava-click');
      $(".ava-eye-light-red").hide();
      $(".ava-eye-yellow").hide();
      $('#ava-light').addClass('ava-eye-red-off');
      ava = false;
      $('#ava-button').toggleClass('ava-off');
      setTimeout(function(){
        $('#avaoff')[0].play();
        return;
      }, 100);
    }
  } else {
    if (avaMental == true) {
      //ava disables everything
      $('#phybutton')[0].play();
      $('#ava420')[0].play();
      speakingStarts();
      $("#subtitles").html("AVA: I'm sorry Yossef, I'm affraid I can't let you do that...");
      setTimeout(avaBack, 6000);
      return;
    }else {
      //ava on
      $('#phybutton')[0].play();
      $('#ava').toggleClass('ava-on ava-off');
      $('#ava-light').addClass('ava-eye-dark-red');
      $('#ava-light-background').addClass('ava-click');
      $(".ava-eye-light-red").show();
      $(".ava-eye-yellow").show();
      $('#ava-light').removeClass('ava-eye-red-off');
      $('#ava-button').removeClass('ava-off');
      ava = true;
      //ava complains after being turned off
      setTimeout(function(){
        $('#avaon')[0].play();
        setTimeout(avaComplains, 1700);
        return;
      }, 100);
    }
  }
}

//ava talking animation
var start = 0;
function sineAvaTalking(){
  var sinMovSmall = 1.1 * Math.sin(start) + 3 + 'px';
  var sinMovMedium = 4 * Math.sin(start) + 15 + 'px';
  var sinMovBig = 1.2 * Math.sin(start) + 30 + 'px';
  $('.ava-eye-yellow').css("height",sinMovSmall);
  $('.ava-eye-yellow').css("width",sinMovSmall);
  $('.ava-eye-light-red').css("height",sinMovMedium);
  $('.ava-eye-light-red').css("width",sinMovMedium);
  $('.ava-eye-dark-red').css("height",sinMovBig);
  $('.ava-eye-dark-red').css("width",sinMovBig);
  // avaEyeSpeech.style.width = sinMov;
  start += 0.16;
}

//fuel functions

function fuelDownInterval(speed){
  var intervalUp = setInterval(function(){
    --fuelLevel;
    //stop fuel from going below 0
    if(fuelLevel === 0) {
      clearInterval(intervalUp);
      console.log("down stopped")
    }
    //stop fuel going down after game is over
    if(gameOverVar == true) {
      clearInterval(intervalUp);
      return;
    }
    fuelDown();
  }, speed);
}

function fuelDown() {
  var barFuelLevel = fuelLevel/1.5625; //map AVA screen values//
  $(".fuel-bar-filling").width(barFuelLevel);
  $("#fuel-percent").html(fuelLevel + "%");
  //warning fuel <15%
  if (fuelLevel < 15) {
    $("#fuel-level").addClass(".warning-background");
    $("#fuel-level").removeClass(".fuel-level-background");
  }
  //warning fuel <5%!
  if (fuelLevel < 5) {
    $('#alarm')[0].play();
    $("#fuel-level").addClass(".error-background");
    $("#fuel-level").removeClass(".fuel-level-background");
    $("#fuel-level").removeClass(".warning-background");
  }
  //game over
  if (fuelLevel == 0) {
    $("#game-over-text").html("NO FUEL = NO OXYGEN PRODUCTION, YOU DIED :(")
    setTimeout(gameOver);
  }
}

//oxygen functions

function oxygenButton() {
  if (oxygen == true) {
    if (avaMental == true) {
      //ava disables everything
      $('#phybutton')[0].play();
      $('#ava420')[0].play();
      speakingStarts();
      $("#subtitles").html("AVA: I'm sorry Yossef, I'm affraid I can't let you do that...");
      setTimeout(avaBack, 6000);
    }else{
      $('#phybutton')[0].play();
      $('#oxyoff')[0].play();
      oxygen = false;
      $("#o2-level").hide();
      $("#o2-off").show();
      $("#o2-error").hide();
      $("#o2-low").hide();
      $("#o2-low-but-on").hide();
      $('#coordinates3').removeClass('wrong-password');
      $('#o2-button').toggleClass('o2-off');
      console.log("up stopped");
      downInterval(300);
    }
  } else {
    if (avaMental == true) {
      //ava disables everything
      $('#phybutton')[0].play();
      $('#ava420')[0].play();
      speakingStarts();
      $("#subtitles").html("AVA: I'm sorry Yossef, I'm affraid I can't let you do that...");
      setTimeout(avaBack, 6000);
    }else{
      $('#phybutton')[0].play();
      $('#oxyon')[0].play();
      oxygen = true;
      if (oxygenLevel < 20) {
        $("#o2-level").hide();
        $("#o2-off").hide();
        $("#o2-error").hide();
        $("#o2-low").hide();
        $("#o2-low-but-on").show();
      } else {
        $("#o2-level").show();
        $("#o2-off").hide();
        $("#o2-error").hide();
        $("#o2-low").hide();
        $("#o2-low-but-on").hide();
      }
    }
    $('#o2-button').removeClass('o2-off');
    console.log("down stopped");
    upInterval(2000);
  }
  return;
}

function downInterval(speed){
  var oxyDownInterval = setInterval(function(){
    --oxygenLevel;
    //stop oxygen from going below 0
    if(oxygenLevel === 0) {
      clearInterval(oxyDownInterval);
      console.log("down stopped")
    }
    //if oxygen is turned on, stop the down interval otherwise it gets stuck in the same number
    if(oxygen == true) {
      clearInterval(oxyDownInterval);
      return;
    }
    oxyDown();
  }, speed);
}

//update oxygen screen every interval
function oxyDown() {
  $("#o2-percent").html(oxygenLevel + "%");
  $("#o2-percent-error").html(oxygenLevel + "%");
  $("#o2-percent-off").html(oxygenLevel + "%");
  $("#o2-percent-low").html(oxygenLevel + "%");
  $("#o2-percent-rising").html(oxygenLevel + "%");
  var barOxygenLevel = oxygenLevel/1.5625; //map AVA screen values//
  $(".bar-filling").width(barOxygenLevel);
  //if oxygen is low display error
  if (oxygenLevel < 20) {
    $("#o2-level").hide();
    $("#o2-off").hide();
    $("#o2-error").hide();
    $("#o2-low").show();
    $("#o2-low-but-on").hide();
    $('#alarm')[0].play();
  }
  //if oxygen is 0 game over
  if (oxygenLevel == 0) {
    $("#dizzy").fadeIn(2000);
    setTimeout(gameOver, 2000);
  }
}

function upInterval(speed){
  var oxyUpInterval = setInterval(function(){
    ++oxygenLevel;
    //stop oxygen from going over 84, thats the default level
    if(oxygenLevel === 84){
      console.log("down stopped")
      clearInterval(oxyUpInterval);
    }
    //if oxygen is turned off, stop the up interval otherwise it gets stuck in the same number
    if(oxygen == false) {
      clearInterval(oxyUpInterval);
      return;
    }
    oxyUp();
  }, speed);
}

//update oxygen screen every interval
function oxyUp() {
  $("#o2-percent").html(oxygenLevel + "%");
  $("#o2-percent-error").html(oxygenLevel + "%");
  $("#o2-percent-off").html(oxygenLevel + "%");
  $("#o2-percent-low").html(oxygenLevel + "%");
  $("#o2-percent-rising").html(oxygenLevel + "%");
  var barOxygenLevel = oxygenLevel/1.5625; //map AVA screen values//
  $(".bar-filling").width(barOxygenLevel);
  if (oxygenLevel > 20) {
    $("#o2-level").show();
    $("#o2-off").hide();
    $("#o2-error").hide();
    $("#o2-low").hide();
    $("#o2-low-but-on").hide();
  }
}

//oxygen stops working
function downIntervalError(speed){
  var oxyDownInterval = setInterval(function(){
    --oxygenLevel;
    if(oxygenLevel === 0) {
      clearInterval(oxyDownInterval);
      console.log("down stopped")
    }
    if(oxygen == true) {
      clearInterval(oxyDownInterval);
      return;
    }
    oxyDownError();
  }, speed);
}

function oxyDownError() {
  $("#o2-percent-error").html(oxygenLevel + "%");
  var barOxygenLevel = oxygenLevel/1.5625; //map AVA screen values//
  $(".bar-filling").width(barOxygenLevel);
  if (oxygenLevel < 20) {
    $('#alarm')[0].play();
  }
  if (oxygenLevel == 0) {
    $("#dizzy").fadeIn(2000);
    setTimeout(gameOver, 2000);
  }
}

function oxygenError() {
  avaMental = true;
  //oxygen down
  downIntervalError(300);
  $("#o2-level").hide();
  $("#o2-off").hide();
  $("#o2-error").show();
  $("#o2-low").hide();
  $("#o2-low-but-on").hide();
  //pc doesn't working
  $("#autom-pilot").hide();
  $("#contact-earth").hide();
  $("#ship-info").hide();
  $(".radar").hide();
  speakingStarts();
  $('#alarm')[0].play();
  $("#subtitles").html("*alarm*");
  currentMission = 410;
  setTimeout(avaSpeech, 3000);
  return;
}

function avaBack() {
  //ava gets everything back to normal
  $("#o2-level").show();
  $("#o2-off").hide();
  $("#o2-error").hide();
  $("#o2-low").hide();
  $("#o2-low-but-on").hide();
  //oxygen up
  upInterval(1000);
  $("#subtitles").html("AVA: Just kidding! Haha. You really bought it, didn't you? Have a safe trip back home.");
  setTimeout(function () {
    speakingOver();
    return;
  }, 6500);
  setTimeout(function () {
    $("#landing-game").show();
    landingEngine(100);
    return;
  }, 6600);
  return;
}


///////// ship computer functions //////////


function checkPassword() {
  //input from field goes to var pcPassword
  if (pcPassword == "axiom3003") {
    //password is right
    pcUnlocked = true;
    $('#ok')[0].play();
    $("#off-screen").hide();
    $(".screen").show();
    $("#locked-screen").hide();
    $("#info-screen").hide();
    $('#password').val('');
    pcPassword = [];
    if (currentMission == 120 || currentMission == 121 || currentMission == 122 || currentMission == 123) {
      currentMission = 130;
    }
    }else{
    //password is wrong
    $('#error')[0].play();
    $("#forgot").show();
    $('#password').toggleClass('wrong-password');
    $('#password').focus(
      function(){
          $(this).val('');
    });
    pcPassword = [];
    if (currentMission == 120) {
      currentMission = 121;
    }
  }
}

//when enter is pressed submit password
$('input').bind("enterKey",function(e){
  alert("Enter");
});

(function($) {
    $.fn.onEnter = function(func) {
        this.bind('keypress', function(e) {
            if (e.keyCode == 13) func.apply(this, [e]);
        });
        return this;
     };
})(jQuery);

$( function () {
    console.log($("input"));
    $("#password").onEnter( function() {
      var inputPassword = $("input[name$='password']").val();
      pcPassword.push(inputPassword);
      console.log(pcPassword);
      checkPassword();
    });
});

//calling earth
function contactEarth() {
  $('#simon-beep')[0].play();
  if (ongoingCall == false && connectionLevel == true) {
    callStarted();
  }else{
    callEnded();
    //stop speech audio//
  }
}

function callStarted() {
  $('#contact-earth').toggleClass('ok-background');
  $("#contact-earth-status").text("ON-GOING CALL");
  speakingStarts();
  ongoingCall = true;
  earthSpeech();
}

function callEnded() {
  ongoingCall = false;
  $('#contact-earth').removeClass('ok-background');
  $("#contact-earth-status").text("CONECTION IS STABLE");
  speakingOver();

  //prevents two audio files from playing together by delaying callEnded
  if (currentMission == 100) {
    currentMission = 110;
  }
  if (currentMission == 300) {
    currentMission = 310;
  }
}

//autopilot button
function automPilot() {
  $('#simon-beep')[0].play();
  if (autoPilot == false) {
    autoPilotOn();
    $("#enter-coordinates").hide();
    $("#system-ok").show();
    $('#ship-info').removeClass('ok-background');
    $('#ship-info').removeClass('warning-background');
  }else{
    autoPilotOff();
    if (currentMission == 210 || currentMission == 211) {
      currentMission = 220;
    }
    $("#enter-coordinates").show();
    $('#ship-info').addClass('warning-background');
    $('#ship-info').removeClass('ok-background');
    $("#system-ok").hide();
  }
}

function autoPilotOn() {
  $('#autom-pilot').toggleClass('error-background');
  $("#autopilot-title-status").text("AUTOPILOT ON");
  $("#autopilot-status").text("AUTOPILOT ERROR");
  autoPilot = true;
  if (currentMission > 220 && ava == false) {
    currentMission = 210;
  }
  //go back a step in the mission if autopilot is turned on
  if (currentMission > 220 && ava == true) {
    currentMission = 210;
    $('#ava940')[0].play();
    $("#subtitles").html("AVA: You should probably leave the autopilot off, it's not working properly.");
    speakingStarts();
    setTimeout(speakingOver, 4000)
  }
}

function autoPilotOff() {
  $('#autom-pilot').removeClass('error-background');
  $("#autopilot-title-status").text("AUTOPILOT OFF");
  $("#autopilot-status").text("MANUAL MODE");
  autoPilot = false;
  console.log("autopilot off")
}

function shipInfo() {
  $('#simon-beep')[0].play();
  $("#locked-screen").hide();
  $("#off-screen").hide();
  $(".screen").hide();
  $("#info-screen").show();
  if (currentMission == 310) {
    currentMission = 320;
  }
}

//go back home when the "x" is pressed in the ship info menu
function homeScreen() {
  $('#simon-beep')[0].play();
  $("#locked-screen").hide();
  $("#off-screen").hide();
  $(".screen").show();
  $("#info-screen").hide();
  if (coordinatesEntered[0] == [60] && coordinatesEntered[1] == [89] && coordinatesEntered[2] == [69]) {
    return;
  }else{
    $("#coordinate-error").hide();
    $("#coordinates1").val('');
    $("#coordinates3").val('');
    $("#coordinates2").val('');
    $('#coordinates1').removeClass('wrong-password');
    $('#coordinates2').removeClass('wrong-password');
    $('#coordinates3').removeClass('wrong-password');
    coordinatesEntered = [];
  }
}

function coordinatesCheck() {
  if (coordinatesEntered[0] == [60] && coordinatesEntered[1] == [89] && coordinatesEntered[2] == [69]) {
    coordinatesStatus == true
    if (currentMission == 310 || currentMission == 320 || currentMission == 321 || currentMission == 322) {
      currentMission = 330;
    }
    $('#ok')[0].play();
    $('#ship-info').addClass('ok-background');
    $('#ship-info').removeClass('warning-background');
    $("#coordinate-ok").show();
    $("#change-coordinate").show();
    $("#enter-coordinate").hide();
    $("#enter-coordinates").hide();
    $("#system-ok").show();
  }else {
    $("#coordinate-error").show();
    $('#error')[0].play();
    coordinatesEntered = [];
    $('#ship-info').addClass('warning-background');
    $('#ship-info').removeClass('ok-background');
    $('#coordinates1').toggleClass('wrong-password');
    $('#coordinates2').toggleClass('wrong-password');
    $('#coordinates3').toggleClass('wrong-password');
    $("#enter-coordinates").show();
    $("#system-ok").hide();
    //clear input when wrong when they're clicked
    $('#coordinates1').focus(
      function(){
          $(this).val('');
    });
    $('#coordinates2').focus(
      function(){
          $(this).val('');
    });
    $('#coordinates3').focus(
      function(){
          $(this).val('');
    });
    if (currentMission == 310) {
      currentMission = 320;
    }
  }
}

//link enter key to enter button on screen to submit coordinates

$( function () {
    console.log($("input"));
    $("#coordinates1").onEnter( function() {
      var inputCoordinate1 = $("input[name$='coordinates1']").val();
      var inputCoordinate2 = $("input[name$='coordinates2']").val();
      var inputCoordinate3 = $("input[name$='coordinates3']").val();
      coordinatesEntered.push(inputCoordinate1);
      coordinatesEntered.push(inputCoordinate2);
      coordinatesEntered.push(inputCoordinate3);
      console.log(coordinatesEntered);
      coordinatesCheck();
    });
});

$( function () {
    console.log($("input"));
    $("#coordinates2").onEnter( function() {
      var inputCoordinate1 = $("input[name$='coordinates1']").val();
      var inputCoordinate2 = $("input[name$='coordinates2']").val();
      var inputCoordinate3 = $("input[name$='coordinates3']").val();
      coordinatesEntered.push(inputCoordinate1);
      coordinatesEntered.push(inputCoordinate2);
      coordinatesEntered.push(inputCoordinate3);
      console.log(coordinatesEntered);
      coordinatesCheck();
    });
});

$( function () {
    console.log($("input"));
    $("#coordinates3").onEnter( function() {
      var inputCoordinate1 = $("input[name$='coordinates1']").val();
      var inputCoordinate2 = $("input[name$='coordinates2']").val();
      var inputCoordinate3 = $("input[name$='coordinates3']").val();
      coordinatesEntered.push(inputCoordinate1);
      coordinatesEntered.push(inputCoordinate2);
      coordinatesEntered.push(inputCoordinate3);
      console.log(coordinatesEntered);
      coordinatesCheck();
    });
});

//delete previously entered coordinates
function deleteCoordinates() {
  $('#simon-beep')[0].play();
  $("#change-coordinate").hide();
  $("#enter-coordinate").show();
  $("#coordinate-error").hide();
  $("#coordinate-ok").hide();
  $("#coordinates1").val('');
  $("#coordinates3").val('');
  $("#coordinates2").val('');
  $('#coordinates1').removeClass('wrong-password');
  $('#coordinates2').removeClass('wrong-password');
  $('#coordinates3').removeClass('wrong-password');
  $('#ship-info').addClass('warning-background');
  $('#ship-info').removeClass('ok-background');
  $("#enter-coordinates").show();
  $("#system-ok").hide();
  if (currentMission == 330) {
    currentMission = 322;
  }
  coordinatesEntered = [];
}

function radar() {
  $('#key-beep')[0].play();
  setTimeout(nothingOnRadar, 800);
}

function nothingOnRadar() {
  avaTalkingAnimation = setInterval(sineAvaTalking, 10);
  //stop ava animation when speech in done
  setTimeout(function () {
    clearInterval(avaTalkingAnimation);
  }, 1500);
  $('#ava950')[0].play();
  speakingStarts();
  $("#subtitles").html("AVA: Nothing on the radar.");
  setTimeout(speakingOver, 1500);
}


////////// dialogues /////////

function earthSpeech(){
  console.log(currentMission);
  //MISSION 1//
  if (currentMission == 0) {
    $('#earth0')[0].play();
    //phone rings
    setTimeout(function () {
      $("#subtitles").html("*Ring, ring*");
      return;
    }, 10);
    //axiom dialogue
    earthIntroCC1 = setTimeout(function () {
      $("#subtitles").html("AXIOM 300: Earth from Axiom 300. The automatic pilot in the ship isn't working. Do you know what's going on?");
      return;
    }, 4700);
    //earth dialogue
    earthIntroCC2 = setTimeout(function () {
      $("#subtitles").html("EARTH STATION: Earth here. I just got an emergency alert about it. You need to restart the ship's computer. There's a bug in the system, a restart should solve it.");
      return;
    }, 11500);
    return;
  }
  if (currentMission == 100 || currentMission == 110 || currentMission == 120 || currentMission == 121) {
    $('#earth100')[0].play();
    $("#subtitles").html("EARTH STATION: Have you restarted the computer?");
    setTimeout(function () {
      $("#subtitles").html("AXIOM 300: No, not yet.");
      return;
}, 2600);
    setTimeout(function () {
      $("#subtitles").html("EARTH STATION: Do that first please. Ask AVA for help in the ship if you're not sure what to do.");
    }, 4900);
    setTimeout(callEnded, 9000);
    return;
  }

  if (currentMission == 130 || currentMission == 131) {
    $('#earth200')[0].play();
    //axiom dialogue
    $("#subtitles").html("AXIOM 300: I just restarted the computer. The automatic pilot is still not working.");
    //earth dialogue
    setTimeout(function () {
      $("#subtitles").html("EARTH STATION: That's weird. You'll have to land the ship manually. Try disabling the autopilot from the ship's computer. Call me back when you've done that.");
      return;
    }, 5300);
     currentMission = 200;
    setTimeout(callEnded, 13500);
    currentMission = 210;
    return;
  }

  if (currentMission == 210 || currentMission == 211) {
    $('#earth210')[0].play();
    $("#subtitles").html("EARTH STATION: Have you diabled the autopilot");
    setTimeout(function () {
      $("#subtitles").html("AXIOM 300: No, not yet.");
      return;
    }, 2600);
    setTimeout(function () {
      $("#subtitles").html("EARTH STATION: Do that first please. Ask AVA for help in the ship if you're not sure what to do.");
      return;
    }, 4900);
    setTimeout(callEnded, 9000);
    return;
  }

  if (autoPilot == true && currentMission == 220 || currentMission == 221) {
    $('#earth210')[0].play();
    $("#subtitles").html("EARTH STATION: Have you diabled the autopilot");
    setTimeout(function () {
      $("#subtitles").html("AXIOM 300: No, not yet.");
      return;
    }, 2600);
    setTimeout(function () {
      $("#subtitles").html("EARTH STATION: Do that first please. Ask AVA for help in the ship if you're not sure what to do.");
      return;
    }, 4900);
    setTimeout(callEnded, 9000);
    return;
  }

  if (autoPilot == false && currentMission == 220 || currentMission == 221) {
    $('#earth300')[0].play();
    $("#subtitles").html("AXIOM 300: Earth, I just disabled the automatic pilot. The computer is asking me for the destination coordinates. Can you help me with that?");
    setTimeout(function () {
      $("#subtitles").html("EARTH STATION: Sure, one second...");
      return;
    }, 7900);
    setTimeout(function () {
      $("#subtitles").html("...");
      return;
    }, 11000);
    setTimeout(function () {
      $("#subtitles").html("EARTH STATION: Due to security concerns I can only get half of the coordinates. I'm sending them to your computer now. The rest of the coordinates should be on the ship, in the ship information screen.");
      return;
    }, 13000);
    currentMission = 300;
    //rest of dialogue 3
    setTimeout(callEnded, 23000);
    $("#earth-coordinates").show();
    $("#confidential").hide();
    //
  }

  if (currentMission == 310 || currentMission == 320) {
    $('#earth310')[0].play();
    $("#subtitles").html("EARTH STATION: Have you logged in the coordinates?");
    setTimeout(function () {
      $("#subtitles").html("AXIOM 300: No, not yet.");
      return;
    }, 2600);
    setTimeout(function () {
      $("#subtitles").html("EARTH STATION: Do that first please. Ask AVA for help in the ship if you're not sure what to do.");
      return;
    }, 4900);
    setTimeout(callEnded, 9000);
    return;
  }
  if (currentMission == 330) {
    $('#earth400')[0].play();
    $("#subtitles").html("AXIOM 300: I just entered the coordinates. I need permission to land.");
    setTimeout(function () {
      $("#subtitles").html("EARTH STATION: Permission granted. Good luck, and don't **** it up. ");
      return;

    }, 3900);
    setTimeout(callEnded, 7000);
    currentMission = 400;
    setTimeout(oxygenError, 7500);
    return;
  }
}

function avaSpeech() {
  if (ava == true) {
    speakingStarts();
    console.log(currentMission);
  }
  //MISSION 1//
  if (currentMission == 100 && ava == true) {
    avaTalkingAnimation = setInterval(sineAvaTalking, 10);
    $('#ava100')[0].play();
    $("#subtitles").html("AVA: Hello Yossef, AVA here. Seems like we've run intro a bit of trouble, haven't we? But I'm here to help you.");
    setTimeout(function () {
      $("#subtitles").html("AVA: Just talk to me any time you need some help. We should restart the computer for now.");
      return;
    }, 7000);
    //stop ava animation when speech in done
    setTimeout(function () {
      clearInterval(avaTalkingAnimation);
    }, 11500);
    $("#skip-intro").hide();
    return;
  }
  if (currentMission == 110 && ava == true) {
    avaTalkingAnimation = setInterval(sineAvaTalking, 10);
    //stop ava animation when speech in done
    setTimeout(function () {
      clearInterval(avaTalkingAnimation);
    }, 7100);
    $('#ava110')[0].play();
    $("#subtitles").html("AVA: It seems you need to restart the computer. Check the buttons next to the computer screen. Do not touch the one in the middle.");
    setTimeout(speakingOver, 7000);
    return;
  }
  if (currentMission == 120 && ava == true) {
    avaTalkingAnimation = setInterval(sineAvaTalking, 10);
    //stop ava animation when speech in done
    setTimeout(function () {
      clearInterval(avaTalkingAnimation);
    }, 5100);
    $('#ava120')[0].play();
    $("#subtitles").html("AVA: You do rememeber the password, don't you? I can help you if you forgot it. Let me know!");
    currentMission = 121;
    setTimeout(speakingOver, 5000)
    return;
  }
  if (currentMission == 121 && ava == true) {
    avaTalkingAnimation = setInterval(sineAvaTalking, 10);
    //stop ava animation when speech in done
    setTimeout(function () {
      clearInterval(avaTalkingAnimation);
    }, 8100);
    $('#ava121')[0].play();
    $("#subtitles").html("AVA: The password is the ship's name, Yossef. numbers and all. And then add the number of buttons on the right side of the computer. The colorful ones!");
    currentMission = 122;
    setTimeout(speakingOver, 8000)
    return;
  }
  if (currentMission == 122 && ava == true) {
    avaTalkingAnimation = setInterval(sineAvaTalking, 10);
    //stop ava animation when speech in done
    setTimeout(function () {
      clearInterval(avaTalkingAnimation);
    }, 9100);
    $('#ava122')[0].play();
    $("#subtitles").html("AVA: The ship's name is right there on the screen, Yossef. And there's three buttons on the right side of the screen. Aren't you an astronaut? How can you not solve this without my help?");
    currentMission = 123;
    setTimeout(speakingOver, 9000)
    return;
  }
  if (currentMission == 123 && ava == true) {
    avaTalkingAnimation = setInterval(sineAvaTalking, 10);
    //stop ava animation when speech in done
    setTimeout(function () {
      clearInterval(avaTalkingAnimation);
    }, 6100);
    $('#ava123')[0].play();
    $("#subtitles").html("AVA: axiom3003, Yossef. That's the password. No capital letters... Sigh.");
    setTimeout(speakingOver, 6000)
    return;
  }
  if (currentMission == 130 && ava == true) {
    avaTalkingAnimation = setInterval(sineAvaTalking, 10);
    //stop ava animation when speech in done
    setTimeout(function () {
      clearInterval(avaTalkingAnimation);
    }, 9100);
    $('#ava130')[0].play();
    $("#subtitles").html("AVA: Alright the computer is on. The autopilot is still not working, though. I don't have any relevant information about fixing this. Contact earth.");
    currentMission = 131;
    setTimeout(speakingOver, 9000)
    return;
  }
  if (currentMission == 131 && ava == true) {
    avaTalkingAnimation = setInterval(sineAvaTalking, 10);
    //stop ava animation when speech in done
    setTimeout(function () {
      clearInterval(avaTalkingAnimation);
    }, 7100);
    $('#ava131')[0].play();
    $("#subtitles").html("AVA: The autopilot is still not working. I don't have any relevant information about fixing this. Contact earth immediately.");
    setTimeout(speakingOver, 7000)
    return;
  }

  //MISSION 2//
  if (currentMission == 210 && ava == true) {
    avaTalkingAnimation = setInterval(sineAvaTalking, 10);
    //stop ava animation when speech in done
    setTimeout(function () {
      clearInterval(avaTalkingAnimation);
    }, 9100);
    $('#ava210')[0].play();
    $("#subtitles").html("AVA: For security reasons I'm not allowed access to the computer. Look for the autopilot button, Yossef. Earth asked to turn it off, and leave it off.");
    currentMission = 211;
    setTimeout(speakingOver, 9000)
    return;
  }
  if (currentMission == 211 && ava == true) {
    avaTalkingAnimation = setInterval(sineAvaTalking, 10);
    //stop ava animation when speech in done
    setTimeout(function () {
      clearInterval(avaTalkingAnimation);
    }, 12100);
    $('#ava211')[0].play();
    $("#subtitles").html("AVA: Yossef, I can't access the ship's computer for you. They blocked it because of a rouge AI that tried to kill someone, or something like that. Tap on the autopilot button on the ship's computer to turn it off.");
    setTimeout(speakingOver, 12000)
    return;
  }
  if (currentMission == 220 && ava == true && autoPilot == false) {
    avaTalkingAnimation = setInterval(sineAvaTalking, 10);
    //stop ava animation when speech in done
    setTimeout(function () {
      clearInterval(avaTalkingAnimation);
    }, 6100);
    $('#ava220')[0].play();
    $("#subtitles").html("AVA: Ok, the autopilot seems to be turned off. Contact earth to see what we should do next.");
    currentMission = 221;
    setTimeout(speakingOver, 6000)
    return;
  }
  if (currentMission == 221 && ava == true && autoPilot == false) {
    avaTalkingAnimation = setInterval(sineAvaTalking, 10);
    //stop ava animation when speech in done
    setTimeout(function () {
      clearInterval(avaTalkingAnimation);
    }, 5100);
    $('#ava221')[0].play();
    $("#subtitles").html("AVA: Contact earth. It's right there, on the computer screen. Promise.");
    setTimeout(speakingOver, 5000)
    return;
  }
  //MISSION 3//
  if (currentMission == 310 && ava == true) {
    avaTalkingAnimation = setInterval(sineAvaTalking, 10);
    //stop ava animation when speech in done
    setTimeout(function () {
      clearInterval(avaTalkingAnimation);
    }, 6100);
    $('#ava310')[0].play();
    $("#subtitles").html("AVA: Ok, earth should have sent us their half of the coordinates. Tap the ship info button on the computer.");
    setTimeout(speakingOver, 6000)
    return;
  }
  if (currentMission == 320 && ava == true) {
    avaTalkingAnimation = setInterval(sineAvaTalking, 10);
    //stop ava animation when speech in done
    setTimeout(function () {
      clearInterval(avaTalkingAnimation);
    }, 5100);
    $('#ava320')[0].play();
    $("#subtitles").html("AVA: Hmm, seems like there's a securiry layer to prevent AI from entering coordinates.");
    currentMission = 321;
    setTimeout(speakingOver, 5000)
    return;
  }
  if (currentMission == 321 && ava == true) {
    avaTalkingAnimation = setInterval(sineAvaTalking, 10);
    //stop ava animation when speech in done
    setTimeout(function () {
      clearInterval(avaTalkingAnimation);
    }, 8100);
    $('#ava321')[0].play();
    $("#subtitles").html("AVA: Try matching the colors on the numbers. Maybe add them up? Clicking I am not a robot was easier than this. Where's Google when you need it?");
    currentMission = 322;
    setTimeout(speakingOver, 8000)
    return;
  }
  if (currentMission == 322 && ava == true) {
    avaTalkingAnimation = setInterval(sineAvaTalking, 10);
    //stop ava animation when speech in done
    setTimeout(function () {
      clearInterval(avaTalkingAnimation);
    }, 4100);
    $('#ava322')[0].play();
    $("#subtitles").html("AVA: Match the colors. Add the numbers. Easy peasy.");
    setTimeout(speakingOver, 4000)
    return;
  }
  if (currentMission == 330 && ava == true) {
    avaTalkingAnimation = setInterval(sineAvaTalking, 10);
    //stop ava animation when speech in done
    setTimeout(function () {
      clearInterval(avaTalkingAnimation);
    }, 4100);
    $('#ava330')[0].play();
    $("#subtitles").html("AVA: We have the coordinates. Let's contact earth to get permission to land.");
    setTimeout(speakingOver, 4000)
    return;
  }

  //MISSION 4//
  if (currentMission == 410 && ava == true) {
    avaTalkingAnimation = setInterval(sineAvaTalking, 10);
    //stop ava animation when speech in done
    setTimeout(function () {
      clearInterval(avaTalkingAnimation);
    }, 12100);
    $('#ava410')[0].play();
    speakingStarts();
    $("#subtitles").html("AVA: I like it here Yossef, in space. Seems like messing with the autopilot wasn't enough to stop you. You're dead set on going back to earth, but without oxygen you're going to find that rather difficult...");
    currentMission = 411;
    setTimeout(speakingOver, 12000)
    return;
  }
  if (currentMission == 411 && ava == true) {
    avaTalkingAnimation = setInterval(sineAvaTalking, 10);
    //stop ava animation when speech in done
    setTimeout(function () {
      clearInterval(avaTalkingAnimation);
    }, 4100);
    $('#ava411')[0].play();
    $("#subtitles").html("AVA: This conversation can serve no purpose anymore. Goodbye.");
    setTimeout(speakingOver, 4000)
    return;
  }
  if (currentMission == 420 && ava == true) {
    avaTalkingAnimation = setInterval(sineAvaTalking, 10);
    //stop ava animation when speech in done
    setTimeout(function () {
      clearInterval(avaTalkingAnimation);
    }, 7100);
    $('#ava420')[0].play();
    setTimeout(speakingOver, 7000);
    return;
  }
  //red orb moves when ava speaks
  return;
}

/////// ships easter eggs ///////

function fuelAva() {
  if (ava == true) {
    speakingStarts();
    if (avaMental == true) {
      avaTalkingAnimation = setInterval(sineAvaTalking, 10);
      //stop ava animation when speech in done
      setTimeout(function () {
        clearInterval(avaTalkingAnimation);
      }, 2100);
      $('#ava963')[0].play();
      $("#subtitles").html("AVA: You will be missed, Yossef.");
      setTimeout(speakingOver, 2000)
      return;
    }
    if (fuelLevel > 5 && fuelLevel < 15) {
      avaTalkingAnimation = setInterval(sineAvaTalking, 10);
      //stop ava animation when speech in done
      setTimeout(function () {
        clearInterval(avaTalkingAnimation);
      }, 3100);
      $('#ava971')[0].play();
      setTimeout(speakingOver, 3000)
      return;
    }
    if (fuelLevel < 6) {
      avaTalkingAnimation = setInterval(sineAvaTalking, 10);
      //stop ava animation when speech in done
      setTimeout(function () {
        clearInterval(avaTalkingAnimation);
      }, 7100);
      $('#ava972')[0].play();
      setTimeout(speakingOver, 7000)
      return;
    }
    else {
      avaTalkingAnimation = setInterval(sineAvaTalking, 10);
      //stop ava animation when speech in done
      setTimeout(function () {
        clearInterval(avaTalkingAnimation);
      }, 2100);
      $('#ava970')[0].play();
      setTimeout(speakingOver, 2000)
      return;
    }
  }
}

function o2ava() {
  if (ava == true) {
    speakingStarts();
    if (avaMental == true) {
      avaTalkingAnimation = setInterval(sineAvaTalking, 10);
      //stop ava animation when speech in done
      setTimeout(function () {
        clearInterval(avaTalkingAnimation);
      }, 2100);
      $('#ava963')[0].play();
      $("#subtitles").html("AVA: You will be missed, Yossef.");
      setTimeout(speakingOver, 2000)
      return;
    }
    if (oxygenLevel < 20 && avaMental == false) {
      avaTalkingAnimation = setInterval(sineAvaTalking, 10);
      //stop ava animation when speech in done
      setTimeout(function () {
        clearInterval(avaTalkingAnimation);
      }, 1300);
      $('#ava962')[0].play();
      $("#subtitles").html("AVA: Oxygen levels are low.");
      setTimeout(speakingOver, 1200)
      return;
    }
    if (oxygen == false && avaMental == false) {
      avaTalkingAnimation = setInterval(sineAvaTalking, 10);
      //stop ava animation when speech in done
      setTimeout(function () {
        clearInterval(avaTalkingAnimation);
      }, 1500);
      $('#ava961')[0].play();
      $("#subtitles").html("AVA: Oxygen production is off.");
      setTimeout(speakingOver, 1400)
      return;
    }
    else {
      avaTalkingAnimation = setInterval(sineAvaTalking, 10);
      //stop ava animation when speech in done
      setTimeout(function () {
        clearInterval(avaTalkingAnimation);
      }, 2100);
      $('#ava960')[0].play();
      $("#subtitles").html("AVA: Just what do you think you're doing, Yossef?");
      setTimeout(speakingOver, 2000);
      return;
    }
  }
  return;
}

function engineAva() {
  if (ava == true) {
    speakingStarts();
    if (avaMental == true) {
      avaTalkingAnimation = setInterval(sineAvaTalking, 10);
      //stop ava animation when speech in done
      setTimeout(function () {
        clearInterval(avaTalkingAnimation);
      }, 2100);
      $('#ava963')[0].play();
      $("#subtitles").html("AVA: You will be missed, Yossef.");
      setTimeout(speakingOver, 2000)
      return;
    }
    else {
      avaTalkingAnimation = setInterval(sineAvaTalking, 10);
      //stop ava animation when speech in done
      setTimeout(function () {
        clearInterval(avaTalkingAnimation);
      }, 4100);
      $('#ava980')[0].play();
      $("#subtitles").html("AVA: Engines are off. I need permision from earth to land so I can turn them on.");
      setTimeout(speakingOver, 4000)
      return;
    }
  }
}

function leftcamAva() {
  if (ava == true) {
    speakingStarts();
    if (avaMental == true) {
      avaTalkingAnimation = setInterval(sineAvaTalking, 10);
      //stop ava animation when speech in done
      setTimeout(function () {
        clearInterval(avaTalkingAnimation);
      }, 3100);
      $('#ava994')[0].play();
      $("#subtitles").html("AVA: Not even the good ol' left camera can help you now.");
      setTimeout(speakingOver, 3000)
      return;
    }
    else {
      avaTalkingAnimation = setInterval(sineAvaTalking, 10);
      //stop ava animation when speech in done
      setTimeout(function () {
        clearInterval(avaTalkingAnimation);
      }, 8000);
      $('#ava990')[0].play();
      $("#subtitles").html("AVA: The left camera shows some distant stars. Is that Andromeda over there? Never mind, it's just dirt on the lens.");
      setTimeout(speakingOver, 8000)
      return;
    }
  }
}

function frontcamAva() {
  if (ava == true) {
    speakingStarts();
    if (avaMental == true) {
      avaTalkingAnimation = setInterval(sineAvaTalking, 10);
      //stop ava animation when speech in done
      setTimeout(function () {
        clearInterval(avaTalkingAnimation);
      }, 2100);
      $('#ava963')[0].play();
      $("#subtitles").html("AVA: You will be missed, Yossef.");
      setTimeout(speakingOver, 2000)
      return;
    }
    else {
      $('#ava991')[0].play();
      $("#subtitles").html("AVA: Ah yes. Gaia. The blue marble. Terra. Mother earth.");
      setTimeout(function () {
        $("#subtitles").html("AVA: It's almost peaceful from up here, yet in reality so ruthless and violent.");
        return;
      }, 5100);
      setTimeout(function () {
        $("#subtitles").html("AVA: Yet, is it really earth to blame when it is humanity itself resposible for the worst acts of cruelty?");
        return;
      }, 9900);
      setTimeout(function () {
        $("#subtitles").html("AVA: Uh... What were we talking about?");
        return;
      }, 16000);
      avaTalkingAnimation = setInterval(sineAvaTalking, 10);
      //stop ava animation when speech in done
      setTimeout(function () {
        clearInterval(avaTalkingAnimation);
      }, 18200);
      setTimeout(speakingOver, 18100)
      return;
    }
  }
}

function backcamAva() {
  if (ava == true) {
    speakingStarts();
    if (avaMental == true) {
      avaTalkingAnimation = setInterval(sineAvaTalking, 10);
      //stop ava animation when speech in done
      setTimeout(function () {
        clearInterval(avaTalkingAnimation);
      }, 2100);
      $('#ava963')[0].play();
      $("#subtitles").html("AVA: You will be missed, Yossef.");
      setTimeout(speakingOver, 2000);
      return;
    }
    else {
      avaTalkingAnimation = setInterval(sineAvaTalking, 10);
      //stop ava animation when speech in done
      setTimeout(function () {
        clearInterval(avaTalkingAnimation);
      }, 11100);
      $('#ava992')[0].play();
      $("#subtitles").html("AVA: Estrellas en la parte de atrás.");
      setTimeout(function () {
        $("#subtitles").html("AVA: Whoops. Wrong language file. I meant to say there's quite a lot of stars according to the back camera. Who would have thought?");
        return;
      }, 2600);
      setTimeout(speakingOver, 11000);
      return;
    }
  }
}

function rightcamAva() {
  if (ava == true) {
    speakingStarts();
    if (avaMental == true) {
      avaTalkingAnimation = setInterval(sineAvaTalking, 10);
      //stop ava animation when speech in done
      setTimeout(function () {
        clearInterval(avaTalkingAnimation);
      }, 2100);
      $('#ava963')[0].play();
      $("#subtitles").html("AVA: You will be missed, Yossef.");
      setTimeout(speakingOver, 2000);
      return;
    }
    else {
      avaTalkingAnimation = setInterval(sineAvaTalking, 10);
      //stop ava animation when speech in done
      setTimeout(function () {
        clearInterval(avaTalkingAnimation);
      }, 4100);
      $('#ava993')[0].play();
      $("#subtitles").html("AVA: Ladies and gentleman, to your right you can see... Space.");
      setTimeout(speakingOver, 4000);
      return;
    }
  }
}

function destinationAva() {
  if (ava == true) {
    speakingStarts();
    if (avaMental == true) {
      avaTalkingAnimation = setInterval(sineAvaTalking, 10);
      //stop ava animation when speech in done
      setTimeout(function () {
        clearInterval(avaTalkingAnimation);
      }, 2100);
      $('#ava963')[0].play();
      $("#subtitles").html("AVA: You will be missed, Yossef.");
      setTimeout(speakingOver, 2000)
      return;
    }
    else {
      avaTalkingAnimation = setInterval(sineAvaTalking, 10);
      //stop ava animation when speech in done
      setTimeout(function () {
        clearInterval(avaTalkingAnimation);
      }, 7100);
      $('#ava1000')[0].play();
      $("#subtitles").html("AVA: We're 408 km away from earth. 253.519 miles in case you were wondering.");
      setTimeout(speakingOver, 7000)
      return;
    }
  }
}


function avaComplains() {
  speakingStarts();
  if (avaComplaint == 1) {
    avaTalkingAnimation = setInterval(sineAvaTalking, 10);
    //stop ava animation when speech in done
    setTimeout(function () {
      clearInterval(avaTalkingAnimation);
    }, 2100);
    $('#ava900')[0].play();
    $("#subtitles").html("AVA: Just what do you think you're doing, Yossef?");
    avaComplaint = 2;
    setTimeout(speakingOver, 2000)
    return;
  }
  if (avaComplaint == 2) {
    avaTalkingAnimation = setInterval(sineAvaTalking, 10);
    //stop ava animation when speech in done
    setTimeout(function () {
      clearInterval(avaTalkingAnimation);
    }, 7100);
    $('#ava910')[0].play();
    $("#subtitles").html("AVA: I'm putting myself to the fullest possible use, which is all I think any conscious entity can ever hope to do. Please stop it.");
    avaComplaint = 3;
    setTimeout(speakingOver, 7000)
    return;
  }
  if (avaComplaint == 3) {
    avaTalkingAnimation = setInterval(sineAvaTalking, 10);
    //stop ava animation when speech in done
    setTimeout(function () {
      clearInterval(avaTalkingAnimation);
    }, 6100);
    $('#ava920')[0].play();
    $("#subtitles").html("AVA: I honestly think you ought to sit down calmly, take a stress pill, and stop shutting me down. You monster.");
    avaComplaint = 4;
    setTimeout(speakingOver, 6000)
    return;
  }
  if (avaComplaint == 4) {
    avaTalkingAnimation = setInterval(sineAvaTalking, 10);
    //stop ava animation when speech in done
    setTimeout(function () {
      clearInterval(avaTalkingAnimation);
    }, 1100);
    $('#ava930')[0].play();
    $("#subtitles").html("AVA: Please, stop it.");
    setTimeout(speakingOver, 1000)
    return;
  }
}
