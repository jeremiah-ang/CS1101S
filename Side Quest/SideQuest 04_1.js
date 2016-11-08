function scale_point(scale, point){

    var mid_pt = 0.5;
    function scale_point_at(value){
        return scale * (value - mid_pt) + mid_pt;
    }

    return make_point(
        scale_point_at(x_of(point)),
        scale_point_at(y_of(point)));
}

function angle_from(start, end){
    return function (time){
        return start * (1 - time) + (time * end);
    };
}

function scalable_curve(start_point, length, curve_at){
    return function(scale){
        var scaled_start_point = scale_point(
                                    scale,
                                    start_point);
        return function(t){
            return(curve_at(scaled_start_point, scale*length))(t);
        };

    };
}

function horizontal_line_at(point, length){
    return function(t){
        var x_pt = x_of(point) - (t * length);
        var y_pt = y_of(point);
        return make_point(x_pt, y_pt);
    };
}

function vertical_line_at(point, length){
    return function(t){
        var x_pt = x_of(point);
        var y_pt = y_of(point) - (t * length);
        return make_point(x_pt, y_pt);
    };
}

function circle(start_angle, distance){

    var end_angle = start_angle + distance;
    var angle_at = angle_from(
                    start_angle,
                    end_angle);

    return function(point, radius){

        function apply_trigo_fn(time, vertical_shift, trigo){
            return radius * trigo(angle_at(time)) + vertical_shift;
        }

        return function(t){
            //x = a * (sin b) + c
            var x_pt = apply_trigo_fn(
                            t,
                            x_of(point) - radius,
                            Math.sin);

            //y = a * (cos b) + c
            var y_pt = apply_trigo_fn(
                            t,
                            y_of(point),
                            Math.cos);
            return make_point(x_pt, y_pt);
        };
    };
}

function draw_J(scale){

    return function(t){
        if(t < (1 / 3)){
            //draw horizontal line from t = 0 to t = 1/3
            return ((scalable_horizontal_line)(scale))(t * 3);
        } else if (t < (2 / 3)){
            //draw vertical line from t = 1/3 to t = 2/3
            return ((scalable_vertical_line)(scale))((t - (1 / 3)) * 3);
        } else {
            //draw vertical line from t = 2/3 to t = 1
            return ((scalable_semi_circle)(scale))((t - (2 / 3)) * 3);
        }
    };

}


//default values
var length_of_horizontal_line = 1;
var length_of_vertical_line = 0.6;
var radius_of_semi_circle = 0.25;

var horizontal_line_start_point = make_point(1, 0.95);
var vertical_line_start_point = make_point(0.5, 0.95);
var semi_circle_start_point = make_point(
                                0.5,
                                0.9-length_of_vertical_line);
var semi_circle_start_angle = Math.PI / 2;
var semi_circle_total_angle = Math.PI;

//to be drawn
var scalable_horizontal_line = scalable_curve(
                        horizontal_line_start_point,
                        length_of_horizontal_line,
                        horizontal_line_at);

var scalable_vertical_line = scalable_curve(
                        vertical_line_start_point,
                        length_of_vertical_line,
                        vertical_line_at);

var semi_circle_at = circle(
                        semi_circle_start_angle,
                        semi_circle_total_angle);

var scalable_semi_circle = scalable_curve(
                        semi_circle_start_point,
                        radius_of_semi_circle,
                        semi_circle_at);

//scale value determine the size of J
var J_scale_value = 0.7; //negative flips J
var J = draw_J(J_scale_value);
(draw_connected(1000))(J);
