import { Clock, CreditCard, Users } from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      title: "Accédez à des centaines de club",
      description:
        "Les partenariats que nous avons permettent de venir à pratiquer le sport que tu souhaites sans être membre, ni licencié",
    },
    {
      icon: <Clock className="w-8 h-8 text-green-600" />,
      title: "Réserve et paie ton créneau en 3 clics",
      description:
        "Les partenariats que nous avons permettent de venir à pratiquer le sport que tu souhaites sans être membre, ni licencié",
    },
    {
      icon: <CreditCard className="w-8 h-8 text-green-600" />,
      title: "Les mêmes prix qu'en vrai",
      description:
        "Les partenariats que nous avons permettent de venir à pratiquer le sport que tu souhaites sans être membre, ni licencié",
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Le meilleur moyen de faire du sport</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg border border-green-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
