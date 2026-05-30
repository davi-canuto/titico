import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import Navbar from "@/components/platform/Navbar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const { name, image, role } = session.user

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <Navbar userName={name} userImage={image} userRole={role} />
      {children}
    </div>
  )
}
