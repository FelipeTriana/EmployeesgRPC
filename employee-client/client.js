let grpc = require("grpc");
const proto = grpc.load('./proto/vacaciones.proto');
let protoLoader = require("@grpc/proto-loader");
let readline = require("readline");
const REMOTE_SERVER = '0.0.0.0:50050';
//Para leer lineas desde la terminal
let reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//Array de empleados
let employees = [{
        employee_id: 1,
        name: 'Felipe Triana',
        accrued_leave_days: 15,
        requested_leave_days: 0
    },
    {
        employee_id: 2,
        name: 'Cristian Medoza',
        accrued_leave_days: 15,
        requested_leave_days: 0
    },
    {
        employee_id: 3,
        name: 'Camilo Mejia',
        accrued_leave_days: 15,
        requested_leave_days: 0
    },
    {
        employee_id: 4,
        name: 'Anderson',
        accrued_leave_days: 15,
        requested_leave_days: 0
    },
    {
        employee_id: 5,
        name: 'Sebastian',
        accrued_leave_days: 15,
        requested_leave_days: 0
    }
];


//Crea cliente gRPC 
let client = new proto.work_leave.EmployeeLeaveDaysService(
    REMOTE_SERVER,
    grpc.credentials.createInsecure()
);
//Lee dos lineas desde la consola y modifica un objeto empleado
reader.question("Enter employee id: ", id => {
    reader.question("Ingrese el numero de horas: ", num => {
        let employee = employees.find(function(element) {
            return element.employee_id == id;
        });
        employee.requested_leave_days = parseFloat(num);
        startStream(employee);
    })

});

//Aqui se da la comunicacion entre nuestro servidor y este cliente
let startStream = (a) => {
    client.eligibleForLeave(a, (err, callback) => {
        if (!err) {
            if (callback.eligible == true) {
                client.grantLeave(a, (err, grant) => {
                    console.log(grant);
                    boolean = true;
                })
            } else {
                console.log("Permiso denegado, supera el limite de horas disponibles")
            }
        } else {
            console.log(err.details);
        }
    });

}