let div=15;
let message="2,3,5,8,7,1,12,12,10,15,9,7,1,12,12,725"
var n=0;
let layer_h=10;
let th=0;
let ws=0;
let id=0;
let wait=100000;
let resource=1;
let resource_status=1;

function m_add() {
  n=n+1;
  n=(n+div)%div;
}

function m_sub() {
  n=n-1;
  n=(n+div)%div;
}


function setup() {
  
  print(id)
  
  createCanvas(500, 600);
  
  rb = createButton("►");
  rb.position(400, 550);
  rb.size(70,50)
  rb.mousePressed(m_add);
  lb = createButton("◄");
  lb.position(25, 550);
  lb.size(70,50)
  lb.mousePressed(m_sub);
  
  
  
  tb = createButton("Teardown");
  tb.position(125, 550);
  tb.size(70,50)
  tb.mousePressed(modify_s);
  bb = createButton("Construct");
  bb.position(300, 550);
  bb.size(70,50)
  bb.mousePressed(modify_a);
  
  
}

let level_array= message.split(",");

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}
wait=100


function draw() {
  level_array= message.split(",");
  background(255,30);
  


  
  //drawing building
  for (let i=0;i<div;i++) {
    //print(level_array[i]);
    building((width/div)*i,level_array[i]);
  }
  //drawing windows
  ws=0;
  for (let i=0;i<div;i++) {
    for (let j=0;j<(width/layer_h);j++) {
      noStroke();
      fill(255, 255, 255);
      ws=i+j
      var wsix=wsr(ws);
      var wsiy=wsr(ws+5);
      rect(i*(width/div)+15,height-j*layer_h*2+25,7+wsix,7+(wsiy*0.5));
      
    }
    

  } 
  
  //draw a triangle to indicate location to build
  noStroke();
  fill(220, 220, 220);
  th=height-(level_array[n]*layer_h)-35-60;
  triangle((n*(width/div))+30,th, (n*(width/div))+((width/div)/2), th+20, (n*(width/div))+(width/div)-30, th);
  
  
  fill(0, 0, 0);
  rect(0,height-70,width,70);
  
  textSize(32);
  fill(0, 0, 0);
  text([level_array[15]," participants played"].join(""), 10, 30);
  /////////////////////start cover function
  
  if (wait>1) {
  background(255);

  sleep(25)
  fill(150, 150, 150);
  rect(0,0,width*(1-(wait/100))*2,70)
  textSize(32);
  fill(0, 0, 0);
  text("loading...", 10, 50);
  if(wait==30){
    id=int(Math.random()*1000000);
    print(id);
    resource=int(Math.random()*5)+1;
  }
  if(wait<30) {
    after_loading();
    
  }
  }
  wait=wait-1;
  if(wait==1){
    resource_status=resource;
  }
  if (resource_status<=0){
    resource_status=0;
    textSize(20);
    text("Thank you for your participating ^^", 10, 70);
  }
  textSize(50);
  fill(255, 255, 255);
  text(resource_status, (width/2)-40, height-10);
  textSize(10);
  fill(255, 255, 255);
  text("resources", (width/2)-10, height-10);
////////////////////draw end
}


function building(x_location,index) {
  //rect(x, y, w, h, [detailX], [detailY])
  fill(0, 0, 0);
  rect(x_location,height-index*layer_h-60,(width/div),index*layer_h);
  
  
}

function wsr(seed) {
  ws=(seed*seed-seed)+3
  return ws%5
}


//testing
function modify_a() {
  use_resource();
  let newarray=level_array;
  o=int(newarray[n])
  o=o+1
  newarray[n]=o.toString();
  //print(newarray)
  message=newarray.join(",")
}
function modify_s() {
  use_resource();
  let newarray=level_array;
  o=int(newarray[n])
  o=o-1
  newarray[n]=o.toString();
  //print(newarray)
  message=newarray.join(",")
}

function after_loading(){
  //id=int(Math.random()*1000000);
  //print(id);
  textSize(20);
  text("Congraduations!!!", 10, 150);
  text(["you win ",resource,' resources to modify the city'].join(""), 10, 200);
  text("to construct the city", 10, 250);
  text("You may",10,300);
  text("click ► or ◄ to point a place and", 10, 350);
  text("click [construct] or [teardown] to do something", 10, 400);
  sleep(500);
  
}
function use_resource(){
  if(wait<1){
    resource_status=resource_status-1;
  }
}
    
    
    
    
    
    //text("Congraduations!!!"," players online"].join(""), 10, 30);
    
    


