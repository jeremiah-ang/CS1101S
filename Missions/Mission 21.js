//Stream functions

function scale_stream(s1, n){
    return pair(head(s1) * n, function(){
        return scale_stream(stream_tail(s1), n);
    });
}

function add_streams(s1, s2) {
    if (is_empty_list(s1)) {
        return s2;
    } else if (is_empty_list(s2)) {
        return s1;
    } else {
        return pair(head(s1) + head(s2),
                    function() {
                        return add_streams(stream_tail(s1),
                                            stream_tail(s2));
                    });
    }
}

function mult_stream(s1, s2){
    return pair(head(s1) * head(s2), function(){
        return mult_stream(stream_tail(s1), stream_tail(s2));
    });
}

function mult_series(s1, s2){
    return pair(head(s1) * head(s2),
        function(){ return add_streams(scale_stream(stream_tail(s1), head(s2)),
                                      mult_series(s1, stream_tail(s2)));
        });
}

function div_stream(s1, s2){
    return pair(head(s1) / head(s2), function(){
       return div_stream(stream_tail(s1), stream_tail(s2));
    });
}

function div_series(s1, s2) {
    var n = head(s2);
    return mult_series(s1,
                       scale_stream(invert_unit_series(scale_stream(s2, 1 / n)), 1 / n));
}

function interleave(s1, s2){
    return pair(head(s1), function(){ return interleave(s2, stream_tail(s1)); });
}


function negate_stream(s){
    return pair(-1 * head(s), function(){
        return negate_stream(stream_tail(s));
    });
}

function invert_unit_series(s){
    var sn = stream_tail(s);
    var x = pair(1, function(){
        return negate_stream(mult_series(sn, x));
    });
    return x;
}
var ones = pair(1, function(){ return ones; });


// Task 1.1

function integrate_series_tail(s) { //Task 1.1
	// Your answer here
	var integers = integers_from(1);
	return div_stream(s, integers);
}

 display("********* Task 1 Part 1: INTEGRATE 1s *********");
 display(eval_stream(integrate_series_tail(ones), 10));

// Task 1.2
var exp_series = pair(1, function() { return integrate_series_tail(exp_series); } );
 display("********* Task 1 Part 1: EXP SERIES *********");
 display(eval_stream(exp_series, 10));

 display("********* Task 1 Part 2: Explaination commented *********");
// Your explanation here
/*
    to get the next term, you basically take the coefficient of the previous term,
    divide it with the power of x of the current term.
     i.e. the second term, x^1, will take 1(coefficient of x^0), and divide with 1(power of x) resulting in 1
          the third term, x^2, will take 1(coefficient of x^1), and divide with 2(power of x) resulting in 1/2
          the forth term, x^3 will take 1/2(coefficient of x^2), and divide with 3(power of x) resulting in 1/(2*3) or 1/3!
          and so on...

    after the first call
    exp_series = [1, [1, fn(){ return div_stream([1, fn(){}], [2, fn(){}]); }]];
    the third term term will be division of 1 and 2 resulting in 1/2
    the forth term will be division of 1/2 and 3 resulting in 1/(2*3) or 1/3!
    then 1/3! will be divided with 4 resulting in 1/4! and so on.
*/


// Task 2
function integrate_series(series, constant_term) {
    return pair(constant_term, function() { return integrate_series_tail(series); });
}
var joel_exp_series = integrate_series(joel_exp_series,1);

display("********* Task 2: Explaination commented *********");
// Your explanation here
// the joel_exp_series in integrate_series(joel_exp_series, 1) is undefined at the moment it is called
// thus the series in integrate_series starts with undefined
			// File: mission_21_3.js

// Task 3

var sine_series = pair(0, function(){ return integrate_series_tail(cosine_series); });
var cosine_series = pair(1, function(){ return integrate_series_tail(scale_stream(sine_series, -1)); });
var tangent_series = div_series(sine_series, cosine_series);


 display("********* Task 3: SINE SERIES *********");
 display(eval_stream(sine_series, 10));
 display("********* Task 3: COSINE SERIES *********");
 display(eval_stream(cosine_series, 10));
 display("********* Task 3: TANGENT SERIES *********");
 display(eval_stream(tangent_series, 10));

			// File: mission_21_4.js

// Task 4
function derive_series(s) {
	var integers = integers_from(0);
	return stream_tail(mult_stream(s, integers));
}
var d0 = derive_series(ones);

 display("********* Task 4: DERIVATIVE *********");
 display(eval_stream(d0, 10));

// Task 5

var denom = pair(1, function(){ return integrate_series_tail(denom); }); //1, 1/2, 1/3!, 1/4!, 1/5!....
var zeros = pair(0, function(){ return zeros; }); //0, 0, 0, 0, 0, 0....
var alt_ones = pair(1, function(){ return negate_stream(alt_ones);}); //1, -1, 1, -1, 1, -1...
var alt = interleave(alt_ones, zeros); //1, 0, -1, 0, 1, 0, -1, 0....

var cosine_series_task_5 = mult_stream(alt, denom);
var sine_series_task_5 = negate_stream(derive_series(cosine_series_task_5));

 display("********* Task 5: MACLAURIN COSINE *********");
 display(eval_stream(cosine_series_task_5, 10));
 display("********* Task 5: DERIVAED SINE *********");
 display(eval_stream(sine_series_task_5, 10));

// Task 6
var arctan = pair(0, function(){ return integrate_series_tail(alt); });

 display("********* Task 6: ARC TAN *********");
 display(eval_stream(arctan, 10));
