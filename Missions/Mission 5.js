// Task 1
function reflect_through_y_axis(curve){
    // your program here
    return function(t){
        var ct = curve(t);
        return make_point(-x_of(ct),
                          y_of(ct));
    };
}

// Task 2
function connect_ends(curve1, curve2) {

    var curve2_start_point = curve2(0);
    var curve1_end_point = curve1(1);
    var translate_to_end_point = translate(
                            x_of(curve1_end_point) - x_of(curve2_start_point),
                            y_of(curve1_end_point) - y_of(curve2_start_point));
    var connected_curve = translate_to_end_point(curve2);
    return connect_rigidly(curve1, connected_curve);
}

function diagonal(){
    return function(t){
        return make_point(t,t);
    };
}

var connected = connect_rigidly(diagonal(), unit_circle);
(draw_points_squeezed_to_window(200))(connected);
