import threading
from flask import Flask, render_template
from flask_socketio import SocketIO
from socket_service import *
from camera import *

app = Flask(__name__)

if __name__ == '__main__':
    server = initialize_socket(app)
    # server_thread = threading.Thread(target=server.run, args=(app,), kwargs={'port': 30000})
    camera_thread = threading.Thread(target=start_camera)
    # server_thread.start()
    camera_thread.start()
    # start_camera()
