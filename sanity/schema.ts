import type { SchemaTypeDefinition } from "sanity";
import { siteSettings } from "./schemas/siteSettings";
import { home } from "./schemas/home";
import { about } from "./schemas/about";
import { artwork } from "./schemas/artwork";
import { tag } from "./schemas/tag";
import { seoObject } from "./schemas/objects/seo";
import { portableText } from "./schemas/objects/portableText";

export const schemaTypes: SchemaTypeDefinition[] = [
  siteSettings,
  home,
  about,
  artwork,
  tag,
  seoObject,
  portableText,
];
