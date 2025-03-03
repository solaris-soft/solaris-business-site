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

// 4. Export a single `collections` object to register your collection(s)
export const collections = { team };
