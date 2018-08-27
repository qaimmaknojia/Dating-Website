//API Calls

Ext.define('DateApp.Interface', {
    extend: 'Ext.Base',

    constructor: function () {

    },

    login: function (email, password, success, failure) {
        var url = '/login/';
        var param = {
            email: email,
            password: password   
        };

        var successCallback = function () {
            if (success) {
                success();
            }
        };

        var failCallback = function () {
            if (failure) {
                failure();
            }
        };

        DateApp.platform.post(url, param, successCallback, failCallback);
    },

    logout: function (success, failure) {
        var url = '/logout/';

        var successCallback = function () {
            if (success) {
                success();
            }
        };

        var failCallback = function () {
            if (failure) {
                failure();
            }
        };

        DateApp.platform.get(url, successCallback, failCallback)
    },

    //POST api/member/{id}/poke
    //GET api/member/{id}/poke-stack
    //GET api/member/{id}/poke-list
    member: {
        getProfile: function (id, success, failure) {
            var me = this;
            var url = '/api/member/' + id;
            var successCallback = function (response) {
                if (success) {
                    success(response);
                }
            };

            var failCallback = function () {
                if (failure) {
                    failure();
                }
            };
            DateApp.platform.get(url, successCallback, failCallback);
        },

        // <image width="250" height="250" src="/api/member/{{ user.id }}/picture"></image>


        // <form action="api/member/{{ user.id }}/picture" method="post" enctype="multipart/form-data">
        //     {% csrf_token %}
        //     <p>
        //         <input id="id_image" type="file" class="" name="image">
        //     </p>
        //     <input type="submit" value="Submit" />
        // </form>

        //api/member/id -> media/user_profiles/
        getProfilePicture: function (id, success, failure) {
            var url = '/api/member/' + id + '/picture/';
            var successCallback = function (response) {
                if (success) {
                    success(response);
                }
            };

            var failCallback = function () {
                if (failure) {
                    failure();
                }

            };
            DateApp.platform.get(url, successCallback, failCallback);
        },
        /*
        @param userObj {Object} - has the following properties:
        first_name, last_name, username, email, password
        */
        signUp: function (userObj, success, failure) {
            var url = '/api/member/';
            var successCallback = function () {
                if (success) {
                    success();
                }
            };

            var failCallback = function () {
                if (failure) {
                    failure();
                }
            };
            DateApp.platform.post(url, userObj, successCallback, failCallback);
        },

        poke: function (sender, receiver, success, failure) {
            var url = '/api/member/poke/';
            var param = {
                "sender_user": sender,
                "user_poke": true,
                "receiver_user": receiver
            };

            var successCallback = function (response) {
                if (success) {
                    success(response);
                }
            };

            var failCallback = function () {
                if (failure) {
                    failure();
                }
            };

            DateApp.platform.post(url, param, successCallback, failCallback);
        },

        unfriend: function (sender, receiver, success, failure) {
            var url = '/api/member/' + sender + '/unfriend/' + receiver + '/';
            var successCallback = function (response) {
                if (success) {
                    success(response);
                }
            };

            var failCallback = function () {
                if (failure) {
                    failure();
                }
            };

            DateApp.platform.post(url, null, successCallback, failCallback);
        },

        getPokeStack: function (id, success, failure) {
            var url = '/api/member/' + id + '/pokestack/';
            var successCallback = function (response) {
                if (success) {
                    success(response);
                }
            };

            var failCallback = function () {
                if (failure) {
                    failure();
                }

            };
            DateApp.platform.get(url, successCallback, failCallback);
        },

        isMutual: function (userId, userId2, success, failure) {
            var me = this;
            var url = '/api/member/' + userId  + '/CanSee/' + userId2 + '/';

            var successCallback = function (response) {
                if (success) {
                    success(response);
                }
            };

            var failCallback = function () {
                if (failure) {
                    failure();
                }
            };

            DateApp.platform.get(url, successCallback, failCallback);
        },

        comment: function (sender, content, receiver, success, failure) {
            var url = '/api/member/comment/';
            var param = {
                receiver_user: receiver,
                content: content,
                sender_user: sender
            };
            var successCallback = function (response) {
                if (success) {
                    success(response);
                }
            };

            var failCallback = function () {
                if (failure) {
                    failure();
                }
            };

            DateApp.platform.post(url, param, successCallback, failCallback);
        },

        getFriends: function (id, success, failure) {
            var url = '/api/member/' + id + '/friends/';

            var successCallback = function (response) {
                if (success) {
                    success(response);
                }
            };

            var failCallback = function () {
                if (failure) {
                    failure();
                }
            };

            DateApp.platform.get(url, successCallback, failCallback);

        },

        getPokeList: function (id, success, failure) {
            var url = '/api/member/' + id  + '/poke/';

            var successCallback = function (response) {
                if (success) {
                    success(response);
                }
            };

            var failCallback = function () {
                if (failure) {
                    failure();
                }
            };

            DateApp.platform.get(url, successCallback, failCallback);
        },

        getComments: function (id, success, failure) {
            var url = '/api/member/' + id + '/comments/';
            var successCallback = function (response) {
                if (success) {
                    success(response);
                }
            };

            var failCallback = function () {
                if (failure) {
                    failure();
                }

            };
            DateApp.platform.get(url, successCallback, failCallback);
        },

        getMatches: function (userId, surveyId, success, failure) {
            var url = '/api/member/' + userId + '/matches';
            var param = {
                survey: surveyId
            };
            var successCallback = function (response) {
                if (success) {
                    success(response);
                }
            };

            var failCallback = function () {
                if (failure) {
                    failure();
                }
            };

            DateApp.platform.get(url, successCallback, failCallback, param);
        }
    },

    getAllSurveys: function (success, failure) {
        var url = '/api/survey/';
        var successCallback = function (response) {
            if (success) {
                success(response);
            }
        };

        var failCallback = function () {
            if (failure) {
                failure();
            }
        };
        DateApp.platform.get(url, successCallback, failCallback);
    },

    getSurvey: function (id, success, failure) {
        var url = '/api/survey/' + id;
        var successCallback = function (response) {
            if (success) {
                success(response);
            }
        };

        var failCallback = function () {
            if (failure) {
                failure();
            }
        };
        DateApp.platform.get(url, successCallback, failCallback);
    },

    answer: function (surveyId, questionId, userId, value, success, failure) {
        var url = '/api/answer/';
        var param = {
            user_id: userId,
            survey_id: surveyId,
            question_id: questionId,
            value: value
        };

        var successCallback = function (response) {
            if (success) {
                success(response);
            }
        };

        var failCallback = function () {
            if (failure) {
                failure();
            }
        };

        DateApp.platform.post(url, param, successCallback, failCallback);
    }
});