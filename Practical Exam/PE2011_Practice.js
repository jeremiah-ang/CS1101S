function average_of_less_than(n, xs) {
    var xs_less_than = filter(function(x){ return x < n; }, xs);
    return (length(xs_less_than) === 0)
            ? 0
            : accumulate(function(x, acc){ return x + acc; }, 0, xs_less_than) / length(xs_less_than);
}

display(average_of_less_than(2, list(1,1,4,2))); //returns 1
display(average_of_less_than(5, list(10, 10, 40, 30))); //returns 0
display(average_of_less_than(5, list(1, 2, 3, 4, 5, 6, 7))); //returns 2.5
display(average_of_less_than(5, list(1, 5, 2, 6, 3, 7, 4))); //returns 2.5

function Fib_queue() {
    this.queue = pair("queue", []);
    this.last = pair("last", []);
    this.count = 1;
    this.prev_count = 0;
}
Fib_queue.prototype.is_empty_queue = function() {
    return is_empty_list(tail(this.queue));
};
Fib_queue.prototype.set_last_of_queue = function(p) {
    set_tail(this.last, p);
};
Fib_queue.prototype.push_fib = function(x) {
    function helper(n) {
        if(n === 0) {
            var temp = this.count;
            this.count = this.count + this.prev_count;
            this.prev_count = temp;
        } else {
            this.push(x);
            helper.call(this, n - 1);
        }
    }
    helper.call(this, this.count);
};
Fib_queue.prototype.push = function(x) {
    var last = list(x);
    if(this.is_empty_queue()) {
        set_tail(this.queue, last);
        this.set_last_of_queue(last);
    } else {
        set_tail(tail(this.last), last);
        this.set_last_of_queue(last);
    }
};
Fib_queue.prototype.pop = function() {
    if(this.is_empty_queue()) {
        return "Error!";
    } else {
        var first = head(tail(this.queue));
        set_tail(this.queue, tail(tail(this.queue)));
        return first;
    }
};

function make_fib_queue() {
    return new Fib_queue();
}
function push(q, x) {
    q.push_fib(x);
    return "pushed";
}
function pop(q) {
    return q.pop();
}

var q = make_fib_queue();
display(push(q, 5));
display(push(q, 4));
display(push(q, 10));
display(push(q, 23));
display(push(q, 1));
display(pop(q)); // returns 5
display(pop(q)); // returns 4
display(pop(q)); // returns 10
display(pop(q)); // returns 10
display(pop(q)); // returns 23
display(pop(q)); // returns 23
display(pop(q)); // returns 23
display(pop(q)); // returns 1
display(pop(q)); // returns 1
display(pop(q)); // returns 1
display(pop(q)); // returns 1
display(pop(q)); // returns 1
display(pop(q)); // error message
