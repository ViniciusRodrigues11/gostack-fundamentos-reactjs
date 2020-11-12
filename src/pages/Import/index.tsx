import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import filesize from 'filesize';

import { ToastContainer, toast } from 'react-toastify';
import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alertImg from '../../assets/alert.svg';
import api from '../../services/api';

import 'react-toastify/dist/ReactToastify.css';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    const data = new FormData();

    if (uploadedFiles) {
      uploadedFiles.map(file => data.append('file', file.file));
    }

    try {
      await api.post('/transactions/import', data);
      history.push('/');
    } catch (err) {
      toast.error('Ops, algo deu errado  😢', {
        position: 'top-right',
        autoClose: 1,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 1,
      });
    }
  }

  function submitFile(files: File[]): void {
    const uploadFiles = files.map(file => ({
      file,
      name: file.name,
      readableSize: filesize(file.size),
    }));

    setUploadedFiles(uploadFiles);
  }

  return (
    <>
      <Header size="small" />

      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alertImg} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
        <ToastContainer
          position="top-right"
          autoClose={1}
          hideProgressBar={false}
          newestOnTop
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Container>
    </>
  );
};

export default Import;
