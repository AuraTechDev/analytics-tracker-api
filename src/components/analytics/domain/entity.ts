export class Event {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly timestamp: Date,
    public readonly payload: Record<string, unknown>,
  ) {}
}
