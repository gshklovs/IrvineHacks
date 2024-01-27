# Canvas (cooler name incoming)

### `canvas-ui`

React app to display and update the actual canvas.

1. `cd canvas-ui/`
2. `npm i`
3. `npm run dev`

#### Env Vars
`VITE_VITE_BACKEND_SOCKET_URL`: Specify an alternate backend websocket url (defaults to `localhost:30000`)

### `server`

Flask server to determine user hand coordinates from camera and update the frontend through websockets.

1. `cd server/`
2. `pip install -r requirements.txt`
3. `python main.py`

#### Env Vars
`MODEL_FILE_URI`: Specify an alternate model location (defaults to `model/gesture_recognizer.task`)