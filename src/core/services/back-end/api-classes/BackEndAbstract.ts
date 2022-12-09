/* eslint-disable */

import { EntityAbstract } from 'shared/entities/EntityAbstract';
import Storage from '../Storage';
import { Query } from './Query';
import { ServerError } from './ServerError';

export type Route = '/api/albums' | '/api/photos';
export type Tablename = 'albums' | 'photos';

export abstract class BackEndAbstract<Entity extends object> {
  abstract readonly route: Route;
  abstract readonly tableName: Tablename;
  abstract readonly requiredFields: string[];

  constructor() {}

  async create<T extends Entity>(data: T): Promise<T> {
    const newId = await Storage.putValue(this.tableName, this.entity(data));
    return Storage.getValue(this.tableName, newId);
  }

  async read<T, I extends number | undefined>(query: Query): Promise<I extends number ? T : T[]> {
    if (query.ids.length === 1) {
      return await Storage.getValue(this.tableName, query.ids[0]);
    }

    const values = await Storage.getAllValue(this.tableName);
    let filteredValues = values;
    
    if (query.ids.length) {
      filteredValues = filteredValues?.filter((value: EntityAbstract) => query?.ids?.includes(value.id));
    }

    return filteredValues.splice(query.offset, query.limit);
  }

  async update<T extends Entity & {id: number}>(data: T): Promise<T> {
    const existingData = await Storage.getValue(this.tableName, data.id);
    if (existingData) {
      const newId = await Storage.putValue(this.tableName, data);
      console.log(newId);
      
      return Storage.getValue(this.tableName, newId);
    } else {
      return new Promise((resolve, reject) => {
        reject(new ServerError(404, `Object with id ${data.id} was not found`));
        throw new ServerError(404, `Object with id ${data.id} was not found`);
      });
    }
  }

  async delete(query: Query): Promise<any> {
    if (!query.ids?.length) {
      return new Promise((resolve, reject) => {
        reject(new ServerError(400, 'Please provide ids you want to delete'));
        throw new ServerError(400, 'Please provide ids you want to delete');
      });
    }

    const result = query.ids.map((id) => {
      return new Promise(async (resolve, reject) => {
        const deleteValue = await Storage.deleteValue(this.tableName, id);
        if (typeof deleteValue === 'number') {
          resolve(deleteValue);
        } else {
          reject(deleteValue);
          throw deleteValue;
        }
      })
    });
    
    return Promise.all(
      result
    );
  }
  abstract validate(data: object, checkRequired: boolean): void;
  abstract entity(data: Entity): Entity;
}
