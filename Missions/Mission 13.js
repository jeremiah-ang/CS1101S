// Task 1

// Function type: Number -> Pair(Number, Number)
// where input is between 0 - 10 inclusive, where 0 - 9 represent the digits
// and 10 represents #

function get_dtmf_frequencies(digit) {
    // your solution goes here

    var x_axis = list(1209, 1366, 1477);
    var y_axis = list(697, 770, 852, 941);

    var col_num = (digit === 0)
                  ? 3
                  : Math.floor((digit - 1) / 3);
    var row_num = (digit === 0)
                  ? 1
                  : (digit === 10)
                    ? 2
                    : Math.floor((digit - 1) % 3);

    var dtmf_tone = pair(list_ref(x_axis, row_num),
                         list_ref(y_axis, col_num));
    return dtmf_tone;
}

display(get_dtmf_frequencies(10));


// Task 2
function create_dtmf_tone(frequency_pair) {
    // your solution goes here
    var duration = 0.2;
    var frequencies = map(function(freq) {
                            return sine_sound(freq, duration);
                          }, (function() {
                                return list(
                                    head(frequency_pair),
                                    tail(frequency_pair));
                            })());

    return simultaneously(frequencies);
}

play(create_dtmf_tone(get_dtmf_frequencies(1)));

// Task 3
function dial(list_of_digits) {
    // your solution goes here
    var pause_duration = 0.1;
    var pause = silence(pause_duration);
    var list_of_dtmf_tones = accumulate(function(x, accu) {
                                            return pair(create_dtmf_tone(get_dtmf_frequencies(x)),
                                                        pair(pause,
                                                             accu));
                                        }, [], list_of_digits);
    return consecutively(list_of_dtmf_tones);

}

// Test
// play(dial(list(6,2,3,5,8,5,7,7)));

// Task 4
function dial_all(list_of_numbers) {
    // your solution goes here
    var Darth_number = list(1,8,0,0,5,2,1,1,9,8,0);

    var filtered = filter(function(numbers){
        return (!equal(numbers, Darth_number));
    }, list_of_numbers);

    var dtmf_tones = map(function(numbers) {
        return dial(numbers);
    }, filtered);

    var hash = dial(list(10));
    var hash_inserted = accumulate(function(x, accu) {
        return pair(x, pair(hash, accu));
    }, [], dtmf_tones);

    return consecutively(hash_inserted);
}

// Test
/*
 play(dial_all(
  list(
      list(1,8,0,0,5,2,1,1,9,8,0,0),
      list(6,2,3,5,8,5,7,7),
      list(0,0,8,6,1,3,7,7,0,9,5,0,0,6,1))
  ));
*/
