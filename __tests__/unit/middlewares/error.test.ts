import { ApiError, STATUS_CODE } from "../../../constants";
import { errorHandler } from "../../../middlewares";
import httpMocks from "node-mocks-http";

describe("Error Middleware", () => {
  const OLD_ENV = process.env;
  const nextFn = jest.fn();

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });
  
  test("should send proper error response", () => {
    const error = new ApiError("Bad Request", STATUS_CODE.BAD_REQUEST);
    const response = httpMocks.createResponse();
    const sendSpy = jest.spyOn(response, 'send');
    
    
    errorHandler(error, httpMocks.createRequest(), response, nextFn);

    expect(sendSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        message: error.nativeMsg,
      })
    )
  });

  test("should send the error stack in development mode", () => {
    process.env.NODE_ENV = "development";
    const error = new ApiError("Bad Request", STATUS_CODE.BAD_REQUEST);
    const response = httpMocks.createResponse();
    const sendSpy = jest.spyOn(response, 'send');
    
    errorHandler(error, httpMocks.createRequest(), response, nextFn);

    expect(sendSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        message: error.nativeMsg,
        stack: error.stack?.split("\n    "),
      })
    )
  });

});