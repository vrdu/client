class Document {
      constructor(data = {}) {
            const {
                  base64PdfData = null,
                  boxes = null,
                  annotations = null, 
                  name = null 
              } = data;
      
              this.base64PdfData = base64PdfData;
              this.boxes = boxes;
              this.annotations = annotations;
              this.name = name;
          }
  }
      export default Document;


