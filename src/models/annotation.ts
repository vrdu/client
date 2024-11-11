export class Annotation {
      text: string | undefined = undefined;
      labelName: string | null = null;
      familyName: string | null = null;
      checked: boolean | null = null;
    
      constructor(data: Partial<Annotation> = {}) {
        Object.assign(this, data);
      }
    }
    