import React from 'react';
import StyledDialog from '../components/elements/Modal/Dialog';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../components/elements/Table';
import Button from '../components/elements/Button';
import { NEUTRAL, POSITIVE } from '../components/elements/Button/Button';

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
      <div className="p-10 flex flex-row justify-end gap-8">
        <Button
          type="button"
          colorClass={POSITIVE}
          className="px-4 py-2 self-center"
          onClick={() => handleDownloadBtnClick()}
        >
          Download
        </Button>
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
// PetitionList.js/PetitionRow()/handleGenerate()
const handleDownloadBtnClick = (...props) => {};

const SelectDocuments = ({ onAddDocument, onRemoveDocument, documents, selectedDocuments }) => (
  <Table columnSizes="40px 1fr">
    <TableHeader>
      <TableCell header />
      <TableCell header>Form</TableCell>
    </TableHeader>
    <TableBody>
      {documents.map((document) => (
        <TableRow key={document.pk}>
          <TableCell>
            <input
              type="checkbox"
              className="cursor-pointer"
              checked={selectedDocuments.includes(document.pk)}
              onChange={(e) =>
                e.target.checked ? onAddDocument(document.pk) : onRemoveDocument(document.pk)
              }
            />
          </TableCell>
          <TableCell>{document.form_type}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
