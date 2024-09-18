const {PrismaClient} = require('@prisma/client');
const { stat } = require('fs');

const prisma = new PrismaClient();

module.exports = {
    create: async (req, res) => {
        try {
            const {name, remark} = req.body;

            console.log(name, remark);
            const foodType = await prisma.foodType.create({
                data: {
                    name: name,
                    remark: remark ?? "",
                    status: "use",
                },
            });

            res.status(201).json({message: 'Food type created', results: foodType});
        } catch (error) {
            console.log(error);
            res.status(500).json({message: 'Internal server error'});
        }
    },

    list: async (req, res) => {
        try {
            const foodTypes = await prisma.foodType.findMany({
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
            const foodType = await prisma.foodType.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    status: 'deleted',
                },
            });

            res.status(200).json({message: 'Food type deleted', results: foodType});
        } catch (error) {
            console.log(error);
            res.status(500).json({message: 'Internal server error'});
        }
    },

    update: async (req, res) => {
        try {
            const {id} = req.params;
            const {name, remark} = req.body;

            const foodType = await prisma.foodType.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    name: name,
                    remark: remark ?? "",
                },
            });

            res.status(200).json({message: 'Food type updated', results: foodType});
        } catch (error) {
            console.log(error);
            res.status(500).json({message: 'Internal server error'});
        }
    },
}
