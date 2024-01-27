from flask_socketio import SocketIO

ws = None

def initialize_socket(app):
    global ws
    ws = SocketIO(app, cors_allowed_origins="*")

    @ws.on('connect')
    def handle_connect():
        print('new connection')

    @ws.on('to-server')
    def handle_to_server(arg):
        print(f'new to-server event: {arg}')

    return ws

def ws_send_message(msg):
    global ws
    ws.emit('from-server', msg)