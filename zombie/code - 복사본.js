function left_arrow(room, go_to_room){
    room_ui.call(this, room, "left_arrow", "left_arrow.png", 50, 30, 360)
    this.go_to_room = go_to_room;
}
left_arrow.prototype = Object.create(room_ui.prototype);
left_arrow.prototype.constructor = left_arrow;
left_arrow.prototype.onClick = function () {game.move(this.go_to_room)}

function right_arrow(room, go_to_room){
    room_ui.call(this, room, "right_arrow", "right_arrow.png", 50, 1250, 360)
    this.go_to_room = go_to_room;
}
right_arrow.prototype = Object.create(room_ui.prototype);
right_arrow.prototype.constructor = right_arrow;
right_arrow.prototype.onClick = function () {game.move(this.go_to_room)}