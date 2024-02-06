"use strict"

// Import des modules externes
import { getData } from "../utils/API.js"
import { Photographer } from "../models/photographer.js"

/**
 * Function to render the home page.
 */
const renderHome = async () => {
  // Fetch data from the API
  const { photographers } = await getData()

  // Render photographer cards
  const photographersSection = document.getElementById("photographers-wrapper")
  photographers.forEach((photographer) => {
    const photographerModel = new Photographer(photographer)
    const photographerCard = photographerModel.getCardTemplate("photographer-card-template")
    photographersSection.appendChild(photographerCard)
  })
}

// Render the home page when the DOM is fully loaded
window.addEventListener("DOMContentLoaded", renderHome)
