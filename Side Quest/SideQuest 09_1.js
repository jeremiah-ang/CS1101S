// Task 1

function characters(keyword){
    var original_alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var original_alphabets_list = string_to_list(original_alphabets);

    var keyword_list = string_to_list(uppercase(keyword));
    function apply_substitution(kw_lst, lst){
        if(is_empty_list(lst) || is_empty_list(kw_lst)){
            return lst;
        } else {
            var char = head(kw_lst);
            return pair(
                        char,
                        apply_substitution(
                            tail(kw_lst),
                            remove_all(char, lst)
                        )
                   );
        }
    }

    if(is_empty_list(keyword_list) || keyword === ""){
        return original_alphabets_list;
    } else {
        return apply_substitution(keyword_list, append(keyword_list, original_alphabets_list));
    }
}

function character_at(position, character_list){
    var list_length = length(character_list);
    var index = modulo(position + char_code('A'), list_length);
    return list_ref(character_list, index);
}

function index_of(character, character_list){

    function iter(count, lst){
        return (is_empty_list(lst))
                ? -1
                : (character === head(lst))
                    ? count + char_code('A')
                    : iter(count + 1, tail(lst));
        }

    return iter(0, character_list);
}

function caesar_substitution_transform(transformation, keyword, text){

    var character_list = characters(keyword);
    function map_transformation(item){
        return transformation(item, character_list);
    }

    return list_to_string_without_brackets(
                map(
                    map_transformation,
                    string_to_list(text)
                )
            );
}

function caesar_substitution_encrypt(shift_length, keyword, original_message){

    function transform(character, character_list){
        if(is_alpha(character)){
            var index = char_code(uppercase(character)) + shift_length;
            return character_at(index, character_list);
        } else {
            return character;
        }
    }

    return caesar_substitution_transform(transform, keyword, original_message);
}

function caesar_encrypt(shift_length, original_message) {
    // Your program here!
    return caesar_substitution_encrypt(shift_length, "", original_message);
}

function caesar_decrypt(shift_length, encrypted_message) {
    // Your program here!
    return caesar_encrypt(-shift_length, encrypted_message);
}


function mixed_encrypt(keyword, original_message) {
    // Your program here!
    return caesar_substitution_encrypt(0, keyword, original_message);
}

function mixed_decrypt(keyword, encrypted_message) {
    // Your program here!
    var original_character_list = characters("");

    function transform(character, character_list){
        if(is_alpha(character)){
            var index = index_of(character, character_list);
            if(index > -1) {
                return character_at(index, original_character_list);
            } else {
                return character;
            }
        } else {
            return character;
        }
    }

    return caesar_substitution_transform(transform, keyword, encrypted_message);
}


// Task 2

function invalid_input(){
    return "INVALID_INPUT";
}

function create_substitution_cipher_encrypt(func_get_charmap) {
    // Your function here!

    return function(key, original_message){

        var dictionaries = func_get_charmap(key);
        var original_dictionary = head(dictionaries);
        var cipher_dictionary = tail(dictionaries);

        var message_list = string_to_list(original_message);
        return map(function(character){
                    var index = index_of(character, original_dictionary);
                    var new_character = character_at(index, cipher_dictionary);
                }, message_list);
    };

}

function create_substitution_cipher_decrypt(func_get_charmap) {
    // Your function here!

}

// Test your functions

display(caesar_encrypt(3, "the quick brown fox jumps over the lazy dog"));
display(caesar_decrypt(3, caesar_encrypt(3, "the quick brown fox jumps over the lazy dog")));

// Test your functions
display(mixed_encrypt("zebras", "flee at once. we are discovered!"));
display(mixed_decrypt("zebras", mixed_encrypt("zebras", "flee at once. we are discovered!")));


// Alternate definitions for caesar_encrypt and caesar_decrypt
 var s1 = function(key){
    var original_alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var original_alphabets_list = string_to_list(original_alphabets);
    var char_z =

    map(function(character){
        return character
    }, original_alphabets_list)

 }// Your definition here!
 var caesar_encrypt = create_substitution_cipher_encrypt(s1);
 var caesar_decrypt = create_substitution_cipher_decrypt(s1);

// Alternate definitions for mixed_encrypt and mixed_decrypt
 var s2 = "mixed";// Your definition here!
 var mixed_encrypt = create_substitution_cipher_encrypt(s2);
 var mixed_decrypt = create_substitution_cipher_decrypt(s2);


// Test your functions

display(caesar_encrypt(3, "the quick brown fox jumps over the lazy dog"));
display(caesar_decrypt(3, caesar_encrypt(3, "the quick brown fox jumps over the lazy dog")));

// Test your functions
display(mixed_encrypt("zebras", "flee at once. we are discovered!"));
display(mixed_decrypt("zebras", mixed_encrypt("zebras", "flee at once. we are discovered!")));
