import { Collection, Cursor } from 'mongodb';
import Building from '../models/building.model';
import db from './db.service';

export async function getBuildings(): Promise<Cursor> {
    const collection: Collection = await db.buildingsCollection;
    const result = collection.find();
    return result;
}