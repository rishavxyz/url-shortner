import { redirect } from '@sveltejs/kit'
import { LINKS } from '$lib/store'

export const load = async ({ params }) => {
	const { url } = params

	const link = LINKS.get(url)
	if (link) {
		return redirect(303, link)
	}

	return { url }
}
