import Image from "next/image";

export default function KabenekoHero() {
  return (
    <div className="my-8 overflow-hidden rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 ring-1 ring-sky-100">
      <div className="relative aspect-[3/1] w-full">
        <Image
          src="/images/services/kabeneko-hero.png"
          alt="中国の万里の長城を眺めるかべネコ。GFWで規制されたSNSアプリのアイコンが描かれた、かべネコVPNのイメージイラスト"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 800px"
          loading="lazy"
        />
      </div>
      <div className="px-5 py-4 sm:px-6 sm:py-5">
        <p className="text-sm font-bold text-primary-700 sm:text-base">
          中国でも繋がる、日本企業運営のVPN
        </p>
        <p className="mt-1 text-xs text-neutral-700 sm:text-sm">
          かべネコVPN — 月額¥480〜・21日間無料トライアル・クレカ不要
        </p>
      </div>
    </div>
  );
}
