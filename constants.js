'use strict';

module.exports = {

    vocabDict : {
        numbers : [
            {
                english: "1",
                transliteration: ["itchy", "ichi", "i chi"],
                japaneseAudio: "<audio src='https://s3-eu-west-1.amazonaws.com/inaflashaudio/one.mp3'/>"
            },
                {
                english: "2",
                transliteration: ["knee", "ni", "nee"],
                japaneseAudio: "<audio src='https://s3-eu-west-1.amazonaws.com/inaflashaudio/two.mp3'/>"
            },
            {
                english: "3",
                transliteration: ["san", "son", "sand", "sam"],
                japaneseAudio: "<audio src='https://s3-eu-west-1.amazonaws.com/inaflashaudio/three.mp3'/>"
            },
            {
                english: "4",
                transliteration: ["she", "shi", "sheep", "cheap", "chi"],
                japaneseAudio: "<audio src='https://s3-eu-west-1.amazonaws.com/inaflashaudio/four.mp3'/>"
            },
            {
                english: "5",
                transliteration: ["go", "goh", "goat", "gore"],
                japaneseAudio: "<audio src='https://s3-eu-west-1.amazonaws.com/inaflashaudio/five.mp3'/>",
            },
            {
                english: "6",
                transliteration: ["rocku", "rockoo", "roku", "dockoo", "lockoo", "lock", "rock", "dock"],
                japaneseAudio: "<audio src='https://s3-eu-west-1.amazonaws.com/inaflashaudio/six.mp3'/>"
            },
            {
                english: "7",
                transliteration: ["nanna", "nana", "na na", "nabba", "number"],
                japaneseAudio: "<audio src='https://s3-eu-west-1.amazonaws.com/inaflashaudio/seven.mp3'/>"
            },
            {
                english: "8", 
                transliteration: ["hatchy", "hachi", "hatching", "hatchee"],
                japaneseAudio: "<audio src='https://s3-eu-west-1.amazonaws.com/inaflashaudio/eight.mp3'/>"
            },
            {
                english: "9",
                transliteration: ["queue", "Q", "kyuu", "kyoo", "cue"],
                japaneseAudio: "<audio src='https://s3-eu-west-1.amazonaws.com/inaflashaudio/nine.mp3'/>"
            },
            {
                english: "10",
                transliteration: ["jew", "chew", "due", "juu"],
                japaneseAudio: "<audio src='https://s3-eu-west-1.amazonaws.com/inaflashaudio/ten.mp3'/>"
            }
        ],
        
        phrases : [
            {
                english: "hello",
                transliteration: ["konichiwa", "kon nichi wa", "konnichiwa"],
                japaneseAudio: "<audio src='https://s3-eu-west-1.amazonaws.com/inaflashaudio/hello.mp3'/>"
            },
            {
                english: "goodbye",
                transliteration: ["sa your na ra", "sayounara", "sayonara"],
                japaneseAudio: "<audio src='https://s3-eu-west-1.amazonaws.com/inaflashaudio/goodbye.mp3'/>"
            },
            {
                english: "good morning",
                transliteration: ["oh hi your", "ohio", "ohaiyou"],
                japaneseAudio: "<audio src='https://s3-eu-west-1.amazonaws.com/inaflashaudio/goodmorning.mp3'/>"
            },
            {
                english: "yes",
                transliteration: ["hi", "high", "hai"],
                japaneseAudio: "<audio src='https://s3-eu-west-1.amazonaws.com/inaflashaudio/yes.mp3'/>"
            }, 
            {
                english: "thank you",
                transliteration: ["harrygateau", "harry gateau", "arigato", "arigatou"],
                japaneseAudio: "<audio src='https://s3-eu-west-1.amazonaws.com/inaflashaudio/thankyou.mp3'/>"
            },
            {
                english: "good evening",
                transliteration: ["con ban wa", "konbanwa"],
                japaneseAudio: "<audio src='https://s3-eu-west-1.amazonaws.com/inaflashaudio/goodevening.mp3'/>"
            },
            {
                english: "no",
                transliteration: ["ee yeah", "E yeah", "iie", "yeah", "iiie"],
                japaneseAudio: "<audio src='https://s3-eu-west-1.amazonaws.com/inaflashaudio/no.mp3'/>"
            },
            {
                english: "excuse me",
                transliteration: ["sue me ma sen", "sumimasen", "soo mee ma sen"],
                japaneseAudio: "<audio src='https://s3-eu-west-1.amazonaws.com/inaflashaudio/excuseme.mp3'/>"
            },
            {
                english: "please",
                transliteration: ["coup da sigh", "kudasai", "koo da sa ee", "could i say it", "koo da sigh"],
                japaneseAudio: "<audio src='https://s3-eu-west-1.amazonaws.com/inaflashaudio/please.mp3'/>"
            },
            {
                english: "sorry",
                transliteration: ["gomen nasai", "gommen na sigh", "gomenasai", "go men na sai"],
                japaneseAudio: "<audio src='https://s3-eu-west-1.amazonaws.com/inaflashaudio/sorry.mp3'/>"
            }    
        ]
    },
  
    answerDict : {
        correct: ["Well done! ", "That's right! ", "Great job! ", "Nice one! ", "Good work! ", "Fantastic! ", "Brilliant! ", "You got it! ", "Nailed it! "],
        incorrect: ["Oh no! ", "Not quite. ", "Almost. ", "Good guess. ", "That's incorrect. ", "Ah, nearly. "]
    },
  
    helpMessage : "Japanese vocabulary introduces you to simple words in Japanese. " +
    "You are able to take lessons, practice pronunciation, and take quizzes. " +
    "First, you need to choose a topic of study. " +
    "The following topics are available: 'numbers', or 'phrases'. " +
    "Which topic would you like to study? ", 
  
    helpMessageReprompt : "You can study either 'numbers', or 'phrases'" + 
    "Which topic would you like to cover?"
  
};










