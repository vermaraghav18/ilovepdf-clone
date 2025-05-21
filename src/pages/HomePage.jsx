import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ComponentStyles.css';
import BannerWithClose from './BannerWithClose';  // Import the component

function HomePage() {
  // Array of tools for dynamic rendering
  const tools = [
    { name: 'Merge PDF', path: '/merge_pdf' ,description: "Combine multiple PDFs into one.", icon: '/images/merge.pdf.png'},
    { name: 'Split PDF', path: '/split_pdf',description: "Separate PDF into individual pages.", icon: '/images/split.pdf.png'},
    { name: 'Compress PDF', path: '/compress_pdf' ,description: "Reduce PDF file size efficiently.", icon: '/images/compress.pdf.png'},
    { name: 'PDF to Word', path: '/pdf_to_word' ,description: "Convert PDF to editable Word document.", icon: '/images/pdf2word.png'},
    { name: 'Edit PDF', path: '/edit_pdf' ,description: "Combine multiple PDFs into one file with ease.", icon: '/images/editpdf.png'},
    { name: 'PDF to PowerPoint', path: '/pdf_to_powerpoint' ,description: "Combine multiple PDFs into one file with ease.", icon: '/images/pdf2powerpoint.png'},
    { name: 'PDF to Excel', path: '/pdf_to_excel' ,description: "Combine multiple PDFs into one file with ease.", icon: '/images/pdf2excel.png'},
    { name: 'Word to PDF', path: '/word_to_pdf' ,description: "Combine multiple PDFs into one file with ease.", icon: '/images/word2pdf.png'},
    { name: 'PowerPoint to PDF', path: '/powerpoint_to_pdf',description: "Combine multiple PDFs into one file with ease.", icon: '/images/powerpoint2pdf.png'},
    { name: 'Excel to PDF', path: '/excel_to_pdf',description: "Combine multiple PDFs into one file with ease.", icon: '/images/excel2pdf.png'},
    { name: 'PDF to JPG', path: '/pdf_to_jpg' ,description: "Combine multiple PDFs into one file with ease.", icon: '/images/pdf2jpg.png'},
    { name: 'JPG to PDF', path: '/jpg_to_pdf' ,description: "Combine multiple PDFs into one file with ease.", icon: '/images/jpg2pdf (2).png'},
    { name: 'Sign PDF', path: '/sign_pdf' ,description: "Combine multiple PDFs into one file with ease.", icon: '/images/signpdf.png'},
    { name: 'Watermark PDF', path: '/watermark_pdf' ,description: "Combine multiple PDFs into one file with ease.", icon: '/images/watermarkpdf.png'},
    { name: 'Rotate PDF', path: '/rotate_pdf' ,description: "Combine multiple PDFs into one file with ease.", icon: '/images/rotatepdf.png'},
    { name: 'HTML to PDF', path: '/html_to_pdf' ,description: "Combine multiple PDFs into one file with ease.", icon: '/images/html2pdf.png'},
    { name: 'Unlock PDF', path: '/unlock_pdf' ,description: "Combine multiple PDFs into one file with ease.", icon: '/images/lockunlockpdf.png'},
    { name: 'Protect PDF', path: '/protect_pdf' ,description: "Combine multiple PDFs into one file with ease.", icon: '/images/lockunlockpdf.png'},
    { name: 'Organize PDF', path: '/organize_pdf' ,description: "Combine multiple PDFs into one file with ease.", icon: '/images/organizepdf.png'},
    { name: 'Repair PDF', path: '/repair_pdf' ,description: "Combine multiple PDFs into one file with ease.", icon: '/images/repairpdf.png'},
    { name: 'Add Page Numbers', path: '/add_page_numbers' ,description: "Combine multiple PDFs into one file with ease.", icon: '/images/numberpdf.png'},
    { name: 'Scan to PDF', path: '/scan_to_pdf' ,description: "Combine multiple PDFs into one file with ease.", icon: '/images/scanpdf.png'},
    { name: 'OCR PDF', path: '/ocr_pdf' ,description: "Combine multiple PDFs into one file with ease.", icon: '/images/ocrpdf.png'},
    { name: 'Compare PDF', path: '/compare_pdf' ,description: "Combine multiple PDFs into one file with ease.", icon: '/images/comparepdf.png'},
    { name: 'Redact PDF', path: '/redact_pdf' ,description: "Combine multiple PDFs into one file with ease.", icon: '/images/redactpdf.png'},
    { name: 'Crop PDF', path: '/crop_pdf' ,description: "Combine multiple PDFs into one file with ease.", icon: '/images/croppdf.png'},
  ];
  


  // Array of ad cards for healthcare services
  const adCards = [
    {
      title: "Top-Rated Private Hospital",
      description: "Find the best private hospitals in your area.",
      buttonText: "Book Now",
      link: "https://www.nhshospital.in",
      image: "/images/nhscut.jpg",
    },
    {
      title: "Looking for a Private Hospital?",
      description: "Get expert healthcare services with ease.",
      buttonText: "Book Now",
      link: "https://www.fortishealthcare.com",
      image: "/images/fortis.png",
    },
    {
      title: "Private Healthcare at Its Best",
      description: "Explore premium healthcare services today.",
      buttonText: "Get Started",
      link: "https://www.maxhealthcare.in",
      image: "/images/max.png",
    },
    {
      title: "Private Healthcare at Its Best",
      description: "Explore premium healthcare services today.",
      buttonText: "Get Started",
      link: "https://www.shrimanhospital.com",
      image: "/images/shriman.png",
    },
    {
      title: "Emergency Healthcare Services",
      description: "Get quick healthcare services during emergencies.",
      buttonText: "Get Started",
      link: "https://www.capitolhospital.com",
      image: "/images/capitol.jpeg",
    },
  ];

  

  return (
    <div className="homepage">
       <BannerWithClose />  {/* Use the banner here */}
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-brand">
        <img src="/images/logo.image2.png"   alt="PDF ProTools Logo" className="navbar-logo" /> {/* Replace the word with the image */}
        </div>
        <div className="navbar-links">
          <Link to="/pdf_tools" className="nav-link">PDF Tools</Link>
          <Link to="/contact_us" className="nav-link">Contact Us</Link>
        </div>
      </nav>

      {/* Main Box Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-heading"> Effortless PDF <br /> Conversions at <br /> Your Fingertips</h1>
          <p className="hero-description">
            Easily convert, merge, split, and edit PDFs <br /> with ease. Fast, Secure and Reliable
          </p>
          <Link to="/tools" className="cta-button">Start Converting Now</Link>
        </div>

        <div className="hero-image">
          <img src="/images/pdf2.png" alt="Hero Section" />
        </div>
      </section>    
{/* Tool Grid With Vertical Banners Layout */}
<section className="tool-grid-with-banners">

{/* LEFT Vertical Banners */}
<aside className="vertical-banner">
  {/* NHS Banner */}
  <div className="vertical-nhs-ad">
    <img src="/images/nhscut.jpg" alt="Hospital Background" className="nhs-bg-image" />
    <div className="ad-overlay">
      <div className="nhs-logo-wrapper">
        <img src="/images/logo.c83b118.png" alt="NHS Logo" className="nhs-logo-updated" />
      </div>
      <div className="ad-content-updated">
        <h1 className="ad-heading-updated">Compassionate Care,<br />World-Class Expertise.</h1>
        <p className="ad-description-updated">NHS Hospital offers modern facilities,<br />expert doctors.</p>
        <a href="https://www.nhshospital.in/" className="ad-button-updated">Book</a>
      </div>
      <img src="/images/doc.png" alt="Doctor" className="doctor-centered-image" />
    </div>
  </div>

  {/* Mayor School Banner */}
  <div className="vertical-mayor-ad">
    <img src="/images/mayor-building.png" alt="Mayor World School" className="mayor-bg-image" />
    <div className="mayor-ad-overlay">
      <img src="/images/mayor-logo.png" alt="Mayor World School Logo" className="mayor-logo" />
      <h1 className="mayor-heading">ADMISSIONS <span className="highlight">OPEN</span></h1>
      <p className="mayor-subtext">Where the Future Begins</p>
      <a href="https://www.mayorworld.org" className="mayor-button" target="_blank" rel="noreferrer">Apply Now</a>
    </div>
  </div>
</aside>

{/* TOOL GRID Section */}
<main className="tool-grid">
  {tools.map((tool, index) => (
    <Link to={tool.path} className="tool-card-link" key={index}>
      <div className="tool-card">
        <img src={tool.icon} alt={tool.name} className="tool-icon" />
        <span className="tool-name">{tool.name}</span>
        <p className="tool-description">{tool.description}</p>
      </div>
    </Link>
  ))}
</main>

{/* RIGHT Vertical Banners */}
<aside className="vertical-banner">
  {/* Monte Banner */}
  <div className="vertical-ad">
    <img src="/images/monte.png" alt="Monte Ad" className="right-ad-bg" />
    <div className="right-ad-overlay">
      <div className="right-ad-content">
        <h2 className="right-ad-heading">Monte Healthcare</h2>
        <p className="right-ad-description">Bringing trust and quality to your doorstep.</p>
        <a href="/your-link" className="banner-button">Learn More</a>
      </div>
    </div>
  </div>

  {/* Fortune Banner */}
  <div className="vertical-ad">
    <img src="/images/fortune.png" alt="Fortune Ad" className="right-ad-bg" />
    <div className="right-ad-overlay">
      <div className="right-ad-content">
        <h2 className="right-ad-heading">Fortune Nutrition</h2>
        <p className="right-ad-description">Healthy beginnings start with natural choices.</p>
        <a href="/your-link" className="banner-button">Learn More</a>
      </div>
    </div>
  </div>
</aside>
</section>



      {/* About Website Banner Section */}
      <section className="hospital-banner-section">
  <div className="hospital-cards-container">
    {adCards.map((card, index) => (
      <div className="hospital-card" key={index}>
        <div className="hospital-image-wrapper">
          <img src={card.image} alt={card.title} className="hospital-card-image" />
        </div>
        <div className="hospital-card-body">
          <h3>{card.title}</h3>
          <p>{card.description}</p>
          <a href={card.link} className="hospital-button" target="_blank" rel="noopener noreferrer">
            {card.buttonText}
          </a>
        </div>
      </div>
    ))}
  </div>
</section>



            <div className="about-company-banner">
      <div className="about-banner-content">
        <h2 className="about-title">About Our Company</h2>
        <p className="about-description">
          At PDF Pro Tools, we blend powerful technology with delightful simplicity. Our tools are designed to help you manage your documents effortlessly—fast, safe, and user-friendly.
        </p>
        <a href="/about" className="about-cta">Learn More</a>
      </div>

      <div className="about-banner-image">
        <img src="/images/image-Photoroom.png" alt="PDF Mascot" className="about-mascot" />
      </div>
    </div>


      {/* Download App Banner Section */}
      <section className="app-banner">
        <div className="banner-left">
          <img src="images/image3.png" alt="PDF Converter App" className="banner-image" />
        </div>
        <div className="banner-right">
          <h2>Download Our App for Effortless PDF Conversions!</h2>
          <p>Access our PDF conversion tools anytime, anywhere. Convert, Edit, and Manage PDFs on the go.</p>
          <button className="download-button">Download Now</button>
        </div>
        </section>
        
    
     

        <div className="chetak-banner">
      <img src="/images/bg (2).png" alt="Background" className="bg-image" />
      <div className="banner-content">
        <img src="/images/bajajSign.png" alt="Bajaj Logo" className="brand-logo" />

        <div className="banner-text">
          <h1 className="main-heading"><br />The Future of Electric Scooters</h1>
          <p className="subtext">
            Discover the sleek, powerful, and eco-friendly Bajaj Chetak. The perfect blend of style and sustainability.
          </p>
          <button className="learn-btn">Learn More</button>
        </div>

        <img src="/images/scotter.png" alt="Scooter" className="scooter-img" />
      </div>
    </div>


        {/* Footer Section */}
        <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img src="/images/logo.image3.png" alt="PDF ProTools" className="footer-logo-img" />
            <p>&copy; 2025 PDF ProTools. All Rights Reserved.</p>
          </div>
          
          <div className="footer-links">
            <h3 className="footer-heading">Tools</h3>
            <div className="footer-lists">
              {/* First list of tools */}
              <div className="footer-list">
                <ul>
                  <li><Link to="/merge_pdf">Merge PDF</Link></li>
                  <li><Link to="/split_pdf">Split PDF</Link></li>
                  <li><Link to="/compress_pdf">Compress PDF</Link></li>
                  <li><Link to="/pdf_to_word">PDF to Word</Link></li>
                  <li><Link to="/edit_pdf">Edit PDF</Link></li>
                  <li><Link to="/pdf_to_powerpoint">PDF to PowerPoint</Link></li>
                  <li><Link to="/pdf_to_excel">PDF to Excel</Link></li>
                  <li><Link to="/word_to_pdf">Word to PDF</Link></li>
                  <li><Link to="/powerpoint_to_pdf">PowerPoint to PDF</Link></li>
                  <li><Link to="/excel_to_pdf">Excel to PDF</Link></li>
                </ul>
              </div>

              {/* Second list of tools */}
              <div className="footer-list">
                <ul>
                  <li><Link to="/pdf_to_jpg">PDF to JPG</Link></li>
                  <li><Link to="/jpg_to_pdf">JPG to PDF</Link></li>
                  <li><Link to="/sign_pdf">Sign PDF</Link></li>
                  <li><Link to="/watermark_pdf">Watermark PDF</Link></li>
                  <li><Link to="/rotate_pdf">Rotate PDF</Link></li>
                  <li><Link to="/html_to_pdf">HTML to PDF</Link></li>
                  <li><Link to="/unlock_pdf">Unlock PDF</Link></li>
                  <li><Link to="/protect_pdf">Protect PDF</Link></li>
                  <li><Link to="/organize_pdf">Organize PDF</Link></li>
                  <li><Link to="/pdf_to_pdfa">PDF to PDF/A</Link></li>
                </ul>
              </div>

              {/* Third list of tools */}
              <div className="footer-list">
                <ul>
                  <li><Link to="/repair_pdf">Repair PDF</Link></li>
                  <li><Link to="/add_page_numbers">Add Page Numbers</Link></li>
                  <li><Link to="/scan_to_pdf">Scan to PDF</Link></li>
                  <li><Link to="/ocr_pdf">OCR PDF</Link></li>
                  <li><Link to="/compare_pdf">Compare PDF</Link></li>
                  <li><Link to="/redact_pdf">Redact PDF</Link></li>
                  <li><Link to="/crop_pdf">Crop PDF</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>

  </div>

  );
}


export default HomePage;
