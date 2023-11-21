// TODO: Ajouter un console.log de la souission du formulaire de contact
import { getData } from "../utils/API.js"
import { Photographer } from "../models/photographer.js"
import { Medias } from "../models/medias.js"
import { showModal, closeModal } from "../utils/modal.js"
import { Likes } from "../models/likes.js"
import { Lightbox } from "../models/lightbox.js"

const SELECTORS = {
  PHOTOGRAPHER_NAME: ".photographer-infos__name",
  PHOTOGRAPHER_LOCATION: ".photographer-infos__location",
  PHOTOGRAPHER_TAGLINE: ".photographer-infos__tagline",
  PHOTOGRAPHER_PORTRAIT: ".photographer-infos__image",
  PHOTOGRAPHER_PRICE: ".photographer-aside__price .count",
  PHOTOGRAPHER_LIKES: ".photographer-aside__likes .count",
}

const urlParams = new URLSearchParams(window.location.search)
const id = urlParams.get("id")

// function to render photographer page
const renderPhotographer = async (photographer, media) => {
  // Get photographer medias and sort them by popularity
  const photographerMedias = media
    .filter((media) => String(media.photographerId) === id)
    .sort((a, b) => b.likes - a.likes)

  // Render photographer page elements
  renderMeta(photographer)
  renderHeader(photographer)
  renderGallery(photographerMedias)
  renderAside(photographer, photographerMedias)
}

// Function to render photographer meta
const renderMeta = async (photographer) => {
  // set metas data
  const metaTitle = document.querySelector("title")
  metaTitle.textContent = `${photographer.name} - FishEye`
  const metaDescription = document.querySelector('meta[name="description"]')
  metaDescription.setAttribute(
    "content",
    `Découvrez le profil de ${photographer.name} photographe professionnel(le) à ${photographer.location} et entrez en contact pour vos projets photo ou vidéo.`,
  )
}

// Function to render photographer header
const renderHeader = async (photographer) => {
  // Function to set element text
  const setElementText = (selector, value) => {
    const element = document.querySelector(selector)
    element.textContent = value
  }

  // set header data
  setElementText(SELECTORS.PHOTOGRAPHER_NAME, photographer.name)
  setElementText(SELECTORS.PHOTOGRAPHER_LOCATION, photographer.location)
  setElementText(SELECTORS.PHOTOGRAPHER_TAGLINE, photographer.tagline)

  // set header image
  const portraitElement = document.querySelector(SELECTORS.PHOTOGRAPHER_PORTRAIT)
  portraitElement.src = `./assets/photographers/${photographer.portrait.replace(/\.(jpg|png)$/, ".webp")}`
  portraitElement.alt = `Photo de ${photographer.name}`
}

// Function to render photographer gallery !
// TODO: (maybe) refactor this function
const renderGallery = async (photographerMedias) => {
  const mediaSection = document.querySelector(".photographer-medias__gallery")
  const selectElement = document.querySelector("#sortBy")

  // new lightbox instance
  const lightbox = new Lightbox(photographerMedias)

  // Previous and next buttons
  const previousButton = document.querySelector(".lightbox__prev")
  const nextButton = document.querySelector(".lightbox__next")
  const closeButton = document.querySelector(".lightbox__close")

  // Attach event listeners
  const attachEventListener = (element, event, handler) => {
    element.addEventListener(event, handler)
  }

  // Attach event listeners to lightbox buttons
  attachEventListener(previousButton, "click", () => lightbox.previous())
  attachEventListener(nextButton, "click", () => lightbox.next())
  attachEventListener(closeButton, "click", () => lightbox.close())

  // Close lightbox on escape key press
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

  // Function to sort media
  const sortMedia = (media, comparator) => {
    media.sort(comparator)
    renderMediaSection(mediaSection, media)
  }

  // Refactor the sort functions
  const sortMediaByPopularity = () => sortMedia(photographerMedias, (a, b) => b.likes - a.likes)
  const sortMediaByDate = () => sortMedia(photographerMedias, (a, b) => new Date(b.date) - new Date(a.date))
  const sortMediaByTitle = () => sortMedia(photographerMedias, (a, b) => a.title.localeCompare(b.title))

  // Refactor the renderMediaSection function
  const renderMediaSection = (mediaSection, photographerMedias) => {
    mediaSection.innerHTML = ""
    const totalLikesCounter = document.querySelector(".photographer-aside__likes .count")
    photographerMedias.forEach((media, index) => renderMedia(media, index, totalLikesCounter))
  }

  // Function to render media
  const renderMedia = (media, index, totalLikesCounter) => {
    // get media template
    const mediaElements = new Medias().createMedia(media, photographerMedias)
    const mediaTemplate =
      mediaElements.type === "image"
        ? mediaElements.getImageMediaTemplate("media-image-template")
        : mediaElements.getVideoMediaTemplate("media-video-template")

    // Add event handler to gallery item
    const lightboxTrigger = mediaTemplate.querySelector(".media-card__link")
    lightboxTrigger.addEventListener("click", (e) => {
      e.preventDefault()
      lightbox.open(index)
    })

    // get like button
    const likeButton = mediaTemplate.querySelector(".media-card__likes")
    const likes = new Likes(likeButton, totalLikesCounter)
    likes.addLikeHandler()

    // append media template
    mediaSection.appendChild(mediaTemplate)
  }

  // Sort media by select value overwise sort by popularity by default
  if (selectElement) {
    selectElement.addEventListener("change", () => {
      if (selectElement.value === "date") {
        sortMediaByDate()
      } else if (selectElement.value === "title") {
        sortMediaByTitle()
      } else {
        sortMediaByPopularity()
      }
    })
  }

  renderMediaSection(mediaSection, photographerMedias)
}

// Function to render photographer aside
const renderAside = async (photographer, photographerMedias) => {
  // set aside price data
  const priceElement = document.querySelector(SELECTORS.PHOTOGRAPHER_PRICE)
  priceElement.textContent = `${photographer.price}€/jour`

  // set aside likes data
  const totalLikesCounter = document.querySelector(SELECTORS.PHOTOGRAPHER_LIKES)
  const totalLikes = photographerMedias.reduce((sum, media) => sum + media.likes, 0)

  totalLikesCounter.textContent = totalLikes
}

// Modal handlers
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

// Get data and render page when DOM is loaded
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const { photographers, media } = await getData()
    const photographerData = Photographer.findById(id, photographers)
    if (!photographerData) {
      throw new Error(`Photographer with id ${id} not found`)
    }
    const photographer = new Photographer(photographerData)

    renderPhotographer(photographer, media)
    attachModalHandlers(photographer)
  } catch (error) {
    console.error("An error occurred:", error)
  }
})
