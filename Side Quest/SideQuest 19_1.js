/*
 *********** Task 1 ***********

 Derek's search route: E > F > B > D > A > C
 Pixel's search route: E > B > A > F > D > C
 pros/cons: Pixel's method need only each class to mantain a list of parent,distance pair, making it easier to code,
 while Derek's method requires implementation of breadth-first search which is complicated. The current method is basically a dfs.

 *********** Task 2 ***********

 Choice: Derek's Method
 Derek's method is much more intuitive than pixel, since the distance from the superclass to child is always the same,
 the order in which the base case is searched doesnt matter. Whereas it does matter to Pixel's method.

*/

function is_x_message(message) {
    return message.substring(0,3) === "is_";
}

function make_object(child) {
    function self(message) {
        var msg = head(message);
        if (msg === "is_object") {
            return true;
        } else if (msg === "parent") {
            return [];
        } else if (msg === "method") {
            return list("is_object");
        } else if (is_x_message(msg)) {
            return false;
        } else {
            return list("No Method Found:", msg);
        }
    }
    var true_self = child === undefined ? self : child;
    return self;
}

function make_named_object(name, child) {
    function self(message) {
        var msg = head(message);
        if (msg === "is_named_object") {
            return true;
        } else if (msg === "parent") {
            return list(parent, parent(list("parent")));
        } else if (msg === "method") {
            return list("is_named_object", "name");
        } else if (msg === "name") {
            // check if getter/setter
            if (is_empty_list(tail(message))) {
                return name;
            } else {
                name = head(tail(message));
            }
        } else {
            return parent(message);
        }
    }
    // define parent
    var true_self = child === undefined ? self : child;
    var parent = make_object(true_self);

    return self;
}

function make_person(name, child) {
     function self(message) {
        var msg = head(message);
        var name = parent(list("name"));
        if (msg === "is_person") {
            return true;
        } else if (msg === "parent") {
            return list(parent, parent(list("parent")));
        } else if (msg === "method") {
            return list("is_person", "talk", "join_partner", "force_join_partner", "partner");
        } else if (msg === "talk") {
            if (is_empty_list(partner)) {
                display(name + " says: Hi! I am " + name + "!");
            } else {
                display(name + " says: I am " + name + " and I am partnered with " + partner(list("name")) + "!");
            }
        } else if (msg === "join_partner") {
            if (!is_empty_list(partner)) {
                display(name + " exclaims: I am already partnered!");
            } else {
                // check partner
                var proposed_partner = head(tail(message));
                if (!is_empty_list(proposed_partner(list("partner")))) {
                    display(name + " exclaims: " + proposed_partner(list("name")) + " is already partnered!");
                } else {
                    // assign partner
                    partner = proposed_partner;
                    partner(list("force_join_partner", true_self));
                }
            }
        } else if (msg === "force_join_partner") {
            // Used to update partner.
            partner = head(tail(message));
        } else if (msg === "partner") {
            return partner;
        } else {
            return parent(message);
        }
    }
    // define parent
    var true_self = child === undefined ? self : child;
    var parent = make_named_object(name, true_self);

    var partner = [];

    return self;
}

function make_JFDI_warrior(name, child) {
    function self(message) {
        var msg = head(message);
        if (msg === "is_JFDI_warrior") {
            return true;
        } else if (msg === "parent") {
            return list(parent, parent(list("parent")));
        } else if (msg === "method") {
            return list("is_JFDI_warrior", "swing");
        } else if (msg === "swing") {
            display(parent(list("name")) + " swings lightsaber!");
        } else {
            return parent(message);
        }
    }
    var true_self = child === undefined ? self : child;
    var parent = make_person(name, true_self);

    return self;
}

function make_sith_lord(name, sith_name, child) {
    function self(message) {
        var msg = head(message);
        if (msg === "is_sith_lord") {
            return true;
        } else if (msg === "parent") {
            return list(parent, parent(list("parent")));
        } else if (msg === "method") {
            return list("is_sith_lord", "sith_name", "talk", "swing");
        } else if (msg === "sith_name") {
            // check if getter/setter
            if (is_empty_list(tail(message))) {
                return sith_name;
            } else {
                sith_name = head(tail(message));
            }
        } else if (msg === "talk") {
            parent(message);
            display(true_self(list("name")) + " says: Make that Lord " + true_self(list("sith_name")) + ", muahahaha...");
        } else if (msg === "swing") {
            display(parent(list("name")) + " swings lightsaber WHOOSH !");
        } else {
            return parent(message);
        }
    }
    var true_self = child === undefined ? self : child;
    var parent = make_person(name, true_self);

    return self;
}


function make_traitor(name, sith_name, child) {
    function self(message) {
        var msg = head(message);
        if (msg === "is_traitor") {
            return true;
        } else if (msg === "parent") {
            return list(list(parent1, parent1(list("parent"))), list(parent2, parent2(list("parent"))));
        } else if (msg === "method") {
            return list("is_traitor");
        } else if (is_x_message(msg)) {
            return parent1(message) || parent2(message);
        } else {
            return get_method(self, msg, message);
        }
    }
    var true_self = child === undefined ? self : child;
    var parent1 = make_JFDI_warrior(name, true_self);
    var parent2 = make_sith_lord(name, sith_name, true_self);

    return self;
}

// your program here.

function get_method(obj, msg, message){
    function helper(parents){
        if(is_empty_list(head(parents))){
            display("Method Not Found!");
        } else {

            var immediate_parents = map(head, parents);

            var immediate_parents_methods = map(function(parent){
                return pair(parent, parent(list("method")));
            }, immediate_parents);

            var parents_with_wanted_method = filter(function(parent_method){
                return !is_empty_list(member(msg, tail(parent_method)));
            }, immediate_parents_methods);

            if (!is_empty_list(parents_with_wanted_method)) {
                var p = head(head(parents_with_wanted_method));
                return p(message);
            } else {
                return helper(map(function(x){
                    return head(tail(x));
                }, parents));
            }

        }
    }
    return helper(obj(list("parent")));
}

// count dooku example
var dooku = make_traitor("Dooku", "Tyranus", undefined);
display(dooku(list("is_JFDI_warrior")));
// true

display(dooku(list("is_sith_lord")));
// true

display(dooku(list("is_traitor")));
// true

dooku(list("swing"));
// Dooku swings lightsaber!

dooku(list("talk")); // error here - why didn't he mention that he is Lord Tyranus?
// Dooku says: Hi, I am Dooku!

dooku(list("ding dong"));
// NO SUCH METHOD 
