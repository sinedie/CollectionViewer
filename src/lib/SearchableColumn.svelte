<script lang="ts">
	import { SidebarItem, SidebarGroup, Search } from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';
	import Column from '$lib/Column.svelte';

	interface Item {
		name?: string;
		status?: string;
	}

	const dispatch = createEventDispatcher();

	export let searchPlaceholder = 'Search';
	export let items: Item[];
	export let selected: Item | null;

	let search = '';
	let filteredItems: Item[] = [];

	$: {
		if (search !== '') {
			filteredItems = items.filter((item) =>
				item.name?.toLowerCase().includes(search.toLowerCase())
			);
		} else {
			filteredItems = items;
		}
	}
</script>

<SidebarGroup>
	<Search class="mb-5" size="md" bind:value={search} placeholder={searchPlaceholder} />
	<Column>
		{#each filteredItems as item}
			<div on:contextmenu|preventDefault={(e) => console.log(e)}>
				<SidebarItem
					label={item.name}
					active={item.name === selected?.name}
					on:click={() => dispatch('itemclick', item)}
				>
					<div slot="icon">
						{#if item.status === 'done'}
							<span class="pr-5 ml-3 bg-blue-200 dark:bg-blue-500" />
						{:else if item.status}
							<span class="pr-5 ml-3 bg-red-200 dark:bg-red-500" />
						{/if}
					</div>
				</SidebarItem>
			</div>
		{/each}
	</Column>
</SidebarGroup>
