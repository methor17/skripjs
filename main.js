var game = {};
game.container =  document.getElementById('game');  
game.width = game.height = 300;
game.container.style.width = game.width + "px";
game.container.style.height = game.height + "px";
game.buf = [document.getElementById('buf1'), document.getElementById('buf2')];  
game.curentBuf = 0;
game.buf[0].width = game.buf[1].width = game.width;
game.buf[0].height = game.buf[1].height = game.height;
game.level = 1;
function UI(){
	var ui = document.createElement('div');
	ui.style.position = 'absolute';
	ui.style.width = game.width / 2 + 'px';
	ui.style.height = game.height - 20 + 'px';
	ui.style.border = '1px solid black';
	ui.style.left = game.width + 'px';
	ui.style.textAlign = 'left';
	ui.style.fontFamily = 'sans-serif';
	ui.style.padding = '10px';
	ui.style.marginTop = '-1px';
	game.container.appendChild(ui);
	this.data = {};
	this.append = function(key, text){
		if(this.data[key]){
			this.data[key].innerHTML = key + ': ' + text;

			return;
		}
		var elem = document.createElement('div');
		this.data[key] = elem;
		elem.innerHTML =  key + ': ' + text;
		ui.appendChild(elem);
	}
	this.remove = function(key){
		ui.removeChild(this.data[key]);
		delete this.data[key];
	}
}
game.ui = new UI();
var url = "/free/bomberman/main.php?";
ajax(url + "action=getip", function(ret){
	url += "ip=" + ret;
});
ajax(url + "&action=getHighscore", function(ret){
	try{
	var hi = JSON.parse(ret);
	var t = "";
	for(var i in hi){
		t += i + ": " + hi[i] + "<br>";
	}
	var e = document.createElement('a');
	e.href='#';
	e.textContent = "Highscores";
	e.style.right = game.width + 20 + 'px';
	e.style.position = 'absolute';
	e.onclick = function(){
		print("<small>" + t + "</small>", 2000);
	}
	game.container.appendChild(e);
	} catch(e){
		console.warn(e);
	}
});
var ctx;

var collision = {
	rect: function(p1, p2){
		      var c1 = p1.x + p1.w > p2.x;
		      var c2 = p1.x < p2.w + p2.x;
		      var c3 = p1.y + p1.h > p2.y;
		      var c4 = p1.y < p2.h + p2.y;
		      return c1 && c2 && c3 && c4;
	      }
};

function rand(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
function Tile(w, h, c, name){
	this.w = w;
	this.h = h;
	this.c = c;
	this.name = name;
	this.x = 0;
	this.y = 0;
	this.bomb = false;
}
function drawTile(tile){
	ctx.fillStyle = tile.c;
	ctx.fillRect (tile.x, tile.y, tile.w, tile.h);  
	if(tile.name == "empty" && tile.bonus){
		tile.bonus.draw();
	}
}
function clone(o) {
	if(!o || 'object' !== typeof o)  {
		return o;
	}
	var c = 'function' === typeof o.pop ? [] : {};
	var p, v;
	for(p in o) {
		if(o.hasOwnProperty(p)) {
			v = o[p];
			if(v && 'object' === typeof v) {
				c[p] = clone(v);
			}
			else {
				c[p] = v;
			}
		}
	}
	return c;
}
var tileSize = 30;
var tiles = {
	empty: new Tile(tileSize, tileSize, "rgba(200, 200, 200, 0.5)", "empty"),
	wall: new Tile(tileSize, tileSize, "rgba(255, 100, 100, 0.5)", "wall"),
	trash: new Tile(tileSize, tileSize, "rgba(0, 0, 200, 0.5)", "trash"),
	exit: new Tile(tileSize, tileSize, "rgba(0, 127, 0, 0.5)", "exit"),
	test: new Tile(tileSize, tileSize, "rgba(127, 127, 127, 0.5)", "test")
};
game.tiles = tiles;

var tileSet  = new Image();
tileSet.src = "bomberman.png";
tileSet.onload = function(){
	start();
}

function Bonus(type, x, y) {
	var self = this;
	self.start;
	self.duration;
	self.x = x;
	self.y = y;
	self.type = type;
	self.target;
	self.computer = false;
	self.implementation = {radius: {computer: true}, life: {}, bombs: {computer: true}};
	self.implementation.life.draw = function() {
		var b = ctx.strokeStyle;
		ctx.strokeStyle = "orange";
		ctx.fillStyle = "rgba(255, 0, 255, 0.5)";
		ctx.beginPath();
		ctx.arc(self.x * tileSize + tileSize/2, self.y * tileSize + tileSize / 2, "10", 0, Math.PI * 2);
		ctx.stroke();
		ctx.fill();
		ctx.strokeStyle = b;
	}
	self.implementation.life.activate = function() {
		self.target.lifes++;
	}
	self.implementation.radius.draw = function() {
		var b = ctx.strokeStyle;
		ctx.strokeStyle = "orange";
		ctx.fillStyle = "rgba(255, 255, 0, 0.5)";
		ctx.beginPath();
		ctx.arc(self.x * tileSize + tileSize/2, self.y * tileSize + tileSize / 2, "10", 0, Math.PI * 2);
		ctx.stroke();
		ctx.fill();
		ctx.strokeStyle = b;
	}
	self.implementation.radius.activate = function() {
		self.target.bomb_radius++;
		self.text = self.target.bomb_radius;
	}
	self.implementation.radius.cancel = function()  {
		self.target.bomb_radius = 1;
	}
	self.implementation.bombs.draw = function() {
		var b = ctx.strokeStyle;
		ctx.strokeStyle = "orange";
		ctx.fillStyle = "rgba(0, 255, 255, 0.5)";
		ctx.beginPath();
		ctx.arc(self.x * tileSize + tileSize/2, self.y * tileSize + tileSize / 2, "10", 0, Math.PI * 2);
		ctx.stroke();
		ctx.fill();
		ctx.strokeStyle = b;
	}
	self.implementation.bombs.activate = function() {
		self.target.bombs++;
		self.text = self.target.bombs;
	}
	self.implementation.bombs.cancel = function()  {
		self.target.bombs = 1;
	}
	////
	self.draw = self.implementation[self.type].draw;
	self.cancel = function(){
		if(self.implementation[self.type].cancel)
			self.implementation[self.type].cancel();
		if(self.text && !self.target.computer)
			game.ui.remove(self.type);
		delete self.target.bonus[self.type];
	}
	self.activate = function(target){
		if(target.computer && !self.implementation[self.type].computer) return;
		self.start = game.frame;
		self.target = target;
		self.target.bonus[self.type] = self;
		self.implementation[self.type].activate();
		if(self.text && !self.target.computer){
			game.ui.append(self.type, self.text);
		}
		map[self.y][self.x].bonus = false;
	};
	self.update = function(){
		if(!self.duration) return;
		if(self.start + self.duration >= game.frame) return;
		self.cancel();
	}
}

function Player(computer){
	this.computer = computer;
	var self = this;
	var tiles = {};
	this.w = 30;
	this.h = 30;
	this.bombs = 1;
	this.bomb_radius = 1;
	this.dead = false;
	this.lifes = 3;
	var last = {x: this.x, y: this.y, frame: 0};
	this.bonus = {};
	this.place = function(){
		do{
			var x = rand(game.map.w / 2, game.map.w - 1);
			var y = rand(game.map.h / 2, game.map.h - 1);
		} while(game.board[x][y] != 1);
		this.x = x * tileSize;
		this.y = y * tileSize;
	}
	this.newTarget = function(){
		do {
			if(rand(0, 5)){
				this.target = {x: rand(0, game.map.w - 1) * tileSize, y: rand(0,  game.map.h - 1) * tileSize};
			} else {
				this.target = player;
			}
		} while(map[Math.floor(this.target.y / tileSize)][Math.floor(this.target.x / tileSize)].name == "wall");
		last.x = 0;
		last.y = 0;
	}
	!function(){
		var x = 0;
		var y = 0;
		var w = self.w;
		var h = self.h;
		var frames = {down:3, up:3, left:5, right:5};
		for(var i in frames){
			tiles[i] = [];
			for(var j = 0; j < frames[i]; j++){
				tiles[i][j] = [x, y, w, h];
				x += w;
			}
		}
		if(self.computer){
			self.place();
			self.speed = 2;
			self.newTarget();
			mobs.push(self);
		} else {
			self.x = 0;
			self.y = 0;
			self.speed = 5;
		}
	}();
	this.move = false;
	this.pathFindingMove = false;
	var frame = 0;
	var tile = tiles.down;
	var direction = "down";
	this.immune = false;
	this.collision = function(){
		var col = [];
		var self = this;
		function getMapXY(dx, dy){
			var i = Math.floor((self.y + dy) / tileSize);
			var j = Math.floor((self.x + dx) / tileSize);
			return {
				x: j * tileSize,
					y: i * tileSize,
					i: i,
					j: j,
					w: tileSize,
					h: tileSize
			};
		}
		var c = getMapXY(0, 0);
		if(collision.rect(this, c))
			col.push(c);
		var c = getMapXY(this.w, 0);
		if(collision.rect(this, c))
			col.push(c);
		var c = getMapXY(0, this.h);
		if(collision.rect(this, c))
			col.push(c);
		var c = getMapXY(this.w, this.h);
		if(collision.rect(this, c))
			col.push(c);
		return col;
	}
	this.draw = function(){
		for(var b in this.bonus){
			this.bonus[b].update();
		}
		if(this.immune)
			this.dead = false;
		if(!this.computer){
			//game.ui.append("<span style='color:blue'>Level</span>", game.level);
			game.ui.append("<span style='color: green'>Nyawa</span>", this.lifes);
			//game.ui.append("<span>Jumlah Bomb</span>", this.bombs);
			game.ui.append("<span style='color:purple'>Jumlah Musuh</span>", mobs.length);
			game.ui.append("<b>Hasil Perhitungan</b>", "");
			//game.ui.append("<b>Bonus</b>", "");
		}
		if(this.dead){
			this.lifes--;
			if(this.lifes == 0){
				game.running = false;
				game.over = true;
			} else {
				for(var b in this.bonus){
					this.bonus[b].cancel();
				}
				for(var m in mobs){
					mobs[m].place();
				}
				print('Mati!<br>Sisa Nyawa: ' + this.lifes, 2000);
				this.dead = false;
				this.immune = true;
				player.x = 0;
				player.y = 0;
				setTimeout(function(){
					self.immune = false;
				}, 2000);
			}
		}
		if(this.pathFindingMove){
			this.oldMove = this.move;
			this.move = this.pathFindingMove;
		}
		if(frame >= tiles.down.length) frame = 0;
		if(this.move){
			tile = tiles[this.move];
			direction = this.move;
		} else {
			frame = 0;
		}

		var t = tile[frame];
		ctx.drawImage(tileSet, t[0], t[1], t[2], t[3], this.x, this.y, t[2], t[3]);
		var dx = 0, dy = 0;
		switch(this.move){
			case "left": dx = -this.speed; break;
			case "right": dx = this.speed; break;
			case "down": dy = this.speed;  break;
			case "up": dy = -this.speed; break;
		}
		var canMove = true;
		function check(w, h){
			var mx = Math.floor((self.x + dx +  w) / tileSize);
			var my = Math.floor((self.y + dy + h) / tileSize);
			switch(map[my][mx].name){
				case "exit":
					if(!game.running) return;
					if(self != player) return true;
					var id = print("Level Selanjutnya!<br>" + ++game.level + "!");
					ajax(url + "&action=level" + "&level=" + game.level);
					game.next_level = true;
					game.running = false;
				case "empty":
					return true;
				default:
					canMove = false;
					return false;
			}
		}
		var pathFinding = [false, false, false, false];
		try{
			pathFinding[0] = check(1, 1);
			pathFinding[1] = check(this.w - 1, 1);
			pathFinding[2] = check(1, this.h - 1);
			pathFinding[3] = check(this.w - 1, this.h - 1);
		} catch(e) {
			canMove = false;
		}	
		if(canMove){
			this.x += dx;
			this.y += dy;
			if(this.move && this.x >= 0 && this.x <= game.width && this.y >= 0 && this.y <= game.height)
				frame++;
			if(this.x < 0)
				this.x = 0;
			else if(this.x > game.width)
				this.x = game.width;
			if(this.y < 0)
				this.y = 0;
			else if(this.y > game.height)
				this.y = game.height;
			if(this != player && collision.rect(this, player)){
				this.bomb();
			}

		} else {
			var move = this.move;
			switch(this.move){
				case "left":
					if(pathFinding[0]) move = "up";
					else if(pathFinding[2]) move = "down";
					break;
				case "right":
					if(pathFinding[1]) move = "up";
					else if(pathFinding[3]) move = "down";
					break;
				case "up":
					if(pathFinding[0]) move = "left";
					else if(pathFinding[1]) move = "right";
					break;
				case "down":
					if(pathFinding[2]) move = "left";
					else if(pathFinding[3]) move = "right";
					break;
			}
			if(this.move != move){
				this.pathFindingMove = move;
				this.draw();
			}
		}
		var current_tile = map[Math.floor(this.y / tileSize)][Math.floor(this.x / tileSize)];
		if(current_tile.bonus)
			current_tile.bonus.activate(this);
		var col= this.collision();
		for(var i in col) {
			var cell = map[col[i].i][col[i].j];
			if(cell.bonus) {
				cell.bonus.activate(this);
			}

		}
		if(this.target && collision.rect(this, this.target)){
			this.newTarget();
		}
		if(this.oldMove){
			this.move = this.oldMove;
			this.oldMove = this.pathFindingMove = false;
		}
	}
	
	
	this.ai = function(){
		var r;
		var cx = this.x / tileSize;
		var cy = this.y / tileSize;
		cx = (this.dx > 0) ? Math.floor(cx) : Math.ceil(cx);
		cy = (this.dy > 0) ? Math.floor(cy) : Math.ceil(cy);
		var path = a_star([cx, cy], [Math.floor(this.target.x / tileSize), Math.floor(this.target.y / tileSize)], game.board, game.map.w, game.map.h);
		if(path.length > 1){
			for(var u in path){
				ctx.fillStyle = '#000';
				ctx.fillRect(path[u].x * tileSize + tileSize / 2, path[u].y * tileSize + tileSize / 2, 2, 2);
				game.ui.append("<span style='color: blue'>Jarak Player </span>", u);				
				//game.ui.append("<span style='color: blue'>Jarak Bom </span>", u - 2);	
				game.ui.append("<span style='color: blue'>Hasil Fuzzy </span>", + 2);
				game.ui.append("<span style='color: red'>Manhattan  </span>", u);
				game.ui.append("<span style='color: red'>Nilai f  </span>", u);
				game.ui.append("<span style='color: red'>Rute NPC </span>", JSON.stringify(path));
			}
				
	
			var node = path[1];
			if(last.x == this.x && last.y == this.y){
				if(last.frame + game.fps < game.frame && this.bombs){
					this.bomb();
				}
			} else {
				node.x *= tileSize;
				node.y *= tileSize;
				var dx = node.x - this.x;
				var dy = node.y - this.y;
				if(dx){
					this.move = (dx < 0) ? "left" : "right";
				} else {
					this.move = (dy < 0) ? "up" : "down";
				}
				last.frame = game.frame;
				last.x = this.x;
				last.y = this.y;
			}
		} else if(path.length == 1){
			if(this.x == this.target.x && this.y == this.target.y){
				this.move = false;
				this.newTarget();
			}
		}
		
	
	}
	
	
	this.bomb = function(){
		new Bomb(this.x + this.w / 2, this.y + this.h / 2, this);
	}
}
function Bomb(x, y, owner){
	this.owner = owner;
	if(!this.owner.bombs) return;
	this.x = Math.floor(x / tileSize);
	this.y = Math.floor(y / tileSize);
	if(map[this.y][this.x].bomb) return;
	this.owner.bombs--;
	this.r = 10;
	this.radius = owner.bomb_radius;
	this.created = game.frame;
	this.time = game.fps * 2;
	this.explosionTime = game.fps / 2;
	this.exploding = false;
	this.dead = false;
	map[this.y][this.x].bomb = this;
	bombs.push(this);
	this.draw = function(){
		if(this.created + this.time < game.frame){
			this.detonate();
			return;
		}
		ctx.fillStyle = '#000';
		ctx.beginPath();  
		ctx.arc(this.x * tileSize + tileSize/2, this.y * tileSize + tileSize / 2, this.r, 0, Math.PI * 2);
		ctx.fill();
     	
	}
	this.detonate = function(){
		if(this.exploding) return;
		this.created = game.frame;
		this.exploding = true;
	}
	
	
	var destroyed = [];
	this.explode = function(){
		if(this.dead) return;
		if(this.created + this.explosionTime < game.frame){
			this.dead = true;
			if(!owner.immune)
				owner.bombs++;
			delete map[this.y][this.x].bomb;
			return;
		}
		var x = this.x;
		var y = this.y;
		ctx.fillStyle = 'rgba(255, 30, 30, 0.7)';
		function draw(i, j){
			try{
				var name = map[i][j].name;
				if(name == "wall") return false;
				if(Math.floor(player.x / tileSize) == j && Math.floor(player.y / tileSize) == i)
					player.dead = true;
				if(owner == player){
					for(var k in mobs){
						if(Math.floor(mobs[k].x / tileSize) == j && Math.floor(mobs[k].y / tileSize) == i){
							mobs.splice(k, 1);
							return false;
						}
					}
				}
				if(map[i][j].bomb) map[i][j].bomb.detonate();
				ctx.fillRect(j * tileSize, i * tileSize, tileSize, tileSize);
				if(name == "trash"){
					var bonus = map[i][j].bonus;
					map[i][j] = clone(tiles.empty);
					if(bonus) map[i][j].bonus = bonus;
					if(!destroyed[i]) destroyed[i] = [];
					destroyed[i][j] = true;
					if(game.map.exit[0] == j && game.map.exit[1] == i){
						map[i][j] = clone(tiles.exit);
					}
				}
				return (destroyed[i] && destroyed[i][j]) ? false : true;
			} catch(e) {
				return false;
			}
		}
		var length = this.radius;
		for(var i = x; i <= x + length; i++){
			if(!draw(y, i)) break;
		}
		for(var i = x; i >= x - length; i--){
			if(!draw(y, i)) break;
		}
		for(var i = y; i <= y + length; i++){
			if(!draw(i, x)) break;
		}
		for(var i = y; i >= y - length; i--){
			if(!draw(i, x)) break;
		}
	}
}
var map = [];
function render(){
	ctx.strokeStyle = 'rgba(127, 127, 127, 0.1)';
	ctx.lineWidth = 1;
	for(var i = 0; i < game.height; i += tileSize){
		for(var j = 0; j < game.width; j += tileSize){
			var tile = map[i / tileSize][j / tileSize];
			tile.x = j;
			tile.y = i;
			drawTile(tile);
			ctx.strokeRect(j, i, tile.w, tile.h);
		}
	}
}
function controls(){
	document.onkeydown = function(e){
		switch(e.keyCode){
			case 37:
			case 65:
				player.move = "left";
				break;
			case 39:
			case 68:
				player.move = "right";
				break;
			case 40:
			case 83:
				player.move = "down";
				break;
			case 38:
			case 87:
				player.move  = "up";
				break;
			case 32:
				if(player.bombs){
					new Bomb(player.x + player.w / 2, player.y + player.h / 2, player);
				}
				break;
		}
	}
	document.onkeyup = function(e){
		var move;
		switch(e.keyCode){
			case 37:
			case 65:
				move = "left";
				break;
			case 39:
			case 68:
				move = "right";
				break;
			case 40:
			case 83:
				move = "down";
				break;
			case 38:
			case 87:
				move  = "up";
				break;
		}
		if(move == player.move)
			player.move = false;
	}
}

var player = new Player();
var bombs;
var mobs;
function level(){
	player.x = 0;
	player.y = 0;
	createMap();
	for(var i in bombs){
		bombs[i].owner.bombs++;
	}
	bombs = [];
	mobs = [];
	for(var i = 0; i < game.level; i++){
		var mob = new Player(true);
	}
	game.running = true;
}

function start(){
	level();
	controls();
	game.frame = 0;
	game.fps = 25;
	game.interval = setInterval(function(){
		if(game.next_level){
			game.next_level = false;
			level();
			return;
		}
		if(!game.running){
			return;
		}
		if(game.over){
			clearInterval(game.interval);
			print('Game Over');
		}
		game.frame++;
		game.buf[game.curentBuf].width = game.buf[game.curentBuf].width;
		ctx = game.buf[game.curentBuf].getContext('2d');  
		render();
		player.draw();
		if(!game.running) return;
		for(var i in mobs){
			mobs[i].ai();
			mobs[i].draw();
		}
		for(var i in bombs){
			if(bombs[i].exploding){
				bombs[i].explode();
			} else {
				bombs[i].draw();
			}
		}
		for(var i in bombs){
			if(bombs[i].dead){
				bombs.splice(i, 1);
			}
		}
		game.buf[1-game.curentBuf].style.visibility='hidden';
		game.buf[game.curentBuf].style.visibility='visible';
		game.curentBuf = 1 - game.curentBuf;
	}, 1000 / game.fps);
}

function createMap(){
	game.map = {w: game.width / tileSize, h: game.height / tileSize};
	for(var i = 0; i < game.map.h; i++){
		map[i] = [];
		for(var j = 0; j < game.map.w; j++){
			var tile;
			if((i > 1 || j > 1)){
				if(i % 2 == 0 && j % 2 ==0){
					tile = clone(tiles.wall);
				} else {
					tile = clone(rand(0, 2) ? tiles.trash : tiles.empty);
					if(tile.name == "trash"){
						var bonus = rand(0, 10);
						switch(bonus){
							case 0:
								tile.bonus = new Bonus("radius", j, i);
								break;
							case 1:
								tile.bonus = new Bonus("life", j, i);
								break;
							case 2:
								tile.bonus = new Bonus("bombs", j, i);
								break;
						}
					}
				}
				if(!game.map.exit && tile.name == "trash" && rand(0, game.map.w) == 0){
					game.map.exit = [j, i];
				}
			} else {
				tile =clone(tiles.empty);
			}
			map[i][j] = tile;
		}
	}
	game.board = [];
	for(var i in map){
		game.board[i] = [];
		for(var j in map[i]){
			var k;
			switch(map[j][i].name){
				case "wall": k = 0; break;
				case "trash": k = 2; break;
				case "empty":
				default: k = 1;
			}
			game.board[i][j] = k;
		}
	}
	if(!game.map.exit)
		game.map.exit = [game.map.w - 1, game.map.h - 1];
	console.warn("exit", game.map.exit);
}
var last_msg;
function print(msg, tm){
	if(last_msg){
		game.container.removeChild(last_msg);
		last_msg = null;
	}
	var t = document.createElement('div');
	var size = 40;
	t.style.display = 'table-cell';
	t.style.position = 'relative';
	t.style.width = game.width + 'px';
	t.style.textShadow = '#000 0 0 10px'
	t.style.height = game.height + 'px';
	t.style.verticalAlign = 'middle';
	t.style.color = '#FF3B3B';
	t.style.fontWeight = 'bold';
	t.style.fontFamily = 'sans-serif';
	t.style.background = 'rgba(0, 0, 0, 0.5)';
	t.innerHTML = msg;
	t.style.fontSize = size + 'px';
	t.id = 'msg';
	game.container.appendChild(t);
	last_msg = t;
	setTimeout(function(){
		if(last_msg){
			game.container.removeChild(last_msg);
			last_msg = null;
		}
	}, tm || 1000);
}
function ajax(url, callback){
	return;
	var oReq = new XMLHttpRequest();  
	oReq.open("GET", url, true);  
	oReq.onreadystatechange = function (oEvent) {
		if (oReq.readyState === 4) {  
			if (oReq.status === 200) {  
				//console.log(oReq.responseText);
				callback && callback(oReq.responseText);
			} else {  
				console.log("Error", oReq.statusText);  
			}  
		}  
	};  
	oReq.send(null);
}

