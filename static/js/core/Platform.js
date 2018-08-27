//REST Methods

Ext.define('DateApp.Platform', {
    extend: 'Ext.Base',

    constructor: function () {
        var me = this;

        me.url = document.location.host;
        me.baseProtocol = document.location.protocol + '//';
        me.baseURL = me.baseProtocol + me.url;
    },

    get: function (route, success, failure, data) {
        var me = this;

        if (data) {
            route = Ext.String.urlAppend(route, Ext.Object.toQueryString(data));
        }

        me.request(route, 'GET', success, failure);
    },

    post: function (route, data, success, failure) {
        var me = this;
        me.request(route, 'POST', success, failure, data);
    },

    request: function (route, method, scb, fcb, params) {
        var me = this;
        var url = me.baseURL + route;
        
        Ext.Ajax.on('beforerequest', function (conn, options) {
            if (typeof(options.headers) == "undefined") {
                options.headers = {'X-CSRFToken': Ext.util.Cookies.get('csrftoken')};
            } else {
                options.headers['X-CSRFToken'] = Ext.util.Cookies.get('csrftoken');
            }
        }, this);

        Ext.Ajax.request({
            url: url,
            method: method,
            params: params,
            success: function (response, opts) {
                //Logging
                console.log('Status Code: ' + response.status);
                console.log('Status Text: ' + response.statusText);
                if (response.responseText == "True" || response.responseText == "False" || response.responseText == "Success" ||
                    response.responseText == "Fail") {
                    console.log(response.responseText);
                } else {
                    try {
                        console.log(Ext.decode(response.responseText));
                    }
                    catch (e) {

                    } 
                }

                if (response.status == 200 || response.status == 201) {
                    var jsonResponse = Ext.decode(response.responseText, true);
                    if (response.responseText == "True" || response.responseText == "Success") {
                        jsonResponse = true;
                    } else if (response.responseText == "False") {
                        jsonResponse = false;
                    }
                    if (jsonResponse) {
                        //Callback function for server response
                        if (scb) {
                            scb(jsonResponse);
                        }
                    } else {
                        if (scb) {
                            scb();    
                        }
                    }
                } else {
                    if (fcb) {
                        fcb(response);
                    }
                }
            },
            failure: function (response, opts) {

                if (fcb) {
                    fcb(response);
                }
            }
        });
    }
});