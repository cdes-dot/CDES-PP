import { MeiliSearch } from 'meilisearch'

const client = new MeiliSearch({
  host: import.meta.env.PUBLIC_MEILI_HOST || "http://127.0.0.1:7700",
  apiKey: import.meta.env.PUBLIC_MEILI_API_KEY,
})

export default client
