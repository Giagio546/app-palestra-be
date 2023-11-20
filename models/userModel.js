const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
        username: {
            type: String,
            required: [true, "Il nome utente è obbligatorio"],
            unique: [true, "Username già esistente"]
        },
        password: {
            type: String,
            required: [true, "La password è obbligatoria"]
        },
        email: {
            type: String,
            required: [true, "L'email è obbligatoria"],
            unique: [true, "Email già esistente"]
        },
        nome: {
            type: String,
            required: [true, "Il nome è obbligatorio"]
        },
        cognome: {
            type: String,
            required: [true, "Il cognome è obbligatorio"]
        },
        dataDiNascita: {
            type: Date,
            required: [true, "La data di nascita è obbligatoria"]
        },
        numeroDiTelefono: {
            type: Number,
            required: [true, "Il numero di telefono è obbligatorio"]
        },
        abilitato: {
            type: Boolean
        },
        ruolo: {
            type: String
        }
    },
    {
        timestamps: true,
    }
    );

module.exports = mongoose.model("User", userSchema);