//Stream functions

function scale_stream(s1, n){
    return pair(head(s1) * n, function(){
        return scale_stream(stream_tail(s1), n);
    });
}
function mul(n1, n2){
    return n1 * n2;
}

function add(n1, n2){
    return n1 + n2;
}
function add_streams(s1, s2){
    return op_two_stream(add, s1, s2);
}
function div(n1, n2){
    return n1 / n2;
}
function op_two_stream(fn, s1, s2){
    if(is_empty_list(s1)){
        return s2;
    } else if (is_empty_list(s2)) {
        return s1;
    } else {
        return pair(fn(head(s1), head(s2)), function(){
            return op_two_stream(fn, stream_tail(s1), stream_tail(s2));
        });
    }
}
function integrate_series_tail(s) {
	// Your answer here
	var integers = integers_from(1);
	return op_two_stream(div, s, integers);
}

var sine_series = pair(0, function(){ return integrate_series_tail(cosine_series); });
var cosine_series = pair(1, function(){ return integrate_series_tail(scale_stream(sine_series, -1)); });
var ones = pair(1, function(){ return ones; });

//Task 1
function next(approx, x0, series){ //task 1
    return pair(head(approx) + head(series), function(){
        return next(stream_tail(approx), x0, scale_stream(stream_tail(series), x0));
    });
}
function approximate(x0, series) { //task 1
    // Your answer here
    var approx = pair(head(series), function(){
        return next(approx, x0, scale_stream(stream_tail(series), x0));
    });

    return approx;
}

var aprox = approximate(Math.PI, sine_series);
display("********** Task 1: Approximate sin(PI) **********");
display(eval_stream(aprox, 10));

//Task 2
//
// idea:
// a00 | a01  a02  a03  a04
// --------------------------
//     | a10  a11  a12  a12
//     |      a20  a21  a22
//     |           a30  a31
//
//  A | B1 B2 B3 B4
//  ------------
//    | C1 C2 C3 C4
//
//  returns pair(A, function(){ return add_stream(B1B2B3B4, C1C2C3C4});
//

function cosine_stream(){
    return pair(scale_stream(cosine_series, 0.5), function(){
        return stream_map(function(x){
            return scale_stream(x, 0.5); }, cosine_stream()); });
}

function repeat_stream(n){ //Task 2
    return pair(n, function(){ return repeat_stream(n); });
}

var streams_of_integers = stream_map(function(x){ //Task 2
    // to simulate streams of converging function
    // returns 1+1+1+1+...., 2+2+2+2+2+....., 3+3+3+3+...., 4,5,6....
    return repeat_stream(x);
}, integers_from(1));


function multi_power(s, x0){ //Task 2
    // f(x0) = a1 + a2 * x0 + a3 * (x0)^2 + a4 * (a0)^3....
    return pair(head(s) * x0, function(){
        return multi_power(scale_stream(stream_tail(s), x0), x0);
    });
}

function interleave_add(ss, x0){ //Task 2
    return pair(head(head(ss)), function(){
       return op_two_stream(add, multi_power(stream_tail(head(ss)), x0), interleave_add(stream_tail(ss), x0));
    });
}

function greater_approximate(x0, stream_of_series) { //Task 2
    // Your answer here
    return approximate(1, interleave_add(stream_of_series, x0));
}

display("********** Task 2: Approximate cos(PI)  **********");
display(eval_stream(greater_approximate(Math.PI, cosine_stream()), 10));


function interleave(s1, s2){
    if(is_empty_list(s1)){
        return s2;
    } else {
        return pair(head(s1), function(){
           return interleave(s2, stream_tail(s1));
        });
    }
}

var natural_numbers = pair(1,
                           function() {
                               return add_streams(ones, natural_numbers);
                           });
var integer_numbers = pair(0,
                           function() {
                               return interleave(natural_numbers,
                                                 scale_stream(natural_numbers, -1));
                           });


function cartesian_product(tops, bottoms){ //task 3
    var numerator = head(tops);
    return pair(pair(numerator, head(bottoms)), function(){
        return interleave(stream_map(function(x){
            return pair(numerator, x); }, stream_tail(bottoms)), cartesian_product(stream_tail(tops), bottoms));
    });
}
function gcd(a, b){ //challenge
    return (b === 0)
            ? a
            : gcd(b, a % b);
}



//Task 3
var integers_from_1 = stream_tail(integer_numbers);
var all_rationals_with_repetition = pair(0, function(){
        return stream_map(function(x){
            return head(x) / tail(x);
        }, cartesian_product(integers_from_1, integers_from_1));
    });

display("********* Task 3: All Rationals  *********");
display(eval_stream(all_rationals_with_repetition, 10));

//Task 3 challenge 1
var all_rationals_without_repetition = pair(0, function(){
        return stream_map(function(x){
            return head(x) / tail(x);
        }, stream_filter(function(x){
            return gcd(head(x), tail(x)) === 1;
        }, cartesian_product(integers_from_1, integers_from_1)));
    });
display("********* Task 3 Challenge 1: All Rationals With Repetition *********");
display(eval_stream(all_rationals_without_repetition, 10));


//Task 4

var all_coordinates = stream_map(function(xyz){
    var x = head(xyz);
    var y = head(tail(xyz));
    var z = tail(tail(xyz));
    return list(x,y,z);

}, cartesian_product(
        integer_numbers,
        cartesian_product(
            integer_numbers,
            integer_numbers)));

display("********* Task 4: All Coordinate  *********");
display(eval_stream(all_coordinates, 10));
