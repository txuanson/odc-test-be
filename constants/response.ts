class ApiError extends Error {
  statusCode?: number;
  nativeMsg: string | object | any;

  constructor(message: string | object | any, statusCode?: number) {
      super();
      this.statusCode = statusCode;
      this.nativeMsg = message;
  }

  getCode() {
      if (this.statusCode) return this.statusCode;
      if (this instanceof BadRequestError) return STATUS_CODE.BAD_REQUEST;

      if (this instanceof UnauthorizedError) return STATUS_CODE.UNAUTHORIZED;

      if (this instanceof ForbiddenError) return STATUS_CODE.FORBIDDEN;

      if (this instanceof NotFoundError) return STATUS_CODE.NOT_FOUND;

      return STATUS_CODE.INTERNAL_SERVER_ERROR;
  }
}

class BadRequestError extends ApiError { }
class UnauthorizedError extends ApiError { }
class ForbiddenError extends ApiError { }
class NotFoundError extends ApiError { }
class InternalServerError extends ApiError { }

const STATUS_CODE = {
  SUCCESS: 200,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
  METHOD_NOT_ALLOW: 405,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
};

export { ApiError, BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, InternalServerError, STATUS_CODE };
