class label {
    constructor(data = {}) {
      this.id = null;
      this.labelName = null;
      this.labelDescription = null;
      Object.assign(this, data);
    }
  }
  export default label;