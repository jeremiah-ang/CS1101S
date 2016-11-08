//Task 1
function Window(size) {
    // Your answer here
    this.max_size = size;
    this.size = 0;
    this.last_in_queue = pair("last", []);
    this.queue = pair("queue", []);
}
Window.prototype.get_size = function(){ return this.size; };
Window.prototype.window_is_full = function(){
    return this.max_size === this.size;
};
Window.prototype.window_is_empty = function(){
    return is_empty_list(tail(this.queue));
};
Window.prototype.shift_left = function(){
    if (this.window_is_empty()) {
        display("Window is empty, unable to shift left");
    } else {
        var temp = tail(tail(this.queue));
        set_tail(this.queue, temp);
        this.update_size(-1);
    }
};
Window.prototype.update_size = function(difference){
    this.size = this.size + difference;
};
Window.prototype.set_queue = function(x){
    set_tail(this.queue, list(x));
    set_tail(this.last_in_queue, tail(this.queue));
};
Window.prototype.add = function(x){
    if (this.window_is_full()) {
        this.shift_left();
        this.add(x);
    } else {
        if (this.window_is_empty()) {
            this.set_queue(x);
        } else {
            var temp = list(x);
            set_tail(tail(this.last_in_queue), temp);
            set_tail(this.last_in_queue, temp);
        }

        this.update_size(1);
    }
};
Window.prototype.get_window = function(){
    return tail(this.queue);
};
//Any additional methods
display("************ TASK 1 ************");
var w1 = new Window(4);
w1.add(1);
w1.add(2);
w1.add(3);
w1.add("a");
w1.add(5);
w1.add(6);
display(w1.get_window()); //[3, a, 5, 6]

//Task 2
function FilteringWindow(size, filter) {
    // Your answer here
    Window.call(this, size);
    this.filter = filter;
}
FilteringWindow.Inherits(Window);
FilteringWindow.prototype.set_filter = function(filter){
    this.filter = filter;
};
FilteringWindow.prototype.filter_ok = function(x){
    return this.filter(x);
};
FilteringWindow.prototype.add = function(x){
    if(this.filter_ok(x)) {
        Window.prototype.add.call(this, x);
        return true;
    } else {
        return false;
    }
};

display("************ TASK 2 ************");
var fw = new FilteringWindow(4, function(x){ return x % 2 === 0; });
display(fw.add(1)); //false
display(fw.add(2)); //true
display(fw.add(3)); //false
display(fw.add(4)); //true
fw.add(5);
fw.add(6);
fw.add(7);
fw.add(8);
fw.add(9);
fw.add(10);
display(fw.get_window()); //[4, 6, 8, 10];

//Any additional tests

//Task 3
var force_stream = list_to_stream(list(false, 1, 0, 1, 0, false, 1, 0, 1, 0,
    false, false, 1, 1, 0, 1, 1, false, false, false, 1, false, 0, 1, 1,
    1, 0, 1));

function scan(force_stream, signature, distance) {
    // Your answer here
    var fw = new FilteringWindow(length(signature), function(x){ return (is_number(x) && (x === 0 || x === 1)); });
    function helper(remaining_force_stream, scanned_distance){
        if (is_empty_list(remaining_force_stream) || scanned_distance >= distance) {
            return false;
        } else if (equal(fw.get_window(), signature)) {
            return scanned_distance;
        } else {
            var data = head(remaining_force_stream);
            return helper(stream_tail(remaining_force_stream), (fw.add(data)) ? scanned_distance + 1 : scanned_distance);
        }
    }

    return helper(force_stream, 0);
}

display("************ TASK 3 ************");
display(scan(force_stream, list(1, 0, 1, 0, 1), 200)); //5
display(scan(force_stream, list(0, 1, 0, 1, 0), 200)); //6
display(scan(force_stream, list(0, 1, 1, 1, 0), 200)); //15
display(scan(force_stream, list(0, 1, 1, 1, 0), 10)); //false -> too far
display(scan(force_stream, list(0, 0, 0, 0, 0), 1000)); //false -> no more signatures
