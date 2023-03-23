import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { formatDistance } from 'date-fns';
import { Link } from 'react-router-dom';
import Axios from '../service/axios';
import { Button } from '../components/elements/Button';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../components/elements/Table';
import { Tooltip } from '../components/elements/Tooltip/Tooltip';
import { useGetUserBatchesQuery, usePetitionQuery } from '../service/api';
import useAuth from '../hooks/useAuth';

import { SelectDocumentsModal } from './SelectDocuments';

const downloadFile = (blob, filename = '') => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  if (filename) {
    link.download = filename;
  }
  link.click();
  setTimeout(() => {
    window.URL.revokeObjectURL(url);
    link.remove();
  });
};

// TODO: Rename batches to "Petition Groups"
export const ExistingPetitions = () => {
  const { user } = useAuth();
  const { data } = useGetUserBatchesQuery({ user: user.pk });

  const [isSelectDocumentsOpen, setIsSelectDocumentsOpen] = useState(false);

  // petitions = data.results[0]?.petitions ... use setState???
  // const { data: petition } = usePetitionQuery({ petitionId: petitionData.pk });
  const allDocuments = data ? [data.results[0]?.petitions] : [];
  // const allDocuments = petition ? [petition.base_document, ...(petition.attachments ?? [])] : [];
  const [selectedDocuments, setSelectedDocuments] = useState(allDocuments.map(({ pk }) => pk));

  return (
    <div className="flex flex-col">
      <h3 className="mb-2">Recent Petitions</h3>
      <p>Petitions you have recently worked on will show up here </p>
      <div className="w-full">
        <Table className="text-[1.7rem]" columnSizes="4fr 2fr 2fr 6fr">
          <TableHeader>
            <TableCell header>Label</TableCell>
            <TableCell header># Petitions</TableCell>
            <TableCell header>
              <div className="flex gap-2">
                Deletion Date
                <Tooltip
                  tooltipContent={
                    <p className="w-[300px] whitespace-normal text-black">
                      Note: Records are available for 48 hours before they need to be uploaded again
                    </p>
                  }
                  offset={[-10, 15]}
                >
                  <FontAwesomeIcon icon={faQuestionCircle} />
                </Tooltip>
              </div>
            </TableCell>
            <TableCell header />
          </TableHeader>
          <TableBody>
            {data?.results?.map((batch, i) => (
              <TableRow key={batch.pk}>
                <TableCell>{batch.label}</TableCell>
                <TableCell>
                  <Link to={`/generate/${batch.pk}`}>
                    <Button className="w-[105px]">
                      {`${batch.petitions.length} Petition${
                        batch.petitions.length === 1 ? '' : 's'
                      }`}
                    </Button>
                  </Link>
                </TableCell>
                <TableCell>
                  {formatDistance(new Date(batch.automatic_delete_date), new Date())}
                </TableCell>
                <TableCell className="flex gap-2">
                  {/* TODO onClick proc selectDocumentsModal */}
                  <Button
                    onClick={() => {
                      const petitioner = data.results[i].petitions;
                      console.log(petitioner);
                      setIsSelectDocumentsOpen(true);
                    }}
                  >
                    Download
                  </Button>
                  <Button
                    onClick={() => {
                      Axios.post(
                        `/batch/${batch.pk}/generate_advice_letter/`,
                        {},
                        {
                          responseType: 'arraybuffer',
                        }
                      ).then((adviceLetter) => {
                        const docBlob = new Blob([adviceLetter.data], {
                          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        });
                        downloadFile(docBlob, 'Advice Letter.docx');
                      });
                    }}
                  >
                    Advice Letter
                  </Button>
                  <Button
                    onClick={() => {
                      Axios.post(
                        `/batch/${batch.pk}/generate_expungable_summary/`,
                        {},
                        {
                          responseType: 'arraybuffer',
                        }
                      ).then((expungableSummary) => {
                        const docBlob = new Blob([expungableSummary.data], {
                          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        });
                        downloadFile(docBlob, 'Expungable Record Summary.docx');
                      });
                    }}
                  >
                    Record Summary
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <SelectDocumentsModal
            documents={allDocuments}
            selectedDocuments={selectedDocuments}
            onAddDocument={(newPk) => setSelectedDocuments((prevList) => [...prevList, newPk])}
            onRemoveDocument={(removePk) =>
              setSelectedDocuments((prevList) => prevList.filter((pk) => pk !== removePk))
            }
            isOpen={isSelectDocumentsOpen}
            onClose={() => setIsSelectDocumentsOpen(false)}
          />
        </Table>
      </div>
    </div>
  );
};
