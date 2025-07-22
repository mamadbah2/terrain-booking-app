export default function Stats() {
  const stats = [
    { number: "1500", label: "terrains partenaires", highlight: true },
    { number: "+400000", label: "joueurs", highlight: true },
    { number: "+30M FCFA", label: "", highlight: true },
    { number: "Noté 4.5 sur 5 étoiles", label: "", highlight: false },
    { number: "1500", label: "clubs partenaires", highlight: true },
    { number: "1500", label: "clubs partenaires", highlight: true },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
            À propos
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">TerrainBook, en quelques chiffres</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            L'objectif d'TerrainBook est de rendre la pratique du sport bien plus accessible et plus instantané en
            facilitant la mise en relation entre les sportifs et les infrastructures sportives. Plus de 95% des joueurs
            de sport se réjouissent avec les joueurs occasionnels avec seulement 3 ou 4 clics.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div
                className={`inline-flex items-center justify-center px-4 py-2 rounded-lg ${
                  stat.highlight ? "bg-green-100 border border-green-300" : "bg-gray-100"
                }`}
              >
                <span className={`font-bold text-lg ${stat.highlight ? "text-green-800" : "text-gray-800"}`}>
                  {stat.number}
                </span>
              </div>
              {stat.label && <p className="text-sm text-gray-600 mt-2">{stat.label}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
