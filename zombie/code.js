/*
============================================================================================
|   객체지향 프로그래밍 - 팀 프로젝트
|   << Game Name >>
|   X 조
|   조원 : 김도형, 김혁민, 윤영배, 이우성
|   wiki : https://github.com/kimdo9563/KingOfRE/wiki/API-%EB%A6%AC%EC%8A%A4%ED%8A%B8
============================================================================================
*/

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

// ==============================
// |       Room UI Function     |
// ==============================

function arrow(room, name, go_to_room, width, x_loc, y_loc) {
    if (name == "left_arrow") {
        obj.call(this, room, name, "left_arrow.png", width, x_loc, y_loc)  //150, 100, 360
    } else if (name == "right_arrow") {
        obj.call(this, room, name, "right_arrow.png", width, x_loc, y_loc)  //150, 1200, 360
    } else if (name == "down_arrow") {
        obj.call(this, room, name, "down_arrow.png", width, x_loc, y_loc)  //200, 640, 650
    } else if (name == "up_arrow") {
        obj.call(this, room, name, "up_arrow.png", width, x_loc, y_loc)  //200, 640, 650
    }
    this.go_to_room = typeof go_to_room !== 'undefined' ? go_to_room: this.room;
}
arrow.prototype = Object.create(obj.prototype);
arrow.prototype.constructor = arrow;
arrow.prototype.onClick = function () {game.move(this.go_to_room)}

function empty_box(room, name, width, x_loc, y_loc, go_to_room) {
    obj.call(this, room, name, "empty_box.png", width, x_loc, y_loc)
    this.go_to_room = go_to_room;
}
empty_box.prototype = Object.create(obj.prototype);
empty_box.prototype.constructor = empty_box;
empty_box.prototype.onClick = function () {game.move(this.go_to_room)}

function battle(come_to_room, enemy){
    original_zombie = enemy;
    _battle_field.button_exit.onClick = function() {game.move(come_to_room); }

    _battle_field.zombie.obj.setSprite(enemy.image)
    _battle_field.zombie.life = enemy.life;
    _battle_field.zombie.damage = enemy.damage;

    game.move(_battle_field)
}

// ==============================
// |       Player Function      |
// ==============================
function player_control() {
    // 반드시 할당되는 객체의 이름을 "Player"로 해야합니다!
    // var Player = player_control();

    this.life = 0;
    this.stamina = 0;
    this.money = 0;
    this.quest_index = 1;
    this.quest_message = "퀘스트가 없습니다 !";

    this.damage = 0;
    this.skill_name = "";
    this.skill_damage = 0;
}
    /*
    // Prototype Description
    life_create         :   UI에 하트 생성
    life_change         :   라이프 변경(eg.공격을 받거나, 회복 아이템 사용 시)
    life_change_image   :   change 메소드에 따른, 라이프 이미지 변경(Do NOT use directly)

    stamina_create      :   UI에 기력 생성

    money_create        :   UI에 소지금 생성
    money_change        :   소지금 변경(eg.상점 이용, 플레어 사망 시)

    weapon              :   호출 시마다, 손에 장착한 무기를 바탕으로, 플레이어 스탯 정보 갱신

    quest_create        :   UI에 퀘스트 생성
    */
player_control.prototype.life_create = function() {
    for (var i = 0; i < room_list.length; i++){
        room = room_list[i];
        room.life = new obj(room, "life", "life_5.png", 300, 800, 50);
        room.life.onClick = function(){printMessage("HP : "+Player.life)}
    }
}
player_control.prototype.life_change = function(change_life_amount) {
    var changed_life = this.life + change_life_amount;

    if (changed_life <= 0) {game.gameover()}  // 라이프가 0이하면 게임오버
    if (changed_life > 100) {throw "체력이 초과하여 회복될 수 없습니다."}

    if (Math.floor(this.life/10) != Math.floor(changed_life/10)) {
    //자릿수가 바뀔 경우에만 실행
        if(changed_life > 0 && changed_life < 20) {this.life_change_image("life_1.png");}
        if(changed_life >= 20 && changed_life < 40) {this.life_change_image("life_2.png");}
        if(changed_life >= 40 && changed_life < 60) {this.life_change_image("life_3.png");}
        if(changed_life >= 60 && changed_life < 80) {this.life_change_image("life_4.png");}
        if(changed_life >= 80 && changed_life < 100) {this.life_change_image("life_5.png");}
    }
    this.life = changed_life;
}
player_control.prototype.life_change_image = function(change_to_life_image) {
    for(var i = 0; i < room_list.length; i++) {
        room = room_list[i];
        room.life.obj.setSprite(change_to_life_image)}
}

player_control.prototype.stamina_create = function() {
    for (var i = 0; i < room_list.length; i++){
        room = room_list[i];
        room.stamina = new obj(room, "stamina", "stamina.png", 50, 990, 50);
        room.stamina.onClick = function(){printMessage("Stamina : "+Player.stamina)}
    }
}
player_control.prototype.stamina_change = function(change_stamina_amount) {
    if(this.stamina + change_stamina_amount < 0) {throw "기력이 부족합니다."}
    if (this.stamina + change_stamina_amount > 50) {throw "기력이 초과하여 회복될 수 없습니다."}
    this.stamina += change_stamina_amount;
}

player_control.prototype.money_create = function() {
    for (var i = 0; i < room_list.length; i++){
            room = room_list[i];
            room.money = new obj(room, "money", "moneybag.png", 50, 1050, 50);
            room.money.onClick = function() {printMessage("소지금 : "+Player.money)}
    }
}
player_control.prototype.money_change = function(change_money_amount) {
        var changed_money = this.money + change_money_amount;
        this.money = changed_money;
}

player_control.prototype.weapon = function() {
    if (game.getHandItem() == _1st_floor_two.weapon_branch.obj) {
        this.damage = _1st_floor_two.weapon_branch.damage;
        this.skill_name = _1st_floor_two.weapon_branch.skill_name;
        this.skill_damage = _1st_floor_two.weapon_branch.skill_damage;
        }
    else if (game.getHandItem() == _shop_itemlist.weapon_axe.obj) {
        this.damage = _shop_itemlist.weapon_axe.damage
        this.skill_name = _shop_itemlist.weapon_axe.skill_name;
        this.skill_damage = _shop_itemlist.weapon_axe.skill_damage;
        }
    else if (game.getHandItem() == _shop_itemlist.weapon_chainsaw.obj) {
        this.damage = _shop_itemlist.weapon_chainsaw.damage;
        this.skill_name = _shop_itemlist.weapon_chainsaw.skill_name;
        this.skill_damage = _shop_itemlist.weapon_chainsaw.skill_damage;}
    else if (game.getHandItem() == _shop_itemlist.weapon_lightsaber.obj) {
        this.damage = _shop_itemlist.weapon_lightsaber.damage;
        this.skill_name = _shop_itemlist.weapon_lightsaber.skill_name;
        this.skill_damage = _shop_itemlist.weapon_lightsaber.skill_damage;}
    else if (game.getHandItem() == _shop_itemlist.weapon_railgun.obj) {
        this.damage = _shop_itemlist.weapon_railgun.damage;
        this.skill_name = _shop_itemlist.weapon_railgun.skill_name;
        this.skill_damage = _shop_itemlist.weapon_railgun.skill_damage;
        }
    else {throw "무기를 들고 오자."}
}

player_control.prototype.quest_create = function() {
    for (var i = 0; i < room_list.length; i++){
            room = room_list[i];
            room.quest = new obj(room, "quest", "quest.png", 50, 250, 50);
            room.quest.onClick = function() {game.printStory(Player.quest_message)}
    }
}
player_control.prototype.quest_check = function() {
    if(game.getHandItem() == quest_list[this.quest_index]["object"]) {
        this.quest_clear();
    }
}
player_control.prototype.quest_clear = function() {
    quest_list[this.quest_index]["flag"] = 1;
    this.quest_index++;
    this.quest_message = quest_list[this.quest_index]["name"]+"\n"+quest_list[this.quest_index]["description"]+"\n";
    printMessage("퀘스트를 완료했습니다.")
}

// ==============================
// |     NPC, etc.. Function    |
// ==============================

function shopNPC() {
    this.create()
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

function weapon(room, name, image, width, x_loc, y_loc, damage, skill_name, skill_damage, cost) {
    obj.call(this, room, name, image, width, x_loc, y_loc);
    this.damage = damage;
    this.skill_name = skill_name;
    this.skill_damage = skill_damage;
    this.cost = cost;
}
weapon.prototype = Object.create(obj.prototype)
weapon.prototype.constructor = weapon;
weapon.prototype.onClick = function () {
    if(Player.money >= this.cost) { this.obj.pick(); Player.money_change(0-this.cost) }
    else{printMessage("돈이 부족하다 !!")}
}

function item(room, name, image, width, x_loc, y_loc, cost, effect) {
    obj.call(this, room, name, image, width, x_loc, y_loc);

    this.cost = cost;
    this.effect = effect;
}
item.prototype = Object.create(obj.prototype)
item.prototype.constructor = item;
item.prototype.onClick = function () {
    if(Player.money >= this.cost) {
        try {
        this.effect();
        Player.money_change(0-this.cost)
        printMessage("회복되었습니다 !\n"+"현재 체력"+Player.life+"  현재 기력 : "+Player.stamina)
        } catch(e) { printMessage(e) }
        }
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
/* Initialize Room & Player Setting & Item Setting */

_elevator = game.createRoom("_elevator", "_elevator.png");
_elevator_button = game.createRoom("_elevator_button", "_elevator_button.png")

_shop_itemlist = game.createRoom("_shop_itemlist", "_shop_itemlist.png")

_battle_field = game.createRoom("_battle_field", "_battle_field.png")

_1st_floor_one = game.createRoom("_1st_floor_one", "background.png"); // 방 생성
_1st_floor_two = game.createRoom("_1st_floor_two", "_1st_floor_two.jpg");
_1st_floor_three = game.createRoom("_1st_floor_three", "_elevator_room.jpg");

_2nd_floor_one = game.createRoom("_2nd_floor_one", "_2nd_floor_one.png");

_3rd_floor_one = game.createRoom("_3rd_floor_one","지옥문_1.png")
_3rd_floor_two = game.createRoom("_3rd_floor_two","헬스장_1.jpg")
_3rd_floor_three = game.createRoom("_3rd_floor_three","헬스장_2.jpg")

_4th_floor_one = game.createRoom("_4th_floor_one", "4층_복도.jpg")
_4th_floor_two = game.createRoom("_4th_floor_two", "4층_회의실.jpg")
_4th_floor_three = game.createRoom("_4th_floor_three", "_elevator_room.jpg")

_boss_room_1 = game.createRoom("_boss_room_1", "dark_background.jpg"); // 방 생성
_boss_room_2 = game.createRoom("_boss_room_2","보스방2.jpg")
_boss_room_3 = game.createRoom("boss_room_3","background.png")

_roof_top_one = game.createRoom("_roof_top_one", "헬기장.jpg")
_roof_top_two = game.createRoom("_roof_top_two", "_elevator_room.jpg")

// 라이프와, 소지금이 보이길 원하는 방을 생성하면, room_list 배열에 동기화 필수!
var room_list = new Array(
    _battle_field,
    _1st_floor_one,
    _1st_floor_two,
    _1st_floor_three,
    _2nd_floor_one,
    _3rd_floor_one,
    _4th_floor_one,
    _4th_floor_two,
    _4th_floor_three,
    _roof_top_one,
    _roof_top_two);

//Player Initialize
var Player = new player_control();

Player.life_create()
Player.life_change(100)

Player.stamina_create()
Player.stamina_change(50)

Player.money_create()
Player.money_change(500)

Player.quest_create()

//Shop NPC Initialize
var Shop_NPC = new shopNPC();

// weapon initialize
// room, name, image, x_loc, y_loc, damage, skill_name, skill_damage
_1st_floor_two.weapon_branch = new weapon(_1st_floor_two, "weapon_branch", "weapon_branch.png", 80, 600, 600, 5, "엄마의 회초리", 1, 0)
_shop_itemlist.weapon_axe = new weapon(_shop_itemlist, "weapon_axe", "weapon_axe.png", 90, 90, 190, 10, "춤추는 회전도끼", 15, 50)
_shop_itemlist.weapon_chainsaw = new weapon(_shop_itemlist, "weapon_chainsaw", "weapon_chainsaw.png", 100, 230, 190, 15, "텍사스의 추억", 30, 200)
_shop_itemlist.weapon_lightsaber = new weapon(_shop_itemlist, "weapon_lightsaber", "weapon_lightsaber.png", 140, 370, 190, 20, "일격필살", 40, 400)
_shop_itemlist.weapon_railgun = new weapon(_shop_itemlist, "weapon_railgun", "weapon_railgun.png", 100, 510, 190, 25, "정조준 일격", 9999, 1000)

_shop_itemlist.lamb_sticks = new item(_shop_itemlist, "lamb_sticks", "lamb_sticks.png", 90, 1060, 450, 50, function() {Player.life_change(30)})
_shop_itemlist.tsingtao = new item(_shop_itemlist, "tsingtao", "tsingtao.png", 30, 1200, 460, 50, function() {Player.stamina_change(50)} )


//==========================================================================================
/* elevator */

_elevator.button_1 = new empty_box(_elevator, "button_1", 80, 1040, 420, _elevator_button)
_elevator.button_2 = new empty_box(_elevator, "button_2", 80, 1040, 485, _elevator_button)
_elevator.button_3 = new empty_box(_elevator, "button_3", 80, 1040, 550, _elevator_button)
_elevator.button_4 = new empty_box(_elevator, "button_4", 80, 1040, 590, _elevator_button)
_elevator_button._1st_floor = new empty_box(_elevator_button, "_1st_floor", 60, 730, 540, _1st_floor_three)
_elevator_button._2nd_floor = new empty_box(_elevator_button, "_2nd_floor", 60, 565, 420, _2nd_floor_one)
_elevator_button._3rd_floor = new empty_box(_elevator_button, "_3rd_floor", 60, 730, 420, _3rd_floor_one)
_elevator_button._4th_floor = new empty_box(_elevator_button, "_4th_floor", 60, 565, 300, _4th_floor_one)
_elevator_button._roof_top = new empty_box(_elevator_button, "_roof_top", 60, 730, 170, _roof_top_one)

//==========================================================================================
/* Battle Field */

var original_zombie;  //좀비를 처치 시, 원래 위치의 좀비를 hide 하기 위한 용도

_battle_field.button_attack = new empty_box(_battle_field, "button_attack", 150, 370, 510)
_battle_field.button_attack.obj.setSprite("empty_box3.png")
_battle_field.button_skill = new empty_box(_battle_field, "button_skill", 150, 410, 610)
_battle_field.button_skill.obj.setSprite("empty_box3.png")
_battle_field.button_exit = new empty_box(_battle_field, "button_exit", 100, 1000, 620)

_battle_field.button_attack.onClick = function () {
    try {
        Player.weapon();
        _battle_field.zombie.life -= Player.damage;
        Player.life_change(0-_battle_field.zombie.damage);
        printMessage("아다다다다 !\n"+"남은 HP("+Player.life+") 좀비 HP("+_battle_field.zombie.life+")");

        if(_battle_field.zombie.life <= 0) {
            printMessage("좀비를 무찔렀다!")
            _battle_field.button_exit.onClick()
            original_zombie.obj.hide();
        }
    } catch(e) {
        printMessage(e)
    }
}

_battle_field.button_skill.onClick = function () {
    try {
        Player.weapon();
        Player.stamina_change(-10)
        _battle_field.zombie.life -= Player.skill_damage;
        Player.life_change(0-_battle_field.zombie.damage);
        printMessage("필살 !"+Player.skill_name+" !!\n"+"남은 HP("+Player.life+") 좀비 HP("+_battle_field.zombie.life+")")

        if(_battle_field.zombie.life <= 0) {
            printMessage("좀비를 무찔렀다!")
            _battle_field.button_exit.onClick();
            original_zombie.obj.hide();
        }
    } catch(e) {
        printMessage(e)
    }
}

_battle_field.zombie = new zombie(_battle_field, "_battle_field.zombie","empty_box.png", 200, 1000, 230, 0, 0);


//==========================================================================================
/* 1st floor */

_1st_floor_one.shutter = new empty_box(_1st_floor_one, "shutter", 360, 730, 200)
_1st_floor_one.shutter.obj.setSprite("empty_box2.png")
_1st_floor_one.shutter.onDrag = function(direction) {
    if(direction=="Down" && _1st_floor_one.shutter.obj.move != 1) {
        _1st_floor_one.shutter.obj.moveY(220)
        _1st_floor_one.shutter.obj.move = 1;
        _1st_floor_one.shutter.obj.setSprite("shutter.png")
        _1st_floor_one.right_arrow = new arrow(_1st_floor_one, "right_arrow", _1st_floor_two, 100, 1200, 360)
        _1st_floor_one.right_arrow.onClick = function() {
            if(_1st_floor_one.right_arrow.flag != true) {
                printMessage("??? : 아직 낯설테니.. 간단한 도움을 주도록 하지")
                showImageViewer("tutorial1.png");
                _1st_floor_one.right_arrow.flag = true;
            }
            game.move(_1st_floor_two)
        }
        Player.quest_clear();
        printMessage("휴.. 일단 저 무서운 얼굴은 보이지 않게 되었군.")
    }
}



_1st_floor_two.left_arrow = new arrow(_1st_floor_two, "left_arrow", _1st_floor_one, 100, 100, 360)
_1st_floor_two.right_arrow = new arrow(_1st_floor_two, "right_arrow", _1st_floor_three, 100, 1200, 360)

_1st_floor_two.zombie = new zombie(_1st_floor_two, "zombie", "좀비_경찰.png", 200, 1000, 500, life=20, damage=2);
_1st_floor_two.zombie.onClick = function() {
    if(_1st_floor_two.zombie.flag != true) {
        printMessage("??? : 아직 낯설테니.. 간단한 도움을 주도록 하지")
        showImageViewer("tutorial2.png");
        _1st_floor_two.zombie.flag = true;
    }
    battle(_1st_floor_two, _1st_floor_two.zombie)
}

_1st_floor_three.left_arrow = new arrow(_1st_floor_three, "left_arrow", _1st_floor_two, 100, 100, 360)

_1st_floor_three.elevator = new obj(_1st_floor_three, "elevator", "silver_button.png", 60, 800, 360)
_1st_floor_three.elevator.onClick = function() {game.move(_elevator)}





//=============================================================================================
/* 2nd floor OR NPC */

_2nd_floor_one.down_arrow = new arrow(_2nd_floor_one, "down_arrow", _elevator, 100, 640, 650)

_shop_itemlist.exit_button = new obj(_shop_itemlist, "exit_button", "button_exit.png", 100, 1200, 680)
_shop_itemlist.exit_button.onClick = function(){ game.move( _2nd_floor_one) }

_2nd_floor_one.shop_select_quest.onClick = function() {
    Player.quest_check();
}

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
_3rd_floor_one.down_arrow = new arrow(_3rd_floor_one, "down_arrow", _elevator, 100, 640, 650)

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
_3rd_floor_two.right_arrow = new arrow(_3rd_floor_two,"right_arrow",_3rd_floor_three, 150, 1200, 360)
_3rd_floor_three.left_arrow = new arrow(_3rd_floor_three,"left_arrow",_3rd_floor_two, 150, 100, 360)

game.setGameoverMessage("좀비에게 물어뜯겼습니다..")

_3rd_floor_three.dark_portal.onClick = function(){
    game.move(_boss_room_1)
    printMessage("좀비를 피해 문으로 나아가세요")
}


//=============================================================================================
/* 4th floor */

_4th_floor_one.right_arrow = new arrow(_4th_floor_one, "right_arrow", _4th_floor_two, 150, 1200, 360)
_4th_floor_one.left_arrow = new arrow(_4th_floor_one, "left_arrow", _4th_floor_three, 150, 100, 360)
_4th_floor_two.left_arrow = new arrow(_4th_floor_two, "left_arrow", _4th_floor_one, 150, 100, 360)
_4th_floor_three.right_arrow = new arrow(_4th_floor_three, "right_arrow", _4th_floor_one, 150, 1200, 360)
_4th_floor_three.elevator = new obj(_4th_floor_three, "elevator", "silver_button.png", 60, 800, 360)
_4th_floor_three.elevator.onClick = function () { game.move(_elevator)}

// 문지기 좀비
_4th_floor_one.zombie1 = new zombie(_4th_floor_one, "zombie1", "3층좀비_4.png", 100, 640, 450, 30, 2);

// 좀비와 디비디비딥
var zombieFlag = 0
var playerFlag = 0

_4th_floor_two.zombie_heart = new obj(_4th_floor_two, "zombie_heart", "멈추지않는심장.png", 100, 640, 420)
_4th_floor_two.zombie_heart.obj.hide()
_4th_floor_two.zombie_heart.onClick = function(){
    _4th_floor_two.zombie_heart.obj.pick()
}

_4th_floor_two.up_arr = new obj(_4th_floor_two, "up_arr", "up_arrow.png", 100, 600, 460)
_4th_floor_two.down_arr = new obj(_4th_floor_two, "down_arr", "down_arrow.png", 100, 600, 660)
_4th_floor_two.left_arr = new obj(_4th_floor_two, "left_arr", "left_arrow.png", 100, 500, 560)
_4th_floor_two.right_arr = new obj(_4th_floor_two, "right_arr", "right_arrow.png", 100, 700, 560)

function dbdb(zombieFlag, playerFlag){
    zombieFlag = Math.floor(Math.random()*10)
    if(zombieFlag<2){zombieFlag = 1}
    else if(zombieFlag<5){zombieFlag = 2}
    else if(zombieFlag<8){zombieFlag = 3}
    else if(zombieFlag<10){zombieFlag = 4}
    
    if(zombieFlag===playerFlag){
        _4th_floor_two.db_zombie.obj.hide()
        _4th_floor_two.zombie_heart.obj.show()
        printMessage("좀비를 물리치니 심장이 떨어졌다.")
        _4th_floor_two.up_arr.obj.hide()
        _4th_floor_two.down_arr.obj.hide()
        _4th_floor_two.left_arr.obj.hide()
        _4th_floor_two.right_arr.obj.hide()
    } else {
        Player.life_change(-30)
        printMessage("예측에 실패했다..!"+"\n"+Player.life)
        zombieFlag = 0
        playerFlag = 0
        if(player_life<0){ game.gameover()}
    }
}

_4th_floor_two.up_arr.onClick = function(){
    playerFlag = 1
    dbdb(zombieFlag, playerFlag)}
_4th_floor_two.down_arr.onClick = function(){
    playerFlag = 2
    dbdb(zombieFlag, playerFlag)}
_4th_floor_two.left_arr.onClick = function(){
    playerFlag = 3
    dbdb(zombieFlag, playerFlag)}
_4th_floor_two.right_arr.onClick = function(){
    playerFlag = 4
    dbdb(zombieFlag, playerFlag)}

_4th_floor_two.up_arr.obj.hide()
_4th_floor_two.down_arr.obj.hide()
_4th_floor_two.left_arr.obj.hide()
_4th_floor_two.right_arr.obj.hide()

_4th_floor_two.db_zombie = new obj(_4th_floor_two, "db_zombie", "zombie.png", 200, 640, 200);
_4th_floor_two.db_zombie.onClick = function(){
    printStory("좀비와 디비디비딥! \n\n 방향예측에 성공하면 zombie kill! \n\n 방향예측에 실패하면 life -30 ")
    _4th_floor_two.up_arr.obj.show()
    _4th_floor_two.down_arr.obj.show()
    _4th_floor_two.left_arr.obj.show()
    _4th_floor_two.right_arr.obj.show()
}


// ************************ 슬롯머신*************************
_4th_floor_two.slot_machine_game = new obj(_4th_floor_two, "slot_machine_game", "슬롯머신_게임.png", 800, 640, 360)
_4th_floor_two.slot_machine_game.obj.hide()

_4th_floor_two.slot_machine = new obj(_4th_floor_two, "slot_machine", "슬롯머신_외관.png", 320, 1100, 500)
_4th_floor_two.slot_machine.onClick = function() {
    printStory("한 번에 단돈 90원! \n 77 잭팟 당첨시 +10000 \n 11 또는 99 당첨시 +5000 \n 22 또는 88당첨시 +3000 \n 33 또는 55당첨시 +1000") 
    _4th_floor_two.slot_machine_game.obj.show()
    _4th_floor_two.slot_machine.obj.hide()
} 

var slotArray = new Array(0, 0)
_4th_floor_two.slot_machine_game.onClick = function(){
    if(Player.money > 100){
        slotArray[0] = Math.floor(Math.random()*10)
        slotArray[1] = Math.floor(Math.random()*10)
        printMessage(slotArray[0]+" "+slotArray[1])
            if(slotArray[0]===7 && slotArray[1]===7){Player.money_change(10000)
            printMessage("축하합니다! \n 소지금 +10000")}
            else if(slotArray[0]===1 && slotArray[1]===1){Player.money_change(5000)
                printMessage("축하합니다! \n 소지금 +5000")}
            else if(slotArray[0]===3 && slotArray[1]===3){Player.money_change(1000)
                printMessage("축하합니다! \n 소지금 +1000")}
            else if(slotArray[0]===5 && slotArray[1]===5){Player.money_change(1000)
                printMessage("축하합니다! \n 소지금 +1000")}
            else if(slotArray[0]===9 && slotArray[1]===9){Player.money_change(5000)
                printMessage("축하합니다! \n 소지금 +5000")}
            else if(slotArray[0]===2 && slotArray[1]===2){Player.money_change(3000)
                printMessage("축하합니다! \n 소지금 +3000")}
            else if(slotArray[0]===8 && slotArray[1]===8){Player.money_change(3000)
                printMessage("축하합니다! \n 소지금 +3000")}
        Player.money_change(-90)
    } else {
        printMessage("소지금이 부족합니다.")
    }
    _4th_floor_two.slot_machine_game.obj.hide()
    _4th_floor_two.slot_machine.obj.show()
}
// ***************************슬롯머신*************************


//=============================================================================================
/* 5th floor */



//=============================================================================================
/* 6th floor */



//=============================================================================================
/* boss */

function keypad(room, name, image, width, x_loc, y_loc) {
    this.room = room;
    this.name = name;
    this.image = image;
    this.width = width;
    this.x_loc = x_loc;
    this.y_loc = y_loc;

    this.keypad = room.createObject(name, image);
    this.keypad.setWidth(width);
    room.locateObject(this.keypad, x_loc, y_loc);
}
keypad.prototype.onClick = function() {
    _boss_room_1.human.keypad.setSprite("생존자.png")

    //좀비 이동
    if(_boss_room_1.zombie1.keypad.getX()==100){ _boss_room_1.zombie1.keypad.move = false }
    else if(_boss_room_1.zombie1.keypad.getX()==300){ _boss_room_1.zombie1.keypad.moveX(100) }
    else{ _boss_room_1.zombie1.keypad.moveX(-100) }

    //2번 좀비
    if(_boss_room_1.zombie2.keypad.getY()==100){ _boss_room_1.zombie2.keypad.move = false }
    else{_boss_room_1.zombie2.keypad.moveY(-100)}

    //3번 좀비
    if(_boss_room_1.zombie3.keypad.getY()==600){ _boss_room_1.zombie3.keypad.move = false }
    else if(_boss_room_1.zombie3.keypad.getY()==400){ _boss_room_1.zombie3.keypad.moveY(-100) }
    else if(_boss_room_1.zombie3.keypad.getX()==600){ _boss_room_1.zombie3.keypad.moveY(100) }
    else{_boss_room_1.zombie3.keypad.moveX(100)}

    //4번 좀비
    if(_boss_room_1.zombie4.keypad.getX()==1200){ _boss_room_1.zombie4.keypad.move = false }
    else if(_boss_room_1.zombie4.keypad.getX()==800 && _boss_room_1.zombie4.keypad.getY()==200){
    _boss_room_1.zombie4.keypad.moveX(100)
    }
    else if(_boss_room_1.zombie4.keypad.getX()==800){ _boss_room_1.zombie4.keypad.moveY(100) }
    else{_boss_room_1.zombie4.keypad.moveX(100)}

    //5번 좀비
    if(_boss_room_1.zombie5.keypad.getX()==100){ _boss_room_1.zombie5.keypad.move = false }
    else{_boss_room_1.zombie5.keypad.moveX(-100)}

    //화살표 클릭
    if(this.name == "left_arrow"){
        if(_boss_room_1.human.keypad.getX()==100){ printMessage("이동불가") }
        else{_boss_room_1.human.keypad.moveX(-100)}
    }
    if(this.name=="right_arrow"){
        if(_boss_room_1.human.keypad.getX()==1200){ printMessage("이동불가") }
        else{_boss_room_1.human.keypad.moveX(100)}
    }
    if(this.name=="up_arrow"){
        if(_boss_room_1.human.keypad.getY()==100){ printMessage("이동불가") }
        else{_boss_room_1.human.keypad.moveY(-100)}
    }
    if(this.name=="down_arrow"){
        if(_boss_room_1.human.keypad.getY()==600){ printMessage("이동불가") }
        else{_boss_room_1.human.keypad.moveY(100)}
    }

    if(_boss_room_1.human.keypad.getX()==_boss_room_1.zombie1.keypad.getX() && _boss_room_1.human.keypad.getY()==_boss_room_1.zombie1.keypad.getY()){
        printMessage("Game Over")
        _boss_room_1.human.keypad.setSprite("blood.png")
    }
    if(_boss_room_1.human.keypad.getX()==_boss_room_1.zombie2.keypad.getX() && _boss_room_1.human.keypad.getY()==_boss_room_1.zombie2.keypad.getY()){
        printMessage("Game Over")
        _boss_room_1.human.keypad.setSprite("blood.png")
    }
    if(_boss_room_1.human.keypad.getX()==_boss_room_1.zombie3.keypad.getX() && _boss_room_1.human.keypad.getY()==_boss_room_1.zombie3.keypad.getY()){
        printMessage("Game Over")
        _boss_room_1.human.keypad.setSprite("blood.png")
    }
    if(_boss_room_1.human.keypad.getX()==_boss_room_1.zombie4.keypad.getX() && _boss_room_1.human.keypad.getY()==_boss_room_1.zombie4.keypad.getY()){
        printMessage("Game Over")
        _boss_room_1.human.keypad.setSprite("blood.png")
    }
    if(_boss_room_1.human.keypad.getX()==_boss_room_1.zombie5.keypad.getX() && _boss_room_1.human.arrow.getY()==_boss_room_1.zombie5.arrow.getY()){
        printMessage("Game Over")
        _boss_room_1.human.keypad.setSprite("blood.png")
    }
    if(_boss_room_1.human.keypad.getX()==1200 && _boss_room_1.human.keypad.getY()==300){
        game.move(_boss_room_2)
        printMessage("보스방이다")
    }
}

_boss_room_1.human = new keypad(_boss_room_1,"human","생존자.png",80,100,600)

_boss_room_1.zombie1 = new keypad(_boss_room_1,"zombie1","zombie.png",80,500,500)
_boss_room_1.zombie2 = new keypad(_boss_room_1,"zombie2","3층좀비_3.png",70,800,600)
_boss_room_1.zombie3 = new keypad(_boss_room_1,"zombie3","3층좀비_6.png",70,300,200)
_boss_room_1.zombie4 = new keypad(_boss_room_1,"zombie4","3층좀비_5.png",70,400,100)
_boss_room_1.zombie5 = new keypad(_boss_room_1,"zombie5","3층좀비_4.png",70,1100,600)
_boss_room_1.gate = new keypad(_boss_room_1,"gate","보스방2.jpg",100,1200,300)

_boss_room_1.left_arrow = new keypad(_boss_room_1,"left_arrow","left_arrow.png",100,900,600)
_boss_room_1.right_arrow = new keypad(_boss_room_1,"right_arrow","right_arrow.png",100,1100,600)
_boss_room_1.up_arrow = new keypad(_boss_room_1,"up_arrow","up_arrow.png",85,1000,500)
_boss_room_1.down_arrow = new keypad(_boss_room_1,"down_arrow","down_arrow.png",85,1000,650)

_boss_room_2.enter = new keypad(_boss_room_2,"enter","up_arrow.png",60,650,500)
_boss_room_2.enter.onClick= function(){ game.move(_boss_room_3) }

_boss_room_3.boss = new keypad(_boss_room_3,"boss","근육좀비_1.png",400,600,400)


//=============================================================================================

/* roof_top */ // 신호를 주면 헬리콥터 show. 헬리콥터 onClick 탈출 성공
_roof_top_one.left_arrow = new arrow(_roof_top_one, "left_arrow", _roof_top_two, 150, 100, 360)
_roof_top_two.right_arrow = new arrow(_roof_top_two, "right_arrow", _roof_top_one, 150, 1200, 360)
_roof_top_two.elevator = new obj(_roof_top_two, "elevator", "silver_button.png", 60, 800, 360)
_roof_top_two.elevator.onClick = function () { game.move(_elevator) }

    // 1 0 1 0 신호
var playerArr = new Array(0,0,0,0)
var clickCount = 0
var lanternFlag = 0
function signal(){
    if(playerArr[0]==1 && playerArr[1]==0&&playerArr[2]==1&&playerArr[3]==0){
        printMessage("헬리콥터가 랜턴의 신호를 보고 옥상에 착륙했다!")
        _roof_top_one.helicopter.obj.show()
        _roof_top_one.lanternOff.obj.hide()
        _roof_top_one.on_button.obj.hide()
        _roof_top_one.off_button.obj.hide()
    } else if(clickCount == 4) {
        printMessage("신호가 틀립니다.")
        clickCount=0
        playerArr[0]=0
        playerArr[1]=0
        playerArr[2]=0
        playerArr[3]=0
    }
}

_roof_top_one.lanternOff = new obj(_roof_top_one, "lanternOff", "랜턴오프.png", 150, 1000, 580)
_roof_top_one.on_button = new obj(_roof_top_one, "on_button", "onbutton.png", 150, 1150, 450)
_roof_top_one.off_button = new obj(_roof_top_one, "off_button", "offbutton.png", 150, 1150, 550)

_roof_top_one.on_button.obj.hide()
_roof_top_one.off_button.obj.hide()

_roof_top_one.on_button.onClick = function(){
    if(lanternFlag == 0){
        _roof_top_one.lanternOff.obj.setSprite("랜턴온.png")
        lanternFlag = 1
        playerArr.shift()
        playerArr.push(1)
        clickCount++
        printMessage(clickCount + "\n" + playerArr)
        signal()
    } else if(lanternFlag == 1){
        playerArr.shift()
        playerArr.push(1)
        clickCount++
        printMessage(clickCount + "\n" + playerArr)
        signal()
    }
}
_roof_top_one.off_button.onClick = function(){
    if(lanternFlag == 1){
        _roof_top_one.lanternOff.obj.setSprite("랜턴오프.png")
        lanternFlag = 0
        playerArr.shift()
        playerArr.push(0)
        clickCount++
        printMessage(clickCount + "\n" + playerArr)
        signal()
    } else if(lanternFlag == 0) {
        playerArr.shift()
        playerArr.push(0)
        clickCount++
        printMessage(clickCount + "\n" + playerArr)
        signal()
    }
}

_roof_top_one.lanternOff.onClick = function(){
    _roof_top_one.on_button.obj.show()
    _roof_top_one.off_button.obj.show()
}

    // 헬리콥터 탈출
_roof_top_one.helicopter = new obj(_roof_top_one, "helicopter", "helicopter.png", 500, 1000, 360)
_roof_top_one.helicopter.obj.hide()
_roof_top_one.helicopter.onClick = function(){ 
    printMessage("헬리콥터를 타고 탈출에 성공했습니다!")
    game.clear()}


_roof_top_one.helicopter.onClick = function(){ game.clear() }

//=============================================================================================
//꼭 맨 뒤에 선언, 아이템 선언이 먼저 나오므로

var quest_list = {
    1: {
        "name": "셔터를 내리자 !\n\n",
        "object": null,
        "description": "건물 밖의 수 많은 좀비들이 따라오고 있다!\n출입문의 셔터를 내려 들어오지 못하게 차단하자.",
        "flag": 0
    },
    2: {
        "name": "또 일어난 강간사건?\n\n",
        "object" : undefined,
        "description": "그래! 김혁민이는 잘 잡아왔구만...\n"+"하지만 말야, 다른 문제가 생겼어..",
        "flag": 0
    }
<<<<<<< HEAD
<<<<<<< HEAD
=======
}

>>>>>>> master

}*/
=======
}

>>>>>>> master

game.start(_1st_floor_one)