/** Fixed option lists, shared by the schema, the site and /admin. Kept free of zod so it can ship to the browser. */
export const categories = ['AI/ML', 'Full-stack', 'Data analytics', 'Computer vision'] as const;
export const motifs = ['grid', 'wave', 'orbit', 'route', 'nodes'] as const;
export const certGroups = ['AI & data', 'Software engineering', 'Cloud', 'Security', 'Internship'] as const;
