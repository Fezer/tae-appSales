const Seller = require("../models/Seller");
const Sale = require("../models/Sale");
const sequelize = require("sequelize");
const { is } = require("express/lib/request");

module.exports = {
    async listAllSales(req, res){
        const sales = await Sale.findAll({
            order: [["sellerId", "ASC"]],
        }).catch((error) => {
            return res.status(500).json({ msg: "Erro de conexão." });
        });
        if(sales){
            return res.status(200).json({ sales });
        }else{
            return res.status(404).json({ msg: "Não foi possível encontrar vendas." });
        }
    },

    async searchSalesByDate(req, res){
        const { startDate, endDate } = req.body;
        if(!startDate || !endDate){
            return res.status(400).json({ msg: "Parâmetro obrigatório vazio." });
        }
        const Op = sequelize.Op;
        const sales = await Sale.findAll({
            where: { saleDate: { [Op.between]: [startDate, endDate] } },
        }).catch((error) => {
            return res.status(500).json({ msg: "Erro de conexão." });
        });
        if(sales){
            if(sales == ""){
                res.status(404).json({ msg: "Não há vendas no período." });
            }else{
                res.status(200).json({ sales });
            }
        }else{
            return res.status(404).json({ msg: "Não foi possível encontrar vendas." });
        }
    },

    async searchSalesBySeller(req, res){
        const sellerId = req.body.sellerId;
        if(sellerId){
            const sales = await Sale.findAll({
                where: { sellerId },
            }).catch((error) => {
                return res.status(500).json({ msg: "Erro de conexão." });
            });
            if(!sales){
                return res.status(404).json({ msg: "Não foi possível encontrar vendas." });
            }else{
                if(sales == ""){
                    return res.status(404).json({ msg: "Não foram encontradas vendas associadas ao vendedor." });
                }else{
                    return res.status(200).json({ sales });
                }
            }
        }else{
            return res.status(400).json({ msg: "Parâmetro obrigatório vazio." });
        }
    },

    async listTotalSalesByDate(req, res){
        const startDate = req.body.startDate;
        const endDate = req.body.endDate;
        if(!startDate || !endDate){
            return res.status(400).json({ msg: "Parâmetro obrigatório vazio." });
        }else{
            const Op = sequelize.Op;
            const totalValue = await Sale.sum('value', {
                where: { saleDate: { [Op.between]: [startDate, endDate] } },
            }).catch((error) => {
                return res.status(500).json({ msg: "Erro de conexão." });
            });
            if(!totalValue){
                return res.status(404).json({ msg: "Não foi possível encontrar vendas." });
            }else{
                if(totalValue == ""){
                    return res.status(404).json({ msg: "Não existem vendas para o período informado." });
                }else{
                    return res.status(200).json({ startDate, endDate, totalValue });
                }
            }
        }
    },

    async updateSale(req, res){
        const saleId = req.body.id;
        const sale = req.body;
        if(!saleId){
            return res.status(400).json({ msg: "Paramêtro id vazio." });
        } else{
            const saleExists = await Sale.findByPk(saleId).catch((error) => {
                return res.status(500).json({ msg: "Erro de conexão." });
            });
            if(!saleExists){
                return res.status(404).json({ msg: "Venda não encontrada." });
            }else{
                await Sale.update(sale, {
                    where: { id: saleId },
                }).catch((error) => {
                    return res.status(500).json({ msg: "Erro de conexão." });
                });
                return res.status(200).json({ msg: "Venda atualizada com sucesso." });
            }
        }
    },

    async deleteSale(req, res){
        const saleId = req.body.id;
        if(!saleId){
            return res.status(400).json({ msg: "Parâmetro obrigatório (id) não informado." });
        } else{
            const saleExists = await Sale.findByPk(saleId).catch((error) => { 
                return res.status(500).json({ msg: "Erro de conexão." })
            });
            if(!saleExists){
                return res.status(404).json({ msg: "Venda não encontrada." });
            }else{
                await Sale.destroy({
                    where: { id: saleId },
                }).catch((error) => {
                    return res.status(500).json({ msg: "Erro de conexão." })
                });
                return res.status(200).json({ msg: "Venda excluída com sucesso." });
            }
        }
    },
};