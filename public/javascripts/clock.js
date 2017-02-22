function Clock(ctx, r, rem) {
	this.ctx = ctx;
	this.r = r; //时钟半径
	this.rem = rem;
	this.remainingTime = 0; //倒计时剩余时间
}

function random(m, n) {
	return Math.random() * (n - m) + m;
}

Clock.prototype.drawBackground = function() {
	var ctx = this.ctx,
		style,
		i,
		rad,
		x,
		y;

	ctx.save();

	// 外圆
	ctx.beginPath();
	ctx.lineWidth = 1 * this.rem;
	ctx.arc(0, 0, this.r - 7 * this.rem, 0, Math.PI * 2, false);
	ctx.closePath();
	ctx.strokeStyle = "rgb(20,120,255)";
	ctx.stroke();

	// 数字
	ctx.font = 11 * this.rem + "px Arial";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	for(i = 1; i < 13; i ++) {
		rad = 2 * Math.PI / 12 * (i - 3);
		x = Math.cos(rad) * (this.r - 30 * this.rem);
		y = Math.sin(rad) * (this.r - 30 * this.rem);
		ctx.fillText(i, x, y);
	}

	// 内圆
	for(i = 0; i < 60; i ++) {
		rad = 2 * Math.PI / 60 * i;
		x = Math.cos(rad) * (this.r - 18 * this.rem);
		y = Math.sin(rad) * (this.r - 18 * this.rem);
		ctx.beginPath();
		if(i % 5 === 0) {
			ctx.fillStyle = "white";
		}else {
			ctx.fillStyle = "#ccc";
		}
		ctx.arc(x, y, 2 * this.rem, 0, 2 * Math.PI, false);
		ctx.fill();
		ctx.closePath();
	}

	ctx.restore();
}

Clock.prototype.drawHour = function(hour, minute) {
	var ctx = this.ctx,
		rad = 2 * Math.PI / 12 * (hour + minute / 60); //时针旋转角度
	ctx.save();
	ctx.rotate(rad);
	ctx.lineWidth = 6 * this.rem;
	ctx.lineCap = "round";

	ctx.beginPath();
	ctx.lineTo(0, 10 * this.rem);
	ctx.lineTo(0, -this.r * 0.4);
	ctx.closePath();

	ctx.stroke();
	ctx.restore();
}

Clock.prototype.drawMinute = function(minute) {
	var ctx = this.ctx,
		rad = 2 * Math.PI / 60 * minute;
	ctx.save();
	ctx.rotate(rad);
	ctx.lineWidth = 4 * this.rem;
	ctx.lineCap = "round";

	ctx.beginPath();
	ctx.lineTo(0, 10 * this.rem);
	ctx.lineTo(0, -this.r * 0.6);
	ctx.closePath();

	ctx.stroke();
	ctx.restore();
}

Clock.prototype.drawSecond = function(second) {
	var ctx = this.ctx,
		rad = 2 * Math.PI / 60 * second; //时针旋转角度
	ctx.save();
	ctx.rotate(rad);
	ctx.lineWidth = 2 * this.rem;
	ctx.lineCap = "round";
	ctx.fillStyle = "rgb(20,120,255)";

	ctx.beginPath();
	ctx.lineTo(-2 * this.rem, 10 * this.rem);
	ctx.lineTo(2 * this.rem, 10 * this.rem);
	ctx.lineTo(1 * this.rem, -this.r + 18 * this.rem);
	ctx.lineTo(-1 * this.rem, -this.r + 18 * this.rem);
	ctx.closePath();

	ctx.fill();
	ctx.restore();
}

Clock.prototype.drawDot = function() {
	var ctx = this.ctx;
	ctx.save();
	ctx.fillStyle = "black";
	ctx.beginPath();
	ctx.arc(0, 0, 3 * this.rem, 0, 2 * Math.PI, false);
	ctx.closePath();
	ctx.fill();
	ctx.restore();	
}

Clock.prototype.draw = function() {
	var ctx = this.ctx;
	ctx.clearRect(0, 0, this.r * 2, this.r * 2);
	ctx.save();
	ctx.shadowColor = "rgb(36,157,188)";
	ctx.shadowOffsetX = 1 * this.rem;
	ctx.shadowOffsetY = 2 * this.rem;
	ctx.shadowBlur = 8 * this.rem;

	ctx.translate(this.r, this.r);
	ctx.fillStyle = "white";
	ctx.strokeStyle = "white";
	var now = new Date(),
		hour = now.getHours(),
		minute = now.getMinutes(),
		second = now.getSeconds();

	this.drawBackground();
	this.drawHour(hour, minute);
	this.drawMinute(minute);
	this.drawSecond(second);
	this.drawDot();
	ctx.restore();
}

Clock.prototype.drawCountDown = function() {
	var ctx = this.ctx,
		hour = Math.floor(this.remainingTime / 3600),
		minute = Math.floor(this.remainingTime / 60 - hour * 60),
		second = Math.floor(this.remainingTime % 60);
	console.log(hour + "  " + minute + "  " + second);
	ctx.clearRect(0, 0, this.r * 2, this.r * 2);
	ctx.save();
	ctx.shadowColor = "rgb(36,157,188)";
	ctx.shadowOffsetX = 1 * this.rem;
	ctx.shadowOffsetY = 2 * this.rem;
	ctx.shadowBlur = 8 * this.rem;
	ctx.translate(this.r, this.r);
	ctx.fillStyle = "white";
	ctx.strokeStyle = "white";

	this.remainingTime -= 1;

	this.drawBackground();
	if(hour > 0) {
		this.drawHour(hour, minute);
	}
	if(minute > 0) {
		this.drawMinute(minute);
	}
	this.drawSecond(second);
	this.drawDot();
	ctx.restore();
}