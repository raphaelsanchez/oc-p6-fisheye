/**
 * Class representing a like button.
 */
export class Likes {
  /**
   * Create a like button.
   * @param {HTMLElement} button - The like button element.
   * @param {HTMLElement} totalLikesCounter - The total likes counter element.
   */
  constructor(button, totalLikesCounter) {
    this.button = button
    this.count = button.querySelector(".count")
    this.value = parseInt(this.count.innerText)
    this.liked = button.classList.contains("liked")
    this.totalLikesCounter = totalLikesCounter
  }

  /**
   * Add a click event handler to the like button.
   * The handler toggles the like status.
   */
  addLikeHandler() {
    this.button.addEventListener("click", () => {
      if (this.liked) {
        this.unlike()
      } else {
        this.like()
      }
    })
  }

  /**
   * Like the item.
   */
  like() {
    this.liked = true
    this.button.classList.add("liked")
    this.value++
    this.count.innerText = `${this.value}`
    this.totalLikesCounter.innerText = parseInt(this.totalLikesCounter.innerText) + 1
  }

  /**
   * Unlike the item.
   */
  unlike() {
    this.liked = false
    this.button.classList.remove("liked")
    this.value--
    this.count.innerText = `${this.value}`
    this.totalLikesCounter.innerText = parseInt(this.totalLikesCounter.innerText) - 1
  }
}
