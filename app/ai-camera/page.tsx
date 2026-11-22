'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Header from '@/app/components/Header';

type CameraMode = 'full-body' | 'upper-body' | 'arm';

type PoseResult = {
  landmarks: Array<Array<{ x: number; y: number; visibility?: number }>>;
};

type PoseLandmarkerInstance = {
  detectForVideo: (video: HTMLVideoElement, timestamp: number) => PoseResult;
  close: () => void;
};

function isSecureContextAvailable() {
  return window.isSecureContext || window.location.hostname === 'localhost';
}

export default function AICameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const poseRef = useRef<PoseLandmarkerInstance | null>(null);
  const animationRef = useRef<number | null>(null);

  const [cameraState, setCameraState] = useState<'idle' | 'starting' | 'live' | 'captured'>('idle');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [mode, setMode] = useState<CameraMode>('full-body');
  const [modelState, setModelState] = useState<'unavailable' | 'loading' | 'loaded' | 'error'>('unavailable');
  const [modelMessage, setModelMessage] = useState('AI model unavailable');
  const [personDetected, setPersonDetected] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [imageQuality, setImageQuality] = useState<'waiting' | 'good' | 'warning'>('waiting');
  const [qualityMessage, setQualityMessage] = useState('Position the child inside the guide.');
  const [childId, setChildId] = useState('');
  const [consent, setConsent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      poseRef.current?.close();
    };
  }, []);

  const refreshCameras = async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return;
    const devices = await navigator.mediaDevices.enumerateDevices();
    setCameras(devices.filter((device) => device.kind === 'videoinput'));
  };

  const drawOverlay = (pose: PoseResult | null) => {
    const video = videoRef.current;
    const canvas = overlayRef.current;
    if (!video || !canvas) return;
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    const context = canvas.getContext('2d');
    if (!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.strokeStyle = '#60A5FA';
    context.lineWidth = 3;
    context.setLineDash([12, 8]);
    context.strokeRect(canvas.width * 0.18, canvas.height * 0.08, canvas.width * 0.64, canvas.height * 0.84);
    context.setLineDash([]);

    if (!pose?.landmarks?.length) {
      setPersonDetected(false);
      return;
    }

    const landmarks = pose.landmarks[0];
    if (!landmarks?.length) {
      setPersonDetected(false);
      return;
    }

    setPersonDetected(true);
    context.fillStyle = '#22C55E';
    for (const landmark of landmarks) {
      if ((landmark.visibility ?? 1) < 0.45) continue;
      context.beginPath();
      context.arc(landmark.x * canvas.width, landmark.y * canvas.height, 4, 0, Math.PI * 2);
      context.fill();
    }

    const connections = [
      [11, 12], [11, 13], [13, 15], [12, 14], [14, 16],
      [11, 23], [12, 24], [23, 24], [23, 25], [25, 27], [24, 26], [26, 28],
    ];
    context.strokeStyle = 'rgba(34,197,94,0.85)';
    context.lineWidth = 2;
    for (const [from, to] of connections) {
      const a = landmarks[from];
      const b = landmarks[to];
      if (!a || !b || (a.visibility ?? 1) < 0.45 || (b.visibility ?? 1) < 0.45) continue;
      context.beginPath();
      context.moveTo(a.x * canvas.width, a.y * canvas.height);
      context.lineTo(b.x * canvas.width, b.y * canvas.height);
      context.stroke();
    }
  };

  const runDetectionLoop = () => {
    const video = videoRef.current;
    if (!video || video.readyState < 2 || !poseRef.current) return;
    const pose = poseRef.current.detectForVideo(video, performance.now()) as PoseResult;
    drawOverlay(pose);
  };

  const startLoop = () => {
    const loop = () => {
      runDetectionLoop();
      animationRef.current = requestAnimationFrame(loop);
    };
    if (animationRef.current === null) animationRef.current = requestAnimationFrame(loop);
  };

  const loadModel = async () => {
    setModelState('loading');
    setModelMessage('Loading AI model...');
    try {
      const vision = await import('@mediapipe/tasks-vision');
      const fileset = await vision.FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm',
      );
      const landmarker = await vision.PoseLandmarker.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numPoses: 1,
      });
      poseRef.current = landmarker as unknown as PoseLandmarkerInstance;
      setModelState('loaded');
      setModelMessage('AI model loaded: real pose landmarks');
      if (cameraState === 'live') startLoop();
    } catch (error) {
      console.error('MediaPipe pose model unavailable:', error);
      setModelState('error');
      setModelMessage('AI model unavailable');
    }
  };

  const stopCamera = () => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraState('idle');
    setPersonDetected(false);
  };

  const startCamera = async (deviceId?: string) => {
    setCameraError(null);
    if (!isSecureContextAvailable()) {
      setCameraError('Camera access requires HTTPS or localhost.');
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('This browser does not provide camera access.');
      return;
    }

    stopCamera();
    setCameraState('starting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: deviceId
          ? { deviceId: { exact: deviceId }, width: { ideal: 1280 }, height: { ideal: 720 } }
          : { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraState('live');
      await refreshCameras();
      if (poseRef.current) startLoop();
    } catch (error) {
      const name = error instanceof DOMException ? error.name : '';
      if (name === 'NotAllowedError') setCameraError('Camera permission was denied. Allow camera access and try again.');
      else if (name === 'NotFoundError') setCameraError('No camera device was found.');
      else if (name === 'NotReadableError') setCameraError('The camera is unavailable or being used by another application.');
      else setCameraError('The camera could not be started.');
      setCameraState('idle');
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    if (!video || cameraState !== 'live') return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const sample = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let luminanceSum = 0;
    let luminanceCount = 0;
    for (let index = 0; index < sample.length; index += 1600) {
      luminanceSum += 0.299 * sample[index] + 0.587 * sample[index + 1] + 0.114 * sample[index + 2];
      luminanceCount += 1;
    }
    const averageLuminance = luminanceCount ? luminanceSum / luminanceCount : 0;

    const blurCanvas = document.createElement('canvas');
    blurCanvas.width = 160;
    blurCanvas.height = 120;
    const blurContext = blurCanvas.getContext('2d', { willReadFrequently: true });
    let blurVariance = 0;
    if (blurContext) {
      blurContext.drawImage(canvas, 0, 0, blurCanvas.width, blurCanvas.height);
      const pixels = blurContext.getImageData(0, 0, blurCanvas.width, blurCanvas.height).data;
      const gray = new Float32Array(blurCanvas.width * blurCanvas.height);
      for (let index = 0; index < gray.length; index += 1) {
        const pixelIndex = index * 4;
        gray[index] = 0.299 * pixels[pixelIndex] + 0.587 * pixels[pixelIndex + 1] + 0.114 * pixels[pixelIndex + 2];
      }
      const laplacian: number[] = [];
      for (let y = 1; y < blurCanvas.height - 1; y += 1) {
        for (let x = 1; x < blurCanvas.width - 1; x += 1) {
          const index = y * blurCanvas.width + x;
          laplacian.push(
            -gray[index - blurCanvas.width] - gray[index - 1] + 4 * gray[index] -
            gray[index + 1] - gray[index + blurCanvas.width],
          );
        }
      }
      if (laplacian.length) {
        const mean = laplacian.reduce((sum, value) => sum + value, 0) / laplacian.length;
        blurVariance = laplacian.reduce((sum, value) => sum + (value - mean) ** 2, 0) / laplacian.length;
      }
    }

    if (averageLuminance < 55) {
      setImageQuality('warning');
      setQualityMessage('Low light detected. Improve lighting and retake.');
    } else if (averageLuminance > 230) {
      setImageQuality('warning');
      setQualityMessage('The image may be overexposed. Reduce direct light.');
    } else if (blurVariance < 20) {
      setImageQuality('warning');
      setQualityMessage('Possible blur detected. Keep the camera steady and retake.');
    } else {
      setImageQuality('good');
      setQualityMessage(personDetected ? 'Lighting is acceptable and a person was detected.' : 'Lighting is acceptable. Position a person inside the frame for pose detection.');
    }

    setCapturedImage(canvas.toDataURL('image/jpeg', 0.88));
    setCameraState('captured');
  };

  const retake = () => {
    setCapturedImage(null);
    setSavedMessage(null);
    setConsent(false);
    setCameraState('live');
  };

  const deleteCapture = () => {
    setCapturedImage(null);
    setSavedMessage(null);
    setConsent(false);
    setCameraState('idle');
  };

  const confirmAndSave = async () => {
    if (!capturedImage || !childId.trim() || !consent) return;
    setSaving(true);
    setSavedMessage(null);
    try {
      const response = await fetch('/api/camera-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childId: childId.trim(),
          mimeType: 'image/jpeg',
          data: capturedImage,
          consent: true,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'The image could not be saved.');
      setSavedMessage(`Capture saved privately for child ${childId.trim()}.`);
    } catch (error) {
      setSavedMessage(error instanceof Error ? error.message : 'The image could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="bg-white text-slate-900">
        <Header currentPage="ai-camera" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-blue-300">Live computer vision</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">AI-PNAS SMART VISION</h1>
            <p className="mt-3 text-slate-300">AI-powered visual assistance for child nutrition screening.</p>
          </div>
          {cameraState === 'live' && (
            <div className="flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-200">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
              Live capture
            </div>
          )}
        </div>

        {cameraError && (
          <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100" role="alert">
            {cameraError}
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
          <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 shadow-2xl">
            <div className="relative aspect-[4/3] min-h-[320px] overflow-hidden bg-black">
              {capturedImage ? (
                // Captured images are previews only; confirmation is required before API storage.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={capturedImage} alt="Captured child nutrition screening preview" className="h-full w-full object-contain" />
              ) : (
                <>
                  <video ref={videoRef} muted playsInline className="h-full w-full object-contain" />
                  <canvas ref={overlayRef} className="pointer-events-none absolute inset-0 h-full w-full" />
                  {cameraState !== 'live' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/75 p-8 text-center">
                      <div>
                        <p className="text-xl font-bold">Camera is not active</p>
                        <p className="mt-2 text-sm text-slate-300">Permission is required before the live preview starts.</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-white/10 p-4">
              {cameraState === 'idle' || cameraState === 'starting' ? (
                <button type="button" onClick={() => startCamera()} disabled={cameraState === 'starting'} className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-500 disabled:opacity-60">
                  {cameraState === 'starting' ? 'Starting...' : 'Start camera'}
                </button>
              ) : cameraState === 'live' ? (
                <>
                  <button type="button" onClick={captureImage} className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-500">Capture photograph</button>
                  <button type="button" onClick={stopCamera} className="rounded-xl border border-white/15 px-5 py-3 font-bold text-white hover:bg-white/10">Stop camera</button>
                </>
              ) : (
                <>
                  <button type="button" onClick={retake} className="rounded-xl border border-white/15 px-5 py-3 font-bold text-white hover:bg-white/10">Retake</button>
                  <button type="button" onClick={deleteCapture} className="rounded-xl border border-red-400/30 px-5 py-3 font-bold text-red-200 hover:bg-red-500/10">Delete</button>
                </>
              )}

              {cameras.length > 1 && cameraState !== 'captured' && (
                <select
                  value={selectedCamera}
                  onChange={(event) => {
                    setSelectedCamera(event.target.value);
                    void startCamera(event.target.value);
                  }}
                  className="rounded-xl border border-white/15 bg-slate-800 px-3 py-3 text-sm text-white"
                  aria-label="Choose camera"
                >
                  <option value="">Default / rear camera</option>
                  {cameras.map((camera) => (
                    <option key={camera.deviceId} value={camera.deviceId}>{camera.label || 'Camera'}</option>
                  ))}
                </select>
              )}
            </div>
          </section>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-white/10 bg-slate-900 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Capture guide</p>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {(['full-body', 'upper-body', 'arm'] as CameraMode[]).map((option) => (
                  <button
                    type="button"
                    key={option}
                    onClick={() => setMode(option)}
                    className={`rounded-xl px-2 py-3 text-xs font-bold ${mode === option ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-300'}`}
                  >
                    {option === 'full-body' ? 'Full body' : option === 'upper-body' ? 'Upper body' : 'Arm'}
                  </button>
                ))}
              </div>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-300">
                <li>• Place the child in a well-lit area.</li>
                <li>• Keep the camera steady and centered.</li>
                <li>• Keep the relevant body area visible.</li>
                <li>• Avoid blur or obstruction.</li>
                <li>• Do not force unsafe positioning.</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-white/10 bg-slate-900 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Vision model</p>
                  <p className="mt-2 text-sm">{modelMessage}</p>
                </div>
                {modelState === 'loaded' && <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300">Loaded</span>}
              </div>
              {modelState !== 'loaded' && (
                <button type="button" onClick={loadModel} disabled={modelState === 'loading'} className="mt-4 w-full rounded-xl border border-blue-400/30 px-4 py-3 text-sm font-bold text-blue-200 hover:bg-blue-500/10 disabled:opacity-60">
                  {modelState === 'loading' ? 'Loading model...' : 'Load pose model'}
                </button>
              )}
              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className={`h-2.5 w-2.5 rounded-full ${personDetected ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                <span>{personDetected ? 'Person/pose detected' : 'No person or pose detected'}</span>
              </div>
            </section>

            {capturedImage && (
              <section className="rounded-2xl border border-white/10 bg-slate-900 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Capture review</p>
                <p className={`mt-3 text-sm font-bold ${imageQuality === 'warning' ? 'text-amber-300' : 'text-emerald-300'}`}>{qualityMessage}</p>
                <label className="mt-4 block text-sm font-bold">
                  Permanent AI-PNAS Child ID
                  <input value={childId} onChange={(event) => setChildId(event.target.value)} className="mt-2 w-full rounded-xl border border-white/15 bg-slate-800 px-3 py-3 text-white outline-none" placeholder="AI-PNAS-..." />
                </label>
                <label className="mt-4 flex items-start gap-3 text-sm leading-6 text-slate-300">
                  <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1" />
                  <span>Guardian consent and authorized health-worker capture confirmed.</span>
                </label>
                <button type="button" onClick={confirmAndSave} disabled={!childId.trim() || !consent || saving} className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-3 font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-600">
                  {saving ? 'Saving privately...' : 'Confirm and save'}
                </button>
                {savedMessage && <p className="mt-3 text-sm text-slate-300">{savedMessage}</p>}
              </section>
            )}

            <Link href="/register" className="block rounded-2xl border border-white/10 bg-slate-900 p-5 text-sm font-bold text-blue-200 hover:bg-slate-800">
              Continue to nutrition assessment →
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
