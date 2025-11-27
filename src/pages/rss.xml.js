import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

import { CONFIG } from "@config";

const createSanitizer = (base) => (url) => {
    const combined = `${base}/${url}`;
    
    // Regex fies double // without affecting protocol
    return combined.replaceAll(/(?<!:)\/+/gm, '/');
};

const site = import.meta.env.SITE;

const sanitizeUrl = createSanitizer(site);

export async function GET(context) {
    const blog = await getCollection('posts');
    return rss({
        // `<title>` field in output xml
        title: CONFIG.TITLE,
        // `<description>` field in output xml
        description: CONFIG.DESCRIPTION,
        // Pull in your project "site" from the endpoint context
        // https://docs.astro.build/en/reference/api-reference/#site
        site: sanitizeUrl(import.meta.env.BASE_URL),
        // Array of `<item>`s in output xml
        // See "Generating items" section for examples using content collections and glob imports
        items: blog.map((post) => ({
            title: post.data.title,
            pubDate: post.data.pubDate,
            description: post.data.description,
            // Compute RSS link from post `id`
            // This example assumes all posts are rendered as `/blog/[id]` routes
            link: `${post.slug}/`,
          })),
        // (optional) inject custom xml
        customData: `<language>${CONFIG.LANG}</language>`,
    });
}