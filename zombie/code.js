﻿
function obj(room, name, image, width, x_loc, y_loc) {
    this.room = room;
    this.name = name;
    this.image = image;
    this.width = width;
    this.x_loc = x_loc;
    this.y_loc = y_loc;

    this.obj = room.createObject(name, image);
    this.obj.setWidth(width);
    room.locateObject(this.obj, x_loc, y_loc);
}
obj.prototype.onClick = function() { printMessage("test : this is obj") }

/*
=====================
|    방 UI 관련 Func
|
=====================
*/
function room_ui(room, name, image, width, x_loc, y_loc){
    obj.call(this, room, name, image, width, x_loc, y_loc); // obj 상속
    }
room_ui.prototype = Object.create(obj.prototype);
room_ui.prototype.constructor = room_ui;

function arrow(room, name, go_to_room) {
    if (name == "left_arrow") {
        room_ui.call(this, room, name, "left_arrow.png", 50, 30, 360)
    } else if (name == "right_arrow") {
        room_ui.call(this, room, name, "right_arrow.png", 50, 1250, 360)
    }

    this.go_to_room = go_to_room;
}
arrow.prototype = Object.create(room_ui.prototype);
arrow.prototype.constructor = arrow;
arrow.prototype.onClick = function () {game.move(this.go_to_room)}

function empty_box(room, name, width, x_loc, y_loc, go_to_room) {
    room_ui.call(this, room, name, "empty_box.png", width, x_loc, y_loc)
    this.go_to_room = go_to_room;
}
empty_box.prototype = Object.create(room_ui.prototype);
empty_box.prototype.constructor = empty_box;
empty_box.prototype.onClick = function () {game.move(this.go_to_room)}
/*
============================
|    플레이어 스탯 관련 Func
|
============================
*/

function life(){
    /*
    // Prototype Description
    create         :   UI에 하트 생성
    change         :   라이프 변경(eg.공격을 받거나, 회복 아이템 사용 시)
    change_image   :   change 메소드에 따른, 라이프 이미지 변경(Do NOT use directly)
    */
}
life.prototype.create = function() {
    for (var i = 0; i < room_list.length; i++){
        room = room_list[i];
        room.life = new room_ui(room, "life", "life_5.png", 300, 860, 50);
        room.life.onClick = function(){printMessage("HP : "+player_life)}
    }
}
life.prototype.change = function(change_life_amount) {
    var changed_life = player_life + change_life_amount;

    if (changed_life <= 0) {game.gameover()}  // 라이프가 0이하면 게임오버

    if (Math.floor(player_life/10) != Math.floor(changed_life/10)) {
    //자릿수가 바뀔 경우에만 실행
        if(changed_life > 0 && changed_life < 20) {this.change_image("life_1.png");}
        if(changed_life >= 20 && changed_life < 40) {this.change_image("life_2.png");}
        if(changed_life >= 40 && changed_life < 60) {this.change_image("life_3.png");}
        if(changed_life >= 60 && changed_life < 80) {this.change_image("life_4.png");}
        if(changed_life >= 80 && changed_life < 100) {this.change_image("life_5.png");}
    }
    player_life = changed_life
}
life.prototype.change_image = function(change_to_life_image) {
    for(var i = 0; i < room_list.length; i++) {
        room = room_list[i];
        room.life.obj.setSprite(change_to_life_image)}
}

function money(){};
    /*
    // Prototype Description
    create         :   UI에 소지금 생성
    change         :   소지금 변경(eg.상점 이용, 플레어 사망 시)
    */
money.prototype.create = function() {
    for (var i = 0; i < room_list.length; i++){
            room = room_list[i];
            room.money = new room_ui(room, "money", "moneybag.png", 50, 1050, 50);
            room.money.onClick = function() {printMessage("소지금 : "+player_money)}
    }
}
money.prototype.change = function(change_money_amount) {
        var changed_money = player_money + change_money_amount;
        player_money = changed_money;
}

/*
=====================
|    객체 관련 Func
|
=====================
*/

function zombie(room, name, image, width, x_loc, y_loc) {
    obj.call(this, room, name, image, width, x_loc, y_loc);
}
zombie.prototype = Object.create(obj.prototype)
zombie.prototype.constructor = zombie;
zombie.prototype.onClick = function() {
    Life.change(-5)
    Money.change(-10)
    printMessage(player_life)
    game.move(_2st_floor_one)
}


// ========================================================================================
/* Initialize Room & Value Setting */

_elevator = game.createRoom("_elevator", "_elevator.png");
_elevator_button = game.createRoom("_elevator_button", "_elevator_button.png")

_1st_floor_one = game.createRoom("_1st_floor_one", "background.png"); // 방 생성
_1st_floor_two = game.createRoom("_1st_floor_two", "background.png");
_1st_floor_three = game.createRoom("_1st_floor_three", "background.png");

_2nd_floor_one = game.createRoom("_2nd_floor_one", "_2nd_floor_one.png");

// 라이프와, 소지금이 보이길 원하는 방을 생성하면, room_list 배열에 동기화 필수!
var room_list = new Array(
    _1st_floor_one,
    _1st_floor_two,
    _1st_floor_three,
    _2nd_floor_one);

//초기값
var player_life = 100;
var player_money = 500;

var Life = new life();  //플레이어 라이프 조작을 위한 객체 생성
Life.create()
var Money = new money();  //플레이어 소지금 조작을 위한 객체 생성
Money.create()

//==========================================================================================
/* elevator */

_elevator.button = new empty_box(_elevator, "button", 80, 1100, 330, _elevator_button)
_elevator_button._2nd_floor = new empty_box(_elevator_button, "_2nd_floor", 60, 700, 500, _2nd_floor_one)

//==========================================================================================
/* 1st floor */

_1st_floor_one.right_arrow = new arrow(_1st_floor_one, "right_arrow", _1st_floor_two)

_1st_floor_two.left_arrow = new arrow(_1st_floor_two, "left_arrow", _1st_floor_one)
_1st_floor_two.right_arrow = new arrow(_1st_floor_two, "right_arrow", _1st_floor_three)

_1st_floor_three.left_arrow = new arrow(_1st_floor_three, "left_arrow", _1st_floor_two)


_1st_floor_three.elevator = new obj(_1st_floor_three, "elevator", "_elevator.png", 100, 800, 360)
_1st_floor_three.elevator.onClick = function () { game.move(_elevator)}



_1st_floor_one.zombie = new zombie(_1st_floor_one, "zombie", "zombie.png", 200, 1000, 500);



//=============================================================================================
game.start(_1st_floor_one); // 게임시작

