Ext.define('User', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'userId',
        type: 'int'
    }, {
        name: 'first_name',
        type: 'string',
    }, {
        name: 'last_name',
        type: 'string',
    }, {
        name: 'email',
        type: 'string'
    }, {
        name: 'birthday',
        type: 'date'
    }, {
        name: 'phone',
        type: 'string'
    }]
});

var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

Ext.define('Comment', {
    extend: 'User',
    fields: [{
        name: 'content',
        type: 'string'     
    }, {
        name: 'receiver_user',
        type: 'int'
    }, {
        name: 'sender_user',
        convert: function (v, rec) {
            return rec.get('userId');
        }
    }, {
        name: 'ts',
        type: 'date'
    }, {
        name: 'timestring',
        convert: function (v, rec) {
            var time = rec.get('ts');
            var timestring = '';
            var now = new Date(Date.now());
            var yesterday = 'Yesterday';
            var today = 'Today';

            if (time.getDay() == now.getDay()) {
                timestring += 'Today';
            } else if ((now - time)/1000 >= 86400) {
                timestring += 'Yesterday';
            } else {
                timestring += months[time.getMonth()];
                timestring += ' ';
                timestring += days[time.getDay()];
            }

            timestring += ' at ' + time.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});

            return timestring;


        }
    }]
});

Ext.define('Match', {
    extend: 'User',
    fields: [{
        name: 'compatibility',
        type: 'int'
    }]
});

Ext.define('Event', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'name',
        type: 'string',
    }, {
        name: 'location',
        type: 'string',
    }, {
        name : 'ts',
        type: 'date',
    }, {
        name: 'datestring',
        convert: function (v, rec) {
            var time = rec.get('ts');
            var timestring = '';

            timestring += days[time.getDay()];
            timestring += ', ';
            timestring += months[time.getMonth()];
            timestring += ' ';
            timestring += time.getDate();
            timestring += ', ';
            timestring += time.getUTCFullYear();

            return timestring;


        }
    }, {
        name: 'timestring',
        convert: function (v, rec) {
            var time = rec.get('ts');
            return time.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
        }
    }]
})