const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

module.exports ={
    create: async (req, res) => {
        try {
            const {name, remark, price, fileName,foodType, FoodTypeId} = req.body
            const food = await prisma.food.create({
                data: {
                    name: name,
                    remark: remark ?? "",
                    money: price,
                    foodType: foodType,
                    img: fileName ?? "",
                    FoodTypeId: typeof FoodTypeId === 'string' ? parseInt(FoodTypeId) : FoodTypeId
                }
            })
            return res.status(201).send({message: 'Food created', data: food})
        }catch (error) {
            console.log(error)
            return res.status(500).send({message: 'Internal server error'})
        }
    },
    upload: async (req, res) => {
        try{
            if(req.files.img === undefined){
                return res.status(400).send({message: 'Please upload a file!'})
            }

            const img = req.files.img
            const fileName = Date.now() + img.name;
            img.mv('./uploads/' + fileName, (err) => {
                if(err){
                    console.log(err)
                    return res.status(500).send({message: 'Internal server error'})
                }
            })
            return res.status(200).send({message: 'File uploaded', fileName: fileName})

        }catch (error) {
            console.log(error)
            return res.status(500).send({message: 'Internal server error'})
        }
    },

    list: async (req, res) => {
        try {
            const foods = await prisma.food.findMany({
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

            res.status(200).json({results: foods});
        } catch (error) {
            console.log(error);
            res.status(500).json({message: 'Internal server error'});
        }
    },
    update: async (req, res) => {
        try {
            const {id} = req.params;
            const {name, remark, price, fileName,foodType , FoodTypeId} = req.body
            const food = await prisma.food.update({
                data: {
                    name: name,
                    remark: remark ?? "",
                    money: price,
                    foodType: foodType,
                    img: fileName ?? "",
                    FoodTypeId: typeof FoodTypeId === 'string' ? parseInt(FoodTypeId) : FoodTypeId
                },
                where: {
                    id: parseInt(id)
                }
            })
            return res.status(200).send({message: 'Food updated', data: food})
        }catch (error) {
            console.log(error)
            return res.status(500).send({message: 'Internal server error'})
        }
    },
    remove: async (req, res) => {
        try {
            const {id} = req.params
            const food = await prisma.food.update({
                data: {
                    status: 'delete'
                },
                where: {
                    id: parseInt(id)
                }
            })
            return res.status(200).send({message: 'Food deleted', data: food})
        }catch (error) {
            console.log(error)
            return res.status(500).send({message: 'Internal server error'})
        }
    }

}