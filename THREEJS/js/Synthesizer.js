class Synthesizer {
	constructor(){
		this.audioContext = new AudioContext();
		this.cMajor = [130.81,146.83,164.81,174.61,196.00,220.00,246.94,261.63,293.66,329.63,349.23,392.00,440.00,493.88,523.25,587.33,659.26,698.46,783.99,880.00,987.77];
		this.osc = [];
		this.osc2 = [];
		this.gains = [];
	}

	startOsc(num, frequency){
		//this.osc[num] = this.audioContext.createOscillator();this.osc2[num] = this.audioContext.createOscillator();
		//
		//this.gains[num] = this.audioContext.createGain();
		//this.osc[num].connect(this.gains[num]);this.osc2[num].connect(this.gains[num]);
		//this.gains[num].connect(this.audioContext.destination);
		//this.gains[num].gain.value = .3;
		//this.osc[num].frequency.value = this.cMajor[Math.floor(frequency)];
		//this.osc2[num].frequency.value = this.cMajor[Math.floor(frequency)-4];
		//this.osc[num].type = "sine"
		//this.osc2[num].type = "sine"
		//this.osc[num].start(0);
		//this.osc2[num].start(0);
	}

	stopOsc(num){
		//this.osc[num].stop(this.audioContext.currentTime+1);this.osc2[num].stop(this.audioContext.currentTime+1);
		//this.gains[num].gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 1);
	}

	changeOsc(num, vol){
		//this.gains[num].gain.value = vol;
		//console.log("vol=" + vol)
	}

	playSound(frequency){
		//var duration = 0.05;
		//var fadeIn = 0.01;
		//var fadeOut = 0.01;
		//var osc = this.audioContext.createOscillator();
		//var gainNode = this.audioContext.createGain();
		//osc.connect(gainNode);
		//gainNode.connect(this.audioContext.destination);
		//console.log(Math.floor(frequency));
		//console.log(this.cMajor[Math.floor(frequency)]);
		//osc.frequency.value = this.cMajor[Math.floor(frequency)];
		//osc.type = "triangle"
		//osc.start(0);
		////gainNode.gain.value = .2;
//
		//// Fade it in.
		//var currTime = this.audioContext.currentTime;
		//gainNode.gain.linearRampToValueAtTime(0, currTime);
		//gainNode.gain.linearRampToValueAtTime(.2, currTime + fadeIn);
		//// Then fade it out.
		//gainNode.gain.linearRampToValueAtTime(.2, currTime + duration-fadeOut);
		//gainNode.gain.linearRampToValueAtTime(0, currTime + duration);
		//osc.stop(currTime + duration);
	}
}
