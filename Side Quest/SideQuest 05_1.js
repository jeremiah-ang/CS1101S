// Task 1

var test_curve = function(t) {
    return make_point(t, 0.5 + (Math.sin(4 * (Math.PI * t)) / 2));
};

function stack(c1, c2) {
    // your program here
    var scaled_c1 = (scale_x_y(1, (1 / 2)))(c1);
    var translated_scaled_c1 = (translate(0, 1 / 2))(scaled_c1);
    var scaled_c2 = (scale_x_y(1, 1 / 2))(c2);
    return function(t){
        if(t < 1 / 2){
            var ct = translated_scaled_c1(t * 2);
            return make_point(x_of(ct),
                              y_of(ct));
        } else {
            var ct2 = scaled_c2((t * 2) - 1);
            return make_point((x_of(ct2)),
                              y_of(ct2));
        }
    };
}

// Test
(draw_points_on(1000))(stack(test_curve, test_curve));

// Task 2

var test_curve = function(t) {
    return make_point(t, 0.5 + (Math.sin(4 * (Math.PI * t)) / 2));
};


function stack_frac(frac, c1, c2) {
    // your program here
    var scaled_c1 = (scale_x_y(1, frac))(c1);
    var translated_scaled_c1 = (translate(0, 1 - frac))(scaled_c1);
    var scaled_c2 = (scale_x_y(1, 1 - frac))(c2);
    return function(t){
        if(t < frac){
            var ct = translated_scaled_c1(t / frac);
            return make_point(x_of(ct),
                              y_of(ct));
        } else {
            var ct2 = scaled_c2((t-frac) / (1 - frac));
            return make_point((x_of(ct2)),
                              y_of(ct2));
        }
    };
}

// Test
(draw_points_on(6000))(stack_frac(1/5,
                                  test_curve,
                                  stack_frac(3 / 4,
                                             test_curve,
                                             test_curve)));
