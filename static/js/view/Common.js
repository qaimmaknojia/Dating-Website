Ext.define('DateApp.Viewport', {
    extend: 'Ext.container.Viewport',
    alias: 'widget.appViewport',

    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            renderTo: Ext.getBody()
        });

        me.callParent(arguments);
    }
});

Ext.define('DateApp.Toolbar', {
     extend: 'Ext.toolbar.Toolbar',
     alias: 'widget.appToolbar',

     initComponent: function () {
        var me = this;
        me.pokeStackContainer = null;
        me.stackHidden = true;

        var logoutFn = function () {
            var logoutSuccess = function () {
                DateApp.utils.redirectTo('');
            };
            DateApp.api.logout(logoutSuccess, logoutSuccess);
        };
        var homeFn = function () {
            DateApp.utils.redirectTo('');
        };

        var profileFn = function () {
            DateApp.utils.redirectTo('member/' + me.userId);
        };

        var pokeStackFn = function (btn) {
            var position = btn.getXY();
            if (!me.pokeStackContainer) {
                me.pokeStackContainer = Ext.create('Ext.container.Container', {
                    name: 'poke-stack-container',
                    cls: 'poke-stack-container',
                    floating: true,
                    maxHeight: 500,
                    width: 400,
                    listeners: {
                        beforeshow: function (cmp) {
                            var listContainer = cmp.down('container[name=poke-stack-list-container]');
                            listContainer.removeAll();
                            DateApp.api.member.getPokeStack(me.userId, function (pokeStack) {
                                if (pokeStack.length == 0) {
                                    var emptyCmp = Ext.create('Ext.Component', {
                                        padding: 10,
                                        html: 'You have no notifications.'
                                    });
                                    listContainer.add(emptyCmp);
                                } else {
                                    Ext.each(pokeStack, function (userId) {
                                        DateApp.api.member.getProfile(userId, function (profile) {
                                            var notificationCmp = Ext.create('Ext.container.Container', {
                                                height: 65,
                                                layout: {
                                                    type: 'hbox',
                                                    align: 'stretch'
                                                },
                                                id: 'notification-' + profile.id,
                                                padding: 10,
                                                style: 'border-bottom: 1px solid gray; background-color: #ececec',
                                                userId: profile.id,
                                                items: [{
                                                    xtype: 'component',
                                                    html: '<img src="/api/member/' + profile.id + '/picture" height=32 width=32 style="float:left">'
                                                }, {
                                                    xtype: 'component',
                                                    padding: 8,
                                                    html: [
                                                        '<div>',
                                                            '<a href="/member/' + profile.id + '">' + Ext.String.htmlEncode(profile.first_name + ' ' + profile.last_name) + '</a>',
                                                            ' has poked you.',
                                                        '</div>'
                                                    ].join('')
                                                }, {
                                                    xtype: 'tbfill'
                                                }, {
                                                    xtype: 'button',
                                                    height: 17,
                                                    width: 17,
                                                    overCls: '',
                                                    cls: 'close-tool',
                                                    text: 'X',
                                                    listeners: {
                                                        click: function (btn) {
                                                            DateApp.api.member.unfriend(me.userId, profile.id, function () {
                                                                listContainer.remove('notification-' + profile.id);
                                                                if (listContainer.items.length == 0) {
                                                                    var emptyCmp = Ext.create('Ext.Component', {
                                                                        padding: 10,
                                                                        html: 'You have no notifications.'
                                                                    });
                                                                    listContainer.add(emptyCmp);
                                                                }
                                                            });
                                                        }
                                                    }
                                                }]
                                            });
                                            listContainer.add(notificationCmp);
                                        });
                                    });
                                }
                            });
                        }
                    },
                    items: [{
                        xtype: 'container',
                        style: 'border-bottom: 1px solid gray',
                        padding: 10,
                        layout: 'hbox',
                        items: [{
                            xtype: 'component',
                            html: 'Poke Notifications'
                        }, {
                            xtype: 'tbfill'
                        }, {
                            xtype: 'button',
                            height: 17,
                            width: 17,
                            overCls: '',
                            cls: 'close-tool',
                            text: 'X',
                            listeners: {
                                click: function (btn) {
                                    btn.up('container[name=poke-stack-container]').hide();
                                    me.stackHidden = true;
                                }
                            }
                        }]
                    }, {
                        xtype: 'container',
                        scrollable: true,
                        maxHeight: 462,
                        name: 'poke-stack-list-container',
                        items: []
                    }]
                });
            }

            if (me.stackHidden) {
                me.pokeStackContainer.showAt(position[0] - 371, position[1] + 32);
                me.stackHidden = false;
            } else {
                me.pokeStackContainer.hide();
                me.stackHidden = true;
            }
            
        };

        Ext.apply(me, {
            border: false,
            height: 50,
            region: 'north',
            cls: 'home-toolbar',
            padding: '0 20',
            defaultButtonUI: 'default',
            items: [{
                xtype: 'component',
                style: {
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: 'white'
                },
                html: DateApp.appName
            }, {
                xtype: 'tbfill'
            }, {
                xtype: 'button',
                overCls: '',
                focusCls: '',
                cls: 'app-button-small',
                text: me.firstName,
                listeners: {
                    click: profileFn
                }
            }, {
                xtype: 'button',
                overCls: '',
                cls: 'app-button-small',
                text: 'Home',
                listeners: {
                    click: homeFn
                }
            }, {
                xtype: 'button',
                overCls: '',
                cls: 'app-button-small',
                text: '!',
                listeners: {
                    click: pokeStackFn
                }
            }, {
                xtype: 'button',
                margin: '0 10',
                overCls: '',
                cls: 'app-button-small',
                text: 'Logout',
                listeners: {
                    click: logoutFn
                }
            }]
        });

        me.callParent(arguments);
     }
});

Ext.define('DateApp.Survey', {
    extend: 'Ext.container.Container',
    alias: 'widget.appSurvey',

    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            overflow: 'auto',
            name: 'survey-container',
            padding: 10,
            answerSentCount: 0,
            items: [{
                xtype: 'component',
                html: '<div class="custom-h2">' + me.survey.survey_name
            }, {
                xtype: 'form',
                margin: '10 0 0 0',
                bodyStyle: 'background-color: transparent',
                border: 0,
                items: []
            }]
        });

        Ext.each(me.survey.questions, function (question, index) {
            var questionWidget = {
                xtype: 'fieldcontainer',
                labelSeparator: '',
                labelAlign: 'top',
                fieldLabel: (index + 1) + '. ' + question.question_text,
                labelStyle: 'font-weight: bold;',
                defaultType: 'radiofield',
                items: []
            };

            if (question.question_type == 0) {
                questionWidget.items.push({
                    boxLabel: DateApp.utils.getAnswerText(question.id, 0),
                    inputValue: '0',
                    name: 'question-' + question.id 
                });
                questionWidget.items.push({
                    boxLabel: DateApp.utils.getAnswerText(question.id, 1),
                    inputValue: '1',
                    name: 'question-' + question.id
                });
            } else if (question.question_type == 1) {
                for (var i = 0; i < 5; i++) {
                    questionWidget.items.push({
                        boxLabel: DateApp.utils.getAnswerText(question.id, i),
                        inputValue: (i + 1).toString(),
                        name: 'question-' + question.id
                    });
                }
            }
            me.items[1].items.push(questionWidget);
        });

        me.items.push({
            xtype: 'button',
            cls: 'app-button-small',
            overCls: '',
            text: 'Submit',
            listeners: {
                click: function (button) {
                    var viewport = button.up('viewport');
                    var form = button.up().down('form');
                    var answers = form.getValues();
                    var cancel = false;

                    viewport.setLoading(true);
                    var success = function () {
                        me.answerSentCount++;
                        if (me.answerSentCount == Ext.Object.getSize(answers)) {
                            Ext.defer(function () {
                                viewport.setLoading(false);
                                DateApp.utils.redirectTo('');
                            }, 1000);
                        }
                    };
                    Ext.each(me.survey.questions, function (question) {
                        if (!answers['question-' + question.id]) {
                            answers['question-' + question.id] = '-1';
                            Ext.Msg.alert('Error', 'You have to answer all the questions before submitting!');
                            viewport.setLoading(false);
                            cancel = true;
                        }
                    });

                    if (cancel) {
                        return false;
                    }
                    Ext.Object.each(answers, function (key, value) {
                        var questionId = parseInt(key.replace('question-', ''));
                        DateApp.api.answer(me.survey.id, questionId, me.userId, value, success, DateApp.api.defaultFailure);
                        
                    });
                }
            }
        });



        me.callParent(arguments);
    }
});