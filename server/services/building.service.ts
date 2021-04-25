import { Collection } from 'mongodb';
import Building from '../models/building.model';
import db from './db.service';
import fetch from 'node-fetch';

export async function getBuilding(query): Promise<Building[]> {
    const collection: Collection = await db.buildingsCollection;
    const result = collection.findOne(query);
    return result;
}

export async function getBuildings(query): Promise<Building[]> {
    const collection: Collection = await db.buildingsCollection;
    const result = collection.find(query).toArray();
    return result;
}

export async function insertBuildings(buildings: Building[]) {
    const collection: Collection = await db.buildingsCollection;
    const result = (await collection.insertMany(buildings)).result;
    return result;
}

export async function getLocationData(query) {
    const collection: Collection = await db.buildingsCollection;
    const building: Building = await collection.findOne(query);
    const address = building.address;
    const result = await getLocationDataByAddress(address);
    return result;
}

export async function getLocationDataByAddress(address: string) {
    const base = 'https://maps.googleapis.com/maps/api/geocode/json';
    const key = process.env.GOOGLE_GEOCODING_KEY;
    const url = `${base}?key=${key}&address="${address}"`;
    const result = await fetch(url, { method: 'get' }).then(res => res.json());
    return result;
}