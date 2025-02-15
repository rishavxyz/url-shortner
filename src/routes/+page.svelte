<script lang="ts">
	import { toast } from 'svelte-sonner'
	import type { PageProps } from './$types'
	import { enhance } from '$app/forms'

	let { form }: PageProps = $props()

	$effect(() => {
		if (form?.error) {
			toast.error(form.error.title, {
				description: form.error.message,
			})
		}

		if (form?.url) {
			const ls = localStorage
			const name = 'generated-links'
			const toStr = JSON.stringify
			const fromStr = JSON.parse

			const linkStore = ls.getItem(name)

			if (!linkStore) {
				ls.setItem(name, toStr([form.url.shorten]))
			} else {
				const links = fromStr(linkStore)
				ls.setItem(name, toStr([...links, form.url.shorten]))
			}
		}
	})
</script>

<main class="mx-auto h-screen w-md px-4 py-8">
	<form method="post" class="grid gap-3" use:enhance>
		<label for="input" class="grid gap-1">
			<span class="text-sm text-gray-800">Paste your URL here</span>
			<fieldset class="flex items-center gap-2">
				<!-- svelte-ignore a11y_autofocus -->
				<input
					type="url"
					name="input"
					id="input"
					placeholder="http://youtu.be/czkpky"
					class="flex-1 rounded border border-gray-200 px-4 py-2 transition-colors focus:border-amber-500 focus:outline-0"
					autofocus
				/>
				<input type="text" name="pott" hidden />
				<button class="w-max cursor-pointer rounded-md border border-gray-200 px-3 py-1">
					<span class="font-icon text-md">Link</span>
				</button>
			</fieldset>
		</label>
	</form>

	{#if form?.url}
		<section class="mt-5 space-y-5">
			<h2 class="font-serif text-xl font-bold">Your short url have gen created</h2>
			<input
				readonly
				type="text"
				value={form.url.shorten}
				class="w-full focus:outline-0"
				onclick={(e) => {
					const { value } = e.target as HTMLInputElement
					if ('clipboard' in navigator) {
						navigator.clipboard
							.writeText(value)
							.then(() => toast.success('Copied to clipboard'))
							.catch(() =>
								toast.error('Could not copy URL', {
									description: 'You may manually click and copy the URL',
								}),
							)
					}
				}}
			/>
		</section>
	{/if}
</main>
