class CameraController {
  constructor(videoElement, canvasElement, photoPreviewElement, imageInputElement) {
    this.video = videoElement;
    this.canvas = canvasElement;
    this.photoPreview = photoPreviewElement;
    this.imageInput = imageInputElement;
    this.stream = null;
    this.capturedImage = null;
  }

  async start() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.video.srcObject = this.stream;

      await new Promise((resolve) => {
        this.video.onloadedmetadata = () => resolve();
      });

      this.video.play();
      this._toggleCameraUI(true);
    } catch (err) {
      throw new Error('Gagal mengakses kamera');
    }
  }

  capture() {
    if (this.video.videoWidth === 0 || this.video.videoHeight === 0) {
      return null;
    }

    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;

    const ctx = this.canvas.getContext('2d');
    ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

    return this._canvasToBlob();
  }

  async _canvasToBlob() {
    return new Promise((resolve, reject) => {
      this.canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Gagal mengambil gambar'));
          return;
        }

        this.capturedImage = blob;
        const imageUrl = URL.createObjectURL(blob);
        this.photoPreview.src = imageUrl;
        this.photoPreview.style.display = 'block';
        this.photoPreview.classList.add('show');
        this.stop();
        resolve(blob);
      }, 'image/png');
    });
  }

  stop() {
    console.log('[CameraController] stop() dipanggil');
    if (this.stream) {
      console.log('[CameraController] menghentikan stream...');
      this.stream.getTracks().forEach((track) => track.stop());
      this.video.srcObject = null;
      this.stream = null;
      this._toggleCameraUI(false);
    }else{
      console.log('[CameraController] tidak ada stream untuk dihentikan');
    }
  }

  setImageFile(file) {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      this.photoPreview.src = imageUrl;
      this.photoPreview.style.display = 'block';
      this.capturedImage = file;
    }
  }

  getImage() {
    return this.capturedImage;
  }

  _toggleCameraUI(isOn) {
    this.video.style.display = isOn ? 'block' : 'none';
    this.imageInput.style.display = isOn ? 'none' : 'block';
  }
}

export default CameraController;
