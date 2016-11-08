/*
var engine = new DeathCubeEngine(STEP_MODE, LAYOUT17A);
var bot1_place = engine.__deathcube[0][2][1];
var bot2_place = engine.__deathcube[0][3][2];
var bot1 = MakeAndInstallBot("b1", bot1_place, 2);
var bot2 = MakeAndInstallBot("b2", bot2_place, 3);
engine.__start();
engine.__runRounds(10);
*/

/*
//Task 1: (-1) question expects you to answer why b1 has 1/2 chance and b2 has 1/3 chance.

Your answer here
a) b1 is more restless 
b) one is more restless than the other when one on average makes more moves than the other.
c) On average, 1/6 of the time they will make a move togehter.
   No, with more tries, the average will then converge towards 1/6
*/


//-------------------------------------------------------------------------
// Customization
//  - You can personalize your character by setting the following values
//-------------------------------------------------------------------------
var shortname   = "^.^";
//-------------------------------------------------------------------------
// Rookie
//-------------------------------------------------------------------------

// =========================
//      NAVIGATOR
//===========================
function Navigator(){
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
Navigator.prototype.get_random_room = function(rooms){
  return list_ref(rooms, Math.floor((Math.random() * 10) % length(rooms)));
};
Navigator.prototype.get_random_unprotected_room = function(room){
  return this.get_random_room(this.get_unprotected_rooms(room));
};

//=========================
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
        return (is_instance_of(x, ServiceBot) || is_instance_of(x, SecurityDrone));
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
Rookie.prototype.move = function(){
  var adjacent_rooms = this.navigator.get_adjacent_rooms(this.getLocation());
  var protected_room = this.navigator.get_protected_rooms(adjacent_rooms);
  var room_to_go_to = (this.has_keycard() && !is_empty_list(protected_room))
                      ? head(protected_room)
                      : this.navigator.get_random_unprotected_room(adjacent_rooms);
  this.moveTo(room_to_go_to);
};
Rookie.prototype.__act = function(){
    Player.prototype.__act.call(this);
    this.attack_and_loot();
    this.move();
};

var newPlayer = new Rookie(shortname);
test_task2(newPlayer);
