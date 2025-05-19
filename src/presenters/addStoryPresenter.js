class AddStoryPresenter {
  constructor(view, model, token = null) {
    this.view = view;
    this.model = model;
    this.token = token || localStorage.getItem("token");
  }

  async addStory(formData) {
    try {
      if (!this.token) {
        throw new Error('Token tidak ditemukan, silakan login kembali');
      }

      const result = await this.model.addStory(formData, this.token);
      
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
}

export default AddStoryPresenter;