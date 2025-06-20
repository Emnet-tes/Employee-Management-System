import { client } from "@/lib/sanity/client";
import imageUrlBuilder from '@sanity/image-url';

export function buildImageUrl(imageAsset: string | { _type: string; asset: { _ref: string } }) {
    const builder = imageUrlBuilder(client);
    return builder.image(imageAsset).url();
}