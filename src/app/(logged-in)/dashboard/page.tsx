import { User } from "@/bff/models/user.model";

export default function DashboardPage({ user }: { user: User }) {
  return (
    <div className='w-full min-w-0'>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.name}</p>
    </div>
  );
}
