import {
  PoseLandmarker,
  FilesetResolver,
  DrawingUtils,
} from "@mediapipe/tasks-vision";
import React, { useEffect } from "react";

const Video = () => {
  useEffect(() => {
    let poseLandmarker: any = undefined;
    let runningMode: any = "VIDEO";
    let enableWebcamButton: any;
    let webcamRunning: Boolean = false;
    const videoHeight: string = "360px";
    const videoWidth: string = "480px";
    const wasmAssetPath =
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/wasm";
    const modelAssetPath = `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task`;
    const createPoseLandmarker = async () => {
      const vision = await FilesetResolver.forVisionTasks(wasmAssetPath);
      poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: modelAssetPath,
          delegate: "GPU",
        },
        runningMode: runningMode,
        numPoses: 2,
      });
    };
    createPoseLandmarker();

    const video = document.getElementById("webcam") as HTMLVideoElement;
    const canvasElement = document.getElementById(
      "output_canvas"
    ) as HTMLCanvasElement;
    const canvasCtx: any = canvasElement.getContext("2d");
    const drawingUtils = new DrawingUtils(canvasCtx);

    const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia;

    if (hasGetUserMedia()) {
      enableWebcamButton = document.getElementById("webcamButton");
      enableWebcamButton.addEventListener("click", enableCam);
    } else {
      console.warn("getUserMedia() is not supported by your browser");
    }

    function enableCam(event: any) {
      if (!poseLandmarker) {
        console.log("Wait! poseLandmaker not loaded yet.");
        return;
      }

      if (webcamRunning === true) {
        webcamRunning = false;
        enableWebcamButton.innerText = "ENABLE PREDICTIONS";
      } else {
        webcamRunning = true;
        enableWebcamButton.innerText = "DISABLE PREDICTIONS";
      }

      const constraints = {
        video: true,
      };

      navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        video.srcObject = stream;
        video.addEventListener("loadeddata", predictWebcam);
      });
    }

    let lastVideoTime = -1;
    async function predictWebcam() {
      try {
        canvasElement.style.height = videoHeight;
        video.style.height = videoHeight;
        canvasElement.style.width = videoWidth;
        video.style.width = videoWidth;

        let startTimeMs = performance.now();
        if (lastVideoTime !== video.currentTime) {
          lastVideoTime = video.currentTime;
          poseLandmarker.detectForVideo(video, startTimeMs, (result: any) => {
            canvasCtx?.save();
            canvasCtx?.clearRect(
              0,
              0,
              canvasElement.width,
              canvasElement.height
            );
            for (const landmark of result.landmarks) {
              drawingUtils.drawLandmarks(landmark, {
                radius: (data) =>
                  DrawingUtils.lerp(data.from!.z, -0.15, 0.1, 5, 1),
              });
              drawingUtils.drawConnectors(
                landmark,
                PoseLandmarker.POSE_CONNECTIONS
              );
            }
            canvasCtx?.restore();
          });
        }

        if (webcamRunning === true) {
          window.requestAnimationFrame(predictWebcam);
        }
      } catch (error) {
        console.error("Error in predictWebcam:", error);
      }
    }
  }, []);
  return (
    <div className="video">
      <div id="liveView" className="videoView">
        <button id="webcamButton" className="mdc-button mdc-button--raised">
          <span className="mdc-button__label">ENABLE WEBCAM</span>
        </button>
        <div style={{ position: "relative" }}>
          <video
            id="webcam"
            style={{ width: "1280px", height: "720px", position: "absolute" }}
            autoPlay
            playsInline
          ></video>

          <canvas
            className="output_canvas"
            id="output_canvas"
            width="1280"
            height="720"
            style={{ position: "absolute", left: "0px", top: "0px" }}
          ></canvas>
        </div>
      </div>
    </div>
  );
};

export default Video;
