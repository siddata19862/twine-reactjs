import React from "react";
import "./ScholarSearchFilter.css";

export default function ScholarSearchFilter({ filters, setFilters }) {
  
  const update = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="scholar-filter card shadow-sm border-0">
      <div className="card-header bg-white">
        <h6 className="mb-0">
          <i className="ri-filter-3-line me-1"></i> Filters
        </h6>
      </div>

      <div className="card-body">

        {/* ----------------------------
             TEXT AVAILABILITY
        ----------------------------- */}
        <div className="mb-4">
          <h6 className="filter-title">Text Availability</h6>

          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="textAvailability"
              checked={filters.textAvailability === "all"}
              onChange={() => update("textAvailability", "all")}
            />
            <label className="form-check-label">All</label>
          </div>

          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="textAvailability"
              checked={filters.textAvailability === "free"}
              onChange={() => update("textAvailability", "free")}
            />
            <label className="form-check-label">Free full text</label>
          </div>

          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="textAvailability"
              checked={filters.textAvailability === "abstract"}
              onChange={() => update("textAvailability", "abstract")}
            />
            <label className="form-check-label">Has abstract</label>
          </div>
        </div>

        {/* ----------------------------
             ARTICLE TYPE
        ----------------------------- */}
        <div className="mb-4">
          <h6 className="filter-title">Article Type</h6>

          {[
            "Review",
            "Clinical Trial",
            "Meta-Analysis",
            "Case Report",
            "Randomized Controlled Trial",
          ].map((type, i) => (
            <div className="form-check" key={i}>
              <input
                type="checkbox"
                className="form-check-input"
                checked={filters.articleTypes.includes(type)}
                onChange={() => {
                  const exists = filters.articleTypes.includes(type);
                  update(
                    "articleTypes",
                    exists
                      ? filters.articleTypes.filter(t => t !== type)
                      : [...filters.articleTypes, type]
                  );
                }}
              />
              <label className="form-check-label">{type}</label>
            </div>
          ))}
        </div>

        {/* ----------------------------
             PUBLICATION DATE
        ----------------------------- */}
        <div className="mb-4">
          <h6 className="filter-title">Publication Date</h6>
          <select
            className="form-select"
            value={filters.pubDate}
            onChange={e => update("pubDate", e.target.value)}
          >
            <option value="any">Any time</option>
            <option value="1y">Last 1 year</option>
            <option value="5y">Last 5 years</option>
            <option value="10y">Last 10 years</option>
            <option value="custom">Custom range</option>
          </select>

          {/* Custom Date Input */}
          {filters.pubDate === "custom" && (
            <div className="mt-2 d-flex gap-2">
              <input
                type="date"
                className="form-control"
                value={filters.customFrom}
                onChange={e => update("customFrom", e.target.value)}
              />
              <input
                type="date"
                className="form-control"
                value={filters.customTo}
                onChange={e => update("customTo", e.target.value)}
              />
            </div>
          )}
        </div>

        {/* ----------------------------
             SPECIES
        ----------------------------- */}
        <div className="mb-4">
          <h6 className="filter-title">Species</h6>

          <div className="form-check">
            <input
              type="radio"
              name="species"
              className="form-check-input"
              checked={filters.species === "all"}
              onChange={() => update("species", "all")}
            />
            <label className="form-check-label">All</label>
          </div>

          <div className="form-check">
            <input
              type="radio"
              name="species"
              className="form-check-input"
              checked={filters.species === "humans"}
              onChange={() => update("species", "humans")}
            />
            <label className="form-check-label">Humans</label>
          </div>

          <div className="form-check">
            <input
              type="radio"
              name="species"
              className="form-check-input"
              checked={filters.species === "animals"}
              onChange={() => update("species", "animals")}
            />
            <label className="form-check-label">Animals</label>
          </div>
        </div>

        {/* ----------------------------
             LANGUAGE
        ----------------------------- */}
        <div className="mb-4">
          <h6 className="filter-title">Language</h6>
          <select
            className="form-select"
            value={filters.language}
            onChange={e => update("language", e.target.value)}
          >
            <option value="">Any</option>
            <option value="english">English</option>
            <option value="spanish">Spanish</option>
            <option value="french">French</option>
            <option value="chinese">Chinese</option>
            <option value="japanese">Japanese</option>
          </select>
        </div>

        {/* ----------------------------
             SORT
        ----------------------------- */}
        <div className="mb-4">
          <h6 className="filter-title">Sort By</h6>
          <select
            className="form-select"
            value={filters.sortBy}
            onChange={e => update("sortBy", e.target.value)}
          >
            <option value="relevance">Relevance</option>
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

      </div>
    </div>
  );
}