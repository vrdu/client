class label {
    constructor(data = {}) {
      this.id = null;
      this.labelName = null;
      this.labelDescription = null;
      this.index = String(data.index || '');
      this.register = null;
      this.familyName = null;
      this.oldLabelName = null;
      Object.assign(this, data);
    }
  }
  export default label;