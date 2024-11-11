class LabelFamily {
  id: number | null;
  index: string;
  labelFamilyName: string | null;
  oldLabelFamilyName: string | null;
  labelFamilyDescription: string | null;
  inUse: boolean | null;
  register: any; 
  labels: any[]; 
  toImport: boolean | null;

  constructor(data: Partial<LabelFamily> = {}) {
    this.id = data.id ?? null;
    this.index = String(data.index ?? '');
    this.labelFamilyName = data.labelFamilyName ?? null;
    this.oldLabelFamilyName = data.oldLabelFamilyName ?? null;
    this.labelFamilyDescription = data.labelFamilyDescription ?? null;
    this.inUse = data.inUse ?? null;
    this.register = data.register ?? null;
    this.labels = data.labels ?? [];
    this.toImport = data.toImport ?? null;
  }
}

export default LabelFamily;
