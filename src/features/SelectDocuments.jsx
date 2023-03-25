import React from 'react';
import StyledDialog from '../components/elements/Modal/Dialog';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../components/elements/Table';
import Button from '../components/elements/Button';
import { NEUTRAL, POSITIVE } from '../components/elements/Button/Button';

import Axios from '../service/axios';

export const SelectDocumentsModal = ({
  isOpen,
  onAddDocument,
  onRemoveDocument,
  onClose,
  documents,
  selectedDocuments,
}) => (
  <StyledDialog isOpen={isOpen} onClose={() => onClose()}>
    <div className="w-[500px] max-h-[500px] p-10 flex flex-col gap-8">
      <h3>Select Documents for Download</h3>
      <p className="text-[1.6rem]">Please select or de-select documents here for download.</p>
      <SelectDocuments
        onAddDocument={onAddDocument}
        onRemoveDocument={onRemoveDocument}
        documents={documents}
        selectedDocuments={selectedDocuments}
      />
      {/* TODO this button needs to hit the API onClick */}
      <div className="p-10 flex flex-row justify-center gap-8">
        <Button
          type="button"
          colorClass={NEUTRAL}
          className="px-4 py-2 self-center"
          onClick={() => onClose()}
        >
          Close
        </Button>
      </div>
    </div>
  </StyledDialog>
);

// sends Axios req
const handleDownload = (document) => {
  const documentPk = document.documents[0];
  console.log(`documentPk passed into SelectDocuments onClick`);
  console.log(documentPk);
  /*
  const handleGet = async () => {
    const petitionId = docs.pk;
    // petition: builder.query({
    //   query: ({ petitionId }) => ({ url: `/petitions/${petitionId}/`, method: 'GET' }),
    //   providesTags: (_result, _err, { petitionId }) => [{ type: 'Petition', id: petitionId }],
    // }),
    // need to pass in list of documents I want to download
    // petition/api/petitions/<pk>/generate_petition_pdf or something like that
    // needs list of document pks'
    try {
      const { data } = await Axios.get(`/petitions/${petitionId}/`, {
        responseType: 'arraybuffer',
      });
      console.log(data);
      downloadPdf(data, 'filenameLOL.pdf');
    } catch (err) {
      console.log(err);
    }
  };

  const downloadPdf = (pdf, filename) => {
    const pdfBlob = new Blob([pdf], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      link.remove();
    });
  };
  */
};
const SelectDocuments = ({ onAddDocument, onRemoveDocument, documents, selectedDocuments }) => (
  <Table columnSizes="3 1fr">
    <TableHeader>
      <TableCell header />
      <TableCell header>Form</TableCell>
    </TableHeader>
    <TableBody>
      {documents.map((document) => (
        <TableRow className="flex" key={document.pk}>
          <TableCell className="flex-none">
            <input
              type="checkbox"
              className="cursor-pointer"
              checked={selectedDocuments.includes(document.pk)}
              onChange={(e) =>
                e.target.checked ? onAddDocument(document.pk) : onRemoveDocument(document.pk)
              }
            />
          </TableCell>
          <TableCell className="flex-grow">{document.form_type}</TableCell>
          <TableCell>
            <Button
              type="button"
              colorClass={POSITIVE}
              className="px-4 py-2 self-center"
              onClick={() => handleDownload(document)}
            >
              Download
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
