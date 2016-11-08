// Your program here.
// Group name: Ding Deng Dong
// Members: NGUYEN THI VIET HA
//          HUIJIA CHEN
//          JEREMIAH ANG

// Task 1

#!/usr/bin/env node
var ev3 = require('../node_modules/ev3source/ev3.js');
var source = require('../node_modules/ev3source/source.js');

var distance_per_cm = 15;
var speed = 250;

function move_by(distance) {
  var motorC = ev3.motorC();
  var motorB = ev3.motorB();
  ev3.runForDistance(motorC, distance_per_cm * distance, speed);
  ev3.runForDistance(motorB, distance_per_cm * distance, speed);
}

move_by(10);

// Task 2

#!/usr/bin/env node
var ev3 = require('../node_modules/ev3source/ev3.js');
var source = require('../node_modules/ev3source/source.js');

var distance_per_cm = 15;
var distance_per_degree = Math.floor(200 / 90);
var speed = 250;

function rotate_clockwise(degree) {
    rotate_by(degree, "CLOCKWISE");
}
function rotate_anticlockwise(degree) {
    rotate_by(degree, "ANTICLOCKWISE");
}
function rotate_by(degree, direction) {
  var d = distance_per_degree * 0.9 * degree;
  var motorC = ev3.motorC();
  var motorB = ev3.motorB();

  if(direction === "ANTICLOCKWISE") {
      ev3.runForDistance(motorC, -d, speed);
      ev3.runForDistance(motorB, d, speed);
  } else if(direction === "CLOCKWISE"){
      ev3.runForDistance(motorC, d, speed);
      ev3.runForDistance(motorB, -d, speed);
  } else {
      source.alert("INVALID DIRECTION");
  }
}

function pivot_left_by(degree) {
  pivot_by(ev3.motorC(), degree);
}
function pivot_right_by(degree) {
  pivot_by(ev3.motorB(), degree);
}
function pivot_by(motor, degree) {
  var d = distance_per_degree * 2 * degree;
  ev3.runForDistance(motor, d, speed);
}

//pivot_left_by(90);
rotate_clockwise(90);

// Task 3

#!/usr/bin/env node
var ev3 = require('../node_modules/ev3source/ev3.js');
var source = require('../node_modules/ev3source/source.js');

var distance_per_cm = 20;
var distance_per_degree = Math.floor(200 / 90);
var speed = 250;

function move_by(distance) {
  var motorC = ev3.motorC();
  var motorB = ev3.motorB();
  ev3.runForDistance(motorC, distance_per_cm * distance, speed);
  ev3.runForDistance(motorB, distance_per_cm * distance, speed);
}

function pivot_left_by(degree) {
  pivot_by(ev3.motorC(), degree);
}
function pivot_right_by(degree) {
  pivot_by(ev3.motorB(), degree);
}
function pivot_by(motor, degree) {
  var d = distance_per_degree * 2 * degree;
  ev3.runForDistance(motor, d, speed);
}

function is_black(colorSensor) {
  var light = ev3.reflectedLightIntensity(colorSensor);
  return light < 40;
}

function move_in_black_box() {
  var pivot_angle = 5;
  var move_distance = 1;
  var colorSensor = ev3.colorSensor();

  function turn_left_until_white() {
    source.alert("TURN UNTIL WHITE");
    ev3.runUntil(function() {
      return !is_black(colorSensor);
    }, function() {
      pivot_left_by(-pivot_angle);
    });

    move_until_black(1);
  }

  function turn_right_until_white() {
    source.alert("TURN UNTIL BLACK");
    ev3.runUntil(function() {
      return !is_black(colorSensor);
    }, function() {
      pivot_right_by(-pivot_angle + 1);
    });

    move_until_black(2);
  }

  function move_until_black(rotation_cycle) {
    source.alert("MOVE UNTIL BLACK");
    ev3.runUntil(function() {
      return is_black(colorSensor);
    }, function() {
      move_by(move_distance)
    });

    if(rotation_cycle === 1) {
      turn_right_until_white();
    } else {
      turn_left_until_white();
    }
  }

  move_until_black();

}

move_in_black_box();

// Task 4

#!/usr/bin/env node
var ev3 = require('../node_modules/ev3source/ev3.js');
var source = require('../node_modules/ev3source/source.js');

var distance_per_cm = 15;
var distance_per_degree = Math.floor(200 / 90);
var speed = 250;

function move_by(distance) {
  var motorC = ev3.motorC();
  var motorB = ev3.motorB();
  ev3.runForDistance(motorC, distance_per_cm * distance, speed);
  ev3.runForDistance(motorB, distance_per_cm * distance, speed);
}

function pivot_left_by(degree) {
  pivot_by(ev3.motorC(), degree);
}
function pivot_right_by(degree) {
  pivot_by(ev3.motorB(), degree);
}
function pivot_by(motor, degree) {
  var d = distance_per_degree * 2 * degree;
  ev3.runForDistance(motor, d, speed);
}

function is_black(colorSensor) {
  var light = ev3.reflectedLightIntensity(colorSensor);
  return light < 40;
}

function rotate_and_move_forward(forward_motor, back_motor, degree, distance) {
  var d = distance_per_degree * degree;
  var c = distance_per_cm * distance;

  ev3.runForDistance(forward_motor, d + c, speed);
  ev3.runForDistance(back_motor, -d, speed);
}

function follow_black_line() {
  //if it sees black
    //pivot on right wheel until it sees white
  //if it sees white
    //pivot on left wheel until it sees black
  var pivot_angle = 3;
  var move_distance = 1;
  var colorSensor = ev3.colorSensor();
  var motorRight = ev3.motorC();
  var motorLeft = ev3.motorB();

  function turn_until_white() {
    source.alert("TURN UNTIL WHITE");
    ev3.runUntil(function(){
      return !is_black(colorSensor);
    }, function(){
      rotate_and_move_forward(motorLeft, motorRight, pivot_angle, move_distance);
    });

    turn_until_black();
  }

  function turn_until_black() {
    source.alert("TURN UNTIL BLACK");
    ev3.runUntil(function(){
      return is_black(colorSensor);
    }, function(){
      rotate_and_move_forward(motorRight, motorLeft, pivot_angle, move_distance);
    });

    turn_until_white();
  }

  turn_until_white();

}

follow_black_line();
