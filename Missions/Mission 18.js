
//approach:
//1. attack
//  1.1 Gets a list of weapon that are ready
//  1.2 If a readily charged weapon exist
//      1.2.1 Gets a list of Hostile in the same room
//      1.2.2 Use weapon
//
//2. loot
//  2.1 Take everything
//
//3. record current room
//  3.1 set visited object with room name as key and true as value
//
//4. move
//  4.1 get all adjacent room
//  4.2 get list of protected rooms from adjacent rooms
//  4.3 get list of unvisited and unprotected rooms from adjacent rooms
//  4.4 select room to go by:
//      4.4.1 if we have keycard and there is a protected room
//          4.4.1.1 go into the protected room
//      4.4.2 else if there is unvisited and unprotected room
//          4.4.2.1 go into the room
//      4.4.3 else get a random unprotected room from adjacent rooms to go to

function Navigator(){
    // Navigator object will store a table of visited rooms
    // with the room name as the key and boolean as value.

    this.visited = {}; // M18 T1
}

Navigator.prototype.get_adjacent_rooms = function(room){
    return map(function(x){
        return room.getExit(x);
    }, room.getExits());
};
Navigator.prototype.get_protected_rooms = function(rooms){
    return filter(function(x){
        return is_instance_of(x, ProtectedRoom);
    }, rooms);
};
Navigator.prototype.get_unprotected_rooms = function(rooms){
    return filter(function(x){
        return !is_instance_of(x, ProtectedRoom);
    }, rooms);
};
Navigator.prototype.get_unvisited_unprotected_rooms = function(rooms, visited){ // M18 T1
    return filter(function(x){
        return (!is_instance_of(x, ProtectedRoom)
            && visited[x.getName()] === undefined);
    }, rooms);
};
Navigator.prototype.get_random_room = function(rooms){
    return list_ref(rooms, Math.floor((Math.random() * 10) % length(rooms)));
};
Navigator.prototype.get_random_unprotected_room = function(room){
    return this.get_random_room(this.get_unprotected_rooms(room));
};
Navigator.prototype.record_visited_room = function(room){ // M18 T1
    this.visited[room.getName()] = true;
};

//===========================
            ROOKIE
//===========================

function Rookie(name){
    Player.call(this, name);
    this.navigator = new Navigator();
}
Rookie.Inherits(Player);

//=========================
          ATTACK
//=========================
Rookie.prototype.get_ready_weapons = function(){
    return filter(function(x){
        return is_instance_of(x, Weapon) &&
                !x.isCharging();
    }, this.getPossessions());
};
Rookie.prototype.get_hostile = function(occupant){
    return filter(function(x){
        return (is_instance_of(x, ServiceBot) || is_instance_of(x, SecurityDrone)); // M18 T1
    }, occupant);
};
Rookie.prototype.attack_and_loot = function(){
    var weapons = this.get_ready_weapons();
    if(is_empty_list(weapons)){
        ;
    } else {
        var enemies = this.get_hostile((this.getLocation()).getOccupants());
        var weapon = head(weapons);
        this.use(weapon, enemies);
    }

    this.take((this.getLocation()).getThings());
};

//=========================
      CHECK KEYCARD
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
          MOVE
//=========================
Rookie.prototype.move = function(){
    var adjacent_rooms = this.navigator.get_adjacent_rooms(this.getLocation());
    var protected_room = this.navigator.get_protected_rooms(adjacent_rooms);
    var unvisited_room = this.navigator.get_unvisited_unprotected_rooms(adjacent_rooms,
                                                                      this.navigator.visited); // M18 T1
    var room_to_go_to = (this.has_keycard() && !is_empty_list(protected_room))
                        ? head(protected_room)
                        : (is_empty_list(unvisited_room)) // M18 T1
                            ? this.navigator.get_random_unprotected_room(adjacent_rooms) // M18 T1
                            : head(unvisited_room); // M18 T1
    this.moveTo(room_to_go_to);
};
Rookie.prototype.__act = function(){
    Player.prototype.__act.call(this);
    this.attack_and_loot();
    this.navigator.record_visited_room(this.getLocation()); // M18 T1
    this.move();

};


// Uncomment the following to test
// var newPlayer = new Rookie("~.~");
// test_task(newPlayer);



//approach:
//1. attack
//2. loot
//3. record current room
//
//4. move
//  4.1 If already have a key card
//      4.1.1* ask navigator for the route to follow
//      4.1.2 follow the route provided by navigator
//      4.1.3 update the route.
//  4.2 else if don't have key card
//      4.2.1 get adjacent room
//      4.2.2 get navigator to record location of generator
//      4.2.3 get the list of unvisited room from the adjacent rooms
//      4.2.4 choose a room to go to by:
//          4.2.4.1 if there is a unvisited room
//              4.2.4.1.1 go to the unvisited room
//          4.2.4.2 else get a random unprotected room from adjacent rooms to go to

// STEP 4.1.1 ask navigator for the route to follow
//  A. check if a route already existed
//      A.1 if it exist, return the route
//      A.2 else we check for known generator room
//          A.2.1 if there are no known generator room
//              A.2.1.1* without going into the room,
//                      check through every room to find the generator room
//              A.2.2.2 find a path to it
//                  A.2.2.2.1* this is done by similar method,
//                            going through all the rooms without physically going through
//          A.2.3 return the route generated
//
// Step A.2.1.1 and A.2.2.2.1
// without going into the room, check through every room to find the generator room
//
//  B. Check for unvisited room
//      B.1 record current room as visited
//      B.2 get the list of adjacent rooms that is not visited
//      B.3 if the current room we're in is the generator room, then we're done, return recorded path
//      B.4 else if there is no unvisited room
//          B.4.1 Move back to previous room
//      B.5 else
//          B.5.1 Move to the unvisited room at the head of the list


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
    if(is_empty_list(this.generator_room)){
        // if no known protected room
            //find the generator room
        this.find_generator_room(current_room);
    } else {
        ;
    }

    set_tail(this.route_to_follow, this.find_route_to_room(current_room, this.generator_room));
};
Navigator.prototype.get_route_to_follow = function(current_room){ // M18 T2
    if(is_empty_list(tail(this.route_to_follow))){
        //If there was no route to return
            //find the route to protected room
        this.set_route_to_follow(current_room);
    } else {
        ;
    }

    return tail(this.route_to_follow);
};
Navigator.prototype.took_one_step_from_route = function(current_room){ // M18 T2
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

Navigator.prototype.searcher = function(search_condition, search_action, start_room){ //M18 T2

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
Rookie.prototype.get_ready_weapons = function(){
  return filter(function(x){
    return is_instance_of(x, Weapon) &&
           !x.isCharging();
  }, this.getPossessions());
};
Rookie.prototype.get_hostile = function(occupant){
    return filter(function(x){
        return (is_instance_of(x, ServiceBot) || is_instance_of(x, SecurityDrone)); // M18 T1
    }, occupant);
};
Rookie.prototype.attack_and_loot = function(){
    var weapons = this.get_ready_weapons();
    if(is_empty_list(weapons)){
        ;
    } else {
        var enemies = this.get_hostile((this.getLocation()).getOccupants());
        var weapon = head(weapons);
        this.use(weapon, enemies);
    }

    this.take((this.getLocation()).getThings());
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
    var route = this.navigator.get_route_to_follow(this.getLocation());
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
        this.move_towards_generator(); //M18 T2
    } else {
        this.move();
    }
};


// Uncomment the following to test
// var newPlayer = new Rookie("0.0");
// test_task(newPlayer);
