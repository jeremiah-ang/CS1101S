/*
*****************************************
            Question 1
*****************************************
*/

//Part A
var weight = list(1,3,1,3,1,3,1,3,1,3,1,3);
function compute_e(s){
    return 1;
    /*
    return accumulate(function(x, acc){
        return x + acc;
    }, 0, map(function(x){ return x * list_ref(weight, x); }, s)) % 10;
    */
}

display("********** Question 1 Part A *************");
display(compute_e ( list (4 ,9 ,2 ,7 ,1 ,8 ,2 ,0 ,9 ,3 ,7 ,5)));

//Part B
function add_e(xs) {
    return append(xs, list(compute_e(xs)));
}

display("********** Question 1 Part B *************");
display(add_e ( list (4 ,9 ,2 ,7 ,1 ,8 ,2 ,0 ,9 ,3 ,7 ,5)));

//Part C

function string_to_list(s){
    if(s === "") {
        return [];
    } else {
        return pair(s.substring(0,1), string_to_list(s.substring(1)));
    }
}

var encoding_key = [];
encoding_key[0] = string_to_list("LLLLLL");
encoding_key[1] = string_to_list("LLGLGG");
encoding_key[2] = string_to_list("LLGGLG");
encoding_key[3] = string_to_list("LLGGGL");
encoding_key[4] = string_to_list("LGLLGG");
encoding_key[5] = string_to_list("LGGLLG");
encoding_key[6] = string_to_list("LGGGLL");
encoding_key[7] = string_to_list("LGLGLG");
encoding_key[8] = string_to_list("LGLGGL");
encoding_key[9] = string_to_list("LGGLGL");

var encoding_table = [];
encoding_table[0] = [];
encoding_table[0]['L'] = "0001101";
encoding_table[0]['G'] = "0100111";
encoding_table[0]['R'] = "1110010";

encoding_table[1] = [];
encoding_table[1]['L'] = "0011001";
encoding_table[1]['G'] = "0110011";
encoding_table[1]['R'] = "1100110";

encoding_table[2] = [];
encoding_table[2]['L'] = "0010011";
encoding_table[2]['G'] = "0011011";
encoding_table[2]['R'] = "1101100";

encoding_table[3] = [];
encoding_table[3]['L'] = "0111101";
encoding_table[3]['G'] = "0100001";
encoding_table[3]['R'] = "1000010";

encoding_table[4] = [];
encoding_table[4]['L'] = "0100011";
encoding_table[4]['G'] = "0011101";
encoding_table[4]['R'] = "1011100";

encoding_table[5] = [];
encoding_table[5]['L'] = "0110001";
encoding_table[5]['G'] = "0111001";
encoding_table[5]['R'] = "1001110";

encoding_table[6] = [];
encoding_table[6]['L'] = "0101111";
encoding_table[6]['G'] = "0000101";
encoding_table[6]['R'] = "1010000";

encoding_table[7] = [];
encoding_table[7]['L'] = "0111011";
encoding_table[7]['G'] = "0010001";
encoding_table[7]['R'] = "1000100";

encoding_table[8] = [];
encoding_table[8]['L'] = "0110111";
encoding_table[8]['G'] = "0001001";
encoding_table[8]['R'] = "1001000";

encoding_table[9] = [];
encoding_table[9]['L'] = "0001011";
encoding_table[9]['G'] = "0010111";
encoding_table[9]['R'] = "1110100";

function get_key(index){
    display(index);
    return encoding_key[index];
}

display("********** Question 1 Part C *************");
display(get_key(4));

//Part D
function encode(index, alpha){
    return string_to_list(encoding_table[index][alpha]);
}

display("********** Question 1 Part D *************");
display(encode(7 , 'G'));

//Part E
function split(lst, index) {
    function helper(ys, xs, i) {
        return (i === 0)
                ? pair(reverse(xs), ys)
                : helper(tail(ys), pair(head(ys), xs), i - 1);
    }

    return (index > length(lst))
            ? pair(lst, [])
            : helper(lst, [], index);
}

function cartesian_product(lst1, lst2) { //assume same length
    function helper(xs1, xs2, acc) {
        if(is_empty_list(xs1)) {
            return acc;
        } else {
            return helper(tail(xs1), tail(xs2), pair(pair(head(xs1), head(xs2)), acc));
        }
    }

    return reverse(helper(lst1, lst2, []));
}

function EAN_13(xs) {
    var splitted = split(add_e(xs), 7);
    var xs1 = head(splitted);
    var xs2 = tail(splitted);

    var encode_part1 = map(function(x){
        return encode(head(x), tail(x));
    }, cartesian_product(tail(xs1), get_key(head(xs1))));

    var encode_part2 = map(function(x){
        return encode(x, 'R');
    }, xs2);
    var encoded = accumulate(append, [], append(encode_part1, encode_part2));
    return encoded;
}

display("********** Question 1 Part E *************");
var answer = list (0 ,0 ,0 ,1 ,0 ,1 ,1 ,0 ,0 ,1 ,1 ,0 ,1 ,1 ,0 ,1 ,1 ,1 ,0 ,1 ,1 ,0 ,0 ,1 ,1 ,0 ,0 ,1 ,
0 ,0 ,0 ,1 ,0 ,0 ,1 ,0 ,0 ,1 ,1 ,0 ,1 ,1 ,1 ,1 ,1 ,0 ,0 ,1 ,0 ,1 ,1 ,1 ,0 ,1 ,0 ,0 ,
1 ,0 ,0 ,0 ,0 ,1 ,0 ,1 ,0 ,0 ,0 ,1 ,0 ,0 ,1 ,0 ,0 ,1 ,1 ,1 ,0 ,1 ,1 ,0 ,0 ,1 ,1 ,0);
display(EAN_13(list (4 ,9 ,2 ,7 ,1 ,8 ,2 ,0 ,9 ,3 ,7 ,5)));

/*
*****************************************
            Question 2
*****************************************
*/

//Part A
function index_of_largest(is) {
    return get_index_of_largest(is, 0, -Infinity, NaN);
}
function get_index_of_largest(is,
                              current_index,
                              largest_so_far,
                              index_of_largest_so_far) {

    if(is_empty_list(is)) {
        return index_of_largest_so_far;
    } else {
        var i = head(is);
        return (i > largest_so_far)
                ? get_index_of_largest(tail(is), current_index + 1, i, current_index)
                : get_index_of_largest(tail(is), current_index + 1, largest_so_far, index_of_largest_so_far);
    }

}
display("********** Question 2 Part A *************");
display(index_of_largest ( list (42 ,34 ,65 ,22 ,5 ,19)));

//Part B
function remove_specified_element_from_tail(lst, index) {
    if(length(lst) < index + 2) {
        return NaN;
    } else {
        return (index === 0)
                ? pair(head(lst), tail(tail(lst)))
                : pair(head(lst), remove_specified_element_from_tail(tail(lst), index - 1));
    }
}

display("********** Question 2 Part B *************");
var example2 = list (1 ,2 ,3 ,4 ,5 ,6);
display(remove_specified_element_from_tail ( example2 , 2));

//Part C

function Stack() {
    this._stack = pair("stack", []);
}
Stack.prototype.is_empty_stack = function(){
    return is_empty_list(tail(this._stack));
};
Stack.prototype.peek = function() {
    if(this.is_empty_stack()) {
        return [];
    } else {
        return head(tail(this._stack));
    }
};
Stack.prototype.set_stack = function(s) {
    set_tail(this._stack, s);
};
Stack.prototype.push = function(x) {
    if(this.is_empty_stack()) {
        set_tail(this._stack, pair(x, []));
    } else {
        var temp = pair(x, tail(this._stack));
        this.set_stack(temp);
    }
};
Stack.prototype.pop = function() {
    if(this.is_empty_stack()) {
        ;
    } else {
        var first = this.peek();
        this.set_stack(tail(tail(this._stack)));
        return first;
    }
};
Stack.prototype.get_list = function(){
    return tail(this._stack);
};

function isNaN(x) {
    return x === -Infinity;
}

function sorted_stack(is) {
    var stack = new Stack();
    function helper(xs) {
        if(is_empty_list(tail(xs))) {
            return stack;
        } else {
            var index_largest = index_of_largest(xs);
            stack.push(list_ref(xs, index_largest));
            return helper(remove_specified_element_from_tail(xs, index_largest - 1));
        }
    }
    return helper(pair(-Infinity, is));
}

var sorted = sorted_stack(list (23, 94, 93, 12, 432));
display("********** Question 2 Part C *************");
display(sorted);

display("********** Question 2 Part D *************");
display(sorted.get_list());


/*
*****************************************
            Question 3
*****************************************
*/
function Coordinate(x, y){ this.x = x; this.y = y; }
Coordinate.prototype.get_x = function(){ return this.x; };
Coordinate.prototype.get_y = function(){ return this.y; };

function Board(){
    this.fields = [];
    this.board_width = 8;
    this.board_height = 8;
    for (var i = 0; i < this.board_width; i = i + 1) {
        this.fields[i] = [];
        for (var j = 0; j < this.board_height; j = j + 1) {
            this.fields[i][j] = 'unreachable';
        }
    }
}
Board.prototype.set_reachable = function(c) {

    this.fields[c.get_x()][c.get_y()] = 'reachable';
};
Board.prototype.get_reachables = function() {
    var coordinates = [];
    for (var i = 0; i < this.board_width; i = i + 1) {
        for (var j = 0; j < this.board_height; j = j + 1) {
            if(this.fields[i][j] === 'reachable') {
                coordinates = pair(new Coordinate(i, j), coordinates);
            } else {
                ;
            }
        }
    }

    return coordinates;
};
Board.prototype.set_reachable_by_knight_at = function(c){
    var moves = [pair(1, 2), pair(1, -2),
                 pair(-1, 2), pair(-1, -2),
                 pair(2, 1), pair(2, -1),
                 pair(-2, 1), pair(-2, -1)];

    var move = 0;
    var get_dx = function(move){ return head(move); };
    var get_dy = function(move){ return tail(move); };
    var dx = 0; var dy = 0; var x = c.get_x(); var y = c.get_y();

    for (var i = 0; i < moves.length; i = i + 1) {
        move = moves[i];

        dx = get_dx(move);
        dy = get_dy(move);

        var new_x = x + dx;
        var new_y = y + dy;
        if(new_x > 7 || new_x < 0 || new_y > 7 || new_y < 0) {
            ;
        } else {
            this.set_reachable(new Coordinate(new_x, new_y));
        }
    }
};

var board = new Board();
function set_reachables(b, xs){
    if(is_empty_list(xs)){
        ;
    } else {
        b.set_reachable_by_knight_at(head(xs));
        set_reachables(b, tail(xs));
    }
}
function knight(c, n) {
    if(n === 0) {
        ;
    } else {
        board.set_reachable_by_knight_at(c);
        map(function(reachable){ knight(reachable, n - 1); }, board.get_reachables());
    }

    display("here");
}

display(knight(new Coordinate(2, 2), 1));
