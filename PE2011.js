/*
**************** Question 1 *************************
*****************************************************

Question 1 Simple List Manipulation [10 marks]
Write a procedure move_to_front that given a
non_negative integer and a (non_mutable) list
will return a new list with the element in the
specified position moved to the front of the list.
The index of the first element of a list is 0.

Note: you cannot use set_tail and set_head

Sample execution:
move_to_front(0, list(1 2 3)); // returns (1 2 3)
move_to_front(1, list(1 2 3)); // returns (2 1 3)
move_to_front(2, list(1 2 3)); // returns (3 1 2)
move_to_front(1, list(a b c d)); // returns (b a c d)
move_to_front(2, list(a b c d)); // returns (c a b d)

*****************************************************
*****************************************************
*/

function move_to_front(index, xs){
    function helper(i, remaining, built) {
        if(i === 0) {
            return pair(head(remaining), append(built, tail(remaining)));
        } else if (is_empty_list(remaining)) {
            return built;
        } else {
            return helper(i - 1, tail(remaining), append(built, list(head(remaining))));
        }
    }

    return helper(index, xs, []);
}

display("********* QUESTION 1 *********");
display(move_to_front(0, list(1,2,3,4,5,6)));




/*
**************** Question 2 *************************
*****************************************************

Write a procedure interleave that given two positive integers
will return a new integer with the
digits of the two integers interleaved together,
starting with the first digit of the first integer.
Note that the two integers need not have the same number of digits.
If one of the integers is shorter and we run out of digits,
we just append the remaining digits in the rear.

Sample execution:
interleave(12, 43); //returns 1423
interleave(125, 43); //returns 14235
interleave(1257, 43); //returns 142357
interleave(12579, 43); //returns 1423579
interleave(12509, 40); //returns 1420509
interleave(12, 436); //returns 14236
interleave(12, 4368); //returns 142368

*****************************************************
*****************************************************
*/

function number_to_list(n) {
    function iter(remaining, built){
        if(remaining < 10) {
            return pair(remaining, built);
        } else {
            var last = remaining % 10;
            var front = Math.floor(remaining / 10);
            return iter(front, pair(last, built));
        }
    }

    return iter(n, []);
}

function list_to_number(xs) {
    return accumulate(function(x, acc){
        return acc * 10 + x;
    }, 0, xs);
}

function interleave(n1, n2) {

    function helper(xs1, xs2, built) {
        if(is_empty_list(xs1)){
            return append(reverse(xs2), built);
        } else if (is_empty_list(xs2)) {
            return append(reverse(xs1), built);
        } else {
            return helper(xs2, tail(xs1), pair(head(xs1), built));
        }
    }

    return list_to_number(helper(number_to_list(n1), number_to_list(n2), []));
}

display("********* QUESTION 2 *********");
display(interleave(12, 4368)); //returns 142368

/*
**************** Question 3 *************************
*****************************************************

Question 3 General Elections 2010 [10 marks]
Write a procedure make_elections that takes a
(non_mutable) list of symbols representing different political parties and
creates an election.

An election e accepts three commands:
1. e("create_polling_station")
    will create a polling station for the election e.
2. e("num_station")
    will return the number of polling stations created for the election e.
3. e("count_votes")
    returns a (non_mutable) list where each element
    is a tuple (list) listing the party and the
    corresponding total number of votes received over all polling stations.

A polling station p accepts two commands:
1. p("vote party")
    will cast a vote for the party party.
    If party is not one of the contesting parties,
    the string "Spoilt vote!" is returned.

2. p("count_votes")
    returns a (non_mutable) list where
    each element is a tuple (list) listing the party and
    the corresponding number of votes received at polling station p.

Both the election and polling station will return the string
"Invalid command", if they are called with unrecognized commands.
Note that in addition to the above commands, you are welcome
to create some other helper commands if necessary.

Hint: Note that if you do decide to use mutable lists,
please make sure that you remember to
convert them back to (non_mutable) list as return values.

Sample execution:

// Punters say it will happen year end _ what say you.
var ge_2010 = make_elections(list("pap", "wp", "sdp"));

//Neutral ward
var ang_mo_kio_station = ge_2010(list("create_polling_station"));

//Opposition ward
var hougang_station = ge_2010(list("create_polling_station"));

//PAP stronghold
var marine_parade_station = ge_2010(list("create_polling_station"));
ge_2010(list("stuff")); // returns "Invalid command"
ge_2010(list("num_station")); //returns 3

//Here comes Voting Day!

hougang_station(list("vote", "pap"));
hougang_station(list("vote", "sdp"));
hougang_station(list("vote", "wp"));
hougang_station(list("vote", "wp"));
hougang_station(list("vote", "wp"));
hougang_station(list("count_votes")); //returns list(("pap", 1),("wp", 3) ("sdp", 1))
hougang_station(list("vote", "toilet_party")); "Spoilt vote!"

ang_mo_kio_station(list("vote", "pap"));
ang_mo_kio_station(list("vote", "wp"));
ang_mo_kio_station(list("vote", "pap"));
ang_mo_kio_station(list("vote", "wp"));
ang_mo_kio_station(list("vote", "pap"));
ang_mo_kio_station(list("vote", "wp"));
ang_mo_kio_station(list("count_votes")); //returns list(("pap", 3),("wp", 3),("sdp", 0)

marine_parade_station(list("vote", "pap"));
marine_parade_station(list("vote", "pap"));
marine_parade_station(list("vote", "pap"));
marine_parade_station(list("vote", "pap"));
marine_parade_station(list("vote", "pap"));
marine_parade_station(list("vote", "wp"));
marine_parade_station(list("vote", "sdp"));
marine_parade_station(list("count_votes")); //returns list(("pap", 5),("wp", 1),("sdp",
//And the final count!
ge_2010(list("count_votes")); //returns list(("pap", 9),("wp", 7), ("sdp", 2))

*****************************************************
*****************************************************
*/

function list_to_object(lst) {
    function helper(xs, obj) {
        if(is_empty_list(xs)) {
            return obj;
        } else {
            obj[head(xs)] = 0;
            return helper(tail(xs), obj);
        }
    }

    return helper(lst, {});
}

function obj_to_list(obj, keys) {
    return map(function(key){
        return pair(key, obj[key]);
    }, keys);
}

function accumulate_votes(xs){
    if(is_empty_list(head(xs))){
        return [];
    } else {
        var per_party = map(head, xs);
        var party = head(head(per_party));
        var total_votes = accumulate(function(x, acc){ return x + acc; }, 0, map(tail, per_party));
        return pair(pair(party, total_votes), accumulate_votes(map(tail, xs)));
    }
}

function make_elections(parties) {
    var polling_stations = pair("stations", []);
    var num_station = 0;

    return function(e_command){
        var msg = head(e_command);
        if (msg === "create_polling_station") {

            num_station = num_station + 1;
            var votes = list_to_object(parties);
            var polling_station = function(p_command) {
                var p_msg = head(p_command);
                if (p_msg === "vote") {
                    var party = head(tail(p_command));
                    if(votes[party] === undefined) {
                        return "Spoilt Vote!";
                    } else {
                        votes[party] = votes[party] + 1;
                    }
                } else if (p_msg === "count_votes") {
                    return obj_to_list(votes, parties);
                } else {
                    return "Invalid command";
                }
            };

            var temp = pair(polling_station, tail(polling_stations));
            set_tail(polling_stations, temp);
            return polling_station;
        } else if (msg === "num_station") {
            return num_station;
        } else if (msg === "count_votes") {
            return accumulate_votes(map(function(polling_station){
                return polling_station(list("count_votes"));
            }, tail(polling_stations)));
        } else {
            return "Invalid command";
        }
    };
}

display("********* QUESTION 3 *********");

// Punters say it will happen year end _ what say you.
var ge_2010 = make_elections(list("pap", "wp", "sdp"));

//Neutral ward
var ang_mo_kio_station = ge_2010(list("create_polling_station"));

//Opposition ward
var hougang_station = ge_2010(list("create_polling_station"));

//PAP stronghold
var marine_parade_station = ge_2010(list("create_polling_station"));
ge_2010(list("stuff")); // returns "Invalid command"
ge_2010(list("num_station")); //returns 3

//Here comes Voting Day!

hougang_station(list("vote", "pap"));
hougang_station(list("vote", "sdp"));
hougang_station(list("vote", "wp"));
hougang_station(list("vote", "wp"));
hougang_station(list("vote", "wp"));
hougang_station(list("count_votes")); //returns list(("pap", 1),("wp", 3) ("sdp", 1))
hougang_station(list("vote", "toilet_party")); //"Spoilt vote!"

ang_mo_kio_station(list("vote", "pap"));
ang_mo_kio_station(list("vote", "wp"));
ang_mo_kio_station(list("vote", "pap"));
ang_mo_kio_station(list("vote", "wp"));
ang_mo_kio_station(list("vote", "pap"));
ang_mo_kio_station(list("vote", "wp"));
ang_mo_kio_station(list("count_votes")); //returns list(("pap", 3),("wp", 3),("sdp", 0)

marine_parade_station(list("vote", "pap"));
marine_parade_station(list("vote", "pap"));
marine_parade_station(list("vote", "pap"));
marine_parade_station(list("vote", "pap"));
marine_parade_station(list("vote", "pap"));
marine_parade_station(list("vote", "wp"));
marine_parade_station(list("vote", "sdp"));
marine_parade_station(list("count_votes")); //returns list(("pap", 5),("wp", 1),("sdp",
//And the final count!
ge_2010(list("count_votes")); //returns list(("pap", 9),("wp", 7), ("sdp", 2))


/*
**************** Question 4 *************************
*****************************************************

In lecture, you saw how we can create arbitrary cyclical data structures
using set_head and set_tail .
In this question, we will go one step further.
Write a procedure count_cycles that
takes mutable data structure (consisting of pair boxes) and
counts the number of directed cycles in the data structure.
Because head and tail pointers have direction,
a directed cycle exists when it is possible to come back
to the same pair pair by following some non_zero path
of car or cdr pointers.

A directed cycle is a sequence of links such that
the node at the start of the first link is the same as the node
at the destination of the last link and there are no repeated links
and nodes in the sequence. For example, in the following pair structure,
there are altogether 4 directed cycles:
(l_a,l_c), (l_a,l_d), (l_b,l_c), and (l_b,l_d).

var test_case1 = pair(1, 1);
count_cycles(test_case1);
// returns 0;

var test_case2 = pair(1, pair(2, 0)));
count_cycles(test_case2);
// returns 0;

var test_case3 = pair(1, pair(2, 0));
set_tail(tail(test_case3), test_case3);
count_cycles(test_case3);
// returns 1;

var a = pair([], []);
set_head(a, a);
var test_case4 = pair(a, a);
count_cycles(test_case4);
// returns 1;

var c = pair([], []);
var test_case5 = pair(c,c);
set_head(c, test_case5);
set_tail(c, test_case5);
count_cycles(test_case5);
// returns 4;

var test_case6 = pair(true, true);
var help4 = pair(true, true);
set_head(test_case6, help4);
set_tail(test_case6, test_case6);
set_head(help4, test_case6);
set_tail(help4, help4);
count_cycles(test_case6);
// returns 3;
*****************************************************
*****************************************************
*/
function is_visited(x, visited) {
    return length(filter(function(a){ return x === a; }, visited)) > 0;
}

function add_visited(x, visited) {
    return pair(x, visited);
}

function count_cycles(lst){
    function helper(xs, visited) {
        if(is_visited(xs, visited)) {
            return 1;
        } else if (!is_pair(xs)) {
            return 0;
        } else {
            visited = add_visited(xs, visited);
            return helper(head(xs), visited) + helper(tail(xs), visited);
        }
    }

    return helper(lst, []);
}

var a = pair([], []); //([], [])
set_head(a, a); // (([], []), [])
var test_case4 = pair(a, a); //((([], []), []), (([], []), []))
count_cycles(test_case4);
// returns 1;

var test_case6 = pair(true, true);
var help4 = pair(true, true);
set_head(test_case6, help4);
set_tail(test_case6, test_case6);
set_head(help4, test_case6);
set_tail(help4, help4);
count_cycles(test_case6);
// returns 3;
