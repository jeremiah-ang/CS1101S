/*
***************************************
            Question 1
***************************************
*/

function Bits(xs) {
    this.bits = xs;
}
Bits.prototype.retrieve_bits = function(){ return this.bits; };
Bits.prototype.flip = function(n){
    function helper(xs, count){
        if(is_empty_list(xs)){
            ;
        } else if(count === 0){
            set_head(xs, !head(xs));
        } else {
            helper(tail(xs), count - 1);
        }
    }
    helper(this.bits, n);
};

var bs = new Bits ( list ( true , false , false , false , true , true ));
// bits are now
// list(true,false,false,false,true,true)
bs . flip (3); // flips the bit at position 3 (start counting at 0)
// bits are now the same as
// list(true,false,false,true,true,true)
bs . flip (4); // flips the bit at position 4 (start counting at 0)
// bits are now the same as
// list(true,false,false,true,false,true)

/*
***************************************
            Question 2
***************************************
*/

//Part A
function is_odd(x) {
    return x % 2 === 1;
}
display(is_odd (17)); // returns true
display(is_odd (18)); // returns false

//Part B
function all_false(xs) {
    if(is_empty_list(xs)) {
        return true;
    } else {
        if(head(xs)) {
            return false;
        } else {
            return all_false(tail(xs));
        }
    }
}

display(all_false ( list ( false , true , false , false ))); // returns false
display(all_false ( list ( false , false , false , false ))); // returns true

//Part C
function element_wise_and(xs,ys) {
    return (is_empty_list(xs))
            ? []
            : pair(head(xs) && head(ys), element_wise_and(tail(xs), tail(ys)));
}

display(element_wise_and ( list ( true , false , true , true , false ),
                           list ( true , true , false , true , true )));
// returns list(true, false, false, true, false));

//Part D
function decrement(xs) {
    function helper(lst){
        if(is_empty_list(lst)){
            return [];
        } else {
            if(head(lst)) {
                return pair(false, tail(lst));
            } else {
                return pair(true, helper(tail(lst)));
            }
        }
    }
    return reverse(helper(reverse(xs)));
}
display("========");
display(decrement ( list ( true , false , true , false , false )));
// should return the same list as
// list(true,false,false,true,true)
display(decrement ( list ( true , false , true , false , true )));
// should return the same list as
// list(true,false,true,false,false);
display(decrement ( list ( false , false , false , false , false )));
// should return the same list as
// list(true, true, true, true, true);

//Part E
function count_true(xs) {
    var count = 0;
    function helper(lst) {
        if(all_false(lst)) {
            return count;
        } else {
            count = count + 1;
            return helper(element_wise_and(lst, decrement(lst)));
        }
    }
    return helper(xs);
}

count_true(list ( true , false , true , false , false ));

//Part F
function compute_parity(xs) {
    return is_odd(count_true(xs));
}
var my_bits = list ( true , false , false , true , true , false , true );
display(compute_parity ( my_bits )); // returns false
var your_bits = list ( true , true , false , true , true , false , true );
display(compute_parity ( your_bits )); // returns true

//Part G
function check_parity(xs,p) {
    return compute_parity(xs) === p;
}

var my_bits = list ( true , false , false , true , true , false , true );
display(check_parity ( my_bits , false )); // returns true
var your_bits = list ( true , true , false , true , true , false , true );
display(check_parity ( your_bits , false )); // returns false

//Part H
function error(msg) {
    return msg;
}
function Bits_with_parity ( xs ) {
    Bits.call (this, xs);
    this.error = false;
    this.parity = compute_parity(xs);
}
Bits_with_parity.Inherits(Bits);
Bits_with_parity.prototype.retrieve_bits = function(){
    var bits = Bits.prototype.retrieve_bits.call(this);
    if(!this.error) {
        if (compute_parity(bits) === this.parity) {
            return bits;
        } else {
            this.error = true;
            return error("DATA LOST!");
        }
    } else {
        return bits;
    }
};

display("====================");
var some_bits = new Bits_with_parity ( list ( true , true , false , false , false ));
display(some_bits.retrieve_bits ()); // retrieves original list
some_bits.flip (2); // see Question 1
display(some_bits.retrieve_bits ()); // calls error("DATA LOST")
some_bits.flip (3); // method can only handle one error
display(some_bits.retrieve_bits ()); // we obtain the corrupted list
// list(true,true,true,true,false));

function encode(xs) {
    return accumulate(append, [], map(function(x){ return list(x,x,x); }, xs));
}

display(encode( list ( true , false , false, true, false)));
// returns the same list as
// [true, [true, [true, [false, [false, [false, [false, [false, [false,
// [true, [true, [true, [false, [false, [false, []]]]]]]]]]]]]]]]

function majority_of(xs){
    var a = head(xs);
    var b = head(tail(xs));
    var c = head(tail(tail(xs)));

    return (a)
            ? (b)
                ? true
                : (c)
                    ? true
                    : false
            : (b)
                ? (c)
                    ? true
                    : false
                : false;
}
function decode(xs) {
    function iter(lst, acc) {
        if(is_empty_list(lst)) {
            return acc;
        } else {
            return iter(tail(tail(tail(lst))), pair(majority_of(lst), acc));
        }
    }

    return reverse(iter(xs, []));
}

display(decode( encode ( list ( true , false , true ))));
// returns the original list
// list(true,false,true)

display(" ========= test ===========");
function Bits_encoded ( xs ) {
    Bits.call(this, encode(xs));
}
Bits_encoded.Inherits(Bits);
Bits_encoded.prototype.retrieve_bits = function() {
    return decode(Bits.prototype.retrieve_bits.call(this));
};
var bs = new Bits_encoded(list(true, false, true));
var cs = bs.retrieve_bits(); // cs is list(true,false,true);
display(cs);
bs.flip(3);
var ds = bs.retrieve_bits(); // ds is list(true,false,true);
display(ds);
bs.flip(4);
var es = bs.retrieve_bits(); // es is a corrupted list equal to
display(es);
// list(true,true,true);

function stream_tail(s) {
    if(is_empty_list(s)) {
        return [];
    } else {
        var back = (tail(s))();
        set_tail(s, function(){ return back; });
        return back;
    }
}

//lazy to format them
function stream_map (f , xs ) { // as in stream library
if ( is_empty_list ( xs )) {
return [];
} else {
return pair (f( head ( xs )) ,
function() {
return stream_map (f , stream_tail ( xs ));
});
} }
function stream_ref (xs ,n) { // as in stream library
if (n === 0) {
return head ( xs );
} else {
return stream_ref ( stream_tail ( xs ),n - 1);
} }

var s = stream (1 ,2 ,3 ,4);
var s2 = stream_map (function(x) { display (x); return x + 1; }, s );
var v = stream_ref (s2 ,2); // alert shows 1,2,3
var w = stream_ref (s2 ,3); // alert shows only 4
