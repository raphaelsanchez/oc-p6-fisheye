"use strict"

import { Medias } from "./medias.js"

/**
 * Class representing a lightbox.
 */
export class Lightbox {
  /**
   * Create a lightbox.
   * @param {Array} mediaArray - The array of media items.
   */
  constructor(mediaArray) {
    this.mediaArray = mediaArray
    this.currentIndex = 0
    this.lightboxElement = document.querySelector(".lightbox")
    this.contentElement = document.querySelector(".lightbox__content")
  }

  /**
   * Open the lightbox at a specific index.
   * @param {number} index - The index to open the lightbox at.
   */
  open(index) {
    this.currentIndex = index
    this.updateDisplay()
    this.lightboxElement.showModal()
    document.body.classList.add("prevent-scroll")
  }

  /**
   * Close the lightbox.
   */
  close() {
    this.lightboxElement.close()
    document.body.classList.remove("prevent-scroll")
  }

  /**
   * Go to the next item in the lightbox.
   */
  next() {
    this.currentIndex = (this.currentIndex + 1) % this.mediaArray.length
    this.updateDisplay()
  }

  /**
   * Go to the previous item in the lightbox.
   */
  previous() {
    this.currentIndex = (this.currentIndex - 1 + this.mediaArray.length) % this.mediaArray.length
    this.updateDisplay()
  }

  /**
   * Update the display of the lightbox.
   */
  updateDisplay() {
    this.contentElement.innerHTML = ""
    const currentMedia = this.mediaArray[this.currentIndex]
    const mediaElements = new Medias().createMedia(currentMedia, this.mediaArray)
    const mediaElement =
      mediaElements.type === "image" ? mediaElements.getImageMediaElement() : mediaElements.getVideoMediaElement()
    const mediaTitle = document.createElement("h2")
    mediaTitle.classList.add("lightbox__title")
    mediaTitle.textContent = currentMedia.title
    mediaElement.setAttribute("tabindex", "0")
    mediaTitle.setAttribute("tabindex", "0")
    this.contentElement.appendChild(mediaElement)
    this.contentElement.appendChild(mediaTitle)
  }
}
