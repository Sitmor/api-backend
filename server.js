const express = require('express');
const mongoose = require('mongoose');
const { ApolloServer, gql} = require('apollo-server-express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Medico = require('./models/medico');
const Paciente = require('./models/paciente')
const Cajero = require('./models/cajero')
const Secretaria = require('./models/secretaria');

const cors = require('cors');

const uri = "mongodb+srv://admin:PDncJGWrztcUiLmL@clinica.nm9ki.mongodb.net/?retryWrites=true&w=majority&appName=clinica";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const typeDefs = gql`
    type Medico {
        rut: String!
        nombre: String!
        apellido: String!
        contrasena: String!
        especialidad: String!
    }

    type Cajero {
        rut: String!
        nombre: String!
        apellido: String!
        contrasena: String!
    }

    type Paciente {
        rut: String!
        nombre: String!
        apellido: String!
        contrasena: String!
        email: String!
    }

    type Alert {
        message: String!
    }

    input MedicoInput {
        rut: String!
        nombre: String!
        apellido: String!
        contrasena: String!
        especialidad: String!
    }

    input PacienteInput {
        rut: String!
        nombre: String!
        apellido: String!
        contrasena: String!
        email: String!
    }

    input CajeroInput {
        rut: String!
        nombre: String!
        apellido: String!
        contrasena: String!
    }
    
    type Secretaria {
        rut: String!
        nombre: String!
        apellido: String!
        contrasena: String!
    }

    input SecretariaInput {
        rut: String!
        nombre: String!
        apellido: String!
        contrasena: String!
    }

    type Query {
        getPacientes(page: Int, limit: Int = 1): [Paciente]
        getPaciente(rut: String!): Paciente
        getMedicos(page: Int, limit: Int = 1): [Medico]
        getMedico(rut: String!): Medico
        getSecretarias(page: Int, limit: Int = 1): [Secretaria]
        getSecretaria(rut: String!): Secretaria
        login(rut: String!, contrasena: String!): Paciente
    }

    type Mutation {
        addPaciente(input: PacienteInput): Paciente
        updPaciente(rut: String!, input: PacienteInput): Paciente
        delPaciente(rut: String!): Alert
        addCajero(input: CajeroInput): Cajero
        updCajero(rut: String!, input: CajeroInput): Cajero
        delCajero(rut: String!): Alert
        addMedico(input: MedicoInput): Medico
        updMedico(rut: String!, input: MedicoInput): Medico
        delMedico(rut: String!): Alert
        addSecretaria(input: SecretariaInput): Secretaria
        updSecretaria(rut: String!, input: SecretariaInput): Secretaria
        delSecretaria(rut: String!): Alert
    }
    
    
`;

const resolvers = {
    Query: {
        async getMedicos(obj, {page, limit}) {
            const medicos = await Medico.find();
            return medicos;
        },
        async getMedico(obj, {rut}) {
            const medico = await Medico.findOne({rut});
            return medico;
        },
        async getPacientes(obj, {page, limit}) {
            const pacientes = await Paciente.find();
            return pacientes;
        },
        async getPaciente(obj, {rut}) {
            const paciente = await Paciente.findOne({rut});
            return paciente;
        },
        async getSecretarias(obj, {page, limit}) {
            const secretarias = await Secretaria.find();
            return secretarias;
        },
        async getSecretaria(obj, {rut}) {
            const secretaria = await Secretaria.findOne({rut});
            return secretaria;
        },
        async login(obj, {rut, contrasena}) {
            const paciente = await Paciente.findOne({rut})
            bcrypt.compare(contrasena, paciente.contrasena, function(err, result) {
                if(result){return(paciente)}else{return({})}
            });
        }
    },
    Mutation: {
        async addMedico(obj, {input}) {
            const medico = new Medico(input);
            await medico.save();
            return medico;
        },
        async updMedico(obj, {rut, input}) {
            const medico = await Medico.findOneAndUpdate({rut}, input, {new: true});
            return medico;
        },
        async delMedico(obj, {rut}) {
            await Medico.deleteOne({rut: rut});
            return {
                message: 'Medico ${rut} eliminado'
            };
        },

        async addSecretaria(obj, {input}) {
            const secretaria = new Secretaria(input);
            await secretaria.save();
            return secretaria;
        },
        async updSecretaria(obj, {rut, input}) {
            const secretaria = await Secretaria.findOneAndUpdate({rut}, input, {new: true});
            return secretaria;
        },
        async delSecretaria(obj, {rut}) {
            await Secretaria.deleteOne({rut: rut});
            return {
                message: 'Secretaria ${rut} eliminada'
            };
        },

        async addPaciente(obj, {input}) {

            bcrypt.hash(input.contrasena, saltRounds, async function(err, hash) {
                input.contrasena = hash
                const paciente = new Paciente(input);
                await paciente.save();
                return paciente;
            });
        },

        async updPaciente(obj, {rut, input}) {
            const paciente = await Paciente.findOneAndUpdate({rut}, input, {new: true});
            return paciente;
        },

        async delPaciente(obj, {rut}) {
            await Paciente.deleteOne({rut: rut});
            return {
                message: 'Paciente ${rut} eliminado'
            };
        },

        async addCajero(obj, {input}) {
            const cajero = new Cajero(input);
            await cajero.save();
            return cajero;
        },

        async updCajero(obj, {rut, input}) {
            const cajero = await Cajero.findOneAndUpdate({rut}, input, {new: true});
            return cajero;
        },

        async delCajero(obj, {rut}) {
            await Cajero.deleteOne({rut: rut});
            return {
                message: 'Cajero ${rut} eliminado'
            };
        }
    }
}

let apolloServer = null;

const corsOptions = {  
    origin: 'http://localhost:3001',
    credentials: false
};

async function startServer() {
    apolloServer = new ApolloServer({typeDefs, resolvers, corsOptions});
    await apolloServer.start();

    apolloServer.applyMiddleware({app, cors: false});

}

const app = new express();
app.use(cors());
app.listen(8080, () => {
    console.log('Server iniciado');
});

startServer();