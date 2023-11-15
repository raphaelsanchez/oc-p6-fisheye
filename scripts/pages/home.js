// Import des modules externes
import { getData } from "../utils/API.js"
import { Photographer } from "../models/photographer.js"

// Fonction pour afficher la page d'accueil
const renderHome = async () => {
  // Récupération des données
  const { photographers } = await getData()

  // Rendu des cartes de photographes
  const photographersSection = document.getElementById("photographers-wrapper")
  photographers.forEach((photographer) => {
    const photographerModel = new Photographer(photographer)
    const photographerCard = photographerModel.getCardTemplate("photographer-card-template")
    photographersSection.appendChild(photographerCard)
  })
}

// Au chargement de la page, on affiche les données
window.addEventListener("DOMContentLoaded", renderHome)
