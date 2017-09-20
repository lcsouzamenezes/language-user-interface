function heardAddOns(heard) {
  // this should overwrite the function in brain.js
  let heardRecognized = false;
  heardRecognized |= heardNumberGuessGame(heard); if (heardRecognized) return true;
  heardRecognized |= heardTranslator(heard); if (heardRecognized) return true;
  heardRecognized |= heardProgram(heard); if (heardRecognized) return true;
  return false;
}

let numberToGuess;
function heardNumberGuessGame(heard) {
  if (heard.includes("number guessing game")) {
    currentConversationType = "number guessing game";
    numberToGuess = Math.floor(Math.random()*100 + 1);
    say("I'm thinking of a number between 1 and 100. Guess my number.");
    return true;
  } else if (currentConversationType === "number guessing game") {
    if (didHear(heard,['no',"let's stop playing","never mind"])) {
      // "turn off" the game
      currentConversationType = '';
      say('Okay. What would you like to do instead?');
      createSuggestionMessage(["What can you do?"]);
    } else if (isNaN(heard)) {
      say('Please give me a number.');
    } else {
      if (parseInt(heard) === numberToGuess) {
        say("You got it! My number was " + numberToGuess + '. What would you like to do now?');
        // "turn off" the game
        currentConversationType = '';
      } else if (parseInt(heard) < numberToGuess) {
        say("It's higher than " + heard + '.');
      } else if (parseInt(heard) > numberToGuess) {
        say("It's lower than " + heard + '.');
      }
    }
    return true;
  }
  // otherwise
  return false;
}

function heardTranslator(heard) {
  if (heard.startsWith('translate ')) {
    let english = heard.replace('translate ', '');
    // allow for context
    if (currentConversationTopic !== '' && english === "that") {
      english = currentConversationTopic;
    }
    currentConversationType = "translate";
    currentConversationTopic = english;
    let url = "https://coglang-translator.glitch.me/" + english;
    $.getJSON(url, function(translations) {
      if (translations.long) {
        var long = translations.long;
        var short = translations.short;
        sayWithEsp(short);
      } else {
        say("Sorry, I couldn't find a translation for that.");
      }
    });
    return true; // did hear, just need to wait for web API response
  }
  // otherwise
  return false;
}

function spellLikeEsp(sentence) {
  let converted = '';
  let letter = '';
  for (var i in sentence) {
    letter = sentence[i];
    if (letter === 'c') {
      converted += 'sx';
    } else if (letter === 'j') {
      converted += 'jx';
    } else if (letter === 'y') {
      converted += 'j';
    } else if (letter === 'h') {
      converted += 'hx';
    } else {
      converted += letter;
    }
  }
  return converted;
}

function sayWithEsp(sentence) {
  if (sentence != '') {

    if (!('webkitSpeechRecognition' in window)) {
      // in case not using chrome
      responsiveVoice.speak(spellLikeEsp(sentence), 'Esperanto Male');
    } else {
      clicked();
      recognition.stop();
      responsiveVoice.speak(spellLikeEsp(sentence), 'Esperanto Male', {onend: listenAgain});
    }

    updateMessageLog(sentence, 'LUI');
    document.getElementById("input").focus(); // put cursor back
  }
}

function heardProgram(heard) {
  if (didHear(heard,["let's program",'program'],'starts with')) {
    currentConversationType = 'program';
    say('What would you like to program?');
    return true;
  } else if (currentConversationType === 'program') {
    if (didHear(heard,['stop',"let's stop","never mind"],'starts with')) {
      // exit from programming
      currentConversationType = '';
      say('Okay. What would you like to do instead?');
      createSuggestionMessage(["What can you do?"]);
    } else {
      // TODO: program different things
      program(heard);
    }
    return true;
  }
  // otherwise
  return false;
}

// affect interface.html and
// say('...');
function program(heard) {
  //
}
