// eslint-disable-next-line no-unused-vars
export class Medias {
  createMedia(photographerDataMediaById, photographerDataById) {
    // Vérifier si le media est une image
    if (Object.prototype.hasOwnProperty.call(photographerDataMediaById, "image")) {
      return new ImageMedia(photographerDataMediaById, photographerDataById)
      // Si ce n'est pas une image, vérifier si c'est une vidéo
    }
    if (Object.prototype.hasOwnProperty.call(photographerDataMediaById, "video")) {
      return new VideoMedia(photographerDataMediaById, photographerDataById)
    }
    // Si le type de média est inconnu, lever une erreur
    throw new Error("Unknown media type")
  }
}

class ImageMedia {
  constructor(photographerDataMediaById) {
    // Définir les propriétés d'une image
    this.id = photographerDataMediaById.id
    this.title = photographerDataMediaById.title
    this.type = "image"
    this.src = `assets/medias/${photographerDataMediaById.image}`
    // Check if the image source ends with .jpg or .png
    if (this.src.endsWith(".jpg") || this.src.endsWith(".png")) {
      // Replace the extension with .webp
      this.src = this.src.replace(/\.(jpg|png)$/, ".webp")
    }
    this.placeholder = `../assets/medias/${photographerDataMediaById.image.replace(/\.(jpg|jpeg|png)$/i, ".20.webp")}`
    this.thumbnail = `assets/medias/${photographerDataMediaById.image.replace(/\.(jpg|jpeg|png)$/i, ".350.webp")}`
    this.alt = photographerDataMediaById.title
    this.likes = photographerDataMediaById.likes
  }

  getImageMediaElement() {
    // Créer un element HTML type image
    const imageElement = document.createElement("img")
    imageElement.classList.add("lightbox__image")
    imageElement.src = this.src
    imageElement.alt = this.alt
    imageElement.setAttribute("loading", "lazy")
    return imageElement
  }

  // Récupère le template d'un média
  getImageMediaTemplate(templateId) {
    // Clonage du template
    const mediaCardTemplate = document.getElementById(templateId)
    const mediaCard = mediaCardTemplate.content.cloneNode(true)

    // Rendu des données
    mediaCard.querySelector(".media-card").id = `media-${this.id}`
    mediaCard.querySelector(".media-card__media").style.setProperty("--background-image", `url(${this.placeholder})`)
    mediaCard.querySelector(".media-card__link").setAttribute("href", `${this.src}`)
    mediaCard.querySelector(".media-card__title").textContent = this.title
    mediaCard.querySelector(".media-card__likes .count").textContent = this.likes
    mediaCard.querySelector(".media-card__image").src = `${this.thumbnail}`
    mediaCard.querySelector(".media-card__image").alt = this.alt

    // fade in image when loaded
    const image = mediaCard.querySelector(".media-card__image")
    image.addEventListener("load", () => {
      image.classList.add("loaded")
      // image.parentElement.removeAttribute("style")
    })

    return mediaCard
  }
}

class VideoMedia {
  constructor(photographerDataMediaById) {
    // Définir les propriétés d'une vidéo
    this.id = photographerDataMediaById.id
    this.title = photographerDataMediaById.title
    this.type = "video"
    this.src = `assets/medias/${photographerDataMediaById.video}`
    this.alt = photographerDataMediaById.title
    this.likes = photographerDataMediaById.likes
  }

  getVideoMediaElement() {
    // Créer un element HTML type video
    const videoElement = document.createElement("video")
    videoElement.classList.add("lightbox__video")
    videoElement.src = this.src
    videoElement.controls = true
    videoElement.autoplay = true
    videoElement.muted = true
    videoElement.loop = true
    return videoElement
  }

  // Récupère le template d'un média
  getVideoMediaTemplate(templateId) {
    // Clonage du template
    const mediaCardTemplate = document.getElementById(templateId)
    const mediaCard = mediaCardTemplate.content.cloneNode(true)

    // Rendu des données
    mediaCard.querySelector(".media-card").id = `media-${this.id}`
    mediaCard.querySelector(".media-card__title").textContent = this.title
    mediaCard.querySelector(".media-card__likes .count").textContent = this.likes
    mediaCard.querySelector(".media-card__video").src = `${this.src}`
    mediaCard.querySelector(".media-card__link").setAttribute("href", `${this.src}`)
    // Set source src
    mediaCard.querySelector(".media-card__video source").src = `${this.src}`

    // check if video is loaded
    const video = mediaCard.querySelector(".media-card__video")
    video.addEventListener("loadeddata", () => {
      video.classList.add("loaded")
    })

    return mediaCard
  }
}
