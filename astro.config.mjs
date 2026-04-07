// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Open Outbox',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://open-outbox.github.io' }],
			sidebar: [
				{
					label: 'The Specification',
					autogenerate: { directory: 'spec' },
				},
				{
					label: 'Reference Implementation',
					autogenerate: { directory: 'relay' },
				},
			],
		}),
	],
});
