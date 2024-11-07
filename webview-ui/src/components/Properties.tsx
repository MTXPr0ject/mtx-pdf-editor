import React from 'react';
import { usePdfStore } from '../store/pdfStore';

export const Properties: React.FC = () => {
  const { pdfDocument, metadata } = usePdfStore();
  const [documentInfo, setDocumentInfo] = React.useState<any>(null);

  React.useEffect(() => {
    const loadDocumentInfo = async () => {
      if (!pdfDocument) return;

      try {
        const info = await pdfDocument.getMetadata();
        setDocumentInfo(info);
      } catch (error) {
        console.error('Error loading document info:', error);
      }
    };

    loadDocumentInfo();
  }, [pdfDocument]);

  if (!documentInfo) {
    return <div className="properties-loading">Loading properties...</div>;
  }

  return (
    <div className="properties-container">
      <div className="property-group">
        <h3>Document Properties</h3>
        <table className="properties-table">
          <tbody>
            <tr>
              <td>Title</td>
              <td>{documentInfo.info?.Title || 'Untitled'}</td>
            </tr>
            <tr>
              <td>Author</td>
              <td>{documentInfo.info?.Author || 'Unknown'}</td>
            </tr>
            <tr>
              <td>Subject</td>
              <td>{documentInfo.info?.Subject || 'None'}</td>
            </tr>
            <tr>
              <td>Keywords</td>
              <td>{documentInfo.info?.Keywords || 'None'}</td>
            </tr>
            <tr>
              <td>Creation Date</td>
              <td>{documentInfo.info?.CreationDate || 'Unknown'}</td>
            </tr>
            <tr>
              <td>Modified Date</td>
              <td>{documentInfo.info?.ModDate || 'Unknown'}</td>
            </tr>
            <tr>
              <td>Number of Pages</td>
              <td>{pdfDocument?.numPages || 0}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};