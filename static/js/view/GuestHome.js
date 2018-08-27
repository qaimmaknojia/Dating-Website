Ext.onReady(function () {
    var callLogin = function (button) {
        var form = button.up('form');
        var formValues = form.getValues();
        var success = function () {
            DateApp.utils.redirectTo('');
        };

        if (!Ext.isEmpty(formValues.email) && (!Ext.isEmpty(formValues.password))) {
            DateApp.api.login(formValues.email, formValues.password, success);
        }
    };

    var callSignUp = function (component) {
        var form = component.up('form');
        var values = form.getValues();
        var signUpSuccess = function () {
            var loginSuccess = function () {
                DateApp.utils.redirectTo('');
            };
            DateApp.api.login(values.email, values.password, loginSuccess);
        };

        values.username = values.email;
        values.phoneNumber = values.phoneNumber.replace(/\D/g, '');

        if (form.isValid() && values.phoneNumber.length == 10) {
            DateApp.api.member.signUp(values, signUpSuccess, DateApp.utils.defaultFailure);
        }
    };

    var toolbar = {
        xtype: 'toolbar',
        cls: 'home-toolbar',
        padding: '0 20',
        region: 'north',
        height: 100,
        items: [{
            xtype: 'component',
            cls: 'home-toolbar-title',
            html: DateApp.appName
        }, {
            xtype: 'tbfill',
        }, {
            xtype: 'form',
            cls: 'form-panel',
            border: 0,
            layout: 'hbox',
            bodyCls: 'home-login-form-body',
            items: [{
                xtype: 'textfield',
                margin: '0 15 0 0',
                name: 'email',
                fieldLabel: 'Email',
                labelAlign: 'top',
                labelCls: 'login-field-label',
                width: 200,
                listeners: {
                    specialkey: function (field, e) {
                        if (e.getKey() == e.ENTER) {
                            callLogin(field);
                        }
                    }
                }
            }, {
                xtype: 'textfield',
                margin: '0 15 0 0',
                name: 'password',
                inputType: 'password',
                fieldLabel:' Password',
                labelAlign: 'top',
                labelCls: 'login-field-label',
                width: 200,
                listeners: {
                    specialkey: function (field, e) {
                        if (e.getKey() == e.ENTER) {
                            callLogin(field);
                        }
                    }
                }
            }, {
                xtype: 'button',
                cls: 'app-button-small',
                overCls: '',
                margin: '22 15 0 0',
                text: 'Login',
                listeners: {
                    click: callLogin
                }
            }]
        }]
    };

    var center = {
        xtype: 'container',
        region: 'center',
        padding: '0 20',
        layout: 'hbox',
        defaults: {
            height: '100%',
            flex: 1
        },
        items: [{
            xtype: 'component',
            html: [
            '<div class="home-content-text">',
                '<div class="custom-h2">Connect with friends and the <br> people on campus with SFU Dating.</div>',
                '<div style="margin-top:20px">',
                '<div class="home-content-list-item">',
                    '<img src="/static/resources/images/clipboard.png" height="32" width="32" style="float:left">',
                    '<div class="home-content-list-item-inner">Fill out surveys to set up your compatibility rating.</div>',
                '</div>',
                '<div class="home-content-list-item">',
                    '<img src="/static/resources/images/matches.png" height="32" width="32" style="float:left">',
                    '<div class="home-content-list-item-inner">See your matches and view their profiles.</div>',
                '</div>',
                '<div class="home-content-list-item">',
                    '<img src="/static/resources/images/poke.png" height="32" width="32" style="float:left">',
                    '<div class="home-content-list-item-inner">Exchange contact information via the poke feature.</div>',
                '</div>',
            '</div>'
            ].join('')
        }, {
            xtype: 'container',
            padding: 10,
            items: [{
                xtype: 'component',
                margin: '45 0 0 0',
                html: [
                '<div class="custom-h2">Sign Up</div>',
                '<div>It&#39;s quick and easy!</div>'
                ].join('')
            }, {
                xtype: 'form',
                cls: 'form-panel',
                width: 500,
                border: 0,
                margin: '20 0 0 0',
                items: [{
                    xtype: 'textfield',
                    allowOnlyWhitespace: false,
                    name: 'first_name',
                    fieldLabel: 'First Name',
                    labelAlign: 'left',
                    width: '100%',
                    allowBlank: false,
                    listeners: {
                        specialkey: function (field, e) {
                            if (e.getKey() == e.ENTER) {
                                submitSignUp(field);
                            }
                        }
                    }
                }, {
                    xtype: 'textfield',
                    allowOnlyWhitespace: false,
                    name: 'last_name',
                    fieldLabel: 'Last Name',
                    labelAlign: 'left',
                    width: '100%',
                    allowBlank: false,
                    listeners: {
                        specialkey: function (field, e) {
                            if (e.getKey() == e.ENTER) {
                                callSignUp(field);
                            }
                        }
                    }
                }, {
                    xtype: 'textfield',
                    allowOnlyWhitespace: false,
                    name: 'email',
                    fieldLabel: 'Email',
                    labelAlign: 'left',
                    width: '100%',
                    vtype: 'email',
                    allowBlank: false,
                    listeners: {
                        specialkey: function (field, e) {
                            if (e.getKey() == e.ENTER) {
                                callSignUp(field);
                            }
                        }
                    }
                }, {
                    xtype: 'textfield',
                    name: 'password',
                    fieldLabel:' Password',
                    labelAlign: 'left',
                    width: '100%',
                    inputType: 'password',
                    allowBlank: false,
                    listeners: {
                        specialkey: function (field, e) {
                            if (e.getKey() == e.ENTER) {
                                callSignUp(field);
                            }
                        }
                    }
                }, {
                    xtype: 'container',
                    layout: 'hbox',
                    margin: '10 0 0 0',
                    items: [{
                        xtype: 'textfield',
                        name: 'phoneNumber',
                        allowOnlyWhitespace: false,
                        flex: 1,
                        fieldLabel: 'Phone Number',
                        labelAlign: 'left',
                        width: '100%',
                        allowBlank: false,
                        maxLength: 14,
                        enforceMaxLength: true,
                        enableKeyEvents: true,
                        validator: function (val) {
                            // remove non-numeric characters
                            var tn = val.replace(/[^0-9]/g,''),
                                errMsg = "Must be a 10 digit telephone number";
                            // if the numeric value is not 10 digits return an error message
                            return (tn.length === 10) ? true : errMsg;
                        },
                        listeners: {
                            keypress : function(f,e) {
                                if(!( e.getCharCode()== 8 || (e.getCharCode() >= 48 && e.getCharCode() <= 57))) {
                                    e.preventDefault();
                                }

                                var numbers = f.value.replace(/\D/g, ''),
                                chars = {0:'(',3:') ',6:'-'};
                                f.value = '';
                                for (var i = 0; i < numbers.length; i++) {
                                       f.setValue(f.value += (chars[i]||'') + numbers[i]);
                                }
                            },
                        }
                    }, {
                        xtype: 'datefield',
                        format: 'Y-m-d',
                        allowBlank: false,
                        allowOnlyWhitespace: false,
                        margin: '0 0 0 10',
                        name: 'birthday',
                        flex: 1,
                        fieldLabel: 'Birthdate',
                        labelAlign: 'left',
                        labelWidth: 65
                    }]
                }, {
                    xtype: 'container',
                    layout: 'hbox',
                    margin: '10 0 0 0',
                    items: [{
                        xtype: 'tbfill'
                    }, {
                        xtype: 'button',
                        overCls: '',
                        cls: 'app-button-small',
                        text: 'Submit',
                        listeners: {
                            click: callSignUp
                        }
                    }]
                }]
            }]
        }]
    };

    Ext.create('DateApp.Viewport', {
        overflow: 'auto',
        layout: 'border',
        items: [
            toolbar,
            center
        ]
    });
});