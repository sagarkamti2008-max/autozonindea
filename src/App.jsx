import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { VehicleModal } from './components/VehicleModal';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AIPartFinderModal } from './components/AIPartFinderModal';
import { SlideOutCart } from './components/SlideOutCart';

import { CustomerHome } from './views/CustomerHome';
import { ModernAutomotiveHomepage } from './views/ModernAutomotiveHomepage';
import { ProductCatalog } from './views/ProductCatalog';
import { ProductDetailView } from './views/ProductDetailView';
import { CompareView } from './views/CompareView';
import { CarSelectView } from './views/CarSelectView';
import { CheckoutView } from './views/CheckoutView';
import { CustomerPortal } from './views/CustomerPortal';
import { CategoryView } from './views/CategoryView';
import { CategoriesMasterView } from './views/CategoriesMasterView';
import { AdminCategoryConsole } from './views/AdminCategoryConsole';
import { BrandView } from './views/BrandView';
import { BrandsMasterView } from './views/BrandsMasterView';
import { AdminBrandConsole } from './views/AdminBrandConsole';
import { ReviewView } from './views/ReviewView';
import { LoginView, SignupView } from './views/AuthPages';
import { PrivacyPolicyView, TermsView, ShippingPolicyView, ReturnPolicyView } from './views/LegalPages';
import { EnterpriseAdminConsole } from './views/EnterpriseAdminConsole';
import { AdminDashboard } from './views/AdminDashboard';
import { AdminFulfillmentManager } from './views/AdminFulfillmentManager';
import { AdminSearchAnalytics } from './views/AdminSearchAnalytics';
import { AdminSEOControlCenter } from './views/AdminSEOControlCenter';
import { AdminAIControlCenter } from './views/AdminAIControlCenter';
import { AdminAutomationsBuilder } from './views/AdminAutomationsBuilder';
import { AdminJobMonitor } from './views/AdminJobMonitor';
import { AdminDatabaseInspector } from './views/AdminDatabaseInspector';
import { AdminCatalogManager } from './views/AdminCatalogManager';
import { AdminInventoryConsole } from './views/AdminInventoryConsole';
import { AdminVehicleMasterConsole } from './views/AdminVehicleMasterConsole';
import { AdminAuditLog } from './views/AdminAuditLog';
import { AdminLogin } from './views/AdminLogin';
import { SellerPortal } from './views/SellerPortal';
import { GaragePortal } from './views/GaragePortal';
import { ManufacturerPortal } from './views/ManufacturerPortal';
import { DistributorPortal } from './views/DistributorPortal';
import { BlogView, FAQView, ContactView, OffersView } from './views/InfoPages';
import { CarsLandingView } from './views/CarsLandingView';
import { CarDetailView } from './views/CarDetailView';
import { AutoTechAcademyView } from './views/AutoTechAcademyView';
import { AcademyArticleView } from './views/AcademyArticleView';
import { AboutView } from './views/AboutView';

import { AdminReturnsManager } from './views/AdminReturnsManager';
import { AdminWarrantyManager } from './views/AdminWarrantyManager';
import { AdminPaymentConsole } from './views/AdminPaymentConsole';
import { AdminSupportConsole } from './views/AdminSupportConsole';
import AdminReviewConsole from './views/AdminReviewConsole';
import AdminProductQuestionsConsole from './views/AdminProductQuestionsConsole';
import AdminCouponConsole from './views/AdminCouponConsole';
import AdminPromotionsConsole from './views/AdminPromotionsConsole';
import { AdminNotificationConsole } from './views/AdminNotificationConsole';
import { AdminWhatsAppConsole } from './views/AdminWhatsAppConsole';
import { AdminShippingConsole } from './views/AdminShippingConsole';
import { OrderConfirmView } from './views/OrderConfirmView';
import { OrderTrackingView } from './views/OrderTrackingView';
import { SupportCenterView } from './views/SupportCenterView';

import { ModernCartAndCheckoutView } from './views/ModernCartAndCheckoutView';
import { MyGarageView } from './views/MyGarageView';
import { ServiceBookingView } from './views/ServiceBookingView';
import { DeliveryStatusView } from './views/DeliveryStatusView';
import { PrimeLoyaltyView } from './views/PrimeLoyaltyView';
import { DIYGuidesView } from './views/DIYGuidesView';
import { EmergencySupportView } from './views/EmergencySupportView';
import CustomerInvoiceView from './views/CustomerInvoiceView';
import AdminInvoiceConsole from './views/AdminInvoiceConsole';
import CustomerOrderTrackingView from './views/CustomerOrderTrackingView';
import PublicTrackOrderView from './views/PublicTrackOrderView';
import PincodeDeliveryChecker from './components/PincodeDeliveryChecker';
import SearchResultsView from './views/SearchResultsView';
import FindPartsForMyCarView from './views/FindPartsForMyCarView';
import WishlistView from './views/WishlistView';
import BuyNowView from './views/BuyNowView';
import PartsListView from './views/PartsListView';
import CustomerAccountReviewsView from './views/CustomerAccountReviewsView';
import WriteReviewView from './views/WriteReviewView';
import CustomerEnquiryView from './views/CustomerEnquiryView';
import BulkEnquiryView from './views/BulkEnquiryView';
import CustomerQuotationView from './views/CustomerQuotationView';
import AdminEnquiryConsole from './views/AdminEnquiryConsole';
import AdminQuotationDetailConsole from './views/AdminQuotationDetailConsole';
import AdminLeadConsole from './views/AdminLeadConsole';
import AdminFollowUpConsole from './views/AdminFollowUpConsole';
import AdminLeadAnalyticsView from './views/AdminLeadAnalyticsView';
import AdminBulkImportView from './views/AdminBulkImportView';
import AdminImportHistoryView from './views/AdminImportHistoryView';
import AdminCatalogQualityView from './views/AdminCatalogQualityView';
import AdminBulkEditView from './views/AdminBulkEditView';
import AdminBulkPriceUpdateView from './views/AdminBulkPriceUpdateView';
import AdminBulkStockUpdateView from './views/AdminBulkStockUpdateView';
import CustomerReturnsView from './views/CustomerReturnsView';
import CustomerReturnDetailView from './views/CustomerReturnDetailView';
import AdminReturnsConsole from './views/AdminReturnsConsole';
import AdminReturnDetailConsole from './views/AdminReturnDetailConsole';
import AdminReturnInspectionView from './views/AdminReturnInspectionView';
import AdminReturnSettingsView from './views/AdminReturnSettingsView';
import AdminReturnsAnalyticsView from './views/AdminReturnsAnalyticsView';
import CustomerFeedbackView from './views/CustomerFeedbackView';
import AdminReviewReportsConsole from './views/AdminReviewReportsConsole';
import AdminFeedbackConsole from './views/AdminFeedbackConsole';
import AdminReviewAnalyticsView from './views/AdminReviewAnalyticsView';
import AdminProductFeedbackView from './views/AdminProductFeedbackView';
import { PublicCmsPageView } from './views/PublicCmsPageView';
import { BlogListingView } from './views/BlogListingView';
import { BlogPostDetailView } from './views/BlogPostDetailView';
import { PublicFaqView } from './views/PublicFaqView';
import { VehicleLandingPageView } from './views/VehicleLandingPageView';
import { CategoryVehicleLandingPageView } from './views/CategoryVehicleLandingPageView';
import { CustomerNotificationsView } from './views/CustomerNotificationsView';
import { AdminMarketingConsole } from './views/AdminMarketingConsole';
import { AIPartsAssistantView } from './views/AIPartsAssistantView';
import { CustomerTicketDetailView } from './views/CustomerTicketDetailView';
import { AdminSupportHub } from './views/AdminSupportHub';
import { SitemapView } from './views/SitemapView';

const ViewRenderer = () => {
  const { currentView, currentRole, navigateTo, products, activeProductId } = useStore();

  switch (currentView) {
    case 'sitemap':
    case 'site-map':
      return <SitemapView />;
    case 'home':
      return <ModernAutomotiveHomepage />;
    case 'buy-now':
      return <BuyNowView />;
    case 'classic-home':
      return <CustomerHome />;
    case 'catalog':
      return <ProductCatalog />;
    case 'category':
      return <CategoryView />;
    case 'categories':
    case 'all-categories':
      return <CategoriesMasterView />;
    case 'admin-categories':
    case 'category-master':
      return <AdminCategoryConsole />;
    case 'brand':
      return <BrandView />;
    case 'brands':
    case 'all-brands':
      return <BrandsMasterView />;
    case 'admin-brands':
    case 'brand-master':
      return <AdminBrandConsole />;
    case 'vehicle':
      return <VehicleView />;
    case 'car-select':
      return <CarSelectView />;
    case 'parts-list':
      return <PartsListView />;
    case 'order-confirm':
      return <OrderConfirmView />;
    case 'delivery-status':
      return <DeliveryStatusView />;
    case 'review':
      return <ReviewView />;
    case 'product-detail':
      return <ProductDetailView />;
    case 'compare':
      return <CompareView />;
    case 'wishlist':
    case 'account/wishlist':
      return <WishlistView onNavigate={navigateTo} />;
    case 'customer-reviews':
    case 'account/reviews':
      return <CustomerAccountReviewsView onNavigate={navigateTo} />;
    case 'write-review':
      return <WriteReviewView onNavigate={navigateTo} />;
    case 'cart':
      return <ModernCartAndCheckoutView initialMode="cart" />;
    case 'checkout':
      return <ModernCartAndCheckoutView initialMode="checkout" />;
    case 'my-garage':
      return <MyGarageView />;
    case 'service-booking':
      return <ServiceBookingView />;
    case 'prime':
    case 'loyalty':
      return <PrimeLoyaltyView />;
    case 'diy-guides':
    case 'tutorials':
      return <DIYGuidesView />;
    case 'breakdown':
    case 'emergency-rsa':
    case 'rsa':
      return <EmergencySupportView />;
    case 'login':
      return <LoginView />;
    case 'signup':
      return <SignupView />;
    case 'admin-login':
      return <AdminLogin />;
    case 'my-account':
    case 'orders':
    case 'returns':
    case 'warranty':
    case 'payments':
    case 'notifications':
    case 'addresses':
      return <CustomerPortal />;
    case 'coupons':
    case 'admin-coupons':
    case 'admin/coupons':
    case 'admin/coupons/analytics':
      return <AdminCouponConsole />;
    case 'admin-promotions':
    case 'admin/promotions':
      return <AdminPromotionsConsole />;
    case 'track-order':
      return <OrderTrackingView />;
    case 'support':
    case 'about':
      return <AboutView />;
    case 'cars':
      return <CarsLandingView />;
    case 'car-detail':
      return <CarDetailView />;
    case 'academy':
      return <AutoTechAcademyView />;
    case 'academy-detail':
      return <AcademyArticleView />;
    case 'contact':
    case 'help':
      return <SupportCenterView />;
    case 'faq':
    case 'public-faq':
      return <PublicFaqView />;
    case 'blog-listing':
      return <BlogListingView />;
    case 'blog-category': {
      const parts = window.location.pathname.split('/');
      const slug = parts[parts.length - 1] || 'all';
      return <BlogListingView categorySlug={slug} />;
    }
    case 'blog-search': {
      const urlParams = new URLSearchParams(window.location.search);
      const q = urlParams.get('q') || '';
      return <BlogListingView initialQuery={q} />;
    }
    case 'blog-detail': {
      const parts = window.location.pathname.split('/');
      const slug = parts[parts.length - 1];
      return <BlogPostDetailView slug={slug} />;
    }
    case 'public-cms-page': {
      const parts = window.location.pathname.split('/');
      const slug = parts[parts.length - 1];
      return <PublicCmsPageView slug={slug} />;
    }
    case 'vehicle-landing': {
      const parts = window.location.pathname.split('/');
      const slug = parts[parts.length - 1];
      return <VehicleLandingPageView vehicleSlug={slug} />;
    }
    case 'category-vehicle-landing': {
      const parts = window.location.pathname.split('/').filter(Boolean);
      const categorySlug = parts[1];
      const vehicleSlug = parts[2];
      return <CategoryVehicleLandingPageView categorySlug={categorySlug} vehicleSlug={vehicleSlug} />;
    }
    case 'admin':
    case 'admin-dashboard':
    case 'admin/suppliers':
    case 'admin/suppliers/new':
    case 'admin-suppliers':
    case 'admin/purchases':
    case 'admin/purchases/new':
    case 'admin-purchases':
    case 'admin/inventory/adjustments':
    case 'admin-stock-adjustments':
    case 'admin/inventory/low-stock':
    case 'admin-low-stock':
    case 'admin/inventory/history':
    case 'admin-stock-history':
    case 'admin/reports/purchases':
    case 'admin/reports/inventory':
    case 'admin-purchase-reports':
    case 'admin/analytics/sales':
    case 'admin/analytics/products':
    case 'admin/analytics/customers':
    case 'admin/alerts':
    case 'admin/activity':
      return <AdminDashboard />;
    case 'admin-support':
    case 'admin-support-hub':
    case 'admin/support':
      return <AdminSupportHub />;
    case 'ai-assistant':
    case 'assistant':
      return <AIPartsAssistantView />;
    case 'customer-ticket-detail':
    case 'support-ticket-detail':
      return <CustomerTicketDetailView />;
    case 'admin-returns':
      return <AdminReturnsManager />;
    case 'customer-notifications':
    case 'account/notifications':
      return <CustomerNotificationsView />;
    case 'admin-marketing':
    case 'admin/marketing':
      return <AdminMarketingConsole />;
    case 'admin-warranty':
      return <AdminWarrantyManager />;
    case 'invoice':
    case 'customer-invoice':
      return <CustomerInvoiceView />;
    case 'admin-invoices':
    case 'admin/invoices':
      return <AdminInvoiceConsole />;
    case 'admin-payments':
      return <AdminPaymentConsole />;
    case 'admin-support':
      return <AdminSupportConsole />;
    case 'admin-reviews':
    case 'admin/reviews':
      return <AdminReviewConsole onNavigate={navigateTo} />;
    case 'admin/reviews/reports':
    case 'admin-review-reports':
      return <AdminReviewReportsConsole onNavigate={navigateTo} />;
    case 'admin/reviews/analytics':
    case 'admin-review-analytics':
      return <AdminReviewAnalyticsView onNavigate={navigateTo} />;
    case 'admin/products/feedback':
    case 'admin-product-feedback':
      return <AdminProductFeedbackView />;
    case 'admin/feedback':
    case 'admin-feedback':
      return <AdminFeedbackConsole />;
    case 'feedback':
    case 'customer-feedback':
    case 'account/feedback':
      return <CustomerFeedbackView />;
    case 'admin-product-questions':
    case 'admin/product-questions':
      return <AdminProductQuestionsConsole />;
    case 'admin-notifications':
      return <AdminNotificationConsole />;
    case 'admin-whatsapp':
      return <AdminWhatsAppConsole />;
    case 'search':
    case 'search-results':
      return <SearchResultsView />;
    case 'parts-for-my-car':
    case 'find-parts':
      return <FindPartsForMyCarView />;
    case 'account-garage':
      return <MyGarageView />;
    case 'delivery-check':
      return <div className="py-12 px-4"><PincodeDeliveryChecker /></div>;
    case 'public-tracking':
      return <PublicTrackOrderView />;
    case 'customer-order-tracking':
    case 'order-tracking':
      return <CustomerOrderTrackingView />;
    case 'admin-shipping':
    case 'admin/shipping':
      return <AdminShippingConsole />;
    case 'admin-search-analytics':
    case 'search-analytics':
      return <AdminSearchAnalytics />;
    case 'admin-ai':
      return <AdminAIControlCenter />;
    case 'automations':
      return <AdminAutomationsBuilder />;
    case 'jobs':
      return <AdminJobMonitor />;
    case 'database':
      return <AdminDatabaseInspector />;
    case 'admin-products':
    case 'admin/products':
    case 'catalog-manager':
    case 'fitment-review':
      return <AdminCatalogManager defaultTab="catalog-list" />;
    case 'admin-bulk-upload':
    case 'admin/bulk-upload':
    case 'bulk-upload':
      return <AdminCatalogManager defaultTab="csv-import" />;
    case 'fulfillment':
    case 'admin-orders':
    case 'admin/orders':
      return <AdminFulfillmentManager />;
    case 'inventory':
    case 'admin-inventory':
    case 'admin/inventory':
      return <AdminInventoryConsole />;
    case 'admin-vehicles':
    case 'vehicle-master':
    case 'admin/vehicles':
      return <AdminVehicleMasterConsole />;
    case 'audit-log':
    case 'admin-audit':
      return <AdminAuditLog />;
    case 'seo-center':
      return <AdminSEOControlCenter />;
    case 'seller-portal':
      return <SellerPortal />;
    case 'garage-portal':
      return <GaragePortal />;
    case 'manufacturer-portal':
      return <ManufacturerPortal />;
    case 'distributor-portal':
      return <DistributorPortal />;
    case 'blog':
      return <BlogView />;
    case 'faq':
      return <FAQView />;
    case 'about':
      return <AboutView />;
    case 'cars':
      return <CarsLandingView />;
    case 'car-detail':
      return <CarDetailView />;
    case 'academy':
      return <AutoTechAcademyView />;
    case 'academy-detail':
      return <AcademyArticleView />;
    case 'contact':
      return <ContactView />;
    case 'offers':
    case 'new-arrivals':
    case 'best-sellers':
    case 'oem-parts':
    case 'oes-parts':
    case 'aftermarket-parts':
      return <OffersView />;
    case 'enquiry':
    case 'customer-enquiry':
    case 'rfq': {
      const product = products.find(p => p.id === activeProductId);
      return <CustomerEnquiryView preselectedProduct={product} />;
    }
    case 'bulk-enquiry':
    case 'garage-enquiry':
    case 'b2b-quote':
      return <BulkEnquiryView />;
    case 'quotation':
    case 'view-quotation':
      return <CustomerQuotationView />;
    case 'admin/enquiries':
    case 'admin-enquiries':
      return <AdminEnquiryConsole />;
    case 'admin/quotations':
    case 'admin-quotations':
      return <AdminQuotationDetailConsole />;
    case 'admin/leads':
    case 'admin-leads':
      return <AdminLeadConsole />;
    case 'admin/followups':
    case 'admin-followups':
      return <AdminFollowUpConsole />;
    case 'admin/leads/analytics':
    case 'admin-lead-analytics':
      return <AdminLeadAnalyticsView />;
    case 'admin/products/import':
    case 'admin-bulk-import':
      return <AdminBulkImportView />;
    case 'admin/products/import/history':
    case 'admin-import-history':
      return <AdminImportHistoryView />;
    case 'admin/catalog/quality':
    case 'admin-catalog-quality':
      return <AdminCatalogQualityView />;
    case 'admin/products/bulk-edit':
    case 'admin-bulk-edit':
      return <AdminBulkEditView />;
    case 'admin/products/price-update':
    case 'admin-price-update':
      return <AdminBulkPriceUpdateView />;
    case 'admin/inventory/bulk-update':
    case 'admin-stock-update':
      return <AdminBulkStockUpdateView />;
    case 'account/returns':
    case 'customer-returns':
      return <CustomerReturnsView />;
    case 'admin/returns':
    case 'admin-returns':
      return <AdminReturnsConsole />;
    case 'admin/returns/analytics':
    case 'admin-returns-analytics':
      return <AdminReturnsAnalyticsView />;
    case 'admin/settings/returns':
    case 'admin-returns-settings':
      return <AdminReturnSettingsView />;
    case 'privacy-policy':
      return <PrivacyPolicyView />;
    case 'terms':
      return <TermsView />;
    case 'shipping-policy':
      return <ShippingPolicyView />;
    case 'return-policy':
    case 'refund-policy':
      return <ReturnPolicyView />;
    default:
      return <CustomerHome />;
  }
};

import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { SMSWhatsAppSimulatorModal } from './components/SMSWhatsAppSimulatorModal';
import { FreeToolsModal } from './components/FreeToolsModal';
import { CarPreloader } from './components/CarPreloader';
import { Bot, MessageSquare, Wrench } from 'lucide-react';

const MainApp = () => {
  const { currentView } = useStore();
  const [isAIPartFinderOpen, setIsAIPartFinderOpen] = useState(false);
  const [isSmsSimulatorOpen, setIsSmsSimulatorOpen] = useState(false);
  const [isFreeToolsOpen, setIsFreeToolsOpen] = useState(false);

  const isHomeView = currentView === 'home';
  const isAdminView = currentView.startsWith('admin') || currentView.includes('admin') || currentView === 'catalog-manager' || currentView === 'fulfillment' || currentView === 'inventory' || currentView === 'fitment-review' || currentView === 'bulk-upload';

  return (
    <div className="app-layout">
      {!isHomeView && (
        <>
          <Header 
            onOpenAIPartFinder={() => setIsAIPartFinderOpen(true)} 
            onOpenFreeTools={() => setIsFreeToolsOpen(true)}
          />
          <Navigation onOpenFreeTools={() => setIsFreeToolsOpen(true)} />
        </>
      )}

      <main className="main-content-body">
        <ViewRenderer />
      </main>

      <Footer />



      <CarPreloader duration={2200} />
      {!isAdminView && <WhatsAppFloatingButton />}

      <VehicleModal />
      <ToastContainer />
      <MobileBottomNav />
      <AIPartFinderModal isOpen={isAIPartFinderOpen} onClose={() => setIsAIPartFinderOpen(false)} />
      <SMSWhatsAppSimulatorModal isOpen={isSmsSimulatorOpen} onClose={() => setIsSmsSimulatorOpen(false)} />
      <FreeToolsModal isOpen={isFreeToolsOpen} onClose={() => setIsFreeToolsOpen(false)} />
      <SlideOutCart />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}
