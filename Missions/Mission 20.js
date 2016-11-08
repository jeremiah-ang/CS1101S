// Task 1
function make_step_stream(n) {
    function helper(i){
        return (i > n)
                ? helper(1)
                : pair(i, function(){
                    return helper(i + 1);
                });
    }
    return helper(1);
}

display("********* TASK1 ***********");

var stream_123 = make_step_stream(3);
display(eval_stream(stream_123, 10));
// Output should be the same as list(1, 2, 3, 1, 2, 3, 1, 2, 3, 1)

var stream_12345 = make_step_stream(5);
display(eval_stream(stream_12345,10));
// Output should be the same as list(1, 2, 3, 4, 5, 1, 2, 3, 4, 5)

var stream_1 = make_step_stream(1);
display(eval_stream(stream_1, 10));
// Output should be the same as list(1, 1, 1, 1, 1, 1, 1, 1, 1, 1)

//Task 2
function make_oscillating_stream(n) {
    var direction = 1;
    function helper(i){
        if(n === 1){
            return pair(1, function(){
                return helper(1);
            });
        } else if( i > n || i < 1){
            direction = direction * -1;
            return helper(i + 2 * direction);
        } else {
            return pair(i, function(){
                return helper(i + direction);
            });
        }


    };

    return helper(1);
}

display("********* TASK2 ***********");

var osc_stream_123 = make_oscillating_stream(3);
display(eval_stream(osc_stream_123, 10));
// Output should be the same as list(1, 2, 3, 2, 1, 2, 3, 2, 1, 2)

var osc_stream_1 = make_oscillating_stream(1);
display(eval_stream(osc_stream_1, 10));
// Output should be the same as list(1, 1, 1, 1, 1, 1, 1, 1, 1, 1)

var osc_stream_12345 = make_oscillating_stream(5);
display(eval_stream(osc_stream_12345,10));
// Output should be the same as list(1, 2, 3, 4, 5, 4, 3, 2, 1, 2)

//Task 3
function make_flexible_step_stream(lst) {
    function helper(xs){
        return (is_empty_list(xs))
                ? helper(lst)
                : pair(head(xs), function(){
                    return helper(tail(xs));
                });
    }
    return helper(lst);
}

function make_flexible_oscillating_stream(lst) {
    var direction = 1;
    function helper(xs){
        if(length(lst) === 1){
            return pair(head(xs), function(){
                return helper(xs);
            });
        } else if(is_empty_list(xs)){
            direction = direction * -1;
            return (direction === 1)
                    ? helper(tail(lst))
                    : helper(tail(reverse(lst)));
        } else {
            return pair(head(xs), function(){
                return helper(tail(xs));
            });
        }
    };

    return helper(lst);
}

display("********* TASK3 ***********");

var flex_123_step_stream = make_flexible_step_stream(list(1,2,3));
display(eval_stream(flex_123_step_stream, 10));
// Output should be the same as list(1, 2, 3, 1, 2, 3, 1, 2, 3, 1)

var flex_357_step_stream = make_flexible_step_stream(list(3,5,7));
display(eval_stream(flex_357_step_stream, 10));
// Output should be the same as list(3, 5, 7, 3, 5, 7, 3, 5, 7, 3)

var flex_1_step_stream = make_flexible_step_stream(list(1));
display(eval_stream(flex_1_step_stream, 10));
// Output should be the same as list(1, 1, 1, 1, 1, 1, 1, 1, 1, 1)

var flex_123_osc_stream = make_flexible_oscillating_stream(list(1,2,3));
display(eval_stream(flex_123_osc_stream, 10));
// Output should be the same as list(1, 2, 3, 2, 1, 2, 3, 2, 1, 2)

var flex_3579_osc_stream = make_flexible_oscillating_stream(list(3,5,7,9));
display(eval_stream(flex_3579_osc_stream, 10));
// Output should be the same as list(3, 5, 7, 9, 7, 5, 3, 5, 7, 9)

var flex_12_osc_stream = make_flexible_oscillating_stream(list(1,2));
display(eval_stream(flex_12_osc_stream, 10));
// Output should be the same as list(1, 2, 1, 2, 1, 2, 1, 2, 1, 2)

//Task 4
// stream_constant(k) generates an infinite stream of k
function stream_constant(k) {
    return pair(k, function() { return stream_constant(k); });
}
// add_streams sums up two given infinite stream
function add_streams(s1, s2) {
    return pair( head(s1) + head(s2), function() {
        return add_streams( stream_tail(s1), stream_tail(s2));
    });
}

function interleave(stream1, stream2) {
    if(is_empty_list(stream1)){
        return stream2;
    } else if(is_empty_list(stream2)) {
        return stream1;
    } else {
        return pair(head(stream1), function(){
           return interleave(stream2, stream_tail(stream1));
        });
    }
}


display("********* TASK4 ***********");

var odd_stream = pair(1, function(){ return add_streams(stream_constant(2),
 odd_stream); });
var even_stream = pair(2, function(){ return add_streams(stream_constant(2),
 even_stream); });
var integers = interleave(odd_stream, even_stream);
display(eval_stream(integers, 10));
// Output should be the same as list(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

var finite_test = interleave(list_to_stream(list("a","b","c")), stream_constant(1));
display(eval_stream(finite_test, 10));
// Output should be the same as list("a", 1, "b", 1, "c", 1, 1, 1, 1, 1)

//Task 5
function flexible_interleave(list_of_streams) {
    if(is_empty_list(list_of_streams)){
        return [];
    } else {
        var current_stream = head(list_of_streams);
        if(is_empty_list(current_stream)){
            return flexible_interleave(tail(list_of_streams));
        } else {
            return pair(head(current_stream), function(){
                return flexible_interleave(append(tail(list_of_streams),
                                           list(stream_tail(current_stream))));
            });
        }
    }
}

display("********* TASK5 ***********");

var ones_stream = stream_constant(1);
var twos_stream = stream_constant(2);
var threes_stream = stream_constant(3);

var integers = flexible_interleave(list(ones_stream, twos_stream, threes_stream));
display(eval_stream(integers, 10));
// Output should be the same as list(1, 2, 3, 1, 2, 3, 1, 2, 3, 1)

var osc_123_stream = make_oscillating_stream(3);
var osc_456_stream = make_flexible_oscillating_stream(list(4,5,6));
var interleaved_123456_stream = flexible_interleave(list(osc_123_stream, osc_456_stream));
display(eval_stream(interleaved_123456_stream, 10));
// Output should be the same as list(1, 4, 2, 5, 3, 6, 2, 5, 1, 4)

var interleaved_1_stream = flexible_interleave(list(ones_stream));
display(eval_stream(interleaved_1_stream, 10));
// Output should be the same as list(1, 1, 1, 1, 1, 1, 1, 1, 1, 1)

//Task 6
var golomb_stream = pair(1, function(){
    return stream_map(function(x){
        return 1 + stream_ref(golomb_stream, x - stream_ref(golomb_stream, stream_ref(golomb_stream, x - 1) - 1));
    }, integers_from(1));
});// your answer here

display("********* TASK6 ***********");

display(eval_stream(golomb_stream, 12));
