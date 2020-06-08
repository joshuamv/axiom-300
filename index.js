
//////////////// global vars /////////////////

var currentMission = []; //sets dialogues for ava and earth
var pcPassword = []; //currently logged password
var pcUnlocked = true; //locked or unlocked
var avaMental = false; //true = crazy dialogues
var ongoingCall = true; //true = there's an on going call at the moment
var connectionLevel = true; //true = there's service, false call can't be made
var autoPilot = true; //true = autopilot on
//on off buttons. true = on, false = off
var pc = true;
var ava = true;
var oxygen = true;




$(document).ready(function() {
  //wait for html
  $("#locked-screen").hide();
  $("#off-screen").hide();
  $(".start-button").on("click", startGame);
  $("#pc-button").on("click", pcButton);
  $("#ava-button").on("click", avaButton);
  $("#o2-button").on("click", oxygenButton);
  $(".ava-on").on("click", avaSpeech);
  $("#contact-earth").on("click", contactEarth);
  $("#autom-pilot").on("click", automPilot);
  // $(".password-button").on("click", checkPassword);
  $(".password-button").click(function(){
    var inputPassword = $("input[name$='password']").val();
    pcPassword.push(inputPassword);
    console.log(pcPassword);
    checkPassword();
  });

  $('#password').on('keyup', function() {
    $('#password').removeClass('wrong-password');;
  });


});




///////////////// functions ///////////////////

function startGame() {
  // play background music when start now is clicked
  $(".start-screen").hide();
  $('#contact-earth').toggleClass('ok-background');
  $('#autom-pilot').toggleClass('error-background warning-background');
  $("#contact-earth-status").text("ON-GOING CALL");
  currentMission = 1;
  //play dialogue
}

function earthSpeech(){
  if (currentMission == 1) {
    //tell mission details
    console.log("hiis is atext")
  }
}

function avaSpeech() {
  if (currentMission == 1 && ava == true) {
    //tell mission details
  }
  // ava speaks dialogues according to the current mission
  //red orb moves when ava speaks
}

function pcButton() {
  pcUnlocked = false;
  if (pc == true) {
    $(".screen").hide();
    $("#locked-screen").hide();
    $("#off-screen").show();
    ongoingCall = false;
    $('#contact-earth').removeClass('ok-background');
    $("#contact-earth-status").text("CONECTION IS STABLE");
    //stop audio file from calls
    pc = false;
  } else {
    $("#locked-screen").show();
    $(".screen").hide();
    $("#off-screen").hide();
    pc = true;
  }
}

function checkPassword() {
  //input from field goes to var pcPassword

  if (pcPassword == "axiom3003") {
    pcUnlocked = true;
    $("#off-screen").hide();
    $(".screen").show();
    $("#locked-screen").hide();
    $('#password').val('');
    pcPassword = [];
    }else{
    $("#forgot").show();
    $('#password').toggleClass('wrong-password');
    $('#password').focus(
      function(){
          $(this).val('');
    });
    pcPassword = [];
  }
}

function avaButton() {

  if (avaMental == true) {
    $('#ava').toggleClass('ava-on ava-off');
    //do nothing, ava says line about not letting you do that
  }

  if (ava == true && avaMental == false) {
    $('#ava').toggleClass('ava-on ava-off');
    ava = false;
    //power off sound effect
  } else {
    $('#ava').toggleClass('ava-on ava-off');
    ava = true;
    //power on sound effect
    //ava complaining dialogue here
  }
}

function oxygenButton() {
  if (avaMental == true) {
    //do nothing, ava says line about not letting you do that
  }

  if (oxygen == true && avaMental == false) {
    oxygen = false;
  } else {
    oxygen = true;
  }
}


///////// ship computer functions //////////

function logIn() {

}

function contactEarth() {
  if (ongoingCall == false && connectionLevel == true) {
    $('#contact-earth').toggleClass('ok-background');
    $("#contact-earth-status").text("ON-GOING CALL");
    ongoingCall = true;
    earthSpeech();
  }else{
    $('#contact-earth').toggleClass('ok-background');
    $("#contact-earth-status").text("CONECTION IS STABLE");
    ongoingCall = false;
    //stop speech audio
  }
}

function automPilot() {
  if (autoPilot == false) {
    $('#autom-pilot').toggleClass('error-background');
    $("#autopilot-title-status").text("AUTOPILOT ON");
    $("#autopilot-status").text("AUTOPILOT ERROR");
    autoPilot = true;
    earthSpeech();
  }else{
    $('#autom-pilot').toggleClass('error-background');
    $("#autopilot-title-status").text("AUTOPILOT OFF");
    $("#autopilot-status").text("MANUAL MODE");
    autoPilot = false;
  }
}

function shipInfo() {

}

function radar() {
  //beep
}

/////// ships easter eggs ///////

function screenClicked() {
  // play sound; ava reacts to the content of the screen
}
