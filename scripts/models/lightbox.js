import { Medias } from "./medias.js"

export class Lightbox {
  constructor(mediaArray) {
    this.mediaArray = mediaArray
    this.currentIndex = 0
    this.lightboxElement = document.querySelector(".lightbox")
    this.contentElement = document.querySelector(".lightbox__content")
  }

  open(index) {
    this.currentIndex = index
    this.updateDisplay()
    // Open the lightbox <dialog>
    this.lightboxElement.showModal()
    // prevent scrolling
    document.body.style.overflow = "hidden"
  }

  close() {
    this.lightboxElement.close()
    // remove body style
    document.body.removeAttribute("style")
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.mediaArray.length
    this.updateDisplay()
  }

  previous() {
    this.currentIndex = (this.currentIndex - 1 + this.mediaArray.length) % this.mediaArray.length
    this.updateDisplay()
  }

  updateDisplay() {
    // Supprimer le contenu précédent
    this.contentElement.innerHTML = ""

    // Obtenir le média actuel
    const currentMedia = this.mediaArray[this.currentIndex]

    // Créer le média
    const mediaElements = new Medias().createMedia(currentMedia, this.mediaArray)

    // Créer un élément HTML en fonction du type de media sans utiliser de template
    const mediaElement =
      mediaElements.type === "image" ? mediaElements.getImageMediaElement() : mediaElements.getVideoMediaElement()

    // Créer un élément HTML pour le titre du média
    const mediaTitle = document.createElement("h2")
    mediaTitle.classList.add("lightbox__title")
    mediaTitle.textContent = currentMedia.title

    // Ajouter le média à la lightbox
    this.contentElement.appendChild(mediaElement)
    this.contentElement.appendChild(mediaTitle)
  }
}
