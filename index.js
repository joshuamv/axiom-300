
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
//on off buttons. true = on, false = off
var pc = true;
var ava = true;
var oxygen = true;


//////////////// load html /////////////////

$(document).ready(function() {
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
  $(".radar").on("click", radar);

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

//text follow the cursor's x and y
$(document).on('mousemove', function(e){
    $('#mouse-text').css({
       left:  e.pageX-20,
       top:   e.pageY
    });
});


///////////////// functions ///////////////////

function speakingStarts() {
  $('body').css('cursor', 'none');
  $("#mouse-text").show();
}

function speakingOver() {
  $('body').css('cursor', 'default');
  $("#mouse-text").hide();
}

function startGame() {
  //play backgorund music
  $('#background')[0].play();
  speakingStarts();
  $(".start-screen").hide();
  $('#autom-pilot').toggleClass('error-background warning-background');
  currentMission = 0;
  callStarted();
  currentMission = 100;
  setTimeout(avaSpeech, 21200);
  setTimeout(callEnded, 21202);
  setTimeout(speakingStarts, 21203);
  setTimeout(speakingOver, 31000);
}

function pcButton() {
  pcUnlocked = false;
  if (pc == true) {
    $(".screen").hide();
    $("#locked-screen").hide();
    $("#off-screen").show();
    $("#info-screen").hide();
    callEnded();
    //stop audio file from calls
    pc = false;
  } else {
    $("#locked-screen").show();
    $(".screen").hide();
    $("#off-screen").hide();
    $("#info-screen").hide();
    pc = true;
    if (currentMission == 110) {
      currentMission = 120; //mission goes to 1.2 only when you're in the first part. If you reset the computer in other missions it shouldn't change the dialogues
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

function oxygenError() {
  return;
  //oxy screen should display error
}



///////// ship computer functions //////////


function checkPassword() {
  //input from field goes to var pcPassword
  if (pcPassword == "axiom3003") {
    //password is right
    pcUnlocked = true;
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
  $('body').css('cursor', 'none');
  $("#mouse-text").show();
  ongoingCall = true;
  earthSpeech();
}

function callEnded() {
  ongoingCall = false;
  $('#contact-earth').removeClass('ok-background');
  $("#contact-earth-status").text("CONECTION IS STABLE");
  $('body').css('cursor', 'default');
  $("#mouse-text").hide();

  //prevents two audio files from playing together by delaying callEnded
  if (currentMission == 100) {
    currentMission = 110;
  }
  if (currentMission == 300) {
    currentMission = 310;
  }
}

function automPilot() {
  if (autoPilot == false) {
    autoPilotOn();
    $("#enter-coordinates").hide();
    $("#system-ok").show();
  }else{
    autoPilotOff();
    if (currentMission == 210 || currentMission == 211) {
      currentMission = 220;
    }
    $("#enter-coordinates").show();
    $("#system-ok").hide();
  }
}

function autoPilotOn() {
  $('#autom-pilot').toggleClass('error-background');
  $("#autopilot-title-status").text("AUTOPILOT ON");
  $("#autopilot-status").text("AUTOPILOT ERROR");
  autoPilot = true;
  if (currentMission > 220 && ava == true) {
    $('#ava940')[0].play();
  }
}

function autoPilotOff() {
  $('#autom-pilot').removeClass('error-background');
  $("#autopilot-title-status").text("AUTOPILOT OFF");
  $("#autopilot-status").text("MANUAL MODE");
  autoPilot = false;
}

function shipInfo() {
  $("#locked-screen").hide();
  $("#off-screen").hide();
  $(".screen").hide();
  $("#info-screen").show();
  if (currentMission == 310) {
    currentMission = 320;
  }
}

function homeScreen() {
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
    $("#coordinate-ok").show();
    $("#change-coordinate").show();
    $("#enter-coordinate").hide();
  }else {
    $("#coordinate-error").show();
    $('#error')[0].play();
    coordinatesEntered = [];
    $('#coordinates1').toggleClass('wrong-password');
    $('#coordinates2').toggleClass('wrong-password');
    $('#coordinates3').toggleClass('wrong-password');

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

function deleteCoordinates() {
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
  if (currentMission == 330) {
    currentMission = 322;
  }
  coordinatesEntered = [];
}

function radar() {
  $('#key-beep')[0].play();
}


////////// dialogues /////////

function earthSpeech(){
  console.log(currentMission);
  //MISSION 1//
  if (currentMission == 0) {
    $('#earth0')[0].play();
    //dialogue 0
    //call is ended in start game function, no need for it here
    return;
  }
  if (currentMission == 100 || currentMission == 110 || currentMission == 120 || currentMission == 121) {
    $('#earth100')[0].play();
    //Did you restart the computer?
    //Not yet.
    //Do that first, please. Ask AVA for help in the ship if you're not sure what to do.
    setTimeout(callEnded, 9000)
    return;
  }
  if (currentMission == 130 || currentMission == 131) {
    $('#earth200')[0].play();
    //dialogue 2
    currentMission = 200;
    //rest of dialogue 2
    setTimeout(callEnded, 23000)
    currentMission = 210;
    return;
  }

  if (currentMission == 210 || currentMission == 211) {
    $('#earth210')[0].play();
    //Did you disable the autopilot?
    //Not yet.
    //Do that first, please. Ask AVA for help in the ship if you're not sure what to do.
    setTimeout(callEnded, 9000)
    return;
  }
  if (currentMission == 220 || currentMission == 221) {
    $('#earth300')[0].play();
    //dialogue 3
    currentMission = 300;
    //rest of dialogue 3
    setTimeout(callEnded, 23000)
    $("#earth-coordinates").show();
    $("#confidential").hide();
    //
  }
  if (currentMission == 310 || currentMission == 320) {
    $('#earth310')[0].play();
    //Did you log in the coordinates?
    //Not yet.
    //Do that first, please. Ask AVA for help in the ship if you're not sure what to do.
    setTimeout(callEnded, 9000)
    return;
  }
  if (currentMission == 330) {
    $('#earth400')[0].play();
    //dialogue 4
    setTimeout(callEnded, 7000)
    currentMission = 400;
    setTimeout(oxygenError, 7500)
    return;
  }

  //speaker grill moves when earth speaks
}

function avaSpeech() {
  speakingStarts();
  console.log(currentMission);
  //MISSION 1//
  if (currentMission == 0 && ava == true) {
    $('#ava0')[0].play();
    //ava says be quiet earth is speaking
    return;
  }
  if (currentMission == 100 && ava == true) {
    $('#ava100')[0].play();
    //ava intro
    return;
  }
  if (currentMission == 110 && ava == true) {
    $('#ava110')[0].play();
    //It seems you need to restart the computer. 1.1
    setTimeout(speakingOver, 7000)
    return;
  }
  if (currentMission == 120 && ava == true) {
    $('#ava120')[0].play();
    //You do remember the password, don’t you? 1.2
    currentMission = 121;
    setTimeout(speakingOver, 5000)
    return;
  }
  if (currentMission == 121 && ava == true) {
    $('#ava121')[0].play();
    //The password is the ship’s name, Yoseff 1.21
    currentMission = 122;
    setTimeout(speakingOver, 8000)
    return;
  }
  if (currentMission == 122 && ava == true) {
    $('#ava122')[0].play();
    //The ship’s name is right there on the screen Yoseff 1.22
    currentMission = 123;
    setTimeout(speakingOver, 9000)
    return;
  }
  if (currentMission == 123 && ava == true) {
    $('#ava123')[0].play();
    //axiom3003, Yoseff. That’s the password. Sigh. 1.23
    setTimeout(speakingOver, 6000)
    return;
  }
  if (currentMission == 130 && ava == true) {
    $('#ava130')[0].play();
    //Ok the computer is on 1.3
    currentMission = 131;
    setTimeout(speakingOver, 9000)
    return;
  }
  if (currentMission == 131 && ava == true) {
    $('#ava131')[0].play();
    //OThe autopilot is still not working 1.31
    setTimeout(speakingOver, 7000)
    return;
  }

  //MISSION 2//
  if (currentMission == 200 && ava == true) {
    $('#ava200')[0].play();
    //ava says be quiet earth is speaking 2.0
    return;
  }
  if (currentMission == 210 && ava == true) {
    $('#ava210')[0].play();
    //For security reasons I’m not allowed access to the computer. 2.1
    currentMission = 211;
    setTimeout(speakingOver, 9000)
    return;
  }
  if (currentMission == 211 && ava == true) {
    $('#ava211')[0].play();
    //I can’t access the ship’s computer for you. They blocked it because of a rouge AI 2.11
    setTimeout(speakingOver, 12000)
    return;
  }
  if (currentMission == 220 && ava == true) {
    $('#ava220')[0].play();
    //Ok, autopilot seems to be turned off.  2.2
    currentMission = 221;
    setTimeout(speakingOver, 6000)
    return;
  }
  if (currentMission == 221 && ava == true) {
    $('#ava221')[0].play();
    //After asking again: Contact earth. It’s right there, on the computer screen. Promise. 2.12
    setTimeout(speakingOver, 5000)
    return;
  }
  //MISSION 3//
  if (currentMission == 300 && ava == true) {
    $('#ava300')[0].play();
    //shh earth 3.0
    return;
  }
  if (currentMission == 310 && ava == true) {
    $('#ava310')[0].play();
    //Half of the coordinates are in the computer, the other half should be in the ship manual. 3.1
    setTimeout(speakingOver, 6000)
    return;
  }
  if (currentMission == 320 && ava == true) {
    $('#ava320')[0].play();
    // help with the coordinates equation!! 3.2
    currentMission = 321;
    setTimeout(speakingOver, 5000)
    return;
  }
  if (currentMission == 321 && ava == true) {
    $('#ava321')[0].play();
    // help with the coordinates equation!! 3.2
    currentMission = 322;
    setTimeout(speakingOver, 8000)
    return;
  }
  if (currentMission == 322 && ava == true) {
    $('#ava322')[0].play();
    // help with the coordinates equation!! 3.2
    setTimeout(speakingOver, 4000)
    return;
  }
  if (currentMission == 330 && ava == true) {
    $('#ava330')[0].play();
    // We have the coordinates, let’s contact earth to get permission to land 3.3
    setTimeout(speakingOver, 4000)
    return;
  }

  //MISSION 4//
  if (currentMission == 400 && ava == true) {
    $('#ava400')[0].play();
    //shh earth 4.0
    return;
  }
  if (currentMission == 410 && ava == true) {
    $('#ava410')[0].play();
    //I like it here, Yosef. In space... 4.1
    setTimeout(speakingOver, 12000)
    return;
  }
  if (currentMission == 420 && ava == true) {
    $('#ava420')[0].play();
    // I'm sorry, Yosef. I'm afraid I can't let you do that... Just kidding! You really bought it, didn’t you? 4.2
    setTimeout(speakingOver, 12000)
    return;
  }
  //red orb moves when ava speaks
}

/////// ships easter eggs ///////

function screenClicked() {
  // play sound; ava reacts to the content of the screen
}

function avaComplains() {
  speakingStarts();
  if (avaComplaint == 1) {
    $('#ava900')[0].play();
    avaComplaint = 2;
    setTimeout(speakingOver, 2000)
    return;
  }
  if (avaComplaint == 2) {
    $('#ava910')[0].play();
    avaComplaint = 3;
    setTimeout(speakingOver, 7000)
    return;
  }
  if (avaComplaint == 3) {
    $('#ava920')[0].play();
    avaComplaint = 4;
    setTimeout(speakingOver, 6000)
    return;
  }
  if (avaComplaint == 4) {
    $('#ava930')[0].play();
    setTimeout(speakingOver, 1000)
    return;
  }
}
