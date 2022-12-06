/* eslint-disable */
/* eslint no-console: 0 */  // --> OFF
import {BackEndAbstract, Route} from './back-end/api-classes/BackEndAbstract';
import * as queryString from 'query-string';
import { Album, Photo, Query, ServerError } from './back-end/api-classes';

export class API {
  private routes: {[key in Route]: BackEndAbstract<any>} = {
    '/api/albums': new Album(),
    '/api/photos': new Photo(),
  };

  async post<T>(path: `${Route}${string}`, data: T): Promise<T[] | Awaited<T> | ServerError> {
    const [route] = this.getParams(path);
    
    try {
      await this.errorRequest(route, data);
    } catch (error) {
      return this.errorRequest(route, data) as Promise<ServerError>;
    }

    return await this.routes[route]?.create(data);
  }

  async get<T>(path: `${Route}${string}`): Promise<T[] | Awaited<T> | ServerError> {
    const [route, query] = this.getParams(path);

    try {
      await this.errorRequest(route);
    } catch (error) {
      return this.errorRequest(route) as Promise<ServerError>;
    }

    return await this.routes[route]?.read(new Query(query));
  }

  async patch<T extends {id: number}>(path: `${Route}${string}`, data: T): Promise<T | ServerError> {
    const [route] = this.getParams(path);
    try {
      if (!data.id) {
        throw new ServerError(400, 'Property "id" is required');
      }
      await this.errorRequest(route, data);
    } catch (error) {
      return this.errorRequest(route, data) as Promise<ServerError>;
    }
    const oldData = ((await this.get(`${path}?id=${data.id}`)) as any[])?.[0];
    
    return await this.routes[route]?.update({
      ...oldData,
      ...data,
    });
  }

  async delete(path: `${Route}${string}`) {
    const [route, query] = this.getParams(path);
    try {
      await this.errorRequest(route);
    } catch (error) {
      return this.errorRequest(route);
    }
    return await this.routes[route]?.delete(new Query(query));
  }

  private getParams(route: `${Route}${string}`): [Route, Object] {
    const split = route.split('?');
    return [split[0] as Route, queryString.parse(split[1], {arrayFormat: 'comma'})];
  }

  private errorRequest(route: Route, data?: any, checkRequired = true): Promise<boolean | ServerError> {
    return new Promise(((resolve, reject) => {
      if (!this.routes[route]) {
        reject(new ServerError(404, 'Not found'));
        throw new ServerError(404, 'Not found');
      }

      if (data) {
        this.routes[route].validate(data, checkRequired);
      }

      resolve(true);
    }));
  }
}

export default new API();
