// Task 1
// Your solution

// Crack Spy's public key

var Spy_public_key_int = tail(head(tail(tail(tail(suspects)))));
var Spy_public_key = make_key(
                        bigInt_to_int(key_modulus(Spy_public_key_int)),
                        bigInt_to_int(key_exponent(Spy_public_key_int))
                     );
var Spy_private_key = crack_rsa(Spy_public_key);

// Forge a message
var msg = "Mission Complete, Whisky and Heaven now!";
var forged_msg_Spy_to_Darth = encrypt_and_sign(msg, Spy_private_key, Darth_public_key);

// Test your functions
display(Spy_private_key);
display(forged_msg_Spy_to_Darth);
display(authenticate_and_decrypt(forged_msg_Spy_to_Darth, Spy_public_key, Darth_private_key)); // Did you get back the same forged message?

// Task 2
// Your explanation here!

/*

When you encrypt and sign,
an attacker C could easily intercept the message
remove existing signature and attach its own signature.
even without knowing the content of the message.

*/

// Task 3
// Remember to make use of timed()
function modified_generate_RSA_key_pair(x) {
    var size = x;
    var length = add(mult(size, int_to_bigInt(9), size));
    var p = int_to_bigInt(choose_prime(size,size));
    var q = int_to_bigInt(choose_prime(size,size));

    // check that we haven't chosen the same prime twice
    if (equalsBigInt(p,q) === 1) {
        return modified_generate_RSA_key_pair(x);
    } else {
        var n = mult(p,q);
        var m = mult(addInt(p, -1), addInt(q, -1));
        var e = select_exponent(m);
        var d = invert_modulo(e,m);
        // In case either p or q (or both) is not prime

        if(equal(d, "gcd not 1")){
            return modified_generate_RSA_key_pair(x);
        } else {
            return make_key_pair(make_key(n,e), make_key(n,d));
        }
    }
}

// Your estimation here!

function get_public_key_of_prime_length(p_size, base){
    var size = powMod(int_to_bigInt(base),
                      int_to_bigInt(p_size),
                      int_to_bigInt(9999999999));
    var key = modified_generate_RSA_key_pair(size);
    return key_pair_public(key);
}

function test_run(p_size, base){
    var public_key = get_public_key_of_prime_length(p_size, base);
    var time_taken = (timed(crack_rsa))(public_key);
    display("key: " + public_key + " Time Taken: " + time_taken + " ms");
}

function test_run_5_times(p_size, base){

    function iter(n){
        if(n === 0){
            ;
        } else {
            test_run(p_size, base);
            iter(n - 1);
        }
    }

    iter(5);
}

test_run_5_times(2, 7); //4 digits
//test_run_5_times(2, 10); //5 digits
//test_run_5_times(3, 8); //6 digits
//test_run_5_times(3, 10); //7 digits
//test_run_5_times(4, 8); //8 digits
//test_run_5_times(4, 10); //9 digits
//test_run_5_times(5, 8); //10 digits
//test_run_5_times(5, 10); //11 digits


/*

key: 5293,1025 Time Taken: 0 ms
key: 5767,2615 Time Taken: 0 ms
key: 4717,453 Time Taken: 0 ms
key: 8633,6331 Time Taken: 0 ms
key: 7663,1969 Time Taken: 1 ms

key: 33043,1541 Time Taken: 1 ms
key: 20413,3541 Time Taken: 1 ms
key: 29353,13931 Time Taken: 1 ms
key: 28199,2995 Time Taken: 1 ms
key: 31897,9647 Time Taken: 1 ms

key: 762709,93381 Time Taken: 5 ms
key: 472217,210277 Time Taken: 3 ms
key: 559019,127577 Time Taken: 4 ms
key: 834443,660847 Time Taken: 7 ms
key: 495373,352217 Time Taken: 4 ms

key: 2621083,2268761 Time Taken: 9 ms
key: 1631339,707057 Time Taken: 7 ms
key: 3020663,2284721 Time Taken: 10 ms
key: 2301577,2234725 Time Taken: 7 ms
key: 3646579,754907 Time Taken: 11 ms

key: 62816779,7090361 Time Taken: 64 ms
key: 28530527,17181821 Time Taken: 35 ms
key: 28630367,16449931 Time Taken: 42 ms
key: 51762097,33751503 Time Taken: 58 ms
key: 31568057,17029343 Time Taken: 42 ms

key: 290060899,89350097 Time Taken: 130 ms
key: 141988247,110022631 Time Taken: 101 ms
key: 221884913,70120775 Time Taken: 112 ms
key: 206555071,34759085 Time Taken: 94 ms
key: 233767103,169509103 Time Taken: 108 ms

key: 2700851141,863188223 Time Taken: 501 ms
key: 2301648451,1903535981 Time Taken: 286 ms
key: 2224567739,1274229073 Time Taken: 311 ms
key: 3552002297,1236006701 Time Taken: 440 ms
key: 1661574199,1195638023 Time Taken: 311 ms

key: 24252269999,801501595 Time Taken: 1058 ms
key: 13766840779,2092341287 Time Taken: 877 ms
key: 24240702287,121187107 Time Taken: 1169 ms
key: 25411320793,1103120397 Time Taken: 1181 ms
key: 21486224059,1386669437 Time Taken: 910 ms

*/

//when n increase in 2 digits, time taken will approximately multiply by 10.
//for 50 digits, time taken will be about 10^22 ms
//for 100 digits, time taken will be about 10^47 ms
