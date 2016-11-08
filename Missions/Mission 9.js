// Task 1
// (a)
// define constructor and selectors
function signed_message(message, signature) {
    return pair(message, signature);
}
function message_of(signed_msg) {
    return head(signed_msg);
}
function signature_of(signed_msg) {
    return tail(signed_msg);
}


// (b)
function encrypt_and_sign(msg, sender_private_key, recipient_public_key) {
    // "Your program here!"
    var encrypted_msg = RSA_encrypt(msg, recipient_public_key);
    var unencrypted_signature = compress(encrypted_msg);
    var encrypted_signature = RSA_transform(unencrypted_signature, sender_private_key);
    return signed_message(encrypted_msg, encrypted_signature);
}

// Test your function
var result2 = encrypt_and_sign("Test message from user 1 to user 2", test_private_key1, test_public_key2);
display("RESULT2: ");
display(result2);
// Result should be
// list(296342791, 45501589, 263575681, 219298391, 4609203, 331301818, 178930017, 242685109, 1345058), 254363563;


// (c)
function not_authentic_signature(){
    return "NON AUTHENTIC SIGNATURE!";
}

function is_valid_signature(signed_message, sender_public_key){
    var unencrypted_signature = compress(message_of(signed_message));
    var sender_signature = RSA_transform(
                            signature_of(signed_message),
                            sender_public_key);

    return (equal(sender_signature + "", unencrypted_signature + ""));
}

function authenticate_and_decrypt(signed_message, sender_public_key, recipient_private_key) {
    // "Your program here!"
    if(is_valid_signature(signed_message, sender_public_key)){
        var msg = RSA_decrypt(message_of(signed_message), recipient_private_key);
        return msg;
    } else {
        return not_authentic_signature();
    }

}

display("AUTHENTICATE AND DECRYPT RESULT2: ");
display(authenticate_and_decrypt(result2, test_public_key1, test_private_key2));
// Result should be
// "Test message from user 1 to user 2  "

var wrong_private_key = Darth_private_key;
var forged_result = encrypt_and_sign("No lesson for week 6", test_public_key2, wrong_private_key);
display("AUTHENTICATE AND DECRYPT FORGED RESULT: ");
display(authenticate_and_decrypt(forged_result, test_public_key1, test_private_key2));



// Task 2
// Your program here!

function find_sender(encrypted_signed_msg, recipient_public_key, recipient_private_key, suspects){

    function find_sender_iter(suspects_list){
        if(is_empty_list(suspects_list)) {
            display("NO SUSPECTS");
        } else {
            var suspect = head(suspects_list);
            var suspect_public_key = tail(suspect);
            var result = authenticate_and_decrypt(
                            encrypted_signed_msg,
                            suspect_public_key,
                            recipient_private_key);

            if(result === not_authentic_signature()) {
                find_sender_iter(tail(suspects_list));
            } else {
                display(head(suspect));
                display(result);
            }
        }
    }

    find_sender_iter(suspects);
}

display("FINDING SENDER & DECRYPT MESSAGE: ");
find_sender(signed_message(received_mystery_message, int_to_bigInt(received_mystery_signature)),
                Darth_public_key,
                Darth_private_key,
                suspects);


//Task 1c: (-1) Did not convert to bigInt before using RSA_transform (line 40).
// Use of undocumented feature
// (line 43) (bigInt) + (String) not guaranteed to return a string representation
// of the number stored as a bigInt. Consider using equalsBigInt()
