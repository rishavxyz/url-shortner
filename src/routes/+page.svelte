<script lang="ts">
	import { enhance } from '$app/forms'
	import { page } from '$app/state'
	import { toast } from 'svelte-sonner'
	import { cubicOut } from 'svelte/easing'
	import { fly, slide } from 'svelte/transition'

	let input: HTMLInputElement | null
	let value = $state('')
	let shouldHidePasteBtn = $state(false)
	let shouldShowCustomInput = $state(false)
	let url = $state(page.url.href)
	let trimHref = $state(false)

	let { form } = $props()

	$effect(() => {
		if (input) {
			// we do this to get rid of the `autofocus` warning
			input.focus()
		}
	})

	$effect(() => {
		if (form?.error) {
			toast.error(form.error.title, {
				description: form.error.message,
				duration: form.error.message ? 7e3 : 4e3,
				action: {
					label: 'Okay',
					onClick: () => (form.error.message = ''),
				},
			})
		}
	})

	function copyToClipboard(e: any) {
		if (!('clipboard' in navigator)) return
		navigator.clipboard.writeText(e.currentTarget.value).then(() => {
			toast.success('Copied to clipboard')
		})
	}

	function pasteFromClipboard() {
		if (!('clipboard' in navigator)) return
		navigator.clipboard
			.readText()
			.then((text: string) => {
				value = text
				toast.success('Pasted from clipboard')
			})
			.catch(() => toast.error("Can't access clipboard"))
		shouldHidePasteBtn = true
	}
</script>

<main class="space-y-fsm mx-auto max-w-2xl p-5 lg:p-0">
	<h1 class="heading h1">URL Shortener</h1>

	<form method="post" class="space-y-fsm" use:enhance>
		<fieldset class="fieldset w-full gap-0">
			<legend class="fieldset-legend text-fbase">Paste your URL here</legend>
			<input
				type="url"
				class="text-input"
				name="input"
				placeholder="https://example.com/anything"
				bind:this={input}
				bind:value
				onfocus={(e) => e.currentTarget.setSelectionRange(0, -1)}
				onkeyup={() => (shouldHidePasteBtn = false)}
			/>
			{#if !shouldHidePasteBtn}
				<div transition:slide>
					<button
						onclick={pasteFromClipboard}
						class="btn btn-soft mt-f2xs btn-sm rounded-full"
						type="button">Paste from clipboard</button
					>
				</div>
			{/if}
		</fieldset>

		<!-- *FIX: shouldShowCustomInput -->
		{#if shouldShowCustomInput}
			<fieldset class="fieldset w-full gap-0">
				<legend class="fieldset-legend text-fbase">Customize your own URL</legend>

				<label class="text-input">
					<button
						class="text-neutral dark:text-neutral-content/80 cursor-pointer transition-all"
						type="button"
						title="hide this domain"
						onclick={(e) => {
							e.preventDefault()
							e.stopPropagation()
							trimHref = !trimHref
						}}
					>
						{#if trimHref}
							<span>.../</span>
						{:else}
							<span>
								{url.substring(url.indexOf('/') + 2)}
							</span>
						{/if}
					</button>
					<input
						required
						type="text"
						name="custom-url"
						class="py-fsm/md -ms-2 grow transition-all"
						placeholder="my/custom/url?q=awesome"
					/>
				</label>
			</fieldset>
		{/if}

		<input type="text" name="name" autocomplete="given-name" class="sr-only" />

		<div class="gap-fsm flex flex-col">
			<button class="btn btn-secondary md:mx-auto">
				{#if shouldShowCustomInput}
					Submit this link
				{:else}
					Create Link
				{/if}
			</button>
			{#if shouldShowCustomInput}
				<div in:slide out:slide={{ delay: 150 }}>
					<button
						class="btn btn-dash"
						type="button"
						onclick={() => {
							shouldShowCustomInput = false
						}}>Cancel</button
					>
				</div>
			{/if}
		</div>
	</form>

	<!-- *FIX: (!shouldShowCustomInput && value.length > 2) || form?.url -->
	{#if !shouldShowCustomInput && value.length > 2}
		<div in:fly={{ y: 20 }}>
			<button
				class="btn btn-warning transform-gpu will-change-transform"
				onclick={() => (shouldShowCustomInput = true)}>Want to create custom URL?</button
			>
		</div>
		<section
			class="gap-fsm grid transform-gpu will-change-transform"
			in:fly={{ y: 20, delay: 132, easing: cubicOut }}
		>
			<hgroup>
				<h2 class="heading h3">Create your own custom URL</h2>
				<h6 class="text-balance">
					You can also create a custom URL however you like of the original. You can add custom
					params and query params. Go crazy!
				</h6>
			</hgroup>
		</section>
	{/if}

	{#if form?.url}
		<section class="mt-fmd/lg gap-fsm grid" in:slide>
			<h2 class="heading h2">Your shortened URL</h2>
			<fieldset>
				<input
					type="text"
					class="text-input"
					readonly
					value={form.url.shorten}
					onclick={copyToClipboard}
				/>
				<span class="text-fxs opacity-80">Click the URL to copy</span>
			</fieldset>
		</section>
	{/if}
</main>
