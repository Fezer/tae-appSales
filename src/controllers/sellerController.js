const Seller = require("../models/Seller");
const Sale = require("../models/Sale");
const sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function passwordValidation(password){
    if(password.length < 8){
        return "A senha deve possuir no mínimo 8 caracteres.";
    }else if(!password.match(/[a-zA-Z]/g)){
        return "A senha deve ter no mínimo uma letra.";
    }else if(!password.match(/[1-9]/)){
        return "A senha deve ter no mínimo um número.";
    }else{
        return "OK";
    }
}

function generateToken(id){
    console.log(process.env.JWT_SECRET);
    process.env.JWT_SECRET = Math.random().toString(36).slice(-20);
    console.log(process.env.JWT_SECRET);
    const token = jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn: 82800,
    });
    console.log(token);
    return token;
}

function hashPassword(password){
    const salt = bcrypt.genSaltSync(12);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
}


module.exports = {
    async authentication(req, res){
        const email = req.body.email;
        const password = req.body.password;

        if(!email || !password){
            return res.status(400).json({ msg: "Campos obrigatórios vazios." });
        }else{
            try{
                const seller = await Seller.findOne({
                    where: { email },
                });
                if(!seller){
                    return res.status(404).json({ msg: "Usuário ou senha inválidos." });
                }else{
                    if(bcrypt.compareSync(password, seller.password)){
                        const token = generateToken(seller.id);
                        return res.status(200).json({ msg: "Autenticação realizada com sucesso.", token });
                    }else{
                        return res.status(404).json({ msg: "Usuário ou senha inválidos." });
                    }
                }
            }catch(error){
                res.status(500).json({ msg: "Erro: " + error });
            }
        }
    },

    async listAllSellers(req, res){
        const sellers = await Seller.findAll({
            order: [["name", "ASC"]],
        }).catch((error) => {
            return res.status(500).json({ msg: "Falha na conexão." });
        });
        if(sellers) 
            return res.status(200).json({ sellers });
        else 
            return res.status(404).json({ msg: "Não foi possível encontrar vendedores." });
    },

    async searchSellerByName(req, res){
        const name = req.params.name;
        if(name == undefined)
            return res.status(400).json({ msg: "Variável name inexistente.",
        });
        if(!name)
            return res.status(400).json({ msg: "Parametro nome está vazio.",
        });
        const Op = sequelize.Op;
        const seller = await Seller.findAll({
            where: { name: { [Op.like]: "%" + name + "%" }},
        });
        // console.log(seller);
        if(seller){
            if(seller == "") 
                return res.status(404).json({ msg: "Vendedor não encontrado."});
            else 
                return res.status(200).json({ seller });
        } else 
            return res.status(404).json({ msg: "Vendedor não encontrado.", });
    },
    
    async newSeller(req, res){
        const { name, email, password } = req.body;
        if(!name || !email || !password){
            return res.status(400).json({ msg: "Dados obrigatórios não foram preenchidos." });
        }

        const passwordValid = passwordValidation(password);
        if(passwordValid != "OK"){
            return res.status(400).json({ msg: passwordValid });
        }

        const isSellerNew = await Seller.findOne({
            where: { email },
        });
        if(isSellerNew)
            return res.status(403).json({ msg: "Vendedor já foi cadastrado." });
        else{
            hash = hashPassword(password);
            const seller = await Seller.create({
                name,
                email,
                password: hash,
            }).catch((error) => {
                return res.status(500).json({ msg: "Não foi possível inserir os dados." });
            });
            if(seller)
                return res.status(201).json({ msg: "Novo vendedor foi adicionado." });
            else
                return res.status(404).json({ msg: "Não foi possível cadastrar novo vendedor." });
        }
    },

    async deleteSeller(req, res){
        const sellerId = req.params.id;
        if(sellerId){
            const sellerHasRef = await Sale.findOne({
                where: { sellerId },
            });
            if(sellerHasRef){
                return res.status(403).json({ msg: "Vendedor possui vendas em seu nome" });
            }
            const deletedSeller = await Seller.destroy({
                where: { id: sellerId },
            }).catch(async (error) => {
                    return res.status(500).json({ msg: "Falha na conexão." });
            });
            if(deletedSeller != 0)
                return res.status(200).json({ msg: "Vendedor excluido com sucesso." });
            else
                return res.status(404).json({ msg: "Vendedor não encontrado." });
        }else{
            return res.status(400).json({ msg: "ID do vendedor vazio." });
        }
    },

    async updateSeller(req, res){
        const sellerId = req.params.id;
        const seller = req.body;
        const email = req.body.email;
        if(!sellerId)
            res.status(400).json({ msg: "ID do vendedor vazio." });
        else{
            const sellerExists = await Seller.findByPk(sellerId);
            if(!sellerExists)
                res.status(404).json({ msg: "Vendedor não encontrado." });
            else{
                if(seller.name && seller.email){
                    const emailExists = await Seller.findOne({
                        where: { email },
                    });
                    if(emailExists && emailExists.id != sellerId){
                        return res.status(403).json({ msg: "Email já cadastrado." });
                    }else{
                        await Seller.update(seller, {
                            where: { id: sellerId},
                        });
                        return res.status(200).json({ msg: "Vendedor atualizado com sucesso." });
                    }
                } else
                    return res.status(400).json({ msg: "Campos obrigatórios não preenchidos." });
            }
        }
    },

    async updatePasswordSeller(req, res){
        const sellerId = req.params.id;
        const sellerOldPassword = req.body.oldPassword;
        const password = req.body.password;
        
        if(!sellerId){
            return res.status(400).json({ msg: "ID do vendedor vazio." });
        }
        const passwordValid = passwordValidation(password);
        if(passwordValid != "OK"){
            return res.status(400).json({ msg: passwordValid });
        }
        if(!sellerOldPassword || !password){
            return res.status(400).json({ msg: "É necessário informar a senha atual e a nova senha." });
        }
        const sellerExists = await Seller.findByPk(sellerId);
        if(!sellerExists)
            return res.status(404).json({ msg: "Vendedor não encontrado." });
        else{
            if(bcrypt.compareSync(sellerOldPassword, sellerExists.password)){
                hash = hashPassword(password);
                await Seller.update({password : hash}, {
                    where: { id: sellerId},
                });
                return res.status(200).json({ msg: "Senha atualizada com sucesso." });
            }else{
                return res.status(400).json({ msg: "A senha atual informada está incorreta." });
            }
        }        
    },
};