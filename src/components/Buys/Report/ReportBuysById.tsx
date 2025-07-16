"use client"

import { useState } from "react"
import { FileDown } from "lucide-react"
import { BuysFormDataInfo } from "../../../types/buysData";
import api from "../../../lib/axios";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal);

export default function ReportBuysById({ buys }: { buys: BuysFormDataInfo }) {

  const [isDownloading, setIsDownloading] = useState(false)

  const downloadPdf = async () => {
    try {
      // Realiza la solicitud GET para obtener el PDF
      const response = await api(`buys/reportBuys/${buys.id}`, {
        responseType: "blob", // Importante para manejar archivos binarios
      });

      // Crea un enlace de descarga para el archivo PDF
      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Compra-${buys.numero_compra}-${buys.proveedor}.pdf`; // Nombre del archivo a descargar
      link.click();
      setIsDownloading(false)
    } catch (error) {

      let errorMessage = "";

      if(error instanceof Error) {
        errorMessage = error.message
      }

      MySwal.fire({
        position: "center",
        title: "Reporte compra",
        icon: "error",
        html:
          <div className="flex flex-col items-center">
            <p className="text-red-500 font-bold">
              Error al descargar el archivo: {errorMessage || "Error desconocido"}
            </p>
          </div>
        ,
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  return (
    <button className="flex items-center justify-center gap-x-2 w-full bg-transparent py-1 px-2 hover:border hover:border-gray-700 rounded-md hover:bg-gray-200 outline-none" onClick={downloadPdf} disabled={isDownloading}>
      <FileDown className="size-4" />
      {
        isDownloading ?
          "Descargando..." :
          "Descargar PDF"
      }
    </button>
  )
}