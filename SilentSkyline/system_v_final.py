# python3.6#modify
#https://mickyinhere.github.io/p5jsmqtt0/

f=open("datalog.txt","r")
msgg=f.read().split("#")[-2]
f.close()
newbuilding=""
import random
from paho.mqtt import client as mqtt_client
broker = 'public.cloud.shiftr.io'
port = 1883
topic = "skyline"
# generate client ID with pub prefix randomly
client_id = f'python-mqtt-{random.randint(0, 100)}'
username = 'public'
password = 'public'


def connect_mqtt() -> mqtt_client:
    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            print("Connected to MQTT Broker!")
        else:
            print("Failed to connect, return code %d\n", rc)

    client = mqtt_client.Client(client_id)
    client.username_pw_set(username, password)
    client.on_connect = on_connect
    client.connect(broker, port)
    return client

index=0
from datetime import datetime
def subscribe(client: mqtt_client):
    
    def on_message(client, userdata, msg):
        da=msg.payload.decode()
        print(f"Received `{da}` from `{msg.topic}` topic")
        print(da)
        data=str(da)
        if  len(data.split(","))<10:
          now = datetime.now()
          date_time = now.strftime("%m/%d/%Y, %H:%M:%S")
          global msgg
          #deal with reault...
          index=int(data.split(",")[0])
          print("index:")
          print(index)
          newbuilding=msgg.split(",")
          newbuilding[index]=str(int(newbuilding[index])+int(da.split(",")[1]))
          f = open("playerlog.txt", "r")
          player_count=len(f.read().split("-"))
          f.close()
          newbuilding[-1]=str(player_count)
          msgg=",".join(newbuilding)
          
          
          
          #documentation...
          f = open("datalog.txt", "a")
          f.write('\n'+date_time+":   #"+msgg+"#")
          f.write('\n'+date_time+":   "+da)
          f.write('\n')
          f.close()

          

          try: 
            player_id=data.split(",")[-1]
          except:
            f = open("playerlog.txt", "a")
            f.write('\n')
            f.close()
          player_id=data.split(",")[-1]
          f = open("playerlog.txt", "r")
          if player_id in f.read():
            f.close()
            print("")
          else:
            f = open("playerlog.txt", "a")
            
            f.write('\n')
            f.write(date_time+"    ->     ")
            f.write(player_id)
            f.close()

    
    client.subscribe(topic)
    client.on_message = on_message


def run():
    client = connect_mqtt()
    subscribe(client)
    client.loop_forever()
###########################################
import time
def publish(client):
    msg_count = 100000
    while True:
        time.sleep(0.25)
        result = client.publish(topic, msgg)
        # result: [0, 1]
        status = result[0]
        if status == 0:
            #print(f"Send `{msg}` to topic `{topic}`")
            print("send")
        else:
            print("not send")
            #print(f"Failed to send message to topic {topic}")
        msg_count += 1


def run():
  
    client = connect_mqtt()
    subscribe(client)
    client.loop_start()
    publish(client)
    



run()