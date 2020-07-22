const dateFormat = require('dateformat');
const errs = require('restify-errors');
let config = require('../knex_config')
let knex = require('knex')(config)

class Query{
    async typeQuery(id){
        const { id } = req.params;
    
        knex('TIPO_CONSULTA')
            .where('nCdTpConsulta', id)
            .first()
            .then((dados) => {
                if (!dados) return res.send(new errs.BadRequestError('nada foi encontrado'))
                res.send(dados);
            });
    };
    async returnQuery(id, req, res){
    {
        let nConsulta = id;
        knex.
        raw(`EXEC informacoesConsulta ?`,[nConsulta])
            .then((resultado) => {res.send(resultado)});
          };
    }
    async queryAvaliableDates(nCdEspecialidade,nCdHospital){
            const { nCdEspecialidade } = req.params;
            const { nCdHospital } = req.params;
            let data_atual = new Date();
            let data_futura = new Date();
            data_futura.addMonths(parseInt(3));
            let sql = `EXEC consultaDatasDisponiveis'${dateFormat(data_atual, 'yyyymmdd')}', '${dateFormat(data_futura, 'yyyymmdd')}', ?, ? `;
        
            knex.raw(sql, [nCdHospital, nCdEspecialidade]).then(function (dados) {
                console.log('testing1');
                if (!dados) return res.send(new errs.BadRequestError('nada foi encontrado'))
                res.send(dados);
                console.log('testing2');
            });
        };
    async avaliableTimes(nCdEspecialidade,nCdHospital,data){
       
        let { nCdEspecialidade } = req.params;
        let { nCdHospital } = req.params;
        let { data } = req.params;
        let sql = `
            SELECT HORA_INICIAL = (CONVERT(VARCHAR(12),HORARIOS.dHoraInicial,108))
            ,HORARIOS.nCdHorario FROM HORARIOS WITH(NOLOCK)
                    INNER JOIN MEDICO_ESPECIALIDADE ON MEDICO_ESPECIALIDADE.nCdMedico = HORARIOS.nCdMedico
                WHERE CONVERT(DATE,HORARIOS.dHoraInicial)  = CONVERT(DATE, ?)       
                    AND MEDICO_ESPECIALIDADE.nCdEspecialidade = ?
                    AND HORARIOS.nCdHospital = ?
                    AND (
                        not EXISTS(SELECT 1 FROM CONSULTA WITH(NOLOCK) WHERE CONSULTA.nCdHorario = HORARIOS.nCdHorario)
                        and not EXISTS(SELECT 1 FROM EXAME WITH(NOLOCK) WHERE EXAME.nCdHorario = HORARIOS.nCdHorario )
                    ) ORDER BY HORARIOS.dHoraInicial`;
        knex.raw(sql, [data, nCdEspecialidade, nCdHospital]).then(function (dados) {
            
            if (!dados) return res.send(new errs.BadRequestError('nada foi encontrado'))
            res.send(dados);
            
            });
        
        };
            
    async returnAllQueryInDatabase(){
            knex.select().from('CONSULTA').then(function (CONSULTA){
                res.send(CONSULTA);
            })
        };
            
    async insertQueryInDatabase(){
            let paramCodHorario =  req.body.nCdHorario;
            let paramCodPaciente = req.body.nCdPaciente;
            let nCdEspecialidade = req.body.nCdEspecialidade;
            knex.raw(`exec inserirConsulta ?, ?, ? `, [paramCodHorario,paramCodPaciente,nCdEspecialidade])
                  .then(function() {
                      knex.select('nCdConsulta').from('CONSULTA').where('nCdHorario', paramCodHorario).
                        then(function(CONSULTA){
                          res.send(CONSULTA);
                    })
                })
             };
    async timesInDatabase(id){
        const { id } = req.params;
        knex('HORARIOS')
            .where('nCdHorario', id)
            .first()
            .then((dados) => {
                if (!dados) return res.send(new errs.BadRequestError('nada foi encontrado'))
                res.send(dados);
    
            });
    
        };

}
module.exports = new Query()
