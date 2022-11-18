import {BASE_API_URL} from '../config.js'

export async function fetchSearchResult(query, signal) {
	const result = await	window.fetch(`${BASE_API_URL}/search?q=${query}`, signal)
	return await result.json()
}