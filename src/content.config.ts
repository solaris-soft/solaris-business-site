// 1. Import utilities from `astro:content`
import { defineCollection, z } from 'astro:content';

// 2. Import loader(s)
import { file } from 'astro/loaders';

// 3. Define your collection(s)
const team = defineCollection({ 
    loader: file("src/content/team.json"),
    schema: ({image}) => z.object({
        name: z.string(),
        role: z.string(),
        image: image(),
        bio: z.string(),
        github: z.string().optional(),
        linkedin: z.string().optional(),
        twitter: z.string().optional(),
    }),
 });

const projects = defineCollection({ 
    loader: file("src/content/projects.json"),
    schema: ({image}) => z.object({
        title: z.string(),
        description: z.string(),
        link: z.string(),
        image: image().optional(),
    }),
 });

const services = defineCollection({ 
    loader: file("src/content/services.json"),
    schema:  z.object({
        title: z.string(),
        description: z.string(),
        features: z.array(z.string()),
        "long-description": z.string(),
    }),
 });

// 4. Export a single `collections` object to register your collection(s)
export const collections = { team, projects, services };
