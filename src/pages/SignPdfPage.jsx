// ✅ Updated SignPdfPage.jsx with Draw Signature Support
import React, { useRef, useState } from 'react';
import axios from 'axios';
import '../styles/SignPdfPage.css';

function SignPdfPage() {
  const [file, setFile] = useState(null);
  const [signatureText, setSignatureText] = useState('');
  const [signatureMethod, setSignatureMethod] = useState('type');
  const [font, setFont] = useState('Roboto');
  const [position, setPosition] = useState('bottom-right');
  const [message, setMessage] = useState('');
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);

  const startDraw = (e) => {
    isDrawing.current = true;
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const endDraw = () => {
    isDrawing.current = false;
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const handleSign = async () => {
    if (!file || (signatureMethod === 'type' && !signatureText)) {
      setMessage('❌ Please select a PDF and provide a signature.');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('position', position);

    if (signatureMethod === 'type') {
      formData.append('signatureText', signatureText);
      formData.append('font', font);
    } else if (signatureMethod === 'draw') {
      const canvas = canvasRef.current;
      const dataURL = canvas.toDataURL('image/png');
      formData.append('signatureImage', dataURL);
    }

    setMessage('⏳ Signing PDF...');

    try {
      const res = await axios.post('http://localhost:5000/sign-pdf', formData, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'signed.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();

      setMessage('✅ PDF signed and downloaded!');
    } catch (err) {
      console.error(err);
      setMessage('❌ Signing failed.');
    }
  };

  return (
    <div className="sign-pdf-container">
      <h2>Sign PDF</h2>

      <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files[0])} />

      <div className="method-select">
        <label>
          <input
            type="radio"
            value="type"
            checked={signatureMethod === 'type'}
            onChange={() => setSignatureMethod('type')}
          />
          Type
        </label>
        <label>
          <input
            type="radio"
            value="draw"
            checked={signatureMethod === 'draw'}
            onChange={() => setSignatureMethod('draw')}
          />
          Draw
        </label>
      </div>

      {signatureMethod === 'type' && (
        <>
          <input
            type="text"
            placeholder="Enter your name or signature"
            value={signatureText}
            onChange={e => setSignatureText(e.target.value)}
          />
          <select value={font} onChange={e => setFont(e.target.value)}>
            <option value="Roboto">Roboto</option>
            <option value="Pacifico">Pacifico</option>
            <option value="Dancing Script">Dancing Script</option>
            <option value="Great Vibes">Great Vibes</option>
          </select>
        </>
      )}

      {signatureMethod === 'draw' && (
        <div>
          <canvas
            ref={canvasRef}
            width={400}
            height={150}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            style={{ border: '1px solid #ccc', backgroundColor: '#fff' }}
          />
          <button onClick={clearCanvas}>Clear</button>
        </div>
      )}

      <select value={position} onChange={e => setPosition(e.target.value)}>
        <option value="bottom-right">Bottom Right</option>
        <option value="bottom-left">Bottom Left</option>
        <option value="top-right">Top Right</option>
        <option value="top-left">Top Left</option>
      </select>

      <button onClick={handleSign}>Sign PDF</button>
      <p>{message}</p>
    </div>
  );
}

export default SignPdfPage;
