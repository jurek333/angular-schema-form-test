angular.module('valid', ['ui.bootstrap','ui.utils','ui.router','schemaForm']);

angular.module('valid').config(function($stateProvider, $urlRouterProvider) {

    /* Add New States Above */
    $urlRouterProvider.otherwise('/home');

    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'views/main.html'
        })
        .state('about', {
            templateUrl: "views/about.html"
            // we'll get to this in a bit       
        });
});

angular.module('valid').run(function($rootScope) {

    $rootScope.safeApply = function(fn) {
        var phase = $rootScope.$$phase;
        if (phase === '$apply' || phase === '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

});

angular.module('valid').controller('JsonFormController', function($scope){
    $scope.schema = {
        "type": "object",
        "title": "Comment",
        "properties": {
            "title": {
                "type": "string",
                "enum": ['dr','jr','sir','mrs','mr','NaN','dj']
            },
            "name": {
                "title": "Name",
                "type": "string"
            },
            "email": {
                "title": "Email",
                "type": "string",
                "pattern": "^\\S+@\\S+$",
                "description": "Email will be used for evil.",
                "placeholder": "e-mail"
            },
            "iWantComment":{
                "title": "Chcesz dać glos?",
                "type": "boolean",  
            },
            "comment": {
                "title": "Comment",
                "type": "string",
                "maxLength": 20,
                "minLength": 2,
                "validationMessage": "Don't be greedy!"
            },
            "commentDetails": {
                "type": "string"
            }
        },
        "required": [
            "name",
            "email",
            "comment"
        ]};

    //$scope.form = ["name","email"];
    //$scope.form = ["*"];
    $scope.form = [ 
    "name",
    {
        type: "help",
        helpvalue: "<div>Global help you stupid donkey!</div>"
    },
    {
        type: "tabs",
        tabs: [{
            title: "tabka 1",
            items: []
        },
        {
            title: "tabka 2",
            items: []
        }]
    }];
    for(var name in $scope.schema.properties) {
        if(name !== 'comment' && name !== 'iWantComment' && 
            name !== 'name' && name !== 'commentDetails') {
            $scope.form[2].tabs[1].items.push(name);
        }
    }
    $scope.form[2].tabs[0].items.push({
        key: "iWantComment",
        ngModelOptions: { updateOn: 'default onchange' }
    });
    $scope.form[2].tabs[0].items.push({
        key: "comment",                                         // The dot notatin to the attribute on the model
        type: "textarea",                                       // Type of field
        title: "Komentarz",                                     // Title of field, taken from schema if available
        notitle: false,                                         // Set to true to hide title
        description: "Takie tam ot pole do komentowania",       // A description, taken from schema if available, can be HTML
        validationMessage: {
            default: "Nie bądź sknera, podziel się opinią!",    // A custom validation error message
            200: "No weź.... jeden znak? Serio?",
            302: "Nie zostawiaj tego pola pustego!"
        },
        //onChange: "valueChanged(form.key,modelValue)",        // onChange event handler, expression or function
        feedback: true,                                         // Inline feedback icons
        placeholder: "Bądź człowiek, daj komentarz...",         // placeholder on inputs and textarea
        //ngModelOptions: { ... },                              // Passed along to ng-model-options
        readonly: false,                                        // Same effect as readOnly in schema. Put on a fieldset or array
                                                                // and their items will inherit it.
        htmlClass: "my-fancy-class-for-div",                    // CSS Class(es) to be added to the container div
        fieldHtmlClass: "my-fancy-class",                       // CSS Class(es) to be added to field input (or similar)
        copyValueTo: ["commentDetails"],                        // Copy values to these schema keys.
        condition: "model.iWantComment"                         // Show or hide field depending on an angular expression
    });
    $scope.form[2].tabs[0].items.push("commentDetails");

    $scope.model = {};

    $scope.onSubmit = function(form) {
        // First we broadcast an event so all fields validate themselves
        $scope.$broadcast('schemaFormValidate');

        // Then we check if the form is valid
        if (form.$valid) {
            $scope.model = {};
        }
    };
});