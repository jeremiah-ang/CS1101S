// Task 1
function noise(duration) {
    return make_sourcesound(function(x) {
        if (x >= duration) {
            return 0;
        } else {
            return Math.random() * 2 - 1;
        }
    }, duration);
}

function drum_adsr(duration){
    var attack_time = 0.005;
    var decay_time = (duration >= 0.5)
                      ? 0.495
                      : duration - attack_time;
    var sustain_level = 0;
    var release_time = 0;
    return adsr(attack_time, decay_time, sustain_level, release_time);
}

function snare_drum(note, duration) {
    /* your answer here */
    return (drum_adsr(duration))(sourcesound_to_sound(noise(duration)));
}

function bass_drum(note, duration) {
    /* your answer here */
    var frequencies = list(67, 71, 73, 79, 83, 89);
    var list_of_sine = map(function(x){
                            return sine_sound(x, duration);
                        }, frequencies);

    var ad = drum_adsr(duration);

    return simultaneously(map(ad, list_of_sine));
}

function mute(note, duration) {
    /* your answer here */
    return sourcesound_to_sound(make_sourcesound(function(x){
                                                    return 0;
                                                }, duration));
}

// play(snare_drum(72, 1));
// play(bass_drum(60, 2));
// play(consecutively(list(snare_drum(72, 2), mute(0, 1), bass_drum(60, 2))));


// Task 2
function simplify_rhythm(rhythm) {
    /* your answer here */
    function concat_n(n, string){
        return (n <= 0)
                ? string
                : string + concat_n(n - 1, string);
    }

    if(is_empty_list(rhythm)) {
        return "";
    } else if(is_pair(rhythm)){
        var h = head(rhythm);
        if(is_number(h)){
            var r = simplify_rhythm(tail(rhythm));
            return (h > 0)
                    ? concat_n(h - 1, r)
                    : "";
        } else if(is_string(h)){
            return h + simplify_rhythm(tail(rhythm));
        } else {
            return simplify_rhythm(h) + simplify_rhythm(tail(rhythm));
        }
    } else {
        return rhythm;
    }
}

// test
 var my_rhythm = pair(3, list(pair(2, "1201"), "13013103"));
 display(simplify_rhythm(my_rhythm));

// Task 3
function pair_one_to_one(lst) {
    if(is_empty_list(head(lst))) {
        return [];
    } else {
        return pair(map(head, lst), pair_one_to_one(map(tail, lst)));
    }
}

function percussion(distance, list_of_sounds, rhythm) {
    /* your answer here */
    function rhythm_to_sounds(x){
        return list_ref(list_of_sounds, x);
    }

    var list_of_rhythm = string_to_list_of_numbers(rhythm);
    var list_of_instrument = map(rhythm_to_sounds, list_of_rhythm);

    var instrument_delay_pair = pair_one_to_one(
                                    list(list_of_instrument,
                                    enum_list(0, length(list_of_instrument) - 1)));

    var list_of_samples = map(function(x){
                                  var instrument = head(x);
                                  var delay = head(tail(x));
                                  return consecutively(list(mute(0, delay * distance), instrument));
                              }, instrument_delay_pair);
    return simultaneously(list_of_samples);
}

// test
 var my_mute = mute(60, 2);
   var my_snare_drum = snare_drum(70, 2);
   var my_bass_drum = bass_drum(80, 2);
   var my_bell = bell(72, 2);
//   play(percussion(0.5, list(my_mute, my_snare_drum, my_bass_drum, my_bell), "1210310"));


// Task 4
function pentatonic_scale(note, number_of_notes) {
    /* your answer here */
    function build_scale(previous, next_increment){
        if(is_empty_list(next_increment)){
            return [];
        } else {
            var current = previous + head(next_increment);
            return pair(current, build_scale(current, tail(next_increment)));
        }
    }

    var steps = build_list(number_of_notes - 1, function(x){

        return (x === 0)
                ? 2
                : ((x - 1) % 5) % 2 + 2;
    });
    return pair(note, build_scale(note, steps));
}

// test

var sample = pentatonic_scale(60, 10);
/*   play(consecutively(map(function (note) {
       return trombone(note, 0.5);
   }, sample))); */


// Task 5
function play_matrix(distance, list_of_sounds) {

    /* your answer here */
    function get_values_on_column_n(n, matrix){

        function rotate_matrix(matrix){
            if(is_empty_list(head(matrix))){
                return [];
            } else {
                var acc = map(head, matrix);
                var remainder = map(tail, matrix);
                return pair(acc, rotate_matrix(remainder));
            }
        }

        return list_ref(rotate_matrix(matrix), n);
    }

    function on_interval(col){

        var matrix = get_matrix();
        var column = col % length(head(matrix));
        var column_values = get_values_on_column_n(column, matrix);

        var list_of_music = map(function(x){
            var should_play_sound = head(x);
            return (should_play_sound)
                    ? head(tail(x))
                    : mute(0,0);
        }, pair_one_to_one(list(column_values, list_of_sounds)));

        play_concurrently(simultaneously(list_of_music));

        var delay = column * distance * 1000;
        setTimeout(function(){
            on_interval(column + 1);
        }, 1000 * distance);
    }

    on_interval(0);
}

function stop_matrix() {
    /* your answer here */
    clearAllTimeout();
}

stop_matrix();
var scales = pentatonic_scale(60, 16);
var sounds = map(function (n) { return piano(n, 1); }, scales);
//play_matrix(0.5, sounds); 
