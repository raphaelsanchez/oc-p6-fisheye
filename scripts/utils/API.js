// Create api to get data from json file
export class API {
  constructor() {
    this._data = null
  }

  async fetchData() {
    const response = await fetch("data/photographers.json")

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  }
}

// Parse le JSON en toute sécurité
function safeJSONParse(str, fallbackValue) {
  try {
    return JSON.parse(str)
  } catch (error) {
    return fallbackValue
  }
}

// Fetch data from API or cache
export async function getData() {
  const cacheKey = "photographersData"
  const cacheDuration = 60 * 60 * 1000 // 1 hour in milliseconds

  // on retrouve les données "cachées"
  const cachedData = safeJSONParse(localStorage.getItem(cacheKey), null)

  // TODO: replace timestamp by etag
  if (cachedData) {
    const { data, timestamp } = cachedData
    if (Date.now() - timestamp < cacheDuration) {
      console.log("Serving from cache")
      return data
    }
  }

  try {
    const api = new API()
    const data = await api.fetchData()

    // mise à jour du cache
    const cacheData = { data, timestamp: Date.now() }
    localStorage.setItem(cacheKey, JSON.stringify(cacheData))
    return data
  } catch (error) {
    console.error(error)
    throw error
  }
}
