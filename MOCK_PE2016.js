function average_of_less_than(n, list){
  var filtered = filter(function(x){
    return x < n;
  }, lst);
  var sum = accumulate(function(x, acc){
    return acc + x;
  }, 0, filtered);

  return (is_empty_list(filtered))
          ? 0
          : sum / length(filtered);
}

function make_fib_queue(){
  var i = 0;
  var queue = pair("queue", list(1));
  var last = pair("last", tail(queue));

  return function(msg){
    if (msg === "push"){
      var item = list(head(tail(msg))); //["push",[2,[]]];
      var temp = set_tail(tail(last), item);
      set_tail(last, item);
    } else if (msg === "pop") {
      var item = head(tail(pointer));
      var temp = tail(tail(queue));
      set_tail(queue, temp);
    } else {
      return "UNKNOWN FUNCTION: " + msg;
    }
  }
}

function push(queue, value){
  return queue(list("push", value));
}
function pop(queue){
  return queue(list("pop"));
}
var q = make_fib_queue();
