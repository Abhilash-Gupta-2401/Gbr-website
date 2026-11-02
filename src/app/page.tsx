import React from "react";
import Image from "next/image";
import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import { MobileNavigation } from "@/components/MobileNavigation";
import { EnquiryDialog } from "@/components/EnquiryDialog";
import { SceneCanvas } from "@/components/SceneCanvas";
import { EggLifecycle } from "@/components/EggLifecycle";
import { Illustration } from "@/components/three/Illustration";
import { Icon } from "@/components/Icon";
import { faqs, features, footer, hero, stages, steps } from "@/lib/content";

/* ───────────── Small building blocks ───────────── */

function Wordmark() {
  return (
    <a href="#top" className="inline-flex" aria-label="GBR Hatcheries Pvt Ltd — home">
      <Image src="/brand/gbr-hatcheries-logo.png" alt="GBR Hatcheries Pvt Ltd" width={512} height={139} className="h-9 w-auto" />
    </a>
  );
}

/** Two-line heading: sans line + italic serif line — the reference's signature type treatment. */
function Heading({ title, italic, as: Tag = "h2", className = "", italicStyle }: { title: string; italic: string; as?: "h1" | "h2" | "h3"; className?: string; italicStyle?: React.CSSProperties }) {
  return (
    <Tag className={`font-sans font-medium tracking-tight ${className.includes("text-white") ? "" : "text-ink "}${className}`}>
      <span className="md:whitespace-nowrap">{title}</span>
      <br />
      <em className="font-serif font-normal italic" style={italicStyle}>{italic}</em>
    </Tag>
  );
}

function Tag({ icon, iconClassName = "h-3.5 w-3.5", children }: { icon: Parameters<typeof Icon>[0]["name"]; iconClassName?: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-line bg-white px-2 py-1 text-[11px] font-medium text-ink/80">
      <Icon name={icon} className={iconClassName} />
      {children}
    </span>
  );
}

function Button({ href, children, variant = "solid" }: { href: string; children: React.ReactNode; variant?: "solid" | "ghost" }) {
  return (
    <a
      href={href}
      className={
        variant === "solid"
          ? "inline-flex items-center rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand"
          : "inline-flex items-center rounded-full border border-line bg-white px-5 py-2.5 text-sm font-medium text-ink transition hover:border-ink"
      }
    >
      {children}
    </a>
  );
}

const farmerGalleryPhotos = [
  {
    src: "/farmers/backyard-poultry-farmer.jpg",
    alt: "A poultry farmer checking a backyard chicken coop",
    caption: "Backyard poultry keeping",
    position: "object-[24%_center]",
  },
  {
    src: "/farmers/poultry-farmer-at-work.jpg",
    alt: "A farmer caring for chickens inside a poultry house",
    caption: "Daily flock care",
    position: "object-[48%_center]",
  },
] as const;

function FarmerGallery() {
  const columns = [
    [farmerGalleryPhotos[0], farmerGalleryPhotos[1], farmerGalleryPhotos[0]],
    [farmerGalleryPhotos[1], farmerGalleryPhotos[0], farmerGalleryPhotos[1]],
    [farmerGalleryPhotos[0], farmerGalleryPhotos[1], farmerGalleryPhotos[0]],
  ];

  return (
    <div className="hidden md:flex md:flex-col">
      <div className="farmer-gallery mx-auto grid h-[560px] w-full max-w-[570px] grid-cols-3 gap-6 overflow-hidden" role="region" aria-label="Farmer photo gallery">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className={`farmer-gallery-column farmer-gallery-column--${columnIndex}`}>
            {[0, 1].map((copy) => (
              <div key={copy} className="farmer-gallery-set" aria-hidden={copy === 1}>
                {column.map((photo, photoIndex) => (
                  <figure key={`${photo.src}-${photoIndex}`} className="farmer-gallery-card group relative h-[240px] w-full max-w-[174px] shrink-0 overflow-hidden rounded-[20px] border border-paper/20 bg-paper/10">
                    <Image
                      src={photo.src}
                      alt={copy === 0 ? photo.alt : ""}
                      fill
                      sizes="174px"
                      className={`object-cover transition-transform duration-700 group-hover:scale-105 ${photo.position}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/5 to-transparent" />
                    <figcaption className="absolute inset-x-3 bottom-3 text-[11px] font-medium text-white sm:text-[12px]">
                      {photo.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────── Page ───────────── */

export default function Home() {
  return (
    <>
      <SceneCanvas />

      <header className="sticky top-0 z-30 border-b border-line bg-paper/85 backdrop-blur">
        <div className="frame relative flex h-16 items-center justify-between px-4 sm:px-5 md:px-8">
          <Wordmark />
          <nav className="hidden items-center gap-7 text-[13px] text-ink md:flex">
            <a href="#story" className="hover:text-ink">Our Story</a>
            <a href="#products" className="hover:text-ink">Products</a>
            <a href="#why" className="hover:text-ink">Why GBR</a>
            <a href="#faq" className="hover:text-ink">FAQ</a>
            <a href="#contact" className="hover:text-ink">Contact</a>
          </nav>
          <div className="hidden md:block">
            <Button href="#contact">Become a Partner</Button>
          </div>
          <MobileNavigation />
        </div>
      </header>

      <main id="top" className="frame border-x border-line">
        {/* ── Hero ── */}
        <section className="relative border-b border-line">
          {/* Copy: stacked in the top-left; on large screens it sits over the open corner of the diorama */}
          <div className="px-5 pt-12 md:px-12 md:pt-16 lg:pointer-events-none lg:absolute lg:inset-x-0 lg:top-0 lg:z-10">
            <div className="max-w-md lg:pointer-events-auto">
              <Heading as="h1" title={hero.title} italic={hero.titleItalic} className="text-[40px] leading-[1.02] md:text-[56px] lg:text-[48px] xl:text-[56px]" />
              <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-ink/65">{hero.body}</p>
              <div className="mt-7 flex flex-col items-start gap-3 md:flex-row md:items-stretch">
                <Button href="#contact">Partner with us</Button>
                <Button href="#story" variant="ghost">
                  Follow the journey
                </Button>
              </div>
            </div>
          </div>
          {/* The full cycle, as one isometric diorama spread across the right and lower area */}
          <Illustration scene="hero" className="mt-6 aspect-[66/42] w-full lg:mt-0" />
        </section>

        {/* ── Marquee ── */}
        <section className="flex items-center border-b border-line">
          <div className="shrink-0 border-r border-line px-5 py-5 md:px-8">
            <p className="font-serif text-3xl italic leading-none text-ink">5</p>
            <p className="mt-1 text-[9px] font-semibold uppercase leading-tight tracking-wider text-ink/70">
              stages,
              <br />
              one company
            </p>
          </div>
          <div className="marquee relative flex-1 overflow-hidden">
            <div className="marquee-track flex w-max gap-10 py-5 pl-10">
              {[...stages, ...stages].map((s, i) => (
                <span key={i} className="flex items-center gap-10 whitespace-nowrap text-lg font-medium text-ink/45">
                  {s}
                  <span className="text-brand/60">•</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Story intro ── */}
        <section id="story" className="mx-5 border-b border-line px-5 py-20 text-center md:mx-8 md:py-24">
          <Heading title="From Egg to Your" italic="Farm." className="text-[34px] leading-[1.15] md:text-[44px]" />
          <p className="mx-auto mt-4 max-w-md text-[14px] text-ink/60">Discover how GBR cares for every chick, from careful hatching to health checks and reliable delivery.</p>
        </section>

        {/* ── Alternating story grid ── */}
        {steps.map((s, i) => {
          const dark = true;
          const art = <Illustration scene={s.scene} className="h-[340px] md:h-[440px]" />;
          const text = (
            <div className="flex flex-col items-center justify-center gap-4 px-5 py-10 text-center md:px-12">
              <div>
                {dark ? (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider" style={{ color: "#F0C37E" }}>
                    <Icon name={s.icon} className="h-[18px] w-[18px]" style={s.id === "breeder" ? { fill: "#864914", stroke: "none" } : undefined} />
                    {s.tag}
                  </span>
                ) : (
                  <Tag icon={s.icon} iconClassName={s.id === "hatchery" || s.id === "feed" || s.id === "farms" || s.id === "market" ? "h-[18px] w-[18px]" : undefined}>{s.tag}</Tag>
                )}
              </div>
              <Heading as="h3" title={s.title} italic={s.italic} className={`text-[28px] leading-[40px] md:text-[34px] ${dark ? "text-white" : ""}`} italicStyle={dark ? { color: "#F0C37E" } : undefined} />
              {s.subheading && <p className={`max-w-sm text-[16px] font-medium ${dark ? "text-white/90" : "text-ink/80"}`}>{s.subheading}</p>}
              <p className={`max-w-lg text-[14px] leading-relaxed ${dark ? "text-white/70" : "text-ink/60"}`}>{s.body}</p>
              <p className={`font-mono text-[11px] tracking-wider ${dark ? "text-white/40" : "text-ink/40"}`}>0{i + 1} / 0{steps.length}</p>
            </div>
          );
          return (
            <section key={s.id} id={s.id} className="grid border-b border-line md:grid-cols-2">
              <div className={`border-line md:border-r ${i % 2 ? "md:order-2 md:border-l md:border-r-0" : ""}`}>{art}</div>
              <div className={`${i % 2 ? "md:order-1" : ""} ${dark ? "bg-ink" : ""}`}>{text}</div>
            </section>
          );
        })}

        {/* ── Products ── */}
        <section id="products" className="border-b border-line px-5 py-16 sm:py-20 md:px-8 md:py-24">
          <div className="mb-10 text-center sm:mb-12">
            <p className="mb-3 text-[12px] font-medium uppercase tracking-[0.18em] text-brand">Our Products</p>
            <h2 className="text-[30px] font-medium leading-tight tracking-tight text-ink sm:text-[36px] md:text-[42px]">Made for every stage</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {([
              { name: "Broiler Day-old Chicks", image: "/products/broiler-day-old-chicks.jpg", alt: "Day-old chicks gathered around a feeder" },
              { name: "Poultry Feed", image: "/products/poultry-feed.jpg", alt: "Chicken eating poultry feed from a trough" },
              { name: "Heritage & Specialty breed", image: "/products/heritage-specialty-breeds.jpg", alt: "A young heritage-breed chicken outdoors" },
            ]).map((product) => (
              <article key={product.name} className="overflow-hidden rounded-[24px] border border-line bg-white">
                <div className="relative h-[220px] bg-soft sm:h-[240px]">
                  <Image src={product.image} alt={product.alt} fill sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) calc(50vw - 36px), 33vw" className="object-cover" />
                </div>
                <h3 className="px-5 py-4 text-center text-[15px] font-medium text-ink sm:text-[16px]">{product.name}</h3>
              </article>
            ))}
          </div>
        </section>

        {/* ── Egg-to-hen lifecycle (scroll-scrubbed) ── */}
        <EggLifecycle />

        {/* ── Why GBR ── */}
        <section id="why" className="border-b border-line bg-ink text-paper">
          <div className="grid gap-10 px-5 py-14 sm:px-8 md:grid-cols-2 md:gap-8 md:px-12 md:py-16">
            <div>
              <div className="mb-8 text-left">
                <Heading title="Why farmers" italic="choose GBR" className="text-[34px] leading-[1.05] text-paper md:text-[44px]" />
                <p className="mt-4 max-w-sm text-[16px] text-paper/70">Quality Isn&apos;t a Step. It&apos;s Our Standard.</p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {features.map((f) => (
                  <div key={f.title} className="relative flex min-h-[112px] flex-col gap-2 overflow-hidden rounded-[18px] border border-paper/20 bg-paper/[0.03] p-3 sm:p-4">
                    <Icon name={f.icon} aria-hidden="true" className="pointer-events-none absolute -bottom-3 -right-3 h-16 w-16 text-paper opacity-[0.08]" />
                    <div className="relative z-10 flex min-w-0 items-center gap-2">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] border border-paper/30 bg-paper/75 shadow-sm backdrop-blur-md">
                        <Icon name={f.icon} className="h-5 w-5 text-ink" />
                      </span>
                      <h3 className="text-[13px] font-semibold text-paper sm:text-[14px]">{f.title}</h3>
                    </div>
                    <p className="relative z-10 text-[11px] text-paper/70 sm:text-[12px]">{f.body}</p>
                  </div>
                ))}
              </div>
            </div>
            <FarmerGallery />
          </div>
        </section>

        {/* ── Proof cards ── */}
        <section className="grid gap-4 border-b border-line px-5 pb-5 pt-[60px] md:grid-cols-3 md:px-8 md:pb-8 md:pt-[72px]">
          <div className="col-span-full mb-2 pb-[10px] text-center">
            <Heading title="Every Step Matters." italic="Every Detail Counts." className="text-[30px] leading-[1.15] md:text-[38px]" />
          </div>
          <ProofCard tag="Incubation" title="Held at 37.5 °C" italic="through every hour">
            <svg viewBox="0 0 200 80" className="h-[146px] w-full" aria-hidden>
              {[20, 40, 60].map((y) => (
                <line key={y} x1="0" x2="200" y1={y} y2={y} stroke="currentColor" strokeOpacity=".1" />
              ))}
              <path d="M0 52 C20 30 30 44 50 40 S80 41 100 40 S150 40 200 40" fill="none" stroke="var(--color-brand)" strokeWidth="2" />
              <circle cx="200" cy="40" r="4" fill="var(--color-ink)" />
            </svg>
          </ProofCard>
          <ProofCard tag="Hatch cycle" title="21-day cycle" italic="tracked day by day">
            <div className="grid grid-cols-7 gap-1.5 py-2">
              {Array.from({ length: 21 }, (_, i) => (
                <span key={i} className={`grid aspect-square place-items-center rounded-full text-[9px] ${i < 14 ? "bg-ink text-white" : i === 20 ? "bg-brand text-white" : "border border-line text-ink/50"}`}>
                  {i + 1}
                </span>
              ))}
            </div>
          </ProofCard>
          <ProofCard tag="Traceability" title="Farm to shop" italic="every batch accounted for">
            <ol className="space-y-1.5 py-1 text-[11px]">
              {["Eggs set in incubator", "Chicks placed with partner farm", "Birds delivered to outlet"].map((t, i) => (
                <li key={t} className="flex items-center gap-2 rounded-md border border-dashed border-line bg-white px-2 py-1.5 text-ink/80">
                  <span className="grid h-4 w-4 place-items-center rounded-full bg-ink text-[8px] text-white">{i + 1}</span>
                  {t}
                </li>
              ))}
              <li className="rounded-md bg-ink px-2 py-1.5 text-center text-white">Fresh on the shelf ✓</li>
            </ol>
          </ProofCard>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="grid border-b border-line md:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]">
          <div className="flex flex-col justify-between gap-10 border-line px-5 py-12 md:border-r md:px-10">
            <div>
              <Heading title="Frequently asked" italic="questions" className="text-[32px] leading-[1.05] md:text-[38px]" />
              <p className="mt-4 max-w-xs text-[13px] text-ink/60">Quick answers for farmers, retailers and partners.</p>
            </div>
            <div className="text-[13px]">
              <p className="font-semibold text-ink">Still have questions?</p>
              <p className="mt-1 text-ink/60">Our team is ready to help.</p>
              <ul className="mt-4 space-y-2 text-ink/70">
                <li className="flex items-center gap-2"><Icon name="sprout" className="h-3.5 w-3.5" /> Farmer relations</li>
                <li className="flex items-center gap-2"><Icon name="store" className="h-3.5 w-3.5" /> Sales &amp; retail</li>
                <li className="flex items-center gap-2"><Icon name="stethoscope" className="h-3.5 w-3.5" /> Veterinary team</li>
              </ul>
            </div>
          </div>
          <div className="px-5 py-8 md:px-10 md:py-12">
            {faqs.map((f, i) => (
              <details key={f.q} className="faq group border-b border-line py-4" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center gap-4 text-[14px] text-ink">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md border border-line text-[11px] group-open:border-ink group-open:bg-ink group-open:text-white">{i + 1}</span>
                  <span className="min-w-0 flex-1 break-words">{f.q}</span>
                  <span className="text-lg leading-none text-ink/50 transition group-open:rotate-45">+</span>
                </summary>
                <p className="ml-10 mt-2 max-w-xl text-[13px] leading-relaxed text-ink/60">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section id="contact" className="border-b border-line p-5 md:p-8">
          <div className="relative grid overflow-hidden rounded-2xl bg-ink md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <div className="relative z-10 flex flex-col justify-center gap-5 p-8 md:p-12">
              <h2 className="text-[30px] font-medium leading-[1.05] tracking-tight text-white md:text-[38px]">
                Ready to grow
                <br />
                <em className="font-serif font-normal italic">with GBR?</em>
              </h2>
              <p className="max-w-xs text-[13px] text-white/65">Become a partner farmer, stock our products, or simply ask a question — we&apos;d love to hear from you.</p>
              <div>
                <EnquiryDialog />
              </div>
            </div>
            <Illustration scene="cta" dark className="h-[260px] md:h-[320px]" />
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="frame border-x border-line">
        <section aria-label="Office address and map" className="grid gap-8 border-b border-line px-5 py-10 md:grid-cols-2 md:px-10">
          <div>
            <h2 className="flex items-center gap-2 text-[14px] font-semibold text-ink"><MapPin className="h-4 w-4" />Address</h2>
            <address className="mt-3 max-w-md text-[13px] not-italic leading-relaxed text-ink/60">
              Door No. 40-25-18/13, Netaji Street, Eenadu Road, Patamata Lanka, Vijayawada, Andhra Pradesh - 520015.
              <br />
              Landmark: Near Chaitanya Boys Hostel
            </address>
            <div className="mt-5 space-y-4 text-[13px]">
              <div>
                <h3 className="flex items-center gap-2 font-semibold text-ink"><Phone className="h-4 w-4" />Call Us</h3>
                <a href="tel:08662345678" className="mt-1 inline-block text-ink/60 hover:text-brand">0866-234-5678</a>
              </div>
              <div>
                <h3 className="flex items-center gap-2 font-semibold text-ink"><Mail className="h-4 w-4" />Email Us</h3>
                <a href="mailto:gbrhatcheries@gmail.com" className="mt-1 inline-block break-all text-ink/60 hover:text-brand">gbrhatcheries@gmail.com</a>
              </div>
              <div>
                <h3 className="flex items-center gap-2 font-semibold text-ink"><Clock3 className="h-4 w-4" />Business Hours</h3>
                <p className="mt-1 text-ink/60">Monday - Saturday: 6:00 AM - 8:00 PM</p>
                <p className="text-ink/60">Sunday: 7:00 AM - 2:00 PM</p>
              </div>
            </div>
          </div>
          <div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=GBR+Hatcheries+Door+No.+40-25-18%2F13%2C+Netaji+Street%2C+Eenadu+Road%2C+Patamata+Lanka%2C+Vijayawada%2C+Andhra+Pradesh+520015"
              target="_blank"
              rel="noreferrer"
              className="mb-2 inline-flex text-[13px] font-medium text-ink hover:text-brand"
            >
              Open in Maps
            </a>
            <iframe
              title="Map to GBR Hatcheries in Vijayawada"
              src="https://www.google.com/maps?q=GBR+Hatcheries%2C+Door+No.+40-25-18%2F13%2C+Netaji+Street%2C+Eenadu+Road%2C+Patamata+Lanka%2C+Vijayawada%2C+Andhra+Pradesh+520015&output=embed"
              className="h-56 w-full rounded-xl border border-line md:h-64"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>
        <div className="grid grid-cols-2 gap-8 border-b border-line px-5 py-12 md:grid-cols-4 md:px-10">
          {footer.map((col) => (
            <div key={col.title}>
              <p className="text-[12px] text-ink/45">{col.title}</p>
              <ul className="mt-3 space-y-2 text-[13px] text-ink/80">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="hover:text-brand">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="grid border-b border-line md:grid-cols-2">
          <div className="border-line px-5 py-8 md:border-r md:px-10">
            <Wordmark />
            <p className="mt-3 font-serif text-[15px] italic text-ink/60">From a single egg to every table.</p>
          </div>
          <div className="px-5 py-8 text-[13px] text-ink/60 md:px-10">Integrated poultry — breeding, hatching, feed, farming and retail — proudly supporting Indian farmers.</div>
        </div>
        <p className="px-5 py-6 text-[12px] text-ink/45 md:px-10">© GBR Hatcheries Pvt Ltd. All rights reserved.</p>
      </footer>
    </>
  );
}

function ProofCard({ tag, title, italic, children }: { tag: string; title: string; italic: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-between gap-6 rounded-xl border border-line bg-soft p-5">
      <span className="self-start rounded-md border border-line bg-white px-2 py-1 text-[11px] text-ink/70">{tag}</span>
      <div className="rounded-lg border border-line bg-white p-3 text-ink">{children}</div>
      <div>
        <p className="text-[15px] font-medium text-ink">{title}</p>
        <p className="font-serif text-[15px] italic text-ink/70">{italic}</p>
      </div>
    </div>
  );
}
