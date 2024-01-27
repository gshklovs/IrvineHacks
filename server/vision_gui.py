import pyautogui

class Gui: 
    def __init__(self):
        self.mouse_x, self.mouse_y = pyautogui.position()
        self.width, self.height = pyautogui.size()
        self.sensitivity = .5
        self.moving = False
        self.mousePressed = False


    def move_mouse(self, x, y):
        if not self.moving:
            self.moving = True
        else:
            pyautogui.moveRel(self.width * self.sensitivity * (x-self.mouse_x), self.height * self.sensitivity * (y-self.mouse_y))
        self.mouse_x, self.mouse_y = x, y
    def mouse_down(self):
        if not self.mousePressed:
            pyautogui.mouseDown()
            self.mousePressed = True
    
    def mouse_up(self):
        if self.mousePressed:
            pyautogui.mouseUp()
            self.mousePressed = False
    
    def mouse_click(self):
        pyautogui.click()

    def check_input(self, gesture, landmarks, frame_size):
        frame_width, frame_height = frame_size
        x,y = landmarks
        if gesture == "Closed_Fist":
            self.move_mouse((x-.5)*2 + .5, (y-.5)*2 + .5)
        elif gesture == "Pointing_Up":
            self.mouse_down()
            self.moving = False
        elif gesture == "Open_Palm":
            self.mouse_up()
            self.moving = False
        elif gesture == "Thumb_Up":
            self.mouse_click()
            self.moving = False
        elif gesture == "None":
            pass
        else:
            self.moving = False