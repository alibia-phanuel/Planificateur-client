// Sélection des éléments du DOM pour la manipulation du calendrier
const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  gotoBtn = document.querySelector(".goto-btn"),
  addEventTitle = document.querySelector(".event-name "),
  addEventFrom = document.querySelector(".event-time-from "),
  addEventSubmit = document.querySelector(".add-event-btn ");
const todayBtn = document.querySelector(".today-btn");

// Initialisation des variables de la date actuelle
let today = new Date();
let activeDay;
let month = today.getMonth(); // Mois actuel
let year = today.getFullYear(); // Année actuelle

// Liste des mois en français
const months = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

// Tableau des événements
const eventsArr = [];
getEvents(); // Récupération des événements du localStorage
console.log(eventsArr);

// Fonction pour initialiser le calendrier en ajoutant les jours et les événements
function initCalendar() {
  const firstDay = new Date(year, month, 1); // Premier jour du mois
  const lastDay = new Date(year, month + 1, 0); // Dernier jour du mois
  const prevLastDay = new Date(year, month, 0); // Dernier jour du mois précédent
  const prevDays = prevLastDay.getDate(); // Nombre de jours du mois précédent
  const lastDate = lastDay.getDate(); // Dernier jour du mois actuel
  const day = firstDay.getDay(); // Jour de la semaine du premier jour du mois
  const nextDays = 7 - lastDay.getDay() - 1; // Nombre de jours du mois suivant

  date.innerHTML = months[month] + " " + year; // Affichage du mois et de l'année

  let days = "";

  // Ajout des jours du mois précédent
  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  // Ajout des jours du mois actuel
  for (let i = 1; i <= lastDate; i++) {
    // Vérification si un événement existe pour ce jour
    let event = false;
    eventsArr.forEach((eventObj) => {
      if (
        eventObj.day === i &&
        eventObj.month === month + 1 &&
        eventObj.year === year
      ) {
        event = true;
      }
    });

    // Vérification si c'est le jour actuel
    if (
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ) {
      activeDay = i;
      getActiveDay(i);
      updateEvents(i);
      if (event) {
        days += `<div class="day today active event">${i}</div>`; // Jour actif avec événement
      } else {
        days += `<div class="day today active">${i}</div>`; // Jour actif sans événement
      }
    } else {
      if (event) {
        days += `<div class="day event">${i}</div>`; // Jour avec événement
      } else {
        days += `<div class="day ">${i}</div>`; // Jour sans événement
      }
    }
  }

  // Ajout des jours du mois suivant
  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }

  daysContainer.innerHTML = days; // Affichage des jours dans le conteneur
  addListner(); // Ajout des écouteurs d'événements
}

// Fonction pour changer de mois en arrière
function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--; // Si le mois est inférieur à 0, passer à l'année précédente
  }
  initCalendar(); // Réinitialisation du calendrier
}

// Fonction pour changer de mois en avant
function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++; // Si le mois est supérieur à 11, passer à l'année suivante
  }
  initCalendar(); // Réinitialisation du calendrier
}

// Ajout des écouteurs d'événements pour les boutons précédent et suivant
prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

initCalendar(); // Initialisation du calendrier au chargement

// Fonction pour ajouter l'événement actif au jour sélectionné
function addListner() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      getActiveDay(e.target.innerHTML); // Sélection du jour actif
      updateEvents(Number(e.target.innerHTML)); // Mise à jour des événements
      activeDay = Number(e.target.innerHTML);
      // Retrait de la classe active sur tous les jours
      days.forEach((day) => {
        day.classList.remove("active");
      });
      // Si un jour du mois précédent ou suivant est cliqué, changer de mois
      if (e.target.classList.contains("prev-date")) {
        prevMonth();
        // Ajouter la classe active au jour cliqué après le changement de mois
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("prev-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else if (e.target.classList.contains("next-date")) {
        nextMonth();
        // Ajouter la classe active au jour cliqué après le changement de mois
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("next-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else {
        e.target.classList.add("active"); // Ajouter la classe active au jour sélectionné
      }
    });
  });
}

// Fonction pour récupérer les événements depuis le localStorage
function getEvents() {
  // Vérification si des événements sont enregistrés dans le localStorage
  if (localStorage.getItem("events") === null) {
    return;
  }
  eventsArr.push(...JSON.parse(localStorage.getItem("events"))); // Ajouter les événements au tableau
}

// Fonction pour afficher le jour sélectionné dans la console
function getActiveDay(day) {
  console.log(`Jour sélectionné : ${day}`);
}

// Fonction pour afficher un message d'alerte lors de la sélection d'un jour
function updateEvents(day) {
  alert(` Le jour ${day}  a été sélectionné.`);
}
