import { Router } from 'express';
import Marketplaces from '../models/marketplaceModel';
const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const marketplaces = await Marketplaces.find({});
    console.log(marketplaces); // should be an array of objectsbooks
    
    return res.json(marketplaces);
  } catch (e) {
    next(e);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { body } = req;
    // console.log(body);

    // check body properties - name, description, owner
    if (
      !body.hasOwnProperty('name') || 
      !body.hasOwnProperty('description') ||
      !body.hasOwnProperty('owner')
    ) {
      return res.status(400).json({ error: 'Marketplace name, description, owner required' });
    }

    // check if the marketplace already exists
    const marketplaceExists = await Marketplaces.findOne({ name: body.name });
    if (marketplaceExists != null) {
      return res.status(400).json({ error: 'Marketplace name already in use' });
    }

    // use the model to create a new marketplace
    const marketplace = new Marketplaces(body);
    console.log(marketplace);

    // save the marketplace
    await marketplace.save();

    // return 200 status and success message
    return res.status(201).json({
      success: true,
      data: marketplace
    });
  } catch (e) {
    next(e);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { body} = req;
    const { id } = req.params;
    console.log(id);

    // check id is not undefined
    if (!id) {
      return res.status(400).json({ error: 'Marketplace id parameter required' });
    }

    // check body properties - name, description, owner
    if (
      !body.hasOwnProperty('name') || 
      !body.hasOwnProperty('description') ||
      !body.hasOwnProperty('owner')
    ) {
      return res.status(400).json({ error: 'Marketplace name, description, owner required' });
    }

    const marketplace = await Marketplaces.findByIdAndUpdate(id, body, { new: true }).lean();
    delete marketplace.__v;
    console.log(marketplace);

    return res.status(200).json({
      success: true,
      data: marketplace
    });

  } catch (e) {
    if (e.kind == 'ObjectId' && e.path == '_id') {
      return res.status(400).json({ error: 'Invalid id parameter' });
    }
    next(e);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    await Marketplaces.findByIdAndDelete(id);

    return res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

export default router;
