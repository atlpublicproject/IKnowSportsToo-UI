define('app',["require", "exports"], function (require, exports) {
    "use strict";
    var App = (function () {
        function App() {
        }
        App.prototype.configureRouter = function (config, router) {
            this.router = router;
            config.title = 'Aurelia';
            config.map([
                { route: ['', 'decks'], title: 'Your Decks', name: 'decks', moduleId: 'deck/index', nav: true },
                { route: 'play/:id', name: 'play', moduleId: 'game/play' },
                { route: 'review', name: 'review', moduleId: 'game/review' },
                { route: 'edit', name: 'edit', moduleId: 'deck/edit' },
                { route: 'import', name: 'import', moduleId: 'deck/import' }
            ]);
        };
        return App;
    }());
    exports.App = App;
});

define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});

define('main',["require", "exports", './environment'], function (require, exports, environment_1) {
    "use strict";
    Promise.config({
        warnings: {
            wForgottenReturn: false
        }
    });
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .feature('resources')
            .plugin('aurelia-hammer')
            .plugin('aurelia-validation')
            .plugin('aurelia-materialize-bridge', function (b) { return b.useAll(); });
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        if (environment_1.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }
        aurelia.start().then(function () { return aurelia.setRoot(); });
    }
    exports.configure = configure;
});

define('objects/cards/cardresponse',["require", "exports"], function (require, exports) {
    "use strict";
    (function (CardResponse) {
        CardResponse[CardResponse["Undefined"] = 0] = "Undefined";
        CardResponse[CardResponse["Right"] = 1] = "Right";
        CardResponse[CardResponse["Wrong"] = 2] = "Wrong";
        CardResponse[CardResponse["Pass"] = 3] = "Pass";
    })(exports.CardResponse || (exports.CardResponse = {}));
    var CardResponse = exports.CardResponse;
});

define('objects/cards/card',["require", "exports", './cardresponse'], function (require, exports, cardresponse_1) {
    "use strict";
    var Card = (function () {
        function Card(id, question, answer) {
            this.id = id;
            this.question = question;
            this.answer = answer;
            this.isFlagged = false;
            this.isAnswerVisible = false;
            this.response = cardresponse_1.CardResponse.Undefined;
            this.rightCount = 0;
            this.wrongCount = 0;
            this.skipCount = 0;
        }
        Card.Create = function () {
            return new Card('', '', '');
        };
        Card.prototype.mark = function (value) {
            if (value == null || value == undefined)
                return;
            switch (value) {
                case cardresponse_1.CardResponse.Undefined:
                    return;
                case cardresponse_1.CardResponse.Right:
                    this.rightCount++;
                    break;
                case cardresponse_1.CardResponse.Wrong:
                    this.wrongCount++;
                case cardresponse_1.CardResponse.Pass:
                    this.skipCount++;
                    break;
            }
            this.response = value;
        };
        return Card;
    }());
    exports.Card = Card;
});

define('objects/decks/deck',["require", "exports"], function (require, exports) {
    "use strict";
    var Deck = (function () {
        function Deck(id, name, description) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.cardIx = 0;
            this.cards = new Array();
        }
        Deck.Create = function () {
            return new Deck('', '', '');
        };
        Object.defineProperty(Deck.prototype, "cardCount", {
            get: function () {
                return this.cards.length;
            },
            enumerable: true,
            configurable: true
        });
        Deck.prototype.addCards = function (cards) {
            var _cardCount = this.cardCount;
            for (var i = 0; i < cards.length; i++) {
                cards[i].number = _cardCount + i + 1;
                this.cards.push(cards[i]);
            }
        };
        Deck.prototype.addCard = function (card) {
            card.number = this.cardCount + 1;
            this.cards.push(card);
        };
        Deck.prototype.removeCard = function (card) {
            this.cards.splice(card.number - 1, 1);
            this.renumberCards();
        };
        Deck.prototype.renumberCards = function () {
            for (var i = 0; i < this.cards.length; i++)
                this.cards[i].number = i + 1;
        };
        Deck.prototype.previous = function () {
            this.cardIx = this.cardIx - 1;
            if (this.cardIx < 0)
                this.cardIx = 0;
            return this.topCard = this.cards[this.cardIx];
        };
        Deck.prototype.next = function () {
            this.cardIx = (this.cardIx + 1);
            if (this.cardIx >= this.cardCount)
                this.cardIx = this.cardCount - 1;
            return this.topCard = this.cards[this.cardIx];
        };
        Deck.prototype.shuffle = function () {
            function _shuffle(a, b, c, d) {
                c = a.length;
                while (c)
                    b = Math.random() * (--c + 1) | 0, d = a[c], a[c] = a[b], a[b] = d;
            }
            _shuffle(this.cards, null, null, null);
        };
        return Deck;
    }());
    exports.Deck = Deck;
});

define('objects/state/state',["require", "exports"], function (require, exports) {
    "use strict";
    var State = (function () {
        function State() {
            this.items = {};
        }
        return State;
    }());
    exports.State = State;
});

define('objects/decks/deckfactory',["require", "exports", './../cards/card', './deck'], function (require, exports, card_1, deck_1) {
    "use strict";
    var DeckFactory = (function () {
        function DeckFactory() {
        }
        DeckFactory.prototype.createSampleDeck = function () {
            var deck = new deck_1.Deck("D1", 'Easy Questions', 'These are questions a robot could answer.');
            var cards = new Array();
            cards.push(new card_1.Card("C1", "How many fingers does a human have?", "Humans have 10 fingers"));
            cards.push(new card_1.Card("C2", "How many fingers and toes does a human have?", "A human has 10 fingers and 10 toes for a total of 20 digits."));
            cards.push(new card_1.Card("C3", "When does the moon meet the sky?", "When the sun hides for a moment."));
            deck.addCards(cards);
            return deck;
        };
        return DeckFactory;
    }());
    exports.DeckFactory = DeckFactory;
});

define('objects/decks/deckheader',["require", "exports"], function (require, exports) {
    "use strict";
    var DeckHeader = (function () {
        function DeckHeader() {
        }
        return DeckHeader;
    }());
    exports.DeckHeader = DeckHeader;
});

define('objects/allobjects',["require", "exports", './state/state', './cards/card', './cards/cardresponse', './decks/deck', './decks/deckfactory', './decks/deckheader'], function (require, exports, state_1, card_1, cardresponse_1, deck_1, deckfactory_1, deckheader_1) {
    "use strict";
    exports.State = state_1.State;
    exports.Card = card_1.Card;
    exports.CardResponse = cardresponse_1.CardResponse;
    exports.Deck = deck_1.Deck;
    exports.DeckFactory = deckfactory_1.DeckFactory;
    exports.DeckHeader = deckheader_1.DeckHeader;
});

define('resources/validation/bootstrap-form-renderer',["require", "exports"], function (require, exports) {
    "use strict";
    var BootstrapFormRenderer = (function () {
        function BootstrapFormRenderer() {
        }
        BootstrapFormRenderer.prototype.render = function (instruction) {
            for (var _i = 0, _a = instruction.unrender; _i < _a.length; _i++) {
                var _b = _a[_i], error = _b.error, elements = _b.elements;
                for (var _c = 0, elements_1 = elements; _c < elements_1.length; _c++) {
                    var element_1 = elements_1[_c];
                    this.remove(element_1, error);
                }
            }
            for (var _d = 0, _e = instruction.render; _d < _e.length; _d++) {
                var _f = _e[_d], error = _f.error, elements = _f.elements;
                for (var _g = 0, elements_2 = elements; _g < elements_2.length; _g++) {
                    var element_2 = elements_2[_g];
                    this.add(element_2, error);
                }
            }
        };
        BootstrapFormRenderer.prototype.add = function (element, error) {
            var formGroup = element.closest('.form-group');
            if (!formGroup) {
                return;
            }
            formGroup.classList.add('has-error');
            var message = document.createElement('span');
            message.className = 'help-block validation-message';
            message.textContent = error.message;
            message.id = "validation-message-" + error.id;
            formGroup.appendChild(message);
        };
        BootstrapFormRenderer.prototype.remove = function (element, error) {
            var formGroup = element.closest('.form-group');
            if (!formGroup) {
                return;
            }
            var message = formGroup.querySelector("#validation-message-" + error.id);
            if (message) {
                formGroup.removeChild(message);
                if (formGroup.querySelectorAll('.help-block.validation-message').length === 0) {
                    formGroup.classList.remove('has-error');
                }
            }
        };
        return BootstrapFormRenderer;
    }());
    exports.BootstrapFormRenderer = BootstrapFormRenderer;
});

var id = 0;
function getId() {
    return ++id;
}
var getUid = function () {
    var delim = "-";
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + delim + S4() + delim + S4() + delim + S4() + delim + S4() + S4() + S4());
};
function getCardCount() {
    return Math.floor(Math.random() * 45) + 1;
}
function getCardData() {
    return {
        id: getUid(),
        question: "This is a dummy question",
        answer: "This is an answer"
    };
}
var deckHeaders = [];
var decks = [];
loadDecks();
function saveDecks() {
    localStorage.setItem('decks', JSON.stringify(decks));
    localStorage.setItem('deckheaders', JSON.stringify(deckHeaders));
}
function loadDecks() {
    var deck_string = localStorage.getItem('decks');
    var deckheaders_string = localStorage.getItem('deckheaders');
    if (deck_string !== null) {
        decks = JSON.parse(deck_string);
    }
    else {
        decks = [
            {
                id: getUid(),
                name: 'Easy Questions',
                description: 'These are questions a robot could answer.',
                cards: [
                    {
                        id: getId(),
                        question: "How many fingers does a human have?",
                        answer: "Humans have 10 fingers",
                        number: 1
                    },
                    {
                        id: getId(),
                        question: "How many fingers and toes does a human have?",
                        answer: "A human has 10 fingers and 10 toes for a total of 20 digits.",
                        number: 2
                    },
                    {
                        id: getId(),
                        question: "When does the moon meet the sky?",
                        answer: "When the sun hides for a moment.",
                        number: 3
                    }
                ]
            },
            {
                id: getUid(),
                name: 'More Questions',
                description: 'These are questions a human could answer.',
                cards: [
                    {
                        id: getId(),
                        question: "What is the square root of negative 1?",
                        answer: "sqrt(-1) = i",
                        number: 1
                    },
                    {
                        id: getId(),
                        question: "How many robots are there?",
                        answer: "How would I know?",
                        number: 2
                    },
                    {
                        id: getId(),
                        question: "Who won the superbowl in 1973.",
                        answer: "I dont know.",
                        number: 3
                    }
                ]
            }
        ];
    }
    if (deckheaders_string !== null) {
        deckHeaders = JSON.parse(deckheaders_string);
    }
    else {
        deckHeaders = [
            {
                id: getUid(),
                name: "Raining Cats and Dogs",
                description: "My Mum say she likes all the same things that I do.",
                cardCount: getCardCount()
            },
            {
                id: getUid(),
                name: "Greased Lightning",
                description: "Abstraction is often one floor above you.",
                cardCount: getCardCount()
            },
            {
                id: getUid(),
                name: "Back to Square One",
                description: "Please wait outside of the house.",
                cardCount: getCardCount()
            },
            {
                id: getUid(),
                name: "Fish Out Of Water",
                description: "Wednesday is hump day, has anyone asked the camel if he’s happy about it?",
                cardCount: getCardCount()
            },
            {
                id: getUid(),
                name: "Wild Goose Chase",
                description: "He turned in the research paper on Friday.",
                cardCount: getCardCount()
            },
            {
                id: getUid(),
                name: "When the Rubber Hits the Road",
                description: "She folded her handkerchief neatly.",
                cardCount: getCardCount()
            },
            {
                id: getUid(),
                name: "Don't Count Your Chickens Before They Hatch",
                description: "Italy is my favorite country.",
                cardCount: getCardCount()
            }
        ];
    }
    saveDecks();
}

define("storage/deck-storage", [],function(){});

define('storage/deck-store-api',["require", "exports", './../objects/allobjects', './deck-storage', 'underscore'], function (require, exports, allobjects_1) {
    "use strict";
    var latency = 200;
    var id = 0;
    var DeckStoreAPI = (function () {
        function DeckStoreAPI() {
            this.isRequesting = false;
        }
        DeckStoreAPI.prototype.search = function (searchText) {
            var _this = this;
            this.isRequesting = true;
            return new Promise(function (resolve) {
                setTimeout(function () {
                    var results = deckHeaders;
                    if (!!searchText) {
                        var searchTextLower_1 = searchText.toLowerCase();
                        results = results
                            .filter(function (x) {
                            return x.name.toLowerCase().indexOf(searchTextLower_1) > -1
                                || x.description.toLowerCase().indexOf(searchTextLower_1) > -1;
                        });
                    }
                    results.map(function (x) {
                        return {
                            id: x.id,
                            name: x.name,
                            description: x.description,
                            cardCount: x.cardCount
                        };
                    });
                    resolve(results);
                    _this.isRequesting = false;
                }, latency);
            });
        };
        DeckStoreAPI.prototype.searchLocal = function (searchText) {
            var _this = this;
            this.isRequesting = true;
            return new Promise(function (resolve) {
                setTimeout(function () {
                    var results = decks;
                    if (!!searchText) {
                        var searchTextLower_2 = searchText.toLowerCase();
                        results = results
                            .filter(function (x) {
                            return x.name.toLowerCase().indexOf(searchTextLower_2) > -1
                                || x.description.toLowerCase().indexOf(searchTextLower_2) > -1;
                        });
                    }
                    results = results
                        .map(function (x) {
                        return {
                            id: x.id,
                            name: x.name,
                            description: x.description,
                            cardCount: x.cards.length
                        };
                    });
                    resolve(results);
                    _this.isRequesting = false;
                }, latency);
            });
        };
        DeckStoreAPI.prototype.getLocalDeck = function (id) {
            var _this = this;
            this.isRequesting = true;
            return new Promise(function (resolve) {
                setTimeout(function () {
                    var deck = decks.filter(function (x) { return x.id == id; })[0];
                    var _deck = Object.assign(allobjects_1.Deck.Create(), JSON.parse(JSON.stringify(deck)));
                    var cards = new Array();
                    for (var ix = 0; ix < deck.cards.length; ix++) {
                        cards.push(Object.assign(allobjects_1.Card.Create(), deck.cards[ix]));
                    }
                    _deck.cards = cards;
                    resolve(_deck);
                    _this.isRequesting = false;
                }, latency);
            });
        };
        DeckStoreAPI.prototype.getDeck = function (id) {
            var _this = this;
            this.isRequesting = true;
            return new Promise(function (resolve) {
                setTimeout(function () {
                    var found = deckHeaders.filter(function (x) { return x.id == id; })[0];
                    var deck = new allobjects_1.Deck(found.id, found.name, found.description);
                    for (var i = 0; i < found.cardCount; i++) {
                        var cd = getCardData();
                        deck.addCard(new allobjects_1.Card(cd.id, cd.question, cd.answer));
                    }
                    resolve(deck);
                    _this.isRequesting = false;
                }, latency);
            });
        };
        DeckStoreAPI.prototype.saveDeck = function (deck) {
            var _this = this;
            this.isRequesting = true;
            return new Promise(function (resolve) {
                setTimeout(function () {
                    var instance = JSON.parse(JSON.stringify(deck));
                    var found = decks.filter(function (x) { return x.id == deck.id; })[0];
                    if (found) {
                        var index = decks.indexOf(found);
                        decks[index] = instance;
                    }
                    else {
                        instance.id = getUid();
                        decks.push(instance);
                    }
                    saveDecks();
                    var sFound = deckHeaders.filter(function (x) { return x.id == deck.id; })[0];
                    if (sFound) {
                        sFound.name = instance.name;
                        sFound.decription = instance.description;
                        sFound.cardCount = instance.cards.length;
                    }
                    else {
                        var dhInstance = {
                            id: getUid(),
                            name: instance.name,
                            description: instance.description,
                            cardCount: instance.cards.length
                        };
                        deckHeaders.push(dhInstance);
                    }
                    saveDecks();
                    _this.isRequesting = false;
                    resolve(instance);
                }, latency);
            });
        };
        DeckStoreAPI.prototype.deleteDeck = function (deck) {
            var _this = this;
            this.isRequesting = true;
            return new Promise(function (resolve) {
                setTimeout(function () {
                    var index = _.findIndex(decks, function (x) { return x.id == deck.id; });
                    decks.splice(index, 1);
                    var sIndex = _.findIndex(deckHeaders, function (x) { return x.id == deck.id; });
                    if (sIndex > 0) {
                        deckHeaders.splice(sIndex, 1);
                    }
                    saveDecks();
                    _this.isRequesting = false;
                    resolve();
                }, latency);
            });
        };
        return DeckStoreAPI;
    }());
    exports.DeckStoreAPI = DeckStoreAPI;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('deck/edit',["require", "exports", 'aurelia-framework', './../objects/allobjects', 'aurelia-router', './../resources/validation/bootstrap-form-renderer', './../storage/deck-store-api', 'aurelia-validation'], function (require, exports, aurelia_framework_1, allobjects_1, aurelia_router_1, bootstrap_form_renderer_1, deck_store_api_1, aurelia_validation_1) {
    "use strict";
    var Edit = (function () {
        function Edit(state, router, validationControllerFactory, store) {
            this.state = state;
            this.router = router;
            this.validationControllerFactory = validationControllerFactory;
            this.store = store;
            this.controller = null;
            if (state.deck == null) {
                this.router.navigateToRoute('decks');
            }
            this.deck = state.deck;
            this.startValidation();
        }
        Edit.prototype.saveDeck = function () {
            this.store.saveDeck(this.deck);
            alert("Deck Saved");
        };
        Edit.prototype.goToIndex = function () {
            this.router.navigateBack();
        };
        Edit.prototype.saveNewCard = function () {
            var _this = this;
            this.controller.validate({ object: this })
                .then(function (err) {
                if (err.length == 0) {
                    var card = new allobjects_1.Card(null, _this.new_question, _this.new_answer);
                    _this.deck.addCard(card);
                    alert("Card Added");
                    _this.new_question =
                        _this.new_answer = "";
                }
            });
        };
        Edit.prototype.remove = function (card) {
            this.deck.removeCard(card);
        };
        Edit.prototype.startValidation = function () {
            this.controller = this.validationControllerFactory.createForCurrentScope();
            this.controller.addRenderer(new bootstrap_form_renderer_1.BootstrapFormRenderer());
            var rules = aurelia_validation_1.ValidationRules
                .ensure("new_question")
                .displayName("Question")
                .minLength(5).maxLength(256).required()
                .ensure("new_answer")
                .displayName("Answer")
                .minLength(5).maxLength(256).required()
                .rules;
            this.controller.addObject(this, rules);
        };
        Edit = __decorate([
            aurelia_framework_1.inject(allobjects_1.State, aurelia_router_1.Router, aurelia_validation_1.ValidationControllerFactory, deck_store_api_1.DeckStoreAPI), 
            __metadata('design:paramtypes', [allobjects_1.State, aurelia_router_1.Router, aurelia_validation_1.ValidationControllerFactory, deck_store_api_1.DeckStoreAPI])
        ], Edit);
        return Edit;
    }());
    exports.Edit = Edit;
});

define('lib/question-formulator',["require", "exports", 'underscore'], function (require, exports, _) {
    "use strict";
    var UIMessage = (function () {
        function UIMessage() {
        }
        return UIMessage;
    }());
    exports.UIMessage = UIMessage;
    var UIResult = (function () {
        function UIResult() {
        }
        UIResult.Create = function (content, message) {
            var res = new UIResult();
            if (typeof (message) == 'UIMessage') {
                res.messages = new Array();
                res.messages.push(message);
            }
            if (typeof (message) == 'Array' && typeof (message[0]) == 'UIMessage') {
                res.messages = message;
            }
            res.content = content;
            return res;
        };
        return UIResult;
    }());
    exports.UIResult = UIResult;
    var Result = (function () {
        function Result() {
        }
        Result.Success = function (content, message) {
            var res = new Result();
            res.success = true;
            res.content = content;
            res.message = null;
            return res;
        };
        Result.Info = function (content, message) {
            var res = new Result();
            res.success = true;
            res.message = message;
            res.content = content;
            return res;
        };
        Result.Fail = function (message) {
            var res = new Result();
            res.success = false;
            res.message = message;
            return res;
        };
        return Result;
    }());
    exports.Result = Result;
    var QandA = (function () {
        function QandA(q, a) {
            this.Q = q;
            this.A = a;
        }
        return QandA;
    }());
    exports.QandA = QandA;
    var QuestionFormulatingEngine = (function () {
        function QuestionFormulatingEngine() {
        }
        QuestionFormulatingEngine.prototype.CreateQACards = function (data, template, options) {
            var results = new Array();
            var messages = new Array();
            var q = template.q;
            var a = template.a;
            if (options && options.multi) {
                var stackSize = 1;
                var stacks = new Array();
                if (typeof (options.multi) == 'number') {
                    stacks = QuestionFormulatingEngine.GenerateIndexArrays(data.length, options.multi);
                }
                if (options.multi instanceof Object) {
                    stacks = options.multi;
                }
                var stackedData = [];
                var _loop_1 = function(indexes) {
                    var dataStackRow = {};
                    for (var prop in data[0]) {
                        dataStackRow[prop] = QuestionFormulatingEngine.JoinWords(_.pluck(data.filter(function (el, ix) {
                            return _.contains(indexes, ix);
                        }), prop));
                    }
                    stackedData.push(dataStackRow);
                };
                for (var _i = 0, stacks_1 = stacks; _i < stacks_1.length; _i++) {
                    var indexes = stacks_1[_i];
                    _loop_1(indexes);
                }
                data = stackedData;
            }
            for (var _a = 0, data_1 = data; _a < data_1.length; _a++) {
                var row = data_1[_a];
                var q_res = this.fillTemplate(row, q);
                var a_res = this.fillTemplate(row, a);
                if (q_res.success && a_res.success) {
                    results.push(new QandA(q_res.content, a_res.content));
                }
                if (q_res.message)
                    messages.push(new UIMessage());
            }
            return UIResult.Create(results, messages);
        };
        QuestionFormulatingEngine.prototype.CreateCards = function (data, template, options) {
            var isGroup = (options && options.group);
            var results = new Array();
            var messages = new Array();
            if (!isGroup) {
                return this.CreateQACards(data, template, options);
            }
            var data_keys = _.allKeys(data[0]);
            var g = options.group.toString();
            var g_props = _.map(g.split(','), function (str) { return str.toString().trim().substring(1, str.toString().length - 1); });
            var groups = _.groupBy(data, function (row) {
                return _.reduce(g_props, function (memo, el) {
                    var i_el = el.toString();
                    return memo + row[i_el] + '-';
                }, '');
            });
            var group_rows = [];
            for (var group_key in groups) {
                var group = groups[group_key];
                var grouped_row = {};
                for (var _i = 0, data_keys_1 = data_keys; _i < data_keys_1.length; _i++) {
                    var prop = data_keys_1[_i];
                    if (_.contains(g_props, prop)) {
                        grouped_row[prop] = group[0][prop];
                    }
                    else {
                        grouped_row[prop] = QuestionFormulatingEngine.JoinWords(_.pluck(group, prop).sort());
                    }
                }
                group_rows.push(grouped_row);
            }
            return this.CreateQACards(group_rows, template, options);
        };
        QuestionFormulatingEngine.prototype.fillTemplate = function (rowData, template) {
            var matches = template.match(/\{[^{^}]+\}/g);
            if (matches.length == 0)
                return Result.Info("There are no parameters in the template", template);
            for (var _i = 0, matches_1 = matches; _i < matches_1.length; _i++) {
                var match = matches_1[_i];
                var match_text = match.substring(1, match.length - 1);
                if (!rowData[match_text]) {
                    return Result.Fail('The template placeholder "' + match + '" is not a property in the JSON schema');
                }
                template = template.replace(match, rowData[match_text]);
            }
            return Result.Success(template);
        };
        QuestionFormulatingEngine.JoinWords = function (values) {
            var strResult = '';
            if (values.length == 0)
                return '';
            if (values.length == 1)
                return values[0];
            for (var ix = 0; ix < values.length; ix++) {
                if (ix == 0)
                    strResult += values[ix];
                else if (ix == values.length - 1)
                    strResult += " and " + values[ix];
                else
                    strResult += ", " + values[ix];
            }
            return strResult;
        };
        QuestionFormulatingEngine.GenerateIndexArrays = function (numberOfCards, stackSize) {
            var numStacks = Math.floor(numberOfCards / stackSize) || 1;
            var availableStacks = new Array();
            var fullStacks = new Array();
            for (var i = 0; i < numStacks; i++)
                availableStacks[i] = new Array();
            for (var i = 0; i < numberOfCards; i++) {
                if (availableStacks.length == 0) {
                    availableStacks = fullStacks.splice(0, fullStacks.length - 1);
                }
                var r = Math.floor(Math.random() * (availableStacks.length));
                availableStacks[r].push(i);
                if (availableStacks[r].length >= stackSize)
                    fullStacks.push(availableStacks.splice(r, 1)[0]);
            }
            return availableStacks.concat(fullStacks);
        };
        return QuestionFormulatingEngine;
    }());
    exports.QuestionFormulatingEngine = QuestionFormulatingEngine;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('deck/import',["require", "exports", 'aurelia-framework', './../objects/allobjects', 'aurelia-router', './../resources/validation/bootstrap-form-renderer', './../storage/deck-store-api', './../lib/question-formulator', 'aurelia-validation', 'Papa'], function (require, exports, aurelia_framework_1, allobjects_1, aurelia_router_1, bootstrap_form_renderer_1, deck_store_api_1, question_formulator_1, aurelia_validation_1) {
    "use strict";
    var Import = (function () {
        function Import(state, router, validationControllerFactory, store) {
            this.state = state;
            this.router = router;
            this.validationControllerFactory = validationControllerFactory;
            this.store = store;
            this.importFormat = 'json';
            this.importContent = 'table';
            this.csv_delimiter = ',';
            this.question_prop = 'question';
            this.answer_prop = 'answer';
            this.importTemplates = [];
            this.controller = null;
            this.enableCreateCards = false;
            this.shouldShowSampleData = false;
            this.sampleData = {
                'csv-qa': "What is the eighth planet form the sun?,Neptune\nWhat are the rocky planets in our solar system?, Mercury,, Venus,, Earth,, Mars",
                'csv-table': "Planet,Distance from the sun (AU),Period of revolution,Period of rotation,Mass (earth = 1),Diameter (earth = 1),Number of satellites\nMercury,0.39,88 days,59 days,0.06,0.38,0\nVenus,0.72,225 days,243 days,0.82,0.95,0\nEarth,1,365 days,24 hours,1,1,1\nMars,1.52,687 days,25 hours,0.11,0.53,2\nJupiter,5.2,12 years,10 hours,317.89,11.19,63\nSaturn,9.54,29 years,10 hours,95.15,9.44,61\nUranus,19.2,84 years,18 hours,14.54,4.1,27\nNeptune,30.06,165 years,18 hours,17.23,3.88,14",
                'csv-table-templates': [
                    { q: 'What is the period of revolution of {Planet}?', a: '{Period of Revolution}', filter: '', group: '', multi: '' },
                    { q: 'How far is {Planet} from the sun', a: '{Distance from the sun (AU)}', filter: '', group: '', multi: '2' }
                ],
                'json-qa': "[\n { \n  \"question\" : \"What is the eighth planet from the sun? \",\n  \"answer\" : \"Neptune\"\n },\n { \n  \"question\" : \"What are the rocky planets in our solar system?\",\n  \"answer\" : \"Mercury, Venus, Earth, Mars\"\n }\n]",
                'json-table': "[\n{\n  \"Conf-Div\": \"AFC East\",\n  \"Team\": \"Buffalo Bills\",\n  \"Location\": \"Orchard Park,NY\",\n  \"Coach\": \"Rex Ryan\"\n },\n {\n  \"Conf-Div\": \"AFC East\",\n  \"Team\": \"Miami Dolphins\",\n  \"Location\": \"Miami Gardens,\u00A0FL\",\n  \"Coach\": \"Adam Gase\"\n },\n {\n  \"Conf-Div\": \"AFC East\",\n  \"Team\": \"New England Patriots\",\n  \"Location\": \"Foxborough,MA\",\n  \"Coach\": \"Bill Belichick\"\n },\n {\n  \"Conf-Div\": \"AFC East\",\n  \"Team\": \"New York Jets\",\n  \"Location\": \"East Rutherford,\u00A0NJ\",\n  \"Coach\": \"Todd Bowles\"\n },\n {\n  \"Conf-Div\": \"AFC North\",\n  \"Team\": \"Baltimore Ravens\",\n  \"Location\": \"Baltimore,\u00A0MD\",\n  \"Coach\": \"John Harbaugh\"\n },\n {\n  \"Conf-Div\": \"AFC North\",\n  \"Team\": \"Cincinnati Bengals\",\n  \"Location\": \"Cincinnati,\u00A0OH\",\n  \"Coach\": \"Marvin Lewis\"\n }\n]",
                'json-table-templates': [
                    { q: 'What conference and division is {Team} in?', a: '{Conf-Div}', filter: '', group: '', multi: '' },
                    { q: 'Which teams are in {Conf-Div}?', a: '{Team}', filter: '', group: '{Conf-Div}', multi: '' }]
            };
            this.footballData = {
                json: "[\n {\n  \"Conf-Div\": \"AFC East\",\n  \"Team\": \"Buffalo Bills\",\n  \"Location\": \"Orchard Park,NY\",\n  \"Coach\": \"Rex Ryan\"\n },\n {\n  \"Conf-Div\": \"AFC East\",\n  \"Team\": \"Miami Dolphins\",\n  \"Location\": \"Miami Gardens,\u00A0FL\",\n  \"Coach\": \"Adam Gase\"\n },\n {\n  \"Conf-Div\": \"AFC East\",\n  \"Team\": \"New England Patriots\",\n  \"Location\": \"Foxborough,MA\",\n  \"Coach\": \"Bill Belichick\"\n },\n {\n  \"Conf-Div\": \"AFC East\",\n  \"Team\": \"New York Jets\",\n  \"Location\": \"East Rutherford,\u00A0NJ\",\n  \"Coach\": \"Todd Bowles\"\n },\n {\n  \"Conf-Div\": \"AFC North\",\n  \"Team\": \"Baltimore Ravens\",\n  \"Location\": \"Baltimore,\u00A0MD\",\n  \"Coach\": \"John Harbaugh\"\n },\n {\n  \"Conf-Div\": \"AFC North\",\n  \"Team\": \"Cincinnati Bengals\",\n  \"Location\": \"Cincinnati,\u00A0OH\",\n  \"Coach\": \"Marvin Lewis\"\n },\n {\n  \"Conf-Div\": \"AFC North\",\n  \"Team\": \"Cleveland Browns\",\n  \"Location\": \"Cleveland,\u00A0OH\",\n  \"Coach\": \"Hue Jackson\"\n },\n {\n  \"Conf-Div\": \"AFC North\",\n  \"Team\": \"Pittsburgh Steelers\",\n  \"Location\": \"Pittsburgh,\u00A0PA\",\n  \"Coach\": \"Mike Tomlin\"\n },\n {\n  \"Conf-Div\": \"AFC South\",\n  \"Team\": \"Houston Texans\",\n  \"Location\": \"Houston,\u00A0TX\",\n  \"Coach\": \"Bill O'Brien\"\n },\n {\n  \"Conf-Div\": \"AFC South\",\n  \"Team\": \"Indianapolis Colts\",\n  \"Location\": \"Indianapolis,IN\",\n  \"Coach\": \"Chuck Pagano\"\n },\n {\n  \"Conf-Div\": \"AFC South\",\n  \"Team\": \"Jacksonville Jaguars\",\n  \"Location\": \"Jacksonville,FL\",\n  \"Coach\": \"Gus Bradley\"\n },\n {\n  \"Conf-Div\": \"AFC South\",\n  \"Team\": \"Tennessee Titans\",\n  \"Location\": \"Nashville,\u00A0TN\",\n  \"Coach\": \"Mike Mularkey\"\n },\n {\n  \"Conf-Div\": \"AFC West\",\n  \"Team\": \"Denver Broncos\",\n  \"Location\": \"Denver,\u00A0CO\",\n  \"Coach\": \"Gary Kubiak\"\n },\n {\n  \"Conf-Div\": \"AFC West\",\n  \"Team\": \"Kansas City Chiefs\",\n  \"Location\": \"Kansas City,MO\",\n  \"Coach\": \"Andy Reid\"\n },\n {\n  \"Conf-Div\": \"AFC West\",\n  \"Team\": \"Oakland Raiders\",\n  \"Location\": \"Oakland,\u00A0CA\",\n  \"Coach\": \"Jack Del Rio\"\n },\n {\n  \"Conf-Div\": \"AFC West\",\n  \"Team\": \"San Diego Chargers\",\n  \"Location\": \"San Diego,\u00A0CA\",\n  \"Coach\": \"Mike McCoy\"\n },\n {\n  \"Conf-Div\": \"NFC East\",\n  \"Team\": \"Dallas Cowboys\",\n  \"Location\": \"Arlington,\u00A0TX\",\n  \"Coach\": \"Jason Garrett\"\n },\n {\n  \"Conf-Div\": \"NFC East\",\n  \"Team\": \"New York Giants\",\n  \"Location\": \"East Rutherford,\u00A0NJ\",\n  \"Coach\": \"Ben McAdoo\"\n },\n {\n  \"Conf-Div\": \"NFC East\",\n  \"Team\": \"Philadelphia Eagles\",\n  \"Location\": \"Philadelphia,PA\",\n  \"Coach\": \"Doug Pederson\"\n },\n {\n  \"Conf-Div\": \"NFC East\",\n  \"Team\": \"Washington Redskins\",\n  \"Location\": \"Landover,\u00A0MD\",\n  \"Coach\": \"Jay Gruden\"\n },\n {\n  \"Conf-Div\": \"NFC North\",\n  \"Team\": \"Chicago Bears\",\n  \"Location\": \"Chicago,\u00A0IL\",\n  \"Coach\": \"John Fox\"\n },\n {\n  \"Conf-Div\": \"NFC North\",\n  \"Team\": \"Detroit Lions\",\n  \"Location\": \"Detroit,\u00A0MI\",\n  \"Coach\": \"Jim Caldwell\"\n },\n {\n  \"Conf-Div\": \"NFC North\",\n  \"Team\": \"Green Bay Packers\",\n  \"Location\": \"Green Bay,\u00A0WI\",\n  \"Coach\": \"Mike McCarthy\"\n },\n {\n  \"Conf-Div\": \"NFC North\",\n  \"Team\": \"Minnesota Vikings\",\n  \"Location\": \"Minneapolis,MN\",\n  \"Coach\": \"Mike Zimmer\"\n },\n {\n  \"Conf-Div\": \"NFC South\",\n  \"Team\": \"Atlanta Falcons\",\n  \"Location\": \"Atlanta,\u00A0GA\",\n  \"Coach\": \"Dan Quinn\"\n },\n {\n  \"Conf-Div\": \"NFC South\",\n  \"Team\": \"Carolina Panthers\",\n  \"Location\": \"Charlotte,\u00A0NC\",\n  \"Coach\": \"Ron Rivera\"\n },\n {\n  \"Conf-Div\": \"NFC South\",\n  \"Team\": \"New Orleans Saints\",\n  \"Location\": \"New Orleans,LA\",\n  \"Coach\": \"Sean Payton\"\n },\n {\n  \"Conf-Div\": \"NFC South\",\n  \"Team\": \"Tampa Bay Buccaneers\",\n  \"Location\": \"Tampa,\u00A0FL\",\n  \"Coach\": \"Dirk Koetter\"\n },\n {\n  \"Conf-Div\": \"NFC West\",\n  \"Team\": \"Arizona Cardinals\",\n  \"Location\": \"Glendale,\u00A0AZ\",\n  \"Coach\": \"Bruce Arians\"\n },\n {\n  \"Conf-Div\": \"NFC West\",\n  \"Team\": \"Los Angeles Rams\",\n  \"Location\": \"Los Angeles,CA\",\n  \"Coach\": \"Jeff Fisher\"\n },\n {\n  \"Conf-Div\": \"NFC West\",\n  \"Team\": \"San Francisco 49ers\",\n  \"Location\": \"Santa Clara,CA\",\n  \"Coach\": \"Chip Kelly\"\n },\n {\n  \"Conf-Div\": \"NFC West\",\n  \"Team\": \"Seattle Seahawks\",\n  \"Location\": \"Seattle,\u00A0WA\",\n  \"Coach\": \"Pete Carroll\"\n }\n]",
                templates: [
                    { q: 'What conference and division is {Team} in?', a: '{Conf-Div}', filter: '', group: '', multi: '' },
                    { q: 'Which teams are in {Conf-Div}?', a: '{Team}', filter: '', group: '', multi: '' }
                ]
            };
            if (state.deck == null) {
                this.router.navigateToRoute('decks');
            }
            this.deck = state.deck;
            this.startValidation();
            this.cards = new Array();
        }
        Import.prototype.importTable = function () {
        };
        Import.prototype.saveDeck = function () {
            this.store.saveDeck(this.deck);
        };
        Import.prototype.saveNewCard = function () {
            this.controller.validate({ object: this })
                .then(function (err) {
                if (err.length == 0) {
                }
            });
        };
        Import.prototype.startValidation = function () {
            this.controller = this.validationControllerFactory.createForCurrentScope();
            this.controller.addRenderer(new bootstrap_form_renderer_1.BootstrapFormRenderer());
            var rules = aurelia_validation_1.ValidationRules
                .ensure("new_question")
                .displayName("Question")
                .minLength(5).maxLength(256).required()
                .ensure("new_answer")
                .displayName("Answer")
                .minLength(5).maxLength(256).required()
                .rules;
            this.controller.addObject(this, rules);
        };
        Import.prototype.importText_Change = function () {
            this.enableCreateCards = false;
        };
        Import.prototype.parseData = function () {
            var jsonData = [];
            var errors = [];
            if (this.importFormat == "json") {
                try {
                    jsonData = JSON.parse(this.importText);
                }
                catch (ex) {
                    errors.push(ex.toString());
                }
            }
            else if (this.importFormat == "csv") {
                var parserRes = Papa.parse(this.importText, { header: true });
                if (parserRes.errors.length > 0) {
                    errors.push(parserRes.errors);
                }
                else {
                    jsonData = parserRes.data;
                }
            }
            if (errors.length > 0) {
                this.enableCreateCards = false;
                alert(errors.join("\n"));
                return;
            }
            this.parsedData = jsonData;
            this.enableCreateCards = true;
            console.log("Parsed Data");
        };
        Import.prototype.csvJSON = function (csv) {
            var lines = csv.split("\n");
            var result = [];
            var headers = lines[0].split(",");
            for (var i = 1; i < lines.length; i++) {
                var obj = {};
                var currentline = lines[i].split(",");
                for (var j = 0; j < headers.length; j++) {
                    obj[headers[j]] = currentline[j];
                }
                result.push(obj);
            }
            return JSON.stringify(result);
        };
        Import.prototype.pasteImport_OnPaste = function ($event) {
            var plain = $event.clipboardData.getData('text/plain').trim();
            plain = plain.replace('\r\n', '\n');
            var objects = this.isDataRowBased ?
                this.textToObjectsTranspose(plain) :
                this.textToObjects(plain);
            this.importText = JSON.stringify(objects, null, ' ');
        };
        Import.prototype.textToObjects = function (stringData) {
            var objects = [];
            var rows = stringData.split('\n');
            var columns = rows[0].split('\t');
            for (var rowNr = 1; rowNr < rows.length; rowNr++) {
                var o = {};
                var data = rows[rowNr].split('\t');
                for (var cellNr = 0; cellNr < data.length; cellNr++) {
                    o[columns[cellNr]] = data[cellNr].trim();
                }
                objects.push(o);
            }
            return objects;
        };
        Import.prototype.textToObjectsTranspose = function (stringData) {
            var objects = [];
            var rows = stringData.split('\n');
            var columns = rows[0].split('\t');
            for (var colNum = 0; colNum < columns.length - 1; colNum++) {
                objects.push({});
            }
            for (var rowNbr = 0; rowNbr < rows.length; rowNbr++) {
                var row = rows[rowNbr].split('\t');
                var prop = row[0].trim();
                for (var cellNbr = 1; cellNbr < row.length; cellNbr++) {
                    objects[cellNbr - 1][prop] = row[cellNbr].trim();
                }
            }
            return objects;
        };
        Import.prototype.showSampleDataChange = function ($event) {
            var isChecked = $event.target.checked;
            if (isChecked) {
                this.importTextTempData = this.importText;
                this.importTemplatesTempData = this.importTemplates;
                this.tryShowSampleData();
            }
            else {
                this.importText = this.importTextTempData;
                this.importTemplates = this.importTemplatesTempData;
            }
        };
        Import.prototype.tryShowSampleData = function () {
            if (this.shouldShowSampleData) {
                var lookup = this.importFormat + '-' + this.importContent;
                this.importText = this.sampleData[lookup];
                var templatesLookup = this.importFormat + '-' + this.importContent + '-' + 'templates';
                this.importTemplates = this.sampleData[templatesLookup] || [];
            }
        };
        Import.prototype.addTemplate = function () {
            this.importTemplates.splice(0, 0, { q: '', a: '', filter: '', group: '', multi: '' });
        };
        Import.prototype.removeTemplate = function (t) {
            var ix = _.indexOf(this.importTemplates, t);
            this.importTemplates.splice(ix, 1);
        };
        Import.prototype.doFootBallData = function () {
            this.importText = this.footballData.json;
            this.importTemplates = this.footballData.templates;
            this.parseData();
        };
        Import.prototype.createCards = function () {
            var rows = this.parsedData;
            var templates = this.importTemplates;
            if (this.importContent == 'qa') {
                var props = _.keys(rows[0]);
                for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                    var row = rows_1[_i];
                    this.cards.push(new allobjects_1.Card(null, row[props[0]], row[props[1]]));
                }
            }
            else {
                var engine = new question_formulator_1.QuestionFormulatingEngine();
                for (var _a = 0, templates_1 = templates; _a < templates_1.length; _a++) {
                    var t = templates_1[_a];
                    var res = engine.CreateCards(rows, t, t);
                    if (true) {
                        var resQandA = res.content;
                        for (var _b = 0, resQandA_1 = resQandA; _b < resQandA_1.length; _b++) {
                            var qa = resQandA_1[_b];
                            this.cards.push(new allobjects_1.Card(null, qa.Q, qa.A));
                        }
                    }
                }
            }
        };
        Import.prototype.clearCards = function () {
            this.cards = [];
        };
        Import.prototype.saveCards = function () {
            this.deck.addCards(this.cards);
            this.clearForm();
            console.log('Cards Added to Deck');
        };
        Import.prototype.clearForm = function () {
            this.cards = [];
            this.importTemplates = [];
            this.importText = "";
        };
        Import = __decorate([
            aurelia_framework_1.inject(allobjects_1.State, aurelia_router_1.Router, aurelia_validation_1.ValidationControllerFactory, deck_store_api_1.DeckStoreAPI), 
            __metadata('design:paramtypes', [allobjects_1.State, aurelia_router_1.Router, aurelia_validation_1.ValidationControllerFactory, deck_store_api_1.DeckStoreAPI])
        ], Import);
        return Import;
    }());
    exports.Import = Import;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('deck/index',["require", "exports", 'aurelia-framework', './../objects/allobjects', 'aurelia-router', './../storage/deck-store-api'], function (require, exports, aurelia_framework_1, allobjects_1, aurelia_router_1, deck_store_api_1) {
    "use strict";
    var Index = (function () {
        function Index(state, router, store) {
            this.state = state;
            this.router = router;
            this.store = store;
        }
        Index.prototype.activate = function () {
            return this.search();
        };
        Index.prototype.search = function () {
            var _this = this;
            var searchText = this.searchText;
            var _searchLocation = this._getSearchLocation();
            if (_searchLocation === 'local') {
                return this.store.searchLocal(searchText)
                    .then(function (res) {
                    _this.decks = res;
                });
            }
            if (_searchLocation === 'remote') {
                return this.store.search(searchText)
                    .then(function (res) { _this.decks = res; });
            }
        };
        Index.prototype._getSearchLocation = function () {
            return this.searchLocation == 'remote' ? 'remote' : 'local';
        };
        Index.prototype.goToPlay = function (deckNum) {
            var _this = this;
            this.getDeck(deckNum).then(function (deck) {
                _this.state.deck = deck;
                _this.router.navigateToRoute("play", { id: "1" });
            });
        };
        Index.prototype.goToEdit = function (deckNum) {
            var _this = this;
            this.getDeck(deckNum)
                .then(function (deck) {
                _this.state.deck = deck;
                _this.router.navigateToRoute("edit");
            });
        };
        Index.prototype.getDeck = function (deckNum) {
            var promise = null;
            var _searchLocation = this._getSearchLocation();
            if (_searchLocation === 'local') {
                promise = this.store.getLocalDeck(deckNum);
            }
            if (_searchLocation === 'remote') {
                promise = this.store.getDeck(deckNum);
            }
            return promise;
        };
        Index.prototype.deleteDeck = function (deckNum) {
            var _this = this;
            this.store.deleteDeck(deckNum)
                .then(function () { return _this.search(); });
        };
        Index.prototype.goToNew = function () {
            this.state.deck = allobjects_1.Deck.Create();
            this.router.navigateToRoute("edit");
        };
        Index = __decorate([
            aurelia_framework_1.inject(allobjects_1.State, aurelia_router_1.Router, deck_store_api_1.DeckStoreAPI), 
            __metadata('design:paramtypes', [allobjects_1.State, aurelia_router_1.Router, deck_store_api_1.DeckStoreAPI])
        ], Index);
        return Index;
    }());
    exports.Index = Index;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('game/play',["require", "exports", './../objects/allobjects', 'aurelia-router', 'aurelia-framework', './../storage/deck-store-api'], function (require, exports, allobjects_1, aurelia_router_1, aurelia_framework_1, deck_store_api_1) {
    "use strict";
    var App = (function () {
        function App(router, state, store) {
            this.router = router;
            this.state = state;
            this.store = store;
            this.message = 'Professional Football Trivia';
            if (state.deck == null) {
                this.router.navigateToRoute('decks');
            }
            this.deck = state.deck;
            this.showCommands = false;
            this.isInTransition = true;
        }
        App.prototype.activate = function (params) {
            var id = 1;
            if (params.id != null)
                id = params.id;
            this.state.cardNumber = id;
            this.card = this.deck.cards[id - 1];
            this.isInTransition = false;
        };
        App.prototype.attached = function () {
            this.myKeypressCallback = this.keypressInput.bind(this);
            window.addEventListener('keydown', this.myKeypressCallback, false);
        };
        App.prototype.detached = function () {
            window.removeEventListener('keydown', this.myKeypressCallback);
        };
        App.prototype.myKeypressCallback = function (e) { };
        App.prototype.keypressInput = function (e) {
            var letter = e.key.toLowerCase();
            switch (letter) {
                case 'f':
                    this.flag(null);
                    break;
                case 'y':
                    this.right();
                    break;
                case 'n':
                    this.wrong();
                    break;
                case 'p':
                    this.pass();
                    break;
                case 's':
                    this.toggleAnswer();
                    break;
                case ' ':
                    this.toggleAnswer(true);
                    break;
                case 'arrowleft':
                    this.previous();
                    break;
                case 'arrowright':
                    this.next();
                    break;
                case 'h':
                    this.toggleCommands();
                    break;
                case 'r':
                    this.goToReview();
            }
        };
        App.prototype.toggleCommands = function () {
            this.showCommands = !this.showCommands;
        };
        App.prototype.handleSwipe = function (e) {
            console.log('swipe');
            console.log(e);
        };
        App.prototype.handleTap = function (e) {
            if (e.hammerEvent.target.id != 'cardEl' &&
                e.hammerEvent.target.id != 'answer')
                return;
            console.log('tap');
            console.log(e);
            this.toggleAnswer();
        };
        App.prototype.flag = function (e) {
            this.card.isFlagged = !this.card.isFlagged;
        };
        App.prototype.right = function () {
            this.respond(allobjects_1.CardResponse.Right);
        };
        App.prototype.wrong = function () {
            this.respond(allobjects_1.CardResponse.Wrong);
        };
        App.prototype.pass = function () {
            this.respond(allobjects_1.CardResponse.Pass);
        };
        App.prototype.respond = function (response) {
            var _this = this;
            if (this.isInTransition)
                return;
            this.card.mark(response);
            this.isInTransition = true;
            window.setTimeout(function (x) { return _this.next(); }, 200);
        };
        App.prototype.previous = function () {
            this.card = this.deck.previous();
            this.router.navigateToRoute("play", { id: this.card.number });
        };
        App.prototype.next = function () {
            var next = this.deck.next();
            if (this.card != next) {
                this.card = next;
                this.router.navigateToRoute("play", { id: this.card.number });
            }
            else {
            }
            this.isInTransition = false;
        };
        App.prototype.reset = function () {
            this.unreveal();
        };
        App.prototype.toggleAnswer = function (forceShow) {
            if (forceShow === void 0) { forceShow = false; }
            this.card.isAnswerVisible = forceShow || !this.card.isAnswerVisible;
        };
        App.prototype.reveal = function () {
            this.card.isAnswerVisible = true;
        };
        App.prototype.unreveal = function () {
            this.card.isAnswerVisible = false;
        };
        App.prototype.clearAnswers = function () {
            for (var _i = 0, _a = this.deck.cards; _i < _a.length; _i++) {
                var _card = _a[_i];
                _card.response = allobjects_1.CardResponse.Undefined;
                _card.isAnswerVisible = false;
            }
        };
        App.prototype.clearAnswersHistory = function () {
            this.clearAnswers();
            for (var _i = 0, _a = this.deck.cards; _i < _a.length; _i++) {
                var _card = _a[_i];
                _card.rightCount = 0;
                _card.wrongCount = 0;
                _card.skipCount = 0;
            }
        };
        App.prototype.goToReview = function () {
            this.router.navigateToRoute('review');
        };
        App.prototype.goToIndex = function () {
            this.router.navigateToRoute('decks');
        };
        App.prototype.saveGame = function () {
            this.store
                .saveDeck(this.deck)
                .then(function () { return alert("Game Saved!"); });
        };
        App = __decorate([
            aurelia_framework_1.inject(aurelia_router_1.Router, allobjects_1.State, deck_store_api_1.DeckStoreAPI), 
            __metadata('design:paramtypes', [aurelia_router_1.Router, allobjects_1.State, deck_store_api_1.DeckStoreAPI])
        ], App);
        return App;
    }());
    exports.App = App;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('game/review',["require", "exports", './../objects/allobjects', 'aurelia-framework', 'aurelia-router'], function (require, exports, allobjects_1, aurelia_framework_1, aurelia_router_1) {
    "use strict";
    var Review = (function () {
        function Review(state, router) {
            this.state = state;
            this.router = router;
            if (this.state.deck === undefined) {
                this.goToGame();
            }
            else {
                this.deck = this.state.deck;
            }
        }
        Review.prototype.goToGame = function () {
            this.router.navigateToRoute('play', { id: '1' });
        };
        Review.prototype.activate = function () {
            this.computeThings();
        };
        Review.prototype.computeThings = function () {
            var cards = this.state.deck.cards;
            this.questionCount = cards.length;
            this.correctAtLeastOnceCount = 0;
            this.neverCorrectCount = 0;
            this.noJudgementCount = 0;
            for (var i = 0; i < cards.length; i++) {
                var card = cards[i];
                if (card.rightCount > 0)
                    this.correctAtLeastOnceCount++;
                else if (card.wrongCount > 0)
                    this.neverCorrectCount++;
                else if (card.skipCount > 0)
                    this.noJudgementCount++;
            }
        };
        Review.prototype.attached = function () {
            this.myKeypressCallback = this.keypressInput.bind(this);
            window.addEventListener('keydown', this.myKeypressCallback, false);
        };
        Review.prototype.detached = function () {
            window.removeEventListener('keydown', this.myKeypressCallback);
        };
        Review.prototype.myKeypressCallback = function (e) { };
        Review.prototype.keypressInput = function (e) {
            var letter = e.key.toLowerCase();
            switch (letter) {
                case 'arrowleft':
                case 'backspace':
                    this.goToGame();
                    break;
            }
        };
        Review = __decorate([
            aurelia_framework_1.inject(allobjects_1.State, aurelia_router_1.Router), 
            __metadata('design:paramtypes', [allobjects_1.State, aurelia_router_1.Router])
        ], Review);
        return Review;
    }());
    exports.Review = Review;
});

define('lib/json-table-parser',["require", "exports", 'underscore'], function (require, exports, _) {
    "use strict";
    var JSONTableParser = (function () {
        function JSONTableParser(text) {
            this.text = text;
            this.success = false;
            this.message = null;
            try {
                this.data = JSON.parse(text);
            }
            catch (e) {
                this.message = "Unable to parse JSON. Invalid format";
            }
            if (!Array.isArray(this.data) || this.data.length < 1) {
                this.message = "The JSON must be an array of objects.";
                return;
            }
            var obj_0 = this.data[0];
            var schema_props = _.allKeys(obj_0);
            var i = 0;
            for (var _i = 0, _a = this.data; _i < _a.length; _i++) {
                var row = _a[_i];
                if (!_.isEqual(schema_props, _.allKeys(row))) {
                    this.message = "The rows at indecies 0 and " + i + " have different schemas. All rows must have the same schema";
                    return;
                }
                i++;
            }
            this.success = true;
        }
        JSONTableParser.prototype.IsSuccess = function () {
            return this.success;
        };
        JSONTableParser.prototype.Message = function () {
            return this.message;
        };
        JSONTableParser.prototype.GetData = function () {
            return this.data;
        };
        JSONTableParser.prototype.GetJSONSchema = function () {
            return this.schema;
        };
        return JSONTableParser;
    }());
    exports.JSONTableParser = JSONTableParser;
});

define('lib/json-template-parser',["require", "exports", 'underscore'], function (require, exports, _) {
    "use strict";
    var JSONTemplateParser = (function () {
        function JSONTemplateParser(text) {
            this.text = text;
            this.success = false;
            this.message = null;
            try {
                this.data = JSON.parse(text);
            }
            catch (e) {
                this.message = "Unable to parse JSON. Invalid format";
            }
            if (!Array.isArray(this.data) || this.data.length < 1) {
                this.message = "The JSON must be an array of objects.";
                return;
            }
            var obj_0 = this.data[0];
            var schema_props = _.allKeys(obj_0);
            var i = 0;
            for (var _i = 0, _a = this.data; _i < _a.length; _i++) {
                var row = _a[_i];
                if (!_.isEqual(schema_props, _.allKeys(row))) {
                    this.message = "The rows at indecies 0 and " + i + " have different schemas. All rows must have the same schema";
                    return;
                }
                i++;
            }
            this.success = true;
        }
        JSONTemplateParser.prototype.IsSuccess = function () {
            return this.success;
        };
        JSONTemplateParser.prototype.Message = function () {
            return this.message;
        };
        JSONTemplateParser.prototype.GetData = function () {
            return this.data;
        };
        JSONTemplateParser.prototype.GetJSONSchema = function () {
            return this.schema;
        };
        return JSONTemplateParser;
    }());
    exports.JSONTemplateParser = JSONTemplateParser;
});

define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    function configure(config) {
        config.globalResources(['./value-converters/number']);
    }
    exports.configure = configure;
});

define('resources/value-converters/number',["require", "exports"], function (require, exports) {
    "use strict";
    var DecimalNumberValueConverter = (function () {
        function DecimalNumberValueConverter() {
        }
        DecimalNumberValueConverter.prototype.toView = function (value, format) {
            if (!value && value !== 0)
                return null;
            return Number(value).toFixed(format);
        };
        return DecimalNumberValueConverter;
    }());
    exports.DecimalNumberValueConverter = DecimalNumberValueConverter;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('aurelia-validation/validate-binding-behavior',["require", "exports", 'aurelia-task-queue', './validate-trigger', './validate-binding-behavior-base'], function (require, exports, aurelia_task_queue_1, validate_trigger_1, validate_binding_behavior_base_1) {
    "use strict";
    /**
     * Binding behavior. Indicates the bound property should be validated
     * when the validate trigger specified by the associated controller's
     * validateTrigger property occurs.
     */
    var ValidateBindingBehavior = (function (_super) {
        __extends(ValidateBindingBehavior, _super);
        function ValidateBindingBehavior() {
            _super.apply(this, arguments);
        }
        ValidateBindingBehavior.prototype.getValidateTrigger = function (controller) {
            return controller.validateTrigger;
        };
        ValidateBindingBehavior.inject = [aurelia_task_queue_1.TaskQueue];
        return ValidateBindingBehavior;
    }(validate_binding_behavior_base_1.ValidateBindingBehaviorBase));
    exports.ValidateBindingBehavior = ValidateBindingBehavior;
    /**
     * Binding behavior. Indicates the bound property will be validated
     * manually, by calling controller.validate(). No automatic validation
     * triggered by data-entry or blur will occur.
     */
    var ValidateManuallyBindingBehavior = (function (_super) {
        __extends(ValidateManuallyBindingBehavior, _super);
        function ValidateManuallyBindingBehavior() {
            _super.apply(this, arguments);
        }
        ValidateManuallyBindingBehavior.prototype.getValidateTrigger = function () {
            return validate_trigger_1.validateTrigger.manual;
        };
        ValidateManuallyBindingBehavior.inject = [aurelia_task_queue_1.TaskQueue];
        return ValidateManuallyBindingBehavior;
    }(validate_binding_behavior_base_1.ValidateBindingBehaviorBase));
    exports.ValidateManuallyBindingBehavior = ValidateManuallyBindingBehavior;
    /**
     * Binding behavior. Indicates the bound property should be validated
     * when the associated element blurs.
     */
    var ValidateOnBlurBindingBehavior = (function (_super) {
        __extends(ValidateOnBlurBindingBehavior, _super);
        function ValidateOnBlurBindingBehavior() {
            _super.apply(this, arguments);
        }
        ValidateOnBlurBindingBehavior.prototype.getValidateTrigger = function () {
            return validate_trigger_1.validateTrigger.blur;
        };
        ValidateOnBlurBindingBehavior.inject = [aurelia_task_queue_1.TaskQueue];
        return ValidateOnBlurBindingBehavior;
    }(validate_binding_behavior_base_1.ValidateBindingBehaviorBase));
    exports.ValidateOnBlurBindingBehavior = ValidateOnBlurBindingBehavior;
    /**
     * Binding behavior. Indicates the bound property should be validated
     * when the associated element is changed by the user, causing a change
     * to the model.
     */
    var ValidateOnChangeBindingBehavior = (function (_super) {
        __extends(ValidateOnChangeBindingBehavior, _super);
        function ValidateOnChangeBindingBehavior() {
            _super.apply(this, arguments);
        }
        ValidateOnChangeBindingBehavior.prototype.getValidateTrigger = function () {
            return validate_trigger_1.validateTrigger.change;
        };
        ValidateOnChangeBindingBehavior.inject = [aurelia_task_queue_1.TaskQueue];
        return ValidateOnChangeBindingBehavior;
    }(validate_binding_behavior_base_1.ValidateBindingBehaviorBase));
    exports.ValidateOnChangeBindingBehavior = ValidateOnChangeBindingBehavior;
    /**
     * Binding behavior. Indicates the bound property should be validated
     * when the associated element blurs or is changed by the user, causing
     * a change to the model.
     */
    var ValidateOnChangeOrBlurBindingBehavior = (function (_super) {
        __extends(ValidateOnChangeOrBlurBindingBehavior, _super);
        function ValidateOnChangeOrBlurBindingBehavior() {
            _super.apply(this, arguments);
        }
        ValidateOnChangeOrBlurBindingBehavior.prototype.getValidateTrigger = function () {
            return validate_trigger_1.validateTrigger.changeOrBlur;
        };
        ValidateOnChangeOrBlurBindingBehavior.inject = [aurelia_task_queue_1.TaskQueue];
        return ValidateOnChangeOrBlurBindingBehavior;
    }(validate_binding_behavior_base_1.ValidateBindingBehaviorBase));
    exports.ValidateOnChangeOrBlurBindingBehavior = ValidateOnChangeOrBlurBindingBehavior;
});

define('aurelia-validation/validate-trigger',["require", "exports"], function (require, exports) {
    "use strict";
    /**
    * Validation triggers.
    */
    exports.validateTrigger = {
        /**
        * Manual validation.  Use the controller's `validate()` and  `reset()` methods
        * to validate all bindings.
        */
        manual: 0,
        /**
        * Validate the binding when the binding's target element fires a DOM "blur" event.
        */
        blur: 1,
        /**
        * Validate the binding when it updates the model due to a change in the view.
        */
        change: 2,
        /**
         * Validate the binding when the binding's target element fires a DOM "blur" event and
         * when it updates the model due to a change in the view.
         */
        changeOrBlur: 3
    };
});

define('aurelia-validation/validate-binding-behavior-base',["require", "exports", 'aurelia-dependency-injection', 'aurelia-pal', './validation-controller', './validate-trigger'], function (require, exports, aurelia_dependency_injection_1, aurelia_pal_1, validation_controller_1, validate_trigger_1) {
    "use strict";
    /**
     * Binding behavior. Indicates the bound property should be validated.
     */
    var ValidateBindingBehaviorBase = (function () {
        function ValidateBindingBehaviorBase(taskQueue) {
            this.taskQueue = taskQueue;
        }
        /**
        * Gets the DOM element associated with the data-binding. Most of the time it's
        * the binding.target but sometimes binding.target is an aurelia custom element,
        * or custom attribute which is a javascript "class" instance, so we need to use
        * the controller's container to retrieve the actual DOM element.
        */
        ValidateBindingBehaviorBase.prototype.getTarget = function (binding, view) {
            var target = binding.target;
            // DOM element
            if (target instanceof Element) {
                return target;
            }
            // custom element or custom attribute
            for (var i = 0, ii = view.controllers.length; i < ii; i++) {
                var controller = view.controllers[i];
                if (controller.viewModel === target) {
                    var element = controller.container.get(aurelia_pal_1.DOM.Element);
                    if (element) {
                        return element;
                    }
                    throw new Error("Unable to locate target element for \"" + binding.sourceExpression + "\".");
                }
            }
            throw new Error("Unable to locate target element for \"" + binding.sourceExpression + "\".");
        };
        ValidateBindingBehaviorBase.prototype.bind = function (binding, source, rulesOrController, rules) {
            var _this = this;
            // identify the target element.
            var target = this.getTarget(binding, source);
            // locate the controller.
            var controller;
            if (rulesOrController instanceof validation_controller_1.ValidationController) {
                controller = rulesOrController;
            }
            else {
                controller = source.container.get(aurelia_dependency_injection_1.Optional.of(validation_controller_1.ValidationController));
                rules = rulesOrController;
            }
            if (controller === null) {
                throw new Error("A ValidationController has not been registered.");
            }
            controller.registerBinding(binding, target, rules);
            binding.validationController = controller;
            var trigger = this.getValidateTrigger(controller);
            if (trigger & validate_trigger_1.validateTrigger.change) {
                binding.standardUpdateSource = binding.updateSource;
                binding.updateSource = function (value) {
                    this.standardUpdateSource(value);
                    this.validationController.validateBinding(this);
                };
            }
            if (trigger & validate_trigger_1.validateTrigger.blur) {
                binding.validateBlurHandler = function () {
                    _this.taskQueue.queueMicroTask(function () { return controller.validateBinding(binding); });
                };
                binding.validateTarget = target;
                target.addEventListener('blur', binding.validateBlurHandler);
            }
            if (trigger !== validate_trigger_1.validateTrigger.manual) {
                binding.standardUpdateTarget = binding.updateTarget;
                binding.updateTarget = function (value) {
                    this.standardUpdateTarget(value);
                    this.validationController.resetBinding(this);
                };
            }
        };
        ValidateBindingBehaviorBase.prototype.unbind = function (binding) {
            // reset the binding to it's original state.
            if (binding.standardUpdateSource) {
                binding.updateSource = binding.standardUpdateSource;
                binding.standardUpdateSource = null;
            }
            if (binding.standardUpdateTarget) {
                binding.updateTarget = binding.standardUpdateTarget;
                binding.standardUpdateTarget = null;
            }
            if (binding.validateBlurHandler) {
                binding.validateTarget.removeEventListener('blur', binding.validateBlurHandler);
                binding.validateBlurHandler = null;
                binding.validateTarget = null;
            }
            binding.validationController.unregisterBinding(binding);
            binding.validationController = null;
        };
        return ValidateBindingBehaviorBase;
    }());
    exports.ValidateBindingBehaviorBase = ValidateBindingBehaviorBase;
});

define('aurelia-validation/validation-controller',["require", "exports", './validator', './validate-trigger', './property-info', './validation-error'], function (require, exports, validator_1, validate_trigger_1, property_info_1, validation_error_1) {
    "use strict";
    /**
     * Orchestrates validation.
     * Manages a set of bindings, renderers and objects.
     * Exposes the current list of validation errors for binding purposes.
     */
    var ValidationController = (function () {
        function ValidationController(validator) {
            this.validator = validator;
            // Registered bindings (via the validate binding behavior)
            this.bindings = new Map();
            // Renderers that have been added to the controller instance.
            this.renderers = [];
            /**
             * Errors that have been rendered by the controller.
             */
            this.errors = [];
            /**
             *  Whether the controller is currently validating.
             */
            this.validating = false;
            // Elements related to errors that have been rendered.
            this.elements = new Map();
            // Objects that have been added to the controller instance (entity-style validation).
            this.objects = new Map();
            /**
             * The trigger that will invoke automatic validation of a property used in a binding.
             */
            this.validateTrigger = validate_trigger_1.validateTrigger.blur;
            // Promise that resolves when validation has completed.
            this.finishValidating = Promise.resolve();
        }
        /**
         * Adds an object to the set of objects that should be validated when validate is called.
         * @param object The object.
         * @param rules Optional. The rules. If rules aren't supplied the Validator implementation will lookup the rules.
         */
        ValidationController.prototype.addObject = function (object, rules) {
            this.objects.set(object, rules);
        };
        /**
         * Removes an object from the set of objects that should be validated when validate is called.
         * @param object The object.
         */
        ValidationController.prototype.removeObject = function (object) {
            this.objects.delete(object);
            this.processErrorDelta('reset', this.errors.filter(function (error) { return error.object === object; }), []);
        };
        /**
         * Adds and renders a ValidationError.
         */
        ValidationController.prototype.addError = function (message, object, propertyName) {
            var error = new validation_error_1.ValidationError({}, message, object, propertyName);
            this.processErrorDelta('validate', [], [error]);
            return error;
        };
        /**
         * Removes and unrenders a ValidationError.
         */
        ValidationController.prototype.removeError = function (error) {
            if (this.errors.indexOf(error) !== -1) {
                this.processErrorDelta('reset', [error], []);
            }
        };
        /**
         * Adds a renderer.
         * @param renderer The renderer.
         */
        ValidationController.prototype.addRenderer = function (renderer) {
            var _this = this;
            this.renderers.push(renderer);
            renderer.render({
                kind: 'validate',
                render: this.errors.map(function (error) { return ({ error: error, elements: _this.elements.get(error) }); }),
                unrender: []
            });
        };
        /**
         * Removes a renderer.
         * @param renderer The renderer.
         */
        ValidationController.prototype.removeRenderer = function (renderer) {
            var _this = this;
            this.renderers.splice(this.renderers.indexOf(renderer), 1);
            renderer.render({
                kind: 'reset',
                render: [],
                unrender: this.errors.map(function (error) { return ({ error: error, elements: _this.elements.get(error) }); })
            });
        };
        /**
         * Registers a binding with the controller.
         * @param binding The binding instance.
         * @param target The DOM element.
         * @param rules (optional) rules associated with the binding. Validator implementation specific.
         */
        ValidationController.prototype.registerBinding = function (binding, target, rules) {
            this.bindings.set(binding, { target: target, rules: rules });
        };
        /**
         * Unregisters a binding with the controller.
         * @param binding The binding instance.
         */
        ValidationController.prototype.unregisterBinding = function (binding) {
            this.resetBinding(binding);
            this.bindings.delete(binding);
        };
        /**
         * Interprets the instruction and returns a predicate that will identify
         * relevant errors in the list of rendered errors.
         */
        ValidationController.prototype.getInstructionPredicate = function (instruction) {
            if (instruction) {
                var object_1 = instruction.object, propertyName_1 = instruction.propertyName, rules_1 = instruction.rules;
                var predicate_1;
                if (instruction.propertyName) {
                    predicate_1 = function (x) { return x.object === object_1 && x.propertyName === propertyName_1; };
                }
                else {
                    predicate_1 = function (x) { return x.object === object_1; };
                }
                // todo: move to Validator interface:
                if (rules_1 && rules_1.indexOf) {
                    return function (x) { return predicate_1(x) && rules_1.indexOf(x.rule) !== -1; };
                }
                return predicate_1;
            }
            else {
                return function () { return true; };
            }
        };
        /**
         * Validates and renders errors.
         * @param instruction Optional. Instructions on what to validate. If undefined, all objects and bindings will be validated.
         */
        ValidationController.prototype.validate = function (instruction) {
            var _this = this;
            // Get a function that will process the validation instruction.
            var execute;
            if (instruction) {
                var object_2 = instruction.object, propertyName_2 = instruction.propertyName, rules_2 = instruction.rules;
                // if rules were not specified, check the object map.
                rules_2 = rules_2 || this.objects.get(object_2);
                // property specified?
                if (instruction.propertyName === undefined) {
                    // validate the specified object.
                    execute = function () { return _this.validator.validateObject(object_2, rules_2); };
                }
                else {
                    // validate the specified property.
                    execute = function () { return _this.validator.validateProperty(object_2, propertyName_2, rules_2); };
                }
            }
            else {
                // validate all objects and bindings.
                execute = function () {
                    var promises = [];
                    for (var _i = 0, _a = Array.from(_this.objects); _i < _a.length; _i++) {
                        var _b = _a[_i], object = _b[0], rules = _b[1];
                        promises.push(_this.validator.validateObject(object, rules));
                    }
                    for (var _c = 0, _d = Array.from(_this.bindings); _c < _d.length; _c++) {
                        var _e = _d[_c], binding = _e[0], rules = _e[1].rules;
                        var _f = property_info_1.getPropertyInfo(binding.sourceExpression, binding.source), object = _f.object, propertyName = _f.propertyName;
                        if (_this.objects.has(object)) {
                            continue;
                        }
                        promises.push(_this.validator.validateProperty(object, propertyName, rules));
                    }
                    return Promise.all(promises).then(function (errorSets) { return errorSets.reduce(function (a, b) { return a.concat(b); }, []); });
                };
            }
            // Wait for any existing validation to finish, execute the instruction, render the errors.
            this.validating = true;
            var result = this.finishValidating
                .then(execute)
                .then(function (newErrors) {
                var predicate = _this.getInstructionPredicate(instruction);
                var oldErrors = _this.errors.filter(predicate);
                _this.processErrorDelta('validate', oldErrors, newErrors);
                if (result === _this.finishValidating) {
                    _this.validating = false;
                }
                return newErrors;
            })
                .catch(function (error) {
                // recover, to enable subsequent calls to validate()
                _this.validating = false;
                _this.finishValidating = Promise.resolve();
                return Promise.reject(error);
            });
            this.finishValidating = result;
            return result;
        };
        /**
         * Resets any rendered errors (unrenders).
         * @param instruction Optional. Instructions on what to reset. If unspecified all rendered errors will be unrendered.
         */
        ValidationController.prototype.reset = function (instruction) {
            var predicate = this.getInstructionPredicate(instruction);
            var oldErrors = this.errors.filter(predicate);
            this.processErrorDelta('reset', oldErrors, []);
        };
        /**
         * Gets the elements associated with an object and propertyName (if any).
         */
        ValidationController.prototype.getAssociatedElements = function (_a) {
            var object = _a.object, propertyName = _a.propertyName;
            var elements = [];
            for (var _i = 0, _b = Array.from(this.bindings); _i < _b.length; _i++) {
                var _c = _b[_i], binding = _c[0], target = _c[1].target;
                var _d = property_info_1.getPropertyInfo(binding.sourceExpression, binding.source), o = _d.object, p = _d.propertyName;
                if (o === object && p === propertyName) {
                    elements.push(target);
                }
            }
            return elements;
        };
        ValidationController.prototype.processErrorDelta = function (kind, oldErrors, newErrors) {
            // prepare the instruction.
            var instruction = {
                kind: kind,
                render: [],
                unrender: []
            };
            // create a shallow copy of newErrors so we can mutate it without causing side-effects.
            newErrors = newErrors.slice(0);
            // create unrender instructions from the old errors.
            var _loop_1 = function(oldError) {
                // get the elements associated with the old error.
                var elements = this_1.elements.get(oldError);
                // remove the old error from the element map.
                this_1.elements.delete(oldError);
                // create the unrender instruction.
                instruction.unrender.push({ error: oldError, elements: elements });
                // determine if there's a corresponding new error for the old error we are unrendering.
                var newErrorIndex = newErrors.findIndex(function (x) { return x.rule === oldError.rule && x.object === oldError.object && x.propertyName === oldError.propertyName; });
                if (newErrorIndex === -1) {
                    // no corresponding new error... simple remove.
                    this_1.errors.splice(this_1.errors.indexOf(oldError), 1);
                }
                else {
                    // there is a corresponding new error...        
                    var newError = newErrors.splice(newErrorIndex, 1)[0];
                    // get the elements that are associated with the new error.
                    var elements_1 = this_1.getAssociatedElements(newError);
                    this_1.elements.set(newError, elements_1);
                    // create a render instruction for the new error.
                    instruction.render.push({ error: newError, elements: elements_1 });
                    // do an in-place replacement of the old error with the new error.
                    // this ensures any repeats bound to this.errors will not thrash.
                    this_1.errors.splice(this_1.errors.indexOf(oldError), 1, newError);
                }
            };
            var this_1 = this;
            for (var _i = 0, oldErrors_1 = oldErrors; _i < oldErrors_1.length; _i++) {
                var oldError = oldErrors_1[_i];
                _loop_1(oldError);
            }
            // create render instructions from the remaining new errors.
            for (var _a = 0, newErrors_1 = newErrors; _a < newErrors_1.length; _a++) {
                var error = newErrors_1[_a];
                var elements = this.getAssociatedElements(error);
                instruction.render.push({ error: error, elements: elements });
                this.elements.set(error, elements);
                this.errors.push(error);
            }
            // render.
            for (var _b = 0, _c = this.renderers; _b < _c.length; _b++) {
                var renderer = _c[_b];
                renderer.render(instruction);
            }
        };
        /**
        * Validates the property associated with a binding.
        */
        ValidationController.prototype.validateBinding = function (binding) {
            if (!binding.isBound) {
                return;
            }
            var _a = property_info_1.getPropertyInfo(binding.sourceExpression, binding.source), object = _a.object, propertyName = _a.propertyName;
            var registeredBinding = this.bindings.get(binding);
            var rules = registeredBinding ? registeredBinding.rules : undefined;
            this.validate({ object: object, propertyName: propertyName, rules: rules });
        };
        /**
        * Resets the errors for a property associated with a binding.
        */
        ValidationController.prototype.resetBinding = function (binding) {
            var _a = property_info_1.getPropertyInfo(binding.sourceExpression, binding.source), object = _a.object, propertyName = _a.propertyName;
            this.reset({ object: object, propertyName: propertyName });
        };
        ValidationController.inject = [validator_1.Validator];
        return ValidationController;
    }());
    exports.ValidationController = ValidationController;
});

define('aurelia-validation/validator',["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Validates.
     * Responsible for validating objects and properties.
     */
    var Validator = (function () {
        function Validator() {
        }
        return Validator;
    }());
    exports.Validator = Validator;
});

define('aurelia-validation/property-info',["require", "exports", 'aurelia-binding'], function (require, exports, aurelia_binding_1) {
    "use strict";
    function getObject(expression, objectExpression, source) {
        var value = objectExpression.evaluate(source, null);
        if (value !== null && (typeof value === 'object' || typeof value === 'function')) {
            return value;
        }
        if (value === null) {
            value = 'null';
        }
        else if (value === undefined) {
            value = 'undefined';
        }
        throw new Error("The '" + objectExpression + "' part of '" + expression + "' evaluates to " + value + " instead of an object.");
    }
    /**
     * Retrieves the object and property name for the specified expression.
     * @param expression The expression
     * @param source The scope
     */
    function getPropertyInfo(expression, source) {
        var originalExpression = expression;
        while (expression instanceof aurelia_binding_1.BindingBehavior || expression instanceof aurelia_binding_1.ValueConverter) {
            expression = expression.expression;
        }
        var object;
        var propertyName;
        if (expression instanceof aurelia_binding_1.AccessScope) {
            object = source.bindingContext;
            propertyName = expression.name;
        }
        else if (expression instanceof aurelia_binding_1.AccessMember) {
            object = getObject(originalExpression, expression.object, source);
            propertyName = expression.name;
        }
        else if (expression instanceof aurelia_binding_1.AccessKeyed) {
            object = getObject(originalExpression, expression.object, source);
            propertyName = expression.key.evaluate(source);
        }
        else {
            throw new Error("Expression '" + originalExpression + "' is not compatible with the validate binding-behavior.");
        }
        return { object: object, propertyName: propertyName };
    }
    exports.getPropertyInfo = getPropertyInfo;
});

define('aurelia-validation/validation-error',["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * A validation error.
     */
    var ValidationError = (function () {
        /**
         * @param rule The rule associated with the error. Validator implementation specific.
         * @param message The error message.
         * @param object The invalid object
         * @param propertyName The name of the invalid property. Optional.
         */
        function ValidationError(rule, message, object, propertyName) {
            if (propertyName === void 0) { propertyName = null; }
            this.rule = rule;
            this.message = message;
            this.object = object;
            this.propertyName = propertyName;
            this.id = ValidationError.nextId++;
        }
        ValidationError.prototype.toString = function () {
            return this.message;
        };
        ValidationError.nextId = 0;
        return ValidationError;
    }());
    exports.ValidationError = ValidationError;
});

define('aurelia-validation/validation-controller-factory',["require", "exports", './validation-controller', './validator'], function (require, exports, validation_controller_1, validator_1) {
    "use strict";
    /**
     * Creates ValidationController instances.
     */
    var ValidationControllerFactory = (function () {
        function ValidationControllerFactory(container) {
            this.container = container;
        }
        ValidationControllerFactory.get = function (container) {
            return new ValidationControllerFactory(container);
        };
        /**
         * Creates a new controller instance.
         */
        ValidationControllerFactory.prototype.create = function (validator) {
            if (!validator) {
                validator = this.container.get(validator_1.Validator);
            }
            return new validation_controller_1.ValidationController(validator);
        };
        /**
         * Creates a new controller and registers it in the current element's container so that it's
         * available to the validate binding behavior and renderers.
         */
        ValidationControllerFactory.prototype.createForCurrentScope = function (validator) {
            var controller = this.create(validator);
            this.container.registerInstance(validation_controller_1.ValidationController, controller);
            return controller;
        };
        return ValidationControllerFactory;
    }());
    exports.ValidationControllerFactory = ValidationControllerFactory;
    ValidationControllerFactory['protocol:aurelia:resolver'] = true;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define('aurelia-validation/validation-errors-custom-attribute',["require", "exports", 'aurelia-binding', 'aurelia-dependency-injection', 'aurelia-templating', './validation-controller'], function (require, exports, aurelia_binding_1, aurelia_dependency_injection_1, aurelia_templating_1, validation_controller_1) {
    "use strict";
    var ValidationErrorsCustomAttribute = (function () {
        function ValidationErrorsCustomAttribute(boundaryElement, controllerAccessor) {
            this.boundaryElement = boundaryElement;
            this.controllerAccessor = controllerAccessor;
            this.errors = [];
        }
        ValidationErrorsCustomAttribute.prototype.sort = function () {
            this.errors.sort(function (a, b) {
                if (a.targets[0] === b.targets[0]) {
                    return 0;
                }
                return a.targets[0].compareDocumentPosition(b.targets[0]) & 2 ? 1 : -1;
            });
        };
        ValidationErrorsCustomAttribute.prototype.interestingElements = function (elements) {
            var _this = this;
            return elements.filter(function (e) { return _this.boundaryElement.contains(e); });
        };
        ValidationErrorsCustomAttribute.prototype.render = function (instruction) {
            var _loop_1 = function(error) {
                var index = this_1.errors.findIndex(function (x) { return x.error === error; });
                if (index !== -1) {
                    this_1.errors.splice(index, 1);
                }
            };
            var this_1 = this;
            for (var _i = 0, _a = instruction.unrender; _i < _a.length; _i++) {
                var error = _a[_i].error;
                _loop_1(error);
            }
            for (var _b = 0, _c = instruction.render; _b < _c.length; _b++) {
                var _d = _c[_b], error = _d.error, elements = _d.elements;
                var targets = this.interestingElements(elements);
                if (targets.length) {
                    this.errors.push({ error: error, targets: targets });
                }
            }
            this.sort();
            this.value = this.errors;
        };
        ValidationErrorsCustomAttribute.prototype.bind = function () {
            this.controllerAccessor().addRenderer(this);
            this.value = this.errors;
        };
        ValidationErrorsCustomAttribute.prototype.unbind = function () {
            this.controllerAccessor().removeRenderer(this);
        };
        ValidationErrorsCustomAttribute.inject = [Element, aurelia_dependency_injection_1.Lazy.of(validation_controller_1.ValidationController)];
        ValidationErrorsCustomAttribute = __decorate([
            aurelia_templating_1.customAttribute('validation-errors', aurelia_binding_1.bindingMode.twoWay)
        ], ValidationErrorsCustomAttribute);
        return ValidationErrorsCustomAttribute;
    }());
    exports.ValidationErrorsCustomAttribute = ValidationErrorsCustomAttribute;
});

define('aurelia-validation/validation-renderer-custom-attribute',["require", "exports", './validation-controller'], function (require, exports, validation_controller_1) {
    "use strict";
    var ValidationRendererCustomAttribute = (function () {
        function ValidationRendererCustomAttribute() {
        }
        ValidationRendererCustomAttribute.prototype.created = function (view) {
            this.container = view.container;
        };
        ValidationRendererCustomAttribute.prototype.bind = function () {
            this.controller = this.container.get(validation_controller_1.ValidationController);
            this.renderer = this.container.get(this.value);
            this.controller.addRenderer(this.renderer);
        };
        ValidationRendererCustomAttribute.prototype.unbind = function () {
            this.controller.removeRenderer(this.renderer);
            this.controller = null;
            this.renderer = null;
        };
        return ValidationRendererCustomAttribute;
    }());
    exports.ValidationRendererCustomAttribute = ValidationRendererCustomAttribute;
});

define('aurelia-validation/implementation/rules',["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Sets, unsets and retrieves rules on an object or constructor function.
     */
    var Rules = (function () {
        function Rules() {
        }
        /**
         * Applies the rules to a target.
         */
        Rules.set = function (target, rules) {
            if (target instanceof Function) {
                target = target.prototype;
            }
            Object.defineProperty(target, Rules.key, { enumerable: false, configurable: false, writable: true, value: rules });
        };
        /**
         * Removes rules from a target.
         */
        Rules.unset = function (target) {
            if (target instanceof Function) {
                target = target.prototype;
            }
            target[Rules.key] = null;
        };
        /**
         * Retrieves the target's rules.
         */
        Rules.get = function (target) {
            return target[Rules.key] || null;
        };
        /**
         * The name of the property that stores the rules.
         */
        Rules.key = '__rules__';
        return Rules;
    }());
    exports.Rules = Rules;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('aurelia-validation/implementation/standard-validator',["require", "exports", 'aurelia-templating', '../validator', '../validation-error', './rules', './validation-messages'], function (require, exports, aurelia_templating_1, validator_1, validation_error_1, rules_1, validation_messages_1) {
    "use strict";
    /**
     * Validates.
     * Responsible for validating objects and properties.
     */
    var StandardValidator = (function (_super) {
        __extends(StandardValidator, _super);
        function StandardValidator(messageProvider, resources) {
            _super.call(this);
            this.messageProvider = messageProvider;
            this.lookupFunctions = resources.lookupFunctions;
            this.getDisplayName = messageProvider.getDisplayName.bind(messageProvider);
        }
        StandardValidator.prototype.getMessage = function (rule, object, value) {
            var expression = rule.message || this.messageProvider.getMessage(rule.messageKey);
            var _a = rule.property, propertyName = _a.name, displayName = _a.displayName;
            if (displayName === null && propertyName !== null) {
                displayName = this.messageProvider.getDisplayName(propertyName);
            }
            var overrideContext = {
                $displayName: displayName,
                $propertyName: propertyName,
                $value: value,
                $object: object,
                $config: rule.config,
                $getDisplayName: this.getDisplayName
            };
            return expression.evaluate({ bindingContext: object, overrideContext: overrideContext }, this.lookupFunctions);
        };
        StandardValidator.prototype.validateRuleSequence = function (object, propertyName, ruleSequence, sequence) {
            var _this = this;
            // are we validating all properties or a single property?
            var validateAllProperties = propertyName === null || propertyName === undefined;
            var rules = ruleSequence[sequence];
            var errors = [];
            // validate each rule.
            var promises = [];
            var _loop_1 = function(i) {
                var rule = rules[i];
                // is the rule related to the property we're validating.
                if (!validateAllProperties && rule.property.name !== propertyName) {
                    return "continue";
                }
                // is this a conditional rule? is the condition met?
                if (rule.when && !rule.when(object)) {
                    return "continue";
                }
                // validate.
                var value = rule.property.name === null ? object : object[rule.property.name];
                var promiseOrBoolean = rule.condition(value, object);
                if (!(promiseOrBoolean instanceof Promise)) {
                    promiseOrBoolean = Promise.resolve(promiseOrBoolean);
                }
                promises.push(promiseOrBoolean.then(function (isValid) {
                    if (!isValid) {
                        var message = _this.getMessage(rule, object, value);
                        errors.push(new validation_error_1.ValidationError(rule, message, object, rule.property.name));
                    }
                }));
            };
            for (var i = 0; i < rules.length; i++) {
                _loop_1(i);
            }
            return Promise.all(promises)
                .then(function () {
                sequence++;
                if (errors.length === 0 && sequence < ruleSequence.length) {
                    return _this.validateRuleSequence(object, propertyName, ruleSequence, sequence);
                }
                return errors;
            });
        };
        StandardValidator.prototype.validate = function (object, propertyName, rules) {
            // rules specified?
            if (!rules) {
                // no. attempt to locate the rules.
                rules = rules_1.Rules.get(object);
            }
            // any rules?
            if (!rules) {
                return Promise.resolve([]);
            }
            return this.validateRuleSequence(object, propertyName, rules, 0);
        };
        /**
         * Validates the specified property.
         * @param object The object to validate.
         * @param propertyName The name of the property to validate.
         * @param rules Optional. If unspecified, the rules will be looked up using the metadata
         * for the object created by ValidationRules....on(class/object)
         */
        StandardValidator.prototype.validateProperty = function (object, propertyName, rules) {
            return this.validate(object, propertyName, rules || null);
        };
        /**
         * Validates all rules for specified object and it's properties.
         * @param object The object to validate.
         * @param rules Optional. If unspecified, the rules will be looked up using the metadata
         * for the object created by ValidationRules....on(class/object)
         */
        StandardValidator.prototype.validateObject = function (object, rules) {
            return this.validate(object, null, rules || null);
        };
        StandardValidator.inject = [validation_messages_1.ValidationMessageProvider, aurelia_templating_1.ViewResources];
        return StandardValidator;
    }(validator_1.Validator));
    exports.StandardValidator = StandardValidator;
});

define('aurelia-validation/implementation/validation-messages',["require", "exports", './validation-parser'], function (require, exports, validation_parser_1) {
    "use strict";
    /**
     * Dictionary of validation messages. [messageKey]: messageExpression
     */
    exports.validationMessages = {
        /**
         * The default validation message. Used with rules that have no standard message.
         */
        default: "${$displayName} is invalid.",
        required: "${$displayName} is required.",
        matches: "${$displayName} is not correctly formatted.",
        email: "${$displayName} is not a valid email.",
        minLength: "${$displayName} must be at least ${$config.length} character${$config.length === 1 ? '' : 's'}.",
        maxLength: "${$displayName} cannot be longer than ${$config.length} character${$config.length === 1 ? '' : 's'}.",
        minItems: "${$displayName} must contain at least ${$config.count} item${$config.count === 1 ? '' : 's'}.",
        maxItems: "${$displayName} cannot contain more than ${$config.count} item${$config.count === 1 ? '' : 's'}.",
        equals: "${$displayName} must be ${$config.expectedValue}.",
    };
    /**
     * Retrieves validation messages and property display names.
     */
    var ValidationMessageProvider = (function () {
        function ValidationMessageProvider(parser) {
            this.parser = parser;
        }
        /**
         * Returns a message binding expression that corresponds to the key.
         * @param key The message key.
         */
        ValidationMessageProvider.prototype.getMessage = function (key) {
            var message;
            if (key in exports.validationMessages) {
                message = exports.validationMessages[key];
            }
            else {
                message = exports.validationMessages['default'];
            }
            return this.parser.parseMessage(message);
        };
        /**
         * When a display name is not provided, this method is used to formulate
         * a display name using the property name.
         * Override this with your own custom logic.
         * @param propertyName The property name.
         */
        ValidationMessageProvider.prototype.getDisplayName = function (propertyName) {
            // split on upper-case letters.
            var words = propertyName.split(/(?=[A-Z])/).join(' ');
            // capitalize first letter.
            return words.charAt(0).toUpperCase() + words.slice(1);
        };
        ValidationMessageProvider.inject = [validation_parser_1.ValidationParser];
        return ValidationMessageProvider;
    }());
    exports.ValidationMessageProvider = ValidationMessageProvider;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('aurelia-validation/implementation/validation-parser',["require", "exports", 'aurelia-binding', 'aurelia-templating', './util', 'aurelia-logging'], function (require, exports, aurelia_binding_1, aurelia_templating_1, util_1, LogManager) {
    "use strict";
    var ValidationParser = (function () {
        function ValidationParser(parser, bindinqLanguage) {
            this.parser = parser;
            this.bindinqLanguage = bindinqLanguage;
            this.emptyStringExpression = new aurelia_binding_1.LiteralString('');
            this.nullExpression = new aurelia_binding_1.LiteralPrimitive(null);
            this.undefinedExpression = new aurelia_binding_1.LiteralPrimitive(undefined);
            this.cache = {};
        }
        ValidationParser.prototype.coalesce = function (part) {
            // part === null || part === undefined ? '' : part
            return new aurelia_binding_1.Conditional(new aurelia_binding_1.Binary('||', new aurelia_binding_1.Binary('===', part, this.nullExpression), new aurelia_binding_1.Binary('===', part, this.undefinedExpression)), this.emptyStringExpression, new aurelia_binding_1.CallMember(part, 'toString', []));
        };
        ValidationParser.prototype.parseMessage = function (message) {
            if (this.cache[message] !== undefined) {
                return this.cache[message];
            }
            var parts = this.bindinqLanguage.parseInterpolation(null, message);
            if (parts === null) {
                return new aurelia_binding_1.LiteralString(message);
            }
            var expression = new aurelia_binding_1.LiteralString(parts[0]);
            for (var i = 1; i < parts.length; i += 2) {
                expression = new aurelia_binding_1.Binary('+', expression, new aurelia_binding_1.Binary('+', this.coalesce(parts[i]), new aurelia_binding_1.LiteralString(parts[i + 1])));
            }
            MessageExpressionValidator.validate(expression, message);
            this.cache[message] = expression;
            return expression;
        };
        ValidationParser.prototype.getAccessorExpression = function (fn) {
            var classic = /^function\s*\([$_\w\d]+\)\s*\{\s*(?:"use strict";)?\s*return\s+[$_\w\d]+\.([$_\w\d]+)\s*;?\s*\}$/;
            var arrow = /^[$_\w\d]+\s*=>\s*[$_\w\d]+\.([$_\w\d]+)$/;
            var match = classic.exec(fn) || arrow.exec(fn);
            if (match === null) {
                throw new Error("Unable to parse accessor function:\n" + fn);
            }
            return this.parser.parse(match[1]);
        };
        ValidationParser.prototype.parseProperty = function (property) {
            if (util_1.isString(property)) {
                return { name: property, displayName: null };
            }
            var accessor = this.getAccessorExpression(property.toString());
            if (accessor instanceof aurelia_binding_1.AccessScope
                || accessor instanceof aurelia_binding_1.AccessMember && accessor.object instanceof aurelia_binding_1.AccessScope) {
                return {
                    name: accessor.name,
                    displayName: null
                };
            }
            throw new Error("Invalid subject: \"" + accessor + "\"");
        };
        ValidationParser.inject = [aurelia_binding_1.Parser, aurelia_templating_1.BindingLanguage];
        return ValidationParser;
    }());
    exports.ValidationParser = ValidationParser;
    var MessageExpressionValidator = (function (_super) {
        __extends(MessageExpressionValidator, _super);
        function MessageExpressionValidator(originalMessage) {
            _super.call(this, []);
            this.originalMessage = originalMessage;
        }
        MessageExpressionValidator.validate = function (expression, originalMessage) {
            var visitor = new MessageExpressionValidator(originalMessage);
            expression.accept(visitor);
        };
        MessageExpressionValidator.prototype.visitAccessScope = function (access) {
            if (access.ancestor !== 0) {
                throw new Error('$parent is not permitted in validation message expressions.');
            }
            if (['displayName', 'propertyName', 'value', 'object', 'config', 'getDisplayName'].indexOf(access.name) !== -1) {
                LogManager.getLogger('aurelia-validation')
                    .warn("Did you mean to use \"$" + access.name + "\" instead of \"" + access.name + "\" in this validation message template: \"" + this.originalMessage + "\"?");
            }
        };
        return MessageExpressionValidator;
    }(aurelia_binding_1.Unparser));
    exports.MessageExpressionValidator = MessageExpressionValidator;
});

define('aurelia-validation/implementation/util',["require", "exports"], function (require, exports) {
    "use strict";
    function isString(value) {
        return Object.prototype.toString.call(value) === '[object String]';
    }
    exports.isString = isString;
});

define('aurelia-validation/implementation/validation-rules',["require", "exports", './util', './rules', './validation-messages'], function (require, exports, util_1, rules_1, validation_messages_1) {
    "use strict";
    /**
     * Part of the fluent rule API. Enables customizing property rules.
     */
    var FluentRuleCustomizer = (function () {
        function FluentRuleCustomizer(property, condition, config, fluentEnsure, fluentRules, parser) {
            if (config === void 0) { config = {}; }
            this.fluentEnsure = fluentEnsure;
            this.fluentRules = fluentRules;
            this.parser = parser;
            this.rule = {
                property: property,
                condition: condition,
                config: config,
                when: null,
                messageKey: 'default',
                message: null,
                sequence: fluentEnsure._sequence
            };
            this.fluentEnsure._addRule(this.rule);
        }
        /**
         * Validate subsequent rules after previously declared rules have
         * been validated successfully. Use to postpone validation of costly
         * rules until less expensive rules pass validation.
         */
        FluentRuleCustomizer.prototype.then = function () {
            this.fluentEnsure._sequence++;
            return this;
        };
        /**
         * Specifies the key to use when looking up the rule's validation message.
         */
        FluentRuleCustomizer.prototype.withMessageKey = function (key) {
            this.rule.messageKey = key;
            this.rule.message = null;
            return this;
        };
        /**
         * Specifies rule's validation message.
         */
        FluentRuleCustomizer.prototype.withMessage = function (message) {
            this.rule.messageKey = 'custom';
            this.rule.message = this.parser.parseMessage(message);
            return this;
        };
        /**
         * Specifies a condition that must be met before attempting to validate the rule.
         * @param condition A function that accepts the object as a parameter and returns true
         * or false whether the rule should be evaluated.
         */
        FluentRuleCustomizer.prototype.when = function (condition) {
            this.rule.when = condition;
            return this;
        };
        /**
         * Tags the rule instance, enabling the rule to be found easily
         * using ValidationRules.taggedRules(rules, tag)
         */
        FluentRuleCustomizer.prototype.tag = function (tag) {
            this.rule.tag = tag;
            return this;
        };
        ///// FluentEnsure APIs /////
        /**
         * Target a property with validation rules.
         * @param property The property to target. Can be the property name or a property accessor function.
         */
        FluentRuleCustomizer.prototype.ensure = function (subject) {
            return this.fluentEnsure.ensure(subject);
        };
        /**
         * Targets an object with validation rules.
         */
        FluentRuleCustomizer.prototype.ensureObject = function () {
            return this.fluentEnsure.ensureObject();
        };
        Object.defineProperty(FluentRuleCustomizer.prototype, "rules", {
            /**
             * Rules that have been defined using the fluent API.
             */
            get: function () {
                return this.fluentEnsure.rules;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Applies the rules to a class or object, making them discoverable by the StandardValidator.
         * @param target A class or object.
         */
        FluentRuleCustomizer.prototype.on = function (target) {
            return this.fluentEnsure.on(target);
        };
        ///////// FluentRules APIs /////////
        /**
         * Applies an ad-hoc rule function to the ensured property or object.
         * @param condition The function to validate the rule.
         * Will be called with two arguments, the property value and the object.
         * Should return a boolean or a Promise that resolves to a boolean.
         */
        FluentRuleCustomizer.prototype.satisfies = function (condition, config) {
            return this.fluentRules.satisfies(condition, config);
        };
        /**
         * Applies a rule by name.
         * @param name The name of the custom or standard rule.
         * @param args The rule's arguments.
         */
        FluentRuleCustomizer.prototype.satisfiesRule = function (name) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return (_a = this.fluentRules).satisfiesRule.apply(_a, [name].concat(args));
            var _a;
        };
        /**
         * Applies the "required" rule to the property.
         * The value cannot be null, undefined or whitespace.
         */
        FluentRuleCustomizer.prototype.required = function () {
            return this.fluentRules.required();
        };
        /**
         * Applies the "matches" rule to the property.
         * Value must match the specified regular expression.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRuleCustomizer.prototype.matches = function (regex) {
            return this.fluentRules.matches(regex);
        };
        /**
         * Applies the "email" rule to the property.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRuleCustomizer.prototype.email = function () {
            return this.fluentRules.email();
        };
        /**
         * Applies the "minLength" STRING validation rule to the property.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRuleCustomizer.prototype.minLength = function (length) {
            return this.fluentRules.minLength(length);
        };
        /**
         * Applies the "maxLength" STRING validation rule to the property.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRuleCustomizer.prototype.maxLength = function (length) {
            return this.fluentRules.maxLength(length);
        };
        /**
         * Applies the "minItems" ARRAY validation rule to the property.
         * null and undefined values are considered valid.
         */
        FluentRuleCustomizer.prototype.minItems = function (count) {
            return this.fluentRules.minItems(count);
        };
        /**
         * Applies the "maxItems" ARRAY validation rule to the property.
         * null and undefined values are considered valid.
         */
        FluentRuleCustomizer.prototype.maxItems = function (count) {
            return this.fluentRules.maxItems(count);
        };
        /**
         * Applies the "equals" validation rule to the property.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRuleCustomizer.prototype.equals = function (expectedValue) {
            return this.fluentRules.equals(expectedValue);
        };
        return FluentRuleCustomizer;
    }());
    exports.FluentRuleCustomizer = FluentRuleCustomizer;
    /**
     * Part of the fluent rule API. Enables applying rules to properties and objects.
     */
    var FluentRules = (function () {
        function FluentRules(fluentEnsure, parser, property) {
            this.fluentEnsure = fluentEnsure;
            this.parser = parser;
            this.property = property;
        }
        /**
         * Sets the display name of the ensured property.
         */
        FluentRules.prototype.displayName = function (name) {
            this.property.displayName = name;
            return this;
        };
        /**
         * Applies an ad-hoc rule function to the ensured property or object.
         * @param condition The function to validate the rule.
         * Will be called with two arguments, the property value and the object.
         * Should return a boolean or a Promise that resolves to a boolean.
         */
        FluentRules.prototype.satisfies = function (condition, config) {
            return new FluentRuleCustomizer(this.property, condition, config, this.fluentEnsure, this, this.parser);
        };
        /**
         * Applies a rule by name.
         * @param name The name of the custom or standard rule.
         * @param args The rule's arguments.
         */
        FluentRules.prototype.satisfiesRule = function (name) {
            var _this = this;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var rule = FluentRules.customRules[name];
            if (!rule) {
                // standard rule?
                rule = this[name];
                if (rule instanceof Function) {
                    return rule.call.apply(rule, [this].concat(args));
                }
                throw new Error("Rule with name \"" + name + "\" does not exist.");
            }
            var config = rule.argsToConfig ? rule.argsToConfig.apply(rule, args) : undefined;
            return this.satisfies(function (value, obj) { return (_a = rule.condition).call.apply(_a, [_this, value, obj].concat(args)); var _a; }, config)
                .withMessageKey(name);
        };
        /**
         * Applies the "required" rule to the property.
         * The value cannot be null, undefined or whitespace.
         */
        FluentRules.prototype.required = function () {
            return this.satisfies(function (value) {
                return value !== null
                    && value !== undefined
                    && !(util_1.isString(value) && !/\S/.test(value));
            }).withMessageKey('required');
        };
        /**
         * Applies the "matches" rule to the property.
         * Value must match the specified regular expression.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRules.prototype.matches = function (regex) {
            return this.satisfies(function (value) { return value === null || value === undefined || value.length === 0 || regex.test(value); })
                .withMessageKey('matches');
        };
        /**
         * Applies the "email" rule to the property.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRules.prototype.email = function () {
            return this.matches(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i)
                .withMessageKey('email');
        };
        /**
         * Applies the "minLength" STRING validation rule to the property.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRules.prototype.minLength = function (length) {
            return this.satisfies(function (value) { return value === null || value === undefined || value.length === 0 || value.length >= length; }, { length: length })
                .withMessageKey('minLength');
        };
        /**
         * Applies the "maxLength" STRING validation rule to the property.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRules.prototype.maxLength = function (length) {
            return this.satisfies(function (value) { return value === null || value === undefined || value.length === 0 || value.length <= length; }, { length: length })
                .withMessageKey('maxLength');
        };
        /**
         * Applies the "minItems" ARRAY validation rule to the property.
         * null and undefined values are considered valid.
         */
        FluentRules.prototype.minItems = function (count) {
            return this.satisfies(function (value) { return value === null || value === undefined || value.length >= count; }, { count: count })
                .withMessageKey('minItems');
        };
        /**
         * Applies the "maxItems" ARRAY validation rule to the property.
         * null and undefined values are considered valid.
         */
        FluentRules.prototype.maxItems = function (count) {
            return this.satisfies(function (value) { return value === null || value === undefined || value.length <= count; }, { count: count })
                .withMessageKey('maxItems');
        };
        /**
         * Applies the "equals" validation rule to the property.
         * null and undefined values are considered valid.
         */
        FluentRules.prototype.equals = function (expectedValue) {
            return this.satisfies(function (value) { return value === null || value === undefined || value === '' || value === expectedValue; }, { expectedValue: expectedValue })
                .withMessageKey('equals');
        };
        FluentRules.customRules = {};
        return FluentRules;
    }());
    exports.FluentRules = FluentRules;
    /**
     * Part of the fluent rule API. Enables targeting properties and objects with rules.
     */
    var FluentEnsure = (function () {
        function FluentEnsure(parser) {
            this.parser = parser;
            /**
             * Rules that have been defined using the fluent API.
             */
            this.rules = [];
            this._sequence = 0;
        }
        /**
         * Target a property with validation rules.
         * @param property The property to target. Can be the property name or a property accessor function.
         */
        FluentEnsure.prototype.ensure = function (property) {
            this.assertInitialized();
            return new FluentRules(this, this.parser, this.parser.parseProperty(property));
        };
        /**
         * Targets an object with validation rules.
         */
        FluentEnsure.prototype.ensureObject = function () {
            this.assertInitialized();
            return new FluentRules(this, this.parser, { name: null, displayName: null });
        };
        /**
         * Applies the rules to a class or object, making them discoverable by the StandardValidator.
         * @param target A class or object.
         */
        FluentEnsure.prototype.on = function (target) {
            rules_1.Rules.set(target, this.rules);
            return this;
        };
        /**
         * Adds a rule definition to the sequenced ruleset.
         */
        FluentEnsure.prototype._addRule = function (rule) {
            while (this.rules.length < rule.sequence + 1) {
                this.rules.push([]);
            }
            this.rules[rule.sequence].push(rule);
        };
        FluentEnsure.prototype.assertInitialized = function () {
            if (this.parser) {
                return;
            }
            throw new Error("Did you forget to add \".plugin('aurelia-validation)\" to your main.js?");
        };
        return FluentEnsure;
    }());
    exports.FluentEnsure = FluentEnsure;
    /**
     * Fluent rule definition API.
     */
    var ValidationRules = (function () {
        function ValidationRules() {
        }
        ValidationRules.initialize = function (parser) {
            ValidationRules.parser = parser;
        };
        /**
         * Target a property with validation rules.
         * @param property The property to target. Can be the property name or a property accessor function.
         */
        ValidationRules.ensure = function (property) {
            return new FluentEnsure(ValidationRules.parser).ensure(property);
        };
        /**
         * Targets an object with validation rules.
         */
        ValidationRules.ensureObject = function () {
            return new FluentEnsure(ValidationRules.parser).ensureObject();
        };
        /**
         * Defines a custom rule.
         * @param name The name of the custom rule. Also serves as the message key.
         * @param condition The rule function.
         * @param message The message expression
         * @param argsToConfig A function that maps the rule's arguments to a "config" object that can be used when evaluating the message expression.
         */
        ValidationRules.customRule = function (name, condition, message, argsToConfig) {
            validation_messages_1.validationMessages[name] = message;
            FluentRules.customRules[name] = { condition: condition, argsToConfig: argsToConfig };
        };
        /**
         * Returns rules with the matching tag.
         * @param rules The rules to search.
         * @param tag The tag to search for.
         */
        ValidationRules.taggedRules = function (rules, tag) {
            return rules.map(function (x) { return x.filter(function (r) { return r.tag === tag; }); });
        };
        /**
         * Removes the rules from a class or object.
         * @param target A class or object.
         */
        ValidationRules.off = function (target) {
            rules_1.Rules.unset(target);
        };
        return ValidationRules;
    }());
    exports.ValidationRules = ValidationRules;
});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\n\n  <require from=\"./app.css\"></require>\n\n\n  <!-- Page Content goes here -->\n\n \n  <header>\n    <nav>\n      <div class=\"container nav-wrapper\">\n        <a href=\"#\" class=\"brand-logo right\">I Know Sports Too</a>      \n        <ul id=\"nav-mobile\" class=\"left hide-on-med-and-down\">\n          <li><a repeat.for=\"route of router.navigation\" href.bind=\"route.href\">${route.title}</a></li>\n        </ul>\n      </div>\n    </nav>\n  </header>\n\n  <div class=\"container\" id=\"MainContainer\">\n\n    <router-view></router-view>\n\n  </div>\n\n  <require from=\"materialize-css/css/materialize.css\"></require>\n\n \n</template>\n"; });
define('text!style/all.css', ['module'], function(module) { module.exports = "/* fade in/out transition */\n.fade {\n  transition: opacity ease-in-out .1s; }\n  .fade-out {\n    opacity: .5; }\n  .fade-in {\n    opacity: 1; }\n\n/* all purpose */\n.is-toggle {\n  cursor: pointer; }\n"; });
define('text!game/commandstable.html', ['module'], function(module) { module.exports = "<template>\r\n\r\n    <table id=\"CommandsTable\"> \r\n      <thead>\r\n        <tr>\r\n         <th>Command</th>\r\n         <th>Keyboard &#128430;</th>\r\n         <th>Mouse \t&#128432;</th>\r\n         <th>Mobile &#x1f446</th>\r\n        </tr>\r\n      </thead>\r\n      <tbody>\r\n\r\n        <tr>\r\n          <td>Flag Question</td>\r\n          <td>f</td>\r\n          <td>Click Flag</td>\r\n          <td>Tap Flag</td>\r\n        </tr>\r\n\r\n        <tr>\r\n          <td>Show Answer</td>\r\n          <td>space / enter</td>\r\n          <td>Click Card</td>\r\n          <td>Swipe Down</td>\r\n        </tr>\r\n\r\n        <tr>\r\n          <td>Hide Answer</td>\r\n          <td>space / enter</td>\r\n          <td>Click Card</td>\r\n          <td>Swipe Down</td>\r\n        </tr>\r\n\r\n        <tr>\r\n          <td>Show Commands</td>\r\n          <td>h</td>\r\n          <td>Click Button</td>          \r\n          <td>Tap Button</td>\r\n        </tr>\r\n\r\n        <tr>\r\n          <td>Hide Commands</td>\r\n          <td>h</td>\r\n          <td>Click Anywhere</td>          \r\n          <td>Tap Anywhere</td>\r\n        </tr>\r\n\r\n        <tr class=\"divider\"><td></td><td></td><td></td><td></td></tr>\r\n\r\n        <tr>\r\n          <td>Mark Correct</td>\r\n          <td>y</td>\r\n          <td>Click Button</td>         \r\n          <td>Answer Visible + Swipe Right</td>\r\n        </tr>\r\n        <tr>\r\n          <td>Mark Incorrect</td>\r\n          <td>n</td>\r\n          <td>Click Button</td>         \r\n          <td>Answer Visible + Swipe Left</td>\r\n        </tr>\r\n\r\n        <tr>\r\n          <td>Skip Judgement</td>\r\n          <td>s</td>\r\n          <td>Click Button</td>         \r\n          <td>Answer Visible + Swipe Down</td>\r\n        </tr>\r\n\r\n        <tr class=\"divider\"><td></td><td></td><td></td><td></td></tr>\r\n\r\n        <tr>\r\n          <td>Previous</td>\r\n          <td>Left Arrow</td>\r\n          <td>Click Button</td>         \r\n          <td>Answer Not Visible + Swipe Left</td>\r\n        </tr>\r\n\r\n        <tr>\r\n          <td>Next</td>\r\n          <td>Right Arrow</td>\r\n          <td>Click Button</td>         \r\n          <td>Answer Not Visible + Swipe Right</td>\r\n        </tr>\r\n\r\n      </tbody>\r\n    </table>\r\n\r\n    <span style=\"margin:30px; opacity:.2;\" class=\"tap-action\">Tap to Hide Commands <code>(h)</code> </span>   \r\n\r\n\r\n</template>"; });
define('text!app.css', ['module'], function(module) { module.exports = "/* fade in/out transition */\n.fade {\n  transition: opacity ease-in-out .1s; }\n  .fade-out {\n    opacity: .5; }\n  .fade-in {\n    opacity: 1; }\n\n/* all purpose */\n.is-toggle {\n  cursor: pointer; }\n\n/* table widths */\n/* materialize add-on styles */\n.card.tiny {\n  position: relative;\n  height: 185px; }\n\n.card.tiny .card-content {\n  max-height: 100%;\n  overflow: hidden; }\n\n.card.tiny .card-action {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0; }\n\n@media screen and (max-width: 600px) {\n  .card.tiny {\n    box-shadow: none;\n    border-top: 1px solid grey;\n    border-left: none;\n    border-right: none;\n    border-radius: 0;\n    margin: 0; }\n  .card.tiny .card-action {\n    padding: 10px 20px; } }\n\n/*\r\nClass : .sm-full\r\nCreated to : negate the padding and margin of the container and column on small screens\r\nSets direct row decendants of a container to full width\r\n*/\n@media screen and (max-width: 600px) {\n  .container .row.sm-full {\n    margin-left: 0;\n    margin-right: 0;\n    margin: 0 -5%; }\n  .container .row.sm-full > .col.s12 {\n    padding-left: 0;\n    padding-right: 0; } }\n"; });
define('text!game/play.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./play.css\"></require>\n  <require from=\"./commandstable.html\"></require>\n\n  <div class=\"row\">\n\n  <button md-button click.trigger=\"goToIndex()\" >Back</button>    \n  <button md-button click.trigger=\"saveGame()\">Save Game</button>    \n  <button md-button click.delegate=\"goToReview()\">Review All<code>(r)</code></button>\n\n\n  <h1>${ deck.name }</h1>\n\n  <!-- Controls -->\n\n  <div class=\"col s12 m12 l8\">\n\n  <!-- Play Game -->\n  <div id=\"game-container\">\n\n  <!--Card -->\n  <div id=\"cardEl\" if.bind=\"card\"\n    hammer-swipe.call=\"handleSwipe($event)\"\n    hammer-tap.call=\"handleTap($event)\"\n    class=\"card s-fade ${ isInTransition ? 's-fade-out' : 's-fade-in'} ${ card.isFlagged ? 'flag' : '' }\">\n    \n\n     ${ card.question }\n\n      \n    <span show.bind=\"!card.isAnswerVisible\">\n      <br />\n      <br />\n      <br />\n      <p>\n        <span class=\"tap-action\" >Tap to Reveal <code>(s)</code></span>\n      </p>\n    </span>\n    \n    <div show.bind=\"card.isAnswerVisible\" id=\"answer\">\n    \n      <br />\n      ${ card.answer }\n\n      <br />\n      <br>\n\n      <div id=\"card-actions\">\n        <button id=\"Right\" focus.one-way=\"card.isAnswerVisible\" class=\"${card.response == 1 ? 'active' : ''} waves-effect waves-teal btn-flat\" \n          click.delegate=\"right()\" title=\"I got this right (y)\">\n          ✔<help>Right<code>(y)</code></help></button>\n        <button id=\"Wrong\" class=\"${card.response == 2 ? 'active' : ''} waves-effect waves-teal btn-flat\" \n          click.delegate=\"wrong()\" title=\"I got this wrong (n)\">\n          ❌<help>Wrong<code>(n)</code></help></button>\n        <button id=\"Pass\"  class=\"${card.response == 3 ? 'active' : ''} waves-effect waves-teal btn-flat\"\n          click.delegate=\"pass()\"  title=\"Skip Judgement (p)\">\n          〰️<help>Hmm<code>(p)</code></help></button>\n      </div>\n  \n      </div>\n\n      <div id=\"number\">\n         <strong> ${ card.number } </strong> / ${ deck.cards.length }\n      </div>\n \n      <!-- flag -->\n      <button  hammer-tap.call=\"flag($event)\" id=\"flag\" title=\"Flag Question (f)\" class=\"${card.isFlagged ? 'active' : ''} waves-effect waves-teal btn-flat\"> \n        <span show.bind=\"card.isFlagged\">\n          <help>Unflag<code>(f)</code></help>\n          &#x2691;\n        </span>\n        <span show.bind=\"!card.isFlagged\">\n          <help>Flag<code>(f)</code></help>\n          &#x2690;\n      </span>    \n      </button>\n\n\n  <!-- end card-->\n  </div>\n\n\n   <div id=\"scoreboard\" >\n      \n     \n    <!-- end score board -->\n  </div>\n\n  <!-- end card container -->\n  </div>\n\n  <!-- end game container-->\n  </div>\n\n\n  <div class=\"col s12 m12 l4\">\n\n    <!-- More Button Options -->\n    <div id=\"MoreButtons\">\n\n      <!-- Deck Controls -->      \n      <span id=\"prev-next\">\n        <button id=\"prev\" click.delegate=\"previous()\" class=\"waves-effect waves-teal btn-flat\" >\n            Prev <code>(&larr;)</code>\n        </button>        \n        <button id=\"next\" click.delegate=\"next()\" class=\"waves-effect waves-teal btn-flat\">\n            Next <code>(&rarr;)</code>\n        </button>\n      </span>\n\n\n    <button click.trigger=\"showCommands=!showCommands\"\n    class=\"waves-effect waves-teal btn-flat\">Show Commands <code>(h)</code></button>\n\n    <button class=\"waves-effect waves-teal btn-flat\" click.trigger=\"clearAnswers()\">Clear Answers</button>    \n\n    <button class=\"waves-effect waves-teal btn-flat\" click.trigger=\"clearAnswersHistory()\">Reset Deck</button>    \n\n\n    </div>\n\n  </div>\n\n\n  <!-- end row -->\n  </div>\n\n\n  <!-- commands table -->\n  <div id=\"commands-table\" show.bind=\"showCommands\" click.trigger=\"showCommands=!showCommands\">\n\n     <commandstable></commandstable>\n  </div>\n\n  <!-- end sleeve -->\n  </div>\n\n</template>\n"; });
define('text!game/review.html', ['module'], function(module) { module.exports = "<template>\r\n\r\n <require from=\"./review.css\"></require>\r\n\r\n <div class=\"col s12\">\r\n\r\n <button md-button click.delegate=\"goToGame()\"><code>(&#9003;)</code> Back to Game </button>\r\n\r\n <h1>Review</h1>\r\n \r\n <ul md-collapsible=\"accordion: false;\">\r\n    <li>\r\n      <div class=\"collapsible-header active\">Questions</div>\r\n      <div class=\"collapsible-body\">\r\n\r\n        <table id=\"review-table\"> \r\n          <thead>\r\n            <th>Question</th>   \r\n            <th>Mark</th>\r\n            <th>✔ /❌ / 〰️ </th>   \r\n            <th>#</th>\r\n            <th>⚑</th>\r\n          </thead>\r\n        \r\n          <tbody>\r\n            <tr repeat.for=\"card of deck.cards\">\r\n              <td><div class=\"question\">${card.question}</div><div class=\"answer\">${card.answer}</div></td>\r\n              <td>\r\n                <span if.bind=\"card.response == 1\">✔</span>\r\n                <span if.bind=\"card.response == 2\">❌</span>\r\n                <span if.bind=\"card.response == 3\">〰️</span>                \r\n              </td>              \r\n              <td>${card.rightCount} / ${card.wrongCount} / ${card.skipCount}</td>\r\n              <td>${card.number} </td>\r\n              <td> <span show.bind=\"card.isFlagged\" style=\"color:hotpink\"> &#x2691;</span></td>\r\n            </tr>\r\n          </tbody>\r\n       </table>\r\n        \r\n    </div>\r\n    </li>\r\n    <li>\r\n      <div class=\"collapsible-header\">Score Totals</div>\r\n      <div class=\"collapsible-body\">\r\n\r\n           <p>    \r\n              <strong title=\"% answered correct at least once\">${ ((correctAtLeastOnceCount * 100.0 / questionCount) + 0.0 ) | decimalNumber:'0'}% correct </strong> \r\n\r\n              <br>\r\n           </p>\r\n\r\n      \r\n            <ul class=\"cb-pads\">      \r\n            <li>${questionCount} Questions\r\n            <li>${correctAtLeastOnceCount} answered right\r\n            <li>${neverCorrectCount} wrong\r\n            <li>${noJudgementCount} skipped\r\n            </ul>    \r\n          \r\n         \r\n      </div>  \r\n   </li> \r\n </ul>\r\n  \r\n</div>\r\n\r\n</template>"; });
define('text!game/play.css', ['module'], function(module) { module.exports = "body {\n  font-family: Arial, Helvetica, sans-serif; }\n\n#game-container {\n  text-align: left;\n  max-width: 550px;\n  position: relative; }\n\n#cardEl {\n  margin-right: 0;\n  padding: 1em;\n  font-size: 16px;\n  border-radius: 2px;\n  text-align: left;\n  overflow: hidden;\n  padding-bottom: 1.5em; }\n\n#flag {\n  position: absolute;\n  top: 0;\n  right: 0;\n  background: none;\n  z-index: 1;\n  margin: 0;\n  padding: .2em; }\n\n#flag.active {\n  /*color:orangered;*/\n  color: hotpink; }\n\n/*#flag.active code{\n     color:orangered;      \n }*/\n#flag span {\n  line-height: 22px;\n  font-size: 22px; }\n\n#flag code {\n  line-height: 25px;\n  vertical-align: top; }\n\n#number {\n  padding: 0px 5px;\n  margin-top: -5px;\n  position: absolute;\n  right: 0;\n  opacity: .5; }\n\n#card-actions button.active {\n  border: 1px solid hotpink; }\n\n.tap-action {\n  font-size: 20px;\n  font-weight: bold;\n  opacity: .1; }\n\nhelp {\n  margin-left: 2px;\n  font-size: 14px; }\n\nbutton code {\n  color: darkcyan;\n  font-size: 14px; }\n\n#MoreButtons {\n  width: 100%;\n  padding: .3em;\n  display: inline-flex;\n  flex-direction: column;\n  align-items: baseline; }\n\n/* small screen logic */\n@media screen and (max-width: 600px) {\n  #game-container {\n    text-align: center; }\n  #scoreboard {\n    flex-direction: column;\n    align-items: center;\n    margin: 0 auto; }\n  #scoreboard > * {\n    width: 100%;\n    margin: .2em .3em; }\n  #prev-next {\n    display: inline-flex; }\n  #MoreButtons {\n    align-items: stretch; }\n  #prev-next button {\n    margin: .2em;\n    flex: 1; }\n  #prev-next button:first-of-type {\n    margin-left: 0; }\n  #prev-next button:last-of-type {\n    margin-right: 0; }\n  #card-actions button {\n    padding: 0 .8em; } }\n\n#commands-table table {\n  font-size: 12px;\n  margin: 1em;\n  width: calc(100% - 2em);\n  max-width: 800px; }\n\n#commands-table td:nth-of-type(1) {\n  font-weight: bold; }\n\n#commands-table td:nth-of-type(2) {\n  font-family: monospace; }\n\n#commands-table {\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  opacity: .95;\n  background-color: white;\n  position: absolute;\n  z-index: 2; }\n\n@media screen and (max-width: 600px) {\n  #commands-table th:nth-of-type(2),\n  #commands-table th:nth-of-type(3),\n  #commands-table td:nth-of-type(2),\n  #commands-table td:nth-of-type(3) {\n    display: none; } }\n"; });
define('text!deck/edit.html', ['module'], function(module) { module.exports = "<template>\n\n  <require from=\"./deck.css\"></require>\n\n  \n  <div class=\"col s12\">\n\n    <button md-button click.trigger=\"router.navigateToRoute('decks')\">Back</button>    \n    <button md-button click.trigger=\"saveDeck()\">Save Changes</button>\n    <button md-button click.trigger=\"router.navigateToRoute('import')\">Import Questions</button>\n\n    <div class=\"row\">\n      <div class=\"input-field col s12\">\n        <input  id=\"deck_name\" type=\"text\" value.bind=\"deck.name\"\n            class=\"validate\">\n        <label for=\"deck_name\" class=\"active\">Deck Name</label>\n      </div>\n      <div class=\"input-field col s12\">\n        <input id=\"deck_description\" type=\"text\" value.bind=\"deck.description\"\n            class=\"validate active\">\n        <label for=\"deck_description\" class=\"active\">Deck Description</label>\n      </div>\n    </div>\n\n    <p>${deck.cards.length} Cards</p> \n\n\n  <ul md-collapsible=\"accordion: true;\" class=\"card-panel \" >\n    <li>\n      <div class=\"collapsible-header\">Add Card</div>\n      <div class=\"collapsible-body\">\n        \n          <div class=\"form-group\" >\n            <label for=\"new_question\">Question</label>\n            <textarea id=\"new_question\" class=\"materialize-textarea\"\n              value.bind=\"new_question & validate\"></textarea>\n          </div>\n\n          <div class=\"form-group\">\n            <label class=\"form-group\" for=\"new_answer\">Answer</label> \n            <textarea id=\"new_answer\" class=\"materialize-textarea\"\n                value.bind=\"new_answer & validate\"></textarea>\n          </div>\n  \n          <button md-button click.trigger=\"saveNewCard()\">Save Card</button>\n\n      </div>\n    </li>\n  </ul>\n  \n\n    <table class=\"bordered small-responsive-no-head align-top\">\n      \n      <thead>\n        <tr> <th>#</th> <th>Question</th> <th>Answer</th> <th></th </tr>        \n      </thead>\n     \n      <tbody>\n        <tr repeat.for=\"card of deck.cards\" > \n          <td >Card ${card.number}</td>\n          <td >\n              <textarea value.bind=\"card.question\" class=\"materialize-textarea txa-no-padding\"></textarea>\n          </td>\n          <td >\n               <textarea value.bind=\"card.answer\" class=\"materialize-textarea txa-no-padding\"></textarea>\n          </td>\n          <td >\n            <a href=\"#\" click.trigger=\"remove(card)\">Delete</a>\n          </td>\n        </tr>        \n      </tbody>\n\n    </table>\n\n   </div>\n\n</template>\n"; });
define('text!game/review.css', ['module'], function(module) { module.exports = "#review-table {\n  font-size: 14px;\n  margin: 1em;\n  width: calc(100% - 2em);\n  max-width: 800px; }\n\n#review-table th, #review-table td {\n  margin: .2em;\n  padding-top: 1em;\n  padding-right: .2em;\n  padding-bottom: 1em;\n  border-bottom: 1px solid gainsboro; }\n\n#review-table .answer {\n  margin-top: .5em;\n  padding-left: 3em; }\n\n.cb-pads {\n  padding: 1rem 2rem; }\n\n@media screen and (max-width: 650px) {\n  th:nth-of-type(3),\n  td:nth-of-type(3) {\n    display: none; } }\n"; });
define('text!deck/deck.css', ['module'], function(module) { module.exports = "/* edit page */\ninput {\n  border: none;\n  border-bottom: 1px solid green; }\n\n.deck-edit {\n  width: 100%;\n  max-width: 700px; }\n\n.deck-edit header input {\n  font-size: 1.2em;\n  max-width: 400px;\n  width: 100%; }\n\n.deck-edit description input {\n  font-size: 1.1em;\n  max-width: 600px;\n  width: 100%; }\n\n/* input should by styled somewhere okay? */\n.add-table textarea {\n  width: 95%; }\n\n.edit-table textarea {\n  width: 95%;\n  border: none; }\n\n.align-top td {\n  vertical-align: top; }\n\ntextarea.txa-no-padding {\n  padding-top: 0;\n  margin-bottom: 0; }\n\n@media screen and (max-width: 600px) {\n  .small-responseive-no-head thead {\n    display: none; }\n  .small-responsive-no-head tr {\n    display: flex;\n    flex-direction: column; }\n  td:last-child {\n    padding-top: 0;\n    text-align: right;\n    margin-bottom: 2em; } }\n"; });
define('text!deck/import.html', ['module'], function(module) { module.exports = "<template>\n\n  <require from=\"./deck.css\"></require>\n\n  \n    <div class=\"row\">\n\n    <button md-button click.trigger=\"router.navigateToRoute('decks')\">Back</button>    \n    <button md-button click.trigger=\"saveDeck()\">Save Changes</button>\n\n    </div>\n\n    <div class=\"card\">    \n    <div class=\"card-content\">\n\n    <span class=\"card-title\">Import Data</span>\n    <div class=\"row\">\n\n    <!-- import fields-->\n    <div class=\"col s12\">\n  \n      <!--<div class=\"row\">-->\n        <div class=\"input-field col s6\">\n         <textarea placeholder=\"Paste Table Data From Excel (optional)\" \n            class=\"materialize-textarea\" value.bind=\"past\" id=\"pasteImport\" rows=\"1\" style=\"max-height:1em; padding:0;\" paste.trigger=\"pasteImport_OnPaste($event)\"></textarea>\n        </div>\n\n        <div class=\"input-field col s6\">\n          <input type=\"checkbox\" id=\"transposePaste\" checked.bind=\"isDataRowBased\" />\n          <label for=\"transposePaste\">Transpose</label>\n        </div>\n\n    </div>\n\n    <div class=\"col s12\">\n      <label for=\"importText\">Text</label>\n      <textarea value.bind=\"importText\" id=\"importText\" rows=\"6\" style=\"height:auto\"\n                input.trigger=\"importText_Change()\"></textarea>\n    </div>\n\n    <div class=\"col s4 m4 \">\n    <label for=\"format\">Format</label>\n    <select md-select value.bind=\"importFormat\" id=\"format\" change.call=\"tryShowSampleData()\">\n        <option value=\"csv\">CSV</option>       \n        <option value=\"json\">JSON </option>         \n    </select>\n    </div>\n\n    <div class=\"col s4 m4 \">\n      <label for=\"content\">Content</label>\n      <select md-select value.bind=\"importContent\" id=\"content\" change.call=\"tryShowSampleData()\">\n        <option value=\"qa\">Question & Answer</option>       \n        <option value=\"table\">Table or Object Data</option>       \n      </select>\n    </div>\n\n    <div class=\"col s4 m4 input-field \">\n        <input type=\"checkbox\" id=\"shouldShowSampleData\" checked.bind=\"shouldShowSampleData\"\n          change.trigger=\"showSampleDataChange($event)\" />\n          <label for=\"shouldShowSampleData\">Show Sample Data</label>\n    </div>\n\n    </div>\n    <!--end row-->\n\n    <div class=\"row\">\n\n\n    <div class=\"input-field col s12\">\n     \n      <button md-button click.trigger=\"parseData()\">Parse Data</button>\n\n    </div>\n\n  \n\n    </div> <!-- end row -->\n</div> <!-- end card body -->\n</div> <!-- end card -->\n\n<div class=\"card\" show.bind=\"importContent == 'table'\">\n\n  <div class=\"card-content\">\n\n      <span class=\"card-title\">Create Templates</span>\n\n      <br />\n        <button md-button click.trigger=\"addTemplate()\">Add Template</button>          \n      <br />\n          \n          <div class=\"row\" repeat.for=\"t of importTemplates\">\n\n            <!-- Labels for import options -->      \n            <div class=\"input-field col s8\">\n              <input id=\"template_q\" type=\"text\" value.bind=\"t.q\">\n              <label for=\"template_q\" class=\"active\">Question Template</label>\n            </div>\n\n            <div class=\"input-field col s2\">\n              <input id=\"template_filter\" type=\"text\" value.bind=\"t.filter\">\n              <label for=\"template_filter\" class=\"active\">Filter</label>\n            </div>\n\n            <div class=\"input-field col s2\">\n              <input id=\"template_group_by\" type=\"text\" value.bind=\"t.group\">\n              <label for=\"template_group_by\" class=\"active\">Group By</label>\n            </div>\n          \n            <div class=\"input-field col s8\">\n              <input id=\"template_a\" type=\"text\" value.bind=\"t.a\">\n              <label for=\"template_a\" class=\"active\">Answer Template</label>\n            </div>\n\n            <div class=\"input-field col s2\">\n              <input id=\"template_multi_row\"  type=\"text\" value.bind=\"t.multi\">\n              <label for=\"template_multi_row\" class=\"active\">Row Depth</label>\n            </div>\n\n            <div class=\"input-field col s2\">\n              <a class=\"btn-flat\" click.trigger=\"removeTemplate(t)\">Remove</a>\n            </div>\n          </div>\n\n      \n\n        </div>\n       \n        <!--<button md-button click.trigger=\"doFootBallData()\">Do Football Data</button>-->\n     \n\n  </div> <!-- end card content -->\n</div> <!-- end card -->\n\n<!-- begin question / answer cards  -->\n<div class=\"card\">\n  <div class=\"card-content\">\n\n\n    <button md-button click.trigger=\"createCards()\" disabled.bind=\"!enableCreateCards\">Create Cards</button>\n    <button md-button click.trigger=\"saveCards()\" disabled.bind=\"cards.length == 0\">Save Cards</button>\n    <button md-button click.trigger=\"clearCards()\" disabled.bind=\"cards.length == 0\">Clear Cards</button>\n  <table class=\"striped\">\n    <thead>\n      <tr>\n        <th>Question</th>\n        <th>Answer</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr repeat.for=\"card of cards\">\n        <td>${card.question}</td>\n        <td>${card.answer}</td>\n      </tr>\n    </tbody>\n  </table>\n\n  <br />\n\n  </div> <!-- end card content -->\n</div> <!-- end card -->\n<!-- end question answer cards  -->\n\n\n</template>\n"; });
define('text!deck/index.html', ['module'], function(module) { module.exports = "<template>\n\n<require from=\"./deck.css\"></require>\n\n\n\n  <div class=\"row\">\n    <form class=\"col s10 offset-s1 m12\">\n        \n        <div class=\"row\">\n\n        <div class=\"input-field col s12 m6\">          \n          <i class=\"material-icons prefix\">Q</i>\n          <input id=\"search\" type=\"text\" placeholder=\"search\" value.bind=\"searchText\" focus>\n        </div>\n\n        <div class=\"input-field col s8 m4\">\n          <select md-select value.two-way=\"searchLocation\">\n              <option value=\"local\">My Decks</option>\n              <option value=\"remote\">All Decks</option>            \n          </select>\n        </div>  \n        \n        <div class=\"input-field col s4 m2\">\n          <button md-button click.trigger=\"search()\">Go</button>\n        </div>\n\n        </div>    \n\n    </form>\n  </div>    \n  \n  <div class=\"row sm-full\">\n    <div class=\"s12 m6 col\" repeat.for=\"deck of decks\">        \n        <div class=\"card tiny\">\n          <div class=\"card-content \">\n            <span class=\"card-title\">${deck.name}</span>\n            <p>${ deck.description }</p>\n          </div>\n          <div class=\"card-action\">\n              <a href=\"#\" click.trigger=\"goToEdit( deck.id )\">Edit</a>\n              <a href=\"#\" click.trigger=\"goToPlay( deck.id )\">Play</a>\n              <a href=\"#\" click.trigger=\"deleteDeck( deck.id )\">Delete</a>\n          </div>\n        </div>      \n    </div>\n  </div>\n  \n  <div class=\"row\">\n  <p class=\"col m12\">\n    <button md-button href=\"#\" click.trigger=\"goToNew()\">Create New Deck</button>\n  </p>\n  </div>\n\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map