<script lang="ts">
	import '@fontsource-variable/inter'
	import '@fontsource-variable/stix-two-text'
	import '@fontsource-variable/material-symbols-rounded'
	import '../app.css'

	import { Toaster } from 'svelte-sonner'

	let { children } = $props()
</script>

{@render children()}

<Toaster position="top-center" />
