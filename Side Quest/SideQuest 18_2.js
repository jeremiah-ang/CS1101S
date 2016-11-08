// Task 1
// This error occurs because the partner returned is only a person
// and not a source_initiate or source_warrior
// (windu(list("partner")))(list("is_source_warrior") returns false;
//
// solution:
// the actual source_initiate or source_warrior instance should
// be stored as partner

// your program here.
function is_x_message(message) {
    return message.substring(0,3) === "is_";
}

function make_object() {
    var _this = [];
    function self(message) {
        var msg = head(message);
        if (msg === "is_object") {
            return true;
        } else if (is_x_message(msg)) {
            return false;
        } else if (msg === "set_this") {
            _this = head(tail(message));
        } else if (msg === "get_this") {
            return _this;
        } else {
            return list("No Method Found:", msg);
        }
    }

    return self;
}

function make_named_object(name) {
    // paste solution from task 1.
    var parent = make_object();

    function self(message){
        var msg = head(message);
        if (msg === "is_named_object") {
            return true;
        } else if (msg === "name") {
            var new_name = tail(message);
            if (is_empty_list(new_name)) {
                return name;
            } else {
                name = head(new_name);
            }
        } else {
            return parent(message);
        }
    }

    parent(list("set_this", self));
    return self;
}

function make_person(name) {
    // your solution here.
    var parent = make_named_object(name);
    var partner = [];
    var child = [];

    function self(message){
        var msg = head(message);
        if (msg === "is_person") {
            return true;
        } else if (msg === "talk") {
            var name = parent(list("name"));
            if(is_empty_list(partner)){
                display(name + " says: Hi! I am " + name + "!");
            } else {
                var partner_name = partner(list("name"));
                display(name + " says: I am " + name + " and I am partnered with " + partner_name + "!");
            }
        } else if (msg === "join_partner") {
            var new_partner = head(tail(message));
            var partners_partner = new_partner(list("partner"));
            if(is_empty_list(partner)
               && (is_empty_list(partners_partner)
                  || partners_partner(list("name")) === parent(list("name")))){

                partner = new_partner;
                if(is_empty_list(partners_partner)){
                    var _this = parent(list("get_this"));
                    new_partner(list("join_partner", (is_empty_list(_this))
                                                     ? self
                                                     : _this));
                } else {
                    ;
                }
            } else if(!is_empty_list(partner)){
                display(parent(list("name")) + " exclaims: I am already partnered!");
            } else {
                display(parent(list("name")) + " exclaims: " + new_partner(list("name")) + " is already partnered!");
            }
        } else if (msg === "partner") {
            return partner;
        } else {
            return parent(message);
        }
    }

    parent(list("set_this", self));
    return self;
}

function make_source_warrior(name) {
    var parent = make_person(name);

    function self(message) {
        var msg = head(message);
        if (msg === "is_source_warrior") {
            return true;
        } else if (msg === "swing") {
            display(parent(list("name")) + " swings lightsaber!");
        } else {
            return parent(message);
        }
    }

    parent(list("set_this", self));
    return self;
}

function make_source_initiate(name) {
    var parent = make_person(name);

    function self(message) {
        var msg = head(message);
        if (msg === "is_source_initiate") {
            return true;
        } else if (msg === "talk") {
            parent(message);
            display(parent(list("name")) + " says: I am only an initiate.");
        } else {
            return parent(message);
        }
    }

    parent(list("set_this", self));
    return self;
}

// Testing program Derek used.
var windu = make_source_warrior("Jules Windu");
var atton = make_source_initiate("Paul Atton");
atton(list("join_partner", windu));

atton(list("talk"));
// Paul Atton says: Hi, I am Paul Atton and I am partnered with Jules Windu!
// Paul Atton says: I am only an initiate.

(atton(list("partner")))(list("swing"));
// Jules Windu swings lightsaber!

(windu(list("partner")))(list("talk")); // Error here
// Paul Atton says: Hi, I am Paul Atton and I am partnered with Jules Windu!


var fisto = make_source_warrior("Def Fisto");
var shayaak = make_source_initiate("Mos Shayaak");
fisto(list("join_partner", shayaak));

fisto(list("swing"));
// Def Fisto swings lightsaber!


(fisto(list("partner")))(list("talk"));
// Mos Shayaak says: Hi, I am Mos Shayaak and I am partnered with Def Fisto!
// Mos Shayaak says: I am only an initiate.
(shayaak(list("partner")))(list("swing")); // Error here
// list("No Method Found:", "swing");
