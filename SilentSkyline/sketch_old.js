///mqtt
let localDiv;
let remoteDiv;
let broker = {
    hostname: 'public.cloud.shiftr.io',
    port: 443
};
let client;
let creds = {
    clientID: 'p5Client',
    userName: 'public',
    password: 'public'
}
let topic = 'skyline';

////p5.js
let div=15;
var message_in="0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0"
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
  
  ////mqtt
    localDiv = createDiv('local messages will go here');
    localDiv.position(20, 50);
    localDiv.style('color', '#fff');
    // create a div for the response:
    remoteDiv = createDiv('waiting for messages');
    remoteDiv.position(20, 80);
    remoteDiv.style('color', '#fff');
  
  client = new Paho.MQTT.Client(broker.hostname, Number(broker.port), creds.clientID);
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;
  client.connect(
         {
            onSuccess: onConnect,       // callback function for when you connect
            userName: creds.userName,   // username
            password: creds.password,   // password
            useSSL: true                // use SSL
        }
    );
  
 
  
  ////skyline
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



function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}
wait=100


function draw() {
  level_array= message_in.split(",");
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
    text("Thank you for your participating ^^", 10, 120);
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
  if (resource_status>0) {
    
    sendMqttMessage(1);
    }
  use_resource();
  let newarray=level_array;
  o=int(newarray[n])
  o=o+1
  newarray[n]=o.toString();
  //print(newarray)
  message=newarray.join(",")
}
function modify_s() {
  if (resource_status>0) {
    sendMqttMessage(-1);
    }
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
  sleep(220);
  
}
function use_resource(){
  if(wait<1){
    resource_status=resource_status-1;
  }
}
    
    
////mqtt


function onConnect() {
    localDiv.html('client is connected');
    client.subscribe(topic);
}
    
function onConnectionLost(response) {
    if (response.errorCode !== 0) {
      print("no");
        localDiv.html('onConnectionLost:' + response.errorMessage);
    }
}



function onMessageArrived(message) {
    remoteDiv.html('I got a message:' + message.payloadString);
    let temp_m=message.payloadString;
    let temp_m_a=temp_m.split(",");
    let temp_m_a_l=temp_m.length;
    if (temp_m_a_l > 10) {
    
    message_in=message.payloadString;
}
    print(message);

}


function sendMqttMessage(modify) {
    // if the client is connected to the MQTT broker:
    if (client.isConnected()) {

        let msg = [n,modify,id].join();
        // start an MQTT message:
        message = new Paho.MQTT.Message(msg);
        // choose the destination topic:
        message.destinationName = topic;
        // send it:
        client.send(message);
        // print what you sent:
        localDiv.html('I sent: ' + message.payloadString);
    }
}
