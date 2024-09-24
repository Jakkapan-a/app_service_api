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
                    Food: true,
                    SaleTempDetail: true
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
        try {
            const {id, style} = req.body;
            const saleTemp = await prisma.saleTemp.findFirst({
                where: {
                    id: id
                }
            })
            if (!saleTemp) {
                return res.status(404).send({message: 'Item not found'})
            }
            let updatedQty  = saleTemp.qty
            if (style === 'up') {
                updatedQty  += 1
            } else {
                updatedQty  -= 1

            }
            if (updatedQty  <= 0) {
                updatedQty  = 1;
            }
            updatedQty = Math.max(1, updatedQty);

            await prisma.saleTemp.update({
                where: {
                    id: id
                },
                data: {
                    qty: updatedQty
                }
            })

            // Update the corresponding saleTempDetails if necessary
            const existingDetails = await prisma.saleTempDetail.findMany({
                where: { saleTempId: id, foodId: saleTemp.foodId },
            });

            const existingDetailCount = existingDetails.length;

            if (existingDetailCount !== updatedQty) {
                if (existingDetailCount > updatedQty) {
                    // Remove excess details
                    const deleteIds = existingDetails.slice(0, existingDetailCount - updatedQty).map(detail => detail.id);
                    await prisma.saleTempDetail.deleteMany({
                        where: { id: { in: deleteIds } },
                    });
                } else {
                    // Add missing details
                    const addCount = updatedQty - existingDetailCount;
                    await prisma.saleTempDetail.createMany({
                        data: Array.from({ length: addCount }, () => ({
                            foodId: saleTemp.foodId,
                            saleTempId: id,
                        })),
                    });
                }
            }


            return res.status(200).send({message: 'Qty updated', results: saleTemp})
        } catch (error) {
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

    createDetail: async (req, res) => {
        try {
            const { foodId, qty, saleTempId } = req.body;

            // Fetch existing details once
            const existingDetails = await prisma.saleTempDetail.findMany({
                where: { foodId, saleTempId },
            });

            // Calculate the number of existing and required details
            const existingCount = existingDetails.length;

            // If no details exist, create the required number in one go
            if (existingCount === 0) {
                if (qty > 0) {
                    await prisma.saleTempDetail.createMany({
                        data: Array.from({ length: qty }, () => ({
                            foodId,
                            saleTempId,
                        })),
                    });
                }
            } else {
                // Adjust the details if the count does not match the required quantity
                if (existingCount !== qty) {
                    if (existingCount > qty) {
                        // Delete excess details
                        const deleteIds = existingDetails.slice(0, existingCount - qty).map(detail => detail.id);
                        await prisma.saleTempDetail.deleteMany({
                            where: {
                                id: { in: deleteIds },
                            },
                        });
                    } else {
                        // Add missing details
                        const addCount = qty - existingCount;
                        await prisma.saleTempDetail.createMany({
                            data: Array.from({ length: addCount }, () => ({
                                foodId,
                                saleTempId,
                            })),
                        });
                    }
                }
            }

            return res.status(201).send({ message: 'success' });
        } catch (error) {
            console.log(error)
            return res.status(500).send({message: 'Internal server error'})
        }
    },

    listSaleTempDetail: async (req, res) => {
        try {
            const {saleTempId} = req.params
            const saleTempDetail = await prisma.saleTempDetail.findMany({
                include: {
                    Food: true,
                },
                where: {
                    saleTempId: typeof saleTempId === 'string' ? parseInt(saleTempId) : saleTempId
                }, orderBy: {
                    id: 'desc'
                }
            })
            return res.status(200).send({results: saleTempDetail})
        } catch (error) {
            console.log(error)
            return res.status(500).send({message: 'Internal server error'})
        }
    },

    updateFoodSize: async (req, res) => {
        try {
            const {saleTempId, foodSizeId} = req.body
            const foodSize = await prisma.foodSize.findFirst({
                where: {
                    id: foodSizeId
                }
            })

            foodSize.moneyAdded = foodSize.moneyAdded ?? 0

            if (!foodSize) {
                return res.status(404).send({message: 'Food size not found'})
            }

            await prisma.saleTempDetail.update({
                data: {
                    addedMoney: foodSize.moneyAdded
                }, where: {
                    id: saleTempId
                }
            })

            return res.status(200).send({message: 'Food size updated', results: foodSize})
        } catch (error) {
            console.log(error)
            return res.status(500).send({message: 'Internal server error'})
        }
    },
}