"use strict"

import { getData } from "../utils/API.js"
import { Photographer } from "../models/photographer.js"
import { Medias } from "../models/medias.js"
import { showModal, closeModal } from "../utils/modal.js"
import { Likes } from "../models/likes.js"
import { Lightbox } from "../models/lightbox.js"

const SELECTORS = {
  photographerName: ".photographer-infos__name",
  photographerLocation: ".photographer-infos__location",
  photographerTagline: ".photographer-infos__tagline",
  photographerPortrait: ".photographer-infos__image",
  photographerPrice: ".photographer-aside__price .count",
  photographerLikes: ".photographer-aside__likes .count",
}

const urlParams = new URLSearchParams(window.location.search)
const id = urlParams.get("id")

/**
 * Function to render photographer meta.
 * @param {Object} photographer - The photographer data.
 */
const renderMeta = async (photographer) => {
  const metaTitle = document.querySelector("title")
  metaTitle.textContent = `${photographer.name} - FishEye`
  const metaDescription = document.querySelector('meta[name="description"]')
  metaDescription.setAttribute(
    "content",
    `Découvrez le profil de ${photographer.name} photographe professionnel(le) à ${photographer.location} et entrez en contact pour vos projets photo ou vidéo.`,
  )
}

/**
 * Function to render photographer header.
 * @param {Object} photographer - The photographer data.
 */
const renderHeader = async (photographer) => {
  const setElementText = (selector, value) => {
    const element = document.querySelector(selector)
    element.textContent = value
  }

  setElementText(SELECTORS.photographerName, photographer.name)
  setElementText(SELECTORS.photographerLocation, photographer.location)
  setElementText(SELECTORS.photographerTagline, photographer.tagline)

  const portraitElement = document.querySelector(SELECTORS.photographerPortrait)
  portraitElement.src = `assets/photographers/${photographer.portrait.replace(/\.(jpg|jpeg|png)$/, ".webp")}`
  portraitElement.alt = `Photo de ${photographer.name}`
}

/**
 * Renders the media section.
 * @param {Element} mediaSection - The media section element.
 * @param {Array} photographerMedias - The media data of the photographer.
 * @param {Element} totalLikesCounter - The total likes counter element.
 * @param {Lightbox} lightbox - The lightbox instance.
 */
const renderMediaSection = (mediaSection, photographerMedias, totalLikesCounter, lightbox) => {
  mediaSection.innerHTML = ""
  photographerMedias.forEach((media, index) => renderMedia(media, mediaSection, index, totalLikesCounter, lightbox))
}

/**
 * Renders a media item.
 * @param {Object} media - The media data.
 * @param {Element} mediaSection - The media section element.
 * @param {number} index - The index of the media item.
 * @param {Element} totalLikesCounter - The total likes counter element.
 * @param {Lightbox} lightbox - The lightbox instance.
 */
const renderMedia = (media, mediaSection, index, totalLikesCounter, lightbox) => {
  if (!media) {
    console.error("Media is undefined or null:", media)
    return
  }
  const mediaElements = new Medias().createMedia(media)
  const mediaTemplate =
    mediaElements.type === "image"
      ? mediaElements.getImageMediaTemplate("media-image-template")
      : mediaElements.getVideoMediaTemplate("media-video-template")

  const lightboxTrigger = mediaTemplate.querySelector(".media-card__link")
  lightboxTrigger.addEventListener("click", (e) => {
    e.preventDefault()
    lightbox.open(index)
  })

  const likeButton = mediaTemplate.querySelector(".media-card__likes")
  const likes = new Likes(likeButton, totalLikesCounter)
  likes.addLikeHandler()

  mediaSection.appendChild(mediaTemplate)
}

/**
 * Renders the gallery.
 * @param {Array} photographerMedias - The media data of the photographer.
 */
const renderGallery = async (photographerMedias) => {
  const mediaSection = document.querySelector(".photographer-medias__gallery")

  const lightbox = new Lightbox(photographerMedias)
  const totalLikesCounter = document.querySelector(".photographer-aside__likes .count")

  const previousButton = document.querySelector(".lightbox__prev")
  const nextButton = document.querySelector(".lightbox__next")
  const closeButton = document.querySelector(".lightbox__close")

  attachEventListener(previousButton, "click", () => lightbox.previous())
  attachEventListener(nextButton, "click", () => lightbox.next())
  attachEventListener(closeButton, "click", () => lightbox.close())

  attachEventListener(document, "keydown", (e) => {
    switch (e.key) {
      case "Escape":
        lightbox.close()
        break
      case "ArrowLeft":
        lightbox.previous()
        break
      case "ArrowRight":
        lightbox.next()
        break
    }
  })

  attachFilterHandlers(photographerMedias)

  renderMediaSection(mediaSection, photographerMedias, totalLikesCounter, lightbox)
}

/**
 * Function to render photographer aside.
 * @param {Object} photographer - The photographer data.
 * @param {Array} photographerMedias - The media data of the photographer.
 */
const renderAside = async (photographer, photographerMedias) => {
  const priceElement = document.querySelector(SELECTORS.photographerPrice)
  priceElement.textContent = `${photographer.price}€/jour`

  const totalLikesCounter = document.querySelector(SELECTORS.photographerLikes)
  const totalLikes = photographerMedias.reduce((sum, media) => sum + media.likes, 0)

  totalLikesCounter.textContent = totalLikes
}

/**
 * Function to render photographer page.
 * @param {Object} photographer - The photographer data.
 * @param {Array} media - The media data.
 */
const renderPhotographer = async (photographer, media) => {
  const photographerMedias = media
    .filter((media) => String(media.photographerId) === id)
    .sort((a, b) => b.likes - a.likes)

  renderMeta(photographer)
  renderHeader(photographer)
  renderGallery(photographerMedias)
  renderAside(photographer, photographerMedias)
}

/**
 * Sorts media array by popularity (likes).
 * @param {Array} media - The media array to sort.
 * @returns {Array} The sorted media array.
 */
const sortMediaByPopularity = (media) => {
  media.sort((a, b) => b.likes - a.likes)
  return media
}

/**
 * Sorts media array by popularity (likes).
 * @param {Array} media - The media array to sort.
 * @returns {Array} The sorted media array.
 */
const sortMediaByDate = (media) => {
  media.sort((a, b) => new Date(b.date) - new Date(a.date))
  return media
}

/**
 * Sorts media array by popularity (likes).
 * @param {Array} media - The media array to sort.
 * @returns {Array} The sorted media array.
 */
const sortMediaByTitle = (media) => {
  media.sort((a, b) => a.title.localeCompare(b.title))
  return media
}

/**
 * Attaches an event listener to an element.
 * @param {Element} element - The element to attach the event to.
 * @param {string} event - The event to listen for.
 * @param {Function} handler - The function to call when the event is fired.
 */
const attachEventListener = (element, event, handler) => {
  element.addEventListener(event, handler)
}

/**
 * Attaches click event listeners to filter list items.
 * @param {Array} media - The media data of the photographer.
 */
function attachFilterHandlers(photographerMedias) {
  const filterList = document.querySelector("#filterList")
  filterList.querySelectorAll("li").forEach((listItem) => {
    listItem.addEventListener("click", () => {
      const filterValue = listItem.getAttribute("data-filter")

      let filteredMedia
      switch (filterValue) {
        case "popularity":
          filteredMedia = sortMediaByPopularity(photographerMedias)
          break
        case "date":
          filteredMedia = sortMediaByDate(photographerMedias)
          break
        case "title":
          filteredMedia = sortMediaByTitle(photographerMedias)
          break
        default:
          filteredMedia = sortMediaByPopularity(photographerMedias)
      }

      // Mettez à jour l'affichage des médias
      const mediaSection = document.querySelector(".photographer-medias__gallery")
      const totalLikesCounter = document.querySelector(".photographer-aside__likes .count")
      const lightbox = new Lightbox(filteredMedia)
      renderMediaSection(mediaSection, filteredMedia, totalLikesCounter, lightbox)
    })
  })
}

/**
 * Function to attach modal handlers.
 * @param {Object} photographer - The photographer data.
 */
const attachModalHandlers = (photographer) => {
  const modalButtons = document.querySelectorAll("[data-target]")
  modalButtons.forEach((button) => {
    button.addEventListener("click", () => {
      showModal(button, photographer)
    })
  })

  const modalCloseButtons = document.querySelectorAll("[data-dismiss]")
  modalCloseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      closeModal(button)
    })
  })
}

/**
 * Function to attach form handlers.
 * @param {Object} photographer - The photographer data.
 */
const attachFormHandlers = (photographer) => {
  const form = document.querySelector(".photographer-contact__form")
  form.addEventListener("submit", (e) => {
    e.preventDefault()
    const date = new Date()
    console.group("%cForm submission", "background: #FFA500; color: black; padding: 2px 4px; border-radius: 4px;")
    console.log(`for ${photographer.name}`)
    console.log(`Date: ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`)
    const formData = new FormData(form)
    const data = Array.from(formData.entries()).reduce((obj, [key, value]) => {
      obj[key] = value
      return obj
    }, {})
    console.table(data)
    console.groupEnd()
  })
}

/**
 * Function to attach dropdown handlers.
 */
const attacheDropdownHandlers = () => {
  const dropdownButton = document.querySelector(".photographer-medias__dropdown-button")
  const dropdownList = document.querySelector(".photographer-medias__dropdown-list")
  const dropdownItems = document.querySelectorAll(".photographer-medias__dropdown-item")

  // toggle .visible class on dropdownList
  dropdownButton.addEventListener("click", () => {
    dropdownList.classList.toggle("visible")
    dropdownButton.classList.toggle("active")
  })

  // if current item is equal to button textContent, add .hidden to current item
  dropdownItems.forEach((item) => {
    if (item.textContent === dropdownButton.textContent) {
      item.classList.add("hidden")
    }
  })

  // change button textContent to current item textContent and remove .visible from dropdownList
  dropdownItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      dropdownButton.textContent = item.textContent
      dropdownList.classList.remove("visible")
      dropdownButton.classList.remove("active")
      // add .hidden to current item and remove .hidden from other items
      dropdownItems.forEach((item) => {
        item.classList.remove("hidden")
      })
      event.target.classList.add("hidden")
    })
  })
}

/**
 * Event listener for the DOMContentLoaded event.
 * When the DOM is fully loaded, it fetches data, creates a new Photographer instance,
 * and calls the necessary functions to render the photographer and attach handlers.
 */
window.addEventListener("DOMContentLoaded", async () => {
  try {
    // Fetch data
    const { photographers, media } = await getData()

    // Find the photographer by id
    const photographerData = Photographer.findById(id, photographers)

    // If the photographer is not found, throw an error
    if (!photographerData) {
      throw new Error(`Photographer with id ${id} not found`)
    }

    // Create a new Photographer instance
    const photographer = new Photographer(photographerData)

    // Render the photographer and attach handlers
    renderPhotographer(photographer, media)
    attachModalHandlers(photographer)
    attachFormHandlers(photographer)
    attacheDropdownHandlers()
  } catch (error) {
    console.error("An error occurred:", error)
  }
})
