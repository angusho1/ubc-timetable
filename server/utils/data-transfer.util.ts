import fs from 'fs';
import path from 'path';
import Building from '../models/building.model';
import { insertBuildings } from '../services/building.service';

export function uploadBuildings() {
    const filename = 'buildings.json'
    const filepath = path.resolve('frontend/public', filename);
    fs.readFile(filepath, 'utf8', (err, data) => {
        const buildingsJson: object = JSON.parse(data);
        const buildings: Building[] = Object.entries(buildingsJson).map(([key, value]: [string, any]) => {
            return {
                code: getBuildingCode(value.name),
                name: key,
                address: value.address
            };
        });

        insertBuildings(buildings);
    });
}

function getBuildingCode(name: string): string {
    const regex = /\([A-Z0-9]{3,4}\)/;
    if (regex.test(name)) {
        return name.match(regex)[0].replace('(', '').replace(')', '');
    } else {
        return '';
    }
}

uploadBuildings();
