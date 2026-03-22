export default function BlogMuraBanner() {
  return (
    <div className="flex flex-col items-center gap-1 py-2">
      <a
        href="https://travel.blogmura.com/ranking/in?p_cid=11213381"
        target="_blank"
        rel="noopener noreferrer"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://b.blogmura.com/travel/88_31.gif"
          width={88}
          height={31}
          alt="にほんブログ村 旅行ブログへ"
          loading="lazy"
        />
      </a>
      <a
        href="https://travel.blogmura.com/ranking/in?p_cid=11213381"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-neutral-500 hover:text-primary-700"
      >
        にほんブログ村
      </a>
    </div>
  );
}
