import { createHash } from 'node:crypto'
import { error, fail } from '@sveltejs/kit'
import { CUSTOM_LINKS, LINKS } from '$lib/store/index.js'

export const actions = {
	default: async ({ request, url: { href } }) => {
		const formdata = await request.formData()
		const input = formdata.get('input') as string
		const customInput = formdata.get('custom-url') as string
		const potty = formdata.get('name') as string

		if (potty) {
			return error(400)
		}

		if (!input) {
			return fail(400, {
				error: {
					title: 'Input is empty',
					message: undefined,
				},
			})
		}

		const [url, isValid] = checkUrl(input)

		if (!isValid) {
			return fail(400, {
				error: {
					title: 'Not a valid URL',
					message: 'We need a proper URL to work. Something like myurl.com/something.',
				},
			})
		}

		if (customInput) {
			const [url, isValid] = checkUrl(href + customInput)

			if (!isValid) {
				return fail(400, {
					error: {
						title: 'Custom URL is not a valid URL',
						message:
							'The URL you have given is not a proper URL. Make sure to submit a proper URL.',
					},
				})
			}

			CUSTOM_LINKS.add(url + '\\' + input)

			return {
				url: {
					original: input,
					shorten: url,
				},
			}
		}

		if (LINKS.has(input)) {
			return {
				url: {
					original: input,
					shorten: LINKS.get(input),
				},
			}
		}

		const domain = url.split('?')[0]
		const hash = createHash('md5').update(domain).digest('hex')
		const shortenUrl = hash.substring(hash.length - fromRand(6, 12))

		LINKS.set(href + shortenUrl, input)

		return {
			url: {
				original: input,
				shorten: href + shortenUrl,
			},
		}
	},
}

function checkUrl(s: string): [string, boolean] {
	try {
		return [new URL(s).toString(), true]
	} catch (_) {
		return ['', false]
	}
}

function fromRand(min: number, max: number): number {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1)) + min
}
