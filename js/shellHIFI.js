var constant = {
    PI:3.1415926,
    ETA:1.5708,
    TAU:6.283184,
    TURN:360 
};

var PI = Math.PI;
var ETA = PI/2;
var TAU = PI*2;
var TURN = 360;

var colours = {
    fieldLines:"#FFFFFF",
    fieldFloor:"#9B9B9B",
    fieldWalls:"#828282",
    focusStars:"#FFEF00",
    teamABackg:"#CFDADC",
    teamAFront:"#33CB55",
    teamBBackg:"#FFFFFF",
    teamBFront:"#E96B15",
    lightningA:"#1111FF",
    lightningB:"#FFFFFF",
    lightAmbie:"#AAAAAA",
    lightCentr:"#EEEEFF",
    lightTeamA:"#00FF24",
    lightTeamB:"#FF0B00"
};

var physics = {
    hook: 0.85,
    amount: 11,
    damp: 0.98,
    stopv: 0.01,
    cdist: 3,
    maxvel: 0.13,
    agil: 3,
    poss: false,
    possby: 5,
    xv: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    yv: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    zv: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    v: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    xp: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    yp: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    mass: [1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    radii: [0.2, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
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
        var dx = controls.objects[B].position.x - controls.objects[A].position.x;
        var dy = controls.objects[B].position.y - controls.objects[A].position.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.radii[A] + this.radii[B]) {
            var angle = Math.atan2(dy, dx);
            cosa = Math.cos(angle);
            sina = Math.sin(angle);
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
            controls.objects[A].position.x -= cosd;
            controls.objects[A].position.y -= sind;
            controls.objects[B].position.x += cosd;
            controls.objects[B].position.y += sind;
            synth.playSound(4+Math.random()*13);
        }
    },
    score: function() {
        controls.objects[0].position.x = 0;
        controls.objects[0].position.y = 0;
        this.xv[0] = 0;
        this.yv[0] = 0;
        this.poss = false;
        this.possby = 0;
    },
    animate: function() {

        for (var i = 0; i < this.amount; i++) {

            if (controls.objects[i] == controls.selection) {
                this.xv[i] = 0; //controls.objects[i].position.x-this.xp[i];
                this.yv[i] = 0; //controls.objects[i].position.y-this.yp[i];
            } else {
                if (this.poss && i === 0) {
                    controls.objects[i].position.x = (controls.objects[this.possby].position.x + (this.hook * Math.cos(controls.objects[this.possby].rotation.y - ETA)));
                    controls.objects[i].position.y = (controls.objects[this.possby].position.y + (this.hook * Math.sin(controls.objects[this.possby].rotation.y - 1.5708)));
                }
                controls.objects[i].position.x += this.xv[i];
                controls.objects[i].position.y += this.yv[i];
                this.xv[i] *= this.damp;
                this.yv[i] *= this.damp;
                if (controls.objects[i].position.x > this.riglim[i]) {

                    controls.objects[i].position.x = this.riglim[i];
                    this.xv[i] = -this.xv[i];

                    if (i === 0) {
                        if (controls.objects[i].position.y < this.goalTop && controls.objects[i].position.y > this.goalBottom) {
                            this.score();
                        }
                    }
                    if(i==0){
                    	//synth.stopOsc(0);
                    	//synth.startOsc(0, 4);
                	}
                }
                if (controls.objects[i].position.x < this.leflim[i]) {
                    controls.objects[i].position.x = this.leflim[i];
                    this.xv[i] = -this.xv[i];
                    if (i === 0) {
                        if (controls.objects[i].position.y < this.goalTop && controls.objects[i].position.y > this.goalBottom) {
                            this.score();
                        }
                    }
                    if(i==0){
                    	//synth.stopOsc(0);
                    	//synth.startOsc(0, 3);
                	}
                   // synth.playSound(13);
                }
                if (controls.objects[i].position.y > this.toplim[i]) {
                    controls.objects[i].position.y = this.toplim[i];
                    this.yv[i] = -this.yv[i];
                    //if(i==0){synth.playSound((controls.objects[i].position.x+20)*10)};
                   // synth.playSound(13);
                    if(i==0){
                    	//synth.stopOsc(0);
                    	//synth.startOsc(0, 1);
                	}
                }
                if (controls.objects[i].position.y < this.botlim[i]) {
                    controls.objects[i].position.y = this.botlim[i];
                    this.yv[i] = -this.yv[i];
                    //synth.playSound(controls.objects[i].position.x-this.leflim[i]);
                   // synth.playSound(13);
                     //if(i==0){
                     //synth.stopOsc(0);

                    //synth.startOsc(0, 4+Math.random()*15);
                	//}
                	if(i==0){
                    	//synth.stopOsc(0);
                    	//synth.startOsc(0, 2);
                	}
                }

                if ((Math.abs(this.xv[i]) + Math.abs(this.yv[i])) < this.stopv) {
                    this.xv[i] = 0;
                    this.yv[i] = 0;
                }
            }
            this.xp[i] = controls.objects[i].position.x;
            this.yp[i] = controls.objects[i].position.y;
            for (var j = i + 1; j < this.amount; j++) {
                this.checkColl(i, j);
            }
            if (i > 0) {
                this.ballxd[i] = controls.objects[0].position.x - controls.objects[i].position.x;
                this.ballyd[i] = controls.objects[0].position.y - controls.objects[i].position.y;
                this.balld[i] = Math.sqrt((Math.abs(this.ballxd[i]) * Math.abs(this.ballxd[i])) + (Math.abs(this.ballyd[i]) * Math.abs(this.ballyd[i])));

                this.targetxd[i] = this.targetx[i] - controls.objects[i].position.x;
                this.targetyd[i] = this.targety[i] - controls.objects[i].position.y;
                this.targeta[i] = Math.atan2(this.targetyd[i], this.targetxd[i]);
                //if(i==1){console.log("start", controls.objects[i].rotation.y);}
                controls.objects[i].rotation.y = controls.objects[i].rotation.y % 6.283184;
                //if(i==1){console.log("corrected", controls.objects[i].rotation.y);}
                //if(i==1){console.log("targeta", this.targeta[i])}
                this.targetd[i] = Math.sqrt((Math.abs(this.targetxd[i]) * Math.abs(this.targetxd[i])) + (Math.abs(this.targetyd[i]) * Math.abs(this.targetyd[i])));

                if (this.targetd[i] > this.cdist) {
                    this.v[i] = this.maxvel;
                } else if (i == this.nearestA && this.possby != i) {
                    this.v[i] = this.maxvel;
                } else if (i == this.nearestB && this.possby != i) {
                    this.v[i] = this.maxvel;
                } else if (this.possby == i) {
                    this.v[i] = this.maxvel;
                } else {
                    this.v[i] = this.maxvel * (this.targetd[i] / this.cdist);
                }

                //this.v[i] = this.maxvel;
                var wx = this.v[i] * Math.cos(this.targeta[i]);
                var wy = this.v[i] * Math.sin(this.targeta[i]);
                var netrotation = (controls.objects[i].rotation.y - 1.5708);
                //if(i==1){console.log("netrotation", netrotation);}
                this.anglediff[i] = this.targeta[i] - netrotation;
                //if(i==1){console.log("anglediff", this.anglediff[i]);}
                if (this.anglediff[i] > 3.1415927) {
                    this.anglediff[i] -= 6.24318;
                }
                if (this.anglediff[i] < -3.1415927) {
                    this.anglediff[i] += 6.24318;
                }


                if (Math.abs(this.anglediff[i]) < 0.5) {
                    this.yv[i] += (wy - this.yv[i]) / this.agil;
                    this.xv[i] += (wx - this.xv[i]) / this.agil;
                }

                this.angleinc[i] = (this.anglediff[i]) / 10;

                if (this.targetd[i] < 1) {
                    //console.log(i);
                    this.targetxd[i] = controls.objects[0].position.x - controls.objects[i].position.x;
                    this.targetyd[i] = controls.objects[0].position.y - controls.objects[i].position.y;
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
                //if(i==1){console.log("angleinc", this.angleinc[i]);}
                //this.angleinc[i] = this.angleinc[i] % 3.1415927;
                controls.objects[i].rotation.y += this.angleinc[i];
                //if(i==1){console.log("final", controls.objects[i].rotation.y);}
                //if(i==1){console.log("----");}
                //if(this.angleinc[i]<this.targetamin){
                //this.targetamin = this.angleinc[i];
                //}
                //if(this.angleinc[i]>this.targetamax){
                //this.targetamax = this.angleinc[i];
                //}
                if (this.possby == i && this.targetd[i] < 1) {
                    this.poss = false;
                    this.possby = 0;
                    this.yv[0] = this.yv[i] + 0.4 * Math.sin(controls.objects[i].rotation.y - 1.5708);
                    this.xv[0] = this.xv[i] + 0.4 * Math.cos(controls.objects[i].rotation.y - 1.5708);
                    controls.objects[0].position.x += this.xv[0];
                    controls.objects[0].position.y += this.yv[0];
                }

                if (!this.poss) {
                    var xd = ball.mesh.position.x - (controls.objects[i].position.x + (this.hook * Math.cos(controls.objects[i].rotation.y - 1.5708)));
                    var yd = ball.mesh.position.y - (controls.objects[i].position.y + (this.hook * Math.sin(controls.objects[i].rotation.y - 1.5708)));
                    if (Math.sqrt((Math.abs(xd) * Math.abs(xd) + (Math.abs(yd) * Math.abs(yd)))) < 0.2) {
                        this.poss = true;
                        this.possby = i;
                       synth .stopOsc(0);

                    	synth.startOsc(0, 4+i);
                    }
                }



            } else {

                if (this.poss) {
                    var xd2 = ball.mesh.position.x - (controls.objects[this.possby].position.x + (this.hook * Math.cos(controls.objects[this.possby].rotation.y - 1.5708)));
                    var yd2 = ball.mesh.position.y - (controls.objects[this.possby].position.y + (this.hook * Math.sin(controls.objects[this.possby].rotation.y - 1.5708)));
                    if (Math.sqrt((Math.abs(xd2) * Math.abs(xd2) + (Math.abs(yd2) * Math.abs(yd2)))) > 0.3) {
                        this.yv[0] = this.yv[this.possby];
                        this.xv[0] = this.xv[this.possby];
                        this.poss = false;
                        this.possby = 0;

                    }
                }

            }
            //if(i==0){synth.changeOsc(i, 0.05+0.2*(Math.sqrt((this.xv[0]*this.xv[0]) + (this.yv[0]*this.yv[0]))));}
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

var AI = {
    human: 5,
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
            physics.targetx[i] = this.getx(this.positionx[i]);
            physics.targety[i] = this.gety(this.positiony[i]);
        }

        // nearest red and green droids to ball targets ball
        //if(physics.nearestA!=this.human){
        physics.targetx[physics.nearestA] = controls.objects[0].position.x;
        physics.targety[physics.nearestA] = controls.objects[0].position.y;
        //}
        physics.targetx[physics.nearestB] = controls.objects[0].position.x;
        physics.targety[physics.nearestB] = controls.objects[0].position.y;

        // if ball is in possession, give possessing droid new target
        if (physics.poss) {
            //if(physics.possby==this.human){

            //} else 
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
        var ballx = controls.objects[0].position.x;
        ballx += 9.6;
        if (num < 1) {
            return ((ballx * num) - 9.6);
        } else {
            return ((ballx + ((19.2 - ballx) * (num - 1))) - 9.6);
        }
    },

    gety: function(num) {
        var bally = controls.objects[0].position.y;
        bally += 5.4;
        if (num < 1) {
            return ((bally * num) - 5.4);
        } else {
            return ((bally + ((10.8 - bally) * (num - 1))) - 5.4);
        }
    }
};

var viewport = {
    superGFX: true, //HIFI version with antialias and shadows.
    shadows: true,
    container: null,
    renderer: null,
    scene: null,
    camera: null,
    init: function() {
        this.shadows = this.superGFX;
        log.out("init viewport");
        this.container = document.createElement('div');
        document.body.appendChild(this.container);
        this.container.style.position = "absolute";
        this.container.style.zIndex = "-1";
        this.renderer = new THREE.WebGLRenderer({
            antialias: this.superGFX
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        if (this.shadows) {
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.BasicShadowMap; //PCFShadowMap;
        }
        this.container.appendChild(this.renderer.domElement);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
        this.scene.add(this.camera);
        this.camera.position.set(0, 0, 32);
        this.camera.lookAt(this.scene.position);

    },
    animate: function() {
        log.startActiveTime();
        requestAnimationFrame(viewport.animate);
        //lightning.animate();
        lights.light4.position.set(ball.mesh.position.x, ball.mesh.position.y, 0.5);
        physics.animate();
        AI.animate();
        //stars.animate();
        viewport.renderer.render(viewport.scene, viewport.camera);
        log.startInactiveTime();

    }
};

var stars = {
    starCount: 12,
    starAngle: null,
    ringRadius: 0.7,
    starInner: 0.05,
    starOuter: 0.1,
    starPoints: 5,
    angle: null,
    geometry: null,
    group: null,
    shape: null,
    material: null,
    stars: [],
    init: function() {

        this.starAngle = 6.283184 / this.starCount;
        this.angle = 6.283184 / (this.starPoints * 2);
        this.shape = new THREE.Shape();

        this.shape.moveTo(this.ringRadius + (Math.cos(this.angle * 0) * this.starOuter), Math.sin(this.angle * 0) * this.starOuter);

        for (var i = 1; i <= this.starPoints; i++) {
            this.shape.lineTo(this.ringRadius + (Math.cos(this.angle * ((i * 2) - 1)) * this.starInner), Math.sin(this.angle * ((i * 2) - 1)) * this.starInner);
            this.shape.lineTo(this.ringRadius + (Math.cos(this.angle * (i * 2)) * this.starOuter), Math.sin(this.angle * (i * 2)) * this.starOuter);
        }

        this.geometry = new THREE.ShapeGeometry(this.shape);
        this.material = new THREE.MeshBasicMaterial({
            color: colours.focusStars,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.5
        });

        this.group = new THREE.Group();

        for (i = 0; i < this.starCount; i++) {
            this.stars[i] = new THREE.Mesh(this.geometry, this.material);
            this.group.add(this.stars[i]);
            this.stars[i].rotation.z = i * this.starAngle;
            //console.log(i * this.starAngle);
        }

        this.group.position.z = 0.1;
        viewport.scene.add(this.group);
    },

    animate: function() {
        this.group.position.y = controls.objects[AI.human].position.y;
        this.group.position.x = controls.objects[AI.human].position.x;
        this.group.rotation.z += 0.05;
    }
};

var controls = {
    mx: null,
    my: null,
    orbitcontrols: null,
    raycaster: null,
    plane: null,
    offset: null,
    selection: null,
    objects: null,
    init: function() {
        log.out("init controls");
        this.offset = new THREE.Vector3();
        this.objects = [];
        this.orbitcontrols = new THREE.OrbitControls(viewport.camera, viewport.container);
        this.plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(500, 500, 8, 8), new THREE.MeshBasicMaterial({
            visible: false
        }));
        viewport.scene.add(this.plane);
        this.raycaster = new THREE.Raycaster();
    },
    onDocumentMouseDown: function(event) {

        log.out("controls md");
        var mouseX = (event.clientX / window.innerWidth) * 2 - 1; // Get mouse position
        var mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        var vector = new THREE.Vector3(mouseX, mouseY, 1); // Get 3D vector from 3D mouse position using 'unproject' function
        vector.unproject(viewport.camera);
        controls.raycaster.set(viewport.camera.position, vector.sub(viewport.camera.position).normalize()); // Set the raycaster position
        // Find all intersected objects
        var intersectsA = controls.raycaster.intersectObjects(controls.objects);
        if (intersectsA.length > 0) {
            // Disable the controls
            controls.orbitcontrols.enabled = false;
            // Set the selection - first intersected object
            controls.selection = intersects[0].object;
            // Calculate the offset
            var intersectsB = controls.raycaster.intersectObject(controls.plane, true);
            controls.offset.copy(intersectsB[0].point).sub(controls.plane.position);
        }
    },
    onDocumentMouseMove: function(event) {
        //log.out("controls mm");
        event.preventDefault();
        // Get mouse position
        var mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        var mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        // Get 3D vector from 3D mouse position using 'unproject' function
        var vector = new THREE.Vector3(mouseX, mouseY, 1);
        vector.unproject(viewport.camera);
        controls.mx = vector.x;
        controls.my = vector.y;
        //console.log(controls.mx, controls.my);
        // Set the raycaster position
        controls.raycaster.set(viewport.camera.position, vector.sub(viewport.camera.position).normalize());

        if (controls.selection) {
            // Check the position where the plane is intersected
            var intersectsC = controls.raycaster.intersectObject(controls.plane);
            // Reposition the object based on the intersection point with the plane
            var oldZ = controls.selection.position.z;
            controls.selection.position.copy(intersectsC[0].point.sub(controls.offset));
            controls.selection.position.z = oldZ;
        } else {
            // Update position of the plane if need
            var intersectsD = controls.raycaster.intersectObjects(controls.objects);
            if (intersectsD.length > 0) {
                controls.plane.position.copy(intersectsD[0].object.position);
                controls.plane.lookAt(viewport.camera.position);
            }
        }
        viewport.renderer.render(viewport.scene, viewport.camera);

    },
    onDocumentMouseUp: function(event) {
        log.out("controls mu");
        // Enable the controls
        controls.orbitcontrols.enabled = true;
        controls.selection = null;
    }
};

var resizer = {
    tanFOV: null,
    windowHeight: null,
    init: function() {
        log.out("init resizer");
        
        this.tanFOV = Math.tan((PI / TURN) * viewport.camera.fov);
        this.windowHeight = window.innerHeight;
    },
    onWindowResize: function(event) {
        viewport.camera.aspect = window.innerWidth / window.innerHeight;
        viewport.camera.fov = (TURN / PI) * Math.atan(resizer.tanFOV * (window.innerHeight / resizer.windowHeight));
        viewport.camera.updateProjectionMatrix();
        viewport.camera.lookAt(viewport.scene.position);
        viewport.renderer.setSize(window.innerWidth, window.innerHeight);
        viewport.renderer.render(viewport.scene, viewport.camera);
    }
};

var events = {
    init: function() {
        log.out("init events");
        window.addEventListener('resize', resizer.onWindowResize, false);
        document.addEventListener('mousedown', controls.onDocumentMouseDown, false);
        document.addEventListener('mousemove', controls.onDocumentMouseMove, false);
        document.addEventListener('mouseup', controls.onDocumentMouseUp, false);
    }
};

var overlay = {
    tHeader: null,
    tText: null,
    init: function() {
        log.out("init overlay");
        // Set up the top header
        this.tHeader = document.createElement('div');
        this.tHeader.style.position = "absolute";
        this.tHeader.style.zIndex = "1";
        document.body.appendChild(this.tHeader);
        this.tText = document.createTextNode("Hello World");
        //this.tHeader.appendChild(this.tText);
        //this.tHeader.style.color = "white";
    }
};

var lights = {
    extralights: false,
    light1: null,
    light2: null,
    light3: null,
    light4: null,
    light5: null,
    light6: null,
    light7: null,
    light8: null,
    ambientLight: null,
    init: function() {
        //this.extralights = viewport.superGFX;
        log.out("init lights");
        this.ambientLight = new THREE.AmbientLight(colours.lightAmbie, 0.6);

        this.light1 = new THREE.PointLight(colours.lightTeamB, 2, 20, 2);
        this.light1.position.set(13, 0, 2);


        this.light2 = new THREE.PointLight(colours.lightTeamA, 2, 20, 2);
        this.light2.position.set(-13, 0, 2);

        //this.light2 = new THREE.RectAreaLight( 0xFFFFFF, 2,  2, 3 );
        //this.light2.position.set( -7, 0, 1 );
        //this.light2.lookAt( 0, 0, 1 );
        //scene.add( this.light2 )

        //rectLightHelper = new THREE.RectAreaLightHelper( this.light2 );




        this.light3 = new THREE.PointLight(colours.lightCentr, 0.5, 100, 1);
        this.light3.position.set(0, 0, 5);



        this.light4 = new THREE.PointLight(0x3333ff, 2, 30, 2);
        this.light4.position.set(2, 2, 0);


        if (this.extralights) {
            this.light5 = new THREE.PointLight(0x3333ff, 0.5, 30, 2);
            this.light5.position.set(2, 2, 0);

            this.light6 = new THREE.PointLight(0x0000ff, 0.5, 40, 2);
            this.light6.position.set(0, 5, 3.1);



            this.light7 = new THREE.PointLight(0xffff00, 0.5, 40, 2);
            this.light7.position.set(0, -5, 3.1);

            this.light8 = new THREE.PointLight(0x9999ff, 0.5, 30, 2);
            this.light8.position.set(2, 2, 0);
        }

        if (viewport.shadows) {
            this.light1.castShadow = true;
            this.light2.castShadow = true;
            this.light3.castShadow = true;
            this.light4.castShadow = true;
            if (this.extralights) {
                this.light5.castShadow = true;
                this.light6.castShadow = true;
                this.light7.castShadow = true;
                this.light8.castShadow = true;
            }
        }
        //this.light1.shadow.mapSize.width = 2048;
        //this.light1.shadow.mapSize.height = 2048;
        //this.light1.shadow.camera.near = 1;
        //this.light1.shadow.camera.far = 500;
        //this.light2.shadow.mapSize.width = 2048;
        //this.light2.shadow.mapSize.height = 2048;
        //this.light2.shadow.camera.near = 1;
        //this.light2.shadow.camera.far = 500;
        //this.light3.shadow.mapSize.width = 4096;
        //this.light3.shadow.mapSize.height = 4096;
        //this.light3.shadow.camera.near = 1;
        //this.light3.shadow.camera.far = 500;
        //this.light4.shadow.mapSize.width = 4096;
        //this.light4.shadow.mapSize.height = 4096;
        //this.light4.shadow.camera.near = 1;
        //this.light4.shadow.camera.far = 500;
        //this.light5.shadow.mapSize.width = 4096;
        //this.light5.shadow.mapSize.height = 4096;
        //this.light5.shadow.camera.near = 1;
        //this.light5.shadow.camera.far = 500;

        viewport.scene.add(this.ambientLight);
        viewport.scene.add(this.light1);
        viewport.scene.add(this.light2);
        //viewport.scene.add( rectLightHelper );
        viewport.scene.add(this.light3);
        viewport.scene.add(this.light4);
        if (this.extralights) {
            viewport.scene.add(this.light5);
            viewport.scene.add(this.light6);
            viewport.scene.add(this.light7);
            viewport.scene.add(this.light8);
        }
    }
};

var field = {
    fieldSkin: null,
    fieldSkinTexture: null,
    fieldMap: null,
    fieldMapTexture: null,
    ctx: null,
    init: function() {
        log.out("init field");
        fieldSkin = document.createElement('canvas');
        fieldSkin.width = 1024;
        fieldSkin.height = 512;
        ctx = fieldSkin.getContext('2d');
        ctx.fillStyle = colours.fieldLines;
        ctx.fillRect(0, 0, fieldSkin.width, fieldSkin.height);
        ctx.fillStyle = colours.fieldFloor;
        ctx.fillRect(5, 5, (fieldSkin.width / 2) - 8, fieldSkin.height - 10);
        ctx.fillRect((fieldSkin.width / 2) + 3, 5, (fieldSkin.width / 2) - 8, fieldSkin.height - 10);

        fieldMap = document.createElement('canvas');
        fieldMap.width = 1024;
        fieldMap.height = 512;
        ctx = fieldMap.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, fieldMap.width, fieldMap.height);
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(0, fieldMap.height * 0.125);
        ctx.lineTo(fieldMap.width, fieldMap.height * 0.125);
        ctx.moveTo(0, fieldMap.height * 0.625);
        ctx.lineTo(fieldMap.width, fieldMap.height * 0.625);
        ctx.moveTo(0, fieldMap.height * 0.375);
        ctx.lineTo(fieldMap.width, fieldMap.height * 0.375);
        ctx.moveTo(0, fieldMap.height / 2);
        ctx.lineTo(fieldMap.width, fieldMap.height / 2);
        ctx.moveTo(0, fieldMap.height / 4);
        ctx.lineTo(fieldMap.width, fieldMap.height / 4);
        ctx.moveTo(0, fieldMap.height * 0.75);
        ctx.lineTo(fieldMap.width, fieldMap.height * 0.75);
        ctx.moveTo(0, fieldMap.height * 0.865);
        ctx.lineTo(fieldMap.width, fieldMap.height * 0.865);
        ctx.stroke();
        fieldSkinTexture = new THREE.Texture(fieldSkin);
        fieldMapTexture = new THREE.Texture(fieldMap);
        fieldGeometry = new THREE.PlaneBufferGeometry(19.2, 10.8, 64, 64);
        fieldMaterial = new THREE.MeshPhongMaterial({
            map: fieldSkinTexture,
            side: THREE.DoubleSide
        });
        fieldMaterial.bumpMap = fieldMapTexture;
        fieldMaterial.bumpScale = 0.01;

        fieldMesh = new THREE.Mesh(fieldGeometry, fieldMaterial);
        fieldMesh.receiveShadow = true;
        fieldSkinTexture.needsUpdate = true;
        fieldMapTexture.needsUpdate = true;

        viewport.scene.add(fieldMesh);

        borderMtrlBack = new THREE.MeshPhongMaterial({
            color: colours.fieldWalls
        });
        borderGeomBack = new THREE.PlaneBufferGeometry(19.2, 3, 64, 8);
        borderMeshBack = new THREE.Mesh(borderGeomBack, borderMtrlBack);
        borderMeshBack.position.set(0, 5.4, 1.5);
        borderMeshBack.rotation.x = 1.5708;
        borderMeshBack.receiveShadow = true;
        viewport.scene.add(borderMeshBack);

        borderMtrlFront = new THREE.MeshPhongMaterial({
            color: 0x444444
        });
        borderGeomFront = new THREE.PlaneBufferGeometry(19.2, 3, 64, 8);
        borderMeshFront = new THREE.Mesh(borderGeomFront, borderMtrlFront);
        borderMeshFront.position.set(0, -5.4, 1.5);
        borderMeshFront.rotation.x = -1.5708;
        borderMeshFront.receiveShadow = true;
        viewport.scene.add(borderMeshFront);

        borderMtrlLeft = new THREE.MeshBasicMaterial({
            color: 0x33cc33
        });
        borderGeomLeft = new THREE.PlaneBufferGeometry(5.4, 2, 64, 8);
        borderMeshLeft = new THREE.Mesh(borderGeomLeft, borderMtrlLeft);
        borderMeshLeft.position.set(-9.65, 0, 1);
        borderMeshLeft.rotation.x = -1.5708;
        borderMeshLeft.rotation.y = 1.5708;
        viewport.scene.add(borderMeshLeft);

        borderMtrlRight = new THREE.MeshBasicMaterial({
            color: 0xcc3333
        });
        borderGeomRight = new THREE.PlaneBufferGeometry(5.4, 2, 64, 8);
        borderMeshRight = new THREE.Mesh(borderGeomRight, borderMtrlRight);
        borderMeshRight.position.set(9.65, 0, 1);
        borderMeshRight.rotation.x = 1.5708;
        borderMeshRight.rotation.y = -1.5708;
        viewport.scene.add(borderMeshRight);

        goalShapeLeft = new THREE.Shape();
        goalShapeLeft.moveTo(-5.4, -1.5);
        goalShapeLeft.lineTo(5.4, -1.5);
        goalShapeLeft.lineTo(5.4, 1.5);
        goalShapeLeft.lineTo(1.5, 1.5);
        goalShapeLeft.lineTo(1.5, 0);
        goalShapeLeft.lineTo(-1.5, 0);
        goalShapeLeft.lineTo(-1.5, 1.5);
        goalShapeLeft.lineTo(-5.4, 1.5);
        goalShapeLeft.lineTo(-5.4, -1.5);
        goalGeomLeft = new THREE.ShapeGeometry(goalShapeLeft);

        goalShapeRight = new THREE.Shape();
        goalShapeRight.moveTo(-5.4, 1.5);
        goalShapeRight.lineTo(5.4, 1.5);
        goalShapeRight.lineTo(5.4, -1.5);
        goalShapeRight.lineTo(1.5, -1.5);
        goalShapeRight.lineTo(1.5, 0);
        goalShapeRight.lineTo(-1.5, 0);
        goalShapeRight.lineTo(-1.5, -1.5);
        goalShapeRight.lineTo(-5.4, -1.5);
        goalShapeRight.lineTo(-5.4, 1.5);
        goalGeomRight = new THREE.ShapeGeometry(goalShapeRight);



        goalMtrlLeft = new THREE.MeshPhongMaterial({
            color: 0x444444
        });
        goalMeshLeft = new THREE.Mesh(goalGeomLeft, goalMtrlLeft);
        goalMeshLeft.position.set(-9.6, 0, 1.5);
        goalMeshLeft.rotation.x = -1.5708;
        goalMeshLeft.rotation.y = 1.5708;
        goalMeshLeft.receiveShadow = true;
        goalMeshLeft.castShadow = true;
        viewport.scene.add(goalMeshLeft);

        goalMtrlRight = new THREE.MeshPhongMaterial({
            color: 0x444444
        });
        goalMeshRight = new THREE.Mesh(goalGeomRight, goalMtrlRight);
        goalMeshRight.position.set(9.6, 0, 1.5);
        goalMeshRight.rotation.x = 1.5708;
        goalMeshRight.rotation.y = -1.5708;
        goalMeshRight.receiveShadow = true;
        goalMeshRight.castShadow = true;
        viewport.scene.add(goalMeshRight);


    }
};

var ball = {
    mesh: null,
    geometry: null,
    material: null,
    init: function() {
    	synth.startOsc(0, 11);
        log.out("init ball");
        this.geometry = new THREE.SphereGeometry(0.2, 16, 16);
        this.material = new THREE.MeshBasicMaterial({
            color: 0xffffff
        }); //, transparent:true, opacity:.5});
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        viewport.scene.add(this.mesh);
        this.mesh.position.set(2, 2, 0.15);
        //this.mesh.castShadow = true;
        //this.mesh.receiveShadow = true;
        controls.objects.push(this.mesh);
    }
};

var lightning = {
    amount: 500,
    material: null,
    geometry: null,
    system: null,
    material2: null,
    geometry2: null,
    system2: null,
    ax: null,
    ay: null,
    az: null,
    bx: null,
    by: null,
    bz: null,
    init: function() {
        this.geometry = new THREE.Geometry();
        this.material = new THREE.PointsMaterial({
            color: colours.lightningA,
            size: 0.1,
            blending: THREE.AdditiveBlending,
            transparent: true
        });
        this.geometry2 = new THREE.Geometry();
        this.material2 = new THREE.PointsMaterial({
            color: colours.lightningB,
            size: 0.05
            //,
            //blending: THREE.AdditiveBlending,
            //transparent: true
        });
        for (var p = 0; p < this.amount; p++) {
            var pX = 0,
                pY = 0,
                pZ = 0,
                particle = new THREE.Vector3(pX, pY, pZ);
            particle2 = new THREE.Vector3(pX, pY, pZ);
            this.geometry.vertices.push(particle);
            this.geometry2.vertices.push(particle2);
        }
        this.system = new THREE.Points(this.geometry, this.material);
        this.system.sortParticles = true;
        viewport.scene.add(this.system);
        this.system2 = new THREE.Points(this.geometry2, this.material2);
        this.system2.sortParticles = true;
        viewport.scene.add(this.system2);
    },
    animate: function() {
        if (physics.poss) {
            this.ax = ball.mesh.position.x;
            this.ay = ball.mesh.position.y;
            this.az = ball.mesh.position.z;
            this.bx = controls.objects[physics.possby].position.x;
            this.by = controls.objects[physics.possby].position.y;
            this.bz = controls.objects[physics.possby].position.z;

        } else {
            this.ax = ball.mesh.position.x + 0.22;
            this.ay = ball.mesh.position.y;
            this.az = ball.mesh.position.z;
            this.bx = ball.mesh.position.x - 0.22;
            this.by = ball.mesh.position.y;
            this.bz = ball.mesh.position.z;
        }

        for (var p = 0; p < this.amount; p++) {
            var pX = this.ax + (((this.bx - this.ax) / this.amount) * p); // + (Math.sin(p)*.05);
            pY = this.ay + (((this.by - this.ay) / this.amount) * p); //+ (Math.sin(p)*.05);
            pZ = this.az + (((this.bz - this.az) / this.amount) * p) + (Math.sin(p / 10) * 0.05) + (Math.sin(p) * 0.01) + (Math.sin((p / this.amount) * 3.141) * 0.4);

            this.geometry.vertices[p].x = pX + ((Math.random() * 0.05) - 0.025);
            this.geometry.vertices[p].y = pY + ((Math.random() * 0.05) - 0.025);
            this.geometry.vertices[p].z = pZ + ((Math.random() * 0.05) - 0.025);
            this.geometry2.vertices[p].x = pX;
            this.geometry2.vertices[p].y = pY;
            this.geometry2.vertices[p].z = pZ;

        }
        this.geometry.verticesNeedUpdate = true;
        this.geometry2.verticesNeedUpdate = true;

        //lights.light4.position.set( this.ax, this.ay, .2);
        //lights.light5.position.set( this.bx, this.by, .2);
        //lights.light8.position.set( (this.ax + this.bx)/2, (this.ay + this.by)/2, .5);
    }
};

var car = {
    skin1: null,
    texture1: null,
    material1: null,
    geometry1: null,
    skin2: null,
    texture2: null,
    material2: null,
    geometry2: null,
    skin3: null,
    texture3: null,
    material3: null,
    geometry3: null,
    skin4: null,
    texture4: null,
    material4: null,

    ctx: null,
    meshes: [],
    count: 0,
    init: function() {
        this.skin1 = document.createElement('canvas');
        this.skin1.width = 256;
        this.skin1.height = 256;
        this.ctx = this.skin1.getContext('2d');
        this.ctx.fillStyle = colours.teamABackg;
        this.ctx.fillRect(0, 0, this.skin1.width, this.skin1.height);
        this.ctx.fillStyle = colours.teamAFront;
        this.ctx.fillRect(0, this.skin1.height / 2, this.skin1.width, this.skin1.height / 4);

        this.skin2 = document.createElement('canvas');
        this.skin2.width = 256;
        this.skin2.height = 256;
        this.ctx = this.skin2.getContext('2d');
        this.ctx.fillStyle = colours.teamABackg;
        this.ctx.fillRect(0, 0, this.skin2.width, this.skin2.height);
        this.ctx.fillStyle = colours.teamAFront;
        this.ctx.fillRect(this.skin2.width / 4, 0, this.skin2.width / 8, this.skin2.height);
        this.ctx.fillRect((this.skin2.width / 8) * 5, 0, this.skin2.width / 8, this.skin2.height);

        this.skin3 = document.createElement('canvas');
        this.skin3.width = 256;
        this.skin3.height = 256;
        this.ctx = this.skin3.getContext('2d');
        this.ctx.fillStyle = colours.teamBBackg;
        this.ctx.fillRect(0, 0, this.skin3.width, this.skin3.height);
        this.ctx.fillStyle = colours.teamBFront;
        this.ctx.fillRect(0, this.skin3.height / 2, this.skin3.width, this.skin3.height / 4);

        this.skin4 = document.createElement('canvas');
        this.skin4.width = 256;
        this.skin4.height = 256;
        this.ctx = this.skin4.getContext('2d');
        this.ctx.fillStyle = colours.teamBBackg;
        this.ctx.fillRect(0, 0, this.skin4.width, this.skin4.height);
        this.ctx.fillStyle = colours.teamBFront;
        this.ctx.fillRect(this.skin4.width / 4, 0, this.skin4.width / 8, this.skin4.height);
        this.ctx.fillRect((this.skin4.width / 8) * 5, 0, this.skin4.width / 8, this.skin4.height);

        this.texture1 = new THREE.Texture(this.skin1);
        this.texture1.needsUpdate = true;
        this.texture2 = new THREE.Texture(this.skin2);
        this.texture2.needsUpdate = true;
        this.texture3 = new THREE.Texture(this.skin3);
        this.texture3.needsUpdate = true;
        this.texture4 = new THREE.Texture(this.skin4);
        this.texture4.needsUpdate = true;
        this.texture2.wrapT = this.texture2.wrapS = THREE.RepeatWrapping;
        this.texture4.wrapT = this.texture4.wrapS = THREE.RepeatWrapping;

        this.material1 = new THREE.MeshPhongMaterial({
            map: this.texture1,
            shininess: 90
        });
        this.material2 = new THREE.MeshPhongMaterial({
            map: this.texture2,
            side: THREE.DoubleSide,
            shininess: 90
        });
        this.material3 = new THREE.MeshStandardMaterial({
            map: this.texture3,
            shininess: 90
        });
        this.material4 = new THREE.MeshStandardMaterial({
            map: this.texture4,
            side: THREE.DoubleSide,
            shininess: 90
        });

        this.geometry1 = new THREE.SphereGeometry(0.5, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        var fanShape = new THREE.Shape();
        fanShape.moveTo(0, 0);
        fanShape.lineTo(0.5, 0.7);
        fanShape.bezierCurveTo(0.3, 0.9, -0.3, 0.9, -0.5, 0.7);
        fanShape.lineTo(0, 0);
        this.geometry2 = new THREE.ShapeGeometry(fanShape);



        car.create("A", -2, 0, 1.5708);
        car.create("A", -4, 2, 1.5708);
        car.create("A", -4, -2, 1.5708);
        car.create("A", -6, 2, 1.5708);
        car.create("A", -6, -2, 1.5708);
        car.create("B", 2, 0, -1.5708);
        car.create("B", 4, 2, -1.5708);
        car.create("B", 4, -2, -1.5708);
        car.create("B", 6, 2, -1.5708);
        car.create("B", 6, -2, -1.5708);
    },
    create: function(team, xpos, ypos, rot) {
        var materialBack;
        var materialFront;
        if (team == "A") {
            materialFront = car.material1;
            materialBack = car.material2;
        } else {
            materialFront = car.material3;
            materialBack = car.material4;
        }
        this.meshes[this.count] = new THREE.Mesh(car.geometry1, materialFront);
        viewport.scene.add(this.meshes[this.count]);
        this.meshes[this.count].position.set(xpos, ypos, 0);
        this.meshes[this.count].castShadow = true;
        this.meshes[this.count].receiveShadow = true;
        //this.meshes[this.count].rotation.x = -1.1;
        this.meshes[this.count].rotation.y = rot;
        console.log("rotation", rot, this.meshes[this.count].rotation.y);
        //var geometry = new THREE.CircleGeometry( .5, 32 );
        //var material = new THREE.MeshBasicMaterial( { color: 0xffff00 , wireframe:wf} );
        //var circle = new THREE.Mesh( geometry, materials[this.count] );
        //circle.rotation.x = 1.5708;
        //this.meshes[this.count].add( circle );
        //var material2 = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe:wf } );
        var mesh = new THREE.Mesh(car.geometry2, materialBack);
        mesh.castShadow = true;
        mesh.position.z = 0.2;
        mesh.rotation.x = -1.1;
        this.meshes[this.count].add(mesh);
        controls.objects.push(this.meshes[this.count]);
        this.meshes[this.count].rotation.x = 1.5708;
        //synth.startOsc(this.count+1, this.count+1);
        this.count += 1;
    }
};

var log = {
    counter: 0,
    time: null,
    startTime: null,
    totalActiveTime: 0,
    totalInactiveTime: 0,
    activePercent: 0,
    timeA: null,
    timeB: null,
    startActiveTime: function() {
        this.timeA = Date.now();
        if (this.timeB !== null) {
            this.counter += 1;
            this.totalInactiveTime += this.timeA - this.timeB;
            this.activePercent = (this.totalActiveTime / (this.totalActiveTime + this.totalInactiveTime)) * 100;
            if (this.counter > 120) {
                this.counter = 0;
                this.totalActiveTime = 0;
                this.totalInactiveTime = 0;
                overlay.tText.nodeValue = Math.round(this.activePercent * 10) / 10 + "% used";
            }
        }
    },
    startInactiveTime: function() {
        this.timeB = Date.now();
        this.totalActiveTime += this.timeB - this.timeA;
    },
    init: function() {
        this.time = new Date();
        this.startTime = Date.now();
        log.out("init log");
    },
    out: function(string) {
        //console.log(string + " " + (Date.now() - this.startTime))
    }
};
log.init();
var synth = new Synthesizer();
viewport.init();

controls.init();
resizer.init();
events.init();
overlay.init();
lights.init();
field.init();
ball.init();
//lightning.init();
//stars.init();

car.init();
viewport.animate();