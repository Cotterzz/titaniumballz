"use strict";

window.addEventListener("gamepadconnected", (e) => {
  console.log(
    "Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index,
    e.gamepad.id,
    e.gamepad.buttons.length,
    e.gamepad.axes.length,
  );
});

var inputLSY = 0;
var inputLSX = 0;

function updateStatus() {
  for (const gamepad of navigator.getGamepads()) {
    if (!gamepad) continue;



    for (const [i, button] of gamepad.buttons.entries()) {



      if (button.pressed) {
        //console.log(`Button ${i} [PRESSED]`);

      }
    }

   
    for (const [i, axis] of gamepad.axes.entries()) {
        //console.log(`${i}: ${axis.toFixed(4)}`);
        //console.log("value", axis + 1);
        if(i==0){inputLSX=axis}
        if(i==1){inputLSY=axis}
    }
  }

}

const pixscale = 1;
const rad = 0.75;
function resizeCanvas(){
    //canvas.width  = window.innerWidth;
    //canvas.height = window.innerHeight;
    
    canvas.width  = window.innerWidth/pixscale;
    canvas.height = window.innerHeight/pixscale; 
    canvas.style['image-rendering'] = 'pixelated';
    canvas.style.width  = window.innerWidth+'px';
    canvas.style.height = window.innerHeight+'px';
}
var physics = {
    hook: 0.95,
    amount: 11,
    damp: 0.999,
    stopv: 0.05,
    cdist:[3, 0.1, 3,3,3, 3, 3,3, 3, 3, 3],
    maxvel:[0.5, 200, 0.1,0.1,0.1, 0.1, 0.1,0.1, 0.1, 0.1, 0.1],
    poss: false,
    possby: 5,
    agil:[0, 0.002, 2, 2,2, 2, 2,2, 2, 2, 2],
    xv: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    yv: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    zv: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    v: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    xp: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    yp: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    mass: [1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    radii: [0.2, rad, rad, rad, rad, rad,rad, rad, rad, rad, rad],
    toplim: [5.2, 4.9, 4.9, 4.9, 4.9, 4.9, 4.9, 4.9, 4.9, 4.9, 4.9],
    botlim: [-5.2, -4.9, -4.9, -4.9, -4.9, -4.9, -4.9, -4.9, -4.9, -4.9, -4.9],
    leflim: [-9.4, -9.1, -9.1, -9.1, -9.1, -9.1, -9.1, -9.1, -9.1, -9.1, -9.1],
    riglim: [9.4, 9.1, 9.1, 9.1, 9.1, 9.1, 9.1, 9.1, 9.1, 9.1, 9.1],
    goalTop: 1.5,
    goalBottom: -1.5,
    targetx: [0, -6.5, -6.5, -4, -4, -2, 2, 4, 4, 6.5, 6.5],
    targety: [0, 2, -2, 3, -3, 0, 0, -3, 3, -2, 2],
    targetxd: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    targetyd: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    targeta: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    targetamin: 0,
    targetamax: 0,
    anglediff: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    angleinc: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    targetd: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ballxd: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ballyd: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    balld: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    nearestA: 0,
    nearestB: 0,
    vinc: 0.1,
    checkColl: function(A, B) {
        var dx = gameobjects[B].x - gameobjects[A].x;
        var dy = gameobjects[B].y - gameobjects[A].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.radii[A] + this.radii[B]) {
            var angle = Math.atan2(dy, dx);
            var cosa = Math.cos(angle);
            var sina = Math.sin(angle);
            var vx1p = cosa * this.xv[A] + sina * this.yv[A];
            var vy1p = cosa * this.yv[A] - sina * this.xv[A];
            var vx2p = cosa * this.xv[B] + sina * this.yv[B];
            var vy2p = cosa * this.yv[B] - sina * this.xv[B];
            var P = vx1p * this.mass[A] + vx2p * this.mass[B];
            var V = vx1p - vx2p;
            vx1p = (P - this.mass[B] * V) / (this.mass[A] + this.mass[B]);
            vx2p = V + vx1p;
            this.xv[A] = cosa * vx1p - sina * vy1p;
            this.yv[A] = cosa * vy1p + sina * vx1p;
            this.xv[B] = cosa * vx2p - sina * vy2p;
            this.yv[B] = cosa * vy2p + sina * vx2p;
            var diff = ((this.radii[A] + this.radii[B]) - dist) / 2;
            var cosd = cosa * diff;
            var sind = sina * diff;
            gameobjects[A].x -= cosd;
            gameobjects[A].y -= sind;
            gameobjects[B].x += cosd;
            gameobjects[B].y += sind;
        }
    },
    score: function(side) {
        gameobjects[0].x = 0;
        gameobjects[0].y = 0;

        this.xv[0] = 0;
        this.yv[0] = 0;
        this.poss = false;
        this.possby = 0;
    },
    animate: function() {



        for (var i = 0; i < this.amount; i++) {


                if (this.poss && i === 0) {
                    gameobjects[i].x = (gameobjects[this.possby].x + (this.hook * Math.cos(gameobjects[this.possby].r - 1.5708)));
                    gameobjects[i].y = (gameobjects[this.possby].y + (this.hook * Math.sin(gameobjects[this.possby].r - 1.5708)));
                }
                gameobjects[i].x += this.xv[i];
                gameobjects[i].y += this.yv[i];
                this.xv[i] *= this.damp;
                this.yv[i] *= this.damp;
                if (gameobjects[i].x > this.riglim[i]) {

                    gameobjects[i].x = this.riglim[i];
                    this.xv[i] = -this.xv[i];

                    if (i === 0) {
                        if (gameobjects[i].y < this.goalTop && gameobjects[i].y > this.goalBottom) {
                            this.score("A");
                        }
                    }

                }
                if (gameobjects[i].x < this.leflim[i]) {
                    gameobjects[i].x = this.leflim[i];
                    this.xv[i] = -this.xv[i];
                    if (i === 0) {
                        if (gameobjects[i].y < this.goalTop && gameobjects[i].y > this.goalBottom) {
                            this.score("B");
                        }
                    }
   
                }
                if (gameobjects[i].y > this.toplim[i]) {
                    gameobjects[i].y = this.toplim[i];
                    this.yv[i] = -this.yv[i];
       
                }
                if (gameobjects[i].y < this.botlim[i]) {
                    gameobjects[i].y = this.botlim[i];
                    this.yv[i] = -this.yv[i];
       
                }

                if ((Math.abs(this.xv[i]) + Math.abs(this.yv[i])) < this.stopv) {
                    //this.xv[i] = 0;
                    //this.yv[i] = 0;
                }
   
            this.xp[i] = gameobjects[i].x;
            this.yp[i] = gameobjects[i].y;
            for (var j = i + 1; j < this.amount; j++) {
                this.checkColl(i, j);
            }
            if (i==0){

                if (this.poss) {
                    var xd2 = gameobjects[0].x - (gameobjects[this.possby].x + (this.hook * Math.cos(gameobjects[this.possby].r - 1.5708)));
                    var yd2 = gameobjects[0].y - (gameobjects[this.possby].y + (this.hook * Math.sin(gameobjects[this.possby].r - 1.5708)));
                    if (Math.sqrt((Math.abs(xd2) * Math.abs(xd2) + (Math.abs(yd2) * Math.abs(yd2)))) > 0.3) {
                        this.yv[0] = this.yv[this.possby];
                        this.xv[0] = this.xv[this.possby];
                        this.poss = false;
                        this.possby = 0;

                    }
                }

            } else {
                this.ballxd[i] = gameobjects[0].x - gameobjects[i].x;
                this.ballyd[i] = gameobjects[0].y - gameobjects[i].y;
                this.balld[i] = Math.sqrt((Math.abs(this.ballxd[i]) * Math.abs(this.ballxd[i])) + (Math.abs(this.ballyd[i]) * Math.abs(this.ballyd[i])));

                this.targetxd[i] = this.targetx[i] - gameobjects[i].x;
                this.targetyd[i] = this.targety[i] - gameobjects[i].y;
                this.targeta[i] = Math.atan2(this.targetyd[i], this.targetxd[i]);
   
                gameobjects[i].r = gameobjects[i].r % 6.283184;
 
                this.targetd[i] = Math.sqrt((Math.abs(this.targetxd[i]) * Math.abs(this.targetxd[i])) + (Math.abs(this.targetyd[i]) * Math.abs(this.targetyd[i])));

                if (this.targetd[i] > this.cdist[i]) {
                    this.v[i] = this.maxvel[i];
                } else if (i == this.nearestA && this.possby != i) {
                    this.v[i] = this.maxvel[i];
                } else if (i == this.nearestB && this.possby != i) {
                    this.v[i] = this.maxvel[i];
                } else if (this.possby == i) {
                    this.v[i] = this.maxvel[i];
                } else {
                    this.v[i] = this.maxvel[i] * (this.targetd[i] / this.cdist[i]);
                }

                //this.v[i] = this.maxvel[i];
                var wx = this.v[i] * Math.cos(this.targeta[i]);
                var wy = this.v[i] * Math.sin(this.targeta[i]);
                var netrotation = (gameobjects[i].r - 1.5708);

                this.anglediff[i] = this.targeta[i] - netrotation;

                if (this.anglediff[i] > 3.1415927) {
                    this.anglediff[i] -= 6.24318;
                }
                if (this.anglediff[i] < -3.1415927) {
                    this.anglediff[i] += 6.24318;
                }


                if (Math.abs(this.anglediff[i]) < 1.2) {
                    this.yv[i] += (wy - this.yv[i]) / this.agil[i];
                    this.xv[i] += (wx - this.xv[i]) / this.agil[i];
                }

                //this.angleinc[i] = (this.anglediff[i]) / 10;

                if (this.targetd[i] < 1 && i>1) {

                    this.targetxd[i] = gameobjects[0].x - gameobjects[i].x;
                    this.targetyd[i] = gameobjects[0].y - gameobjects[i].y;
                    this.targeta[i] = Math.atan2(this.targetyd[i], this.targetxd[i]);
                    this.anglediff[i] = this.targeta[i] - netrotation;
                    if (this.anglediff[i] > 3.1415927) {
                        this.anglediff[i] -= 6.24318;
                    }
                    if (this.anglediff[i] < -3.1415927) {
                        this.anglediff[i] += 6.24318;
                    }
                    this.angleinc[i] = (this.anglediff[i]) / 10;



                }

                gameobjects[i].r += this.angleinc[i];
 
                if (this.possby == i && this.targetd[i] < 1) {
                    this.poss = false;
                    this.possby = 0;
                    this.yv[0] = this.yv[i] + 0.8 * Math.sin(gameobjects[i].r - 1.5708);
                    this.xv[0] = this.xv[i] + 0.8 * Math.cos(gameobjects[i].r - 1.5708);
                    gameobjects[0].x += this.xv[0];
                    gameobjects[0].y += this.yv[0];
                }

                if (!this.poss) {
                    var xd = gameobjects[0].x - (gameobjects[i].x + (this.hook * Math.cos(gameobjects[i].r - 1.5708)));
                    var yd = gameobjects[0].y - (gameobjects[i].y + (this.hook * Math.sin(gameobjects[i].r - 1.5708)));
                    if (Math.sqrt((Math.abs(xd) * Math.abs(xd) + (Math.abs(yd) * Math.abs(yd)))) < 0.2) {
                        this.poss = true;
                        this.possby = i;
                      
                    }
                }



            }
         
        }
        this.nearestA = 1;
        this.nearestB = 6;
        for (var k = 1; k < 6; k++) {
            if (this.balld[k] < this.balld[this.nearestA]) {
                this.nearestA = k;
            }
        }

        for (var l = 6; l < this.amount; l++) {
            if (this.balld[l] < this.balld[this.nearestB]) {
                this.nearestB = l;
            }
        }
    }
};

var gameobjects = [{x:0,y:0},
                   {x:-2,y: 0, r: 1.5708},
                   {x:-4,y: 2, r: 1.5708},
                   {x:-4,y: -2,r: 1.5708},
                   {x:-6,y: 2, r: 1.5708},
                   {x:-6,y: -2,r: 1.5708},
                   {x:2, y:0,  r:-1.5708},
                   {x:4, y:2,  r:-1.5708},
                   {x:4, y:-2, r:-1.5708},
                   {x:6, y:2,  r:-1.5708},
                   {x:6, y:-2, r:-1.5708}]

var AI = {
    human: 1,
    attackx: [0, 0.2, 0.4, 0.6, 0.8, 1.2, 1.5, 1.5, 1.8, 1.8, 1.9],
    attacky: [0, 1, 1.5, 0.5, 1.7, 0.3, 1.3, 0.7, 0.3, 1.7, 1],
    neutralx: [0, 0.25, 0.25, 0.7, 0.7, 0.8, 1.2, 1.3, 1.3, 1.75, 1.75],
    neutraly: [0, 0.5, 1.5, 0.25, 1.75, 1, 1, 1.75, 0.25, 1.5, 0.5],
    defensex: [0, 0.1, 0.2, 0.2, 0.5, 0.5, 0.8, 1.2, 1.4, 1.6, 1.8],
    defensey: [0, 1, 1.7, 0.3, 0.7, 1.3, 0.3, 1.7, 0.5, 1.5, 1],
    positionx: null,
    positiony: null,

    animate: function() {
        if (physics.poss) {
            if (physics.possby > 5) {
                this.positionx = this.defensex;
                this.positiony = this.defensey;
            } else {
                this.positionx = this.attackx;
                this.positiony = this.attacky;
            }

        } else {
            this.positionx = this.neutralx;
            this.positiony = this.neutraly;
        }

        for (var i = 1; i < 11; i++) {
            if(i!=this.human){
            physics.targetx[i] = this.getx(this.positionx[i]);
            physics.targety[i] = this.gety(this.positiony[i]);
        }
        }
        physics.targetx[this.human] = gameobjects[this.human].x + inputLSX*4;
        physics.targety[this.human] = gameobjects[this.human].y - inputLSY*4;

        // nearest red and green droids to ball targets ball
        if(physics.nearestA!=this.human){
        physics.targetx[physics.nearestA] = gameobjects[0].x;
        physics.targety[physics.nearestA] = gameobjects[0].y;
        }
        physics.targetx[physics.nearestB] = gameobjects[0].x;
        physics.targety[physics.nearestB] = gameobjects[0].y;

        // if ball is in possession, give possessing droid new target
        if (physics.poss&&physics.possby!=this.human) {

            if (physics.possby > 5) {
                physics.targetx[physics.possby] = -5;
                physics.targety[physics.possby] = 0;
            } else {
                physics.targetx[physics.possby] = 5;
                physics.targety[physics.possby] = 0;
            }
        }
        // if possessing droid reaches target, target goal

        // if pointing towards goal, fire ball

        // give human droid control target

        //physics.targetx[this.human] = controls.mx;
        //physics.targety[this.human] = controls.my;
    },

    getx: function(num) {
        var ballx = gameobjects[0].x;
        ballx += 9.6;
        if (num < 1) {
            return ((ballx * num) - 9.6);
        } else {
            return ((ballx + ((19.2 - ballx) * (num - 1))) - 9.6);
        }
    },

    gety: function(num) {
        var bally = gameobjects[0].y;
        bally += 5.4;
        if (num < 1) {
            return ((bally * num) - 5.4);
        } else {
            return ((bally + ((10.8 - bally) * (num - 1))) - 5.4);
        }
    }
};
function main() {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  const canvas = document.querySelector("#canvas");

  const gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }
  resizeCanvas();
  const vs = `#version 300 es
    // an attribute is an input (in) to a vertex shader.
    // It will receive data from a buffer
    in vec4 a_position;

    // all shaders have a main function
    void main() {

      // gl_Position is a special variable a vertex shader
      // is responsible for setting
      gl_Position = a_position;
    }
  `;

  const fs = `#version 300 es
    precision highp float;

    uniform vec2 iResolution;
    uniform vec2 iMouse;
    uniform float iTime;

    uniform vec2 pos0;
    uniform vec3 pos1;
    uniform vec3 pos2;
    uniform vec3 pos3;
    uniform vec3 pos4;
    uniform vec3 pos5;
    uniform vec3 pos6;
    uniform vec3 pos7;
    uniform vec3 pos8;
    uniform vec3 pos9;
    uniform vec3 pos10;

    // we need to declare an output for the fragment shader
    out vec4 outColor;
    #define numrobs 11
    #define numlights 3
    #define black vec3(0.0,0.0,0.0)
    #define white vec3(1.0,1.0,1.0)
    #define grey vec3(0.5,0.5,0.5)
    #define blue vec3(0.0,0.0,1.0)
    #define red vec3(1.0,0.0,0.0)
    #define lime vec3(0.0,1.0,0.0)
    #define green vec3(0.0,0.7,0.0)
    #define cyan vec3(0.0,1.0,1.0)
    #define purple vec3(1.0,0.0,1.0)
    #define yellow vec3(1.0,1.0,0.0)
    #define orange vec3(1.0,0.6,0.0)
    
    #define porange vec3(1.0,0.8,0.6)
    #define pyellow vec3(0.87,0.87,0.7)
    #define pblue vec3(0.8,0.85,1.0)
    #define pgreen vec3(0.7,0.9,0.7)
    #define pink vec3(0.95,0.75,0.75)
    #define ppurple vec3(1.0,0.7,1.0)
    #define pgrey vec3(0.85,0.85,0.85)
    
    // declared here for use in functions
    float pixel = 0.0;
    vec4 courtprox = vec4(0.0);
    vec2 uv = vec2(0.0);
    float ar = 0.0;
    float f = 0.0; // AA mixing number
    float border = 0.05;
    float bar = 1.0;
    
    struct light
    {
        vec3 colour;
        vec3 position;
        vec3 difference;
        vec3 amount;
        vec2 shadow;
        float dist;
        float intensity;
    };
    
    struct Rob // Round Object. (Players and Ball)
    {
        vec3 position;
        vec3 colourA;
        vec3 colourB;
        float rotation;
        float radius;
    };
    
    vec3 getGroundColour(){
        float linewidth = 0.01;
        float hlinewidth = linewidth/2.0;
        float rhlinewidth = hlinewidth + pixel/2.0;
        vec3 rcol = pgrey;
        if(courtprox.x>-linewidth&&courtprox.x<=0.0||abs(courtprox.y)<linewidth||courtprox.z>-linewidth&&courtprox.z<=0.0||abs(courtprox.w)<linewidth){
            rcol = white;
        }
        float crad = 0.2;
        float dfc = distance(uv, vec2(ar/2.0, 0.5));
        float crdiff = dfc-crad;
        if(crdiff<rhlinewidth ){
            f = smoothstep(rhlinewidth-pixel,rhlinewidth , abs(crdiff));
            rcol = mix(white, pgrey, f);
        }
    
        if(crdiff>=hlinewidth-pixel&&abs(uv.x - (ar/2.0))<=hlinewidth){
            rcol = white;
        }
        dfc = distance(uv, vec2(border*bar, 0.5));
        crdiff = dfc-crad;
        if(crdiff<rhlinewidth ){
            f = smoothstep(rhlinewidth-pixel,rhlinewidth , abs(crdiff));
            rcol = mix(white, rcol, f);
        }
        dfc = distance(uv, vec2(ar-(border*bar), 0.5));
        crdiff = dfc-crad;
        if(crdiff<rhlinewidth ){
            f = smoothstep(rhlinewidth-pixel,rhlinewidth , abs(crdiff));
            rcol = mix(white, rcol, f);
        }
        return rcol;
    }
    
    bool outputMode = false; vec3 outputColour; // Easy way to throw a value at the output for debugging
    void outputValue (in float value){
        outputMode = true;
        if ( value >= 0.0 && value <= 1.0 )
            { outputColour = vec3(value, value, value); }
            else if ( value < 0.0 && value > -1.0 )
            { outputColour = vec3(0.0, 0.0, -value ); }
            else if ( value > 1.0 )
            { outputColour = vec3(1.0-(1.0/value), 1.0, 0.0); }
            else if ( value < -1.0 )
            { outputColour = vec3(1.0-(1.0/-value), 0.0, 1.0); }
    } // Call outputValue with a float and that value will override the pixel output
    void outputValue (in vec3 value){outputMode = true;outputColour = value;} // or directly with a vec3
    
    vec3 contrast(vec3 color, float value) {
      return 0.5 + value * (color - 0.5);
    }
    
    vec3 gammaCorrection (vec3 colour, float gamma) {
      return pow(colour, vec3(1. / gamma));
    }
    
    float linePointLength( in vec3 P, in vec3 A, in vec3 B ){
        vec3 AB = B-A;
        float lenAB = length(AB);
        vec3 D = AB/lenAB;
        vec3 AP = P-A;
        float d = dot(D, AP);
        vec3 X = A + D * dot(P-A, D);
        if(X.z<0.0){return 10.0;} else {return length(X-P);}
    }
    
    vec3 linePoint( in vec3 P, in vec3 A, in vec3 B ){
        vec3 AB = B-A;
        float lenAB = length(AB);
        vec3 D = AB/lenAB;
        vec3 AP = P-A;
        float d = dot(D, AP);
        vec3 X = A + D * dot(P-A, D);
        return X;
    }
    
    // SD Functions from https://iquilezles.org/articles/distfunctions2d/
    
    float sdBox( in vec2 p, in vec2 b )
    {
        vec2 d = abs(p)-b;
        return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
    }
    
    float sdTriangle( in vec2 p, in vec2 p0, in vec2 p1, in vec2 p2 ){
    	vec2 e0 = p1 - p0;
    	vec2 e1 = p2 - p1;
    	vec2 e2 = p0 - p2;
    
    	vec2 v0 = p - p0;
    	vec2 v1 = p - p1;
    	vec2 v2 = p - p2;
    
    	vec2 pq0 = v0 - e0*clamp( dot(v0,e0)/dot(e0,e0), 0.0, 1.0 );
    	vec2 pq1 = v1 - e1*clamp( dot(v1,e1)/dot(e1,e1), 0.0, 1.0 );
    	vec2 pq2 = v2 - e2*clamp( dot(v2,e2)/dot(e2,e2), 0.0, 1.0 );
        
        float s = e0.x*e2.y - e0.y*e2.x;
        vec2 d = min( min( vec2( dot( pq0, pq0 ), s*(v0.x*e0.y-v0.y*e0.x) ),
                           vec2( dot( pq1, pq1 ), s*(v1.x*e1.y-v1.y*e1.x) )),
                           vec2( dot( pq2, pq2 ), s*(v2.x*e2.y-v2.y*e2.x) ));
    
    	return -sqrt(d.x)*sign(d.y);
    }
    // Copyright (c) 2024 John Cotterell johnmdcotterell@gmail.com
    // You may view and edit this code (with this message intact) only on Shadertoy.
    // Anything else requires my permission.
    
    void mainImage( out vec4 fragColor, in vec2 fragCoord )
    {
        // GEOMETRY SETTINGS
        // General
        uv = fragCoord/iResolution.y;      // Normalised resolution
        float height = 0.0;                     // This is the z value to go with our uv's x and y
        ar = iResolution.x/iResolution.y; // Aspect ratio or normalised width
        pixel = 1.0/iResolution.y;        // Size of pixel, for AA
        // Zones. Not exclusive. We can be on more than one for purposes of AA mixing
        bool ZoneRob = false;                  // Are we on the curved fg objects
        bool ZoneGround = false;                // Are we on the ground
        bool ZoneWall = false;                  // Are we on the walls
        bool ZoneGoalWall = false;              // Are we on the goal walls
        bool ZoneInsideWall = false;            // Are we inside wall of goal
        // Background
        border = 0.05;  // Edge border as fraction of screen
        bar = 1.0; // vary border thickness, set to ar, or not, set to 1.0 
        vec4 courtyard = vec4( border*bar, border, ar-(border*bar), 1.0-border); // Edge border limits
        // Difference between current position and edge border limits
        courtprox = vec4( courtyard.x - uv.x, courtyard.y - uv.y, uv.x - courtyard.z, uv.y - courtyard.w);
        float goalwidth = 0.2;                   // width of goal
        float goaltop = 0.5 + (goalwidth/2.0);   // position of goal top
        float goalbottom = 0.5 - (goalwidth/2.0);// position of goal bottom
        float goalprox = max((uv.y-goaltop), (goalbottom-uv.y)); // how far current position is from goal limits
        float wallheightfactor = 1.0;  // multiplier to make up for the fake wall perspective
        // Foreground
        Rob Robs[numrobs];
        float dist = ar; // distance to nearest foreground object
        int rindex = -1; // index of object
        vec2 centre = vec2(ar/2.0, 0.5); // centre of current object
        float radius = 0.0; // radius of current object
        float cradius = 0.34; // radius of circle
        vec2 centreL = vec2((ar/2.0)-(cradius),0.5); // centre of left circle
        vec2 centreR = vec2((ar/2.0)+(cradius),0.5); // centre of right circle
        float segment = 1.256637; // ( 3.1415926 * 2.0 ) / 5.0;
        float rightAng = 1.5708; // ( 3.1415926 * 2.0 ) / 4.0;
        float dradius = 0.055; // default object radius
        float bradius = 0.02; // ball radius
        vec2 distv; // vector from current position to centre
        vec3 normal = vec3(0.0,0.0,1.0); // normal of surface, default is normal of ground
        vec3 bgnormal = vec3(0.0,0.0,1.0); // normal of walls or ground, default is normal of ground
        bool flatTop = false;
        float theight = 0.0;
        float angle = 0.0;
        float speed = iTime;

        vec3 pos[numrobs];
        pos[0] = vec3(pos0, 0.0);
        pos[1] = pos1;
        pos[2] = pos2;
        pos[3] = pos3;
        pos[4] = pos4;
        pos[5] = pos5;
        pos[6] = pos6;
        pos[7] = pos7;
        pos[8] = pos8;
        pos[9] = pos9;
        pos[10] = pos10;
        for(int i=0;i<numrobs;i++){
            pos[i].x = (ar/2.0) + (pos[i].x/10.0)*(ar/2.0);
            pos[i].y = 0.5 + (pos[i].y/6.0)*0.5;
        }
        for(int i=1;i<numrobs;i++){
            Robs[i].radius = dradius;
            Robs[i].position = vec3( pos[i].xy, 0.0);
            Robs[i].rotation = pos[i].z - rightAng;
        }
        int hasball = 2;
        float balldist = bradius*1.1 + dradius;
        Robs[0].position = vec3( pos[0].x, pos[0].y, Robs[0].radius);
        Robs[0].radius = bradius;
        Robs[0].colourA = vec3(1.3,1.3,1.4);
        Robs[1].colourA = porange;
        Robs[2].colourA = pink;
        Robs[3].colourA = pink;
        Robs[4].colourA = pink;
        Robs[5].colourA = pink;
        Robs[6].colourA = pgreen;
        Robs[7].colourA = pgreen;
        Robs[8].colourA = pgreen;
        Robs[9].colourA = pgreen;
        Robs[10].colourA = pgreen;
        
        // COLOUR SETTINGS
        vec3 bgcol; // final background colour
        vec3 fgcol; // final foreground colour
        vec3 col = white;   // final colour
        vec2 robambient = vec2(1.0, 1.0); // the total Ambient effect of round objects. two vlaues for mixing foreground and bg
        
        light lights[numlights];
        lights[0] = light(vec3(1.0,1.0,1.0),vec3(ar*0.5, 0.5 ,0.5),vec3(0.0),vec3(0.0),vec2(0.0),0.0, 0.1);
        lights[1] = light(vec3(1.0,0.4,0.4),vec3(ar*-0.04, 0.5 ,0.05),vec3(0.0),vec3(0.0),vec2(0.0),0.0, 0.04);
        lights[2] = light(vec3(0.4,1.0,0.4),vec3(ar*1.04, 0.5 ,0.05),vec3(0.0),vec3(0.0),vec2(0.0),0.0, 0.04);
        
        // CASES
        if(courtprox.w>0.0 && courtprox.w*bar>courtprox.z && courtprox.w*bar>courtprox.x){
            // TOP WALL
            bgcol = pgrey;
            bgnormal = vec3(0.0,-1.0,0.0);
            ZoneWall = true;
            height = courtprox.w * wallheightfactor;
        } else if(courtprox.y>0.0 && courtprox.y*bar>courtprox.z && courtprox.y*bar>courtprox.x){
            // BOTTOM WALL
            bgcol = pgrey;
            bgnormal = vec3(0.0,1.0,0.0);
            ZoneWall = true;
            height = courtprox.y *  wallheightfactor;
        } else if(goalprox>0.0 && courtprox.x>0.0 || courtprox.x>(border*bar)/2.0){
            // LEFT WALL
            bgcol = pgrey;
            bgnormal = vec3(1.0,0.0,0.0);
            ZoneWall = true; ZoneGoalWall = true;
            float cph = courtprox.x/2.2;
            if(goalprox<cph && courtprox.x<(border*bar)/2.0 ){
                ZoneInsideWall = true;
                height = goalprox * wallheightfactor;
                if(uv.y<0.5){bgnormal = vec3(0.0,1.0,0.0);}else{bgnormal = vec3(0.0,-1.0,0.0);} 
            } else {
                height = courtprox.x * wallheightfactor;      
            }
        } else if(goalprox>0.0 && courtprox.z>0.0 || courtprox.z>(border*bar)/2.0){
            // RIGHT WALL
            bgcol = pgrey;
            bgnormal = vec3(-1.0,0.0,0.0);
            ZoneWall = true; ZoneGoalWall = true;
            if(goalprox<courtprox.z/2.2 && courtprox.z<(border*bar)/2.0 ){
                ZoneInsideWall = true;
                height = goalprox * wallheightfactor;
                if(uv.y<0.5){bgnormal = vec3(0.0,1.0,0.0);}else{bgnormal = vec3(0.0,-1.0,0.0);}
            } else {
                height = courtprox.z * wallheightfactor;
              
            }
        } else {
            ZoneGround = true;
            bgcol = getGroundColour();
            bgnormal = vec3(0.0,0.0,1.0);
            //float testbox = sdBox(uv - vec2(0.1,0.5), vec2(0.1,0.1));height=min(testbox, 0.0);
        }
        
        float lightATG = (goaltop-lights[1].position.y)/(lights[1].position.x-courtyard.x);
        float lightATGdist = ( (lights[1].position.x - uv.x) * lightATG) -  (uv.y-lights[1].position.y);
        float lightABG = (goalbottom-lights[1].position.y)/(lights[1].position.x-courtyard.x);
        float lightABGdist =    (uv.y-lights[1].position.y)-( (lights[1].position.x - uv.x) * lightABG);
        float lightAdist = lightABGdist*lightATGdist;
        
        lights[1].shadow.x = 1.0;
        if(goalprox<0.0||ZoneInsideWall){lights[1].shadow.x = 0.0;} else if(lightAdist>0.0){
            lights[1].shadow.x = 0.0;
            f = smoothstep(0.0, 0.2*-courtprox.x, lightAdist);
            lights[1].shadow.x = mix(1.0, 0.0, f);
        }
        
        lightATG = (goaltop-lights[2].position.y)/(lights[2].position.x-courtyard.z);
        lightATGdist = ( (lights[2].position.x - uv.x) * lightATG) -  (uv.y-lights[2].position.y);
        lightABG = (goalbottom-lights[2].position.y)/(lights[2].position.x-courtyard.z);
        lightABGdist =    (uv.y-lights[2].position.y)-( (lights[2].position.x - uv.x) * lightABG);
        lightAdist = lightABGdist*lightATGdist;
        
        lights[2].shadow.x = 1.0;
        if(goalprox<0.0||ZoneInsideWall){lights[2].shadow.x = 0.0;} else if(lightAdist>0.0){
            lights[2].shadow.x= 0.0;
            f = smoothstep(0.0, 0.2*-courtprox.z, lightAdist);
            lights[2].shadow.x = mix(1.0, 0.0, f);
        }
        lights[1].shadow.y = lights[1].shadow.x;
        lights[2].shadow.y = lights[2].shadow.x;
        
        
        for(int i=0;i<numrobs;i++){
            float bdist = distance(uv, Robs[i].position.xy);
            if(bdist<dist){dist=bdist;}
            
            if(bdist<Robs[i].radius&&!ZoneWall){
                dist=bdist;
                radius = Robs[i].radius;
                height = sqrt((radius*radius)-(dist*dist));
                ZoneRob = true;
                rindex = i;
                if(i>5){flatTop=true;}
                if(bdist<Robs[i].radius-pixel){ZoneGround = false;}
            } else {
                float edgedist = distance(uv, Robs[i].position.xy) + (Robs[i].position.z);
                robambient *= 1.0 - (0.5 * pow(0.8/(edgedist/Robs[i].radius),3.0)); // ambient multiplier for outside of object
            }
            
        }
        
        if(ZoneRob){
            fgcol = Robs[rindex].colourA;
            centre = vec2(Robs[rindex].position.x, Robs[rindex].position.y);
            distv = uv - centre;
            normal = vec3(distv.x, distv.y, height)/radius;
            height+=Robs[rindex].position.z;
            
            if(flatTop){
                float tradius = radius/2.5;
                theight = sqrt((radius*radius)-(tradius*tradius));
                if(height>theight){
                    height=theight;
                    normal = vec3(0.0, 1.0, 0.0);
                }
                f = smoothstep(theight-0.01, theight, height);
                normal = mix(normal,vec3(0.0, 0.0, 1.0),  f);
                height = mix(height,theight,  f);
            }
            
            robambient *= (0.6 + normal.z/3.0);// ambient multiplier for inside of object
            float rotation = Robs[rindex].rotation;
            if(rindex>0){
                // Spoiler flap - theres probably a simpler way of doing this
                float SpFoffset = radius*2.0;// set distance from centre to front
                float SpBoffset = radius/1.0;// set distance from centre to back
                float SpFheight = radius*-1.0;// set front and back heights
                float SpBheight = radius*1.4;
                float SpWidth = radius/1.4;// set width, length, height of triangle
                float SpLength = SpFoffset+SpBoffset;
                float SpHeight = SpBheight-SpFheight;
                vec3 SpFc = vec3(centre.x + SpFoffset * cos(rotation),  centre.y + SpFoffset * sin(rotation), 0.0);// get front point F
                vec3 SpFl = SpFc; SpFl.x += (SpWidth * sin(rotation)); SpFl.y -= (SpWidth * cos(rotation));// get front points L and R
                vec3 SpFr = SpFc; SpFr.x -= (SpWidth * sin(rotation)); SpFr.y += (SpWidth * cos(rotation));
                vec3 SpBc = vec3(centre.x - SpBoffset * cos(rotation), centre.y - SpBoffset * sin(rotation), 0.0);// get back point B
                vec3 SpBl = SpBc; SpBl.x += (SpWidth * sin(rotation)); SpBl.y -= (SpWidth * cos(rotation));// get back points L and R
                vec3 SpBr = SpBc; SpBr.x -= (SpWidth * sin(rotation)); SpBr.y += (SpWidth * cos(rotation));
                float SpBD = linePointLength( vec3(uv.x, uv.y, 0.0), vec3(SpBl.x, SpBl.y, 0.0), vec3(SpBr.x, SpBr.y, 0.0) );// get distance from back
                float SpFD = linePointLength( vec3(uv.x, uv.y, 0.0), vec3(SpFl.x, SpFl.y, 0.0), vec3(SpFr.x, SpFr.y, 0.0) );// get distance from front
                float SpH = SpFheight + (SpHeight*(SpFD/SpLength));// get height of current point
                float inTri = sdTriangle(uv, SpFc.xy, SpBr.xy, SpBl.xy);// is point in triangle
                //if(inTri<0.0){outputValue(purple);} // uncomment to test where spoiler triangle is
        
                float lineDist = linePointLength( vec3(uv.x, uv.y, 0.0) , vec3(SpBc.x, SpBc.y, 0.0)  , vec3(SpFc.x, SpFc.y, 0.0)  );
    
                if(SpH>height){// is spoiler higher than dome
                    float face = 0.7; 
                    if(inTri<0.0&&dist<radius*0.9){
                        if(dist<radius*0.7){
                            f = smoothstep(0.0, pixel*5.0, SpH-height);
                            height=mix(height, SpH,  f);
                            normal=mix(normal,vec3( face * cos(rotation) , face * sin(rotation), 0.7), f);
                        } else {
                            f = smoothstep(radius*0.75, radius*0.95, dist);
                            height=mix( SpH, height, f);
                            normal=mix(vec3( face * cos(rotation) , face * sin(rotation), 0.7),normal, f);
                        }
                    } 
                }
                
            }
            normal = normal/length(normal);
            for(int i=0;i<numrobs;i++){
            if(i!=rindex){
                for(int j=0;j<numlights;j++){
                 if(distance(Robs[i].position, lights[j].position) < distance(Robs[rindex].position, lights[j].position)){
                    vec3 tempBall = Robs[i].position;
                    tempBall.z*=1.2;
                    float beam = linePointLength(tempBall, lights[j].position, vec3(uv.x, uv.y, height)); 
                    float cradius = Robs[i].radius*1.2; // cheating and making the ball bigger so shadow seen more easily
                    float blur = distance(Robs[i].position, vec3(uv.x, uv.y, height))/5.0;
                    float shadow = 0.0;
                    if (beam<=(cradius-blur)){shadow = 1.0;} else {
                        f = smoothstep(cradius-blur, cradius, beam);
                        shadow = mix(1.0,0.0, f);
                    }
                    lights[j].shadow.y = max(shadow, lights[j].shadow.y);
                    }
                    }
                }
            }
        }
        
        if(ZoneGround||ZoneWall){
            float shadowheight = 0.0;
            if(ZoneWall){shadowheight = height;};
            for(int i=0;i<numrobs;i++){
                for(int j=0;j<numlights;j++){
                    float beam = linePointLength(Robs[i].position, lights[j].position, vec3(uv.x, uv.y, shadowheight)); 
                    float cradius = Robs[i].radius;
                    float blur = distance(Robs[i].position, vec3(uv.x, uv.y, shadowheight))/5.0;
                    float shadow = 0.0;
                    if (beam<=(cradius-blur)){shadow = 1.0;} else {
                        f = smoothstep(cradius-blur, cradius, beam);
                        shadow = mix(1.0,0.0, f);
                    }
                    lights[j].shadow.x = max(shadow, lights[j].shadow.x);
                }
            }
        }
        
        // calculate and multiply ambient
    
        // these ambient calculations are an approximation based on proximity to walls, ground and objects
        // it gives us a very rough but dynamic AO value
        float ambientmulti = (min(0.5+(height*3.0), 1.0));// if you're on the ground, half of ambient light is removed
        float ambiA = 1.0;float ambiB = 1.0; float ambiC = 0.5;
        ambientmulti *= sqrt((min(ambiC-(courtprox.w*ambiA), ambiB))*(min(ambiC-courtprox.z*ambiA, ambiB))*(min(ambiC-courtprox.y*ambiA, ambiB))*(min(ambiC-courtprox.x*ambiA, ambiB)));
        // and again for each wall
        ambientmulti = robambient.x*ambientmulti;
        
        vec3 position = vec3(uv, height);
        vec3 bgtot = vec3(0.0);
        vec3 fgtot = vec3(0.0);
        vec3 sptot = vec3(0.0);
        for(int j=0;j<numlights;j++){
            lights[j].difference = lights[j].position - position;
            lights[j].dist = length(lights[j].difference);
            lights[j].difference = lights[j].difference/lights[j].dist;
            lights[j].amount.x = max(0.0, dot(lights[j].difference, normal));
            lights[j].amount.x = lights[j].amount.x/(lights[j].dist*lights[j].dist);
            lights[j].amount.y = max(0.0, dot(lights[j].difference, bgnormal));
            lights[j].amount.y = lights[j].amount.y/(lights[j].dist*lights[j].dist);
            lights[j].amount.y *= lights[j].intensity * (1.0-lights[j].shadow.x);
            lights[j].amount.x *= lights[j].intensity * (1.0-lights[j].shadow.y);
            bgtot += lights[j].colour*lights[j].amount.y;
            fgtot += lights[j].colour*lights[j].amount.x;
        }
    
        bgcol*=ambientmulti+bgtot;
        
        if(ZoneRob){
            // calculate and add specular
            vec3 incident = vec3(0.0, 0.0, -1.0);
            vec3 reflection = reflect(incident, normal);
            for(int j=0;j<numlights;j++){
                lights[j].amount.z = pow(max(0.0, dot(lights[j].difference, reflection)),32.0);
                lights[j].amount.z = lights[j].amount.z/(lights[j].dist*lights[j].dist);
                lights[j].amount.z *= lights[j].intensity * (1.0-lights[j].shadow.y);
                sptot += lights[j].colour*lights[j].amount.z;
            }
        
            fgcol *= ambientmulti+fgtot;
            fgcol += sptot; // Add specuialr highlight
        
            // Assign forground or background colour or mix them if on AA border
       
            if(ZoneGround){
                f = smoothstep(radius-pixel, radius, dist);
                col = mix(fgcol,bgcol, f);
            } else {
                col = fgcol;
            }
        } else {
            col = bgcol;
        }
        /*Output to screen
    
        f = smoothstep(0.0, iResolution.x, iMouse.x);
        col = contrast(col, f+1.0);
        if(iMouse.y!=0.0){
            f = smoothstep(0.0, iResolution.y, iMouse.y);
            col = gammaCorrection(col, 0.5 + f*2.0);
        }
        */
        if(outputMode){col = outputColour;}
        fragColor = vec4(col,1.0);
    }

    void main() {
      mainImage(outColor, gl_FragCoord.xy);
    }
  `;

  // setup GLSL program
  const program = createProgramFromSources(gl, [vs, fs]);

  // look up where the vertex data needs to go.
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  // look up uniform locations
  const resolutionLocation = gl.getUniformLocation(program, "iResolution");
  const mouseLocation = gl.getUniformLocation(program, "iMouse");
  const timeLocation = gl.getUniformLocation(program, "iTime");
    const pos0Location = gl.getUniformLocation(program, "pos0");
    const pos1Location = gl.getUniformLocation(program, "pos1");
    const pos2Location = gl.getUniformLocation(program, "pos2");
    const pos3Location = gl.getUniformLocation(program, "pos3");
    const pos4Location = gl.getUniformLocation(program, "pos4");
    const pos5Location = gl.getUniformLocation(program, "pos5");
    const pos6Location = gl.getUniformLocation(program, "pos6");
    const pos7Location = gl.getUniformLocation(program, "pos7");
    const pos8Location = gl.getUniformLocation(program, "pos8");
    const pos9Location = gl.getUniformLocation(program, "pos9");
    const pos10Location = gl.getUniformLocation(program, "pos10");
  // Create a vertex array object (attribute state)
  const vao = gl.createVertexArray();

  // and make it the one we're currently working with
  gl.bindVertexArray(vao);

  // Create a buffer to put three 2d clip space points in
  const positionBuffer = gl.createBuffer();

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // fill it with a 2 triangles that cover clip space
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,  // first triangle
     1, -1,
    -1,  1,
    -1,  1,  // second triangle
     1, -1,
     1,  1,
  ]), gl.STATIC_DRAW);

  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  gl.vertexAttribPointer(
      positionAttributeLocation,
      2,          // 2 components per iteration
      gl.FLOAT,   // the data is 32bit floats
      false,      // don't normalize the data
      0,          // 0 = move forward size * sizeof(type) each iteration to get the next position
      0,          // start at the beginning of the buffer
  );

  const playpauseElem = document.querySelector('.playpause');
  const inputElem = document.querySelector('.divcanvas');
  inputElem.addEventListener('mouseover', requestFrame);
  inputElem.addEventListener('mouseout', cancelFrame);

  let mouseX = 0;
  let mouseY = 0;

  function setMousePosition(e) {
    const rect = inputElem.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = rect.height - (e.clientY - rect.top) - 1;  // bottom is 0 in WebGL
    mouseX = mouseX/pixscale;
    mouseY = mouseY/pixscale;
  }

  inputElem.addEventListener('mousemove', setMousePosition);
  inputElem.addEventListener('touchstart', (e) => {
    e.preventDefault();
    playpauseElem.classList.add('playpausehide');
    requestFrame();
  }, {passive: false});
  inputElem.addEventListener('touchmove', (e) => {
    e.preventDefault();
    setMousePosition(e.touches[0]);
  }, {passive: false});
  inputElem.addEventListener('touchend', (e) => {
    e.preventDefault();
    playpauseElem.classList.remove('playpausehide');
    cancelFrame();
  }, {passive: false});

  let requestId;
  function requestFrame() {
    if (!requestId) {
      requestId = requestAnimationFrame(render);
    }
  }
  function cancelFrame() {
    if (requestId) {
      cancelAnimationFrame(requestId);
      requestId = undefined;
    }
  }

  let then = 0;
  let time = 0;
  function render(now) {
    requestId = undefined;
    now *= 0.001;  // convert to seconds
    const elapsedTime = Math.min(now - then, 0.1);
    time += elapsedTime;
    then = now;
    resizeCanvas();
    updateStatus();
    //webglUtils.resizeCanvasToDisplaySize(gl.canvas, 0.2);
    //canvas.width  = window.innerWidth;
    //canvas.height = window.innerHeight;
    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Bind the attribute/buffer set we want.
    gl.bindVertexArray(vao);

    physics.animate();
    AI.animate();

    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
    gl.uniform2f(mouseLocation, mouseX, mouseY);
    gl.uniform1f(timeLocation, time);

    gl.uniform2f(pos0Location, gameobjects[0].x, gameobjects[0].y);
    gl.uniform3f(pos1Location, gameobjects[1].x, gameobjects[1].y, gameobjects[1].r);
    gl.uniform3f(pos2Location, gameobjects[2].x, gameobjects[2].y, gameobjects[2].r);
    gl.uniform3f(pos3Location, gameobjects[3].x, gameobjects[3].y, gameobjects[3].r);
    gl.uniform3f(pos4Location, gameobjects[4].x, gameobjects[4].y, gameobjects[4].r);
    gl.uniform3f(pos5Location, gameobjects[5].x, gameobjects[5].y, gameobjects[5].r);
    gl.uniform3f(pos6Location, gameobjects[6].x, gameobjects[6].y, gameobjects[6].r);
    gl.uniform3f(pos7Location, gameobjects[7].x, gameobjects[7].y, gameobjects[7].r);
    gl.uniform3f(pos8Location, gameobjects[8].x, gameobjects[8].y, gameobjects[8].r);
    gl.uniform3f(pos9Location, gameobjects[9].x, gameobjects[9].y, gameobjects[9].r);
    gl.uniform3f(pos10Location, gameobjects[10].x, gameobjects[10].y, gameobjects[10].r);

    gl.drawArrays(
        gl.TRIANGLES,
        0,     // offset
        6,     // num vertices to process
    );

    requestFrame();
  }

  requestFrame();
  requestAnimationFrame(cancelFrame);
}





  /**
   * Wrapped logging function.
   * @param {string} msg The message to log.
   */
  function error(msg) {
    if (topWindow.console) {
      if (topWindow.console.error) {
        topWindow.console.error(msg);
      } else if (topWindow.console.log) {
        topWindow.console.log(msg);
      }
    }
  }
  const defaultShaderType = [
    "VERTEX_SHADER",
    "FRAGMENT_SHADER",
  ];
  /**
   * Loads a shader.
   * @param {WebGLRenderingContext} gl The WebGLRenderingContext to use.
   * @param {string} shaderSource The shader source.
   * @param {number} shaderType The type of shader.
   * @param {module:webgl-utils.ErrorCallback} opt_errorCallback callback for errors.
   * @return {WebGLShader} The created shader.
   */
  function loadShader(gl, shaderSource, shaderType, opt_errorCallback) {
    const errFn = opt_errorCallback || error;
    // Create the shader object
    const shader = gl.createShader(shaderType);

    // Load the shader source
    gl.shaderSource(shader, shaderSource);

    // Compile the shader
    gl.compileShader(shader);

    // Check the compile status
    const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
      // Something went wrong during compilation; get the error
      const lastError = gl.getShaderInfoLog(shader);
      errFn(`Error compiling shader: ${lastError}\n${addLineNumbersWithError(shaderSource, lastError)}`);
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }
/**
   * Creates a program, attaches shaders, binds attrib locations, links the
   * program and calls useProgram.
   * @param {WebGLShader[]} shaders The shaders to attach
   * @param {string[]} [opt_attribs] An array of attribs names. Locations will be assigned by index if not passed in
   * @param {number[]} [opt_locations] The locations for the. A parallel array to opt_attribs letting you assign locations.
   * @param {module:webgl-utils.ErrorCallback} opt_errorCallback callback for errors. By default it just prints an error to the console
   *        on error. If you want something else pass an callback. It's passed an error message.
   * @memberOf module:webgl-utils
   */
  function createProgram(
      gl, shaders, opt_attribs, opt_locations, opt_errorCallback) {
    const errFn = opt_errorCallback || error;
    const program = gl.createProgram();
    shaders.forEach(function(shader) {
      gl.attachShader(program, shader);
    });
    if (opt_attribs) {
      opt_attribs.forEach(function(attrib, ndx) {
        gl.bindAttribLocation(
            program,
            opt_locations ? opt_locations[ndx] : ndx,
            attrib);
      });
    }
    gl.linkProgram(program);

    // Check the link status
    const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
        // something went wrong with the link
        const lastError = gl.getProgramInfoLog(program);
        errFn(`Error in program linking: ${lastError}\n${
          shaders.map(shader => {
            const src = addLineNumbersWithError(gl.getShaderSource(shader));
            const type = gl.getShaderParameter(shader, gl.SHADER_TYPE);
            return `${glEnumToString(gl, type)}:\n${src}`;
          }).join('\n')
        }`);

        gl.deleteProgram(program);
        return null;
    }
    return program;
  }
  /**
   * Creates a program from 2 sources.
   *
   * @param {WebGLRenderingContext} gl The WebGLRenderingContext
   *        to use.
   * @param {string[]} shaderSourcess Array of sources for the
   *        shaders. The first is assumed to be the vertex shader,
   *        the second the fragment shader.
   * @param {string[]} [opt_attribs] An array of attribs names. Locations will be assigned by index if not passed in
   * @param {number[]} [opt_locations] The locations for the. A parallel array to opt_attribs letting you assign locations.
   * @param {module:webgl-utils.ErrorCallback} opt_errorCallback callback for errors. By default it just prints an error to the console
   *        on error. If you want something else pass an callback. It's passed an error message.
   * @return {WebGLProgram} The created program.
   * @memberOf module:webgl-utils
   */
  function createProgramFromSources(
      gl, shaderSources, opt_attribs, opt_locations, opt_errorCallback) {
    const shaders = [];
    for (let ii = 0; ii < shaderSources.length; ++ii) {
      shaders.push(loadShader(
          gl, shaderSources[ii], gl[defaultShaderType[ii]], opt_errorCallback));
    }
    return createProgram(gl, shaders, opt_attribs, opt_locations, opt_errorCallback);
  }

main();
