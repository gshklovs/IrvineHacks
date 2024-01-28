# Canvas (cooler name incoming)

### `canvas-ui`

React app to display and update the actual canvas.

1. `cd canvas-ui/`
2. `npm i`
3. `npm run dev`

#### Env Vars

- `VITE_BACKEND_SOCKET_URL`: Specify an alternate backend websocket url (defaults to `localhost:30000`)
- `VITE_FIREBASE_API_KEY`: Specify the Firebase project API key (defaults to `KEY_MISSING`)

### `server`

Flask server to determine user hand coordinates from camera and update the frontend through websockets.

1. `cd server/`
2. `pip install -r requirements.txt`
3. `python main.py`

#### Env Vars

- `PORT`: Specify which port to run web server on (defaults to `30000`)
- `MODEL_FILE_URI`: Specify an alternate model location (defaults to `model/gesture_recognizer.task`)
- `POLLING_RATE`: Specify the rate (in milliseconds) at which to send coordinates through the websocket (defaults to `100`)
- `NUM_HANDS`: Specify max number of hands to support drawing at the same time (defaults to `1`)
- `CLEAR_ON_NO_CONNECTIONS`: Specify whether to clear the saved canvas state when there are no active connections (`0` for NO, `1`, for YES, defaults to `1`)