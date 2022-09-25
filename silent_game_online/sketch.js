let div=15;
let message="2,3,5,8,7,1,12,12,10,15,9,7,1,12,12"
var n=0;
let layer_h=10;
let th=0;
let ws=0;
function m_add() {
  n=n+1;
  n=(n+div)%div;
}

function m_sub() {
  n=n-1;
  n=(n+div)%div;
}


function setup() {
  
  createCanvas(500, 600);
  
  rb = createButton("►");
  rb.position(450, 550);
  rb.mousePressed(m_add);
  lb = createButton("◄");
  lb.position(25, 550);
  lb.mousePressed(m_sub);
  
  
  tb = createButton("Teardown");
  tb.position(300, 550);
  tb.mousePressed(modify_s);
  bb = createButton("Construct");
  bb.position(150, 550);
  bb.mousePressed(modify_a);
  
}

let level_array= message.split(",");
function draw() {
  level_array= message.split(",");
  
  background(255,30);

  textSize(32);
  fill(0, 0, 0);
  text(n, 10, 30);
  
  //drawing building
  for (let i=0;i<level_array.length;i++) {
    //print(level_array[i]);
    building((width/div)*i,level_array[i]);
  }
  //drawing windows
  ws=0;
  for (let i=0;i<level_array.length;i++) {
    for (let j=0;j<(width/layer_h);j++) {
      noStroke();
      fill(255, 255, 255);
      ws=i+j
      var wsix=wsr(ws);
      var wsiy=wsr(ws+5);
      rect(i*(width/div)+15,height-j*layer_h*2+24,7+wsix,7+wsiy);
      
    }
    

  } 
  
  //draw a triangle to indicate location to build
  noStroke();
  fill(220, 220, 220);
  th=height-(level_array[n]*layer_h)-35-60;
  triangle((n*(width/div))+30,th, (n*(width/div))+((width/div)/2), th+20, (n*(width/div))+(width/div)-30, th);
  
  
  fill(0, 0, 0);
  rect(0,height-70,width,70);
//draw end
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
  let newarray=level_array;
  o=int(newarray[n])
  o=o+1
  newarray[n]=o.toString();
  print(newarray)
  message=newarray.join(",")
}
function modify_s() {
  let newarray=level_array;
  o=int(newarray[n])
  o=o-1
  newarray[n]=o.toString();
  print(newarray)
  message=newarray.join(",")
}



