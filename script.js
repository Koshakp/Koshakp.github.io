const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

window.addEventListener('resize', resize);
window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);
canvas.addEventListener('mousedown', mouseDown);
canvas.addEventListener('mousemove', mouseMove);
canvas.addEventListener('mouseup', mouseUp);

let img = [];
let imageLoader = {
    imgsrcs : ['doorLeft', 'doorFront', 'doorRight', 'doorLeft1', 'doorFront1', 'doorRight1', 'doorLeft2', 'doorFront2', 'doorRight2', 'room', 'room1', 'room2', 'keyhole', 'enemy', 'table'],//images
    imgadd : function(a){
        for(let i = 0; i < a.length; i++){
            img.push(new Image());
            img[i].onload = this.loading;
            img[i].src = `images/${a[i]}.png`;
        }
    },
    loadProgress : 0,
    loading : function(){
        imageLoader.loadProgress++;
        if(imageLoader.loadProgress >= imageLoader.imgsrcs.length){
            start();
        }
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

let locate = {
    gpos : 14,
    lpos : 3,
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
    mapa : [],
    go : function(type, n, p){//локал? куда, пробой : лпос, гпос
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
            return [this.mapa[gpos][0], ...this.rotor(lpos, gpos), gpos, lpos];
        }
        else{
            this.lpos = n;
            this.gpos = p;
            return [this.mapa[this.gpos][0], ...this.rotor(this.lpos, this.gpos), this.gpos, this.gpos];
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
            return [this.mapa[gpos][0], ...this.rotor(lpos, gpos), gpos, lpos];
        }
        else{
            return [this.mapa[p][0], ...this.rotor(n, p), n, p];
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
    init : function(){
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
    }
};
locate.init();

let enemy = {
    gpos : 11,
    lpos : 0,
    delay : 10000,
    agr : false,
    moveDelay : 6000,
    agrDelay : [1500, 3000],
    agrSpad : 0,
    spos : 0,
    target : -1,
    chansesWidth : [1, 8, 32],//вернуться, подойти к двери, пройти через дверь
    update : function(){
        if(this.lpos == locate.lpos && this.gpos == locate.gpos){
            this.dead();
        }
        else if(this.gpos == locate.gpos || (this.gpos == view.gpos && this.lpos == view.lpos)){
            if(this.gpos == locate.gpos){
                if(this.agr == false){
                    this.delay = this.agrDelay[0];
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
            if(this.agr){
                this.delay += this.agrDelay[0];
                this.agrSpad--;
                if(this.agrSpad <= 0){
                    this.agr = false;
                }
            }
            else{
                this.delay += this.moveDelay;
            }
        }
    },
    move : function(){
        if(this.target == -1){
            const loc = locate.peek(false, 0, this.gpos).slice(1, 5);
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
                this.gpos = goloc[5];
                this.lpos = goloc[6];
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
                this.gpos = goloc[5];
                this.lpos = goloc[6];
            }
            else{
                this.spos = this.lpos;
                this.lpos = this.target;
            }
            this.target = -1;
        }
    },
    dead : function(){
        ctx.fillStyle = '#B33';
        ctx.fillRect(0, 0, cw, ch);
        ctx.fillStyle = '#000';
        ctx.font = `normal ${cw * 0.2}px impact`;
        ctx.fillText('GAME OVER', cw * 0.5, ch * 0.5);
        stop();
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
    }
};

let view = {
    xSpeed : 0.002,
    x : 0.5,
    gpos : 0,
    lpos : 0,
    sinusoida : 0,
    timeTrack : 0,
    cursorType : -1,
    changeProgress : 1,
    changeCompleted : true,
    changeSpeed : 0.003,
    changeWait : 0,
    room : [],
    roomType : 0,//0 go, 1 door, 2 peek
    roomSkin : 3,
    enemyShow : false,
    shows : [false, false],
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
        enemyShow : false
    },
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

        //смена положения с затемнением
        this.darkChange();

        //синусоидальное прыганье стрелочки и показ логов и карты
        this.sinUpdate();
        this.showsUpdate();
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
                this.cam.select = i;
                const loc = locate.peek(false, locate.cam[i][1], locate.cam[i][0]);
                this.cam.room = loc.slice(1, 5);
                this.cam.roomSkin = loc[0];
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
                enemy.dead();
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
        let loc = [];
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
        this.room = loc.slice(1, 5);
        this.roomSkin = loc[0];
        this.gpos = loc[5];
        this.lpos = loc[6];
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
    },
    sinUpdate : function(){//синусоидальное движение объектов интерфейса
        this.timeTrack += 0.002 * time.delta;
        if(this.timeTrack >= 1){
            this.timeTrack -= 1;
        }
        this.sinusoida = Math.sin(this.timeTrack * Math.PI * 2);
    },
    init : function(){
        const loc = locate.peek(false, locate.lpos, locate.gpos);
        this.room = loc.slice(1, 5);
        this.roomSkin = loc[0];
        this.gpos = locate.gpos;
        this.lpos = locate.lpos;
        const camLoc = locate.peek(false, locate.cam[0][1], locate.cam[0][0]);
        this.cam.room = camLoc.slice(1, 5);
        this.cam.roomSkin = camLoc[0];
    }
};
view.init();

imageLoader.init();//start on load

function update(){
    time.update();

    enemy.update();
    view.update();


	sclick = click; srclick = rclick;
    if(run){
        requestAnimationFrame(update);
        draw();
    }
}

let draws = {
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
        //двери
        ctx.drawImage(img[8 + view.cam.roomSkin], cw * 0.1, ch * 0.1 + y, cw * 0.8, ch * 0.9);
        if(view.cam.room[1] != 0){
            ctx.drawImage(img[3 * (view.cam.room[1] - 1)], cw * 0.1773, ch * 0.271 + y, cw * 0.0763, ch * 0.612);
        }
        if(view.cam.room[2] != 0){
            ctx.drawImage(img[1 + 3 * (view.cam.room[2] - 1)], cw * 0.46, ch * 0.2521 + y, cw * 0.08, ch * 0.45);
        }
        if(view.cam.room[3] != 0){
            ctx.drawImage(img[2 + 3 * (view.cam.room[3] - 1)], cw * 0.7464, ch * 0.271 + y, cw * 0.0763, ch * 0.612);
        }

        //аниматроник
        if(view.cam.enemyShow !== false){
            if(view.cam.enemyShow == 0){
                ctx.drawImage(img[13], cw * 0.02, ch * 0.3 + y, cw * 1, ch * 2);
            }
            else if(view.cam.enemyShow == 1){
                ctx.drawImage(img[13], cw * 0.22, ch * 0.35 + y, cw * 0.15, ch * 0.5);
            }
            else if(view.cam.enemyShow == 2){
                ctx.drawImage(img[13], cw * 0.43, ch * 0.3 + y, cw * 0.15, ch * 0.5);
            }
            else{
                ctx.drawImage(img[13], cw * 0.63, ch * 0.35 + y, cw * 0.15, ch * 0.5);
            }
        }

        //карта
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
            ctx.font = `normal ${cw * 0.015}px impact`;
            ctx.fillText(i + 1, xcam + w * 0.2, ycam + w * 0.2);
        }

        //аниматроник (чит)
        if(showMap){
            ctx.fillStyle = '#B33';
            const lposcords = locate.lposToCords(enemy.lpos);
            ctx.fillRect(cw * 0.58 + (enemy.gpos % locate.w) * w + w * 0.4 + w * 0.3 * lposcords[0], ch - w * mh - ch * 0.05 + Math.floor(enemy.gpos / locate.w) * w + y + w * 0.4  + w * 0.3 * lposcords[1], w * 0.2, w * 0.2);
        }
    },
    arrow : function(x, y, w, n){
        const otst = view.sinusoida * sra * 0.1;
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
        ctx.font = `normal ${cw * 0.03}px impact`;
        ctx.fillText('BACK', cw * 0.5, ch * 0.95);
    },
    dark : function(){
        ctx.fillStyle = `rgba(0, 0, 0, ${1.5 - Math.abs(view.changeProgress) * 1.5})`;
        ctx.fillRect(0, 0, cw, ch);
    },
    arc : function(x, y, w){
        const otst = view.sinusoida * sra * 0.1;
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
        ctx.font = `normal ${cw * 0.03}px impact`;
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
        ctx.font = `normal ${cw * 0.03}px impact`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
    },
    tabletButton : function(){
        ctx.fillStyle = `rgba(${15}, ${15}, ${207}, ${0.5})`;
        ctx.strokeStyle = '#11D';
        ctx.lineWidth = sra * 0.06;
        ctx.fillRect(cw * 0.375, ch * 0.95, cw * 0.25, ch * 0.05);
        ctx.strokeRect(cw * 0.375, ch * 0.95, cw * 0.25, ch * 0.05 - sra * 0.03);
    }
};
 
function draw(){
    ctx.clearRect(0, 0, cw, ch);
	
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
        ctx.drawImage(img[1 + 3 * (view.room[0] - 1)], cw / 4, ch * -0.1, cw / 2, cw * 235 / 288);
        draws.peek();
    }
    else{//комната
        ctx.drawImage(img[8 + view.roomSkin], view.x * cw / -2, 0, cw * 1.5, ch);
        if(view.room[1] > 0 && view.room[1] < 4){
            ctx.drawImage(img[3 * (view.room[1] - 1)], view.x * cw / -2 + cw * 0.145, ch * 0.19, cw * 0.143, ch * 0.68);
        }
        if(view.room[2] > 0 && view.room[2] < 4){
            ctx.drawImage(img[1 + 3 * (view.room[2] - 1)], view.x * cw / -2 + cw * 0.675, ch * 0.169, cw * 0.15, ch * 0.5);
        }
        if(view.room[3] > 0 && view.room[3] < 4){
            ctx.drawImage(img[2 + 3 * (view.room[3] - 1)], view.x * cw / -2 + cw * 1.212, ch * 0.19, cw * 0.143, ch * 0.68);
        }
        if(view.room[1] == 4){
            ctx.drawImage(img[14], cw * 0.29 + view.x * cw / -2, ch * 0.56, cw * 0.25, ch * 0.25);
        }
        else if(view.room[3] == 4){
            ctx.drawImage(img[14], cw * 0.96 + view.x * cw / -2, ch * 0.56, cw * 0.25, ch * 0.25);
        }
        else if(view.room[0] == 4){
            ctx.drawImage(img[14], cw * 0.35 + view.x * cw / -2, ch * 0.4, cw * 0.8, ch * 0.6);
        }
    }

    if(view.enemyShow !== false && view.roomType != 1){//аниматроник
        if(view.enemyShow == 0){
            ctx.drawImage(img[13], cw * 0.4435 + view.x * cw / -2, ch * -0.2, cw * 0.613, cw);
        }
        else if(view.enemyShow == 1){
            ctx.drawImage(img[13], view.x * cw / -2 + cw * 0.23, ch * 0.25, cw * 0.2, cw * 0.3264);
        }
        else if(view.enemyShow == 2){
            ctx.drawImage(img[13], view.x * cw / -2 + cw * 0.675, ch * 0.21, cw * 0.15, cw * 0.2448);
        }
        else{
            ctx.drawImage(img[13], view.x * cw / -2 + cw * 1.07, ch * 0.25, cw * 0.2, cw * 0.3264);
        }
    }

    if(view.roomType == 2){//замочная скважина
        ctx.drawImage(img[12], plx - cw, ply - ch, cw * 2, ch * 2);
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

    if(view.cursorType >= 0 && view.cursorType <= 3){//курсор стрелочка
        draws.arrow(plx, ply, sra * 0.3, view.cursorType);
    }


    if(view.changeProgress < 1){//затемнение
        draws.dark();
    }

    if(view.cursorType == 4){//курсор кружок
        draws.arc(plx, ply, sra * 0.3);
    }

    if(showLog){//данные для дебагинга
        draws.logs();
    }
}