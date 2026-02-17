// 1. Import utilities from `astro:content`
import { defineCollection, z } from "astro:content";

// 2. Import loader(s)
import { file } from "astro/loaders";

// 3. Define your collection(s)
const team = defineCollection({
  loader: file("src/content/team.json"),
  schema: ({ image }) =>
    z.object({
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
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      link: z.string(),
      image: image().optional(),
    }),
});

const services = defineCollection({
  loader: file("src/content/services.json"),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    features: z.array(z.string()),
    "long-description": z.string(),
  }),
});

const testimonials = defineCollection({
  loader: file("src/content/testimonials.json"),
  schema: ({ image }) =>
    z.object({
      quote: z.string(),
      author: z.string(),
      company: z.string(),
      link: z.string(),
      image: image(),
    }),
});

const articles = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string().optional(),
      description: z.string(),
      author: z.enum(["Sam", "Josh"]),
      publishDate: z.coerce.date(),
      draft: z.boolean().default(false),
      coverImage: image().optional(),
      tags: z.array(z.string()).optional(),
      body: z.string().optional(),
    }),
});

const caseStudies = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string().optional(),
      description: z.string(),
      client: z.string(),
      problem: z.string(),
      solution: z.string(),
      outcome: z.string(),
      publishDate: z.coerce.date().optional(),
      draft: z.boolean().default(false),
      heroImage: image().optional(),
      tags: z.array(z.string()).optional(),
      body: z.string().optional(),
    }),
});

const servicePages = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    summary: z.string().optional(),
    order: z.number().optional(),
    draft: z.boolean().default(false),
  }),
});

// 4. Export a single `collections` object to register your collection(s)
export const collections = {
  team,
  projects,
  services,
  testimonials,
  articles,
  caseStudies,
  servicePages,
};
