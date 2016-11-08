// Task 1
// Your solution

// Reminder: a,b, are integers (NOT BigInt)

function solve_ax_plus_by_eq_1(a, b) {
    // Your program here!
    if(b === 0){
        return pair(1,0);
    } else {
        var quotient = Math.floor(a / b);
        var remainder = a % b; //tail(divided);
        var next = solve_ax_plus_by_eq_1(b, remainder);

        var x_prime = head(next);
        var y_prime = tail(next);
        return pair(y_prime, x_prime - quotient * y_prime);
    }
}

// Test your function
display(solve_ax_plus_by_eq_1(233987973, 41111687));

// Check your answer, you should get 1
var x_y = solve_ax_plus_by_eq_1(233987973, 41111687);
display((233987973 * head(x_y)) + (41111687 * tail(x_y)));

// Check that random key pairs can be generated and used
// Your demonstration here
display((make_RSA_key_pair_generator(solve_ax_plus_by_eq_1))(head(x_y), tail(x_y)));

// Task 1: (-1) Did not demonstrate that key pair can be used to encrypt and decrypt.

// Task 2
// Reminder: a,b, are integers (NOT BigInt)
function solve_ax_plus_by_eq_1(a, b) {
    // Copy and paste your definition from Task 1 here!
    if(b === 0){
        return pair(1,0);
    } else {
        var quotient = Math.floor(a / b);
        var remainder = a % b; //tail(divided);
        var next = solve_ax_plus_by_eq_1(b, remainder);

        var x_prime = head(next);
        var y_prime = tail(next);
        return pair(y_prime, x_prime - quotient * y_prime);
    }
}

// Your solution

function crack_rsa(key) {
    // Your program here!
    var n = int_to_bigInt(head(key));

    var p = smallest_divisor(n);
    var q = int_to_bigInt(bigInt_to_int(n) / bigInt_to_int(p));
    var m = mult(addInt(p, -1), addInt(q, -1));
    var e = int_to_bigInt(tail(key));
    var d = invert_modulo(solve_ax_plus_by_eq_1, e, m);

    return make_key(n, d);
}


// Test your function
display(crack_rsa(key_pair_public(test_key_pair1)));
display("EXPECTED ANSWER: "+key_pair_private(test_key_pair1));
display(crack_rsa(key_pair_public(test_key_pair2)));
display("EXPECTED ANSWER: "+key_pair_private(test_key_pair2));
