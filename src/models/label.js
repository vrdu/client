class label {
    constructor(data = {}) {
      this.id = null;
      this.labelName = null;
      this.labelDescription = null;
      this.index = String(data.index || '');
      Object.assign(this, data);
    }
  }
  export default label;