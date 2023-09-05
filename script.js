let number = 30;
let speed = 0.002;
let slow = 0.0002;
let pointSize = 0.003;
let lineSize = 0.25;
let clickforce = 0.002;
let clickradius = 0.1;
let mx, my, click;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.addEventListener("mousedown",function(e){MouseDown(e);});
canvas.addEventListener("mouseup",function(e){MouseUp(e);});
canvas.addEventListener("mousemove", function(e){MouseMove(e);});
function MouseMove(e){
	mx = e.clientX;
	my = e.clientY;
}
function MouseDown(e){
	click = 1;
}
function MouseUp(e){
	click = 0;
}


window.addEventListener("resize", Resize);

function Resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function Start(){
	for(let i = 0; i < number; i++){
		points.point.push({x : Math.random() * canvas.width, y : Math.random() * canvas.height, xspeed : (Math.random() * 2 - 1) * canvas.width * speed, yspeed : (Math.random() * 2 - 1) * canvas.width * speed});
	}
	points.size = pointSize * (canvas.width + canvas.height) / 2;
	points.lineSize = lineSize * (canvas.width + canvas.height) / 2;
	clickradius *= canvas.width;
    timer = setInterval(Update, 1000 / 60);
}

let random = (a, b) => Math.ceil(Math.random() * (b - a + 1)) + a - 1;

let points = {
	point : [],
	Update : function(){
		this.point[0].x = mx;
		this.point[0].y = my;
		for(let i = 1; i < this.point.length; i++){
			if(click){
				let r = Math.sqrt((this.point[i].x - mx) ** 2 + (this.point[i].y - my) ** 2);
				if(r < clickradius){
					let angl = Math.atan2(this.point[i].x - mx, this.point[i].y - my);
					this.point[i].xspeed += Math.sin(angl) * clickforce * (clickradius - r) / clickradius * canvas.width;
					this.point[i].yspeed += Math.cos(angl) * clickforce * (clickradius - r) / clickradius * canvas.width;
				}
			}
			if(this.point[i].xspeed > canvas.width * speed){
				this.point[i].xspeed -= slow * canvas.width;
			}
			if(this.point[i].xspeed < -canvas.width * speed){
				this.point[i].xspeed += slow * canvas.width;
			}
			if(this.point[i].yspeed > canvas.width * speed){
				this.point[i].yspeed -= slow * canvas.width;
			}
			if(this.point[i].yspeed < -canvas.width * speed){
				this.point[i].yspeed += slow * canvas.width;
			}
			this.point[i].x += this.point[i].xspeed;
			this.point[i].y += this.point[i].yspeed;
			if(this.point[i].x > canvas.width){
				this.point[i].x = canvas.width;
				this.point[i].xspeed = -Math.abs(this.point[i].xspeed);
			}
			else if(this.point[i].x < 0){
				this.point[i].x = 0;
				this.point[i].xspeed = Math.abs(this.point[i].xspeed);
			}
			if(this.point[i].y > canvas.height){
				this.point[i].y = canvas.height;
				this.point[i].yspeed = -Math.abs(this.point[i].yspeed);
			}
			else if(this.point[i].y < 0){
				this.point[i].y = 0;
				this.point[i].yspeed = Math.abs(this.point[i].yspeed);
			}
		}
	}
}

Resize();
Start();
 
function Update(){
	points.Update();
    Draw();
}
 
function Draw()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = '#FFF';
	for(let i = 1; i < points.point.length; i++){
		ctx.beginPath();
		ctx.arc(points.point[i].x, points.point[i].y, points.size, 0, Math.PI * 2);
		ctx.fill();
		ctx.closePath();
	}
	for(let i = 0; i < points.point.length; i++){
		for(let j = 0; j < points.point.length; j++){
			if(j != i){
				let r = Math.sqrt((points.point[i].x - points.point[j].x) ** 2 + (points.point[i].y - points.point[j].y) ** 2);
				if(r < points.lineSize){
					ctx.strokeStyle = 'rgba(255, 255, 255,' + (points.lineSize - r) / r + ')';
					ctx.beginPath();
					ctx.moveTo(points.point[i].x, points.point[i].y);
					ctx.lineTo(points.point[j].x, points.point[j].y);
					ctx.stroke();
					ctx.closePath();
				}
			}
		}
	}
}
