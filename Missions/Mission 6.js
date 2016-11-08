// Scale fix
function scale(s){
    return scale_x_y(s, s);
}

// Task 1
function arc(t){
    return make_point(Math.sin(Math.PI * t),
                      Math.cos(Math.PI * t));
}

function gosper_any_curve(curve, level){
    return (repeated(gosperize, level))(curve);
}

function show_points_gosper(level, number_of_points, initial_curve){
    // your solution here!
    (draw_points_on(number_of_points)) ((squeeze_rectangular_portion(-0.5, 1.5, -0.5, 1.5))
                                        (gosper_any_curve(initial_curve, level)));
}

// testing
//show_points_gosper(7, 1000, arc);
//show_points_gosper(5, 500, arc);

// Task 2

function your_param_gosper(level, angle_at){
    if (level === 0) {
        return unit_line;
    } else {
        return (your_param_gosperize(angle_at(level)))(your_param_gosper(level - 1, angle_at));

    }
}

function your_param_gosperize(theta){
    return function(curve){
               return put_in_standard_position(connect_ends((rotate_around_origin(theta))(curve),
                                                             (rotate_around_origin(-1 * theta))(curve)));
           };
}

// testing
// (draw_connected(200))(your_param_gosper(10, function(n){ return Math.PI / (n + 2); }));
// (draw_connected(200))(your_param_gosper(5, function(n){ return Math.PI / 4 / Math.pow(1.3, n); }));

// Task 3

//sample tests:
var to_change = 4000;
(timed((timed(gosper_curve))(to_change)))(0.1);
(timed((timed(param_gosper))(to_change, function(level){ return Math.PI/4; })))(0.1);
//(timed((timed(your_param_gosper))(to_change, function(level){ return Math.PI/4; })))(0.1);

/*
your tests and results here

//(timed((timed(gosper_curve))(100)))(0.1); t = 0s
//(timed((timed(param_gosper))(100, function(level){ return Math.PI/4; })))(0.1); t = 1s
//(timed((timed(your_param_gosper))(100, function(level){ return Math.PI/4; })))(0.1); t = 16.6s

//(timed((timed(gosper_curve))(500)))(0.1); t = 0.5s
//(timed((timed(param_gosper))(500, function(level){ return Math.PI/4; })))(0.1); t = 1s
//(timed((timed(your_param_gosper))(500, function(level){ return Math.PI/4; })))(0.1); t = 221.4s

//(timed((timed(gosper_curve))(1000)))(0.1); t = 1s
//(timed((timed(param_gosper))(1000, function(level){ return Math.PI/4; })))(0.1); t = 12s
//(timed((timed(your_param_gosper))(1000, function(level){ return Math.PI/4; })))(0.1); t = 958s

//(timed((timed(gosper_curve))(1500)))(0.1); t = 1s
//(timed((timed(param_gosper))(1500, function(level){ return Math.PI/4; })))(0.1); t = 16s
//(timed((timed(your_param_gosper))(1500, function(level){ return Math.PI/4; })))(0.1); t = 1701s

//(timed((timed(gosper_curve))(2000)))(0.1); t = 1s
//(timed((timed(param_gosper))(2000, function(level){ return Math.PI/4; })))(0.1); t = 37s
//(timed((timed(your_param_gosper))(2000, function(level){ return Math.PI/4; })))(0.1); t = 5143.2s

//(timed((timed(gosper_curve))(3000)))(0.1); t = 3s
//(timed((timed(param_gosper))(3000, function(level){ return Math.PI/4; })))(0.1); t = 63s

//(timed((timed(gosper_curve))(4000)))(0.1); t = 4s
//(timed((timed(param_gosper))(4000, function(level){ return Math.PI/4; })))(0.1); t = 79s

Key difference: The number of transformation applied to the given curve.

*/
