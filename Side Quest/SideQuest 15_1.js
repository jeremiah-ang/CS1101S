var grand_laser_angle = Math.PI / 12;
var grand_laser_reach = 10000;

function select_grand_laser_target(hostile_list, friendly_list) {
    // your solution here
    var laser_angle = Math.PI / 12;
    var laser_radius = 10000;

    function get_name(target){
        return head(target);
    }
    function get_x(target){
        return head(tail(target));
    }
    function get_y(target){
        return head(tail(tail(target)));
    }
    function get_z(target){
        return head(tail(tail(tail(target))));
    }
    function target_to_string(target){
        return "(" + get_name(target) + "," + get_x(target) + "," + get_y(target) + "," + get_z(target) + ")";
    }

    function make_sphere_coordinate_from_target(target){
        return make_sphere_coordinate(get_x(target), get_y(target), get_z(target));
    }

    function make_sphere_coordinate(x, y, z){
        function square(x){ return x * x; }
        var acute_xy = Math.atan(y / x);
        var xy_angle = (y > 0)
                        ? (x > 0)
                            ? acute_xy
                            : Math.PI - acute_xy
                        : (x > 0)
                            ? 2 * Math.PI - angle
                            : Math.PI + acute_xy;

        var x_sqaure_plus_y_square = square(x) + square(y);
        var sqrt_x_sqaure_plus_y_square = Math.sqrt(x_sqaure_plus_y_square);
        var z_angle = Math.atan(z / sqrt_x_sqaure_plus_y_square);

        var magnitute = Math.sqrt(x_sqaure_plus_y_square + square(z));

        return list(xy_angle, z_angle, magnitute);
    }

    function get_xy_angle(coordinate){
        return head(coordinate);
    }
    function get_z_angle(coordinate){
        return head(tail(coordinate));
    }
    function get_magnitute(coordinate){
        return head(tail(tail(coordinate)));
    }

    function is_in_range(central_target, target){


        function is_in_xy_range(central_target, target){

            var central_xy_angle = get_xy_angle(central_target);
            var target_xy_angle = get_xy_angle(target);
            return (target_xy_angle >= central_xy_angle - laser_angle)
                && (target_xy_angle <= central_xy_angle + laser_angle);
        }

        function is_in_z_range(central_target, target){

            var central_z_angle = get_z_angle(central_target);
            var target_z_angle = get_z_angle(target);
            return (target_z_angle >= central_z_angle - laser_angle)
                && (target_z_angle <= central_z_angle + laser_angle);
        }

        return is_in_xy_range(central_target, target) &&
               is_in_z_range(central_target, target) &&
               is_in_laser_reach(target);
    }

    function is_in_laser_reach(target){
        var target_magnitute = get_magnitute(target);
        return target_magnitute <= laser_radius;
    }


    function targets_in_range(current_target_coordinate, targets){
        return accumulate(function(target, acc){
                    var hit = is_in_range(current_target_coordinate,
                                          make_sphere_coordinate_from_target(target));
                    return (hit)
                            ? pair(target, acc)
                            : acc;
                }, [], targets);
    }


    function printout(main_target, hostiles_in_range, friendlies_in_range){

        function print_targets(type_of_target, targets){
            var result = accumulate(function(target, acc){
                return target_to_string(target) + " " +acc;
            }, "", targets);

            display(type_of_target+" in area of effect: "+result);
        }

        display("Target: " + target_to_string(main_target));
        print_targets('Hostiles', hostiles_in_range);
        print_targets('Friends', friendlies_in_range);
    }

    map(function(current_target){
        var current_target_coordinate = make_sphere_coordinate_from_target(current_target);
        if(is_in_laser_reach(current_target_coordinate)){
            var hostiles_in_range = targets_in_range(current_target_coordinate, hostile_list);
            var friendlies_in_range = targets_in_range(current_target_coordinate, friendly_list);
            printout(current_target, hostiles_in_range, friendlies_in_range);
        } else {
            printout(current_target, [], []);
        }
    }, hostile_list);

    return "none";
}

// Test
select_grand_laser_target(
    list(list("TIE0001", 890, 700, 906),
         list("TIE0002", 895, 740, 912),
         list("TIE0003", -5634, -102, 8589)),
    list(list("XW0121", 862, 713, 999))
);
