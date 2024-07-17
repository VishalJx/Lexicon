import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../app/globals.css';
import { useRouter } from 'next/router';

export default function Post() {
  const [word, setWord] = useState('');
  const [wordData, setWordData] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (wordData) {
      console.log('Word data fetched:', wordData);
    }
  }, [wordData]);

  const handleRoute = () => {
    router.push('/lexicon');
  }

  const handleWordChange = (e) => {
    setWord(e.target.value);
    setWordData(null); // Reset wordData when input changes
  };

  const handleShowMeaning = async () => {
    try {
      const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const data = response.data[0];
      setWordData(data); // Update state with fetched data
      setSuccessMessage('Happy learning!');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Error fetching word');
      setSuccessMessage('');
      console.error('Error:', error);
    }
  };

  const handleAddToDatabase = async () => {
    try {
      if (!wordData) {
        setErrorMessage('Please fetch word data first');
        return;
      }
  
      // Format the data for saving in the database
      const { word: fetchedWord, meanings } = wordData;
      const formattedData = {
        word: fetchedWord,
        definitions: meanings.map(meaning => ({
          partOfSpeech: meaning.partOfSpeech,
          definition: meaning.definitions.map(def => def.definition).join('; ')
        }))
      };
  
      console.log("Formatted data:", formattedData);
  
      // Save the formatted data in the database
      const response = await fetch('/api/words/fetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Server response:", data);
      
      setSuccessMessage('Word added successfully!');
      router.push('/lexicon');
      setErrorMessage('');
      setWord('');
      setWordData(null);
    } catch (error) {
      console.error('Detailed error:', error);
      setErrorMessage('Error adding word to the list: ');
      setSuccessMessage('');
    }
  };

  return (
    <main className="relative h-[100vh] flex flex-col items-center justify-center text-secondary bg-secondary">
      <span 
        className='absolute text-xl font-bolder top-12 right-20 border px-8 py-1 rounded-md bg-white shadow-deepShadow hover:shadow-sharpShadow cursor-pointer'
        onClick={handleRoute}>
          Check your list
      </span>
      <form className="bg-white p-6 rounded shadow-sharpShadow w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4">Search the word !</h1>
        <div className="mb-4">
          <label className="block text-black">Word</label>
          <input
            type="text"
            value={word}
            onChange={handleWordChange}
            className="w-full px-3 py-2 border rounded text-black"
            required
          />
        </div>
        <button type="button" onClick={handleShowMeaning} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
          Show Meaning
        </button>
        <button type="button" onClick={handleAddToDatabase} className="bg-green-500 text-white px-4 py-2 rounded">
          Add to my list
        </button>
        {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
      </form>
      {wordData && (
        <div className="bg-white p-6 rounded shadow-sharpShadow w-full max-w-lg mt-4">
          <h2 className="text-2xl font-bold mb-4">{wordData.word}</h2>
          <div>
            {wordData.meanings.map((meaning, index) => (
              <div key={index} className="mb-4">
                <p className="text-lg font-semibold italic font-font2 text-gray-500">{meaning.partOfSpeech}</p>
                {meaning.definitions.map((def, defIndex) => (
                  <p key={defIndex} className="text-md">{def.definition}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
