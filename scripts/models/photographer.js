export class Photographer {
  constructor(data) {
    this._id = data.id
    this._name = data.name
    this._city = data.city
    this._country = data.country
    this._tags = data.tags
    this._tagline = data.tagline
    this._price = data.price
    this._portrait = data.portrait.replace(/\.(jpg|png)$/, ".webp")
    // portrait placeholder
    this._portraitPlaceholder = data.portrait.replace(/\.(jpg|jpeg|png)$/i, ".min.webp")

    // Constantes
    this._IMAGE_PATH = "./assets/photographers/"
    this._IMAGE_WIDTH = 200
    this._IMAGE_HEIGHT = 200
  }

  get id() {
    return this._id
  }

  get name() {
    return this._name
  }

  get portrait() {
    return this._portrait
  }

  get location() {
    return `${this._city}, ${this._country}`
  }

  get tagline() {
    return this._tagline
  }

  get price() {
    return this._price
  }

  static findById(id, photographers) {
    return photographers.find((photographer) => photographer.id == id)
  }

  getCardTemplate(templateId) {
    // Clonage du template
    const photographerCardTemplate = document.getElementById(templateId)
    const photographerCard = photographerCardTemplate.content.cloneNode(true)

    // Rendu des données
    photographerCard.querySelector(".photographer-card").id = `photographer-${this.id}`
    photographerCard.querySelector(".photographer-card__image").src = `${this._IMAGE_PATH}${this.portrait}`
    // set placeholder
    photographerCard
      .querySelector(".photographer-card__media")
      .style.setProperty("--background-image", `url(../assets/photographers/${this._portraitPlaceholder})`)
    photographerCard.querySelector(".photographer-card__image").width = this._IMAGE_WIDTH
    photographerCard.querySelector(".photographer-card__image").height = this._IMAGE_HEIGHT
    photographerCard.querySelector(".photographer-card__image").loading = "lazy"
    photographerCard.querySelector(".photographer-card__link").href = `./photographer.html?id=${this.id}`
    photographerCard.querySelector(".photographer-card__name").textContent = this.name
    photographerCard.querySelector(".photographer-card__location").textContent = this.location
    photographerCard.querySelector(".photographer-card__tagline").textContent = this.tagline
    photographerCard.querySelector(".photographer-card__price").textContent = `${this.price}€/jour`
    photographerCard
      .querySelector(".photographer-card__price")
      .setAttribute("aria-label", `tarif : ${this.price}€ par jour`)

    // fade in image when loaded
    const image = photographerCard.querySelector(".photographer-card__image")
    image.addEventListener("load", () => {
      image.classList.add("loaded")
      image.parentElement.removeAttribute("style")
    })

    return photographerCard
  }
}
