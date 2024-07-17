'use client'

import { useState } from 'react';
import { useRouter } from 'next/router';
import '../../app/globals.css';

export default function Lexicon() {
  const alphabets = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  const [words, setWords] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedWords, setExpandedWords] = useState({});

  const router = useRouter();

  const MAX_DEFINITIONS = 3;

  const toggleDefinitions = (wordId) => {
    setExpandedWords(prev => ({
      ...prev,
      [wordId]: !prev[wordId]
    }));
  };

  const handleClick = async (letter) => {
    setSelectedLetter(letter);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/words/${letter}`);
      if (!response.ok) {
        throw new Error('Failed to fetch words');
      }
      const data = await response.json();
      setWords(data);
      console.log(words);
    } catch (error) {
      console.error('Error fetching words:', error);
      setError('Failed to fetch words. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim() === '') return;
    setSelectedLetter('');
    fetchWords(`/api/words/search/${searchTerm}`);
  };

  const fetchWords = async (url) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch words');
      }
      const data = await response.json();
      setWords(Array.isArray(data) ? data : [data]); // Ensure words is always an array
    } catch (error) {
      console.error('Error fetching words:', error);
      setError('Failed to fetch words. Please try again.');
      setWords([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoute = (e) => {
    e.preventDefault()
    router.push('/word')
  }

  return (
    <main className='h-[100vh] flex text-primary'>
      {/* Alphabet Pagination */}
      <div className='w-1/4 h-full border-r-2 bg-secondary'>
        <section className='flex flex-col items-center mb-2 px-2'>
          <h1 className="text-[1.8rem] font-bolder font-font3"><span className='font-font2 italic'>L</span>exicon</h1>
          <input
            className='w-full text-lg text-gray-700 font-bold px-3 py-1 rounded-md outline-none'
            placeholder="Enter the word"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </section>
        <section>
          <div className="flex flex-col gap-0.5 pl-2">
            {alphabets.map((alphabet, index) => (
              <span 
                key={index}
                className={`alphabet-item text-lg font-bold z-40 hover:text-secondary hover:font-bold cursor-pointer ${alphabet === selectedLetter ? 'text-tertiary' : ''}`}
                onClick={() => handleClick(alphabet)}
              >
                {alphabet}
              </span>
            ))}
          </div>
        </section>
        <span className='flex justify-center' onClick={handleRoute}>
          <h3 className='w-fit text-xl px-5 py-1 mt-4 font-font1 font-bolder text-center border border-gray-300 rounded-lg cursor-pointer hover:shadow-buttonShadow'>
            Find the meaning
          </h3>
        </span>
      </div>

      {/* Words section */}
      <div className='w-3/4 h-full bg-primary overflow-y-auto p-4'>
        {isLoading ? (
          <p className='text-lg text-gray-700'>Loading...</p>
        ) : error ? (
          <p className='text-lg text-red-500'>{error}</p>
        ) : words.length > 0 ? (
          words.map((word, index) => (
            <div key={index} className='mb-4 p-4 border border-gray-300 rounded-md hover:shadow-sharpShadow hover:bg-gray-100 duration-300'>
              <h2 className='text-2xl font-bold text-secondary'>{word.word}</h2>
              <div className='mt-2 text-secondary'>
                {(expandedWords[word._id] ? word.definitions : word.definitions.slice(0, MAX_DEFINITIONS)).map((definition, idx) => (
                  <div key={idx} className='mt-4'>
                  <hr/>
                    <p className='font-semibold italic font-font2 text-gray-500 text-lg'>{definition.partOfSpeech}</p>
                    <p className='font-font3 text-lg'>{definition.definition}</p>
                  </div>
                ))}
                {word.definitions.length > MAX_DEFINITIONS && (
                  <button 
                    onClick={() => toggleDefinitions(word._id)} 
                    className='mt-2 text-blue-500 hover:text-blue-700 font-semibold'
                  >
                    {expandedWords[word._id] ? 'Show Less' : `Show ${word.definitions.length - MAX_DEFINITIONS} More Definition(s)`}
                  </button>
                )}
              </div>
            </div>
          ))
        ) : selectedLetter || searchTerm ? (
          <p className='text-lg text-gray-700'>No words found.</p>
        ) : (
          <p className='text-lg text-gray-700'>Select a letter or search for a word.</p>
        )}
      </div>
    </main>
  );
}