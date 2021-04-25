function getBuildingByName(buildingName) {
    const url = `/building?name=${buildingName}`;
    return fetch(url).then(res => res.json());
}

function getLocationDataByAddress(address) {
    const url = `/location?address=${address}`;
    return fetch(url).then(res => res.json());
}

const buildingService = { getBuildingByName, getLocationDataByAddress }

export default buildingService;