let dateFormat = require('dateformat');
let errs = require('restify-errors');
let config = require('../knex_config')
let knex = require('knex')(config)

class Exam{
    async returnInfExam(id){
        let nCdExame = id;
        knex.raw(`EXEC informacoesExame ?`,[nCdExame])
            .then((resultado) => {res.send(resultado)});
          };
            
            
    async queryTypeExam(req, res){
        knex.raw(`SELECT TPEXAME = LTRIM(RTRIM(cNmTpExame))
             FROM TIPO_EXAME WITH(NOLOCK)`)
            .then((resultado) => {res.send(resultado)});
            };

    async availableExamTimes(codExameParam,nCdHospitalParam,dataparam){
        let { nCdHospital } = nCdHospitalParam;
        let { data } = dataparam
         let sql = `
            SELECT HORA_INICIAL = (CONVERT(VARCHAR(12),HORARIOS.dHoraInicial,108)),HORARIOS.nCdHorario 
                FROM HORARIOS WITH(NOLOCK)
                WHERE CONVERT(DATE,HORARIOS.dHoraInicial)  = CONVERT(DATE, ?)       
                AND HORARIOS.nCdHospital = ?
                AND (
                not EXISTS(SELECT 1 FROM CONSULTA WITH(NOLOCK) WHERE CONSULTA.nCdHorario = HORARIOS.nCdHorario)
                and not EXISTS(SELECT 1 FROM EXAME WITH(NOLOCK) WHERE EXAME.nCdHorario = HORARIOS.nCdHorario )
                ) ORDER BY HORARIOS.dHoraInicial`;
            knex.raw(sql, [data, nCdHospital])
                .then(function (dados) {
                    if (!dados) return 
                    res.send(new errs.BadRequestError('nada foi encontrado'))
                    res.send(dados);
                });   
        }
    async getExam(req, res){
        knex.select()
        .from('EXAME')
        .then(function (EXAME) {
            res.send(EXAME);
            });
        }
    async returnExamByParam(nCdHorarioParam,nCdPacienteParam,nCdExameParam){
        let paramCodHorario =  nCdHorarioParam;
        let paramCodPaciente = nCdPacienteParam;
        let nCdExame = nCdExameParam;
         knex.raw(`exec inserirExame ?, ?, ? `, [paramCodHorario,paramCodPaciente,nCdExame])
              .then(function() {
                  knex.select('nCdExame')
                  .from('EXAME')
                    where('nCdHorario', paramCodHorario).
                        then(function(EXAME){
                            res.send(EXAME);
                })
            })
        }    

    async getTypeExam(idParam){
        let { id } = idParam;
        id = id.replace('-', '/');
        knex('TIPO_EXAME')
            .where('cNmTpExame','like', "%"+id+"%")
            .first()
            .then((dados) => {
                if (!dados) return 
                res.send(new errs.BadRequestError('nada foi encontrado'))
                res.send(dados);
    
            }); 
    }
    async getDateForAvailableExam(nCdHospitalparam){
        const { nCdHospital } = nCdHospitalparam;
        let data_atual = new Date();
        let data_futura = new Date();
        data_futura.addMonths(parseInt(3));
        let sql = `EXEC consultaDatasDisponiveis '${dateFormat(data_atual, 'yyyymmdd')}', '${dateFormat(data_futura, 'yyyymmdd')}', ? `;
        
        knex.raw(sql, [nCdHospital]).then(function (dados) {
            console.log('testing1');
            if (!dados) return res.send(new errs.BadRequestError('nada foi encontrado'))
            res.send(dados);
                });
            }    
    }

module.exports = new Exam()