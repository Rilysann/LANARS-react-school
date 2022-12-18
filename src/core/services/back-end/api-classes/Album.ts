/* eslint-disable */
import { ServerError } from '.';
import { BackEndAbstract } from './BackEndAbstract';

export class Album extends BackEndAbstract<AlbumEntity> {
  readonly route = '/api/albums';
  readonly tableName = 'albums';
  readonly requiredFields = ['title'];

  constructor() {
    super();
  }

  validate(data: any, checkRequired = true) {
    const allFields = Object.keys(new AlbumEntity(data));

    if (checkRequired) {
      for (const key of this.requiredFields) {
        if (!data[key]) {
          throw new ServerError(400, `Property "${key}" is required`);
        }
      }
    }

    for (const key of Object.keys(data)) {
      if (!allFields.includes(key)) {
        throw new ServerError(
          400,
          `Unknown property "${key}". You can only use one of the following: "${allFields.join('", "')}"`,
        );
      }
    }
  }

  entity(data: AlbumEntity): AlbumEntity {
    return new AlbumEntity(data);
  }
}

export class AlbumEntity {
  title = '';
  description = '';
  photos = []; 
  date: number;
  id?: number;

  constructor(data: AlbumEntity) {
    this.date = Date.now();
    this.title = data.title;
    this.description = data.description || '';
    this.photos = data.photos || this.photos;
    if (data.id) {
      this.id = data.id;
    } else {
      delete this.id;
    }
  }
}