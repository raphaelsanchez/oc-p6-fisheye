/**
 * Class representing an API to fetch data from a JSON file.
 */
export class API {
  /**
   * Create an API.
   */
  constructor() {
    this._data = null
  }

  /**
   * Fetch data from the JSON file.
   * @return {Promise<Object>} The data from the JSON file.
   * @throws {Error} When there is an HTTP error.
   */
  async fetchData() {
    const response = await fetch("data/photographers.json")

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  }
}

/**
 * Safely parse a JSON string.
 * @param {string} str - The JSON string to parse.
 * @param {*} fallbackValue - The value to return if parsing fails.
 */
function safeJSONParse(str, fallbackValue) {
  try {
    return JSON.parse(str)
  } catch (error) {
    return fallbackValue
  }
}

/**
 * Fetch data from API or cache.
 * If the data is in the cache and is less than 1 hour old, it will be returned from the cache.
 * Otherwise, the data will be fetched from the API and the cache will be updated.
 * @return {Promise<Object>} The data from the API or cache.
 * @throws {Error} When there is an HTTP error.
 */
export async function getData() {
  const cacheKey = "photographersData"
  const cacheDuration = 60 * 60 * 1000 // 1 hour

  // Try to get the data from the cache
  const cachedData = safeJSONParse(localStorage.getItem(cacheKey), null)

  if (cachedData) {
    const { data, timestamp } = cachedData
    // Check if the cached data is less than 1 hour old
    if (Date.now() - timestamp < cacheDuration) {
      console.log("Serving from cache")
      return data
    }
  }

  try {
    // Fetch the data from the API
    const api = new API()
    const data = await api.fetchData()

    // Update the cache with the new data
    const cacheData = { data, timestamp: Date.now() }
    localStorage.setItem(cacheKey, JSON.stringify(cacheData))
    return data
  } catch (error) {
    console.error(error)
    throw error
  }
}
