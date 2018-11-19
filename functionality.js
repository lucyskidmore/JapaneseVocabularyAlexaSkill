'use strict';

const constants = require('./constants');

module.exports = {
  
    RepeatPairIntentHandler : {
        canHandle(handlerInput) {
            return handlerInput.requestEnvelope.request.type === 'IntentRequest'
                && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.RepeatIntent';
        },
        handle(handlerInput) {
      
            //getting session attributes 
            const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
            const currentPair = sessionAttributes.currentPair;
            const currentQuestion = sessionAttributes.currentQuestion;
            
            var speechText = '';
            var repromptText = '';
            
            //repeat response depends on the current activity  
            if (sessionAttributes.currentActivity === 'quiz') {
                speechText = currentQuestion;
                repromptText = currentQuestion;
            }
            else if (sessionAttributes.currentActivity === 'lesson') {
                speechText = currentPair;
                repromptText = currentPair;
            } else { //practice 
                speechText = currentQuestion; 
                repromptText = currentQuestion;
            }
            
            sessionAttributes['repromptText'] = repromptText;
            
            return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(repromptText)
                .getResponse();
        }
    },
  
    StopIntentHandler : {
        canHandle(handlerInput) {
            return handlerInput.requestEnvelope.request.type === 'IntentRequest'
                && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent';
        },
        handle(handlerInput) {
      
            //get session attributes 
            const attributesManager = handlerInput.attributesManager;
            const sessionAttributes = attributesManager.getSessionAttributes();
            
            var speechText = "Ok, I will save your progress. " +
            "Next, you can choose between: ";
            var repromptText = "Please choose either: ";
            
            if (sessionAttributes.currentActivity === 'lesson') {
                speechText += "'practice', 'quiz', or 'exit'";
                repromptText += "'practice', 'quiz', or 'exit'";
            } else if (sessionAttributes.currentActivity === 'practice') {
                speechText += "'lesson', 'quiz', or 'exit'";
                repromptText += "'lesson', 'quiz', or 'exit'";
            } else {
                speechText += "'lesson', 'practice', or 'exit'";
                repromptText += "'lesson', 'practice', or 'exit'";
            }
            
            sessionAttributes['repromptText'] = repromptText;
          
            return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(repromptText)
                .getResponse();
        }
    }, 

    HelpHandler : {
        canHandle(handlerInput) {
            const request = handlerInput.requestEnvelope.request;
            return request.type === 'IntentRequest'
                && request.intent.name === 'AMAZON.HelpIntent';
        },
        handle(handlerInput) {
        
            const speechText = constants.helpMessage;
            const repromptText = constants.helpMessageReprompt;
            
            return handlerInput.responseBuilder
              .speak(speechText)
              .reprompt(repromptText)
              .getResponse();
        },
    }, 

    ExitHandler : {
        canHandle(handlerInput) {
            const request = handlerInput.requestEnvelope.request;
            return request.type === 'IntentRequest'
                && (request.intent.name === 'AMAZON.CancelIntent');
        },
        async handle(handlerInput) {
        
            //saving session attributes 
            const attributesManager = handlerInput.attributesManager;
            const sessionAttributes = attributesManager.getSessionAttributes();
            await attributesManager.setPersistentAttributes(sessionAttributes);
            attributesManager.savePersistentAttributes();
            
            return handlerInput.responseBuilder
                
                .getResponse();
      },
    }, 

    SessionEndedRequestHandler : {
        canHandle(handlerInput) {
            const request = handlerInput.requestEnvelope.request;
            return request.type === 'SessionEndedRequest';
        },
        handle(handlerInput) {
        
            //saving session attributes 
            const attributesManager = handlerInput.attributesManager;
            const sessionAttributes = attributesManager.getSessionAttributes();
            attributesManager.setPersistentAttributes(sessionAttributes);
            attributesManager.savePersistentAttributes();
        
            console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
            return handlerInput.responseBuilder
            
            .getResponse();
        },
    }, 

    ErrorHandler : {
        canHandle() {
            return true;
        },
        handle(handlerInput, error) {
            
            //get session attributes
            const attributesManager = handlerInput.attributesManager;
            const sessionAttributes = attributesManager.getSessionAttributes();
      
            console.log(`Error handled: ${error.message}`);
            const speechText = "Sorry, I didn't quite catch that. " + sessionAttributes.repromptText;
    
            return handlerInput.responseBuilder
                .speak(speechText) 
                .reprompt(constants.helpMessage)
                .getResponse();
        },
    }
};