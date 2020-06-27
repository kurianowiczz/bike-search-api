import firebase from 'firebase';
import { IOfficer } from '../interfaces/IOfficer';
import { IModel } from '../interfaces/IModel';
import database from '../database';

class OfficerModel implements IModel<IOfficer>{
    private collection: firebase.firestore.CollectionReference;

    constructor(collection: string) {
        this.collection = database.collection(collection);
    }

    public async insertOne(obj: IOfficer): Promise<string> {
        const officer = await this.collection.add(obj);
        return officer.id;
    }

    public async getAll(): Promise<IOfficer[]> {
        const officers = await this.collection.get();
        return officers.docs.map(el => ({ id: el.id, ...el.data() }) as IOfficer);
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

export default OfficerModel;