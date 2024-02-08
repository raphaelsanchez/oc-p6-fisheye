"use strict"

/**
 * Class representing a photographer.
 */
export class Photographer {
  /**
   * Create a photographer.
   * @param {Object} data - The data of the photographer.
   */
  constructor(data) {
    this._id = data.id
    this._name = data.name
    this._city = data.city
    this._country = data.country
    this._tags = data.tags
    this._tagline = data.tagline
    this._price = data.price
    this._portrait = data.portrait.replace(/\.(jpg|jpeg|png)$/, ".webp")
    this._portraitPlaceholder = data.portrait.replace(/\.(jpg|jpeg|png)$/i, ".20.webp")

    this._IMAGE_PATH = "./assets/photographers/"
    this._IMAGE_WIDTH = 200
    this._IMAGE_HEIGHT = 200
  }

  /**
   * Get the ID of the photographer.
   * @return {number} The ID of the photographer.
   */
  get id() {
    return this._id
  }

  /**
   * Get the name of the photographer.
   * @return {string} The name of the photographer.
   */
  get name() {
    return this._name
  }

  /**
   * Get the portrait of the photographer.
   * @return {string} The portrait of the photographer.
   */
  get portrait() {
    return this._portrait
  }

  /**
   * Get the location of the photographer.
   * @return {string} The location of the photographer.
   */
  get location() {
    return `${this._city}, ${this._country}`
  }

  /**
   * Get the tagline of the photographer.
   * @return {string} The tagline of the photographer.
   */
  get tagline() {
    return this._tagline
  }

  /**
   * Get the price of the photographer.
   * @return {number} The price of the photographer.
   */
  get price() {
    return this._price
  }

  /**
   * Find a photographer by ID.
   * @param {number} id - The ID of the photographer.
   * @param {Array} photographers - The array of photographers.
   * @return {Photographer} The photographer found.
   */
  static findById(id, photographers) {
    return photographers.find((photographer) => String(photographer.id) === id)
  }

  /**
   * Get the card template of the photographer.
   * @param {string} templateId - The ID of the template.
   * @return {DocumentFragment} The card template of the photographer.
   */
  getCardTemplate(templateId) {
    const photographerCardTemplate = document.getElementById(templateId)
    const photographerCard = photographerCardTemplate.content.cloneNode(true)

    photographerCard.querySelector(".photographer-card").id = `photographer-${this.id}`
    photographerCard
      .querySelector(".photographer-card__media")
      .style.setProperty("--background-image", `url(../assets/photographers/${this._portraitPlaceholder})`)
    photographerCard.querySelector(".photographer-card__image").src = `${this._IMAGE_PATH}${this.portrait}`
    photographerCard.querySelector(".photographer-card__image").width = this._IMAGE_WIDTH
    photographerCard.querySelector(".photographer-card__image").height = this._IMAGE_HEIGHT
    photographerCard.querySelector(".photographer-card__image").alt = `Photo de ${this.name}`
    photographerCard.querySelector(".photographer-card__link").href = `./photographer.html?id=${this.id}`
    photographerCard.querySelector(".photographer-card__name").textContent = this.name
    // Location
    photographerCard.querySelector(".photographer-card__location").textContent = this.location
    photographerCard
      .querySelector(".photographer-card__location")
      .setAttribute("aria-label", `Localisation : ${this.location}.`)
    // Tagline
    photographerCard.querySelector(".photographer-card__tagline").textContent = this.tagline
    photographerCard
      .querySelector(".photographer-card__tagline")
      .setAttribute("aria-label", `Description : ${this.tagline}.`)
    // Price
    photographerCard.querySelector(".photographer-card__price").textContent = `${this.price}€/jour`
    photographerCard
      .querySelector(".photographer-card__price")
      .setAttribute("aria-label", `tarif : ${this.price}€ par jour.`)

    const image = photographerCard.querySelector(".photographer-card__image")
    image.addEventListener("load", () => {
      image.classList.add("loaded")
    })

    return photographerCard
  }
}
