export class Likes {
  constructor(button, totalLikesCounter) {
    this.button = button
    this.count = button.querySelector(".count")
    this.value = parseInt(this.count.innerText)
    this.liked = button.classList.contains("liked")
    this.totalLikesCounter = totalLikesCounter
  }

  addLikeHandler() {
    this.button.addEventListener("click", () => {
      if (this.liked) {
        this.unlike()
      } else {
        this.like()
      }
    })
  }

  like() {
    this.liked = true
    this.button.classList.add("liked")
    this.value++
    this.count.innerText = `${this.value}`
    this.totalLikesCounter.innerText = parseInt(this.totalLikesCounter.innerText) + 1
  }

  unlike() {
    this.liked = false
    this.button.classList.remove("liked")
    this.value--
    this.count.innerText = `${this.value}`
    this.totalLikesCounter.innerText = parseInt(this.totalLikesCounter.innerText) - 1
  }
}
