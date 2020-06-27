import { Router, Request, Response } from 'express';
import validation from './validation';
import * as Joi from 'joi';
import BikeModel from './models/Bike.model';
import OfficerModel from './models/Officer.model';

const router = Router();
const bikeModel = new BikeModel('bikes');
const officerModel = new OfficerModel('officers');

router.get('/bike', async (req: Request, res: Response) => {
    const bikes = await bikeModel.getAll();
    res.send({ bikes });
});

router.post('/bike',
    validation(
        Joi.object({
            phone: Joi.string().min( 5).max(10).required(),
            color: Joi.string().min(3).max(10).required(),
            serialNumber: Joi.string().length(10).required(),
        }),
    ),
    async (req: Request, res: Response) => {
        try {
            const insertedBikeId = await bikeModel.insertOne({
                phone: req.body.phone,
                color: req.body.color,
                serialNumber: req.body.serialNumber,
            });
            res.send({ bike: insertedBikeId });
        } catch (e) {
            console.log(e);
            res.status(500).send({ error: 'Server error' });
        }
});

router.get('/officer', async (req: Request, res: Response) => {
    const officers = await officerModel.getAll();
    res.send({ officers });
});

router.post('/officer',
    validation(
        Joi.object({
            name: Joi.string().min( 2).max(15).required(),
            surname: Joi.string().min(2).max(30).required(),
            bikeId: Joi.string().min(1).max(300),
        }),
    ),
    async (req: Request, res: Response) => {
        try {
            const insertedOfficerId = await officerModel.insertOne({
                name: req.body.name,
                surname: req.body.surname,
                bikeId: null,
            });
            res.send({ officer: insertedOfficerId });
        } catch (e) {
            console.log(e);
            res.status(500).send({ error: 'Server error' });
        }
    });

export default router;