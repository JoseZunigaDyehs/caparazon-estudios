import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const casos = defineCollection({
  loader: glob({
    base: "./src/content/casos",
    pattern: "**/*.md",
  }),
  schema: ({ image }) =>
    z.object({
      slug: z.string().optional(),
      title: z.string(),
      subtitle: z.string(),
      description: z.string(),
      image: z.string().optional(),
      category: z.string(),
      summary: z.string(),
      order: z.number().optional().default(99),
      status: z.string(),
      meta: z.array(
        z.object({
          label: z.string(),
          value: z.string(),
          highlight: z.boolean().optional().default(false),
        }),
      ),
      problem: z.object({
        title: z.string().default("El Desafío Operativo"),
        body: z.string(),
      }),
      solution: z.object({
        title: z.string().default("La Solución Caparazón"),
        body: z.string(),
      }),
      visual: z.object({
        title: z.string(),
        heading: z.string(),
        body: z.string(),
        items: z.array(
          z.object({
            label: z.string(),
            value: z.string(),
            col: z.enum(["left", "right"]).optional(),
            highlight: z.boolean().optional().default(false),
          }),
        ).max(4),
        features: z.array(z.string()).max(4),
        image: image().optional(),
        imageAlt: z.string().optional(),
        imageDevice: z.enum(["desktop", "mobile"]).optional().default("mobile"),
      }),
      metrics: z.array(
        z.object({
          label: z.string(),
          value: z.string(),
          desc: z.string(),
          highlight: z.boolean().optional().default(false),
        }),
      ).max(3),
      screenshots: z
        .array(
          z.object({
            src: image(),
            alt: z.string(),
            device: z.enum(["desktop", "mobile"]).optional().default("desktop"),
            caption: z.string().optional(),
          }),
        )
        .max(3)
        .optional(),
    }),
});

export const collections = { casos };
