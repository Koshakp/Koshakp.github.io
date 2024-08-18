const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

window.addEventListener('resize', resize);
window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);
canvas.addEventListener('mousedown', mouseDown);
canvas.addEventListener('mousemove', mouseMove);
canvas.addEventListener('mouseup', mouseUp);

let manyImg = (name, amount) => Array(amount).fill('').map((e,i)=>name+i);
let img = {};
let imageLoader = {
    imgsrcs : [...manyImg('door', 3), ...manyImg('room', 3), 'keyhole', 'enemy', 'table', ...manyImg('interference', 3), ...manyImg('ambient', 10)],//images
    rotatedDoorImgSrcs : [...manyImg('door', 3)],
    rotatedAmbientImgSrcs : [...manyImg('ambient', 10)],
    imgadd : function(a){
        for(const i of a){
            img[i] = new Image();
            img[i].onload = this.loading;
            img[i].src = `images/${i}.png`;
        }
    },
    loadProgress : 0,
    rotateDoorProgress : 0,
    loading : function(){
        imageLoader.loadProgress += 1;
        if(imageLoader.loadProgress >= imageLoader.imgsrcs.length){
            imageLoader.rotateimgadd(imageLoader.rotatedDoorImgSrcs, imageLoader.rotatedAmbientImgSrcs);
        }
        else if(performance.now() > 50){
            draws.loading();
        }
    },
    rotateimgadd : function(a, b){
        for(const i of a){
            img[`left${i}`] = spriteRotate(img[i], img[i].height * -0.13, img[i].height * -0.21, false);
            img[`right${i}`] = spriteRotate(img[i], img[i].height * 0.13, img[i].height * 0.21, false);
        }
        for(const i of b){
            img[`left${i}`] = spriteRotate(img[i], 0, img[i].height * -0.11, false);
            img[`right${i}`] = spriteRotate(img[i], 0, img[i].height * 0.11, false);
        }
        start();
        
    },
    init : function(){
        this.imgadd(this.imgsrcs);
    }
}

let run = false;
let time = {
    old : 0,
    delta : 0,
    fps : function(){
        return 1000 / this.delta;
    },
    update : function(){
        if(!this.old){
            this.old = performance.now();
        }
        else{
            const now = performance.now();
            this.delta = now - this.old;
            this.old = now;
            if(this.delta > 2000){
                this.delta = 1;
            }
        }
    }
};

let plx = 0, ply = 0;
let click = false, sclick = false, rclick = false, srclick = false;
let sra, cw, ch;
let bw = false, ba = false, bs = false, bd = false;
let showLog = false, showMap = false;
let testimg;

function mouseDown(e){
    if(e.button == 0){
	    click = true;
    }
    else if(e.button == 2){
        rclick = true;
    }
}
function mouseMove(e){
	plx = e.clientX;
	ply = e.clientY;
}
function mouseUp(e){
	if(e.button == 0){
	    click = false;
    }
    else if(e.button == 2){
        rclick = false;
    }
}
function inArea(tx, ty, x, y, w, h){
    if(tx > x && tx < x + w && ty > y && ty < y + h){
        return true;
    }
    else{
        return false;
    }
}
function spriteRotate(sprite, top, bottom, mirror){
    const srcanvas = document.createElement('canvas');
    const srctx = srcanvas.getContext('2d');
    let zeroY = 0;
    srcanvas.width = sprite.width;
    srcanvas.height = sprite.height;
    if(top < 0){
        srcanvas.height -= top;
        zeroY = -top;
    }
    if(bottom > 0){
        srcanvas.height += bottom;
    }
    if(mirror){
        srctx.translate(srcanvas.width, 0);
        srctx.scale(-1, 1);
    }

    for(let i = 0; i < srcanvas.width; i++){
        srctx.drawImage(sprite, i, 0, 1, sprite.height, i, zeroY + top * (i / (srcanvas.width - 1)), 1, bottom * (i / (srcanvas.width - 1)) - top * (i / (srcanvas.width - 1)) + sprite.height);
    }
    let rotatedSprite = new Image();
    rotatedSprite.src = srcanvas.toDataURL();
    return rotatedSprite;
}
function keyDown(e){
    switch(e.keyCode){
        case 87:
            bw = true;
            break;
        case 65:
            ba = true;
            break;
        case 83:
            bs = true;
            break;
        case 68:
            bd = true;
            break;
    }
}
function keyUp(e){
    switch(e.keyCode){
        case 87:
            bw = false;
            break;
        case 65:
            ba = false;
            break;
        case 83:
            bs = false;
            break;
        case 68:
            bd = false;
            break;
    }
}
function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
	cw = canvas.width;
	ch = canvas.height;
	sra = (cw + ch) / 20;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
}
function stop(){
    run = false;
}
function start(){
    run = true;
    requestAnimationFrame(update);
}


resize();

let game = {
    type : 0,
    winEndMenu : false,
    time : 0,
    endTime : 240000,
    showMinutes : false,
    shows : [false, false],
    clock : ['12', '00'],
    sinusoida : 0,
    timeTrack : 0,
    update : function(){
        this.time += time.delta;

        this.clockUpdate();

        if(this.time >= this.endTime){
            this.win();
        }

        this.showsUpdate();
        this.sinUpdate();
    },
    clockUpdate : function(){
        const hourN = Math.floor(this.time / this.endTime * 6);
        if(hourN == 0){
            this.clock[0] = '12';
        }
        else{
            if(this.showMinutes){
                this.clock[0] = '0' + String(hourN);
            }
            else{
                this.clock[0] = String(hourN);
            }
        }
        if(this.showMinutes){
            const minN = Math.floor(this.time / this.endTime * 360) % 60;
            if(minN < 10){
                this.clock[1] = '0' + String(minN);
            }
            else{
                this.clock[1] = String(minN);
            }
        }
    },
    dead : function(){
        this.type = 2;
        this.showMinutes = true;
        this.clockUpdate();
        this.winEndMenu = false;
    },
    win : function(){
        this.type = 2;
        this.winEndMenu = true;
    },
    restart : function(){
        this.type = 0;
        this.time = 0;
        locate.gpos = locate.startGpos;
        locate.lpos = locate.startLpos;
        enemy.init();
        view.changeProgress = 1;
        view.changeCompleted = true;
        view.roomType = 0;
        view.init();
        view.enemyShow = false;
        view.tab.move = 0;
        view.tab.y = 1;
        view.cam.select = 0;
    },
    sinUpdate : function(){//синусоидальное движение объектов интерфейса
        this.timeTrack += 0.002 * time.delta;
        if(this.timeTrack >= 1){
            this.timeTrack -= 1;
        }
        this.sinusoida = Math.sin(this.timeTrack * Math.PI * 2);
    },
    showsUpdate : function(){//чит панель (логи и карта)
        if(bs){
            stop();
        }
        if(ba && !this.shows[0]){
            showLog = !showLog;
        }
        if(bd && !this.shows[1]){
            showMap = !showMap;
        }
        this.shows = [ba, bd];
    }
};


let menu = {
    night : 1,
    nightMouseUp : 0,
    setpushed : -1,
    customSettingParams : [
        {name : 'enemy normal move delay (ms)', min : 100, max : 20000, def : 6000, ready : function(v){enemy.moveDelay = v; enemy.delay = v + 1000;}},
        {name : 'normal move delay scatter (ms)', min : 0, max : 5000, def : 1000, ready : function(v){enemy.delayScatter[0] = v;}},
        {name : 'enemy rage move delay (ms)', min : 100, max : 10000, def : 1500, ready : function(v){enemy.agrDelay[0] = v;}},
        {name : 'rage move delay scatter (ms)', min : 0, max : 5000, def : 200, ready : function(v){enemy.delayScatter[1] = v;}},
        {name : 'enemy keyhole detect move delay (ms)', min : 100, max : 10000, def : 3000, ready : function(v){enemy.agrDelay[1] = v;}},
        {name : 'night length (sec)', min : 30, max : 720, def : 240, ready : function(v){game.endTime = v * 1000;}},
        {name : 'show minutes', min : 0, max : 1, def : 0, ready : function(v){game.showMinutes = Boolean(v);}},
        {name : 'passive energy decrease (in sec)', min : 0, max : 10, def : 1, ready : function(v){console.log(`energy soon... value : ${v}`);}},
    ],
    settings : [],
    sliderPos : [],
    update : function(){
        this.buttonPlay();
        this.buttonNight();
        this.customSettings();
    },
    endUpdate : function(){
        if(inArea(plx, ply, cw * 0.4, ch * 0.9, cw * 0.2, ch * 0.1) && click && !sclick){
            game.restart();
        }
    },
    customSettings : function(){
        if(this.night == 7){
            for(let i = 0; i < this.customSettingParams.length; i++){
                if((inArea(plx, ply, sra * 8.6, ch * 0.1 + i * sra * 0.5, sra * 2, sra * 0.2) && click && !sclick) || (this.setpushed == i && click)){
                    this.setpushed = i;
                    this.sliderPos[i] = (plx - sra * 8.6) / (sra * 2);
                    if(this.sliderPos[i] < 0){
                        this.sliderPos[i] = 0;
                    }
                    else if(this.sliderPos[i] > 1){
                        this.sliderPos[i] = 1;
                    }
                    this.settings[i] = Math.round(this.sliderPos[i] * (this.customSettingParams[i].max - this.customSettingParams[i].min) + this.customSettingParams[i].min);
                }
            }
            if(click == 0){
                this.setpushed = -1;
            }
        }
    },
    buttonPlay : function(){
        if(inArea(plx, ply, 0, 0, cw / 3, ch / 4) && click && !sclick){
            if(this.night == 7){
                this.setSettings();
            }
            game.type = 1;
        }
    },
    buttonNight : function(){
        if(inArea(plx, ply, sra * 1.275, ch / 2 + sra * 0.2, sra * 2.85, sra)){
            if(plx > sra * 3.075){
                this.nightMouseUp = 7;
                if(click && !sclick){
                    this.night = this.nightMouseUp;
                }
            }
            else{
                const i = Math.floor((plx - sra * 1.275) / (sra * 0.6));
                const j = Math.floor((ply - (ch / 2 + sra * 0.2)) / (sra * 0.5));
                this.nightMouseUp = i + 1 + j * 3;
                if(click && !sclick){
                    this.night = this.nightMouseUp;
                }
            }
        }
        else{
            this.nightMouseUp = 0;
        }
    },
    setSettings : function(){
        for(let i = 0; i < this.settings.length; i++){
            this.customSettingParams[i].ready(this.settings[i]);
        }
    },
    init : function(){
        for(const i of this.customSettingParams){
            this.sliderPos.push((i.def - i.min) / (i.max - i.min));
            this.settings.push(i.def);
        }
    }
};
menu.init();

let locate = {
    startGpos : 14,
    startLpos : 3,
    gpos : 0,
    lpos : 0,
    w : 6,
    firstMapa : [
        1, 1, 1, 1, 1, 0,
        1, 1, 1, 1, 1, 2,
        0, 1, 3, 1, 1, 0,
        0, 1, 1, 1, 1, 0
    ],
    cam : [
        [1, 3],
        [4, 2],
        [7, 1],
        [9, 0],
        [16, 0],
        [19, 0],
        [21, 3]
    ],
    firstAmbient : [
        [1, 3, 3],
        [2, 2, 2],
        [1, 3, 7],
        [13, 0, 0],
        [13, 1, 4],
        [6, 1, 9],
        [15, 5, 2],
        [8, 4, 8],
        [3, 7, 7],
        [3, 2, 6],
        [4, 5, 1],
        [16, 4, 0],
        [16, 0, 5],
        [22, 6, 3],
        [21, 6, 2],
        [21, 1, 4],
        [20, 0, 0],
        [20, 3, 8],
        [19, 1, 2],
        [19, 6, 6],
        [19, 7, 7],
        [7, 6, 2],
        [7, 2, 5],
        [9, 3, 7],
        [9, 7, 7],
        [9, 2, 0],
        [10, 5, 6],
        [4, 1, 3]
    ],
    ambient : [],
    mapa : [],
    go : function(type, n, p){//локал ? (куда, пробой) : (лпос, гпос)
        if(type !== false){
            let lpos = type[0];
            let gpos = type[1];
            lpos += n;
            if(lpos > 3){
                lpos -= 4;
            }
            if(p){
                lpos += 2;
                if(lpos > 3){
                    lpos -= 4;
                }
                gpos = this.sdvig(lpos, gpos);
            }
            this.lpos = lpos;
            this.gpos = gpos;
            return {
                roomSkin : this.mapa[gpos][0],
                room : this.rotor(lpos, gpos),
                gpos : gpos,
                lpos : lpos,
                ambient : this.ambientCheck(gpos, lpos)
            };
        }
        else{
            this.lpos = n;
            this.gpos = p;
            return {
                roomSkin : this.mapa[this.gpos][0],
                room : this.rotor(this.lpos, this.gpos),
                gpos : this.gpos,
                lpos : this.lpos,
                ambient : this.ambientCheck(this.gpos, this.lpos)
            };
        }
    },
    peek : function(type, n, p){
        if(type !== false){
            let lpos = type[0];
            let gpos = type[1];
            lpos += n;
            if(lpos > 3){
                lpos -= 4;
            }
            if(p){
                lpos += 2;
                if(lpos > 3){
                    lpos -= 4;
                }
                gpos = this.sdvig(lpos, gpos);
            }
            return {
                roomSkin : this.mapa[gpos][0],
                room : this.rotor(lpos, gpos),
                gpos : gpos,
                lpos : lpos,
                ambient : this.ambientCheck(gpos, lpos)
            };
        }
        else{
            return {
                roomSkin : this.mapa[p][0],
                room : this.rotor(n, p),
                gpos : p,
                lpos : n,
                ambient : this.ambientCheck(p, n)
            };
        }
    },
    rotor : function(pos, g){
        let outg = [];
        for(let i = 0; i <= 3; i++){
            let j = i + pos;
            if(j > 3){
                j -= 4;
            }
            outg.push(this.mapa[g][j + 1]);
        }
        return outg;
    },
    prov : function(gpos){
        let g = [];
        if(gpos % this.w != 0){
            g.push(this.firstMapa[gpos - 1]);
        }
        else{
            g.push(0);
        }
        if(Math.floor(gpos / this.w) > 0){
            g.push(this.firstMapa[gpos - this.w]);
        }
        else{
            g.push(0);
        }
        if((gpos + 1) % this.w != 0){
            g.push(this.firstMapa[gpos + 1]);
        }
        else{
            g.push(0);
        }
        if(gpos < this.firstMapa.length - this.w){
            g.push(this.firstMapa[gpos + this.w]);
        }
        else{
            g.push(0);
        }
        return g;
    },
    sdvig : function(l, gpos){
        let g = gpos;
        if(l == 0){
            g += 1;
        }
        else if(l == 1){
            g += this.w;
        }
        else if(l == 2){
            g -= 1;
        }
        else{
            g -= this.w;
        }
        return g;
    },
    addWall : function(a, b){//а комната, b - true/false = стена вправо/вниз
        if(b){
            this.mapa[a][3] = 0;
            this.mapa[a + 1][1] = 0;
        }
        else{
            this.mapa[a][4] = 0;
            this.mapa[a + this.w][2] = 0;
        }
    },
    lposToCords : function(l){
        let a = [0, 0];
        if(l % 2 == 0){
            a[0] = l - 1;
        }
        else{
            a[1] = l - 2;
        }
        return a;
    },
    ambientCheck : function(g, l){
        let out = Array(8).fill(null);
        for(let i = 0; i < this.ambient[g].length; i++){
            let j = this.ambient[g][i].pos - l * 2;
            if(j < 0){
                j += 8;
            }
            out[j] = this.ambient[g][i].type;
        }
        return out;
    },
    init : function(){
        this.gpos = this.startGpos;
        this.lpos = this.startLpos;
        for(let i = 0; i < this.firstMapa.length; i++){
            if(this.firstMapa[i] == 0){
                this.mapa.push([0]);
            }
            else if(this.firstMapa[i] == 1){
                this.mapa.push([1, ...this.prov(i)]);
            }
            else if(this.firstMapa[i] == 2){
                const dver = this.prov(i).map((e) => {
                    if(e){
                        return 2;
                    }
                    else{
                        return 0;
                    }
                });
                this.mapa.push([2, ...dver]);
            }
            else if(this.firstMapa[i] == 3){
                const dver = this.prov(i).map((e) => {
                    if(e){
                        return 3;
                    }
                    else{
                        return 0;
                    }
                });
                this.mapa.push([3, ...dver]);
            }
        }
        this.addWall(0, false);
        this.addWall(1, false);
        this.addWall(8, true);
        this.addWall(8, false);
        this.addWall(9, true);
        this.addWall(14, false);
        this.addWall(15, true);
        this.mapa[14][4] = 4;

        this.ambient = Array(this.mapa.length).fill(Array(0));
        for(const i of this.firstAmbient){
            const putobj = {pos : i[1], type : i[2]};
            if(this.ambient[i[0]].length == 0){
                this.ambient[i[0]] = [putobj];
            }
            else{
                this.ambient[i[0]].push(putobj);
            }
        }
    }
};
locate.init();

let enemy = {
    startGpos : 11,
    startLpos : 0,
    gpos : 0,
    lpos : 0,
    delay : 7000,
    agr : false,
    moveDelay : 6000,
    agrDelay : [1500, 3000],
    delayScatter : [1000, 200],//normal, agr
    agrSpad : 0,
    spos : 0,
    sgpos : 0,
    target : -1,
    chansesWidth : [1, 8, 32],//вернуться, подойти к двери, пройти через дверь
    update : function(){
        if(this.lpos == locate.lpos && this.gpos == locate.gpos){
            game.dead();
        }
        else if(this.gpos == locate.gpos || (this.gpos == view.gpos && this.lpos == view.lpos)){
            if(this.gpos == locate.gpos){
                if(this.agr == false){
                    this.delay = this.agrDelay[0] + Math.round((Math.random() * 2 - 1) * this.delayScatter[1]);
                }
                this.target = locate.lpos;
                this.agrSpad = 4;
            }
            else{
                if(this.agr == false){
                    this.delay = this.agrDelay[1];
                }
                this.target = this.lpos;
                this.agrSpad = 3;
            }
            this.agr = true;
        }
        if(this.delay > 0){
            this.delay -= time.delta;
        }
        else{
            this.move();
            this.interferenceCheck();
            if(this.agr){
                this.delay += this.agrDelay[0] + Math.round((Math.random() * 2 - 1) * this.delayScatter[1]);
                this.agrSpad--;
                if(this.agrSpad <= 0){
                    this.agr = false;
                }
            }
            else{
                this.delay += this.moveDelay + Math.round((Math.random() * 2 - 1) * this.delayScatter[0]);
            }
        }
    },
    move : function(){
        if(this.target == -1){
            const loc = locate.peek(false, 0, this.gpos).room;
            let chanse = loc.map((e, i) =>{
                if(e == 0 || e == 4){
                    return 0;
                }
                else{
                    if(this.spos == -1){
                        if(i == this.lpos){
                            return this.chansesWidth[0];
                        }
                        else{
                            return this.chansesWidth[1];
                        }
                    }
                    else{
                        if(i == this.lpos){
                            return this.chansesWidth[2];
                        }
                        else if(this.spos == i){
                            return this.chansesWidth[0];
                        }
                        else{
                            return this.chansesWidth[1];
                        }
                    }
                }
            });
            const ans = this.rand(chanse);
            if(ans == this.lpos){
                this.spos = -1;
                const goloc = locate.peek([0, this.gpos], ans, true);
                this.gpos = goloc.gpos;
                this.lpos = goloc.lpos;
            }
            else{
                this.spos = this.lpos;
                this.lpos = ans;
            }
        }
        else{
            if(this.target == this.lpos){
                this.spos = -1;
                const goloc = locate.peek([0, this.gpos], this.lpos, true);
                this.gpos = goloc.gpos;
                this.lpos = goloc.lpos;
            }
            else{
                this.spos = this.lpos;
                this.lpos = this.target;
            }
            this.target = -1;
        }
    },
    rand : function(c){
        const sum = c.reduce((a, b) => a + b);
        const shans = c.map((e) => e / sum);
        const r = Math.random();
        for(let i = 0; i < shans.length; i++){
            if(r < shans.slice(0, i + 1).reduce((a, b) => a + b)){
                return i;
            }
        }
    },
    interferenceCheck : function(){
        if(this.sgpos == locate.cam[view.cam.select][0] || this.gpos == locate.cam[view.cam.select][0]){
            view.interference(1000);
        }
        this.sgpos = this.gpos;
    },
    init : function(){
        this.gpos = this.startGpos;
        this.lpos = this.startLpos;
    }
};
enemy.init();

let view = {
    xSpeed : 0.002,
    x : 0.5,
    gpos : 0,
    lpos : 0,
    cursorType : -1,
    changeProgress : 1,
    changeCompleted : true,
    changeSpeed : 0.003,
    changeWait : 0,
    room : [],
    roomType : 0,//0 go, 1 door, 2 peek
    roomSkin : 3,
    enemyShow : false,
    ambient : Array(8).fill(null),
    tab : {
        sOutBut : true,
        move : 0,
        y : 1,
        speed : 0.005
    },
    cam : {
        select : 0,
        room : [0, 0, 0, 0],
        roomSkin : 1,
        enemyShow : false,
        interferenceDelay : 0,
        interferenced : false,
        interferenceFrame : 0,
        interferenceFrameDuration : 50,
        interferenceFrameDelay : 0,
        ambient : Array(8).fill(null)
    },
    ambientSpriteCords : [
        [0.009, 0, 0.085, 0.99],
        [0.19, 0, 0.06, 0.745],
        [0.25, 0, 0.2, 0.67],
        [0.55, 0, 0.2, 0.67],
        [0.75, 0, 0.06, 0.745],
        [0.91, 0, 0.085, 0.99]
    ],
    update : function(){
        //движение по краям экрана
        this.camRotate();

        //наводка на двери
        if(this.roomType == 1){
                this.doorActions();
        }
        else if(this.roomType == 2){
            this.keyholeActions();
        }
        else if(this.tab.y == 1){
            this.roomActions();
        }

        //планшет
        this.tabletCam();

        //аниматроник в комнате
        this.enemyCheck();

        this.interference(-1);

        //смена положения с затемнением
        this.darkChange();
    },
    roomActions : function(){//roomType == 0
        //двери
        if(this.room[1] > 0 && this.room[1] < 4 && inArea(plx + this.x * cw / 2, ply, cw * 0.144, ch * 0.191, cw * 0.144, ch * 0.682)){
            this.cursorType = 0;
            if(click && !sclick){
                this.changeRoom(1, true, 0);
            }
            else if(rclick && !srclick){
                this.changeRoom(1, false, 1);
            }
        }
        else if(this.room[2] > 0 && this.room[2] < 4 && inArea(plx + this.x * cw / 2, ply, cw * 0.675, ch * 0.169, cw * 0.15, ch * 0.5)){
            this.cursorType = 1;
            if(click && !sclick){
                this.changeRoom(2, true, 0);
            }
            else if(rclick && !srclick){
                this.changeRoom(2, false, 1);
            }
        }
        else if(this.room[3] > 0 && this.room[3] < 4 && inArea(plx + this.x * cw / 2, ply, cw * 1.211, ch * 0.191, cw * 0.144, ch * 0.682)){
            this.cursorType = 2;
            if(click && !sclick){
                this.changeRoom(3, true, 0);
            }
            else if(rclick && !srclick){
                this.changeRoom(3, false, 1);
            }
        }
        else if(this.room[0] > 0 && this.room[0] < 4 && inArea(plx, ply, cw * 0.4, ch * 0.9, cw * 0.2, ch * 0.1)){
            this.cursorType = 3;
            if(click && !sclick){
                this.changeRoom(0, true, 0);
            }
            else if(rclick && !srclick){
                this.changeRoom(0, false, 1);
            }
        }
        //стол
        else if(this.room[1] == 4 && inArea(plx + this.x * cw / 2, ply, cw * 0.29, ch * 0.56, cw * 0.25, ch * 0.25)){
            this.cursorType = 0;
            if((click && !sclick) || (rclick && !srclick)){
                this.changeRoom(1, false, 0);
            }
        }
        else if(this.room[3] == 4 && inArea(plx + this.x * cw / 2, ply, cw * 0.96, ch * 0.56, cw * 0.25, ch * 0.25)){
            this.cursorType = 2;
            if((click && !sclick) || (rclick && !srclick)){
                this.changeRoom(3, false, 0);
            }
        }
        else{
            this.cursorType = -1;
        }
    },
    doorActions : function(){//roomType == 1
        if(inArea(plx, ply, cw * 0.8, ch * 0.5 - cw * 0.03125, cw * 0.15, cw * 0.0625)){
            this.cursorType = 4;
            if(click && !sclick){
                this.changeRoom(0, true, 2);
            }
        }
        else if(inArea(plx, ply, cw * 0.25, 0, cw * 0.5, ch)){
            this.cursorType = 1;
            if(click && !sclick){
                this.changeRoom(0, true, 0);
            }
        }
        else{
            this.cursorType = -1;
        }
        if(rclick && !srclick){
            this.changeRoom(0, false, 0);
        }
    },
    keyholeActions : function(){//roomType == 2
        this.cursorType = -1;
            if((click && !sclick) || (rclick && !srclick)){
                this.changeRoom(0, false, 1);
            }
    },
    camRotate : function(){//вращение камерой по краям экрана
        if(plx > cw * 0.875){
            if(plx < cw * 0.9375){
                this.x += this.xSpeed * (plx - cw * 0.875) / (cw * 0.0625) * time.delta;
            }
            else{
                this.x += this.xSpeed * time.delta;
            }
        }
        else if(plx < cw * 0.125){
            if(plx > cw * 0.0625){
                this.x -= this.xSpeed * -((plx - cw * 0.0625) / (cw * 0.0625) - 1) * time.delta;
            }
            else{
                this.x -= this.xSpeed * time.delta;
            }
        }
        if(this.x > 1){
            this.x = 1;
        }
        else if(this.x < 0){
            this.x = 0;
        }
    },
    tabletCam : function(){//планшет с камерами
        //кнопка планшета
        if(this.room[0] == 4){
            if(inArea(plx, ply, cw * 0.375, ch * 0.95, cw * 0.25, ch * 0.05 + 1)){
                if(this.tab.sOutBut){
                    this.tab.sOutBut = false;
                    if(this.tab.move == 0){
                        this.tab.move = Math.round(this.tab.y) * -2 + 1;
                    }
                    else{
                        this.tab.move *= -1;
                    }
                }
            }
            else{
                this.tab.sOutBut = true;
            }
            if(this.tab.move != 0){
                this.tab.y += this.tab.move * this.tab.speed * time.delta;
                if(this.tab.y <= 0 || this.tab.y >= 1){
                    this.tab.y = (this.tab.move + 1) / 2;
                    this.tab.move = 0;
                }
            }
        }
        else{
            this.tab.move = 0;
            this.tab.y = 1;
            this.tab.sOutBut = true;
        }

        //кнопки камер
        const wcams = cw * 0.3 / locate.w;
        const mh = locate.mapa.length / locate.w;
        const ycams = view.tab.y * ch * 0.9;
        for(let i = 0, lposcords = [0, 0], xcam = 0, ycam = 0; i < locate.cam.length; i++){
            lposcords = locate.lposToCords(locate.cam[i][1]);
            xcam = cw * 0.58 + (locate.cam[i][0] % locate.w) * wcams + wcams * 0.3 + wcams * 0.2 * lposcords[0];
            ycam = ch - wcams * mh - ch * 0.05 + Math.floor(locate.cam[i][0] / locate.w) * wcams + ycams + wcams * 0.3 + wcams * 0.2 * lposcords[1];
            if(inArea(plx, ply, xcam, ycam, wcams * 0.4, wcams * 0.4) && click && !sclick){
                if(this.cam.select != i){
                    this.cam.select = i;
                    this.interference(200);
                }
                const loc = locate.peek(false, locate.cam[i][1], locate.cam[i][0]);
                this.cam.room = loc.room;
                this.cam.roomSkin = loc.roomSkin;
                this.cam.ambient = loc.ambient;
            }
        }

        //аниматроник на камере
        if(enemy.gpos == locate.cam[this.cam.select][0]){
            this.cam.enemyShow = enemy.lpos - locate.cam[this.cam.select][1];
            if(this.cam.enemyShow < 0){
                this.cam.enemyShow += 4;
            }
        }
        else{
            this.cam.enemyShow = false;
        }

    },
    changeRoom : function(n, t, p){//смена комнаты (направление, пробитие, roomType[go, door, peek])
        if(this.changeProgress < 1){
            return;
        }
        this.changeWait = [n, t, p];
        this.changeCompleted = false;
        this.changeProgress = -1;
    },
    roomChanging : function(){//смена комнаты после задержки темноты
        //корректировка агра аниматроника
        if(enemy.gpos == locate.gpos && this.changeWait[1]){
            if(this.changeWait[0] === this.enemyShow){
                game.dead();
            }
            else{
                let pos = locate.lpos + this.changeWait[0];
                if(pos > 3){
                    pos -= 4;
                }
                enemy.target = pos;
            }
        }

        //смена комнаты
        let loc = {};
        if(this.changeWait[2] == 0){
            loc = locate.go([locate.lpos, locate.gpos], this.changeWait[0], this.changeWait[1]);
            this.roomType = 0;
        }
        else if(this.changeWait[2] == 1){
            loc = locate.go([locate.lpos, locate.gpos], this.changeWait[0], this.changeWait[1]);
            this.roomType = 1;
        }
        else{
            loc = locate.peek([locate.lpos, locate.gpos], this.changeWait[0], this.changeWait[1]);
            this.roomType = 2;
        }
        this.room = loc.room;
        this.roomSkin = loc.roomSkin;
        this.gpos = loc.gpos;
        this.lpos = loc.lpos;
        this.ambient = loc.ambient;
        this.x = 0.5;
        this.changeCompleted = true;
    },
    darkChange : function(){//затемнение при действии
        if(this.changeProgress < 1){
            this.changeProgress += this.changeSpeed * time.delta;
        }
        if(this.changeProgress >= 0 && !this.changeCompleted){
            this.roomChanging();
        }
        if(this.changeProgress >= 1){
            this.changeProgress = 1;
        }
    },
    enemyCheck : function(){//проверка на аниматроника в комнате
        if(this.gpos == enemy.gpos){
            this.enemyShow = enemy.lpos - this.lpos;
            if(this.enemyShow < 0){
                this.enemyShow += 4;
            }
        }
        else{
            this.enemyShow = false;
        }
    },
    interference : function(put){//помехи
        if(put != -1){
            if(this.cam.interferenceDelay < put){
                this.cam.interferenceDelay = put;
                this.cam.interferenceFrameDelay = this.cam.interferenceFrameDuration;
            }
            this.cam.interferenced = true;
        }
        else if(this.cam.interferenced){
            this.cam.interferenceDelay -= time.delta;
            this.cam.interferenceFrameDelay -= time.delta;
            if(this.cam.interferenceFrameDelay <= 0){
                this.cam.interferenceFrame += 1;
                if(this.cam.interferenceFrame > 2){
                    this.cam.interferenceFrame = 0;
                }
                this.cam.interferenceFrameDelay = this.cam.interferenceFrameDuration;
            }
            if(this.cam.interferenceDelay <= 0){
                this.cam.interferenced = false;
                this.cam.interferenceDelay = 0;
            }
        }
    },
    init : function(){
        const loc = locate.peek(false, locate.lpos, locate.gpos);
        this.room = loc.room;
        this.roomSkin = loc.roomSkin;
        this.gpos = locate.gpos;
        this.lpos = locate.lpos;
        const camLoc = locate.peek(false, locate.cam[0][1], locate.cam[0][0]);
        this.cam.room = camLoc.room;
        this.cam.roomSkin = camLoc.roomSkin;
    }
};
view.init();

imageLoader.init();//start on load

function update(){
    time.update();

    game.showsUpdate();

    if(game.type == 0){
        menu.update();
    }
    else if(game.type == 1){
        enemy.update();
        view.update();
        game.update();
    }
    else if(game.type == 2){
        menu.endUpdate();
    }

	sclick = click; srclick = rclick;
    if(run){
        requestAnimationFrame(update);
        draw();
    }
}

let draws = {
    room : function(x, y, w, h, a, rs, r, amb){
        //комната
        ctx.drawImage(img[`room${rs - 1}`], x, y, w, h);
        //двери
        if(r[1] > 0 && r[1] < 4){
            ctx.drawImage(img[`leftdoor${r[1] - 1}`], x + w * 0.0967, y + h * 0.19, w * 0.0953 , h * 0.68);
        }
        if(r[2] > 0 && r[2] < 4){
            ctx.drawImage(img[`door${r[2] - 1}`], x + w * 0.45, y + h * 0.169, w * 0.1, h * 0.5);
        }
        if(r[3] > 0 && r[3] < 4){
            ctx.drawImage(img[`rightdoor${r[3] - 1}`], x + w * 0.808, y + h * 0.19, w * 0.0953, h * 0.68);
        }
        if(r[1] == 4){
            ctx.drawImage(img.table, w * 0.1933 + x, y + h * 0.56, w * 0.1667, h * 0.25);
        }
        else if(r[3] == 4){
            ctx.drawImage(img.table, w * 0.64 + x, y + h * 0.56, w * 0.1667, h * 0.25);
        }
        else if(r[0] == 4){
            ctx.drawImage(img.table, w * 0.2333 + x, y + h * 0.4, w * 0.5333, h * 0.6);
        }

        //эмбиент
        this.ambient(x, y, w, h, amb);

        if(a != -1){//аниматроник
            if(a == 0){
                ctx.drawImage(img.enemy, w * 0.2957 + x, y + h * -0.2, w * 0.4087, h * 2);
            }
            else if(a == 1){
                ctx.drawImage(img.enemy, x + w * 0.1533, y + h * 0.25, w * 0.1333, h * 0.6264);
            }
            else if(a == 2){
                ctx.drawImage(img.enemy, x + w * 0.45, y + h * 0.21, w * 0.1, h * 0.5448);
            }
            else{
                ctx.drawImage(img.enemy, x + w * 0.7133, y + h * 0.25, w * 0.1333, h * 0.6264);
            }
        }
    },
    tablet : function(){
        const y = view.tab.y * ch * 0.9;
        const ots = cw * 0.02;
        //сам планшет
        ctx.fillStyle = '#555';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = sra * 0.06;
        ctx.fillRect(cw * 0.1, ch * 0.1 + y, cw * 0.8, ch * 0.9);
        ctx.strokeRect(cw * 0.1, ch * 0.1 + y, cw * 0.8, ch * 0.9 - sra * 0.03);

        //экран камеры
        this.room(cw * 0.1, ch * 0.1 + y, cw * 0.8, ch * 0.9, view.cam.enemyShow !== false ? view.cam.enemyShow : -1, view.cam.roomSkin, view.cam.room, view.cam.ambient);

        this.interference(cw * 0.1, ch * 0.1 + y, cw * 0.8, ch * 0.9);//помехи

        //карта
        this.tabletMap(y);
    },
    interference : function(x, y, w, h){
        if(view.cam.interferenced){
            ctx.drawImage(img[`interference${view.cam.interferenceFrame}`], x, y, w, h);
        }
    },
    arrow : function(x, y, w, n){
        const otst = game.sinusoida * sra * 0.1;
        ctx.strokeStyle = '#000';
        ctx.fillStyle = '#BBB';
        ctx.lineWidth = w * 0.1;
        ctx.save();
        ctx.translate(x + sra * 0.4, y - sra * 0.4);
        ctx.rotate(Math.PI / 2 * n);
        ctx.beginPath();
        ctx.moveTo(-w + otst, 0);
        ctx.lineTo(w + otst, -w);
        ctx.lineTo(w / 2 + otst, 0);
        ctx.lineTo(w + otst, w);
        ctx.lineTo(-w + otst, 0);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    },
    backdoor : function(){
        ctx.strokeStyle = '#000';
        if(view.room[0] == 1){
            ctx.fillStyle = '#1E120B';
        }
        else if(view.room[0] == 2){
            ctx.fillStyle = '#494949';
        }
        else if(view.room[0] == 3){
            ctx.fillStyle = '#002D02';
        }
        ctx.lineWidth = sra * 0.03;
        ctx.fillRect(cw * 0.4, ch * 0.9, cw * 0.2, ch * 0.1);
        ctx.strokeRect(cw * 0.4, ch * 0.9, cw * 0.2, ch * 0.1);
        ctx.fillStyle = '#000';
        ctx.font = `normal ${cw * 0.03}px arial`;
        ctx.fillText('BACK', cw * 0.5, ch * 0.95);
    },
    dark : function(){
        ctx.fillStyle = `rgba(0, 0, 0, ${1.5 - Math.abs(view.changeProgress) * 1.5})`;
        ctx.fillRect(0, 0, cw, ch);
    },
    arc : function(x, y, w){
        const otst = game.sinusoida * sra * 0.1;
        ctx.beginPath();
        ctx.moveTo(x + sra * 0.4 + w + otst * sra * 0.002, y - sra * 0.4);
        ctx.lineWidth = w * 0.5;
        ctx.strokeStyle = '#000';
        ctx.arc(x + sra * 0.4, y - sra * 0.4, w + otst * sra * 0.002, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(x + sra * 0.4 + w + otst * sra * 0.002, y - sra * 0.4);
        ctx.strokeStyle = '#BBB';
        ctx.lineWidth = w * 0.35;
        ctx.arc(x + sra * 0.4, y - sra * 0.4, w + otst * sra * 0.002, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();
    },
    peek : function(){
        ctx.strokeStyle = '#000';
        ctx.fillStyle = '#555';
        ctx.lineWidth = sra * 0.06;
        ctx.fillRect(cw * 0.8, ch * 0.5 - cw * 0.03125, cw * 0.15, cw * 0.0625);
        ctx.strokeRect(cw * 0.8, ch * 0.5 - cw * 0.03125, cw * 0.15, cw * 0.0625);
        ctx.fillStyle = '#000';
        ctx.font = `normal ${cw * 0.03}px arial`;
        ctx.fillText('PEEK', cw * 0.875, ch * 0.5);
    },
    logs : function(){
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillStyle = '#FFF';
        ctx.font = `normal ${cw * 0.02}px arial`;
        ctx.fillText(`room:    ${view.room}`, cw * 0.02, ch * 0.05);
        ctx.fillText(`Gpos / Lpos:    ${locate.gpos} / ${locate.lpos}`, cw * 0.02, ch * 0.1);
        ctx.fillText(`roomType:    ${view.roomType}`, cw * 0.02, ch * 0.15);
        ctx.fillText(`roomSkin:    ${view.roomSkin}`, cw * 0.02, ch * 0.2);
        ctx.fillText(`x / y / RX:    ${Math.round(plx / cw * 1000) / 1000} / ${Math.round(ply / ch * 1000) / 1000} / ${Math.round((plx + view.x * cw / 2) / cw * 1000) / 1000}`, cw * 0.02, ch * 0.25);
        ctx.fillText(`enemy Gpos / Lpos:    ${enemy.gpos} / ${enemy.lpos}`, cw * 0.02, ch * 0.3);
        ctx.fillText(`enemy delay:    ${Math.round(enemy.delay)}`, cw * 0.02, ch * 0.35);
        ctx.font = `normal ${cw * 0.03}px arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
    },
    tabletButton : function(){
        ctx.fillStyle = `rgba(${15}, ${15}, ${207}, ${0.5})`;
        ctx.strokeStyle = '#11D';
        ctx.lineWidth = sra * 0.06;
        ctx.fillRect(cw * 0.375, ch * 0.95, cw * 0.25, ch * 0.05);
        ctx.strokeRect(cw * 0.375, ch * 0.95, cw * 0.25, ch * 0.05 - sra * 0.03);
    },
    loading : function(){
        ctx.clearRect(0, 0, cw, ch);
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, cw, ch);
        ctx.fillStyle = '#FFF';
        ctx.font = `normal ${cw * 0.05}px arial`;
        ctx.fillText('LOADING...', cw / 2, ch * 0.4);
        ctx.fillText(`${Math.round(imageLoader.loadProgress / imageLoader.imgsrcs.length * 100)}%`, cw / 2, ch * 0.5);
        ctx.fillStyle = '#777';
        ctx.fillRect(cw / 3, ch * 0.9, cw / 3, ch * 0.05);
        ctx.fillStyle = '#FFF';
        ctx.fillRect(cw / 3 + cw * 0.005, ch * 0.9 + cw * 0.005, (cw / 3 - cw * 0.01) * (imageLoader.loadProgress / imageLoader.imgsrcs.length), ch * 0.05 - cw * 0.01);
    },
    mainMenu : function(){
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, cw, ch);
        if(menu.night != 7){
            ctx.drawImage(img.enemy, 0, 0, img.enemy.width, img.enemy.height * 0.4, cw * 0.4, ch * 0.1, cw * 0.7, ch * 0.9);
        }
        ctx.fillStyle = '#FFF';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.font = `normal ${sra * 1.1}px arial`;
        ctx.fillText('PLAY', sra * 0.8, sra * 0.8);
        ctx.font = `normal ${sra * 0.29}px arial`;
        ctx.fillText('NIGHT:', sra * 0.3, ch / 2 + sra * 0.3);
        // ctx.strokeStyle = '#FFF';
        // ctx.strokeRect(0, 0, cw / 3, ch / 4);
        // ctx.strokeRect(sra * 1.275, ch / 2 + sra * 0.2, sra * 2.85, sra);
        if(menu.night != menu.nightMouseUp && menu.nightMouseUp != 0){
            ctx.strokeStyle = '#888';
            ctx.lineWidth = sra * 0.02;
            if(menu.nightMouseUp == 7){
                ctx.strokeRect(sra * 3.075, ch / 2 + sra * 0.2, sra * 1.05, sra);
            }
            else{
                ctx.strokeRect(sra * 1.275 + ((menu.nightMouseUp - 1) % 3) * sra * 0.6, ch / 2 + sra * 0.2 + Math.floor((menu.nightMouseUp - 1) / 3) * sra * 0.5, sra * 0.6, sra * 0.5);
            }
        }
        ctx.strokeStyle = '#FFF';
        if(menu.night == 7){
            ctx.strokeRect(sra * 3.075, ch / 2 + sra * 0.2, sra * 1.05, sra);
        }
        else{
            ctx.strokeRect(sra * 1.275 + ((menu.night - 1) % 3) * sra * 0.6, ch / 2 + sra * 0.2 + Math.floor((menu.night - 1) / 3) * sra * 0.5, sra * 0.6, sra * 0.5);
        }
        ctx.font = `normal ${sra * 0.3}px arial`;
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 2; j++){
                ctx.fillText((i + 1) + j * 3, sra * 1.5 + i * sra * 0.6, ch / 2 + sra * 0.3 + j * sra * 0.5);
            }
        }
        ctx.font = `normal ${sra * 0.86}px arial`;
        ctx.fillText('C', sra * 3.3, ch / 2 + sra * 0.3);

        if(menu.night == 7){
            ctx.fillStyle = '#FFF'
            for(let i = 0; i < menu.customSettingParams.length; i++){
                ctx.textAlign = 'left';
                ctx.textBaseline = 'top';
                ctx.font = `normal ${sra * 0.2}px arial`;
                ctx.fillText(menu.customSettingParams[i].name, sra * 5, ch * 0.1 + i * sra * 0.5);
                ctx.fillText(menu.settings[i], sra * 10.7, ch * 0.1 + i * sra * 0.5);
                this.slider(sra * 8.6, ch * 0.1 + i * sra * 0.5, sra * 2, sra * 0.2, menu.sliderPos[i]);

            }
        }
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
    },
    clock : function(){
        ctx.fillStyle = '#FFF';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';
        ctx.font = `normal ${sra * 0.3}px arial`;
        ctx.fillText(game.clock[0], cw - sra * 0.7, sra * 0.1);
        if(game.showMinutes){
            ctx.fillText(game.clock[1], cw - sra * 0.1, sra * 0.1);
            ctx.fillText(':', cw - sra * 0.52, sra * 0.1);
        }
        else{
            ctx.fillText('AM', cw - sra * 0.1, sra * 0.1);
        }
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
    },
    slider : function(x, y, w, h, p){
        ctx.fillStyle = '#777';
        ctx.fillRect(x, y + h / 3, w, h / 3);
        ctx.fillStyle = '#FFF';
        ctx.fillRect(x + p * w - h / 6, y, h / 3, h);
    },
    loose : function(){
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, cw, ch);
        ctx.fillStyle = '#FFF';
        ctx.font = `normal ${cw * 0.02}px arial`;
        ctx.fillText('GAME OVER', cw * 0.5, ch * 0.5);
        ctx.fillText(`${game.clock[0]} : ${game.clock[1]}`, cw * 0.5, ch * 0.55);
        ctx.fillText('MENU', cw * 0.5, ch * 0.95);
    },
    win : function(){
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, cw, ch);
        ctx.fillStyle = '#FFF';
        ctx.font = `normal ${cw * 0.02}px arial`;
        ctx.fillText('06 : 00', cw * 0.5, ch * 0.5);
        ctx.fillText('MENU', cw * 0.5, ch * 0.95);
    },
    tabletMap : function(y){
        ctx.lineWidth = sra * 0.01;
        ctx.strokeStyle = '#999';
        const w = cw * 0.3 / locate.w;
        const mh = locate.mapa.length / locate.w;
        for(let i = 0; i < locate.mapa.length; i++){//проходы
            if(locate.mapa[i][0] != 0){
                ctx.strokeStyle = '#999';
                if(locate.mapa[i][1] != 0){
                    ctx.beginPath();
                    ctx.moveTo(cw * 0.58 + (i % locate.w) * w - w * 0.1, ch - w * mh - ch * 0.05 + Math.floor(i / locate.w) * w + y + w * 0.4);
                    ctx.lineTo(cw * 0.58 + (i % locate.w) * w + w * 0.1, ch - w * mh - ch * 0.05 + Math.floor(i / locate.w) * w + y + w * 0.4);
                    ctx.moveTo(cw * 0.58 + (i % locate.w) * w - w * 0.1, ch - w * mh - ch * 0.05 + Math.floor(i / locate.w) * w + y + w * 0.6);
                    ctx.lineTo(cw * 0.58 + (i % locate.w) * w + w * 0.1, ch - w * mh - ch * 0.05 + Math.floor(i / locate.w) * w + y + w * 0.6);
                    ctx.stroke();
                    ctx.closePath();
                }
                if(locate.mapa[i][2] != 0){
                    ctx.beginPath();
                    ctx.moveTo(cw * 0.58 + (i % locate.w) * w + w * 0.4, ch - w * mh - ch * 0.05 + Math.floor(i / locate.w) * w + y - w * 0.1);
                    ctx.lineTo(cw * 0.58 + (i % locate.w) * w + w * 0.4, ch - w * mh - ch * 0.05 + Math.floor(i / locate.w) * w + y + w * 0.1);
                    ctx.moveTo(cw * 0.58 + (i % locate.w) * w + w * 0.6, ch - w * mh - ch * 0.05 + Math.floor(i / locate.w) * w + y - w * 0.1);
                    ctx.lineTo(cw * 0.58 + (i % locate.w) * w + w * 0.6, ch - w * mh - ch * 0.05 + Math.floor(i / locate.w) * w + y + w * 0.1);
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        }
        for(let i = 0; i < locate.mapa.length; i++){//комнаты
            if(locate.mapa[i][0] != 0){
                if(locate.mapa[i][0] == 1){
                    ctx.strokeStyle = '#999';
                }
                else if(locate.mapa[i][0] == 2){
                    ctx.strokeStyle = '#33B';
                }
                else if(locate.mapa[i][0] == 3){
                    ctx.strokeStyle = '#3B3';
                }
                ctx.strokeRect(cw * 0.58 + (i % locate.w) * w + w * 0.1, ch - w * mh - ch * 0.05 + Math.floor(i / locate.w) * w + y + w * 0.1, w * 0.8, w * 0.8);
            }
        }

        //кнопки камер на карте
        ctx.lineWidth = sra * 0.01;
        for(let i = 0, lposcords = [0, 0], xcam = 0, ycam = 0; i < locate.cam.length; i++){
            lposcords = locate.lposToCords(locate.cam[i][1]);
            xcam = cw * 0.58 + (locate.cam[i][0] % locate.w) * w + w * 0.3 + w * 0.2 * lposcords[0];
            ycam = ch - w * mh - ch * 0.05 + Math.floor(locate.cam[i][0] / locate.w) * w + y + w * 0.3 + w * 0.2 * lposcords[1];
            ctx.fillStyle = 'rgba(200, 200, 200, 0.4)';
            if(i == view.cam.select){
                ctx.strokeStyle = '#5F5';
            }
            else{
                ctx.strokeStyle = '#FFF';
            }
            ctx.fillRect(xcam, ycam, w * 0.4, w * 0.4);
            ctx.strokeRect(xcam, ycam, w * 0.4, w * 0.4);
            ctx.fillStyle = '#000';
            ctx.font = `normal ${cw * 0.015}px arial`;
            ctx.fillText(i + 1, xcam + w * 0.2, ycam + w * 0.2);
        }

        //maphack
        if(showMap){
            ctx.fillStyle = '#B33';
            let lposcords = locate.lposToCords(enemy.lpos);
            ctx.fillRect(cw * 0.58 + (enemy.gpos % locate.w) * w + w * 0.4 + w * 0.3 * lposcords[0], ch - w * mh - ch * 0.05 + Math.floor(enemy.gpos / locate.w) * w + y + w * 0.4  + w * 0.3 * lposcords[1], w * 0.2, w * 0.2);
            ctx.fillStyle = '#3B3';
            lposcords = locate.lposToCords(locate.lpos);
            ctx.fillRect(cw * 0.58 + (locate.gpos % locate.w) * w + w * 0.4 + w * 0.3 * lposcords[0], ch - w * mh - ch * 0.05 + Math.floor(locate.gpos / locate.w) * w + y + w * 0.4  + w * 0.3 * lposcords[1], w * 0.2, w * 0.2);
        }
    },
    ambient : function(x, y, w, h, amb){
        for(let i = 2; i < 4; i++){
            if(amb[i] != null){
                ctx.drawImage(img[`leftambient${amb[i]}`], x + view.ambientSpriteCords[i - 2][0] * w, y + view.ambientSpriteCords[i - 2][1] * h, view.ambientSpriteCords[i - 2][2] * w, view.ambientSpriteCords[i - 2][3] * h);
            }
        }
        for(let i = 4; i < 6; i++){
            if(amb[i] != null){
                ctx.drawImage(img[`ambient${amb[i]}`], x + view.ambientSpriteCords[i - 2][0] * w, y + view.ambientSpriteCords[i - 2][1] * h, view.ambientSpriteCords[i - 2][2] * w, view.ambientSpriteCords[i - 2][3] * h);
            }
        }
        for(let i = 6; i < 8; i++){
            if(amb[i] != null){
                ctx.drawImage(img[`rightambient${amb[i]}`], x + view.ambientSpriteCords[i - 2][0] * w, y + view.ambientSpriteCords[i - 2][1] * h, view.ambientSpriteCords[i - 2][2] * w, view.ambientSpriteCords[i - 2][3] * h);
            }
        }
    }
};
 
function draw(){
    ctx.clearRect(0, 0, cw, ch);
	
    if(game.type == 0){
        draws.mainMenu();
    }
    else if(game.type == 1){
        if(view.roomType == 1){//дверь
            if(view.roomSkin == 1){
                ctx.fillStyle = '#240900';
            }
            else if(view.roomSkin == 2){
                ctx.fillStyle = '#070C11';
            }
            else if(view.roomSkin == 3){
                ctx.fillStyle = '#131A12';
            }
            ctx.fillRect(0, 0, cw, ch);
            ctx.drawImage(img[`door${view.room[0] - 1}`], cw / 4, ch * -0.1, cw / 2, cw * 235 / 288);
            draws.peek();
        }
        else{//комната
            draws.room(view.x * cw / -2, 0, cw * 1.5, ch, (view.enemyShow !== false && view.roomType != 1) ? view.enemyShow : -1, view.roomSkin, view.room, view.ambient);
        }

        

        if(view.roomType == 2){//замочная скважина
            ctx.drawImage(img.keyhole, plx - cw, ply - ch, cw * 2, ch * 2);
        }
        else if(view.room[0] > 0 && view.room[0] < 4 && view.roomType == 0){//кнопка back
            draws.backdoor();
        }

        if(view.room[0] == 4){//планшет и кнопка
            if(view.tab.y < 1){
                draws.tablet();
            }
            draws.tabletButton();
        }

        if(view.roomType != 2){//время
            draws.clock();
        }

        if(view.cursorType >= 0 && view.cursorType <= 3){//курсор стрелочка
            draws.arrow(plx, ply, sra * 0.3, view.cursorType);
        }


        if(view.changeProgress < 1){//затемнение
            draws.dark();
        }

        if(showMap && view.room[0] != 4){//maphack
            draws.tabletMap(0);
        }

        if(view.cursorType == 4){//курсор кружок
            draws.arc(plx, ply, sra * 0.3);
        }

        if(showLog){//данные для дебагинга
            draws.logs();
        }
    }
    else if(game.type == 2){
        if(game.winEndMenu){
            draws.win();
        }
        else{
            draws.loose();
        }
    }
}