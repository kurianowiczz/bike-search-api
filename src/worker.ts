import { parentPort, workerData } from 'worker_threads';
import BikeModel from './models/Bike.model';
import OfficerModel from './models/Officer.model';
import { IOfficer } from './interfaces/IOfficer';

const bikeModel = new BikeModel('bikes');
const officerModel = new OfficerModel('officers');

const getRandomNumber = (max: number): number => {
    return Math.floor(Math.random() * max);
};

const tryToFindBike = (officers: IOfficer[], chance: number): [IOfficer[], string[]] => {
    const foundIds: string[] = [];
    const processedOfficers = [...officers];
    for (const officer of processedOfficers) {
        if (!!officer.bikeId) {
            if (getRandomNumber(10000) < chance * 100) {
                foundIds.push(officer.bikeId);
                officer.bikeId = null;
            }
        }
    }
    return [processedOfficers, foundIds];
};

setInterval(async () => {
    const officers = await officerModel.getAll();
    const [processedOfficers, found] = tryToFindBike(officers, 10);
    const bikes = (await bikeModel.getAll()).filter(bike => !found.includes(bike.id));
    const freeOfficers = processedOfficers.filter(officer => !officer.bikeId);
    parentPort.postMessage(`Found free officers: ${freeOfficers.length}`);

    if (!!freeOfficers.length) {
        for (const officer of freeOfficers) {
            if (!bikes.length) {
                const officerDTO = { ...officer };
                delete officerDTO.id;
                await officerModel.editOne(officer.id, officerDTO);
                break;
            }
            const bikeId = bikes.pop().id;
            await officerModel.editOne(officer.id, { bikeId });
        }
    }

    for (const id of found) {
        await bikeModel.deleteOne(id);
    }

}, 3000);


