
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
//on off buttons. true = on, false = off
var pc = true;
var ava = true;
var oxygen = true;


//////////////// load html /////////////////

$(document).ready(function() {

  //set ship's computer screen//
  $("#locked-screen").hide();
  $("#off-screen").hide();

  //buttons click to run functions//
  $(".start-button").on("click", startGame);
  $("#pc-button").on("click", pcButton);
  $("#ava-button").on("click", avaButton);
  $("#o2-button").on("click", oxygenButton);
  $(".ava-on").on("click", avaSpeech);
  $("#contact-earth").on("click", contactEarth);
  $("#autom-pilot").on("click", automPilot);

  //password checks and reset//
  $(".password-button").click(function(){
    var inputPassword = $("input[name$='password']").val();
    pcPassword.push(inputPassword);
    console.log(pcPassword);
    checkPassword();
  });

  $('#password').on('keyup', function() {
    $('#password').removeClass('wrong-password');;
  });
  //end of doc ready//

});



///////////////// functions ///////////////////

function startGame() {
  // play background music when start now is clicked
  currentMission = 0;
  //click doesn't work when click show listen carefully
  $(".start-screen").hide();
  $('#autom-pilot').toggleClass('error-background warning-background');
  callStarted();
  currentMission = 100;
  //play ava dialogue and wait till it's over
  currentMission = 110;
  //click works again
}

function pcButton() {
  pcUnlocked = false;
  if (pc == true) {
    $(".screen").hide();
    $("#locked-screen").hide();
    $("#off-screen").show();
    callEnded();
    //stop audio file from calls
    pc = false;
  } else {
    $("#locked-screen").show();
    $(".screen").hide();
    $("#off-screen").hide();
    pc = true;
    if (currentMission == 110) {
      currentMission = 120; //mission goes to 1.2 only when you're in the first part. If you reset the computer in other missions it shouldn't change the dialogues
    }
  }
}

function checkPassword() {
  //input from field goes to var pcPassword
  if (pcPassword == "axiom3003") {
    //password is right
    pcUnlocked = true;
    $("#off-screen").hide();
    $(".screen").show();
    $("#locked-screen").hide();
    $('#password').val('');
    pcPassword = [];
    if (currentMission == 120 || currentMission == 121 || currentMission == 122 || currentMission == 123) {
      currentMission = 130;
    }
    }else{
    //password is wrong
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
    avaComplains();
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
    callStarted();
  }else{
    callEnded();
    //stop speech audio//
  }
}

function callStarted() {
  $('#contact-earth').toggleClass('ok-background');
  $("#contact-earth-status").text("ON-GOING CALL");
  ongoingCall = true;
  earthSpeech();
}

function callEnded() {
  ongoingCall = false;
  $('#contact-earth').removeClass('ok-background');
  $("#contact-earth-status").text("CONECTION IS STABLE");
  //stop audio from call channel only
}

function automPilot() {
  if (autoPilot == false) {
    autoPilotOn();
  }else{
    autoPilotOff();
    if (currentMission == 210 || currentMission == 211) {
      currentMission = 220;
    }
  }
}

function autoPilotOn() {
  $('#autom-pilot').toggleClass('error-background');
  $("#autopilot-title-status").text("AUTOPILOT ON");
  $("#autopilot-status").text("AUTOPILOT ERROR");
  autoPilot = true;
  if (currentMission > 220 && ava == true) {
    //speech You should probably leave the autopilot off, it's not working properly
  }
}

function autoPilotOff() {
  $('#autom-pilot').removeClass('error-background');
  $("#autopilot-title-status").text("AUTOPILOT OFF");
  $("#autopilot-status").text("MANUAL MODE");
  autoPilot = false;
}

function shipInfo() {
  if (currentMission == 310) {
    currentMission = 320;
  }
}

function coordinatesCode() {
  if (coordinatesStatus = true) {
    //coordinates are right

    if (currentMission == 310 || currentMission == 320 || currentMission == 330) {
      currentMission = 400;
    }
  }else {
    //coordinates are wrong
    //text displays error these coodrinates aren't part of the national landing ports coordinates
    if (currentMission == 310) {
      currentMission = 320;
    }
  }

}

function radar() {
  //beep
}


////////// dialogues /////////

function earthSpeech(){
  console.log(currentMission);
  //MISSION 1//
  if (currentMission == 0) {
    $('#ok')[0].play();
    //dialogue 0
    // callEnded(); after audio finishes!
  }
  if (currentMission == 100 || currentMission == 110 || currentMission == 120 || currentMission == 121) {
    $('#simon-beep')[0].play();
    //Did you restart the computer?
    //Not yet.
    //Do that first, please. Ask AVA for help in the ship if you're not sure what to do.
    // callEnded(); after audio finishes!
  }
  if (currentMission == 130 || currentMission == 131) {
    $('#ok')[0].play();
    //dialogue 2
    currentMission = 200;
    //rest of dialogue 2
    // callEnded(); after audio finishes!
    currentMission = 210;
    //
  }
  if (currentMission == 210 || currentMission == 211) {
    $('#simon-beep')[0].play();
    //Did you disable the autopilot?
    //Not yet.
    //Do that first, please. Ask AVA for help in the ship if you're not sure what to do.
    // callEnded(); after audio finishes!
  }
  if (currentMission == 220 || currentMission == 221) {
    $('#ok')[0].play();
    //dialogue 3
    currentMission = 300;
    //rest of dialogue 3
    // callEnded(); after audio finishes!
    currentMission = 310;
    //
  }
  if (currentMission == 310 || currentMission == 320) {
    $('#simon-beep')[0].play();
    //Did you log in the coordinates?
    //Not yet.
    //Do that first, please. Ask AVA for help in the ship if you're not sure what to do.
    // callEnded(); after audio finishes!
  }
  if (currentMission == 330) {
    $('#ok')[0].play();
    //dialogue 4
    // callEnded(); after audio finishes!
    currentMission = 400;
    //start ava o2 error, contact earth signal off
  }

  //speaker grill moves when earth speaks
}

function avaSpeech() {
  console.log(currentMission);
  //MISSION 1//
  if (currentMission == 0 && ava == true) {
    $('#crack')[0].play();
    //ava says be quiet earth is speaking
  }
  if (currentMission == 100 && ava == true) {
    $('#ok')[0].play();
    //ava intro
  }
  if (currentMission == 110 && ava == true) {
    $('#simon-beep')[0].play();
    //It seems you need to restart the computer. 1.1
  }
  if (currentMission == 120 && ava == true) {
    $('#simon-beep')[0].play();
    //You do remember the password, don’t you? 1.2
    currentMission = 121;
  }
  if (currentMission == 121 && ava == true) {
    $('#simon-beep')[0].play();
    //The password is the ship’s name, Yoseff 1.21
    currentMission = 122;
  }
  if (currentMission == 122 && ava == true) {
    $('#simon-beep')[0].play();
    //The ship’s name is right there on the screen Yoseff 1.22
    currentMission = 123;
  }
  if (currentMission == 123 && ava == true) {
    $('#crack')[0].play();
    //axiom3003, Yoseff. That’s the password. Sigh. 1.23
  }
  if (currentMission == 130 && ava == true) {
    $('#ok')[0].play();
    //Ok the computer is on 1.3
    currentMission = 131;
  }
  if (currentMission == 131 && ava == true) {
    $('#simon-beep')[0].play();
    //OThe autopilot is still not working 1.31
  }

  //MISSION 2//
  if (currentMission == 200 && ava == true) {
    $('#crack')[0].play();
    //ava says be quiet earth is speaking 2.0
  }
  if (currentMission == 210 && ava == true) {
    $('#simon-beep')[0].play();
    //For security reasons I’m not allowed access to the computer. 2.1
    currentMission = 211;
  }
  if (currentMission == 211 && ava == true) {
    $('#simon-beep')[0].play();
    //I can’t access the ship’s computer for you. They blocked it because of a rouge AI 2.11
  }
  if (currentMission == 220 && ava == true) {
    $('#ok')[0].play();
    //Ok, autopilot seems to be turned off.  2.2
    currentMission = 221;
  }
  if (currentMission == 221 && ava == true) {
    $('#simon-beep')[0].play();
    //After asking again: Contact earth. It’s right there, on the computer screen. Promise. 2.12
  }
  //MISSION 3//
  if (currentMission == 300 && ava == true) {
    $('#crack')[0].play();
    //shh earth 3.0
  }
  if (currentMission == 310 && ava == true) {
    $('#ok')[0].play();
    //Half of the coordinates are in the computer, the other half should be in the ship manual. 3.1
  }
  if (currentMission == 320 && ava == true) {
    $('#simon-beep')[0].play();
    // help with the coordinates equation!! 3.2
  }
  if (currentMission == 330 && ava == true) {
    $('#ok')[0].play();
    // We have the coordinates, let’s contact earth to get permission to land 3.3
  }

  //MISSION 4//
  if (currentMission == 400 && ava == true) {
    $('#crack')[0].play();
    //shh earth 4.0
  }
  if (currentMission == 410 && ava == true) {
    $('#long-crack')[0].play();
    //I like it here, Yosef. In space... 4.1
  }
  if (currentMission == 420 && ava == true) {
    $('#rec')[0].play();
    // I'm sorry, Yosef. I'm afraid I can't let you do that... Just kidding! You really bought it, didn’t you? 4.2
  }
  //red orb moves when ava speaks
}

/////// ships easter eggs ///////

function screenClicked() {
  // play sound; ava reacts to the content of the screen
}

function avaComplains() {
  if (avaComplaint == 1) {
    //Just what do you think you're doing, Yosef?
    avaComplaint = 2;
  }
  if (avaComplaint == 2) {
    //I am putting myself to the fullest possible use, which is all I think that any conscious entity can ever hope to do.
    avaComplaint = 3;
  }
  if (avaComplaint == 3) {
    //I honestly think you ought to sit down calmly, take a stress pill, and stop shutting me down. You monster.
    avaComplaint = 4;
  }
  if (avaComplaint == 4) {
    //Please, stop it.
  }
}
