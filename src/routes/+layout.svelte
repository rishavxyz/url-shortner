<script lang="ts">
	import '../app.css';
	import '@fontsource-variable/bitter'
	import '@fontsource-variable/inter'
	import '@fontsource/material-symbols-rounded'
	import { Toaster } from 'svelte-sonner';

	let { children } = $props();
</script>

{@render children()}

<Toaster />