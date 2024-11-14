class File {
  constructor(data = {}) {
    this.id = data.id || null;
    this.file = data.file || null;
    this.extract = data.extract || false;
    this.status = data.status || null;
  }

  toggleExtract() {
    this.extract = !this.extract;
    console.log("Extract: ", this.extract);
  }
}

export default File;

