import { adjectives, animals, uniqueNamesGenerator } from "unique-names-generator"

export function generateSlug() {
    const slug = uniqueNamesGenerator({
        dictionaries: [adjectives, animals],
        separator: "-",
        length: 2,
    })

    return slug
}