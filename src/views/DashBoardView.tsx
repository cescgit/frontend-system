import { Truck, UserCheck2 } from "lucide-react"

export default function DashBoardView() {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="h-full flex flex-col items-center justify-center w-full p-4 gap-4">
          <div className="flex items-center justify-center w-full gap-4 overflow-x-auto h-full overflow-y-auto touch-pan-y touch-pan-x scrollbar-thin-custom">
            <div className="w-72 h-36 bg-gray-200/85 border border-gray-400 shadow-md shadow-gray-400 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <UserCheck2 className="size-9 text-gray-600" />
                  <h2 className="font-bold text-lg">Clientes</h2>
                </div>
                <p>
                  Total cliente: {" "}
                  <strong className="text-lg">25</strong>                  
                </p>
                <p>
                  Ultimo cliente:
                  <br />
                  <strong className="text-lg">Alcaldía de Chichigalpa</strong>                  
                </p>
            </div>

            <div className="w-72 h-36 bg-gray-200/85 border border-gray-400 shadow-md shadow-gray-400 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <Truck className="size-9 text-gray-600" />
                  <h2 className="font-bold text-lg">Proveedors</h2>
                </div>
                <p>
                  Total proveedor: {" "}
                  <strong className="text-lg">50</strong>                  
                </p>
                <p>
                  Ultimo proveedor:
                  <br />
                  <strong className="text-lg">SINSA - Chinandega</strong>                  
                </p>
            </div>

            <div className="w-72 h-36 bg-gray-200/85 border border-gray-400 shadow-md shadow-gray-400 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <Truck className="size-9 text-gray-600" />
                  <h2 className="font-bold text-lg">Usuarios</h2>
                </div>
                <p>
                  Total usuario: {" "}
                  <strong className="text-lg">8</strong>                  
                </p>
                <p>
                  Ultimo usuarios:
                  <br />
                  <strong className="text-lg">Julio César Urroz</strong>                  
                </p>
            </div>

            <div className="w-72 h-36 bg-gray-200/85 border border-gray-400 shadow-md shadow-gray-400 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <Truck className="size-9 text-gray-600" />
                  <h2 className="font-bold text-lg">Usuarios</h2>
                </div>
                <p>
                  Total usuario: {" "}
                  <strong className="text-lg">8</strong>                  
                </p>
                <p>
                  Ultimo usuarios:
                  <br />
                  <strong className="text-lg">Julio César Urroz</strong>                  
                </p>
            </div>           
          </div>

          <div className="flex items-center justify-center w-full gap-4 overflow-x-auto h-full overflow-y-auto touch-pan-y touch-pan-x scrollbar-thin-custom">
            <div className="w-72 h-36 bg-gray-200/85 border border-gray-400 shadow-md shadow-gray-400 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <UserCheck2 className="size-9 text-gray-600" />
                  <h2 className="font-bold text-lg">Clientes</h2>
                </div>
                <p>
                  Total cliente: {" "}
                  <strong className="text-lg">25</strong>                  
                </p>
                <p>
                  Ultimo cliente:
                  <br />
                  <strong className="text-lg">Alcaldía de Chichigalpa</strong>                  
                </p>
            </div>

            <div className="w-72 h-36 bg-gray-200/85 border border-gray-400 shadow-md shadow-gray-400 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <Truck className="size-9 text-gray-600" />
                  <h2 className="font-bold text-lg">Proveedors</h2>
                </div>
                <p>
                  Total proveedor: {" "}
                  <strong className="text-lg">50</strong>                  
                </p>
                <p>
                  Ultimo proveedor:
                  <br />
                  <strong className="text-lg">SINSA - Chinandega</strong>                  
                </p>
            </div>

            <div className="w-72 h-36 bg-gray-200/85 border border-gray-400 shadow-md shadow-gray-400 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <Truck className="size-9 text-gray-600" />
                  <h2 className="font-bold text-lg">Usuarios</h2>
                </div>
                <p>
                  Total usuario: {" "}
                  <strong className="text-lg">8</strong>                  
                </p>
                <p>
                  Ultimo usuarios:
                  <br />
                  <strong className="text-lg">Julio César Urroz</strong>                  
                </p>
            </div>

            <div className="w-72 h-36 bg-gray-200/85 border border-gray-400 shadow-md shadow-gray-400 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <Truck className="size-9 text-gray-600" />
                  <h2 className="font-bold text-lg">Usuarios</h2>
                </div>
                <p>
                  Total usuario: {" "}
                  <strong className="text-lg">8</strong>                  
                </p>
                <p>
                  Ultimo usuarios:
                  <br />
                  <strong className="text-lg">Julio César Urroz</strong>                  
                </p>
            </div>           
          </div>

          <div className="h-full w-full">
            <div>Chart</div>
          </div>
      </div>
    </div>
  )
}