/*
Derek is correct
    self will point back to the frame that was created when make_object is called.
    when the extended object refers back to the self object,
        self's method would be called instead of the extended object

This system will not allow method overriding and makes inheritance meaningless.

Should a class be inherited (or the object extended),
the base class will no longer be able to call an overridden version of a method.
This prevents inheritance from being useful,
and does not allow polymorphism of an object's behaviour.

*/

function is_x_message(message) {
    return message.substring(0,3) === "is_";
}

function make_object() {
    function self(message) {
        var msg = head(message);
        if (msg === "is_object") {
            return true;
        } else if (is_x_message(msg)) {
            return false;
        } else {
            return list("No Method Found:", msg);
        }
    }
    return self;
}

function make_named_object(name) {
    // your solution here.
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

    return self;
}

// Sample Execution
var boba_fett = make_named_object("boba_fett");
var random_object = make_object();

display(boba_fett(list("is_named_object"))); // true
display(random_object(list("is_named_object"))); // false

display(boba_fett(list("name"))); // "boba_fett"

var palpatine = make_named_object("palpatine");
display(palpatine(list("name"))); // palpatine

palpatine(list("name", "darth sidious"));
display(palpatine(list("name"))); // darth sidious

function is_x_message(message) {
    return message.substring(0,3) === "is_";
}

function make_object() {
    function self(message) {
        var msg = head(message);
        if (msg === "is_object") {
            return true;
        } else if (is_x_message(msg)) {
            return false;
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

    return self;
}

function make_person(name) {
    // your solution here.
    var parent = make_named_object(name);
    var partner = [];

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
                    new_partner(list("join_partner", self));
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

    return self;
}

// Sample Execution
var boba_fett = make_person("Boba Fett");
var jango_fett = make_person("Jango Fett");
var hk_47 = make_person("HK 47");
display(boba_fett(list("is_person"))); // true

boba_fett(list("join_partner", jango_fett));

boba_fett(list("talk"));
// Boba Fett says: I am Boba Fett and I am partnered with Jango Fett!

jango_fett(list("join_partner", boba_fett));
// Jango Fett exclaims: I am already partnered!

boba_fett(list("join_partner", hk_47));
// Boba Fett exclaims: I am already partnered!

hk_47(list("talk"));
// HK 47 says: Hi! I am HK 47!
boba_fett(list("talk"));
// Boba Fett says: I am Boba Fett and I am partnered with Jango Fett!

(jango_fett(list("partner")))(list("talk"));
// Boba Fett says: I am Boba Fett and I am partnered with Jango Fett!

hk_47(list("join_partner", boba_fett));
// HK 47 exclaims: Boba Fett is already partnered!
