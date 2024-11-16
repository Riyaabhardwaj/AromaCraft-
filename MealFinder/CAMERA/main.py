import cv2
import math
from flask import Flask, render_template, Response, jsonify
from ultralytics import YOLO

app = Flask(__name__)

cap = cv2.VideoCapture(0)
cap.set(3, 640)
cap.set(4, 480)

model = YOLO("yolo-Weights/yolov8n.pt")

classNames = ["person", "bicycle", "car", "motorbike", "aeroplane", "bus", "train", "truck", "boat",
              "traffic light", "fire hydrant", "stop sign", "parking meter", "bench", "bird", "cat",
              "dog", "horse", "sheep", "cow", "elephant", "bear", "zebra", "giraffe", "backpack", "umbrella",
              "handbag", "tie", "suitcase", "frisbee", "skis", "snowboard", "sports ball", "kite", "baseball bat",
              "baseball glove", "skateboard", "surfboard", "tennis racket", "bottle", "wine glass", "cup",
              "fork", "knife", "spoon", "bowl", "banana", "apple", "sandwich", "orange", "broccoli",
              "carrot", "hot dog", "pizza", "donut", "cake", "chair", "sofa", "pottedplant", "bed",
              "diningtable", "toilet", "tvmonitor", "laptop", "mouse", "remote", "keyboard", "cell phone",
              "microwave", "oven", "toaster", "sink", "refrigerator", "book", "clock", "vase", "scissors",
              "teddy bear", "hair drier", "toothbrush"]

target_objects = {"banana", "apple", "sandwich", "orange", "broccoli", "carrot", "hot dog", "pizza", "donut", "cake"}

# Global variable to store detected object names
detected_objects = set()

@app.route('/')
def index():
    return render_template('indexing.html')

def gen_frames():
    global detected_objects
    while True:
        success, img = cap.read()
        if not success:
            break

        results = model(img, stream=True)

        # Clear the set at the start of each frame
        detected_objects.clear()

        for r in results:
            boxes = r.boxes
            for box in boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                confidence = math.ceil((box.conf[0] * 100)) / 100
                cls = int(box.cls[0])
                obj_name = classNames[cls]

                # Check if the detected object is in the target list
                if obj_name in target_objects:
                    detected_objects.add(obj_name)

                # Draw rectangle and label on the frame
                cv2.rectangle(img, (x1, y1), (x2, y2), (255, 0, 255), 3)
                cv2.putText(img, obj_name, (x1, y1), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)

        # If any target object is detected, break out of the loop
        if detected_objects:
            break

        ret, buffer = cv2.imencode('.jpg', img)
        if not ret:
            break

        frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/detection_status')
def detection_status():
    """Return the detected objects if any have been found"""
    if detected_objects:
        return jsonify({"detected": True, "objects": list(detected_objects)})
    return jsonify({"detected": False})
@app.route('/restart_camera', methods=['POST'])
def restart_camera():
    global cap, detected_objects
    detected_objects.clear()  # Clear previous detections

    # Reinitialize the camera
    if cap.isOpened():
        cap.release()  # Release the current camera feed if open
    cap = cv2.VideoCapture(0)  # Restart the camera
    cap.set(3, 640)  # Set frame width
    cap.set(4, 480)  # Set frame height

    return jsonify({"status": "camera restarted"})

if __name__ == '__main__':
    app.run(debug=True)
