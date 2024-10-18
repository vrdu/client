class project {
      constructor(data = {}) {
            this.id = null;
            this.toImport = null;
            this.projectName = null;
            this.labelFamilies = [];
            Object.assign(this, data);
      }
    }
    export default project;