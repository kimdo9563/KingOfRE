
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
obj.prototype.onClick = function() {
printMessage("this is obj")
}

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

function room_ui(room, name, image, width, x_loc, y_loc){
    obj.call(this, room, name, image, width, x_loc, y_loc); // obj 상속
}
room_ui.prototype = Object.create(obj.prototype);
room_ui.prototype.constructor = room_ui;

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
        room.life.onClick = function(){printMessage(player_life)}
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
money.prototype.create = function() {
    for (var i = 0; i < room_list.length; i++){
            room = room_list[i];
            room.money = new room_ui(room, "money", "moneybag.png", 50, 1050, 50);
            room.money.onClick = function() {printMessage(player_money)}
    }
}
money.prototype.change = function(change_money_amount) {
        var changed_money = player_money + change_money_amount;
        player_money = changed_money;
}

// =======================================================================================

_1st_floor_one = game.createRoom("_1st_floor_one", "background.png"); // 방 생성
_2st_floor_one = game.createRoom("_2st_floor_one", "background.png");

// 방을 생성하면, room_list 배열에 동기화 필수!
var room_list = new Array(
    _1st_floor_one,
    _2st_floor_one);


var player_life = 100;
var player_money = 500;

var Life = new life();  //플레이어 라이프 조작을 위한 객체 생성
Life.create()
var Money = new money();  //플레이어 소지금 조작을 위한 객체 생성
Money.create()

_1st_floor_one.zombie = new zombie(_1st_floor_one, "zombie", "zombie.png", 200, 1000, 500);
_2st_floor_one.zombie = new zombie(_2st_floor_one, "zombie", "zombie.png", 200, 1000, 500)
_2st_floor_one.zombie.onClick = function() { game.move(_1st_floor_one)}

game.start(_1st_floor_one); // 게임시작


