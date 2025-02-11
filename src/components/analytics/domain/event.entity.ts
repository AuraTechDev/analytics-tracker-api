export class Event {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly timestamp: number,
    public readonly payload: Record<string, unknown>,
  ) {}
}
