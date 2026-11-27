import Logo from "@/components/Common/Logo";

export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="container-x py-12 sm:py-16 grid place-items-center">
      <div className="w-full max-w-[420px] bg-white rounded-3xl p-6 sm:p-8 border border-[#ECEEF2] shadow-[0_10px_30px_rgba(23,23,37,0.06)] space-y-5">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-block">
            <Logo width={38} height={38} />
          </div>
          <h1 className="text-2xl font-black text-[#171725] tracking-tight">{title}</h1>
          {subtitle && <p className="text-[13px] text-[#696974]">{subtitle}</p>}
        </div>

        <div className="pt-2">{children}</div>

        {/* <p className="text-[11px] text-center text-[#92929D] border-t border-[#F0F2F5] pt-4">
          By proceeding, you agree to Davai24&apos;s Terms of Service and Privacy Policy.
        </p> */}
      </div>
    </div>
  );
}
