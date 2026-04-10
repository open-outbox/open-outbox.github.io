// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';


// https://astro.build/config
export default defineConfig({
	site: 'https://open-outbox.github.io', 
  	base: '/',
	integrations: [
		starlight({
			title: 'Open Outbox',
			customCss: ['./src/styles/custom.css'],
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/open-outbox/relay' }],
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
