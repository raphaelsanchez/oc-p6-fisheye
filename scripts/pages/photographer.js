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
 * Function to render photographer gallery.
 * @param {Array} photographerMedias - The media data of the photographer.
 */
const renderGallery = async (photographerMedias) => {
  const mediaSection = document.querySelector(".photographer-medias__gallery")
  const selectElement = document.querySelector("#sortBy")

  const lightbox = new Lightbox(photographerMedias)

  const previousButton = document.querySelector(".lightbox__prev")
  const nextButton = document.querySelector(".lightbox__next")
  const closeButton = document.querySelector(".lightbox__close")

  const attachEventListener = (element, event, handler) => {
    element.addEventListener(event, handler)
  }

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

  const sortMedia = (media, comparator) => {
    media.sort(comparator)
    renderMediaSection(mediaSection, media)
  }

  const sortMediaByPopularity = () => sortMedia(photographerMedias, (a, b) => b.likes - a.likes)
  const sortMediaByDate = () => sortMedia(photographerMedias, (a, b) => new Date(b.date) - new Date(a.date))
  const sortMediaByTitle = () => sortMedia(photographerMedias, (a, b) => a.title.localeCompare(b.title))

  const renderMediaSection = (mediaSection, photographerMedias) => {
    mediaSection.innerHTML = ""
    const totalLikesCounter = document.querySelector(".photographer-aside__likes .count")
    photographerMedias.forEach((media, index) => renderMedia(media, index, totalLikesCounter))
  }

  const renderMedia = (media, index, totalLikesCounter) => {
    const mediaElements = new Medias().createMedia(media, photographerMedias)
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
    attachFormHandlers(photographer)
  } catch (error) {
    console.error("An error occurred:", error)
  }
})
