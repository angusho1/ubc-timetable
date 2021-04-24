import { Collection, Cursor } from 'mongodb';
import Building from '../models/building.model';
import db from './db.service';

export async function getBuildings(): Promise<Building[]> {
    const collection: Collection = await db.buildingsCollection;
    const result = collection.find({}).toArray();
    return result;
}

export async function insertBuildings(buildings: Building[]) {
    const collection: Collection = await db.buildingsCollection;
    const result = (await collection.insertMany(buildings)).result;
    return result;
}