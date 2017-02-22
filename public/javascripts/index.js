function $(s) {
	return document.querySelectorAll(s);
}
function random(m, n) {
	return Math.random() * (n - m) + m;
}
var Dots = [];

window.onload = function() {

	// 时钟相关变量
	var canvasClock = document.getElementById("block"),
		ctxClock = canvasClock.getContext("2d"),
		CANVAS_WIDTH = 350,
		CANVAS_HEIGHT = CANVAS_WIDTH,
		rem = CANVAS_WIDTH / 200, //最初时钟是200*200的
		clock = new Clock(ctxClock, CANVAS_WIDTH / 2, rem),
		isDowning = false,
		timerDown = null;
	canvasClock.width = CANVAS_WIDTH;
	canvasClock.height = CANVAS_HEIGHT;

	// 音乐相关变量
	var canvasMusic = document.getElementById("visualization"),
		ctxMusic = canvasMusic.getContext("2d"),
		canvasWidth = 0,
		canvasHeight = 0,
		size = 64,
		mv = new MusicVisualizer(ctxMusic, size, draw),
		lis = $("#musicList ul li"),
		lisLength = lis.length,
		i,
		j;
	resize(canvasMusic, canvasWidth, canvasHeight, size);

	// 初始为正常走动的时钟
	var timer = setInterval(function() {
		if(isDowning === false) {
			clock.draw();
		}else { //若isDowning为true，表示倒计时开始，不再正常转动
			clearInterval(timer);
		}
	}, 1000);

	// 点击按钮设置倒计时
	document.getElementById("timingBtn").onclick = function() {
		var self = this,
			input = document.getElementById("timeInput"),
			count = +input.value,
			remain,
			hour,
			minute,
			second;
		if(this.className === "setCountDown") {
			if(isNaN(count) || count > 720 || count <= 0) { 
				alert("Please enter a number between 0 and 720.");
				return false;
			}else {
				isDowning = true;
				this.innerHTML = "Terminate";
				this.className = "terminateCountDown";

				// 倒计时开始
				clock.remainingTime = count * 60;
				timerDown = setInterval(function() {
					remain = clock.remainingTime;
					if(remain >= 0) { 
						clock.drawCountDown();
						hour = Math.floor(remain / 3600),
						minute = Math.floor(remain / 60 - hour * 60),
						second = Math.floor(remain % 60);
						input.value = hour + ":" + minute + ":" + second;
						input.disabled = "disabled";
					}else { //倒计时完毕，关闭计时器
						clearInterval(timerDown);

						// 播放提示音
						mv.stop();
						mv.play("/audio/hint.mp3");

						// 提示倒计时完毕
						$("#hint")[0].style.display = "block";
					}
				}, 1000);
			}
		}else if(this.className === "terminateCountDown") {
			clearInterval(timerDown);
			isDowning = false;
			this.innerHTML = "Set the clock";
			this.className = "setCountDown";
			input.value = "";
			input.disabled = "";

			// 时钟正常走动
			timer = setInterval(function() {
				if(isDowning === false) {
					clock.draw();
				}else { //若isDowning为true，表示倒计时开始，不再正常转动
					clearInterval(timer);
				}
			}, 1000);
		}
	}

	// 用户确认倒计时完毕
	$("#hintBtn")[0].onclick = function() {
		isDowning = false;
		mv.stop();
		this.parentNode.style.display = "none";
		$("#timingBtn")[0].innerHTML = "Set the clock";
		$("#timingBtn")[0].className = "setCountDown";
		$("#timeInput")[0].value = "";
		$("#timeInput")[0].disabled = "";

		// 时钟正常走动
		timer = setInterval(function() {
			if(isDowning === false) {
				clock.draw();
			}else { //若isDowning为true，表示倒计时开始，不再正常转动
				clearInterval(timer);
			}
		}, 1000);
	}

	// 播放音乐
	lis[0].style.display = "none"; //隐藏第一首（提示音）
	for(i = 0; i < lisLength; i++) {
		lis[i].onclick = function() {
			for(j = 0; j < lisLength; j++) {
				lis[j].className = "";
			}
			this.className = "selected";
			mv.play("/audio/" + this.title);
		}
	}

	// 音量调节
	$("#volume")[0].onchange = function() {
		mv.changeVolume(this.value / this.max);
	}
	$("#volume")[0].onchange();	
}

function resize(canvas, canvasWidth, canvasHeight, size) {

	// 重置音乐可视区域的大小
	canvasWidth = document.documentElement.clientWidth;
	canvasHeight = document.documentElement.clientHeight;
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;

	// 重新设置圆点位置
	getDots(canvasWidth, canvasHeight, size);
}
window.resize = resize;

function getDots(canvasWidth, canvasHeight, size) {
	Dots = [];
	var i;
	for (i = 0; i < size; i++) {
		x = random(0, canvasWidth);
		y = random(0, canvasHeight);
		color = "rgba(" + Math.round(random(0, 155)) + "," + Math.round(random(0, 155)) 
				+ "," + Math.round(random(0, 155)) + ",0)";
		Dots.push({
			x: x,
			y: y,
			color: color
		});
	}
}
function draw(ctx, size, arr) {
	console.log(arr);
	var i,
		dot,
		r,
		style;
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	for (i = 0; i < size; i++) {
		dot = Dots[i];		
		r = arr[i] / 256 * 50;
		ctx.beginPath();
		ctx.arc(dot.x, dot.y, r, 0, Math.PI * 2, false);
		style = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, r);
		style.addColorStop(0.0, "#FFF");
		style.addColorStop(1.0, dot.color);
		ctx.fillStyle = style;
		ctx.fill();
		ctx.closePath();
	}
}