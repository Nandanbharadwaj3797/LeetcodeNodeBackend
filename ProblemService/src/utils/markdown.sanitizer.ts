import { marked } from "marked";
import logger from "../config/logger.config";
import sanitizeHtml from "sanitize-html";

export async function sanitizeMarkdown(markdown: string): Promise<string> {

    if (!markdown || typeof markdown !== "string") {
        return "";
    }

    try {
        // Convert Markdown → HTML
        const html = await marked.parse(markdown);

        // Sanitize HTML (secure)
        const sanitizedHtml = sanitizeHtml(html, {
            allowedTags: [
                ...sanitizeHtml.defaults.allowedTags,
                "img",
                "pre",
                "code"
            ],
            allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes,
                img: ["src", "alt", "title"],
                code: ["class"],
                pre: ["class"],
                a: ["href", "target", "rel"]
            },
            allowedSchemes: ["http", "https", "mailto"],

            transformTags: {
                "a": (tagName, attribs) => {
                    return {
                        tagName,
                        attribs: {
                            ...attribs,
                            target: "_blank",
                            rel: "noopener noreferrer"
                        }
                    };
                }
            }
        });

        return sanitizedHtml;

    } catch (error) {
        logger.error("Error sanitizing markdown", error);
        return "";
    }
}