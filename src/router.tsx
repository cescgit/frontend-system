import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginView } from "./views/auth/LoginViews";
import { ForgotPasswordView } from "./views/auth/ForgotPasswordView";
import { ConfirmAccountView } from "./views/auth/ConfirmAccountView";
import { NewPasswordView } from "./views/auth/NewPasswordView";
import { RequestCodeView } from "./views/auth/RequestCodeView";

// * Authentication
import { AuthLayout } from "../src/layouts/AuthLayout";
import { AppLayout } from "../src/layouts/AppLayout";

// * Page not found 
import PageNotFound from "../src/components/PageNotFound";

// * All pages
import DashboardView from "./views/DashBoardView";
import UserView from "../src/views/User/UserView";
import SupplierView from "../src/views/Suppliers/SupplierView";
import CustomerView from "../src/views/Customers/CustomersView";
import BrandView from "../src/views/Brands/BrandsView";
import CategoryView from "../src/views/Categories/CategoriesView";
import ProductView from "../src/views/Products/ProductsView";
import { useAuth } from "../src/hooks/useAuth";
import TaxesView from "../src/views/Taxes/TaxesView";
import UnitOfMeasurementsView from "../src/views/UnitOfMeasurements/UnitOfMeasurementsView";
import CompanyView from "../src/views/Company/CompanyViews";
import WeightView from "../src/views/Weight/WeightView";
import BuysView from "../src/views/Buys/BuysView";
import SalesView from "../src/views/Sales/SalesView";
import InventoryView from "../src/views/Inventory/InventoryView";
import SalesQuoteView from "../src/views/SalesQuote/SalesQuoteView";
import KardexView from "../src/views/Kardex/KardexView";
import AccountingAccountView from "./views/AccountingAccount/AccountingAccountView";
import TypeAccountView from "./views/TypeAccount/TypeAccountView";
import AuxiliaryBookView from "./views/AuxiliaryBooks/AuxiliaryBooksView";
import AccountingSourceView from "./views/AccountingSources/AccountingSourceView";
import SupplierBalanceView from "./views/SupplierBalance/SupplierBalanceView";
import RemissionsView from "./views/Remissions/RemissionsView";
import SeparatedProductsView from "./views/SeparatedProducts/SeparatedProductsView";
import CustomerBalanceView from "./views/CustomerBalance/CustomerBalanceView";
import PreInvoicingView from "./views/PreInvoicing/PreInvoicingView";

export default function Router() {
  const { dataAuth } = useAuth();

  console.log(dataAuth)

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<LoginView />} />
          <Route
            path="/auth/confirm-account"
            element={<ConfirmAccountView />}
          />
          <Route path="/auth/request-code" element={<RequestCodeView />} />
          <Route
            path="/auth/forgot-password"
            element={<ForgotPasswordView />}
          />
          <Route path="/auth/new-password" element={<NewPasswordView />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>

        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardView />} />

          {dataAuth?.usuario && (<Route path="/users" element={<UserView dataAuth={dataAuth} />} />)}                                                                            
          {dataAuth?.proveedor && (<Route path="/suppliers" element={<SupplierView dataAuth={dataAuth} />} />)}
          {dataAuth?.cliente && (<Route path="/customers" element={<CustomerView dataAuth={dataAuth} />} />)}
          {dataAuth?.marca && (<Route path="/brands" element={<BrandView dataAuth={dataAuth} />} />)}
          {dataAuth?.categoria && (<Route path="/categories" element={<CategoryView dataAuth={dataAuth} />} />)}
          {dataAuth?.producto && (<Route path="/products" element={<ProductView dataAuth={dataAuth} />} />)}                                                    
          {dataAuth?.empresa && (<Route path="/taxes" element={<TaxesView dataAuth={dataAuth} />} />)}                                                    
          {dataAuth?.empresa && (<Route path="/unitOfMeasurements" element={<UnitOfMeasurementsView dataAuth={dataAuth} />} />)}                                                              
          {dataAuth?.empresa && (<Route path="/weight" element={<WeightView dataAuth={dataAuth} />} />)}                                                              
          {dataAuth?.empresa && (<Route path="/company" element={<CompanyView dataAuth={dataAuth} />} />)}                                                              
          {dataAuth?.compra && (<Route path="/buys" element={<BuysView dataAuth={dataAuth} />} />)}      
          {dataAuth?.inventario && (<Route path="/inventory" element={<InventoryView />} />)}        
          {dataAuth?.remisiones && (<Route path="/remissions" element={<RemissionsView dataAuth={dataAuth} />} />)}        
          {dataAuth?.cotizacion_venta && (<Route path="/salesQuote" element={<SalesQuoteView dataAuth={dataAuth} />} />)}
          {dataAuth?.producto_apartado && (<Route path="/separatedProducts" element={<SeparatedProductsView dataAuth={dataAuth} />} />)}
          {dataAuth?.venta && (<Route path="/billing" element={<SalesView dataAuth={dataAuth} />} />)}                                                    
          {dataAuth?.prefacturacion && (<Route path="/preInvoicing" element={<PreInvoicingView dataAuth={dataAuth} />} />)}                                                    
          {dataAuth?.kardex && (<Route path="/kardex" element={<KardexView />} />)}
          {dataAuth?.contabilidad && (<Route path="/accountingAccount" element={<AccountingAccountView dataAuth={dataAuth} />} />)}
          {dataAuth?.contabilidad && (<Route path="/typeAccount" element={<TypeAccountView dataAuth={dataAuth} />} />)}
          {dataAuth?.contabilidad && (<Route path="/auxiliaryBooksdgerRegister" element={<AuxiliaryBookView dataAuth={dataAuth} />} />)}
          {dataAuth?.contabilidad && (<Route path="/accountingSources" element={<AccountingSourceView dataAuth={dataAuth} />} />)}
          {dataAuth?.cuenta_xpagar && (<Route path="/supplierBalance" element={<SupplierBalanceView dataAuth={dataAuth} />} />)}
          {dataAuth?.cuenta_xpagar && (<Route path="/customerBalance" element={<CustomerBalanceView dataAuth={dataAuth} />} />)}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
