class file {
    constructor(data = {}) {
      this.id = null;
      this.fileName = null;
      this.fileData = null;
      this.extract = null;
      this.status = null;
      Object.assign(this, data);
    }
  }
  export default file;