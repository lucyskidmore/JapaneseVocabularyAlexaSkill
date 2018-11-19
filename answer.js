'use strict';

const constants = require('./constants');
const answerDict = constants.answerDict;
const vocabDict = constants.vocabDict;
const practice = require('./practice');
const practiceVocab = practice.practiceVocab;
const quiz = require('./quiz');
const quizQuestion = quiz.quizQuestion;
const lesson = require('./lesson');
const teachVocab = lesson.teachVocab;


var moveCard = function(answer, question, currentTopic, currentLeitnerDeck, result, leitnerDecks) {
    
    //moves cue-target pairs up and down leitner deck 
    var currentDeckList = leitnerDecks[currentTopic][currentLeitnerDeck];
    var previousDeckList = leitnerDecks[currentTopic][currentLeitnerDeck-1];
    var nextDeckList = leitnerDecks[currentTopic][currentLeitnerDeck+1];

    if (result === 'correct') {
        //correct items from deck 3 removed completely 
        if (currentLeitnerDeck === 3) {
          currentDeckList.splice(0, 1);
        } else {
            //otherwise promoted to next deck 
            nextDeckList.push(currentDeckList[0]);
            currentDeckList.splice(0, 1);
        }
    } else {
      //incorrect items from deck 0 placed at bottom of pile 
        if (currentLeitnerDeck === 0) {
            currentDeckList.push(currentDeckList[0]);
            currentDeckList.splice(0, 1);
        } else {
            //otherwise demoted to previous deck 
            previousDeckList.push(currentDeckList[0]);
            currentDeckList.splice(0, 1);
        }
    }
    return leitnerDecks;
}; 
    
module.exports = {

    AnswerIntentHandler : {
        canHandle(handlerInput) {
            return handlerInput.requestEnvelope.request.type === 'IntentRequest'
                && handlerInput.requestEnvelope.request.intent.name === 'answerIntent';
        },
        handle(handlerInput) {
              
            //getting session attributes 
            const attributesManager = handlerInput.attributesManager;
            const sessionAttributes = attributesManager.getSessionAttributes();
            const currentTopic = sessionAttributes.currentTopic;
            var correctAnswer = sessionAttributes.currentAnswer;
            const question = sessionAttributes.currentQuestion;
            const currentLeitnerDeck = sessionAttributes.currentLeitnerDeck;
            var leitnerDecks = sessionAttributes.leitnerDecks;
            const currentActivity = sessionAttributes.currentActivity;
            const currentIndex = sessionAttributes.currentIndex;
            const quizDict = sessionAttributes.quizDict;
              
            var userAnswer = ""; 
            var speechText = "";
            var repromptText = "";
              
            //different responses to user's answer depending on activity type: quiz, practice or lesson 
            if (currentActivity === "practice") {
                userAnswer = handlerInput.requestEnvelope.request.intent.slots.answer.value;
                if (userAnswer === correctAnswer) {
                    speechText = "<audio src='https://s3-eu-west-1.amazonaws.com/inaflashaudio/correct.mp3'/>";
                    //if user's answer is correct, move the flashcard up a deck 
                    leitnerDecks = moveCard(correctAnswer, question, currentTopic, currentLeitnerDeck, 'correct', leitnerDecks);
                } else {
                    speechText = "<audio src='https://s3-eu-west-1.amazonaws.com/inaflashaudio/incorrect.mp3'/>" +
                    "The correct answer was " + correctAnswer;
                    //if user's answer is incorrect, move the flashcard down a deck 
                    leitnerDecks = moveCard(correctAnswer, question, currentTopic, currentLeitnerDeck, 'incorrect', leitnerDecks);
                }
                sessionAttributes.leitnerDecks = leitnerDecks;
                speechText += practiceVocab(currentTopic, handlerInput, leitnerDecks);
                repromptText += practiceVocab(currentTopic, handlerInput, leitnerDecks);
      
            } else if (currentActivity === "quiz") {
                //getting session attributes specific to quiz
                var currentQuizIndex = sessionAttributes.currentQuizIndex;
                var correctQuizAnswers = sessionAttributes.correctQuizAnswers;
                const quizType = sessionAttributes.currentQuiz;
                var answerLang = sessionAttributes.answerLang;
                
                
                if (answerLang === 'japanese') {
                    
                    try { 
                        userAnswer = handlerInput.requestEnvelope.request.intent.slots.japanese.value.toLowerCase();
                    } catch (err) {
                        speechText = "<audio src='https://s3-eu-west-1.amazonaws.com/inaflashaudio/incorrect.mp3'/>" +
                        answerDict['incorrect'][answerDict['incorrect'].length * Math.random() << 0] + "The answer is " + correctAnswer + ", ";
                    }

                    correctAnswer = sessionAttributes.currentAnswerAudio;
                    var transliteration = sessionAttributes.currentAnswer;
                    if (transliteration.includes(userAnswer)) {
                        speechText = "<audio src='https://s3-eu-west-1.amazonaws.com/inaflashaudio/correct.mp3'/>" +
                        answerDict['correct'][answerDict['correct'].length * Math.random() << 0];
                        correctQuizAnswers += 1;
                    } else {
                        speechText = "<audio src='https://s3-eu-west-1.amazonaws.com/inaflashaudio/incorrect.mp3'/>" +
                        answerDict['incorrect'][answerDict['incorrect'].length * Math.random() << 0] + "The answer is " + correctAnswer + ", ";
                    }
                } else { //if answer lang is English
                    userAnswer = handlerInput.requestEnvelope.request.intent.slots.answer.value;
                    correctAnswer = sessionAttributes.currentAnswer;
                    if (userAnswer === correctAnswer) {
                        speechText = "<audio src='https://s3-eu-west-1.amazonaws.com/inaflashaudio/correct.mp3'/>" +
                        answerDict['correct'][answerDict['correct'].length * Math.random() << 0];
                        correctQuizAnswers += 1;
                    } else {
                        speechText = "<audio src='https://s3-eu-west-1.amazonaws.com/inaflashaudio/incorrect.mp3'/>" +
                        answerDict['incorrect'][answerDict['incorrect'].length * Math.random() << 0] + "The answer is " + correctAnswer + ", ";
                    }
                }
                sessionAttributes.correctQuizAnswers = correctQuizAnswers;
                
                //checking to see if finished all questions
                if (currentQuizIndex === quizDict[currentTopic].length) { 
                    speechText += "You have finished all questions. "; 
                    
                    //giving user their score 
                    if (correctQuizAnswers === currentQuizIndex) {
                        speechText += "You got everything correct. Fantastic work! ";
                    } else {
                        speechText += "You got " + correctQuizAnswers + 
                        " out of " + currentQuizIndex + " questions correct. "; 
                    }
                    speechText += "What would you like to do now? You can take another quiz, practice, lesson, or exit. "; 
                    repromptText += "What would you like to do now? You can take another quiz, practice, lesson, or exit. "; 
                } else {
                  speechText += " Next question. " + quizQuestion(quizDict, currentTopic, currentQuizIndex, handlerInput, quizType);
                  repromptText += "To hear the question again, say, 'repeat', or say 'pass' if you don't know the answer ";
                }
                
            } else if (currentActivity === "lesson") { 
              
                const transliteration = sessionAttributes.currentAnswer;
                userAnswer = handlerInput.requestEnvelope.request.intent.slots.japanese.value.toLowerCase();
              
                if (transliteration.includes(userAnswer)) {
                    speechText += answerDict['correct'][answerDict['correct'].length * Math.random() << 0] +
                    teachVocab(vocabDict, currentTopic, currentIndex, handlerInput);
                    repromptText += "To hear the word again, say, 'repeat'.";
                } else {
                    speechText += "Not quite, try again" + sessionAttributes.currentJapaneseAudio;
                    repromptText += "Once more" + sessionAttributes.currentJapaneseAudio;
                }
        
            } else { //catching any misunderstood answer intents 
              speechText += "Sorry, an error occured, please say 'stop' to refresh the session. ";
              repromptText += "Sorry, an error occured, please say 'stop' to refresh the session. ";
            }
            
            //set session attributes 
            sessionAttributes['repromptText'] = repromptText;
                
            return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(repromptText)
                .getResponse();
        }
    }
};