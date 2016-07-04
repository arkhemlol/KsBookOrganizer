
export class UtilsService implements KS.core.IUtilsService {
  private lastId: number = 0;
  /**
   * Converts array of strings to enum
   * @param arr
   * @param {Boolean} bitmask Whether the enum created should be a bit mask
   * @returns {any}
   */
  arrayToEnum(arr: string[], bitmask?: boolean ): any {
    return _.reduce(arr, (accum: Object, field: string, idx: number) => {
      accum[field] = bitmask ? 1 << idx : idx;
      accum[idx] = field;
      return accum;
    }, {});
  }

  encode(data: Object): string {
    var pairs = [];
    for (var name in data) {
      if (!data.hasOwnProperty(name)) {
        continue;
      }
      pairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
    }
    return pairs.join('&').replace(/%20/g, '+');
  }

  activator<T>(type: { new(...args: any[]): T; }): Function {
    return (): T => {
      return new type();
    };
  }

  applyMixins(derivedCtor: any, baseCtors: any[]): void {
    baseCtors.forEach((baseCtor: any) => {
      Object.getOwnPropertyNames(baseCtor.prototype).forEach((name: string) => {
        derivedCtor.prototype[name] = baseCtor.prototype[name];
      });
    });
  }

  sumEnumValues(enumToSum: any): number {
    return _.reduce<string, number>(_.filter<string>(Object.keys(enumToSum), (item: any) => {
      return !!parseInt(item);
    }), (prev: number, next: string): number => {
      let res = <number>parseInt(next);
      return prev + res;
    }, 0);
  }

  flattenNumCollection(collection: Array<any> | Object) {
    return this.flattenCollection<number>(collection, 'number');
  }

  flattenStringCollection(collection: Array<any> | Object) {
    return this.flattenCollection<string>(collection, 'string');
  }

  checkBitmask(mask: number, item: any): boolean {
    return !!(mask & item);
  }

  checkCollection(collection: Object | Array<any>, item: any): boolean {
    return _.isArray(collection) ? _.indexOf(collection, item) >= 0 : item in collection;
  }

  formatTime(time: string): number {
    let result: number = moment().diff(moment(new Date(time)));
    return result < 0 ? Math.abs(result) : 0;
  }

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
  };

  /**
   * Parse a given url with the use of an anchor element
   *
   * @param  {String} url - the url to parse
   * @return {Object}     - the parsed url, anchor element
   */
  urlParse(url: string): HTMLAnchorElement | Location {
    var a = document.createElement('a');
    a.href = url;

    // special treatment for IE, see http://stackoverflow.com/a/13405933 for details
    if (a.host === '') {
      a.href = a.href;
    }

    return a;
  }

  /**
   * Test whether or not a given url is same origin
   *
   * @param  {String}           url       - url to test
   * @param  {String|String[]}  [origins] - additional origins to test against
   * @return {Boolean}                    - true if url is same origin
   */
  isSameOrigin(url: string, origins?: string | string[]): boolean {
    let urlFromAnchor = this.urlParse(url);
    let _origins: string[] = ((origins && [].concat(origins)) || []);
    let _originsAnchor = _origins.map(this.urlParse);
    _originsAnchor.push(window.location);
    let _originsFiltered = _originsAnchor.filter(function(o: HTMLAnchorElement | Location) {
      return urlFromAnchor.hostname === o.hostname &&
        urlFromAnchor.port === o.port &&
        urlFromAnchor.protocol === o.protocol;
    });
    return (_originsFiltered.length >= 1);
  }

  private filterDeep<T>(prev: Array<any>, next: any, typeToFilter: string): T[] {
    if (typeof next === typeToFilter) {
      prev.push(next);
    } else if ( _.isArray(next) || _.isObject(next) ) {
      _.transform(next, (prev: Array<any>, next: any) => {
        return this.filterDeep<T>(prev, next, typeToFilter);
      }, prev, this);
    }
    return prev;
  }

  private flattenCollection<T>(collection: Array<any> | Object, typeToFilter: string): T[] {
    let res: T[] = [];
    if ( _.isArray(collection) || _.isObject(collection) ) {
      res = _.transform(collection, (prev: Array<any>, next: any) => {
        return this.filterDeep<T>(prev, next, typeToFilter);
      }, [], this);
    }
    return res;
  }
}
