
export interface IDataSourceOptions {
  dependencies: (string | Object)[];
  /** This would be variable storing the results */
  dependables: (string | Object)[];
}

export interface ICalculated { 
  [key: string]: (state: Object, dependencies: IDictionary) => any;
}

export interface IDataSourcePlugin {

  type: string;
  defaultProperty: string;
  connection: string;

  _props: {
    id: string,
    dependencies: { [key: string]: string },
    dependables: string[],
    actions: string[],
    params: IDictionary,
    calculated: ICalculated
  };

  bind (actionClass: any): void;
  updateDependencies (dependencies: IDictionary, args: IDictionary, callback: () => void): void;
  getDependencies(): { [ key: string]: string };
  getDependables(): string[];
  getActions(): string[];
  getParamKeys(): string[];
  getParams(): IDictionary;
  getCalculated(): ICalculated;
}

export abstract class DataSourcePlugin implements IDataSourcePlugin {

  abstract type: string;
  abstract defaultProperty: string;

  connection: string = null;
  
  _props = {
    id: '',
    dependencies: {} as any,
    dependables: [],
    actions: [ 'updateDependencies', 'failure' ],
    params: {},
    calculated: {}
  };

  /**
   * @param {DataSourcePlugin} options - Options object
   */
  constructor(options: IDictionary) {

    var props = this._props;
    props.id = options.id;
    props.dependencies = options.dependencies || [];
    props.dependables = options.dependables || [];
    props.actions.push.apply(props.actions, options.actions || []);
    props.params = options.params || {};
    props.calculated = options.calculated || {};
  }

  bind (actionClass: any) {
    actionClass.type = this.type;
    actionClass._props = this._props;
  }

  abstract updateDependencies (dependencies: IDictionary, args: IDictionary, callback: () => void): void;

  /**
   * @returns {string[]} Array of dependencies
   */
  getDependencies() {
    return this._props.dependencies;
  }

  getDependables() {
    return this._props.dependables;
  }

  getActions() {
    return this._props.actions;
  }

  getParamKeys() {
    return Object.keys(this._props.params);
  }

  getParams() {
    return this._props.params;
  }

  getCalculated() {
    return this._props.calculated;
  }

  failure(error: any): void { 
    return error;
  }
}