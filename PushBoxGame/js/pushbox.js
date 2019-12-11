window.onload = function () {

	var canvas = document.getElementById('canvas');

	var context = canvas.getContext('2d');

	var pushBox = {

		//保存图片信息
		imgs: {
			ball  : './images/ball.png',   //物品
			block : './images/block.gif',  //地板
			box   : './images/box.png',    //盒子
			down  : './images/down.png',   //人物下方向
			left  : './images/left.png',   //人物左方向
			right : './images/right.png',  //人物右方向
			up    : './images/up.png',     //人物上方向
			wall  : './images/wall.png'    //墙壁
		},

		//图片实例对象
		imgInstance: {

		},

		//x轴图片数量
		x: 16,

		//y轴图片数量
		y: 16,

		//地板的宽度
		width: 35,

		//地板的高度
		height: 35,

		//当前关卡序号
		currentLevel: 99,

		//初始化地图
		levelMap: null,

		//当前人物移动之后的地图
		currentMap: [],

		//初始化人物方向
		currentDirenctionMan: null,

		//初始化人物移动的步数
		moveCounts: 0,

		//初始化人物坐标
		manPonit: {
			x: 0,
			y: 0
		},

		//获取id元素
		getId: function (id) {

			return document.getElementById(id);

		},

		//预加载图片
		preloadImg: function (imgs, cb) {

			//imgs: 图片信息对象
			//cb: 所有图片实例生成后执行的回调函数

			//图片实例总数
			var imgCounts = Object.keys(imgs).length;

			//记录图片实例加载个数
			var imgCount = 0;

			for (var key in imgs) {

				this.imgInstance[key] = new Image();

				this.imgInstance[key].src = imgs[key];

				this.imgInstance[key].onload = (function () {

					if (++imgCount == imgCounts) {
						cb();
					}

				}).bind(this);

			}
		},

		//绘制地板
		paintFloor: function () {
			//levels: 地图数据

			//生成图片实例
			this.preloadImg(this.imgs, (function () {

				//绘制地板
				this.painitingFloor();

				//复制当前等级地图
				this.copyMap();

				this.paintMap(this.currentMap);

			}).bind(this));

		},

		//重绘地板
		painitingFloor: function () {
			for (var i = 0; i < this.x; i++) {
				for (var j = 0; j < this.y; j++) {
					context.drawImage(this.imgInstance.block, this.width * j, this.height * i, this.width, this.height);
				}
			}
		},

		//绘制地图
		paintMap: function (currentMap, directionMan) {

			//levelData: 地图数据
			//人物方向实例

			for (var i = 0; i < currentMap.length; i++) {
				for (var j = 0; j < currentMap[i].length; j++) {

					//默认地板
					var picture = null;

					switch (currentMap[i][j]) {

						case 0: //绘制地板
							picture = this.imgInstance.block;
							break;

						case 1: //绘制墙壁
							picture = this.imgInstance.wall;
							break;

						case 2: //绘制物品
							picture = this.imgInstance.ball;
							break;

						case 3: //绘制盒子
							picture = this.imgInstance.box;
							break;

						case 4: //绘制人物
							picture = directionMan || this.imgInstance.down;
							this.manPonit = {x: i, y: j};
							break;

						case 5: //绘制盒子
							picture = this.imgInstance.box;
							break;

					}

					context.drawImage(picture, this.width * j - (picture.width - this.width) / 2, this.height * i - (picture.height - this.height), picture.width, picture.height);

				}
			}

		},

		//人物移动
		manMoving: function (direction) {

			//人物移动之后的坐标
			var manMovingAfterPonit = {};

			//人物前面盒子移动之后坐标
			var boxMovingAfterPonit = {};

			switch (direction) {

				case 'left':
					//修改人物方向
					this.currentDirenctionMan = this.imgInstance.left;

					//人物向左移动一步之后的坐标
					manMovingAfterPonit.x = this.manPonit.x;
					manMovingAfterPonit.y = this.manPonit.y - 1;

					//盒子向左移动一步之后的坐标
					boxMovingAfterPonit.x = this.manPonit.x;
					boxMovingAfterPonit.y = this.manPonit.y - 2;

					break;

				case 'up':

					this.currentDirenctionMan = this.imgInstance.up;

					manMovingAfterPonit.x = this.manPonit.x - 1;
					manMovingAfterPonit.y = this.manPonit.y;

					boxMovingAfterPonit.x = this.manPonit.x - 2;
					boxMovingAfterPonit.y = this.manPonit.y;

					break;

				case 'right':

					this.currentDirenctionMan = this.imgInstance.right;

					manMovingAfterPonit.x = this.manPonit.x;
					manMovingAfterPonit.y = this.manPonit.y + 1;

					boxMovingAfterPonit.x = this.manPonit.x;
					boxMovingAfterPonit.y = this.manPonit.y + 2;

					break;

				case 'down':

					this.currentDirenctionMan = this.imgInstance.down;

					manMovingAfterPonit.x = this.manPonit.x + 1;
					manMovingAfterPonit.y = this.manPonit.y;

					boxMovingAfterPonit.x = this.manPonit.x + 2;
					boxMovingAfterPonit.y = this.manPonit.y;

					break;
			}

			//控制人物移动
			var pointxy = this.currentMap[manMovingAfterPonit.x][manMovingAfterPonit.y];
			console.log(pointxy);
			//如果人物前面是墙壁, 则不能移动
			if (pointxy == 1) {
				return false;
			}

			//如果人物前面是盒子, 如果盒子前面是盒子或者是墙壁, 则人物不能移动
			if (pointxy == 3 || pointxy == 5) {

				var box_xy = this.currentMap[boxMovingAfterPonit.x][boxMovingAfterPonit.y];
				if (box_xy == 3 || box_xy == 5 || box_xy == 1) {
					return false;
				}

				//人物前面盒子移动一步
				this.currentMap[boxMovingAfterPonit.x][boxMovingAfterPonit.y] = 3;

			}

			//人物移动一步
			this.currentMap[manMovingAfterPonit.x][manMovingAfterPonit.y] = 4;

			

			//判断原始地图的实际图片
			var index = this.levelMap[this.manPonit.x][this.manPonit.y];

			//如果人移动之前不是物品位置
			if(index != 2) {

				//如果是物品和和重合位置
				if (index == 5) {

					//绘制物品
					index = 2;
				} else {

					//绘制地板
					index = 0;
				}
			}

			//修改人物移动之后绘制的图片
			this.currentMap[this.manPonit.x][this.manPonit.y] = index;

				//修改人物坐标
			this.manPonit.x = manMovingAfterPonit.x;
			this.manPonit.y = manMovingAfterPonit.y;

			this.painitingFloor();

			this.paintMap(this.currentMap, this.currentDirenctionMan);

			//如果推动成功, 自动选择下一关
			if (this.checkSuccess()) {
				

				this.selectLevel(1);

				

			}

		},

		//检测是否推动成功
		checkSuccess: function () {

			for (var i = 0; i < this.currentMap.length; i++) {
				for (var j = 0; j < this.currentMap[i].length; j++) {
					//如果当前地图的盒子的位置不是初始化等级地图的物品位置, 则推动失败
					if ((this.currentMap[i][j] == 3 || this.currentMap[i][j] == 5) && (this.levelMap[i][j] != 2 && this.levelMap[i][j] != 5)) {
						return false;
					}
				}
			}

			console.log('推动成功');
			//推动成功
			return true;

		},

		//选择等级地图
		selectLevel: function (level) {

			this.currentLevel += level;

			if (this.currentLevel > levels.length - 1) {
				this.currentLevel = levels.length - 1;
				return;
			} else if (this.currentLevel < 0) {
				this.currentLevel = 0;
				return;
			}

			this.levelMap = levels[this.currentLevel];
			this.copyMap();
			this.painitingFloor();
			this.paintMap(this.currentMap);

			this.moveCounts = 0;
			this.getId('stepCount').textContent = this.moveCounts;
			this.getId('cardCount').textContent = this.currentLevel + 1;

		},

		//初始化地图
		initMap: function () {
			this.paintFloor();
		},

		//初始化
		init: function (levels) {

			var self = this;

			//初始化的等级地图数据
			this.levelMap = levels[this.currentLevel];

			//初始化绘制地图
			self.initMap();

			self.getId('cardCount').textContent = this.currentLevel + 1;

			self.addEvent('.level', 'click', function () {
				var id = +this.getAttribute('id');

				self.selectLevel(id);
				
			});

			self.getId('gameIntroduce').onclick = function () {
				self.getId('layer').style.display = 'block';
			}

			self.getId('know').onclick = function () {
				self.getId('layer').style.display = 'none';
			}

			self.directionEvent();

		},

		//绑定事件
		addEvent: function (selector, type, fn, isCapture) {

			var eles = document.querySelectorAll(selector);

			for (var i = 0; i < eles.length; i++) {
				eles[i].addEventListener(type, fn, isCapture || false);
			}

		},

		//绑定键盘方向键事件 left: 37, up: 38, right: 39, down: 40
		directionEvent: function () {
			document.onkeydown = (function (e) {
				var keyCode = e.keyCode;

				var direction = '';

				switch (keyCode) {

					case 37:
						direction = 'left';
						break;

					case 38:
						direction = 'up';
						break;

					case 39:
						direction = 'right';
						break;

					case 40:
						direction = 'down';
						break;

				}

				if (!direction) {
					return;
				}

				//设置人物移动步数
				this.getId('stepCount').textContent = ++this.moveCounts;

				this.manMoving(direction);


			}).bind(this)
		},

		//复制地图
		copyMap: function () {
			for (var i = 0; i < this.levelMap.length; i++) {
				this.currentMap[i] = this.levelMap[i].concat();
			}
		}

	};

	pushBox.init(levels);
}