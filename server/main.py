import threading
from flask import Flask, render_template
from flask_socketio import SocketIO
from socket_service import *
from camera import *
from grmodel.app import main
from dotenv import load_dotenv
import os
import sys
sys.path.insert(0, './grmodel') 
# ====== ENV VARIABLES ====== #
load_dotenv()
port = os.getenv("PORT")
if port == None:
    port = 30000
# ============================ #

# app_thread = threading.Thread(target=main) #create the new mf thread
# app_thread.start # Start a new thread

app = Flask(__name__)

if __name__ == '__main__':
    server = initialize_socket(app)
    server_thread = threading.Thread(target=server.run, args=(app,), kwargs={'port': int(port)})
    server_thread.start()
    coordinate_thread = threading.Thread(target=send_coordinates)
    coordinate_thread.start()
    main()
