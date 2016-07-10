/**
 * Created by arkhemlol on 10.07.2016.
 */
 export class IncrementService implements KS.mock.IIncrementService {
  private lastId: number = 0;

  constructor() {}

  stamp = (obj: any): number => {
    obj._ks_id = obj._ks_id || ++this.lastId;
    return obj._ks_id;
  };

  addUid = (item: any) => {
    this.stamp(item);
    _.forOwn(item, (prop: any) => {
      if(_.isArray(prop) && _.isObject(prop[0])) {
        _.each(prop, this.addUid);
      }
    }, this);
    return item;
  };

  removeUid = (item: any) => {
    if(item._ks_id) {
      delete item._ks_id;
      this.lastId--;
    }
    _.forOwn(item, (prop: any) => {
      if(_.isArray(prop) && _.isObject(prop[0])) {
        _.each(prop, this.removeUid);
      }
    }, this);
    return item;
  };

  setLastUid = (id: number) => {
    return this.lastId < id ? (this.lastId = id) : this.lastId;
  }
}
