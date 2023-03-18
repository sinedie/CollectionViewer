<script lang="ts">
	import { Sidebar } from 'flowbite-svelte';

	const style = 'height: 78vh; overflow-y: auto; overflow-x: hidden; padding-right: 2px';
</script>

<Sidebar {style}>
	<slot />
</Sidebar>
