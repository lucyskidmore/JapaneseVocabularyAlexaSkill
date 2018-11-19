'use strict';

const constants = require('./constants');
const vocabDict = constants.vocabDict;
const lesson = require('./lesson');
const teachVocab = lesson.teachVocab;

module.exports = {
    
    ChooseTopicIntentHandler : {
        canHandle(handlerInput) {
            return handlerInput.requestEnvelope.request.type === 'IntentRequest'
                && handlerInput.requestEnvelope.request.intent.name === 'chooseTopicIntent';
        },
    handle(handlerInput) {
      
        //getting session attributes 
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const quizDict = sessionAttributes.quizDict;
        
        const currentTopic = handlerInput.requestEnvelope.request.intent.slots.topicName.value;
        var speechText = '';
        var repromptText = '';
        
        //if user doesn't provide correct answer for topicName slot 
        if ((currentTopic != 'numbers' && currentTopic != 'phrases') === true) {
          speechText = "I didn't quite catch that. Which topic would you like to cover? " +
          " You can choose 'numbers', or 'phrases'.";
        } else {
          
          speechText = "Ok! You have chosen " + currentTopic + ". ";

          //if topic is new, go straight to lesson
          if (!(currentTopic in quizDict) || (quizDict[currentTopic].length === 0)) {
            
            //set the current index for the new topic to 0 
            //create key for current topic in the user's vocabulary dictionary
            const currentIndex = 0;
            sessionAttributes['currentIndex'] = currentIndex;
            sessionAttributes['quizDict'][currentTopic] = [];
            sessionAttributes['currentActivity'] = 'lesson';
            
            speechText += "During the lesson, I'll say an English word which will be followed by the Japanese pronunciation. " +
            "Listen to the Japanese carefully, and repeat back what you heard. " +
            "If you want to hear the word again, say, 'repeat'. " + 
            "Or if you want to stop the lesson, say, 'stop'. <break time='1s'/>" +
            "Ready? Let's go! <break time='1s'/>" + 
            teachVocab(vocabDict, currentTopic, currentIndex, handlerInput);
            
            repromptText = sessionAttributes.currentJapaneseAudio + "Please repeat. ";
            
          } else { //otherwise give choice between activities 
            speechText += " Please choose between 'lessson', 'practice', or 'quiz'. ";
            repromptText = " Please choose between 'lessson', 'practice', or 'quiz'. ";
          }
        }
        
        //set session attributes
        sessionAttributes.currentTopic = currentTopic;
        sessionAttributes.repromptText = repromptText;
    
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(repromptText)
            .getResponse();
        }
    }

};