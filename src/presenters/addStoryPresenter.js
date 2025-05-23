class AddStoryPresenter {
  constructor(view, model, cameraController) {
    this.view = view;
    this.model = model;
    this.camera = cameraController;
  }

  async init() {
    this.view.bindStartCamera(this.startCamera.bind(this));
    this.view.bindTakePhoto(this.takePhoto.bind(this));
    this.view.bindStopCamera(this.stopCamera.bind(this));
    this.view.bindFormSubmit(this.addStory.bind(this));
  }

  async startCamera() {
    try {
      await this.camera.start();
    } catch (error) {
      this.view.showCameraError?.(error.message || 'Gagal mengakses kamera');
    }
  }

  async takePhoto() {
    try {
      const imageBlob = await this.camera.capture();
      if (!imageBlob) {
        this.view.showCaptureError?.('Gagal mengambil gambar');
        return;
      }
      this.view.showCapturedPhoto?.(imageBlob);
    } catch (error) {
      this.view.showCaptureError?.(error.message || 'Gagal mengambil gambar');
    }
  }

  stopCamera() {
    this.camera.stop();
  }

  handleImageFileChange(file) {
    this.camera.setImageFile(file);
  }

  async addStory(formData) {
    try {
      const token = this.model.getToken();
      if (!token) throw new Error('Token tidak ditemukan. Silakan login kembali.');

      const result = await this.model.addStory(formData, token);
      if (result.error) {
        this.view.showAddStoryError(result.message);
        return false;
      }

      this.view.showAddStorySuccess();
      return true;
    } catch (error) {
      this.view.showAddStoryError(error.message || 'Gagal menambahkan cerita');
      return false;
    }
  }

  destroy() {
    console.log('[AddStoryPresenter] destroy() dipanggil');
    this.camera.stop();
  }
}

export default AddStoryPresenter;
