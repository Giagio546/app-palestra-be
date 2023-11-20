const express = require("express");
const router = express.Router();
const { getPrenotazioni, createPrenotazione, getAllUserPrenotazioni, countAllUserPrenotazioniFromOneWeek, getAllPrenotazioniInMonth } = require("../controllers/prenotazioniController");
const validateToken = require("../middleware/validateTokenHandler");
router.use(validateToken);
router.route("/").get(getPrenotazioni).post(createPrenotazione);
router.route("/:user_id").get(getAllUserPrenotazioni);
router.route("/mese/:start/:end").get(getAllPrenotazioniInMonth);
router.route("/:user_id/:week").get(countAllUserPrenotazioniFromOneWeek);

module.exports = router;