import threading
from flask import Flask, render_template
from flask_socketio import SocketIO
from socket_service import *
from camera import *
from dotenv import load_dotenv

# ====== ENV VARIABLES ====== #
load_dotenv()
port = os.getenv("PORT")
if port == None:
    port = 30000
# ============================ #

app = Flask(__name__)

if __name__ == '__main__':
    server = initialize_socket(app)
    server_thread = threading.Thread(target=server.run, args=(app,), kwargs={'port': int(port)})
    server_thread.start()
    coordinate_thread = threading.Thread(target=send_coordinates)
    coordinate_thread.start()
    start_camera()
