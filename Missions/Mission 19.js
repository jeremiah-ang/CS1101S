/*
Idea:

Only the attack steps changed

1. Attack
    1.1 Melee Attack
        1.1.1 Check for existance and readiness of MeleeWeapon
        1.1.2 Check for hostiles in range
        1.1.3 Use item
    1.2 Ranged Attack
        1.2.1 Check for existance and readiness of RangedWeapon
        1.2.2 Check for hostiles in range
            1.2.2.1 Once a given direction has hostile, engage in that direction
        1.2.3 Use item
    1.3 Ranged Spell
        1.3.1 Check for existance and readiness of RangedSpell
        1.3.2 Check for hostile in available direction
            1.3.2.1 Once a given direction has hostile, engage in that direction
        1.3.3 Use item

*/

//=========================
//        NAVIGATOR
//===========================
function Navigator(){
    this.route_to_follow = pair("route_to_follow", []); // M18 T2
    this.generator_room = []; // M18 T2
    this.visited = {};
}

Navigator.prototype.set_generator_room = function(room){ // M18 T2
    this.generator_room = room;
};
Navigator.prototype.get_visited_room = function(){ // M18 T2
    return this.visited;
};

Navigator.prototype.reset_route_to_follow = function(){ // M18 T2
    this.route_to_follow = pair("route_to_follow", []);
};
Navigator.prototype.set_route_to_follow = function(current_room){ // M18 T2
    // Step A.2
    if(is_empty_list(this.generator_room)){ //no known protected room

        display("NO GENERATOR, FINDING GENERATOR!");
        this.find_generator_room(current_room);
        display("GENERATOR FOUND!");
    } else {
        ;
    }

    display("SETTING ROUTE TO FOLLOW");
    set_tail(this.route_to_follow, this.find_route_to_room(current_room, this.generator_room));
    display("SET FINISH");
};
Navigator.prototype.get_route_to_follow = function(current_room){ // M18 T2
    // Step A
    if(is_empty_list(tail(this.route_to_follow))){
        display("NO ROUTE TO FOLLOW, SETTING!");
        this.set_route_to_follow(current_room);
    } else {
        ;
    }

    return tail(this.route_to_follow);
};
Navigator.prototype.took_one_step_from_route = function(current_room){ // M18 T2
    // Step 4.1.4
    var route = this.get_route_to_follow(current_room);
    set_tail(this.route_to_follow, tail(route));

    if(is_empty_list(tail(this.route_to_follow))){
        this.set_visited_protected_room(head(route));
    } else {
        ;
    }
};

//=========================
//      ROOM FILTERS
//=========================
Navigator.prototype.get_adjacent_rooms = function(room){
    return map(function(x){
        return room.getExit(x);
    }, room.getExits());
};
Navigator.prototype.filter_unvisited_unprotected_rooms = function(rooms, visited){
    return filter(function(x){
        return (!is_instance_of(x, ProtectedRoom)
                && visited[x.getName()] === undefined);
    }, rooms);
};
Navigator.prototype.filter_unvisited_rooms = function(rooms, visited){
    return filter(function(x){
        return (visited[x.getName()] === undefined);
    }, rooms);
};
Navigator.prototype.filter_unprotected_rooms = function(rooms){
    return filter(function(x){
        return !is_instance_of(x, ProtectedRoom);
    }, rooms);
};
Navigator.prototype.get_random_room = function(rooms){
    return list_ref(rooms, Math.floor((Math.random() * 10) % length(rooms)));
};
Navigator.prototype.get_random_unprotected_room = function(room){
    return this.get_random_room(this.filter_unprotected_rooms(room));
};


//=========================
//  RECORD ROOMS
//=========================
Navigator.prototype.record_visited_room = function(room){ // M18 T1
    this.visited[room.getName()] = true;
};

Navigator.prototype.record_generator_room = function(rooms){ // M18 T2
    if(is_empty_list(rooms) || !is_empty_list(this.generator_room)){
        ;
    } else {
        var room = head(rooms);
        if(this.is_generator_room(room)){
            this.set_generator_room(room);
        } else {
            this.record_generator_room(tail(rooms));
        }
    }
};


//=========================
//FIND GENERATOR ROOM
//=========================
Navigator.prototype.is_generator_room = function(room){ // M18 T2
    if(is_instance_of(room, ProtectedRoom)){
        var generator = filter(function(x){
            return is_instance_of(x, Generator);
        }, room.getThings());

        return !is_empty_list(generator);
    } else {
        return false;
    }
};
Navigator.prototype.find_generator_room = function(start_room){ //M18 T2
    return this.searcher(function(current_room){
        return this.is_generator_room(current_room);
    }, function(current_room, steps){
        this.set_generator_room(current_room);
        return true;
    }, start_room);
};

//=========================
//     PATH TO ROOM
//=========================
Navigator.prototype.find_route_to_room = function(start_room, end_room){ //M18 T2
    // Step A.2.2.2
    return this.searcher(function(current_room){
        return current_room.getName() === end_room.getName();
    }, function(current_room, steps){
        return tail(reverse(steps));
    }, start_room);
};

Navigator.prototype.searcher = function(search_condition, search_action, start_room){

    function helper(current_room, steps, visited) {
        visited[current_room.getName()] = true;
        var adjacent = this.get_adjacent_rooms(current_room);
        var unvisited = this.filter_unvisited_rooms(adjacent, visited);

        if(search_condition.call(this, current_room)){
            return search_action.call(this, current_room, steps);
        } else if((is_empty_list(unvisited) && is_empty_list(tail(steps)))){
            alert("IMPOSSIBLE!");
            return [];
        } else if(is_empty_list(unvisited)){
            //return to previous room
            return helper.call(this, head(tail(steps)), tail(steps), visited);
        } else {
            //go to unvisited room
            var room = head(unvisited);
            return helper.call(this, room, pair(room, steps), visited);
        }
    }

    return helper.call(this, start_room, list(start_room), {});
};

//===========================
//      NAVIGATOR END
//===========================



//===========================
//            ROOKIE
//===========================

function Rookie(name){
    Player.call(this, name);
    this.navigator = new Navigator();
}
Rookie.Inherits(Player);


//=========================
//          ATTACK
//=========================
Rookie.prototype.attack_and_loot = function(){ // M19 T1
  this.melee_attack();
  this.ranged_attack();
  this.spell_attack();
  this.loot();
};

Rookie.prototype.get_ready_weapons = function(type){ // M19 T1
  return filter(function(x){
    return is_instance_of(x, type) &&
           !x.isCharging();
  }, this.getPossessions());
};
Rookie.prototype.get_hostile = function(room){
    var occupant = room.getOccupants();
    return filter(function(x){
        return (is_instance_of(x, ServiceBot) || is_instance_of(x, SecurityDrone)); // M18 T1
    }, occupant);
};
Rookie.prototype.get_rooms_direction_range = function(current_room, direction, range){  // M19 T1
    if(range < 1 || equal(current_room.getExit(direction), false)){
        return pair(current_room, []);
    } else {
        var room = current_room.getExit(direction);
        return pair(room, this.get_rooms_direction_range(room, direction, range - 1));
    }
};
Rookie.prototype.get_all_hostile = function(rooms) { // M19 T1
  return accumulate(append, [], map(this.get_hostile, rooms));
};
Rookie.prototype.get_hostile_of_range = function(current_location, range){

    function iter_direction(directions, range){
        if(is_empty_list(directions)){
            return [];
        } else {
            var direction = head(directions);
            var hostiles = this.get_all_hostile(
                              this.get_rooms_direction_range(current_location, direction, range));
            if(is_empty_list(hostiles)){
                return iter_direction.call(this, tail(directions), range);
            } else {
                return hostiles;
            }
        }
    }

    return iter_direction.call(this, current_location.getExits(), range);
};
Rookie.prototype.get_direction_of_aim = function(current_location, range){ // M19 T1
    function iter_direction(directions){
        if(is_empty_list(directions)){
            return [];
        } else {
            var direction = head(directions);
            var hostiles = this.get_all_hostile(
                              this.get_rooms_direction_range(current_location, direction, 4));
            if(is_empty_list(hostiles)){
                return iter_direction.call(this, tail(directions));
            } else {
                return direction;
            }
        }
    }

    return iter_direction.call(this, current_location.getExits());
};
Rookie.prototype.loot = function(){ // M19 T1
    this.take((this.getLocation()).getThings());
};
Rookie.prototype.melee_attack = function(){ // M19 T1
    this.attack(MeleeWeapon, this.get_hostile_of_range);
};
Rookie.prototype.ranged_attack = function(){ // M19 T1
    this.attack(RangedWeapon, this.get_hostile_of_range);
};
Rookie.prototype.spell_attack = function(){ // M19 T1
    this.attack(SpellWeapon, this.get_direction_of_aim);
};
Rookie.prototype.attack = function(weapon_class, hostile_function){ // M19 T1
    var weapons = this.get_ready_weapons(weapon_class);
    if(is_empty_list(weapons)){
      ;
    } else {
      var weapon = head(weapons);
      var enemies = hostile_function.call(this, this.getLocation(), weapon.getRange());
      this.use(weapon, enemies);
    }
};

//=========================
//      CHECK KEYCARD
//=========================
Rookie.prototype.get_keycard = function(){
    return filter(function(x){
        return is_instance_of(x, Keycard);
    }, this.getPossessions());
};
Rookie.prototype.has_keycard = function(){
    return !is_empty_list(this.get_keycard());
};

//=========================
//          MOVE
//=========================
Rookie.prototype.move = function(){ //M18 T2
    // Step 4.2
    var adjacent_rooms = this.navigator.get_adjacent_rooms(this.getLocation());
    this.navigator.record_generator_room(adjacent_rooms);

    var unvisited_rooms = this.navigator.filter_unvisited_unprotected_rooms(adjacent_rooms, this.navigator.get_visited_room());
    var room_to_go_to = (is_empty_list(unvisited_rooms))
                        ? this.navigator.get_random_unprotected_room(adjacent_rooms)
                        : head(unvisited_rooms);
    this.moveTo(room_to_go_to);
};


//=========================
//  GO TO PROTECTED ROOM
//=========================

Rookie.prototype.move_towards_generator = function(){ //M18 T2
    this.say("MOVING!!");
    var route = this.navigator.get_route_to_follow(this.getLocation());
    this.say("GOT ROUTE");
    var room_to_go_to = head(route);
    if(this.moveTo(room_to_go_to)){
        this.navigator.took_one_step_from_route(room_to_go_to);
    } else {
        this.navigator.reset_route_to_follow();
    }


};


//=========================
//          ACT
//=========================
Rookie.prototype.__act = function(){
    Player.prototype.__act.call(this);

    this.attack_and_loot();
    this.navigator.record_visited_room(this.getLocation());

    if(this.has_keycard()){
        this.say("MOVING TOWARDS GENERATOR");
        this.move_towards_generator(); //M18 T2
        this.say("MOVED TOWARDS GENERATOR");
    } else {
        this.move();
    }
};



// Uncomment the following to test
 var newPlayer = new Rookie("JERMS");
 test_task1(newPlayer);

/*
Copy your class from the previous task here, and extend its functionality
*/

//=========================
//        NAVIGATOR
//===========================
function Navigator(){
    this.route_to_follow = pair("route_to_follow", []); // M18 T2
    this.generator_room = []; // M18 T2
    this.visited = {};
}

Navigator.prototype.set_generator_room = function(room){ // M18 T2
    this.generator_room = room;
};
Navigator.prototype.get_visited_room = function(){ // M18 T2
    return this.visited;
};
Navigator.prototype.reset_visited = function(){
    this.visited = {};
};
Navigator.prototype.reset_route_to_follow = function(){ // M18 T2
    this.route_to_follow = pair("route_to_follow", []);
};
Navigator.prototype.set_route_to_follow = function(current_room){ // M18 T2
    // Step A.2
    if(is_empty_list(this.generator_room)){ //no known protected room
        this.find_generator_room(current_room);
    } else {
        ;
    }

    set_tail(this.route_to_follow, this.find_route_to_room(current_room, this.generator_room));
};
Navigator.prototype.get_route_to_follow = function(current_room){ // M18 T2
    // Step A
    if(is_empty_list(tail(this.route_to_follow))){
        this.set_route_to_follow(current_room);
    } else {
        ;
    }

    return tail(this.route_to_follow);
};
Navigator.prototype.took_one_step_from_route = function(current_room){ // M18 T2
    // Step 4.1.4
    var route = this.get_route_to_follow(current_room);
    set_tail(this.route_to_follow, tail(route));
    if(is_empty_list(tail(this.route_to_follow))){
    } else {
        ;
    }
};

//=========================
//      ROOM FILTERS
//=========================
Navigator.prototype.get_adjacent_rooms = function(room){
    return map(function(x){
        return room.getExit(x);
    }, room.getExits());
};
Navigator.prototype.filter_unvisited_unprotected_rooms = function(rooms, visited){
    return filter(function(x){
        return (!is_instance_of(x, ProtectedRoom)
                && visited[x.getName()] === undefined);
    }, rooms);
};
Navigator.prototype.filter_unvisited_rooms = function(rooms, visited){
    return filter(function(x){
        return (visited[x.getName()] === undefined);
    }, rooms);
};
Navigator.prototype.filter_unprotected_rooms = function(rooms){
    return filter(function(x){
        return !is_instance_of(x, ProtectedRoom);
    }, rooms);
};
Navigator.prototype.get_random_room = function(rooms){
    return list_ref(rooms, Math.floor((Math.random() * 10) % length(rooms)));
};
Navigator.prototype.get_random_unprotected_room = function(room){
    return this.get_random_room(this.filter_unprotected_rooms(room));
};


//=========================
//  RECORD ROOMS
//=========================
Navigator.prototype.record_visited_room = function(room){ // M18 T1
    this.visited[room.getName()] = true;
};

Navigator.prototype.record_generator_room = function(rooms){ // M18 T2
    if(is_empty_list(rooms) || !is_empty_list(this.generator_room)){
        ;
    } else {
        var room = head(rooms);
        if(this.is_generator_room(room)){
            this.set_generator_room(room);
        } else {
            this.record_generator_room(tail(rooms));
        }
    }
};


//=========================
//FIND GENERATOR ROOM
//=========================
Navigator.prototype.is_generator_room = function(room){ // M18 T2
    if(is_instance_of(room, ProtectedRoom)){
        var generator = filter(function(x){
            return is_instance_of(x, Generator);
        }, room.getThings());

        return !is_empty_list(generator);
    } else {
        return false;
    }
};
Navigator.prototype.find_generator_room = function(start_room){ //M18 T2
    return this.searcher(function(current_room){
        return this.is_generator_room(current_room);
    }, function(current_room, steps){
        this.set_generator_room(current_room);
        return true;
    }, start_room);
};

//=========================
//     PATH TO ROOM
//=========================
Navigator.prototype.find_route_to_room = function(start_room, end_room){ //M18 T2
    // Step A.2.2.2
    return this.searcher(function(current_room){
        return current_room.getName() === end_room.getName();
    }, function(current_room, steps){
        return tail(reverse(steps));
    }, start_room);
};

Navigator.prototype.searcher = function(search_condition, search_action, start_room){

    function helper(current_room, steps, visited) {
        visited[current_room.getName()] = true;
        var adjacent = this.get_adjacent_rooms(current_room);
        var unvisited = this.filter_unvisited_rooms(adjacent, visited);

        if(search_condition.call(this, current_room)){
            return search_action.call(this, current_room, steps);
        } else if((is_empty_list(unvisited) && is_empty_list(tail(steps)))){
            alert("IMPOSSIBLE!");
            return [];
        } else if(is_empty_list(unvisited)){
            //return to previous room
            return helper.call(this, head(tail(steps)), tail(steps), visited);
        } else {
            //go to unvisited room
            var room = head(unvisited);
            return helper.call(this, room, pair(room, steps), visited);
        }
    }

    return helper.call(this, start_room, list(start_room), {});
};

//===========================
//      NAVIGATOR END
//===========================



//===========================
//            ROOKIE
//===========================

function Rookie(name){
    Player.call(this, name);
    this.navigator = new Navigator();
    this.bomb_planted = false;
}
Rookie.Inherits(Player);


//=========================
//          ATTACK
//=========================
Rookie.prototype.attack_and_loot = function(){ // M19 T1
  this.melee_attack();
  this.ranged_attack();
  this.spell_attack();
  this.loot();
};

Rookie.prototype.get_ready_weapons = function(type){ // M19 T1
  return filter(function(x){
    return is_instance_of(x, type) &&
           !x.isCharging();
  }, this.getPossessions());
};
Rookie.prototype.get_hostile = function(room){
    var occupant = room.getOccupants();
    return filter(function(x){
        return (is_instance_of(x, ServiceBot) || is_instance_of(x, SecurityDrone)); // M18 T1
    }, occupant);
};
Rookie.prototype.get_rooms_direction_range = function(current_room, direction, range){  // M19 T1
    if(range < 1 || equal(current_room.getExit(direction), false)){
        return pair(current_room, []);
    } else {
        var room = current_room.getExit(direction);
        return pair(room, this.get_rooms_direction_range(room, direction, range - 1));
    }
};
Rookie.prototype.get_all_hostile = function(rooms) { // M19 T1
  return accumulate(append, [], map(this.get_hostile, rooms));
};
Rookie.prototype.get_hostile_of_range = function(current_location, range){

    function iter_direction(directions, range){
        if(is_empty_list(directions)){
            return [];
        } else {
            var direction = head(directions);
            var hostiles = this.get_all_hostile(
                              this.get_rooms_direction_range(current_location, direction, range));
            if(is_empty_list(hostiles)){
                return iter_direction.call(this, tail(directions), range);
            } else {
                return hostiles;
            }
        }
    }

    return iter_direction.call(this, current_location.getExits(), range);
};
Rookie.prototype.get_direction_of_aim = function(current_location, range){ // M19 T1
    function iter_direction(directions){
        if(is_empty_list(directions)){
            return [];
        } else {
            var direction = head(directions);
            var hostiles = this.get_all_hostile(
                              this.get_rooms_direction_range(current_location, direction, 4));
            if(is_empty_list(hostiles)){
                return iter_direction.call(this, tail(directions));
            } else {
                return direction;
            }
        }
    }

    return iter_direction.call(this, current_location.getExits());
};
Rookie.prototype.loot = function(){ // M19 T1
    this.take((this.getLocation()).getThings());
};
Rookie.prototype.melee_attack = function(){ // M19 T1
    this.attack(MeleeWeapon, this.get_hostile_of_range);
};
Rookie.prototype.ranged_attack = function(){ // M19 T1
    this.attack(RangedWeapon, this.get_hostile_of_range);
};
Rookie.prototype.spell_attack = function(){ // M19 T1
    this.attack(SpellWeapon, this.get_direction_of_aim);
};
Rookie.prototype.attack = function(weapon_class, hostile_function){ // M19 T1
    var weapons = this.get_ready_weapons(weapon_class);
    if(is_empty_list(weapons)){
      ;
    } else {
      var weapon = head(weapons);
      var enemies = hostile_function.call(this, this.getLocation(), weapon.getRange());
      this.use(weapon, enemies);
    }
};

//=========================
//      CHECK KEYCARD
//=========================
Rookie.prototype.get_keycard = function(){
    return filter(function(x){
        return is_instance_of(x, Keycard);
    }, this.getPossessions());
};
Rookie.prototype.has_keycard = function(){
    return !is_empty_list(this.get_keycard());
};

//=========================
//          MOVE
//=========================
Rookie.prototype.move = function(){ //M18 T2
    // Step 4.2
    var adjacent_rooms = this.navigator.get_adjacent_rooms(this.getLocation());
    this.navigator.record_generator_room(adjacent_rooms);

    var unvisited_rooms = this.navigator.filter_unvisited_unprotected_rooms(adjacent_rooms, this.navigator.get_visited_room());
    var room_to_go_to = (is_empty_list(unvisited_rooms))
                        ? this.navigator.get_random_unprotected_room(adjacent_rooms)
                        : head(unvisited_rooms);
    this.moveTo(room_to_go_to);
};


//=========================
//  GO TO PROTECTED ROOM
//=========================

Rookie.prototype.move_towards_generator = function(){ //M18 T2
    this.say("MOVING!!");
    var route = this.navigator.get_route_to_follow(this.getLocation());
    this.say("GOT ROUTE");
    var room_to_go_to = head(route);
    if(this.moveTo(room_to_go_to)){
        this.say("MOVED");
        this.navigator.took_one_step_from_route(room_to_go_to);
        this.say("TOOK ONE STEP");
    } else {
        this.navigator.reset_route_to_follow();
    }


};


//=========================
//     PLANT BOMB
//=========================
Rookie.prototype.get_bomb = function(){ //M19 T2
    return head(filter(function(x){
        return is_instance_of(x, Bomb);
    }, this.getPossessions()));
};

Rookie.prototype.plant_bomb = function(current_room){ //M19 T2
    if(this.navigator.is_generator_room(current_room)){
        //plant
        this.say("PLANTING BOMB!");
        var bomb = this.get_bomb();
        this.use(bomb);
        this.say("BOMB HAS BEEN PLANTED");
        this.bomb_planted = true;
        this.navigator.reset_visited();
    } else {
        ;
    }
};
Rookie.prototype.evacuate = function(){ //M19 T2
    this.move();
};

//=========================
//          ACT
//=========================
Rookie.prototype.__act = function(){
    Player.prototype.__act.call(this);

    this.navigator.record_visited_room(this.getLocation());
    this.attack_and_loot();

    if(!this.bomb_planted){ //M19 T2
        if(this.has_keycard()){
          this.move_towards_generator(); //M18 T2
        } else {
          this.move();
        }
        this.plant_bomb(this.getLocation());
    } else {
        this.evacuate();
    }

};


// Uncomment the following to test
 var newPlayer = new Rookie("_|_");
 test_task2(newPlayer);


// Uncomment the following to test
// var newPlayer = new [your class name here](shortname);
// test_task1(newPlayer);
/*
Copy your class from the previous task here, and extend its functionality
*/

// Uncomment the following to test
// var newPlayer = new [your class name here](shortname);
// test_task2(newPlayer);
