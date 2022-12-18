export class EntityAbstract {
  id: number;
  isFavorite?: boolean;
  
  constructor(data: EntityAbstract) {
    this.id = data.id;
  }
}
