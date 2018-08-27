Ext.Loader.setConfig({
    disableCaching: false
});

// Initialize Namespace
Ext.ns('DateApp');

// Initialize API 
DateApp.platform = Ext.create('DateApp.Platform');
DateApp.api = Ext.create('DateApp.Interface');
DateApp.appName = 'SFU Match';

//Hardcoded answers, no time to add to backend
DateApp.truthyAnswers = ['False', 'True'];
DateApp.yesNoAnswers = ['Yes', 'No'];
DateApp.rateAnswers = ['1', '2', '3' ,'4', '5'];
DateApp.answers = [{
    question_id: 1,
    answers: [
        'Male',
        'Female'
    ]
}, {
    question_id: 2,
    answers: [
        'Male',
        'Female'
    ]
}, {
    question_id: 3,
    answers: DateApp.yesNoAnswers
}, {
    question_id: 4,
    answers: DateApp.yesNoAnswers
}, {
    question_id: 5,
    answers: DateApp.rateAnswers
}, {
    question_id: 6,
    answers: DateApp.rateAnswers
}, {
    question_id: 7,
    answers: [
        'Toilet Paper',
        'Phone',
        'A Good Book',
        'Pen and Paper',
        'Nothing and enjoy the view.'
    ]
}, {
    question_id: 8,
    answers: [
        'Invisibility',
        'Time Travel',
        'Flying',
        'Super Speed',
        'Teleportation'
    ]
}, {
    question_id: 9,
    answers: [
        'Money... of course!',
        'Happiness!'
    ]
}, {
    question_id: 10,
    answers: DateApp.rateAnswers
}, {
    question_id: 11,
    answers: DateApp.yesNoAnswers
}, {
    question_id: 12,
    answers: [
        'World',
        'Universe',
        'Who cares!',
        'Students',
        '$$$$$$$'
    ]
}, {
    question_id: 13,
    answers: [
        '0 - 1',
        '1 - 2',
        '2 - 3',
        '3 - 4',
        '4+'
    ]
}, {
    question_id: 14,
    answers: [
        'Yay!',
        'Nay!'
    ]
}, {
    question_id: 15,
    answers: [
        '0... who needs studying',
        '1 - 3... A little amount',
        '3 - 10... I can get by',
        '10 - 25... A decent amount',
        '25+ No life'
    ]
}, {
    question_id: 16,
    answers: [
        'Avocado!',
        'Egg!'
    ]
}, {
    question_id: 17,
    answers: [
        'SFU Dining Hall',
        'Mackenzie Cafe',
        'Triple Os White Spot',
        'Gyro place at Cornerstone',
        'Nothing beats a home packed lunch!'
        ]
}, {
    question_id: 18,
    answers: [
        'Hockey',
        'Basketball',
        'Soccer',
        'Cricket',
        'Badminton'
        ]
}, {
    question_id: 19,
    answers: [
        '0... I don\'t play sports.',
        'Very rarely',
        'Occasionally',
        'A few times a week',
        'Everyday!'
        ]
}, {
    question_id: 20,
    answers: DateApp.yesNoAnswers
}
, {
    question_id: 21,
    answers: DateApp.yesNoAnswers
}
, {
    question_id: 22,
    answers: [
        'Eh... don\'t care',
        'It\'s alright',
        'Sounds interesting!',
        'People can get paid playing video games? Sign me up!',
        'I am all for it!'
        ]
}];

DateApp.getEventList = function () {
    return [{
        name: 'End-of-Finals Celebration',
        location: 'Highland Pub',
        ts: new Date(2016, 3, 26, 18, 30, 0)
    }, {
        name: 'SFSS Dodgeball Night',
        location: 'West Gym',
        ts: new Date(2016, 4, 6, 20, 0, 0)
    }, {
        name: 'K-STORM Icebreaker',
        location: 'MBC Conference Room',
        ts: new Date(2016, 4, 20, 19, 0, 0)
    }
    , {
        name: 'Catholic Mass on Campus',
        location: 'Interfaith Centre, AQ',
        ts: new Date(2016, 4, 26, 12, 30, 0)
    }];
};

// App-wide helper functions
DateApp.utils = {
    redirectTo: function (route) {
        var url = document.location.host;
        var protocol = document.location.protocol + '//';
        var baseURL = protocol + url;

        window.location = baseURL + '/' + route;
    },

    defaultFailure: function () {
        Ext.Msg.alert('Internal Server Error', 'An error occured. Please try again later.');
    },

    getAnswerText: function (question_id, value) {
        var answerText = '';
        Ext.each(DateApp.answers, function (questionObj) {
            if (questionObj.question_id == question_id) {
                answerText = questionObj.answers[value];
            }
        });

        return answerText;
    }
};