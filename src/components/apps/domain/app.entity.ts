export interface AppModel {
  id: string;
  name: string;
  apiKey: string;
  createdAt: Date;
}

export class App {
  constructor(public readonly attributes: AppModel) {}

  static create(name: string): App {
    const id = crypto.randomUUID();
    const apiKey = crypto.randomUUID();
    const createdAt = new Date();

    return new App({
      id,
      name,
      apiKey,
      createdAt,
    });
  }
}
