'use strict';

const constants = require('./constants');
const vocabDict = constants.vocabDict;

var createLeitner = function(quizDict, currentTopic) {
    
    //creates leitner decks for user
    var leitnerDecks = {};
    leitnerDecks[currentTopic] = [[],[],[],[]];
    
    for (var i = 0; i < quizDict[currentTopic].length; i++) {
        var randomSplice = quizDict[currentTopic].length * Math.random() << 0;
        leitnerDecks[currentTopic][0].splice(randomSplice, 0, i);
        }
    return leitnerDecks;
};

var checkDeck = function(currentTopic, leitnerIndex, deckQueue, handlerInput, leitnerDecks) {
    
    //checking current leitner deck to see if it contains any flashcards
    //recursive check until a non-empty deck is found
    var currentLeitnerDeck = deckQueue[leitnerIndex];
    var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
      
      if (leitnerDecks[currentTopic][currentLeitnerDeck].length === 0) {
        if (leitnerIndex === deckQueue.length-1) {
            return null;
        } else {
            leitnerIndex = leitnerIndex + 1;
            return checkDeck(currentTopic, leitnerIndex, deckQueue, handlerInput, leitnerDecks);
        }
        } else {
        sessionAttributes['leitnerIndex'] = leitnerIndex;
        sessionAttributes['currentLeitnerDeck'] = currentLeitnerDeck;
        return currentLeitnerDeck;
        }
};

var shuffle = function(array) { //https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
};

var getDeckQueue = function(deckFreq) {
    
    //creates the randomised deck queue for practice session
        
    var decks = [0, 1, 2, 3];  
    var deckQueue = [];
      
 	for (var i in decks) {
 		for (var j = 0; j < deckFreq[i]; j++) {
 			deckQueue.push(Number(i));
   	    }
   	 }
   	 
 	//getting random order and starting with deck 1	 
 	deckQueue = shuffle(deckQueue);
 	deckQueue.unshift(0);
     	
    return deckQueue;
};


module.exports = {
  
    practiceVocab : function(currentTopic, handlerInput, leitnerDecks) {
    
        //generates cue for cue-target pair practice
          
        //get session attributes 
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        var leitnerIndex = sessionAttributes.leitnerIndex;
        var deckQueue = sessionAttributes.deckQueue;
        
        var cue = "";
        var currentLeitnerDeck = checkDeck(currentTopic, leitnerIndex, deckQueue, handlerInput, leitnerDecks);
        
        if (currentLeitnerDeck === null) {
        cue = "You have reached the end of the allotted practice. Great job! " + 
        "Next you can choose 'quiz', or if you feel like you need more time to master the words, " +
        "choose 'continue practice', or 'restart lesson'. "; 
        } else {
          var vocabDictIndex = leitnerDecks[currentTopic][currentLeitnerDeck][0];
          cue = vocabDict[currentTopic][vocabDictIndex]['japaneseAudio'];
          var answer = vocabDict[currentTopic][vocabDictIndex]['english'];
        }
        
        sessionAttributes['currentAnswer'] = answer;
        sessionAttributes['currentQuestion'] = cue;
      
        return cue;
    },
  
    PracticeIntentHandler : {
        canHandle(handlerInput) {
            return handlerInput.requestEnvelope.request.type === 'IntentRequest'
                && handlerInput.requestEnvelope.request.intent.name === 'practiceIntent';
        },
        handle(handlerInput) {
          
            //getting session attributes 
            const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
            const currentTopic = sessionAttributes.currentTopic;
            const quizDict = sessionAttributes.quizDict;
            
            var leitnerDecks = createLeitner(quizDict, currentTopic);
            
            //setting session attributes 
            sessionAttributes.leitnerDecks = leitnerDecks;
            sessionAttributes.deckQueue = getDeckQueue([8, 4, 2, 1]);
            sessionAttributes.currentActivity = 'practice';
            sessionAttributes.leitnerIndex = 0;
          
            var speechText = "Ok, let's practice! " +  
            "During the session you will practice the Japanese words that you have learned. " +
            "Please respond with the correct answer in English. " +
            "You can ask for the word to be repeated, or say, 'pass', if you don't know the translation. " +
            "Ready? Let's go! " +
            module.exports.practiceVocab(currentTopic, handlerInput, leitnerDecks);
            
            var repromptText = "The Japanese word is " + sessionAttributes.currentQuestion + 
            "If you don't know the answer, you can say, 'pass' ";
            
            sessionAttributes['repromptText'] = repromptText;
            
            return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(repromptText)
                .getResponse();
        }
    },

    RestartPracticeHandler : {
        canHandle(handlerInput) {
              return handlerInput.requestEnvelope.request.type === 'IntentRequest'
                  && handlerInput.requestEnvelope.request.intent.name === 'restartPracticeIntent';
        },
        handle(handlerInput) {
            //get session attributes 
            const attributesManager = handlerInput.attributesManager;
            const sessionAttributes = attributesManager.getSessionAttributes();
            const currentTopic = sessionAttributes.currentTopic;
            
            var leitnerDecks = createLeitner(sessionAttributes.quizDict, currentTopic);
            
            //setting session attributes 
            sessionAttributes.leitnerDecks = leitnerDecks;
            sessionAttributes.deckQueue = getDeckQueue([8, 4, 2, 1]);
            sessionAttributes.currentActivity = 'practice';
            sessionAttributes.leitnerIndex = 0;
            
            const speechText = "Ok, let's keep practicing! " +
            module.exports.practiceVocab(currentTopic, handlerInput, leitnerDecks);
            
            const repromptText = "The Japanese word is " + sessionAttributes.currentAnswer + 
            "If you don't know the answer, you can say, 'pass'";
            
            sessionAttributes['repromptText'] = repromptText;
    
            return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(repromptText)
                .getResponse();
        }
    }
};
