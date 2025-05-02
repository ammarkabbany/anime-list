import { useState } from "react";

const ShowOverview = ({ overview }: {overview: string}) => {
  // State to manage the "Read More" toggle
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleReadMore = () => setIsExpanded(!isExpanded);

  // Define how much text to display before truncating
  const previewTextLength = 150;

  return (
    <article className="relative container max-w-3xl mt-6 p-6 bg-gradient-to-r from-indigo-900 via-purple-800 to-indigo-900 rounded-lg shadow-lg text-gray-300">
      {/* Decorative Background Element */}
      <div className="absolute inset-0 opacity-25 bg-gradient-to-t from-transparent via-indigo-500 to-purple-500 rounded-lg"></div>

      {/* Animated Border Glow */}
      <div className="absolute inset-0 border-2 border-transparent rounded-lg bg-clip-border animate-pulse border-indigo-400 opacity-70"></div>

      <p className="relative text-lg leading-relaxed sm:leading-loose text-gray-100 z-10">
        {/* Conditionally render the full text or truncated text */}
        {isExpanded
          ? overview
          : `${overview?.slice(0, previewTextLength)}...`}
      </p>

      {/* Toggle Button for Read More / Read Less */}
      <button
        onClick={toggleReadMore}
        className="relative mt-4 text-sm font-semibold text-indigo-400 hover:text-purple-300 focus:outline-none z-10"
      >
        {isExpanded ? "Read Less" : "Read More"}
      </button>

      {/* Decorative Accent at the Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-bl-lg rounded-br-lg"></div>
    </article>
  );
};

export default ShowOverview;