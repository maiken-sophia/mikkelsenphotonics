import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const research = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/research' }),
  schema: z.object({
    title: z.string(),
    question: z.string(),
    order: z.number(),
    image: z.string(),
    imageAlt: z.string(),
    imageCredit: z.string().optional(),
    summary: z.string(),           // front-page blurb (2 sentences)
    keyPapers: z.array(z.string()).default([]),   // BibTeX keys
  }),
});

const discoveries = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/discoveries' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    citation: z.string(),
    doi: z.string().optional(),
    url: z.string().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    tile: z.string().optional(),   // text shown when there is no image yet
  }),
});

const people = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/people' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    order: z.number(),
    photo: z.string().optional(),          // used on the front page
    photoPage: z.string().optional(),      // used on the People page (falls back to photo)
    email: z.string().optional(),
    links: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
    leader: z.boolean().default(false),
    shortBio: z.array(z.string()).optional(),   // paragraphs shown on the front page
  }),
});

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    url: z.string().optional(),
  }),
});

export const collections = { research, discoveries, people, news };
