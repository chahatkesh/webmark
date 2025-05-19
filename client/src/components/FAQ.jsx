import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";

/**
 * FAQ Component with structured data for SEO
 *
 * This component generates FAQ page content with proper schema.org markup
 * for enhanced search engine result visibility
 */
const FAQ = ({
  faqs = [],
  title = "Frequently Asked Questions",
  categoryId = "faq-general",
  structuredData = {},
  includeStructuredData = true,
}) => {
  const [faqStructuredData, setFaqStructuredData] = useState(null);

  useEffect(() => {
    if (includeStructuredData) {
      // Create schema.org FAQ structured data
      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      };

      // Merge with any additional structured data
      const finalStructuredData = {
        ...faqSchema,
        ...structuredData,
      };

      setFaqStructuredData(finalStructuredData);
    }
  }, [faqs, structuredData, includeStructuredData]);

  return (
    <section id={categoryId} className="faq-section">
      <h2>{title}</h2>

      <div className="faq-container">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <h3 id={`faq-${categoryId}-${index}`} className="faq-question">
              {faq.question}
            </h3>
            <div
              className="faq-answer"
              dangerouslySetInnerHTML={{ __html: faq.answer }}
            />
          </div>
        ))}
      </div>

      {includeStructuredData && faqStructuredData && (
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify(faqStructuredData)}
          </script>
        </Helmet>
      )}
    </section>
  );
};

FAQ.propTypes = {
  faqs: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string.isRequired,
      answer: PropTypes.string.isRequired,
    })
  ).isRequired,
  title: PropTypes.string,
  categoryId: PropTypes.string,
  structuredData: PropTypes.object,
  includeStructuredData: PropTypes.bool,
};

export default FAQ;
