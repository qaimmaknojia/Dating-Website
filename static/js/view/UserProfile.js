function initUserProfile (user, memberId, csrfToken) {
    Ext.onReady(function () {
        if (!user.id || user.id == "None" || !memberId) {
            DateApp.utils.redirectTo('');
        }

        var showWindow = function () {
            Ext.create('Ext.window.Window', {
                title: 'Picture Upload',
                bodyPadding: 10,
                draggable: false,
                autoShow : true,
                border: false,
                shadow: false,
                modal: true,
                items: [{
                    xtype: 'container',
                    layout: {
                        type: 'vbox'
                    },
                    items: [{
                        xtype: 'component',
                        html: [
                        '<form action="/api/member/' + memberId + '/picture" method="post" enctype="multipart/form-data">',
                            '<input type="hidden" name="csrfmiddlewaretoken" value="' + csrfToken + '">',
                            '<p><input id="id_image" type="file" class="" name="image"></p>',
                        '</form>'
                        ].join('')
                    }, {
                        xtype: 'container',
                        width: 400,
                        layout: 'hbox',
                        margin: '10 0 0 0',
                        items: [{
                            xtype: 'tbfill'
                        }, {
                            xtype: 'button',
                            overCls: '',
                            cls: 'app-button-small',
                            text: 'Upload',
                            listeners: {
                                click: function (button) {
                                    var form = Ext.get("id_image").dom;
                                    var file;

                                    //Only accept png/jpg and < 3MB files
                                    if (form.files && form.files[0]) {
                                        file = form.files[0];
                                        if ((file.type == "image/jpeg" ||
                                            file.type == "image/png") &&
                                            file.size < 3000000) {
                                            //Request format:
                                            var request = {
                                                form: form.parentNode.parentNode,
                                                url: '/api/member/' + user.id + '/picture',
                                                isUpload: true,
                                                method: 'POST',
                                                headers: {'Content-type': 'multipart/form-data'},
                                                success: function (response) {
                                                    button.up('window').close();
                                                    window.location.reload(true);
                                                }
                                            };

                                            Ext.Ajax.request(request);
                                        } else {
                                            Ext.Msg.alert('Upload Error', 'The file must be a valid jpeg or png format and less than 3MB');
                                        }
                                    } 
                                    
                                }
                            }
                        }]
                    }]
                }]
            });
        };
        var success = function (profile) {
            var birthday = new Date();;
            var phone = '';
            var first_name = profile.first_name;
            var last_name = profile.last_name;
            var email = profile.email;
            var currUserFlag = user.id == memberId;
            var phoneFormatted = '';
            var userProfile = profile.userProfile;

            if (!first_name && !last_name && !email) {
                DateApp.utils.redirectTo('');
            }
            
            if (userProfile) {
                if (userProfile.birthday) {
                    birthday = new Date(userProfile.birthday);
                }

                if (userProfile.phoneNumber) {
                    phone = userProfile.phoneNumber;
                }
            } 

            var chars = {0:'(',3:') ',6:'-'};
            for (var i = 0; i < phone.length; i++) {
                phoneFormatted += (chars[i] || '') + phone[i];
            }
            
            

            var toolbar = Ext.create('DateApp.Toolbar', {
                firstName: user.first_name,
                userId: user.id,
                dock: 'top'
            });

            var profile = Ext.create('Ext.container.Container', {
                width: '30%',
                height: '100%',
                name: 'profile-container',
                layout: {
                    type: 'vbox',
                    align: 'center'
                },
                style: 'border-right: 1px solid grey; background-color: #ececec !important',
                items: [{
                    xtype: 'image',
                    name: 'profile-picture',
                    margin: '10 0 0 0',
                    src: '/static/resources/images/blank-profile.png',
                    height: 256,
                    width: 256
                }, {
                    xtype: 'button',
                    name: 'file-upload',
                    cls: 'app-button-small',
                    overCls: '',
                    text: 'Update Profile Picture',
                    width: 256,
                    listeners: {
                        click: showWindow
                    }
                }, {
                    xtype: 'component',
                    margin: '10 0 0 0',
                    html: Ext.String.htmlEncode('Name: ' + first_name + ' ' + last_name)
                }, {
                    xtype: 'container',
                    hidden: true,
                    width: '100%',
                    layout: {
                        type: 'vbox',
                        align: 'center'
                    },
                    name: 'contact-info',
                    items: [{
                        xtype: 'component',
                        name: 'birthday-text',
                        margin: '10 0 0 0',
                        html: 'Birthday: ' + months[birthday.getMonth()] + ' ' + birthday.getDate() + ', ' + birthday.getUTCFullYear() 
                    }, {
                        xtype: 'component',
                        name: 'email-text',
                        margin: '10 0 0 0',
                        html: Ext.String.htmlEncode('Email: ' + email)
                    }, {
                        xtype: 'component',
                        name: 'phone-text',
                        margin: '10 0 0 0',
                        html: Ext.String.htmlEncode('Phone: ' + phoneFormatted)
                    }]
                }, {
                    xtype: 'button',
                    name: 'poke-button',
                    hidden: true,
                    overCls: '',
                    cls: 'app-button-small',
                    margin: '10 0 0 0',
                    text: 'Poke',
                    height: 30,
                    width: 80,
                    listeners: {
                        click: function (btn) {
                            var success = function () {
                                var cmp = btn.up();
                                var contactInfo = cmp.down('component[name=contact-info]');
                                btn.hide();
                                btn.up().down('component[name=poke-text]').show();
                                DateApp.api.member.isMutual(user.id, memberId, function (flag) {
                                    if (flag) {
                                        DateApp.api.member.getProfile(memberId, function (data) {
                                            var email = data.email;
                                            var birthday = '';
                                            var birthdayFormatted = '';
                                            var phone = '';
                                            var phoneFormatted = '';
                                            if (data.userProfile) {
                                                birthday = new Date(data.userProfile.birthday);
                                                birthdayFormatted = months[birthday.getMonth()] + ' ' + birthday.getDate() + ', ' + birthday.getUTCFullYear();
                                                phone = data.userProfile.phoneNumber;

                                                var chars = {0:'(',3:') ',6:'-'};
                                                for (var i = 0; i < phone.length; i++) {
                                                    phoneFormatted += (chars[i] || '') + phone[i];
                                                }
                                            }
                                            contactInfo.down('component[name=email-text]').setHtml(Ext.String.htmlEncode('Email: ' + email));
                                            contactInfo.down('component[name=birthday-text]').setHtml(Ext.String.htmlEncode('Birthday: ' + birthdayFormatted));
                                            contactInfo.down('component[name=phone-text]').setHtml(Ext.String.htmlEncode('Phone: ' + phoneFormatted));
                                            cmp.down('component[name=poke-text]').hide();
                                            contactInfo.show();
                                        });
                                    }
                                });
                            };
                            DateApp.api.member.poke(user.id, memberId, success, DateApp.utils.defaultFailure)
                        }
                    }
                }, {
                    xtype: 'component',
                    name: 'poke-text',
                    hidden: true,
                    margin: '10 0 0 0',
                    html: 'Poked!'
                }]
            });

            var commentStore = Ext.create('Ext.data.Store', {
                id: 'comment-store',
                model: 'Comment',
                sorters: [{
                    property: 'ts',
                    direction: 'DESC'
                }]
            });

            var commentContainer = Ext.create('Ext.container.Container', {
                height: '100%',
                cls: 'comment-container',
                style: 'overflow-y: auto; background-color: #ececec !important',
                width: '70%',
                layout: {
                    type: 'vbox',
                    align: 'center'
                },
                items: [{
                    xtype: 'textarea',
                    width: 500,
                    margin: '20 0 0 0',
                    fieldLabel: 'Comment',
                    labelAlign: 'top'
                }, {
                    xtype: 'container',
                    margin: '10 0 0 0',
                    width: 500,
                    layout: 'hbox',
                    items: [{
                        xtype: 'tbfill'
                    }, {
                        xtype: 'button',
                        overCls: '',
                        cls: 'app-button-small',
                        text: 'Post',
                        listeners: {
                            click: function (button) {
                                var store = Ext.getStore('comment-store');
                                var textarea = button.up().up().down('textarea');
                                var content = textarea.getValue();
                                var success = function (comment) {
                                    var newComment = Ext.create('Comment', {
                                        first_name: user.first_name,
                                        last_name: user.last_name,
                                        userId: comment.sender_user,
                                        content: comment.content,
                                        receiver_user: comment.receiver_user,
                                        ts: new Date()
                                    });
                                    textarea.setValue('');
                                    store.insert(0, newComment);
                                };
                                DateApp.api.member.comment(user.id, content, memberId, success)
                            }
                        }
                    }]

                }, {
                    xtype: 'dataview',
                    cls: 'comment-dataview',
                    margin: '10 0 0 0',
                    width: 500,
                    itemSelector: 'div.comment-selector',
                    store: commentStore,
                    tpl: new Ext.XTemplate({
                        sanitizeName: function (first_name, last_name) {
                            return Ext.String.htmlEncode(first_name + ' ' + last_name);
                        },
                        sanitizeComment: function (text) {
                            return Ext.String.htmlEncode(text);
                        }
                    },
                        '<tpl for=".">',
                            '<div class="comment-selector">',
                            '<div><a href="/member/{[values.sender_user]}/">{[this.sanitizeName(values.first_name, values.last_name)]}</a> {timestring} </div>',
                            '<div style="margin-top:5px"> {[this.sanitizeComment(values.content)]} </div>',
                            '</div>',
                        '</tpl>'
                    ),
                    listeners: {
                        afterrender: function (cmp) {
                            var scb = function (comments) {
                                Ext.each(comments, function (comment) {
                                    var commentProfileScb = function (commentProfile) {
                                        var commentModel = Ext.create('Comment', {
                                            content: comment.content,
                                            userId: comment.sender_user,
                                            receiver_user: comment.receiver_user,
                                            first_name: commentProfile.first_name,
                                            last_name: commentProfile.last_name,
                                            ts: new Date(comment.comment_date)

                                        });
                                        var store = Ext.getStore('comment-store');
                                        store.add(commentModel);
                                    };
                                    DateApp.api.member.getProfile(comment.sender_user, commentProfileScb);
                                });
                            };

                            DateApp.api.member.getComments(memberId, scb, DateApp.utils.defaultFailure);
                        }
                    }
                }]
            });

            var panel = Ext.create('Ext.panel.Panel', {
                layout: 'hbox',
                height: '100%',
                bodyStyle: 'background-color: #ececec !important',
                border: false,
                overflow: 'auto',
                bodyStyle: 'overflow-y: auto;',
                dockedItems: [
                    toolbar
                ],
                items: [
                    profile,
                    commentContainer
                ]
            });

            var viewport = Ext.create('DateApp.Viewport', {
                layout: 'fit',
                items: [
                    panel
                ]
            });

            if (currUserFlag) {
                profile.down('component[name=contact-info]').show();
                profile.down('button[name=file-upload]').show();
            } else {
                profile.down('component[name=contact-info]').hide();
                profile.down('button[name=file-upload]').hide();
                profile.down('button[name=poke-button]').show();
                DateApp.api.member.getPokeList(user.id, function (pokeList) {
                    Ext.each(pokeList, function (pokeObj) {
                        var pokeListMatch = pokeObj.sender_user == user.id && pokeObj.receiver_user == memberId
                        if (pokeListMatch) {
                            profile.down('button[name=poke-button]').hide();
                            profile.down('component[name=poke-text]').show();
                            DateApp.api.member.isMutual(user.id, memberId, function (flag) {
                                if (flag) {
                                    profile.down('component[name=poke-text]').hide();
                                    profile.down('button[name=poke-button]').hide();
                                    profile.down('component[name=contact-info]').show();
                                } else {
                                    profile.down('component[name=contact-info]').hide();
                                }
                            });
                        }
                    });
                }, DateApp.utils.defaultFailure);
            }

            var successPicture = function () {
                profile.down('image').setSrc('/api/member/' + memberId + '/picture');
            };
            DateApp.api.member.getProfilePicture(memberId, successPicture);        
        };


        DateApp.api.member.getProfile(memberId, success, DateApp.utils.defaultFailure);

    });  
};