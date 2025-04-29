import { UserList } from "@/components/users/user-list"

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Management</h1>
      </div>
      <UserList />
    </div>
  )
}
