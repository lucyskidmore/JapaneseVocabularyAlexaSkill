'use strict';

const constants = require('./constants');
const vocabDict = constants.vocabDict;

module.exports = {
    
    teachVocab : function(vocabDict, currentTopic, currentIndex, handlerInput) {
        
        //generates Japanese and English word to introduce to user
  
        var speechText = '';
  
        //check if all words have been covered in lesson
        if (currentIndex === vocabDict[currentTopic].length) {
            speechText = "You have finished the lesson. " +
            "Do you want to practice, take a quiz, or restart the lesson? ";
            
        } else {
            //get session attributes 
            const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
            const quizDict = sessionAttributes.quizDict;
            
            //get English and Japanese pairs 
            const english = vocabDict[currentTopic][currentIndex]['english'];
            const transliteration = vocabDict[currentTopic][currentIndex]['transliteration'];
            const japaneseAudio = vocabDict[currentTopic][currentIndex]['japaneseAudio']; 
            
            //set session attributes 
            sessionAttributes['currentPair'] = english + "<break time='1s'/>" + japaneseAudio;
            sessionAttributes['currentIndex'] = currentIndex + 1;
            sessionAttributes['currentJapaneseAudio'] = japaneseAudio;
            sessionAttributes['currentAnswer'] = transliteration;
            
            //add new word pair to user's vocabulary dictionary 
            var randomSplice = quizDict[currentTopic].length * Math.random() << 0;
            if (quizDict[currentTopic].includes(currentIndex) === false) { 
                quizDict[currentTopic].splice(randomSplice, 0, currentIndex);
            }
            speechText =  "The word, " + english + ", is <break time='1s'/>" + japaneseAudio + ", please repeat: ";
        }
        
    return speechText;
    
    }, 
    
    LessonIntentHandler : {
        canHandle(handlerInput) {
            return handlerInput.requestEnvelope.request.type === 'IntentRequest'
                && handlerInput.requestEnvelope.request.intent.name === 'lessonIntent';
        },
        handle(handlerInput) {
            //getting session attributes 
            const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
            const currentTopic = sessionAttributes.currentTopic;
            const currentIndex = sessionAttributes.currentIndex;
            
            const speechText = "Ok! You have chosen to learn " + currentTopic + ". " +
            "During the lesson, I'll say an English word which will be followed by the Japanese pronunciation. " +
            "Listen to the Japanese carefully, and repeat back what you heard. " +
            "If you want to hear the word again, say, 'repeat'. " + 
            "Or if you want to stop the lesson, say, 'stop'. <break time='1s'/>" +
            "Ready? Let's go! <break time='1s'/>" + 
            module.exports.teachVocab(vocabDict, currentTopic, currentIndex, handlerInput);
            
            const repromptText = sessionAttributes.currentJapaneseAudio + "Please repeat.";
            
            //setting session attributes
            sessionAttributes.currentActivity = 'lesson';
            sessionAttributes.repromptText = repromptText;
            
            return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(repromptText)
                .getResponse();
        }
    },

    RestartLessonIntentHandler : { 
        canHandle(handlerInput) {
            return handlerInput.requestEnvelope.request.type === 'IntentRequest'
                && handlerInput.requestEnvelope.request.intent.name === 'restartLessonIntent';
        },
        handle(handlerInput) {
          
            //getting session attributes  
            const attributesManager = handlerInput.attributesManager;
            const sessionAttributes = attributesManager.getSessionAttributes();
            const currentTopic = sessionAttributes.currentTopic;
            
            const currentIndex = 0;
  
            const speechText = "You have chosen to restart the lesson. " + 
            "Ready? Let's go! <break time='1s'/>" +
            module.exports.teachVocab(vocabDict, currentTopic, currentIndex, handlerInput);
            
            const repromptText = sessionAttributes.currentJapaneseAudio + "Please repeat. ";
            
            //setting session attributes 
            sessionAttributes.currentActivity = 'lesson';
            sessionAttributes.currentIndex = currentIndex;
            sessionAttributes.repromptText = repromptText;
            
            return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(repromptText)
                .getResponse();
        }
    }
};