const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

module.exports = {
    create: async (req, res) => {
        try {
            const {foodId, qty, userId, tableNo} = req.body

            const food = await prisma.food.findFirst({
                where: {
                    id: foodId
                }
            })

            if (!food) {
                return res.status(404).send({message: 'Food not found'})
            }

            const oldSaleTemp = await prisma.saleTemp.findFirst({
                where: {
                    foodId: foodId,
                    userId: userId,
                    tableNo: tableNo
                }
            })
            if (oldSaleTemp == null) {
                const saleTemp = await prisma.saleTemp.create({
                    data: {
                        foodId: foodId,
                        qty: qty,
                        price: food.price ?? 0,
                        userId: userId,
                        tableNo: tableNo
                    }
                })
                return res.status(201).send({message: 'Food added to cart', results: saleTemp})
            }

            const saleTemp = await prisma.saleTemp.update({
                where: {
                    id: oldSaleTemp.id
                },
                data: {
                    qty: oldSaleTemp.qty + qty
                }
            })
            return res.status(201).send({message: 'Food added to cart', results: saleTemp})
        } catch (error) {
            console.log(error)
            return res.status(500).send({message: 'Internal server error'})
        }
    },
    list: async (req, res) => {
        try {
            const {userId} = req.params;
            const saleTemp = await prisma.saleTemp.findMany({
                include: {
                    Food: true
                },
                where: {
                    userId: typeof userId === 'string' ? parseInt(userId) : userId
                },
                orderBy: {
                    id: 'desc'
                }
            })

            return res.status(200).send({results: saleTemp})
        } catch (error) {
            console.log(error)
            return res.status(500).send({message: 'Internal server error'})
        }
    },
    clear: async (req, res) => {
        try {
            const {userId} = req.params
            const saleTemp = await prisma.saleTemp.deleteMany({
                where: {
                    userId: typeof userId === 'string' ? parseInt(userId) : userId
                }
            })

            return res.status(200).send({message: 'Cart cleared', results: saleTemp})
        } catch (error) {
            console.log(error)
            return res.status(500).send({message: 'Internal server error'})
        }
    },
    changeQty: async (req, res) => {
        try{
            const {id, style} = req.body;
            const saleTemp = await prisma.saleTemp.findFirst({
                where: {
                    id: id
                }
            })
            if (!saleTemp) {
                return res.status(404).send({message: 'Item not found'})
            }

            if (style === 'up') {
                saleTemp.qty += 1
            } else {
                saleTemp.qty -= 1

            }
            if(saleTemp.qty <= 0 ){
                saleTemp.qty = 1;
            }
            await prisma.saleTemp.update({
                where: {
                    id: id
                },
                data: {
                    qty: saleTemp.qty
                }
            })

            return res.status(200).send({message: 'Qty updated', results: saleTemp})
        }catch (error) {
            console.log(error)
            return res.status(500).send({message: 'Internal server error'})
        }
    },
    removeItem: async (req, res) => {
        try {
            const {userId, foodId} = req.params
            const saleTemp = await prisma.saleTemp.deleteMany({
                where: {
                    userId: typeof userId === 'string' ? parseInt(userId) : userId,
                    foodId: typeof foodId === 'string' ? parseInt(foodId) : foodId
                }
            })

            return res.status(200).send({message: 'Item removed', results: saleTemp})
        } catch (error) {
            console.log(error)
            return res.status(500).send({message: 'Internal server error'})
        }
    },
}