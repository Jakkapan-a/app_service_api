const {PrismaClient} = require('@prisma/client');
const { list } = require('./FoodTypeController');
const prisma = new PrismaClient();


module.exports = {
    create: async (req, res) => {
        try {
            const {name, FoodTypeId, price, remark} = req.body;


            
            const foodSize = await prisma.foodSize.create({
                data: {
                    name: name,
                    FoodTypeId: typeof FoodTypeId === 'string' ? parseInt(FoodTypeId) : FoodTypeId,
                    moneyAdded: price,
                    remark: remark ?? "",
                },
            });

            res.status(201).json({message: 'Food size created', results: foodSize});
        } catch (error) {
            console.log(error);
            res.status(500).json({message: 'Internal server error'});
        }
    },
    list: async (req, res) => {
        try {
            const foodSizes = await prisma.foodSize.findMany({
                include: {
                    FoodType: true
                },
                where: {
                    status: 'use',
                },
                orderBy: {
                    updatedAt: 'desc',
                },
            });

            res.status(200).json({results: foodSizes});
        } catch (error) {
            console.log(error);
            res.status(500).json({message: 'Internal server error'});
        }
    },
    remove: async (req, res) => {
        try {
            const {id} = req.params;
            const foodSize = await prisma.foodSize.update({
                data: {
                    status: 'deleted',
                },where: {
                    id: parseInt(id),
                },
            });

            res.status(200).json({message: 'Food size deleted', results: foodSize});
        } catch (error) {
            console.log(error);
            res.status(500).json({message: 'Internal server error'});
        }
    },

    update: async (req, res) => {
        try {
            const {id} = req.params;
            const {name, FoodTypeId, price, remark} = req.body;

            const foodSize = await prisma.foodSize.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    name: name,
                    foodTypeId: typeof FoodTypeId === 'string' ? parseInt(FoodTypeId) : FoodTypeId,
                    moneyAdded: price,
                    remark: remark ?? "",
                },
            });

            res.status(200).json({message: 'Food size updated', results: foodSize});
        } catch (error) {
            console.log(error);
            res.status(500).json({message: 'Internal server error'});
        }
    },

    filter: async (req, res) => {
        try{
            const {FoodTypeId} = req.params;
            const foodSizes = await prisma.foodSize.findMany({
                where: {
                    FoodTypeId: typeof FoodTypeId === 'string' ? parseInt(FoodTypeId) : FoodTypeId,
                    status: 'use',
                },
                orderBy: {
                    updatedAt: 'desc',
                },
            });

            res.status(200).json({results: foodSizes});
        }catch (error) {
            res.status(500).json({message: 'Internal server error'});
        }
    },
};