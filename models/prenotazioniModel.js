const mongoose = require("mongoose");

const prenotazioniSchema = mongoose.Schema({
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "L'utente è obbligatorio"],
            ref: "User"
        },
        date: {
            type: Date,
            required: [true, "La data è obbligatoria"]
        },
    },
    {
        timestamps: true,
    }
    );

module.exports = mongoose.model("Prenotazioni", prenotazioniSchema);