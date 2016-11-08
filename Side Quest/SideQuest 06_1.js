// Task 1
// your program here
function reflect_through_y_axis(curve){
    return function(t){
        var ct = curve(t);
        return make_point(-x_of(ct),
                          y_of(ct));
    };
}

function generate_connected_koch_curve(level){
    if(level === 0){
        return unit_line;
    } else {
        var curve = generate_connected_koch_curve(level - 1);
        var curve_rotate_PI_over_3 = (rotate_around_origin(Math.PI / 3))
                                     (curve);
        var curve_rotate_negative_pi_over_3 = (rotate_around_origin(-Math.PI / 3))
                                              (curve);
        var first_half = connect_ends(curve, curve_rotate_PI_over_3);
        var second_half = connect_ends(curve_rotate_negative_pi_over_3, curve);
        var complete = connect_ends(first_half, second_half);

        return put_in_standard_position(complete);
    }
}

function show_connected_koch(level, number_of_points){
    (draw_connected(number_of_points))(generate_connected_koch_curve(level));
}

// Test
 show_connected_koch(5, 2000);

// Task 2
// your program here

function generate_snowflake(curve, number_of_petals){

    var petals_count = number_of_petals / 2;
    var to_rotate = (2 * Math.PI) / petals_count;
    var angle_at = function(t){
        return t * to_rotate;
    };

    function snowflaksify(result, count){
        if(count === 0){
            return result;
        } else {
            var petal = (rotate_around_origin(angle_at(count)))(curve);
            var compounded_petal = connect_ends(result, petal);
            return snowflaksify(compounded_petal, count - 1);
        }
    }

    return snowflaksify(curve, petals_count - 1);
}

var petal = generate_connected_koch_curve(5);
var snowflake = generate_snowflake(petal, 6);
// Test
(draw_connected_full_view_proportional(10000))(snowflake);
