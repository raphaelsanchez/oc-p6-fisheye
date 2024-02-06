/**
 * Opens a modal dialog.
 * @param {HTMLElement} button - The button that triggers the modal.
 * @param {Object} photographer - The photographer object.
 */
export function showModal(button, photographer) {
  const modal = document.querySelector(button.dataset.target)
  addPhotographerNameToModal(photographer)
  modal.showModal()
}

/**
 * Closes a modal dialog.
 * @param {HTMLElement} button - The button that closes the modal.
 */
export function closeModal(button) {
  const modal = button.closest("dialog")
  modal.close()
}

/**
 * Adds a photographer's name to the modal dialog.
 * @param {Object} photographer - The photographer object.
 */
export function addPhotographerNameToModal(photographer) {
  const photographerNameElement = document.querySelector(".photographer-contact__name")
  photographerNameElement.textContent = photographer.name
}
