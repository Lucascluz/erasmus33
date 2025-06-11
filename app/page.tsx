import { Card, CardFooter } from '@heroui/react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen">      {/* Hero Section with textured background */}
      <Card isBlurred
        className="relative w-full max-w-7xl mx-auto my-8 bg-cover bg-center bg-no-repeat min-h-[500px] hover:shadow-2xl transition-all duration-500"
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg"></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 lg:p-12 items-center h-full">
          <div className="text-center lg:text-left">
            <Image
              src="/misc/canto.png"
              alt="Decorative corner"
              width={80}
              height={80}
              className="absolute top-4 left-4 opacity-70"
            />            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
              Welcome to Guarda!
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed">
              Erasmus 33 has a decade of experience housing students from
              all over the world under the Erasmus+ Programme. We are the best
              option for an incredible stay and experience in Guarda!
            </p>
            <Image
              src="/misc/coração.png"
              alt="Heart decoration"
              width={60}
              height={60}
              className="absolute bottom-4 right-4 opacity-70"
            />
          </div>          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl border border-white/20 overflow-hidden rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group p-1">
              <Image
                src="/guarda/estatua.jpg"
                alt="Scenic view of Guarda city"
                width={300}
                height={250}
                className="rounded-lg object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
              />
            </Card>
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl border border-white/20 overflow-hidden rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group p-1">
              <Image
                src="/guarda/catedral.jpg"
                alt="Guarda Cathedral"
                width={300}
                height={250}
                className="rounded-lg object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
              />
            </Card>
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl border border-white/20 overflow-hidden rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group col-span-2 p-1">
              <Image
                src="/guarda/sé.jpg"
                alt="Sé da Guarda"
                width={300}
                height={200}
                className="rounded-lg object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
              />
            </Card>
          </div>
        </div>
      </Card>      {/* Erasmus Experience Section with folha background */}
      <Card
        className="relative w-full max-w-7xl mx-auto my-8 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/misc/olá.png')" }}
      >        {/* Content with backdrop blur overlay for better readability */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-8 lg:p-12 relative z-10">
          <Card className="bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <CardFooter className="bg-[url('/misc/faixa.png')] bg-cover bg-center bg-no-repeat p-4 rounded-lg mb-6 shadow-inner" />
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                Your Erasmus Experience Awaits!
              </h2>
            </div>
            <div className="space-y-6 text-gray-700">
              <p className="text-lg leading-relaxed font-medium">
                The Erasmus Programme offers students a unique opportunity to study abroad,
                immerse themselves in new cultures, and broaden their horizons.
                Guarda, with its rich history and vibrant student life, is an
                ideal destination for your Erasmus adventure.
              </p>
              <p className="text-lg leading-relaxed">
                Our accommodations are designed to provide a comfortable and
                welcoming home away from home, allowing you to focus on your
                studies and enjoy all that Guarda has to offer.
              </p>
              <p className="text-lg leading-relaxed">
                From cultural events to outdoor activities, you'll find plenty of
                opportunities to make lasting memories and friendships during your stay.
              </p>
            </div>
            <CardFooter className="bg-[url('/misc/faixa.png')] bg-cover bg-center bg-no-repeat p-4 rounded-lg mt-8 shadow-inner" />
          </Card>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl border border-white/20 overflow-hidden rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group p-4">
              <Image
                src="/erasmus/piquinique.jpg"
                alt="Relaxing and connecting at an Erasmus student picnic"
                width={300}
                height={250}
                className="object-cover w-full h-48 group-hover:scale-110 transition-transform duration-500"
              />
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm shadow-xl border border-white/20 overflow-hidden rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group p-4">
              <Image
                src="/erasmus/jogando-bola.jpg"
                alt="Students enjoying a friendly game of football"
                width={300}
                height={250}
                className="object-cover w-full h-48 group-hover:scale-110 transition-transform duration-500"
              />
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm shadow-xl border border-white/20 overflow-hidden rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group sm:col-span-2 p-4">
              <Image
                src="/erasmus/churrasco.jpg"
                alt="Erasmus students sharing a moment at a lively barbecue"
                width={300}
                height={250}
                className="object-cover w-full h-48 group-hover:scale-110 transition-transform duration-500"
              />
            </Card>
          </div>
        </div>
      </Card>

      {/* Discover Guarda Section with mapa background */}
      <Card
        className="relative w-full max-w-7xl mx-auto my-8 min-h-[600px] overflow-hidden"
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/misc/mapa.png')" }}
        />

        {/* Content Overlay */}
        <div className="relative z-10 m-4 p-8 lg:p-12">          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Discover Guarda
        </h2>{/* Responsive Layout: Left side images, Right side polaroids */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Other Images with Cards */}            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/95 backdrop-blur-sm shadow-xl border border-white/20 overflow-hidden rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group p-4">
                <Image
                  src="/guarda/catedral.jpg"
                  alt="Historic cathedral in Guarda"
                  width={400}
                  height={300}
                  className="rounded-t-lg object-cover w-full h-48 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Historic Cathedral</h3>
                  <p className="text-sm text-gray-600">
                    Explore the magnificent cathedral and its architectural heritage
                  </p>
                </div>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm shadow-xl border border-white/20 overflow-hidden rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group p-4">
                <Image
                  src="/guarda/lavie.jpg"
                  alt="La Vie area in Guarda"
                  width={400}
                  height={300}
                  className="rounded-t-lg object-cover w-full h-48 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Modern Amenities</h3>
                  <p className="text-sm text-gray-600">
                    Enjoy contemporary facilities and shopping areas
                  </p>
                </div>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm shadow-xl border border-white/20 overflow-hidden rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group md:col-span-2 p-4">
                <Image
                  src="/guarda/rodoviaria.png"
                  alt="Bus station in Guarda"
                  width={400}
                  height={300}
                  className="rounded-t-lg object-cover w-full h-48 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Transportation Hub</h3>
                  <p className="text-sm text-gray-600">
                    Easy access to public transportation and travel connections
                  </p>
                </div>
              </Card>
            </div>            {/* Right Side - Polaroids (half screen) */}
            <div className="flex flex-col justify-center">
              <Card className="bg-white/95 backdrop-blur-sm shadow-xl border border-white/20 overflow-hidden rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group p-4">
                <Image
                  src="/guarda/polaroids.png"
                  alt="Student life memories in Guarda"
                  width={500}
                  height={600}
                  className="rounded-lg object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                />
              </Card>
            </div>
          </div>
        </div>
      </Card>

      {/* Links Section with faixa background */}
      <Card
        className="w-full max-w-7xl mx-auto my-8 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/misc/faixa.png')" }}
      >
        <div className="bg-gradient-to-r from-blue-900/90 to-purple-900/90 rounded-lg p-8 lg:p-12">          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
          Explore More About Guarda
        </h2>          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="https://www.visitportugal.com" target="_blank" rel="noopener noreferrer">
              <Card className="bg-white/95 backdrop-blur-sm shadow-xl border border-white/20 overflow-hidden rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group cursor-pointer p-4">
                <Image
                  src="/guarda/visit-portugal.jpg"
                  alt="Visit Portugal - Official tourism website"
                  width={300}
                  height={200}
                  className="rounded-lg object-cover w-full h-48 group-hover:scale-110 transition-transform duration-500"
                />
                <p className="text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-4 font-semibold group-hover:from-yellow-500 group-hover:to-orange-500 transition-all duration-300">
                  Visit Portugal
                </p>
              </Card>
            </Link>

            <Link href="https://www.geoparkestrela.pt" target="_blank" rel="noopener noreferrer">
              <Card className="bg-white/95 backdrop-blur-sm shadow-xl border border-white/20 overflow-hidden rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group cursor-pointer p-4">
                <Image
                  src="/guarda/estrela-geopark.jpg"
                  alt="Serra da Estrela Geopark"
                  width={300}
                  height={200}
                  className="rounded-lg object-cover w-full h-48 group-hover:scale-110 transition-transform duration-500"
                />
                <p className="text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-4 font-semibold group-hover:from-yellow-500 group-hover:to-orange-500 transition-all duration-300">
                  Estrela Geopark
                </p>
              </Card>
            </Link>

            <Link href="https://www.cm-guarda.pt" target="_blank" rel="noopener noreferrer">
              <Card className="bg-white/95 backdrop-blur-sm shadow-xl border border-white/20 overflow-hidden rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group cursor-pointer p-4">
                <Image
                  src="/guarda/centro-de-turismo.jpg"
                  alt="Guarda Tourism Center"
                  width={300}
                  height={200}
                  className="rounded-lg object-cover w-full h-48 group-hover:scale-110 transition-transform duration-500"
                />
                <p className="text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-4 font-semibold group-hover:from-yellow-500 group-hover:to-orange-500 transition-all duration-300">
                  Tourism Center
                </p>
              </Card>
            </Link>

            <Link href="https://www.guarda.pt" target="_blank" rel="noopener noreferrer">
              <Card className="bg-white/95 backdrop-blur-sm shadow-xl border border-white/20 overflow-hidden rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group cursor-pointer p-4">
                <Image
                  src="/guarda/guarda.jpg"
                  alt="City of Guarda official website"
                  width={300}
                  height={200}
                  className="rounded-lg object-cover w-full h-48 group-hover:scale-110 transition-transform duration-500"
                />
                <p className="text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-4 font-semibold group-hover:from-yellow-500 group-hover:to-orange-500 transition-all duration-300">
                  City of Guarda
                </p>
              </Card>
            </Link>
          </div>
        </div>
      </Card>
    </section>
  );
}