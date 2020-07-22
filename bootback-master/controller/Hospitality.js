let errs = require('restify-errors');
let config = require('../knex_config')
let knex = require('knex')(config)


class Hospitality{
    async getHospitalityById(req, res){
        const { id } = req.params;

        knex('hospital')
            .where('cNmHospital', id)
            .first()
            .then((dados) => {
                if (!dados) return res.send(new errs.BadRequestError('nada foi encontrado'))
                res.send(dados);
            
            });
    
    };

    async getHospitality(req, res){
    knex.raw(`EXEC consultaUnidades`)
            .then((resultado) => {res.send(resultado)});
      };
}
module.exports = new Hospitality()