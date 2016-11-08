//Task 1

function fold(xs){
    if(is_empty_list(tail(xs))){
        return [];
    } else {
        return pair(head(tail(xs)) - head(xs), fold(tail(xs)));
    }
}
function last_of(xs){
    return head(reverse(xs));
}
function build(xs){
    if(is_empty_list(tail(xs))){
        return pair(head(xs), []);
    } else {
        return pair(last_of(xs), build(fold(xs)));
    }
}
function get_next(builded){
    var next_builded = accumulate(function(x, acc){
        return (is_empty_list(acc))
                ? pair(x, acc)
                : pair(x + head(acc), acc);
    }, [], builded);
    return pair(head(next_builded), function(){ return get_next(next_builded); });
}
function regenerate_truncated_whisper(tw) {
    return stream_append(list_to_stream(tw), get_next(build(tw)));
}

//display(regenerate_truncated_whisper(list(9, 6, -5, -18, -27)));
 display("************** Task 1: Regnerate Truncated Whisper **************");
 display(eval_stream(regenerate_truncated_whisper(list(9, 6, -5, -18, -27)), 9));
// [9, [6, [-5, [-18, [-27, [-26, [-9, [30, [97, []]]]]]]]]]

// Task 2

function solve_next(x0, s, distance){
    return (is_empty_list(s))
            ? []
            : (!is_number(head(s)))
                ? solve_next(x0, stream_tail(s), distance + 1)
                : x0 + ((head(s) - x0) / distance);
}
function interpolate_fixed(fixed){
    return get_next(build(reverse(stream_to_list(fixed))));
}
function regenerate(fixed, cw){
    var new_fixed = pair(head(cw), function(){ return fixed; });
    return pair(head(cw), function(){
        var next = stream_tail(cw);
        if(is_empty_list(next)){
            return interpolate_fixed(new_fixed);
        } else {
            var next_value = solve_next(head(cw), next, 1);
            return (is_empty_list(next_value))
                    ? interpolate_fixed(new_fixed)
                    : regenerate(new_fixed, pair(next_value, tail(next)));

        }
    });
};

function regenerate_corrupted_whisper(cw) {
    return regenerate([], cw);
}

var corrupted_whisper = list_to_stream(list(4, false, 6, false, false, false, -2, false, -2.5, false, false));

 display("************** Task 2: Regnerate Corrupted Truncated Whisper **************");
 display(eval_stream(regenerate_corrupted_whisper(corrupted_whisper), 13));
 display(eval_stream(regenerate_corrupted_whisper(list_to_stream(list(5))), 5));
//[4, [5, [6, [4, [2, [0, [-2, [-2.25, [-2.5, [-18.5, [-86.5, [-249, [-495.5, []]]]]]]]]]]]]]
// display(eval_stream(regenerate_corrupted_whisper(list_to_stream(list(5))), 5));
//[5, [5, [5, [5, [5, []]]]]]

// Task 3

function radius_calculator(r) {
    var k = r - 0.5;
    var m = 1 + 2 * k;
    return function(a_prev, a, a_next) {
        return (k <= 0)
                ? a
                : ((a_prev * k) + a + (a_next * k)) / m;
    };
}
function next_smooth(a_prev, current_stream, calculator){
    var a = head(current_stream);
    var next_stream = stream_tail(current_stream);
    var a_next = head(next_stream);
    return pair(calculator(a_prev, a, a_next), function(){
        return next_smooth(a, next_stream, calculator);
    });
}
function smooth(s, r, n){
    var calculator = radius_calculator(r);
    var next_stream = stream_tail(s); //non-empty, infinte
    var next_term = head(next_stream);
    var first_term = head(s);

    var smoothed = pair(calculator(first_term, first_term, next_term), function(){
        return next_smooth(first_term, next_stream, calculator);
    });

    return (n === 0)
            ? smoothed
            : smooth(smoothed, r, n - 1);
}

function smooth_regenerated_whisper(rw, rad, iter) {
    return smooth(rw, rad, iter - 1);
}


 display("************** Task 3: Smooth Regnerated Whisper **************");
 display(eval_stream(smooth_regenerated_whisper(regenerate_truncated_whisper(list(4, 7, 2, 5, 8)), 1, 1), 10));
//[4.75, [5, [4, [5, [0, [-43, [-180, [-491, [-1080, [-2075, []]]]]]]]]]]

 display(eval_stream(smooth_regenerated_whisper(regenerate_truncated_whisper(list(4, 7, 2, 5, 8)), 1, 2), 10));
//[4.8125, [4.6875, [4.5, [3.5, [-9.5, [-66.5, [-223.5, [-560.5, [-1181.5, [-2214.5, []]]]]]]]]]]

 display(eval_stream(smooth_regenerated_whisper(regenerate_truncated_whisper(list(4, 7, 2, 5, 8)), 1.5, 2), 4));
//[4.777777777777778, [4.666666666666667, [4.666666666666667, [2.333333333333334, []]]]]
