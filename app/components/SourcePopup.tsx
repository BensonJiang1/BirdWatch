import React from 'react';

interface SourcePopupProps {
  isVisible: boolean;
  onClose: () => void;
}

const SourcePopup: React.FC<SourcePopupProps> = ({isVisible, onClose}) => {
  if (!isVisible) return null;

  const sources = [
    {
      title: "eBird by Cornell Lab",
      url: "https://ebird.org",
      description: "Real-time bird observations and citizen science data"
    },
    {
      title: "All About Birds",
      url: "https://allaboutbirds.org",
      description: "Comprehensive bird identification and information guide"
    },
    {
      title: "Birds of North America",
      url: "https://birdsna.org",
      description: "Scientific reference for North American bird species"
    },
    {
      title: "Wikipedia Bird Articles",
      url: "https://wikipedia.org",
      description: "Comprehensive encyclopedia entries for bird species"
    },
    {
      title: "Tree Density",
      url: "https://www.nature.com/articles/nature14967",
      description: "Comprehensive reference for tree denity analysis"
    },
    {
      title: "Bird Life",
      url: "https://www.birdlife.org/",
      description: "Bird conservation and migration patterns"
    },
    {
      title: "Partners in Flight",
      url: "https://partnersinflight.org/",
      description: "Tropic bird breeding pairs"
    },
    {
      title: "IUCN",
      url: "https://www.iucnredlist.org/",
      description: "Endangered birds around the globe"
    }
  
  ];

  const images = [
    {
      title:"Kumarakom Bird Sanctuary",
      url:"https://www.freepik.com/free-photo/closeup-shot-white-stork-flies-mangrove-sanctuary-kampot-cambodia_29998054.htm"
    },
    {
      title:"Djoudj National Bird Sanctuary",
      url:"https://www.freepik.com/free-photo/flamingo-spreading-its-wings-while-bathing-pond-animal-sanctuary_9853244.htm"
    },
    {
      title:"Keoladeo National Park",
      url:"https://www.freepik.com/free-photo/great-spotted-woodpecker-reflecting-water_14501062.htm"
    },
    {
      title:"Sultanpur Bird Sanctuary",
      url:"https://www.freepik.com/free-photo/tropical-bird-natural-environment_10176573.htm"
    },
    {
      title:"Nal Sarovar Bird Sanctuary",
      url:"https://www.freepik.com/free-photo/vertical-shot-mallard-duck-swimming-water-surface-pond_20722772.htm"
    },
    {
      title:"Nalabana Bird Sanctuary",
      url:"https://www.freepik.com/free-photo/majestic-colourfull-bird-nature-habitat-birds-northern-pantanal-wild-brasil-brasilian-wildlife-full-green-jungle-south-american-nature-wilderness_28920387.htm"
    },
    {
      title:"Ranganathittu Bird Sanctuary",
      url:"https://www.freepik.com/free-photo/bare-throated-tiger-heron-tigrisoma-mexicanum-adult_7814177.htm"
    },
    {
      title:"Bosque del Apache National Wildlife Refuge",
      url:"https://www.freepik.com/free-photo/selective-focus-shot-rufous-naped-lark-perching-grass_12650954.htm"
    },
    {
      title:"Everglades National Park",
      url:"https://www.freepik.com/free-photo/bird-south-america-nature-habitat_16206267.htm"
    },
    {
      title:"Doñana National Park",
      url:"https://www.freepik.com/free-photo/closeup-shot-flying-gray-heron_17420212.htm"
    },
    {
      title:"Danube Delta Biosphere Reserve",
      url:"https://www.freepik.com/free-photo/mesmerizing-colorful-common-kingfisher-bird-branch-tree_11426659.htm"
    }


  ]

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 ">
      <div className="relative max-w-2xl w-full mx-4 rounded-xl overflow-hidden shadow-2xl bg-white">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-700 text-2xl font-bold bg-white bg-opacity-90 rounded-full w-8 h-8 flex items-center justify-center shadow-sm transition-colors duration-200"
        >
          ×
        </button>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">Data Sources</h2>
          <p className="text-blue-100 text-sm mt-1">Information and imagery provided by these trusted sources</p>
        </div>
        
        {/* Sources List */}
        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="space-y-4">
            {sources.map((source, index) => (
              <div 
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 bg-gray-50 hover:bg-white"
              >
                <a 
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-green-600 group-hover:text-green-700 transition-colors duration-200 flex items-center">
                        {source.title}
                        <svg 
                          className="w-4 h-4 ml-2 opacity-60 group-hover:opacity-100 transition-opacity duration-200" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </h3>
                      <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                        {source.description}
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
          
          {/* Footer note */}
          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500 mb-2">
              Bird sanctuary images provided by{' '}
              <a
                href="https://www.freepik.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 underline"
              >
                Freepik
              </a>{' '}
              and respective photographers.
            </p>

            <ul className="text-[10px] text-gray-400 italic space-y-1 max-h-24 overflow-y-auto">
              {images.map((img, idx) => (
                <li key={idx}>
                  <a
                    href={img.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-green-600 underline"
                  >
                    {img.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>


      </div>
    </div>
  );
}

export default SourcePopup;