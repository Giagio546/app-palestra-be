const asyncHandler = require("express-async-handler");
const Prenotazioni = require("../models/prenotazioniModel");
const dayjs = require("dayjs");
const isoWeek = require('dayjs/plugin/isoWeek');
const weekday = require("dayjs/plugin/weekday");
const updateLocale = require('dayjs/plugin/updateLocale')
const fasceOrarie = process.env.FASCE_ORARIE.split(',');
dayjs.extend(updateLocale)

dayjs.updateLocale('en', {
  weekdays: [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ]
})
dayjs.extend(isoWeek)
dayjs.extend(weekday)
const getAllUserPrenotazioni = async (user_id) => {
    const userPrenotazioni = await Prenotazioni.find({user_id: user_id});
    return userPrenotazioni;
};

const countAllUserPrenotazioniFromOneWeek = async (user_id, date) => {
  const userPrenotazioni = await getAllUserPrenotazioni(user_id);
  const weekOfGivenDate = dayjs(date).startOf('isoWeek').isoWeek();
  const prenotazioniNellaSettimanaCorrente = userPrenotazioni.filter(prenotazione => {
      return dayjs(prenotazione.date).startOf('isoWeek').isoWeek() === weekOfGivenDate;
  });
  const numeroPrenotazioniNellaSettimanaCorrente = prenotazioniNellaSettimanaCorrente.length;
  return numeroPrenotazioniNellaSettimanaCorrente;
};


const getAllDaysInMonth = (meseStart, meseEnd) => {
  console.log(meseStart, meseEnd)
  const giorniNelMese = [];
  let currentDate = dayjs(meseStart).startOf('day');
  const endOfMonth = dayjs(meseEnd).endOf('day');
  console.log(currentDate, endOfMonth)
  while (currentDate.isBefore(endOfMonth) || currentDate.isSame(endOfMonth, 'day')) {
    giorniNelMese.push(currentDate.format('YYYY-MM-DD'));
    currentDate = currentDate.add(1, 'day');
  }
  console.log(giorniNelMese)
  return giorniNelMese;
};

const prenotazioniMensili = async (meseStart, meseEnd) => {
  const giorniNelMese = getAllDaysInMonth(meseStart, meseEnd);
  console.log(giorniNelMese)
  const prenotazioniMensili = await Prenotazioni.find({
    date: {
      $gte: meseStart,
      $lte: meseEnd
    }
  });
  console.log(prenotazioniMensili)
  const prenotazioniPerGiorno = giorniNelMese.reduce((acc, giorno) => {
    acc[giorno] = {};
    fasceOrarie.forEach((fasciaOraria) => {
      acc[giorno][fasciaOraria] = {
        fasciaOraria,
        prenotazioni: []
      };
    });
    return acc;
  }, {});
  console.log(prenotazioniPerGiorno)
  prenotazioniMensili.forEach((prenotazione) => {
    const giorno = dayjs(prenotazione.date).format('YYYY-MM-DD');
    const fasciaOraria = getFasciaOraria(prenotazione.date);
    
    if (!giorno || !fasciaOraria) {
      console.error('Giorno o fasciaOraria non definiti:', giorno, fasciaOraria);
      return;
    }

    prenotazioniPerGiorno[giorno][fasciaOraria].prenotazioni.push(prenotazione);
  });
  console.log(prenotazioniPerGiorno)
  const result = Object.entries(prenotazioniPerGiorno).map(([giorno, fasceOrarie]) => ({
    giorno,
    fasceOrarie: Object.values(fasceOrarie)
  }));

  return result;
};

const getFasciaOraria = (dataPrenotazione) => {
  console.log(dataPrenotazione)
  console.log(fasceOrarie)
  const oraPrenotazione = dayjs(dataPrenotazione).format('HH:mm');
  console.log(oraPrenotazione)
  for(const fasciaOraria of fasceOrarie) {
    const [inizio, fine] = fasciaOraria.split('-');
    console.log("inizio " + inizio <= oraPrenotazione)
    console.log("fine " + fine > oraPrenotazione)
    if(oraPrenotazione >= inizio && oraPrenotazione < fine) {
      return fasciaOraria;
    }
  }
}
module.exports = {getAllUserPrenotazioni, countAllUserPrenotazioniFromOneWeek, prenotazioniMensili}