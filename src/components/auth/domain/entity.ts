export interface AppModel {
  id: string;
  name: string;
  apiKey: string;
  createdAt: Date;
}

export class App {
  constructor(public readonly attributes: AppModel) {}
}
