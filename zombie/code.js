
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
        room_ui.call(this, room, name, "left_arrow.png", 150, 100, 360)
    } else if (name == "right_arrow") {
        room_ui.call(this, room, name, "right_arrow.png", 150, 1200, 360)
    } else if (name == "down_arrow") {
        room_ui.call(this, room, name, "down_arrow.png", 200, 640, 650)
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
|    플레이어 관련 Func
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

function battle(come_to_room, enemy){
    _battle_field.button_exit.onClick = function() {game.move(come_to_room)}

    _battle_field.zombie.obj.setSprite(enemy.image)
    _battle_field.zombie.life = enemy.life;
    _battle_field.zombie.damage = enemy.damage;

    _battle_field.zombie.onClick = function() { printMessage("test") }

    game.move(_battle_field)

    //room, name, image, width, x_loc, y_loc, life, damage
    /*
    try {
        var weapon = game.getHandItem();

    } catch(e) {
        printMessage("무기를 들고 덤비자")
    }
    */
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
    _2nd_floor_one.shopNPC = new obj(_2nd_floor_one, "shopNPC", "_shop_npc.png", 300, 880, 235)

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

function weapon(room, name, image, width, x_loc, y_loc, damage, skill_name, skill_damage, cost) {
    obj.call(this, room, name, image, width, x_loc, y_loc);
    this.damage = damage;
    this.skill_name = skill_name;
    this.skill_damage = skill_damage;
    this.cost = cost;
}
weapon.prototype = Object.create(obj.prototype)
weapon.prototype.constructor = weapon;
/*(weapon.prototype.onClick = function(){
	game.createObject
	blue_screen.show();
}
*/
weapon.prototype.onClick = function () {
    if(player_money > this.cost) { this.obj.pick(); Money.change(0-this.cost) }
    else{printMessage("돈이 부족하다 !!")}
}

function zombie(room, name, image, width, x_loc, y_loc, life, damage) {
    obj.call(this, room, name, image, width, x_loc, y_loc);
    this.name = name;
    this.image = image;
    this.width = width;
    this.x_loc = x_loc;
    this.y_loc = y_loc;
    this.life = life;
    this.damage = damage;
}
zombie.prototype = Object.create(obj.prototype)
zombie.prototype.constructor = zombie;
zombie.prototype.onClick = function() {
    battle(this.room, this)
}


// ========================================================================================
/* Initialize Room & Value Setting */

_elevator = game.createRoom("_elevator", "_elevator.png");
_elevator_button = game.createRoom("_elevator_button", "_elevator_button.png")

_shop_itemlist = game.createRoom("_shop_itemlist", "_shop_itemlist.png")

_battle_field = game.createRoom("_battle_field", "_battle_field.png")

_1st_floor_one = game.createRoom("_1st_floor_one", "background.png"); // 방 생성
_1st_floor_two = game.createRoom("_1st_floor_two", "background.png");
_1st_floor_three = game.createRoom("_1st_floor_three", "background.png");

_2nd_floor_one = game.createRoom("_2nd_floor_one", "_2nd_floor_one.png");

_3rd_floor_one = game.createRoom("_3rd_floor_one","지옥문_1.png")
_3rd_floor_two = game.createRoom("_3rd_floor_two","헬스장_1.jpg")
_3rd_floor_three = game.createRoom("_3rd_floor_three","헬스장_2.jpg")

_4th_floor_one = game.createRoom("_4th_floor_one", "4층_복도.jpg")
_4th_floor_two = game.createRoom("_4th_floor_two", "4층_회의실.jpg")

_roof_top_one = game.createRoom("_roof_top_one", "헬기장.jpg")
_roof_top_two = game.createRoom("_roof_top_two", "_elevator_room.jpg")

// 라이프와, 소지금이 보이길 원하는 방을 생성하면, room_list 배열에 동기화 필수!
var room_list = new Array(
    _battle_field,
    _1st_floor_one,
    _1st_floor_two,
    _1st_floor_three,
    _2nd_floor_one,
    _elevator,
    _3rd_floor_one,
    _4th_floor_one,
    _4th_floor_two,
    _roof_top_one,
    _roof_top_two);

//초기값
var player_life = 100;
var player_money = 500;
var player_weapon;

var Life = new life();  //플레이어 라이프 조작을 위한 객체 생성
Life.create()
var Money = new money();  //플레이어 소지금 조작을 위한 객체 생성
Money.create()
var Quest = new quest();
Quest.create()

// weapon initialize
// room, name, image, x_loc, y_loc, damage, skill_name, skill_damage
_1st_floor_two.weapon_branch = new weapon(_1st_floor_two, "weapon_branch", "weapon_branch.png", 50, 600, 600, 5, "엄마의 회초리", 1, 0)
_shop_itemlist.weapon_axe = new weapon(_shop_itemlist, "weapon_axe", "weapon_axe.png", 90, 90, 190, 10, "춤추는 회전도끼", 15, 50)
_shop_itemlist.weapon_chainsaw = new weapon(_shop_itemlist, "weapon_chainsaw", "weapon_chainsaw.png", 100, 230, 190, 15, "텍사스의 추억", 30, 200)
_shop_itemlist.weapon_lightsaber = new weapon(_shop_itemlist, "weapon_lightsaber", "weapon_lightsaber.png", 140, 370, 190, 20, "일격필살", 40, 400)
_shop_itemlist.weapon_railgun = new weapon(_shop_itemlist, "weapon_railgun", "weapon_railgun.png", 100, 510, 190, 25, "정조준 일격", 9999, 1000)




//==========================================================================================
/* elevator */

_elevator.button_1 = new empty_box(_elevator, "button_1", 80, 1040, 420, _elevator_button)
_elevator.button_2 = new empty_box(_elevator, "button_2", 80, 1040, 485, _elevator_button)
_elevator.button_3 = new empty_box(_elevator, "button_3", 80, 1040, 550, _elevator_button)
_elevator.button_4 = new empty_box(_elevator, "button_4", 80, 1040, 590, _elevator_button)
_elevator_button._1st_floor = new empty_box(_elevator_button, "_1st_floor", 60, 580, 530, _1st_floor_three)
_elevator_button._2nd_floor = new empty_box(_elevator_button, "_2nd_floor", 60, 685, 530, _2nd_floor_one)
_elevator_button._3rd_floor = new empty_box(_elevator_button, "_3rd_floor", 60, 685, 480, _3rd_floor_one)
_elevator_button._4th_floor = new empty_box(_elevator_button, "_4th_floor", 60, 580, 480, _4th_floor_one)
_elevator_button._roof_top = new empty_box(_elevator_button, "_roof_top", 60, 580, 380, _roof_top_one)

//==========================================================================================
/* Battle Field */

_battle_field.button_attack = new empty_box(_battle_field, "button_attack", 100, 380, 500)
_battle_field.button_skill = new empty_box(_battle_field, "button_skill", 100, 380, 620)
_battle_field.button_exit = new empty_box(_battle_field, "button_exit", 100, 1000, 620)

_battle_field.button_attack.onClick = function () {

    try {
        player_weapon = game.getHandItem();
        _battle_field.zombie.hp -= player_weapon.damage;
        player_life -= _battle_field.zombie.damage;
    } catch(e) {
        printMessage("무기를 들고 덤비자")
    }

}

_battle_field.zombie = new zombie(_battle_field, "_battle_field.zombie","empty_box.png", 100, 1000, 200, 0, 0);


//==========================================================================================
/* 1st floor */

_1st_floor_one.right_arrow = new arrow(_1st_floor_one, "right_arrow", _1st_floor_two)

_1st_floor_two.left_arrow = new arrow(_1st_floor_two, "left_arrow", _1st_floor_one)
_1st_floor_two.right_arrow = new arrow(_1st_floor_two, "right_arrow", _1st_floor_three)

_1st_floor_three.left_arrow = new arrow(_1st_floor_three, "left_arrow", _1st_floor_two)

_1st_floor_three.elevator = new obj(_1st_floor_three, "elevator", "_elevator.png", 100, 800, 360)
_1st_floor_three.elevator.onClick = function () { game.move(_elevator) }



_1st_floor_one.zombie = new zombie(_1st_floor_one, "zombie", "zombie.png", 200, 1000, 500, 30, 2);


//=============================================================================================
/* 2nd floor OR NPC */

//_2nd_floor_one.down_arrow = new arrow(_2nd_floor_one, "down_arrow", _elevator)

Shop_NPC = new shopNPC();

_shop_itemlist.exit_button = new obj(_shop_itemlist, "exit_button", "button_exit.png", 100, 1200, 680)
_shop_itemlist.exit_button.onClick = function(){ game.move( _2nd_floor_one) }

/*_2nd_floor_one.test_item = new obj(_2nd_floor_one, "test_item", "empty_box.png", 100, 800, 300)
_2nd_floor_one.test_item.onClick = function() { _2nd_floor_one.test_item.obj.pick()}*/

//=============================================================================================
/* 3rd floor */

// 사내 헬스장 좀비 출물 지역!

/*3층용 객체 */
function randomLocationX(){
randomValue = Math.random();
intValue = (randomValue * 950)+50;
return intValue
}
function randomLocationY(){
randomValue = Math.random();
intValue = (randomValue * 700)+ 50;
return intValue
}

var countUp = 0

function fps(room, name, image, width, x_loc, y_loc) {
    this.room = room;
    this.name = name;
    this.image = image;
    this.width = width;
    this.x_loc = x_loc;
    this.y_loc = y_loc;

    this.obj = room.createObject(name, image);
    this.obj.setWidth(width);
    room.locateObject(this.obj, x_loc, y_loc);
    this.obj.hide()
    this.obj.lock()

}
fps.prototype.onClick = function(){
    if(this.obj.isLocked()){
        countUp += 1
    }
    this.obj.unlock()
    this.obj.setSprite("blood.png")

    if(countUp > 9){
        game.hideTimer()
        printMessage("공습에서 살아남으셨습니다")
        _3rd_floor_three.dark_portal.obj.show()
    }
}

_3rd_floor_one.health_door = new empty_box(_3rd_floor_one,"health_door",450,600,400,_3rd_floor_two) //문에 투명 공간
_3rd_floor_one.health_door.obj.hide()

_3rd_floor_one.chain = new obj(_3rd_floor_one,"chain","쇠사슬_1.png",500,650,400)
_3rd_floor_one.muscle = new obj(_3rd_floor_one,"muscle","근육좀비_1.png",500,200,400)

_3rd_floor_one.chain.obj.lock()


//onClick 재정의
_3rd_floor_one.muscle.onClick = function() { printMessage("넌 못지나간다!");
 game.printStory("약력\n스쿼트: 250kg\n벤치프레스: 400kg\n 데드리프트: 500kg\n 턱걸이: 80회\n 팔굽혀펴기: 100회")}

_3rd_floor_one.chain.onClick = function(){
    printMessage("3대 중량을 입력해라.")
    showKeypad("number","1150",function(){
        _3rd_floor_one.chain.obj.unlock()
        printMessage("프로틴...근손실...")
        _3rd_floor_one.chain.obj.hide()
        _3rd_floor_one.health_door.obj.show()
    })
}

_3rd_floor_two._3rd_zombie_1 = new fps(_3rd_floor_two,"_3rd_zombie_1","3층좀비_1.png",100,randomLocationX(),randomLocationY())
_3rd_floor_two._3rd_zombie_2 = new fps(_3rd_floor_two,"_3rd_zombie_2","3층좀비_2.png",110,randomLocationX(),randomLocationY())
_3rd_floor_two._3rd_zombie_3 = new fps(_3rd_floor_two,"_3rd_zombie_3","3층좀비_3.png",120,randomLocationX(),randomLocationY())
_3rd_floor_two._3rd_zombie_4 = new fps(_3rd_floor_two,"_3rd_zombie_4","3층좀비_4.png",130,randomLocationX(),randomLocationY())
_3rd_floor_two._3rd_zombie_5 = new fps(_3rd_floor_two,"_3rd_zombie_5","3층좀비_5.png",140,randomLocationX(),randomLocationY())
_3rd_floor_three._3rd_zombie_6 = new fps(_3rd_floor_three,"_3rd_zombie_6","3층좀비_1.png",150,randomLocationX(),randomLocationY())
_3rd_floor_three._3rd_zombie_7 = new fps(_3rd_floor_three,"_3rd_zombie_7","3층좀비_2.png",150,randomLocationX(),randomLocationY())
_3rd_floor_three._3rd_zombie_8 = new fps(_3rd_floor_three,"_3rd_zombie_8","3층좀비_3.png",150,randomLocationX(),randomLocationY())
_3rd_floor_three._3rd_zombie_9 = new fps(_3rd_floor_three,"_3rd_zombie_9","3층좀비_4.png",150,randomLocationX(),randomLocationY())
_3rd_floor_three._3rd_zombie_10 = new fps(_3rd_floor_three,"_3rd_zombie_10","3층좀비_5.png",150,randomLocationX(),randomLocationY())

//포탈생성
_3rd_floor_three.dark_portal = new obj(_3rd_floor_three,"dark_portal","dark_portal.png",400,550,400)
_3rd_floor_three.dark_portal.obj.hide()

_3rd_floor_two.brain = new obj(_3rd_floor_two,"brain","brain.png",500, 500, 400)
_3rd_floor_two.brain.onClick = function(){
game.printStory("제한시간안에 좀비들을 모두 사살하자\n 실패시 죽음")
_3rd_floor_two.brain.obj.hide()
game.setTimer(15,1,"[그들이...온다!]")
_3rd_floor_two._3rd_zombie_1.obj.show()
_3rd_floor_two._3rd_zombie_2.obj.show()
_3rd_floor_two._3rd_zombie_3.obj.show()
_3rd_floor_two._3rd_zombie_4.obj.show()
_3rd_floor_two._3rd_zombie_5.obj.show()
_3rd_floor_three._3rd_zombie_6.obj.show()
_3rd_floor_three._3rd_zombie_7.obj.show()
_3rd_floor_three._3rd_zombie_8.obj.show()
_3rd_floor_three._3rd_zombie_9.obj.show()
_3rd_floor_three._3rd_zombie_10.obj.show()
}

_3rd_floor_two.right_arrow = new arrow(_3rd_floor_two,"right_arrow",_3rd_floor_three)
_3rd_floor_three.left_arrow = new arrow(_3rd_floor_three,"left_arrow",_3rd_floor_two)


//=============================================================================================
/* 4th floor */ // 회의실에서 
_4th_floor_one.right_arrow = new arrow(_4th_floor_one, "right_arrow", _4th_floor_two)
_4th_floor_one.left_arrow = new arrow(_4th_floor_one, "left_arrow", _4th_floor_two)
_4th_floor_two.left_arrow = new arrow(_4th_floor_two, "left_arrow", _4th_floor_one)




// ************************ 슬롯머신*************************
// if문으로 할 번 돌릴 때 필요한 돈 정해야 함.
_4th_floor_two.slot_machine_game = new obj(_4th_floor_two, "slot_machine_game", "슬롯머신_게임.png", 800, 640, 360)
_4th_floor_two.slot_machine_game.obj.hide()

_4th_floor_two.slot_machine = new obj(_4th_floor_two, "slot_machine", "슬롯머신_외관.png", 350, 1000, 500)
_4th_floor_two.slot_machine.onClick = function() { _4th_floor_two.slot_machine_game.obj.show()} 

var slotArray = new Array(0, 0, 0)
_4th_floor_two.slot_machine_game.onClick = function(){
    if(player_money > 100){
        slotArray[0] = Math.floor(Math.random()*10)
        slotArray[1] = Math.floor(Math.random()*10)
        slotArray[2] = Math.floor(Math.random()*10)
        printMessage(slotArray[0]+" "+slotArray[1]+" "+slotArray[2])
            if(slotArray[0]===7 && slotArray[1]===7 && slotArray[2]===7){
                player_money += 10000
            } // 잭팟
        player_money-=90
    } else {
        printMessage("소지금이 부족합니다.")
    }

    _4th_floor_two.slot_machine_game.obj.hide()
}
// ***************************슬롯머신*************************

//=============================================================================================
/* 5th floor */



//=============================================================================================
/* 6th floor */



//=============================================================================================
/* 7th floor */



//=============================================================================================
/* roof_top */ // 신호를 주면 헬리콥터 show. 헬리콥터 onClick 탈출 성공
_roof_top_one.left_arrow = new arrow(_roof_top_one, "left_arrow", _roof_top_two)
_roof_top_two.right_arrow = new arrow(_roof_top_two, "right_arrow", _roof_top_one)
_roof_top_two.elevator = new obj(_roof_top_two, "elevator", "_elevator.png", 100, 800, 360)
_roof_top_two.elevator.onClick = function () { game.move(_elevator)}

    // 헬리콥터 호출하는 설정 정해야 함
_roof_top_one.helicopter = new obj(_roof_top_one, "helicopter", "helicopter.png", 300, 720, 360)
_roof_top_one.helicopter.obj.hide()
_roof_top_one.helicopter.onClick = function(){ game.clear()}


//=============================================================================================
//꼭 맨 뒤에 선언, 아이템 선언이 먼저 나오므로
/*var quest_list = {
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
}*/



game.start(_1st_floor_one); // 게임시작



