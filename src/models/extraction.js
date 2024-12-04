class Extraction {
    constructor(data = {}) {
        this.id = data.id || null;
        this.name = data.name || null;
        this.f1 = data.f1 || null;
        this.anls = data.anls || null
        this.documentNames = data.documentNames || [];
      }
}
    export default Extraction;


