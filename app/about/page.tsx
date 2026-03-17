import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="pb-32 bg-white min-h-screen">
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          <div className="w-full lg:w-1/2 aspect-square rounded-[40px] overflow-hidden shadow-2xl relative">
            <Image
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop"
              alt="Founder" fill className="object-cover"
            />
          </div>

          <div className="w-full lg:w-1/2 space-y-12">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-serif font-bold">Our Story</h1>
              <h2 className="text-3xl md:text-4xl font-serif text-royal-purple italic">Born from Passion</h2>
              <p className="text-muted-text leading-relaxed text-lg">
                Annaya Boutique was founded with a simple vision: to make every woman feel like royalty. Our journey
                began in a small studio, driven by a love for traditional Indian textiles and modern minimalist design.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-serif text-royal-purple italic">Our Vision</h2>
              <p className="text-muted-text leading-relaxed text-lg">
                We believe that luxury should be effortless and accessible. Our collections are carefully curated to
                bring you the finest fabrics, intricate hand-embroidery, and silhouettes that celebrate the modern woman.
              </p>
            </div>

            <div className="bg-lavender-bg p-10 rounded-[40px] text-center border border-royal-purple/5">
              <h3 className="text-2xl font-serif font-bold mb-4">The Annaya Promise</h3>
              <p className="text-base text-muted-text italic">
                &ldquo;Quality is not an act, it is a habit. We promise to deliver nothing but the best for your special moments.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
