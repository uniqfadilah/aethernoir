import type { StructureResolver } from "sanity/structure";

const SINGLETON_TYPES = new Set(["siteSettings", "home", "about"]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site settings")
        .id("siteSettings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings"),
        ),
      S.listItem()
        .title("Home")
        .id("home")
        .child(S.document().schemaType("home").documentId("home")),
      S.listItem()
        .title("About")
        .id("about")
        .child(S.document().schemaType("about").documentId("about")),
      S.divider(),
      S.documentTypeListItem("artwork").title("Artworks"),
      S.documentTypeListItem("tag").title("Tags"),
    ]);

export const isSingletonType = (type: string) => SINGLETON_TYPES.has(type);
