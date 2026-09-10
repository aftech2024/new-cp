import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import ImageReveal, { isMotif, type Motif } from "./ImageReveal";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { useLanguage } from "@/i18n/LanguageContext";

interface GalleryItem {
  image: string;
  caption?: string;
}

function Tile({ item, title, index, className }: { item: GalleryItem; title: string; index: number; className: string }) {
  const label = item.caption ?? `${title} — ${index + 1}`;

  return (
    <motion.figure variants={staggerItem} className={`group relative overflow-hidden rounded-sm ${className}`}>
      {isMotif(item.image) ? (
        <ImageReveal motif={item.image as Motif} ratio="square" label={label} className="h-full" />
      ) : (
        <>
          <img
            src={item.image}
            alt={label}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-premium group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deep-navy/80 via-deep-navy/0 to-deep-navy/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {item.caption && (
            <figcaption className="absolute bottom-3 left-3 right-3 text-xs font-medium text-white opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              {item.caption}
            </figcaption>
          )}
        </>
      )}
    </motion.figure>
  );
}

const VISIBLE_COUNT = 5;

export default function Gallery({ items, title }: { items: GalleryItem[]; title: string }) {
  const { t, lang } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  const [hero, ...rest] = items;
  if (!hero) return null;

  const overflow = items.slice(VISIBLE_COUNT);
  const hasMore = overflow.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-3 md:h-[560px]"
      >
        <Tile item={hero} title={title} index={0} className="col-span-2 row-span-2 aspect-[4/5] md:aspect-auto" />
        {rest.slice(0, VISIBLE_COUNT - 1).map((item, i) => (
          <Tile key={i} item={item} title={title} index={i + 1} className="aspect-square md:aspect-auto" />
        ))}
      </motion.div>

      {hasMore && expanded && (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-3 gap-3"
        >
          {overflow.map((item, i) => (
            <Tile key={i} item={item} title={title} index={VISIBLE_COUNT + i} className="aspect-square" />
          ))}
        </motion.div>
      )}

      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="group inline-flex items-center gap-2 self-start rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold hover:border-aftech-teal transition-colors"
        >
          {expanded ? (
            <>
              <Minus className="h-4 w-4" />
              {t("gal.fewer")}
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              {t("gal.load")} {overflow.length} {lang === "id" ? t("gal.photoMany") : overflow.length > 1 ? t("gal.photoMany") : t("gal.photoOne")}
            </>
          )}
        </button>
      )}
    </div>
  );
}
