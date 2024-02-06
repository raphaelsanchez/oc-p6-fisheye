"use strict"

/**
 * Class representing a collection of media.
 */
export class Medias {
  /**
   * Create a media.
   * @param {Object} photographerDataMediaById - The data of the media.
   * @param {Object} photographerDataById - The data of the photographer.
   * @return {ImageMedia|VideoMedia} The created media.
   * @throws {Error} When the media type is unknown.
   */
  createMedia(photographerDataMediaById, photographerDataById) {
    if (Object.prototype.hasOwnProperty.call(photographerDataMediaById, "image")) {
      return new ImageMedia(photographerDataMediaById, photographerDataById)
    }
    if (Object.prototype.hasOwnProperty.call(photographerDataMediaById, "video")) {
      return new VideoMedia(photographerDataMediaById, photographerDataById)
    }
    throw new Error("Unknown media type")
  }
}

/**
 * Class representing an image media.
 */
class ImageMedia {
  /**
   * Create an image media.
   * @param {Object} photographerDataMediaById - The data of the image media.
   * @param {Object} photographerDataById - The data of the photographer.
   */
  constructor(photographerDataMediaById) {
    this.id = photographerDataMediaById.id
    this.title = photographerDataMediaById.title
    this.type = "image"
    this.src = `assets/medias/${photographerDataMediaById.image}`
    if (this.src.endsWith(".jpg") || this.src.endsWith(".png")) {
      this.src = this.src.replace(/\.(jpg|png)$/, ".webp")
    }
    this.placeholder = `../assets/medias/${photographerDataMediaById.image.replace(/\.(jpg|jpeg|png)$/i, ".20.webp")}`
    this.thumbnail = `assets/medias/${photographerDataMediaById.image.replace(/\.(jpg|jpeg|png)$/i, ".350.webp")}`
    this.alt = photographerDataMediaById.title
    this.likes = photographerDataMediaById.likes
  }

  /**
   * Get the HTML element for the image media.
   * @returns {HTMLImageElement} The image element.
   */
  getImageMediaElement() {
    const imageElement = document.createElement("img")
    imageElement.classList.add("lightbox__image")
    imageElement.src = this.src
    imageElement.alt = this.alt
    imageElement.setAttribute("loading", "lazy")
    return imageElement
  }

  /**
   * Get the template for the image media.
   * @param {string} templateId - The ID of the template.
   * @returns {DocumentFragment} The cloned template.
   */
  getImageMediaTemplate(templateId) {
    const mediaCardTemplate = document.getElementById(templateId)
    const mediaCard = mediaCardTemplate.content.cloneNode(true)

    mediaCard.querySelector(".media-card").id = `media-${this.id}`
    mediaCard.querySelector(".media-card__media").style.setProperty("--background-image", `url(${this.placeholder})`)
    mediaCard.querySelector(".media-card__link").setAttribute("href", `${this.src}`)
    mediaCard.querySelector(".media-card__title").textContent = this.title
    mediaCard.querySelector(".media-card__likes .count").textContent = this.likes
    mediaCard.querySelector(".media-card__image").src = `${this.thumbnail}`
    mediaCard.querySelector(".media-card__image").alt = this.alt

    const image = mediaCard.querySelector(".media-card__image")
    image.addEventListener("load", () => {
      image.classList.add("loaded")
    })

    return mediaCard
  }
}

/**
 * Class representing a video media.
 */
class VideoMedia {
  /**
   * Create a video media.
   * @param {Object} photographerDataMediaById - The data of the video media.
   * @param {Object} photographerDataById - The data of the photographer.
   */
  constructor(photographerDataMediaById) {
    this.id = photographerDataMediaById.id
    this.title = photographerDataMediaById.title
    this.type = "video"
    this.src = `assets/medias/${photographerDataMediaById.video}`
    this.alt = photographerDataMediaById.title
    this.likes = photographerDataMediaById.likes
  }

  /**
   * Get the HTML element for the video media.
   * @returns {HTMLVideoElement} The video element.
   */
  getVideoMediaElement() {
    const videoElement = document.createElement("video")
    videoElement.classList.add("lightbox__video")
    videoElement.src = this.src
    videoElement.controls = true
    videoElement.autoplay = true
    videoElement.muted = true
    videoElement.loop = true
    return videoElement
  }

  /**
   * Get the template for the video media.
   * @param {string} templateId - The ID of the template.
   * @returns {DocumentFragment} The cloned template.
   */
  getVideoMediaTemplate(templateId) {
    const mediaCardTemplate = document.getElementById(templateId)
    const mediaCard = mediaCardTemplate.content.cloneNode(true)

    mediaCard.querySelector(".media-card").id = `media-${this.id}`
    mediaCard.querySelector(".media-card__title").textContent = this.title
    mediaCard.querySelector(".media-card__likes .count").textContent = this.likes
    mediaCard.querySelector(".media-card__video").src = `${this.src}`
    mediaCard.querySelector(".media-card__link").setAttribute("href", `${this.src}`)
    mediaCard.querySelector(".media-card__video source").src = `${this.src}`

    const video = mediaCard.querySelector(".media-card__video")
    video.addEventListener("loadeddata", () => {
      video.classList.add("loaded")
    })

    return mediaCard
  }
}
