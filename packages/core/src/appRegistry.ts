export interface AppDef {
  id: string;
  title: string;
  icon?: string;
  defaultWidth?: string;
  defaultHeight?: string;
}

export class AppRegistry {
  private _apps = new Map<string, AppDef>();

  register(def: AppDef): void {
    this._apps.set(def.id, def);
  }

  get(id: string): AppDef | undefined {
    return this._apps.get(id);
  }

  getAll(): AppDef[] {
    return Array.from(this._apps.values());
  }
}
