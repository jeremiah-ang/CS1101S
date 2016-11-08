// Question 1A

function weighted_sum(digits, weights) {

    function iter(ds, ws, acc){
        if(is_empty_list(ds)){
            return acc;
        } else {
            return iter(tail(ds), tail(ws), head(ds) * head(ws) + acc);
        }
    }

    return iter(digits, weights, 0);
}



// Question 1B

function discard_element(xs, pos) {
    if(pos === 0){
        return tail(xs);
    } else if (is_empty_list(xs)) {
        return [];
    } else if(pos >= length(xs)) {
        return xs;
    } else {
        return pair(head(xs), discard_element(tail(xs), pos - 1));
    }
}



function conv_first_char(x) {
    if (x === "u") {
        return "U";
    } else if (x === "a") {
        return "A";
    } else {
        return x;
    }
}

var U_digit_weights = list(0, 1, 3, 1, 2, 7);
var A_digit_weights = list(1, 1, 1, 1, 1, 1, 1);

var check_digits = list("Y", "X", "W", "U", "R", "N", "M",
                        "L", "J", "H", "E", "A", "B");


// Question 1C

function id_to_matric(id) {

    var prefix = head(id);
    var numbers = (prefix === 'u')
                  ? discard_element(tail(id), 2)
                  : tail(id);

    var ws = (prefix === 'u')
             ? weighted_sum(numbers, U_digit_weights)
             : weighted_sum(numbers, A_digit_weights);

    var r = ws % 13;
    var check_digit = list_ref(check_digits, r);
    return pair(conv_first_char(prefix), append(numbers, list(check_digit)));

}


// CuboidObject Constructor.
function CuboidObject(length, width, height, mass) {
    this.length = length;
    this.width = width;
    this.height = height;
    this.mass = mass;
}
CuboidObject.prototype.get_length = function () { return this.length; };
CuboidObject.prototype.get_width = function () { return this.width; };
CuboidObject.prototype.get_height = function () { return this.height; };
CuboidObject.prototype.get_mass = function () { return this.mass; };
CuboidObject.prototype.set_length = function (length) { this.length = length; };
CuboidObject.prototype.set_width = function (width) { this.width = width; };
CuboidObject.prototype.set_height = function (height) { this.height = height; };
CuboidObject.prototype.set_mass = function (mass) { this.mass = mass; };
CuboidObject.prototype.get_volume = function () {
    return this.length * this.width * this.height;
};



// Question 2A

// Book Constructor.
function Book(title, length, width, height, mass) {
    CuboidObject.call(this, length, width, height, mass);
    this.title = title;
}
Book.Inherits(CuboidObject);

Book.prototype.get_title = function(){
    return this.title;
};
Book.prototype.set_title = function(title){
    this.title = title;
};




// Question 2B

function books_total_height(books) {
    return accumulate(function(book, total_height){
        return total_height + book.get_height();
    }, 0, books);

}

function books_total_mass(books) {
    return accumulate(function(book, total_mass){
        return total_mass + book.get_mass();
    }, 0, books);
}



// Question 2C

function package_length_width(books) {

    return accumulate(function(book, total){
        var current_largest_length = head(total);
        var current_largest_width = tail(total);
        return pair((current_largest_length > book.get_length()) ? current_largest_length : book.get_length(),
                    (current_largest_width > book.get_width()) ? current_largest_width : book.get_width());
    }, pair(0,0), books);

}



// Question 2D

// Package Constructor.
function Package(books) {
    var length_width = package_length_width(books);
    var length = head(length_width);
    var width = tail(length_width);
    var mass = books_total_mass(books);
    var height = books_total_height(books);
    CuboidObject.call(this, length, width, height, mass);

    this.books = books;
}
Package.Inherits(CuboidObject);
Package.prototype.set_books = function(books){
    this.books = books;
};
Package.prototype.get_books = function(){
    return this.books;
};




// Question 2E

var vol_mass_factor = 500;  // 500 kg per m^3.

Package.prototype.get_billable_mass = function () {
/*
The billable mass is rounded up to the nearest whole kg.
For the first kg ó $1.00.
For the second kg ó $0.80.
For the third kg ó $0.60.
Subsequent kg ó $0.40 per kg.
*/
    var volume = (this.get_length() * this.get_width() * this.get_height()) * vol_mass_factor;
    var mass = (volume > this.get_mass()) ? volume : this.get_mass();

    return mass;
};


// Question 2F

Package.prototype.get_shipping_charge = function () {

    function iter(m, count){
        if(m <= 0) {
            return 0;
        } else if (count === 0) {
            return 1 + iter(m - 1, count + 1);
        } else if (count === 1) {
            return 0.8 + iter(m - 1, count + 1);
        } else if (count === 2) {
            return 0.6 + iter(m - 1, count + 1);
        } else {
            return 0.4 * m;
        }
    }
    return iter(Math.ceil(this.get_billable_mass()), 0);


};



// Question 2G
function improved_package_length_width(books) {
}


// NOTE: Must not use for-loop or while-loop.


function zero_list(len) {
    return (len <= 0 ) ? [] : pair(0, zero_list(len - 1));
}

function zero_table(num_rows, num_cols) {
    return (num_rows <= 0) ? [] : pair(zero_list(num_cols),
                                       zero_table(num_rows - 1, num_cols));
}

// Matrix Constructor.
function Matrix(elems, num_rows, num_cols) {
    if (is_empty_list(elems)) {
        this.elems = zero_table(num_rows, num_cols);
    } else {
        this.elems = elems;
    }
    this.num_rows = num_rows;
    this.num_cols = num_cols;
}

Matrix.prototype.get_num_rows = function () { return this.num_rows; };
Matrix.prototype.get_num_cols = function () { return this.num_cols; };
Matrix.prototype.get_all_elems = function () { return this.elems; };



// Question 3A

Matrix.prototype.get_elem = function (row, col) {
    var row_values = list_ref(this.get_all_elems(), row - 1);
    return list_ref(row_values, col - 1);
};



// Question 3B

Matrix.prototype.set_elem = function (row, col, new_val) {
    var row_values = list_ref(this.get_all_elems(), row - 1);
    function iter(xs, i){
        if (is_empty_list(xs)) {
            return [];
        } else if (i === 0) {
            set_head(xs, new_val);
        } else {
            iter(tail(xs), i - 1);
        }
    }

    iter(row_values, col - 1);
};



// Question 3C

Matrix.prototype.scale = function (k) {

    return new Matrix(map(function(row){
        return map(function(value){
            return value * k;
        }, row);
    }, this.get_all_elems()), this.get_num_rows, this.get_num_cols);

};



// Question 3D

Matrix.prototype.transpose = function () {

    var all_elem = this.get_all_elems();

    function iter(xs){
        if(is_empty_list(xs) || is_empty_list(head(xs))){
            return [];
        } else {
            //return map(tail, all_elem);
            return pair(map(head, xs), iter(map(tail, xs)));
        }
    }

    var new_matrix = iter(all_elem);
    var no_rows = length(new_matrix);
    var no_cols = length(head(new_matrix));
    return new Matrix(new_matrix, no_rows, no_cols);

};



// Question 3E

Matrix.prototype.multiply = function (that_matrix) {
    var all_elem = this.get_all_elems();
    var new_row = this.get_num_rows();
    var new_col = that_matrix.get_num_cols();
    var that_all_elem = that_matrix.transpose().get_all_elems();
    var row = head(all_elem);
    var that_row = head(that_all_elem);


    function mul_pair_list(xs1, xs2){
        if(is_empty_list(xs1)){
            return [];
        } else {
            return pair(head(xs1) * head(xs2), mul_pair_list(tail(xs1), tail(xs2)));
        }
    }
    function sum_list(xs){
        return accumulate(function(x,acc){ return x + acc; }, 0, xs);
    }

    var new_matrix = map(function(row){
        return map(function(that_row){
            return sum_list(mul_pair_list(row, that_row));
        }, that_all_elem);
    }, all_elem);

    return new Matrix(new_matrix, new_row, new_col);

};
