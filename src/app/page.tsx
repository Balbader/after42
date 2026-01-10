import { RegisterLink, LoginLink } from '@kinde-oss/kinde-auth-nextjs';

export default function Home() {
  return (
    <div>
      <div className='flex flex-col gap-2'>
        <RegisterLink>Register</RegisterLink>
        <LoginLink>Login</LoginLink>
      </div>
    </div>
  );
}
