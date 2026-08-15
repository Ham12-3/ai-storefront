// Dataset Embeddings projection: deliberately excludes price, stock, IDs, timestamps,
// Stripe data, analytics, customer data, and internal notes.
export const productEmbeddingProjection = `{
  "title": title,
  "shortDescription": shortDescription,
  "description": pt::text(description),
  "brandName": brandName,
  "features": features,
  "productFacts": productFacts,
  "materials": materials,
  "careInstructions": careInstructions,
  "useCases": useCases,
  "tags": tags,
  "searchKeywords": searchKeywords,
  "deliveryInformation": deliveryInformation
}`

export const embeddableDocumentFilter = `_type in ["product", "faq", "policy", "knowledgeArticle"] &&
  active != false &&
  coalesce(aiSearchEnabled, true) == true &&
  coalesce(internalOnly, false) == false`
