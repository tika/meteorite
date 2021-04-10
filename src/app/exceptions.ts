export class DisplayedError extends Error {
  constructor(public readonly code: number, message: string) {
    super(message);
  }
}

export class NotFound extends DisplayedError {
  constructor(resource: string) {
    super(404, `Unknown ${resource}`);
  }
}

export class Unauthorized extends DisplayedError {
  constructor(resource: string) {
    super(401, `You are not authorized to access resource ${resource}`);
  }
}

export class Unauthenticated extends DisplayedError {
  constructor(resource: string) {
    super(403, `You do not have access to resource ${resource}`);
  }
}

export class MissingData extends DisplayedError {
  constructor(resource: string) {
    super(422, `You must provide ${resource}`);
  }
}
