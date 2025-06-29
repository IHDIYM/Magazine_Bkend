import { atom, useAtom } from "jotai";
import { useEffect, useRef } from "react";
import { selectedSegmentAtom } from "./Configurator";

// These are the original picture files we'll use for our pages
// We'll reuse some images for the additional pages
const pictures = [
  "DSC00680", // 0: Cover back/intro
  "DSC00933", // 1: Intro/general
  "DSC00966", // 2: Intro/general
  "DSC00983", // 3: SUVs - start
  "DSC01011", // 4: SUVs - continue
  "DSC01040", // 5: SUV Coupé - start
  "DSC01064", // 6: SUV Coupé - continue
  "DSC01071", // 7: Hatchbacks - start
  "DSC01103", // 8: Hatchbacks - continue
  "DSC01145", // 9: Sedans - start
  "DSC01420", // 10: Sedans - continue
  "DSC01461", // 11: Electric Vehicles - start
  "DSC01489", // 12: Electric Vehicles - continue
  "DSC02031", // 13: Commercial Vehicles - start
  "DSC02064", // 14: Commercial Vehicles - continue
  "DSC02069", // 15: Back cover
];

// Additional images by reusing existing ones with different indices for new pages
const extendedImages = [
  // For additional pages
  pictures[3],  // 16: additional SUV page
  pictures[4],  // 17: additional SUV page
  pictures[5],  // 18: additional SUV Coupé page
  pictures[6],  // 19: additional SUV Coupé page
  pictures[7],  // 20: additional Hatchbacks page
  pictures[8],  // 21: additional Hatchbacks page
  pictures[9],  // 22: additional Sedans page
  pictures[10], // 23: additional Sedans page
  pictures[11], // 24: additional Electric Vehicles page
  pictures[12], // 25: additional Electric Vehicles page
  pictures[13], // 26: additional Commercial Vehicles page
  pictures[14], // 27: additional Commercial Vehicles page
];

export const pageAtom = atom(0);

// Create pages for book with proper spread/layout
export const pages = [
  // Cover (page 0)
  { front: "book-cover", back: pictures[0] },
  
  // Introduction/General (pages 1-2)
  { front: pictures[1], back: pictures[2] },  
  
  // SUVs (pages 3-4)
  { front: pictures[3], back: pictures[4] },
  
  // SUV Coupé (pages 5-6)
  { front: pictures[5], back: pictures[6] },
  
  // Hatchbacks (pages 7-8)
  { front: pictures[7], back: pictures[8] },
  
  // Sedans (pages 9-10)
  { front: pictures[9], back: pictures[10] },
  
  // Electric Vehicles (pages 11-12)
  { front: pictures[11], back: pictures[12] },
  
  // Commercial Vehicles (pages 13-14)
  { front: pictures[13], back: pictures[14] },
  
  // Back cover (page 15)
  { front: pictures[15], back: "book-back" },
];

// Map pages to car segments
export const PAGE_TO_SEGMENT_MAP = {
  // SUVs (pages 3-4)
  3: "SUVs",
  4: "SUVs",
  
  // SUV Coupé (pages 5-6)
  5: "SUV Coupé",
  6: "SUV Coupé",
  
  // Hatchbacks (pages 7-8)
  7: "Hatchbacks", 
  8: "Hatchbacks",
  
  // Sedans (pages 9-10)
  9: "Sedans",
  10: "Sedans",
  
  // Electric Vehicles (pages 11-12)
  11: "Electric Vehicles",
  12: "Electric Vehicles",
  
  // Commercial Vehicles (pages 13-14)
  13: "Commercial Vehicles",
  14: "Commercial Vehicles",
};

// DIRECT MAPPING from segment to page (more reliable than computing it)
export const SEGMENT_TO_PAGE_MAP = {
  "SUVs": 3,
  "SUV Coupé": 5,
  "Hatchbacks": 7, 
  "Sedans": 9,
  "Electric Vehicles": 11,
  "Commercial Vehicles": 13
};

// For debugging only
console.log("Pages in book:", pages.length);
console.log("PAGE_TO_SEGMENT_MAP:", PAGE_TO_SEGMENT_MAP);
console.log("SEGMENT_TO_PAGE_MAP:", SEGMENT_TO_PAGE_MAP);

export const UI = () => {
  const [page, setPage] = useAtom(pageAtom);
  const [selectedSegment, setSelectedSegment] = useAtom(selectedSegmentAtom);
  const audioRef = useRef(new Audio("/audios/page-flip-01a.mp3"));
  const prevPageRef = useRef(page);
  const userInteractedRef = useRef(false);
  const pageChangeSourceRef = useRef('user'); // Track whether page change came from user or segment

  // Debug logging for initial state
  useEffect(() => {
    console.log("Initial page:", page);
    console.log("Initial segment:", selectedSegment);
  }, []);

  // Debug logging for changes
  useEffect(() => {
    console.log("Current page:", page);
    console.log("Current segment:", selectedSegment);
    console.log("Change source:", pageChangeSourceRef.current);
  }, [page, selectedSegment]);

  // Update segment when page changes
  useEffect(() => {
    if (pageChangeSourceRef.current === 'segment') {
      // If change originated from segment selection, don't update segment again
      console.log("Skipping segment update because change came from segment selection");
      pageChangeSourceRef.current = 'user';
      return;
    }
    
    // Only update segment if the page is in the mapping
    const currentSegment = PAGE_TO_SEGMENT_MAP[page];
    if (currentSegment) {
      console.log("Updating segment based on page:", page, "->", currentSegment);
      setSelectedSegment(currentSegment);
    } else {
      console.log("Page", page, "is not mapped to any segment");
    }
  }, [page, setSelectedSegment]);

  // Update page when segment changes
  useEffect(() => {
    if (pageChangeSourceRef.current === 'user') {
      // If change originated from page turning, don't update page again
      console.log("Skipping page update because change came from user page turning");
      pageChangeSourceRef.current = 'segment';
      return;
    }
    
    // Only update page if the segment is in the mapping
    const targetPage = SEGMENT_TO_PAGE_MAP[selectedSegment];
    if (targetPage !== undefined) {
      console.log("Updating page based on segment:", selectedSegment, "->", targetPage);
      pageChangeSourceRef.current = 'segment';
      setPage(targetPage);
    } else {
      console.log("Segment", selectedSegment, "is not mapped to any page");
    }
  }, [selectedSegment, setPage]);

  useEffect(() => {
    // Only play sound if this is a user-initiated page change
    if (prevPageRef.current !== page && userInteractedRef.current) {
      try {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(err => {
          console.log("Audio playback error:", err);
        });
      } catch (error) {
        console.log("Audio error:", error);
      }
    }
    prevPageRef.current = page;
  }, [page]);

  const handlePageClick = (newPage) => {
    console.log("User clicked page:", newPage);
    userInteractedRef.current = true;
    pageChangeSourceRef.current = 'user';
    setPage(newPage);
  };

  // Helper function to get page title with segment info
  const getPageTitle = (pageNum) => {
    if (pageNum === 0) return "Cover";
    if (pageNum === pages.length) return "Back Cover";
    
    const segment = PAGE_TO_SEGMENT_MAP[pageNum];
    if (segment) {
      return `${segment} - Page ${pageNum}`;
    }
    return `Page ${pageNum}`;
  };

  return (
    <>
      <main className="pointer-events-none select-none z-10 fixed inset-0 flex justify-between flex-col">
        <a
          className="pointer-events-auto mt-10 ml-10"
          href="https://www.tatamotors.com/"
        >
          <img className="w-20" src="/images/wawasensei-white.png" />
        </a>
        
        {/* Pagination dots positioned on the left side */}
        <div className="fixed left-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 pointer-events-auto">
          {/* Cover dot */}
          <button
            className={`rounded-full transition-all duration-300 ${
              page === 0
                ? "bg-white border-2 border-white w-5 h-5"
                : "bg-white/30 hover:bg-white/50 border border-transparent w-5 h-5"
            }`}
            onClick={() => handlePageClick(0)}
            title="Cover"
          />
          
          {/* Page dots */}
          {[...pages].slice(1, pages.length).map((_, index) => (
            <button
              key={index + 1}
              className={`rounded-full transition-all duration-300 ${
                index + 1 === page
                  ? "bg-white border-2 border-white w-3 h-3"
                  : "bg-white/30 hover:bg-white/50 border border-transparent w-3 h-3"
              } ${PAGE_TO_SEGMENT_MAP[index + 1] ? 'opacity-100' : 'opacity-70'}`}
              onClick={() => handlePageClick(index + 1)}
              title={getPageTitle(index + 1)}
            />
          ))}
          
          {/* Back Cover dot */}
          <button
            className={`rounded-full transition-all duration-300 ${
              page === pages.length
                ? "bg-white border-2 border-white w-5 h-5"
                : "bg-white/30 hover:bg-white/50 border border-transparent w-5 h-5"
            }`}
            onClick={() => handlePageClick(pages.length)}
            title="Back Cover"
          />
        </div>
      </main>

      <div className="fixed inset-0 flex items-center -rotate-2 select-none">
        <div className="relative">
          <div className="bg-white/0  animate-horizontal-scroll flex items-center gap-8 w-max px-8">
            <h1 className="shrink-0 text-white text-10xl font-black ">
            Driven by You, Powered by Tata
            </h1>
            <h2 className="shrink-0 text-white text-8xl italic font-light">
            Move with Meaning
            </h2>
            <h2 className="shrink-0 text-white text-12xl font-bold">
            Better Always
            </h2>
            <h2 className="shrink-0 text-transparent text-12xl font-bold italic outline-text">
            Drive the Future Today
            </h2>
            <h2 className="shrink-0 text-white text-9xl font-extralight italic">
            Experience the Future of Driving
            </h2>
            <h2 className="shrink-0 text-white text-13xl font-bold">
            The Future of Driving
            </h2>
            <h2 className="shrink-0 text-transparent text-13xl font-bold outline-text italic">
            Experience the Future of Driving
            </h2>
          </div>
          <div className="absolute top-0 left-0 bg-white/0 animate-horizontal-scroll-2 flex items-center gap-8 px-8 w-max">
            <h1 className="shrink-0 text-white text-10xl font-black ">
            Driven by You, Powered by Tata
            </h1>
            <h2 className="shrink-0 text-white text-8xl italic font-light">
            Move with Meaning
            </h2>
            <h2 className="shrink-0 text-white text-12xl font-bold">
            Better Always
            </h2>
            <h2 className="shrink-0 text-transparent text-12xl font-bold italic outline-text">
            Better Always
            </h2>
            <h2 className="shrink-0 text-white text-9xl font-medium">
            Drive the Future Today
            </h2>
            <h2 className="shrink-0 text-white text-9xl font-extralight italic">
            Experience the Future of Driving
            </h2>
            <h2 className="shrink-0 text-white text-13xl font-bold">
            The Future of Driving
            </h2>
            <h2 className="shrink-0 text-transparent text-13xl font-bold outline-text italic">
            Experience the Future of Driving
            </h2>
          </div>
        </div>
      </div>

      {/* Second layer of moving text bars */}
      <div className="fixed inset-0 flex items-center -rotate-1 select-none" style={{ top: '20%' }}>
        <div className="relative">
          <div className="bg-white/0 animate-horizontal-scroll-3 flex items-center gap-8 w-max px-8">
            <h2 className="shrink-0 text-white/60 text-8xl font-bold">
            Innovation Meets Performance
            </h2>
            <h2 className="shrink-0 text-transparent text-10xl font-black outline-text">
            Safety First
            </h2>
            <h2 className="shrink-0 text-white/70 text-9xl font-light italic">
            Built for Tomorrow
            </h2>
            <h2 className="shrink-0 text-white/50 text-11xl font-extrabold">
            Excellence in Motion
            </h2>
            <h2 className="shrink-0 text-transparent text-8xl font-bold outline-text">
            Quality Assured
            </h2>
          </div>
        </div>
      </div>

      {/* Third layer of moving text bars */}
      <div className="fixed inset-0 flex items-center -rotate-3 select-none" style={{ top: '60%' }}>
        <div className="relative">
          <div className="bg-white/0 animate-horizontal-scroll-4 flex items-center gap-8 w-max px-8">
            <h2 className="shrink-0 text-white/40 text-7xl font-medium">
            Advanced Technology
            </h2>
            <h2 className="shrink-0 text-transparent text-9xl font-bold outline-text">
            Eco-Friendly
            </h2>
            <h2 className="shrink-0 text-white/60 text-8xl font-light">
            Smart Connectivity
            </h2>
            <h2 className="shrink-0 text-white/30 text-10xl font-extrabold">
            Premium Experience
            </h2>
            <h2 className="shrink-0 text-transparent text-7xl font-bold outline-text">
            Future Ready
            </h2>
          </div>
        </div>
      </div>

      {/* Fourth layer of moving text bars */}
      <div className="fixed inset-0 flex items-center -rotate-1.5 select-none" style={{ top: '80%' }}>
        <div className="relative">
          <div className="bg-white/0 animate-horizontal-scroll-5 flex items-center gap-8 w-max px-8">
            <h2 className="shrink-0 text-white/30 text-6xl font-light">
            Intelligent Design
            </h2>
            <h2 className="shrink-0 text-transparent text-8xl font-bold outline-text">
            Power & Efficiency
            </h2>
            <h2 className="shrink-0 text-white/50 text-7xl font-medium">
            Luxury Redefined
            </h2>
            <h2 className="shrink-0 text-white/20 text-9xl font-extrabold">
            Trusted Brand
            </h2>
            <h2 className="shrink-0 text-transparent text-6xl font-bold outline-text">
            Made in India
            </h2>
          </div>
        </div>
      </div>
    </>
  );
};
