import { useState } from "react"
import { FileDown } from "lucide-react"
import api from "../../../lib/axios";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal);

export default function ReportKardexByRangeDate({ startDate, endDate }: { startDate: string, endDate: string }) {
  const [isDownloading, setIsDownloading] = useState(false)

  const downloadPdf = async () => {
    try {
      // Realiza la solicitud GET para obtener el PDF
      const response = await api(`kardex/reportKardex/reportRangeDate/${startDate}/${endDate}`, {
        responseType: "blob", // Importante para manejar archivos binarios
      });

      // Crea un enlace de descarga para el archivo PDF
      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Kardex-${startDate}-${endDate}.pdf`; // Nombre del archivo a descargar
      link.click();
      setIsDownloading(false)
    } catch (error) {
      let errormessage = "";
      if (error instanceof Error) {
        errormessage = error.message;
      }

      MySwal.fire({
        position: "center",
        title: "Reporte kardex",
        icon: "error",
        html:
          <div className="flex flex-col items-center">
            <p className="text-red-500 font-bold">
              Error al descargar el archivo: "${errormessage || "Error desconocido"}
            </p>
          </div>
        ,
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  return (
    <button className="flex items-center justify-center gap-x-2 w-full bg-transparent py-1 px-2 border border-gray-400 hover:border hover:border-gray-700 rounded-md hover:bg-gray-200 outline-none" onClick={downloadPdf} disabled={isDownloading}>
      <FileDown className="size-4" />
      {
        isDownloading ?
          "Descargando..." :
          "Descargar PDF"
      }
    </button>
  )
}