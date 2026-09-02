
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs"

export default function Page() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <UserButton />
      <OrganizationSwitcher />
    </div>
  )
}
