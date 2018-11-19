'use strict';

const Alexa = require('ask-sdk');
const lesson = require('./lesson');
const practice = require('./practice');
const quiz = require('./quiz');
const launch = require('./launch');
const topic = require('./topic');
const functionality = require('./functionality');
const answer = require('./answer');

const skillBuilder = Alexa.SkillBuilders.standard();
exports.handler = skillBuilder
    .addRequestHandlers(
        launch.LaunchRequestHandler,
        topic.ChooseTopicIntentHandler,
        lesson.LessonIntentHandler,
        practice.PracticeIntentHandler,
        quiz.QuizIntentHandler, 
        quiz.ChooseQuizIntentHandler,
        functionality.StopIntentHandler, 
        functionality.SessionEndedRequestHandler,
        functionality.HelpHandler,
        functionality.ExitHandler,
        functionality.RepeatPairIntentHandler,
        lesson.RestartLessonIntentHandler,
        practice.RestartPracticeHandler,
        answer.AnswerIntentHandler
    )
    .addErrorHandlers(functionality.ErrorHandler)
    .withTableName('In-A-Flash')
    .withAutoCreateTable(true)
    .lambda();