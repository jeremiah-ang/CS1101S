function number_to_list(n) {
    function helper(x, acc) {
        if(x < 10) {
            return pair(x, acc);
        } else {
            return helper(Math.floor(x / 10), pair(x % 10, acc));
        }
    }

    return helper(n, []);
}
function list_to_number(xs) {
    return accumulate(function(x, acc){
        return acc * 10 + x;
    }, 0, reverse(xs));
}
function shift_one_left(n) {
    var xs = number_to_list(n);
    return list_to_number(append(tail(xs), list(head(xs))));
}

function shift_left_iter(num, n) {
    if(n === 0) {
        return num;
    } else {
        return shift_left(shift_one_left(num), n - 1);
    }
}

function number_length(num) {
    return (num === 0)
           ? 0
           : 1 + number_length(Math.floor(num / 10));
}
function ten_power(n) {
    return (n === 0)
            ? 1
            : 10 * ten_power(n - 1);
}
function shift_one_right(num) {
    var x = num % 10;
    var y = Math.floor(num / 10);
    return x * ten_power(number_length(y)) + y;
}

function shift_right(num, n) {
    return (n === 0)
            ? num
            : shift_right(shift_one_right(num), n - 1);
}

display(shift_right(1234, 2));

function nth_digit(n, num) {
    return (n === 1)
            ? num % 10
            : nth_digit(n - 1, Math.floor(num / 10));
}

display(nth_digit(1, 12345)); // return 5
display(nth_digit(3, 12345)); // return 3
display(nth_digit(4, 12345)); // return 2

function nth_digit_front(n, num) {
    if(num < ten_power(n)) {
        return num % 10;
    } else {
        return nth_digit_front(n, Math.floor(num / 10));
    }
}

display(nth_digit_front(1, 12345)); // return 1
display(nth_digit_front(3, 12345)); // return 3
display(nth_digit_front(4, 12345)); // return 4

function odd_digits(xs) {
    function helper(lst, acc) {
        if(is_empty_list(lst)) {
            return acc;
        } else if(length(lst) === 1) {
            return pair(head(lst), acc);
        } else {
            return helper(tail(tail(lst)), pair(head(lst), acc));
        }
    }

    return reverse(helper(xs, []));
}
function even_digits(xs) {
    return odd_digits(tail(xs));
}
function sum_of(xs) {
    return accumulate(function(x, acc){
        return x + acc;
    }, 0, xs);
}
function divisible_by_11(num) {
    var ns = number_to_list(num);

    return (num === 0)
           ? true
           : (num < 11)
             ? false
             : divisible_by_11(sum_of(odd_digits(ns)) - sum_of(even_digits(ns)));
}

display(divisible_by_11(1672));

function concat(n, m) {
    return list_to_number(append(number_to_list(n), number_to_list(m)));
}
display(concat(12345, 67890));

function replace_digit(n, d, r) {
    return list_to_number(map(function(x){
                                return (x === d)
                                        ? r
                                        : x;
                            }, number_to_list(n)));
}

display(replace_digit(31242154125, 1, 0)); // return 30242054025

function count_change(amount, coins) {
    if(amount === 0) {
        return 1;
    } else if (is_empty_list(coins) || amount < 0) {
        return 0;
    } else {
        return count_change(amount - head(coins), coins) + count_change(amount, tail(coins));
    }
}

var coins = list(5, 10, 20, 50, 100);
display(count_change(20, coins));

function make_function_with_exception(exp_value, exp_result, fn) {
    return function(x) {
        return (x === exp_value)
                ? exp_result
                : fn(x);
    };
}

var usually_sqrt =
make_function_with_exception(7, 2, Math.sqrt);
display(usually_sqrt(9)); // return 3
display(usually_sqrt(16)); // return 4
display(usually_sqrt(7)); // return 2

function expt(a, b) {
    return b === 0 ? 1 : a * expt(a, b-1);
}
function make_generator(fn) {
    return function(x) {
        return function(y) {
            return fn(x, y);
        };
    };
}

var make_multiplier = make_generator(function(a, b) { return a * b; });
var make_exponentiater = make_generator(expt);

display((make_multiplier(2))(3));

function deep_sum(xs) {
    if(is_empty_list(xs)) {
        return 0;
    } else if (is_list(head(xs))) {
        return deep_sum(head(xs)) + deep_sum(tail(xs));
    } else {
        return head(xs) + deep_sum(tail(xs));
    }
}

var x = list(1, 2, list(3, 4, list(list(list(5))),
list(list(6), list(7, 8), 9), 10));
display(deep_sum(x));

function deep_list_op(fn, base) {
    var helper = function(xs) {
        if(is_empty_list(xs)) {
            return base;
        } else if (is_list(head(xs))) {
            return fn(helper(head(xs)), helper(tail(xs)));
        } else {
            return fn(head(xs), helper(tail(xs)));
        }
    };

    return helper;
}

function deep_reverse(lst) {
    return (deep_list_op(function(a, b){ return append(b, list(a)); }, []))(lst);
}

function deep_sum(lst) {
    return (deep_list_op(function(a, b) { return a + b; }, 0))(lst);
}

var x = list(1, 2, list(3, 4, list(list(list(5))),
list(list(6), list(7, 8), 9), 10));
display(deep_sum(x));

display(deep_reverse(list(1, 2, list(3, 4),
list(list(5)), list(6, list(7, 8), 9))));
/* list(list(9, list(8, 7), 6),
list(list(5)), list(4, 3), 2, 1)) */

function split(a, l) {
    return list(filter(function(x){ return x <= a; }, l), filter(function(x){ return x > a; }, l));
}

display(split(5, list(1, 10, 4, 9, 7, 2, 5, 8, 3, 4, 9, 6, 2)));
// list(list(1, 4, 2, 5, 3, 4, 2), list(10, 9, 7, 8, 9, 6))

function split_v2(a, l) {
    var l1 = [];
    var l2 = [];
    function helper(xs) {
        if(is_empty_list(xs)) {
            return list(l1, l2);
        } else {
            var x = head(xs);
            if(x <= a) {
                l1 = pair(x, l1);
            } else {
                l2 = pair(x, l2);
            }
            return helper(tail(xs));
        }
    }
}

display(split(5, list(1, 10, 4, 9, 7, 2, 5, 8, 3, 4, 9, 6, 2)));
// list(list(1, 4, 2, 5, 3, 4, 2), list(10, 9, 7, 8, 9, 6))

function power_set(lst) {
    if(is_empty_list(lst)) {
        return list([]);
    } else {
        var h = head(lst);
        var tail_power_set = power_set(tail(lst));
        return append(map(function(x){ return pair(h, x); }, tail_power_set), tail_power_set);
    }
}

display(power_set(list(1, 2, 3)));
/* list(list(1, 2, 3), list(1, 2),
list(1, 3), list(1), list(2, 3),
list(2), list(3), []) */

function remove_all_equal(x, xs) {
    return filter(function(a){ return !equal(x, a); }, xs);
}

function is_mutually_exclusive(xs) {
    if(is_empty_list(xs)) {
        return true;
    } else {
        var next = remove_all_equal(head(xs), xs);
        if(length(next) + 1 === length(xs)) {
            return is_mutually_exclusive(next);
        } else {
            return false;
        }
    }
}
function remove_equal(xs, r) {
    if(is_empty_list(xs)) {
        return [];
    } else {
        var h = head(xs);
        if(equal(h, r)) {
            return tail(xs);
        } else {
            return pair(h, remove_equal(tail(xs), r));
        }
    }
}
function is_sub_set(main, sub) {
    if(is_empty_list(sub)) {
        return true;
    } else if (is_empty_list(main)) {
        return false;
    } else {
        var h = head(sub);
        var f = remove_equal(main, h);
        if(length(f) === length(main) - 1) {
            return is_sub_set(f, tail(sub));
        } else {
            return false;
        }
    }
}

function power_set_check(ps) {
    function helper(xs) {
        if(is_empty_list(xs)) {
            return true;
        } else {
            var h = head(xs);
            if(is_sub_set(ps, power_set(h))) {
                return helper(tail(xs));
            } else {
                return false;
            }
        }
    }

    return (is_mutually_exclusive(ps)) ? helper(ps) : false;
}

display(power_set_check(list(list(1, 2, 3), list(1, 2),
list(1, 3), list(1), list(2, 3), list(2),
list(3), [])));
// true
display(power_set_check(list(list(1, 2, 3))));
//false
display(power_set_check(list(list(1,2,3), list(1, 2, 3), list(1, 2),
list(1, 3), list(1), list(2, 3), list(2),
list(3), [])));

function number_to_text(n) {
    if(n === 0) { return "zero"; }
    else if(n === 1) { return "one"; }
    else if(n === 2) { return "two"; }
    else if(n === 3) { return "three"; }
    else if(n === 4) { return "four"; }
    else if(n === 5) { return "five"; }
    else if(n === 6) { return "six"; }
    else if(n === 7) { return "seven"; }
    else if(n === 8) { return "eight"; }
    else if(n === 9) { return "nine"; }
    else if(n === 10) { return "ten"; }
    else if(n === 11) { return "eleven"; }
    else if(n === 12) { return "twelve"; }
    else if(n === 13) { return "thirteen"; }
    else if(n === 14) { return "forteen"; }
    else if(n === 15) { return "fifteen"; }
    else if(n < 20) { return number_to_text(n % 10) + "teen"; }
    else if(n < 30) { return "twenty" + number_to_text(n % 10); }
    else if(n < 40) { return "thirty" + number_to_text(n % 10); }
    else if(n < 50) { return "forty" + number_to_text(n % 10); }
    else if(n < 60) { return "fifty" + number_to_text(n % 10); }
    else if(n < 70) { return number_to_text(Math.floor(n / 10)) + "ty" + number_to_text(n % 10); }
    else { return "Nope"; }
}

function spell(i) {
    var suffix = list("", "thousand", "miliion");

    function spell_hundred(xs) {
        if(xs === 0) {
            return "";
        } else if(xs > 99) {
            return spell_hundred(Math.floor(xs / 100)) + " hundred and " + number_to_text(xs % 100);
        } else {
            return number_to_text(xs);
        }
    }
    function helper(num, suffixs) {
        display(num);
        if(num === 0) {
            return "";
        } else {
            var hundred = num % 1000;
            if(hundred === 0) {
                return helper(Math.floor(num / 1000), tail(suffixs));
            } else {
                var text = spell_hundred(hundred);
                return helper(Math.floor(num / 1000), tail(suffixs)) + " " + text + " " + head(suffixs) + ",";
            }
        }
    }

    return helper(i, suffix);
}

function make_number(i) {
    return function(msg) {
        if(msg === "plus") {
            return function(b) { return make_number((b("value") === "undefined" || i === "undefined") ? "undefined" : i + b("value")); };
        } else if(msg === "minus") {
            return function(b) { return make_number((b("value") === "undefined" || i === "undefined") ? "undefined" : i - b("value")); };
        } else if(msg === "times") {
            return function(b) { return make_number((b("value") === "undefined" || i === "undefined") ? "undefined" : i * b("value")); };
        } else if(msg === "divide") {
            return function(b) { return (b("value") === 0 || b("value") === "undefined")
                                        ? make_number("undefined")
                                        : make_number(i / b("value")); };
        } else if(msg === "spell") {
            if(i === "undefiend") {
                return i;
            } else {
                return spell(i);
            }
        } else if (msg === "value") {
            return i;
        } else {
            return "Unknown request";
        }
    };
}

var one = make_number(1);
var twelve = make_number(12);
var thirteen = (one("plus"))(twelve);
display(thirteen("value"));
// 13
var five = make_number(5);
var eight = (thirteen("minus"))(five);
display(eight("value"));
// 8
display(eight("talk"));
// "Unknown request"

var zero = make_number(0);

var something = (one("divide"))(zero);
display(something("value"));
// "undefined"
var another_thing = (something("plus"))(one);
display(another_thing("value"));
// "undefined"
var yet_another_thing = (one("minus"))(something);
display(yet_another_thing("value"));
// "undefined"


var one_large_number = make_number(1904514);
display(one_large_number("spell"));
/* "one million, nine hundred and four thousand,
five hundred and fourteen" */
var another_large_number = make_number(10000000);
display(another_large_number("spell"));
// "really large number"

display(number_to_text(441));
