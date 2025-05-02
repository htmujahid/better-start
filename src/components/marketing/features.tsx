import {
  Database,
  Palette,
  Settings,
  Shield,
  UserCog,
  Users,
} from 'lucide-react'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const features = [
  {
    title: "Authentication",
    description: "Secure user authentication with modern protocols and best practices",
    icon: Shield,
  },
  {
    title: "Authorization",
    description: "Fine-grained access control and permission management",
    icon: UserCog,
  },
  {
    title: "User Management",
    description: "Comprehensive user profile and account management",
    icon: Users,
  },
  {
    title: "Admin Management",
    description: "Powerful admin dashboard and system controls",
    icon: Settings,
  },
  {
    title: "CRUD Operations",
    description: "Complete Create, Read, Update, Delete functionality",
    icon: Database,
  },
  {
    title: "Theming",
    description: "Customizable themes and styling options",
    icon: Palette,
  },
]

export function Features() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background container mx-auto">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl md:text-5xl">
              Features
            </h2>
            <p className="md:text-xl text-base">
              Everything you need to build and manage your application
            </p>
          </div>
        </div>
        <div className="mx-auto grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-full">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="mt-4">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}