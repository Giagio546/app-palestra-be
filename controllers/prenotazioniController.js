const asyncHandler = require("express-async-handler");
const Prenotazioni = require("../models/prenotazioniModel");
const dayjs = require("dayjs");
const prenotazioniService = require("../services/prenotazioniService")

//@desc Get all prenotazioni
//@route GET /api/prenotazioni
//@access private
const getPrenotazioni = asyncHandler(async (req, res) => {
    const users = await Prenotazioni.find();
    res.status(200).json(users);
});

//@desc Add prenotazione
//@route POST /api/prenotazioni
//@access private
const createPrenotazione = asyncHandler(async (req, res) => {
    const { user_id, date } = req.body;
    if (!user_id || !date) {
        res.status(400);
        throw new Error("Sono richiesti tutti i campi");
    }
    const userAvailable = await Prenotazioni.findOne({user_id, date});
    if(userAvailable) {
        res.status(400);
        throw new Error("Utente già prenotato");
    }
    const prenotazione = await Prenotazioni.create({
        user_id,
        date
    });
    console.log(prenotazione);
    if (prenotazione) {
        res.status(201).json({_id: prenotazione.id, date: prenotazione.date});
    } else {
        res.status(400);
        throw new Error("Dati non validi");
    }
    
});
//@desc Get all prenotazioni from an user
//@route GET /api/prenotazioni/:id 
//@access private
const getAllUserPrenotazioni = asyncHandler(async (req, res) => {
    const prenotazioniUser = await prenotazioniService.getAllUserPrenotazioni(req.params.user_id);
    if(!req.params.user_id) {
        res.status(401);
        throw new Error("Il parametro user_id è obbligatorio");
    }
    res.status(200).json(prenotazioniUser);
});

//@desc Get all prenotazioni from an user
//@route GET /api/prenotazioni/:user_id/:week
//@access private
const countAllUserPrenotazioniFromOneWeek = asyncHandler(async (req, res) => {
    if(!req.params.week || !req.params.user_id) {
        res.status(401);
        throw new Error("Parametri obbligatori")
    }
    const numeroPrenotazioni = await prenotazioniService.countAllUserPrenotazioniFromOneWeek(req.params.user_id, req.params.week)
    return res.status(200).json({numeroPrenotazioni: numeroPrenotazioni});
})

//@desc Get all prenotazioni within a month
//@route GET /api/prenotazioni/mese/:start/:end
//@access private
const getAllPrenotazioniInMonth = asyncHandler(async (req, res) => {
    if(!req.params.start || !req.params.end) {
        res.status(401);
        throw new Error("data not found")
    }
    const prenotazioniMese = await prenotazioniService.prenotazioniMensili(req.params.start, req.params.end);
    return res.status(200).json(prenotazioniMese)
})
module.exports = { getPrenotazioni, createPrenotazione, getAllUserPrenotazioni, countAllUserPrenotazioniFromOneWeek, getAllPrenotazioniInMonth};