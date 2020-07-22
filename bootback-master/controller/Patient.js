let errs = require('restify-errors');
let config = require('../knex_config')
let knex = require('knex')(config)

class Patient{
        async getAllPatient(req, res){
            knex('paciente').then((dados) => {
                res.send(dados);
            })
        
        };

        async insertPatient(req,res){
            let insertInDatabase = req.body;
     
            knex('paciente')
                .insert(insertInDatabase)
                .then((dados) => {
                    res.send(dados);
                })
        };

        async getPatientByCpf(req, res){
            const { id } = req.params;
            knex('paciente')
                .where('cCPF', id)
                .first()
                .then((dados) => {
                    if (!dados) return res.send(new errs.BadRequestError('nada foi encontrado'))
                    res.send(dados);
                })
        };

        async updatePatientByCpf(req, res){
            const { id } = req.params;
            knex('paciente')
                .where('id', id)
                .update(req.body)
                .then((dados) => {
                    if (!dados) return res.send(new errs.BadRequestError('nada foi encontrado'))
                    res.send('dados atualizados');
                })
        };

        async deletePatientByCpf(req, res){
            const { id } = req.params;
            knex('paciente')
                .where('id', id)
                .delete()
                .then((dados) => {
                    if (!dados) return res.send(new errs.BadRequestError('nada foi encontrado'))
                    res.send('dados excluidos');
                })
            
        };
}
module.exports = new Patient()