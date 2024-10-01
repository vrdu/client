class labelFamily {
    constructor(data = {}) {
      this.id = null;
      this.labelFamilyName = null;
      this.labelFamilyDescription = null;
      this.labels = [];

    this.id = data.id || this.id;
    this.labelFamilyName = data.labelFamilyName || this.labelFamilyName;
    this.labelFamilyDescription = data.labelFamilyDescription || this.labelFamilyDescription;
    this.labels = data.labels || []; 

    }
  }
  export default labelFamily;