
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

function quest(){};
    /*
    // Prototype Description
    create         :   UI에 퀘스트 생성
    */
quest.prototype.create = function() {
    for (var i = 0; i < room_list.length; i++){
            room = room_list[i];
            room.quest = new room_ui(room, "quest", "quest.png", 50, 250, 50);
            room.quest.onClick = function() {game.printStory(quest_message)}
    }
}

/*
=====================
|    객체 관련 Func
|
=====================
*/

function shopNPC() {
    this.create()
    this.change_quest()
}
shopNPC.prototype.create = function() {
    _2nd_floor_one.shopNPC = new obj(_2nd_floor_one, "shopNPC", "empty_box.png", 200, 300, 200)

    _2nd_floor_one.shop_select_window = new obj(_2nd_floor_one, "shop_select_window", "shop_select_window.png", 1000, 640, 580)
    _2nd_floor_one.shop_select_window.obj.hide()

    _2nd_floor_one.shop_select_itemlist = new empty_box(_2nd_floor_one, "shop_select_itemlist", 100, 400, 540, _shop_itemlist)
    _2nd_floor_one.shop_select_itemlist.obj.hide()

    _2nd_floor_one.shop_select_quest = new empty_box(_2nd_floor_one, "shop_select_quest", 100, 400, 620)
    _2nd_floor_one.shop_select_quest.obj.hide()

    _2nd_floor_one.shopNPC.onClick = function() {
        if(_2nd_floor_one.shopNPC.obj.isClosed()) {
            _2nd_floor_one.shop_select_window.obj.show();
            _2nd_floor_one.shop_select_itemlist.obj.show();
            _2nd_floor_one.shop_select_quest.obj.show();
            _2nd_floor_one.shopNPC.obj.open()}
        else {
            _2nd_floor_one.shop_select_window.obj.hide();
            _2nd_floor_one.shop_select_itemlist.obj.hide();
            _2nd_floor_one.shop_select_quest.obj.hide();
            _2nd_floor_one.shopNPC.obj.close()}
        }
}
shopNPC.prototype.change_quest = function() {
    var quest_index = 1;
    _2nd_floor_one.shop_select_quest.onClick = function() {
        if(game.getHandItem() == quest_list[quest_index]["object"]) {
            quest_list[quest_index]["flag"] = 1;
            quest_index++;
        }
        quest_message = quest_list[quest_index]["name"]+"\n"+quest_list[quest_index]["description"]+"\n";
        game.printStory(quest_message)
    }
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


// ========================================================================================
/* Initialize Room & Value Setting */

_elevator = game.createRoom("_elevator", "_elevator.png");
_elevator_button = game.createRoom("_elevator_button", "_elevator_button.png")

_shop_itemlist = game.createRoom("_shop_itemlist", "_shop_itemlist.png")

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
var Quest = new quest();
Quest.create()


//==========================================================================================
/* elevator */

_elevator.button = new empty_box(_elevator, "button", 80, 1100, 330, _elevator_button)
_elevator_button._1st_floor = new empty_box(_elevator_button, "_1st_floor", 60, 550, 500, _1st_floor_three)
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
_1st_floor_one.zombie.onClick = function() {printMessage(quest_list[1]["object"])}




//=============================================================================================
/* 2nd floor OR NPC */

_2nd_floor_one.elevator = new obj(_2nd_floor_one, "elevator", "_elevator.png", 100, 1200, 360)
_2nd_floor_one.elevator.onClick = function () { game.move(_elevator)}

Shop_NPC = new shopNPC();

_shop_itemlist.exit_button = new empty_box(_shop_itemlist, "exit_button", 50, 1200, 680, _2nd_floor_one)

_2nd_floor_one.test_item = new obj(_2nd_floor_one, "test_item", "empty_box.png", 100, 800, 300)
_2nd_floor_one.test_item.onClick = function() { _2nd_floor_one.test_item.obj.pick()}


//=============================================================================================
/* 3rd floor */



//=============================================================================================
/* 4th floor */



//=============================================================================================
/* 5th floor */



//=============================================================================================
/* 6th floor */



//=============================================================================================
/* 7th floor */



//=============================================================================================
/* roof_top */



//=============================================================================================
//꼭 맨 뒤에 선언, 아이템 선언이 먼저 나오므로
var quest_list = {
    1: {
        "name": "김혁민 탈주사건!\n\n",
        "object": _2nd_floor_one.test_item.obj,
        "description": "이봐! 김혁민이가 또 탈출했어. 잡아주게",
        "flag": 0
    },
    2: {
        "name": "또 일어난 강간사건?\n\n",
        "object" : undefined,
        "description": "그래! 김혁민이는 잘 잡아왔구만...\n"+"하지만 말야, 다른 문제가 생겼어..",
        "flag": 0
    }
}

game.start(_1st_floor_one); // 게임시작


