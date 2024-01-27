import mediapipe as mp
from mediapipe.framework.formats import landmark_pb2
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import cv2
import time
import vision_gui
import threading

mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

BaseOptions = mp.tasks.BaseOptions
GestureRecognizer = mp.tasks.vision.GestureRecognizer
GestureRecognizerOptions = mp.tasks.vision.GestureRecognizerOptions
GestureRecognizerResult = mp.tasks.vision.GestureRecognizerResult
VisionRunningMode = mp.tasks.vision.RunningMode
Gui = vision_gui.Gui()
recognition_result_list = []
# Create a gesture recognizer instance with the live stream mode:
def print_result(recognition_result: GestureRecognizerResult, output_image: mp.Image, timestamp_ms: int):
    # print('gesture recognition result: {}'.format(recognition_result))

    recognition_result_list.append(recognition_result)
    # print(recognition_result_list.pop().gestures)
    # print(recognition_result_list)



options = GestureRecognizerOptions(
    base_options=BaseOptions(model_asset_path='/Users/grisha/Documents/conda/IrvineHacks/Computer Vision/gesture_recognizer.task'),
    running_mode=VisionRunningMode.LIVE_STREAM,
    num_hands=1,
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
            # if recognition_result.gestures:
                # print(recognition_result.gestures[0][0])
            if recognition_result.gestures:
                top_gesture = recognition_result.gestures[0][0]
                hand_landmarks = recognition_result.hand_landmarks[0]

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
                cv2.putText(annotated_image, title, (int(annotated_image.shape[1]/2) - int(len(title) * dynamic_titlesize / 4), 50), cv2.FONT_HERSHEY_SIMPLEX, dynamic_titlesize/100, (0, 0, 0), 2)

                # make hand center equal to the average of x and y of landmarks 0, 5 and 17
                hand_center_x = (hand_landmarks[0].x + hand_landmarks[5].x + hand_landmarks[17].x) / 3
                hand_center_y = (hand_landmarks[0].y + hand_landmarks[5].y + hand_landmarks[17].y) / 3

                # create a line whos length is 100 * the x value of the first landmark
                cv2.line(annotated_image, (50, 200), (50 + int(hand_landmarks[0].x * 100), 200), (0, 0, 0), 2)

                # create a line whos length is 100 * the y value of the first landmark
                cv2.line(annotated_image, (50, 250), (50, 250 + int(hand_landmarks[0].y * 100)), (0, 0, 0), 2)

                gui_thread = threading.Thread(target=Gui.check_input, args=(top_gesture.category_name, (hand_center_x, hand_center_y), (annotated_image.shape[1], annotated_image.shape[0])))
                gui_thread.start()
                # Gui.check_input(top_gesture.category_name, (hand_center_x, hand_center_y), (annotated_image.shape[1], annotated_image.shape[0]))
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
    cap.release()