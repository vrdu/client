class Annotation {
      constructor(data = {}) {
            this.text = null; 
            this.page = null;
            this.start = null; 
            this.end = null; 
            this.labelName = null;
            this.familyName = null;
            Object.assign(this, data);

      }
  }
  export default Annotation;

 
