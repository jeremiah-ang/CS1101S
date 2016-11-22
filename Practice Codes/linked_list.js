function make_linked_cell(x) {
    return list([], x, []);
}
function linked_list_value(ll) {
    return (is_empty_list(ll)) ? [] : head(tail(ll));
}
function linked_list_parent(ll) {
    return head(ll);
}
function linked_list_children(ll) {
    var children = head(tail(tail(ll)));
    return (is_empty_list(children)) ? ll : children;
}
function is_empty_linked_list(ll) {
    return is_empty_list(ll);
}
function linked_list_set_head(ll, x) {

}
function linked_list_set_parent(ll, p) {
    set_head(ll, p);
}
function linked_list_set_children(ll, c) {
    set_head(tail(tail(ll)), c);
}
function linked_list_push(ll, x) {
    var lc = make_linked_cell(x);
    linked_list_set_children(lc, ll);
    linked_list_set_parent(ll, lc);
    //linked_list_set_children(lc, ll);

    return lc;
}
function linked_list_push_list(ll, xs) {
    if(is_empty_list(xs)) {
        return ll;
    } else {
        var new_ll = linked_list_push(ll, head(xs));
        return linked_list_push_list(new_ll, tail(xs));
    }
}
function linked_list_pop(ll) {
    var temp = linked_list_children(ll);
    linked_list_set_parent(temp, []);
    linked_list_set_children(ll, []);

    return temp;
}

function draw_ll(ll) {
    draw(ll);
}

var a = make_linked_cell(1);
//draw_ll(a);
//display(a);

var b = linked_list_push_list(a, list(2,3));
//draw_ll(b);
//display(b);

display(linked_list_value(b));
var c = linked_list_children(b);
display(linked_list_value(c));
var d = linked_list_parent(c);
display(linked_list_value(d));
var e = linked_list_children(c);
display(linked_list_value(e));
var f = linked_list_children(e);
display(linked_list_value(f));
//var g = linked_list_pop(d);
draw_ll(c);
