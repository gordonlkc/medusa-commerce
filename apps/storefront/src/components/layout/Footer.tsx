import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  return (
    <footer className="bg-white w-full">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-[70px] xl:pt-[90px] pb-10 xl:pb-[60px]">
          <div className="flex flex-wrap xl:flex-nowrap gap-y-10 gap-x-10">
            <div className="w-full sm:w-1/2 xl:w-auto min-w-[200px]">
              <h3 className="text-[#1C274C] text-lg font-semibold mb-5">Help & Support</h3>
              <div className="flex flex-col gap-3">
                <p className="text-[#6C6F93] text-sm leading-relaxed">
                  685 Market Street, Las Vegas, LA 95820, United States
                </p>
                <p className="text-[#6C6F93] text-sm">
                  (+099) 532-786-9843
                </p>
                <p className="text-[#6C6F93] text-sm">
                  support@example.com
                </p>
              </div>
              <div className="flex gap-3 mt-5">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-[#3C50E0] hover:text-[#3C50E0]/80 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 12.204c.055 0 .111-.002.166-.006a7.52 7.52 0 0 1 5.578 2.538 7.465 7.465 0 0 1 2.56 5.34v3.903h-2.164v-3.068c0-1.023-.258-1.793-1.002-2.342a3.383 3.383 0 0 0-2.406-.838c-1.027.073-2.137.466-2.137.466s-1.23-.076-1.842-.076c-.612 0-1.17.07-1.656.205a3.45 3.45 0 0 0-1.306.585c-.42.272-.722.61-.902.993a3.39 3.39 0 0 0-.332.72c-.057.19-.09.382-.098.574v.006c-.02.418.063.838.248 1.228l.06.136-.062.128c-.446.95-.94 1.98-.94 3.03v3.896H8.168v-3.903a7.465 7.465 0 0 1 2.56-5.34 7.52 7.52 0 0 1 5.578-2.538c.055.004.111.006.166.006zm-7.252 1.274c.41 0 .748.35.748.772s-.338.772-.748.772-.748-.35-.748-.772.338-.772.748-.772z"/>
                    <path d="M17.737 21.098h-3.064v-6.25h-2.06v6.25H9.352V14.85h3.262v.918c0 .918.228 1.617 1.196 2.097l.103.072c.457.32 1.013.48 1.644.48h.18v2.08h-.18c-1.027 0-1.906-.28-2.584-.838-.678-.558-1.023-1.305-1.023-2.22v-.59h2.06v.31h-.06c.41 0 .748.35.748.772 0 .422-.338.772-.748.772-.41 0-.748-.35-.748-.772v-.082h-2.06v2.202c0 .918.345 1.69 1.023 2.248.678.558 1.557.838 2.584.838h.18c.63 0 1.187-.16 1.644-.48l.103-.072c.968-.48 1.196-1.18 1.196-2.097v-.918h1.262v6.248z"/>
                  </svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-[#3C50E0] hover:text-[#3C50E0]/80 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.7-.01-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-[#3C50E0] hover:text-[#3C50E0]/80 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-[#3C50E0] hover:text-[#3C50E0]/80 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="w-full sm:w-1/2 xl:w-auto min-w-[200px]">
              <h3 className="text-[#1C274C] text-lg font-semibold mb-5">Account</h3>
              <ul className="flex flex-col gap-2.5">
                <li>
                  <LocalizedClientLink href="/account" className="text-[#6C6F93] text-sm hover:text-[#3C50E0] transition-colors">
                    My Account
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/login" className="text-[#6C6F93] text-sm hover:text-[#3C50E0] transition-colors">
                    Login / Register
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/cart" className="text-[#6C6F93] text-sm hover:text-[#3C50E0] transition-colors">
                    Cart
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/store" className="text-[#6C6F93] text-sm hover:text-[#3C50E0] transition-colors">
                    Shop
                  </LocalizedClientLink>
                </li>
              </ul>
            </div>

            <div className="w-full sm:w-1/2 xl:w-auto min-w-[200px]">
              <h3 className="text-[#1C274C] text-lg font-semibold mb-5">Quick Link</h3>
              <ul className="flex flex-col gap-2.5">
                <li>
                  <a href="/privacy-policy" className="text-[#6C6F93] text-sm hover:text-[#3C50E0] transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/refund-policy" className="text-[#6C6F93] text-sm hover:text-[#3C50E0] transition-colors">
                    Refund Policy
                  </a>
                </li>
                <li>
                  <a href="/terms-of-use" className="text-[#6C6F93] text-sm hover:text-[#3C50E0] transition-colors">
                    Terms of Use
                  </a>
                </li>
                <li>
                  <a href="/faq" className="text-[#6C6F93] text-sm hover:text-[#3C50E0] transition-colors">
                    FAQ&apos;s
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-[#6C6F93] text-sm hover:text-[#3C50E0] transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div className="w-full sm:w-1/2 xl:w-auto min-w-[200px]">
              <h3 className="text-[#1C274C] text-lg font-semibold mb-5">Download App</h3>
              <p className="text-[#6C6F93] text-sm mb-4">Save 3% with App orders</p>
              <div className="flex flex-col gap-3">
                <a href="#" className="inline-flex items-center gap-3 px-4 py-2.5 bg-[#1C274C] text-white rounded-md hover:bg-[#1C274C]/90 transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-[10px] leading-none">Download on the</span>
                    <span className="text-sm font-semibold leading-none">App Store</span>
                  </div>
                </a>
                <a href="#" className="inline-flex items-center gap-3 px-4 py-2.5 bg-[#3C50E0] text-white rounded-md hover:bg-[#3C50E0]/90 transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 9.091l-2.702 1.567-8.134-8.001z"/>
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-[10px] leading-none">GET IT ON</span>
                    <span className="text-sm font-semibold leading-none">Google Play</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#F9FAFB] border-t border-gray-200">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-6 lg:px-8 py-10 xl:py-[60px]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-5">
            <p className="text-[#6C6F93] text-sm text-center md:text-left">
              © {new Date().getFullYear()} All rights reserved by PimjoLabs
            </p>
            <div className="flex items-center gap-4.5">
              <img src="/images/payment/payment-visa.svg" alt="Visa" className="h-6 w-auto" />
              <img src="/images/payment/payment-paypal.svg" alt="PayPal" className="h-6 w-auto" />
              <img src="/images/payment/payment-mastercard.svg" alt="MasterCard" className="h-6 w-auto" />
              <img src="/images/payment/payment-apple-pay.svg" alt="Apple Pay" className="h-6 w-auto" />
              <img src="/images/payment/payment-google-pay.svg" alt="Google Pay" className="h-6 w-auto" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}