export function cast<ToType>(resource: unknown): ToType {
  return resource as unknown as ToType;
}
