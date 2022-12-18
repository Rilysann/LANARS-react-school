/* eslint-disable */
import { ServerError } from '.';
import { BackEndAbstract } from './BackEndAbstract';

export class Photo extends BackEndAbstract<PhotoEntity> {
  readonly requiredFields = ['image'];
  readonly route = '/api/photos';
  readonly tableName = 'photos';

  constructor() {
    super();
  }

  validate(data: any, checkRequired = true) {
    const allFields = Object.keys(new PhotoEntity(data));

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

  entity(data: PhotoEntity): PhotoEntity {
    return new PhotoEntity(data);
  }

  // create<PhotoEntity>(data: PhotoEntity): Promise<PhotoEntity> {
  //   return super.create(this.entity(data));
  // }
}

export class PhotoEntity {
  image: string;
  description = '';
  date = 0;
  size = 0;
  type = '';
  id?: number;
  isFavorite = false;
  
  constructor(data: PhotoEntity) {
    this.date = data.date;
    this.description = data.description || '';
    this.image = data.image;
    this.size = data.size;
    this.type = data.type;
    if (data.id) {
      this.id = data.id;
    } else {
      delete this.id;
    }
  }
}
