import { useState } from "react";
import "./ScholarSearch.css";
import ScholarSearchFilter from "./ScholarSearchFilter";
import pdfIcon from "../../assets/pdf-icon.png";
import { usePubMedSearch } from "../../hooks/usePubMedSearch";

export default function ScholarSearch() {
  const [queryInput, setQueryInput] = useState("");
  const [query, setQuery] = useState("");

  const { data, isLoading, isError } = usePubMedSearch(query);

  const [filters, setFilters] = useState({
    textAvailability: "all",
    articleTypes: [],
    pubDate: "any",
    customFrom: "",
    customTo: "",
    species: "all",
    language: "",
    sortBy: "relevance",
  });

  // ---------------------------------------------
  // FORMAT PUBMED DATA INTO YOUR TEMPLATE FORMAT
  // ---------------------------------------------
  const formattedResults = (data || []).map((art) => {
    const authors = art.authors?.map((a) => a.name).join(", ") || "Unknown";
    const pmcidObj = art.articleids?.find((i) => i.idtype === "pmcid");
    if(pmcidObj)
    {
        pmcidObj.value = pmcidObj.value.replace(/pmc-id: /,'');
        pmcidObj.value = pmcidObj.value.replace(/;/,'');
    }
    
    return {
      id: art.uid,
      title: art.title,
      authors,
      journal: art.fulljournalname || "Unknown Journal",
      year: art.pubdate?.substring(0, 4) || "",
      abstract: art.abstract || "No abstract available.",
      pdf: pmcidObj
        ? `https://www.ncbi.nlm.nih.gov/pmc/articles/${pmcidObj.value}/pdf`
        : null,
    };
  });

  return (
    <div className="container py-5 scholar-page">
      <div className="row">

        {/* LEFT */}
        <div className="col-md-8 left-pane">

          {/* SEARCH BOX */}
          <div className="search-section text-center mb-5">
            <div className="mb-4 text-center">
                <h1 className="fw-bold" style={{ fontSize: "2.4rem", lineHeight: "1.1" }}>
                    PubMed Search
                </h1>
                <div
                    className="text-muted"
                    style={{ fontSize: "0.9rem", marginTop: "-4px", letterSpacing: "0.5px" }}
                >
                    Explore millions of biomedical papers
                </div>
                </div>

            <div className="d-flex justify-content-center">
              <input
                type="text"
                placeholder="Search PubMed..."
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                className="search-input form-control"
              />

              <button
                className="btn btn-primary ms-2 btn-search"
                onClick={() => setQuery(queryInput)}
              >
                <i className="ri-search-line"></i> Search
              </button>
            </div>
          </div>

          {/* LOADING / ERROR */}
          {isLoading && (
            <div className="loading-dots">
                <span></span><span></span><span></span>
            </div>
            )}
          {isError && <p>Error fetching articles.</p>}

          {/* BEFORE SEARCH */}
          {!query && (
            <div className="text-center text-muted py-5 placeholder-box">
              <i className="ri-search-eye-line fs-1 d-block mb-3"></i>
              Start by entering a search query…
            </div>
          )}

          {/* NO RESULTS */}
          {query && formattedResults.length === 0 && !isLoading && (
            <p className="text-center text-muted">No articles found.</p>
          )}

          {/* ------------------------------ */}
          {/* RESULTS */}
          {/* ------------------------------ */}
          {formattedResults.map((r) => (
            <div
              key={r.id}
              className="article-card shadow-sm p-4 mb-4 rounded"
            >
              <div className="d-flex align-items-start gap-3">

                {/* PDF ICON */}
                <img src={pdfIcon} className="pdf-icon" alt="pdf" />

                <div className="flex-grow-1">

                  {/* TITLE + BOOKMARK */}
                  <div className="d-flex justify-content-between">
                    <h5 className="article-title colored-title">{r.title}</h5>

                    <button className="btn btn-light border bookmark-btn">
                      <i className="ri-bookmark-line"></i>
                    </button>
                  </div>

                  <div className="author-line small mb-2">
                    {r.authors} · <strong>{r.journal}</strong> ({r.year})
                  </div>

                  <p className="abstract-text">{r.abstract}</p>

                  {/* PDF BUTTON */}
                  {r.pdf ? (
                    <a
                      href={r.pdf}
                      target="_blank"
                      className="btn btn-sm btn-outline-primary mt-2"
                    >
                      <i className="ri-file-download-line me-1"></i>
                      Download PDF
                    </a>
                  ) : (
                    <button
                      className="btn btn-sm btn-outline-secondary mt-2"
                      disabled
                    >
                      <i className="ri-file-warning-line me-1"></i>
                      PDF Not Available
                    </button>
                  )}

                  {/* ADD TO SHELF */}
                  <button className="btn btn-sm btn-outline-success mt-2 ms-2">
                    <i className="ri-bookmark-line me-1"></i>
                    Add to Shelf
                  </button>
                </div>
              </div>
            </div>
          ))}

        </div>

        {/* RIGHT FILTERS */}
        <div className="col-md-4">
          <ScholarSearchFilter filters={filters} setFilters={setFilters} />
        </div>
      </div>
    </div>
  );
}