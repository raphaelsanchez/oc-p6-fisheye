// Fonction pour ouvrir la modal
// Function to open modal
export function showModal(button, photographer) {
  const modal = document.querySelector(button.dataset.target)
  addPhotographerNameToModal(photographer)
  modal.showModal()
}

// Function to close modal
export function closeModal(button) {
  const modal = button.closest("dialog")
  modal.close()
}

// Function to add photographer name to modal
export function addPhotographerNameToModal(photographer) {
  const photographerNameElement = document.querySelector(".photographer-contact__name")
  photographerNameElement.textContent = photographer.name
}
