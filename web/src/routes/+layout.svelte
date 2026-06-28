<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import {
		Sidebar,
		SidebarContent,
		SidebarGroup,
		SidebarHeader,
		SidebarInset,
		SidebarMenu,
		SidebarMenuButton,
		SidebarMenuItem,
		SidebarProvider,
		SidebarRail
	} from '$lib/components/ui/sidebar';

	let { children } = $props();

	const navItems = [
		{ href: '/', label: 'ホーム' },
		{ href: '/holidays', label: '祝日' }
	];

	const isActive = (href: string) =>
		href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<SidebarProvider>
	<Sidebar collapsible="offcanvas">
		<SidebarRail />
		<SidebarHeader>
			<a href="/" class="p-4 text-xl font-semibold">Calendar</a>
		</SidebarHeader>
		<SidebarContent>
			<SidebarGroup>
				<SidebarMenu>
					{#each navItems as item (item.href)}
						<SidebarMenuItem>
							<SidebarMenuButton isActive={isActive(item.href)}>
								{#snippet child({ props })}
									<a href={item.href} {...props}>{item.label}</a>
								{/snippet}
							</SidebarMenuButton>
						</SidebarMenuItem>
					{/each}
				</SidebarMenu>
			</SidebarGroup>
		</SidebarContent>
	</Sidebar>
	<SidebarInset>
		{@render children()}
	</SidebarInset>
</SidebarProvider>
