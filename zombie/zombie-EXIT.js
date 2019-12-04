/*
============================================================================================
|                               객체지향 프로그래밍 - 팀 프로젝트
|                                       << Game Name >>
|          9 조
|          조원 : 김도형, 김혁민, 윤영배, 이우성
|          wiki : https://github.com/kimdo9563/KingOfRE/wiki/API-%EB%A6%AC%EC%8A%A4%ED%8A%B8
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
    obj.call(this, room, name, "empty_box_r.png", width, x_loc, y_loc)
    this.go_to_room = go_to_room;
}
empty_box.prototype = Object.create(obj.prototype);
empty_box.prototype.constructor = empty_box;
empty_box.prototype.onClick = function () {game.move(this.go_to_room)}

/*
function elevator_button(room, name, width, x_loc, y_loc, go_to_room){
	obj.call(this, room, name, "empty_box.png", width, x_loc, y_loc)
	this.go_to_room = go_to_room;
}
elevator_button.prototype = Object.create(obj.prototype);
elevator_button.prototype.constructor = elevator_button;
elevator_button.prototype.onClick = function(){
	playSound("elevator.wav")
	gmae.move(this.go_to_room)
	}
*/

function battle(come_to_room, enemy){
    original_zombie = enemy;
    _battle_field.button_exit.onClick = function() {game.move(come_to_room); }

    _battle_field.zombie.obj.setSprite(enemy.image)
    _battle_field.zombie.life = enemy.life;
    _battle_field.zombie.damage = enemy.damage;

    game.move(_battle_field)
}

function battle_boss(come_to_room, enemy){
    //상점npc hide
    original_boss = enemy;
    _battle_field_boss.zombie.obj.setSprite(enemy.image)
    _battle_field_boss.zombie.life = enemy.life;
    _battle_field_boss.zombie.damage = enemy.damage;

    game.move(_battle_field_boss)
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

    this.quest_index = 0;
    this.quest_message = " ";

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
    stamina_change      :   기력 변경(eg. 스킬 사용, 회복 아이템 사용 시)

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

    if (changed_life > 100) {
        if(this.life == 100) {throw "체력이 최대이므로 회복될 수 없습니다."}
        changed_life = 100;
    } else {
        if (changed_life <= 0) {game.gameover()}
    }
      // 라이프가 0이하면 게임오버

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
    var changed_stamina = this.stamina + change_stamina_amount;

    if(changed_stamina > 50) {
        if (this.stamina == 50) { throw "기력이 최대이므로 회복될 수 없습니다." }
        this.stamina = 50;
    } else {
        if (changed_stamina < 0) { throw "기력이 부족합니다." }
        this.stamina = changed_stamina;
    }
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
        this.skill_damage = _1st_floor_two.weapon_branch.skill_damage; }
    else if (game.getHandItem() == _shop_itemlist.weapon_axe.obj) {
        this.damage = _shop_itemlist.weapon_axe.damage
        this.skill_name = _shop_itemlist.weapon_axe.skill_name;
        this.skill_damage = _shop_itemlist.weapon_axe.skill_damage; }
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
        this.skill_damage = _shop_itemlist.weapon_railgun.skill_damage; }
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
    if(eval(quest_list[this.quest_index]["object"])) {
        //game.getHandItem() == quest_list[this.quest_index]["object"]
        this.quest_clear();
    } else { throw null; }
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
    if(this == _1st_floor_two.weapon_branch) {
        printMessage("??? : 우선 그 나뭇가지라도 이용해 그 녀석을 물리쳐 !" + "\n이거로...?");
        _1st_floor_two.click1.obj.hide()}
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
		if(this == _shop_itemlist.tsingtao){
			playSound("tsingtao.wav")
		} else if(this == _shop_itemlist.lamb_sticks){
			playSound("lamb_sticks.wav")
		}
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
	playSound("zombie_growling.wav")
    battle(this.room, this)
}


// ========================================================================================
/* Initialize Room & Player Setting & Item Setting */

_building_outside = game.createRoom("_building_outside", "building_outside.png")

_elevator = game.createRoom("_elevator", "_elevator.png");
_elevator_button = game.createRoom("_elevator_button", "_elevator_button.png")

_shop_itemlist = game.createRoom("_shop_itemlist", "_shop_itemlist.png")

_battle_field = game.createRoom("_battle_field", "_battle_field.png")
_battle_field_boss = game.createRoom("_battle_field_boss","_battle_field_boss.png")

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

_5th_floor_one = game.createRoom("_5th_floor_one", "5층강당.jpg")
_5th_floor_two = game.createRoom("_5th_floor_two", "_elevator_room.jpg")
_5th_floor_three = game.createRoom("_5th_floor_three", "5층화장실.jpg")

_boss_room_1 = game.createRoom("_boss_room_1", "dark_background.jpg"); // 방 생성
_boss_room_2 = game.createRoom("_boss_room_2","보스방2.jpg")
_boss_room_3 = game.createRoom("_boss_room_3","회장실.png")
_boss_room_4 = game.createRoom("_boss_room_4","회장실.png")
_boss_room_5 = game.createRoom("_boss_room_5","회장실.png")

_roof_top_one = game.createRoom("_roof_top_one", "헬기장.jpg")
_roof_top_two = game.createRoom("_roof_top_two", "_elevator_room.jpg")

// 라이프, 소지금, 퀘스트, 기력 등이 보이길 원하는 방을 생성하면, room_list 배열에 동기화 필수!
var room_list = new Array(
    _battle_field,
    _battle_field_boss,
    _1st_floor_one,
    _1st_floor_two,
    _1st_floor_three,
    _2nd_floor_one,
    _3rd_floor_one,
    _4th_floor_one,
    _4th_floor_two,
    _4th_floor_three,
    _5th_floor_one,
    _5th_floor_two,
    _5th_floor_three,
    _roof_top_one,
    _roof_top_two,
    _boss_room_1,
    _boss_room_2,
    _boss_room_3,
    _boss_room_4,
    _boss_room_5);

//Player Initialize
// 체력, 기력, 소지금 최대치를 변환하려면 thing_changed 수정 필요
var Player = new player_control();

Player.life_create()
Player.life_change(100)

Player.stamina_create()
Player.stamina_change(50)

Player.money_create()
Player.money_change(0)

Player.quest_create()

// weapon initialize
// room, name, image, x_loc, y_loc, damage, skill_name, skill_damage
_1st_floor_two.weapon_branch = new weapon(_1st_floor_two, "weapon_branch", "weapon_branch.png", 150, 400, 500, 5, "엄마의 회초리", 1, 0)
_shop_itemlist.weapon_axe = new weapon(_shop_itemlist, "weapon_axe", "weapon_axe.png", 90, 90, 190, 10, "춤추는 회전도끼", 15, 50)
_shop_itemlist.weapon_chainsaw = new weapon(_shop_itemlist, "weapon_chainsaw", "weapon_chainsaw.png", 100, 230, 190, 15, "텍사스의 추억", 30, 200)
_shop_itemlist.weapon_lightsaber = new weapon(_shop_itemlist, "weapon_lightsaber", "weapon_lightsaber.png", 140, 370, 190, 30, "일격필살", 60, 400)
_shop_itemlist.weapon_railgun = new weapon(_shop_itemlist, "weapon_railgun", "weapon_railgun.png", 100, 510, 190, 80, "정조준 일격", 9999, 1000)

_shop_itemlist.lamb_sticks = new item(_shop_itemlist, "lamb_sticks", "lamb_sticks.png", 90, 1060, 450, 50, function() {Player.life_change(30)})
_shop_itemlist.tsingtao = new item(_shop_itemlist, "tsingtao", "tsingtao.png", 30, 1200, 460, 50, function() {Player.stamina_change(50)} )


// etc
_5th_floor_three.monster_heart = _5th_floor_three.createObject("monster_heart","monster_heart.png")
_5th_floor_three.monster_heart.hide()
_5th_floor_three.monster_heart.setItemDescription("펄떡..펄떡..")
//==========================================================================================
/* elevator */

_elevator.button_1 = new empty_box(_elevator, "button_1", 80, 1040, 420, _elevator_button)
_elevator.button_2 = new empty_box(_elevator, "button_2", 80, 1040, 485, _elevator_button)
_elevator.button_3 = new empty_box(_elevator, "button_3", 80, 1040, 550, _elevator_button)
_elevator.button_4 = new empty_box(_elevator, "button_4", 80, 1040, 590, _elevator_button)
_elevator_button._1st_floor = new empty_box(_elevator_button, "_1st_floor", 60, 730, 540, _1st_floor_three)
_elevator_button._1st_floor.onClick = function() {
	printMessage("1층 입니다.")
	playSound("elevator.wav")
	game.move(this.go_to_room)
}
_elevator_button._2nd_floor = new empty_box(_elevator_button, "_2nd_floor", 60, 565, 420, _2nd_floor_one)
_elevator_button._2nd_floor.onClick = function() {
	printMessage("2층 입니다.")
	playSound("elevator.wav")
	game.move(this.go_to_room)
}
_elevator_button._3rd_floor = new empty_box(_elevator_button, "_3rd_floor", 60, 730, 420, _3rd_floor_one)
_elevator_button._3rd_floor.onClick = function() {
	printMessage("3층 입니다.")
	playSound("elevator.wav")
	game.move(this.go_to_room)
}
_elevator_button._4th_floor = new empty_box(_elevator_button, "_4th_floor", 60, 565, 300, _4th_floor_one)
_elevator_button._4th_floor.onClick = function() {
	printMessage("4층 입니다.")
	playSound("elevator.wav")
	game.move(this.go_to_room)
}
_elevator_button._5th_floor = new empty_box(_elevator_button, "_5th_floor", 60, 730, 300, _5th_floor_one)
_elevator_button._5th_floor.onClick = function() {
	printMessage("5층 입니다.")
	playSound("elevator.wav")
	game.move(this.go_to_room)
}
_elevator_button._roof_top = new empty_box(_elevator_button, "_roof_top", 60, 730, 170, _roof_top_one)
_elevator_button._roof_top.onClick = function() {
	printMessage("옥상 입니다.")
	playSound("elevator.wav")
	game.move(this.go_to_room)
}

//==========================================================================================
/* Battle Field */

var original_zombie;  //좀비를 처치 시, 원래 위치의 좀비를 hide 하기 위한 용도

_battle_field.button_attack = new empty_box(_battle_field, "button_attack", 150, 370, 540)
_battle_field.button_attack.obj.setSprite("empty_box3_r.png")
_battle_field.button_skill = new empty_box(_battle_field, "button_skill", 150, 410, 620)
_battle_field.button_skill.obj.setSprite("empty_box3_r.png")
_battle_field.button_exit = new empty_box(_battle_field, "button_exit", 100, 980, 620)

_battle_field.button_attack.onClick = function () {
    try {
		playSound("zombie_hit.wav")
        Player.weapon();
        _battle_field.zombie.life -= Player.damage;
        Player.life_change(0-_battle_field.zombie.damage);
        printMessage("아다다다다 !\n"+"남은 HP("+Player.life+") 좀비 HP("+_battle_field.zombie.life+")");

        if(_battle_field.zombie.life <= 0) {
			playSound("zombie_die.wav")
            printMessage("좀비를 무찔렀다!")
            _battle_field.button_exit.onClick()
            original_zombie.obj.hide();
            original_zombie.obj.lock();
        }
    } catch(e) {
        printMessage(e)
    }
}

_battle_field.button_skill.onClick = function () {
    try {
		if(game.getHandItem() == _1st_floor_two.weapon_branch.obj){
			playSound("branch.wav")
		} 
		else if(game.getHandItem() == _shop_itemlist.weapon_axe){
			playSound("axe.wav")
		} 
		else if(game.getHandItem() == _shop_itemlist.weapon_chainsaw){
			playSound("chainsaw.wav")
		}
		else if(game.getHandItem() == _shop_itemlist.weapon_lightsaber){
			playSound("lightsaber.wav")
		}
		else if(game.getHandItem() == _shop_itemlist.weapon_railgun){
			playSound("railgun.wav")
		}

        Player.weapon();
        Player.stamina_change(-10)
        _battle_field.zombie.life -= Player.skill_damage;
        Player.life_change(0-_battle_field.zombie.damage);
        printMessage("필살 !"+Player.skill_name+" !!\n"+"남은 HP("+Player.life+") 좀비 HP("+_battle_field.zombie.life+")")

        if(_battle_field.zombie.life <= 0) {
			playSound("zombie_die.wav")
            printMessage("좀비를 무찔렀다!")
            _battle_field.button_exit.onClick();
            original_zombie.obj.hide();
            original_zombie.obj.lock();
        }
    } catch(e) {
        printMessage(e)
    }
}

_battle_field.zombie = new zombie(_battle_field, "_battle_field.zombie","empty_box.png", 350, 640, 280, 0, 0);


//==========================================================================================
/* BOSS - Battle Field */
var original_boss;  //좀비를 처치 시, 원래 위치의 좀비를 hide 하기 위한 용도
var _battle_field_boss_flag = 0

_battle_field_boss.button_attack = new empty_box(_battle_field_boss, "button_attack", 150, 370, 510)
_battle_field_boss.button_attack.obj.setSprite("empty_box3.png")
_battle_field_boss.button_skill = new empty_box(_battle_field_boss, "button_skill", 150, 410, 610)
_battle_field_boss.button_skill.obj.setSprite("empty_box3.png")
_battle_field_boss.button_exit = new empty_box(_battle_field_boss, "button_exit", 100, 1000, 620)

_battle_field_boss.button_attack.onClick = function () {
    try {
		playSound("zombie_hit.wav")
        Player.weapon();
        _battle_field_boss.zombie.life -= Player.damage;
        Player.life_change(0-_battle_field_boss.zombie.damage);
        printMessage("아다다다다 !\n"+"남은 HP("+Player.life+") 좀비 HP("+_battle_field_boss.zombie.life+")");

        if(_battle_field_boss.zombie.life <= 0 && _battle_field_boss_flag == 0) {
            printMessage(" 휴... 해치웠나..? ");
            _battle_field_boss.zombie.obj.setSprite("보스_사망.png")
            _battle_field_boss.button_attack.obj.hide()
            _battle_field_boss.button_skill.obj.hide()
            _battle_field_boss_flag = 1
        }
        else if(_battle_field_boss.zombie.life <= 0 && _battle_field_boss_flag ==2){
            _battle_field_boss.zombie.obj.hide()
            printMessage("케에에에에에엨")
            _battle_field_boss_flag = 3
            _battle_field_boss.item.obj.show()
            _battle_field_boss.button_attack.obj.hide()
            _battle_field_boss.button_skill.obj.hide()
        }
    }
    catch(e){printMessage(e)}
}
        /*
        } else if (_battle_field_boss.zombie.life <= 0 && _battle_field_boss.flag == 1) {
            original_boss.obj.hide();
            battle_boss(_boss_room_5, _boss_room_5.boss3);
            _battle_field_boss.button_exit.onClick = function() { game.move(_elevator) }
        }*/
_battle_field_boss.button_exit.onClick = function() {
    if(_battle_field_boss_flag == 1){
        printMessage("크르르르...\n죽.여.버.리.겠.다!!")
        battle_boss(_boss_room_5,_boss_room_5.boss3)
        _battle_field_boss_flag = 2
        _battle_field_boss.button_attack.obj.show()
        _battle_field_boss.button_skill.obj.show()
    }
    if(_battle_field_boss_flag == 3){
        if(boss_itemFlag == false){
            printMessage("아이템을 습득해야합니다.")
        } else if(boss_itemFlag == true){
            printMessage("휴...살았다")
            game.move(_elevator)
        }
    }
    if(_battle_field_boss_flag == 0 || _battle_field_boss_flag == 2){printMessage("어딜 도망가!")}
}


_battle_field_boss.button_skill.onClick = function () {
    try {
		if(game.getHandItem() == _1st_floor_two.weapon_branch.obj){
			playSound("branch.wav")
		} 
		else if(game.getHandItem() == _shop_itemlist.weapon_axe){
			playSound("axe.wav")
		} 
		else if(game.getHandItem() == _shop_itemlist.weapon_chainsaw){
			playSound("chainsaw.wav")
		}
		else if(game.getHandItem() == _shop_itemlist.weapon_lightsaber){
			playSound("lightsaber.wav")
		}
		else if(game.getHandItem() == _shop_itemlist.weapon_railgun){
			playSound("railgun.wav")
		}
        Player.weapon();
        Player.stamina_change(-10)
        _battle_field_boss.zombie.life -= Player.skill_damage;
        Player.life_change(0-_battle_field_boss.zombie.damage);
        printMessage("필살 !"+Player.skill_name+" !!\n"+"남은 HP("+Player.life+") 좀비 HP("+_battle_field_boss.zombie.life+")")


        if(_battle_field_boss.zombie.life <= 0 && _battle_field_boss_flag == 0) {
            printMessage(" 휴... 해치웠나..? ");
            _battle_field_boss.zombie.obj.setSprite("보스_사망.png")
            _battle_field_boss.button_attack.obj.hide()
            _battle_field_boss.button_skill.obj.hide()
            _battle_field_boss_flag = 1
        }
        else if(_battle_field_boss.zombie.life <= 0 && _battle_field_boss_flag ==2){
            _battle_field_boss.zombie.obj.hide()
            printMessage("케에에에에에엨")
            _battle_field_boss_flag = 3
            _battle_field_boss.item.obj.show()
            _battle_field_boss.button_attack.obj.hide()
            _battle_field_boss.button_skill.obj.hide()
        }
    }
    catch(e){printMessage(e)}
}

_battle_field_boss.zombie = new zombie(_battle_field_boss, "_battle_field_boss.zombie","empty_box.png", 250, 400, 230, 0, 0);
_battle_field_boss.item = new obj(_battle_field_boss,"item","보스_아이템.png",150,400,360)
_battle_field_boss.item2 = new obj(_battle_field_boss,"item2","보스_양피지.png",100,400,400)
_battle_field_boss.item.obj.hide()
_battle_field_boss.item2.obj.hide()

_battle_field_boss.item.onClick = function(){
    _battle_field_boss.item2.obj.pick()
    _battle_field_boss.item.obj.hide()
    boss_itemFlag = true
}
var boss_itemFlag = false



//==========================================================================================
/* building_outside  */
_building_outside.building = new obj(_building_outside, "building", "right_arrow.png", 100, 1200, 320)
_building_outside.building.onClick = function(){
    game.move(_1st_floor_one)
    printMessage("후아.... 우선, 셔터를 내려 문을 차단하자")
}

//==========================================================================================
/* 1st floor */
_1st_floor_one.setRoomLight(0.5)
_1st_floor_one.shutter = new empty_box(_1st_floor_one, "shutter", 360, 730, 200)
_1st_floor_one.shutter.obj.setSprite("empty_box2.png")
_1st_floor_one.shutter.onDrag = function(direction) {
    if(direction=="Down" && _1st_floor_one.shutter.obj.move != 1) {
		playSound("shutter_door_.wav")
        _1st_floor_one.shutter.obj.moveY(220)
        _1st_floor_one.shutter.obj.move = 1;
        _1st_floor_one.shutter.obj.setSprite("shutter.png")
        Player.quest_check();
        printMessage("휴.. 일단 저 무서운 얼굴은 보이지 않게 되었군.")

        _1st_floor_one.right_arrow = new arrow(_1st_floor_one, "right_arrow", _1st_floor_two, 100, 1200, 360)
        _1st_floor_one.right_arrow.onClick = function() {
            if(_1st_floor_one.right_arrow.flag != true) {
                printMessage("??? : 학생 !! 이걸 읽어봐"+"\n응....? 누구지..")
                showImageViewer("tutorial1.png");
                playSound("zombie.wav")
                _1st_floor_one.right_arrow.flag = true;

            }
            game.move(_1st_floor_two)

        }

    }
}

_1st_floor_two.left_arrow = new arrow(_1st_floor_two, "left_arrow", _1st_floor_one, 100, 100, 360)
_1st_floor_two.right_arrow = new arrow(_1st_floor_two, "right_arrow", _1st_floor_three, 100, 1200, 360)

_1st_floor_two.right_arrow.obj.hide()

_1st_floor_two.click1 = new obj(_1st_floor_two, "click1", "click1.png", 200, 300, 500)
_1st_floor_two.click2 = new obj(_1st_floor_two, "click2", "click2.png", 200, 810, 550)

_1st_floor_two.zombie = new zombie(_1st_floor_two, "zombie", "좀비_경찰.png", 200, 1000, 500, life=20, damage=2);
_1st_floor_two.zombie.onClick = function() {
    _1st_floor_two.click2.obj.hide()
    if(_1st_floor_two.zombie.flag != true) {
        printMessage("??? : 학생!! 정신 차리고 이걸 읽어봐!!"+"\n...? 아까부터 누구야!!")
        showImageViewer("tutorial2.png");
        _1st_floor_two.zombie.flag = true;
        _1st_floor_two.right_arrow.obj.show()
    }
	playSound("zombie_growling.wav")
    battle(_1st_floor_two, _1st_floor_two.zombie)
}

_1st_floor_two.right_arrow.onClick = function() {
    if(!(_1st_floor_two.zombie.obj.isLocked())) {printMessage("??? : 좀비처리 하고 와 ~"); return;}
    if(_1st_floor_two.right_arrow.flag != true) {
        Player.quest_check();
        printMessage("??? : 잘했어~ 이제 엘리베이터를 타고 2층으로 와~\n나 여기있어~")
        _1st_floor_two.right_arrow.flag = true;
    }
    game.move(_1st_floor_three)
}

_1st_floor_three.left_arrow = new arrow(_1st_floor_three, "left_arrow", _1st_floor_two, 100, 100, 360)

_1st_floor_three.elevator = new obj(_1st_floor_three, "elevator", "silver_button.png", 60, 800, 360)
_1st_floor_three.elevator.onClick = function() {game.move(_elevator)}


//=============================================================================================
/* 2nd floor OR NPC */

_2nd_floor_one.down_arrow = new arrow(_2nd_floor_one, "down_arrow", _elevator, 100, 1200, 650)
_2nd_floor_one.shopNPC = new obj(_2nd_floor_one, "shopNPC", "_shop_npc.png", 300, 880, 235)

_2nd_floor_one.shop_select_window = new obj(_2nd_floor_one, "shop_select_window", "shop_select_window.png", 1000, 600, 580)
_2nd_floor_one.shop_select_window.obj.hide()

_2nd_floor_one.shop_select_itemlist = new empty_box(_2nd_floor_one, "shop_select_itemlist", 100, 400, 540, _shop_itemlist)
_2nd_floor_one.shop_select_itemlist.obj.hide()

_2nd_floor_one.shop_select_quest = new empty_box(_2nd_floor_one, "shop_select_quest", 100, 400, 620)
_2nd_floor_one.shop_select_quest.obj.hide()

_2nd_floor_one.shop_select_quest.onClick = function() {
    try {Player.quest_check();}
    catch(e) { game.printStory(Player.quest_message) }
}
_2nd_floor_one_flag = 1;
_2nd_floor_one.shopNPC.onClick = function() {
    if (_2nd_floor_one_flag === 1) {
        _2nd_floor_one_flag = 2;
        var message = "";
        message += "상점 아주머니 : "
        message += "아휴~ 잘생긴 총각이었네. 어쩌다 이런 곳에 오게\n 된거야 그래..?"
        message += "다치진 않았지? 응... \n나는 원래 이 회사의 매점을 운영하고 있었단다.\n"
        message += "그런데 갑자기 사람들이 이상한 괴물로 변하더니만...\n"
        message += "나도 이곳에서 꼼짝도 못하고 숨어있지 뭐야.. 휴..\n\n"
        message += "자, 우선 지쳐보이니 내가 직접 구운 양꼬치와 칭따오를 줄게.\n\n"
        message += "[SYSTEM] 체력과 기력이 모두 회복되었습니다."
        game.printStory(message)
        Player.life_change(100);
        Player.stamina_change(50);
    } else if (_2nd_floor_one_flag === 2) {
        var message = "";
        message += "상점 아주머니 : "
        message += "나는 다양한 상품들을 가지고 있지..\n"
        message += "이 건물에 득실거리는 좀비들을 상대하려면, 아무래도.. 그 나무가지로는\n"
        message += "부족할거야.. 언제든지 내게오면 꽤 쓸만한 무기들을 제공해주지.\n"
        message += "그리고 방금 네가 먹은 양꼬치와 칭따오도 많이 있으니 자주 오렴.\n\n"
        message += "아.. 괴물놈들이 사라지고 쓸 여비는 필요하니 조금은 돈을 받아도 괜찮지?\n\n"
        message += "뭐? 돈이 없다고? 크흠.... 좋아. 일단 너에게 150원을 줄테니 나중에 갚도록 해.\n\n"
        message += "[SYSTEM] 150원을 획득하였습니다."
        Player.money_change(150)
        Player.quest_check()
        game.printStory(message)
        _2nd_floor_one_flag = false;

    } else if (_2nd_floor_one_flag == false) {
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

_2nd_floor_one.diary = new obj(_2nd_floor_one, "diary", "diary.png", 80, 900, 360)
_2nd_floor_one.diary.obj.hide()
_2nd_floor_one.diary.onClick = function(){
	showImageViewer("diary_펼침.png", "")
}


_shop_itemlist.exit_button = new obj(_shop_itemlist, "exit_button", "button_exit.png", 100, 1200, 680)
_shop_itemlist.exit_button.onClick = function(){ game.move( _2nd_floor_one) }
_shop_itemlist.menu_button = new obj(_shop_itemlist, "menu_button", "button_menu.png", 100, 200, 680)
_shop_itemlist.menu_button.onClick = function(){ showImageViewer("menu.png", "") }



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
        _3rd_floor_three.down_arrow.obj.show()
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
        _3rd_floor_one.muscle.obj.hide()
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

_3rd_floor_three.down_arrow = new arrow(_3rd_floor_three, "down_arrow", _elevator, 100, 640, 650)
_3rd_floor_three.down_arrow.obj.hide()

_3rd_floor_three.warning = new obj(_3rd_floor_three, "warning", "warning.png", 400, 1000, 340)
_3rd_floor_three.warning_yes = new empty_box(_3rd_floor_three, "warning_yes", 100, 900, 530)
_3rd_floor_three.warning_no = new empty_box(_3rd_floor_three, "warning_no", 100, 1100, 530)

_3rd_floor_three.warning_yes.onClick = function() {
    game.move(_boss_room_1);
    printMessage("왼쪽 아래 생존자를\n우측의 방까지 이동시키세요")
    _3rd_floor_three.dark_portal.obj.hide()
    _2nd_floor_one.shopNPC.obj.lock()
    _2nd_floor_one.shopNPC.obj.hide() //상점 npc hide
}
_3rd_floor_three.warning_no.onClick = function() {
    game.move(_elevator);
    printMessage("[SYSTEM] : 강해져서 돌아오세요.")
}
_3rd_floor_three.warning.obj.hide()
_3rd_floor_three.warning_yes.obj.hide()
_3rd_floor_three.warning_no.obj.hide()

//포탈생성
_3rd_floor_three.dark_portal = new obj(_3rd_floor_three,"dark_portal","dark_portal.png",400,550,400)
_3rd_floor_three.dark_portal.obj.close()
_3rd_floor_three.dark_portal.onClick = function() {
    if( (_3rd_floor_three.dark_portal.obj.isClosed() ) && (game.getHandItem() == _5th_floor_three.monster_heart) ) {
        printMessage("심장의 박동소리가 점점 커지더니 포탈 속에서 알 수 없는 힘이 요동친다!!")
        _3rd_floor_three.dark_portal.obj.open()
    } else if (_3rd_floor_three.dark_portal.obj.isOpened() ) {
        _3rd_floor_three.warning.obj.show()
        _3rd_floor_three.warning_yes.obj.show()
        _3rd_floor_three.warning_no.obj.show()

    }
    else {
        _2nd_floor_one.shopNPC.obj.hide()
        _2nd_floor_one.diary.obj.show()
        _2nd_floor_one.shop_select_window.obj.show()
        _2nd_floor_one.shop_select_itemlist.obj.show()
        _2nd_floor_one.shop_select_quest.obj.show()
        printMessage("뭐야.. 굉장히 기분 나쁜 기운이 흘러나오네.\n상점 아주머니에게 돌아가보자.")
        }
    }

_3rd_floor_three.dark_portal.obj.hide()

_3rd_floor_two.brain = new obj(_3rd_floor_two,"brain","fairy.png",500, 500, 400)
_3rd_floor_two.start = new obj(_3rd_floor_two,"start","start_button.png",200,800,500)
_3rd_floor_two.start.obj.hide()
_3rd_floor_two.brain.onClick = function(){
    game.printStory("제한시간안에 좀비들을 모두 사살하자\n 실패시 죽음")
    _3rd_floor_two.start.obj.show()
    }
_3rd_floor_two.start.onClick = function(){
    _3rd_floor_two.brain.obj.hide()
    _3rd_floor_two.start.obj.hide()
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
_3rd_floor_two.right_arrow = new arrow(_3rd_floor_two,"right_arrow",_3rd_floor_three, 100, 1200, 360)
_3rd_floor_three.left_arrow = new arrow(_3rd_floor_three,"left_arrow",_3rd_floor_two, 100, 100, 360)

game.setGameoverMessage("좀비에게 물어뜯겼습니다..")


//=============================================================================================
/* 4th floor */

_4th_floor_one.right_arrow = new arrow(_4th_floor_one, "right_arrow", _4th_floor_two, 100, 1200, 360)
_4th_floor_one.left_arrow = new arrow(_4th_floor_one, "left_arrow", _4th_floor_three, 100, 100, 360)
_4th_floor_two.left_arrow = new arrow(_4th_floor_two, "left_arrow", _4th_floor_one, 100, 100, 360)
_4th_floor_three.right_arrow = new arrow(_4th_floor_three, "right_arrow", _4th_floor_one, 100, 1200, 360)
_4th_floor_three.elevator = new obj(_4th_floor_three, "elevator", "silver_button.png", 60, 800, 360)
_4th_floor_three.elevator.onClick = function () { game.move(_elevator)}

// 문지기 좀비
_4th_floor_one.zombie1 = new zombie(_4th_floor_one, "zombie1", "좀비_야쿠자_옆.png", 250, 610, 470, 30, 2);
_4th_floor_one.zombie1.onClick = function() {
	playSound("zombie_growling.wav")
	_4th_floor_one.zombie1.image = "좀비_야쿠자.png"
    battle(this.room, this)
}

// 좀비와 디비디비딥
var zombieFlag = 0
var playerFlag = 0

_4th_floor_two.zombie_heart = new obj(_4th_floor_two, "zombie_heart", "멈추지않는심장.png", 100, 640, 420)
_4th_floor_two.zombie_heart.obj.hide()
_4th_floor_two.zombie_heart.onClick = function(){
    _4th_floor_two.zombie_heart.obj.pick()
}

_4th_floor_two.up_arr = new obj(_4th_floor_two, "up_arr", "up_arrow.png", 80, 640, 460)
_4th_floor_two.down_arr = new obj(_4th_floor_two, "down_arr", "down_arrow.png", 80, 640, 660)
_4th_floor_two.left_arr = new obj(_4th_floor_two, "left_arr", "left_arrow.png", 100, 540, 560)
_4th_floor_two.right_arr = new obj(_4th_floor_two, "right_arr", "right_arrow.png", 100, 740, 560)

function dbdb(zombieFlag, playerFlag){
    zombieFlag = Math.floor(Math.random()*10)
    if(zombieFlag<2){zombieFlag = 1}
    else if(zombieFlag<5){zombieFlag = 2}
    else if(zombieFlag<8){zombieFlag = 3}
    else if(zombieFlag<10){zombieFlag = 4}

	if(zombieFlag == 1){
		_4th_floor_two.db_zombie.obj.setSprite("좀비_남자_위.png")
	} else if(zombieFlag == 2){
		_4th_floor_two.db_zombie.obj.setSprite("좀비_남자_아래.png")
	} else if(zombieFlag == 3){
		_4th_floor_two.db_zombie.obj.setSprite("좀비_남자_왼쪽.png")
	} else if(zombieFlag == 4){
		_4th_floor_two.db_zombie.obj.setSprite("좀비_남자_오른쪽.png")
	}

    if(zombieFlag===playerFlag){
        _4th_floor_two.db_zombie.obj.lock();
        _4th_floor_two.db_zombie.obj.hide()
        _4th_floor_two.zombie_heart.obj.show()
        printMessage("좀비를 물리치니 심장이 떨어졌다.")
        _4th_floor_two.up_arr.obj.hide()
        _4th_floor_two.down_arr.obj.hide()
        _4th_floor_two.left_arr.obj.hide()
        _4th_floor_two.right_arr.obj.hide()
    } else {
        Player.life_change(-5)
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

_4th_floor_two.db_zombie = new obj(_4th_floor_two, "db_zombie", "좀비_남자.png", 200, 640, 200);
_4th_floor_two.db_zombie.onClick = function(){
    printStory("좀비와 디비디비딥! \n\n 방향예측에 성공하면 zombie kill! \n\n 방향예측에 실패하면 life -5 ")
    _4th_floor_two.up_arr.obj.show()
    _4th_floor_two.down_arr.obj.show()
    _4th_floor_two.left_arr.obj.show()
    _4th_floor_two.right_arr.obj.show()
}

// ************************ 슬롯머신*************************
_4th_floor_three.slot_machine_game = new obj(_4th_floor_three, "slot_machine_game", "슬롯머신_게임.png", 800, 640, 360)
_4th_floor_three.slot_machine_game.obj.hide()
_4th_floor_three.close_button = new obj(_4th_floor_three, "close_button", "button_exit.png", 100, 1200, 680)
_4th_floor_three.close_button.obj.hide()
_4th_floor_three.close_button.onClick = function(){
	_4th_floor_three.slot_machine_game.obj.hide()
	_4th_floor_three.slot_machine.obj.show()
	_4th_floor_three.close_button.obj.hide()
}

_4th_floor_three.slot_machine = new obj(_4th_floor_three, "slot_machine", "슬롯머신_외관.png", 500, 200, 520)
_4th_floor_three.slot_machine.onClick = function() {
    printStory("한 번에 단돈 90원! \n 77 잭팟 당첨시 +10000 \n 11 또는 99 당첨시 +5000 \n 22 또는 00 또는 88당첨시 +3000 \n 11또는 33 또는 44 또는 55당첨시 +1000")
    _4th_floor_three.slot_machine_game.obj.show()
    _4th_floor_three.slot_machine.obj.hide()
	_4th_floor_three.close_button.obj.show()
}

var slotArray = new Array(0, 0)
_4th_floor_three.slot_machine_game.onClick = function(){
	playSound("slotmachine.wav")
    if(Player.money > 30){
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
            else if(slotArray[0]===0 && slotArray[1]===0){Player.money_change(3000)
                printMessage("축하합니다! \n 소지금 +3000")}
            else if(slotArray[0]===4 && slotArray[1]===4){Player.money_change(1000)
                printMessage("축하합니다! \n 소지금 +1000")}
        Player.money_change(-30)
    } else {
        printMessage("소지금이 부족합니다.")
    }
}
// ***************************슬롯머신*************************




//=============================================================================================
/* 5th floor */
_5th_floor_one.left_arrow = new arrow(_5th_floor_one, "left_arrow", _5th_floor_two, 100, 100, 360)
_5th_floor_one.right_arrow = new arrow(_5th_floor_one, "right_arrow", _5th_floor_three, 100, 1200, 360)
_5th_floor_two.right_arrow = new arrow(_5th_floor_two, "right_arrow", _5th_floor_one, 100, 1200, 360)
_5th_floor_three.left_arrow = new arrow(_5th_floor_three, "left_arrow", _5th_floor_one, 100, 100, 360)
_5th_floor_two.elevator = new obj(_5th_floor_two, "elevator", "silver_button.png", 60, 800, 360)
_5th_floor_two.elevator.onClick = function () { game.move(_elevator)}

var _5th_floor_one_kill_counter = 0;

function respawn1(){
    _5th_floor_one.zombie11.obj.show()
    _5th_floor_one.zombie12.obj.show()
    _5th_floor_one.zombie13.obj.show()
    _5th_floor_one.zombie14.obj.show()
}

function respawn2(){
    _5th_floor_three.zombie21.obj.show()
    _5th_floor_three.zombie22.obj.show()
    _5th_floor_three.zombie23.obj.show()
    _5th_floor_three.zombie24.obj.show()
}

_5th_floor_one.left_arrow.onClick = function(){
    game.move(_5th_floor_two)
    respawn1()
}
_5th_floor_one.right_arrow.onClick = function(){
    respawn1()
    game.move(_5th_floor_three)
}
_5th_floor_three.left_arrow.onClick = function(){
    respawn2()
    game.move(_5th_floor_one)

}

_5th_floor_three.potion = new obj(_5th_floor_three,"potion","엘릭서.png",100,300,450)

// 버그 : 도망가도 돈이랑, 카운트
_5th_floor_one.zombie11 = new zombie(_5th_floor_one, "zombie11", "3층좀비_1.png", 120, 720, 600, 35, 3)
_5th_floor_one.zombie11.onClick = function() { battle(this.room, this); _5th_floor_one_kill_counter++; Player.money_change(19)}
_5th_floor_one.zombie12 = new zombie(_5th_floor_one, "zombie12", "3층좀비_2.png", 120, 1000, 540, 40, 5)
_5th_floor_one.zombie12.onClick = function() { battle(this.room, this); _5th_floor_one_kill_counter++; Player.money_change(21)}
_5th_floor_one.zombie13 = new zombie(_5th_floor_one, "zombie13", "헬멧좀비.png", 120, 200, 550, 35, 3)
_5th_floor_one.zombie13.onClick = function() { battle(this.room, this); _5th_floor_one_kill_counter++; Player.money_change(18)}
_5th_floor_one.zombie14 = new zombie(_5th_floor_one, "zombie14", "헤드셋좀비.png", 120, 400, 510, 45, 5)
_5th_floor_one.zombie14.onClick = function() { battle(this.room, this); _5th_floor_one_kill_counter++; Player.money_change(22)}

_5th_floor_three.zombie21 = new zombie(_5th_floor_three, "zombie21", "zombie.png", 170, 750, 420, 65, 10)
_5th_floor_three.zombie21.onClick = function() { battle(this.room, this); _5th_floor_one_kill_counter++; Player.money_change(51)}
_5th_floor_three.zombie22 = new zombie(_5th_floor_three, "zombie22", "좀비_여자.png", 190, 1000, 540, 70, 13)
_5th_floor_three.zombie22.onClick = function() { battle(this.room, this); _5th_floor_one_kill_counter++; Player.money_change(60)}
_5th_floor_three.zombie23 = new zombie(_5th_floor_three, "zombie23", "좀비_남자.png", 200, 300, 550, 57, 9)
_5th_floor_three.zombie23.onClick = function() { battle(this.room, this); _5th_floor_one_kill_counter++; Player.money_change(43)}
_5th_floor_three.zombie24 = new zombie(_5th_floor_three, "zombie24", "좀비_야쿠자.png", 180, 520, 480, 80, 20)
_5th_floor_three.zombie24.onClick = function() { battle(this.room, this); _5th_floor_one_kill_counter++; Player.money_change(70)}

_5th_floor_three.potion.onClick = function(){
    _5th_floor_three.potion.obj.pick()
    printMessage("수상한 엘릭서다 이게 뭐지..?")
}

//=============================================================================================
/* 6th floor */



//=============================================================================================
/* boss */


//boss room 1
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
        printMessage("으악!! 물렸다!!")
        _boss_room_1.human.keypad.setSprite("생존자_피.png")
        Player.life_change(-5)
    }
    if(_boss_room_1.human.keypad.getX()==_boss_room_1.zombie2.keypad.getX() && _boss_room_1.human.keypad.getY()==_boss_room_1.zombie2.keypad.getY()){
        printMessage("으악!!! 물렸어!")
        _boss_room_1.human.keypad.setSprite("생존자_피.png")
        Player.life_change(-5)
    }
    if(_boss_room_1.human.keypad.getX()==_boss_room_1.zombie3.keypad.getX() && _boss_room_1.human.keypad.getY()==_boss_room_1.zombie3.keypad.getY()){
        printMessage("앜!!! 물렸다!")
        _boss_room_1.human.keypad.setSprite("생존자_피.png")
        Player.life_change(-5)
    }
    if(_boss_room_1.human.keypad.getX()==_boss_room_1.zombie4.keypad.getX() && _boss_room_1.human.keypad.getY()==_boss_room_1.zombie4.keypad.getY()){
        printMessage("으앜!! 물렸어!!")
        _boss_room_1.human.keypad.setSprite("생존자_피.png")
        Player.life_change(-5)
    }
    if(_boss_room_1.human.keypad.getX()==_boss_room_1.zombie5.keypad.getX() && _boss_room_1.human.keypad.getY()==_boss_room_1.zombie5.keypad.getY()){
        printMessage("으악!! 물렸다!!")
        _boss_room_1.human.keypad.setSprite("생존자_피.png")
        Player.life_change(-5)

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

_boss_room_1.left_arrow = new keypad(_boss_room_1,"left_arrow","left_arrow.png",100,920,575)
_boss_room_1.right_arrow = new keypad(_boss_room_1,"right_arrow","right_arrow.png",100,1080,575)
_boss_room_1.up_arrow = new keypad(_boss_room_1,"up_arrow","up_arrow.png",80,1000,500)
_boss_room_1.down_arrow = new keypad(_boss_room_1,"down_arrow","down_arrow.png",80,1000,650)

//boss room 2
_boss_room_2.enter = new keypad(_boss_room_2,"enter","up_arrow.png",60,650,500)
_boss_room_2.enter.onClick= function(){
    game.move(_boss_room_3)
    printMessage("아니 아주머니가 왜 여기에??")}


//boss room 3
//여기서부터 진 보스

_boss_room_3.shopper = new obj(_boss_room_3,"shopper","_shop_npc.png",200,740,300)
_boss_room_3.boss1 = new obj(_boss_room_3,"boss1","보스_1.png",700,500,400)
_boss_room_3.boss1.obj.hide()

_boss_room_3.shopper.onClick = function(){
    printMessage("호호호 여기까지 오다니\n학생이 구해다 준 재료들 덕분에 수월했어")
    _boss_room_3.shopper.obj.hide()
    _boss_room_3.boss1.obj.show()
}

_boss_room_3.boss1.onClick = function(){
    printMessage("가위바위보 한 게임 할까?")
    game.move(_boss_room_4)
}
//boss room 4
function rsp(room, name, image, width, x_loc, y_loc) {
    this.room = room;
    this.name = name;
    this.image = image;
    this.width = width;
    this.x_loc = x_loc;
    this.y_loc = y_loc;

    this.rsp = room.createObject(name, image);
    this.rsp.setWidth(width);
    room.locateObject(this.rsp, x_loc, y_loc);
}
rsp.prototype.rsp_random = function(){
    randomValue = Math.random();
    rsp_value = (randomValue * 3)+1;
    return rsp_value
}
rsp.prototype.rsp_create = function(){
    var randomCount = this.rsp_random()
    if (randomCount > 1 && randomCount < 2){
        _boss_room_4.boss_paper.obj.hide()
        _boss_room_4.boss_scissor.obj.hide()
        _boss_room_4.boss_rock.obj.show()
        rsp_count = 1
    }
    else if (randomCount > 2 && randomCount <3){
        _boss_room_4.boss_paper.obj.hide()
        _boss_room_4.boss_scissor.obj.show()
        _boss_room_4.boss_rock.obj.hide()
        rsp_count = 2
    }
    else if(randomCount < 4){
        _boss_room_4.boss_paper.obj.show()
        _boss_room_4.boss_scissor.obj.hide()
        _boss_room_4.boss_rock.obj.hide()
        rsp_count = 3
    }
}
rsp.prototype.onClick = function(){
    this.rsp_create()
    //묵
    if(this.name == "rock" && rsp_count == 2){
        game_count += 1
        printMessage("한판만 더 이기면 보내주마ㅎ")
    }
    else if(this.name == "rock" && rsp_count == 1){
        printMessage("비겼군..")
    }
    else if(this.name =="rock" && rsp_count == 3){
        printMessage('졌다! 체력 5 깎임')
        Player.life_change(-5)
    }
    //찌
    if(this.name == "scissor" && rsp_count == 3){
        game_count += 1
        printMessage("한판만 더 이기면 보내주마ㅎ")
    }
    else if(this.name == "scissor" && rsp_count == 2){
        printMessage("비겼군..")
    }
    else if(this.name =="scissor" && rsp_count == 1){
        printMessage('졌다! 체력 5 깎임')
        Player.life_change(-5)
    }
    //보
    if(this.name == "paper" && rsp_count == 1){
        printMessage("한판만 더 이기면 보내주마ㅎ")
        game_count += 1
    }
    else if(this.name == "paper" && rsp_count == 3){
        printMessage("비겼군..")
    }
    else if(this.name =="paper" && rsp_count == 2){
        printMessage('졌다! 체력 5 깎임')
        Player.life_change(-5)
    }
    if(game_count == 2){
        printMessage("좀 하는구나\n나를 화나게 하다니!!")
        game.move(_boss_room_5)
    }
}

var rsp_count = 0
var game_count = 0

_boss_room_4.boss_rock = new obj(_boss_room_4,"boss_rock","보스_바위.png",200,1100,300)
_boss_room_4.boss_scissor = new obj(_boss_room_4,"boss_scissor","보스_가위.png",200,1100,300)
_boss_room_4.boss_paper = new obj(_boss_room_4,"boss_paper","보스_보.png",200,1100,300)

_boss_room_4.boss_rock.obj.hide()
_boss_room_4.boss_scissor.obj.hide()
_boss_room_4.boss_paper.obj.hide()


_boss_room_4.boss1 = new obj(_boss_room_4,"boss1","보스_1.png",700,700,400)

_boss_room_4.rock = new rsp(_boss_room_4,"rock","바위.png",200,300,600)
_boss_room_4.scissor = new rsp(_boss_room_4,"scissor","가위.png",200,500,560)
_boss_room_4.paper = new rsp(_boss_room_4,"paper","보.png",200,700,600)

// boss room 5
_boss_room_5.boss2 = new zombie(_boss_room_5,"boss2","보스_2.png",600,500,350, 50, 10)
_boss_room_5.boss2.onClick = function() {
    battle_boss(_boss_room_5, _boss_room_5.boss2);
}
_boss_room_5.boss3 = new zombie(_boss_room_5,"boss3","보스_3.png",400,500,350, 50, 10)
_boss_room_5.boss3.obj.hide();

//=============================================================================================

/* roof_top */ // 신호를 주면 헬리콥터 show. 헬리콥터 onClick 탈출 성공
_roof_top_one.left_arrow = new arrow(_roof_top_one, "left_arrow", _roof_top_two, 100, 100, 360)
_roof_top_two.right_arrow = new arrow(_roof_top_two, "right_arrow", _roof_top_one, 100, 1200, 360)
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
_roof_top_one.on_button = new obj(_roof_top_one, "on_button", "onbutton.png", 80, 1150, 500)
_roof_top_one.off_button = new obj(_roof_top_one, "off_button", "offbutton.png", 80, 1150, 610)

_roof_top_one.on_button.obj.hide()
_roof_top_one.off_button.obj.hide()

_roof_top_one.on_button.onClick = function(){
    if(lanternFlag == 0){
        _roof_top_one.lanternOff.obj.setSprite("랜턴온.png")
        lanternFlag = 1
        playerArr.shift()
        playerArr.push(1)
        clickCount++
        printMessage("Signal" + "\n" + playerArr)
        signal()
    } else if(lanternFlag == 1){
        playerArr.shift()
        playerArr.push(1)
        clickCount++
        printMessage("Signal" + "\n" + playerArr)
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
        printMessage("Signal" + "\n" + playerArr)
        signal()
    } else if(lanternFlag == 0) {
        playerArr.shift()
        playerArr.push(0)
        clickCount++
        printMessage("Signal" + "\n" + playerArr)
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
    0: {
        "object": "game.getHandItem() || !game.getHandItem()",
        "flag": 0
    },
    1: {
        "name": "Q1. 셔터를 내리자 !\n\n",
        "object": "game.getHandItem() || !game.getHandItem()",
        "description": "건물 밖의 수 많은 좀비들이 따라오고 있다!\n출입문의 셔터를 내려 들어오지 못하게 차단하자.\n\n"+
        "QUEST:출입문 상단을 아래로 드래그하여 셔터를 내리자.",
        "flag": 0
    },
    2: {
        "name": "Q2. 알 수 없는 위압감..\n\n",
        "object" : "game.getHandItem() == _1st_floor_two.weapon_branch.obj",
        "description": "휴... 이게 무슨 일일까..?\n우선 이 곳을 좀 더 돌아보자.\n\nQUEST:튜토리얼대로 나뭇가지를 줏어 좀비를 물리치자.",
        "flag": 0
    },
    3: {
        "name": "Q3. 사람이다 !\n\n",
        "object" : "game.getHandItem() || !game.getHandItem()",
        "description": "알 수 없는 목소리의 출처가 이끄는대로 했지만...\n나에게 도움을 줄 수 있는 사람일까?\n우선, 엘리베이터를 타고 2층으로 가보자.\n\n"+
        "QUEST:엘리베이터를 타고 2층으로 가서, 말을 걸어보자.",
        "flag": 0
    },
    4: {
        "name": "Q4. 이거... RPG 게임이야..?\n\n",
        "object" : "_5th_floor_one_kill_counter == 20",
        "description": "아! 그러고보니, 부탁을 하나 해도 될까? 5층은 강당인데, 내가 그곳에\n물건 재고를 쌓아뒀거든.."+
        "그런데, 직원들이 전부 좀비로 변하는 바람에\n좀비소굴로 변해버렸어. 네가 그 녀석들 조금 처리해줬으면 좋겠어. 아!\n\n"+
        "그리고 한 가지 좋은 팁을 주자면, 그곳의 좀비들은 너에게 '돈'을 줄 수도\n있을거야. 또, 그 좀비들은 '무한히' 나오는 것 같아"+
        "\n\nQUEST:5층 사냥터에 가서 좀비 20마리를 사냥하세요.",
        "flag": 0
    },
    5: {
        "name": "Q5. 괴상한 좀비..?\n\n",
        "object" : "_4th_floor_two.db_zombie.obj.isLocked()",
        "description": "수고했어! 덕분에 더 많은 양꼬치를 구워줄 수 있게 되었네~ㅎㅎ\n아 참~ 혹시 오고가며 이상한 소리 못들었어?"+
        "못들었다고?..\n요 며칠 전부터 4층에서 괴상한 소리가 나는 것 같더라고... 뭐라더라..\n '디비디비딥...?' 뭐 어쨌든, 무슨 소리인지"+
        "대신 알아봐줬으면 좋겠어\n그 소리 때문에 잠을 못자요...\n\nQUEST:4층의 디비디비딥 좀비를 물리치고 오세요.",
        "flag": 0
    },
    6: {
        "name": "Q6. 우락부락 근육좀비야 덤벼라!\n\n",
        "object" : "_3rd_floor_one.chain.obj.isClosed()",
        "description": "뭐? 정말 그 요상한 게임을 하는 좀비가 있었단말야?\n흠... 어쩌면 유쾌하시던 조용진 부장님이 좀비로 변하신걸까..\n"
        +"아하하, 그건 그렇고, 요새 자꾸 우리 매점의 양꼬치 재고가 비는 것 같아..\n좀비나 사람이나 도둑질을 하는건지.. 휴...\n"+
        "CCTV를 보니까 3층 즈음으로 도망가는 것을 봤어\n3층 조사를 부탁할게 !\n\nQUEST:도둑놈을 쫓아 3층을 조사해보자",
        "flag": 0
    },
    7: {
        "name": "Q7. 사라진 아주머니와 정체불명의 쪽지!\n\n",
        "object" : "false",
        "description": "갑자기 상점아주머니가 어디로 사라지신걸까...?\n이 정체모를 일기장은 뭘 의미하는걸까..?\n"+
        "....필요한 물건은 아주머니가 돌아오실지도 모르니 카운터 위에 올려놓자ㅎㅎ\n\nQUEST:사악한 느낌의 포탈과 일기장의 관계를 추리하자"  ,
        "flag": 0
    }
}

Player.quest_check();
game.makeCombination(_5th_floor_three.potion.obj,_4th_floor_two.zombie_heart.obj,_5th_floor_three.monster_heart)
game.start(_building_outside)
game.printMessage("허억,,, 헉,,, 얼른 저 앞에 보이는 건물로 들어가자!!")
