import { useQuery } from "@tanstack/react-query";
import { getCompanyData } from "../../apis/CompanyAPI";
import { CompanyFormDataInfo } from "../../types/companyData";
import { AuthPermissions } from "../../types/authData";
import Loader from "../../components/Loader";
import { useState } from "react";
import NotFoundEmpty from "../../components/NotFoundEmpty";
import { useLocation, useNavigate } from "react-router-dom";
import CreateCompany from "../../components/Company/CreateCompany";
import { Edit } from "lucide-react";
import { Dialog } from "@radix-ui/themes";
import EditCompany from "../../components/Company/EditCompany";

export default function CompanyViews({ dataAuth }: { dataAuth: AuthPermissions }) {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const modalEditCompany = queryParams.get("editCompany");
  const showEditModal = modalEditCompany ? true : false;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["company"],
    queryFn: getCompanyData,
  })

  const [openDialogEditCompany, setOpenDialogEditCompany] = useState(showEditModal)
  const [editingCompany, setEditingCompany] = useState<CompanyFormDataInfo | null>(null)

  return (
    <div className="w-full h-[90%] sm:max-w-[660px] md:max-w-[780px] lg:max-w-[960px] xl:max-w-[1000px] 2xl:max-w-[1200px] mx-auto p-4">
      {
        isLoading ?
          (
            <div className="h-full flex items-center justify-center">
              <Loader />
            </div>
          )
          :
          (
            <div className="h-full flex items-center justify-center">
              {
                data?.length ?
                  (
                    <div className="w-full md:h-[24rem] lg:h-[36rem] scrollbar-thin-custom scroll-smooth touch-pan-y overflow-scroll p-4 md:max-w-2xl mx-auto border rounded-lg border-gray-200 bg-slate-100 shadow-lg">
                      {
                        data!.map(company => (
                          <>
                            <div
                              key={company.id}
                              className="flex items-center justify-center size-40 mx-auto"
                            >
                              <img
                                className="size-full object-contain"
                                src={`${company.logotipo}`}
                                alt="Logotipo"
                              />
                            </div>

                            <div className="flex flex-col gap-y-3 items-center justify-center mt-4 md:w-[90%] mx-auto">
                              <div className="flex w-full items-center flex-col md:flex-row gap-y-4 md:gap-x-4">
                                <label className="text-base md:text-lg w-full md:w-32">Empresa:</label>
                                <input
                                  value={company.nombre_empresa}
                                  placeholder="Nombre Empresa"
                                  className="flex-1 text-sm md:text-lg border-b border-gray-300"
                                  disabled
                                />
                              </div>

                              <div className="flex w-full items-center flex-col md:flex-row gap-y-4 md:gap-x-4">
                                <label className="text-base md:text-lg w-full md:w-32">Eslogan:</label>
                                <input
                                  value={company.eslogan}
                                  placeholder="Eslogan de la empresa..."
                                  className="flex-1 text-sm md:text-lg border-b border-gray-300"
                                  disabled
                                />
                              </div>

                              <div className="flex w-full items-center flex-col md:flex-row gap-y-4 md:gap-x-4">
                                <label className="text-base md:text-lg w-full md:w-32">RUC:</label>
                                <input
                                  value={company.ruc}
                                  placeholder="RUC Empresa"
                                  className="flex-1 text-sm md:text-lg border-b border-gray-300"
                                  disabled
                                />
                              </div>

                              <div className="flex w-full items-center flex-col md:flex-row gap-y-4 md:gap-x-4">
                                <label className="text-base md:text-lg w-full md:w-32 border-none outline-none">Dirección:</label>
                                <input
                                  value={company.direccion_empresa}
                                  placeholder="Dirección Empresa"
                                  className="flex-1 text-sm md:text-lg border-b h-auto border-gray-300"
                                  disabled
                                />
                              </div>

                              <div className="flex w-full items-center flex-col md:flex-row gap-y-4 md:gap-x-4">
                                <label className="text-base md:text-lg w-full md:w-32">Teléfono:</label>
                                <input
                                  value={company.telefono_empresa}
                                  placeholder="Teléfono Empresa"
                                  className="flex-1 text-sm md:text-lg border-b border-gray-300"
                                  disabled
                                />
                              </div>

                              <div className="flex w-full items-center flex-col md:flex-row gap-y-4 md:gap-x-4">
                                <label className="text-base md:text-lg w-full md:w-32">Celular:</label>
                                <input
                                  value={company.celular_empresa}
                                  placeholder="Celular Empresa"
                                  className="flex-1 text-sm md:text-lg border-b border-gray-300"
                                  disabled
                                />
                              </div>

                              <div className="flex w-full items-center flex-col md:flex-row gap-y-4 md:gap-x-4">
                                <label className="text-base md:text-lg w-full md:w-32">Correo:</label>
                                <input
                                  value={company.correo_empresa}
                                  placeholder="Correo Empresa"
                                  className="flex-1 text-sm md:text-lg border-b border-gray-300"
                                  disabled
                                />
                              </div>
                            </div>
                            <div className="mt-10 flex items-center justify-center flex-col md:flex-row md:gap-x-6 gap-y-6">
                              <button
                                type="button"
                                className="w-full md:w-auto border border-gray-400 bg-gray-50 hover:bg-gray-100 duration-300 transition-all py-1 px-2 rounded-md flex ite justify-center gap-x-3"
                                onClick={() => {
                                  setEditingCompany(company)
                                  setOpenDialogEditCompany(!openDialogEditCompany)
                                  refetch()

                                  if (openDialogEditCompany) {
                                    navigate(location.pathname, { replace: true })
                                    setOpenDialogEditCompany(!openDialogEditCompany)
                                    refetch()
                                  }
                                  else {
                                    navigate(location.pathname + `?editCompany=${company.id}`)
                                    refetch()
                                  }
                                }}
                              >
                                <Edit className="size-5" />
                                Modificar datos empresa
                              </button>

                              {
                                editingCompany && (
                                  <Dialog.Root open={openDialogEditCompany} onOpenChange={() => {
                                    setOpenDialogEditCompany(!openDialogEditCompany)
                                    refetch()
                                    if (openDialogEditCompany) {
                                      navigate(location.pathname, { replace: true })
                                    }
                                  }}>
                                    <EditCompany company={{ ...company, usuario_modificador: "default_value" }} onClose={() => setEditingCompany(null)} />
                                  </Dialog.Root>
                                )
                              }
                            </div>
                          </>
                        ))
                      }
                    </div>
                  )
                  :
                  (
                    <div className="h-full flex items-center justify-center flex-col">
                      <div>
                        <NotFoundEmpty />
                        <h2 className="text-xl text-center font-bold">Aún no hay información de la empresa...</h2>
                      </div>

                      {
                        dataAuth.permisos_empresa[0].guardar == 1 ?
                          (
                            <CreateCompany />
                          )
                          :
                          (null)
                      }
                    </div>
                  )
              }
            </div>
          )
      }
    </div>
  )
}