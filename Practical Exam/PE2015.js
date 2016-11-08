//********************************
//          Question 1
//********************************

//Part A
function make_2D_zero_array(row, col) {
    function make_cols(cols, acc) {
        if(cols === 0) {
            return acc;
        } else {
            acc.push(0);
            return make_cols(cols - 1, acc);
        }
    }
    function make_rows(rows, acc) {
        if(rows === 0) {
            return acc;
        } else {
            acc.push(make_cols(col, []));
            return make_rows(rows - 1, acc);
        }
    }

    return make_rows(row, []);
}

display(make_2D_zero_array(3, 5));
// Returns a 2D array equal to
// [[0, 0, 0, 0, 0],
// [0, 0, 0, 0, 0],
// [0, 0, 0, 0, 0]].

//Part B
function num_of_live_neighbours(game, n, r, c) {
    var directions_to_check =
        list(pair(-1, -1),
             pair(0, -1),
             pair(1, -1),
             pair(-1, 0),
             pair(1, 0),
             pair(-1, 1),
             pair(0, 1),
             pair(1, 1));

    var neighbours = map(function(direction){
        var dx = head(direction);
        var dy = tail(direction);

        var new_x = (r + dx + n) % n;
        var new_y = (c + dy + n) % n;

        return game[new_x][new_y];
    }, directions_to_check);

    var number_of_alive = length(filter(function(x){ return x === 1; }, neighbours));

    return number_of_alive;
}

var game1 = [[0, 0, 0, 0],
 [0, 1, 0, 0],
 [0, 0, 1, 1],
 [0, 0, 0, 1]];
display(num_of_live_neighbours(game1, 4, 2, 2));
// Returns 3.
display(num_of_live_neighbours(game1, 4, 1, 0));
// Returns 2.
display(num_of_live_neighbours(game1, 4, 3, 3));
// Returns 2.


//Part C

/*
1) Any live cell with fewer than two live neighbours dies, as if caused by under-population.
2) Any live cell with two or three live neighbours lives on to the next generation.
3) Any live cell with more than three live neighbours dies, as if by over-population.
4) Any dead cell with exactly three live neighbours becomes a live cell, as if by
reproduction.
*/

function is_alive(cell) {
    return cell === 1;
}
function cell_under_populate(neighbour) {
    return neighbour < 2;
}
function cell_over_populate(neighbour) {
    return neighbour > 3;
}
function cell_will_live(neighbour) {
    return neighbour === 2 || neighbour === 3;
}
function cell_will_come_alive(neighbour) {
    return neighbour === 3;
}

function next_generation(game, n) {
    var new_game = [];

    function loop_row(r) { //g as in whole game array, i as in row number
        function loop_col(c) { //r as in individial rows array, j as in col number
            if (c >= n) {
                ;
            } else {
                var cell = game[r][c];
                var no_of_alive_neigh = num_of_live_neighbours(game, n, r, c);
                new_game[r][c] = (is_alive(cell))
                                 ? (cell_under_populate(no_of_alive_neigh))
                                    ? 0
                                    : (cell_will_live(no_of_alive_neigh))
                                        ? 1
                                        : (cell_over_populate(no_of_alive_neigh))
                                          ? 0
                                          : 1
                                 : (cell_will_come_alive(no_of_alive_neigh))
                                    ? 1
                                    : 0;

                loop_col(c + 1);
            }
        }

        if (r >= n){
            ;
        } else {
            new_game[r] = [];
            loop_col(0);
            loop_row(r + 1);
        }
    }

    loop_row(0);
    return new_game;
}

var game1 = [[0, 0, 0, 0],
 [0, 1, 0, 0],
 [0, 0, 1, 1],
 [0, 0, 0, 1]];

display(next_generation(game1, 4));
// Returns a 2D array equal to
// [[0, 0, 0, 0],
// [0, 0, 1, 0],
// [1, 0, 1, 1],

var game2 = [[0, 0, 0, 0, 0],
 [0, 1, 1, 1, 0],
 [0, 0, 1, 0, 0],
 [0, 1, 1, 1, 0],
 [0, 0, 0, 0, 0]];
display(next_generation(game2, 5));
// Returns a 2D array equal to
// [[0, 0, 1, 0, 0],
// [0, 1, 1, 1, 0],
// [0, 0, 0, 0, 0],
// [0, 1, 1, 1, 0],
// [0, 0, 1, 0, 0]].

//********************************
//          Question 2
//********************************

//Part A

function make_first_line(words, page_width) {
    function helper(acc, remaining) {
        if(is_empty_list(remaining)) {
            return pair(acc, []);
        } else {
            var temp = (acc === "")
                        ? head(remaining)
                        : acc + " " + head(remaining);

            if(temp.length > page_width) {
                return pair(acc, remaining);
            } else {
                return helper(temp, tail(remaining));
            }
        }
    }

    return helper("", words);
}

var words = list("aa", "bbb", "cccc", "ddd", "ee");
display(make_first_line(words, 13));
// Returns a result equal to
// pair("aa bbb cccc", list("ddd", "ee")).
display(make_first_line(words, 100));
// Returns a result equal to
// pair("aa bbb cccc ddd ee", []).

//Part B
function make_lines(words, page_width) {
    if(is_empty_list(words)) {
        return [];
    } else {
        var first_line_with_remains = make_first_line(words, page_width);
        var remains = tail(first_line_with_remains);
        var first_line = head(first_line_with_remains);

        return pair(first_line, make_lines(remains, page_width));
    }
}

var words = list("aa", "bbb", "cccc", "ddd", "ee");
display(make_lines(words, 13));
// Returns a result equal to
// list("aa bbb cccc", "ddd ee").
display(make_lines(words, 100));
// Returns a result equal to
// list("aa bbb cccc ddd ee").

//Part C
function tail_n_times(xs, n) {
    if(is_empty_list(xs) ) {
        return [];
    } else if (n === 0) {
        return xs;
    } else {
        return tail_n_times(tail(xs), n - 1);
    }
}

function make_pages(lines, page_height) {
    function helper(xs, n) {
        if(is_empty_list(xs) || n === 0){
            return [];
        } else {
            return pair(head(xs), helper(tail(xs), n - 1));
        }
    }

    if(is_empty_list(lines)) {
        return [];
    } else {
        return pair(helper(lines, page_height), make_pages(tail_n_times(lines, page_height), page_height));
    }
}

var lines = list("aa aaaa aa aaaa aa",
 "bbbb bb bbb bbbbb",
 "cccc ccccc cccc",
 "dddddd dd ddd dd",
 "eeee eee eeee eee",
 "ff ffff ffff fffff",
 "ggggg gg");
display(make_pages(lines, 3));
// Returns a result equal to
// list(list("aa aaaa aa aaaa aa",
// "bbbb bb bbb bbbbb",
// "cccc ccccc cccc"),
// list("dddddd dd ddd dd",
// "eeee eee eeee eee",
// "ff ffff ffff fffff"),
// list("ggggg gg")
// );

//Part D
function page_format(words, page_width, page_height) {
    return make_pages(make_lines(words, page_width), page_height);
}

var words = list("aa", "aaaa", "aa", "aaaa", "aa",
 "bbbb", "bb", "bbb", "bbbbb",
 "cccc", "ccccc", "cccc",
 "dddddd", "dd", "ddd", "dd",
 "eeee", "eee", "eeee", "eee",
 "ff", "ffff", "ffff", "fffff",
 "ggggg", "gg");
display(page_format(words, 18, 3));
// Returns a result equal to
// list(list("aa aaaa aa aaaa aa",
// "bbbb bb bbb bbbbb",
// "cccc ccccc cccc"),
// list("dddddd dd ddd dd",
// "eeee eee eeee eee",
// "ff ffff ffff fffff"),
// list("ggggg gg")
// );

//********************************
//          Question 3
//********************************

//Part A
function is_prefix_of(sub, seq) {
    if(is_empty_list(sub)) {
        return true;
    } else if(is_empty_list(seq)) {
        return false;
    } else {
        if(head(sub) === head(seq)) {
            return is_prefix_of(tail(sub), tail(seq));
        } else {
            return false;
        }
    }
}

display(is_prefix_of(list("a", "b", "c"),
 list("a", "b", "c", "d", "e")));
// Returns true.
display(is_prefix_of(list("b", "c"),
 list("a", "b", "c", "d", "e")));
// Returns false.
display(is_prefix_of(list("a", "b", "c"),
 list("a", "b", "c")));
// Returns true.
display(is_prefix_of(list("a", "b", "c"),
 list("a", "b")));
// Returns false.
display(is_prefix_of(list(), list("a", "b", "c")));
// Returns true.
display(is_prefix_of(list(), list()));
// Returns true.

//Part B
function sublist_replace(new_sub, old_sub, seq) {
    if(is_empty_list(seq)) {
        return [];
    } else {
        if(is_prefix_of(old_sub, seq)) {
            return append(new_sub,
                          sublist_replace(new_sub, old_sub, tail_n_times(seq, length(old_sub))));
        } else {
            return pair(head(seq), sublist_replace(new_sub, old_sub, tail(seq)));
        }
    }
}

display(sublist_replace(list("x"), list("a", "b", "a"),
 list("a", "b", "a", "b", "a", "b", "a")));
// Returns a result equal to
// list("x", "b", "x").
display(sublist_replace(list("x", "y", "z"), list("a", "b"),
 list("a", "b", "c", "d", "e", "a", "b")));
// Returns a result equal to
// list("x", "y", "z", "c", "d", "e", "x", "y", "z").
display(sublist_replace(list("x", "y"), list("p", "q", "r"),
 list("a", "b", "a", "b", "a", "b", "a")));
// Returns a result equal to
// list("a", "b", "a", "b", "a", "b", "a").

//********************************
//          Question 4
//********************************

//Part A
function is_subseq_at(sub, seq, start_pos) {
    var sub_l = sub.length;
    var seq_l = seq.length;

    var is_subseq = true;
    for (var i = 0; i < sub_l && i < seq_l; i = i + 1) {
        is_subseq = is_subseq && (sub[i] === seq[i + start_pos]);
    }

    return is_subseq && i >= sub_l;

}

display(is_subseq_at(["a", "b", "c"],
 ["a", "b", "c", "d", "e"], 0));
// Returns true.
display(is_subseq_at(["b", "c"],
 ["a", "b", "c", "d", "e"], 1));
// Returns true.
display(is_subseq_at(["a", "b", "c"],
 ["a", "a", "a", "b", "c"], 2));
// Returns true.
display(is_subseq_at(["a", "b", "c"],
 ["a", "b", "c", "a", "b", "c"], 4));
// Returns false.
display(is_subseq_at(["a", "b", "c"],
 ["a", "a", "b", "b", "c"], 1));
// Returns false.
display(is_subseq_at(["a", "a", "b", "b", "c"],
 ["a", "b", "c"], 1));
 // Returns false
display(is_subseq_at([],
 ["a", "b", "c"], 1));
// Returns true.

//Part B
function subarray_replace(new_sub, old_sub, seq) {
    function replace_at(index) {
        for (var j = 0; j < new_sub.length; j = j + 1) {
            seq[index + j] = new_sub[j];
        }
    }
    var seq_l = seq.length;
    for (var i = 0; i < seq_l; i = i + 1) {
        if(is_subseq_at(old_sub, seq, i)) {
            replace_at(i);
            i = i + new_sub.length;
        } else {
            ;
        }
    }

    return seq;
}

var seq = ["a", "b", "a", "b", "a", "b", "a"];
display(subarray_replace(["x", "y", "z"], ["a", "b", "a"], seq));
//seq; // Equal to the array
 // ["x", "y", "z", "b", "x", "y", "z"].
var seq = ["a", "b", "a", "b", "a", "b", "a"];
display(subarray_replace(["x", "y", "a"], ["a", "b", "a"], seq));
//seq; // Equal to the array
 // ["x", "y", "a", "b", "x", "y", "a"].
var seq = ["a", "b"];
display(subarray_replace(["x", "y"], ["a", "b"], seq));
//seq; // Equal to the array
 // ["x", "y"].
var seq = ["a", "b", "a", "b", "a", "b", "a"];
display(subarray_replace(["x", "y"], ["a", "a"], seq));
//seq; // Equal to the array
 // ["a", "b", "a", "b", "a", "b", "a"].
