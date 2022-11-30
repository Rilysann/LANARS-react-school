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

  async post(path: `${Route}${string}`, data: any) {
    const [route] = this.getParams(path);
    
    try {
      await this.errorRequest(route, data);
    } catch (error) {
      return this.errorRequest(route, data);
    }

    return await this.routes[route]?.create(data);
  }

  async get(path: `${Route}${string}`) {
    const [route, query] = this.getParams(path);

    try {
      await this.errorRequest(route);
    } catch (error) {
      return this.errorRequest(route);
    }

    console.log(query);
    return await this.routes[route]?.read(new Query(query as Query));
  }

  async patch(path: `${Route}${string}`, data: any) {
    const [route] = this.getParams(path);
    try {
      if (!data.id) {
        throw new ServerError(400, 'Property "id" is required');
      }
      await this.errorRequest(route, data);
    } catch (error) {
      return this.errorRequest(route, data);
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
    return await this.routes[route]?.delete(new Query(query as Query));
  }

  private getParams(route: `${Route}${string}`): [Route, Object] {
    const split = route.split('?');
    return [split[0] as Route, queryString.parse(split[1], {arrayFormat: 'comma'})];
  }

  private errorRequest(route: Route, data?: any, checkRequired = true): Promise<boolean> {
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
