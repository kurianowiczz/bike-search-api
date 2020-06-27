export interface IModel<T> {
    insertOne: (obj: T) => Promise<string>;
    getAll: () => Promise<T[]>;
    deleteOne: (id: string) => Promise<void>;
    editOne: (id: string, obj: Object) => Promise<void>;
}