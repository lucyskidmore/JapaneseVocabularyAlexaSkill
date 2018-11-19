'use strict';

const constants = require('./constants');
const vocabDict = constants.vocabDict;

//https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
var shuffle = function(array) { 
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

var randomAnswer = function (quizDict, currentTopic, language) {
    
    //chooses a random English or Japanese word from the user's dictionary 
    var randomIndex = quizDict[currentTopic].length * Math.random() << 0;
  
    if (language === 'japanese') {
        return vocabDict[currentTopic][randomIndex]['japaneseAudio']; 
    } else {
        return vocabDict[currentTopic][randomIndex]['english']; 
    }
};

var randomChoiceArray = function(answerLang, answer, quizDict, currentTopic) {
  
    //creates array of random answers for multiple choice questions
    var randomChoiceArrray = [answer];
    var randomChoice = randomAnswer(quizDict, currentTopic, answerLang);
    
    while (randomChoiceArrray.length < 3) {
        if (randomChoiceArrray.indexOf(randomChoice) > -1) {
            randomChoice = randomAnswer(quizDict, currentTopic, answerLang);
        } else {
            randomChoiceArrray.push(randomChoice);
        }
    }
    
    return shuffle(randomChoiceArrray);
};

var getFalseTarget = function(answerTF, quizDict, currentTopic, answerLang) {
  
    //chooses random false target for true or false questions
    var falseTarget = randomAnswer(quizDict, currentTopic, answerLang);
    
    if (falseTarget != answerTF) {
        return falseTarget;
    } else {
        falseTarget = getFalseTarget(answerTF, quizDict, currentTopic, answerLang);
    }
    
    return falseTarget;
};

module.exports = {
    
    quizQuestion : function(quizDict, currentTopic, currentQuizIndex, handlerInput, quizType) {
        //generates quiz question depending on quiz type
      
        //getting session attributes
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        var answerLang = sessionAttributes.answerLang;
        
        //getting English and Japanese pairs 
        var vocabDictIndex = quizDict[currentTopic][currentQuizIndex];
        var japanese = vocabDict[currentTopic][vocabDictIndex]['japaneseAudio'];
        var english = vocabDict[currentTopic][vocabDictIndex]['english'];
        var transliteration = vocabDict[currentTopic][vocabDictIndex]['transliteration'];
        
        //randomly choosing questions and answers
        var falseTarget = getFalseTarget(answerTF, quizDict, currentTopic, answerLang);
        var randomBoolean = Math.random() >= 0.5;
        if (randomBoolean === true) {
          var questionSlot = english;
          var answer = transliteration;
          var answerTF = japanese;
          answerLang = 'japanese';
        } else {
          questionSlot = japanese;
          answer = english;
          answerTF = english;
          answerLang = 'english';
        }
        
        var question = '';
        if (quizType === 'quick fire') {
            question = "What is the translation for " + questionSlot;
            
        } else if (quizType === 'multiple choice') {
            var choices = randomChoiceArray(answerLang, answerTF, quizDict, currentTopic);
            question = "Which is the correct translation for " + questionSlot + "<break time='1s'/>" +
            " Is it: " + choices[0] + ", " + choices[1] +  ", or " + choices[2];
            
        } else { //true or false 
            answerLang = 'english';  
            randomBoolean = Math.random() >= 0.5;
            if (randomBoolean === true) {
                question = "The word, '" + questionSlot + "', means, '" + answerTF;
                answer = "true";
            } else {
                question = "The word, '" + questionSlot + "', means, '" + falseTarget;
                answer = "false";
            }
        }
        
        //setting session attributes 
        sessionAttributes.currentQuizIndex = currentQuizIndex + 1;
        sessionAttributes.currentQuestion = question;  
        sessionAttributes.currentAnswer = answer;
        sessionAttributes['currentAnswerAudio'] = answerTF;
        sessionAttributes.answerLang = answerLang;
        
        return question;
        
    },
        
    QuizIntentHandler : {
        canHandle(handlerInput) {
            return handlerInput.requestEnvelope.request.type === 'IntentRequest'
                && handlerInput.requestEnvelope.request.intent.name === 'quizIntent';
        },
        handle(handlerInput) {
            //getting session attributes 
            const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
          
            const speechText = "Ok, please choose between quickfire, multiple choice, or true or false. ";
            const repromptText = "Please choose between quickfire practice, multiple choice, or true or false. ";
            
            //setting session attributes 
            sessionAttributes['currentActivity'] = 'quiz';
            sessionAttributes['repromptText'] = repromptText;
            
            return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(repromptText)
                .getResponse();
        }
    },
        
    ChooseQuizIntentHandler : {  
        canHandle(handlerInput) {
            return handlerInput.requestEnvelope.request.type === 'IntentRequest'
                && handlerInput.requestEnvelope.request.intent.name === 'chooseQuizIntent';
        },
        handle(handlerInput) {
            //getting session attributes 
            const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
            const currentTopic = sessionAttributes.currentTopic;
            const quizDict = sessionAttributes.quizDict;
            
            //shuffling order of questions
            quizDict[currentTopic] = shuffle(quizDict[currentTopic]);
            
            const quizType = handlerInput.requestEnvelope.request.intent.slots.quizType.value;
            var speechText = '';
            var repromptText = '';
            
            //if user doesn't provide correct answer for quizType slot 
            if ((quizType != 'multiple choice' && quizType != 'true or false' && quizType != 'quick fire') === true) {
                speechText = "I didn't quite catch that, which quiz would you like to take? " +
                "You can choose between 'multiple choice', 'quick fire' or 'true or false'. ";
                repromptText = "Please choose between 'multiple choice', 'quickfire' or 'true or false'. ";
                
            } else {
              
                //setting session attributes
                var currentQuizIndex = 0;
                var correctQuizAnswers = 0;
                sessionAttributes['currentQuizIndex'] = currentQuizIndex;
                sessionAttributes['correctQuizAnswers'] = correctQuizAnswers;
                sessionAttributes['currentQuiz'] = quizType;
                sessionAttributes['answerLang'] = '';
              
                //quiz explanations 
                if (quizType === 'quick fire') {
                    speechText += "Quickfire it is! "  +
                    "In this quiz you will hear a set of short questions. " +
                    "Please respond with the answer or say, 'pass', if you don't know the answer. ";
                } else if (quizType === 'multiple choice') {
                    speechText += "Ok, multiple choice! " +
                    "In this quiz you will be given the choice between 3 answers. " +
                    "Please respond with the correct answer or say, 'pass', if you don't know the answer. ";
                } else {
                    speechText += "Ok, true or false! " +
                    "In this quiz I will read out a statement, please reply saying whether it is true or false. ";
                }
              
                //getting question 
                speechText += "To hear the question again, say, 'repeat'. " +
                "Ready? Lets go! " +
                module.exports.quizQuestion(quizDict, currentTopic, currentQuizIndex, handlerInput, quizType);
                repromptText = sessionAttributes.currentQuestion;
            }
            
            //setting session attributes
            sessionAttributes['repromptText'] = repromptText;
            
            return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(repromptText)
                .getResponse();
        }
    }
};