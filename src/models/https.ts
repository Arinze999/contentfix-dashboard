export type HttpMethods = 'get' | 'post' | 'put' | 'delete' | 'patch';

export type HttpConfig = {
  url: string;
  method: HttpMethods;
  data?: any;
  headers?: any;
  params?: any;
};

export interface SuccessHttpResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface ErrorHttpResponse {
  status: string;
  message: any;
  data: any;
}

export interface PaginatedResponse {
  numberOfElements: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  totalPages: number;
  content: any;
}
