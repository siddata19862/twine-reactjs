import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export function usePubMedSearch(query) {
  return useQuery({
    queryKey: ["pubmed", query],
    queryFn: async () => {
      if (!query || query.trim() === "") return [];

      // STEP 1 — Search for PMIDs
      const searchURL = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi`;
      const searchParams = {
        db: "pubmed",
        term: query,
        retmax: 10,
        retmode: "json",
      };

      const searchRes = await axios.get(searchURL, { params: searchParams });
      const pmids = searchRes.data.esearchresult.idlist;

      if (!pmids.length) return [];

      // STEP 2 — Fetch article metadata
      const summaryURL = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi`;
      const summaryRes = await axios.get(summaryURL, {
        params: {
          db: "pubmed",
          id: pmids.join(","),
          retmode: "json",
        },
      });

      const resultObj = summaryRes.data.result;

      // PubMed returns an "uids" array and a mapped object
      const articles = resultObj.uids.map((uid) => resultObj[uid]);

      return articles;
    },
    enabled: !!query, // only run when query is non-empty
    staleTime: 1000 * 60 * 5, // 5 mins cache
  });
}