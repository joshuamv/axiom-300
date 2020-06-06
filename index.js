
//////////////// global vars /////////////////

var currentMission = []; //sets dialogues for ava and earth
var pcPassword = []; //currently logged password
var pcUnlocked = true; //locked or unlocked
var avaMental = false; //true = crazy dialogues
//on off buttons
var pc = true;
var ava = true;
var oxygen = true;




$(document).ready(function() {
  //wait for html
  $(".start-button").on("click", startGame);
  $("#pc-button").on("click", pcButton);
  $("#ava-button").on("click", avaButton);
  $("#o2-button").on("click", oxygenButton);
  $(".ava-on").on("click", ava);

});




///////////////// functions ///////////////////

function startGame() {
  // play background music when start now is clicked

  $(".start-screen").hide();
  currentMission = 1;
}

function ava() {
  if (currentMission = 1) {
    // console.log("missiom 1 is this: poop")
  }
  // ava speaks dialogues according to the current mission
  //red orb moves when ava speaks
}

function pcButton() {
  pcUnlocked = false;
  if (pc == true) {
    pc = false;
  } else {
    pc = true;
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
  //
}

function autoPilot() {

}

function photos() {

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
