import firebase from 'firebase';
import { IBike } from '../interfaces/IBike';
import { IModel } from '../interfaces/IModel';
import database from '../database';

class BikeModel implements IModel<IBike>{
    private collection: firebase.firestore.CollectionReference;

    constructor(collection: string) {
        this.collection = database.collection(collection);
    }

    public async insertOne(obj: IBike): Promise<string> {
        const bike = await this.collection.add(obj);
        return bike.id;
    }

    public async getAll(): Promise<IBike[]> {
        const bikes = await this.collection.get();
        return bikes.docs.map(el => ({ id: el.id, ...el.data() }) as IBike);
    }

    public async deleteOne(id: string): Promise<void> {
        return this.collection.doc(id).delete();
    }

    public async editOne(id: string, obj: Object): Promise<void> {
        const ref = await this.collection.doc(id);
        const target = (await this.collection.doc(id).get()).data();
        return ref.set({ ...target, ...obj });
    }

}

export default BikeModel;