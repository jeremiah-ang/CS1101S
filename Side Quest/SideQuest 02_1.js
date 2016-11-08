function persian(rune, count) {
    // your answer here


    function make_square(img){
        var up = img;
        var left = quarter_turn_left(up);
        var down = quarter_turn_left(left);
        var right = quarter_turn_left(down);

        var right_up = stack(right, up);
        var down_left = stack(down, left);

        return beside(right_up, down_left);
    }

    function rotate_180(img){
        return quarter_turn_left(quarter_turn_left(img));
    }

    function make_sides(count, img){
        return quarter_turn_left(stackn(count, quarter_turn_right(img)));
    }

    function stackfrac_and_turn(frac, img1, img2, turn_fn){
        return turn_fn(stack_frac(frac, img1, img2));
    }

    var square = make_square(rune);
    var side1 = make_sides(count-2, quarter_turn_right(rune));
    var side2 = rotate_180(side1);
    var side3 = make_sides(count, rune);
    var side4 = rotate_180(side3);

    var step1 = stackfrac_and_turn(1/(count-1), side1, square, rotate_180);
    var step2 = stackfrac_and_turn(1/count, side2, step1, quarter_turn_right);
    var step3 = stackfrac_and_turn(1/(count-1), side3, step2, rotate_180);

    return stackfrac_and_turn(1/count, side4, step3, rotate_180);

}

show(persian(nova_bb, 9));
