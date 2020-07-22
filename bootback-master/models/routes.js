const Router = require('restify-router').Router;
const routes = new Router();
const Specialty = require("../controller/Specialty")
const Patient = require("../controller/Patient")
const Exam = require('../controller/Exam')
const Hospitality = require('../controller/Hospitality')
const Query = require('../controller/Query')

routes.get('/getAllpatient', Patient.getAllPatient)
routes.get('/patient/:id', Patient.getPatientByCpf)
routes.post('/insertPatient', Patient.insertPatient)
routes.put('/patient/update/:id', Patient.updatePatientByCpf)
routes.del('/patient/delete/:id', Patient.deletePatientByCpf)

routes.get('/returnExam/:id', Exam.returnInfExam)
routes.get('/queryTypeExam', Exam.queryTypeExam)
routes.get('/availableExamTimes/:nCdHospital/:data', Exam.availableExamTimes)
routes.get('/returnExam', Exam.getExam)
routes.post('/selectExamUsingParam', Exam.returnExamByParam)
routes.get('/returnTypeExam/:id', Exam.getTypeExam)
routes.get('/availableDates/:nCdHospitalparam', Exam.getDateForAvailableExam)

routes.get('/returnHospitalityById/:id', Hospitality.getHospitalityById)
routes.get('/returnAllHospitality', Hospitality.getHospitalityById)

routes.get('/returnSpecialty/:id', Specialty.getSpecialityById)
routes.get('/returnAllSpecialty', Specialty.QuerySpeciality)

routes.get('/returnTypeQuery', Query.typeQuery)
routes.get('/informationOfQuery:id', Query.returnQuery)
routes.get('/avaliableDates/:nCdEspecialidade/:nCdHospital', Query.returnAllQueryInDatabase)
routes.get('/avaliableTimes/:nCdEspecialidade/:nCdHospital/:data', Query.avaliableTimes)
routes.get('/returnAllQueryInDatabase', Query.returnAllQueryInDatabase)
routes.post('/insertQueryInDatabase', Query.insertQueryInDatabase)
routes.get('/returnTimeById:id', Query.timesInDatabase)


module.exports = routes