import { ServerError } from './api-classes/ServerError';
import { IDBPDatabase, openDB } from 'idb';
/* eslint no-console: 0 */  // --> OFF
class Storage {

  db: any;

  constructor(private dbName = 'LANARS-react-school') {
  }

  public async createObjectStore(tableNames: string[]) {
    try {
      this.db = await openDB(this.dbName, 1, {
        upgrade(db: IDBPDatabase) {
          for (const tableName of tableNames) {
            if (db.objectStoreNames.contains(tableName)) {
              continue;
            }
            db.createObjectStore(tableName, { autoIncrement: true, keyPath: 'id' });
          }
        },
      });
    } catch (error) {
      return false;
    }
  }

  // taken from https://javascript.plainenglish.io/working-with-indexeddb-in-typescript-react-ad504a1bdae3
  async getValue(tableName: string, id: number) {
    const tx = this.db.transaction(tableName, 'readonly');
    const store = tx.objectStore(tableName);
    const result = await store.get(id);
    return result;
  }

  async getAllValue(tableName: string) {
    const tx = this.db.transaction(tableName, 'readonly');
    const store = tx.objectStore(tableName);
    const result = await store.getAll();
    return result;
  }

  async putValue(tableName: string, value: Object) {
    const tx = this.db.transaction(tableName, 'readwrite');
    const store = tx.objectStore(tableName);
    const result = await store.put(value);
    return result;
  }

  async putBulkValue(tableName: string, values: Object[]) {
    const tx = this.db.transaction(tableName, 'readwrite');
    const store = tx.objectStore(tableName);
    for (const value of values) {
      await store.put(value);
    }
    return this.getAllValue(tableName);
  }

  async deleteValue(tableName: string, id: number) {
    const tx = this.db.transaction(tableName, 'readwrite');
    const store = tx.objectStore(tableName);
    const result = await store.get(id);
    if (!result) {
      return new ServerError(
        404,
        `Entity with ID ${id} was not found in ${tableName}`
      );
    }
    await store.delete(id);
    return id;
  }
}

export default new Storage();
