function initUserHome (user) {
    Ext.onReady(function () {
        //Rendering
        var me = this;

        me.localProfileStore = Ext.create('Ext.data.Store', {
            model: 'User'
        });

        var toolbar = {
            xtype: 'appToolbar',
            firstName: user.first_name,
            userId: user.id
        };

        var userHome = Ext.create('Ext.container.Container', {
            region: 'center',
            name: 'userHome',
            layout: 'card',
            items: [{
                xtype: 'container',
                name: 'firsthome-container',
                layout: {
                    type: 'vbox',
                    align: 'center',
                    pack: 'center'
                },
                items: [{
                    xtype: 'component',
                    html: '<div class="welcome-text">Welcome!</div>'
                }, {
                    xtype: 'button',
                    height: 100,
                    margin: '10 0 0 0',
                    overCls: '',
                    cls: 'app-button-small big-text',
                    text: 'Click Here to Get Started!',
                    listeners: {
                        click: function (btn) {
                            DateApp.utils.redirectTo('survey/1');
                        }
                    }

                }]
            }, {
                xtype: 'container',
                padding: 10,
                scrollable: true,
                name: 'userhome-container',
                layout: {
                    type: 'vbox',
                    align: 'center',
                },
                items: [{
                    xtype: 'container',
                    margin: '10 0 0 0',
                    name: 'matches',
                    layout: {
                        type: 'vbox',
                        pack: 'center',
                        align: 'center'
                    },
                    items: [{
                        xtype: 'component',
                        html: '<div class="custom-h2">View your matches!</div>'
                    }]
                }, {
                    xtype: 'component',
                    name: 'survey-label',
                    margin: '10 0 0 0',
                    html: '<div class="custom-h2">Take a Survey!</div>'
                }, {
                    xtype: 'container',
                    margin: '10 0 10 0',
                    name: 'survey-button-container',
                    items: []
                }]
            }]
        });

        var friends = Ext.create('Ext.container.Container', {
            scrollable: true,
            padding: 10,
            width: 200,
            region: 'west',
            layout: {
                type: 'vbox'
            },
            style: {
                borderRight: '1px solid grey'
            },
            items: [{
                xtype: 'component',
                padding: '10 10 0 10',
                width: '100%',
                html: '<div class="custom-h2">Friends</div>'
            }, {
                xtype: 'container',
                width: '100%',
                padding: 10,
                name: 'friend-list-container',
                items: []
            }]
        });

        var eventList = DateApp.getEventList();
        var eventStore = Ext.create('Ext.data.Store', {
            model: 'Event',
            data: eventList
        });
        var events = Ext.create('Ext.container.Container', {
            scrollable: true,
            padding: 10,
            width: 200,
            region: 'east',
            layout: {
                type: 'vbox',
            },
            style: {
                borderLeft: '1px solid grey',
            },
            items: [{
                xtype: 'component',
                padding: '10 10 0 10',
                width: '100%',
                html: '<div class="custom-h2">Events</div>'
            }, {
                xtype: 'dataview',
                padding: 10,
                width: '100%',
                name: 'event-dataview',
                store: eventStore,
                itemSelector: 'div.event-selector',
                tpl: new Ext.XTemplate(
                    '<tpl for=".">',
                        '<div class="event-selector">',
                            '<div><b>{name}</b></div>',
                            '<div>{datestring}</div>',
                            '<div>{timestring} @ {location}</div>',
                        '</div>',
                    '</tpl>'
                )
            }]
        });



        var viewport = Ext.create('DateApp.Viewport', {
            overflow: 'auto',
            layout: 'border',
            items: [
                toolbar,
                friends,
                events,
                userHome
            ]
        });

        //API Calls
        viewport.setLoading(true);
        var addCmpFn = function (friend) {
            var cmp = Ext.create('Ext.Component', {
                margin: '0 0 10 0',
                html: [
                    '<div>',
                        '<img src="/api/member/' + friend.get('userId') + '/picture" height=32 width=32 style="float:left">',
                        '<div style="padding: 7px;width: 120px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">',
                            '<a href="/member/' + friend.get('userId') + '/">' + Ext.String.htmlEncode(friend.get('first_name') + ' ' + friend.get('last_name')) + '</a>',
                        '</div>',
                    '</div>'
                ].join('')
            });
            friends.down('container[name=friend-list-container]').add(cmp);
        };
        DateApp.api.member.getFriends(user.id, function (friendList) {
            if (friendList.length == 0) {
                var cmp = Ext.create('Ext.Component', {
                    width: '100%',
                    html: 'You currently have no friends. :( Fill out surveys and poke your matches to start connecting!'
                });
                friends.down('container[name=friend-list-container]').add(cmp);
            } else {
                Ext.each(friendList, function (id) {
                    var friendProfile = me.localProfileStore.queryBy(function (rec) {
                        return rec.get('userId') == id;
                    });

                    if (friendProfile[0]) {
                        addCmpFn(friendProfile[0]);
                    } else {
                        DateApp.api.member.getProfile(id, function (friend) {
                            var newProfile = Ext.create('User', {
                                userId: friend.id,
                                email: friend.email,
                                first_name:  friend.first_name,
                                last_name: friend.last_name,
                                phone: friend.userProfile ? friend.userProfile.phoneNumber : '',
                                birthday: friend.userProfile ? friend.userProfile.birthday : ''
                            });
                            me.localProfileStore.add(newProfile);
                            addCmpFn(newProfile);
                        });
                    }
                });
            }
        });
        
        DateApp.api.getAllSurveys(function (surveys) {
            Ext.each(surveys, function (survey) {
                var matchStore = Ext.create('Ext.data.Store', {
                    model: 'Match'
                });
                var matchPanel = Ext.create('Ext.panel.Panel', {
                    margin: '10 0 0 0',
                    cls: 'matches-panel',
                    border: false,
                    surveyId: survey.id,
                    overflowX: 'auto',
                    title: survey.survey_name,
                    titleAlign: 'center',
                    width: 700,
                    height: 200,
                    items: [{
                        xtype: 'dataview',
                        padding: 5,
                        deferEmptyText: false,
                        emptyText: 'You have no matches for this survey.',
                        itemSelector: 'div.match-widget',
                        store: matchStore,
                        tpl: new Ext.XTemplate(
                            {
                                toPercentage: function (rating) {
                                    return rating + '%';
                                },
                                sanitizeText: function (first_name, last_name) {
                                    return Ext.String.htmlEncode(first_name + ' ' + last_name);
                                }
                            },
                            '<tpl for=".">',
                                '<div class="match-widget match-{userId}" style="width: 125px">',
                                '<center><img src="/api/member/{userId}/picture" height=64 width=64></center>',
                                '<div style="text-align:center; width: 120px; overflow: hidden; text-overflow: ellipsis; white-space:nowrap">',
                                    '<a href="/member/{userId}/">{[this.sanitizeText(values.first_name, values.last_name)]}</a>',
                                '</div>',
                                '<div style="text-align:center">Compatibility: {[this.toPercentage(values.compatibility)]}</div>',

                                '</div>',
                            '</tpl>'
                        )
                    }]
                });
                viewport.down('container[name=matches]').add(matchPanel);

                var buttonContainer = viewport.down('container[name=survey-button-container]');
                var matchesSuccess = function (data) {
                    if (survey.id == 1) {
                        userHome.getLayout().setActiveItem(1);
                    }

                    var matchFn = function (match, rating) {
                        var newMatch = Ext.create('Match', {
                            first_name: match.first_name,
                            last_name: match.last_name,
                            userId: match.id,
                            compatibility: rating
                        });
                        matchPanel.down('dataview').getStore().add(match);
                    };
                    Ext.each(data, function (arr) {
                        var matchProfile = me.localProfileStore.queryBy(function (rec) {
                            return rec.get('userId') == arr[0];
                        });

                        if (matchProfile[0]) {
                            matchFn(matchProfile[0], arr[1]);
                        } else {
                            DateApp.api.member.getProfile(arr[0], function (profile) {
                                var newLocalMatch = Ext.create('User', {
                                    first_name: profile.first_name,
                                    last_name: profile.last_name,
                                    userId: profile.id,
                                    compatibility: arr[1]
                                });
                                me.localProfileStore.add(newLocalMatch);
                                matchFn(newLocalMatch);
                            });
                        }
                    });

                    if (buttonContainer.items.length == 0) {
                        buttonContainer.up().down('component[name=survey-label]').hide();
                    } else {
                        buttonContainer.up().down('component[name=survey-label]').show();
                    }
                };

                var fail = function () {
                    var button = Ext.create('Ext.button.Button', {
                        cls: 'app-button-small',
                        overCls: '',
                        margin: '0 5',
                        surveyId: survey.id,
                        text: survey.survey_name,
                        height: 64,
                        width: 140,
                        listeners: {
                            click: function (btn) {
                                DateApp.utils.redirectTo('survey/' + survey.id);
                            }
                        }
                    });
                    buttonContainer.add(button);

                    if (buttonContainer.items.length == 0) {
                        buttonContainer.up().down('component[name=survey-label]').hide();
                    } else {
                        buttonContainer.up().down('component[name=survey-label]').show();
                    }
                };

                DateApp.api.member.getMatches(user.id, survey.id, matchesSuccess, fail);
            });
        });

        Ext.defer(function () {
            viewport.setLoading(false);
        }, 1250);
    });
};