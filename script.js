let mobile = 0;
if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
	mobile = 1;
}

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

window.addEventListener("resize",Resize);

if(mobile == 1){
	window.addEventListener("touchstart", function (e) { tm(e); });
	window.addEventListener("touchmove", function (e) { tm(e); });
	window.addEventListener("touchend", function (e) { tu(e); });
	function tm(e) {
		plx = e.changedTouches[0].clientX;
		ply = e.changedTouches[0].clientY;
		click = 1;
	};
	
	function tu(e) {
		plx = null;
		ply = null;
		click = 0;
	};
}
else{
	window.addEventListener("keydown",function(e){KeyDown(e);});
	window.addEventListener("keyup",function(e){KeyUp(e);});
	window.addEventListener("mousedown",function(e){moused(e);});
	window.addEventListener("mousemove",function(e){mousem(e);});
	window.addEventListener("mouseup",function(e){mouseu(e);});
	
	function moused(e){
		plx = e.clientX;
		ply = e.clientY;
		click = 1;
	}
	
	function mousem(e){
		plx = e.clientX;
		ply = e.clientY;
	}
	
	function mouseu(e){
		click = 0;
	}
	
	function KeyDown(e){
	    switch(e.keyCode){
	        case 65: //Влево
	            break;
	 
	        case 68: //Вправо
	            break;
	 
	        case 87: //Вверх
	            break;
	 
	        case 83: //Вниз
				sd = 1;
	            break
	 
			case 81: //Q
				qd = 1;
	            break
				
			case 69: //E
				ed = 1;
	            break
				
	        case 27: //Esc
			escd = 1;
	            break;
	    }
	}
	
	function KeyUp(e){
	    switch(e.keyCode){
	        case 65: //Влево
	            break;
	 
	        case 68: //Вправо
	            break;
	 
	        case 87: //Вверх
	            break;
	 
	        case 83: //Вниз
			sd = 0;
	            break;
				
			case 81: //Q
				qd = 0;
	
	            break
				
			case 69: //E
				ed = 0;
	            break
	 
	        case 27: //Esc
			escd = 0;
	            break;
	    }
	}
}

var plx = 0;
var ply = 0;
var click = 0;
var sclick = 0;
var qd = 0;
var ed = 0;
var escd = 0;
var sd = 0;
var aianimatr = [0, 0, 0, 0, 0, 0, 0, 0];
let opis = [
	['Рука', '',
	'Тянется к детонатору',
	'на 4 камере.',
	'Используйте шокер,',
	'что бы отпугнуть'],
	
	['Тень', '',
	'Идет по западной',
	'части пиццерии',
	'в офис.',
	'Используйте дверь',
	'для защиты'],
	
	['Безглавый', '',
	'Идет по восточной',
	'части пиццерии',
	'в офис.',
	'Используйте дверь',
	'для защиты'],
	
	['Паук', '',
	'Появляется на',
	'случайной камере.',
	'Крадет энергию',
	'и ломает генератор.',
	'Используйте шокер,',
	'что бы отпугнуть'],
	
	['Улыбка', '',
	'Появляется на',
	'случайной камере.',
	'Преграждает обзор',
	'и ломает камеры.',
	'Уходит через',
	'некоторое время'],
	
	['Вентилятор', '',
	'Стоит в офисе.',
	'Перестает крутиться',
	'перед нападением.',
	'Поднимите любой',
	'планшет, что бы',
	'защититься'],
	
	['Бобр', '',
	'Ходит по всей пиццерии.',
	'Интересуется вспышками',
	'шокера. Если поблизости',
	'нет ударов тока, идет',
	'в офис охранника,',
	'игнорируя двери'],
	
	['Двуглавый', '',
	'Ходит по всей пиццерии.',
	'Боится вспышек',
	'шокера. Если поблизости',
	'нет ударов тока, идет',
	'в офис охранника,',
	'игнорируя двери'],
];
var win = 0;
let sra = (canvas.width + canvas.height) / 20;
let cw = canvas.width;
let ch = canvas.height;

function Resize(){
	canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    plrot.Update();
}

function Start(){
	let timer = setInterval(Update, 1000 / 60);
}

function Stop(){
    clearInterval(timer);
}

function random(a, b){
	return Math.ceil(Math.random() * (b - a + 1)) + (a - 1);
}

var animmenuh = 0;
var controlsmenuh = 0;
var sela = 0;
let score = 0;
var locat = 0;
var plansp = 0;
var cams = 1;
var power = 100;
var powerh = 100;
var usagep = 1;
var shock = 0;
var elec = 1;
var elecp = 0;
var gen = 0;
var repp = 0;
var cambr = 0;
var shockbr = 0;
var genbr = 0;


class Mainmenu{
	constructor(){
		this.x = 0;
		this.y = 0;
		this.img = new Image();
		this.img.src = 'images/mainmenu.png';
	}
	Update(){
		if(controlsmenuh == 0 && animmenuh == 0){
			if(plx <= canvas.width * 0.4 && ply <= canvas.height / 2 && click == 1 && sclick == 0){
				animmenuh = 1;
			}
			
			if(plx <= canvas.width * 0.7 && ply >= canvas.height / 2 && click == 1 && sclick == 0){
				controlsmenuh = 1;
			}
		}
	}
}

class Controlsmenu{
	constructor(){
		this.x = 0;
		this.y = 0;
		this.img = new Image();
		this.img.src = 'images/controls.png';
	}
	Update(){
		if(controlsmenuh == 1){
			if(plx <= canvas.width * 0.05 && ply <= canvas.height * 0.075 && click == 1){
				controlsmenuh = 0;
			}
		}
	}
}

class Animmenu{
	constructor(){
		this.x = 0;
		this.y = 0;
		this.img = new Image();
		this.img.src = 'images/vibor.png';
	}
	Update(){
		if(animmenuh == 1){
			if(plx >= canvas.width * 0.75 && ply >= canvas.height * 0.8 && click == 1 && sclick == 0){
				locat = 1;
			}
			
			if(plx <= canvas.width * 0.05 && ply <= canvas.height * 0.075 && click == 1){
				animmenuh = 0;
			}
		}
	}
}

class Icons{
	constructor(x, y, monstr){
		this.xs = x;
		this.ys = y;
		this.y = 0;
		this.x = 0;
		this.selcol = 0;
		this.img = new Image();
		this.img.src = 'images/icon' + monstr + '.png';
		this.m = monstr;
		this.targ = 0;
	}
	Update(){
		if(animmenuh == 1){
			this.x = canvas.width * this.xs;
			this.y = canvas.height * this.ys;
			
			if(plx >= this.x && plx <= this.x + canvas.width * 0.1 && ply >= this.y && ply <= this.y + canvas.height * 0.2 && click == 1){
				sela = this.m;
			}
			
			if(this.m == sela){
				if(plx >= canvas.width * 0.759 && plx <= canvas.width * 0.815 && ply >= canvas.height * 0.475 && ply <= canvas.height * 0.575 && click == 1 && sclick == 0){
					this.targ = 1;
				}
				if(plx >= canvas.width * 0.928 && plx <= canvas.width * 0.985 && ply >= canvas.height * 0.48 && ply <= canvas.height * 0.575 && click == 1 && sclick == 0){
					this.targ = 2;
				}
				
				if(plx >= canvas.width * 0.947 && plx <= canvas.width * 0.974 && ply >= canvas.height * 0.6 && ply <= canvas.height * 0.648 && click == 1 && sclick == 0){
					aianimatr[sela] = 20;
				}
				if(plx >= canvas.width * 0.947 && plx <= canvas.width * 0.974 && ply >= canvas.height * 0.66 && ply <= canvas.height * 0.71 && click == 1 && sclick == 0){
					aianimatr[sela] = 0;
				}
				
				if(this.targ == 1){
					if(aianimatr[this.m] > 0 && plx >= canvas.width * 0.759 && plx <= canvas.width * 0.815 && ply >= canvas.height * 0.475 && ply <= canvas.height * 0.575 && click == 1){
						if(this.selcol <= 0){
							aianimatr[sela] -= 1;
							this.selcol = 8;
						}
						else{
							this.selcol -= 1;
						}
					}
					else{
						if(this.selcol != 0){
							this.selcol = 0;
						}
					}
				}
				if(this.targ == 2){
					if(aianimatr[this.m] < 20 && plx >= canvas.width * 0.928 && plx <= canvas.width * 0.985 && ply >= canvas.height * 0.48 && ply <= canvas.height * 0.575 && click == 1){
						if(this.selcol <= 0){
							aianimatr[sela] += 1;
							this.selcol = 8;
						}
						else{
							this.selcol -= 1;
						}
					}
					else{
						if(this.selcol != 0){
							this.selcol = 0;
						}
					}
				}
				
				if(click == 0){
					this.targ = 0;
				}
				
				if(plx >= canvas.width * 0.746 && plx <= canvas.width * 0.831 && ply >= canvas.height * 0.61 && ply <= canvas.height * 0.693 && click == 1 && sclick == 0){
					sela = -1;
				}
			}
			
			
			if(sela == -1 && this.m == 0){
				if(plx >= canvas.width * 0.759 && plx <= canvas.width * 0.815 && ply >= canvas.height * 0.475 && ply <= canvas.height * 0.575 && click == 1 && sclick == 0){
					this.targ = 1;
					if(isNaN(aianimatr.reduce(function(a, b){ return (a === b) ? a : NaN; }))){
						for(let i = 0; i < aianimatr.length; i++){
							aianimatr[i] = 0;
						}
					}
				}
				if(plx >= canvas.width * 0.928 && plx <= canvas.width * 0.985 && ply >= canvas.height * 0.48 && ply <= canvas.height * 0.575 && click == 1 && sclick == 0){
					this.targ = 2;
					if(isNaN(aianimatr.reduce(function(a, b){ return (a === b) ? a : NaN; }))){
						for(let i = 0; i < aianimatr.length; i++){
							aianimatr[i] = 0;
						}
					}
				}
				
				if(plx >= canvas.width * 0.947 && plx <= canvas.width * 0.974 && ply >= canvas.height * 0.6 && ply <= canvas.height * 0.648 && click == 1 && sclick == 0){
					for(let i = 0; i < aianimatr.length; i++){
						aianimatr[i] = 20;
					}
				}
				if(plx >= canvas.width * 0.947 && plx <= canvas.width * 0.974 && ply >= canvas.height * 0.66 && ply <= canvas.height * 0.71 && click == 1 && sclick == 0){
					for(let i = 0; i < aianimatr.length; i++){
						aianimatr[i] = 0;
					}
				}
				
				if(this.targ == 1){
					if(aianimatr[0] > 0 && plx >= canvas.width * 0.759 && plx <= canvas.width * 0.815 && ply >= canvas.height * 0.475 && ply <= canvas.height * 0.575 && click == 1){
						if(this.selcol <= 0){
							for(let i = 0; i < aianimatr.length; i++){
								aianimatr[i] -= 1;
							}
							this.selcol = 8;
						}
						else{
							this.selcol -= 1;
						}
					}
					else{
						if(this.selcol != 0){
							this.selcol = 0;
						}
					}
				}
				if(this.targ == 2){
					if(aianimatr[0] < 20 && plx >= canvas.width * 0.928 && plx <= canvas.width * 0.985 && ply >= canvas.height * 0.48 && ply <= canvas.height * 0.575 && click == 1){
						if(this.selcol <= 0){
							for(let i = 0; i < aianimatr.length; i++){
								aianimatr[i] += 1;
							}
							this.selcol = 8;
						}
						else{
							this.selcol -= 1;
						}
					}
					else{
						if(this.selcol != 0){
							this.selcol = 0;
						}
					}
				}
				
				if(click == 0){
					this.targ = 0;
				}
			}
			
			if(this.m == 0){
				if(aianimatr[0] > 0){
					score = 2 + aianimatr[0];
				}
				else{
					score = 0;
				}
			}
			else{
				if(aianimatr[this.m] > 0){
					score += 2 + aianimatr[this.m];
				}
			}
		}
	}
}

class Winmenu{
	constructor(){
		this.i = 0;
		this.i1 = 0;
		this.img = new Image();
		this.img.src = '';
	}
	Update(){
		if(win != 0){
			if(win == 1){
				this.img.src = 'images/winpan.png';
			}
			if(win == -1){
				this.img.src = 'images/losepan.png';
			}
			if(this.i == 0){
				this.i1 = 120;
				this.i = 1;
			}
			
			if(this.i1 <= 0){
				this.i = 0;
				win = 0;
				animmenuh = 0;
				time.stime = -60;
				hand.prog = 0;
				shadow.prog = 0;
				shadow.pol = 4;
				nohead.prog = 0;
				nohead.pol = 4;
				powerh = 100;
				door[0].down = -1;
				door[1].down = -1;
				plansp = 0;
				plans.y = ch;
				cams = 1;
				elec = 1;
				repb.plp = 0;
				elecp = 0;
				gen = 0;
				repp = 0;
				cambr = 0;
				shockbr = 0;
				genbr = 0;
				camrep.br = random(1320, 2400);
				shockrep.br = random(3, 10);
				genrep.br = random(1320, 3600);
				wallimg.src = 'images/wall.png';
				shockb.img.src = 'images/shockb.png';
				genb.img.src = 'images/genoff';
				elecpl.x = cw;
				reppl.x = -cw;
				ve.agr = 0;
				ve.splansp = [0, 0, 0];
				bobr.pol = 3;
				bobr.prog = random(300, 1200) + (900 - aianimatr[5] * 45);
				scrimer.monstr = null;
			}
			else{
				this.i1 -= 1;
			}
		}
	}
}

class Fullscreen{
	constructor(){
		this.x = 0;
		this.y = 0;
		this.img = new Image();
		this.img.src = 'images/fullsb.png';

	}
	Update(){
		this.x = cw - sra;
		
		if(plx >= this.x && ply <= sra && click == 1 && sclick == 0){
			canvas.requestFullscreen();
		}
	}
}

class Ofis{
	constructor(){
		this.x = 0;
		this.y =0;
		this.img = new Image();
		this.img.src = 'images/ofis.png';
		this.light = 1;
	}
	Update(){
		if(plx < canvas.width / 4 && this.x < 0 && plansp == 0 && elecp == 0 && repp == 0 && (click == 1 || mobile == 0)){
			this.x += (canvas.width / 4 - plx) / 10;
		}
		
		if(plx > canvas.width * 0.75 && this.x >  -(canvas.width / 2) && plansp == 0 && elecp == 0 && repp == 0){
			this.x -= (plx - canvas.width * 0.75) / 10;
		}
		
		
		if(this.x > 0){
			this.x = 0
		}
		
		if(this.x < -(canvas.width / 2)){
			this.x = -(canvas.width / 2);
		}
		
		if(elec == 1 && this.light == 0){
			this.light = 1;
		}
		
		if(elec == 0 && this.light == 1){
			this.light = 0;
		}
		
		if(this.light == 0){
			this.img.src = 'images/ofisoff.png';
		}
		else{
			this.img.src = 'images/ofis.png';
		}
	}
}

class Ve{
	constructor(){
		this.x = 0;
		this.y = 0;
		this.img = new Image();
		this.img.src = 'images/ve.png';
		this.lop = new Image();
		this.lop.src = 'images/ve1.png';
		this.rot = 0;
		this.agr = 0;
		this.splansp = [0, 0, 0];
	}
	Update(){
		this.x = ofis.x + cw * 0.95 - sra / 2;
		this.y = ofis.y + canvas.height * 0.7 - sra;
		
		if(elec == 1 && this.agr == 0){
			this.rot += 10;
		}
		
		if(aianimatr[5] > 0){
			if((plansp == 0 && this.splansp[0] == 1) || (repp == 0 && this.splansp[1] == 1) || (elecp == 0 && this.splansp[2] == 1) && elec == 1){
				if(random(0, 5 + 20 - aianimatr[5]) == 0){
					this.agr = 60 + (120 - (aianimatr[5] * 6));
				}
			}
			
			if(plansp == 0 && repp == 0 && elecp == 0 && this.agr > 0){
				this.agr -= 1;
				if(this.agr <= 0){
					scrimer.monstr = 5;
				}
			}
			
			if((plansp == 1 || repp == 1 || elecp == 1) && this.agr > 0){
				this.agr = 0;
			}
			
			this.splansp[0] = plansp;
			this.splansp[1] = repp;
			this.splansp[2] = elecp;
		}
		
		
		if(this.rot >= 360){
			this.rot -= 360;
		}
	}
}

class Doors{
	constructor(x, image, qe){
		this.ogo = x;
		this.qe = qe;
		this.x = ofis.x + canvas.width * x;
		this.y =canvas.height * 0.1;
		this.img = new Image();
		this.img.src = image;
		if(qe == 0 && mobile == 1){
			this.bl = new Image();
			this.bl.src = 'images/ldoor.png';
			this.br = new Image();
			this.br.src = 'images/rdoor.png';
			this.op = 1;
		}
		this.down = -1;
		this.downh = 0;
		this.qd1 = 0;
		this.ed1 = 0;
	}
	Update(){
		this.x = ofis.x + canvas.width * this.ogo;
		
		if(mobile == 1){
			if(this.qe == 0 && plx <= canvas.width / 10 && ply <= canvas.height / 8 && click == 1 && elec == 1 && sclick == 0){
				if(this.qd1 == 1 && bobr.pol > 0){
					this.qd1 = 0;
					this.down = this.down * -1;
				}
				else if(bobr.pol > 0){
					this.qd1 = 1;
					this.down = this.down * -1;
				}
			}
			
			if(this.qe == 1 && plx >= canvas.width * 0.9 && ply <= canvas.height / 8 && click == 1 && elec == 1 && sclick == 0){
				if(this.ed1 == 1 && bobr.pol > 0){
					this.ed1 = 0;
					this.down = this.down * -1;
				}
				else if(bobr.pol > 0){
					this.ed1 = 1;
					this.down = this.down * -1;
				}
			}
		}
		else{
			if(qd == 0){
				this.qd1 = 0;
			}
			
			if(ed == 0){
				this.ed1 = 0;
			}
			
			if(this.qe == 0 && qd == 1 && this.qd1 == 0 && elec == 1 && bobr.pol != 0){
				this.qd1 = 1;
				this.down = this.down * -1;
			}
			
			if(this.qe == 1 && ed == 1 && this.ed1 == 0 && elec == 1 && bobr.pol != -1){
				this.ed1 = 1;
				this.down = this.down * -1;
			}
		}
		
		if(elec == 0){
			this.down = -1;
			this.op = 0;
		}
		else{
			this.op = 1;
		}
		
		if(this.downh <= 0.755 && this.downh >= 0){
			this.downh += this.down / 14;
		}
		
		if(this.downh > 0.755){
			this.downh = 0.755;
		}
		
		if(this.downh < 0){
			this.downh = 0;
		}

		this.y = canvas.height * (-0.72 + this.downh);
	}
}



class Camb{
	constructor(){
		this.img = new Image();
		this.img.src = 'images/camb.png';
		this.x = canvas.width / 3;
		this.y = canvas.height - canvas.height / 12;
		this.plp = 0;
	}
	Update(){
		this.x = canvas.width / 3;
		this.y = canvas.height - canvas.height / 12;
		
		if(plx >= this.x && plx <= this.x + canvas.width / 3 && ply >= this.y && elec == 1 && elecp == 0 && repp == 0){
			if(this.plp == 0){
				this.plp = 1;
				if(plansp == 0){
					plansp = 1;
				}
				else{
					plansp = 0;
				}
			}
		}
		else{
			this.plp = 0;
		}
		
		if(elec == 0 || elecp == 1 || repp == 1){
			plansp = 0;
			this.img.src = 'images/usage0.png';
		}
		else{
			this.img.src = 'images/camb.png';
		}
	}
}

class Plans{
	constructor(){
		this.x = 0;
		this.y = 0;
		this.img = new Image();
		this.img.src = 'images/plans.png';
		this.op = 0;
		this.downh = 1;
	}
	Update(){
		if(plansp == 1){
			if(this.y > 0){
				this.op = 1;
				this.y -= canvas.height * 0.08;
			}
		}
		else if(this.y < ch){
			this.y += canvas.height * 0.08;
		}
		
		if(this.y < 0){
			this.y = 0;
		}
		
		if(this.y > canvas.height){
			this.y = canvas.height;
		}
		
		if(this.y >= canvas.height && plansp == 0){
			this.op = 0;
		}
	}
}

class Look{
	constructor(){
		this.x = 0;
		this.y = plans.y;
		this.img = []
		for(let i = 0; i < 7; i++){
			this.img.push(new Image());
			this.img[i].src = 'images/cam' +(i + 1) + '.png';
		}
		this.img.push(new Image());
		this.img[7].src = 'images/usage0.png';
		this.imgop = 1;
	}
	Update(){
		this.x = canvas.width * 0.042;
		this.y = plans.y + canvas.height * 0.06;
		if(cambr == 0){
			this.imgop = cams - 1;
		}
		else{
			this.imgop = 7;
		}
	}
}


class Camselectb{
	constructor(camn, x, y){
		this.x = 0;
		this.y = plans.y;
		this.img = new Image();
		this.img.src = 'images/camb4.png';
		this.camn = camn;
		this.xc = x;
		this.yc = y;
	}
	Update(){
		this.x = canvas.width * this.xc;
		this.y = plans.y + canvas.height * this.yc;
		if(plx >= this.x && plx <= this.x + canvas.width * 0.04 && ply >= this.y && ply <= this.y + canvas.height * 0.04 && click == 1 && plansp == 1){
			cams = this.camn;
		}
		
		if(cams == this.camn){
			this.img.src = 'images/camb' + this.camn + 's.png';
		}
		else{
			this.img.src = 'images/camb' + this.camn + '.png';
		}
	}
}

class Usage{
	constructor(){
		this.x = 0;
		this.y = 0;
		this.img = new Image();
		this.img.src = 'images/usage1.png';
	}
	Update(){
		this.x = sra;
		this.y = ch * 0.97 - sra * 0.12;
		
		
		if(elec == 1){
			usagep = 1 + plansp + (door[0].down + 1) / 2 + (door[1].down + 1) / 2 + camrep.go + shockrep.go + genrep.go + spider.go;
			
			powerh -= usagep * 0.004;
			
			canvas.style.background = '#1E1E1E';
		}
		else{
			usagep = 0;
			
			canvas.style.background = '#000000';
		}
		
		power = Math.ceil(powerh);
		
		
		this.img.src = 'images/usage' + usagep + '.png';
		
		if(escd == 1){
			powerh = 3;
		}
		
		if(power <= 0){
			elec = 0;
		}
		
		if(gen == 1 && power < 100){
			powerh += 0.008;
		}
		
		
		
	}
}


wallimg = new Image();
wallimg.src = 'images/wall.png';

class Hand{
	constructor(){
		this.x = canvas.width * 0.63;
		this.y = canvas.height * 0.36 + plans.y;
		this.img = new Image();
		this.img.src = 'images/hand.png';
		this.prog = 0;
	}
	Update(){
		
		this.prog += (1.7 + aianimatr[0] * 0.15) * 0.1;
		
		this.x = canvas.width * 0.63 - this.prog * canvas.width / 1550;
		this.y = canvas.height * 0.36 + plans.y
		
		if(this.prog >= 770){
			scrimer.monstr = 0;
		}
		
		if(shock == 4){
			this.prog = 0;
		}
	}
}

class Shock{
	constructor(){
		this.x = canvas.width * 0.7;
		this.y = canvas.height * 0.1 + plans.y;
		this.img = new Image();
		this.img.src = 'images/shockb.png';
		this.i = 0;
	}
	Update(){
		this.x = canvas.width * 0.7;
		this.y = canvas.height * 0.1 + plans.y;
		
		if(plx >= this.x && plx <= this.x + canvas.width * 0.2 && ply >= this.y && ply <= this.y + canvas.height * 0.2 && click == 1 && sclick == 0 && this.i <= 0 && powerh >= 3 && shockbr == 0){
			shock = cams;
			this.i = 40;
			powerh -= 3;
		}
		
		if(this.i > 0){
			this.i -= 1;
		}
		else{
			shock = 0;
		}
		
	}
}


class Shockflash{
	constructor(){
		this.op = 0;
	}
	Update(){
		if(shockb.i > 0 && shock == cams){
			this.op = shockb.i / 40;
		}
	}
}

class Elecb{
	constructor(){
		this.x = canvas.width * 0.947;
		this.y = canvas.height * 0.66;
		this.img = new Image();
		this.img.src = 'images/elecb.png';
		this.op = 1;
		this.plp = 0;
	}
	Update(){
		this.x = canvas.width * 0.947;
		this.y = canvas.height * 0.66;
		
		if(ofis.x <= -(canvas.width / 2) && plansp == 0){
			this.op = 1;
		}
		else{
			this.op = 0;
		}
		
		if(plx >= this.x &&  ply >= this.y && this.op == 1 && plansp == 0){
			if(this.plp == 0){
				this.plp = 1;
				if(elecp == 0){
					elecp = 1;
				}
				else{
					elecp = 0;
				}
			}
		}
		else{
			this.plp = 0;
		}
	}
}

class Elecpl{
	constructor(){
		this.x = canvas.width;
		this.y = 0;
		this.img = new Image();
		this.img.src = 'images/elecpan.png';
		this.op = 0;
	}
	Update(){
		if(elecp == 1){
			if(this.x > 0){
				this.op = 1;
				this.x -= canvas.width / 15;
			}
		}
		else if(this.x < cw){
			this.x += canvas.width / 15
		}
		
		if(this.x <= 0){
			this.x = 0;
		}
		
		if(this.x > canvas.width){
			this.x = canvas.width;
		}
		
		if(this.x >= canvas.width && elecp == 0){
			this.op = 0;
		}
	}
}

class Elecsb{
	constructor(){
		this.x = canvas.width * 0.1 + elecpl.x;
		this.y = canvas.height * 0.3;
		this.img = new Image();
		this.img.src = 'images/elecon.png';
	}
	Update(){
		this.x = canvas.width * 0.1 + elecpl.x;
		this.y = canvas.height * 0.3;
		
		if(plx >= this.x && plx <= this.x + canvas.width * 0.3 && ply >= this.y && ply <= this.y + canvas.height * 0.3 && click == 1 && sclick == 0 && gen == 0 && power > 0){
			if(elec == 1){
				elec = 0;
			}
			else{
				elec = 1;
			}
			
			
		}
		
		if(elec == 1){
			this.img.src = 'images/elecon.png';
		}
		else{
			this.img.src = 'images/elecoff.png';
		}
		
		if(gen == 1){
			elec = 0;
		}
		
		
	}
}


class Genb{
	constructor(){
		this.x = canvas.width * 0.6 + elecpl.x;
		this.y = canvas.height * 0.3;
		this.img = new Image();
		this.img.src = 'images/genoff.png';
	}
	Update(){
		this.x = canvas.width * 0.6 + elecpl.x;
		this.y = canvas.height * 0.3;
		
		if(plx >= this.x && plx <= this.x + canvas.width * 0.3 && ply >= this.y && ply <= this.y + canvas.height * 0.3 && click == 1 && sclick == 0 && elec == 0 && genbr == 0){
			if(gen == 1){
				gen = 0;
			}
			else{
				gen = 1;
			}
		}
		
		if(gen == 1){
			this.img.src = 'images/genon.png';
		}
		else{
			this.img.src = 'images/genoff.png';
		}
		
		if(elec == 1 || genbr == 1){
			gen = 0;
		}
		
		
	}
}

class Shadow{
	constructor(){
		this.x = 0;
		this.y = 0;
		this.size = 1;
		this.img = new Image();
		this.img.src = 'images/shadow1.png';
		this.pol = 4;
		this.op = 0;
		this.prog = 0;
		this.i = 1;
		this.i2 = 1;
	}
	Update(){
		if(aianimatr[1] > 0){
			if(this.pol == cams && plansp == 1 && cambr == 0 && this.pol != smile.pol){
				this.op = 1;
			}
			else{
				this.op = 0;
			}
			
			
			if(this.pol == 3){
				this.size = 0.5;
				this.x = canvas.width * 0.32;
				this.y = canvas.height * 0.38 + plans.y;
				this.img.src ='images/shadow1.png';
			}
			
			if(this.pol == 2){
				this.size = 2;
				this.x = canvas.width * 0.2;
				this.y = canvas.height * 0.25 + plans.y;
				this.img.src ='images/shadow1.png';
			}
			
			if(this.pol == 1){
				this.size = 1;
				this.x = canvas.width * 0.25;
				this.y = canvas.height * 0.32 + plans.y;
				this.img.src ='images/shadow2.png';
			}
			
			
			if(this.pol == 0){
				this.size = 1.8;
				this.x = canvas.width * -0.08 + ofis.x;
				this.y = canvas.height * 0.18;
				if(elec == 1){
					this.img.src ='images/shadow3.png';
				}
				else{
					this.img.src ='images/shadow31.png';
				}
			}
			
			if(this.prog <= 0 && this.pol > 0){
				
				if(this.pol == 1 && bobr.pol == 0){}
				else{
					this.pol -= 1;
				}
				this.prog = ((Math.ceil(Math.random() * 20) + 4) + (20 - aianimatr[1])) * 70;
			}
			else{
				this.prog -= 1;
			}
			
			if(this.pol == 0){
				if(door[0].down == 1){
					
					this.i2 = 1;
					
					if(this.i == 1){
						this.prog = (Math.ceil(Math.random() * 10) + 5) * 50;
						this.i = 0;
					}
					
					if(this.prog <= 0){
						this.pol = 4;
						this.prog = 0;
					}
					else{
						this.prog -= 1;
					}
				}
				else{
					this.i = 1;
					
					if(this.i2 == 1){
						this.prog = (Math.ceil(Math.random() * 10) + 10) * (70 - aianimatr[1]);
						this.i2 = 0;
					}
					
					if(this.prog <= 0){
						scrimer.monstr = 1;
					}
					else{
						this.prog -= 1;
					}
				}
			}
		}
	}
}

class Time{
	constructor(){
		this.stime = -60;
		this.time = 0;
		this.rtime = 0;
		this.mtime = 0;
	}
	Update(){
		this.stime += 1;
		this.time = Math.ceil(this.stime / 60);
		if(this.time < 60){
			this.rtime = 12;
		}
		else{
			this.rtime = '0' + String(Math.floor(this.time / 60));
		}
		
		if(this.rtime >= 6 && this.rtime != 12){
			win = 1;
			locat = 0;
		}
		
		if(this.time % 60 < 10){
			this.mtime = '0' + String(this.time % 60);
		}
		else{
			this.mtime = this.time % 60;
		}
	}
}

class Nohead{
	constructor(){
		this.x = 0;
		this.y = 0;
		this.size = 1;
		this.img = new Image();
		this.img.src = 'images/nohead1.png';
		this.pol = 4;
		this.cpol = 0;
		this.op = 0;
		this.prog = 0;
		this.i = 1;
		this.i2 = 1;
	}
	Update(){
		if(aianimatr[2] > 0){
			if(this.pol == 3){
				this.cpol = 3;
			}
			if(this.pol == 2){
				this.cpol = 6;
			}
			if(this.pol == 1){
				this.cpol = 5;
			}
			if(this.pol == 0){
				this.cpol = 0;
			}
			
			if(this.cpol == cams && plansp == 1 && cambr == 0 && smile.pol != this.cpol){
				this.op = 1;
			}
			else{
				this.op = 0;
			}
			
			
			if(this.pol == 3){
				this.size = 1.2;
				this.x = canvas.width * 0.12;
				this.y = canvas.height * 0.33 + plans.y;
				this.img.src ='images/nohead1.png';
			}
			
			if(this.pol == 2){
				this.size = 1.2;
				this.x = canvas.width * 0.3;
				this.y = canvas.height * 0.18 + plans.y;
				this.img.src ='images/nohead2.png';
			}
			
			if(this.pol == 1){
				this.size = 0.5;
				this.x = canvas.width * 0.08;
				this.y = canvas.height * 0.2 + plans.y;
				this.img.src ='images/nohead3.png';
			}
			
			
			if(this.pol == 0){
				this.size = 1.6;
				this.x = canvas.width * 1.37 + ofis.x;
				this.y = canvas.height * 0.1;
				if(elec == 1){
					this.img.src ='images/nohead3.png';
				}
				else{
					this.img.src ='images/nohead31.png';
				}
			}
			

			if(this.prog <= 0 && this.pol > 0){
				if(this.cpol != 5 && bobr.pol != -1){
					this.pol -= 1;
				}
				this.prog = ((Math.ceil(Math.random() * 20) + 4) + (20 - aianimatr[2])) * 70;
			}
			else{
				this.prog -= 1;
			}
			
			
			
			if(this.pol == 0){
				if(door[1].down == 1){
					
					this.i2 = 1;
					
					if(this.i == 1){
						this.prog = (Math.ceil(Math.random() * 10) + 5) * 50;
						this.i = 0;
					}
					
					if(this.prog <= 0){
						this.pol = 4;
						this.prog = 0;
					}
					else{
						this.prog -= 1;
					}
				}
				else{
					this.i = 1;
					
					if(this.i2 == 1){
						this.prog = (Math.ceil(Math.random() * 10) + 10) * (70 - aianimatr[2]);
						this.i2 = 0;
					}
					
					if(this.prog <= 0){
						scrimer.monstr = 2;
					}
					else{
						this.prog -= 1;
					}
				}
			}
		}
	}
}

class Repb{
	constructor(){
		this.x = canvas.width * 0.002;
		this.y = canvas.height * 0.66;
		this.img = new Image();
		this.img.src = 'images/reb.png';
		this.op = 1;
		this.plp = 0;
	}
	Update(){
		this.x = canvas.width * 0.002;
		this.y = canvas.height * 0.66;
		if(ofis.x >= 0 && elec == 1 && plansp == 0){
			this.op = 1;
		}
		else{
			this.op = 0;
		}
		
		if(plx <= this.x + canvas.width / 20 &&  ply >= this.y && this.op == 1 && plansp == 0 && elec == 1){
			if(this.plp == 0){
				this.plp = 1;
				if(repp == 0){
					repp = 1;
				}
				else{
					repp = 0;
				}
			}
		}
		else{
			this.plp = 0;
		}
		
		if(elec == 0){
			repp = 0;
		}
	}
}

class Reppl{
	constructor(){
		this.x = canvas.width;
		this.y = 0;
		this.img = new Image();
		this.img.src = 'images/reppl.png';
		this.op = 0;
	}
	Update(){
		if(repp == 1){
			if(this.x < 0){
				this.op = 1;
				this.x += canvas.width / 15;
			}
		}
		else if(this.x > -cw){
			this.x -= canvas.width / 15
		}
		
		if(this.x >= 0){
			this.x = 0;
		}
		
		if(this.x < -canvas.width){
			this.x = -canvas.width;
		}
		
		if(this.x <= -canvas.width && repp == 0){
			this.op = 0;
		}
	}
}

class Camrep{
	constructor(){
		this.x = 0;
		this.y = 0;
		this.img = new Image();
		this.img.src = 'images/camsrep.png';
		this.prog = 0;
		this.go = 0;
		this.i = 0;
		this.i2 = 0;
		this.br = random(1320, 2400);
	}
	Update(){
		this.x = canvas.width * 0.1 + reppl.x;
		this.y = canvas.height * 0.3;
		
		if(plx >= this.x && plx <= this.x + canvas.width * 0.2 && ply >= this.y && ply <= this.y + canvas.height * 0.3 && click == 1 && sclick == 0 && elec == 1 && shockrep.go == 0 && genrep.go == 0){
			if(this.go == 1){
				this.go = 0;
			}
			else{
				this.go = 1;
				this.i2 = 0;
			}
		}
		
		if(this.go == 1){
			this.img.src = 'images/stoprep.png';
			shockrep.img.src = 'images/shockrep0.png';
			genrep.img.src = 'images/genoff.png';
			if(this.i == 0){
				this.i = 1;
				this.prog = 300;
			}
			else{
				this.prog -= 1;
			}
			if(this.prog <= 0){
				this.go = 0;
				cambr = 0;
				this.i = 0;
				this.br = (Math.ceil(Math.random() * 10) + 10) * 120;
				wallimg.src = 'images/wall.png';
				shockrep.img.src = 'images/shockrep.png';
				genrep.img.src = 'images/genon.png';
				this.img.src = 'images/camsrep.png';
				
			}
		}
		else{
			this.i = 0;
			this.prog = 0;
			if(this.i2 == 0){
				this.i2 = 1;
				this.img.src = 'images/camsrep.png';
				shockrep.img.src = 'images/shockrep.png';
				genrep.img.src = 'images/genon.png';
			}
		}
		
		if(elec == 0 || shockrep.go == 1 || genrep.go == 1){
			this.go = 0;
		}
		
		if(this.br <= 0){
			cambr = 1;
		}
		else{
			if(plansp == 1){
				this.br -= 1;
			}
		}
		
		if(cambr == 1){
			wallimg.src = 'images/wallerr.png';
		}
	}
}

class Shockrep{
	constructor(){
		this.x = 0;
		this.y = 0;
		this.img = new Image();
		this.img.src = 'images/shockrep.png';
		this.prog = 0;
		this.go = 0;
		this.i = 0;
		this.i2 = 0;
		this.br = random(3, 10);
	}
	Update(){
		this.x = canvas.width * 0.4 + reppl.x;
		this.y = canvas.height * 0.3;
		
		if(plx >= this.x && plx <= this.x + canvas.width * 0.2 && ply >= this.y && ply <= this.y + canvas.height * 0.3 && click == 1 && sclick == 0 && elec == 1 && camrep.go == 0 && genrep.go == 0){
			if(this.go == 1){
				this.go = 0;
			}
			else{
				this.go = 1;
				this.i2 = 0;
			}
		}
		
		if(this.go == 1){
			this.img.src = 'images/stoprep.png';
			camrep.img.src = 'images/camsrep0.png';
			genrep.img.src = 'images/genoff.png';
			if(this.i == 0){
				this.i = 1;
				this.prog = 300;
			}
			else{
				this.prog -= 1;
			}
			if(this.prog <= 0){
				this.go = 0;
				shockbr = 0;
				this.i = 0;
				this.br = Math.ceil(Math.random() * 8) + 2;
				shockb.img.src = 'images/shockb.png';
				camrep.img.src = 'images/camsrep.png';
				genrep.img.src = 'images/genon.png';
				this.img.src = 'images/shockrep.png';
				
			}
		}
		else{
			this.i = 0;
			this.prog = 0;
			if(this.i2 == 0){
				this.i2 = 1;
				this.img.src = 'images/shockrep.png';
				camrep.img.src = 'images/camsrep.png';
				genrep.img.src = 'images/genon.png';
			}
		}
		
		if(elec == 0 || camrep.go == 1 || genrep.go == 1){
			this.go = 0;
		}
		
		if(this.br <= 0){
			shockbr = 1;
		}
		else{
			if(shockb.i == 39){
				this.br -= 1;
			}
		}
		
		if(shockbr == 1){
			shockb.img.src = 'images/shockberr.png';
		}
		
	}
}

class Genrep{
	constructor(){
		this.x = 0;
		this.y = 0;
		this.img = new Image();
		this.img.src = 'images/genon.png';
		this.prog = 0;
		this.go = 0;
		this.i = 0;
		this.i2 = 0;
		this.br = random(1320, 3600);
	}
	Update(){
		this.x = canvas.width * 0.7 + reppl.x;
		this.y = canvas.height * 0.3;
		
		if(plx >= this.x && plx <= this.x + canvas.width * 0.2 && ply >= this.y && ply <= this.y + canvas.height * 0.3 && click == 1 && sclick == 0 && elec == 1 && shockrep.go == 0 && camrep.go == 0){
			if(this.go == 1){
				this.go = 0;
			}
			else{
				this.go = 1;
				this.i2 = 0;
			}
		}
		
		if(this.go == 1){
			this.img.src = 'images/stoprep.png';
			shockrep.img.src = 'images/shockrep0.png';
			camrep.img.src = 'images/camsrep0.png';
			if(this.i == 0){
				this.i = 1;
				this.prog = 300;
			}
			else{
				this.prog -= 1;
			}
			if(this.prog <= 0){
				this.go = 0;
				genbr = 0;
				this.i = 0;
				this.br = (Math.ceil(Math.random() * 20) + 10) * 120;
				genb.img.src = 'images/genoff';
				shockrep.img.src = 'images/shockrep.png';
				camper.img.src = 'images/camsrep.png';
				this.img.src = 'images/genon.png';
				
			}
		}
		else{
			this.i = 0;
			this.prog = 0;
			if(this.i2 == 0){
				this.i2 = 1;
				this.img.src = 'images/genon.png';
				shockrep.img.src = 'images/shockrep.png';
				camrep.img.src = 'images/camsrep.png';
			}
		}
		
		if(elec == 0 || shockrep.go == 1 || camrep.go == 1){
			this.go = 0;
		}
		
		if(this.br <= 0){
			genbr = 1;
		}
		else{
			if(gen == 1){
				this.br -= 1;
			}
		}
		
		if(genbr == 1){
			genb.img.src = 'images/generr.png';
		}
	}
}

class Predrep{
	constructor(o){
		this.x = 0;
		this.y = canvas.height * 0.18;
		this.op = 0;
		this.o = o;
		this.img = new Image();
		this.img.src = 'images/voskl.png';
	}
	Update(){
		this.y = canvas.height * 0.18;
		
		if(this.o == 'cam'){
			if(cambr == 1){
				this.op = 1;
				this.x = canvas.width * 0.176 + reppl.x;
			}
			else{
				this.op = 0;
			}
		}
		
		if(this.o == 'shock'){
			if(shockbr == 1){
				this.op = 1;
				this.x = canvas.width * 0.476 + reppl.x;
			}
			else{
				this.op = 0;
			}
		}
		
		if(this.o == 'gen'){
			if(genbr == 1){
				this.op = 1;
				this.x = canvas.width * 0.776 + reppl.x;
			}
			else{
				this.op = 0;
			}
		}
	}
}

class Spider{
	constructor(){
		this.x = 0;
		this.y = 0;
		this.img = new Image();
		this.img.src = 'images/spider.png';
		this.op = 0;
		this.prog = (Math.ceil(Math.random() * 20) + 5 + (20 - aianimatr[3])) * 60;
		this.pol = 0;
		this.go = 0;
		this.size = 1;
		this.i = 0;
	}
	Update(){
		if(power > 0){
			if(this.prog <= 0){
				if(this.i == 0){
					this.pol = Math.ceil(Math.random() * 7);
					this.i = 1;
					this.go = 1;
				}
				
				if(shock == this.pol){
					this.go = 0;
					this.i = 0;
					this.pol = 0;
					this.prog = (Math.ceil(Math.random() * 20) + 5 + (20 - aianimatr[3])) * 60;
				}
					
			}
			else{
				this.prog -= 1;
			}
			
			if(cams == this.pol && cambr == 0 && this.pol != smile.pol){
				this.op = 1;
			}
			else{
				this.op = 0;
			}
			
			if(this.pol == 1){
				this.x = canvas.width * 0.25;
				this.y = canvas.height * 0.1 + plans.y;
				this.size = 0.7;
			}
			
			if(this.pol == 2){
				this.x = canvas.width * 0.28;
				this.y = canvas.height * 0.065 + plans.y;
				this.size = 1;
			}
			
			if(this.pol == 3){
				this.x = canvas.width * 0.3;
				this.y = canvas.height * 0.15 + plans.y;
				this.size = 0.5;
			}
			
			if(this.pol == 4){
				this.x = canvas.width * 0.09;
				this.y = canvas.height * 0.708 + plans.y;
				this.size = 0.8;
			}
			
			if(this.pol == 5){
				this.x = canvas.width * 0.08;
				this.y = canvas.height * 0.12 + plans.y;
				this.size = 0.3;
			}
			
			if(this.pol == 6){
				this.x = canvas.width * 0.28;
				this.y = canvas.height * 0.05 + plans.y;
				this.size = 0.5;
			}
			
			if(this.pol == 7){
				this.x = canvas.width * 0.6;
				this.y = canvas.height * 0.04 + plans.y;
				this.size = 0.5;
			}
			
			if(elec == 0 && this.pol != 0){
				powerh -= 0.004;
			}
		}
		
		if(genrep.br >= 0 && this.go == 1){
			genrep.br -= 1;
		}
		
	}
}

class Smile{
	constructor(){
		this.x = 0;
		this.y = 0;
		this.img = new Image();
		this.img.src = 'images/smile.png';
		this.op = 0;
		this.prog = (Math.ceil(Math.random() * 20) + 5 + (20 - aianimatr[4])) * 60;
		this.pol = 0;
		this.i = 0;
	}
	Update(){
		this.y = plans.y;
		
		if(this.prog <= 0 && this.i == 0){
			this.pol = Math.ceil(Math.random() * 7);
			this.i = 1;
			this.prog = (Math.ceil(Math.random() * 20) + 5 + (aianimatr[4])) * 60;
		}
		
		if(this.prog <= 0 && this.i == 1){
				this.pol = -1;
				this.i = 0;
				this.prog = (Math.ceil(Math.random() * 20) + 5 + (20 - aianimatr[4])) * 60;
		}
		
		if(this.prog > 0){
			this.prog -= 1;
		}
		
		if(cams == this.pol && cambr == 0){
			this.op = 1;
			if(cambr == 0){
				camrep.br -= 4;
			}
		}
		else{
			this.op = 0;
		}
	}
}

class Scrimer{
	constructor(){
		this.x = 0;
		this.y = 0;
		this.rot = 0;
		this.size = 1;
		this.img = new Image();
		this.monstr = null;
		this.i = 0;
	}
	Update(){
		if(this.monstr != null){
			this.img.src = 'images/icon' + this.monstr + '.png';
			
			if(this.i == 0){
				this.x = cw / 2;
				this.y = ch * 1.5;
				this.rot = 0;
				this.i = 1;
				this.size = 1;
			}
			
			if(this.i == 1){
				if(this.y > ch / 2){
					this.y -= ch / 25;
					this.rot += 5;
				}
				else{
					this.i = 2;
					this.y = ch / 2;
				}
			}
			
			if(this.i == 2){
				if(this.size < 5){
					this.size += 0.2;
					this.rot += 5;
				}
				else{
					this.i = 0;
					this.monstr = null;
					win = -1;
					locat = 0;
				}
			}
		}
	}
}

class Bobr{
	constructor(){
		this.x = 0;
		this.y = 0;
		this.size = 1;
		this.img = new Image();
		this.img.src = 'images/bobr.png';
		this.pol = 3;
		this.op = 0;
		this.prog = random(300, 1200) + (900 - aianimatr[5] * 45);
		this.sshock = 0;
	}
	Update(){		
		if(this.pol == 3 && this.prog <= 0){
			if(random(0, 1) == 0){
				this.pol = 2;
			}
			else{
				this.pol = 6;
			}
			this.prog = random(300, 1200) + (900 - aianimatr[6] * 45);
		}
		
		if(this.pol == 2 && this.prog <= 0){
			this.pol = 1;
			this.prog = random(300, 1200) + (900 - aianimatr[6] * 45);
		}
		
		if(this.pol == 6 && this.prog <= 0){
			this.pol = 5;
			this.prog = random(300, 1200) + (900 - aianimatr[6] * 45);
		}
		
		if(this.pol == 5 && this.prog <= 0){
			if(nohead.pol != 0){
				this.pol = -1;
				door[1].down = -1;
			}
			this.prog = random(180 + (180 - aianimatr[6] * 9), 360 + (240 - aianimatr[6] * 12));
		}
		
		if(this.pol == 1 && this.prog <= 0){
			if(shadow.pol != 0){
				this.pol = 0;
				door[0].down = -1;
			}
			this.prog = random(180 + (180 - aianimatr[6] * 9), 360 + (240 - aianimatr[6] * 12));
		}
		
		if(this.pol <= 0 && this.prog <= 0){
			scrimer.monstr = 6;
		}
		
		if(this.pol == 3){
			this.size = 0.7;
			this.x = cw * 0.3;
			this.y = ch * 0.3 + plans.y;
			this.img.src = 'images/bobr.png';
			if(shock == 2 && this.sshock != shock){
				if(random(0, 1) == 0){
					this.pol = 2;
					this.prog = random(300, 1200) + (900 - aianimatr[5] * 45);
				}
			}
			if(shock == 6 && this.sshock != shock){
				if(random(0, 1) == 0){
					this.pol = 6;
					this.prog = random(300, 1200) + (900 - aianimatr[5] * 45);
				}
			}
		}
		if(this.pol == 2){
			this.size = 2;
			this.x = cw * 0.05;
			this.y = ch * 0.1 + plans.y;
			this.img.src = 'images/bobr1.png';
			if(shock == 1 && this.sshock != shock){
				if(random(0, 1) == 0){
					this.pol = 1;
					this.prog = random(300, 1200) + (900 - aianimatr[5] * 45);
				}
			}
			if(shock == 3 && this.sshock != shock){
				if(random(0, 1) == 0){
					this.pol = 3;
					this.prog = random(300, 1200) + (900 - aianimatr[5] * 45);
				}
			}
		}
		if(this.pol == 1){
			this.size = 1.7;
			this.x = cw * 0.15;
			this.y = ch * 0.2 + plans.y;
			this.img.src = 'images/bobr.png';
			if(shock == 2 && this.sshock != shock){
				if(random(0, 1) == 0){
					this.pol = 2;
					this.prog = random(300, 1200) + (900 - aianimatr[5] * 45);
				}
			}
		}
		if(this.pol == 6){
			this.size = 1;
			this.x = cw * 0.3;
			this.y = ch * 0.1 + plans.y;
			this.img.src = 'images/bobr.png';
			if(shock == 3 && this.sshock != shock){
				if(random(0, 1) == 0){
					this.pol = 3;
					this.prog = random(300, 1200) + (900 - aianimatr[5] * 45);
				}
			}
			if(shock == 5 && this.sshock != shock){
				if(random(0, 1) == 0){
					this.pol = 5;
					this.prog = random(300, 1200) + (900 - aianimatr[5] * 45);
				}
			}
		}
		if(this.pol == 5){
			this.size = 1.5;
			this.x = cw * 0.1;
			this.y = ch * 0.15 + plans.y;
			this.img.src = 'images/bobr1.png';
			if(shock == 6 && this.sshock != shock){
				if(random(0, 1) == 0){
					this.pol = 6;
					this.prog = random(300, 1200) + (900 - aianimatr[5] * 45);
				}
			}
		}
		if(this.pol == 0){
			this.size = 1.5;
			this.x = ofis.x;
			this.y = ch * 0.15;
			if(elec == 1){
				this.img.src = 'images/bobr.png';
			}
			else{
				this.img.src = 'images/bobr2.png';
			}
			if(shock == 1){
				this.pol = 1;
				this.prog = random(300, 1200) + (900 - aianimatr[5] * 45);
			}
		}
		if(this.pol == -1){
			this.size = 1.5;
			this.x = cw * 1.4 + ofis.x;
			this.y = ch * 0.15;
			if(elec == 1){
				this.img.src = 'images/bobr.png';
			}
			else{
				this.img.src = 'images/bobr2.png';
			}
			if(shock == 5){
				this.pol = 5;
				this.prog = random(300, 1200) + (900 - aianimatr[5] * 45);
			}
		}
		
		this.prog--;
		
		
		if(cams == this.pol && cambr == 0){
			this.op = 1;
		}
		else{
			this.op = 0;
		}
		
		this.sshock = shock;
	}
}

class Plrot{
	constructor(){
		this.x = 0;
		this.w = 0;
		this.img = new Image();
		this.img.src = 'images/plrot.png';
		this.op = 0;
		this.size = 1080 / 1920;
	}
	Update(){
		if(canvas.width < canvas.height){
	    	this.op = 1;
			this.x = (canvas.height * this.size - canvas.width) / -2;
			this.w = canvas.height * this.size;
	    }
	    else{
	    	this.op = 0;
		}
	}
}

class Pomeh{
	constructor(){
		this.img = [new Image(), new Image(), new Image()];
		this.img[0].src = 'images/pomeh0.png';
		this.img[1].src = 'images/pomeh1.png';
		this.img[2].src = 'images/pomeh2.png';
		this.op = 0;
		this.i = -1;
		this.scams = [cams, nohead.pol, bobr.pol, shadow.pol, spider.pol, smile.pol];
	}
	Update(){
		if(plansp == 1){
			if(this.scams[0] != cams ||  this.scams[1] != nohead.pol || this.scams[2] != bobr.pol ||
			this.scams[3] != shadow.pol || (shockb.i >= 39 && shock == 4 ||
			(this.scams[4] != spider.pol && (spider.pol == cams || (spider.pol == 0 && this.scams[4] == cams)))) || 
			(this.scams[5] != smile.pol && (smile.pol == cams || (smile.pol == -1 && this.scams[5] == cams)))){
				this.i = random(60, 120);
			}
			
			if(this.scams[0] != cams){
				this.i = random(12, 30);
			}
			
			if(this.i >= 0){
				this.op = Math.floor(this.i % 12 / 4);
				this.i--;
			}
			this.scams = [cams, nohead.pol, bobr.pol, shadow.pol, spider.pol, smile.pol];
		}
		if(plansp == 0){
			this.scams[0] = -2;
		}
	}
}

class Twohead{
	constructor(){
		this.x = 0;
		this.y = 0;
		this.size = 1;
		this.img = new Image();
		this.img.src = 'images/twohead.png';
		this.pol = 3;
		this.op = 0;
		this.prog = random(300, 1200) + (900 - aianimatr[5] * 45);
		this.sshock = 0;
	}
	Update(){		
		if(this.pol == 3 && this.prog <= 0){
			if(random(0, 1) == 0){
				this.pol = 2;
			}
			else{
				this.pol = 6;
			}
			this.prog = random(300, 1200) + (900 - aianimatr[6] * 45);
		}
		
		if(this.pol == 2 && this.prog <= 0){
			this.pol = 1;
			this.prog = random(300, 1200) + (900 - aianimatr[6] * 45);
		}
		
		if(this.pol == 6 && this.prog <= 0){
			this.pol = 5;
			this.prog = random(300, 1200) + (900 - aianimatr[6] * 45);
		}
		
		if(this.pol == 5 && this.prog <= 0){
			if(nohead.pol != 0){
				this.pol = -1;
				door[1].down = -1;
			}
			this.prog = random(180 + (180 - aianimatr[6] * 9), 360 + (240 - aianimatr[6] * 12));
		}
		
		if(this.pol == 1 && this.prog <= 0){
			if(shadow.pol != 0){
				this.pol = 0;
				door[0].down = -1;
			}
			this.prog = random(180 + (180 - aianimatr[6] * 9), 360 + (240 - aianimatr[6] * 12));
		}
		
		if(this.pol <= 0 && this.prog <= 0){
			scrimer.monstr = 6;
		}
		
		if(this.pol == 3){
			this.size = 0.7;
			this.x = cw * 0.3;
			this.y = ch * 0.3 + plans.y;
			this.img.src = 'images/twohead.png';
			if(shock == 2 && this.sshock != shock){
				if(random(0, 1) == 0){
					this.pol = 6;
					this.prog = random(300, 1200) + (900 - aianimatr[5] * 45);
				}
			}
			if(shock == 6 && this.sshock != shock){
				if(random(0, 1) == 0){
					this.pol = 2;
					this.prog = random(300, 1200) + (900 - aianimatr[5] * 45);
				}
			}
		}
		if(this.pol == 2){
			this.size = 2;
			this.x = cw * 0.05;
			this.y = ch * 0.1 + plans.y;
			this.img.src = 'images/twohead.png';
			if(shock == 1 && this.sshock != shock){
				if(random(0, 1) == 0){
					this.pol = 3;
					this.prog = random(300, 1200) + (900 - aianimatr[5] * 45);
				}
			}
			if(shock == 3 && this.sshock != shock){
				if(random(0, 1) == 0){
					this.pol = 1;
					this.prog = random(300, 1200) + (900 - aianimatr[5] * 45);
				}
			}
		}
		if(this.pol == 1){
			this.size = 1.7;
			this.x = cw * 0.15;
			this.y = ch * 0.2 + plans.y;
			this.img.src = 'images/twohead.png';
			if(shock == 1 && this.sshock != shock){
				if(random(0, 1) == 0){
					this.pol = 2;
					this.prog = random(300, 1200) + (900 - aianimatr[5] * 45);
				}
			}
		}
		if(this.pol == 6){
			this.size = 1;
			this.x = cw * 0.3;
			this.y = ch * 0.1 + plans.y;
			this.img.src = 'images/twoheadr.png';
			if(shock == 3 && this.sshock != shock){
				if(random(0, 1) == 0){
					this.pol = 5;
					this.prog = random(300, 1200) + (900 - aianimatr[5] * 45);
				}
			}
			if(shock == 5 && this.sshock != shock){
				if(random(0, 1) == 0){
					this.pol = 3;
					this.prog = random(300, 1200) + (900 - aianimatr[5] * 45);
				}
			}
		}
		if(this.pol == 5){
			this.size = 1.5;
			this.x = cw * 0.1;
			this.y = ch * 0.15 + plans.y;
			this.img.src = 'images/twohead.png';
			if(shock == 5 && this.sshock != shock){
				if(random(0, 1) == 0){
					this.pol = 6;
					this.prog = random(300, 1200) + (900 - aianimatr[5] * 45);
				}
			}
		}
		if(this.pol == 0){
			this.size = 1.5;
			this.x = ofis.x;
			this.y = ch * 0.15;
			if(elec == 1){
				this.img.src = 'images/twoheadr.png';
			}
			else{
				this.img.src = 'images/twohead.png';
			}
			if(shock == 1){
				this.pol = 1;
				this.prog = random(300, 1200) + (900 - aianimatr[5] * 45);
			}
		}
		if(this.pol == -1){
			this.size = 1.5;
			this.x = cw * 1.4 + ofis.x;
			this.y = ch * 0.15;
			if(elec == 1){
				this.img.src = 'images/twohead.png';
			}
			else{
				this.img.src = 'images/twohead.png';
			}
			if(shock == 5){
				this.pol = 5;
				this.prog = random(300, 1200) + (900 - aianimatr[5] * 45);
			}
		}
		
		this.prog--;
		
		
		if(cams == this.pol && cambr == 0){
			this.op = 1;
		}
		else{
			this.op = 0;
		}
		
		this.sshock = shock;
	}
}


var mainmenu = new Mainmenu();
var controlsmenu = new Controlsmenu();
var animmenu = new Animmenu();
var icon = [];
for(let i = 0; i < aianimatr.length; i++){
	icon.push(new Icons(0.042 + i % 6 / 10, 0.08 + Math.floor(i / 6) / 5, i));
}
var winmenu = new Winmenu();
let fullscreen = new Fullscreen();
var ofis = new Ofis(); //офис
var ve = new Ve(); //вентилятор
var door = [ //двери
	new Doors(0.01, 'images/door.png', 0),
	new Doors(1.395, 'images/door1.png', 1)
];
var camb = new Camb(); //кнопка планшета
var plans = new Plans(); //планшет
var look = new Look(); //обзор камер
var camsb =[ //кнопки выбора камер
	new Camselectb(4, 0.85, 0.61),
	new Camselectb(1, 0.728, 0.75),
	new Camselectb(2, 0.74, 0.607),
	new Camselectb(3, 0.85, 0.54),
	new Camselectb(5, 0.85, 0.81),
	new Camselectb(6, 0.81, 0.73),
	new Camselectb(7, 0.77, 0.69)
];
var usage = new Usage(); //скорость убытия энергии
var hand = new Hand();
var shockb = new Shock();
var shockflash = new Shockflash();
var elecb = new Elecb();
var elecpl = new Elecpl();
var elecsb = new Elecsb();
var genb = new Genb();
var shadow = new Shadow();
var time = new Time();
var nohead = new Nohead();
var repb = new Repb();
var reppl = new Reppl();
var camrep = new Camrep();
var shockrep = new Shockrep();
var genrep = new Genrep();
var predrep = [
	new Predrep('cam'),
	new Predrep('shock'),
	new Predrep('gen')
];
var spider = new Spider();
var smile = new Smile();
let clockimg = new Image(); clockimg.src = 'images/clock.png';
let scrimer = new Scrimer();
let bobr = new Bobr();
let plrot = new Plrot();
let pomeh = new Pomeh();
let twohead = new Twohead();




Resize();
Start();
 

 
function Update(){
	
	sra = (canvas.width + canvas.height) / 20;
	cw = canvas.width;
	ch = canvas.height;
	
	if(plrot.op == 0){
	
	if(locat == 0){
		mainmenu.Update();
		controlsmenu.Update();
		animmenu.Update();
		for(let i = 0; i < icon.length; i++){
			icon[i].Update();
		}
		if(win != 0){
			winmenu.Update();
		}
		if(animmenuh == 0 && controlsmenuh == 0){ 
			fullscreen.Update();
		}
	}
	
	if(locat == 1){
		ve.Update();
		door[0].Update();
		door[1].Update();
		camb.Update();
		plans.Update();
		look.Update();
		for(let i = 0; i < camsb.length; i++){
			camsb[i].Update();
		}
		usage.Update();
		if(aianimatr[0] > 0){
			hand.Update();
		}
		shockb.Update();
		shockflash.Update();
		elecb.Update();
		elecpl.Update();
		elecsb.Update();
		genb.Update();
		if(aianimatr[1] > 0){
			shadow.Update();
		}
		time.Update();
		if(aianimatr[2] > 0){
			nohead.Update();
		}
		repb.Update();
		reppl.Update();
		camrep.Update();
		shockrep.Update();
		genrep.Update();
		for(let i = 0; i < predrep.length; i++){
			predrep[i].Update();
		}
		if(aianimatr[3] > 0){
			spider.Update();
		}
		if(aianimatr[4] > 0){
			smile.Update();
		}
		scrimer.Update();
		if(aianimatr[6] > 0){
			bobr.Update();
		}
		ofis.Update();
		pomeh.Update();
		if(aianimatr[7] > 0){
			twohead.Update();
		}
	}
	
	Draw();
	
	}//plrot
	else{
		ctx.drawImage(plrot.img, plrot.x, 0, plrot.w, ch);
	}
	
	sclick = click;
}
 

function Draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	if(locat == 0){
		if(controlsmenuh == 0 && animmenuh == 0){
			ctx.drawImage(mainmenu.img, mainmenu.x, mainmenu.y, canvas.width, canvas.height);
			ctx.drawImage(fullscreen.img, fullscreen.x, 0, sra, sra);
		}
		
		if(controlsmenuh == 1){
			ctx.drawImage(controlsmenu.img, controlsmenu.x, controlsmenu.y, canvas.width, canvas.height);
		}
		
		if(animmenuh == 1){
			ctx.drawImage(animmenu.img, animmenu.x, animmenu.y, canvas.width, canvas.height);
			
			for(let i = 0; i < icon.length; i++){
				ctx.drawImage(icon[i].img, icon[i].x, icon[i].y, canvas.width * 0.1, canvas.height * 0.2);
				
				if(aianimatr[i] == 0){
					ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
					ctx.fillRect(icon[i].x, icon[i].y, canvas.width * 0.1, canvas.height * 0.2);
				}
				
				ctx.lineWidth = sra / 15;
				ctx.strokeStyle = '#A4AD00';
				if(sela != -1){
					if(sela == i){
						ctx.strokeRect(icon[i].x + sra / 30, icon[i].y + sra / 30, canvas.width * 0.1 - sra / 15, canvas.height * 0.2 - sra / 15);
					}
				}
				else{
					ctx.strokeRect(cw * 0.042 + sra / 30, ch * 0.079 + sra / 30, canvas.width * 0.6 - sra / 15, canvas.height * 0.86 - sra / 15);
				}
			}
			
			ctx.fillStyle = '#FFFFFF';
			ctx.font = 'normal ' + sra * 0.28 + 'px impact';
			if(sela != -1){
				for(let i = 0; i < opis[sela].length; i++){
					ctx.fillText(opis[sela][i], canvas.width * 0.68, canvas.height * 0.12 + sra * 0.28 * i);
				}
			}
			else{
				ctx.fillText('Все аниматроники', canvas.width * 0.68, canvas.height * 0.12);
			}
			
			ctx.fillStyle = '#FFF';
			ctx.font = 'normal ' + sra * 0.4 + 'px impact';
			if(sela != -1){
				ctx.fillText(aianimatr[sela], canvas.width * 0.86, canvas.height * 0.55);
			}
			else if(isNaN(aianimatr.reduce(function(a, b){ return (a === b) ? a : NaN; }))){
				ctx.fillText('~', canvas.width * 0.86, canvas.height * 0.55);
			}
			else{
				ctx.fillText(aianimatr[0], canvas.width * 0.86, canvas.height * 0.55);
			}
			
			ctx.fillText(score, canvas.width * 0.86, canvas.height * 0.79);
		}
		
		if(win != 0){
			ctx.drawImage(winmenu.img,0, 0, canvas.width, canvas.height);
		}
	}
	
	
	
	
	if(locat == 1){
		if(shadow.pol == 0){
			ctx.drawImage(shadow.img, shadow.x, shadow.y, canvas.width * 0.1 * shadow.size, canvas.height * 0.3 * shadow.size);
		}
		
		if(nohead.pol == 0){
			ctx.drawImage(nohead.img, nohead.x, nohead.y, canvas.width * 0.1 * nohead.size, canvas.height * 0.4 * nohead.size);
		}
		
		if(bobr.pol <= 0){
			ctx.drawImage(bobr.img, bobr.x, bobr.y, canvas.width * 0.1 * bobr.size, canvas.height * 0.4 * bobr.size);
		}
		
		if(twohead.pol <= 0){
			ctx.drawImage(twohead.img, twohead.x, twohead.y, canvas.width * 0.1 * twohead.size, canvas.height * 0.4 * twohead.size);
		}
		
		ctx.drawImage(door[0].img, 0, 0, ofis.img.width, ofis.img.height, door[0].x, door[0].y, canvas.width * 1.5, canvas.height);
		ctx.drawImage(door[1].img, 0, 0, ofis.img.width, ofis.img.height, door[1].x, door[1].y, canvas.width * 1.5, canvas.height);
		
		ctx.drawImage(ofis.img, ofis.x, ofis.y, canvas.width * 1.5, canvas.height);
		
		if(ofis.light == 1){
			ctx.drawImage(ve.img, ve.x, ve.y, sra, sra);
			ctx.translate(ve.x + sra * 0.495, ve.y + sra * 0.34);
			ctx.rotate(ve.rot * Math.PI / 180);
			ctx.drawImage(ve.lop, sra / -2.02, sra / -2.02, sra * 1.01, sra * 1.01);
			ctx.rotate(-(ve.rot * Math.PI / 180));
			ctx.translate(-(ve.x + sra * 0.495), -(ve.y + sra * 0.34));
			
			
			ctx.drawImage(clockimg, ofis.x + cw * 0.8 - sra * 0.7, ofis.y + canvas.height * 0.75 - sra * 0.7, sra * 1.4, sra * 0.7);
			ctx.fillStyle = '#50FF50';
			ctx.font = 'normal ' + sra * 0.25 + 'px impact';
			ctx.fillText(time.rtime + ' : ' + time.mtime, ofis.x + cw * 0.8 - sra * 0.35, ofis.y + canvas.height * 0.75 - sra * 0.35);
		}
		
		if(plans.op == 1){
			ctx.drawImage(wallimg, plans.x - canvas.width * 0.01, plans.y - canvas.height * 0.01, canvas.width * 1.02, canvas.height * 1.02);
			if(pomeh.i == -1){
				ctx.drawImage(look.img[look.imgop], look.x, look.y, canvas.width * 0.592, canvas.height * 0.844);
			}
			
			if(aianimatr[0] > 0 && cams == 4 && cambr == 0 && smile.pol != 4 && pomeh.i == -1){
				ctx.drawImage(hand.img, hand.x, hand.y, canvas.width * 0.6, canvas.height * 0.2);
			}
			
			if(shadow.op == 1 && shadow.pol != 0 && pomeh.i == -1){
				ctx.drawImage(shadow.img, shadow.x, shadow.y, canvas.width * 0.1 * shadow.size, canvas.height * 0.3 * shadow.size);
			}
			
			if(bobr.op == 1 && pomeh.i == -1){
				ctx.drawImage(bobr.img, bobr.x, bobr.y, cw * 0.1 * bobr.size, ch * 0.4 * bobr.size);
			}
			
			if(twohead.op == 1 && pomeh.i == -1){
				ctx.drawImage(twohead.img, twohead.x, twohead.y, cw * 0.1 * twohead.size, ch * 0.4 * twohead.size);
			}
			
			if(nohead.op == 1 && nohead.pol != 0 && pomeh.i == -1){
				ctx.drawImage(nohead.img, nohead.x,nohead.y, canvas.width * 0.1 * nohead.size, canvas.height * 0.4 * nohead.size);
			}
			
			if(spider.op == 1 && pomeh.i == -1){
				ctx.drawImage(spider.img, spider.x, spider.y, canvas.width * 0.1 * spider.size, canvas.height * 0.4 * spider.size);
			}
			
			if(smile.op == 1 && pomeh.i == -1){
				ctx.drawImage(smile.img, smile.x, smile.y, cw, ch);
			}
			
			if(pomeh.i > -1 && cambr == 0){
				ctx.drawImage(pomeh.img[pomeh.op], look.x, look.y, cw * 0.592, ch * 0.844);
			}
			
			if(shockb.i > 0){
				ctx.fillStyle = 'rgba(255, 255, 255, ' + shockflash.op + ')';
				ctx.fillRect(look.x, look.y, canvas.width * 0.592, canvas.height * 0.844);
			}
			
			ctx.drawImage (plans.img, plans.x, plans.y, canvas.width, canvas.height);
			
			ctx.drawImage (shockb.img, shockb.x, shockb.y, canvas.width * 0.2, canvas.height * 0.2);
			
			for(let i = 0; i < camsb.length; i++){
				ctx.drawImage (camsb[i].img, camsb[i].x, camsb[i].y, canvas.width * 0.04, canvas.height * 0.04);
			}
		}
		
		ctx.drawImage(camb.img, camb.x, camb.y, canvas.width / 3, canvas.height / 13);
		
		if(elecpl.op == 1){
			ctx.drawImage(elecpl.img, elecpl.x, elecpl.y, canvas.width, canvas.height);
		
			ctx.drawImage(elecsb.img, elecsb.x, elecsb.y, canvas.width * 0.3, canvas.height * 0.3);
			
			ctx.drawImage(genb.img, genb.x, genb.y, canvas.width * 0.3, canvas.height * 0.3);
		}
		
		if(elecb.op == 1){
			ctx.drawImage(elecb.img, elecb.x, elecb.y, canvas.width / 20, canvas.height / 3);
		}
		
		if(reppl.op == 1){
			ctx.drawImage(reppl.img, reppl.x, reppl.y, canvas.width, canvas.height);
			
			ctx.drawImage(camrep.img, camrep.x, camrep.y, canvas.width * 0.2, canvas.height * 0.3);
			
			ctx.drawImage(shockrep.img, shockrep.x, shockrep.y, canvas.width * 0.2, canvas.height * 0.3);
			
			ctx.drawImage(genrep.img, genrep.x, genrep.y, canvas.width * 0.2, canvas.height * 0.3);
			
			for(let i = 0; i < predrep.length; i++){
				if(predrep[i].op == 1){
					ctx.drawImage(predrep[i].img, predrep[i].x, predrep[i].y, canvas.width * 0.05, canvas.height * 0.1);
				}
			}
		}
		
		if(repb.op == 1){
			ctx.drawImage(repb.img, repb.x, repb.y, canvas.width / 20, canvas.height / 3);
		}
		
		
		
		ctx.fillStyle = '#FFFFFF';
		ctx.font = 'normal ' + sra * 0.3 + 'px impact';
		ctx.fillText('POWER: ' + power + ' %', canvas.width * 0.01, canvas.height - sra * 0.4);
		ctx.fillText('USAGE: ', canvas.width * 0.01, canvas.height - sra * 0.1);
		
		ctx.drawImage(usage.img, usage.x + cw * 0.015, usage.y + ch * 0.005, cw * 0.11, ch * 0.03);
		
		if(scrimer.monstr != null){
			ctx.translate(scrimer.x, scrimer.y);
			ctx.rotate(scrimer.rot * Math.PI / 180);
			ctx.drawImage(scrimer.img, ch / -4 * scrimer.size, ch / -4 * scrimer.size, ch / 2 * scrimer.size, ch / 2 * scrimer.size);
			ctx.rotate(-(scrimer.rot * Math.PI / 180));
			ctx.translate(-scrimer.x, -scrimer.y);
		}
		
		if(mobile == 1){
			if(door[0].op == 1){
				ctx.drawImage(door[0].bl, 0, 0, canvas.width / 10, canvas.height / 8);
				ctx.drawImage(door[0].br, canvas.width - canvas.width / 10, 0, canvas.width / 10, canvas.height / 8);
			}
		}
		
	}
	
	//ctx.fillText(door[0].x, canvas.width * 0.5, canvas.height * 0.5);
}
