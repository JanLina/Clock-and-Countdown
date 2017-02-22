function MusicVisualizer(ctx, size, drawer) {
	this.ctx = ctx;
	this.size = size;
	this.xhr = new XMLHttpRequest();
	this.ac = new (window.AudioContext || window.webkitAudioContext)();
	this.analyser = this.ac.createAnalyser();
	this.gainNode = this.ac[this.ac.createGain ? "createGain" : "createGainNode"]();

	this.analyser.fftSize = size * 2;
	this.analyser.connect(this.gainNode);

	this.gainNode.connect(this.ac.destination);

	this.source = null;
	this.count = 0;

	this.timer = null;
	this.drawer = drawer;
}

MusicVisualizer.prototype.load = function(url, fun) {
	var self = this;
	this.xhr.abort();
	this.xhr.open("GET", url);
	this.xhr.responseType = "arraybuffer";
	this.xhr.onload = function() {
		fun(self.xhr.response);
	}	
	this.xhr.send();
}

MusicVisualizer.prototype.decode = function(arraybuffer, fun) {
	this.ac.decodeAudioData(arraybuffer, function(buffer) {
		fun(buffer);
	}, function(err) {
		console.log(err);
	});
}

MusicVisualizer.prototype.play = function(url) {
	var self = this;
	var n = ++this.count;
	this.source && this.stop();
	this.load(url, function(arraybuffer) {
		if(n != self.count) {
			return;
		}
		self.decode(arraybuffer, function(buffer) {
			if(n != self.count) {
				return;
			}
			var bs = self.ac.createBufferSource();
			bs.connect(self.analyser);
			bs.buffer = buffer;
			bs[bs.start ? "start" : "noteOn"](0);
			self.source = bs;
			self.visualize();
		})
	})
}

MusicVisualizer.prototype.stop = function() {
	this.source && this.source[this.source.stop ? "stop" : "noteOff"](0);
	if(this.timer) {
		clearInterval(this.timer); //关闭定时器，不再分析音频
	}
}

MusicVisualizer.prototype.changeVolume = function(percent) {
	this.gainNode.gain.value = percent * percent;
}

MusicVisualizer.prototype.visualize = function() {
	var arr = new Uint8Array(this.analyser.frequencyBinCount),
		self = this;

	clearInterval(this.timer);
	this.timer = setInterval(function() {
		self.analyser.getByteFrequencyData(arr);
		self.drawer(self.ctx, self.size, arr);
	}, 50);
}