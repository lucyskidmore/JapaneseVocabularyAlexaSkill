'use strict';

module.exports = {
  
    LaunchRequestHandler : {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    
    async handle(handlerInput) {
      
        //getting persistent attributes from DynamoDB and setting them for the session
        const attributesManager = handlerInput.attributesManager;
        const attributes = await attributesManager.getPersistentAttributes() || {};
        attributesManager.setSessionAttributes(attributes);
        const sessionAttributes = attributesManager.getSessionAttributes();
        
        var speechText = '';
        
        //new user 
        if (Object.keys(attributes).length === 0) {
              sessionAttributes['newUser'] = true;
              sessionAttributes['quizDict'] = {};
              speechText = "Welcome to Japanese Vocabulary! " + 
              "This skill will introduce you to some common words in Japanese. "; 
        //returning user        
        } else {
              sessionAttributes.newUser = false;
              speechText = "Welcome back to Japanese Vocabulary! ";  
        }

        speechText += "Would you like to learn numbers, or phrases? ";

        const repromptText = "Please tell me the topic you would like to cover. " +
        " You can say 'numbers', or 'phrases'. ";
        
        //set session attributes 
        sessionAttributes.currentIndex = 0;
        sessionAttributes.currentActivity = 'launch';
        sessionAttributes.repromptText = repromptText;
        
        return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(repromptText)
        .getResponse();
  }
}
    
};