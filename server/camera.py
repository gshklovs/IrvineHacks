import mediapipe as mp
from mediapipe.framework.formats import landmark_pb2
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import cv2
import time
from datetime import datetime
import threading
from socket_service import *
import os
from dotenv import load_dotenv

# ====== ENV VARIABLES ====== #
load_dotenv()
model_path = os.getenv("MODEL_FILE_URI")
if model_path == None:
    model_path = "model/gesture_recognizer.task"

polling_rate = os.getenv("POLLING_RATE")
if polling_rate == None:
    polling_rate = 100
# ============================ #

mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

BaseOptions = mp.tasks.BaseOptions
GestureRecognizer = mp.tasks.vision.GestureRecognizer
GestureRecognizerOptions = mp.tasks.vision.GestureRecognizerOptions
GestureRecognizerResult = mp.tasks.vision.GestureRecognizerResult
VisionRunningMode = mp.tasks.vision.RunningMode

recognition_result_list = []
coordinate_list = []

# Create a gesture recognizer instance with the live stream mode:
def print_result(recognition_result: GestureRecognizerResult, output_image: mp.Image, timestamp_ms: int):
    # print('gesture recognition result: {}'.format(recognition_result))

    recognition_result_list.append(recognition_result)
    # print(recognition_result_list.pop().gestures)
    # print(recognition_result_list)


def start_camera():
    options = GestureRecognizerOptions(
        base_options=BaseOptions(model_asset_path='model/gesture_recognizer.task'),
        running_mode=VisionRunningMode.LIVE_STREAM,
        num_hands=2,
        min_hand_detection_confidence=0.4,
        min_hand_presence_confidence=0.5,
        min_tracking_confidence=0.5,
        result_callback=print_result)
    with GestureRecognizer.create_from_options(options) as recognizer:
        # Start streaming frames from the camera
        cap = cv2.VideoCapture(0)
        while cap.isOpened():
            success, image = cap.read()
            if not success:
                print("Ignoring empty camera frame.")
                continue

            image = cv2.flip(image, 1)
            rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_image)

            # Convert the BGR image to RGB and process it with MediaPipe Gesture Recognizer
            results = recognizer.recognize_async(mp_image, time.time_ns() // 1_000_000)

            # Draw the hand annotations on the image.
            if recognition_result_list != []:
                recognition_result = recognition_result_list.pop()
                # print(recognition_result.gestures)
                if recognition_result.gestures:
                    send_coordinates = True
                    for hand_index, hand_landmarks in enumerate(recognition_result.hand_landmarks):
                        top_gesture = recognition_result.gestures[hand_index][0]

                        title = f"{top_gesture.category_name} ({top_gesture.score:.2f})"
                        dynamic_titlesize = 80  # Increase the value to make the text larger
                        annotated_image = image  # Use image instead of frame
                        hand_landmarks_proto = landmark_pb2.NormalizedLandmarkList()
                        hand_landmarks_proto.landmark.extend([
                            landmark_pb2.NormalizedLandmark(x=landmark.x, y=landmark.y, z=landmark.z) for landmark in hand_landmarks
                        ])

                        mp_drawing.draw_landmarks(
                            annotated_image,
                            hand_landmarks_proto,
                            mp_hands.HAND_CONNECTIONS,
                            mp_drawing_styles.get_default_hand_landmarks_style(),
                            mp_drawing_styles.get_default_hand_connections_style())
                        
                        # add title to the annotated image top center
                        cv2.putText(annotated_image, title, (int(annotated_image.shape[1]/2) - int(len(title) * dynamic_titlesize / 4), 50 + (hand_index * 60)), cv2.FONT_HERSHEY_SIMPLEX, dynamic_titlesize/100, (0, 0, 0), 2)

                        # make hand center equal to the average of x and y of landmarks 0, 5 and 17
                        hand_center_x = (hand_landmarks[0].x + hand_landmarks[5].x + hand_landmarks[17].x) / 3
                        hand_center_y = (hand_landmarks[0].y + hand_landmarks[5].y + hand_landmarks[17].y) / 3

                        # create a line whos length is 100 * the x value of the first landmark
                        cv2.line(annotated_image, (50, 200 + (hand_index * 60)), (50 + int(hand_landmarks[0].x * 100), 200 + (hand_index * 60)), (0, 0, 0), 2)

                        # create a line whos length is 100 * the y value of the first landmark
                        cv2.line(annotated_image, (50, 250 + (hand_index * 60)), (50, 250 + int(hand_landmarks[0].y * 100) + (hand_index * 60)), (0, 0, 0), 2)

                        coordinate_list.append([hand_center_x, hand_center_y, top_gesture.category_name, datetime.utcnow()])
                        # ws_send_message("{\"x\": " + str(hand_center_x) + ", \"y\": " + str(hand_center_y) + "}")

                    recognition_result_list.clear()
                    image = annotated_image
                #     cv2.imshow(f"Annotated Frame", annotated_image)
                #     cv2.waitKey(1)
                # # for hand_landmarks in results.multi_hand_landmarks:
                #     mp.solutions.drawing_utils.draw_landmarks(
                #         image, hand_landmarks, mp.solutions.hands.HAND_CONNECTIONS)

                cv2.imshow('MediaPipe Gesture Recognizer', image)
                if cv2.waitKey(5) & 0xFF == 27:
                    break
def send_coordinates():
    global coordinate_list
    while True:
        if coordinate_list != []:
            coordinate = coordinate_list.pop()
            ttl = (datetime.utcnow() - coordinate[3]).total_seconds() * 1000
            if ttl < float(polling_rate):
                ws_send_message("{\"x\": " + str(coordinate[0]) + ", \"y\": " + str(coordinate[1]) + ", \"gesture\": \"" + str(coordinate[2]) + "\", \"timestamp\": \"" + str(coordinate[3]) + "\"}")
                print("sent coordinates: (" + str(coordinate[0]) + "," + str(coordinate[1]) + ") - Gesture: " + str(coordinate[2]) + " - Age: " + str(ttl) + "ms")
            else:
                print("coordinates expired, clearing stack")
                coordinate_list.clear()
        time.sleep(float(polling_rate) / 1000)