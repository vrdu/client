class labelFamily {
    constructor(data = {}) {
      this.id = null;
      this.index = null;
      this.labelFamilyName = null;
      this.oldLabelFamilyName = null;
      this.labelFamilyDescription = null;
      this.inUse = null;
      this.register = null;
      this.labels = [];
      this.toImport = null;


    this.id = data.id || this.id;
    this.index = String(data.index || '');
    this.labelFamilyName = data.labelFamilyName || this.labelFamilyName;
    this.inUse = data.inUse || this.inUse;
    this.oldLabelFamilyName = data.oldLabelFamilyName || this.oldLabelFamilyName;
    this.labelFamilyDescription = data.labelFamilyDescription || this.labelFamilyDescription;
    this.register = data.register || this.register;
    this.labels = data.labels || []; 
    this.toImport = data.toImport || this.toImport;

    }
  }
  export default labelFamily;