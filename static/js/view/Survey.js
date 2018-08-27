function initSurvey(user, surveyId) {
    Ext.onReady(function () {
        if (!user.id || user.id == "None") {
            DateApp.utils.redirectTo('');
        }

         DateApp.api.member.getMatches(user.id, surveyId, function () {
             Ext.Msg.alert('Error', "You've already done this survey!", function () {
                 DateApp.utils.redirectTo('');
             });
         });
        var toolbar = {
            xtype: 'appToolbar',
            firstName: user.first_name,
            userId: user.id,
            dock: 'top'
        };

        var success = function (survey) {
            var surveyContainer = {
                xtype: 'appSurvey',
                survey: survey,
                userId: user.id
            };

            var panel = Ext.create('Ext.panel.Panel', {
                bodyStyle: 'overflow: auto;',
                dockedItems: [
                    toolbar
                ],
                items: [
                    surveyContainer
                ]
            });

            var viewport = Ext.create('DateApp.Viewport', {
                layout: 'fit',
                items: [
                    panel
                ]
            });
        };

        DateApp.api.getSurvey(surveyId, success, DateApp.utils.defaultFailure);
});
};