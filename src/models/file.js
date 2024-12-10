class CustomFile {
  constructor(file, data = {}) {
    // Preserve the original file for compatibility with FormData and other APIs
    this.originalFile = file;

    // Proxy the native File properties
    this.name = file.name;
    this.type = file.type;
    this.size = file.size;
    this.lastModified = file.lastModified;

    // Add custom properties
    this.id = data.id || null;
    this.extract = data.extract || true;
    this.extractionResults = data.extractionResults || null;
    this.status = data.status || { loading: false, completed: false, progress: 0 };
  }

  toggleExtract() {
    this.extract = !this.extract;
    console.log("Extract toggled: ", this.extract);
  }
}

export default CustomFile;



