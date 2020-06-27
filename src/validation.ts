import { NextFunction, Request, Response } from 'express';

export default (model: any) => (req: Request, res: Response, next: NextFunction) => {
    const result = model.validate(req.body);
    if (result.error) {
        res.status(400).send({ code: 400, error: result.error });
    } else {
        next();
    }
};
