import { CUSTOM_LINKS, LINKS } from '$lib/store'
import { redirect } from '@sveltejs/kit'

export const load = ({ url }) => {
	const searchUrl = url.toString()

	let customUrl = LINKS.get(searchUrl)

	if (customUrl) {
		return redirect(303, customUrl)
	}

	const links_iter = Array.from(CUSTOM_LINKS.values())
	const h = links_iter.find((s) => s.startsWith(searchUrl))

	if (h) {
		return redirect(303, h.split('\\')[1])
	}

	return {
		url: searchUrl,
	}
}
