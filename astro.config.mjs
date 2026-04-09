// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';


// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Open Outbox',
			customCss: ['./src/styles/custom.css'],
			social: [{ icon: 'github', label: 'GitHub', href: 'https://open-outbox.github.io' }],
			sidebar: [
				{ label: 'Home', link: '/' },
  				{ label: 'Benchmarks', link: '/benchmarks/' },
				{
					label: 'Specification',
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
