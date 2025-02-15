import { LINKS } from '$lib/store'
import { error, fail } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions = {
	default: async ({ request, url }) => {
		const formdata = await request.formData()
		const input = formdata.get('input') as string
		const honeyPot = formdata.get('pott') as string

		if (honeyPot) {
			return error(400, {
				message: 'Bot detected',
			})
		}

		if (input.length < 1 || input.trim().length < 1) {
			return fail(400, {
				error: {
					title: 'Empty input given',
					message: 'Please provide a valid URL',
				},
			})
		}

		const links_iter = Array.from(LINKS.values())

		if (links_iter.find((link) => link == input)) {
			return fail(400, {
				error: {
					title: 'URL already been used',
					message: 'Sorry this URL has already been used',
				},
			})
		}

		const sh = createShortUrl(input)

		LINKS.set(sh, input)

		return {
			url: {
				orginal: input,
				shorten: url.href + sh,
			},
		}
	},
} satisfies Actions

function createShortUrl(input: string) {
	const uuid = crypto.randomUUID()
	return uuid.substring(uuid.lastIndexOf('-') + 1)
}
