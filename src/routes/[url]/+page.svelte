<script lang="ts">
	import type { PageProps } from './$types'

	let { data }: PageProps = $props()
</script>

<svelte:head>
	<title>Just a URL bruh</title>
</svelte:head>

{#if data.url}
	<p>This URL is already expired</p>
{/if}
