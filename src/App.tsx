import QRCode from "react-qr-code";
import axios from "axios";
import { useEffect, useState } from "react";
import "./App.scss";

function App() {
  const [qrValue, setQrValue] = useState<string>();
  const [imgUrl, setImgUrl] = useState<string>();

  useEffect(() => {
    async function fetchFiles() {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/list-files"
        );
        console.log(response.data);
      } catch (e) {
        console.log("Erro ao buscar arquivos");
      }
    }

    fetchFiles(); // <- chamada da função
  }, []); // array de dependências vazio, sempre consistente

  const handleImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event?.target.files?.[0];

    if (!file) return;

    const previeUrl = URL.createObjectURL(file);
    setImgUrl(previeUrl);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:3001/api/upload",
        formData
      );
      console.log(res);
      const { url } = res.data;
      setQrValue(url);
    } catch (error) {
      console.error("Erro ao enviar arquivo:", error);
    }
  };

  return (
    <div className="dropArea">
      <label htmlFor="mainInput">
        Selecione o arquivo
        <input
          type="file"
          className="inputFile"
          id="mainInput"
          onChange={handleImage}
        />
      </label>

      {imgUrl && qrValue && (
        <div className="fileZone">
          <img src={imgUrl} alt="Preview" className="fileImage" />
          <QRCode value={qrValue!} size={256} />
        </div>
      )}
    </div>
  );
}

export default App;
