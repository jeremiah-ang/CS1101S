/*
Task 1
1) yes

2)
in pixel rotate, curve(t) is called twice.

in the case of gosper-curve
the nth level gosper-curve is actually (n-1)th level gosper-curve.

so the evaluation of the curve at nth level,
now requires two evaluation of (n-1)th level,
which require four evalutaion of (n-2)th level,
resulting in the speed growing at O(2^n).
*/

// Task 2
function dragonize(n, curve) {
    // your answer here
    if(n === 0) {
        return curve;
    } else {
        var c = dragonize(n - 1, curve);
        var rotated_c = (rotate_around_origin(-Math.PI / 2))(c);
        var a = put_in_standard_position(connect_ends
                   (invert(rotated_c), c));

        return a;
    }
}

// Test
 (draw_connected_squeezed_to_window(1000))(dragonize(200, unit_line));
