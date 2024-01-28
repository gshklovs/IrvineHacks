import random
import time
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, firestore, db
import os
from dotenv import load_dotenv

# ====== ENV VARIABLES ====== #
load_dotenv()
clear_no_connections = os.getenv("CLEAR_ON_NO_CONNECTIONS")
if clear_no_connections == None:
    clear_no_connections = 1
# ============================ #

cred = credentials.Certificate('firebase_service_account.json')
default_app = firebase_admin.initialize_app(cred, {
	"databaseURL":"https://canvas-irvinehacks-default-rtdb.firebaseio.com/"
})

firestore_db = firestore.client()
nodes_collection = firestore_db.collection("nodes")

rtdb = db.reference("/")

def get_leader_id():
    leader_id = rtdb.child("leader").get()
    if leader_id == None:
        return "none"
    return leader_id

def verify_leader_id():
    leader_id = get_leader_id()
    leader = rtdb.child("nodes").child(leader_id).get()
    if leader == None:
        return False
    else:
        return True

def pick_new_leader():
    nodes = rtdb.child("nodes").get()
    if nodes != None:
        random_node = random.choice(list(nodes.keys()))
        print("Picked new leader: " + random_node)
        set_leader_id(random_node)

def set_leader_id(id):
    rtdb.child("leader").set(id)

def start_leader_consensus():
    while True:
        nodes = rtdb.child("nodes").get()
        if nodes != None:
            for node in nodes:
                age = (datetime.utcnow() - datetime.fromisoformat(nodes[node].replace('Z', '+00:00')).replace(tzinfo=None)).total_seconds()
                if age > 2:
                    rtdb.child("nodes").child(node).delete()
                    print("Deleted expired node: " + node)
        else:
            set_leader_id("none")
            if int(clear_no_connections) == 1:
                print("No active connections, clearing coordinates")
                rtdb.child("canvas-state").delete()

        if not verify_leader_id():
            pick_new_leader()

        time.sleep(0.25)
