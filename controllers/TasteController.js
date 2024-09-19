const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    create: async (req, res) => {
        try {
            const {name, remark, FoodTypeId} = req.body;
            const Taste = await prisma.Taste.create({
                data: {
                    name: name,
                    remark: remark ?? "",
                    FoodTypeId: typeof FoodTypeId === 'string' ? parseInt(FoodTypeId) : FoodTypeId,
                    status: "use",
                },
            });

            res.status(201).json({message: 'Food type created', results: Taste});
        } catch (error) {
            console.log(error);
            res.status(500).json({message: 'Internal server error'});
        }
    },
    list: async (req, res) => {
        try {
            const foodTypes = await prisma.Taste.findMany({
                include:{
                    FoodType: true,
                },
                where: {
                    status: 'use',
                },
                orderBy: {
                    updatedAt: 'desc',
                },
            });

            res.status(200).json({results: foodTypes});
        } catch (error) {
            console.log(error);
            res.status(500).json({message: 'Internal server error'});
        }
    },

    remove: async (req, res) => {
        try {
            const {id} = req.params;
            const Taste = await prisma.Taste.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    status: 'deleted',
                },
            });

            res.status(200).json({message: 'Food type deleted', results: Taste});
        } catch (error) {
            console.log(error);
            res.status(500).json({message: 'Internal server error'});
        }
    },

    update: async (req, res) => {
        try {
            const {id} = req.params;
            const {name, remark, FoodTypeId} = req.body;
            const Taste = await prisma.Taste.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    name: name,
                    remark: remark ?? "",
                    FoodTypeId: typeof FoodTypeId === 'string' ? parseInt(FoodTypeId) : FoodTypeId,
                },
            });

            res.status(200).json({message: 'Food type updated', results: Taste});
        } catch (error) {
            console.log(error);
            res.status(500).json({message: 'Internal server error'});
        }
    }
};