import React, { useState } from 'react';

const GenerateImage = () => {
  const [text, setText] = useState('');
  const [number, setNumber] = useState(0);
  const [images, setImages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://api-d7b62b.stack.tryrelevance.com/latest/studios/9bf6674b-968e-4002-b108-9cb56730b45f/trigger_limited', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "params": {
            "text": text,
            "number": number
          },
          "project": "cc5239853f96-4672-8f18-d800137b3c4b"
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setImages(data.output.images); 
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <div className='text_div'>
      <form onSubmit={handleSubmit}>
        <div className='image_input'>
          <label>
          Enter Text Here:
            </label>
            <input 
              type='text' 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
            />
        </div> <br></br>
        <div className='image_input'>
          <label>
         Enter Number Here:
         </label>
            <input 
              type='number' 
              value={number} 
              onChange={(e) => setNumber(Number(e.target.value))} 
            />
        </div>
        <button type='submit'>Generate Image</button>
      </form>
      </div><br></br>

      {images.length > 0 && (
        <div>
          {images.map((image, index) => (
            <img key={index} src={image} alt={`Generated ${index + 1}`} />
          ))}
        </div>
      )}
    </div>
  );
}

export default GenerateImage;
